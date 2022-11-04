class AllowlistDomainsController < ApplicationController
    before_action :confirm_user_logged_in
    before_action :confirm_requester_is_rep_or_admin, only: [:create, :delete, :index, :show]

    def index
        @domains = AllowlistDomain.all

        if current_user.usertype == "representative"
            @domains = @domains.filter {|e| e.company == current_user.company}
        end

           if @domains
              render json: {
                status: 200,
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
        if current_user.usertype == "representative" and @domain.company_id != current_user.company_id
            @domain=nil
        end
           if @domain
              render json: {
              status: 200,
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

        if current_user.usertype == "representative"
            company = current_user.company
        elsif params[:domain][:company_id] != nil and current_user.usertype == "admin"
            company = Company.find_by_id(params[:domain][:company_id])
        else
            company = nil
        end

        @domain = AllowlistDomain.new(domain_params)
        if @domain.save
            if company != nil
                company.allowlist_domains << @domain
            end
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

      def destroy

        @domain = AllowlistDomain.find(params[:id])
        if current_user.usertype == "representative" and @domain.company_id != current_user.company_id
            @domain=nil
        end
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
    def confirm_user_logged_in
        if !(logged_in? && current_user)
        render json: {
            status: 500,
            errors: ["User not logged in"],
        }
        end
    end

    def confirm_requester_is_rep_or_admin()
        if !(current_user.usertype == "admin" || (current_user.usertype == "representative" && current_user.company != nil))
          render json: {
            status: 400,
            errors: ["User does not have previleges for requested action"],
          }
          return false
        end
        return true
    end
      
     def domain_params
        if params[:domain] != nil && params[:domain][:email_domain] != nil
           params[:domain][:email_domain] = params[:domain][:email_domain].downcase
        end
        params.require(:domain).permit(:email_domain, :usertype)
     end
end