import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

beforeEach(function() {
  cy.fixture('example').then(data => {
    this.users = data.users;
  });
});

Given(`I visit the login page`, function() {
  cy.intercept('POST', "http://localhost:3001/login", req => {
    const { user: {email: inputEmail, password: inputPassword} } = req.body;
    const matchingUser = this.users.find(({ email, password }) => email === inputEmail && password === inputPassword);
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

  cy.visit('/login')
});

When('I provide the following:', table => {
  const { email, password } = table.hashes()[0];
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
});

And(`I click the log in button`, () => {
  cy.findByRole('button', { name: /log in/i }).click();
  cy.wait(`@Log In`)
});

And(`I should remain on the login page`, () => {
  cy.location('pathname').should('eq', '/login');
});

And(`I should see my first name and last name on the screen:`, (table) => {
  const { firstname, lastname } = table.hashes()[0];
  cy.findByText(firstname).should('be.visible');
  cy.findByText(lastname).should('be.visible');
});

Then(`I should be redirected to the home page`, () => {
  cy.location('pathname').should('eq', '/');
});

Then(`I should see an error`, () => {
  cy.get('.error').should('be.visible');
});
