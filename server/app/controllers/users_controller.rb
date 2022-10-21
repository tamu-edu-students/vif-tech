class UsersController < ApplicationController
  def index
    @users = User.all
    if @users
      render json: {
               users: @users,
             }
    else
      render json: {
               status: 500,
               errors: ["no users found"],
             }
    end
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
               errors: ["user not found"],
             }
    end
  end

  def show_by_find
    uri    = URI.parse(request.url)
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
        user:@user
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
    existing_user = User.find_by_email(params['user']['email']) # TODO 'and usertype == params[usertype]'
    if existing_user!=nil # TODO once multiple users, allow email reuse for different account types (eg. I can have an admin and a student account)
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

    # TODO
    # if company rep, verify that email is on company's allowlist
    # else, set company -> none

    @user = User.new(user_params)
    if @user.save
      login!
      resp = UserMailer.registration_confirmation(@user).deliver_now
      logger.debug {resp}
      render json: {
               status: :created,
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

  private

  def user_params
    params.require(:user).permit(:usertype, :firstname, :lastname, :email, :password, :password_confirmation)
  end



end
