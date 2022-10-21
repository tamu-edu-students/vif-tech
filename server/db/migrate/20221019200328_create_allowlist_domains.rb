class CreateAllowlistDomains < ActiveRecord::Migration[7.0]
  def change
    create_table :allowlist_domains do |t|
      t.string :email_domain
      t.string :usertype
    end
  end
end
