class AllowlistEmailsController < ApplicationController
  before_action :confirm_user_logged_in
  before_action :confirm_requester_is_primary_contact_or_admin, only: [:create, :delete, :transferPrimaryContact]
  before_action :confirm_requester_is_rep_or_admin, only: [:index, :show]
  before_action :confirm_uniquness, only: [:create]
  before_action :confirm_single_pc, only: [:create]

  def index
    @emails = AllowlistEmail.all

    if current_user.usertype == "company representative"
      @emails = @emails.filter { |e| e.company == current_user.company }
    end

    if params[:usertype] != nil
      @emails = @emails.where(usertype: params[:usertype])
    end

    if params[:company_id] != nil
      @emails = @emails.where(company_id: params[:company_id])
    end

    if @emails
      render json: {
                allowlist_emails: @emails,
             }, status: :ok
    else
      render json: {
               errors: ["no emails found"],
             }, status: :internal_server_error
    end
  end

  def show
    @email = AllowlistEmail.find(params[:id])
    if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
      @email = nil
    end

    if @email
      render json: {
                allowlist_email: @email,
             }, status: :ok
    else
      render json: {
               errors: ["email not found"],
             }, status: :not_found
    end
  end

  def create
    if current_user.usertype == "company representative"
      company = current_user.company
    elsif params[:allowlist_email][:company_id] != nil and current_user.usertype == "admin"
      company = Company.find_by_id(params[:allowlist_email][:company_id])
    else
      company = nil
    end

    @email = AllowlistEmail.new(email_params)
    @email.company_id = company ? company.id : nil
    if @email.save
      if company != nil
        company.allowlist_emails << @email
      end

      u = User.find_by(email: @email.email)
      if u != nil && @email.usertype == u.usertype && u.company == @email.company
        @email.users << u
      end

      render json: {
                allowlist_email: @email,
             }, status: :created
    else
      render json: {
               errors: @email.errors.full_messages,
             }, status: :internal_server_error
    end
  end

  def destroy
    @email = AllowlistEmail.find(params[:id])
    if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
      @email = nil
    end
    if @email
      @email.users.where(allowlist_domain_id: nil).destroy_all
      @email.users.update_all(allowlist_email_id: nil)
      @email.destroy

      render json: {
               errors: ["email deleted"],
             }, status: :ok
    else
      render json: {
               errors: ["email not found"],
             }, status: :not_found
    end
  end

  def transferPrimaryContact
    if current_user.usertype == "admin"
      info = admin_transfer_params
      to_user = User.find(info[:to])
    else
      info = rep_transfer_params
      to_user = User.find(info[:to])
      if current_user.allowlist_email.is_primary_contact == false || current_user.company_id != to_user.company_id
        render json: {
          errors: ["User does not have previleges for requested action"],
        }, status: :forbidden
        return
      end
    end

    if (to_user == nil ||
        to_user.usertype != "company representative")
      render json: {
               errors: ["User does not have previleges for requested action"],
             }, status: :forbidden
    else

      
      if to_user.allowlist_email == nil
        @email = AllowlistEmail.new(email: to_user.email, is_primary_contact:  false, usertype: "company representative")
        if @email.save
          to_user.company.allowlist_emails << @email
          @email.users << to_user
          to_user = User.find(info[:to])
        else
          render json: {
            errors: ["failed to create allowlist entry"],
          }, status: :internal_server_error
        end
      end
      
      from_users = to_user.company.allowlist_emails.update_all(is_primary_contact: false)
      to_user.allowlist_email.update(is_primary_contact: true)

      render json: {
               message: "transfer success",
             }, status: :ok
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

  def email_params
    if @current_user.usertype != "admin"
      params[:allowlist_email][:is_primary_contact] = false
      params[:allowlist_email][:usertype] = "company representative"
    end
    params.require(:allowlist_email).permit(:email, :usertype, :is_primary_contact)
  end

  def confirm_uniquness

    ep = email_params
    
    email = AllowlistEmail.where(usertype: params[:allowlist_email][:usertype]).where.like(email: params[:allowlist_email][:email])
    if params[:allowlist_email][:company_id]
      email = email.where(company_id: params[:allowlist_email][:company_id])
    end

    if email.first 
      render json: {
        errors: ["Allowlist entry already exists"],
      }, status: :forbidden
      return false
    end

    return true
  end

  def confirm_single_pc

    ep = email_params

    if params[:allowlist_email][:company_id] && params[:allowlist_email][:is_primary_contact]
      company = Company.find_by_id(params[:allowlist_email][:company_id])
      exiting_pc = company.allowlist_emails.find_by(is_primary_contact: true)
      if exiting_pc
        render json: {
          errors: ["Primary Contact already exists"],
        }, status: :forbidden
        return false
      end
    end
    return true
  end

  def admin_transfer_params
    params.permit(:to)
  end

  def rep_transfer_params
    params.permit(:to)
  end
end
