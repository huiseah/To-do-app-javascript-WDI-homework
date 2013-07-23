Todo::Application.routes.draw do
 root :to => 'home#index'
 resources :users, :only => [:index, :new, :create]
 resources :priorities, :only => [:index, :create, :update] do
 	member do
 		post :up
 		post :down
 	end
 end
	resources :tasks, :only => [:index, :create, :update]

 get '/login' => 'session#new'
 post '/login' => 'session#create'
 delete '/login' => 'session#destroy'
 
end
