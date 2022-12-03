class Event < ApplicationRecord
  has_many :event_signups, dependent: :destroy
  has_many :users, through: :event_signups, source: :user
  has_many :meetings, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  validates :start_time, comparison: { less_than: :end_time }
  validate :plausible_registration_time

  def as_json(options = {})
    ret = super(options)
    ret["users"] = self.users.as_json
    return ret
  end

  private

  def plausible_registration_time
    if registration_start_time and registration_end_time and registration_start_time > registration_end_time
      errors.add(:registration_start_time, "is later than registration_end_time")
    end
  end
end
