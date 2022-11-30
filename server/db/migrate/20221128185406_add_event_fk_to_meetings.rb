class AddEventFkToMeetings < ActiveRecord::Migration[7.0]
  def change
    add_reference :meetings, :event, foreign_key: true
  end
end
