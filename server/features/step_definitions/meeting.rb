require "uri"
require "net/http"

Given("that I sign up and log in as a valid student") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@" + SecureRandom.alphanumeric(8) + "." + SecureRandom.alphanumeric(3)
  page.driver.post("/users", { 'user': { 'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email': email } })
  ret = page.driver.post("/login", { 'user': { 'password': password, 'email': email } })
  ret_body = JSON.parse ret.body
  expect(ret_body["logged_in"]).to eq(true)
end

Given("that I sign up and log in as a valid admin") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@" + SecureRandom.alphanumeric(8) + "." + SecureRandom.alphanumeric(3)
  page.driver.post("/users", { 'user': { 'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email': email, 'usertype': "admin" } })
  ret = page.driver.post("/login", { 'user': { 'password': password, 'email': email } })
  ret_body = JSON.parse ret.body
  expect(ret_body["logged_in"]).to eq(true)
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
  expect(ret_body["status"]).to eq(200)
end

Then("{int} meetings should be in meeting DB") do |int|
  ret = page.driver.get("/meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].size).to eq(int)
end

Then("I should NOT be able to fetch meetings") do
  ret = page.driver.get("/meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
end

Then("creating meetings should result in not authenticated error") do
  ret = page.driver.post("/meetings", { 'meeting': { 'title': SecureRandom.alphanumeric(8), 'start_time': Time.now.getutc, 'end_time': Time.now.getutc + 15 * 60 } })
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
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

Then("the meeting with id {int} will not be found") do |id|
  ret = page.driver.get("/meetings/" + id.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
end

Then("deleting the meeting with id {int} should fail") do |id|
  ret = page.driver.delete("/meetings/" + id.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
end

Then("deleting the meeting with id {int} should succeed") do |id|
  ret = page.driver.delete("/meetings/" + id.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(200)
end
