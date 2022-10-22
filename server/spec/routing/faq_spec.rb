require "rails_helper"

RSpec.describe "route for faqs", type: :routing do
  it "routes /faqs requests to the faq index action" do
    
    expect(:get => "/faq").to route_to("faq#index")
  end

  it "routes to #show action" do
    expect(:get => "/faq/:id").to route_to(:controller => "faq", :action => "show", :id => ":id")
  end

  it "routes to #update" do
    expect(:patch => "/faq/:id").to route_to(:controller => "faq", :action => "update", :id => ":id")
  end

  it "routes to #create" do
    expect(:post => "/faq").to route_to(:controller => "faq", :action => "create")
  end

  it "routes to #destroy" do
    expect(:delete => "/faq/:id").to route_to(:controller => "faq", :action => "destroy", :id => ":id")
  end
  
end
