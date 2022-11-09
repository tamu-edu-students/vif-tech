require "uri"
require "net/http"

Given('I create the following content firstname {string} and lastname {string} on the About Page') do |string, string2|
    ret = page.driver.post("/abouts", {"about": {"firstname":string, "lastname":string2}})
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret.status).to eq(201)
end

# Given('I create the following content') do |table|
#     ret = page.driver.post("/abouts", { 'about': table.rows_hash })
#     expect(ret.status).to eq(201)
# end
  
Then('the content with firstname {string} and lastname {string} should be found in my DB') do |string, string2|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + string + "&" + "lastname" + "=" + string2)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["firstname"]).to eq(string)
    expect(ret_body["about"]["lastname"]).to eq(string2)

end
  
Then('I should have {int} content in my DB') do |int|
    ret = page.driver.get('/abouts')
    ret_body = JSON.parse ret.body
    # expect(ret_body["abouts"].size).to eq(int) 
    puts ret_body
end
  