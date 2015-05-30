class CreateProximates < ActiveRecord::Migration
  def change
    create_table :proximates do |t|
      t.belongs_to :aliment, index: true
      t.float :water, null: false, default: ''
      t.float :energy, null: false, default: ''
      t.float :protein, null: false, default: ''
      t.float :fat, null: false, default: '' # Total lipid
      t.float :ash, null: false, default: ''
      t.float :carbohydrate, null: false, default: '' # By difference
      t.float :fiber, null: false, default: '' # Total dietary
      t.float :sugars, null: false, default: '' # Total
      t.float :sucrose, null: false, default: ''
      t.float :glucose, null: false, default: '' # Dextrose
      t.float :fructose, null: false, default: ''
      t.float :lactose, null: false, default: ''
      t.float :maltose, null: false, default: ''
      t.float :galactose, null: false, default: ''

      t.timestamps null: false
    end
  end
end
