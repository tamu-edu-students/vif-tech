Feature: Student Directory

  Scenario: student directory should display correct users
    Given I am logged in as a representative
    Given I visit the Student Directory page
    Then I should see names for every student user from the fixture
    And I should not see names for every non-student user from the fixture
  