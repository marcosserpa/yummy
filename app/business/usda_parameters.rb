module Integration
  class USDAParameters
    class << self

      def url(ndbno)
        $usdaAlimentURI = "http://api.nal.usda.gov/ndb/reports/?ndbno=#{ndbno}&type=f&format=json&api_key=#{::USDAParameters::api_key}"
      end

      def api_key
        '6HBsd9kI5M23vznbpiMsskOWtta3so4AM3qWLqn9'
      end

      def get_ndbnos
      end

    end
  end
end
