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
    tryptophan: 501,
    threonine: 502,
    isoleucine: 503,
    leucine: 504,
    lysine: 505,
    methionine: 506,
    cystine: 507,
    phenylalanine: 508,
    tyrosine: 509,
    valine: 510,
    arginine: 511,
    histidine: 512,
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

end
