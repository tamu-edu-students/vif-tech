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
            :inclusion => { :in => ["representative", "student", "faculty", "admin", "volunteer"],
                            :message => "%{value} is not a valid usertype" }

  has_many :owned_meetings, foreign_key: :owner, class_name: "Meeting", dependent: :destroy
  has_many :user_meetings, dependent: :destroy
  has_many :invited_meetings, through: :user_meetings, source: :meeting

  belongs_to :allowlist_domain, optional: true
  belongs_to :allowlist_email, optional: true

  def as_json(options = {})
    options[:except] ||= [:password_digest]
    super(options)
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

  private

  def set_confirm_token
    if self.confirm_token.blank?
      self.confirm_token = SecureRandom.urlsafe_base64.to_s
    end
  end
end
