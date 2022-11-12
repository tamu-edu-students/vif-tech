Feature: Registration

  Background: visit registration page
  Given I am not logged in
  And I visit the registration page

  Scenario Outline: valid student registration
    Given I choose the student usertype
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> |
    And I click the sign up button
    Then the registration should be successful
    And the provided credentials should match the resulting user
      | email   | firstname   | lastname   | password   | password_confirmation   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <usertype> |

    Examples:
      | email                  | firstname | lastname | password | password_confirmation | usertype |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | student  |

  Scenario Outline: invalid registration with server error
    Given I am about to submit invalid data
    When I choose the following usertype:
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> |
    And I click the sign up button
    Then the registration should not be successful

    Examples:
    | email                  | firstname | lastname | password | password_confirmation | usertype |
    | usedEmail@gmail.com    | Newboy    | Junior   | abcdefg  | abcdefg               | student  |

  Scenario Outline: invalid student registration with client error
    When I choose the following usertype:
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> |
    And I click the sign up button --no waiting--
    Then the registration should not be successful
    And I should see an error

    Examples:
    | email                 | firstname | lastname | password | password_confirmation | usertype |
    |                       | Newboy    | Junior   | abcdefg  | abcdefg               | student  |
    | unusedEmail@gmail.com |           | Junior   | abcdefg  | abcdefg               | student  |
    | unusedEmail@gmail.com | Newboy    |          | abcdefg  | abcdefg               | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   |          | abcdefg               | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   | abcdefg  |                       | student  |
