class AllowlistUniquenessOnCompanyEmailUsertype < ActiveRecord::Migration[7.0]
  def change
    remove_index :allowlist_domains, name:"index_allowlist_domains_on_email_domain_and_usertype"
    remove_index :allowlist_emails, name:"index_allowlist_emails_on_email_and_usertype"

    add_index :allowlist_domains, [:email_domain, :usertype, :company_id], unique: true, name: "domain_usertype_company"
    add_index :allowlist_emails, [:email, :usertype, :company_id], unique: true, name: "email_usertype_company"

  end
end
