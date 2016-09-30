class Aliment < ActiveRecord::Base

  # scope :name_like, -> (name) { where("name ilike ?", name)}

  searchkick word_start: [:name, :food_group]#, word_end: [:name, :food_group]

  has_one :proximate, dependent: :destroy
  has_one :mineral, dependent: :destroy
  has_one :vitamin, dependent: :destroy
  has_one :lipid, dependent: :destroy
  has_one :amino_acid, dependent: :destroy
  has_one :other, dependent: :destroy

  # Ensures that, when trying to save aliment, validates belonged models too
  validates_associated :proximate, :mineral, :vitamin, :lipid, :amino_acid, :other
  validates :name, presence: true

  def recent?
    updated_at >= Time.now - 6.months
  end

  # Searchkick specification
  def search_data
    as_json only: [:name, :food_group]
  end

end
