Feature: admin can CRUD a company object/account
    In order to manage who can make an account
    As an admin
    I want to controll access with an allowlist

    Scenario: admin can create a new company by providing its name, description
        Given name as a string and description as a text
        Then 1 company should be in company DB
        
    Scenario: admin can create a new company by just providing its name
        Given name as a string
        Then 1 new company with the specified name will be created in the database
        Scenario: admin cannot create a new company without providing its name
        Given name not provided
        Then an error page is shown