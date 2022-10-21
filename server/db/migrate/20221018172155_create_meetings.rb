class CreateMeetings < ActiveRecord::Migration[7.0]
  def change
    create_table :meetings do |t|
      t.timestamp :start_time, null: false
      t.timestamp :end_time, null: false
      t.string :title
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
