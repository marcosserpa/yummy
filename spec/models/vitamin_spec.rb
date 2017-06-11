require 'rails_helper'

RSpec.describe Vitamin, type: :model do
  describe 'factory' do
    context 'is valid' do
      it { expect(FactoryGirl.create(:vitamin)).to be_valid }
    end
  end

  describe '.save' do
    context 'when there are nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.vitamin = Vitamin.new

      it { expect(aliment.save).to eq(false) }
    end

    context 'when there are no nulls' do
      aliment = FactoryGirl.build(:aliment)
      aliment.vitamin = FactoryGirl.build(:vitamin)

      it { expect(aliment.save).to eq(true) }
    end
  end

  # describe '.to_cup' do
  #   context "convert properly" do
  #     aliment = FactoryGirl.build(:aliment)
  #     aliment.vitamin = FactoryGirl.build(:vitamin)
  #
  #     it { expect(aliment.vitamin.to_cup(:choline)).to eq({ choline: 2.673 })  }
  #
  #     converted_nutrients = {
  #       vitamin_c: 0.0,
  #       thiamin: 0.0097,
  #       riboflavin: 1.0668,
  #       niacin: 0.2552,
  #       pantothenic_acid: 0.4617,
  #       vitamin_b6: 0.0122,
  #       folate_total: 9.72,
  #       folic_acid: 0.0,
  #       folate_food: 9.72,
  #       folate_dfe: 9.72,
  #       choline: 2.673,
  #       betaine: 0.729,
  #       vitamin_b12: 0.2187,
  #       vitamin_b12_added: 0.0,
  #       vitamin_a_rae: 0.0,
  #       retinol: 0.0,
  #       beta_carotene: 0.0,
  #       alpha_carotene: 0.0,
  #       cryptoxanthin: 0.0,
  #       vitamin_a_iu: 0.0,
  #       lycopene: 0.0,
  #       lutein_zeaxanthin: 0.0,
  #       vitamin_e_alpha_tocopherol: 0.0,
  #       vitamin_e_added: 0.0,
  #       vitamin_d_d2_d3: 0.0,
  #       vitamin_d: 0.0,
  #       vitamin_k: 0.0
  #     }
  #
  #     it { expect(aliment.vitamin.to_cup).to eq(converted_nutrients) }
  #   end
  # end
end
