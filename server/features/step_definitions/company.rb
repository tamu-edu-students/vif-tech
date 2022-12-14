require "uri"
require "net/http"

Given("that I create a valid company") do
  name = SecureRandom.alphanumeric(8)
  description = SecureRandom.alphanumeric(16)
  ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

Then("{int} company should be in company DB") do |int|
  ret = page.driver.get("/companies")
  ret_body = JSON.parse ret.body
  expect(ret_body["companies"].size).to eq(int)
end

Given("name as a string") do
  name = "disney1"
  description = nil
  ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

Then("{int} new company with the specified name will be created in the database") do |int|
  ret = page.driver.get("/companies")
  ret_body = JSON.parse ret.body
  expect(ret_body["companies"].size).to eq(int)
end

Given("name not provided") do
end

Then("an error page is shown") do
  name = nil
  description = "this is 2nd company."
  ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(500)
  expect(ret_body["errors"]).to eq(["Something went wrong when saving this company"])
end

Then("I should see {int} reps for company with id {int}") do |int, cid|
  ret = page.driver.get("/companies/" + cid.to_s + "/users")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
  expect(ret_body["users"].length).to eq(int)
end

Given("I delete company with id {int}") do |cid|
  ret = page.driver.delete("/companies/" + cid.to_s)
  expect(ret.status).to eq(200)
end

Given /^I update the company with id ([^\'^\ ]*) to have ([^\'^\ ]*) with value ([^\'^\ ]*)$/ do |id, key_, value|
  ret = page.driver.put("/companies/" + id.to_s, { "company": { key_ => value } })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
end

Then /^the company with id ([^\'^\ ]*) should have ([^\'^\ ]*) with value ([^\'^\ ]*)$/ do |id, key, value|
  ret = page.driver.get("/companies/" + id.to_s)
  ret_body = JSON.parse ret.body

  expect(ret.status).to eq(200)
  expect(ret_body["company"][key]).to eq(value)
end