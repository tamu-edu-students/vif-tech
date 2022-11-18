class Availability < ApplicationRecord
  belongs_to :user
  validates :user, presence: true
  validate :is_user_corporate_or_volunteer?, if: :user
  validates :start_time, comparison: { less_than: :end_time }

  private

  def is_user_corporate_or_volunteer?
    if self.user.usertype != "company representative" and self.user.usertype != "volunteer"
      self.errors.add(:base, "#{self.user.usertype} cannot add availability.")
    end
  end
end
