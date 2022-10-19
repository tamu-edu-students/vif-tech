Feature: Meeting
    In order to connect the users through the website
    As a developer
    I want to add meetings

    Scenario: Create meeting all valid
        Given that I sign up and log in as a valid student
        And that I create a meeting with title 'Great meeting!' and start time from '2022-10-18 17:30:00' to '2022-10-18 17:45:00' 
        And that I create a meeting with title 'Another great meeting!' and start time from '2022-10-18 17:45:00' to '2022-10-18 17:50:00' 
        Then 2 meetings should be in meeting DB

    Scenario: Create meeting, one invalid and one valid
        Given that I sign up and log in as a valid student
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
        And that I sign up and log in as a valid student
        Then 0 meetings should be in meeting DB

    Scenario: Create meeting with owner id
        # User created with id 1
        Given that I sign up and log in as a valid student
        # User created with id 2
        And that I sign up and log in as a valid student
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And that I create a meeting with the following
            | title | Another meeting |
            | start_time | '2022-10-18 18:00:00' |
            | end_time | '2022-10-18 18:30:00' |
            | owner_id | 1 |
        Then the meeting with id 1 will have 'title': 'A meeting'
        Then the meeting with id 1 will have 'owner_id': 2
        Then the meeting with id 2 will have 'title': 'Another meeting'
        Then the meeting with id 2 will have 'owner_id': 1
    
    Scenario: Edit meeting
        # User created with id 1
        Given that I sign up and log in as a valid student
        # User created with id 2
        And that I sign up and log in as a valid student
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
        Then the meeting with id 1 will have 'owner_id': 1