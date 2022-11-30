require 'uri'
require 'net/http'

Given ('there is a company with id {int}') do |int|
    ret = Company.new(id:int,name:SecureRandom.alphanumeric(8),description:"blah")
    ret.save!
end

Then('the company with id {int} should have {int} reps') do |id, int|
    c = Company.find_by_id(id)
    expect(c.users.size).to eq(int)
  end

Given /^I allow a new domain ([^\']*) for usertype ([^\']*)$/ do |domain, usertype|
  ret = page.driver.post('/allowlist_domains', {"allowlist_domain":{"domain":domain,"usertype":usertype}})
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(201)
end

Given /^I fail to allow a new domain ([^\']*) for usertype ([^\']*)$/ do |domain, usertype|
    ret = page.driver.post('/allowlist_domains', {"allowlist_domain":{"domain":domain,"usertype":usertype}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
  end

Given /^I allow a new company domain ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |domain, usertype, int|
    ret = page.driver.post('/allowlist_domains', {"allowlist_domain":{"domain":domain,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(201)
end

Given /^I fail to allow a new company domain ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |domain, usertype, int|
    ret = page.driver.post('/allowlist_domains', {"allowlist_domain":{"domain":domain,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
end

Given /^I delete the allowed domain with index 4$/ do 
    ret = page.driver.delete('/allowlist_domains/4')
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
end

Then('I should see {int} domain in the database') do |int|
  ret = page.driver.get('/allowlist_domains')
  ret_body = JSON.parse ret.body
  expect(ret_body['allowlist_domains'].size).to eq(int)
end

Then("I should see {int} domain with usertype: student in the database") do |int|
    ret = page.driver.get("/allowlist_domains/?usertype=student")
    ret_body = JSON.parse ret.body
    expect(ret_body['allowlist_domains'].size).to eq(int)
end

Then("I should see {int} domain with company_id: 1 in the database") do |int|
    ret = page.driver.get("/allowlist_domains/?company_id=1")
    ret_body = JSON.parse ret.body
    expect(ret_body['allowlist_domains'].size).to eq(int)
end

Then('I should see a domain with index {int} in the database') do |int|
    ret = page.driver.get('/allowlist_domains/' + int.to_s)
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
  end

Given /^I allow a new email ([^\']*) for usertype ([^\']*)$/ do |email, usertype|
    ret = page.driver.post('/allowlist_emails', {"allowlist_email":{"email":email,"usertype":usertype}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(201)
end

Given /^I allow a new company email ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |email, usertype, int|
    ret = page.driver.post('/allowlist_emails', {"allowlist_email":{"email":email,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(201)
end

Given /^I fail to allow a new company email ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |email, usertype, int|
    ret = page.driver.post('/allowlist_emails', {"allowlist_email":{"email":email,"usertype":usertype, "company_id":int}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
end

Given /^I allow a new primary contact company email ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |email, usertype, int|
    ret = page.driver.post('/allowlist_emails', {"allowlist_email":{"email":email,"usertype":usertype, "company_id":int, "is_primary_contact":true}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(201)
end

Given /^I fail to allow a new primary contact company email ([^\']*) for usertype ([^\']*) for company id ([0-9]*)$/ do |email, usertype, int|
    ret = page.driver.post('/allowlist_emails', {"allowlist_email":{"email":email,"usertype":usertype, "company_id":int, "is_primary_contact":true}})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
end

Given /^I delete the allowed email with index 1$/ do 
    ret = page.driver.delete('/allowlist_emails/1')
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
end

Then('I should see {int} new email in the database') do |int|
ret = page.driver.get('/allowlist_emails')
ret_body = JSON.parse ret.body
expect(ret_body['allowlist_emails'].size).to eq(int)
end

Then('I should see {int} email with usertype: student in the database') do |int|
    ret = page.driver.get('/allowlist_emails/?usertype=student')
    ret_body = JSON.parse ret.body
    expect(ret_body['allowlist_emails'].size).to eq(int)
end

Then('I should see {int} email with company_id: 1 in the database') do |int|
    ret = page.driver.get('/allowlist_emails/?company_id=1')
    ret_body = JSON.parse ret.body
    expect(ret_body['allowlist_emails'].size).to eq(int)
end

Then('I should see an email with index {int} in the database') do |int|
    ret = page.driver.get('/allowlist_emails/' + int.to_s)
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
end

Then('I should get a {int} code from the email database') do |int|
    ret = page.driver.get('/allowlist_emails')
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(int)
end

Then('I should get a {int} code from the domain database') do |int|
    ret = page.driver.get('/allowlist_domains')
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(int)
end

Given('I transfer my primary contact role to user with id {int}') do |int|
    ret = page.driver.post('/allowlist_emails/transfer_primary_contact', {"to":int})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
end

Given('I transfer primary contact role to user with id {int}') do |int1|
    ret = page.driver.post('/allowlist_emails/transfer_primary_contact', {"to":int1})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(200)
end

Given('I fail to transfer my primary contact role to user with id {int}') do |int|
    ret = page.driver.post('/allowlist_emails/transfer_primary_contact', {"to":int})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
end

Given('I fail to transfer primary contact role to user with id {int}') do |int1|
    ret = page.driver.post('/allowlist_emails/transfer_primary_contact', {"to":int1})
    ret_body = JSON.parse ret.body
    expect(ret.status).to eq(403)
end

Then /^the primary contact for the company with id ([0-9]*) should have email ([^\']*)$/ do |cid, email|
    ret = page.driver.get("/companies")
    ret_body = JSON.parse ret.body
    ae = ret_body["companies"][0]["allowlist_emails"].select { |u| u["is_primary_contact"] == true }
    expect(ae.size == 1).to eq(true)
    expect(ae[0]["email"]).to eq(email)
end

Then("I should see allowlist emails and domains in company 1 when indexing") do
    ret = page.driver.get("/companies")
    ret_body = JSON.parse ret.body
    ae = ret_body["companies"][0]["allowlist_emails"]
    ad = ret_body["companies"][0]["allowlist_domains"]
    expect(ae.size > 0).to eq(true)
    expect(ad.size > 0).to eq(true)
end

Then("I should not see allowlist emails and domains in company 1 when indexing") do
    ret = page.driver.get("/companies")
    ret_body = JSON.parse ret.body
    ae = ret_body["companies"][0]["allowlist_emails"]
    ad = ret_body["companies"][0]["allowlist_domains"]
    expect(ae).to eq(nil)
    expect(ad).to eq(nil)
end