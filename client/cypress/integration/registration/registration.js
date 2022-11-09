/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

let registeredUser;
let users;
function fetchLoginStatus() {
  cy.findByRole('button', { name: /fetchloginstatus/i }).click().wait('@Logged In');
}

Before(function() {
  cy.fixture('users').then(data => {
    users = data.users;
  });
});

Given(`I am not logged in`, () => {
  cy.intercept('GET', "http://localhost:3001/logged_in", req => {
    req.reply({
      status: 200,
      logged_in: false,
      user: null
    },
    {
      'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: false, email: null })}`
    });
  }).as('Logged In');
});

Given(`I visit the registration page`, function() {
  cy.intercept('POST', "http://localhost:3001/users", req => {
    const { user: newUser } = req.body;
    if (users.find(user => user.email === newUser.email)) {
      req.reply(
        400,
        { errors: ['Email already in use'] }
      );
    }
    else {
      registeredUser = { ...newUser};
      req.reply(
        201,
        { user: newUser }
      );
    }
  }).as('Sign Up');

  cy.visit('/users/new');
  fetchLoginStatus();
});

When(`I provide the following:`, (table) => {
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
