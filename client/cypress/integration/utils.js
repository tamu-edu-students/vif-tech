export const setSession = (isLoggedIn, email, users) => {
 cy.intercept('GET', "http://localhost:3001/logged_in", req => {
  if (isLoggedIn) {
    const matchingUser = users.find(({ email: targetEmail }) => targetEmail === email);
    expect(matchingUser).to.not.equal(null);
    req.reply({
      status: 200,
      logged_in: true,
      user: matchingUser,
    },
    {
      'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: true, email })}`
    });
  }
  else {
    req.reply({
      status: 200,
      logged_in: false,
      user: null
    },
    {
      'Set-Cookie': `mock_logged-in=${JSON.stringify({ logged_in: false, email: null })}`
    });
  }
 }).as('Logged In');
}
