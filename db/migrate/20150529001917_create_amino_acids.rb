class CreateAminoAcids < ActiveRecord::Migration
  def change
    create_table :amino_acids do |t|
      t.float :tryptophan, null: false, default: ''
      t.float :threonine, null: false, default: ''
      t.float :isoleucine, null: false, default: ''
      t.float :leucine, null: false, default: ''
      t.float :lysine, null: false, default: ''
      t.float :methionine, null: false, default: ''
      t.float :cystine, null: false, default: ''
      t.float :phenylalanine, null: false, default: ''
      t.float :tyrosine, null: false, default: ''
      t.float :valine, null: false, default: ''
      t.float :arginine, null: false, default: ''
      t.float :histidine, null: false, default: ''
      t.float :alanine, null: false, default: ''
      t.float :aspartic_acid, null: false, default: ''
      t.float :glutamic_acid, null: false, default: ''
      t.float :glycine, null: false, default: ''
      t.float :proline, null: false, default: ''
      t.float :serine, null: false, default: ''
    end
  end
end
