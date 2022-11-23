class CompaniesController < ApplicationController
  before_action :confirm_user_logged_in

  def index
    # Displays all companies
    @companies = Company.all

    include_ = []
    if logged_in? && current_user && current_user.usertype == "admin"
      include_ = ["allowlist_domains", "allowlist_emails"]
    end

    render :json=> {companies: @companies}.to_json(include: include_), status: :ok
  end

  def reps
    @company = Company.find(params[:id])
    if @company
      render json: {
               users: @company.users,
    }.to_json, status: :ok
    else
      render json: {
               errors: ["company not found"],
             }, status: :not_found
    end
  end

  def rep_availabilities
    @company = Company.find(params[:id])
    if @company
      render json: {
               users: @company.users,
    }.to_json(:include => :availabilities), status: :ok
    else
      render json: {
               errors: ["company not found"],
             }, status: :not_found
    end
  end

  def new
    # Returns an HTML form for creating a new company
    @company = Company.new
  end

  def create
    # Creates a new company
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

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end
end
