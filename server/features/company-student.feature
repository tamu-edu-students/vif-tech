Feature: student can ... a company account
    In order to 
    As a student
    I want to 

Background: 
    Given that I sign up and log in as a valid student
    And a company with name 'disney3' and description 'a company' already exists in the database
    And a company domain '' is allowed for the company with name '' and description ''
    And a company email '' is allowed for the company with name '' and description ''
    And a company email '' is allowed for the company with name '' and description ''
    

# i should see ... (name, description, ...)
Scenario: student can see all fields of a company account except allowlist domain and emails
    When I go to the profile page for the company with name '' and description ''
    Then I should not see the company domain ''
    And I should not see the company email ''
    And I should not see the company email ''