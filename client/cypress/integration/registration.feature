Feature: Registration

  Background: visit registration page
  Given I am not logged in
  And I visit the registration page

  Scenario Outline: valid registration
    When I provide the following:
      | email   | firstname   | lastname   | password   | password_confirmation   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <usertype> |
    And I click the sign up button
    Then the registration should be successful
    And the provided credentials should match the resulting user
      | email   | firstname   | lastname   | password   | password_confirmation   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <usertype> |

    Examples:
      | email                  | firstname | lastname | password | password_confirmation | usertype |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | student  |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | volunteer  |

  Scenario Outline: invalid registration with used email
    When I provide the following:
      | email   | firstname   | lastname   | password   | password_confirmation   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <usertype> |
    And I click the sign up button
    Then the registration should not be successful

    Examples:
    | email                  | firstname | lastname | password | password_confirmation | usertype |
    | usedEmail@gmail.com    | Newboy    | Junior   | abcdefg  | abcdefg               | student  |

  Scenario Outline: 