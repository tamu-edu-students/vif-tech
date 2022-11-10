class AddLogoSrcToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :logo_src, :text
  end
end
