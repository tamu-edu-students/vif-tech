require 'uri'
require 'net/http'

Given /^I allow a new domain ([^\']*) for usertype ([^\']*)$/ do |domain, usertype|
  ret = page.driver.post('/allowlist_domains', {"domain":{"email_domain":domain,"usertype":usertype}})
end

Then('I should see {int} new domain in the database') do |int|
  ret = page.driver.get('/allowlist_domains')
  ret_body = JSON.parse ret.body
  expect(ret_body['domains'].size).to eq(int+3)
end