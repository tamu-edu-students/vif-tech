Feature: User/company assication with focuses
    In order to group users/companies by focuses
    As a user
    I want focuses to have associations with user/companies

    Scenario: Create event as admin
        # User 1, admin
        Given that I log in as admin
        # Focus 1-2
        Then creating a focus with the following should return code 201
            | name | animation |
        Then creating a focus with the following should return code 201
            | name | graphics |
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that I sign up and log in as a valid volunteer
        And I add focus with id 1 and receive code 200
        
        # User 3
        And that I sign up and log in as a valid student
        
        # User 4
        And that I sign up and log in as a valid student
        And I sign up to event 2 and receive code 200
        # User 5
        And that I sign up and log in as a valid volunteer
        And I sign up to event 2 and receive code 200