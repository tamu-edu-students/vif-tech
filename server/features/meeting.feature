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
    
    Scenario: Create meeting with non-existant event
        Given that I log in as admin
        Then creating meeting with the following should return http code 404
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
            | event_id | 10 |
    
    Scenario: Assign meeting rto non-existant event
        Given that I log in as admin
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        Then updating meeting 1 with the following should return http code 404
            | event_id | 10 |
        
    
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
        Then 0 meetings should be in meeting DB
    
    Scenario: Trying to create a meeting as student
        Given that I sign up and log in as a valid student
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I log in as admin
        Then 0 meetings should be in meeting DB

    Scenario: Mass update invitees
        # User 2-6
        Given a student signs up and confirms their email
        And a student signs up and confirms their email
        And a student signs up and confirms their email
        And a student signs up and confirms their email
        And that I log in as admin
        And that I create a valid meeting
        Then I get code 200 when mass updating meeting 1's invitees with
            | user_id | status |
            | 2 | pending |
            | 3 | accepted |
            | 4 | cancelled |
            | 5 | declined |
        Then meeting 1 should have as invitees the following users
            | 2 | 3 | 4 | 5 |
        # Pass invalid status
        Then I get code 400 when mass updating meeting 1's invitees with
            | user_id | status |
            | 2 | invalid |
        # Above failed mass update shouldn't have affected the invitees
        Then meeting 1 should have as invitees the following users
            | 2 | 3 | 4 | 5 |
        # Pass invalid user
        Then I get code 400 when mass updating meeting 1's invitees with
            | user_id | status |
            | 7 | pending |
        # Above failed mass update shouldn't have affected the invitees
        Then meeting 1 should have as invitees the following users
            | 2 | 3 | 4 | 5 |
        Then I get code 200 when mass updating meeting 1's invitees with
            | user_id | status |
            | 2 | pending |
            | 4 | cancelled |
        Then meeting 1 should have as invitees the following users
            | 2 | 4 |
        Then I get code 200 when mass updating meeting 1's invitees with
            | user_id | status |
            | 3 | accepted |
            | 5 | declined |
        Then meeting 1 should have as invitees the following users
            | 3 | 5 |
    
    Scenario: Mass update invitees
        # User 2-6
        Given a student signs up and confirms their email
        And a student signs up and confirms their email
        And a student signs up and confirms their email
        And a student signs up and confirms their email
        And a student signs up and confirms their email
        And that I log in as admin
        And that I create a valid meeting
        Then I get code 200 when mass updating meeting 1's invitees with
            | user_id | status |
            | 2 | pending |
            | 3 | accepted |
            | 4 | cancelled |
            | 5 | declined |
            | 6 | accepted |
        Then meeting 1 should have as "pending" invitees the following users
            | 2 |
        Then meeting 1 should have as "accepted" invitees the following users
            | 3 | 6 |
        Then meeting 1 should have as "cancelled" invitees the following users
            | 4 |
        Then meeting 1 should have as "declined" invitees the following users
            | 5 |