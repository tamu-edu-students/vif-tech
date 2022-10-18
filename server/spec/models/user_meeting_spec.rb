require "rails_helper"

RSpec.describe UserMeeting, type: :model do
  it "is valid with valid attributes" do
    user1 = User.create(username: "user1", email: "user1@hello.com", password: "something")
    user2 = User.create(username: "user2", email: "user2@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    expect(UserMeeting.create(meeting: meeting1, user: user2, accepted: true)).to be_valid
  end

  it "is invalid when the owner is the invitee" do
    user1 = User.create(username: "user1", email: "user1@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    expect { UserMeeting.create(meeting: meeting1, user: user1, accepted: true) }.to raise_error("The owner of the meeting cannot be invited to the same meeting")
  end

  it "is invalid when the invitee is already invited" do
    user1 = User.create(username: "user1", email: "user1@hello.com", password: "something")
    user2 = User.create(username: "user2", email: "user2@hello.com", password: "something")
    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    UserMeeting.create(meeting: meeting1, user: user2, accepted: true)
    expect { UserMeeting.create(meeting: meeting1, user: user2, accepted: true) }.to raise_error("Provided user is already an invitee to the meeting.")
  end
end
