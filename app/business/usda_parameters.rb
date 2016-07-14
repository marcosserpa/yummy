require 'open-uri'

module Integration
  class USDAParameters
    class << self

      def url(ndbno)
        $usdaAlimentURI = "https://api.nal.usda.gov/ndb/reports/?ndbno=#{ndbno}&type=f&format=json&api_key=#{api_key}"
      end

      def api_key
        '6HBsd9kI5M23vznbpiMsskOWtta3so4AM3qWLqn9'
      end

      def get_ndbnos
        ndbnos = []

        begin
          page = Nokogiri::HTML(open("https://ndb.nal.usda.gov/ndb/foods?format=&count=&max=9000&sort=&fgcd=&manu=&lfacet=&qlookup=&offset=0&order=desc"))

          raise SocketError.new unless page.present?

          page.css("td[style='padding:8px;width:10%;font-style:;'] a").each do |html|
            ndbnos << html.text
          end
        rescue SocketError => error
          puts "================ ERROR ================"
          puts "Was not possible to open the ndbno numbers page. We received the following error: #{error}"
          puts "======================================="
        end

        ndbnos
      end

    end
  end
end
