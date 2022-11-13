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
  const createAllowlistEmailWithIdClosure = ({email, company_id, usertype, isPrimaryContact}) => {
    const newAllowlistEmail = {
      id: id++,
      email,
      ...(company_id && {company_id: company_id}),
      usertype,
      isPrimaryContact: isPrimaryContact === 1 ? true : false,
    };
    return newAllowlistEmail;
  };
  return createAllowlistEmailWithIdClosure;
})();

export const createAllowlistDomain = (() => {
  let id = 1;
  const createAllowlistDomainWithIdClosure = ({email_domain, company_id, usertype}) => {
    const newAllowlistDomain = {
      id: id++,
      email_domain,
      ...(company_id && {company_id: company_id}),
      usertype,
    };
    return newAllowlistDomain;
  };
  return createAllowlistDomainWithIdClosure;
})();

export const getCompaniesAllowlistJoined = () => {
  const companies = window.store.getState().companies;
  const allowlist_emails = window.store.getState().allowlist.allowlist_emails;
  const allowlist_domains = window.store.getState().allowlist.allowlist_domains;

  companies.forEach(company => {
    company.allowlist_emails = company.allowlist_emails.filter(comp_allowlist_email => 
      allowlist_emails.some(allowlist_email =>
        allowlist_email.id === comp_allowlist_email.id
      )
    );

    company.allowlist_domains = company.allowlist_domains.filter(comp_allowlist_domain =>
      allowlist_domains.some(allowlist_domain =>
        allowlist_domain.id === comp_allowlist_domain.id
      )
    );

    allowlist_emails.forEach(allowlist_email => {
      if (
        allowlist_email.company_id === company.id
        && !company.allowlist_emails.some(comp_allowlist_email => comp_allowlist_email.id === allowlist_email.id)
      ) {
        company.allowlist_emails.push(allowlist_email);
      }
    });
    
    allowlist_domains.forEach(allowlist_domain => {
      if (
        allowlist_domain.company_id === company.id
        && !company.allowlist_domains.some(comp_allowlist_domain => comp_allowlist_domain.id === allowlist_domain.id)
      ) {
        company.allowlist_domains.push(allowlist_domain);
      }
    });
  });

  return companies;
}
