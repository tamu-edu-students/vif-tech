Rails.application.routes.draw do
  post "/login", to: "sessions#create"
  post "/logout", to: "sessions#destroy"
  get "/logged_in", to: "sessions#is_logged_in?"

  get "/users/find", to: "users#find"
  resources :users, only: [:create, :show, :index, :new]

  resources :faq, only: [:create, :show, :index, :update, :destroy] 

  # English: For each user, make a route to get user/:id/confirm_email
  resources :users do
    member do
      get :confirm_email
    end
  end

  # Allowlist routes
  resources :allowlist_domains, only: [:create, :show, :index, :destroy] 
  resources :allowlist_emails, only: [:create, :show, :index, :destroy] 


  get "/users/:id/meetings", to: "users#get_meetings"
  get "/users/:id/meetings/attending", to: "users#get_attending_meetings"
  get "/users/:id/meetings/pending", to: "users#get_pending_meetings"
  get "/users/:id/meetings/owned", to: "users#get_owned_meetings"
  get "/users/:id/meetings/:meeting_id", to: "users#invited_to_meeting?"
  post "/users/:id/meetings/:meeting_id", to: "users#add_to_meeting"
  put "/users/:id/meetings/:meeting_id", to: "users#update_meeting"
  delete "/users/:id/meetings/:meeting_id", to: "users#delete_from_meeting"

  resources :meetings, only: [:create, :show, :index, :update, :destroy]
  resources :user_meetings, only: [:show, :index]

  get "/companies", to: "companies#index"
  get "/companies/new", to: "companies#new"
  post "/companies", to: "companies#create"
  get "/companies/:id", to: "companies#show"
  get "/companies/:id/edit", to: "companies#edit"
  put "/companies/:id", to: "companies#update"
  delete "/companies/:id", to: "companies#destroy"
  post "/users/:id/companies/:id", to: "users#add_to_company"
  delete "users/:id/companies/:id", to: "users#delete_from_company"
end
