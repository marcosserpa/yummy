require 'open-uri'
require 'logger'
require 'json'
require 'pry'

module Integration
  class USDAParameters
    @ndbnos_collection = []

    attr_accessor :ndbnos_collection

    class << self
      def ndbnos
        total = quantity_of_foods
        logger = Logger.new(STDOUT)

        begin
          logger.info '================ STARTING NDB_NOS DOWNLOAD ================'
          starting = Time.zone.now
          offset_start = 0

          loop do
            ndbnos_url = "https://api.nal.usda.gov/ndb/search/?format=json&sort=n&max=1500&offset=#{offset_start}&api_key=#{api_key}"
            page = Nokogiri::HTML(open(ndbnos_url, allow_redirections: :all))

            page.blank? ? raise(SocketError.new) : extract_ndbno(page)
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

        save_ndbnos @ndbnos_collection
      end

      def url(ndbno)
        "http://api.nal.usda.gov/ndb/reports/?ndbno=#{ndbno}&type=f&format=json&api_key=#{api_key}"
      end

      def api_key
        '6HBsd9kI5M23vznbpiMsskOWtta3so4AM3qWLqn9'
      end

      def extract_ndbno(page)
        logger = Logger.new(STDOUT)

        begin
          JSON.parse(page)['list']['item'].map do |item|
            @ndbnos_collection << item['ndbno']
          end
        rescue JSON::ParserError => e
          logger.warn '================ ERROR ================'
          logger.warn "================ #{e} ================"
        end
      end

      def quantity_of_foods
        search_page = Nokogiri::HTML(open('https://ndb.nal.usda.gov/ndb/search/list', allow_redirections: :all))
        html = search_page.css("div[class='alert alert-info result-message']")
        html.text.gsub(/[^0-9,\.]/, '').gsub(/[^\d^\.]/, '').to_f
      end

      def save_ndbnos(ndbnos)
        sql = "INSERT INTO  ndbnos (ndbnos) VALUES ('{#{ndbnos.join(',')}}')"
        ActiveRecord::Base.connection.execute(sql)
      end

      def restore_ndbnos
        sql = 'SELECT ndbnos FROM ndbnos'
        result = ActiveRecord::Base.connection.execute(sql)
        string = result.values.last.first.delete '{}'

        # string.split(',').collect! { |number| number }
        string.split(',')
      end
    end
  end
end
