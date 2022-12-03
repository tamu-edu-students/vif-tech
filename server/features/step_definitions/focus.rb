Then("creating a focus with the following should return code {int}") do |code, table|
  ret = page.driver.post("focuses", { 'focus': table.rows_hash })
  ret_body = JSON.parse ret.body
  for k, v in table.rows_hash
    expect(ret_body["focus"][k]).to eq(v)
  end
  expect(ret.status).to eq(code)
end

Then("I add focus with id {int} and receive code {int}") do |focus_id, code|
  ret = page.driver.post("users/focuses/#{focus_id}")
  expect(ret.status).to eq(code)
end

Then("the following users should be associated with focus {int}") do |focus_id, table|
  ret = page.driver.get("focuses/#{focus_id}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["focus"]["users"].each { |h| actual << h["id"].to_s }
  expect(actual).to match_array(table.raw[0].each { |id| id.to_i })
end

Then("I delete focus {int} of user {int} and receive code {int}") do |focus_id, user_id, code|
  ret = page.driver.delete("users/#{user_id}/focuses/#{focus_id}")
  expect(ret.status).to eq(code)
end

Then("there should be {int} UserFocus associations in DB") do |count|
  ret = page.driver.get("user_focuses/")
  ret_body = JSON.parse ret.body
  expect(ret_body["user_focuses"].length).to eq(count)
end

Then("I update focuses of user {int} as following and recieve code {int}") do |user_id, code, table|
  ret = page.driver.put("/users/#{user_id}/focuses", { 'user': { 'focuses': table.hashes } })
  expect(ret.status).to eq(code)
end

Then("I add focus with id {int} to company {int} and receive code {int}") do |focus_id, company_id, code|
  ret = page.driver.post("companies/#{company_id}/focuses/#{focus_id}")
  expect(ret.status).to eq(code)
end

Then("the following companies should be associated with focus {int}") do |focus_id, table|
  ret = page.driver.get("focuses/#{focus_id}")
  ret_body = JSON.parse ret.body
  actual = []
  ret_body["focus"]["companies"].each { |h| actual << h["id"].to_s }
  expect(actual).to match_array(table.raw[0].each { |id| id.to_i })
end

Then("there should be {int} CompanyFocus associations in DB") do |count|
  ret = page.driver.get("company_focuses/")
  ret_body = JSON.parse ret.body
  expect(ret_body["company_focuses"].length).to eq(count)
end

Then("I delete focus {int} of company {int} and receive code {int}") do |focus_id, company_id, code|
  ret = page.driver.delete("companies/#{company_id}/focuses/#{focus_id}")
  expect(ret.status).to eq(code)
end

Then("I update focuses of company {int} as following and recieve code {int}") do |company_id, code, table|
  ret = page.driver.put("/companies/#{company_id}/focuses", { 'company': { 'focuses': table.hashes } })
  expect(ret.status).to eq(code)
end
