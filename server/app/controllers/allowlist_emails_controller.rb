class AllowlistEmailsController < ApplicationController
    before_action :confirm_user_logged_in
    before_action :confirm_requester_is_rep_or_admin, only: [:create, :delete, :index, :show]

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
       if current_user.usertype == "company representative" and @email.company_id != current_user.compay_id
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

        if current_user.usertype == "company representative" && current_user.company.id != params[:id]
            render json: {
                status: 400,
                errors: ['forbidden']
                 }
        end

        @email = AllowlistEmail.find(params[:id])
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
        if !(current_user.usertype == "admin" || (current_user.usertype == "company representative" && current_user.company != nil))
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
         params.require(:email).permit(:email, :usertype)
     end
end