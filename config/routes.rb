Rails.application.routes.draw do
  root 'application#index'

  namespace :api, defaults:{format: 'json'} do
    resources :clues, only: [:index, :show]
    resources :categories, only: [:index, :show]
    get 'categories/by_season/:id' => 'categories#by_season'
    get 'categories/by_airdate/:date' => 'categories#by_airdate'
    get 'new_game' => 'categories#new_game'
  end

  resources :users, only: [:new, :create]

  get 'scores/by_user/:user_id' => 'scores#by_user'
  resources :scores, only: [:create]

  
  get 'sessions' => 'sessions#new'
  post 'sessions' => 'sessions#create'
  get 'current_user' => 'sessions#current_user'
  delete 'sessions' => 'sessions#destroy'

  get 'games' => 'game#index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
