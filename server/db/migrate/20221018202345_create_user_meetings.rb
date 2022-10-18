class CreateUserMeetings < ActiveRecord::Migration[7.0]
  def change
    create_table :user_meetings do |t|
      t.references :meeting, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
