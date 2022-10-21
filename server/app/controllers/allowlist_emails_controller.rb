class AllowlistEmailsController < ApplicationController
    
    def index
        @emails = AllowlistEmail.all
           if @emails
              render json: {
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
           if @email
              render json: {
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
        if current_user == nil
            render json: {
                status: 400,
                errors: "Not logged in"
            }
        elsif ! ( current_user.usertype == "admin" || (current_user.usertype == "company representative") ) # TODO And company == company
            render json: {
                status: 400,
                errors: "Permission denied"
            }
        else
         @email = AllowlistEmail.new(email_params)
             if @email.save
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
      end

      def destroy
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
      
     def email_params
        if params[:email] != nil && params[:email][:email] != nil
           params[:email][:email] = params[:email][:email].downcase
        end
         params.require(:email).permit(:email, :usertype)
     end
end