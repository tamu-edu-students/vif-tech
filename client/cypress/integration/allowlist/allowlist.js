/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, fetchLoginStatus } from "../utils";

let users = [];
let companies = [];
let allowlist_emails = [];
let allowlist_domains = [];

const createCompany = (() => {
  let id = 1;
  const createCompanyWithIdClosure = (name) => ({
    id: id++,
    name,
    description: null,
    allowlist_emails: [],
    allowlist_domains: [],
  });
  return createCompanyWithIdClosure;
})();

Before(function() {
  cy.fixture('users').then(data => { users = data.users; });
  users = [];
  let companies = [];
  let allowlist_emails = [];
  let allowlist_domains = [];

  cy.intercept('GET', "http://localhost:3001/companies", req => {
    req.reply(200, {
      companies: []
    });
  }).as('Fetch Companies');

  cy.intercept('POST', "http://localhost:3001/companies", req => {
    const { company: { name } } = req.body;
    if (companies.some(company => company.name === name)) {
      req.reply(
        400,
        { errors: ['Company name already in use'] }
      )
    }
    const newCompany = createCompany(name);
    companies.push(newCompany)
    req.reply(
      200,
      { company: newCompany }
    );
  }).as('Create Company');
});

Given(`I visit the companies allow list page`, () => {
  cy.visit('/profile/company-allowlists');
  cy.wait('@Fetch Companies')
});

Given(`I am not logged in`, () => {
  setSession(false);
});

Given(`I am logged in with the following email:`, (table) => {
 const { email } = table.hashes()[0];
  setSession(true, email, users);
});

Given(`I am logged in as an admin`, () => {
  const adminEmail = users.find(user => user.usertype === 'admin').email;
  setSession(true, adminEmail, users);
});

When(`I reload`, () => {
  cy.reload();
});

When('I click the add new company button', () => {
  cy.findByRole('button', { name: /add new company/i })
    .click()
});

And('I enter the following company name:', (table) => {
  const { name } = table.hashes()[0];
  cy.findByLabelText(/company name/i)
    .type(name); 
});

And('I click the confirm button', () => {
  cy.findByRole('button', { name: /confirm/i })
    .click()
    .wait("@Create Company");
});

Then(`I should see the following company name in the list:`, (table) => {
  const { name } = table.hashes()[0];
  cy.findByTestId("admin-company-allowlists").should('contain', name);
});
