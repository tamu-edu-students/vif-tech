Feature: Registration

  Background: visit registration page
  Given I am not logged in

  Scenario Outline: valid student registration
    Given I visit the registration page
    And I choose the student usertype
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   | class_year   | class_semester   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <class_year> | <class_semester> |
    And I click the sign up button
    Then the registration should be successful
    And the provided credentials should match the resulting user
      | email   | firstname   | lastname   | password   | password_confirmation   | class_year   | class_semester   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <class_year> | <class_semester> | <usertype> |

    Examples:
      | email                  | firstname | lastname | password | password_confirmation | class_year   | class_semester   | usertype |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | 2024         | spring           | student  |

  
  Scenario Outline: valid representative registration
    Given the following companies are in the allowlist:
      | companyName1 | companyName2 |
      | <name1>      | <name2>      |
    And I visit the registration page
    And I choose the following usertype:
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   | title   | company_id   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <title> | <company_id> |
    And I click the sign up button
    Then the registration should be successful
    And the provided credentials should match the resulting user
      | email   | firstname   | lastname   | password   | password_confirmation   | title   | company_id   | usertype   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <title> | <company_id> | <usertype> |

    Examples:
      | email                  | firstname | lastname | password | password_confirmation | title      | company_id       | usertype                |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | VP         | 1                | company representative  |

  Scenario Outline: valid volunteer registration
    Given I visit the registration page
    And I choose the following usertype:
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
      | email                  | firstname | lastname | password | password_confirmation | usertype    |
      | unusedEmail@gmail.com  | Newboy    | Junior   | abcdefg  | abcdefg               | volunteer   |

  Scenario Outline: invalid registration with server error
    Given I visit the registration page
    And I am about to submit invalid data
    When I choose the following usertype:
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   | class_year   | class_semester   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <class_year> | <class_semester> |
    And I click the sign up button
    Then the registration should not be successful

    Examples:
    | email                  | firstname | lastname | password | password_confirmation | class_year   | class_semester   | usertype |
    | usedEmail@gmail.com    | Newboy    | Junior   | abcdefg  | abcdefg               | 2024         | spring           | student  |

  Scenario Outline: invalid student registration with client error
    Given I visit the registration page
    When I choose the following usertype:
      | usertype   |
      | <usertype> |
    And I provide the following details:
      | email   | firstname   | lastname   | password   | password_confirmation   | class_year   | class_semester   |
      | <email> | <firstname> | <lastname> | <password> | <password_confirmation> | <class_year> | <class_semester> |
    And I click the sign up button --no waiting--
    Then the registration should not be successful
    And I should see an error

    Examples:
    | email                 | firstname | lastname | password | password_confirmation | class_year | class_semester | usertype |
    |                       | Newboy    | Junior   | abcdefg  | abcdefg               | 2022       | spring         | student  |
    | unusedEmail@gmail.com |           | Junior   | abcdefg  | abcdefg               | 2022       | spring         | student  |
    | unusedEmail@gmail.com | Newboy    |          | abcdefg  | abcdefg               | 2022       | spring         | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   |          | abcdefg               | 2022       | spring         | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   | abcdefg  |                       | 2022       | spring         | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   | abcdefg  | abcdefg               |            | spring         | student  |
    | unusedEmail@gmail.com | Newboy    | Junior   | abcdefg  | abcdefg               | 2022       |                | student  |
