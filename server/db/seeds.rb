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
case Rails.env

when "production"
  Event.create(title: "Portfolio Review 1", description: "First portfolio review", start_time: "2022-10-22T10:00:00CDT", end_time: "2022-10-22T16:00:00CDT")
  Event.create(title: "Mock Interview 1", description: "First mock interview", start_time: "2023-02-16T10:00:00CST", end_time: "2023-02-16T16:00:00CST")
  Event.create(title: "Mock Interview 2", description: "Second mock interview", start_time: "2023-02-17T10:00:00CST", end_time: "2023-02-17T16:00:00CST")
  Event.create(title: "Portfolio Review 2", description: "Second portfolio review", start_time: "2023-02-18T10:00:00CST", end_time: "2023-02-18T16:00:00CST")
  Event.create(title: "Virtual Fair", description: "Virtual Visualization Industry Fair (VIF)", start_time: "2023-02-23T10:00:00CST", end_time: "2023-02-23T16:00:00CST")
end
