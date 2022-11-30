class EventsController < ApplicationController
  before_action :confirm_user_logged_in, except: [:index, :show]
  before_action :confirm_event_exists, only: [:show, :update, :destroy]

  # GET /events
  def index
    render json: {
             events: Event.all,
           }, status: :ok
  end

  # GET /events/1
  def show
    @event = Event.find(params[:id])
    render json: {
             event: @event,
           }, status: :ok
  end

  # POST /events/
  def create
    if !confirm_requester_is_admin
      return
    end
    params = event_params.to_h

    @event = Event.new(params)
    if @event.save
      render json: {
               event: @event,
             }, status: :created
    else
      render json: {
               errors: @event.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # PUT /events/1/
  def update
    @event = Event.find(params[:id])
    if !confirm_requester_is_admin
      return
    end

    if @event.update(event_params)
      render json: {
               event: @event,
             }, status: :ok
    else
      render json: {
               errors: @event.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  # DELETE /events/1/
  def destroy
    @event = Event.find(params[:id])
    if !confirm_requester_is_admin
      return
    end
    if @event.destroy
      render json: {
               event: @event,
             }, status: :ok
    else
      render json: {
               errors: @event.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time)
  end

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_event_exists
    if !Event.find_by_id(params[:id])
      render json: {
               errors: ["Event with id #{params[:id]} not found"],
             }, status: :not_found
    end
  end

  def confirm_meeting_exists(id)
    if !Meeting.find_by_id(id)
      render json: {
               errors: ["Meeting with id #{id} not found"],
             }, status: :not_found
      return false
    end
    return true
  end

  def confirm_availability_exists(id)
    if !Availability.find_by_id(id)
      render json: {
               errors: ["Availability with id #{id} not found"],
             }, status: :not_found
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
end
