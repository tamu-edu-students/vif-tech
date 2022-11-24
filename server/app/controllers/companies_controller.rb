class CompaniesController < ApplicationController
  before_action :confirm_user_logged_in

  def index
    
    @companies = Company.all

    include_ = []
    if logged_in? && current_user && current_user.usertype == "admin"
      include_ = ["allowlist_domains", "allowlist_emails"]
    end

    render :json=> {companies: @companies}.to_json(include: include_), status: :ok
  end


  def public_index
    if logged_in? && current_user && current_user.usertype != "admin"
      @companies = Company.all
      render :json=> {companies: @companies}, status: :ok
    else
      render json:{errors: ["User does not have previleges for requested action"]}, status: :forbidden
    end
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
    
    @company = Company.new
  end

  def create
    if current_user.usertype == "admin"
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
    @company = Company.find_by_id(params[:id]) 
    if @company
      if logged_in? && current_user && current_user.usertype == "admin"
        render json: {
                company: @company, 
                allowlist_domains:@company.allowlist_domains, 
                allowlist_emails:@company.allowlist_emails}, status: :ok
      else
        render json:{company: @company}, status: :ok
      end
    else
      render json: {
               errors: ["company not found"], 
              
             }, status: :not_found
    end
    
  end

  def edit
    
    @company = Company.find(params[:id])
  end

  def update
    @company = Company.find_by_id(params[:id])
    if @company.nil?
      render json:{errors: ["no such company found for editting"],}, status: :not_found
      return
    end
    if logged_in? && current_user && current_user.usertype == "admin"
      if @company.update(company_params)
        render json: {
                company: @company,
              }, status: :ok
      else
        render json: {
                errors: ["something went wrong when updating this company"],
              }, status: :internal_server_error
      end
    elsif logged_in? && current_user && !current_user.company_id.nil? && current_user.company_id == @company.id && current_user.usertype == "company representative"
      if @company.update(company_params)
        render json:{company: @company,}, status: :ok
      else
        render json:{errors: ["something went wrong when updating this company"],}, status: :internal_server_error
      end
    else
      render json:{errors: ["User does not have previleges for requested action"],}, status: :forbidden
    end
  end

  def destroy
    
    @company = Company.find_by_id(params[:id])
    if @company.nil?
      render json:{errors: ["no such company found for deleting"],}, status: :not_found
      return
    end
    if logged_in? && current_user && current_user.usertype == "admin"
      if @company.destroy
        render json: {
                company: @company,
              }, status: :ok
      else
        render json: {
                errors: ["something went wrong when deleting this company"],
              }, status: :internal_server_error
      end
    else
      render json:{errors: ["User does not have previleges for requested action"],}, status: :forbidden
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
