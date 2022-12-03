class UserFocusesController < ApplicationController
  def index
    render json: {
             user_focuses: UserFocus.all,
           }, status: :ok
  end
end
