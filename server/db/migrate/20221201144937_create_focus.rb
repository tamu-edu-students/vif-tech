class CreateFocus < ActiveRecord::Migration[7.0]
  def change
    create_table :focus do |t|
      t.string :focus

      t.timestamps
    end
  end
end
