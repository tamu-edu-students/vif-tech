Rails.application.routes.draw do

  post '/login',    to: 'sessions#create'
  post '/logout',   to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  
  get '/users/find', to: 'users#show_by_find'
  get '/company-representative-signup', to: 'users#new'
  post '/company-representative-signup', to: 'users#create'


  resources :users, only: [:create, :show, :index] 

  # English: For each user, make a route to get user/:id/confirm_email
  resources :users do
    member do
      get :confirm_email
    end
  end

  # Allowlist routes
  resources :allowlist_domains, only: [:create, :show, :index, :destroy] 
  resources :allowlist_emails, only: [:create, :show, :index, :destroy] 


end
