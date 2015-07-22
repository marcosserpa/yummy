require 'rubygems'
require 'json'
require 'net/http'

module Integration
  class USDA
    class << self

      #respond_to :json

      def get_aliment
        aliments_ndbnos = ::USDAParameters::ndbno

        # TODO put a exception treatment here
        aliments_ndbnos.each do |ndbno|
          response = Net::HTTP.get_response(URI.parse(::USDAParameters::url(ndbno)))

          byebug
          data = JSON.parse(response.body['report']['food'])

          aliment_id = save_aliment(data)
          save_nutrients(data['report']['food']['nutrients'])
        end
      end

      def update_aliments
        # TODO put a exception treatment here
        # ensure that the consistency testing the aliment_id and the aliment name. both need to match
      end

      def save_aliment(data)
        # TODO put a exception treatment here
      end

      def save_nutrients(data)
        # TODO put a exception treatment here
      end

    end
  end
end
