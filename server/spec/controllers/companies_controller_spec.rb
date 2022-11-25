require "rails_helper"

RSpec.describe CompaniesController, :type => :controller do

    before(:each) do
        
        
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
        User.create(firstname: "j", lastname: "s", email: "js@student.com", password: "pw", usertype: "student")
        User.create(id: 4, firstname: "a", lastname: "s", email: "a@disney.com", password: "pw", usertype: "company representative", company_id: 1)
    end

    describe "POST create" do 
        it "should create a company if logged in as admin" do
            
            hash = {:name => 'pixar', :description => 'bal'}
            post :create, :params => {:company => hash}, :session => {:user_id => 1}
            expect(response).to have_http_status(:created) 
            expect(response.content_type).to eq "application/json; charset=utf-8"
            parsed_body = JSON.parse(response.body)
            
            expect(parsed_body["company"]['name']).to eq('pixar')
            expect(parsed_body["company"]['description']).to eq('bal')
        end

        it "should not create a company if logged in as student" do
            hash = {:name => 'disney2', :id => 2, :description => 'bal'}
            user = User.find_by_email('js@student.com')
            
            expect do
                post :create, :params => {:company => hash}, :session => {:user_id => user.id}
            end.not_to change{Company.count}
            expect(response).to have_http_status(:forbidden)
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
        end

        it "should not create a company if logged in as admin but company name not given" do
            hash = {:description => 'bal'}
            post :create, :params => {:company => hash}, :session => {:user_id => 1}
            expect(response).to have_http_status(:internal_server_error)
        end

        it "should not create a company if logged in as admin but company name already taken" do
            hash = {:name => 'disney', :description => 'bal'}
            post :create, :params => {:company => hash}, :session => {:user_id => 1}
            expect(response).to have_http_status(:internal_server_error)
        end
    end

    describe "GET index" do
        it "should display all available fields of 1 or more companies if logged in as admin" do
            user = User.find_by email: 'admin@admin.com'
            session["user_id"] = user.id 
            get :index
            expect(response).to have_http_status(:ok)
            p 'companies_controller_spec.rb index 1'
            parsed_body = JSON.parse(response.body)
        end

        it "should display some fields of 1 or more companies if logged in as student" do
            p 'companies_controller_spec.rb index 2'
            user=User.find_by email: 'js@student.com' 
            session["user_id"] = user.id 
            expect(user.id).to eq(2)
            get :public_index
            expect(response).to have_http_status(:ok)
            parsed_body = JSON.parse(response.body)
            
            
            parsed_body["companies"].each do |record|
                expect(record.keys).to eq(["id", "name", "description", "created_at", "updated_at"])
            end
        end
        
        it "should display some fields of 1 or more companies if logged in as representative" do
            p 'companies_controller_spec.rb index 3'
            user=User.find_by email: 'a@disney.com' 
            session["user_id"] = user.id 
            expect(user.id).to eq(4)
            get :public_index
            expect(response).to have_http_status(:ok)
            parsed_body = JSON.parse(response.body)
            
            parsed_body["companies"].each do |record|
                expect(record.keys).to eq(["id", "name", "description", "created_at", "updated_at"])
            end
        end

        it "should display '[]' if there is 0 companies" do
            AllowlistDomain.delete_all
            AllowlistEmail.delete_all
            User.delete(4) 
            Company.delete_all
            user=User.find_by email: 'admin@admin.com'
            session["user_id"] = user.id
            get :index
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["companies"]).to eq([])
        end

        it "should display '[]' if there is 0 companies in db --public index" do
            AllowlistDomain.delete_all
            AllowlistEmail.delete_all
            User.delete(4) 
            Company.delete_all

            user=User.find_by email: 'js@student.com'
            session["user_id"] = user.id
            
            get :public_index
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["companies"]).to eq([])
        end
    end

    describe "GET show" do
        
        it "should display all available fields of any one company if logged in as admin" do
            user = User.find_by email: 'admin@admin.com'
            session["user_id"] = user.id
            get :show, :params => {:id => 3}
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["company"]["name"]).to eq('dreamworks')
            expect(parsed_body["company"].keys).to eq(["id", "name", "description", "created_at", "updated_at"])
            parsed_body["allowlist_domains"].each do |record|
                expect(record.keys).to eq(["id", "email_domain", "usertype", "company_id"])
            end
            parsed_body["allowlist_emails"].each do |record|
                expect(record.keys).to match_array(["id", "email", "usertype", "company_id", "created_at", "updated_at", "isPrimaryContact"])
            end
        end

        it "should only display some fields of any one company for a student" do
            user = User.find_by email: 'js@student.com'
            session["user_id"] = user.id
            get :show, :params => {:id => 3}
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["company"].keys).not_to include("allowlist_emails", "allowlist_domains")
            expect(parsed_body["company"].keys).to eq(["id", "name", "description", "created_at", "updated_at"])

            parsed_body = JSON.parse(response.body)
        end

        it "should display some fields of a company that is not the representative's own" do
            user = User.find_by email: 'a@disney.com'
            session["user_id"] = user.id
            get :show, :params => {:id => 3}
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["company"].keys).not_to include("allowlist_emails", "allowlist_domains")
            expect(parsed_body["company"].keys).to eq(["id", "name", "description", "created_at", "updated_at"])
        end

        it "should display some fields of the representative's own company" do
            user = User.find_by email: 'a@disney.com'
            session["user_id"] = user.id
            company_id = Company.find_by name: 'disney'
            get :show, :params => {:id => company_id} 
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["company"].keys).not_to include("allowlist_emails", "allowlist_domains")
            expect(parsed_body["company"].keys).to eq(["id", "name", "description", "created_at", "updated_at"])
        end

        it "should display 'company not found' if that one company is not found" do
            user = User.find_by email: 'a@disney.com' 
            session["user_id"] = user.id
            get :show, :params => {:id => 10000}
            expect(response).to have_http_status :not_found
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["errors"]).to eq(["company not found"])
        end
    end

    describe "update" do
        it "should let admin edit all fields of any one company" do
            user = User.find_by email: 'admin@admin.com'
            session["user_id"] = user.id
            patch :update, :params => {:id => 3, :company=>{ id: 4, name: "xyz", description: "20.2"}} 
            parsed_body = JSON.parse(response.body)
        end

        it "should not let rep edit all fields of a company that is NOT the representative's own" do
            user = User.find_by email: 'a@disney.com'
            session["user_id"] = user.id
            
            
            patch :update, :params => {:id => 3, :company=>{name: "xyznnnn", description: "wa", logo: 'Loogo'}}
            expect(response).to have_http_status(:forbidden)
        end

        it "should let rep edit all fields of a company that is the representative's own" do
            user = User.find_by email: 'a@disney.com'
            session["user_id"] = user.id
            patch :update, :params => {:id => 1, :company=>{name: "xyznnnn", description: "wa", logo: 'Loogo'}}
            expect(response).to have_http_status(:ok)
        end

        it "should not let student edit all fields of any one company" do
            user = User.find_by email: 'js@student.com'
            session["user_id"] = user.id
            patch :update, :params => {:id => 1, :company=>{name: "xyznnnn", description: "wa", logo: 'Loogo'}}
            expect(response).to have_http_status(:forbidden)
            parsed_body = JSON.parse(response.body)
            
            expect(parsed_body["errors"]).to eq(["User does not have previleges for requested action"])
        end

        it "should display 'no such company found for editting' if that one company is not found" do
            email = 'admin@admin.com'
            p 'trying "'+email+'", :params with :company part'

            user = User.find_by email: email 
            session["user_id"] = user.id
            
            patch :update, :params => {:id => 10000, :company=>{name: "xyznnnn", description: "wa", logo: 'Loogo'}}
            expect(response).to have_http_status(:not_found)
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["errors"]).to eq(["no such company found for editting"])
        end
    end

    describe "destroy" do
        it "should let admin to delete that company" do
            email = 'admin@admin.com'
            p 'trying '+email

            AllowlistDomain.where(company_id: 1).destroy_all
            AllowlistEmail.where(company_id: 1).destroy_all
            User.where(company_id: 1).destroy_all

            user = User.find_by email: email
            session["user_id"] = user.id
            
            delete :destroy, :params => {:id => 1}
            expect(response).to have_http_status(:ok)
            parsed_body = JSON.parse(response.body)
        end

        it "should not let student to delete that company" do
            email = 'js@student.com'
            p 'trying '+email

            AllowlistDomain.where(company_id: 1).destroy_all
            AllowlistEmail.where(company_id: 1).destroy_all
            User.where(company_id: 1).destroy_all

            user = User.find_by email: email
            session["user_id"] = user.id
            
            delete :destroy, :params => {:id => 1}
            expect(response).to have_http_status(:forbidden)
        end

        it "should not let representative to delete that company" do
            email = 'a@disney.com'
            p 'trying '+email

            AllowlistDomain.where(company_id: 3).destroy_all
            AllowlistEmail.where(company_id: 3).destroy_all
            User.where(company_id: 3).destroy_all

            user = User.find_by email: email
            session["user_id"] = user.id
            
            delete :destroy, :params => {:id => 3}
            expect(response).to have_http_status(:forbidden)
        end

        it "should display 'no such company found for deleting' if that one company is not found" do
            email = 'admin@admin.com'
            p 'trying '+email

            AllowlistDomain.where(company_id: 10000).destroy_all
            AllowlistEmail.where(company_id: 10000).destroy_all
            User.where(company_id: 10000).destroy_all

            user = User.find_by email: email
            session["user_id"] = user.id
            
            delete :destroy, :params => {:id => 10000}
            expect(response).to have_http_status(:not_found)
            parsed_body = JSON.parse(response.body)
            expect(parsed_body["errors"]).to eq(["no such company found for deleting"])
        end
    end

    describe "company count, user count" do
        it "shows current count of companies and users in the test db" do
            p 'current User table contains '+User.count.to_s+' users:'
            p 'current Company table contains '+Company.count.to_s+' companies:'
        end
    end
end
