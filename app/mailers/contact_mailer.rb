class ContactMailer < ActionMailer::Base

  default from: "contato@codepolaris.com"

  def contact_email(params)
    @guest = params

    mail(to: 'marcosserpa@gmail.com;', from: @guest[:email], subject: @guest[:subject].present? ? @guest[:subject] : 'Site Contact')
  end

end