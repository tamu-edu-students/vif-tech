class MeetingsController < ApplicationController
  before_action :confirm_user_logged_in

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
        status: 500,
        errors: ["user not logged in"],
      }
    end
  end

  # GET /meetings
  def index
    @meetings = Meeting.all
    if @meetings
      render json: {
               meetings: @meetings,
             }
    else
      render json: {
               status: 500,
               errors: ["no meetings found"],
             }
    end
  end

  # GET /meetings/1
  def show
    @meeting = Meeting.find_by_id(params[:id])
    if @meeting
      render json: {
               meeting: @meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["meeting not found"],
             }
    end
  end

  # POST /meetings/
  def create
    params = meeting_params.to_h
    # If owner key is not provided, use the owner key provided by me
    if !params.key?("owner_id")
      params["owner_id"] = current_user.id
    end

    @meeting = Meeting.new(params)
    if @meeting.save
      render json: {
               status: :created,
               meeting: @meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["Something went wrong when saving the meeting"],
             }
    end
  end

  # PUT /meetings/1/
  def update
    @meeting = Meeting.find(params[:id])
    if @meeting.update(meeting_params)
      render json: {
               status: :created,
               meeting: @meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["Something went wrong when saving the meeting"],
             }
    end
  end

  private

  def meeting_params
    params.require(:meeting).permit(:title, :start_time, :end_time, :owner_id)
  end
end
