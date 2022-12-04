Feature: Allowlist

  Background: logged in as admin
    Given I am logged in as an admin

  Scenario Outline: adding new companies to allowlist should work
    Given I visit the companies allowlist page
    When I click the add new company button
    And I enter the following company name:
      | companyName |
      | <name1>     |
    And I click the company confirm add button
    And I click the add new company button
    And I enter the following company name:
      | companyName |
      | <name2>     |
    And I click the company confirm add button
    Then I should see the following company name in the list:
      | companyName |
      | <name1>     |
    And I should see the following company name in the list:
      | companyName |
      | <name2>     |

    Examples:
      | name1  | name2      |
      | Disney | Activision |

  Scenario Outline: adding new allowlist entries should work
    Given the following companies are in the allowlist:
      | companyName1 | companyName2 |
      | <name1>      | <name2>      |
    And I visit the companies allowlist page
    When I click the add <subgroupType> button for the following company name:
      | companyName |
      | <name1>     |
    And I enter the following into the modal form:
      | input    |
      | <input1> |
    And I click the <subgroupType> confirm add button
    And I click the add <subgroupType> button for the following company name:
      | companyName |
      | <name2>     |
    And I enter the following into the modal form:
      | input    |
      | <input2> |
    And I click the <subgroupType> confirm add button
    Then I should see the correct <subgroupType> in the correct company allowlist
      | companyName | entry    |
      | <name1>     | <input1> |
    And I should see the correct <subgroupType> in the correct company allowlist
      | companyName | entry    |
      | <name2>     | <input2> |

    Examples:
      | subgroupType    | name1   | name2      | input1                 | input2                 |
      | personal email  | Disney  | Activision | validEmail@gmail.com   | anotherEmail@gmail.com |
      | primary contact | Credera | EA         | primaryEmail@gmail.com | prime2@gmail.com       |
      | domain          | Disney  | Activision | disney.com             | activision.com         |

  Scenario Outline: deleting allowlist entries should work
    Given the following companies are in the allowlist:
      | companyName1 | companyName2 |
      | <name1>      | <name2>      |
    And I visit the companies allowlist page
    When I click the add <subgroupType> button for the following company name:
      | companyName |
      | <name1>     |
    And I enter the following into the modal form:
      | input    |
      | <input1> |
    And I click the <subgroupType> confirm add button
    And I click the delete button for the following <subgroupType> entry for the following company:
      | entry    | companyName |
      | <input1> | <name1>     |
    And I click the <subgroupType> confirm delete button
    Then I should not see the <subgroupType> in the correct company allowlist
      | companyName | entry    |
      | <name1>     | <input1> |

    Examples:
      | subgroupType    | name1   | name2      | input1                 | input2                 |
      | personal email  | Disney  | Activision | validEmail@gmail.com   | anotherEmail@gmail.com |
      | primary contact | Credera | EA         | primaryEmail@gmail.com | prime2@gmail.com       |
      | domain          | Disney  | Activision | disney.com             | activision.com         |
