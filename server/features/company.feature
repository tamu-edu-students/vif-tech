Feature: admin can CRUD a company object/account
    In order to manage who can make an account
    As an admin
    I want to controll access with an allowlist

Background: 
      Given that I log in as admin

# create
Scenario: admin can create a new company by providing its name, description
      Given name as a string and description as a text
      Then 1 companies should be in company DB
Scenario: admin can create a new company by just providing its name
      Given name as a string
      Then 1 new companies with the specified name will be created in the database
Scenario: admin cannot create a new company without providing its name
      Given name not provided
      Then an error page is shown
Scenario: admin cannot create a company if the company name is in the database already
      And a company with name 'disney2' already exists in the database
      When I try to create a company with name 'disney2' and description 'US company'
      Then an error page of status of 500 is shown
      And 1 companies should be in company DB
