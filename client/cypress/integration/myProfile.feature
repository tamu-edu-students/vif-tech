Feature: My Profile

  Scenario Outline: updating admin profile should work
    Given I am logged in as an admin
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

  Scenario Outline: updating representative profile should work
    Given I am logged in as a representative
    Given I visit the My Profile page
    When I edit the following details:
      | profile_img_src   | title |
      | <profile_img_src> | title |
    And I click the save changes button
    Then the provided credentials should match the resulting user
      | profile_img_src   | title |
      | <profile_img_src> | title |

    Examples:
      | profile_img_src   | title |
      | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png | Recruiter |

  Scenario Outline: failing updating user should log error
    Given I am logged in as an admin
    Given I visit the My Profile page
    When an update users error is about to occur
    And I click the save changes button --no waiting--
    Then an error should be logged to the console

    Examples:
      | profile_img_src   |
      | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png |
  
