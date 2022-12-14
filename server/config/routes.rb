Rails.application.routes.draw do
  post "/login", to: "sessions#create"
  post "/logout", to: "sessions#destroy"
  get "/logged_in", to: "sessions#is_logged_in?"

  get "/users/find", to: "users#find"
  put "/users/password", to: "users#update_password"
  resources :users, only: [:create, :show, :index, :new, :destroy, :update]
  delete "/users", to: "users#destroy"

  get "/faq/find", to: "faq#find"
  resources :faq, only: [:create, :new, :show, :index, :update, :destroy]

  get "abouts/find", to: "abouts#find"
  resources :abouts
  resources :social_links

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
  get "meetings/:id/invitees", to: "meetings#get_invitees"
  put "meetings/:id/invitees", to: "meetings#swap_invitees"
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
  get "/companies/public", to: "companies#public_index", as: "public_index"

  resources :availabilities, only: [:create, :show, :index, :update, :destroy]
  get "users/:id/availabilities", to: "users#get_availabilies"
  get "users/:id/meetings/owned/available", to: "users#get_owned_and_avail_meetings"
  get "users/:id/meetings/owned/not_available", to: "users#get_owned_but_na_meetings"
  get "users/:id/user_meetings/available", to: "users#get_invitations_avail"
  get "users/:id/user_meetings/not_available", to: "users#get_invitations_na"
  delete "users/:id/meetings/owned/not_available", to: "users#delete_owned_but_na_meetings"
  delete "users/:id/user_meetings/not_available", to: "users#delete_na_invitations"

  get "/events/attending_companies/", to: "events#get_attending_companies"
  get "/events/company_meetings/", to: "events#get_company_meetings"
  get "/events/:id/attending_companies/", to: "events#get_attending_companies"
  get "/events/:id/company_meetings/", to: "events#get_company_meetings"
  resources :events, only: [:index, :create, :show, :update, :destroy]
  get "events/:id/availabilities", to: "events#get_availabilities"
  get "events/:id/meetings", to: "events#get_meetings"
  get "events/:id/users", to: "events#get_users"
  post "events/:id/signup", to: "events#signup"
  post "events/:id/signup/:user_id", to: "events#signup"
  delete "events/:id/signout", to: "events#signout"
  delete "events/:id/signout/:user_id", to: "events#signout"

  resources :event_signups, only: [:index, :show]

  resources :focuses, only: [:index, :create, :show, :update, :destroy]
  get "users/focuses", to: "users#get_focuses"
  get "users/:id/focuses", to: "users#get_focuses"
  post "users/focuses/:focus_id", to: "users#add_focus"
  post "users/:id/focuses/:focus_id", to: "users#add_focus"
  put "users/focuses/", to: "users#update_focus"
  put "users/:id/focuses/", to: "users#update_focus"
  delete "users/focuses/:focus_id", to: "users#remove_focus"
  delete "users/:id/focuses/:focus_id", to: "users#remove_focus"
  get "companies/focuses", to: "companies#get_focuses"
  get "companies/:id/focuses", to: "companies#get_focuses"
  post "companies/focuses/:focus_id", to: "companies#add_focus"
  post "companies/:id/focuses/:focus_id", to: "companies#add_focus"
  delete "companies/focuses/:focus_id", to: "companies#remove_focus"
  delete "companies/:id/focuses/:focus_id", to: "companies#remove_focus"
  put "companies/focuses/", to: "companies#update_focus"
  put "companies/:id/focuses/", to: "companies#update_focus"

  resources :user_focuses, only: [:index]
  resources :company_focuses, only: [:index]
end
