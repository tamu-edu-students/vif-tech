class Event < ApplicationRecord
  has_many :event_signups
  has_many :users, through: :event_signups, source: :user
  has_many :meetings
  has_many :availabilities
  validates :start_time, comparison: { less_than: :end_time }

  def as_json(options = {})
    ret = super(options)
    ret["users"] = self.users.as_json
    return ret
  end
end
