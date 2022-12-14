class UsersController < ApplicationController
  before_action :confirm_user_logged_in, except: [:new, :create, :confirm_email]
  before_action :confirm_user_exists, only: [:show, :assigned_to_meeting?, :get_meetings, :get_accepted_meetings, :get_pending_meetings,
                                             :get_owned_meetings, :add_to_meeting, :update_meeting, :update]
  before_action :confirm_meeting_exists, only: [:assigned_to_meeting?, :add_to_meeting, :update_meeting, :delete_from_meeting]

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
      @user = User.where.like(email: params["email"][0]).first
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
    if params["user"]["usertype"] == nil
      params["user"]["usertype"] = "student"
    end

    # Check for email uniqueness
    existing_user = User.where.like(email: params["user"]["email"]).first # TODO 'and usertype == params[usertype]'
    if existing_user != nil # TODO once multiple users, allow email reuse for different account types (eg. I can have an admin and a student account)
      return render json: {
               errors: ["Email already in use"],
             }, status: :bad_request
    end

    # Check that the email is allowed
    if params["user"]["company_id"] != nil
      exact_match = AllowlistEmail.where(usertype: params["user"]["usertype"], company_id: params["user"]["company_id"]).where.like(email: params["user"]["email"]).first
      domain_match = AllowlistDomain.where(usertype: params["user"]["usertype"], company_id: params["user"]["company_id"]).where.like(domain: params["user"]["email"].split("@").last).first
    else
      exact_match = AllowlistEmail.where(usertype: params["user"]["usertype"]).where.like(email: params["user"]["email"]).first
      domain_match = AllowlistDomain.where(usertype: params["user"]["usertype"]).where.like(domain: params["user"]["email"].split("@").last).first
    end
    
    if exact_match == nil && domain_match == nil
      return render json: {
               errors: ["Email not allowed"],
             }, status: :bad_request
    end
    
    if params["user"]["company_id"] != nil and params["user"]["usertype"] != "company representative"
      return render json: {
        errors: ["Company ID cannot be provided to user of type  #{params[:user][:usertype]}"],
        }, status: :bad_request
      end
      
    if exact_match != nil
      company = exact_match.company
    else
      company = domain_match.company
    end

    # If company found with allowlist doesn't match the company found with the provided company_id
    if params["user"]["company_id"] and company != Company.find(params["user"]["company_id"])
      return render json: {
                      errors: ["Email not allowed for provided company of id #{params[:user][:company_id]}"],
                    }, status: :bad_request
    end

    @user = User.new(user_params)
    if @user.save
      resp = UserMailer.registration_confirmation(@user).deliver_now
      if params["user"]["usertype"] == "company representative"
        company.users << @user
      end
      if exact_match != nil and company == exact_match.company
        exact_match.users << @user
      end
      if domain_match != nil and company == domain_match.company
        domain_match.users << @user
      end
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

  def update
    @user = User.find(params[:id])
    if !@user
      render json: {
        errors: ["User #{params[:id]} not found"],
      }, status: :not_found
      return
    end
    if !confirm_requester_is_owner_or_admin(params[:id].to_i)
      return
    end
    if @user.update(update_params)
      @user.save!
      render json: {
               user: @user,
             }, status: :ok
    else
      render json: {
               errors: @user.errors.full_messages,
             }, status: :internal_server_error
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

  # GET /users/1/meetings/accepted
  def get_accepted_meetings
    meetings = User.find_by_id(params[:id]).accepted_meetings
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

  # GET /users/1/meetings/declined
  def get_declined_meetings
    meetings = User.find_by_id(params[:id]).declined_meetings
    render json: {
      meetings: meetings,
    }, status: :ok
  end

  # GET /users/1/meetings/cancelled
  def get_cancelled_meetings
    meetings = User.find_by_id(params[:id]).cancelled_meetings
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

  def add_to_company
    # only usertype of company rep can be added
    # write this in users_controller or companies_controller?
    # should i use foreign key instead of :id?
    @user = User.find_by_id(params[:id])
    @company = Company.find_by_id(params[:company_id])
    @company.users << @user
  end

  def delete_from_company
    @user = User.find_by_id(params[:id])
    @company = Company.find_by_id(params[:company_id])
    @company.users.delete(@user)
  end

  def destroy

    # Deletes a specific user
    if params[:id] != nil
      @user = User.find(params[:id])
      if !((@current_user == @user) || (@current_user.usertype == "admin"))
        render json: {
                 error: "Action not allowed",
               }, status: :forbidden
        return
      end
    else
      @user = @current_user
    end

    if @user.destroy
      render json: {
               company: @user,
             }, status: :ok
    else
      render json: {
               errors: ["something went wrong when deleting this user"],
             }, status: :internal_server_error
    end
  end

  def update_password
    if @current_user.update(password_params)
      logout!
      render json: {
        user: @user,
      }, status: :ok
    else
      render json: {
               errors: ["something went wrong when updating your password"],
             }, status: :internal_server_error
    end
  end

  # get "users/:id/availabilities", to: "users#get_availabilies"
  def get_availabilies
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    @availabilities = User.find_by_id(params[:id]).availabilities
    render json: {
             availabilities: @availabilities,
           }, status: :ok
  end

  # get "users/:id/meetings/owned/available", to: "users#get_owned_and_avail_meetings"
  def get_owned_and_avail_meetings
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    render json: {
             meetings: User.find_by_id(params[:id]).owned_meetings_available_for,
           }, status: :ok
  end

  # get "users/:id/meetings/owned/not_available", to: "users#get_owned_but_na_meetings"
  def get_owned_but_na_meetings
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    render json: {
             meetings: User.find_by_id(params[:id]).owned_meetings_not_available_for,
           }, status: :ok
  end

  # get "users/:id/user_meetings/available", to: "users#get_invitations_avail"
  def get_invitations_avail
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    render json: {
             user_meetings: User.find_by_id(params[:id]).meeting_invitations_available_for,
           }, status: :ok
  end

  # get "users/:id/user_meetings/not_available", to: "users#get_invitations_na"
  def get_invitations_na
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    render json: {
             user_meetings: User.find_by_id(params[:id]).meeting_invitations_not_available_for,
           }, status: :ok
  end

  # delete "users/:id/meetings/owned/not_available", to: "users#delete_owned_but_na_meetings"
  def delete_owned_but_na_meetings
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    @meetings = User.find_by_id(params[:id]).owned_meetings_not_available_for
    @meetings.each do |meeting|
      if !meeting.destroy
        render json: {
                 errors: meeting.errors.full_messages,
               }, status: :bad_request
        return
      end
    end
    render json: {}, status: :ok
  end

  # delete "users/:id/user_meetings/not_available", to: "users#delete_na_invitations"
  def delete_na_invitations
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    @user_meetings = User.find_by_id(params[:id]).meeting_invitations_not_available_for
    @user_meetings.each do |um|
      if !um.destroy
        render json: {
                 errors: um.errors.full_messages,
               }, status: :bad_request
        return
      end
    end
    render json: {}, status: :ok
  end

  # GET "users/:id/focuses" or "users/focuses"
  def get_focuses
    if params[:id] == nil
      params[:id] = current_user.id
    end
    if !confirm_user_exists
      return
    end
    render json: {
      user_focuses: Users.find(params[:id]),
    }, status: :ok
  end

  # POST "users/:id/focuses/:focus_id" or "users/focuses/:focus_id"
  def add_focus
    if params[:id] == nil
      params[:id] = current_user.id
    end
    if !confirm_user_exists
      return
    end
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    user = User.find(params[:id])
    focus = Focus.find_by_id(params[:focus_id])
    if !focus
      render json: {
        errors: ["Focus with id #{params[:focus_id]} not found"],
      }, status: :not_found
      return
    end
    if UserFocus.find_by(user: user, focus: focus)
      render json: {
        errors: ["User #{user.id} already head #{focus.name} as their focus"],
      }, status: :bad_request
      return
    end
    @user_focus = UserFocus.create(user: user, focus: focus)
    if @user_focus.save
      render json: {
        user_focus: @user_focus,
      }, status: :ok
    else
      render json: {
        errors: @user_focus.errors.full_messages,
      }, status: :bad_request
    end
  end

  # DELETE "users/:id/focuses/:focus_id" or "users/focuses/:focus_id"
  def remove_focus
    if params[:id] == nil
      params[:id] = current_user.id
    end
    if !confirm_user_exists
      return
    end
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    user = User.find(params[:id])
    focus = Focus.find_by_id(params[:focus_id])
    if !focus
      render json: {
               errors: ["Focus with id #{params[:focus_id]} not found"],
             }, status: :not_found
      return
    end
    @user_focus = UserFocus.find_by(user: user, focus: focus)
    if !@user_focus
      render json: {
               errors: ["User #{user.id} didn't have #{focus.name} as their focus"],
             }, status: :bad_request
      return
    end

    if @user_focus.destroy
      render json: {
               user_focus: @user_focus,
             }, status: :ok
    else
      render json: {
               errors: @user_focus.errors.full_messages,
             }, status: :bad_request
    end
  end

  # PUT "users/:id/focuses/" or "users/focuses/"
  def update_focus
    if params[:id] == nil
      params[:id] = current_user.id
    end
    params[:id] = params[:id].to_i
    if !confirm_user_exists
      return
    end
    if !confirm_requester_is_owner_or_admin(params[:id])
      return
    end
    user = User.find(params[:id])

    # Check params is provided
    focuses = focus_params.to_h["focuses"]
    if !focuses
      render json: {
               errors: ['"focuses" not found in provided parameters.'],
             }, status: :bad_request
      return
    end

    to_update = []
    to_create = []

    for focus in focuses
      if focus["id"] == nil
        render json: {
                 errors: ["You should provide json in following format:",
                          '{"user": {"focuses": [{"id": 1}, {"id": 2}, ...]}}'],
               }, status: :bad_request
        return
      end
      focus["id"] = focus["id"].to_i
      focus_obj = Focus.find_by_id(focus["id"])

      # Check if all entries in focuses are valid
      if !focus_obj
        render json: {
          errors: ["Focus #{focus["id"]} not found"],
        }, status: :bad_request
        return
      end

      # Either classify as to update / to create
      if user.focuses.find_by_id(focus_obj.id) != nil
        to_update << focus_obj
      else
        to_create << focus_obj
      end
    end

    ActiveRecord::Base.transaction do
      for user_focus in user.user_focuses
        if !to_update.include? user_focus.focus
          if !user_focus.destroy
            render json: {
                     errors: ["Previous user-focus deletion failed",
                              user_focus.errors.full_messages],
                   }, status: :bad_request
            raise ActiveRecord::RollBack # Roll back on fail
          end
        end
      end

      # Nothing needs to be done for update for now
      # Create new ones
      for focus in to_create
        user_focus = UserFocus.create(user: user, focus: focus)
        if !user_focus.save
          render json: {
                   errors: user_focus.errors.full_messages,
                 }, status: :internal_server_error
          raise ActiveRecord::RollBack # Roll back on fail
        end
      end
    rescue
      return
    end

    render json: {
                   focuses: user.focuses,
                 }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:usertype, :firstname, :lastname, :email, :password, :password_confirmation, :profile_img_src, :resume_link, :portfolio_link, :class_year, :class_semester, :title)
  end

  def update_params
    params.require(:user).permit(:profile_img_src, :resume_link, :portfolio_link, :class_year, :class_semester, :title)
  end

  def user_meeting_params
    params.require(:user_meeting).permit(:status)
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def focus_params
    params.require(:user).permit(focuses: [:id])
  end

  def confirm_requester_is_owner_or_admin(user_id)
    if !(current_user.id == user_id or current_user.usertype == "admin")
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

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
      return false
    end
    return true
  end

  def confirm_meeting_exists
    if !Meeting.find_by_id(params[:meeting_id])
      render json: {
        errors: ["Meeting with id #{params[:id]} not found"],
      }, status: :not_found
    end
  end
end
