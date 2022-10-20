/// <reference types="cypress" />

describe('Registration', () => {
  beforeEach(() => {
    cy.fixture('example').then(data => {
      this.users = data.users;
    });

    cy.intercept('POST', "http://localhost:3001/users", req => {
      const { user: newUser } = req.body;
      if (this.users.find(user => user.email === newUser.email)) {
        req.reply({
          status: 500,
          errors: 'Email already in use'
        });
      }
      else {
        req.reply({
          status: 200,
          user: newUser
        });
      }
    }).as('Sign Up');
  });
    
  it('should show success when registration details are valid', () => {
    cy.visit('/users/new');
    cy.findByLabelText(/email/i).type('unusedEmail@gmail.com');
    cy.findByLabelText(/first name/i).type('Newboy');
    cy.findByLabelText(/last name/i).type('Junior');
    cy.findByLabelText(/^password$/i).type('abcde');
    cy.findByLabelText(/confirm password/i).type('abcde');

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@Sign Up');
    // cy.findByText(/almost done/i).should('be.visible');
    cy.url().should('contain', '/success');
  });

  it('should not show success when email is already in use', () => {
    cy.visit('/users/new');
    cy.findByLabelText(/email/i).type('usedEmail@gmail.com');
    cy.findByLabelText(/first name/i).type('Newboy');
    cy.findByLabelText(/last name/i).type('Junior');
    cy.findByLabelText(/^password$/i).type('abcde');
    cy.findByLabelText(/confirm password/i).type('abcde');

    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait('@Sign Up');
    // cy.findByText(/almost done/i).should('not.exist');
    cy.url().should('not.contain', '/success');
  });
});
