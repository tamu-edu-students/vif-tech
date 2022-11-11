class AddStatusToUserMeeting < ActiveRecord::Migration[7.0]
  def change
    add_column :user_meetings, :status, :string, default: "pending"
  end
end
