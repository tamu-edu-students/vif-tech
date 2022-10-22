require "uri"
require "net/http"

Given("name as a string and description as a text") do
  name = 'disney'
  description = "this is a company"
  ret = page.driver.post("/companies", {'company': {'name': name, 'description': description}})
end

Then("{int} company should be in company DB") do |int|
  ret = page.driver.get("/companies")
  ret_body = JSON.parse ret.body
  expect(ret_body["companies"].size).to eq(int)
end

Given("name as a string") do
  name = 'disney1'
  description = nil
  ret = page.driver.post("/companies", {'company': {'name': name, 'description': description}})
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
  ret = page.driver.post("/companies", {'company': {'name': name, 'description': description}})
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
  expect(ret_body["errors"]).to eq(["Something went wrong when saving this company"])
end