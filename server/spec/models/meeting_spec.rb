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
    User.create(username: "user1", email: "user1@hello.com", password: "something", usertype: "admin")
    User.create(username: "user2", email: "user2@hello.com", password: "something", usertype: "admin")
    User.create(username: "user3", email: "user3@hello.com", password: "something")
    User.create(username: "user4", email: "user4@hello.com", password: "something")
    User.create(username: "user5", email: "user5@hello.com", password: "something")
    User.create(username: "user6", email: "user6@hello.com", password: "something")

    Meeting.create(owner_id: 1, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    Meeting.create(owner_id: 2, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")

    expect(Meeting.find(1)).to be_valid
    expect(Meeting.find(2)).to be_valid

    UserMeeting.create(meeting_id: 1, user_id: 2, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 3, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 5, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 4, accepted: false)
    UserMeeting.create(meeting_id: 1, user_id: 6, accepted: false)

    UserMeeting.create(meeting_id: 2, user_id: 1, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 5, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 6, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 3, accepted: false)
    UserMeeting.create(meeting_id: 2, user_id: 4, accepted: false)

    expect(User.find(1).owned_meetings).to match_array([Meeting.find(1)])
    expect(User.find(1).attending_meetings).to match_array([Meeting.find(2)])
    expect(User.find(1).pending_meetings).to match_array([])
    expect(User.find(1).invited_meetings).to match_array([Meeting.find(2)])

    expect(User.find(2).owned_meetings).to match_array([Meeting.find(2)])
    expect(User.find(2).attending_meetings).to match_array([Meeting.find(1)])
    expect(User.find(2).pending_meetings).to match_array([])
    expect(User.find(2).invited_meetings).to match_array([Meeting.find(1)])

    expect(User.find(3).owned_meetings).to match_array([])
    expect(User.find(3).attending_meetings).to match_array([Meeting.find(1)])
    expect(User.find(3).pending_meetings).to match_array([Meeting.find(2)])

    expect(User.find(4).owned_meetings).to match_array([])
    expect(User.find(4).attending_meetings).to match_array([])
    expect(User.find(4).pending_meetings).to match_array([Meeting.find(1), Meeting.find(2)])

    expect(User.find(5).owned_meetings).to match_array([])
    expect(User.find(5).attending_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    expect(User.find(5).pending_meetings).to match_array([])

    for user in [User.find(3), User.find(4), User.find(5), User.find(6)]
      expect(user.invited_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    end

    expect(Meeting.find(1).owner).to eq(User.find(1))
    expect(Meeting.find(1).attendees).to match_array([User.find(2), User.find(3), User.find(5)])
    expect(Meeting.find(1).pending_invitees).to match_array([User.find(4), User.find(6)])

    expect(Meeting.find(2).owner).to eq(User.find(2))
    expect(Meeting.find(2).attendees).to match_array([User.find(1), User.find(5), User.find(6)])
    expect(Meeting.find(2).pending_invitees).to match_array([User.find(3), User.find(4)])
  end

  it "should display correct relationships after some things are destroyed" do
    User.create(username: "user1", email: "user1@hello.com", password: "something", usertype: "admin")
    User.create(username: "user2", email: "user2@hello.com", password: "something", usertype: "admin")
    User.create(username: "user3", email: "user3@hello.com", password: "something")
    User.create(username: "user4", email: "user4@hello.com", password: "something")
    User.create(username: "user5", email: "user5@hello.com", password: "something")
    User.create(username: "user6", email: "user6@hello.com", password: "something")

    Meeting.create(owner_id: 1, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")
    Meeting.create(owner_id: 2, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")

    expect(Meeting.find(1)).to be_valid
    expect(Meeting.find(2)).to be_valid

    UserMeeting.create(meeting_id: 1, user_id: 2, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 3, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 4, accepted: false)
    UserMeeting.create(meeting_id: 1, user_id: 5, accepted: true)
    UserMeeting.create(meeting_id: 1, user_id: 6, accepted: false)

    UserMeeting.create(meeting_id: 2, user_id: 1, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 5, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 6, accepted: true)
    UserMeeting.create(meeting_id: 2, user_id: 3, accepted: false)
    UserMeeting.create(meeting_id: 2, user_id: 4, accepted: false)

    expect(Meeting.find(1).invitees).to match_array([User.find(2), User.find(3), User.find(4), User.find(5), User.find(6)])
    expect(Meeting.find(2).invitees).to match_array([User.find(1), User.find(3), User.find(4), User.find(5), User.find(6)])
    expect(User.find(1).invited_meetings).to match_array([Meeting.find(2)])
    for user in [User.find(3), User.find(4), User.find(5), User.find(6)]
      expect(user.invited_meetings).to match_array([Meeting.find(1), Meeting.find(2)])
    end

    User.find(2).destroy # This should destroy relevant UserMeeting associations and Meeting.find(2)

    expect(Meeting.find(1).invitees).to match_array([User.find(3), User.find(4), User.find(5), User.find(6)])
    expect(User.find(1).invited_meetings).to match_array([])
    for user in [User.find(3), User.find(4), User.find(5), User.find(6)]
      expect(user.invited_meetings).to match_array([Meeting.find(1)])
    end

    Meeting.find(1).destroy
    for user in [User.find(1), User.find(3), User.find(4), User.find(5), User.find(6)]
      expect(user.invited_meetings).to match_array([])
    end
  end
end
