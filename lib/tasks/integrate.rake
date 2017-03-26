namespace :integrate do
  # require 'app/business/integration'

  desc 'Running the integration task'
  task update_aliments: :environment do
    puts '============================'
    Integration::USDA.download_aliment
  end
end
