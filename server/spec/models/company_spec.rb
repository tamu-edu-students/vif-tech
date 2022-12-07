require 'rails_helper'

RSpec.describe Company, type: :model do
  
  it "is valid with valid attributes added via update" do
    c = Company.create(name: "Disney")
    expect(c).to be_valid
  end

  it "is valid with valid attributes added via update" do
    c = Company.create(name: "Disney")
    c.update(logo_img_src: "http://www.google.com")
    expect(c).to be_valid
    expect(c.logo_img_src).to eq("http://www.google.com")
    c.update(logo_img_src: nil)
    expect(c).to be_valid
    expect(c.logo_img_src).to be(nil)
    c.update(location: "tre")
    expect(c).to be_valid
    expect(c.location).to eq("tre")
    expect(c.hiring_for_intern).to be(false)
    c.update(hiring_for_intern: true)
    expect(c).to be_valid
    expect(c.hiring_for_intern).to be(true)
  end

  it "is not valid with valid attributes added via update" do
    c = Company.create(name: "Disney")
    c.update(logo_img_src: "gfesgresgr")
    expect(c).to_not be_valid
  end
  it "is not valid with valid attributes added via update" do
    c = Company.create(name: "Disney")
    c.update(website_link: "gfesgresgr")
    expect(c).to_not be_valid
  end
end
