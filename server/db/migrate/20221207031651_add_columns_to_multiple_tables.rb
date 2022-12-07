class AddColumnsToMultipleTables < ActiveRecord::Migration[7.0]
  def change
    # all users
    add_column :users, :profile_img_src, :string, :default => nil
    # students only
    add_column :users, :resume_link, :string, :default => nil
    add_column :users, :portfolio_link, :string, :default => nil
    add_column :users, :class_year, :int, :default => nil
    add_column :users, :class_semester, :string, :default => nil
    # rep only
    add_column :users, :title, :string, :default => nil
    
    # company fields
    add_column :companies, :location, :string, :default => nil
    add_column :companies, :logo_img_src, :string, :default => nil
    add_column :companies, :website_link, :string, :default => nil
    add_column :companies, :hiring_for_fulltime, :boolean, :default => 0
    add_column :companies, :hiring_for_parttime, :boolean, :default => 0
    add_column :companies, :hiring_for_intern, :boolean, :default => 0


  end
end
