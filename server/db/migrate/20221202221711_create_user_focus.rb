class CreateUserFocus < ActiveRecord::Migration[7.0]
  def change
    create_table :user_focus do |t|
      t.references :user, null: false, foreign_key: true
      t.references :focus, null: false, foreign_key: true

      t.timestamps
    end
  end
end
