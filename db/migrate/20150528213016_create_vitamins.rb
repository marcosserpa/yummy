class CreateVitamins < ActiveRecord::Migration
  def change
    create_table :vitamins do |t|
      t.string :vitamin_c, null: false, default: ''
      t.string :thiamin, null: false, default: ''
      t.string :riboflavin, null: false, default: ''
      t.string :niacin, null: false, default: ''
      t.string :pantothenic_acid, null: false, default: ''
      t.string :vitamin_b6, null: false, default: ''
      t.string :folate_total, null: false, default: ''
      t.string :folic_acid, null: false, default: ''
      t.string :folate_food, null: false, default: ''
      t.string :folate_dfe, null: false, default: ''
      t.string :choline, null: false, default: ''
      t.string :betaine, null: false, default: ''
      t.string :vitamin_b12, null: false, default: ''
      t.string :vitamin_b12_added, null: false, default: ''
      t.string :vitamin_a_rae, null: false, default: ''
      t.string :retinol, null: false, default: ''
      t.string :beta_carotene, null: false, default: ''
      t.string :alpha_carotene, null: false, default: ''
      t.string :cryptoxanthin, null: false, default: ''
      t.string :vitamin_a_iu, null: false, default: ''
      t.string :lycopene, null: false, default: ''
      t.string :lutein_zeaxanthin, null: false, default: ''
      t.string :vitamin_e_alpha_tocopherol, null: false, default: ''
      t.string :vitamin_e_added, null: false, default: ''
      t.string :vitamin_d_d2_d3, null: false, default: ''
      t.string :vitamin_d, null: false, default: ''
      t.string :vitamin_k, null: false, default: ''
    end
  end
end
