require 'uri'
require 'net/http'

Given('that I sign up with the following') do |table|
  # table is a Cucumber::MultilineArgument::DataTable
  page.driver.post("/users", {"user": table.rows_hash})
end

Then /^I should be in the user DB with name ([^\"]*)$/ do |username|
  page.driver.get("/users/1").body["user"]["username"] == username
end
