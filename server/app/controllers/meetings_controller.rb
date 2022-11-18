class MeetingsController < ApplicationController
  before_action :confirm_user_logged_in
  before_action :confirm_meeting_exists, only: [:show, :update, :delete]

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_meeting_exists
    if !Meeting.find_by_id(params[:id])
      render json: {
        errors: ["Meeting with id #{params[:id]} not found"],
      }, status: :not_found
    end
  end

  def confirm_requester_is_owner_or_admin(owner_id)
    if !(current_user.id == owner_id or current_user.usertype == "admin")
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

  def confirm_requester_is_admin
    if current_user.usertype != "admin"
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
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
           }, status: :ok
  end

  # GET /meetings/1
  def show
    @meeting = Meeting.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    render json: {
             meeting: @meeting,
           }, status: :ok
  end

  # POST /meetings/
  def create
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
               meeting: @meeting,
             }, status: :created
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # PUT /meetings/1/
  def update
    @meeting = Meeting.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    if @meeting.update(meeting_params)
      render json: {
               meeting: @meeting,
             }, status: :ok
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # DELETE /meetings/1/
  def destroy
    @meeting = Meeting.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@meeting.owner.id)
      return
    end
    if @meeting.destroy
      render json: {
               meeting: @meeting,
             }, status: :ok
    else
      render json: {
               errors: @meeting.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  private

  def meeting_params
    params.require(:meeting).permit(:title, :start_time, :end_time, :owner_id)
  end
end
