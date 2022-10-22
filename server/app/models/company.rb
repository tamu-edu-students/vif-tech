class Company < ApplicationRecord
    has_many :users
    has_many :allowlist_domains
    has_many :allowlist_emails
    validates :name, presence: true, uniqueness: true
end
