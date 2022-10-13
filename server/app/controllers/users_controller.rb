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
    # TODO: find by other elements
    @user = User.find_by_username(params["username"][0])
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
    @user = User.new(user_params)
    if @user.save
      login!
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
    params.require(:user).permit(:usertype, :username, :email, :password, :password_confirmation)
  end
end
