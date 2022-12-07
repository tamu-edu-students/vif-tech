# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

User.create(firstname: "admin", lastname: "admin", email: "admin@admin.com", password: ENV["ADMIN_PW"], email_confirmed: true, usertype: "admin")

AllowlistDomain.create(domain: "tamu.edu", usertype: "student")
AllowlistDomain.create(domain: "arch.tamu.edu", usertype: "student")
AllowlistDomain.create(domain: "exchange.tamu.edu", usertype: "student")

#TODO: Correct the registration times
case Rails.env
when "production"
  Event.create(title: "Portfolio Review 1", description: "First portfolio review", start_time: "2022-10-22T10:00:00CDT", end_time: "2022-10-22T16:00:00CDT", registration_start_time: "2022-10-11T10:00:00CDT", registration_end_time: "2022-10-18T17:00:00CDT")
  Event.create(title: "Mock Interview 1", description: "First mock interview", start_time: "2023-02-16T10:00:00CST", end_time: "2023-02-16T16:00:00CST", registration_start_time: "2023-02-02T10:00:00CST", registration_end_time: "2023-02-09T17:00:00CST")
  Event.create(title: "Mock Interview 2", description: "Second mock interview", start_time: "2023-02-17T10:00:00CST", end_time: "2023-02-17T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Portfolio Review 2", description: "Second portfolio review", start_time: "2023-02-18T10:00:00CST", end_time: "2023-02-18T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Virtual Fair", description: "Virtual Visualization Industry Fair (VIF)", start_time: "2023-02-23T10:00:00CST", end_time: "2023-02-23T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
end

# only for testing purposes
# Company.create(name: "Disney");
# Company.create(name: "Activision");

# AllowlistEmail.create(email: "vol_1@gmail.com", usertype: "volunteer"); #1
# AllowlistEmail.create(email: "vol_2@yahoo.com", usertype: "volunteer"); #2
# AllowlistEmail.create(email: "vol_3@aol.com", usertype: "volunteer"); #3
# AllowlistEmail.create(email: "rep_1@disney.com", usertype: "company representative", company_id: 1, is_primary_contact: 1); #4
# AllowlistEmail.create(email: "rep_2@disney.com", usertype: "company representative", company_id: 1); #5
# AllowlistEmail.create(email: "rep_3@activision.com", usertype: "company representative", company_id: 2); #6
# AllowlistEmail.create(email: "rep_4@activision.com", usertype: "company representative", company_id: 2); #7

# User.create(email: "vol_1@gmail.com", firstname: "Vol", lastname: "One", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 1); #1
# User.create(email: "vol_2@yahoo.com", firstname: "Vol", lastname: "Two", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 2); #2
# User.create(email: "vol_3@aol.com", firstname: "Vol", lastname: "Three", password: "pw", email_confirmed: true, usertype: "volunteer", allowlist_email_id: 3); #3
# User.create(email: "student_1@tamu.edu", firstname: "Student", lastname: "One", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2022, class_semester: "spring"); #4
# User.create(email: "student_2@arch.tamu.edu", firstname: "Student", lastname: "Two", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 2, class_year: 2027, class_semester: "summer"); #5
# User.create(email: "student_3@exchange.tamu.edu", firstname: "Student", lastname: "Three", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 3, class_year: 2025, class_semester: "fall"); #6
# User.create(email: "student_4@tamu.edu", firstname: "Student", lastname: "Four", password: "pw", email_confirmed: true, usertype: "student", allowlist_domain_id: 1, class_year: 2022, class_semester: "spring"); #7
# User.create(email: "rep_1@disney.com", firstname: "Rep", lastname: "One_Disney", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 4, company_id: 1, title: "Recruiter"); #8
# User.create(email: "rep_2@disney.com", firstname: "Rep", lastname: "Two_Disney", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 5, company_id: 1, title: "Awesome Designer"); #9
# User.create(email: "rep_3@activision.com", firstname: "Rep", lastname: "Three_Activision", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 6, company_id: 2, title: "Graphics Specialist"); #10
# User.create(email: "rep_4@activision.com", firstname: "Rep", lastname: "Four_Activision", password: "pw", email_confirmed: true, usertype: "company representative", allowlist_email_id: 7, company_id: 2, title: "Game QA"); #11

# Focus.create(name: "Animation");
# Focus.create(name: "Graphic Design");
# Focus.create(name: "Concept Art/Visual Dev");
# Focus.create(name: "Character Modeling");
# Focus.create(name: "Env Modeling");
# Focus.create(name: "Surface/Look Dev");
# Focus.create(name: "3D Generalist");
# Focus.create(name: "Lighting");
# Focus.create(name: "Rigging");
# Focus.create(name: "Layout");
# Focus.create(name: "Character FX");
# Focus.create(name: "VFX");
# Focus.create(name: "Game Design");
# Focus.create(name: "Level Design");
# Focus.create(name: "Tool Development");
# Focus.create(name: "Technical Art");
