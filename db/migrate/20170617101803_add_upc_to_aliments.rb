class AddUpcToAliments < ActiveRecord::Migration
  def change
    add_column :aliments, :upc, :string, default: ''
  end
end
