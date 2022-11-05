require "uri"
require "net/http"

Given("that I assign user {int} to meeting {int} with status {string}") do |user_id, meeting_id, status|
  ret = page.driver.post("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "status": status } })
  expect(ret.status).to eq(200)
end

Given("that I assign user {int} to meeting {int} with status {string} and fail with code {int}") do |user_id, meeting_id, status, code|
  ret = page.driver.post("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "status": status } })
  expect(ret.status).to eq(code)
end

Given("that user {int} sets status as {string} to meeting {int} invite") do |user_id, status, meeting_id|
  ret = page.driver.put("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "status": status } })
  puts ret.body
  expect(ret.status).to eq(200)
end

Given("that user {int} deletes meeting {int} invite") do |user_id, meeting_id|
  ret = page.driver.delete("users/#{user_id}/meetings/#{meeting_id}")
  expect(ret.status).to eq(200)
end

Then("I should NOT be able to fetch user-meetings") do
  ret = page.driver.get("/user_meetings")
  expect(ret.status).to eq(401)
end

Then("I should be able to fetch {int} user-meetings") do |num_meetings|
  ret = page.driver.get("/user_meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_meetings"].length).to eq(num_meetings)
end

Then("user {int} should be invited to meeting {int}") do |user_id, meeting_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["is_invited"]).to eq(true)
end

Then("user {int} should have {string} invite to meeting {int}") do |user_id, status, meeting_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_meeting"]["status"]).to eq(status)
end

Then("user {int} should NOT be invited to meeting {int}") do |user_id, meeting_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["is_invited"]).to eq(false)
end

Then("I should be able to fetch {int} pending meetings for user {int}") do |num_meetings, user_id|
  ret = page.driver.get("users/#{user_id}/meetings/pending")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].length).to eq(num_meetings)
end

Then("I should be able to fetch {int} {string} meetings for user {int}") do |num_meetings, status, user_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{status}")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].length).to eq(num_meetings)
end

Then("I should be able to fetch {int} invited meetings for user {int}") do |num_meetings, user_id|
  ret = page.driver.get("users/#{user_id}/meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].length).to eq(num_meetings)
end

Then("I should be able to fetch {int} owned meetings for user {int}") do |num_meetings, user_id|
  ret = page.driver.get("users/#{user_id}/meetings/owned")
  ret_body = JSON.parse ret.body
  expect(ret_body["meetings"].length).to eq(num_meetings)
end

Then("user-meeting {int} should show user {int} to meeting {int} association") do |user_meeting_id, user_id, meeting_id|
  ret = page.driver.get("user_meetings/#{user_meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_meeting"]["user_id"]).to eq(user_id)
  expect(ret_body["user_meeting"]["meeting_id"]).to eq(meeting_id)
end
