module Utilities
  module Conversions
    CUP = 24.3

    def to_cup(*args)
      begin
        nutrients = self.class.const_get :NUTRIENTS
        #cup = self.class.const_get :CUP
      rescue => e
        puts "=============================================="
        puts "Some error with the constant NUTRIENTS or CUP gonna wrong!"
        puts e
        puts "=============================================="
      end

      nutrients_array = if args.flatten.empty?
        nutrients.map do |nutrient|
          { nutrient => (self[nutrient] * CUP).round(4) }
        end
      else
        args.flatten.map do |nutrient|
          { nutrient => (self[nutrient] * CUP).round(4) }
        end
      end

      nutrients_array.reduce Hash.new, :merge
    end
  end
end
