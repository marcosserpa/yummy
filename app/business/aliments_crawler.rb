# DEPRECATED - was used initially just to test the conection

require 'open-uri'

module Integration

  page = Nokogiri::HTML(open("http://ndb.nal.usda.gov/ndb/foods?format=&count=&max=9000&sort=&fgcd=&manu=&lfacet=&qlookup=&offset=0&order=desc"))
  ndbnos = []

  def get_ndbnos
    # TODO put an exception treatment here
    page.css("td[style='padding:8px;width:10%;font-style:;'] a").each do |html|
      ndbnos << html.text
    end
  end

end
