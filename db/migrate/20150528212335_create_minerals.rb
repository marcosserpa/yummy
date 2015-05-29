class CreateMinerals < ActiveRecord::Migration
  def change
    create_table :minerals do |t|
      t.string :calcium, null: false, default: '' # Ca
      t.string :iron, null: false, default: '' # Fe
      t.string :magnesium, null: false, default: '' # Mg
      t.string :phosphorus, null: false, default: '' # P
      t.string :potassium, null: false, default: '' # K
      t.string :sodium, null: false, default: '' # Na
      t.string :zinc, null: false, default: '' # Zn
      t.string :copper, null: false, default: '' # Cu
      t.string :manganese, null: false, default: '' # Mn
      t.string :selenium, null: false, default: '' # Se
    end
  end
end
