class CreateAvailabilities < ActiveRecord::Migration[7.0]
  def change
    create_table :availabilities do |t|
      t.references :user, null: false, foreign_key: true
      t.timestamp :start_time
      t.timestamp :end_time

      t.timestamps
    end
  end
end
