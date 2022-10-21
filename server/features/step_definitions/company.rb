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

Given("admin") do
end

Then("a list of all companies in the database is displayed") do
end

Given("admin and a specific company id") do
end

Then("all details or fields of this specific company is displayed") do
end

Given("id and params") do
end

Then("the company will be updated and displayed") do
end

Given("id") do
end

Then("the specified company deleted will be displayed") do
end
