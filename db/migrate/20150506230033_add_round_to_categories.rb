class AddRoundToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :round, :string
  end
end
