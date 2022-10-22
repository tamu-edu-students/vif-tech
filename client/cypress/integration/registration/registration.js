/// <reference types="cypress" />

import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

let registeredUser;

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
      registeredUser = { ...newUser};
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
  const { email, firstname, lastname, password, password_confirmation, usertype } = table.hashes()[0];

  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/first name/i).type(firstname);
  cy.findByLabelText(/last name/i).type(lastname);
  cy.findByLabelText(/^password$/i).type(password);
  cy.findByLabelText(/confirm password/i).type(password_confirmation);

  cy.findByLabelText(new RegExp(`${usertype}`, 'i')).check();
});

And(`I click the sign up button`, () => {
  cy.findByRole('button', { name: /sign up/i })
    .click()
    .wait(`@Sign Up`);
});

And(`the provided credentials should match the resulting user`, table => {
  const fields = table.hashes()[0];
  // compare each value in the table to each corresponding field in the user object
    Object.entries(fields).forEach(([key, value]) => expect(registeredUser[key]).to.eq(value));
});

Then(`the registration should be successful`, () => {
  cy.location('pathname').should('eq', '/users/new/success');
});

Then(`the registration should not be successful`, () => {
  cy.location('pathname').should('not.eq', '/users/new/success');
});
