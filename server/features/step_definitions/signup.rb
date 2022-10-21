require "uri"
require "net/http"

Given("that I sign up with the following") do |table|
  ret = page.driver.post("/users", { 'user': table.rows_hash })
end

Given("that an user signs up as a valid student") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@tamu.edu"
  ret = page.driver.post('/users', {'user': {'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email':email, 'usertype':'student'}})
end

Given /^that the user verified their email ([^\']*)$/ do |email|
  @user = User.find_by_email(email)
  ret = page.driver.get("/users/" + @user.confirm_token + "/confirm_email")
end

Given /^that the first user clicked the link in their email$/ do
  path_regex = /https?\:\/\/.*?\/users\/\S*\/confirm_email/

  email = UserMailer.deliveries[0]
  path = email.body.raw_source.match(path_regex)[0]
  visit(path)
end

Then /^the user with email ([^\']*) should be marked as verified$/ do |email|
  @user = User.find_by_email(email)
  expect(@user.email_confirmed).to be true
end

Then /^the user with email ([^\']*) should be marked as not verified$/ do |email|
  @user = User.find_by_email(email)
  expect(@user.email_confirmed).to be false
end

Then("there should be {int} sent emails") do |int|
  expect(UserMailer.deliveries.length()).to be(int)
end

Then /^the user with ([^\'^\ ]*) ([^\'^\ ]*) should be found in the user DB$/ do |key, value|
  ret = page.driver.get("/users/find/?" + key + "=" + value)
  ret_body = JSON.parse ret.body
  expect(ret_body["user"][key]).to eq(value)
end

Then /^the user with ([^\'^\ ]*) ([^\'^\ ]*) should NOT be found in the user DB$/ do |key, value|
  ret = page.driver.get("/users/find/?" + key + "=" + value)
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
end

Then /^the user with ([^\'^\ ]*) ([^\'^\ ]*) and ([^\'^\ ]*) ([^\'^\ ]*) should be found in the user DB$/ do |key1, value1, key2, value2|
  ret = page.driver.get("/users/find/?" + key1 + "=" + value1 + "&" + key2 + "=" + value2)
  ret_body = JSON.parse ret.body
  expect(ret_body["user"][key1]).to eq(value1)
  expect(ret_body["user"][key2]).to eq(value2)
end

Then /^the user with ([^\'^\ ]*) ([^\'^\ ]*) and ([^\'^\ ]*) ([^\'^\ ]*) should NOT be found in the user DB$/ do |key1, value1, key2, value2|
  ret = page.driver.get('/users/find/?' + key1 + '=' + value1 + '&' + key2 + '=' + value2)
  ret_body = JSON.parse ret.body 
  expect(ret_body['status']).to eq(500)
end

Then('there should be {int} users found in the user DB') do |int|
  ret = page.driver.get('/users')
  ret_body = JSON.parse ret.body
  expect(ret_body['users'].size).to eq(int)
end

Then('I should be able to query {int} users by id in the user DB') do |int|
  for id in 1..int do 
    ret = page.driver.get("/users/#{id.to_i}")
    ret_body = JSON.parse ret.body
    expect(ret_body["user"]["id"]).to eq(id)
  end
end

Then("the user with id {int} should NOT be in the user DB") do |int|
  ret = page.driver.get("/users/#{int.to_i}")
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
end

Then('the user should get a 500 error when trying to verify with an incorrect token') do
  ret = page.driver.get('/users/random_token/confirm_email')
  ret_body = JSON.parse ret.body 
  expect(ret_body['status']).to eq(500)
end

Given('that I log in as admin') do
  ret = page.driver.post('/login', {"user":{"email":"admin@admin.com","password":"pw"}})
end

Then('I should be logged in') do
  ret = page.driver.get('/logged_in')
  ret_body = JSON.parse ret.body 
  expect(ret_body['logged_in']).to be true
end

