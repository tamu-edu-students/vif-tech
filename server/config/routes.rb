Rails.application.routes.draw do
  post "/login", to: "sessions#create"
  post "/logout", to: "sessions#destroy"
  get "/logged_in", to: "sessions#is_logged_in?"

  get "/users/find", to: "users#show_by_find"
  resources :users, only: [:create, :show, :index, :new]

  # English: For each user, make a route to get user/:id/confirm_email
  resources :users do
    member do
      get :confirm_email
    end
  end

  resources :meetings, only: [:create, :show, :index, :update]
end
