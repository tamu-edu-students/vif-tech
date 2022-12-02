class AllowlistDomain < ApplicationRecord
    validates :domain, presence: true
    validates :domain, uniqueness: { scope: [:usertype, :company_id] }
    validates :domain, format: { with: /\A((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
    validates :usertype,
    :inclusion  => { :in => [ 'company representative', 'student', 'faculty', 'admin', 'volunteer'],
                     :message    => "%{value} is not a valid usertype" }
    belongs_to :company, optional: true

    has_many :users#, dependent: :destroy_if_not_allowed
end
