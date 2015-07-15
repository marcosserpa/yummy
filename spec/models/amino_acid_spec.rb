require 'rails_helper'

RSpec.describe AminoAcid, type: :model do
  describe 'factory' do
    context "is valid" do
      it { expect(FactoryGirl.create(:amino_acid)).to be_valid }
    end
  end

  describe '.save' do
    context "when there are nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.amino_acid = AminoAcid.new

      it { expect(aliment.save).to eq(false) }
    end

    context "when there are no nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.amino_acid = FactoryGirl.build(:amino_acid)

      it { expect(aliment.save).to eq(true) }
    end
  end

  describe '.to_cup' do
    context "convert properly" do
      aliment = FactoryGirl.build(:aliment)
      aliment.amino_acid = FactoryGirl.build(:amino_acid)

      it { expect(aliment.amino_acid.to_cup(:leucine)).to eq({ leucine: 2.4689 })  }

      converted_nutrients = {
        tryptophan: 0.3038,
        threonine: 1.0911,
        isoleucine: 1.6062,
        leucine: 2.4689,
        lysine: 1.9586,
        methionine: 0.9696,
        cystine: 0.6974,
        phenylalanine: 1.667,
        tyrosine: 1.1105,
        valine: 1.9659,
        arginine: 1.5746,
        histidine: 0.7047,
        alanine: 1.7107,
        aspartic_acid: 2.9646,
        glutamic_acid: 3.7665,
        glycine: 1.0036,
        proline: 1.0571,
        serine: 1.9391
      }

      it { expect(aliment.amino_acid.to_cup).to eq(converted_nutrients) }
    end
  end
end
