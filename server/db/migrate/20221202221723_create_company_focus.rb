class CreateCompanyFocus < ActiveRecord::Migration[7.0]
  def change
    create_table :company_focus do |t|
      t.references :company, null: false, foreign_key: true
      t.references :focus, null: false, foreign_key: true

      t.timestamps
    end
  end
end
