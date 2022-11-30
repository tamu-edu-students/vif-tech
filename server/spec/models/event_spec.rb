require "rails_helper"

RSpec.describe Event, type: :model do
  it "is valid with valid attributes" do
    expect(Event.create(start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to be_valid
  end
  it "is invalid with invalid attributes" do
    expect(Event.create(start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 11:20:00")).to_not be_valid
  end

  it "should display event meetings correctly" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "admin")
    event1 = Event.create(start_time: "2022-10-18 11:10:00", end_time: "2022-10-18 11:20:00")
    event2 = Event.create(start_time: "2022-10-18 11:10:00", end_time: "2022-10-18 11:20:00")
    expect(event1).to be_valid
    expect(event2).to be_valid

    meeting1 = Meeting.create(owner_id: user1.id, title: "meeting1", start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00", event_id: event1.id)
    meeting2 = Meeting.create(owner_id: user1.id, title: "meeting2", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event1.id)
    meeting3 = Meeting.create(owner_id: user1.id, title: "meeting3", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event2.id)
    meeting4 = Meeting.create(owner_id: user1.id, title: "meeting4", start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event2.id)
    expect(meeting1).to be_valid
    expect(meeting2).to be_valid
    expect(meeting3).to be_valid
    expect(meeting4).to be_valid
    expect(meeting1.event).to eq(event1)
    expect(meeting2.event).to eq(event1)
    expect(meeting3.event).to eq(event2)
    expect(meeting4.event).to eq(event2)

    expect(event1.meetings).to match_array([meeting1, meeting2])
    expect(event2.meetings).to match_array([meeting3, meeting4])
  end

  it "should display event availabilities correctly" do
    user1 = User.create(firstname: "user1", lastname: "doe", email: "user1@hello.com", password: "something", usertype: "company representative")
    event1 = Event.create(start_time: "2022-10-18 11:10:00", end_time: "2022-10-18 11:20:00")
    event2 = Event.create(start_time: "2022-10-18 11:10:00", end_time: "2022-10-18 11:20:00")
    expect(event1).to be_valid
    expect(event2).to be_valid

    availability1 = Availability.create(user_id: user1.id, start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00", event_id: event1.id)
    availability2 = Availability.create(user_id: user1.id, start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event1.id)
    availability3 = Availability.create(user_id: user1.id, start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event2.id)
    availability4 = Availability.create(user_id: user1.id, start_time: "2022-10-18 14:30:00", end_time: "2022-10-18 14:50:00", event_id: event2.id)
    expect(availability1).to be_valid
    expect(availability2).to be_valid
    expect(availability3).to be_valid
    expect(availability4).to be_valid
    expect(availability1.event).to eq(event1)
    expect(availability2.event).to eq(event1)
    expect(availability3.event).to eq(event2)
    expect(availability4.event).to eq(event2)

    expect(event1.availabilities).to match_array([availability1, availability2])
    expect(event2.availabilities).to match_array([availability3, availability4])
  end
end
