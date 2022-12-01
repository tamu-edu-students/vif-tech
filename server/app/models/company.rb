class Company < ApplicationRecord
    has_many :users
    has_many :allowlist_domains, dependent: :destroy
    has_many :allowlist_emails, dependent: :destroy
    validates :name, presence: true, uniqueness: true
end
