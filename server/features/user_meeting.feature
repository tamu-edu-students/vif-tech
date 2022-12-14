Feature: User-meeting interaction
    In order to connect users via meetings
    As an admin
    I want to add users to meetings
    And I want to get users' status on meetings

    Scenario: Get user meeting status (positive and negative)
        # User 2 ~ 6
        Given that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        And that an user signs up as a valid student
        # User 1, admin
        And that I log in as admin
        # Meeting 1 and 2
        And that I create a valid meeting
        And that I create a valid meeting
        And that I assign user 6 to meeting 1 with status "pending"
        And that I assign user 2 to meeting 2 with status "pending"
        And that I assign user 3 to meeting 1 with status "pending"
        And that I assign user 4 to meeting 3 with status "pending" and fail with code 404
        And that I assign user 4 to meeting 4 with status "pending" and fail with code 404
        And that I assign user 5 to meeting 2 with status "pending"
        # Meeting 3
        And that I create a valid meeting
        Then I should be able to fetch 4 user-meetings
        And user 6 should be invited to meeting 1
        And user 2 should be invited to meeting 2
        And user 3 should be invited to meeting 1
        And user 5 should be invited to meeting 2
        And user 4 should NOT be invited to meeting 3
        And user 4 should NOT be invited to meeting 4
        And user-meeting 1 should show user 6 to meeting 1 association
        And user-meeting 2 should show user 2 to meeting 2 association
        And user-meeting 3 should show user 3 to meeting 1 association
        And user-meeting 4 should show user 5 to meeting 2 association

    Scenario: Get a user's invited meetings
        # User 2
        Given that an user signs up as a valid student
        # User 1, admin
        And that I log in as admin
        # Meeting 1 ~ 5
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I assign user 2 to meeting 1 with status "pending"
        And that I assign user 2 to meeting 2 with status "pending"
        And that I assign user 2 to meeting 3 with status "accepted"
        And that I assign user 2 to meeting 4 with status "accepted"
        And that I assign user 2 to meeting 5 with status "accepted"
        Then I should be able to fetch 2 "pending" meetings for user 2
        And I should be able to fetch 3 "accepted" meetings for user 2
        And I should be able to fetch 5 invited meetings for user 2
        And I should be able to fetch 0 owned meetings for user 2

    Scenario: Set user's invites accpetance status
        # User 2
        Given that an user signs up as a valid student
        # User 1, admin
        And that I log in as admin
        # Meeting 1 ~ 5
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I create a valid meeting
        And that I assign user 2 to meeting 1 with status "pending"
        And that I assign user 2 to meeting 2 with status "accepted"
        And that I assign user 2 to meeting 3 with status "pending"
        And that I assign user 2 to meeting 4 with status "accepted"
        And that I assign user 2 to meeting 5 with status "pending"
        And that user 2 sets status as "accepted" to meeting 1 invite
        And that user 2 sets status as "accepted" to meeting 2 invite
        And that user 2 sets status as "declined" to meeting 3 invite
        And that user 2 sets status as "pending" to meeting 4 invite
        And that user 2 sets status as "cancelled" to meeting 5 invite
        Then I should be able to fetch 1 "pending" meetings for user 2
        Then I should be able to fetch 1 "cancelled" meetings for user 2
        And I should be able to fetch 2 "accepted" meetings for user 2
        And I should be able to fetch 1 "declined" meetings for user 2
        And I should be able to fetch 5 invited meetings for user 2
        And I should be able to fetch 0 owned meetings for user 2
        And user 2 should be invited to meeting 1
        And user 2 should be invited to meeting 2
        And user 2 should be invited to meeting 3
        And user 2 should be invited to meeting 4
        And user 2 should be invited to meeting 5
        And user 2 should have "accepted" invite to meeting 1
        And user 2 should have "accepted" invite to meeting 2
        And user 2 should have "declined" invite to meeting 3
        And user 2 should have "pending" invite to meeting 4
        And user 2 should have "cancelled" invite to meeting 5
        Given that user 2 deletes meeting 1 invite
        And that user 2 deletes meeting 5 invite
        Then I should be able to fetch 1 "pending" meetings for user 2
        And I should be able to fetch 1 "accepted" meetings for user 2
        And I should be able to fetch 1 "declined" meetings for user 2
        And I should be able to fetch 0 "cancelled" meetings for user 2
        And I should be able to fetch 3 invited meetings for user 2
        And I should be able to fetch 0 owned meetings for user 2
        And user 2 should NOT be invited to meeting 1
        And user 2 should NOT be invited to meeting 5
    
    Scenario: Cannot access user_meeting routes without login
        Given that an user signs up as a valid student
        And that I log out
        Then I should NOT be able to fetch user-meetings
    