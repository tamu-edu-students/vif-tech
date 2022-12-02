Feature: Event Signup
    In order to show interest in joining the event
    As a user
    I want to be able to sign up to an event

    Scenario: Access events as user
        # User 1, admin
        Given that I log in as admin
        # Event 1-2
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-31 18:20:00' |
        Then creating an event with the following should return code 201
            | title | Another event |
            | description | Something |
            | start_time | '2022-11-01 18:10:00' |
            | end_time | '2022-11-03 18:20:00' |
        # Meeting 1-3
        And that I create a meeting with the following
            | title | A meeting |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
            | event_id | 1 |
        And that I create a meeting with the following
            | title | Another meeting |
            | start_time | '2022-10-18 18:20:00' |
            | end_time | '2022-10-18 18:30:00' |
            | event_id | 1 |
        And that I create a meeting with the following
            | title | Event 2's meeting |
            | start_time | '2022-11-01 18:20:00' |
            | end_time | '2022-11-02 18:30:00' |
            | event_id | 2 |
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that I sign up and log in as a valid volunteer
        # Availability 1-3
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-10-20 14:00:00 |
            | end_time | 2022-10-20 14:01:00 |
            | event_id | 1 |
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-10-20 15:00:00 |
            | end_time | 2022-10-20 15:01:00 |
            | event_id | 1 |
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-11-02 15:00:00 |
            | end_time | 2022-11-02 15:01:00 |
            | event_id | 2 |
        # User 2
        And that I sign up and log in as a valid volunteer
        # Availability 4
        And I want to create an availability with the following and get return status 201
            | start_time | 2022-11-02 16:00:00 |
            | end_time | 2022-11-02 16:01:00 |
            | event_id | 2 |
        Then event 1 should have following associated meetings
            | 1 | 2 |
        And event 2 should have following associated meetings
            | 3 |
        And event 1 should have following associated availabilities
            | 1 | 2 |
        And event 2 should have following associated availabilities
            | 3 | 4 | 
        
    Scenario: Get signed up users
        # User 1, admin
        Given that I log in as admin
        # Event 1-2
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-31 18:20:00' |
        Then creating an event with the following should return code 201
            | title | Another event |
            | description | Something |
            | start_time | '2022-11-01 18:10:00' |
            | end_time | '2022-11-03 18:20:00' |
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that I sign up and log in as a valid volunteer
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 3
        And that I sign up and log in as a valid student
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 4
        And that I sign up and log in as a valid student
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 5
        And that I sign up and log in as a valid volunteer
        And I sign up to event 2 and receive code 200
        # Cannot signup multiple times
        And I sign up to event 2 and receive code 400
        Then the following users should be signed up to event 1
            | 2 | 3 | 4 |
        Then the following users should be signed up to event 2
            | 2 | 3 | 4 | 5 |
        Then the following "student" users should be signed up to event 1
            | 3 | 4 |
        Then the following "student" users should be signed up to event 2
            | 3 | 4 |
        Then the following "volunteer" users should be signed up to event 1
            | 2 |
        Then the following "volunteer" users should be signed up to event 2
            | 2 | 5 |
        And I sign out of event 2 and receive code 200
        # Cannot signout multiple times
        And I sign out of event 2 and receive code 400
        Then the following users should be signed up to event 1
            | 2 | 3 | 4 |
        Then the following users should be signed up to event 1
            | 2 | 3 | 4 | 
        Then the following "student" users should be signed up to event 1
            | 3 | 4 |
        Then the following "student" users should be signed up to event 2
            | 3 | 4 |
        Then the following "volunteer" users should be signed up to event 1
            | 2 |
        Then the following "volunteer" users should be signed up to event 2
            | 2 |
        Given that I log in as admin
        And I sign up user 5 to event 1 and receive code 200
        Then the following users should be signed up to event 1
            | 2 | 3 | 4 | 5 |
        Then the following users should be signed up to event 2
            | 2 | 3 | 4 | 
        Then the following "student" users should be signed up to event 1
            | 3 | 4 |
        Then the following "student" users should be signed up to event 2
            | 3 | 4 |
        Then the following "volunteer" users should be signed up to event 1
            | 2 | 5 |
        Then the following "volunteer" users should be signed up to event 2
            | 2 |
        Given I sign out user 5 from event 1 and receive code 200
        Then the following users should be signed up to event 1
            | 2 | 3 | 4 |
        Then the following users should be signed up to event 2
            | 2 | 3 | 4 | 
        Then the following "student" users should be signed up to event 1
            | 3 | 4 |
        Then the following "student" users should be signed up to event 2
            | 3 | 4 |
        Then the following "volunteer" users should be signed up to event 1
            | 2 |
        Then the following "volunteer" users should be signed up to event 2
            | 2 |
    
    Scenario: Get signed up users
        # User 1, admin
        Given that I log in as admin
        # Event 1-2
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-31 18:20:00' |
        Then creating an event with the following should return code 201
            | title | Another event |
            | description | Something |
            | start_time | '2022-11-01 18:10:00' |
            | end_time | '2022-11-03 18:20:00' |
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that I sign up and log in as a valid volunteer
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 3
        And that I sign up and log in as a valid student
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 4
        And that I sign up and log in as a valid student
        And I sign up to event 1 and receive code 200
        And I sign up to event 2 and receive code 200
        # User 5
        And that I sign up and log in as a valid volunteer
        And I sign up to event 2 and receive code 200
        # Cannot signup multiple times
        And I sign up to event 2 and receive code 400
        Then the following users should be fetched with event 1
            | 2 | 3 | 4 |
        Then the following users should be fetched with event 2
            | 2 | 3 | 4 | 5 |
        And there should be 7 event_signups
        And event_signup with id 1 should involve event 1 and user 2