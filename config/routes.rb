Rails.application.routes.draw do
  get "welcome/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  root "welcome#index"

  # ... other specific Rails routes (e.g., /api/...)

  # Catch-all route: MUST be the last route in your routes.rb
  # This sends any unhandled request to your welcome#index action,
  # where your React app will then take over routing.
  get '*path', to: 'welcome#index', constraints: ->(request) {
    !request.xhr? && request.format.html?
  }
end
