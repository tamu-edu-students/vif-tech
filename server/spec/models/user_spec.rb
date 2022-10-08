require 'rails_helper'

RSpec.describe User, type: :model do
  subject{
    User.new(
      usertype: 'company representative',
      username: 'user1',
      email: 'user1@tamu.edu',
      password: 'password',
      password_confirmation: 'password'
    )
  }

  it 'is valid with valid attributes' do
    expect(subject).to be_valid
  end

  it 'is not valid if not a valid usertype' do
    usertypes = ['company representative', 'student', 'faculty', 'admin', 'volunteer']
    if usertypes.include?(subject.usertype) == false
      expect(subject).to_not be_valid
    end
  end

  it 'is not valid if the username is not 8 chars long or contains chars other than numbers|letters|-|_|.' do
    if subject.username.match?(/[\w\.-]+/) == false && subject.username.length < 8
      expect(subject).to_not be_valid
    end
  end

  it 'is not valid if the email contains chars other than numbers|letters|@|.|-|_' do
    if subject.email.match?(/[\w\.-]+@[\w\.-]+\.[a-zA-Z]+/) == false
      expect(subject).to_not be_valid
    end
  end

  it 'is not valid if password not equal to password_confirmation' do
    if subject.password != subject.password_confirmation
      expect(subject).to_not be_valid
    end
  end
end

'''
before_create :confirmation_token
  has_secure_password
  validates :password, length: {minimum: 8}
  validates :username, presence: true
  validates :username, uniqueness: true
  validates :username, length: {minimum: 4}
  validates :usertype,
    :inclusion  => { :in => [ company representative, student, faculty, admin, volunteer],
    :message    => "%{value} is not a valid usertype" }
'''