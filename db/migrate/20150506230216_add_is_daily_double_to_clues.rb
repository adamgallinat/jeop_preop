class AddIsDailyDoubleToClues < ActiveRecord::Migration
  def change
    add_column :clues, :daily_double, :boolean
  end
end
