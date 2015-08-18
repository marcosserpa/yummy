class AddFieldsToAliments < ActiveRecord::Migration
  def change
    add_column :aliments, :ndbno, :string
    add_column :aliments, :manu, :string
  end
end
