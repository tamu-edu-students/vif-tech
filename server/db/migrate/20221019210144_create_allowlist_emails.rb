class CreateAllowlistEmails < ActiveRecord::Migration[7.0]
  def change
    create_table :allowlist_emails do |t|
      t.string :email
      t.string :usertype

      t.timestamps
    end
  end
end
