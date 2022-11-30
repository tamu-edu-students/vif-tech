Feature: Event
    In order to group meetings and availabilities
    And see the interested users
    As an admin
    I want to add events


    Scenario: Create event as admin
        Given that I log in as admin
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
    
    Scenario: Create event as admin with bad time
        Given that I log in as admin
        Then creating an event with the following should return code 500
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 17:20:00' |
    
    Scenario: Access events as user
        Given that I log in as admin
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And creating an event with the following should return code 201
            | title | Another event |
            | description | Something |
            | start_time | '2022-10-19 18:10:00' |
            | end_time | '2022-10-19 18:20:00' |
        Given that I log out
        Then there should be 2 events in the DB
        Then event 1 should have title "Mock interview"
    
    Scenario: Update event as admin
        Given that I log in as admin
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        Then I request update event 1 with the following and recieve code 200
            | title | Mock interview (2)|
        Then event 1 should have title "Mock interview (2)"
    
    Scenario: Delete event as admin
        Given that I log in as admin
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        And I request delete event 1 and recieve code 200
        And creating an event with the following should return code 201
            | title | Another event |
            | description | Something |
            | start_time | '2022-10-19 18:10:00' |
            | end_time | '2022-10-19 18:20:00' |
        Then there should be 1 events in the DB
    
    Scenario: Create, update, delete event as user
        Given that I log in as admin
        Then creating an event with the following should return code 201
            | title | Mock interview |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 18:20:00' |
        Given that I sign up and log in as a valid student
        Then I request update event 1 with the following and recieve code 403
            | title | Mock interview (2)|
        Then event 1 should have title "Mock interview"
        Then creating an event with the following should return code 403
            | title | Mock interview (2) |
            | description | Something |
            | start_time | '2022-10-18 18:10:00' |
            | end_time | '2022-10-18 17:20:00' |
        Then there should be 1 events in the DB
        And I request delete event 1 and recieve code 403
        Then there should be 1 events in the DB
