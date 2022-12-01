require "rails_helper"

RSpec.describe EventSignup, type: :model do
  it "is valid with valid attributes" do
    user = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "admin")
    event = Event.create(title: "Event 1", description: "This is event 1", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    expect(EventSignup.create(user: user, event: event)).to be_valid
  end

  it "is invalid with invalid attributes" do
    user = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "admin")
    event = Event.create(title: "Event 1", description: "This is event 1", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    expect(EventSignup.create(user_id: user.id + 100, event: event)).to_not be_valid
  end

  it "is should fetch association correctly" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "admin")
    user2 = User.create(firstname: "user2", lastname: "doe", email: "user2@hello.com", password: "something", usertype: "admin")
    user3 = User.create(firstname: "user3", lastname: "doe", email: "user3@hello.com", password: "something", usertype: "admin")
    event1 = Event.create(title: "Event 1", description: "This is event 1", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    event2 = Event.create(title: "Event 2", description: "This is event 2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00")
    expect(EventSignup.create(user: user1, event: event1)).to be_valid
    expect(EventSignup.create(user: user2, event: event1)).to be_valid
    expect(EventSignup.create(user: user2, event: event2)).to be_valid
    expect(EventSignup.create(user: user3, event: event2)).to be_valid
    expect(event1.users).to match_array([user1, user2])
    expect(event2.users).to match_array([user2, user3])
    expect(user1.events).to match_array([event1])
    expect(user2.events).to match_array([event1, event2])
    expect(user3.events).to match_array([event2])
  end
end
