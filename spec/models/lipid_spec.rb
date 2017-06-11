require 'rails_helper'

RSpec.describe Lipid, type: :model do
  describe 'factory' do
    context 'is valid' do
      it { expect(FactoryGirl.create(:lipid)).to be_valid }
    end
  end

  describe '.save' do
    context 'when there are nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.lipid = Lipid.new

      it { expect(aliment.save).to eq(false) }
    end

    context 'when there are no nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.lipid = FactoryGirl.build(:lipid)

      it { expect(aliment.save).to eq(true) }
    end
  end

  # describe '.to_cup' do
  #   context "convert properly" do
  #     aliment = FactoryGirl.build(:aliment)
  #     aliment.lipid = FactoryGirl.build(:lipid)
  #
  #     it { expect(aliment.lipid.to_cup(:cholesterol)).to eq({ cholesterol: 0.0 })  }
  #
  #     converted_nutrients = {
  #       fatty_acids_saturated: 0.0,
  #       fatty_acids_monounsaturated: 0.0,
  #       fatty_acids_polyunsaturated: 0.0,
  #       cholesterol: 0.0
  #     }
  #
  #     it { expect(aliment.lipid.to_cup).to eq(converted_nutrients) }
  #   end
  # end
end
