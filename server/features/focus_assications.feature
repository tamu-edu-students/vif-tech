Feature: User/company assication with focuses
    In order to group users/companies by focuses
    As a user
    I want focuses to have associations with user/companies

    Scenario: User focuses association test
        # User 1, admin
        Given that I log in as admin
        # Focus 1-2
        Then creating a focus with the following should return code 201
            | name | animation |
        And creating a focus with the following should return code 201
            | name | graphics |
        And creating a focus with the following should return code 201
            | name | advertisement |
        And I allow a new domain tamu.edu for usertype volunteer
        # User 2
        And that I sign up and log in as a valid volunteer
        And I add focus with id 1 and receive code 200
        # Cannot add duplicate
        And I add focus with id 1 and receive code 400
        # Focus 100 not in DB
        And I add focus with id 100 and receive code 404
        # User 3
        And that I sign up and log in as a valid student
        And I add focus with id 1 and receive code 200
        # User 4
        And that I sign up and log in as a valid student
        And I add focus with id 1 and receive code 200
        And I add focus with id 2 and receive code 200
        # User 5
        And that I sign up and log in as a valid volunteer
        And I add focus with id 2 and receive code 200
        # User 6
        And that I sign up and log in as a valid student
        And I add focus with id 2 and receive code 200
        Then the following users should be associated with focus 1
            | 2 | 3 | 4 |
        Then the following users should be associated with focus 2
            | 4 | 5 | 6 |
        Then there should be 6 UserFocus associations in DB
        Given that I log in as admin
        Then I delete focus 1 of user 2 and receive code 200
        # Fails
        Then I delete focus 2 of user 2 and receive code 400
        And I delete focus 2 of user 5 and receive code 200
        # Fails
        And I delete focus 2 of user 100 and receive code 404
        # Fails
        And I delete focus 100 of user 5 and receive code 404
        And the following users should be associated with focus 1
            | 3 | 4 |
        And the following users should be associated with focus 2
            | 4 | 6 |
        And there should be 4 UserFocus associations in DB
        # No user
        And I update focuses of user 100 as following and recieve code 404
            | id |
            | 1  |
            | 2  |
            | 3  |
        And I update focuses of user 3 as following and recieve code 200
            | id |
            | 1  |
            | 2  |
            | 3  |
        And I update focuses of user 3 as following and recieve code 400
            | id |
            | 1  |
            | 100 |
        And I update focuses of user 3 as following and recieve code 400
            | yo |
            | 1  |
            | 2  |
        And the following users should be associated with focus 1
            | 3 | 4 |
        And the following users should be associated with focus 2
            | 3 | 4 | 6 |
        And the following users should be associated with focus 3
            | 3 |




    Scenario: Company focuses association test
        Given that I log in as admin
        # Focus 1-2
        Then creating a focus with the following should return code 201
            | name | animation |
        And creating a focus with the following should return code 201
            | name | graphics |
        And creating a focus with the following should return code 201
            | name | advertisement |
        # Company 1
        Given that I create a valid company
        Then I add focus with id 1 to company 1 and receive code 200
        # Cannot add duplicate
        And I add focus with id 1 to company 1 and receive code 400
        # Focus 100 not in DB
        And I add focus with id 100 to company 1 and receive code 404
        # Company 2
        Given that I create a valid company
        Then I add focus with id 1 to company 2 and receive code 200
        # Company 3
        Given that I create a valid company
        Then I add focus with id 1 to company 3 and receive code 200
        Then I add focus with id 2 to company 3 and receive code 200
        # Company 4
        Given that I create a valid company
        Then I add focus with id 2 to company 4 and receive code 200
        # Company 5
        Given that I create a valid company
        Then I add focus with id 2 to company 5 and receive code 200
        Then the following companies should be associated with focus 1
            | 1 | 2 | 3 |
        Then the following companies should be associated with focus 2
            | 3 | 4 | 5 |
        Then there should be 6 CompanyFocus associations in DB
        Given that I log in as admin
        Then I delete focus 1 of company 1 and receive code 200
        # Fails
        Then I delete focus 2 of company 1 and receive code 400
        And I delete focus 2 of company 4 and receive code 200
        # Fails
        And I delete focus 2 of company 100 and receive code 404
        # Fails
        And I delete focus 100 of company 4 and receive code 404
        And the following companies should be associated with focus 1
            | 2 | 3 |
        And the following companies should be associated with focus 2
            | 3 | 5 |
        And there should be 4 CompanyFocus associations in DB
        # No company
        And I update focuses of company 100 as following and recieve code 404
            | id |
            | 1  |
            | 2  |
            | 3  |
        And I update focuses of company 4 as following and recieve code 200
            | id |
            | 1  |
            | 2  |
            | 3  |
        And I update focuses of company 4 as following and recieve code 400
            | id |
            | 1  |
            | 100 |
        And I update focuses of company 4 as following and recieve code 400
            | yo |
            | 1  |
            | 2  |
        And the following companies should be associated with focus 1
            | 2 | 3 | 4|
        And the following companies should be associated with focus 2
            | 3 | 4 | 5 |
        And the following companies should be associated with focus 3
            | 4 |

