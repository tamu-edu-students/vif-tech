class UserFocusesController < ApplicationController
  def show
    @user_focus = UserFocus.find(params[:id])
    if @user_focus
      render json: {
               user_focus: @user_focus,
             }, status: :ok
    else
      render json: {
               errors: ["User focus of id #{params[:id]} not found"],
             }, status: :not_found
    end
  end

  def index
    render json: {
             focuses: @UserFocus.all,
           }, status: :ok
  end
end
