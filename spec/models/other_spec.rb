require 'rails_helper'

describe Other, type: :model do
  describe 'factory' do
    context 'is valid' do
      it { expect(FactoryGirl.create(:other)).to be_valid }
    end
  end

  describe '.save' do
    context 'when there are nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.other = Other.new

      it { expect(aliment.save).to eq(false) }
    end

    context 'when there are no nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.other = FactoryGirl.build(:other)

      it { expect(aliment.save).to eq(true) }
    end
  end

  # describe '.to_cup' do
  #   context 'convert properly' do
  #     aliment = FactoryGirl.build(:aliment)
  #     aliment.other = FactoryGirl.build(:other)
  #
  #     it { expect(aliment.other.to_cup(:alcohol)).to eq(alcohol: 0.0) }
  #
  #     converted_nutrients = {
  #       alcohol: 0.0,
  #       caffeine: 0.0,
  #       theobromine: 0.0
  #     }
  #
  #     it { expect(aliment.other.to_cup).to eq(converted_nutrients) }
  #   end
  # end
end
