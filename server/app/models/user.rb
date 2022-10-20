class User < ApplicationRecord
  before_create :set_confirm_token
  has_secure_password
  validates :username, presence: true
  validates :username, uniqueness: true
  validates :username, length: {minimum: 4}
  validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
    :message    => "%{value} is not a valid usertype" }

  has_and_belongs_to_many :companies

  def email_activate
    self.email_confirmed = true
    self.confirm_token = nil
    save!
  end

  private
  def set_confirm_token
    if self.confirm_token.blank?
      self.confirm_token = SecureRandom.urlsafe_base64.to_s
    end
  end

end
