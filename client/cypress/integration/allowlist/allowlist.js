/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

let users;
let companies;
function fetchLoginStatus() {
  cy.findByRole('button', { name: /fetchloginstatus/i }).click().wait('@Logged In');
}

Before(function() {
  cy.fixture('users').then(data => { users = data.users; });
  cy.fixture('companies').then(data => { companies = data.companies; });

  cy.intercept('POST', "http://localhost:3001/login", req => {
    const { user: {email: inputEmail, password: inputPassword} } = req.body;
    const matchingUser = users.find(({ email, password }) => email === inputEmail && password === inputPassword);
    if (!matchingUser) {
      req.reply({
        status: 401,
        errors: 'Invalid credentials'
      },
      {
        'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: true, email: inputEmail })}`
      });
    }
    else {
      req.reply(
      {
        status: 200,
        logged_in: true,
        user: matchingUser
      },
      {
        'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: true, email: inputEmail })}`
      });
    }
  }).as('Log In');

  cy.intercept('POST', "http://localhost:3001/logout", req => {
    req.reply(
    {
      status: 200,
      logged_out: true,
    },
    {
      'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: false, email: null })}`
    });
  }).as('Log Out');

  cy.intercept('GET')
});

Given(`I visit the companies allow list page`, () => {
  cy.visit('/profile/companies-allow-list');
  fetchLoginStatus();
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

Given(`I am logged in with the following email:`, (table) => {
 const { email } = table.hashes()[0];
  cy.intercept('GET', "http://localhost:3001/logged_in", req => {
      const matchingUser = users.find(({ email: targetEmail }) => targetEmail === email);
      if (matchingUser) {
        req.reply({
          status: 200,
          logged_in: true,
          user: matchingUser
        },
        {
          'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: true, email })}`
        });
      }
  }).as('Logged In');
});

Given(`I am logged in as an admin`, () => {
  cy.intercept('GET', "http://localhost:3001/logged_in", req => {
    const adminUser = users.find(user => user.usertype === 'admin');
      req.reply({
        status: 200,
        logged_in: true,
        user: adminUser
      },
      {
        'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: true, email: adminUser.email })}`
      });
  }).as('Logged In');
});

When(`I reload`, () => {
  cy.reload();
  fetchLoginStatus();
});

When('I click the add new company button', () => {
  cy.findByRole('button', { name: /add new company/i })
    .click();
});

And('I enter the following company name:', (table) => {
  const { name } = table.hashes()[0];
  cy.findByLabelText(/company name/i)
    .type(name); 
});

And('I click the submit button', () => {
  cy.findByRole('button', { name: /add new company/i })
    .click()
    .wait("@Create Company");
});

Then(`I should see the following company name in the list`, (table) => {
  const { name } = table.hashes()[0];
  cy.findByTestId("admin-allowlist-of-companies").should('contain', name);
});
