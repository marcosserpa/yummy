FactoryGirl.define do

  factory :lipid do
    aliment
    fatty_acids_saturated '0.000' # g
    fatty_acids_monounsaturated '0.000' # g
    fatty_acids_polyunsaturated '0.000' # g
    cholesterol '0' # mg
  end

end
