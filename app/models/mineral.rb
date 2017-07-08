class Mineral < ActiveRecord::Base
  belongs_to :aliment

  validates :aliment, presence: true
  validates :calcium, :iron, :magnesium, :phosphorus, :potassium, :sodium, :zinc, :copper, :manganese, :selenium, presence: true

  NUTRIENTS = [:calcium, :iron, :magnesium, :phosphorus, :potassium, :sodium, :zinc, :copper, :manganese, :selenium]

end
