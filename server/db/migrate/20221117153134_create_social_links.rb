class CreateSocialLinks < ActiveRecord::Migration[7.0]
  def change
    create_table :social_links do |t|
      t.string :facebook
      t.string :youtube
      t.string :portfolio
      t.string :twitter
      t.string :linkedin
      t.string :github
      t.belongs_to :about, null: false, foreign_key: true

      t.timestamps
    end
  end
end
