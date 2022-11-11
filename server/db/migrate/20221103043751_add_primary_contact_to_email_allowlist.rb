class AddPrimaryContactToEmailAllowlist < ActiveRecord::Migration[7.0]
  def change
    add_column :allowlist_emails, :isPrimaryContact, :boolean, :default => 0
    add_reference :users, :allowlist_email, foreign_key: true
    add_reference :users, :allowlist_domain, foreign_key: true
  end
end
