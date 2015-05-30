class Proximate < ActiveRecord::Base

  belongs_to :aliment

  validates :aliment, presence: true # validates association
  validates :water, :energy, :protein, :fat, :ash, :carbohydrate, :fiber, :sugars, :sucrose, :glucose, :fructose, :lactose, :maltose, :galactose, presence: true

  CUP = 24.3
  NUTRIENTS = [:water, :energy, :protein, :fat, :ash, :carbohydrate, :fiber, :sugars, :sucrose, :glucose, :fructose, :lactose, :maltose, :galactose]

  def to_cup(*args)
    nutrients_hash = if args.flatten.empty?
      NUTRIENTS.map do |nutrient|
        { nutrient => (self[nutrient] * CUP).round(4) }
      end
    else
      args.flatten.map do |nutrient|
        { nutrient => (self[nutrient] * CUP).round(4) }
      end
    end
  end

end
