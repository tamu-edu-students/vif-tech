class AddAvailabilitiesToUser < ActiveRecord::Migration[7.0]
  def change
    add_reference :users, :availabilities, foreign_key: true
  end
end
