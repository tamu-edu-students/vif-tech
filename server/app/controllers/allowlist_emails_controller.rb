class AllowlistEmailsController < ApplicationController
    before_action :confirm_user_logged_in
    before_action :confirm_requester_is_rep_or_admin, only: [:create, :delete, :index, :show, :transferPrimaryContact]

    def index
        @emails = AllowlistEmail.all

        if current_user.usertype == "company representative"
            @emails = @emails.filter {|e| e.company == current_user.company}
        end

           if @emails
              render json: {
              emails: @emails
           }, status: :ok
          else
              render json: {
              errors: ['no emails found']
          }, status: :internal_server_error
         end
    end
    
    def show
       @email = AllowlistEmail.find(params[:id])
       if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
            @email=nil
       end

        if @email
            render json: {
            email: @email
        }, status: :ok
        else
            render json: {
            errors: ['email not found']
        }, status: :not_found
        end
      end
      
      def create

        if current_user.usertype == "company representative"
            company = current_user.company
        elsif params[:email][:company_id] != nil and current_user.usertype == "admin"
            company = Company.find_by_id(params[:email][:company_id])
        else
            company = nil
        end

        @email = AllowlistEmail.new(email_params)
        if @email.save
            if company != nil
                company.allowlist_emails << @email
            end

            u = User.find_by(email: @email.email)
            if u != nil && @email.usertype == u.usertype && u.company == @email.company
                @email.users << u
            end
            

            render json: {
            email: @email
        }, status: :created
        else 
            render json: {
            errors: @email.errors.full_messages
        }, status: :internal_server_error
        end

      end

      def destroy

        @email = AllowlistEmail.find(params[:id])
        if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
            @email=nil
        end
        if @email 
            
           @email.users.where(allowlist_domain_id: nil).destroy_all
           @email.users.update_all(allowlist_email_id: nil)
           @email.destroy

           render json: {
            errors: ['email deleted']
            }, status: :ok
        
        else
           render json: {
           status: 500,
           errors: ['email not found']
            }, status: :not_found
        end
      end

      def transferPrimaryContact
        if current_user.usertype == "admin"
            info = admin_transfer_params
            to_user = User.find(info[:to])
            from_user = User.find(info[:from])
        else
            info = rep_transfer_params
            to_user = User.find(info[:to])
            from_user = current_user
        end

        if  (
            to_user == nil ||
            from_user == nil ||
            to_user.allowlist_email == nil || 
            from_user.allowlist_email == nil || 
            from_user.allowlist_email.isPrimaryContact <= 0 ||
            to_user.company_id != from_user.company_id ||
            to_user.usertype != "company representative" ||
            from_user.usertype != "company representative")
           
            render json: {
                errors: ["User does not have previleges for requested action"],
            }, status: :forbidden
            
        else
            to_user.allowlist_email.update(isPrimaryContact: 1)
            from_user.allowlist_email.update(isPrimaryContact: 0)

            render json: {
                message: "transfer success"
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

    def confirm_requester_is_rep_or_admin()
        if !(current_user.usertype == "admin" || 
            (current_user.usertype == "company representative" && 
            current_user.company != nil && 
            current_user.allowlist_email != nil &&
            current_user.allowlist_email.isPrimaryContact > 0))
        render json: {
            errors: ["User does not have previleges for requested action"],
        }, status: :forbidden
        return false
        end
        return true
    end
  
      
     def email_params
        if params[:email] != nil && params[:email][:email] != nil
           params[:email][:email] = params[:email][:email].downcase
        end
        if @current_user.usertype != "admin"
            params[:email][:isPrimaryContact] = false
        end
        params.require(:email).permit(:email, :usertype, :isPrimaryContact)
     end

     def admin_transfer_params
        params.permit(:to, :from)
     end

     def rep_transfer_params
        params.permit(:to)
     end
end