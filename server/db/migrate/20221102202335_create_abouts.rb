class CreateAbouts < ActiveRecord::Migration[7.0]
  def change
    create_table :abouts do |t|
      t.string :firstname
      t.string :lastname
      t.text :imgSrc
      t.string :role
      t.text :description
      t.string :rank, :default => "normal"

      t.timestamps
    end
  end
end
