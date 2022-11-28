class Event < ApplicationRecord
  has_many :event_signups
  has_many :users, through: :event_signups, source: :user
  validates :start_time, comparison: { less_than: :end_time }
end
