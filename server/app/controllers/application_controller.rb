class ApplicationController < ActionController::Base
  before_action :set_csrf_cookie
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  protect_from_forgery with: :exception 
  
  def cookie 
      "ok"
  end
  
  private 
  
  def set_csrf_cookie
      cookies["CSRF-TOKEN"] = {
          value: form_authenticity_token,
          domain: :all 
      }
  end

  skip_before_action :verify_authenticity_token
  helper_method :login!, :logged_in?, :current_user, :authorized_user?, :logout!, :set_user

  def login!
    session[:user_id] = @user.id
  end

  def logged_in?
    !!session[:user_id]
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def authorized_user?
    @user == current_user
  end

  def logout!
    session.clear
  end

  def set_user
    @user = User.find_by(id: session[:user_id])
  end

  def is_admin
    unless (logged_in? && current_user && current_user.usertype == "admin")
      render json: {
        errors: ["UnAuthenticated or UnAuthorized  User"],
      }, status: :unauthorized
    end
  end
end
