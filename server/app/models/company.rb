class Company < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :allowlist_domains, dependent: :destroy
  has_many :allowlist_emails, dependent: :destroy

  has_many :company_focuses, dependent: :destroy, class_name: "CompanyFocus"
  has_many :focuses, through: :company_focuses, source: :focus

  validates :name, presence: true, uniqueness: true
end
