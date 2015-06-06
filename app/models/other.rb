class Other < ActiveRecord::Base

  include Utilities::Conversions

  belongs_to :aliment

  validates :aliment, presence: true
  validates :alcohol, :caffeine, :theobromine, presence:true

  NUTRIENTS = [:alcohol, :caffeine, :theobromine]

end
