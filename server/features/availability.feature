Feature: User availability
    In order to help admin make informed decisions about scheduling
    As a company rep or a volunteer
    I want to add my availability

    Scenario: Get user availabilities
        Given that I log in as admin
        Then I want to get all availabilities
    
    Scenario: Get user availabilities as guest
        Given that I log out
        Then I shouldn't be able to list availabilities
    
    Scenario: Create and delete user availabilities as admin
        Given that I log in as admin
        And I allow a new domain test.com for usertype volunteer
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | volunteer |
        And that I log in as admin
        And I want to create an availability with the following and get return status 201
            | user_id | 2 |
            | start_time | 2022-11-18 14:00:00 |
            | end_time | 2022-11-18 14:01:00 |
        And the user with "firstname" "james" and "lastname" "bond" should have availability with id 1
        And there should be 1 availabilities entries visible to me
        Given that I delete availability with id 1
        Then there should be 0 availabilities entries visible to me
    
    Scenario: Create and delete user availabilities as volunteer
        Given that I log in as admin
        And I allow a new domain test.com for usertype volunteer
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | volunteer |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-11-18 14:00:00 |
            | end_time | 2022-11-18 14:01:00 |
        Then the user with "firstname" "james" and "lastname" "bond" should have availability with id 1
        Given that I delete availability with id 1
        Then there should be 0 availabilities entries visible to me


    Scenario: Create user availabilities as student
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I want to create an availability with the following and get return status 403
            | start_time | 2022-11-18 14:00:00 |
            | end_time | 2022-11-18 14:01:00 |
        Given that I log in as admin
        Then there should be 0 availabilities entries visible to me
    
    Scenario: Delete user availabilities as student
        Given that I log in as admin
        And I allow a new domain test.com for usertype volunteer
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | volunteer |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-11-18 14:00:00 |
            | end_time | 2022-11-18 14:01:00 |
        Given that I log in as admin
        Then there should be 1 availabilities entries visible to me
        Given I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | jane |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | student |
        And that the user verified their email test2@test.com
        And that I log in with email test2@test.com and password password1!
        Then I should NOT be able to delete availability with id 1 with status code 403
    
    Scenario: Create and delete user availabilities as volunteer
        Given that I log in as admin
        And I allow a new domain test.com for usertype volunteer
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | volunteer |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-11-18 14:00:00 |
            | end_time | 2022-11-18 14:01:00 |
        Then there should be 1 availabilities entries visible to me