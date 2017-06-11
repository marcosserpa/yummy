FactoryGirl.define do
  factory :lipid do
    aliment
    fatty_acids_saturated 0.0 # g
    fatty_acids_monounsaturated 0.0 # g
    fatty_acids_polyunsaturated 0.0 # g
    cholesterol 0.0 # mg
  end
end
