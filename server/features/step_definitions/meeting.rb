require "uri"
require "net/http"

Given("that I sign up and log in as a valid student") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@tamu.edu"
  page.driver.post("/users", { 'user': { 'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email': email } })
  user = User.find_by_email(email)
  user.email_confirmed = true
  user.save
  ret = page.driver.post("/login", { 'user': { 'password': password, 'email': email } })
  ret_body = JSON.parse ret.body
  expect(ret_body["logged_in"]).to eq(true)
end

Given("a student signs up and confirms their email") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@tamu.edu"
  page.driver.post("/users", { 'user': { 'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email': email } })
  user = User.find_by_email(email)
  user.email_confirmed = true
  user.save
end

Given("that I create a valid meeting") do
  title = SecureRandom.alphanumeric(8)
  start_time = Time.current
  end_time = 2.hours.from_now
  ret = page.driver.post("/meetings", { 'meeting': { 'title': title, 'start_time': start_time, 'end_time': end_time } })
end

Given("that I create a meeting with title {string} and start time from {string} to {string}") do |title, start_time_str, end_time_str|
  ret = page.driver.post("/meetings", { 'meeting': { 'title': title, 'start_time': start_time_str, 'end_time': end_time_str } })
end

Given("that I log out") do
  ret = page.driver.post("/logout")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
end

Then("{int} meetings should be in meeting DB") do |int|
  ret = page.driver.get("/meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].size).to eq(int)
end

Then("I should NOT be able to fetch meetings due to {int} error") do |code|
  ret = page.driver.get("/meetings")
  expect(ret.status).to eq(code)
end

Then("creating meetings should result in not authenticated error") do
  ret = page.driver.post("/meetings", { 'meeting': { 'title': SecureRandom.alphanumeric(8), 'start_time': Time.now.getutc, 'end_time': Time.now.getutc + 15 * 60 } })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(401)
  expect(ret_body["errors"]).to eq(["User not logged in"])
end

Given("that I create a meeting with the following") do |table|
  ret = page.driver.post("/meetings", { 'meeting': table.rows_hash })
end

Then("the meeting with id {int} will have {string}: {string}") do |id, key, value|
  ret = page.driver.get("/meetings/" + id.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["meeting"][key]).to eq(value)
end

Then("the meeting with id {int} will have {string}: {int}") do |id, key, value|
  ret = page.driver.get("/meetings/" + id.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["meeting"][key]).to eq(value)
end

Given("that I update a meeting with id {int} with the following") do |id, table|
  ret = page.driver.put("/meetings/" + id.to_s, { 'meeting': table.rows_hash })
end

Given("delete the meeting with id {int}") do |id|
  ret = page.driver.delete("/meetings/" + id.to_s)
end

Then("the meeting with id {int} will not be found due to {int} error") do |id, code|
  ret = page.driver.get("/meetings/" + id.to_s)
  expect(ret.status).to eq(code)
end

Then("deleting the meeting with id {int} should fail due to {int} error") do |id, code|
  ret = page.driver.delete("/meetings/" + id.to_s)
  expect(ret.status).to eq(code)
end

Then("deleting the meeting with id {int} should succeed") do |id|
  ret = page.driver.delete("/meetings/" + id.to_s)
  expect(ret.status).to eq(200)
end

Then("I get code {int} when mass updating meeting {int}'s invitees with") do |status, id, table|
  ret = page.driver.put("/meetings/#{id}/invitees", { 'meeting': { 'invitees': table.hashes } })
  expect(ret.status).to eq(status)
end

Then("meeting {int} should have as invitees the following users") do |id, invitees|
  ret = page.driver.get("/meetings/#{id}/invitees")
  ret_body = JSON.parse ret.body
  invitees_actual = []
  ret_body["invitees"].each { |h| invitees_actual << h["id"].to_s }
  expect(invitees_actual).to eq(invitees.raw[0].each { |id| id.to_i })
end

Then("meeting {int} should have as {string} invitees the following users") do |id, status, invitees|
  ret = page.driver.get("/meetings/#{id}/invitees?status=#{status}")
  ret_body = JSON.parse ret.body
  invitees_actual = []
  ret_body["invitees"].each { |h| invitees_actual << h["id"].to_s }
  expect(invitees_actual).to eq(invitees.raw[0].each { |id| id.to_i })
end
