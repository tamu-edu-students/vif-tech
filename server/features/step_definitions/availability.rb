require "uri"
require "net/http"

Then("I want to get all availabilities") do
  ret = page.driver.get("/availabilities")
  expect(ret.status).to eq(200)
end

Then("I shouldn't be able to list availabilities") do
  ret = page.driver.get("/availabilities")
  expect(ret.status).to_not eq(200)
end

Given("I want to create an availability with the following and get return status {int}") do |code, table|
  ret = page.driver.post("/availabilities", { "availability": table.rows_hash })
  expect(ret.status).to eq(code)
end

Then("the user with {string} {string} and {string} {string} should have availability with id {int}") do |key1, value1, key2, value2, avail_id|
  ret = page.driver.get("/users/find/?" + key1 + "=" + value1 + "&" + key2 + "=" + value2)
  ret_body = JSON.parse ret.body
  user_id = ret_body["user"]["id"]
  ret = page.driver.get("/availabilities/#{avail_id}")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
  expect(ret_body["availability"]["user_id"]).to eq(user_id)
end

Given("that I delete availability with id {int}") do |avail_id|
  ret = page.driver.delete("/availabilities/#{avail_id}")
  expect(ret.status).to eq(200)
end

Then("there should be {int} availabilities entries visible to me") do |int|
  ret = page.driver.get("/availabilities")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
  expect(ret_body["availabilities"].length).to eq(int)
end

Then("I should NOT be able to delete availability with id {int} with status code {int}") do |avail_id, code|
  ret = page.driver.delete("/availabilities/#{avail_id}")
  expect(ret.status).to eq(code)
end

Given("I want to update the availability with id {int} with the following and get return status {int}") do |avail_id, code, table|
  ret = page.driver.put("/availabilities/#{avail_id}", { "availability": table.rows_hash })
  expect(ret.status).to eq(code)
end
