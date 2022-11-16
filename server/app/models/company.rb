class Company < ApplicationRecord
    has_many :users
    has_many :allowlist_domains
    has_many :allowlist_emails
    validates :name, presence: true, uniqueness: true

    def showForStudent(company_id)
        Company.select('id, name, description, logo_src').find_by_id(company_id) # nil or record obj
    end

end
