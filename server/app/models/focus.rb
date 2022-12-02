class Focus < ApplicationRecord
  has_many :company_focuses, dependent: :destroy, class_name: "CompanyFocus"
  has_many :companies, through: :company_focuses, source: :company

  has_many :user_focuses, dependent: :destroy, class_name: "UserFocus"
  has_many :users, through: :user_focuses, source: :user

  validates :name, presence: true, uniqueness: true

  def as_json(options = {})
    ret = super(options)
    ret["users"] = self.users.as_json
    ret["companies"] = self.companies.as_json
    return ret
  end
end
