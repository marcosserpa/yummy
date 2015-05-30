require 'rails_helper'

RSpec.describe Proximate, type: :model do
  describe 'factory' do
    context "is valid" do
      it { expect(FactoryGirl.create(:proximate)).to be_valid }
    end
  end

  describe '.save' do
    context "when there are nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.proximate = Proximate.new

      it { expect(aliment.save).to eq(false) }
    end

    context "when there are no nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.proximate = FactoryGirl.build(:proximate)

      it { expect(aliment.save).to eq(true) }
    end
  end

  describe '.to_cup' do
    context "convert properly" do
      aliment = FactoryGirl.build(:aliment)
      aliment.proximate = FactoryGirl.build(:proximate)

      it { expect(aliment.proximate.to_cup(:water)).to eq(212.7951)  }

      converted_nutrients = {
        water: 212.7951,
        energy: 126.36,
        protein: 26.487,
        fat: 0.4131,
        ash: 1.5309,
        carbohydrate: 0,
        fiber: 0,
        sugars: 1.7253,
        sucrose: 0.1701,
        glucose: 0.8262,
        fructose: 0.1701,
        lactose: 0.1701,
        maltose: 0.1701,
        galactose: 0.1701
      }

      it { expect(aliment.proximate.to_cup).to eq(converted_nutrients) }
    end
  end
end
