class EventSignupsController < ApplicationController
  # GET /event_signups
  def index
    render json: {
             event_signups: EventSignup.all,
           }, status: :ok
  end

  # GET /event_signups/1
  def show
    event_signup = EventSignup.find(params[:id])
    if !event_signup
      render json: {
               errors: ["Event signup with id #{params[:id]}"],
             }, status: :not_found
      return
    end
    render json: {
             event_signup: event_signup,
           }, status: :ok
  end
end
