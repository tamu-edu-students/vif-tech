# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

User.create(firstname: "admin", lastname: "admin", email:"admin@admin.com", password: ENV["ADMIN_PW"], email_confirmed:true, usertype: "admin")
AllowlistDomain.create(email_domain: "tamu.edu", usertype: "student")
AllowlistDomain.create(email_domain: "arch.tamu.edu", usertype: "student")
AllowlistDomain.create(email_domain: "exchange.tamu.edu", usertype: "student")