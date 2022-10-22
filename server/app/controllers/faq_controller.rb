class FaqController < ApplicationController
    before_action :is_admin, except: [:show, :index]

    def index
        @faqs = Faq.all
        render json: { faqs: faqs }
    end

    def show
        @faq = Faq.find(params[:id])
        render json: { faq: faq }
    end

    def create
            faq = Faq.create(faq_params)
            render json: { faq: faq }
    end

    def destroy
            @faq = Faq.find(params[:id])
            @faq.destroy
            render json: { status: 200, 
                message: 'Faq deleted successfuly'
            }

    end

    def update
        @faq = Faq.find(params[:id])
    
        if @faq.update(faq_params)
            render json: { status: 200, 
                message: 'Faq updated successfuly'
            }
        else
          render json: {
            status: 400,
            errors: ["Could not edit faq"],
            }
        end
    end

    def faq_params
        params.require(:faq).permit(:question, :answer)
    end
end

