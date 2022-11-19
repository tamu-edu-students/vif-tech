require "rails_helper"

RSpec.describe User, type: :model do
  it "is valid with valid attributes" do
    expect(User.create(firstname: "John", lastname: "Doe", email: "hello@hello.com", password: "something")).to be_valid
  end
  it "is invalid without a firstname" do
    expect(User.create(lastname: "Doe", email: "hello@hello.com", password: "something")).to_not be_valid
  end

  it "is invalid without a lastname" do
    expect(User.create(firstname: "John", email: "hello@hello.com", password: "something")).to_not be_valid
  end

  it "is invalid without a email" do
    expect(User.create(firstname: "John", lastname: "Doe", password: "something")).to_not be_valid
  end

  it "is invalid without password" do
    expect(User.create(firstname: "John", lastname: "Doe", email: "hello@hello.com")).to_not be_valid
  end

  it "has confirm token enabled when email activation is executed" do
    user = User.create(firstname: "John", lastname: "Doe", email: "hello@hello.com", password: "something")
    expect(user.email_confirmed).to be(false)
    user.email_activate
    expect(user.email_confirmed).to be(true)
    expect(user.confirm_token).to be(nil)
  end

  it "has confirm token enabled when email activation is executed" do
    user = User.create(firstname: "John", lastname: "Doe", email: "hello@hello.com", password: "something")
    expect(user.confirm_token).to_not be(nil)
  end

  it "should filter owned meetings correctly based on availability" do
    User.create(firstname: "user2", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "volunteer")

    Meeting.create(owner_id: 2, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    Meeting.create(owner_id: 2, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    Meeting.create(owner_id: 2, title: "meeting3", start_time: "2022-10-18 14:50:00", end_time: "2022-10-18 14:51:00")
    Meeting.create(owner_id: 2, title: "meeting4", start_time: "2022-10-19 14:50:00", end_time: "2022-10-19 14:51:00")

    Availability.create(user_id: 2, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:40:00")
    Availability.create(user_id: 2, start_time: "2022-10-18 14:50:30", end_time: "2022-10-18 14:51:00")

    Meeting.find(1).update_attribute(:owner_id, 2)
    Meeting.find(2).update_attribute(:owner_id, 2)
    Meeting.find(3).update_attribute(:owner_id, 2)

    expect(User.find(2).owned_meetings_available_for).to match_array([Meeting.find(1)])
    expect(User.find(2).owned_meetings_not_available_for).to match_array([Meeting.find(2), Meeting.find(3), Meeting.find(4)])
  end

  it "should filter invited meetings correctly based on availability" do
    User.create(firstname: "user2", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "volunteer")

    Meeting.create(owner_id: 1, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    Meeting.create(owner_id: 1, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    Meeting.create(owner_id: 1, title: "meeting3", start_time: "2022-10-18 14:50:00", end_time: "2022-10-18 14:51:00")
    Meeting.create(owner_id: 1, title: "meeting4", start_time: "2022-10-19 14:50:00", end_time: "2022-10-19 14:51:00")

    Availability.create(user_id: 2, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:40:00")
    Availability.create(user_id: 2, start_time: "2022-10-18 14:50:30", end_time: "2022-10-18 14:51:00")

    UserMeeting.create(meeting_id: 1, user_id: 2, status: :accepted)
    UserMeeting.create(meeting_id: 2, user_id: 2, status: :pending)
    UserMeeting.create(meeting_id: 3, user_id: 2, status: :pending)
    UserMeeting.create(meeting_id: 4, user_id: 2, status: :pending)

    expect(User.find(2).meeting_invitations_available_for).to match_array([UserMeeting.find(1)])
    expect(User.find(2).meeting_invitations_not_available_for).to match_array([UserMeeting.find(2), UserMeeting.find(3), UserMeeting.find(4)])
  end
end
