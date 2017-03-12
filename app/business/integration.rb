require 'rubygems'
require 'json'
require 'net/http'
require 'constants'
require 'usda_parameters'
require 'active_resource'
require 'pry'

module Integration
  class USDA
    class << self

      def get_aliment
        puts "=================== Downloading the aliments ndbnos ==================="
        aliments_ndbnos = Integration::USDAParameters.get_ndbnos
        local_aliments_ndbnos = Aliment.all.map{ |aliment| { aliment.ndbno => aliment.recent? } }

        # TODO Refactor this. It's messed and UGLY! AAAARRRRGGGHHH...
        aliments_ndbnos.each do |ndbno|
          local_aliments_ndbnos.select do |local_ndbno|
            if local_ndbno.keys[0] == ndbno
              aliments_ndbnos.delete(ndbno) unless local_ndbno[ndbno] == false
            end
          end
        end

        aliments_ndbnos.each do |ndbno|
          aliment = Aliment.where(ndbno: ndbno).first
          # last_update = aliment.present? ? aliment.updated_at : nil

          # unless last_update.present? && (last_update <= Time.now - 6.months)
          unless ndbno.blank? || (aliment.present? && aliment.recent?)
            begin
              puts "=================== Downloading and saving the aliment with ndbno #{ndbno} ==================="
              response = Net::HTTP.get_response(URI.parse(Integration::USDAParameters.url(ndbno)))

              raise ActiveResource::BadRequest.new(response) unless response.code == '200'

              data = JSON.parse(response.body)

              # TODO Do I really need this aliment returned? I THINK NOT, DUMB! Remove this and the return at the methods
              aliment = save_aliment(data['report'])
              # save_nutrients(data['report']['food']['nutrients'])
            rescue ActiveResource::BadRequest, RuntimeError, NoMethodError => error
              puts "================ ERROR ================"
              puts "Was not possible to open the aliment page with the ndbno #{ndbno}. We received - from the GET - the code #{response.code} with the following errors: #{response.message} and this other errors: #{error}"
              puts "======================================="
            end
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

        save_nutrients(aliment, report['food']['nutrients'])
      end

      # TODO trocar as atribuuições de 0.0 pra '-' pois não está correto dizer que um alimento tem 0.0 de um nutriente. Isso é um valor, quando na verdade eu não sei se tem ou não.
      def save_nutrients(aliment, nutrients)
        proximates = Proximate.find_or_initialize_by(aliment_id: aliment.id)
        minerals = Mineral.find_or_initialize_by(aliment_id: aliment.id)
        vitamins = Vitamin.find_or_initialize_by(aliment_id: aliment.id)
        lipids = Lipid.find_or_initialize_by(aliment_id: aliment.id)
        amino_acids = AminoAcid.find_or_initialize_by(aliment_id: aliment.id)
        others = Other.find_or_initialize_by(aliment_id: aliment.id)

        Integration::PROXIMATES.each do |proximate, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            proximates[proximate] = nutrient['value']
            proximates['measures'] = nutrient['measures']
          else
            proximates[proximate] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::MINERALS.each do |mineral, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            minerals[mineral] = nutrient['value']
            minerals['measures'] = nutrient['measures']
          else
            minerals[mineral] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # unit = nutrient['unit']

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::VITAMINS.each do |vitamin, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            vitamins[vitamin] = nutrient['value']
            vitamins['measures'] = nutrient['measures']
          else
            vitamins[vitamin] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::LIPIDS.each do |lipid, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            lipids[lipid] = nutrient['value']
            lipids['measures'] = nutrient['measures']
          else
            lipids[lipid] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::AMINOACIDS.each do |amino_acid, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            amino_acids[amino_acid] = nutrient['value']
            amino_acids['measures'] = nutrient['measures']
          else
            amino_acids[amino_acid] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::OTHERS.each do |other, id|
          nutrient = nutrients.select{ |nutrient| nutrient['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            others[other] = nutrient['value']
            others['measures'] = nutrient['measures']
          else
            others[other] = 0.0

            puts "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
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
