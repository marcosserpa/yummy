require 'open-uri'
require 'logger'

module Integration
  class USDAParameters
    @ndbnos_collection = []

    attr_accessor :ndbnos_collection

    class << self
      def url(ndbno)
        "http://api.nal.usda.gov/ndb/reports/?ndbno=#{ndbno}&type=f&format=json&api_key=#{api_key}"
      end

      def api_key
        '6HBsd9kI5M23vznbpiMsskOWtta3so4AM3qWLqn9'
      end

      def ndbnos
        total = number_of_total_foods
        logger = Logger.new(STDOUT)

        begin
          logger.info '================ STARTING NDB_NOS DOWNLOAD ================'
          starting = Time.zone.now

          ndbnos_url = "https://api.nal.usda.gov/ndb/search/?format=json&sort=n&max=1500&offset=#{offset_start}&api_key=#{api_key}"
          offset_start = 0

          loop do
            page = Nokogiri::HTML(open(ndbnos_url, allow_redirections: :all))

            if page.blank?
              raise SocketError.new
            else
              extract_ndbno(page)
            end

            break if offset_start >= total

            offset_start += 1500
          end

          ending = Time.zone.now

          logger.info '================ FINISHED NDB_NOS DOWNLOAD ================'
          logger.info "#{((ending - starting) / 60).to_i} minutes."
        rescue SocketError => error
          logger.warn '================ ERROR ================'
          logger.warn "Was not possible to open the ndbno numbers page. We received the following error: #{error}"
          logger.warn '======================================='
        end

        @ndbnos_collection
      end
    end

    def extract_ndbno(page)
      page.css("td[style='font-style:;'] a[style='font-weight:normal;']").each do |html|
        @ndbnos_collection << html.text.gsub(/[^\d]/, '')
      end
    end

    def number_of_total_foods
      search_page = Nokogiri::HTML(open("https://ndb.nal.usda.gov/ndb/search/list", allow_redirections: :all))
      html = search_page.css("div[class='alert alert-info result-message']")
      html.text.gsub(/[^0-9,\.]/, '')
    end
  end
end
