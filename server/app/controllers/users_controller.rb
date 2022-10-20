class UsersController < ApplicationController
  before_action :confirm_user_logged_in, except: [:new, :create, :confirm_email]
  before_action :confirm_user_exists, only: [:show, :assigned_to_meeting?, :get_meetings, :get_attending_meetings, :get_pending_meetings, :get_owned_meetings, :add_to_meeting, :update_meeting, :delete]
  before_action :confirm_meeting_exists, only: [:assigned_to_meeting?, :add_to_meeting, :update_meeting, :delete_from_meeting]

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_user_exists
    if !User.find_by_id(params[:id])
      render json: {
        errors: ["User with id #{params[:id]} not found"],
      }, status: :not_found
    end
  end

  def confirm_meeting_exists
    if !Meeting.find_by_id(params[:meeting_id])
      render json: {
        errors: ["Meeting with id #{params[:id]} not found"],
      }, status: :not_found
    end
  end

  def index
    render json: {
             users: User.all,
           }, status: :ok
  end

  def show
    render json: {
             user: User.find_by_id(params[:id]),
           }, status: :ok
  end

  def find
    uri = URI.parse(request.url)
    params = CGI.parse(uri.query)
    @user = nil
    if params.key?("email")
      @user = User.find_by_email(params["email"][0])
    elsif params.key?("firstname") and params.key?("lastname")
      # Use this only for testing purposes as firstname-lastname pair is not guarenteed to be unique.
      @user = User.find_by firstname: params["firstname"], lastname: params["lastname"]
    end
    if @user
      render json: {
        user: @user,
      }, status: :ok
    else
      render json: {
               errors: ["User not found with #{params}"],
             }, status: :not_found
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login!
      resp = UserMailer.registration_confirmation(@user).deliver_now
      logger.debug { resp }
      render json: {
               user: @user,
             }, status: :created
    else
      render json: {
               errors: @user.errors.full_messages,
             }, status: :bad_request
    end
  end

  def confirm_email
    user = User.find_by_confirm_token(params[:id])
    if user
      user.email_activate
      render json: {}, status: :ok
    else
      render json: {
               errors: ["User with the confirmation token #{params[:id]} does not exist."],
             }, status: :not_found
    end
  end

  # GET /users/1/meetings
  def get_meetings
    meetings = User.find_by_id(params[:id]).invited_meetings
    render json: {
      meetings: meetings,
    }, status: :ok
  end

  # GET /users/1/meetings/attending
  def get_attending_meetings
    meetings = User.find_by_id(params[:id]).attending_meetings
    render json: {
      meetings: meetings,
    }, status: :ok
  end

  # GET /users/1/meetings/pending
  def get_pending_meetings
    meetings = User.find_by_id(params[:id]).pending_meetings
    render json: {
      meetings: meetings,
    }, status: :ok
  end

  # GET /users/1/meetings/owned
  def get_owned_meetings
    meetings = User.find_by_id(params[:id]).owned_meetings
    render json: {
      meetings: meetings,
    }, status: :ok
  end

  # GET /users/1/meetings/1
  def invited_to_meeting?
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting
      render json: {
        is_invited: true,
        user_meeting: @user_meeting,
      }, status: :ok
    else
      render json: {
        is_invited: false,
      }, status: :ok
    end
  end

  # POST /users/1/meetings/1
  # Must pass "user_meeting" params
  def add_to_meeting
    user = User.find_by_id(params[:id])
    meeting = Meeting.find_by_id(params[:meeting_id])
    @user_meeting = UserMeeting.new(user_meeting_params.merge!({ user: user, meeting: meeting }))

    if @user_meeting.save
      render json: {
        user_meeting: @user_meeting,
      }, status: :ok
    else
      render json: {
        errors: @user_meeting.errors.full_messages,
      }, status: :bad_request
    end
  end

  # PUT /users/1/meetings/1
  # Must pass "user_meeting" params
  def update_meeting
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting.update(user_meeting_params)
      render json: {
        user_meeting: @user_meeting,
      }, status: :ok
    else
      render json: {
        errors: @user_meeting.errors.full_messages,
      }, status: :bad_request
    end
  end

  # DELETE /users/1/meetings/1
  def delete_from_meeting
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting.destroy
      render json: {}, status: :ok
    else
      render json: {
        errors: @user_meeting.errors.full_messages,
      }, status: :bad_request
    end
  end

  private

  def user_params
    params.require(:user).permit(:usertype, :firstname, :lastname, :email, :password, :password_confirmation)
  end

  def user_meeting_params
    params.require(:user_meeting).permit(:accepted)
  end
end
