/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createCompany } from "../utils";

let registeredUser;
let users;
let companies = [];

const reset = () => {
  companies = [];
}

Before(function() {
  cy.wrap({ reset }).invoke('reset');
  cy.fixture('users').then(data => {
    users = data.users;
  });

  cy.intercept('GET', "http://localhost:3001/companies", req => {
    req.reply(
      200,
      { companies }
    );
  }).as('Fetch Companies');

  cy.intercept('POST', "http://localhost:3001/users", req => {
    const { user: newUser } = req.body;
    if (users.find(user => user.email === newUser.email)) {
      req.reply(
        400,
        { errors: ['Email already in use'] }
      );
    }
    else {
      registeredUser = { ...newUser };
      req.reply(
        201,
        { user: newUser }
      );
    }
  }).as('Sign Up');
});

Given(`I am not logged in`, () => {
  setSession(false);
});

Given(`the following companies are in the allowlist:`, (table) => {
  const companyNames = Object.values(table.hashes()[0]);
  
  companyNames.forEach(companyName => {
    companies.push(createCompany(companyName))
  });
});

Given(`I visit the registration page`, function() {
  cy.visit('/users/new');
});

Given(`I choose the {word} usertype`, (usertype) => {
  cy.findByLabelText(new RegExp(`${usertype}`, 'i')).check();
});

Given(`I am about to submit invalid data`, () => {
  cy.intercept('POST', "http://localhost:3001/users", req => {
    req.reply(
      400,
      { errors: ['Some error occured while registering'] }
    );
  }).as('Sign Up');
});

When(`I provide the following details:`, (table) => {
  const { email, firstname, lastname, password, password_confirmation, class_year, class_semester, title, company_id} = table.hashes()[0];

  email && cy.findByLabelText(/email/i).type(email);
  firstname && cy.findByLabelText(/first name/i).type(firstname);
  lastname && cy.findByLabelText(/last name/i).type(lastname);
  password && cy.findByLabelText(/^password$/i).type(password);
  password_confirmation && cy.findByLabelText(/confirm password/i).type(password_confirmation);
  
  class_year && cy.findByLabelText(/expected graduation year/i).select(class_year);
  class_semester && cy.findByLabelText(/expected graduation term/i).select(class_semester);

  title && cy.findByLabelText(/job title/i).type(title);
  company_id && cy.findByLabelText(/^company$/i).select(company_id);
});

When(`I choose the following usertype:`, (table) => {
  const { usertype } = table.hashes()[0];
  cy.findByLabelText(new RegExp(`${usertype}`, 'i')).check();
});

And(`I click the sign up button`, () => {
  cy.findByRole('button', { name: /sign up/i })
    .click()
    .wait(`@Sign Up`);
});

And(`I click the sign up button --no waiting--`, () => {
  cy.findByRole('button', { name: /sign up/i })
    .click();
});

And(`the provided credentials should match the resulting user`, table => {
  const fields = table.hashes()[0];
  // compare each value in the table to each corresponding field in the user object
    Object.entries(fields).forEach(([key, value]) => expect(registeredUser[key]).to.eq(typeof registeredUser[key] === 'number' ? Number.parseInt(value) : value));
});

Then(`I should see an error`, () => {
  cy.get('.error').should('be.visible');
});

Then(`the registration should be successful`, () => {
  cy.location('pathname').should('eq', '/users/new/success');
});

Then(`the registration should not be successful`, () => {
  cy.location('pathname').should('not.eq', '/users/new/success');
});
