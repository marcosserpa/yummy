class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def set_page
    @page = params[:page].respond_to?(:to_i) ? [1, params[:page].to_i].max : 1
  end
end
