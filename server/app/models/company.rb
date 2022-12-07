class Company < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :allowlist_domains, dependent: :destroy
  has_many :allowlist_emails, dependent: :destroy

  has_many :company_focuses, dependent: :destroy, class_name: "CompanyFocus"
  has_many :focuses, through: :company_focuses, source: :focus

  validates :name, presence: true, uniqueness: true

  validates :logo_img_src, :format => { with: URI.regexp}, if: :logo_img_src, unless: :logo_img_src.nil?
  validates :website_link, :format => { with: URI.regexp}, if: :website_link, unless: :website_link.nil?
  
end
