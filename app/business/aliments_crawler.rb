require 'open-uri'

module Integration

  page = Nokogiri::HTML(open("http://ndb.nal.usda.gov/ndb/foods?format=&count=&max=9000&sort=&fgcd=&manu=&lfacet=&qlookup=&offset=0&order=desc", allow_redirections: :all))
  ndbnos = []

  def get_ndbnos
    # TODO put a exception treatment here
    page.css("td[style='padding:8px;width:10%;font-style:;'] a").each do |html|
      ndbnos << html.text
    end
  end

end
