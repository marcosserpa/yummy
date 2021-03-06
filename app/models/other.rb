class Other < ActiveRecord::Base
  belongs_to :aliment

  validates :aliment, presence: true
  validates :alcohol, :caffeine, :theobromine, presence: true

  NUTRIENTS = [:alcohol, :caffeine, :theobromine]
end
