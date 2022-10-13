require 'uri'
require 'net/http'

Given('that I sign up with the following') do |table|
  # table is a Cucumber::MultilineArgument::DataTable
  ret = page.driver.post('/users', {'user': table.rows_hash})
end

Given('that an user signs up as a valid student') do
  username = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  ret = page.driver.post('/users', {'user': {'username': username, 'password': password, 'password_confirmation': password}})
end

Then /^the user with username ([^\']*) should be found in the user DB$/ do |username|
  ret = page.driver.get('/users/find/?username=' + username)
  ret_body = ActiveSupport::JSON.decode(ret.body) 
  expect(ret_body['user']['username']).to eq(username)
end

Then /^the user with username ([^\']*) should NOT be found in the user DB$/ do |username|
  ret = page.driver.get('/users/find/?username=' + username)
  ret_body = ActiveSupport::JSON.decode(ret.body)
  expect(ret_body['status']).to eq(500)
end

Then('there should be {int} students found in the user DB') do |int|
  ret = page.driver.get('/users')
  ret_body = ActiveSupport::JSON.decode(ret.body)
  expect(ret_body['users'].size).to eq(int)
end

Then('I should be able to query {int} students by id in the user DB') do |int|
  for id in 1..int do 
    ret = page.driver.get("/users/#{id.to_i}")
    ret_body = ActiveSupport::JSON.decode(ret.body)
    expect(ret_body['user']['id']).to eq(id)
  end
end

Then('the user with id {int} should NOT be in the user DB') do |int|
  ret = page.driver.get("/users/#{int.to_i}")
  ret_body = ActiveSupport::JSON.decode(ret.body)
  expect(ret_body['status']).to eq(500)
end

Then('the user should get a 500 error when trying to verify with an incorrect token') do
  ret = page.driver.get('/users/random_token/confirm_email')
  ret_body = ActiveSupport::JSON.decode(ret.body) 
  expect(ret_body['status']).to eq(500)
end