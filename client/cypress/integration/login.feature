Feature: Login

  Background: visit login page
  Given I visit the login page

  Scenario Outline: valid login credentials
    When I provide the following:
      | email   | password  | 
      | <email> |<password> |
    And I click the log in button
    Then I should be redirected to the home page
    And I should see my first name and last name on the screen

    Examples:
      | email               | password |
      | usedEmail@gmail.com | abcdefg  |

  Scenario Outline: invalid login credentials
    When I provide the following:
      | email   | password   |
      | <email> | <password> |
    And I click the sign up button
    Then I should see an error
    And I should remain on the login page

    Examples:
    | email                 | password           |
    | unusedEmail@gmail.com | doesntmatter       |
    | usedEmail@gmail.com   | incorrectpassword  |