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

  it "should display correct associated meetings" do
    User.create(firstname: "user2", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "volunteer")

    Meeting.create(owner_id: 1, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    Meeting.create(owner_id: 1, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    Meeting.create(owner_id: 1, title: "meeting2", start_time: "2022-10-18 14:50:00", end_time: "2022-10-18 14:51:00")

    Availability.create(user_id: 2, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:40:00")
    Availability.create(user_id: 2, start_time: "2022-10-18 14:50:30", end_time: "2022-10-18 14:51:00")

    UserMeeting.create(meeting_id: 1, user_id: 2, status: :accepted)
    UserMeeting.create(meeting_id: 2, user_id: 2, status: :pending)
    UserMeeting.create(meeting_id: 3, user_id: 2, status: :pending)

    expect(Availability.find(1).associated_invited_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    expect(Availability.find(2).associated_invited_meetings).to match_array([Meeting.find(3)])
    expect(Availability.find(1).associated_owned_meetings).to match_array([])
    expect(Availability.find(2).associated_owned_meetings).to match_array([])

    Meeting.find(1).update_attribute(:owner_id, 2)
    Meeting.find(2).update_attribute(:owner_id, 2)
    Meeting.find(3).update_attribute(:owner_id, 2)

    expect(Availability.find(1).associated_invited_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    expect(Availability.find(2).associated_invited_meetings).to match_array([Meeting.find(3)])
    expect(Availability.find(1).associated_owned_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    expect(Availability.find(2).associated_owned_meetings).to match_array([Meeting.find(3)])
  end
end
