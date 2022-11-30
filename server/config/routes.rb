Rails.application.routes.draw do
  post "/login", to: "sessions#create"
  post "/logout", to: "sessions#destroy"
  get "/logged_in", to: "sessions#is_logged_in?"

  get "/users/find", to: "users#find"
  resources :users, only: [:create, :show, :index, :new, :destroy]
  delete "/users", to: "users#destroy"
  put "/users/password", to: "users#update_password"

  get "/faq/find", to: "faq#find"
  resources :faq, only: [:create, :new, :show, :index, :update, :destroy]

  # English: For each user, make a route to get user/:id/confirm_email
  resources :users do
    member do
      get :confirm_email
    end
  end

  # Allowlist routes
  resources :allowlist_domains, only: [:create, :show, :index, :destroy]
  resources :allowlist_emails, only: [:create, :show, :index, :destroy]
  post "/allowlist_emails/transfer_primary_contact", to: "allowlist_emails#transferPrimaryContact"

  get "/users/:id/meetings", to: "users#get_meetings"
  get "/users/:id/meetings/accepted", to: "users#get_accepted_meetings"
  get "/users/:id/meetings/pending", to: "users#get_pending_meetings"
  get "/users/:id/meetings/declined", to: "users#get_declined_meetings"
  get "/users/:id/meetings/cancelled", to: "users#get_cancelled_meetings"
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
  get "/companies/:id/users", to: "companies#reps"
  get "/companies/:id/availabilities", to: "companies#rep_availabilities"
  put "/companies/:id", to: "companies#update"
  delete "/companies/:id", to: "companies#destroy"
  # post "/users/:id/companies/:company_id", to: "users#add_to_company"
  # delete "users/:id/companies/:company_id", to: "users#delete_from_company"
  get "/companies/public", to: "companies#public_index", as: "public_index"

  resources :availabilities, only: [:create, :show, :index, :update, :destroy]
  get "users/:id/availabilities", to: "users#get_availabilies"
  get "users/:id/meetings/owned/available", to: "users#get_owned_and_avail_meetings"
  get "users/:id/meetings/owned/not_available", to: "users#get_owned_but_na_meetings"
  get "users/:id/user_meetings/available", to: "users#get_invitations_avail"
  get "users/:id/user_meetings/not_available", to: "users#get_invitations_na"
  delete "users/:id/meetings/owned/not_available", to: "users#delete_owned_but_na_meetings"
  delete "users/:id/user_meetings/not_available", to: "users#delete_na_invitations"

  resources :events, only: [:index, :create, :show, :update, :destroy]
  get "events/:id/availabilities", to: "events#get_availabilities"
  get "events/:id/meetings", to: "events#get_meetings"
  get "events/:id/users", to: "events#get_users"

  post "events/:id/users/:user_id", to: "events#signup"
  delete "events/:id/users/:user_id", to: "events#signout"
end
