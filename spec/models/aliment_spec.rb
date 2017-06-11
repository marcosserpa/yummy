require 'rails_helper'

RSpec.describe Aliment, type: :model do
  describe 'factory' do
    context 'is valid' do
      it { expect(FactoryGirl.create(:aliment)).to be_valid }
    end
  end

  describe '.save' do
    context 'when name is blank' do
      aliment = FactoryGirl.build(:aliment)
      aliment.name = ''

      it { expect(aliment.save).to eq(false) }
    end

    context 'when name is nil' do
      aliment = FactoryGirl.build(:aliment)
      aliment.name = nil

      it { expect(aliment.save).to eq(false) }
    end

    context 'when has blank instantiated nutrients' do
      aliment = FactoryGirl.build(:aliment)
      aliment.proximate = Proximate.new

      it { expect(aliment.save).to eq(false) }
    end
  end

  describe '.destroy' do
    context 'destroy dependents' do
      aliment = FactoryGirl.build(:aliment)
      aliment.proximate = FactoryGirl.build(:proximate)
      aliment.vitamin = FactoryGirl.build(:vitamin)
      aliment.lipid = FactoryGirl.build(:lipid)
      aliment.mineral = FactoryGirl.build(:mineral)
      aliment.amino_acid = FactoryGirl.build(:amino_acid)
      aliment.other = FactoryGirl.build(:other)

      aliment.save
      aliment.reload

      proximate = Proximate.find aliment.proximate.id

      aliment.destroy

      it { expect { Aliment.find(aliment.id) }.to raise_exception(ActiveRecord::RecordNotFound) }
      it { expect { Proximate.find(proximate.id) }.to raise_exception(ActiveRecord::RecordNotFound) }
    end
  end
end
