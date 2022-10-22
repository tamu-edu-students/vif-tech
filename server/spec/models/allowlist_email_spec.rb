require 'rails_helper'

RSpec.describe AllowlistEmail, type: :model do
  it "is valid with valid attributes" do
    ad = AllowlistEmail.create(email: "gmaer@test.edu", usertype: "student")
    expect(ad).to be_valid
  end

  it "is valid with valid attributes" do
    ad = AllowlistEmail.create(email: "ur_mum@test.engr.edu", usertype: "admin")
    expect(ad).to be_valid
  end

  it "is invalid with invalid attributes" do
    ad = AllowlistEmail.create(email: "test.edu", usertype: "student")
    expect(ad.valid?).to be false
  end

  it "is invalid with invalid attributes" do
    ad = AllowlistEmail.create(email: "test@test.edu", usertype: "gamer")
    expect(ad.valid?).to be false
  end
end
