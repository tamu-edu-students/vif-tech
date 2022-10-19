Feature: company representative sign up

Scenario: company representative signed up successfully
    Given I am on the company signup page
    When I type usertype "company representative"
    When I type username "user1"
    When I type email "user1@tamu.edu"
    When I type password "password"
    When I type password_confirmation "password"
    Then I should see my account "users" 


Scenario: company representative entered invalid usertype so not saved in database and see the error page
    Given I am on the company signup page
    When I type invalid password_confirmation "password"
    Then I should see my account "users"


Scenario: company representative entered invalid username so not saved in database and see the error page
    Given I am on the company signup page
    When I type invalid password_confirmation "password"
    Then I should see my account "users"

Scenario: company representative entered invalid email so not saved in database and see the error page


Scenario: company representative entered invalid password so not saved in database and see the error page


Scenario: company representative entered invalid pwdconfirmation so not saved in database and see the error page
    Given I am on the company signup page
    When I type invalid password_confirmation "password"
    Then I should see error page