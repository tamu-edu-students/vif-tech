Feature: Meeting
    In order to connect the users through the website
    As a developer
    I want to add meetings

    Scenario: Create meeting all valid
        Given that I log in as admin
        And that I create a meeting with title 'Great meeting!' and start time from '2022-10-18 17:30:00' to '2022-10-18 17:45:00' 
        And that I create a meeting with title 'Another great meeting!' and start time from '2022-10-18 17:45:00' to '2022-10-18 17:50:00' 
        Then 2 meetings should be in meeting DB

    Scenario: Create meeting, one invalid and one valid
        Given that I log in as admin
        # Only the first one is invalid
        And that I create a meeting with title 'Invalid great meeting!' and start time from '2999-10-18 17:30:00' to '2022-10-18 17:45:00'  
        And that I create a meeting with title 'Another great meeting!' and start time from '2022-10-18 17:45:00' to '2022-10-18 17:50:00' 
        And that I create a meeting with title 'Final meeting!' and start time from '2022-10-18 16:45:00' to '2022-10-18 17:00:00' 
        Then 2 meetings should be in meeting DB
    
    Scenario: Create meeting while not authenticated should receive 500 error
        Given that I log out
        Then creating meetings should result in not authenticated error

    Scenario: Create meeting while not authenticated should result in 0 creation
        Given that I log out
        And that I create a meeting with title 'Valid great meeting!' and start time from '2022-10-18 17:45:00' to '2022-10-18 17:50:00' 
        And that I create a meeting with title 'Another valid great meeting!' and start time from '2022-10-18 18:45:00' to '2022-10-18 19:50:00' 
        And that I log in as admin
        Then 0 meetings should be in meeting DB

    Scenario: Create meeting with owner id
        # User created with id 2
        Given that I sign up and log in as a valid student
        # User created with id 1
        And that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I create a meeting with the following
            | title | Another meeting |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
            | owner_id | 2 |
        Then the meeting with id 1 will have 'title': 'A meeting'
        And the meeting with id 1 will have 'owner_id': 1
        And the meeting with id 2 will have 'title': 'Another meeting'
        And the meeting with id 2 will have 'owner_id': 2
    
    Scenario: Edit meeting
        # User created with id 1
        Given that I sign up and log in as a valid student
        # User created with id 2
        And that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I update a meeting with id 1 with the following
            | title | Another meeting |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
            | owner_id | 1 |
        Then the meeting with id 1 will have 'title': 'Another meeting'
        And the meeting with id 1 will have 'owner_id': 1
    
    Scenario: Create meeting with owner id
        # User created with id 1
        Given that I sign up and log in as a valid student
        # User created with id 2
        And that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I create a meeting with the following
            | title | Another meeting |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
            | owner_id | 1 |
        And delete the meeting with id 1
        Then the meeting with id 2 will have 'title': 'Another meeting'
        And the meeting with id 2 will have 'owner_id': 1
        And the meeting with id 1 will not be found due to 404 error

    Scenario: Trying to remove other people's meetings as non-admin
        Given that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I sign up and log in as a valid student
        Then deleting the meeting with id 1 should fail due to 403 error

    Scenario: Trying to remove other people's meetings as admin
        Given that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I log in as admin
        Then deleting the meeting with id 1 should succeed

    Scenario: Trying to query meetings as non-admin
        Given that I sign up and log in as a valid student
        Then I should NOT be able to fetch meetings due to 403 error
    
    Scenario: Trying to create a meeting as non-admin
        Given that I sign up and log in as a valid student
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I log in as admin
        Then 0 meetings should be in meeting DB

    Scenario: create a meeting as a representative
        Given that I log in as admin
        And there is a company with id 10
        And I allow a new company domain disney.com for usertype representative for company id 10
        And I allow a new company email a@disney.com for usertype representative for company id 10
        And that I sign up with the following
            | firstname | Jane |
            | lastname | Frost |
            | password | password1! |
            | password_confirmation | password1! |
            | email | a@disney.com |
            | usertype | representative |
            | company_id | 10 |
        And that I log in with email a@disney.com and password password1!
        Then I should be logged in
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I log in as admin
        Then 1 meetings should be in meeting DB