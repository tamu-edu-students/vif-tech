require 'rails_helper'

RSpec.describe "Focis", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/foci/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /index" do
    it "returns http success" do
      get "/foci/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/foci/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/foci/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/foci/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end
