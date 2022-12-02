require "rails_helper"

RSpec.describe UserFocus, type: :model do
  before(:each) do
    @focus1 = Focus.create(name: "anime design")
    @focus2 = Focus.create(name: "visualizations")
    @admin = User.find(1)
    @student = User.create(id: 3, firstname: "j", lastname: "s", email: "js@student.com", password: "pw", usertype: "student")
    @student.email_activate
  end

  it "valid with valid attributes" do
    expect(UserFocus.create(user: User.find(3), focus: @focus1)).to be_valid
  end

  it "invalid with invalid attributes" do
    expect(UserFocus.create(user: nil, focus: @focus2)).to_not be_valid
  end
end
