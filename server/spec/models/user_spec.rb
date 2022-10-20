require "rails_helper"

RSpec.describe User, type: :model do
  it "is valid with valid attributes" do
    expect(User.create(username: "hello", email: "hello@hello.com", password: "something")).to be_valid
  end
  it "is invalid without a username" do
    expect(User.create(email: "hello@hello.com", password: "something")).to_not be_valid
  end

  it "is invalid without password" do
    expect(User.create(username: "hello", email: "hello@hello.com")).to_not be_valid
  end

  it "has confirm token enabled when email activation is executed" do
    user = User.create(username: "hello", email: "hello@hello.com", password: "something")
    expect(user.email_confirmed).to be(false)
    user.email_activate
    expect(user.email_confirmed).to be(true)
    expect(user.confirm_token).to be(nil)
  end

  it "has confirm token enabled when email activation is executed" do
    user = User.create(username: "hello", email: "hello@hello.com", password: "something")
    expect(user.confirm_token).to_not be(nil)
  end

  it { should validate_presence_of(:username) }
  it { should validate_presence_of(:password) }
  it {
    should validate_length_of(:username)
             .is_at_least(4)
  }
end
