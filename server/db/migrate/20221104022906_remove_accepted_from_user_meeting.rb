class RemoveAcceptedFromUserMeeting < ActiveRecord::Migration[7.0]
  def change
    remove_column :user_meetings, :accepted
  end
end
