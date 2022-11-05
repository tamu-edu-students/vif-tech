class CompaniesController < ApplicationController
  def index
    # Displays all companies
    @companies = Company.all
    render json: {
             companies: @companies,
           }, status: :ok
  end

  def new
    # Returns an HTML form for creating a new company
    @company = Company.new
  end

  def create
    # Creates a new company
    if current_user.usertype = "admin"
      @company = Company.new(company_params)
      if @company.save
        render json: {
                company: @company,
              }, status: :created
      else
        render json: {
                errors: ["Something went wrong when saving this company"],
              }, status: :internal_server_error
      end
    else
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
    end
  end

  def show
    # Displays a specific company
    @company = Company.find(params[:id])
    if @company
      render json: {
               company: @company,
             }, status: :ok
    else
      render json: {
               errors: ["company not found"],
             }, status: :not_found
    end
  end

  def edit
    # Returns an HTML form for editing a company
    @company = Company.find(params[:id])
  end

  def update
    # Updates a specific company
    @company = Company.find(params[:id])
    if @company.update(params)
      render json: {
               company: @company,
             }, status: :ok
    else
      render json: {
               errors: ["something went wrong when updating this company"],
             }, status: :internal_server_error
    end
  end

  def destroy
    # Deletes a specific company
    @company = Company.find(params[:id])
    if @company.destroy
      render json: {
               company: @company,
             }, status: :ok
    else
      render json: {
               errors: ["something went wrong when deleting this company"],
             }, status: :internal_server_error
    end
  end




  
  private

  def company_params
    params.require(:company).permit(:name, :description)
  end
end
