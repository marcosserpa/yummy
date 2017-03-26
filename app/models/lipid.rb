class Lipid < ActiveRecord::Base
  include Utilities::Conversions
  include Utilities::Calories

  belongs_to :aliment

  validates :aliment, presence: true
  validates :fatty_acids_saturated, :fatty_acids_monounsaturated, :fatty_acids_polyunsaturated, :cholesterol,
    presence: true

  NUTRIENTS = [:fatty_acids_saturated, :fatty_acids_monounsaturated, :fatty_acids_polyunsaturated, :cholesterol]
end
