require "rails_helper"

RSpec.describe UserMeeting, type: :model do
  it "is valid with valid attributes" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something")
    user2 = User.create(firstname: "user2", lastname: "doe", email: "user2@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    expect(UserMeeting.create(meeting: meeting1, user: user2, status: :accepted)).to be_valid
  end

  it "is invalid when the owner is the invitee" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    expect { UserMeeting.create(meeting: meeting1, user: user1, status: :accepted) }.to raise_error("The owner of the meeting cannot be invited to the same meeting")
  end

  it "is invalid when the invitee is already invited" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something")
    user2 = User.create(firstname: "user2", lastname: "doe", email: "user2@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    UserMeeting.create(meeting: meeting1, user: user2, status: :accepted)
    expect { UserMeeting.create(meeting: meeting1, user: user2, status: :accepted) }.to raise_error("Provided user is already an invitee to the meeting.")
  end
end
