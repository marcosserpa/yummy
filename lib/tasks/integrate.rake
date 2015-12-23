namespace :integrate do
  # require 'app/business/integration'

  desc "Running the integration task"
  task :update_aliments => :environment do

    puts "============================"
    Integration::USDA.get_aliment
  end

  #"whenever --update-crontab --set environment='#{ Rails.env }'"
end
