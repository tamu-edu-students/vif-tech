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

export const createCompany = (() => {
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

export const createAllowlistEmail = (() => {
  let id = 1;
  const createAllowlistEmailWithIdClosure = ({email, company_id, usertype, isPrimaryContact}, companies) => {
    const newAllowlistEmail = {
      id: id++,
      email,
      ...(company_id && {company_id: company_id}),
      usertype,
      isPrimaryContact: isPrimaryContact === 1 ? true : false,
    }
    const matchingCompany = companies.find(company => company.id === newAllowlistEmail.company_id);
    if (matchingCompany) { matchingCompany.allowlist_emails.push(newAllowlistEmail); }
    return newAllowlistEmail;
  };
  return createAllowlistEmailWithIdClosure;
})();

export const createAllowlistDomain = (() => {
  let id = 1;
  const createAllowlistDomainWithIdClosure = ({email_domain, company_id, usertype}, companies) => {
    const newAllowlistDomain = {
      id: id++,
      email_domain,
      ...(company_id && {company_id: company_id}),
      usertype,
    }
    const matchingCompany = companies.find(company => company.id === newAllowlistDomain.company_id);
    if (matchingCompany) { matchingCompany.allowlist_domains.push(newAllowlistDomain); }
    return newAllowlistDomain;
  };
  return createAllowlistDomainWithIdClosure;
})();
