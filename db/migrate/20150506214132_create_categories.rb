class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :title
      t.integer :season
      t.string :air_date

      t.timestamps null: false
    end
  end
end
