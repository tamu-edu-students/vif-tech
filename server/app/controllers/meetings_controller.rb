class MeetingsController < ApplicationController
  before_action :confirm_user_logged_in
  before_action :confirm_meeting_exists, only: [:show, :update, :destroy]

  # GET /meetings
  def index
    render json: {
             meetings: Meeting.all,
           }, status: :ok
  end

  # GET /meetings/1
  def show
    render json: {
             meeting: Meeting.find(params[:id]),
           }, status: :ok
  end

  # POST /meetings/
  def create
    if !confirm_requester_is_admin_or_rep_or_volunteer
      return
    end
    params = meeting_params.to_h
    # If owner key is not provided, use the owner key provided by the requester
    if !params.key?("owner_id")
      params["owner_id"] = current_user.id
    end
    if params.key?("event_id") and !confirm_event_exists(params["event_id"])
      return # If event id is provided but the event doesn't exist terminate
    end

    @meeting = Meeting.new(params)
    if @meeting.save
      render json: {
               meeting: @meeting,
             }, status: :created
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # PUT /meetings/1/
  def update
    @meeting = Meeting.find(params[:id])
    if !@meeting
      render json: {
        errors: ["Meeting #{params[:id]} not found"],
      }, status: :not_found
      return
    end
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    if meeting_params.key?("event_id") and !confirm_event_exists(params["event_id"])
      return # If event id is provided but the event doesn't exist terminate
    end
    if @meeting.update(meeting_params)
      render json: {
               meeting: @meeting,
             }, status: :ok
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # DELETE /meetings/1/
  def destroy
    @meeting = Meeting.find(params[:id])
    if !@meeting
      render json: {
        errors: ["Meeting #{params[:id]} not found"],
      }, status: :not_found
      return
    end
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    if @meeting.destroy
      render json: {
               meeting: @meeting,
             }, status: :ok
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # GET /meetings/1/invitees
  def get_invitees
    @meeting = Meeting.find(params[:id])
    # Check meeting existance
    if !@meeting
      render json: {
        errors: ["Meeting #{params[:id]} not found"],
      }, status: :not_found
      return
    end
    # Check permission
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    invitees = nil
    if params.key?("status")
      # e.g. /meetings/1/invites/?status=accepted
      invitees = @meeting.invites_by_status(params["status"])
    else
      invitees = @meeting.invitees
    end
    render json: {
      invitees: invitees,
    }
  end

  # PUT /meetings/1/invitees
  def swap_invitees
    @meeting = Meeting.find(params[:id])
    # Check meeting existance
    if !@meeting
      render json: {
        errors: ["Meeting #{params[:id]} not found"],
      }, status: :not_found
      return
    end
    # Check permission
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end

    # Check params is provided
    invitees = invitee_params.to_h["invitees"]
    if !invitees
      render json: {
        errors: ['"invitees" not found in provided parameters.'],
      }, status: :bad_request
      return
    end

    to_update = []
    to_create = []
    for invitee_info in invitees
      invitee_info["user_id"] = invitee_info["user_id"].to_i
      user = User.find_by_id(invitee_info["user_id"])

      # Check if all entries in invitees are valid
      if !user
        render json: {
          errors: ["User #{invitee_info["user_id"]} not found"],
        }, status: :bad_request
        return
      end
      if !UserMeeting.valid_status.include?(invitee_info["status"])
        render json: {
                 errors: ["Status '#{invitee_info["status"]}' is not valid"],
               }, status: :bad_request
        return
      end

      # Either classify as to update / to create
      if @meeting.user_meetings.find_by(user_id: user.id) != nil
        to_update << invitee_info
      else
        to_create << invitee_info
      end
    end

    ActiveRecord::Base.transaction do
      # If user_meeting instance didn't make it to to_update array, it's deleted
      for user_meeting in @meeting.user_meetings
        if !to_update.any? { |x| x["user_id"] == user_meeting.user_id }
          if !user_meeting.destroy
            render json: {
                     errors: ["Previous user-meeting deletion failed",
                              user_meeting.errors.full_messages],
                   }, status: :bad_request
            raise ActiveRecord::RollBack # Roll back on fail
          end
        end
      end

      # Update existing user-meetings invites.
      for invitee_info in to_update
        user_meeting = @meeting.user_meetings.find_by(user_id: invitee_info["user_id"])
        if !user_meeting.update(invitee_info)
          render json: {
                   errors: user_meeting.errors.full_messages,
                 }, status: :internal_server_error
          raise ActiveRecord::RollBack # Roll back on fail
        end
      end

      # Create new user-meeting invites.
      for invitee_info in to_create
        user = User.find_by_id(invitee_info["user_id"])
        status = invitee_info["status"]
        user_meeting = UserMeeting.new({ user: user, meeting: @meeting, status: status })
        if !user_meeting.save
          render json: {
                   errors: @user_meeting.errors.full_messages,
                 }, status: :internal_server_error
          raise ActiveRecord::RollBack # Roll back on fail
        end
      end
    rescue
      return
    end

    render json: {
      user_meetings: @meeting.user_meetings,
    }, status: :ok
  end

  private

  def meeting_params
    params.require(:meeting).permit(:title, :start_time, :end_time, :owner_id, :event_id)
  end

  def invitee_params
    params.require(:meeting).permit(invitees: [:user_id, :status])
  end

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_meeting_exists
    if !Meeting.find_by_id(params[:id])
      render json: {
        errors: ["Meeting with id #{params[:id]} not found"],
      }, status: :not_found
    end
  end

  def confirm_event_exists(event_id)
    if !Event.find_by_id(event_id)
      render json: {
        errors: ["Event with id #{event_id} not found"],
      }, status: :not_found
      return false
    end
    return true
  end

  def confirm_requester_is_owner_or_admin(owner_id)
    if !(current_user.id == owner_id or current_user.usertype == "admin")
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
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

  def confirm_requester_is_admin_or_rep_or_volunteer
    if current_user.usertype != "company representative" and current_user.usertype != "volunteer" and current_user.usertype != "admin"
      render json: {
               errors: ["User should be one of the following types for requested action: admin, company representative, or volunteer", "User type: #{current_user.usertype}"],
             }, status: :forbidden
      return false
    end
    return true
  end
end
