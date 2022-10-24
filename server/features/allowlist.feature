Feature: Allowlist Management
    In order to manage who can make an account
    As an admin
    I want to controll access with an allowlist

    Scenario: Log in as admin and create a new domain allowed
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        Then I should see 4 domain in the database
        And I should see a domain with index 4 in the database

    Scenario: Log in as admin and create a new domain allowed and then delete it
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And I delete the allowed domain with index 4
        Then I should see 3 domain in the database
            
    Scenario: A student signs up to a newly allowed domain
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Then the user with firstname james and lastname bond should be found in the user DB
            
    Scenario: A student signs up to a disallowed domain
        Given that I log in as admin
        Given that I sign up with the following and fail with code 400
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Then the user with firstname james and lastname bond should NOT be found in the user DB

    Scenario: A student signs up to a newly allowed domain, but with the wrong usertype
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following and fail with code 400
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | admin |
        Then the user with firstname james and lastname bond should NOT be found in the user DB

    Scenario: A company rep adds an allowed domain
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company domain test.com for usertype company representative for company id 1
        And that I sign up with the following to company id 1
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
        And that I log in with email test@test.com and password password1!
        And I allow a new domain test2.com for usertype company representative
        And that I log in as admin
        Then I should see 5 domain in the database
        And the company with id 1 should have 1 reps
        
    Scenario: Log in as admin and create a new email allowed
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        Then I should see 1 new email in the database
        And I should see an email with index 1 in the database

    Scenario: Log in as admin and create a new email allowed and then delete it
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And I delete the allowed email with index 1
        Then I should see 0 new email in the database
            
    Scenario: A student signs up to a newly allowed email
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Then the user with firstname james and lastname bond should be found in the user DB
            
    Scenario: A student signs up to a disallowed email
        Given that I log in as admin
        Given that I sign up with the following and fail with code 400
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Then the user with firstname james and lastname bond should NOT be found in the user DB

    Scenario: A student signs up to a newly allowed email, but with the wrong usertype
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And that I sign up with the following and fail with code 400
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | admin |
        Then the user with firstname james and lastname bond should NOT be found in the user DB

    Scenario: A company rep adds an allowed email
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company email test@test.com for usertype company representative for company id 1
        And that I sign up with the following to company id 1
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
        And that I log in with email test@test.com and password password1!
        And I allow a new email test2@test2.com for usertype company representative
        And that I sign up with the following to company id 1
            | firstname | james2 |
            | lastname | bond2 |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
        And that I log in as admin
        Then I should see 2 new email in the database
        And the company with id 1 should have 2 reps

    Scenario: Multiple company emails are added and only appropriate users can see them
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test2.com for usertype company representative for company id 2
        And I allow a new company email test3@test3.com for usertype company representative for company id 2
        And that I sign up with the following to company id 1
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
        And that I log in with email test@test.com and password password1!
        Then I should see 1 new email in the database
        And that I sign up with the following to company id 2
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
        And that I log in with email test2@test2.com and password password1!
        Then I should see 2 new email in the database
        And I should see an email with index 2 in the database
        And I should see an email with index 3 in the database

        
    Scenario: Multiple company emails are added and only appropriate users can see them
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new company domain test.com for usertype company representative for company id 1
        And I allow a new company domain test2.com for usertype company representative for company id 2
        And I allow a new company domain test3.com for usertype company representative for company id 2
        And that I sign up with the following to company id 1
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
        And that I log in with email test@test.com and password password1!
        Then I should see 1 domain in the database
        And that I sign up with the following to company id 2
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
        And that I log in with email test2@test2.com and password password1!
        Then I should see 2 domain in the database
        And I should see a domain with index 5 in the database
        And I should see a domain with index 6 in the database