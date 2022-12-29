# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# student
# company representative
# volunteer

User.create(firstname: "admin", lastname: "admin", email: "admin@admin.com", password: ENV["ADMIN_PW"], email_confirmed: true, usertype: "admin") #1

AllowlistDomain.create(domain: "tamu.edu", usertype: "student") #1
AllowlistDomain.create(domain: "arch.tamu.edu", usertype: "student") #2
AllowlistDomain.create(domain: "exchange.tamu.edu", usertype: "student") #3


#TODO: Correct the registration times
# case Rails.env
# when "production"
  Event.create(title: "Portfolio Review 1", description: "First portfolio review", start_time: "2022-10-22T10:00:00CDT", end_time: "2022-10-22T16:00:00CDT", registration_start_time: "2022-10-11T10:00:00CDT", registration_end_time: "2022-10-18T17:00:00CDT")
  Event.create(title: "Mock Interview 1", description: "First mock interview", start_time: "2023-02-16T10:00:00CST", end_time: "2023-02-16T16:00:00CST", registration_start_time: "2023-02-02T10:00:00CST", registration_end_time: "2023-02-09T17:00:00CST")
  Event.create(title: "Mock Interview 2", description: "Second mock interview", start_time: "2023-02-17T10:00:00CST", end_time: "2023-02-17T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Portfolio Review 2", description: "Second portfolio review", start_time: "2023-02-18T10:00:00CST", end_time: "2023-02-18T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Virtual Fair", description: "Virtual Visualization Industry Fair (VIF)", start_time: "2023-02-23T10:00:00CST", end_time: "2023-02-23T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
# end


# only for testing purposes
Company.create(name: "Disney", logo_img_src: "https://external-preview.redd.it/ZblqNcWfbxc7wmZ-9oZgFM8idiFrGzbqYbBTMNOezP0.jpg?auto=webp&s=e092bf4cd0a322dcdee69a0118e9c79767f544c7", website_link: "https://www.disney.com/"); #1
Company.create(name: "Activision", logo_img_src: "https://www.videogameschronicle.com/files/2021/08/activision-logo-vanguard.jpg", website_link: "https://www.activision.com/"); #2
Company.create(name: "Credera", logo_img_src: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/7b21773d1753d687ae0142a4433b7423"); #3
Company.create(name: "Electronic Arts", logo_img_src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7dKEdXdcXfBHg0Dz6uqfvTeWRIz0oI4FOSQ&usqp=CAU"); #4
Company.create(name: "Cloud Imperium Games", logo_img_src: "https://pbs.twimg.com/profile_images/1541476790593626115/_QYRYdIY_400x400.jpg"); #5
Company.create(name: "BonusXP", logo_img_src: "https://media.glassdoor.com/sqll/1917921/bonusxp-squarelogo-1635938425504.png"); #6
Company.create(name: "Blur Studio Inc.", logo_img_src: "https://yt3.ggpht.com/ytc/AMLnZu8cDNjG3G5GEO1yKTOZ4k_QPwrxJ98zUqYr4eeM=s900-c-k-c0x00ffffff-no-rj"); #7
# Company.create(name: "Mighty Coconut"); #8
# Company.create(name: "AEM Creation"); #9
# Company.create(name: "DreamWorks Animation"); #10
# Company.create(name: "App Lovin"); #11
# Company.create(name: "K2Share"); #12



AllowlistEmail.create(email: "vol_1@gmail.com", usertype: "volunteer"); #1
AllowlistEmail.create(email: "vol_2@gmail.com", usertype: "volunteer"); #2
AllowlistEmail.create(email: "vol_3@gmail.com", usertype: "volunteer"); #3
AllowlistEmail.create(email: "rep-dis_1@disney.com", usertype: "company representative", company_id: 1, is_primary_contact: 1); #4
AllowlistEmail.create(email: "rep-dis_2@disney.com", usertype: "company representative", company_id: 1); #5
AllowlistEmail.create(email: "rep-act_1@activision.com", usertype: "company representative", company_id: 2, is_primary_contact: 1); #6
AllowlistEmail.create(email: "rep-act_2@activision.com", usertype: "company representative", company_id: 2); #7

AllowlistEmail.create(email: "rep-dis_3@disney.com", usertype: "company representative", company_id: 1); #8
AllowlistEmail.create(email: "rep-act_3@activision.com", usertype: "company representative", company_id: 2); #9

AllowlistEmail.create(email: "rep-cred_1@credera.com", usertype: "company representative", company_id: 3, is_primary_contact: 1); #10
AllowlistEmail.create(email: "rep-cred_2@credera.com", usertype: "company representative", company_id: 3); #11

AllowlistEmail.create(email: "rep-ea_1@ea.com", usertype: "company representative", company_id: 4, is_primary_contact: 1); #12
AllowlistEmail.create(email: "rep-ea_2@ea.com", usertype: "company representative", company_id: 4); #13

AllowlistEmail.create(email: "rep-cloud_1@cloud-imperium-games.com", usertype: "company representative", company_id: 5, is_primary_contact: 1); #14

AllowlistEmail.create(email: "rep-bonus_1@bonus-xp.com", usertype: "company representative", company_id: 6, is_primary_contact: 1); #15

AllowlistEmail.create(email: "rep-blur_1@blur-studio-inc.com", usertype: "company representative", company_id: 7, is_primary_contact: 1); #16

AllowlistEmail.create(email: "NkemdiAnyiam@gmail.com", usertype: "company representative", company_id: 1); #17
AllowlistEmail.create(email: "NkemdiAnyiam@gmail.com", usertype: "company representative", company_id: 2); #18
AllowlistEmail.create(email: "NkemdiAnyiam@gmail.com", usertype: "company representative", company_id: 3); #19

# AllowlistEmail.create(email: "rep-mighty_1@mighty-coconut.com", usertype: "company representative", company_id: 8, is_primary_contact: 1); #20

# AllowlistEmail.create(email: "rep-aem_1@aem-creations.com", usertype: "company representative", company_id: 9, is_primary_contact: 1); #21

# AllowlistEmail.create(email: "rep-dream_1@dream-works.com", usertype: "company representative", company_id: 10, is_primary_contact: 1); #22

# AllowlistEmail.create(email: "rep-app_1@app-lovin.com", usertype: "company representative", company_id: 11, is_primary_contact: 1); #23

# AllowlistEmail.create(email: "rep-k2_1@k2-share.com", usertype: "company representative", company_id: 12, is_primary_contact: 1); #24



AllowlistDomain.create(domain: "disney.com", usertype: "company representative", company_id: 1); #4
AllowlistDomain.create(domain: "bonus-xp.com", usertype: "company representative", company_id: 6); #5
AllowlistDomain.create(domain: "credera.com", usertype: "company representative", company_id: 3); #6
# AllowlistDomain.create(domain: "mighty-coconut.com", usertype: "company representative", company_id: 8); #7



User.create(email: "vol_1@gmail.com", firstname: "Vol", lastname: "One", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 1); #2
User.create(email: "vol_2@gmail.com", firstname: "Vol", lastname: "Two", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 2); #3
User.create(email: "vol_3@gmail.com", firstname: "Vol", lastname: "Three", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 3); #4

User.create(email: "student_1@tamu.edu", firstname: "Student", lastname: "One", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2022, class_semester: "spring", resume_link: "https://www.google.com", portfolio_link: "https://www.bing.com/"); #5
User.create(email: "student_2@arch.tamu.edu", firstname: "Student", lastname: "Two", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 2, class_year: 2027, class_semester: "summer", resume_link: "https://www.youtube.com"); #6
User.create(email: "student_3@exchange.tamu.edu", firstname: "Student", lastname: "Three", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 3, class_year: 2025, class_semester: "fall"); #7
User.create(email: "student_4@tamu.edu", firstname: "Student", lastname: "Four", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2022, class_semester: "spring"); #8

User.create(email: "rep-dis_1@disney.com", firstname: "Rep_One", lastname: "One_Disney", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 4, company_id: 1, title: "Recruiter"); #9
User.create(email: "rep-dis_2@disney.com", firstname: "Rep_Two", lastname: "Two_Disney", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 5, company_id: 1, title: "Awesome Designer"); #10

User.create(email: "rep-act_1@activision.com", firstname: "Rep_One", lastname: "Activision", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 6, company_id: 2, title: "Graphics Specialist"); #11
User.create(email: "rep-act_2@activision.com", firstname: "Rep_Two", lastname: "Activision", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 7, company_id: 2, title: "Game QA"); #12

User.create(email: "rep-dis_3@disney.com", firstname: "Rep_Three", lastname: "Disney", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 8, allowlist_domain_id: 4, company_id: 1, title: "Recruiter"); #13
User.create(email: "rep-act_3@activision.com", firstname: "Rep_Three", lastname: "Activision", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 9, company_id: 2, title: "Game Genie"); #14

User.create(email: "rep-cred_1@credera.com", firstname: "Rep_One", lastname: "Credera", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 10, allowlist_domain_id: 6, company_id: 3, title: "UI/UX"); #15
User.create(email: "rep-cred_2@credera.com", firstname: "Rep_Two", lastname: "Credera", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 11, allowlist_domain_id: 6, company_id: 3, title: "Front-end Dev"); #16

User.create(email: "rep-ea_1@ea.com", firstname: "Rep_One", lastname: "EA", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 12, company_id: 4, title: "Unity Programmer"); #17
User.create(email: "rep-ea_2@ea.com", firstname: "Rep_Two", lastname: "EA", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 13, company_id: 4, title: "Gamer God"); #18

User.create(email: "rep-cloud_1@cloud-imperium-games.com", firstname: "Rep_One", lastname: "CIG", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 14, company_id: 5, title: "Game Designer"); #19

User.create(email: "rep-bonus_1@bonus-xp.com", firstname: "Rep_One", lastname: "Bonus-XP", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 15, allowlist_domain_id: 5, company_id: 6, title: "Unreal Engine Developer"); #20

User.create(email: "rep-blur_1@blur-studio-inc.com", firstname: "Rep_One", lastname: "Blur-Studio-Inc", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 16, company_id: 7, title: "Animation Director"); #21


User.create(email: "student_5@tamu.edu", firstname: "Student", lastname: "Five", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2025, class_semester: "summer"); #22
User.create(email: "student_6@exchange.tamu.edu", firstname: "Student", lastname: "Six", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2024, class_semester: "fall"); #23


Focus.create(name: "Animation"); #1
Focus.create(name: "Graphic Design"); #2
Focus.create(name: "Concept Art/Visual Dev"); #3
Focus.create(name: "Character Modeling"); #4
Focus.create(name: "Env Modeling"); #5
Focus.create(name: "Surface/Look Dev"); #6
Focus.create(name: "3D Generalist"); #7
Focus.create(name: "Lighting"); #8
Focus.create(name: "Rigging"); #9
Focus.create(name: "Layout"); #10
Focus.create(name: "Character FX"); #11
Focus.create(name: "VFX"); #12
Focus.create(name: "Game Design"); #13
Focus.create(name: "Level Design"); #14
Focus.create(name: "Tool Development"); #15
Focus.create(name: "Technical Art"); #16

UserFocus.create(user_id: 2, focus_id: 1);
UserFocus.create(user_id: 2, focus_id: 3);
UserFocus.create(user_id: 2, focus_id: 7);

UserFocus.create(user_id: 3, focus_id: 1);
UserFocus.create(user_id: 3, focus_id: 2);
UserFocus.create(user_id: 3, focus_id: 3);

UserFocus.create(user_id: 4, focus_id: 3);
UserFocus.create(user_id: 4, focus_id: 5);
UserFocus.create(user_id: 4, focus_id: 6);

UserFocus.create(user_id: 5, focus_id: 11);
UserFocus.create(user_id: 5, focus_id: 13);

UserFocus.create(user_id: 6, focus_id: 1);
UserFocus.create(user_id: 6, focus_id: 3);

CompanyFocus.create(company_id: 1, focus_id: 1);
CompanyFocus.create(company_id: 1, focus_id: 3);

CompanyFocus.create(company_id: 2, focus_id: 13);
CompanyFocus.create(company_id: 2, focus_id: 8);

CompanyFocus.create(company_id: 3, focus_id: 2);

CompanyFocus.create(company_id: 4, focus_id: 13);
CompanyFocus.create(company_id: 4, focus_id: 5);

CompanyFocus.create(company_id: 5, focus_id: 13);

CompanyFocus.create(company_id: 6, focus_id: 13);

CompanyFocus.create(company_id: 7, focus_id: 1);

answer1 = "<p>YES. You must register <a href=\"https://www.test-vizindustryfair.com/users/new\" target=\"_blank\">HERE</a></p>\n<p><br>For  in-person fairs: You will receive a printed name tag the day of the Industries Fair and your contact information will be made available to company representatives who may need to contact you after the fair.<br><br>For Virtual Fairs: Please make sure your virtual name is your first and last name, and your focus is mentioned afterwards.<br>For example: Mayet Andreassen - Modeling/LookDev, or Mayet Andreassen - UI/UX, ect.<br>&nbsp;</p>\n"
answer2 = "<p>You should wear clothes that are professionally appropriate for the position for which you are applying.<br>If you’re unsure of what to wear, you should always dress to impress.&nbsp;</p>"
answer3 = "<p>Absolutely! Student volunteers are essential for the Industry Fair to run smoothly.<br>Please email our student representatives at pvfavizindustryfair@tamu.edu if you are interested in participating.&nbsp;</p>\n"
Faq.create(question: "<p>Do I need to register to attend the fair?</p>\n", answer: answer1);
Faq.create(question: "<p>What is the dress code?</p>\n", answer: answer2);
Faq.create(question: "<p>Can I volunteer to help with the Industries Fair?</p>\n", answer: answer3);

EventSignup.create(user_id: 9, event_id: 5);
EventSignup.create(user_id: 10, event_id: 5);
EventSignup.create(user_id: 11, event_id: 5);
EventSignup.create(user_id: 12, event_id: 5);
EventSignup.create(user_id: 13, event_id: 5);
EventSignup.create(user_id: 14, event_id: 5);
EventSignup.create(user_id: 15, event_id: 5);
EventSignup.create(user_id: 16, event_id: 5);
EventSignup.create(user_id: 17, event_id: 5);
EventSignup.create(user_id: 18, event_id: 5);
EventSignup.create(user_id: 19, event_id: 5);
EventSignup.create(user_id: 20, event_id: 5);
EventSignup.create(user_id: 21, event_id: 5);
