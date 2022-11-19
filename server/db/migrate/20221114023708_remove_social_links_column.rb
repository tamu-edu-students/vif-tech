class RemoveSocialLinksColumn < ActiveRecord::Migration[7.0]
  def change
    remove_column :abouts, :social_links
  end
end
