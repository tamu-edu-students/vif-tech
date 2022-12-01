class FixAllowlistEmailPrimaryContactColumn < ActiveRecord::Migration[7.0]
  def change
    rename_column :allowlist_emails, :isPrimaryContact, :is_primary_contact
  end
end
