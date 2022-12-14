class UserMeeting < ApplicationRecord
  belongs_to :meeting
  belongs_to :user
  before_create :owner_not_invitee
  before_create :duplicate_invitee
  validates :status,
            :inclusion => { :in => :valid_status,
                            :message => "%{value} is not a valid status" }

  class_attribute :valid_status, default: ["pending", "accepted", "cancelled", "declined"]

  def owner_not_invitee
    if self.meeting.owner == self.user
      raise "The owner of the meeting cannot be invited to the same meeting"
    end
  end

  def duplicate_invitee
    if self.meeting.invitees.include? self.user
      raise "Provided user is already an invitee to the meeting."
    end
  end
end
