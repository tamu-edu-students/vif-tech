Feature: Allowlist

  Background: logged in as admin
    Given I am logged in as an admin

  Scenario Outline: adding new company through allowlist should work
    Given I visit the companies allow list page
    When I click the add new company button
    And I enter the following company name:
      | name   |
      | <name> |
    And I click the submit button
    Then I should see the following company name in the list:
      | name   |
      | <name> |

    Examples:
      | name   |
      | Disney |
