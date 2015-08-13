class AddFoodGroupToAliments < ActiveRecord::Migration
  def change
    add_column :aliments, :food_group, :string
  end
end
