class Other < ActiveRecord::Base
  include Utilities::Conversions
  include Utilities::Calories

  belongs_to :aliment

  validates :aliment, presence: true
  validates :alcohol, :caffeine, :theobromine, presence: true

  NUTRIENTS = [:alcohol, :caffeine, :theobromine]
end
