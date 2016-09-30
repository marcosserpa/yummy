json.array!(@aliments) do |aliment|
  json.extract! aliment, :id, :name
  json.url aliment_url(aliment, format: :json)
end