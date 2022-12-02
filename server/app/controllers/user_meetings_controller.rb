class UserMeetingsController < ApplicationController
  before_action :confirm_user_logged_in

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def index
    render json: {
             user_meetings: UserMeeting.all,
           }, status: :ok
  end

  def show
    @user_meeting = UserMeeting.find_by_id(params[:id])
    if @user_meeting
      render json: {
               user_meeting: @user_meeting,
             }, status: :ok
    else
      render json: {
               errors: ["User meeting association not found"],
             }, status: :not_found
    end
  end
end
