Feature: Student signup
    In order to access the website
    As a user
    I want to signup and create account

    Scenario: Signup as student
        Given that I sign up with the following
            | username | test_student |
            | password | password1! |
            | password_confirmation | password1! |
        Then the user with username test_student should be found in the user DB
            
    Scenario: Signup as student with wrong password confirmation
        Given that I sign up with the following
            | username | test_student |
            | password | password1! |
            | password_confirmation | wrong |
        Then the user with username test_student should NOT be found in the user DB
    
    Scenario: Show students
        Given that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        Then there should be 5 students found in the user DB
    
    Scenario: Find student when who's NOT there.
        Given that an user signs up as a valid student
        Then the user with id 2 should NOT be in the user DB
    
    Scenario: Query students
        Given that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        Then I should be able to query 7 students by id in the user DB