namespace :integrate do
  # require 'app/business/integration'

  desc 'Running the NDB_NOS download task'
  task download_ndbnos: :environment do
    puts '============================'
    Integration::USDAParameters.ndbnos
  end

  desc 'Running the integration task'
  task update_aliments: :environment do
    puts '============================'
    Integration::USDA.download_aliment
  end
end
