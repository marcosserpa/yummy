FactoryGirl.define do

  factory :vitamin do
    aliment
    vitamin_c '0.0' # mg
    thiamin '0.004' # mg
    riboflavin '0.439' # mg
    niacin '0.105' # mg
    pantothenic_acid '0.190' # mg
    vitamin_b6 '0.005' # mg
    folate_total '4' # µg
    folic_acid '0' # µg
    folate_food '4' # µg
    folate_dfe '4' # µg
    choline '1.1' # mg
    betaine '0.3' # mg
    vitamin_b12 '0.09' # µg
    vitamin_b12_added '0.00' # µg
    vitamin_a_rae '0' # µg
    retinol '0' # µg
    beta_carotene '0' # µg
    alpha_carotene '0' # µg
    cryptoxanthin '0' # µg
    vitamin_a_iu '0' # IU
    lycopene '0' # µg
    lutein_zeaxanthin '0' # µg
    vitamin_e_alpha_tocopherol '0.00' # mg
    vitamin_e_added '0.00' # mg
    vitamin_d_d2_d3 '0.0' # µg
    vitamin_d '0' # IU
    vitamin_k '0.0' # µg
  end

end
