Rails.application.routes.draw do

  post '/login',    to: 'sessions#create'
  post '/logout',   to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  
  get '/users/find', to: 'users#show_by_find'

  get '/company-representative-signup', to: 'users#new'
  post '/company-representative-signup', to: 'users#create'

  resources :users, only: [:create, :show, :index] do
    resources :items, only: [:create, :show, :index, :destroy]
  end

end
