class AminoAcid < ActiveRecord::Base
  
  include Utilities::Conversions

  belongs_to :aliment

  validates :aliment, presence: true
  validates :tryptophan, :threonine, :isoleucine, :leucine, :lysine, :methionine, :cystine, :phenylalanine, :tyrosine, :valine, :arginine, :histidine, :alanine, :aspartic_acid, :glutamic_acid, :glycine, :proline, :serine, presence: true

  NUTRIENTS = [:tryptophan, :threonine, :isoleucine, :leucine, :lysine, :methionine, :cystine, :phenylalanine, :tyrosine, :valine, :arginine, :histidine, :alanine, :aspartic_acid, :glutamic_acid, :glycine, :proline, :serine]

end
