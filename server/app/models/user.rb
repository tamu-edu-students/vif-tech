class User < ApplicationRecord
  before_create :set_confirm_token
  has_secure_password
  validates :email, presence: true
  validates :email, uniqueness: true
  validates :firstname, presence: true
  validates :firstname, length: {minimum: 1}
  validates :lastname, presence: true
  validates :lastname, length: {minimum: 1}
  validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
                     :message    => "%{value} is not a valid usertype" }


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
