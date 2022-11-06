Feature: Allowlist

  Background: logged in as admin
    Given I am logged in as an admin

  Scenario Outline: adding new companies to allowlist should work
    Given I visit the companies allow list page
    When I click the add new company button
    And I enter the following company name:
      | name    |
      | <name1> |
    And I click the confirm button
    And I click the add new company button
    And I enter the following company name:
      | name    |
      | <name2> |
    And I click the confirm button
    Then I should see the following company name in the list:
      | name    |
      | <name1> |
    And I should see the following company name in the list:
    | name    |
    | <name2> |

    Examples:
      | name1  | name2      |
      | Disney | Activision |
