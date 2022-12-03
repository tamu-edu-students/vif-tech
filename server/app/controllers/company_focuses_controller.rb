class CompanyFocusesController < ApplicationController
  def index
    render json: {
             company_focuses: CompanyFocus.all,
           }, status: :ok
  end
end
