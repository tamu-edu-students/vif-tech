class CreateJoinTableCompaniesUsers < ActiveRecord::Migration[7.0]
  def change
    create_join_table :companies, :users do |t|
      # t.index [:company_id, :user_id]
      # t.index [:user_id, :company_id]
      # t.index :company_id
      # t.index :user_id
      # t.belongs_to :company
      # t.belongs_to :user
    end
  end
end
