class CreateMinerals < ActiveRecord::Migration
  def change
    create_table :minerals do |t|
      t.belongs_to :aliment, index: true
      t.float :calcium, null: false, default: '' # Ca
      t.float :iron, null: false, default: '' # Fe
      t.float :magnesium, null: false, default: '' # Mg
      t.float :phosphorus, null: false, default: '' # P
      t.float :potassium, null: false, default: '' # K
      t.float :sodium, null: false, default: '' # Na
      t.float :zinc, null: false, default: '' # Zn
      t.float :copper, null: false, default: '' # Cu
      t.float :manganese, null: false, default: '' # Mn
      t.float :selenium, null: false, default: '' # Se

      t.timestamps null: false
    end
  end
end
