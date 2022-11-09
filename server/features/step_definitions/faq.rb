require "uri"
require "net/http"

Given('I create a question {string} and answer {string} and id {int}') do |string, string2, int|
  ret = page.driver.post('/faq', {"faq":{"question":string, "answer":string2, "id":int}})
  expect(ret.status).to eq(200)
end

Then('the faq question {string} with answer {string} and id {int} should be found in my DB') do |string, string2, int|
  ret = page.driver.get('/faq/' + int.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["faq"]["question"]).to eq(string)
  expect(ret_body["faq"]["answer"]).to eq(string2)
end

Then('the faq question {string} with answer {string} and id {int} should NOT be found in my DB') do |string, string2, int|
  ret = page.driver.get('/faq/' + int.to_s)
  # ret_body = JSON.parse ret.body
  expect(ret.status).to eq(404)
end


Then('I should have {int} questions in my DB') do |int|
  ret = page.driver.get('/faq')
  ret_body = JSON.parse ret.body
  expect(ret_body["faqs"].size).to eq(int) 
end


When('I delete FAQ with question {string} and answer {string} and id {int}') do |string, string2, int|
  ret = page.driver.delete('/faq/' + int.to_s)
  # ret_body = JSON.parse ret.body
  expect(ret.status).to eq(200)
end

When('I edit the same FAQ id {int} with {string} and {string}') do |int, string, string2|
  ret = page.driver.put('/faq/' + int.to_s, {"faq":{"question":string, "answer":string2}})
end

Then('I should see the FAQ question {string} and answer {string} with id {int} in my DB') do |string, string2, int|
  ret = page.driver.get('/faq/' + int.to_s)
  ret_body = JSON.parse ret.body
  expect(ret_body["faq"]["question"]).to eq(string)
  expect(ret_body["faq"]["answer"]).to eq(string2)
end

Then('I should NOT see the answer {string} for FAQ with id {int} in my DB again') do |string, int|
  @faq = Faq.find_by_id(int)
  expect(@faq.answer).not_to eq(string)
end 


