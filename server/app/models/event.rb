class Event < ApplicationRecord
  has_many :event_signups, dependent: :destroy
  has_many :users, through: :event_signups, source: :user
  has_many :meetings, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  validates :start_time, comparison: { less_than: :end_time }
end
