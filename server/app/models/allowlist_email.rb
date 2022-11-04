class AllowlistEmail < ApplicationRecord
    validates :email, presence: true
    validates :email, uniqueness: { scope: :usertype }
    validates :email, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
    validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
                     :message    => "%{value} is not a valid usertype" }
    belongs_to :company, optional: true

    has_many :users#, dependent: :destroy_if_not_allowed
end
