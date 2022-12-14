Given("that I sign up and log in as a valid volunteer") do
  firstname = SecureRandom.alphanumeric(8)
  lastname = SecureRandom.alphanumeric(8)
  password = SecureRandom.alphanumeric(16)
  email = SecureRandom.alphanumeric(8) + "@tamu.edu"
  page.driver.post("/users", { 'user': { 'firstname': firstname, 'lastname': lastname, 'password': password, 'password_confirmation': password, 'email': email, 'usertype': "volunteer" } })
  user = User.find_by_email(email)
  user.email_confirmed = true
  user.save
  ret = page.driver.post("/login", { 'user': { 'password': password, 'email': email } })
  ret_body = JSON.parse ret.body
  expect(ret_body["logged_in"]).to eq(true)
end

Then("event {int} should have following associated meetings") do |id, table|
  ret = page.driver.get("/events/#{id}/meetings")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["meetings"].each { |h| actual << h["id"].to_s }
  expect(actual).to eq(table.raw[0].each { |id| id.to_i })
end

Then("event {int} should have following associated availabilities") do |id, table|
  ret = page.driver.get("/events/#{id}/availabilities")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["availabilities"].each { |h| actual << h["id"].to_s }
  expect(actual).to eq(table.raw[0].each { |id| id.to_i })
end

Then("I sign up to event {int} and receive code {int}") do |id, code|
  ret = page.driver.post("/events/#{id}/signup")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Then("the following users should be signed up to event {int}") do |id, table|
  ret = page.driver.get("/events/#{id}/users")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["users"].each { |h| actual << h["id"].to_s }
  expect(actual).to eq(table.raw[0].each { |id| id.to_i })
end

Then("the following {string} users should be signed up to event {int}") do |usertype, id, table|
  ret = page.driver.get("/events/#{id}/users/?usertype=#{usertype}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["users"].each { |h| actual << h["id"].to_s }
  expect(actual).to eq(table.raw[0].each { |id| id.to_i })
end

Then("I sign out of event {int} and receive code {int}") do |id, code|
  ret = page.driver.delete("/events/#{id}/signout")
  expect(ret.status).to eq(code)
end

Given("I sign up user {int} to event {int} and receive code {int}") do |user_id, id, code|
  ret = page.driver.post("/events/#{id}/signup/#{user_id}")
  expect(ret.status).to eq(code)
end

Given("I sign out user {int} from event {int} and receive code {int}") do |user_id, id, code|
  ret = page.driver.delete("/events/#{id}/signout/#{user_id}")
  expect(ret.status).to eq(code)
end

Then("the following users should be fetched with event {int}") do |id, table|
  ret = page.driver.get("/events/#{id}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["event"]["users"].each { |h| actual << h["id"].to_s }
  expect(actual).to eq(table.raw[0].each { |id| id.to_i })
end

Then("there should be {int} event_signups") do |count|
  ret = page.driver.get("/event_signups")
  ret_body = JSON.parse ret.body
  expect(ret_body["event_signups"].length).to eq(count)
end

Then("event_signup with id {int} should involve event {int} and user {int}") do |id, event_id, user_id|
  ret = page.driver.get("/event_signups/#{id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["event_signup"]["event"]["id"]).to eq(event_id)
  expect(ret_body["event_signup"]["user"]["id"]).to eq(user_id)
end

Then("I sign out user {int} of event {int} and receive code {int}") do |user_id, event_id, code|
  ret = page.driver.delete("/events/#{event_id}/signout/#{user_id}")
  expect(ret.status).to eq(code)
end

Given("I created an event that we can register now with the following and return code {int}") do |code|
  time_now = Time.now
  ret = page.driver.post("/events", {
    'event': {
      'title': SecureRandom.alphanumeric(8), 'start_time': time_now + 7.days, 'end_time': time_now + 14.days, 'registration_start_time': time_now - 7.days, 'registration_end_time': time_now + 7.days,
    },
  })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Given("I created an event that whose registration closed with the following and return code {int}") do |code|
  time_now = Time.now
  ret = page.driver.post("/events", {
    'event': {
      'title': SecureRandom.alphanumeric(8), 'start_time': time_now + 7.days, 'end_time': time_now + 14.days, 'registration_start_time': time_now - 7.days, 'registration_end_time': time_now - 2.days,
    },
  })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Given("I created an event that whose registration has not started with the following and return code {int}") do |code|
  time_now = Time.now
  ret = page.driver.post("/events", {
    'event': {
      'title': SecureRandom.alphanumeric(8), 'start_time': time_now + 7.days, 'end_time': time_now + 14.days, 'registration_start_time': time_now + 2.days, 'registration_end_time': time_now + 4.days,
    },
  })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Given("I created an event that whose registration time is inverted with the following and return code {int}") do |code|
  time_now = Time.now
  ret = page.driver.post("/events", {
    'event': {
      'title': SecureRandom.alphanumeric(8), 'start_time': time_now + 7.days, 'end_time': time_now + 14.days, 'registration_start_time': time_now + 7.days, 'registration_end_time': time_now - 7.days,
    },
  })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Then("event with title {string} should have following associated companies") do |title, table|
  ret = page.driver.get("/events/attending_companies/?event_title=#{title}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["attending_companies"].each { |h| actual << h.to_s }
  expect(actual).to match_array(table.raw[0].each { |id| id.to_i })
end

Then("event {int} should have following associated companies") do |id, table|
  ret = page.driver.get("/events/#{id}/attending_companies")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["attending_companies"].each { |h| actual << h.to_s }
  expect(actual).to match_array(table.raw[0].each { |id| id.to_i })
end

Then("event with title {string} should have following associated company_meetings") do |title, table|
  ret = page.driver.get("/events/company_meetings/?event_title=#{title}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["company_meetings"].each { |h| actual << { "meeting_id": h["meeting"]["id"].to_s, "company_id": h["company_id"].to_s }.stringify_keys }
  expect(actual).to match_array(table.hashes)
end

Then("event {int} should have following associated company_meetings") do |id, table|
  ret = page.driver.get("/events/#{id}/company_meetings")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["company_meetings"].each { |h| actual << { "meeting_id": h["meeting"]["id"].to_s, "company_id": h["company_id"].to_s }.stringify_keys }
  expect(actual).to match_array(table.hashes)
end
