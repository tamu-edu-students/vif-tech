class AddAllowlistFks < ActiveRecord::Migration[7.0]
  def change
    add_reference :allowlist_domains, :company, foreign_key: true
    add_reference :allowlist_emails, :company, foreign_key: true
  end
end
