class UsersController < ApplicationController
  before_action :confirm_user_logged_in, except: [:new, :create, :confirm_email]
  before_action :user_exists, only: [:assigned_to_meeting?, :get_meetings, :get_attending_meetings, :get_pending_meetings, :get_owned_meetings, :add_to_meeting, :update_meeting, :delete]
  before_action :meeting_exists, only: [:assigned_to_meeting?, :add_to_meeting, :update_meeting, :delete_from_meeting]

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
        status: 500,
        errors: ["User not logged in"],
      }
    end
  end

  def user_exists
    if !User.find_by_id(params[:id])
      render json: {
        status: 500,
        errors: ["User not found"],
      }
    end
  end

  def meeting_exists
    if !Meeting.find_by_id(params[:meeting_id])
      render json: {
        status: 500,
        errors: ["Meeting not found"],
      }
    end
  end

  def index
    render json: {
             users: User.all,
           }
  end

  def show
    @user = User.find_by_id(params[:id])
    if @user
      render json: {
               user: @user,
             }
    else
      render json: {
               status: 500,
               errors: ["User not found"],
             }
    end
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
      }
    else
      render json: {
               status: 500,
               errors: ["user not found"],
             }
    end
  end

  def new
    @user = User.new
  end

  def create
    if params['user']['usertype'] == nil
      params['user']['usertype'] = 'student'
    end

    # Check for email uniqueness
    existing_user = User.find_by_email(params["user"]["email"]) # TODO 'and usertype == params[usertype]'
    if existing_user != nil # TODO once multiple users, allow email reuse for different account types (eg. I can have an admin and a student account)
      return render json: {
               status: 500,
               errors: "Email already in use",
             }
    end

    # Check that the email is allowed
    exact_match = AllowlistEmail.find_by(email: params['user']['email'].downcase, usertype: params['user']['usertype'])
    domain_match = AllowlistDomain.find_by(email_domain: params['user']['email'].downcase.split("@").last, usertype: params['user']['usertype'])
    if exact_match == nil && domain_match == nil
      return render json: {
               status: 500,
               errors: "Email not allowed",
             }
    end

    @user = User.new(user_params)
    if @user.save
      login!
      resp = UserMailer.registration_confirmation(@user).deliver_now
      if params['user']['usertype'] == "company representative"
        if exact_match != nil
          exact_match.company.users << @user
        else
          domain_match.company.users << @user
        end
      end
      logger.debug { resp }
      render json: {
               status: 201,
               user: @user,
             }
    else
      render json: {
               status: 500,
               errors: ["Something went wrong when saving the user"],
             }
    end
  end

  def confirm_email
    user = User.find_by_confirm_token(params[:id])
    if user
      user.email_activate
      render json: {
        status: 200,
      }
    else
      render json: {
               status: 500,
               errors: ["User with the provided confirmation token does not exist."],
             }
    end
  end

  # GET /users/1/meetings
  def get_meetings
    user = User.find_by_id(params[:id])
    @meetings = user.invited_meetings
    if @meetings
      render json: {
        meetings: @meetings,
      }
    else
      render json: {
        status: 500,
        errors: ["Meeting not found"],
      }
    end
  end

  # GET /users/1/meetings/attending
  def get_attending_meetings
    user = User.find_by_id(params[:id])
    @meetings = user.attending_meetings
    if @meetings
      render json: {
        meetings: @meetings,
      }
    else
      render json: {
        status: 500,
        errors: ["Meeting not found"],
      }
    end
  end

  # GET /users/1/meetings/pending
  def get_pending_meetings
    user = User.find_by_id(params[:id])
    @meetings = user.pending_meetings
    if @meetings
      render json: {
        meetings: @meetings,
      }
    else
      render json: {
        status: 500,
        errors: ["Meeting not found"],
      }
    end
  end

  # GET /users/1/meetings/owned
  def get_owned_meetings
    user = User.find_by_id(params[:id])
    @meetings = user.owned_meetings
    if @meetings
      render json: {
        meetings: @meetings,
      }
    else
      render json: {
        status: 500,
        errors: ["Meeting not found"],
      }
    end
  end

  # GET /users/1/meetings/1
  def invited_to_meeting?
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting
      render json: {
        is_invited: true,
        user_meeting: @user_meeting,
      }
    else
      render json: {
        is_invited: false,
      }
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
        status: 201,
        user_meeting: @user_meeting,
      }
    else
      render json: {
        status: 500,
        errors: ["Something went wrong while adding an user to a meeting"],
      }
    end
  end

  # PUT /users/1/meetings/1
  # Must pass "user_meeting" params
  def update_meeting
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting.update(user_meeting_params)
      render json: {
        status: 200,
        user_meeting: @user_meeting,
      }
    else
      render json: {
        status: 500,
        errors: ["Something went wrong while updating to a user's meeting registration"],
      }
    end
  end

  # DELETE /users/1/meetings/1
  def delete_from_meeting
    @user_meeting = UserMeeting.find_by(user_id: params[:id], meeting_id: params[:meeting_id])
    if @user_meeting.destroy
      render json: {
        status: 200,
      }
    else
      render json: {
        status: 500,
        errors: ["Something went wrong while deleting to a user's meeting registration"],
      }
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
