# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# env :PATH, ENV['PATH']
# env :GEM_PATH, '/Users/marcosserpa/.rbenv/versions/2.2.0/lib/ruby/gems/2.2.0'
env :GEM_PATH, '/Users/marcosserpa/.gem/ruby/2.0.0'
set :output, 'log/cron_log.log'

#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

# every 1.day, at: '00:48' do
#   rake "integrate:update_aliments", :environment => 'development'
# end

every 6.months, at: ['0:30am', '2:00am', '3:30am', '5:00am', '6:30am',
  '8:00am', '9:30am', '11:00am', '12:30pm', '2:00pm'] do
  # ndbnos = Integration::USDAParameters.get_ndbnos
  # repetitions = (ndbnos.size / 1000) + 1
  rake 'integrate:update_aliments'
end

# every 6.months, at: '2:00am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '3:30am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '5:00am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '6:30am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '8:00am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '9:30am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '11:00am' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '12:30pm' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
#
# every 6.months, at: '2:00pm' do
#   # ndbnos = Integration::USDAParameters.get_ndbnos
#   # repetitions = (ndbnos.size / 1000) + 1
#   rake "integrate:update_aliments"
# end
