require "rails_helper"

RSpec.describe Meeting, type: :model do
  it "is valid with valid attributes" do
    user = User.create(username: "someone", email: "hello@hello.com", password: "something")
    expect(Meeting.create(owner_id: user.id, title: "some title", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to be_valid
  end

  it "is invalid with end time earlier than start time" do
    user = User.create(username: "someone", email: "hello@hello.com", password: "something")
    expect(Meeting.create(owner_id: user.id, title: "some title", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 11:20:00")).to_not be_valid
  end

  it "is invalid without start time" do
    user = User.create(username: "someone", email: "hello@hello.com", password: "something")
    expect(Meeting.create(owner_id: user.id, title: "some title", end_time: "2022-10-18 14:20:00")).to_not be_valid
  end

  it "is invalid without endtime" do
    user = User.create(username: "someone", email: "hello@hello.com", password: "something")
    expect(Meeting.create(owner_id: user.id, title: "some title", start_time: "2022-10-18 14:20:00")).to_not be_valid
  end

  it "is invalid without owner" do
    user = User.create(username: "someone", email: "hello@hello.com", password: "something")
    expect(Meeting.create(title: "some title", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to_not be_valid
  end

  it "should display correct relationships" do
    user1 = User.create(username: "user1", email: "user1@hello.com", password: "something")
    user2 = User.create(username: "user2", email: "user2@hello.com", password: "something")
    user3 = User.create(username: "user3", email: "user3@hello.com", password: "something")
    user4 = User.create(username: "user4", email: "user4@hello.com", password: "something")
    user5 = User.create(username: "user5", email: "user5@hello.com", password: "something")
    user6 = User.create(username: "user6", email: "user6@hello.com", password: "something")

    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    meeting2 = Meeting.create(owner_id: user2.id, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")

    expect(meeting1).to be_valid
    expect(meeting2).to be_valid

    UserMeeting.create(meeting: meeting1, user: user2, accepted: true)
    UserMeeting.create(meeting: meeting1, user: user3, accepted: true)
    UserMeeting.create(meeting: meeting1, user: user5, accepted: true)
    UserMeeting.create(meeting: meeting1, user: user4, accepted: false)
    UserMeeting.create(meeting: meeting1, user: user6, accepted: false)

    UserMeeting.create(meeting: meeting2, user: user1, accepted: true)
    UserMeeting.create(meeting: meeting2, user: user5, accepted: true)
    UserMeeting.create(meeting: meeting2, user: user6, accepted: true)
    UserMeeting.create(meeting: meeting2, user: user3, accepted: false)
    UserMeeting.create(meeting: meeting2, user: user4, accepted: false)

    expect(user1.owned_meetings).to eq([meeting1])
    expect(user1.attending_meetings).to eq([meeting2])
    expect(user1.pending_meetings).to eq([])
    expect(user1.invited_meetings).to eq([meeting2])

    expect(user2.owned_meetings).to eq([meeting2])
    expect(user2.attending_meetings).to eq([meeting1])
    expect(user2.pending_meetings).to eq([])
    expect(user2.invited_meetings).to eq([meeting1])

    expect(user3.owned_meetings).to eq([])
    expect(user3.attending_meetings).to eq([meeting1])
    expect(user3.pending_meetings).to eq([meeting2])

    expect(user4.owned_meetings).to eq([])
    expect(user4.attending_meetings).to eq([])
    expect(user4.pending_meetings).to eq([meeting1, meeting2])

    expect(user5.owned_meetings).to eq([])
    expect(user5.attending_meetings).to eq([meeting1, meeting2])
    expect(user5.pending_meetings).to eq([])

    for user in [user3, user4, user5, user6]
      user.invited_meetings = [meeting1, meeting2]
    end

    expect(meeting1.owner).to eq(user1)
    expect(meeting1.attendees).to eq([user2, user3, user5])
    expect(meeting1.pending_invitees).to eq([user4, user6])

    expect(meeting2.owner).to eq(user2)
    expect(meeting2.attendees).to eq([user1, user5, user6])
    expect(meeting2.pending_invitees).to eq([user3, user4])
  end
end
