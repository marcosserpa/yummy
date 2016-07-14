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
end
