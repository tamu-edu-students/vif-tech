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
    params = {about: {firstname: string, lastname: string2, role: string3, social_links_attributes: [{"#{string4}": string5}]}}
    ret = page.driver.post("/abouts", params)
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret.status).to eq(201)    
end

  
Given('I create the following content firstname {string} and lastname {string} and role {string} and social_links \{{string}:{string}, {string}: {string}} on the About Page') do |firstname, lastname, role, string4, string5, string6, string7|
    params = {about: {firstname: firstname, lastname: lastname, role: role, social_links_attributes: [{"#{string4}": string5, "#{string6}": string7}]}}
    ret = page.driver.post("/abouts", params)
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret.status).to eq(201)    
end

When('I change role from {string} to {string} and update social_links to \{{string}:{string}, {string}: {string}, {string}: {string}} in the content with firstname {string} and lastname {string}') do |intialrole, finalrole, string2, string3, string4, string5, string6, string7, firstname, lastname|
    @about = About.where("firstname": firstname, "lastname": lastname)
    if @about.exists? and @about.to_json.include? "#{intialrole}"
        @id = @about.pick(:id)
        update = {about: {role: finalrole, social_links_attributes: [{"#{string2}": string3, "#{string4}": string5, "#{string6}": string7}]}}
        ret = page.driver.put("/abouts/" + @id.to_s, update)
        ret_body = JSON.parse ret.body
        expect(ret.status).to eq(200)
        puts ret_body
    end   
end

Then('the content with firstname {string} and lastname {string} should NOT have social_links \{{string}: {string}} and role {string}') do |firstname, lastname, string3, string4, role|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)  
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret_body["about"]["role"]).not_to eq(role)
    expect((ret_body["about"]["social_links"][0].to_h)[string3]).not_to be == string4
end


Then('the content with firstname {string} and lastname {string} and social_links \{{string}: {string}} should NOT be found in the About DB') do |firstname, lastname, string3, string4|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)  
    ret_body = JSON.parse ret.body
    puts ret_body
    expect(ret.status).to eq(404)
end

Then('the content with firstname {string} and lastname {string} and role {string} and social_links \{{string}:{string}, {string}: {string}, {string}: {string}} should be found in my DB') do |firstname, lastname, role, string4, string5, string6, string7, string8, string9|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)  
    ret_body = JSON.parse ret.body
    expect((ret_body["about"]["social_links"][0].to_h)[string4]).to be == string5
    expect((ret_body["about"]["social_links"][0].to_h)[string6]).to be == string7
    expect((ret_body["about"]["social_links"][0].to_h)[string8]).to be == string9
end

When('I delete the content firstname {string} and lastname {string} and role {string} on the About Page') do |firstname, lastname, role|
    ret = page.driver.get("/abouts/find/?" + "firstname" + "=" + firstname + "&" + "lastname" + "=" + lastname)
    ret_body = JSON.parse ret.body
    expect(ret_body["about"]["role"]).to eq(role)
    about_id = ret_body["about"]["id"]
    getrid = page.driver.delete("/abouts/" + about_id.to_s)
    expect(getrid.status).to eq(200)
end

Then('I should have {int} content in my SocialLink DB') do |int|
    expect(About.count).to eq(int)
end





