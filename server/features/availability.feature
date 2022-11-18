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
        And I want to update the availability with id 1 with the following and get return status 200
            | start_time | 2022-11-18 13:50:00 |
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

    Scenario: Admin request meetings and invitations based on user availabilities 
        # User 1, admin
        Given that I log in as admin
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that an user signs up as a valid volunteer
        And I want to create an availability with the following and get return status 201
            | user_id | 2 |
            | start_time | 2022-10-18 18:00:00 |
            | end_time | 2022-10-18 19:01:00 |
        And I want to create an availability with the following and get return status 201
            | user_id | 2 |
            | start_time | 2022-10-18 20:20:00 |
            | end_time | 2022-10-18 20:35:00 |
        And that I create a meeting with the following
            | title | Meeting1 |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
        And that I create a meeting with the following
            | title | Meeting2 |
            | start_time | '2022-10-18 18:30:00' |
            | end_time | '2022-10-18 19:00:00' |
        And that I create a meeting with the following
            | title | Meeting3 |
            | start_time | '2022-10-18 18:40:00' |
            | end_time | '2022-10-18 19:20:00' |
        And that I create a meeting with the following
            | title | Meeting4 |
            | start_time | '2022-10-18 19:00:00' |
            | end_time | '2022-10-18 19:05:00' |
            | owner_id | 2 |
        And that I create a meeting with the following
            | title | Meeting5 |
            | start_time | '2022-10-18 20:20:00' |
            | end_time | '2022-10-18 20:30:00' |
            | owner_id | 2 |
        And that I create a meeting with the following
            | title | Meeting5 |
            | start_time | '2022-10-18 20:30:00' |
            | end_time | '2022-10-18 20:35:00' |
            | owner_id | 2 |
        And that I assign user 2 to meeting 1 with status "pending"
        And that I assign user 2 to meeting 2 with status "accepted"
        And that I assign user 2 to meeting 3 with status "declined"
        Then there should be 2 availabilities for user 2
        And there should be 2 owned and avaliable meetings for user 2
        And there should be 1 owned but not avaliable meetings for user 2
        And there should be 2 invitations user 2 is avaliable for
        And there should be 1 invitations user 2 is not avaliable for
        

    Scenario: Admin deletes meetinsg and invitations based on user availabilities
        # User 1, admin
        Given that I log in as admin
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that an user signs up as a valid volunteer
        And I want to create an availability with the following and get return status 201
            | user_id | 2 |
            | start_time | 2022-10-18 18:00:00 |
            | end_time | 2022-10-18 19:01:00 |
        And I want to create an availability with the following and get return status 201
            | user_id | 2 |
            | start_time | 2022-10-18 20:20:00 |
            | end_time | 2022-10-18 20:35:00 |
        # Meetings 1~6
        And that I create a meeting with the following
            | title | Meeting1 |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
        And that I create a meeting with the following
            | title | Meeting2 |
            | start_time | '2022-10-18 18:30:00' |
            | end_time | '2022-10-18 19:00:00' |
        And that I create a meeting with the following
            | title | Meeting3 |
            | start_time | '2022-10-18 18:40:00' |
            | end_time | '2022-10-18 19:20:00' |
        And that I create a meeting with the following
            | title | Meeting4 |
            | start_time | '2022-10-18 19:00:00' |
            | end_time | '2022-10-18 19:05:00' |
            | owner_id | 2 |
        And that I create a meeting with the following
            | title | Meeting5 |
            | start_time | '2022-10-18 20:20:00' |
            | end_time | '2022-10-18 20:30:00' |
            | owner_id | 2 |
        And that I create a meeting with the following
            | title | Meeting5 |
            | start_time | '2022-10-18 20:30:00' |
            | end_time | '2022-10-18 20:35:00' |
            | owner_id | 2 |
        And that I assign user 2 to meeting 1 with status "pending"
        And that I assign user 2 to meeting 2 with status "accepted"
        And that I assign user 2 to meeting 3 with status "declined"
        Then there should be 2 availabilities for user 2
        And there should be 2 owned and avaliable meetings for user 2
        And there should be 1 owned but not avaliable meetings for user 2
        And there should be 2 invitations user 2 is avaliable for
        And there should be 1 invitations user 2 is not avaliable for
        Given that I delete owned but not avaliable meetings for user 2
        And that I delete invitations user 2 is not avaliable for
        Then meeting 4 should not exist
        And user meeting 3 should not exist
        And there should be 2 owned and avaliable meetings for user 2
        And there should be 0 owned but not avaliable meetings for user 2
        And there should be 2 invitations user 2 is avaliable for
        And there should be 0 invitations user 2 is not avaliable for