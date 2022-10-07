class UserMailer < ActionMailer::Base
    default :from => Rails.application.config.signup_email_address

 def registration_confirmation(user)
    @user = user
    mail(:to => @user.email, :subject => "Registration Confirmation")
 end

end