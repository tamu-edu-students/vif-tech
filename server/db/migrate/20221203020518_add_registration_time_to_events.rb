class AddRegistrationTimeToEvents < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :registration_start_time, :timestamp
    add_column :events, :registration_end_time, :timestamp
  end
end
