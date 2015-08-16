require 'rubygems'
require 'json'
require 'net/http'
require 'constants'
require 'usda_parameters'

module Integration
  class USDA
    class << self

      def get_aliment
        aliments_ndbnos = Integration::USDAParameters.get_ndbnos

        aliments_ndbnos.each do |ndbno|
          begin
            response = Net::HTTP.get_response(URI.parse(Integration::USDAParameters.url(ndbno)))

            raise ActiveResource::BadRequest.new unless response.code == '200'

            data = JSON.parse(response.body)

            # TODO Do I really need this aliment returned? I THINK NOT, DUMB! Remove this and the return at the methods
            aliment = save_aliment(data['report'])
            # save_nutrients(data['report']['food']['nutrients'])
          rescue ActiveResource::BadRequest, RuntimeError => error
            puts "================ ERROR ================"
            puts "Was not possible to open the aliment page with the ndbno #{ndbno}. We received - from the GET - the code #{response.code}
              with the following errors: #{response.message} and this other errors: #{error}"
            puts "======================================="
          end
        end
      end

      def update_aliments
        # TODO put a exception treatment here
        # ensure that the consistency testing the aliment_id and the aliment name. both need to match
      end

      def save_aliment(report)
        aliment = Aliment.find_or_create_by(
                    ndbno: report['food']['ndbno'],
                    name: report['food']['name'],
                    food_group: report['food']['fg'],
                    manu: report['food']['manu']
                  )
        # aliment.food_group = report['food']['fg']
        # aliment.manu = report['food']['manu']

        raise RuntimeError unless aliment.save

        save_nutrients(aliment.id, report['food']['nutrients'])
      end

      def save_nutrients(aliment_id, nutrients)
        aliment = Aliment.find aliment_id
        proximates = Proximate.find_or_initialize_by(aliment_id: aliment_id)
        minerals = Mineral.find_or_initialize_by(aliment_id: aliment_id)
        vitamins = Vitamin.find_or_initialize_by(aliment_id: aliment_id)
        lipids = Lipid.find_or_initialize_by(aliment_id: aliment_id)
        amino_acids = AminoAcid.find_or_initialize_by(aliment_id: aliment_id)
        others = Other.find_or_initialize_by(aliment_id: aliment_id)

        Integration::PROXIMATES.each do |proximate, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            proximates[proximate] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::MINERALS.each do |mineral, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            minerals[mineral] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::VITAMINS.each do |vitamin, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            vitamins[vitamin] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::LIPIDS.each do |lipid, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            lipids[lipid] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::AMINOACIDS.each do |amino_acid, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            amino_acids[amino_acid] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::OTHERS.each do |other, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id }.first
          unit = nutrient['unit']

          raise "Was not possible to find the nutrient with id #{id}" unless nutrient.present?

          # aliment.send(proximate) = if unit == 'g'
            others[other] = nutrient['value']
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        aliment.proximate = proximates
        aliment.mineral = minerals
        aliment.vitamin = vitamins
        aliment.lipid = lipids
        aliment.amino_acid = amino_acids
        aliment.other = others

        raise RuntimeError unless aliment.save

        aliment
      end

    end
  end
end
