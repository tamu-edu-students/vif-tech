require 'rails_helper'

RSpec.describe "Abouts", type: :request do
  describe "GET /index" do
    it "gets a specific about content" do
     
      get abouts_url

      person = {
        "firstname": "Gary", "lastname": "Cox",
        "rank": "director", "imgSrc": "www.garycox.com",
        "social_links": {"facebook": "facebook.com", "twitter": "twitter.com"}
      }
      about = About.new person
      get "/abouts/new"
      
    end   
  end

  describe "GET /show" do
    it "gives a successful response" do

      person = {
        "firstname": "Gary", "lastname": "Cox",
        "rank": "director", "imgSrc": "www.garycox.com",
        "social_links": {"facebook": "facebook.com", "twitter": "twitter.com"}
      }
      about = About.create! person
      get about_url(about)
      expect(response).to have_http_status(200)

    end

  end
end
