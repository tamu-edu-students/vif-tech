class FixAllowlistDomainColumnName < ActiveRecord::Migration[7.0]
  def change
    rename_column :allowlist_domains, :email_domain, :domain
  end
end
