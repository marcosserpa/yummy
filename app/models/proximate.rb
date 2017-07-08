class Proximate < ActiveRecord::Base
  belongs_to :aliment

  validates :aliment, presence: true # validates association
  validates :water, :energy, :protein, :fat, :ash, :carbohydrate, :fiber, :sugars, :sucrose, :glucose,
    :fructose, :lactose, :maltose, :galactose, presence: true

  NUTRIENTS = [
    :water,
    :energy,
    :protein,
    :fat,
    :ash,
    :carbohydrate,
    :fiber,
    :sugars,
    :sucrose,
    :glucose,
    :fructose,
    :lactose,
    :maltose,
    :galactose
  ]
end
