class User < ApplicationRecord
  belongs_to :company, optional: true
  before_create :set_confirm_token
  has_secure_password
  validates :email, presence: true
  validates :email, uniqueness: true
  validates :email, email: true
  validates :firstname, presence: true
  validates :firstname, length: { minimum: 1 }
  validates :lastname, presence: true
  validates :lastname, length: { minimum: 1 }
  validates :usertype,
            :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
                     :message    => "%{value} is not a valid usertype" }

  has_many :owned_meetings, foreign_key: :owner, class_name: "Meeting", dependent: :destroy
  has_many :user_meetings, dependent: :destroy
  has_many :invited_meetings, through: :user_meetings, source: :meeting

  def as_json(options = {})
    options[:except] ||= [:password_digest]
    super(options)
  end

  def email_activate
    self.email_confirmed = true
    self.confirm_token = nil
    save!
  end

  def attending_meetings
    ret = []
    for user_meeting in user_meetings
      if user_meeting.accepted
        ret.push(user_meeting.meeting)
      end
    end
    return ret
  end

  def pending_meetings
    ret = []
    for user_meeting in user_meetings
      if !user_meeting.accepted
        ret.push(user_meeting.meeting)
      end
    end
    return ret
  end

  private

  def set_confirm_token
    if self.confirm_token.blank?
      self.confirm_token = SecureRandom.urlsafe_base64.to_s
    end
  end
end
