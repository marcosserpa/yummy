class Aliment < ActiveRecord::Base

  has_one :proximate
  has_one :mineral
  has_one :vitamin
  has_one :lipid
  has_one :amino_acid
  has_one :other

  validates_associated :proximate, :mineral, :vitamin, :lipid, :amino_acid, :other

end
