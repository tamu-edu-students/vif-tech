require "rails_helper"

RSpec.describe Event, type: :model do
  it "is valid with valid attributes" do
    expect(Event.create(start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 14:20:00")).to be_valid
  end
  it "is invalid with invalid attributes" do
    expect(Event.create(start_time: "2022-10-18 14:10:00", end_time: "2022-10-18 11:20:00")).to_not be_valid
  end
end
