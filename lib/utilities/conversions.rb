module Utilities
  ##
  # This module makes the conversion of measures units
  module Conversions
    # Product factors to transform from 100g to the named measures
    CUP = 2.27 # 227g
    STICK = 1.13 # 113g
    TBSP = 0.142 # 14.2g
    PAT = 0.05 # 5g
    TEN = 0.1 # 10g
    # MG = [
    #   # Minerals
    #   :calcium, :iron, :magnesium, :phosphorus, :potassium, :sodium, :zinc, :copper, :manganese,
    #   # Lipids
    #   :cholesterol,
    #   # Others
    #   :caffeine, :theobromine,
    #   # Vitamins
    #   :vitamin_c, :thiamin, :riboflavin, :niacin, :pantothenic_acid, :vitamin_b6
    # ]
    # MICRO = [ #μg
    #   :selenium,
    # ]

    ##
    # This method converts from default to cup
    # Example of use:
    # a = Aliment.third
    # a.proximate.convert('CUP')
    # a.proximate.convert('CUP', :fat)
    # a.proximate.convert('CUP', [:fat, :maltose])
    def convert(unity = nil, *args)
      begin
        nutrients = self.class.const_get :NUTRIENTS
        factor = self.class.const_get unity
      rescue StandardError => e
        puts "=============================================="
        puts "Some error with the constant NUTRIENTS or the measure asked (#{ unity }) gonna wrong!"
        puts e
        puts "=============================================="
      end

      nutrients_array = if args.flatten.empty?
        nutrients.map do |nutrient|
          { nutrient => (self[nutrient] * factor).round(2) }
        end
      else
        args.flatten.map do |nutrient|
          { nutrient => (self[nutrient] * factor).round(2) }
        end
      end.reduce(Hash.new, :merge)
    end
  end

  ##
  # This module makes the calculations of the calories
  module Calories
    FAT = 9 # # of calories each gram of fat has
    CARBOHYDRATE = 4
    PROTEIN = 4
    DIET_BASE = 2000

    def calorify(key = nil, nutrient)
      const = self.class.const_get(key)

      cal = if const.eql?(DIET_BASE)
        self[nutrient] / const
      else
        self[nutrient] * const
      end.round(2)
    end
  end
end
