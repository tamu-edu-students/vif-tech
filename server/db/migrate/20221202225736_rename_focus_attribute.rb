class RenameFocusAttribute < ActiveRecord::Migration[7.0]
  def change
    rename_column :focus, :focus, :name
  end
end
