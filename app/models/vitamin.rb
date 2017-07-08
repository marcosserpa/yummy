class Vitamin < ActiveRecord::Base
  belongs_to :aliment

  validates :aliment, presence: true
  validates :vitamin_c, :thiamin, :riboflavin, :niacin, :pantothenic_acid, :vitamin_b6, :folate_total, :folic_acid,
    :folate_food, :folate_dfe, :choline, :betaine, :vitamin_b12, :vitamin_b12_added, :vitamin_a_rae, :retinol,
    :beta_carotene, :alpha_carotene, :cryptoxanthin, :vitamin_a_iu, :lycopene, :lutein_zeaxanthin,
    :vitamin_e_alpha_tocopherol, :vitamin_e_added, :vitamin_d_d2_d3, :vitamin_d, :vitamin_k, presence: true

  NUTRIENTS = [
    :vitamin_c,
    :thiamin,
    :riboflavin,
    :niacin,
    :pantothenic_acid,
    :vitamin_b6,
    :folate_total,
    :folic_acid,
    :folate_food,
    :folate_dfe,
    :choline,
    :betaine,
    :vitamin_b12,
    :vitamin_b12_added,
    :vitamin_a_rae,
    :retinol,
    :beta_carotene,
    :alpha_carotene,
    :cryptoxanthin,
    :vitamin_a_iu,
    :lycopene,
    :lutein_zeaxanthin,
    :vitamin_e_alpha_tocopherol,
    :vitamin_e_added,
    :vitamin_d_d2_d3,
    :vitamin_d,
    :vitamin_k
  ]
end
