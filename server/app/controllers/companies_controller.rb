class CompaniesController < ApplicationController
    def index
        # Displays all companies
        @companies = Company.all
        render json: {
            # status: 201,
            companies: @companies,
        }
    end

    def new
        # Returns an HTML form for creating a new company
        @company = Company.new
    end

    def create
        # Creates a new company
        @company = Company.new(company_params)
        if @company.save
            render json: {
                status: 201,
                company: @company,
            }
        else
            render json: {
                status: 500,
                errors: ["Something went wrong when saving this company"],
            }
        end
    end

    def show
        # Displays a specific company
        @company = Company.find(params[:id])
        if @company
            render json: {
                company: @company,
            }
        else
            render json: {
                status: 500,
                errors: ["company not found"],
            }
        end
    end

    def edit
        # Returns an HTML form for editing a company
        @company = Company.find(params[:id])
    end

    def update
        # Updates a specific company
        @company = Company.find(params[:id])
        if Company.update(params)
            render json: {
                status: 201,
                company: @company,
            }
        else
            render json: {
                status: 500,
                errors: ["something went wrong when updating this company"],
            }
        end
    end

    def destroy
        # Deletes a specific company
        @company = Company.find(params[:id])
        if @company.destroy
            render json: {
                status: 201,
                company: @company,
            }
        else
            render json: {
                status: 500,
                errors: ["something went wrong when deleting this company"],
            }
        end
    end

    private

    def company_params
        params.require(:company).permit(:name, :description)
    end
end
