class EventsController < ApplicationController
  before_action :confirm_user_logged_in, except: [:index, :show, :get_attending_companies]
  before_action :confirm_event_exists, only: [:show, :update, :destroy, :get_availabilies, :get_meetings, :get_users, :signup, :signout]

  # GET /events
  def index
    render json: {
             events: Event.all,
           }, status: :ok
  end

  # GET /events/1
  def show
    @event = Event.find(params[:id])
    render json: {
             event: @event,
           }, status: :ok
  end

  # POST /events/
  def create
    if !confirm_requester_is_admin
      return
    end
    params = event_params.to_h
    @event = Event.new(params)
    if @event.save
      render json: {
               event: @event,
             }, status: :created
    else
      render json: {
               errors: @event.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # PUT /events/1/
  def update
    @event = Event.find(params[:id])
    if !confirm_requester_is_admin
      return
    end

    ActiveRecord::Base.transaction do
      if !@event.update(event_params)
        render json: {
                 errors: @event.errors.full_messages,
               }, status: :internal_server_error
        raise ActiveRecord::RollBack
      end
      for meeting in @event.meetings
        if !(@event.start_time <= meeting.start_time and @event.end_time >= meeting.end_time)
          # If a meeting fall outside of event's time span destroy them
          if !meeting.destroy
            render json: {
                     errors: meeting.errors.full_messages,
                   }, status: :internal_server_error
            raise ActiveRecord::RollBack
          end
        end
      end
      for availability in @event.availabilities
        if !(@event.start_time <= availability.start_time and @event.end_time >= availability.end_time)
          # If an availability fall outside of event's time span destroy them
          if !availability.destroy
            render json: {
                     errors: availability.errors.full_messages,
                   }, status: :internal_server_error
            raise ActiveRecord::RollBack
          end
        end
      end
    rescue
      return
    end

    render json: {
             event: @event,
           }, status: :ok
  end

  # DELETE /events/1/
  def destroy
    if !confirm_requester_is_admin
      return
    end
    @event = Event.find(params[:id])
    if @event.destroy
      render json: {
               event: @event,
             }, status: :ok
    else
      render json: {
               errors: @event.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # GET /events/1/availabilities
  def get_availabilities
    @event = Event.find(params[:id])
    render json: {
             availabilities: @event.availabilities,
           }, status: :ok
  end

  # GET /events/1/meetings
  def get_meetings
    @event = Event.find(params[:id])
    render json: {
             meetings: @event.meetings,
           }, status: :ok
  end

  # GET /events/attending_companies/?event_title=Virtual Fair
  # GET /events/:id/attending_companies/
  def get_attending_companies
    if !params[:event_title] and !params[:id]
      render json: {
               errors: ["Neither id or event title provided"],
             }, status: :bad_request
      return
    elsif params[:event_title]
      @event = Event.find_by(title: CGI.unescape(params[:event_title]))
      if !@event
        render json: {
          errors: ["No event with title #{params[:event_title]}"],
        }, status: :not_found
        return
      end
    else
      @event = Event.find_by(id: params[:id])
      if !@event
        render json: {
          errors: ["No event with id #{params[:id]}"],
        }, status: :not_found
        return
      end
    end

    companies = Set.new
    for user in @event.users
      if user.usertype == "company representative"
        companies << user.company.id
      end
    end
    render json: {
             attending_companies: companies,
           }, status: :ok
  end

  # GET /events/1/users
  def get_users
    event = Event.find(params[:id])
    users = event.users
    if params.key?("usertype")
      users = users.select { |u| u.usertype == params["usertype"] }
    end
    render json: {
             users: users,
           }, status: :ok
  end

  # POST /events/1/signup/1
  def signup
    event = Event.find_by_id(params[:id])
    if event.registration_start_time and Time.now < event.registration_start_time
      render json: {
        errors: ["Registration has not yet open."],
      }, status: :bad_request
      return
    end
    if event.registration_end_time and Time.now > event.registration_end_time
      render json: {
        errors: ["Registration is now closed."],
      }, status: :bad_request
      return
    end
    if params[:user_id] != nil
      # Only admin can provide arbitrary user ID for event signup
      if !confirm_requester_is_admin
        return
      end
    else
      # Sign up themselves
      params[:user_id] = current_user.id
    end
    user = User.find_by_id(params[:user_id])
    if EventSignup.find_by(event: event, user: user) != nil
      render json: {
               errors: ["User #{params[:user_id]} already signed up to event #{params[:id]}"],
             }, status: :bad_request
      return
    end
    @event_signup = EventSignup.create(event: event, user: user)
    if @event_signup.save
      render json: {
               event_signup: @event_signup,
             }, status: :ok
    else
      render json: {
        errors: @event_signup.errors.full_messages,
      }, status: :internal_server_error
    end
  end

  # DELETE /events/1/signout/1
  def signout
    event = Event.find_by_id(params[:id])
    if params[:user_id] != nil
      # Only admin can provide arbitrary user ID for event signout
      if !confirm_requester_is_admin
        return
      end
    else
      # Sign out themselves
      params[:user_id] = current_user.id
    end
    user = User.find_by_id(params[:user_id])
    @event_signup = EventSignup.find_by(event: event, user: user)
    if @event_signup == nil
      render json: {
               errors: ["User #{params[:user_id]} did not sign up to event #{params[:id]}"],
             }, status: :bad_request
      return
    end
    ActiveRecord::Base.transaction do
      # Delete user owned meetings that's associated with this event
      for meeting in user.owned_meetings
        if meeting.event == event
          if !meeting.destroy
            render json: {
                     errors: meeting.errors.full_messages,
                   }, status: :internal_server_error
            raise ActiveRecord::RollBack
          end
        end
      end
      # Delete user meeting invites that's associated with this event
      for user_meeting in user.user_meetings
        if user_meeting.meeting.event == event
          if !user_meeting.destroy
            render json: {
                     errors: user_meeting.errors.full_messages,
                   }, status: :internal_server_error
            raise ActiveRecord::RollBack
          end
        end
      end
    rescue
      return
    end
    if @event_signup.destroy
      render json: {
               event_signup: @event_signup,
             }, status: :ok
    else
      render json: {
               errors: @event_signup.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time, :registration_start_time, :registration_end_time)
  end

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_event_exists
    if !Event.find_by_id(params[:id])
      render json: {
               errors: ["Event with id #{params[:id]} not found"],
             }, status: :not_found
    end
  end

  def confirm_requester_is_admin
    if current_user.usertype != "admin"
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end
end
