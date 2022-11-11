Feature: Manage About Page
    As an admin
    I want to be able to add new contents to the About Page 
    And I want to edit, update and delete existing contents on the About page

    Scenario: Create Contents on the About Page as an Admin
        Given that I log in as admin
        And I create the following content firstname Scot and lastname Leon and rank normal on the About Page
        Then the content with firstname Scot and lastname Leon and rank normal should be found in the About DB
        And I should have 1 About content in my DB

    Scenario: Query and Delete Contents as an Admin
        Given that I log in as admin
        And I create the following content firstname "Gena" and lastname "Hayman" and description "A graduate CS major" on the About Page
        And I create the following content firstname Valerie and lastname Checks and rank vif-tech on the About Page
        And I create the following content firstname Evelyn and lastname Banks and rank faculty on the About Page
        When I delete the content firstname Evelyn and lastname Banks and rank faculty on the About Page
        Then the content with firstname Evelyn and lastname Banks and rank faculty should NOT be found in the About DB
        And the content with firstname "Gena" and lastname "Hayman" and description "A graduate CS major" should be found in the About DB
        And the content with firstname Valerie and lastname Checks and rank vif-tech should be found in the About DB
        And I should have 2 About content in my DB

    Scenario: Edit and Update About Page Contents as an Admin
        Given that I log in as admin
        And I create the following content firstname "Evelyn" and lastname "Banks" and description "I love yoga" on the About Page
        Then the content with firstname "Evelyn" and lastname "Banks" and description "I love yoga" should have a default rank "normal" since I did not specify it
        And the content with firstname "Evelyn" and lastname "Banks" and description "I love yoga" should have the following default social_links since I did not specify it
            | facebook | nil |
            | github | nil |
            | linkedin | nil |
            | portfolio | nil |
            | twitter | nil |
            | youtube | nil |
        When I change rank to "director" and imgSrc to "www.source.com" and lastname to "Walls" in the content with firstname "Evelyn" and lastname "Banks"
        Then the content with firstname Evelyn and lastname Banks and rank normal should NOT be found in the About DB
        And the content with firstname Evelyn and lastname Walls and rank director and imgSrc www.source.com should be found in the About DB
        And I should have 1 About content in my DB