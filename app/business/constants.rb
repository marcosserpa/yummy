module Integration
  # USDA nutrients numbers
  PROXIMATES = {
    water: 255,
    energy: 208, # kcal
    protein: 203,
    fat: 204,
    ash: 207,
    carbohydrate: 205,
    fiber: 291,
    sugars: 269,
    sucrose: 210,
    glucose: 211,
    fructose: 212,
    lactose: 213,
    maltose: 214,
    galactose: 287
  }

  MINERALS = {
    calcium: 301,
    iron: 303,
    magnesium: 304,
    phosphorus: 305,
    potassium: 306,
    sodium: 307,
    zinc: 309,
    copper: 312,
    manganese: 315,
    selenium: 317
  }

  VITAMINS = {
    vitamin_c: 401,
    thiamin: 404,
    riboflavin: 405,
    niacin: 406,
    pantothenic_acid: 410,
    vitamin_b6: 415,
    folate_total: 417,
    folic_acid: 431,
    folate_food: 432,
    folate_dfe: 435,
    choline: 421,
    betaine: 454,
    vitamin_b12: 418,
    vitamin_b12_added: 578,
    vitamin_a_rae: 320,
    retinol: 319,
    beta_carotene: 321,
    alpha_carotene: 322,
    cryptoxanthin: 334,
    vitamin_a_iu: 318,
    lycopene: 337,
    lutein_zeaxanthin: 338,
    vitamin_e_alpha_tocopherol: 323,
    vitamin_e_added: 573,
    vitamin_d_d2_d3: 328,
    vitamin_d: 324,
    vitamin_k: 430
  }

  LIPIDS = {
    fatty_acids_saturated: 606,
    fatty_acids_monounsaturated: 645,
    fatty_acids_polyunsaturated: 646,
    cholesterol: 601
  }

  AMINOACIDS = {
    tryptophan: 501, # 9 essential amino acids
    threonine: 502, # 9 essential amino acids
    isoleucine: 503, # 9 essential amino acids
    leucine: 504, # 9 essential amino acids
    lysine: 505, # 9 essential amino acids
    methionine: 506, # 9 essential amino acids
    cystine: 507, # 9 essential amino acids
    phenylalanine: 508, # 9 essential amino acids
    tyrosine: 509, # 9 essential amino acids
    valine: 510, # 9 essential amino acids
    arginine: 511,
    histidine: 512, # 9 essential amino acids
    alanine: 513,
    aspartic_acid: 514,
    glutamic_acid: 515,
    glycine: 516,
    proline: 517,
    serine: 518
  }

  OTHERS = {
    alcohol: 221,
    caffeine: 262,
    theobromine: 263
  }

  # FDA daily percentages
  # https://www.fda.gov/Food/GuidanceRegulation/GuidanceDocumentsRegulatoryInformation/LabelingNutrition/ucm064928.htm
  DAILY_PECENTAGES = {
    water: 2.7, # l
    energy: 208, # 1600 cal
    protein: 50, # g
    fat: 65, # g
    carbohydrate: 300, # g
    fiber: 25, # g
    glucose: 211,
    calcium: 1000, # mg
    iron: 18, # mg
    magnesium: 400, # mg
    phosphorus: 1000, # mg
    potassium: 3500, # mg
    sodium: 2400, # mg
    zinc: 15, # mg
    copper: 2, # mg
    manganese: 2, # mg
    selenium: 70, # µg
    vitamin_c: 60, # mg
    thiamin: 1.5, # mg
    riboflavin: 1.7, # mg
    niacin: 20, # mg
    pantothenic_acid: 10, # mg
    vitamin_b6: 2, # mg
    folate_total: 400, # µg
    vitamin_b12: 6, # µg
    vitamin_a_iu: 5000, # IU
    vitamin_e_alpha_tocopherol: 30, # IU
    vitamin_d: 400, # IU
    vitamin_k: 80, # µg
    cholesterol: 300, # mg
  }
end
