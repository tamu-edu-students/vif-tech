Then("creating an event with the following should return code {int}") do |code, table|
  ret = page.driver.post("/events", { 'event': table.rows_hash })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Then("there should be {int} events in the DB") do |count|
  ret = page.driver.get("/events")
  ret_body = JSON.parse ret.body
  expect(ret_body["events"].size).to eq(count)
end

Then("event {int} should have title {string}") do |id, title|
  ret = page.driver.get("/events/#{id}")
  ret_body = JSON.parse ret.body
  expect(ret_body["event"]["title"]).to eq(title)
end

Then("I request update event {int} with the following and recieve code {int}") do |id, code, table|
  ret = page.driver.put("/events/#{id}", { 'event': table.rows_hash })
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end

Then("I request delete event {int} and recieve code {int}") do |id, code|
  ret = page.driver.delete("/events/#{id}")
  ret_body = JSON.parse ret.body
  expect(ret.status).to eq(code)
end
