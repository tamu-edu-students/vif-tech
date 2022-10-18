class Meeting < ApplicationRecord
  belongs_to :owner, class_name: "User"
  has_many :user_meetings
  has_many :invitees, through: :user_meetings, source: :user
  validates :start_time, comparison: { less_than: :end_time }

  def attendees
    ret = []
    for user_meeting in user_meetings
      if user_meeting.accepted
        ret.push(user_meeting.user)
      end
    end
    return ret
  end

  def pending_invitees
    ret = []
    for user_meeting in user_meetings
      if !user_meeting.accepted
        ret.push(user_meeting.user)
      end
    end
    return ret
  end
end
