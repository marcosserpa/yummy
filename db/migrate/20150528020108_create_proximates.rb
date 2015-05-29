class CreateProximates < ActiveRecord::Migration
  def change
    create_table :proximates do |t|
      t.string :water, null: false, default: ''
      t.string :energy, null: false, default: ''
      t.string :protein, null: false, default: ''
      t.string :fat, null: false, default: '' # Total lipid
      t.string :ash, null: false, default: ''
      t.string :carbohydrate, null: false, default: '' # By difference
      t.string :fiber, null: false, default: '' # Total dietary
      t.string :sugars, null: false, default: '' # Total
      t.string :sucrose, null: false, default: ''
      t.string :glucose, null: false, default: '' # Dextrose
      t.string :fructose, null: false, default: ''
      t.string :lactose, null: false, default: ''
      t.string :maltose, null: false, default: ''
      t.string :galactose, null: false, default: ''
    end
  end
end
