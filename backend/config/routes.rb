Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :seasons, only: [:index, :create, :show] do
        member { patch :activate }
        resources :tribes, only: [:create, :update, :destroy]
        resources :players, only: [:create, :update, :destroy]
      end
    end
  end
end
