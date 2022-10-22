class AddEmailUsertypeUniqueness < ActiveRecord::Migration[7.0]
  def change
    add_index :allowlist_domains, [:email_domain, :usertype], unique: true
  end
end
