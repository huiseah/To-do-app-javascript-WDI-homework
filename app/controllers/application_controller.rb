class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authentication

  def ensure_logged_in
  	redirect_to(root_path) if @auth.nil?
  end

  private 
  def authentication
  	@auth = User.find(session[:user_id]) if session[:user_id].present?
  end
end
