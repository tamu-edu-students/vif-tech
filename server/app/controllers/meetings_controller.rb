class MeetingsController < ApplicationController
  before_action :confirm_user_logged_in

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
        status: 500,
        errors: ["User not logged in"],
      }
    end
  end

  def confirm_requester_is_owner_or_admin(owner_id)
    if !(current_user.id == owner_id or current_user.usertype == "admin")
      render json: {
        status: 500,
        errors: ["User does not have previleges for requested action"],
      }
      return false
    end
    return true
  end

  def confirm_requester_is_admin
    if current_user.usertype != "admin"
      render json: {
        status: 500,
        errors: ["User does not have previleges for requested action"],
      }
      return false
    end
    return true
  end

  # GET /meetings
  def index
    if !confirm_requester_is_admin
      return
    end

    render json: {
             meetings: Meeting.all,
           }
  end

  # GET /meetings/1
  def show
    @meeting = Meeting.find_by_id(params[:id])
    if @meeting and !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    if @meeting
      render json: {
               meeting: @meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["Meeting not found"],
             }
    end
  end

  # POST /meetings/
  def create
    # TODO: handle creation by company representatives
    if !confirm_requester_is_admin
      return
    end
    params = meeting_params.to_h
    # If owner key is not provided, use the owner key provided by the requester
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
    if @meeting and !confirm_requester_is_owner_or_admin(@meeting.owner_id)
      return
    end
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

  # DELETE /meetings/1/
  def destroy
    @meeting = Meeting.find(params[:id])
    if @meeting and !confirm_requester_is_owner_or_admin(@meeting.owner_id)
      return
    end
    if @meeting.destroy
      render json: {
               status: 200,
               meeting: @meeting,
             }
    else
      render json: {
               status: 500,
               errors: ["Something went wrong when destroying the meeting"],
             }
    end
  end

  private

  def meeting_params
    params.require(:meeting).permit(:title, :start_time, :end_time, :owner_id)
  end
end
