class AllowlistDomainsController < ApplicationController
    
    def index
        @domains = AllowlistDomain.all
           if @domains
              render json: {
              domains: @domains
           }
          else
              render json: {
              status: 500,
              errors: ['no domains found']
          }
         end
    end
    def show
       @domain = AllowlistDomain.find(params[:id])
           if @domain
              render json: {
              domain: @domain
           }
           else
              render json: {
              status: 500,
              errors: ['domain not found']
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
         @domain = AllowlistDomain.new(domain_params)
             if @domain.save
                 render json: {
                 status: 201,
                 domain: @domain
             }
            else 
                render json: {
                status: 500,
                errors: @domain.errors.full_messages
            }
            end
        end
      end

      def destroy
        @domain = AllowlistDomain.find(params[:id])
        if @domain 
            @domain.destroy
           render json: {
            status: 200,
            errors: ['domain deleted']
            }
        
        else
           render json: {
           status: 500,
           errors: ['domain not found']
            }
        end
      end

private
      
     def domain_params
        if params[:domain] != nil && params[:domain][:email_domain] != nil
           params[:domain][:email_domain] = params[:domain][:email_domain].downcase
        end
         params.require(:domain).permit(:email_domain, :usertype)
     end
end