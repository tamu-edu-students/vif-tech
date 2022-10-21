Feature: Login

  Background: starting from home page
    Given I am on the home page

  Scenario Outline: valid login credentials
    Given login session is inactive
    And login status is checked
    When I visit the login page
    And I provide the following:
      | email   | password  | 
      | <email> |<password> |
    And I click the log in button
    Then a session should start with the following email:
      | email   |
      | <email> |
    And I should no longer be on the login page
    And I should see my first name and last name in the nav bar
      | firstname   | lastname   | 
      | <firstname> | <lastname> |

    Examples:
      | email               | password | firstname | lastname |
      | usedEmail@gmail.com | abcdefg  | Oldboy    | Senior   |

  Scenario Outline: remain logged in after reloading
    Given login session is active with the following email:
      | email   |
      | <email> |
    And login status is checked
    When I reload
    Then a session should be active for the same email
      | email   |
      | <email> |
    And I should see my first name and last name in the nav bar
      | firstname   | lastname   | 
      | <firstname> | <lastname> |

    Examples:
    | email               | password | firstname | lastname |
    | usedEmail@gmail.com | abcdefg  | Oldboy    | Senior   |

  Scenario Outline: invalid login credentials
    Given login session is inactive
    And login status is checked
    When I visit the login page
    When I provide the following:
      | email   | password   |
      | <email> | <password> |
    And I click the log in button
    Then I should see an error
    And I should remain on the login page

    Examples:
    | email                 | password           |
    | unusedEmail@gmail.com | doesntmatter       |
    | usedEmail@gmail.com   | incorrectpassword  |
    | unusedEmail@gmail.com | doesntmatter       |
    | unusedEmail@gmail.com | incorrectpassword  |
    