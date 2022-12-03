class FaqController < ApplicationController
  before_action :is_admin, except: [:show, :index]

    def index
        render json: { 
            faqs: Faq.all
        }, status: :ok
    end
  

    def show
        @faq = Faq.find_by_id(params[:id])
        if @faq
          render json: {
                   faq: @faq,
                 }, status: :ok
        else
          render json: {
                   errors: ["Faq not found"],
                 }, status: :not_found
        end
      end

    # def find
    #     uri = URI.parse(request.url)
    #     params = CGI.parse(uri.query)
    #     @faq = nil
    #     puts params
    #     if params.key?("question")
    #         @faq = Faq.find_by_question(params["question"])
    #     elsif params.key?("answer")
    #         # Use this only for testing purposes as firstname-lastname pair is not guarenteed to be unique.
    #         @faq = Faq.find_by answer: params["answer"]
    #     end
    #     if @faq
    #         render json: {
    #             faq: @faq,
    #         }, status: :ok
    #     else
    #         render json: {
    #                 errors: ["faq not found"],
    #                 }, status: :not_found
    #     end
    # end

    def new
        @faq = Faq.new
    end
        

    def create
            @faq = Faq.create(faq_params)
            render json: { 
                faq: @faq,
                message: "Faq created successfully"
            }, status: :ok
    end

    def destroy
        @faq = Faq.find(params[:id])
        if @faq.destroy
            render json: { 
                message: 'Faq deleted successfully'
            }, status: 200
        else
            render json: {
                errors: ["Something went wrong when deleting this FAQ"]
            }, status: :bad_request
        end

    end

    def edit
        # Returns an HTML form for editing a company
        @faq = Faq.find(params[:id])
    end

    def update
        @faq = Faq.find(params[:id])
    
        if @faq.update(faq_params)
            render json: { 
                faq: @faq
            }, status: :ok
        else
          render json: {
            errors: ["Could not edit faq"],
            }, status: :bad_request
        end
    end

    def faq_params
        params.require(:faq).permit(:question, :answer)
    end
end
