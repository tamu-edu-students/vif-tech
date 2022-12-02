class AllowlistDomainsController < ApplicationController
  before_action :confirm_user_logged_in
  before_action :confirm_requester_is_primary_contact_or_admin, only: [:create, :delete]
  before_action :confirm_requester_is_rep_or_admin, only: [:index, :show]
  before_action :confirm_uniquness, only: [:create]


  def index
    @domains = AllowlistDomain.all

    if current_user.usertype == "company representative"
      @domains = @domains.filter { |e| e.company == current_user.company }
    end

    if params[:usertype] != nil
      @domains = @domains.where(usertype: params[:usertype])
    end

    if params[:company_id] != nil
      @domains = @domains.where(company_id: params[:company_id])
    end

    if @domains
      render json: {
               allowlist_domains: @domains,
             }, status: :ok
    else
      render json: {
               errors: ["no domains found"],
             }, status: :internal_server_error
    end
  end

  def show
    @domain = AllowlistDomain.find(params[:id])
    if current_user.usertype == "company representative" and @domain.company_id != current_user.company_id
      @domain = nil
    end
    if @domain
      render json: {
                allowlist_domain: @domain,
             }, status: :ok
    else
      render json: {
               errors: ["domain not found"],
             }, status: :not_found
    end
  end

  def create
    if current_user.usertype == "company representative"
      company = current_user.company
    elsif params[:allowlist_domain][:company_id] != nil and current_user.usertype == "admin"
      company = Company.find_by_id(params[:allowlist_domain][:company_id])
    else
      company = nil
    end

    @domain = AllowlistDomain.new(domain_params)
    @domain.company_id = company ? company.id : nil
    if @domain.save
      if company != nil
        company.allowlist_domains << @domain
      end

      us = User.where(usertype: @domain.usertype)
      filter = Regexp.new("@" + @domain.domain)
      for u in us
        if u != nil && @domain.usertype == u.usertype && u.company == @domain.company && (u.email =~ filter) != nil
          @domain.users << u
        end
      end

      render json: {
                allowlist_domain: @domain,
             }, status: :created
    else
      render json: {
               errors: @domain.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  def destroy
    @domain = AllowlistDomain.find(params[:id])
    if current_user.usertype == "company representative" and @domain.company_id != current_user.company_id
      @domain = nil
    end
    if @domain
      @domain.users.where(allowlist_email_id: nil).destroy_all
      @domain.users.update_all(allowlist_domain_id: nil)
      @domain.destroy

      render json: {
               errors: ["domain deleted"],
             }, status: :ok
    else
      render json: {
               errors: ["domain not found"],
             }, status: :not_found
    end
  end

  private

  def confirm_user_logged_in
    if !(logged_in? && current_user)
      render json: {
               errors: ["User not logged in"],
             }, status: :forbidden
    end
  end


  def confirm_requester_is_primary_contact_or_admin()
    if !(current_user.usertype == "admin" ||
         (current_user.usertype == "company representative" &&
          current_user.company != nil &&
          current_user.allowlist_email != nil &&
          current_user.allowlist_email.is_primary_contact == true))
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

  def confirm_requester_is_rep_or_admin()
    if !(current_user.usertype == "admin" ||
         (current_user.usertype == "company representative" &&
          current_user.company != nil))
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
      return false
    end
    return true
  end

  def domain_params
    if @current_user.usertype != "admin"
      params[:allowlist_domain][:usertype] = "company representative"
    end
    params.require(:allowlist_domain).permit(:domain, :usertype)
  end

  def confirm_uniquness

    dp = domain_params
    
    domain = AllowlistDomain.where(usertype: params[:allowlist_domain][:usertype]).where.like(domain: params[:allowlist_domain][:domain])
    if params[:allowlist_domain][:company_id]
      domain = domain.where(company_id: params[:allowlist_domain][:company_id])
    end

    if domain.first 
      render json: {
        errors: ["Allowlist entry already exists"],
      }, status: :forbidden
      return false
    end
    return true
  end
end
