class Availability < ApplicationRecord
  belongs_to :user
  validates :user, presence: true
  validate :is_user_corporate_or_volunteer?, if: :user
  validates :start_time, comparison: { less_than: :end_time }

  def associated_invited_meetings
    return associated_meetings(user.invited_meetings)
  end

  def associated_owned_meetings
    return associated_meetings(user.owned_meetings)
  end

  def associated_meetings(meetings)
    return meetings.where(:start_time => self.start_time..self.end_time)
             .or(meetings.where(:end_time => self.start_time..self.end_time))
  end

  private

  def is_user_corporate_or_volunteer?
    if self.user.usertype != "company representative" and self.user.usertype != "volunteer"
      self.errors.add(:base, "#{self.user.usertype} cannot add availability.")
    end
  end
end
