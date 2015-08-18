namespace :integrate do
  # require 'app/business/integration'

  desc "Running the integration task"
  task :update_aliments => :environment do
    # require 'integration'
    # Dir[File.dirname(__FILE__) + '/../../app/business/*.rb'].each do |file|
      # puts file
    # require '/Users/marcosserpa/code/personal/yummy/lib/tasks/../../app/business/constants.rb'
    # require '/Users/marcosserpa/code/personal/yummy/lib/tasks/../../app/business/integration.rb'
    # require '/Users/marcosserpa/code/personal/yummy/lib/tasks/../../app/business/usda_parameters.rb'
    # end

    puts "============================"
    Integration::USDA.get_aliment
  end

end
