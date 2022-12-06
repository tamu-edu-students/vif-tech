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

# only for testing purposes
# AllowlistEmail.create(email: "vol_1@gmail.com", usertype: "volunteer");
# AllowlistEmail.create(email: "vol_2@yahoo.com", usertype: "volunteer");
# AllowlistEmail.create(email: "vol_3@aol.com", usertype: "volunteer");
# User.create(email: "vol_1@gmail.com", firstname: "Vol", lastname: "One", password: "pw", email_confirmed: true, usertype: "volunteer");
# User.create(email: "vol_2@yahoo.com", firstname: "Vol", lastname: "Two", password: "pw", email_confirmed: true, usertype: "volunteer");
# User.create(email: "vol_3@aol.com", firstname: "Vol", lastname: "Three", password: "pw", email_confirmed: true, usertype: "volunteer");
# User.create(email: "student_1@tamu.edu", firstname: "Student", lastname: "One", password: "pw", email_confirmed: true, usertype: "student");
# User.create(email: "student_2@arch.tamu.edu", firstname: "Student", lastname: "Two", password: "pw", email_confirmed: true, usertype: "student");
# User.create(email: "student_3@exchange.tamu.edu", firstname: "Student", lastname: "Three", password: "pw", email_confirmed: true, usertype: "student");
# User.create(email: "student_4@tamu.edu", firstname: "Student", lastname: "Four", password: "pw", email_confirmed: true, usertype: "student");

#TODO: Correct the registration times
case Rails.env
when "production"
  Event.create(title: "Portfolio Review 1", description: "First portfolio review", start_time: "2022-10-22T10:00:00CDT", end_time: "2022-10-22T16:00:00CDT", registration_start_time: "2022-10-11T10:00:00CDT", registration_end_time: "2022-10-18T17:00:00CDT")
  Event.create(title: "Mock Interview 1", description: "First mock interview", start_time: "2023-02-16T10:00:00CST", end_time: "2023-02-16T16:00:00CST", registration_start_time: "2023-02-02T10:00:00CST", registration_end_time: "2023-02-09T17:00:00CST")
  Event.create(title: "Mock Interview 2", description: "Second mock interview", start_time: "2023-02-17T10:00:00CST", end_time: "2023-02-17T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Portfolio Review 2", description: "Second portfolio review", start_time: "2023-02-18T10:00:00CST", end_time: "2023-02-18T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
  Event.create(title: "Virtual Fair", description: "Virtual Visualization Industry Fair (VIF)", start_time: "2023-02-23T10:00:00CST", end_time: "2023-02-23T16:00:00CST", registration_start_time: "2020-01-01T10:00:00CST", registration_end_time: "2024-01-01T17:00:00CST")
end
