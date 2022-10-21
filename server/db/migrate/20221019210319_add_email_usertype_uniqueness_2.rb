class AddEmailUsertypeUniqueness2 < ActiveRecord::Migration[7.0]
  def change
    add_index :allowlist_emails, [:email, :usertype], unique: true
  end
end
