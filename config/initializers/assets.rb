# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
# Rails.application.config.assets.precompile += %w( challenge.js )
# Rails.application.config.assets.precompile += %w( recaptcha.js )
Rails.application.config.assets.precompile += %w( yahoo-dom-event.js )
Rails.application.config.assets.precompile += %w( container-min.js )
Rails.application.config.assets.precompile += %w( Frontpage.js )
Rails.application.config.assets.precompile += %w( newsletter.js )
Rails.application.config.assets.precompile += %w( analytics.js )
Rails.application.config.assets.precompile += %w( prum.js )

Rails.application.config.assets.precompile += %w( style3.css )
Rails.application.config.assets.precompile += %w( frontpage.css )