require "rails_helper"

RSpec.describe Availability, type: :model do
  it "is valid with valid attributes" do
    user = User.create(firstname: "someone", lastname: "doe", email: "hello@hello.com", password: "something", usertype: "volunteer")
    expect(Availability.create(user_id: user.id, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to be_valid
  end

  it "is invalid with start time later than end time" do
    user = User.create(firstname: "someone", lastname: "doe", email: "hello@hello.com", password: "something")
    expect(Availability.create(user_id: user.id, start_time: "2022-10-18 14:20:00", end_time: "2022-10-18 14:10:00")).to_not be_valid
  end

  it "is invalid with fake user id" do
    expect(Availability.create(user_id: 100, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to_not be_valid
  end

  it "is invalid with invalid usertype" do
    user = User.create(firstname: "someone", lastname: "doe", email: "hello@hello.com", password: "something", usertype: "student")
    expect(Availability.create(user_id: user.id, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to_not be_valid
  end
end
