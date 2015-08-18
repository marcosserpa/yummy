require 'rails_helper'

RSpec.describe Mineral, type: :model do
  describe 'factory' do
    context "is valid" do
      it { expect(FactoryGirl.create(:mineral)).to be_valid }
    end
  end

  describe '.save' do
    context "when there are nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.mineral = Mineral.new

      it { expect(aliment.save).to eq(false) }
    end

    context "when there are no nulls" do
      aliment = FactoryGirl.build(:aliment)
      aliment.mineral = FactoryGirl.build(:mineral)

      it { expect(aliment.save).to eq(true) }
    end
  end

  describe '.to_cup' do
    context "convert properly" do
      aliment = FactoryGirl.build(:aliment)
      aliment.mineral = FactoryGirl.build(:mineral)

      it { expect(aliment.mineral.to_cup(:calcium)).to eq({ calcium: 17.01 })  }

      converted_nutrients = {
        calcium: 17.01,
        iron: 0.1944,
        magnesium: 26.73,
        phosphorus: 36.45,
        potassium: 396.09,
        sodium: 403.38,
        zinc: 0.0729,
        copper: 0.0559,
        manganese: 0.0267,
        selenium: 48.6
      }

      it { expect(aliment.mineral.to_cup).to eq(converted_nutrients) }
    end
  end
end
