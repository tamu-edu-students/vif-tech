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

    Scenario: A student signs up to a newly allowed domain with funny casing
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tEsT.cOm |
            | usertype | student |
        Then the user with firstname james and lastname bond should be found in the user DB

    Scenario: A student signs up to a newly allowed domain, which is then deleted
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
        Given that I log in as admin
        And I delete the allowed domain with index 4
        Then the user with firstname james and lastname bond should NOT be found in the user DB
            
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
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I allow a new domain test2.com for usertype company representative
        And that I log in as admin
        Then I should see 4 domain in the database
        And the company with id 1 should have 1 reps
        And the primary contact for the company with id 1 should have email test@test.com

    Scenario: An admin allows the same domain for a multiple company
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new domain test.com for usertype student
        And I allow a new company domain test.com for usertype company representative for company id 1        
        And I allow a new company domain test.com for usertype company representative for company id 2        
        Then I should see 6 domain in the database

    Scenario: An admin allows the same domain for a the same company
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company domain test.com for usertype company representative for company id 1        
        And I fail to allow a new company domain test.com for usertype company representative for company id 1        
        Then I should see 4 domain in the database

    Scenario: An admin allows the same domain for a the same company with funny casing
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company domain test.com for usertype company representative for company id 1        
        And I fail to allow a new company domain tEsT.cOm for usertype company representative for company id 1        
        Then I should see 4 domain in the database

    Scenario: An admin allows the same email for a the same company
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I fail to allow a new primary contact company email test@test.com for usertype company representative for company id 1
        Then I should see 1 new email in the database

    Scenario: An admin allows the same email for a the same company with funny casing
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I fail to allow a new primary contact company email tEsT@tEsT.cOm for usertype company representative for company id 1
        Then I should see 1 new email in the database

    Scenario: An admin allows the same email for a multiple company
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 2
        Then I should see 2 new email in the database

    Scenario: An admin allows the same email for a the same company
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I fail to allow a new primary contact company email test@test.com for usertype company representative for company id 1
        Then I should see 1 new email in the database
        
    Scenario: Log in as admin and create a new email allowed
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        Then I should see 1 new email in the database
        And I should see an email with index 1 in the database

    Scenario: Log in as admin and create a new email allowed
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company email test@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        Then the user with firstname james and lastname bond should be found in the user DB

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

    Scenario: A student signs up to a newly allowed email with funny casing
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | tEsT@tEsT.cOm |
            | usertype | student |
        Then the user with firstname james and lastname bond should be found in the user DB

    Scenario: A student signs up to a newly allowed email, which is then deleted
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
        Given that I log in as admin
        And I delete the allowed email with index 1
        Then the user with firstname james and lastname bond should NOT be found in the user DB
            
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
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I allow a new email test2@test2.com for usertype company representative
            And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I log in as admin
        Then I should see 2 new email in the database
        And the company with id 1 should have 2 reps

    Scenario: Multiple company emails are added and only appropriate users can see them
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new primary contact company email test2@test2.com for usertype company representative for company id 2
        And I allow a new company email test3@test3.com for usertype company representative for company id 2
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should see 1 new email in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
            | company_id | 2 |
        And that the user verified their email test2@test2.com
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
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new primary contact company email test2@test2.com for usertype company representative for company id 2
        Then I should see 6 domain in the database
        And I should see 2 new email in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should see 1 domain in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
            | company_id | 2 |
        And that the user verified their email test2@test2.com
        And that I log in with email test2@test2.com and password password1!
        Then I should see 2 domain in the database
        And I should see a domain with index 5 in the database
        And I should see a domain with index 6 in the database

            
    Scenario: Multiple company emails are added and only appropriate users can see them
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new company domain test.com for usertype company representative for company id 1
        And I allow a new company domain test2.com for usertype company representative for company id 2
        And I allow a new company domain test3.com for usertype company representative for company id 2
        Then I should see 6 domain in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And I should see 1 domain in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
            | company_id | 2 |
        And that the user verified their email test2@test2.com
        And that I log in with email test2@test2.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And I should see 2 domain in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        Then I should get a 403 code from the domain database


    Scenario: Multiple company emails are added and only appropriate users can see them
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new company domain test0.com for usertype company representative for company id 1
        And I allow a new company domain test02.com for usertype company representative for company id 2
        And I allow a new company email test@test.com for usertype company representative for company id 1
        Then I should see 5 domain in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And I should see 1 domain in the database
        And I should see 1 new email in the database
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@tamu.edu |
            | usertype | student |
        And that the user verified their email test@tamu.edu
        And that I log in with email test@tamu.edu and password password1!
        Then I should get a 403 code from the domain database
        

    Scenario: A rep transfers primary contact correctly
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test@test.com
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should see 2 new email in the database
        And that the user verified their email test2@test.com
        And that I log in with email test2@test.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And that I log in with email test@test.com and password password1!
        And I transfer my primary contact role to user with id 3
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And that I log in with email test2@test.com and password password1!
        Then I should see 2 new email in the database
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test2@test.com


    Scenario: An admin transfers primary contact correctly
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test@test.com
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should see 2 new email in the database
        And that the user verified their email test2@test.com
        And that I log in with email test2@test.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And that I log in as admin
        And I transfer primary contact role to user with id 3
        And that I log in with email test@test.com and password password1!
        Then I should get a 200 code from the domain database
        And I should get a 200 code from the email database
        And that I log in with email test2@test.com and password password1!
        Then I should see 2 new email in the database
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test2@test.com

    Scenario: A rep fails to transfer primary contact
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I fail to transfer my primary contact role to user with id 3

    Scenario: A rep fails to transfer primary contact
        Given that I log in as admin
        And there is a company with id 1
        And there is a company with id 2
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new company email test2@test.com for usertype company representative for company id 2
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test.com |
            | usertype | company representative |
            | company_id | 2 |
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test@test.com
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I fail to transfer my primary contact role to user with id 3
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test@test.com

    Scenario: A rep transfers primary contact to a user allowed by domain
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new primary contact company email test@test.com for usertype company representative for company id 1
        And I allow a new company domain test2.com for usertype company representative for company id 1
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test2@test2.com |
            | usertype | company representative |
            | company_id | 1 |
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test@test.com
        And I should see 1 new email in the database
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        And I transfer my primary contact role to user with id 3
        And that I log in as admin
        Then the primary contact for the company with id 1 should have email test2@test2.com
        And I should see 2 new email in the database

    Scenario: A student signs up to a newly allowed email and email, which is then deleted, but he remains
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        Then the user with firstname james and lastname bond should be found in the user DB
        Given that I log in as admin
        And I delete the allowed email with index 1
        Then the user with firstname james and lastname bond should be found in the user DB

    Scenario: A student signs up to a newly allowed email and email, which is then deleted, but he remains
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        Then the user with firstname james and lastname bond should be found in the user DB
        Given that I log in as admin
        And I delete the allowed domain with index 4
        Then the user with firstname james and lastname bond should be found in the user DB

        
    Scenario: A student signs up to a newly allowed email and email, which is then deleted, but he remains
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        Then the user with firstname james and lastname bond should be found in the user DB
        Given that I log in as admin
        And I delete the allowed email with index 1
        Then the user with firstname james and lastname bond should be found in the user DB

    Scenario: A student signs up to a newly allowed email and email, which is then deleted, but he remains
        Given that I log in as admin
        And I allow a new email test@test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        Given that I log in as admin
        And I allow a new domain test.com for usertype student
        Then the user with firstname james and lastname bond should be found in the user DB
        Given that I log in as admin
        And I delete the allowed domain with index 4
        Then the user with firstname james and lastname bond should be found in the user DB

    Scenario: Filter domain allowlist
        Given that I log in as admin
        And I allow a new domain test.com for usertype admin
        And I allow a new domain test2.com for usertype admin
        And there is a company with id 1
        And I allow a new company domain test3.com for usertype company representative for company id 1
        Then I should see 6 domain in the database
        And I should see 3 domain with usertype: student in the database
        And I should see 1 domain with company_id: 1 in the database

    Scenario: Filter email allowlist
        Given that I log in as admin
        And I allow a new email 1@test.com for usertype admin
        And I allow a new email 1@test2.com for usertype admin
        And there is a company with id 1
        And I allow a new company email test@test3.com for usertype company representative for company id 1
        Then I should see 3 new email in the database
        And I should see 0 email with usertype: student in the database
        And I should see 1 email with company_id: 1 in the database

    Scenario: Companies is joined on allowlist for an admin        
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company email test@test1.com for usertype company representative for company id 1
        And I allow a new company email test@test2.com for usertype company representative for company id 1
        And I allow a new company domain test3.com for usertype company representative for company id 1
        Then I should see allowlist emails and domains in company 1 when indexing

    Scenario: Companies is not joined on allowlist for an admin        
        Given that I log in as admin
        And there is a company with id 1
        And I allow a new company email test@test1.com for usertype company representative for company id 1
        And I allow a new company email test@test2.com for usertype company representative for company id 1
        And I allow a new company domain test3.com for usertype company representative for company id 1
        And I allow a new domain test.com for usertype student
        And that I sign up with the following
            | firstname | james |
            | lastname | bond |
            | password | password1! |
            | password_confirmation | password1! |
            | email | test@test.com |
            | usertype | student |
        And that the user verified their email test@test.com
        And that I log in with email test@test.com and password password1!
        Then I should not see allowlist emails and domains in company 1 when indexing
        And that I log out