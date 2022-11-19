class SocialLinksController < ApplicationController
  before_action :get_about
  before_action :current_social_link, only: [:show, :edit, :update, :destroy]

  def index
    @social_links = @about.social_links
  end

  def show
  end

  def new
    @social_link = @about.social_link.build
  end

  def create
    @social_link = @about.social_links.build(social_link_params)

    respond_to do |format|
      if @social_link.save
        format.html { redirect_to about_social_link_path(@about), notice: 'Social_link was succesfully created.' }
        format.json { render :show, status: :created, location: @social_link }
      else
        format.html { render new }
        format.json { render json: @social_link.errors, status: :unprocessable_entity }
      end
    end
  end   


  def edit
  end

  def update
    respond_to do |format|
      if @social_link.update(social_link_params)
        format.html { redirect_to about_social_link_path(@about), notice: 'Social_link was successfully updated.' }
        format.json { render :show, status: :ok, location: @social_link }
      else
        format.html { render edit }
        format.json { render json: @social_link.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @social_link.destroy 
    respond_to do |format|
      format.html { redirect_to about_social_links_path(@about), notice: 'Social_link was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def get_about
    @about = About.find(params[:about_id])
  end

  def social_link_params
    params.require(:social_link).permit(:facebook, :youtube, :portfolio, :twitter, :linkedin, :github, :about_id)
  end


  def current_social_link
    @social_link = SocialLink.find(params[:id])
  end

end
