require "uri"
require "net/http"


# Given('I create the following content firstname {string} and lastname {string} and description {string} on the About Page') do |string, string2, string3|
#     ret = page.driver.post("/abouts", {"about": {"firstname":string, "lastname":string2, "description":string3}})
#     ret_body = JSON.parse ret.body
#     # puts ret_body
#     expect(ret.status).to eq(201)
# end

Given('I create the following content on the About Page') do |table|
    ret = page.driver.post("/abouts", { 'about': table.rows_hash })
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret.status).to eq(201)
end

Then('the content with firstname {string} and lastname {string} and description {string} should be found in the About DB') do |firstname, lastname, description|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)
    expect(ret.status).to eq(200)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["description"]).to eq(description)
end

Then /^the content with firstname ([^\'^\ ]*) and lastname ([^\'^\ ]*) and rank ([^\'^\ ]*) should be found in the About DB$/ do |firstname, lastname, rank|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname + "&" + "rank" + "=" + rank)  
    expect(ret.status).to eq(200)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["rank"]).to eq(rank)
end

Then /^the content with firstname ([^\'^\ ]*) and lastname ([^\'^\ ]*) and rank ([^\'^\ ]*) should NOT be found in the About DB$/ do |firstname, lastname, rank|
    # ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname + "&" + "rank" + "=" + rank)  
    @about = About.where("firstname": firstname, "lastname": lastname, "rank": rank).exists?
    expect(@about).to eq(false)
end

Then('I should have {int} About content in my DB') do |int|
    ret = page.driver.get('/abouts')
    ret_body = JSON.parse ret.body
    expect(ret_body["abouts"].size).to eq(int) 
end

When /^I delete the content firstname ([^\'^\ ]*) and lastname ([^\'^\ ]*) and rank ([^\'^\ ]*) on the About Page$/ do |firstname, lastname, rank|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["rank"]).to eq(rank)
    about_id = ret_body["about"]["id"]
    getrid = page.driver.delete("/abouts/" + about_id.to_s)
    expect(getrid.status).to eq(200)
end
  
Then('the content with firstname {string} and lastname {string} and description {string} should have a default rank {string} since I did not specify it') do |firstname, lastname, description, rank|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["description"]).to eq(description)
    expect(ret_body["about"]["rank"]).to eq(rank)
end

When('I change rank to {string} and imgSrc to {string} and lastname to {string} in the content with firstname {string} and lastname {string}') do |rank, imgSrc, lastname, firstname, lastname2|
    @about = About.where("firstname": firstname, "lastname": lastname2)
    if @about.exists?
        @id = @about.pick(:id)
        ret = page.driver.put("/abouts/" + @id.to_s, {"about":{"rank": rank, "imgSrc": imgSrc, "lastname":lastname}})
        ret_body = JSON.parse ret.body
        puts ret_body
    end
    expect(ret.status).to eq(200)
    
end

Then /^the content with firstname ([^\'^\ ]*) and lastname ([^\'^\ ]*) and rank ([^\'^\ ]*) and imgSrc ([^\'^\ ]*) should be found in the About DB$/ do |firstname, lastname, rank, imgSrc|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname + "rank" + "=" + rank)  
    expect(ret.status).to eq(200)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["rank"]).to eq(rank)
    expect(ret_body["about"]["imgSrc"]).to eq(imgSrc)
end

Given('I create the following content firstname {string} and lastname {string} and role {string} and social_links \{{string}:{string}} on the About Page') do |string, string2, string3, string4, string5|
    # ret = page.driver.post("/abouts", {"about": {"firstname":string, "lastname":string2, "role":string3, "social_links":{"facebook": "www.facebook.com"}}})
    params = {about: {firstname: "Jack", lastname: "Bauer", role: "director", social_links_attributes: [{facebook: "facebook.com"}]}}
    ret = page.driver.post("/abouts", params)
    ret_body = JSON.parse ret.body
    puts ret_body
    # puts ret_body["about"]["social_links"].class
    expect(ret.status).to eq(201)    
end
  

Given('I see abouts') do
    ret = page.driver.get("/abouts/")
    ret_body = JSON.parse ret.body
    puts ret_body
end