require 'rails_helper'

RSpec.describe "SocialLinks", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/social_links/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/social_links/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get "/social_links/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /edit" do
    it "returns http success" do
      get "/social_links/edit"
      expect(response).to have_http_status(:success)
    end
  end

end
