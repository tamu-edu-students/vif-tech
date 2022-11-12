/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createCompany, createAllowlistEmail, createAllowlistDomain } from "../utils";

let users = [];
let companies = [];
let allowlist_emails = [];
let allowlist_domains = [];

const getSubgroupOptions = (subgroup => {
  let subgroupHeading;
  let alias;

  if (subgroup === 'primary contact') {
    subgroupHeading ='Primary Contacts';
    alias = '@Create Allowlist Email';
  }
  if (subgroup === 'personal email') {
    subgroupHeading = 'Personal Emails';
    alias = '@Create Allowlist Email';
  }
  if (subgroup === 'domain') {
    subgroupHeading = 'Domains';
    alias = '@Create Allowlist Domain';
  }

  return {
    subgroupHeading,
    alias,
  }
});

Before(function() {
  cy.fixture('users').then(data => { users = data.users; });
  users = [];
  companies = [];
  allowlist_emails = [];
  allowlist_domains = [];

  cy.intercept('GET', "http://localhost:3001/companies", req => {
    req.reply(
      200,
      { companies }
    );
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

  cy.intercept('POST', "http://localhost:3001/allowlist_emails", req => {
    const { email } = req.body;
    const newAllowlistEmail = createAllowlistEmail(email, companies);
    req.reply(
      200,
      { email: newAllowlistEmail }
    );
  }).as('Create Allowlist Email');

  cy.intercept('POST', "http://localhost:3001/allowlist_domains", req => {
    const { domain } = req.body;
    const newAllowlistDomain = createAllowlistDomain(domain, companies);
    req.reply(
      200,
      { domain: newAllowlistDomain }
    );
  }).as('Create Allowlist Domain');
});

Given(`I visit the companies allowlist page`, () => {
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

Given(`the following companies are in the allowlist:`, (table) => {
  const companyNames = Object.values(table.hashes()[0]);
  companyNames.forEach(companyName => {
    const company = createCompany(companyName);
    companies.push(company);
  });
  
  companies.forEach(company => {
    cy.window().then(win => {
      win.store.dispatch({ type: 'CREATE_COMPANY', payload: company });
    });
  });
});

When(`I reload`, () => {
  cy.reload();
});

When('I click the add new company button', () => {
  cy.findByRole('button', { name: /add new company/i })
    .click()
});

When(/I click the add (.*) button for the following company name:/, (subgroup, table) => {
  const {companyName} = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroup).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByRole('button', { name: /add/i })
    .click();
});

And('I enter the following company name:', (table) => {
  const { companyName } = table.hashes()[0];
  cy.findByLabelText(/company name/i)
    .type(companyName); 
});

And('I click the company confirm add button', () => {
  cy.findByRole('button', { name: /confirm/i })
    .click()
    .wait("@Create Company");
});

And(/I click the (.*) confirm add button/, (subgroup) => {
  cy.findByRole('button', { name: /confirm/i })
    .click()
    .wait(getSubgroupOptions(subgroup).alias);
});

And(`I enter the following into the modal form:`, (table) => {
  const { input } = table.hashes()[0];
  cy.findByRole('textbox')
    .type(input);
});

Then(`I should see the following company name in the list:`, (table) => {
  const { companyName } = table.hashes()[0];
  cy.findByTestId("admin-company-allowlists").should('contain', companyName);
});

Then(/I should see the correct (.*) in the correct company allowlist/, (subgroup, table) => {
  const { companyName, input } = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroup).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByRole('list')
    .should('contain', input);
});
