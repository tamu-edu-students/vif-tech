/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

let users;

Before(function() {
  cy.fixture('example').then(data => {
    users = data.users;
  });

  cy.intercept('POST', "http://localhost:3001/login", req => {
    const { user: {email: inputEmail, password: inputPassword} } = req.body;
    const matchingUser = users.find(({ email, password }) => email === inputEmail && password === inputPassword);
    if (!matchingUser) {
      req.reply({
        status: 401,
        errors: 'Invalid credentials'
      });
    }
    else {
      req.reply({
        status: 200,
        logged_in: true,
        user: matchingUser
      });
    }
  }).as('Log In');

  cy.intercept('POST', "http://localhost:3001/logout", req => {
    req.reply({
      status: 200,
      logged_out: true,
    });
  }).as('Log Out');
});

Given(`I am on the home page`, () => {
  cy.visit('/');
});

Given(`login session is inactive`, () => {
  cy.setCookie('mock_logged-in', JSON.stringify({ logged_in: false, email: null }));
});

Given(`login session is active with the following email:`, (table) => {
  cy.setCookie('mock_logged-in', JSON.stringify({ logged_in: true, email: table.hashes()[0].email }));
});

When(`I visit the login page`, function() {
  cy.visit('/login');
});

When(`I reload`, () => {
  cy.reload();
});

When(`I click the log in page button`, () => {
  cy.get('[data-testid="log-in-page-button"]').click();
});

When(`I click the log out button`, () => {
  cy.get('[data-testid="log-out-button"]').click();
  cy.setCookie('mock_logged-in', JSON.stringify({ logged_in: false, email: null }));
});

And(`login status is checked`, () => {
  cy.getCookie('mock_logged-in')
  .then((cookie) => {
    const { logged_in, email } = JSON.parse(cookie.value);

    cy.intercept('GET', "http://localhost:3001/logged_in", req => {
      let matchingUser = null;
      if (logged_in) {
        matchingUser = users.find(({ email: targetEmail }) => targetEmail === email);
      }
      req.reply({
        status: 200,
        logged_in,
        user: matchingUser
      });
    }).as('Logged In');
    cy.findByRole('button', { name: /fetchloginstatus/i }).click().wait('@Logged In');
  });
});

And('I provide the following:', table => {
  const { email, password } = table.hashes()[0];
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
});

And(`I click the log in form button`, () => {
  cy.get('[data-testid="log-in-form-button"]').click().wait('@Log In');
});

And(`I should no longer be on the login page`, () => {
  cy.location('pathname').should('not.eq', '/login');
});

And(`I should see my first name and last name in the nav bar`, (table) => {
  const { firstname, lastname } = table.hashes()[0];
  cy.findByRole('navigation')
    .findByText(firstname).should('be.visible');
  cy.findByRole('navigation')
    .findByText(lastname).should('be.visible');
});

And(`I should remain on the login page`, () => {
  cy.location('pathname').should('eq', '/login');
});

And(`the log out button should not be visible`, () => {
  cy.get('[data-testid="log-out-button"]').should('not.exist');
});

And(`the log in button should not be visible`, () => {
  cy.get('[data-testid="log-in-button"]').should('not.exist');
});

Then(`the sign up page button should not be visible`, () => {
  cy.get('[data-testid="sign-up-page-button"]').should('not.exist');
});


Then(`I should not see my first name and last name in the nav bar`, (table) => {
  const { firstname, lastname } = table.hashes()[0];
  cy.findByRole('navigation')
    .findByText(firstname).should('not.exist');
  cy.findByRole('navigation')
    .findByText(lastname).should('not.exist');
});

Then(`a session should start with the following email:`, (table) => {
  const { email } = table.hashes()[0];
  cy.setCookie('mock_logged-in', JSON.stringify({ logged_in: true, email }));
});

Then(`a session should be active for the same email`, (table) => {
  const { email } = table.hashes()[0];
  cy.getCookie('mock_logged-in').should('have.property', 'value', JSON.stringify({
    logged_in: true,
    email
  }));

  cy.findByRole('button', { name: /fetchloginstatus/i }).click().wait('@Logged In');
});

Then(`I should see an error`, () => {
  cy.get('.error').should('be.visible');
});

Then(`I should be redirected to the login page`, () => {
  cy.location('pathname').should('eq', '/login');
});

Then(`I should be redirected to the home page`, () => {
  cy.location('pathname').should('eq', '/');
});

Then(`the log in page button should be visible`, () => {
  cy.get('[data-testid="log-in-page-button"]').should('be.visible');
});

Then(`the log out button should be visible`, () => {
  cy.get('[data-testid="log-out-button"]').should('be.visible');
});

Then(`the sign up page button should be visible`, () => {
  cy.get('[data-testid="sign-up-page-button"]').should('be.visible');
});
