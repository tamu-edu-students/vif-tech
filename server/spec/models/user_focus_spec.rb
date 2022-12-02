require "rails_helper"

RSpec.describe UserFocus, type: :model do
  before(:each) do
    @focus1 = Focus.create(name: "anime design")
    @focus2 = Focus.create(name: "visualizations")
    @admin = User.find(1)
    @student1 = User.create(firstname: "j", lastname: "s", email: "js@student.com", password: "pw", usertype: "student")
    @student1.email_activate
    @student2 = User.create(firstname: "a", lastname: "b", email: "ab@student.com", password: "pw", usertype: "student")
    @student2.email_activate
  end

  it "valid with valid attributes" do
    expect(UserFocus.create(user: User.find(3), focus: @focus1)).to be_valid
  end

  it "invalid with invalid attributes" do
    expect(UserFocus.create(user: nil, focus: @focus2)).to_not be_valid
  end

  it "focus returns students correctly" do
    UserFocus.create(user: @student1, focus: @focus1)
    UserFocus.create(user: @student2, focus: @focus1)
    UserFocus.create(user: @student2, focus: @focus2)
    expect(@focus1.as_json["users"]).to match_array([@student1.as_json, @student2.as_json])
    expect(@focus2.as_json["users"]).to match_array([@student2.as_json])
  end
end
