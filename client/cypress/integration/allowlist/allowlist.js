/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createCompany, createAllowlistEmail, createAllowlistDomain, getCompaniesAllowlistJoined } from "../utils";

let users = [];
let companies = [];
let allowlist_emails = [];
let allowlist_domains = [];

const reset = () => {
  users = [];
  companies = [];
  allowlist_emails = [];
  allowlist_domains = [];
}

const getSubgroupOptions = (subgroupType => {
  let subgroupHeading;
  let aliasCreate;
  let aliasDelete;

  if (subgroupType === 'primary contact') {
    subgroupHeading ='Primary Contact';
    aliasCreate = '@Create Allowlist Email';
    aliasDelete = '@Delete Allowlist Email';
  }
  if (subgroupType === 'personal email') {
    subgroupHeading = 'Personal Emails';
    aliasCreate = '@Create Allowlist Email';
    aliasDelete = '@Delete Allowlist Email';
  }
  if (subgroupType === 'domain') {
    subgroupHeading = 'Domains';
    aliasCreate = '@Create Allowlist Domain';
    aliasDelete = '@Delete Allowlist Domain';
  }

  return {
    subgroupHeading,
    aliasCreate,
    aliasDelete,
  }
});

Before(function() {
  cy.wrap({ reset }).invoke('reset');
  cy.fixture('users').then(data => { users = data.users; });

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
    companies.push(newCompany);
    req.reply(
      200,
      { company: newCompany }
    );
  }).as('Create Company');

  cy.intercept('GET', "http://localhost:3001/users", req => {
    req.reply(
      200,
      { users }
    );
  }).as('Fetch Users');

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

  cy.intercept('POST', "http://localhost:3001/allowlist_emails", req => {
    const { allowlist_email } = req.body;
    const newAllowlistEmail = createAllowlistEmail(allowlist_email);
    req.reply(
      200,
      { allowlist_email: newAllowlistEmail }
    );
  }).as('Create Allowlist Email');

  cy.intercept('POST', "http://localhost:3001/allowlist_domains", req => {
    const { allowlist_domain } = req.body;
    const newAllowlistDomain = createAllowlistDomain(allowlist_domain);
    req.reply(
      200,
      { allowlist_domain: newAllowlistDomain }
    );
  }).as('Create Allowlist Domain');

  cy.intercept('DELETE', "http://localhost:3001/allowlist_emails/*", req => {
    const { id } = req.body;
    req.reply(
      200,
      { message: `Successfully deleted allowlist email with id ${id}` }
    );
  }).as('Delete Allowlist Email');

  cy.intercept('DELETE', "http://localhost:3001/allowlist_domains/*", req => {
    const { id } = req.body;
    req.reply(
      200,
      { message: `Successfully deleted allowlist domain with id ${id}` }
    );
  }).as('Delete Allowlist Domain');
});

Given(`I visit the companies allowlist page`, () => {
  cy.visit('/profile/company-allowlists')
  // .wait('@Fetch Users')
  // .wait('@Fetch Companies')
  // .wait('@Fetch Allowlist Emails')
  // .wait('@Fetch Allowlist Domains')
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
    companies.push(createCompany(companyName))
  });
});

When(`I reload`, () => {
  cy.reload();
});

When('I click the add new company button', () => {
  cy.findByRole('button', { name: /add new company/i })
    .click()
});

When(/I click the add (.*) button for the following company name:/, (subgroupType, table) => {
  const {companyName} = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroupType).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByRole('button', { name: /add/i })
    .click();
});

When(/I click the delete button for the following (.*) entry for the following company:/, (subgroupType, table) => {
  const { entry, companyName } = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroupType).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByText(new RegExp(`(@)?${entry}`))
    .closest('.allowlist__entry')
    .findByRole('button', { name: /delete/i })
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
    .wait("@Create Company")
});

And(/I click the (.*) confirm add button/, (subgroupType) => {
  cy.findByRole('button', { name: /confirm/i })
    .click()
    .wait([getSubgroupOptions(subgroupType).aliasCreate]);
});

And(/I click the (.*) confirm delete button/, (subgroupType) => {
  cy.findByRole('button', { name: /confirm/i })
    .click()
    .wait([getSubgroupOptions(subgroupType).aliasDelete]);
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

Then(/I should see the correct (.*) in the correct company allowlist/, (subgroupType, table) => {
  const { companyName, entry } = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroupType).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByRole('list')
    .should('contain', entry);
});

Then(/I should not see the (.*) in the correct company allowlist/, (subgroupType, table) => {
  const { companyName, entry } = table.hashes()[0];
  cy.findByText(new RegExp(`title: ${companyName}`, 'i'))
    .closest('.allowlist')
    .findByText(getSubgroupOptions(subgroupType).subgroupHeading)
    .closest('.allowlist__subgroup')
    .findByRole('list')
    .should('not.contain', entry);
})
