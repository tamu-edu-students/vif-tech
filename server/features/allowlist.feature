Feature: Allowlist Management
    In order to manage who can make an account
    As an admin
    I want to controll access with an allowlist

    Scenario: Log in as admin and create a new domain allowed
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        Then I should see 1 new domain in the database
            
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
        Given that I sign up with the following
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
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | admin |
        Then the user with firstname james and lastname bond should NOT be found in the user DB