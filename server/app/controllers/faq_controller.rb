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

  def new
    @faq = Faq.new
  end

  def create
    faq = Faq.create(faq_params)
    render json: { faq: faq }
  end

  def destroy
    @faq = Faq.find(params[:id])
    @faq.destroy
    render json: {
             message: "Faq deleted successfuly",
           }, status: :ok
  end

  def update
    @faq = Faq.find(params[:id])

    if @faq.update(faq_params)
      render json: {
               message: "Faq updated successfuly",
             }, status: :ok
    else
      render json: {
               errors: ["Could not edit faq"],
             }, status: :internal_server_error
    end
  end

  def faq_params
    params.require(:faq).permit(:question, :answer)
  end
end
