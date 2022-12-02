require 'rails_helper'

RSpec.describe AllowlistDomain, type: :model do
  it "is valid with valid attributes" do
    ad = AllowlistDomain.create(domain: "test.edu", usertype: "student")
    expect(ad).to be_valid
  end

  it "is valid with valid attributes" do
    ad = AllowlistDomain.create(domain: "test.engr.edu", usertype: "admin")
    expect(ad).to be_valid
  end

  it "is invalid with invalid attributes" do
    ad = AllowlistDomain.create(domain: "blah@test.edu", usertype: "student")
    expect(ad.valid?).to be false
  end

  it "is invalid with invalid attributes" do
    ad = AllowlistDomain.create(domain: "test.edu", usertype: "gamer")
    expect(ad.valid?).to be false
  end
end
