# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += %w(
  gmap.js
  gmap_api.js
  overlay.js
  upload.js
  html5_video.js
  jquery-ui.min.js
  jquery.fileupload-process.js
  jquery.fileupload-ui.js
  jquery.fileupload.js
  jquery.iframe-transport.js
)
