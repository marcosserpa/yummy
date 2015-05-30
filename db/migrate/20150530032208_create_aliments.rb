class CreateAliments < ActiveRecord::Migration
  def change
    create_table :aliments do |t|
      t.string :name
      t.string :description

      t.timestamps null: false
    end
  end
end
