Feature: Manage FAQs
    In order to website users with FAQ information
    As an admin
    I want to add FAQs and their answers 
    And I want to edit, update and delete contents on the FAQs page

    Scenario: Create and count FAQs
        Given that I log in as admin
        And I create a question "When is the VIF career fair?" and answer "February 2022" and id 1
        And I create a question "How many companies are visiting?" and answer "About 50 companies" and id 2
        Then the faq question "When is the VIF career fair?" with answer "February 2022" and id 1 should be found in my DB
        And the faq question "How many companies are visiting?" with answer "About 50 companies" and id 2 should be found in my DB
        And I should have 2 questions in my DB

    Scenario: Create Delete and count
        Given that I log in as admin
        And I create a question "When is the VIF career fair?" and answer "February 2022" and id 1
        And I create a question "How many companies are visiting?" and answer "About 50 companies" and id 2
        And I create a question "What majors are invited?" and answer "Only Viz majors" and id 3
        When I delete FAQ with question "When is the VIF career fair?" and answer "February 2022" and id 1
        Then the faq question "When is the VIF career fair?" with answer "February 2022" and id 1 should NOT be found in my DB
        And the faq question "How many companies are visiting?" with answer "About 50 companies" and id 2 should be found in my DB
        And the faq question "What majors are invited?" with answer "Only Viz majors" and id 3 should be found in my DB
        And I should have 2 questions in my DB

    Scenario: Edit FAQ
        Given that I log in as admin
        And I create a question "What majors are invited?" and answer "Only Viz majors" and id 1
        When I edit the same FAQ id 1 with "What majors are invited?" and "All majors are invited"
        Then I should see the FAQ question "What majors are invited?" and answer "All majors are invited" with id 1 in my DB
        And I should NOT see the answer "Only Viz majors" for FAQ with id 1 in my DB again

