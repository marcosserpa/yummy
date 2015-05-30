require 'rails_helper'

RSpec.describe Proximate, type: :model do
  describe '.save' do
    context "when there are nulls" do
      aliment = Aliment.new
byebug
      it { expect(aliment.save).to eq(false) }
    end
  end
end
