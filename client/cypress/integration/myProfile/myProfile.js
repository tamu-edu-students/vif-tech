/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createCompany, createAllowlistEmail, createAllowlistDomain, getCompaniesAllowlistJoined } from "../utils";

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
  Cypress.on('window:before:load', (win) => {
    if ((win.console.error).restore) {
      (win.console.error).restore();
      (win.console.warn).restore();
    }
    cy.spy(win.console, 'error');
    cy.spy(win.console, 'warn');
  });
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

Given(`I visit the My Profile page`, () => {
  cy.visit('/profile/my-profile')
  // .wait('@Fetch Users')
  // .wait('@Fetch Companies')
  // .wait('@Fetch Allowlist Emails')
  // .wait('@Fetch Allowlist Domains')
});

When(`I edit the following details:`, (table) => {
  const { profile_img_src, title } = table.hashes()[0];

  profile_img_src && cy.findByLabelText(/profile picture url/i).type(profile_img_src);
  title && cy.findByLabelText(/job title/i).type(title);
});

And(`I click the save changes button`, () => {
  cy.findByRole('button', { name: /save changes/i })
    .click()
    .wait(`@Update User`);
});

And(`I click the save changes button --no waiting--`, () => {
  cy.findByRole('button', { name: /save changes/i })
    .click();
});

And(`an update users error is about to occur`, () => {
  cy.intercept('PUT', "http://localhost:3001/users/*", req => {
    req.reply(
      400,
      { errors: ['Some error occured while updating user'] }
    );
  }).as('Update User');
});

Then(`an error should be logged to the console`, () => {
  cy.window().then((win) => {
    expect(win.console.error).to.have.been.called;
  });
})

Then(`the provided credentials should match the resulting user`, table => {
  const fields = table.hashes()[0];
  // compare each value in the table to each corresponding field in the user object
    Object.entries(fields).forEach(([key, value]) => expect(loggedInUser[key]).to.eq(typeof loggedInUser[key] === 'number' ? Number.parseInt(value) : value));
});
