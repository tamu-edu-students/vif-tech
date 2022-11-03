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
                status: 200,
              emails: @emails
           }
          else
              render json: {
              status: 500,
              errors: ['no emails found']
          }
         end
    end
    
    def show
       @email = AllowlistEmail.find(params[:id])
       if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
            @email=nil
       end

        if @email
            render json: {
            status: 200,
            email: @email
        }
        else
            render json: {
            status: 500,
            errors: ['email not found']
        }
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
            render json: {
            status: 201,
            email: @email
        }
        else 
            render json: {
            status: 500,
            errors: @email.errors.full_messages
        }
        end

      end

      def destroy

        @email = AllowlistEmail.find(params[:id])
        if current_user.usertype == "company representative" and @email.company_id != current_user.company_id
            @email=nil
        end
        if @email 
           @email.destroy
           render json: {
            status: 200,
            errors: ['email deleted']
            }
        
        else
           render json: {
           status: 500,
           errors: ['email not found']
            }
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
                status: 400,
                errors: ["User does not have previleges for requested action"],
            }
            
        else
            to_user.allowlist_email.update(isPrimaryContact: 1)
            from_user.allowlist_email.update(isPrimaryContact: 0)

            render json: {
                status: 200
            }
        end

      end

private
    def confirm_user_logged_in
        if !(logged_in? && current_user)
        render json: {
            status: 500,
            errors: ["User not logged in"],
        }
        end
    end

    def confirm_requester_is_rep_or_admin()
        if !(current_user.usertype == "admin" || 
            (current_user.usertype == "company representative" && 
            current_user.company != nil && 
            current_user.allowlist_email != nil &&
            current_user.allowlist_email.isPrimaryContact > 0))
        render json: {
            status: 400,
            errors: ["User does not have previleges for requested action"],
        }
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