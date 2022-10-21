Feature: Student signup
    In order to access the website
    As a user
    I want to signup and create account

    Scenario: Signup as student
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And the user with email test@tamu.edu should be marked as not verified
        And there should be 1 sent emails
            
    Scenario: Signup as student with wrong password confirmation
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | wrong |
            | email | test@tamu.edu |
            | usertype | student |
        Given that an user signs up as a valid student
        Then the user with email test@tamu.edu should NOT be found in the user DB
    
    Scenario: Show students
        Given that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that I log in as admin
        Then there should be 6 users found in the user DB
    
    Scenario: Show student who's NOT there.
        Given that an user signs up as a valid student
        Then the user with id 3 should NOT be in the user DB
    
    Scenario: Query students
        Given that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        Then I should be able to query 7 users by id in the user DB
        And there should be 7 sent emails


    Scenario: Signup as student and verify email
        Given that I sign up with the following
            | firstname | jane |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        And that the user verified their email test@tamu.edu
        Then the user with email test@tamu.edu should be found in the user DB
        And the user with email test@tamu.edu should be marked as verified
    
    Scenario: Signup as student and verify email with incorrect token
        Given that I sign up with the following
            | firstname | jane |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user should get a 500 error when trying to verify with an incorrect token

    Scenario: Signup as student and verify email with link
        Given that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        And that the first user clicked the link in their email
        Then the user with email test@tamu.edu should be found in the user DB
        And the user with email test@tamu.edu should be marked as verified

    Scenario: A user tries to reuse an email
        Given that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Given that I sign up with the following
            | firstname | jane |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |   
        And that the user verified their email test@tamu.edu
        Then the user with firstname james and lastname bond should be found in the user DB
        And the user with firstname jane and lastname bond should NOT be found in the user DB
        And the user with email test@tamu.edu should be marked as verified
        And there should be 1 sent emails
        And I should be able to query 2 users by id in the user DB

    Scenario: Log in as admin
        Given that I log in as admin
        Then I should be logged in