/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createCompany, createAllowlistEmail, createAllowlistDomain, getCompaniesAllowlistJoined } from "../utils";

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error');
  cy.spy(win.console, 'warn');
});

let users = [];
let loggedInUser = null;
let companies = [];
let allowlist_emails = [];
let allowlist_domains = [];

const reset = () => {
  users = [];
  companies = [];
  allowlist_emails = [];
  allowlist_domains = [];
  loggedInUser = null;
}

Before(function() {
  cy.wrap({ reset }).invoke('reset');
  cy.fixture('users').then(data => { users = data.users });
  cy.fixture('companies').then(data => { companies = data.companies });

  cy.intercept('GET', "http://localhost:3001/companies", req => {
    req.reply(
      200,
      { companies }
    );
  }).as('Fetch Companies');

  cy.intercept('GET', "http://localhost:3001/users", req => {
    req.reply(
      200,
      { users }
    );
  }).as('Fetch Users');

  cy.intercept('PUT', "http://localhost:3001/users/*", req => {
    console.log(req)
    console.log('user:', loggedInUser)
    Object.entries(req.body.user).forEach(([key, val]) => loggedInUser[key] = val);
    
    req.reply(
      200,
      { user: loggedInUser }
    );
  }).as('Update User');

  cy.intercept('GET', "http://localhost:3001/allowlist_emails", req => {
    req.reply(
      200,
      { allowlist_emails }
    );
  }).as('Fetch Allowlist Emails');

  cy.intercept('GET', "http://localhost:3001/allowlist_domains", req => {
    req.reply(
      200,
      { allowlist_domains }
    );
  }).as('Fetch Allowlist Domains');

  cy.intercept('GET', "http://localhost:3001/focuses", req => {
    req.reply(
      200,
      { focuses: [] }
    );
  }).as('Fetch Focuses');

  cy.intercept('GET', "http://localhost:3001/user_focuses", req => {
    req.reply(
      200,
      { focuses: [] }
    );
  }).as('Fetch User Focuses');
});

Given(`I am logged in as an admin`, () => {
  const adminEmail = users.find(user => user.usertype === 'admin').email;
  loggedInUser = users.find(user => user.usertype === 'admin');
  setSession(true, adminEmail, users);
});

Given(`I am logged in as a representative`, () => {
  const repEmail = users.find(user => user.usertype === 'company representative').email;
  loggedInUser = users.find(user => user.usertype === 'company representative');
  setSession(true, repEmail, users);
});

Given(`I visit the Student Directory page`, () => {
  cy.visit('/student-directory')
  // .wait('@Fetch Users')
  // .wait('@Fetch Companies')
  // .wait('@Fetch Allowlist Emails')
  // .wait('@Fetch Allowlist Domains')
});

And(`I click the save changes button`, () => {
  cy.findByRole('button', { name: /save changes/i })
    .click()
    .wait(`@Update User`);
});

Then(`I should see names for every student user from the fixture`, () => {
  assert(users.length > 0);
  users.forEach((user) => {
    if (user.usertype === 'student') {
      cy.findByText(new RegExp(`^${user.firstname} ${user.lastname}$`, 'i')).should('be.visible')
    }
  })
});

Then(`I should not see names for every non-student user from the fixture`, () => {
  assert(users.length > 0);
  users.forEach((user) => {
    if (user.usertype !== 'student') {
      cy.findByText(new RegExp(`^${user.firstname} ${user.lastname}$`, 'i')).should('not.exist')
    }
  })
});

Then(`the provided credentials should match the resulting user`, table => {
  const fields = table.hashes()[0];
  // compare each value in the table to each corresponding field in the user object
    Object.entries(fields).forEach(([key, value]) => expect(loggedInUser[key]).to.eq(typeof loggedInUser[key] === 'number' ? Number.parseInt(value) : value));
});
