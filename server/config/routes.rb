Rails.application.routes.draw do

  post '/login',    to: 'sessions#create'
  post '/logout',   to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  
  get '/users/find', to: 'users#show_by_find'
  resources :users, only: [:create, :show, :index] 

  # resources :users, only: [:create, :show, :index] do
  #   resources :items, only: [:create, :show, :index, :destroy]
  # end

  # English: For each user, make a route to get user/:id/confirm_email
  resources :users do
    member do
      get :confirm_email
    end
  end

end
