Feature: Student signup
    In order to access the website
    As a student
    I want to signup

    Scenario: Signup as student
        Given that I sign up with the following
            | username | test_student |
            | password | password |
        Then I should be in the user DB with name test_student