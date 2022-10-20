import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

beforeEach(function() {
  cy.fixture('example').then(data => {
    this.users = data.users;
  });
});

Given(`I visit the registration page`, function() {
  cy.intercept('POST', "http://localhost:3001/users", req => {
    const { user: newUser } = req.body;
    if (this.users.find(user => user.email === newUser.email)) {
      req.reply({
        status: 500,
        errors: 'Email already in use'
      });
    }
    else {
      req.reply({
        status: 201,
        user: newUser
      });
    }
  }).as('Sign Up');

  cy.visit('/users/new')
});

When(`I provide the following:`, (table) => {
  console.log(table.hashes());
  const { email, firstName, lastName, password, confirmPassword } = table.hashes()[0];

  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/first name/i).type(firstName);
  cy.findByLabelText(/last name/i).type(lastName);
  cy.findByLabelText(/^password$/i).type(password);
  cy.findByLabelText(/confirm password/i).type(confirmPassword);
});

And(`I click the sign up button`, () => {
  cy.findByRole('button', { name: /sign up/i }).click();
  cy.wait(`@Sign Up`)
});

Then(`the registration should be successful`, () => {
  cy.url().should('contain', '/success');
});

Then(`the registration should not be successful`, () => {
  cy.url().should('not.contain', '/success');
});
