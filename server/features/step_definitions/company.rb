require "uri"
require "net/http"

Given("name as a string and description as a text") do
  name = "disney"
  description = "this is a company"
  ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

Then("{int} companies should be in company DB") do |int|
  ret = page.driver.get("/companies")
  ret_body = JSON.parse ret.body
  expect(ret_body["companies"].size).to eq(int)
end

Given("name as a string") do
  name = "disney1"
  description = nil
  ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

Then("{int} new companies with the specified name will be created in the database") do |int|
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

Given("a company with name {string} already exists in the database") do |company_name|
  name = company_name
  description = nil
  page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

When('I try to create a company with name {string} and description {string}') do |name, description|
  @ret = page.driver.post("/companies", { 'company': { 'name': name, 'description': description } })
end

Then('an error page of status of {int} is shown') do |code|
  expect(@ret.status).to eq(code)
end
