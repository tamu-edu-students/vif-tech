Feature: admin can CRUD a company object/account

# create
Scenario: admin can create a new company by providing its name, description
      Given name as a string and description as a text
      Then 1 company should be in company DB
Scenario: admin can create a new company by just providing its name
      Given name as a string # [other fields not provided]
      Then 1 new company with the specified name will be created in the database
Scenario: admin cannot create a new company without providing its name
      Given name not provided
      Then an error page is shown
Scenario: other user cannot create a new company to the database
Scenario: admin cannot create a company if the name is in the database already



# display all (index)
Scenario: admin can see all fields of all companies in the database
      Given admin
      Then a list of all companies in the database is displayed
Scenario: student can see some fields of all companies in the database
Scenario: company representative can see some fields of all companies in the database
Scenario: no record yet  # [empty list]



# display one (show) -- to display all details, a "details page"
Scenario: admin can see all details of a company in the database
      Given admin and a specific company id  # [subject to change]
      Then all details or fields of this specific company is displayed
Scenario: company representative from a company can see all details of this company in the database
Scenario: other user cannot see this details page of a company  # [subject to change]
Scenario: no record yet or id not found



# update
Scenario: admin can edit the details page of a company in the database
      Given id and params
      Then the company will be updated and displayed
Scenario: other user cannot edit the details page of a company in the database  # [change by email admin? suggestions]
Scenario: no record yet or id not found



# delete (destroy)
Scenario: admin can delete a company from the database
      Given id
      Then the specified company deleted will be displayed
Scenario: other user cannot delete a company from the database
Scenario: no record yet or id not found
