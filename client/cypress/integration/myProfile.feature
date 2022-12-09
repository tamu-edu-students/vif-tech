Feature: My Profile

  Background: logged in as an admin
    Given I am logged in as an admin

@ignore
  Scenario Outline: updating profile data should work
    Given I visit the My Profile page
    When I edit the following details:
      | profile_img_src   |
      | <profile_img_src> | 
    And I click the save changes button
    Then the provided credentials should match the resulting user
      | profile_img_src   |
      | <profile_img_src> |

    Examples:
      
      | profile_img_src   |
      | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png |

  Scenario Outline: updating profile data should work
    Given I visit the My Profile page
    When an update users error is about to occur
    And I click the save changes button --no waiting--
    Then an error should be logged to the console

    Examples:
      
      | profile_img_src   |
      | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png |
  
