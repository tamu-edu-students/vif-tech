class AddAcceptanceToUserMeeting < ActiveRecord::Migration[7.0]
  def change
    add_column :user_meetings, :accepted, :boolean, default: false
  end
end
