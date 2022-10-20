Feature: Registration

  Background: visit registration page
  Given I visit the registration page

  Scenario Outline: valid registration
    When I provide the following:
      | email   | firstName   | lastName   | password   | confirmPassword   |
      | <email> | <firstName> | <lastName> | <password> | <confirmPassword> |
    And I click the sign up button
    Then the registration should be successful

    Examples:
      | email                  | firstName | lastName | password | confirmPassword |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg         |

  Scenario Outline: invalid registration with used email
    When I provide the following:
      | email   | firstName   | lastName   | password   | confirmPassword   |
      | <email> | <firstName> | <lastName> | <password> | <confirmPassword> |
    And I click the sign up button
    Then the registration should not be successful

    Examples:
    | email                  | firstName | lastName | password | confirmPassword |
    | usedEmail@gmail.com    | Newboy    | Junior   | abcdefg  | abcdefg         |