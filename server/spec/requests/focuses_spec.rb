require "rails_helper"

# run this file by rspec ./spec/requests/focuses_spec.rb

RSpec.describe "Focuses", type: :request do
  before(:each) do
    @focus1 = Focus.create(focus: "anime design")
    @focus2 = Focus.create(focus: "visualizations")
    Company.create(name: "disney", description: "blah")
    Company.create(id: 3, name: "dreamworks", description: "blah")
    AllowlistDomain.create(domain: "disney.com", usertype: "company representative", company_id: 1)
    AllowlistDomain.create(domain: "waltdisney.com", usertype: "company representative", company_id: 1)
    AllowlistDomain.create(domain: "dreamworks.com", usertype: "company representative", company_id: 3)
    AllowlistEmail.create(email: "a@disney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "b@disney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "a@waltdisney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "c@dreamworks.com", usertype: "company representative", company_id: 3)
    AllowlistEmail.create(email: "d@dreamworks.com", usertype: "company representative", company_id: 3)
    @admin = User.find(1)
    @student = User.create(id: 3, firstname: "j", lastname: "s", email: "js@student.com", password: "pw", usertype: "student")
    @student.email_activate
    @rep = User.create(id: 2, firstname: "a", lastname: "s", email: "a@disney.com", password: "pw", usertype: "company representative", company_id: 1)
    @rep.email_activate
  end

  describe "GET /focuses --index" do
    it "lets admin see all focuses in the db" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
    end

    it "lets student see all focuses in the db" do
      post "/login", :params => { :user => { :email => "js@student.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses"
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:ok)
    end

    it "lets representative see all focuses in the db" do
      post "/login", :params => { :user => { :email => "a@disney.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses"
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:ok)
    end

    it "no data" do
      Focus.destroy_all
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["focuses"]).to eq([])
    end
  end

  describe "POST /focuses --create" do
    it "lets admin create an " do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      post "/focuses", :params => { :focus => { :focus => "ganme design" } }
      expect(response).to have_http_status(:created)
    end

    it "does not let admin if focus name not given" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      post "/focuses", :params => { :focus => { :focus => nil } }
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:internal_server_error)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["focus name not provided"])
    end

    it "does not let if focus name already taken" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      post "/focuses", :params => { :focus => { :focus => "anime design" } }
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:internal_server_error)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["this focus name already taken"])
    end

    it "does not let student" do
      post "/login", :params => { :user => { :email => "js@student.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)

      expect(parsed_body["logged_in"]).to eq(true)
      post "/focuses", :params => { :focus => { :focus => "game design" } }
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
    end

    it "does not let rep" do
      post "/login", :params => { :user => { :email => "a@disney.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)

      expect(parsed_body["logged_in"]).to eq(true)
      post "/focuses", :params => { :focus => { :focus => "game design" } }
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
    end
  end

  describe "GET /focuses/:id --show" do
    it "lets admin" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)

      get "/focuses/1"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
    end

    it "lets student" do
      post "/login", :params => { :user => { :email => "js@student.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses/1"
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
    end

    it "lets rep" do
      post "/login", :params => { :user => { :email => "a@disney.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses/1"
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
    end

    it "not found" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get "/focuses/10000"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["focus not found"])
    end
  end

  describe "PUT /focuses/:id --update" do
    it "lets admin" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put "/focuses/1", :params => { :focus => { :focus => "zgagahy" } }
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["focus"]["focus"]).to eq("zgagahy")
    end

    it "not let student" do
      post "/login", :params => { :user => { :email => "js@student.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put "/focuses/1", :params => { :focus => { :focus => "zgagahy" } }
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
    end

    it "not let rep" do
      post "/login", :params => { :user => { :email => "a@disney.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put "/focuses/1", :params => { :focus => { :focus => "zgagahy" } }
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
    end

    it "not found" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put "/focuses/10000", :params => { :focus => { :focus => "zgagahy" } }
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["no such focus found for editting"])
    end
  end

  describe "DELETE /focuses/:id --destroy" do
    it "lets admin" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete "/focuses/1"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["focus"]["focus"]).to eq("anime design")

      get "/focuses"
      parsed_body = JSON.parse(response.body)
    end

    it "not let student" do
      post "/login", :params => { :user => { :email => "js@student.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete "/focuses/1"
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])

      get "/focuses"
      parsed_body = JSON.parse(response.body)
    end

    it "not let rep" do
      post "/login", :params => { :user => { :email => "a@disney.com", :password => "pw" } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete "/focuses/1"
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])

      get "/focuses"
      parsed_body = JSON.parse(response.body)
    end

    it "not found" do
      post "/login", :params => { :user => { :email => "admin@admin.com", :password => ENV["ADMIN_PW"] } }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete "/focuses/100000"
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["no such focus found for deleting"])

      get "/focuses"
      parsed_body = JSON.parse(response.body)
    end
  end
end
