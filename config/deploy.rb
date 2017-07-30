# # config valid only for current version of Capistrano
# lock "3.8.2"

# # Makes rbenv know how to execude things when using 'sudo'
# SSHKit.config.command_map[:sudo] = 'sudo /home/deploy/.rbenv/shims/gem'

# set :use_sudo, false
# set :application, "yummy"
# set :repo_url, "git@github.com:marcosserpa/yummy.git"
# set :branch, :master
# set :deploy_to, '/home/deploy/yummy'
# set :pty, true
# set :linked_files, %w{config/database.yml config/application.yml}
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/uploads}
# set :keep_releases, 5
# set :rbenv_type, :user # or :system, depends on your rbenv setup
# # set :rbenv_ruby, '2.0.0-p247'
# # in case you want to set ruby version from the file:
# set :rbenv_ruby, File.read('.ruby-version').strip

# set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
# set :rbenv_map_bins, %w{rake gem bundle ruby rails}
# set :rbenv_roles, :all # default value

# set :puma_rackup, -> { File.join(current_path, 'config.ru') }
# set :puma_state, "#{shared_path}/tmp/pids/puma.state"
# set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
# set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"    #accept array for multi-bind
# set :puma_conf, "#{shared_path}/puma.rb"
# set :puma_access_log, "#{shared_path}/log/puma_error.log"
# set :puma_error_log, "#{shared_path}/log/puma_access.log"
# set :puma_role, :app
# set :puma_env, fetch(:rack_env, fetch(:rails_env, 'production'))
# set :puma_threads, [0, 8]
# set :puma_workers, 0
# set :puma_worker_timeout, nil
# set :puma_init_active_record, true
# set :puma_preload_app, false

# set :default_environment, { 'PATH' => '$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH' }

# # Default branch is :master
# # ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# # Default deploy_to directory is /var/www/my_app_name
# # set :deploy_to, "/var/www/my_app_name"

# # Default value for :format is :airbrussh.
# # set :format, :airbrussh

# # You can configure the Airbrussh format using :format_options.
# # These are the defaults.
# # set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# # Default value for :pty is false
# # set :pty, true

# # Default value for :linked_files is []
# # append :linked_files, "config/database.yml", "config/secrets.yml"

# # Default value for linked_dirs is []
# # append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# # Default value for default_env is {}
# # set :default_env, { path: "/opt/ruby/bin:$PATH" }

# # Default value for local_user is ENV['USER']
# # set :local_user, -> { `git config user.name`.chomp }

# # Default value for keep_releases is 5
# # set :keep_releases, 5



# DEPLOY WITH MINA
require 'mina/rails'
require 'mina/git'
require 'mina/rvm'

set :user, 'ubuntu' #deploy user
set :application_name, 'yummy'
set :domain, 'ec2-35-160-98-167.us-west-2.compute.amazonaws.com'
set :identity_file, 'MarcosSerpaRetina.pem' # ec2 instance key file
set :deploy_to, '/home/ubuntu/yummy' #path to app
set :app_path, lambda { "#{fetch(:deploy_to)}/#{fetch(:current_path)}" }
set :repository, 'git@github.com:marcosserpa/yummy.git' #Remote Repo Path
set :branch, 'master'
set :shared_paths, ['log', 'tmp', 'shared']
set :shared_dirs, fetch(:shared_dirs, []).push('tmp')

task :environment do
  invoke :'rvm:use', 'ruby-2.2.0@default'
end


task :setup do
  #create the folder structure
end


desc "Deploys the current version to the server."
task :deploy do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    on :launch do
      invoke :'puma:restart'
    end
  end
end

namespace :puma do
  desc "Start the application"
  task :start do
    command 'echo "-----> Start Puma"'
    command "sudo start puma-manager", :pty => false
  end

  desc "Stop the application"
  task :stop do
    command 'echo "-----> Stop Puma"'
    command "sudo stop puma-manager"
  end

  desc "Restart the application"
  task :restart do
    command 'echo "-----> Restart Puma"'
    command "sudo restart puma-manager"
  end
end

