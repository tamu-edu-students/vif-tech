require 'rails_helper'

# run this file by rspec ./spec/requests/foci_spec.rb

RSpec.describe "Foci", type: :request do
  before(:each) do
    @focus1 = Focus.create(focus: 'anime design')
    @focus2 = Focus.create(focus: 'visualizations')
    Company.create(name: "disney", description: "blah")
    Company.create(id: 3, name: "dreamworks", description: "blah")
    AllowlistDomain.create(email_domain: "disney.com", usertype: "company representative", company_id: 1)
    AllowlistDomain.create(email_domain: "waltdisney.com", usertype: "company representative", company_id: 1)
    AllowlistDomain.create(email_domain: "dreamworks.com", usertype: "company representative", company_id: 3)
    AllowlistEmail.create(email: "a@disney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "b@disney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "a@waltdisney.com", usertype: "company representative", company_id: 1)
    AllowlistEmail.create(email: "c@dreamworks.com", usertype: "company representative", company_id: 3)
    AllowlistEmail.create(email: "d@dreamworks.com", usertype: "company representative", company_id: 3)
    @admin = User.find(1)
    @student = User.create(id:3, firstname: "j", lastname: "s", email: "js@student.com", password: "pw", usertype: "student")
    @student.email_activate
    @rep = User.create(id: 2, firstname: "a", lastname: "s", email: "a@disney.com", password: "pw", usertype: "company representative", company_id: 1)
    @rep.email_activate
  end

  describe "GET /foci --index" do
    it "lets admin see all foci in the db" do
      p '===============foci_spec.rb index 1'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      
    end

    it "lets student see all foci in the db" do
      p '===============foci_spec.rb index 2'
      p 'trying student'
      post "/login", :params=>{:user=>{:email=>'js@student.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci'
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:ok)
      
    end

    it "lets representative see all foci in the db" do
      p '===============foci_spec.rb index 3'
      p 'trying rep'
      post "/login", :params=>{:user=>{:email=>'a@disney.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci'
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:ok)
      
    end

    it "no data" do
      p '===============foci_spec.rb index 4'
      p 'trying admin'
      Focus.destroy_all
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["foci"]).to eq([])
      
    end

    it "if not signed up and logged in no access" do
      p '===============foci_spec.rb index 5'
      p 'trying guest'
      get '/foci'
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
    end
  end

  describe "POST /foci --create" do
    it "lets admin create an " do
      p '===============foci_spec.rb create 1'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      post '/foci', :params=>{:focus=>{:focus=>'ganme design'}}
      expect(response).to have_http_status(:created)
      
    end

    it "does not let admin if focus name not given" do
      p '===============foci_spec.rb create 2'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      post '/foci', :params=>{:focus=>{:focus=>nil}}
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:internal_server_error) 
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["focus name not provided"])
      
    end

    it "does not let if focus name already taken" do
      p '===============foci_spec.rb create 3'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      post '/foci', :params=>{:focus=>{:focus=>'anime design'}}
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:internal_server_error)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["this focus name already taken"]) 
      
    end

    it "does not let student" do
      p '===============foci_spec.rb create 4'
      p 'trying student'
      post "/login", :params=>{:user=>{:email=>'js@student.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      
      expect(parsed_body["logged_in"]).to eq(true)
      post '/foci', :params=>{:focus=>{:focus=>'game design'}}
      expect(session["user_id"]).to eq(3) 
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
    end

    it "does not let rep" do
      p '===============foci_spec.rb create 5'
      p 'trying rep'
      post "/login", :params=>{:user=>{:email=>'a@disney.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      
      expect(parsed_body["logged_in"]).to eq(true)
      post '/foci', :params=>{:focus=>{:focus=>'game design'}}
      expect(session["user_id"]).to eq(2) 
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
    end
  end

  describe "GET /foci/:id --show" do
    it "lets admin" do
      p '===============foci_spec.rb show 1'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      
      get '/foci/1'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      
    end

    it "lets student" do
      p '===============foci_spec.rb show 2'
      p 'trying student'
      post "/login", :params=>{:user=>{:email=>'js@student.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci/1'
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      
    end

    it "lets rep" do
      p '===============foci_spec.rb show 3'
      p 'trying rep'
      post "/login", :params=>{:user=>{:email=>'a@disney.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci/1'
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      
    end

    it "not found" do
      p '===============foci_spec.rb show 4'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      get '/foci/10000'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['errors']).to eq(["focus not found"])
      
    end

    it "if not registered and logged in" do 
      p '===============foci_spec.rb show 5'
      p 'trying guest'
      get '/foci/1'
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['errors']).to eq(["User does not have previleges for requested action"])
      
    end
  end

  describe "PUT /foci/:id --update" do
    it "lets admin" do
      p '===============foci_spec.rb update 1'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put '/foci/1', :params=>{:focus=>{:focus=>'zgagahy'}}
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["focus"]["focus"]).to eq('zgagahy')
      
    end

    it "not let student" do
      p '===============foci_spec.rb update 2'
      p 'trying student'
      post "/login", :params=>{:user=>{:email=>'js@student.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put '/foci/1', :params=>{:focus=>{:focus=>'zgagahy'}}
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
    end

    it "not let rep" do
      p '===============foci_spec.rb update 3'
      p 'trying rep'
      post "/login", :params=>{:user=>{:email=>'a@disney.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put '/foci/1', :params=>{:focus=>{:focus=>'zgagahy'}}
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
    end

    it "not found" do
      p '===============foci_spec.rb update 4'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      put '/foci/10000', :params=>{:focus=>{:focus=>'zgagahy'}}
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["no such focus found for editting"])
      
    end
  end

  describe "DELETE /foci/:id --destroy" do
    it "lets admin" do
      p '==============foci_spec.rb delete 1'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete '/foci/1'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["focus"]["focus"]).to eq('anime design')
      
      get '/foci'
      parsed_body = JSON.parse(response.body)
      
    end

    it "not let student" do
      p '==============foci_spec.rb delete 2'
      p 'trying student'
      post "/login", :params=>{:user=>{:email=>'js@student.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete '/foci/1'
      expect(session["user_id"]).to eq(3)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
      get '/foci'
      parsed_body = JSON.parse(response.body)
      
    end

    it "not let rep" do
      p '==============foci_spec.rb delete 3'
      p 'trying rep'
      post "/login", :params=>{:user=>{:email=>'a@disney.com',:password=>'pw'} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete '/foci/1'
      expect(session["user_id"]).to eq(2)
      expect(response).to have_http_status(:forbidden)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
      
      get '/foci'
      parsed_body = JSON.parse(response.body)
      
    end

    it "not found" do
      p '===================foci_spec.rb delete 4'
      p 'trying admin'
      post "/login", :params=>{:user=>{:email=>'admin@admin.com',:password=>ENV["ADMIN_PW"]} }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["logged_in"]).to eq(true)
      delete '/foci/100000'
      expect(session["user_id"]).to eq(1)
      expect(response).to have_http_status(:not_found)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["errors"]).to eq(["no such focus found for deleting"])
      
      get '/foci'
      parsed_body = JSON.parse(response.body)
      
    end
  end
end
