class SessionsController < ApplicationController
  def create
    @user = User.find_by(email: session_params[:email])

    if @user && @user.authenticate(session_params[:password])
      if @user.email_confirmed
        login!
        render json: {
                logged_in: true,
                user: @user,
              }, status: :ok
      else
        render json: {
          errors: ["email not confirmed"],
        }, status: :unauthorized
      end
    else
      render json: {
               errors: ["no such user, please try again"],
             }, status: :unauthorized
    end
  end

  def is_logged_in?
    if logged_in? && current_user
      render json: {
               logged_in: true,
               user: current_user,
             }, status: :ok
    else
      render json: {
               logged_in: false,
               message: "no such user",
             }, status: :ok
    end
  end

  def destroy
    logout!
    render json: {
             logged_out: true,
           }, status: :ok
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end
end
