class FaqController < ApplicationController
    before_action :is_admin, except: [:show, :index]

    def index
        @faqs = Faq.all
        render json: { faqs: @faqs }
    end

    def show
        @faq = Faq.find_by_id(params[:id])
        if @faq
          render json: {
                   faq: @faq,
                 }
        else
          render json: {
                   status: 500,
                   errors: ["Faq not found"],
                 }
        end
      end

    def find
        uri = URI.parse(request.url)
        params = CGI.parse(uri.query)
        @faq = nil
        puts params
        if params.key?("question")
            @faq = Faq.find_by_question(params["question"])
        elsif params.key?("answer")
            # Use this only for testing purposes as firstname-lastname pair is not guarenteed to be unique.
            @faq = Faq.find_by answer: params["answer"]
        end
        if @faq
            render json: {
            faq: @faq,
            }
        else
            render json: {
                    status: 500,
                    errors: ["faq not found"],
                    }
        end
    end

    def new
        @faq = Faq.new
    end
        

    def create
            faq = Faq.create(faq_params)
            render json: { faq: faq,
                message: "Faq created successfully"
            }
    end

    def destroy
            @faq = Faq.find(params[:id])
            @faq.destroy
            render json: { status: 200, 
                message: 'Faq deleted successfully'
            }

    end

    def update
        @faq = Faq.find(params[:id])
    
        if @faq.update(faq_params)
            render json: { status: 200, 
                message: 'Faq updated successfully'
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

