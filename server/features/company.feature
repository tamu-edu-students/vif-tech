Feature: admin can CRUD a company object/account
    In order to manage who can make an account
    As an admin
    I want to controll access with an allowlist

    Scenario: admin can create a new company by providing its name, description
        Given that I log in as admin
        And name as a string and description as a text
        Then 1 company should be in company DB
        
    Scenario: admin can create a new company by just providing its name
        Given that I log in as admin
        And name as a string
        Then 1 new company with the specified name will be created in the database
        Scenario: admin cannot create a new company without providing its name
        Given name not provided
        Then an error page is shown

    Scenario: Create multiple users availabilities as representative and then fetch that through the company
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I sign up with the following
            | firstname | james2 |
            | lastname | bond2 |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test2@test.com
        And that I log in as admin
        Then I should see 2 reps for company with id 1
