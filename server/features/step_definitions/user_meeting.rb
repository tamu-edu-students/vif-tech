require "uri"
require "net/http"

Given("that I assign user {int} to meeting {int} with acceptance {int}") do |user_id, meeting_id, accepted|
  ret = page.driver.post("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "accepted": accepted } })
  expect(ret.status).to eq(200)
end

Given("that I assign user {int} to meeting {int} with acceptance {int} and fail with code {int}") do |user_id, meeting_id, accepted, code|
  ret = page.driver.post("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "accepted": accepted } })
  expect(ret.status).to eq(code)
end

Given("that user {int} accepts meeting {int} invite") do |user_id, meeting_id|
  ret = page.driver.put("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "accepted": true } })
  expect(ret.status).to eq(200)
end

Given("that user {int} sets status as pending to meeting {int} invite") do |user_id, meeting_id|
  ret = page.driver.put("users/#{user_id}/meetings/#{meeting_id}", { "user_meeting": { "accepted": false } })
  expect(ret.status).to eq(200)
end

Given("that user {int} declines meeting {int} invite") do |user_id, meeting_id|
  ret = page.driver.delete("users/#{user_id}/meetings/#{meeting_id}")
  expect(ret.status).to eq(200)
end

Then("I should NOT be able to fetch user-meetings") do
  ret = page.driver.get("/user_meetings")
  ret_body = JSON.parse ret.body
  expect(ret_body["status"]).to eq(500)
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

Then("user {int} should have accepted invite to meeting {int}") do |user_id, meeting_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_meeting"]["accepted"]).to eq(true)
end

Then("user {int} should be pending on invite to meeting {int}") do |user_id, meeting_id|
  ret = page.driver.get("users/#{user_id}/meetings/#{meeting_id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_meeting"]["accepted"]).to eq(false)
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

Then("I should be able to fetch {int} attending meetings for user {int}") do |num_meetings, user_id|
  ret = page.driver.get("users/#{user_id}/meetings/attending")
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
