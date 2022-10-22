class AllowlistDomain < ApplicationRecord
    validates :email_domain, presence: true
    validates :email_domain, uniqueness: { scope: :usertype }
    validates :email_domain, format: { with: /\A((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
    validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
                     :message    => "%{value} is not a valid usertype" }
    belongs_to :company, optional: true
end
