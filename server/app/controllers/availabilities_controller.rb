class AvailabilitiesController < ApplicationController
  before_action :confirm_user_logged_in
  before_action :confirm_availability_exists, only: [:show, :update, :delete]

  # GET /availabilities
  def index
    if !current_user.user_type == :admin
      render json: {
               availabilities: Availability.all,
             }, status: :ok
    else
      render json: {
               availabilities: current_user.availabilities,
             }, status: :ok
    end
  end

  # GET /availabilities/1
  def show
    @availability = Availability.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@availability.user.id)
      return
    end
    render json: {
             meeting: @availability,
           }, status: :ok
  end

  # POST /availabilities/
  def create
    if !confirm_requester_is_admin_or_rep_or_volunteer
      return
    end
    params = availability_params.to_h
    # If owner key is not provided, use the owner key provided by the requester
    if !params.key?("user_id")
      params["user_id"] = current_user.id
    end

    @availability = Availability.new(params)
    if @availability.save
      render json: {
               meeting: @availability,
             }, status: :created
    else
      render json: {
               errors: @availability.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # PUT /availabilities/1/
  def update
    @availability = Availability.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@availability.user.id)
      return
    end
    if @availability.update(availability_params)
      render json: {
               meeting: @availability,
             }, status: :ok
    else
      render json: {
               errors: @availability.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # DELETE /availabilities/1/
  def destroy
    @availability = Availability.find(params[:id])
    if !confirm_requester_is_owner_or_admin(@availability.user.id)
      return
    end
    if @availability.destroy
      render json: {
               meeting: @availability,
             }, status: :ok
    else
      render json: {
               errors: @availability.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  private

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_availability_exists
    if !Availability.find_by_id(params[:id])
      render json: {
               errors: ["Availability with id #{params[:id]} not found"],
             }, status: :not_found
    end
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

  def confirm_requester_is_admin
    if current_user.usertype != "admin"
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

  def confirm_requester_is_admin_or_rep_or_volunteer
    if current_user.usertype != "company representative" or current_user.usertype != "company representative" or current_user.usertype != "admin"
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

  def availability_params
    params.require(:availability).permit(:user_id, :start_time, :end_time)
  end
end
