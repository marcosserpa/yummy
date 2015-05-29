class CreateVitamins < ActiveRecord::Migration
  def change
    create_table :vitamins do |t|
      t.float :vitamin_c, null: false, default: ''
      t.float :thiamin, null: false, default: ''
      t.float :riboflavin, null: false, default: ''
      t.float :niacin, null: false, default: ''
      t.float :pantothenic_acid, null: false, default: ''
      t.float :vitamin_b6, null: false, default: ''
      t.float :folate_total, null: false, default: ''
      t.float :folic_acid, null: false, default: ''
      t.float :folate_food, null: false, default: ''
      t.float :folate_dfe, null: false, default: ''
      t.float :choline, null: false, default: ''
      t.float :betaine, null: false, default: ''
      t.float :vitamin_b12, null: false, default: ''
      t.float :vitamin_b12_added, null: false, default: ''
      t.float :vitamin_a_rae, null: false, default: ''
      t.float :retinol, null: false, default: ''
      t.float :beta_carotene, null: false, default: ''
      t.float :alpha_carotene, null: false, default: ''
      t.float :cryptoxanthin, null: false, default: ''
      t.float :vitamin_a_iu, null: false, default: ''
      t.float :lycopene, null: false, default: ''
      t.float :lutein_zeaxanthin, null: false, default: ''
      t.float :vitamin_e_alpha_tocopherol, null: false, default: ''
      t.float :vitamin_e_added, null: false, default: ''
      t.float :vitamin_d_d2_d3, null: false, default: ''
      t.float :vitamin_d, null: false, default: ''
      t.float :vitamin_k, null: false, default: ''
    end
  end
end
