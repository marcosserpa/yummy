class CreateAminoAcids < ActiveRecord::Migration
  def change
    create_table :amino_acids do |t|
      t.string :tryptophan, null: false, default: ''
      t.string :threonine, null: false, default: ''
      t.string :isoleucine, null: false, default: ''
      t.string :leucine, null: false, default: ''
      t.string :lysine, null: false, default: ''
      t.string :methionine, null: false, default: ''
      t.string :cystine, null: false, default: ''
      t.string :phenylalanine, null: false, default: ''
      t.string :tyrosine, null: false, default: ''
      t.string :valine, null: false, default: ''
      t.string :arginine, null: false, default: ''
      t.string :histidine, null: false, default: ''
      t.string :alanine, null: false, default: ''
      t.string :aspartic_acid, null: false, default: ''
      t.string :glutamic_acid, null: false, default: ''
      t.string :glycine, null: false, default: ''
      t.string :proline, null: false, default: ''
      t.string :serine, null: false, default: ''
    end
  end
end
