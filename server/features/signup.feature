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
        And that I log in as admin
        Then the user with email test@tamu.edu should be found in the user DB
        And the user with email test@tamu.edu should be marked as not verified
        And there should be 1 sent emails
            
    Scenario: Signup as student with wrong password confirmation
        Given that I sign up with the following and fail with code 400
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | wrong |
            | email | test@tamu.edu |
            | usertype | student |
        Given that an user signs up as a valid student
        And that I log in as admin
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
        Then the user should get a 404 error when trying to verify with an incorrect token

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
        Given that I sign up with the following and fail with code 400
            | firstname | jane |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |   
        And that the user verified their email test@tamu.edu
        And that I log in as admin
        Then the user with firstname james and lastname bond should be found in the user DB
        And the user with firstname jane and lastname bond should NOT be found in the user DB
        And the user with email test@tamu.edu should be marked as verified
        And there should be 1 sent emails
        And I should be able to query 2 users by id in the user DB

    Scenario: Log in as admin
        Given that I log in as admin
        Then I should be logged in
    
    Scenario: Signup as company representative
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company domain test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        Then the user with firstname james and lastname bond should be found in the user DB
        And the company with id 1 should have user with email "test@test.com"
    
    Scenario: Signup as student with company ID
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company domain test.com for usertype company representative for company id 1
        And that I sign up with the following and fail with code 400
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
            | company_id | 1 |
        Then the user with email test@test.com should NOT be found in the user DB

    Scenario: Signup as student and delete account
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        And I delete my account
        And that I log in as admin
        Then the user with email test@tamu.edu should NOT be found in the user DB

    Scenario: Signup as student and delete account
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        And I delete the account for id 2
        And that I log in as admin
        Then the user with email test@tamu.edu should NOT be found in the user DB

    Scenario: Signup as student and admin deletes account
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And that the user verified their email test@tamu.edu
        And that I log in as admin
        And I delete the account for id 2
        Then the user with email test@tamu.edu should NOT be found in the user DB

    Scenario: Non-admin cannot delete another person's account
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        And I fail to delete the account for id 1
        And that I log in as admin
        Then the user with email admin@admin.com should be found in the user DB

    Scenario: Change my password
        Given that I log in as admin
        Then I should be logged in
        And that I update my password to new_pw
        Then I should not be logged in
        And that I log in with email admin@admin.com and password new_pw
        Then I should be logged in
        And that I log out
        Then I should not be logged in
        And that I log in with email admin@admin.com and password pw
        Then I should not be logged in

    Scenario: Signup as student and update some fields
        Given that I log in as admin
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Then the user with email test@tamu.edu should be found in the user DB
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        And I update the user with id 2 to have profile_img_src with value https://www.google.com
        Then the user with id 2 should have profile_img_src with value https://www.google.com
        And I update the user with id 2 to have class_semester with value fall
        Then the user with id 2 should have class_semester with value fall

    Scenario: Signup as student and an admin updates some fields
        Given that I log in as admin
        Given that I sign up with the following
            | firstname | john |
            | lastname | doe |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        Given that I log in as admin
        And I update the user with id 2 to have profile_img_src with value https://www.google.com
        Then the user with id 2 should have profile_img_src with value https://www.google.com