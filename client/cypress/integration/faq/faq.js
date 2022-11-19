/// <reference types="cypress" />

import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import { setSession, createFAQ, getIdParam } from "../utils";

let db_faqs = [];
let users = [];

const reset = () => {
  db_faqs = [];
  users = [];
}

Before(function() {
  cy.wrap({ reset }).invoke('reset');
  cy.fixture('users').then(data => { users = data.users; });

  cy.intercept('GET', "http://localhost:3001/faq", req => {
    req.reply(
      200,
      { faqs: db_faqs }
    );
  }).as('Fetch FAQs');

  cy.intercept('POST', "http://localhost:3001/faq", req => {
    const { faq } = req.body;
    const newFaq = createFAQ(faq);
    db_faqs.push(db_faqs);

    req.reply(
      200,
      { faq: newFaq }
    );
  }).as('Create FAQ');

  cy.intercept('PUT', "http://localhost:3001/faq/*", req => {
    const { faq } = req.body;
    const id = getIdParam(req.url);
    const updatedFAQ = {
      ...faq,
      id
    }
    db_faqs[db_faqs.findIndex(faq => faq.id === id)] = updatedFAQ;

    req.reply(
      200,
      { faq: updatedFAQ }
    );
  }).as('Update FAQ');

  cy.intercept('DELETE', "http://localhost:3001/faq/*", req => {
    const id = getIdParam(req.url);
    db_faqs = db_faqs.filter(faq => faq.id !== id);

    req.reply(
      200,
      { message: `Successfully deleted FAQ with id ${id}` }
    );
  }).as('Delete FAQ');
});

Given(`I am logged in as an admin`, () => {
  const adminEmail = users.find(user => user.usertype === 'admin').email;
  setSession(true, adminEmail, users);
});

Given(`I visit the FAQ page`, () => {
  cy.visit('/faq')
  .wait('@Fetch FAQs')
});

When(`I click the create FAQ button`, () => {
  cy.findByRole('button', { name: /add faq/i })
    .click()
});

When(`I click the edit button for the new FAQ`, () => {
  cy.findByRole('button', {name: /edit/i})
    .click()
});

When(`I click the delete button for the new FAQ`, () => {
  cy.findByRole('button', {name: /delete/i})
    .click()
});

And(`I type the following question:`, (table) => {
  const { question } = table.hashes()[0];
  cy.findByRole('heading', {name: /question/i})
    .closest('.FAQ-Form__group')
    .find('.editor')
    .findByRole('textbox')
    .type(question);
});

And(`I type the following answer:`, (table) => {
  const { answer } = table.hashes()[0];
  cy.findByRole('heading', {name: /answer/i})
    .closest('.FAQ-Form__group')
    .find('.editor')
    .findByRole('textbox')
    .type(answer);
});

And(`I click the confirm button for the new FAQ`, () => {
  cy.findByRole('button', {name: /confirm/i})
    .click()
    .wait('@Create FAQ');
});

And(`I click the confirm button for editing the new FAQ`, () => {
  cy.findByRole('button', {name: /confirm/i})
    .click()
    .wait('@Update FAQ');
});

And(`I click the confirm button for deleting the new FAQ`, () => {
  cy.findByRole('button', {name: /confirm/i})
    .click()
    .wait('@Delete FAQ');
});

Then(`I should see an FAQ with the following question and answer:`, (table) => {
  const { question, answer } = table.hashes()[0];
  cy.findByText(question).should('be.visible');
  cy.findByText(answer).should('be.visible');
});

Then(`I should not see an FAQ with the following question and answer:`, (table) => {
  const { question, answer } = table.hashes()[0];
  cy.findByText(question).should('not.exist');
  cy.findByText(answer).should('not.exist');
});
