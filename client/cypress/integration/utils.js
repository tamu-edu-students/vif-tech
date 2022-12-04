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
  const createCompanyWithIdClosure = (name) => {
    const newId = id++;
    // const findAllowlistEmails = () => window.store.getState().allowlist.allowlist_emails.filter(allowlist_email => allowlist_email.company_id === newId);
    // const findAllowlistDomains = () => window.store.getState().allowlist.allowlist_domains.filter(allowlist_domain => allowlist_domain.company_id === newId);
    // const findPrimaryContact = () => findAllowlistEmails().find(allowlist_email => allowlist_email.is_primary_contact === true) ?? null;
    return {
      id: newId,
      name,
      description: '',
      // findAllowlistEmails,
      // findAllowlistDomains,
      // findPrimaryContact,
  }};
  return createCompanyWithIdClosure;
})();

export const createAllowlistEmail = (() => {
  let id = 1;
  const createAllowlistEmailWithIdClosure = ({email, company_id, usertype, is_primary_contact}) => {
    const newAllowlistEmail = {
      id: id++,
      email,
      ...(company_id && {company_id: company_id}),
      usertype,
      is_primary_contact: is_primary_contact ?? false,
    };
    return newAllowlistEmail;
  };
  return createAllowlistEmailWithIdClosure;
})();

export const createAllowlistDomain = (() => {
  let id = 1;
  const createAllowlistDomainWithIdClosure = ({domain, company_id, usertype}) => {
    const newAllowlistDomain = {
      id: id++,
      domain,
      ...(company_id && {company_id: company_id}),
      usertype,
    };
    return newAllowlistDomain;
  };
  return createAllowlistDomainWithIdClosure;
})();

export const createFAQ = (() => {
  let id = 1;
  const createFAQWithIdClosure = ({question, answer}) => {
    const newFAQ = {
      id: id++,
      question,
      answer,
    };
    return newFAQ;
  };
  return createFAQWithIdClosure;
})();

export const getIdParam = (url) => Number.parseInt(url.match(/^.*\/(\d*)$/)[1]);
