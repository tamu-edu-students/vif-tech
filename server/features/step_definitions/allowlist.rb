require 'uri'
require 'net/http'

Given ('there is a company with id {int}') do |int|
    ret = Company.new(id:int,name:"test",description:"blah")
    ret.save!
end

Given("that I sign up with the following to company id {int}") do |int, table|
    c = Company.find_by_id(int)
    u = User.new(table.rows_hash)
    u.save!
    c.users << u
end

Then('the company with id {int} should have {int} reps') do |id, int|
    c = Company.find_by_id(id)
    expect(c.users.size).to eq(int)
  end

Given /^I allow a new domain ([^\']*) for usertype ([^\']*)$/ do |domain, usertype|
  ret = page.driver.post('/allowlist_domains', {"domain":{"email_domain":domain,"usertype":usertype}})
  ret_body = JSON.parse ret.body
  expect(ret_body['status']).to eq(201)
end

Given /^I allow a new company domain ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |domain, usertype, int|
    ret = page.driver.post('/allowlist_domains', {"domain":{"email_domain":domain,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(201)
end

Given /^I delete the allowed domain with index 4$/ do 
    ret = page.driver.delete('/allowlist_domains/4')
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(200)
end

Then('I should see {int} domain in the database') do |int|
  ret = page.driver.get('/allowlist_domains')
  ret_body = JSON.parse ret.body
  expect(ret_body['domains'].size).to eq(int)
end

Then('I should see a domain with index {int} in the database') do |int|
    ret = page.driver.get('/allowlist_domains/' + int.to_s)
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(200)
  end

Given /^I allow a new email ([^\']*) for usertype ([^\']*)$/ do |email, usertype|
    ret = page.driver.post('/allowlist_emails', {"email":{"email":email,"usertype":usertype}})
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(201)
end

Given /^I allow a new company email ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |email, usertype, int|
    ret = page.driver.post('/allowlist_emails', {"email":{"email":email,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(201)
end

Given /^I delete the allowed email with index 1$/ do 
    ret = page.driver.delete('/allowlist_emails/1')
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(200)
end

Then('I should see {int} new email in the database') do |int|
ret = page.driver.get('/allowlist_emails')
ret_body = JSON.parse ret.body
expect(ret_body['emails'].size).to eq(int)
end

Then('I should see an email with index {int} in the database') do |int|
    ret = page.driver.get('/allowlist_emails/' + int.to_s)
    ret_body = JSON.parse ret.body
    expect(ret_body['status']).to eq(200)
end
