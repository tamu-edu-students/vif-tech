if Rails.env === 'production' 
  Rails.application.config.session_store :cookie_store, key: '_vif-tech', domain: 'vif-tech-json-api', same_site: 'None', secure: true
else
  Rails.application.config.session_store :cookie_store, key: '_vif-tech'
end