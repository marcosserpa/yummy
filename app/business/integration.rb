require 'rubygems'
require 'json'
require 'net/http'
require 'constants'
require 'usda_parameters'
require 'active_resource'
require 'logger'

module Integration
  class USDA
    class << self
      def download_aliment
        logger = Logger.new(STDOUT)

        logger.warn "=================== Getting the aliment's ndbnos ==================="

        aliments_ndbnos = Integration::USDAParameters.restore_ndbnos
        # local_aliments_ndbnos = Aliment.all.map { |aliment| { aliment.ndbno => aliment.recent? } }
        recent_aliments_ndbnos = Aliment.all.map { |aliment| aliment.ndbno if aliment.recent? }.compact

        # TODO: Refactor this. It's messed and UGLY! AAAARRRRGGGHHH...
        # aliments_ndbnos.each do |ndbno|
        #   local_aliments_ndbnos.select do |local_ndbno|
        #     if local_ndbno.keys[0] == ndbno
        #       aliments_ndbnos.delete(ndbno) unless local_ndbno[ndbno] == false
        #     end
        #   end
        # end

        ndbnos_to_reach = aliments_ndbnos - recent_aliments_ndbnos

        ndbnos_to_reach.each do |ndbno|
          # aliment = Aliment.find_by(ndbno: ndbno)

          # next unless ndbno.blank? || (aliment.present? && aliment.recent?)

          begin
            logger.warn '=================== Downloading and saving the aliment with ndbno #{ndbno} ==================='

            response = Net::HTTP.get_response(URI.parse(Integration::USDAParameters.url(ndbno)))

            raise ActiveResource::BadRequest.new(response) unless response.code == '200'

            data = JSON.parse(response.body)

            # TODO: Do I really need this aliment returned? I THINK NOT, DUMB!
            # Remove this and the return at the methods
            save_aliment(data['report'])
            # save_nutrients(data['report']['food']['nutrients'])
          rescue ActiveResource::BadRequest, RuntimeError, NoMethodError => error
            logger.warn '================ ERROR ================'
            logger.warn " Was not possible to open the aliment page with the ndbno #{ndbno}.\n"
            logger.warn " We received - from the GET - the code #{response.code} with the following errors:\n"
            logger.warn " #{response.message} and this other errors: #{error}"
            logger.warn '======================================='
          end
        end
      end

      def update_aliments
        # TODO: put a exception treatment here
        # ensure that the consistency testing the aliment_id and the aliment name. both need to match
      end

      def save_aliment(report)
        name, upc = remove_from_name_substring_until_end(', UPC', report['food']['name'])

        aliment = Aliment.find_or_create_by(
          ndbno: report['food']['ndbno'],
          name: name,
          food_group: report['food']['fg'],
          manu: report['food']['manu'],
          upc: upc
        )

        raise RuntimeError unless aliment.save

        save_nutrients(aliment, report['food']['nutrients'])
      end

      def remove_from_name_substring_until_end(substring, string = '')
        name = string
        pattern = name.match("#{substring}.*") ? name.match("#{substring}.*")[0] : nil
        upc = pattern.gsub(/[^0-9]/, '') if pattern.present?

        name.slice!(pattern) if pattern.present?

        return name, upc
      end

      # TODO: trocar as atribuuições de 0.0 pra '-' pois não está correto dizer que um alimento
      # tem 0.0 de um nutriente. Isso é um valor, quando na verdade eu não sei se tem ou não.
      # TODO: refatorar. existe MUITO codigo repetido nesta merda
      def save_nutrients(aliment, nutrients)
        logger = Logger.new(STDOUT)
        proximates = Proximate.find_or_initialize_by(aliment_id: aliment.id)
        minerals = Mineral.find_or_initialize_by(aliment_id: aliment.id)
        vitamins = Vitamin.find_or_initialize_by(aliment_id: aliment.id)
        lipids = Lipid.find_or_initialize_by(aliment_id: aliment.id)
        amino_acids = AminoAcid.find_or_initialize_by(aliment_id: aliment.id)
        others = Other.find_or_initialize_by(aliment_id: aliment.id)

        Integration::PROXIMATES.each do |proximate, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            proximates[proximate] = "#{nutrient['value']} #{nutrient['unit']}"
            proximates['measures'] = nutrient['measures']
          else
            proximates[proximate] = 0.0

            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::MINERALS.each do |mineral, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            minerals[mineral] = "#{nutrient['value']} #{nutrient['unit']}"
            minerals['measures'] = nutrient['measures']
          else
            minerals[mineral] = 0.0

            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # unit = nutrient['unit']

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::VITAMINS.each do |vitamin, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            vitamins[vitamin] = "#{nutrient['value']} #{nutrient['unit']}"
            vitamins['measures'] = nutrient['measures']
          else
            vitamins[vitamin] = 0.0

            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::LIPIDS.each do |lipid, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            lipids[lipid] = "#{nutrient['value']} #{nutrient['unit']}"
            lipids['measures'] = nutrient['measures']
          else
            lipids[lipid] = 0.0

            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::AMINOACIDS.each do |amino_acid, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            amino_acids[amino_acid] = "#{nutrient['value']} #{nutrient['unit']}"
            amino_acids['measures'] = nutrient['measures']
          else
            amino_acids[amino_acid] = 0.0

            # TODO: remove warns like this 'cause it's flooding the logout.
            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
          end

          # aliment.send(proximate) = if unit == 'g'
          # else
          #   proximate.send(proximate) = nutrient['value'] * MEASURE[unit.to_sym]
          # end
        end

        Integration::OTHERS.each do |other, id|
          nutrient = nutrients.select { |nutri| nutri['nutrient_id'] == id.to_s }.first

          if nutrient.present?
            others[other] = "#{nutrient['value']} #{nutrient['unit']}"
            others['measures'] = nutrient['measures']
          else
            others[other] = 0.0

            logger.warn "Was not possible to find the nutrient with id #{id} or it is not needed in the app"
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
