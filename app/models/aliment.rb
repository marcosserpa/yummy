class Aliment < ActiveRecord::Base

  has_one :proximate, dependent: :destroy
  has_one :mineral, dependent: :destroy
  has_one :vitamin, dependent: :destroy
  has_one :lipid, dependent: :destroy
  has_one :amino_acid, dependent: :destroy
  has_one :other, dependent: :destroy

  # Ensures that, when trying to save aliment, validates belonged models too
  validates_associated :proximate, :mineral, :vitamin, :lipid, :amino_acid, :other
  validates :name, presence: true

end
