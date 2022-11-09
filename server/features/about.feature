Feature: Manage About Page
    As an admin
    I want to be able to add new contents to the About Page 
    And I want to edit, update and delete existing contents on the About page

    Scenario: Create and count FAQs
        Given that I log in as admin
        And I create the following content firstname "Scot" and lastname "Leon" on the About Page
        Then the content with firstname "Scot" and lastname "Leon" should be found in my DB
        And I should have 1 content in my DB

    # Scenario: Create Delete and count
    #     Given that I log in as admin
    #     And I create a question "When is the VIF career fair?" and answer "February 2022" and id 1
    #     And I create a question "How many companies are visiting?" and answer "About 50 companies" and id 2
    #     And I create a question "What majors are invited?" and answer "Only Viz majors" and id 3
    #     When I delete FAQ with question "When is the VIF career fair?" and answer "February 2022" and id 1
    #     Then the faq question "When is the VIF career fair?" with answer "February 2022" and id 1 should NOT be found in my DB
    #     And the faq question "How many companies are visiting?" with answer "About 50 companies" and id 2 should be found in my DB
    #     And the faq question "What majors are invited?" with answer "Only Viz majors" and id 3 should be found in my DB
    #     And I should have 2 questions in my DB

    # Scenario: Edit FAQ
    #     Given that I log in as admin
    #     And I create a question "What majors are invited?" and answer "Only Viz majors" and id 1
    #     When I edit the same FAQ id 1 with "What majors are invited?" and "All majors are invited"
    #     Then I should see the FAQ question "What majors are invited?" and answer "All majors are invited" with id 1 in my DB
    #     And I should NOT see the answer "Only Viz majors" for FAQ with id 1 in my DB again
