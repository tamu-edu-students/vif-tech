class User < ApplicationRecord
  has_secure_password
  validates :password, length: {minimum: 8}
  validates :username, presence: true
  validates :username, uniqueness: true
  validates :username, length: { minimum: 4 }
  validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
    :message    => "%{value} is not a valid usertype" }
end
