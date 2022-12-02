class Meeting < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :event, class_name: "Event", optional: true
  has_many :user_meetings, dependent: :destroy
  has_many :invitees, through: :user_meetings, source: :user
  validates :start_time, comparison: { less_than: :end_time }

  def as_json(options = {})
    ret = super(options)
    ret["invitees"] = {}
    for status in UserMeeting.valid_status
      ret["invitees"][status] = self.invites_by_status(status).as_json
    end
    return ret
  end

  def attendees
    ret = []
    for user_meeting in user_meetings
      if user_meeting.status == "accepted"
        ret.push(user_meeting.user)
      end
    end
    return ret
  end

  def pending_invitees
    ret = []
    for user_meeting in user_meetings
      if user_meeting.status != "accepted"
        ret.push(user_meeting.user)
      end
    end
    return ret
  end

  def invites_by_status(status)
    ret = []
    for user_meeting in user_meetings
      if user_meeting.status == status
        ret.push(user_meeting.user)
      end
    end
    return ret
  end
end
