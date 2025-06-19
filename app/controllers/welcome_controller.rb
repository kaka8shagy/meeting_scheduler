class WelcomeController < ApplicationController
  before_action :require_login

  def index
  end

  private

  def require_login
    unless logged_in?
      redirect_to login_path, alert: 'You must be logged in to access this page.'
    end
  end
end
