Feature: FAQ

  Background: logged in as admin
    Given I am logged in as an admin
    And I visit the FAQ page

  Scenario Outline: creating FAQs works
    When I click the create FAQ button
    And I type the following question:
      | question    |
      | <question1> |
    And I type the following answer:
      | answer    |
      | <answer1> |
    And I click the confirm button for the new FAQ

    And I click the create FAQ button
    And I type the following question:
      | question    |
      | <question2> |
    And I type the following answer:
      | answer    |
      | <answer2> |
    And I click the confirm button for the new FAQ

    Then I should see an FAQ with the following question and answer:
      | question    | answer    |
      | <question1> | <answer1> |
    And I should see an FAQ with the following question and answer:
      | question   | answer   |
      | <question2> | <answer2> |

    Examples:
      | question1        | answer1 | question2     | answer2         |
      | What time is it? | 12:00!  | Where are we? | Somewhere cool! |


  Scenario Outline: editing FAQs works
    When I click the create FAQ button
    And I type the following question:
      | question    |
      | <question1> |
    And I type the following answer:
      | answer    |
      | <answer1> |
    And I click the confirm button for the new FAQ

    And I click the edit button for the new FAQ
    And I type the following question:
      | question    |
      | <question2> |
    And I type the following answer:
      | answer    |
      | <answer2> |
    And I click the confirm button for editing the new FAQ

    Then I should see an FAQ with the following question and answer:
      | question    | answer    |
      | <question2> | <answer2> |

    Examples:
      | question1        | answer1 | question2        | answer2         |
      | What time is it? | 12:00!  | Did you edit me? | YES!!!          |

  Scenario Outline: deleting FAQs works
  When I click the create FAQ button
  And I type the following question:
    | question    |
    | <question1> |
  And I type the following answer:
    | answer    |
    | <answer1> |
  And I click the confirm button for the new FAQ

  And I click the delete button for the new FAQ
  And I click the confirm button for deleting the new FAQ

  Then I should not see an FAQ with the following question and answer:
    | question    | answer    |
    | <question2> | <answer2> |

  Examples:
    | question1        | answer1 | question2        | answer2         |
    | What time is it? | 12:00!  | Did you edit me? | YES!!!          |
    