class UserMeetingsController < ApplicationController
  before_action :confirm_user_logged_in

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               status: 500,
               errors: ["User not logged in"],
             }
    end
  end

  def index
    render json: {
             user_meetings: UserMeeting.all,
           }
  end

  def show
    @user_meeting = UserMeeting.find_by_id(params[:id])
    if @user_meeting
      render json: {
               user_meeting: @user_meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["User meeting association not found"],
             }
    end
  end
end
