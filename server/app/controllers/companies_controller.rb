class CompaniesController < ApplicationController
  before_action :confirm_user_logged_in, except: [:index, :public_index]

  def index
    @companies = Company.all

    include_ = []
    if current_user and current_user.usertype == "admin"
      include_ = ["allowlist_domains", "allowlist_emails"]
    end

    render :json => { companies: @companies }.to_json(include: include_), status: :ok
  end

  def public_index
    if current_user and current_user.usertype != "admin"
      @companies = Company.all
      render :json => { companies: @companies }, status: :ok
    else
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
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
                 allowlist_domains: @company.allowlist_domains,
                 allowlist_emails: @company.allowlist_emails,
               }, status: :ok
      else
        render json: { company: @company }, status: :ok
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
      render json: { errors: ["no such company found for editting"] }, status: :not_found
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
        render json: { company: @company }, status: :ok
      else
        render json: { errors: ["something went wrong when updating this company"] }, status: :internal_server_error
      end
    else
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
    end
  end

  def destroy
    @company = Company.find_by_id(params[:id])
    if @company.nil?
      render json: { errors: ["no such company found for deleting"] }, status: :not_found
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
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
    end
  end

  # GET "companies/:id/focuses" or "companies/focuses"
  def get_focuses
    if !params[:id]
      params[:id] = current_user.company_id
    end
    if !confirm_company_exists
      return
    end
    render json: {
      company_focuses: @company.focuses,
    }, status: :ok
  end

  # POST "companies/:id/focuses/:focus_id" or "companies/focuses/:focus_id"
  def add_focus
    if !params[:id]
      params[:id] = current_user.company_id
    end
    if !confirm_company_exists
      return
    end

    company = Company.find(params[:id])
    if !is_admin_or_company_rep(company)
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
      return
    end

    focus = Focus.find_by_id(params[:focus_id])
    if !focus
      render json: {
        errors: ["Focus with id #{params[:focus_id]} not found"],
      }, status: :not_found
      return
    end
    if CompanyFocus.find_by(company: company, focus: focus)
      render json: {
        errors: ["Company #{company.id} already head #{focus.name} as their focus"],
      }, status: :bad_request
      return
    end
    @company_focus = CompanyFocus.create(company: company, focus: focus)
    if @company_focus.save
      render json: {
        company_focus: @company_focus,
      }, status: :ok
    else
      render json: {
        errors: @company_focus.errors.full_messages,
      }, status: :bad_request
    end
  end

  # DELETE "companies/:id/focuses/:focus_id" or "companies/focuses/:focus_id"
  def remove_focus
    if !params[:id]
      params[:id] = current_user.company_id
    end
    if !confirm_company_exists
      return
    end

    company = Company.find(params[:id])
    if !is_admin_or_company_rep(company)
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
      return
    end
    focus = Focus.find_by_id(params[:focus_id])
    if !focus
      render json: {
               errors: ["Focus with id #{params[:focus_id]} not found"],
             }, status: :not_found
      return
    end

    @company_focus = CompanyFocus.find_by(company: company, focus: focus)
    if !@company_focus
      render json: {
               errors: ["Company #{company.id} didn't have #{focus.name} as their focus"],
             }, status: :bad_request
      return
    end

    if @company_focus.destroy
      render json: {
               company_focus: @company_focus,
             }, status: :ok
    else
      render json: {
               errors: @company_focus.errors.full_messages,
             }, status: :bad_request
    end
  end

  # PUT "companies/:id/focuses/" or "companies/focuses/"
  def update_focus
    if !params[:id]
      params[:id] = current_user.company_id
    end
    if !confirm_company_exists
      return
    end

    company = Company.find(params[:id])
    if !is_admin_or_company_rep(company)
      render json: { errors: ["User does not have previleges for requested action"] }, status: :forbidden
      return
    end

    # Check params is provided
    focuses = focus_params.to_h["focuses"]
    if !focuses
      render json: {
               errors: ['"focuses" not found in provided parameters.'],
             }, status: :bad_request
      return
    end

    to_update = []
    to_create = []

    for focus in focuses
      if focus["id"] == nil
        render json: {
                 errors: ["You should provide json in following format:",
                          '{"company": {"focuses": [{"id": 1}, {"id": 2}, ...]}}'],
               }, status: :bad_request
        return
      end
      focus["id"] = focus["id"].to_i
      focus_obj = Focus.find_by_id(focus["id"])

      # Check if all entries in focuses are valid
      if !focus_obj
        render json: {
                 errors: ["Focus #{focus["id"]} not found"],
               }, status: :bad_request
        return
      end

      # Either classify as to update / to create
      if company.focuses.find_by_id(focus_obj.id) != nil
        to_update << focus_obj
      else
        to_create << focus_obj
      end
    end

    ActiveRecord::Base.transaction do
      for company_focus in company.company_focuses
        if !to_update.include? company_focus.focus
          if !company_focus.destroy
            render json: {
                     errors: ["Previous company-focus deletion failed",
                              company_focus.errors.full_messages],
                   }, status: :bad_request
            raise ActiveRecord::RollBack # Roll back on fail
          end
        end
      end

      # Nothing needs to be done for update for now
      # Create new ones
      for focus in to_create
        company_focus = CompanyFocus.create(company: company, focus: focus)
        if !company_focus.save
          render json: {
                   errors: company_focus.errors.full_messages,
                 }, status: :internal_server_error
          raise ActiveRecord::RollBack # Roll back on fail
        end
      end
    rescue
      return
    end

    render json: {
             focuses: company.focuses,
           }, status: :ok
  end

  private

  def company_params
    params.require(:company).permit(:name, :description, :location, :logo_img_src, :website_link, :hiring_for_fulltime, :hiring_for_parttime, :hiring_for_intern)
  end

  def focus_params
    params.require(:company).permit(focuses: [:id])
  end

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :unauthorized
    end
  end

  def confirm_company_exists
    if !Company.find_by_id(params[:id])
      render json: {
               errors: ["company not found"],
             }, status: :not_found
      return false
    end
    return true
  end

  def is_admin_or_company_rep(company)
    if logged_in? && current_user
      if current_user.usertype == "admin" || (current_user.company_id == company.id && current_user.usertype == "company representative")
        return true
      end
    end
    return false
  end
end
