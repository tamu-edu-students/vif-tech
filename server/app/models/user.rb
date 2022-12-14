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
            :inclusion => { :in => ["company representative", "student", "faculty", "admin", "volunteer"],
                            :message => "%{value} is not a valid usertype" }

  validates :class_semester, 
            :inclusion => { :in => ['spring','summer','fall'], 
                            :message => "class_semester must be spring, summer, or fall" }, 
            :allow_nil => true

  validates :class_year, :inclusion => { :in => 2022..2027, 
                            :message => "class_year must be in 2022-2027" },
            :allow_nil => true

  validates :profile_img_src, :format => { with: URI.regexp}, if: :profile_img_src, unless: :profile_img_src.nil?
  validates :portfolio_link, :format => { with: URI.regexp}, if: :portfolio_link, unless: :portfolio_link.nil?
  validates :resume_link, :format => { with: URI.regexp}, if: :resume_link, unless: :resume_link.nil?
  validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i}


  has_many :owned_meetings, foreign_key: :owner, class_name: "Meeting", dependent: :destroy
  has_many :user_meetings, dependent: :destroy
  has_many :invited_meetings, through: :user_meetings, source: :meeting

  has_many :availabilities, dependent: :destroy

  has_many :event_signups, dependent: :destroy
  has_many :events, through: :event_signups, source: :event

  has_many :user_focuses, dependent: :destroy, class_name: "UserFocus"
  has_many :focuses, through: :user_focuses, source: :focus

  belongs_to :allowlist_domain, optional: true
  belongs_to :allowlist_email, optional: true

  def as_json(options = {})
    options[:except] ||= [:password_digest]
    res = super(options)
    return res
  end

  def email_activate
    self.email_confirmed = true
    self.confirm_token = nil
    save!
  end

  def accepted_meetings
    return UserMeeting.where(status: :accepted, user: self).map { |um| um.meeting }
  end

  def pending_meetings
    return UserMeeting.where(status: :pending, user: self).map { |um| um.meeting }
  end

  def cancelled_meetings
    return UserMeeting.where(status: :cancelled, user: self).map { |um| um.meeting }
  end

  def declined_meetings
    return UserMeeting.where(status: :declined, user: self).map { |um| um.meeting }
  end

  def owned_meetings_available_for
    # NOTE: if we end up with more than 10^4 meetings, this will take a while to return
    meetings = []
    availabilities.each { |x| meetings |= x.associated_owned_meetings }
    return meetings
  end

  def owned_meetings_not_available_for
    return owned_meetings - owned_meetings_available_for
  end

  def meeting_invitations_available_for
    # NOTE: if we end up with more than 10^4 meetings, this will take a while to return
    return UserMeeting.where(user: self, meeting: invited_meetings_available_for)
  end

  def meeting_invitations_not_available_for
    meetings = invited_meetings - invited_meetings_available_for
    return UserMeeting.where(user: self, meeting: meetings)
  end

  private

  def set_confirm_token
    if self.confirm_token.blank?
      self.confirm_token = SecureRandom.urlsafe_base64.to_s
    end
  end

  def invited_meetings_available_for
    meetings = []
    availabilities.each { |x| meetings |= x.associated_invited_meetings }
    return meetings
  end
end
