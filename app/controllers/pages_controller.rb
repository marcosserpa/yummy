class PagesController < ApplicationController
  def send_contact_email
    @errors = []
    @errors << :name    if params[:name].blank?
    @errors << :email   if params[:email].match(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i).nil?
    @errors << :message if params[:message].blank?
    @errors << :answer  if params[:answer] != params[:expected_answer]

    if @errors.blank?
      ContactMailer.contact_email(params).deliver
      redirect_to contact_path, notice: t('message.contact_response')
    else
      @random_question, @random_anwser = random_captcha
      render 'home'
    end
  end

  def about; end

  def index
    @aliments_count = Aliment.all.count

    respond_to do |format|
      format.html
    end
  end
end
