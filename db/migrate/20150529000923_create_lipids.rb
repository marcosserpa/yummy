class CreateLipids < ActiveRecord::Migration
  def change
    create_table :lipids do |t|
      t.string :fatty_acids_saturated, null: false, default: ''
      t.string :fatty_acids_monounsaturated, null: false, default: ''
      t.string :fatty_acids_polyunsaturated, null: false, default: ''
      t.string :cholesterol, null: false, default: ''
    end
  end
end
