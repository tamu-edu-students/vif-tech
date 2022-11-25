import {
  FETCH_USERS,
  CREATE_USER,

  FETCH_LOGIN_STATUS,
  LOG_IN,
  LOG_OUT,

  FETCH_COMPANIES,
  CREATE_COMPANY,

  FETCH_ALLOWLIST,
  CREATE_ALLOWLIST_EMAIL,
  CREATE_ALLOWLIST_DOMAIN,
  DELETE_ALLOWLIST_EMAIL,
  DELETE_ALLOWLIST_DOMAIN,

  FETCH_FAQS,
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,

  SHOW_MODAL,
  HIDE_MODAL,
} from './types';
import history from "History/history";
import vifTech from "Apis/vifTech";
import { Usertype } from "Shared/enums";
import Company from 'Shared/entityClasses/Company';
import User from 'Shared/entityClasses/User';
import AllowlistEmail, {IAllowlistEmail} from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain, {IAllowlistDomain} from 'Shared/entityClasses/AllowlistDomain';
import FAQ from 'Shared/entityClasses/FAQ';

export const fetchUsers = () => async (dispatch: any) => {
  const response: any = await vifTech.get("/users");
  console.log(`fetchUsers response: `, response);

  dispatch({ type: FETCH_USERS, payload: User.createNewUsers(response.data.users) });
}

export const createUser = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post("/users", { user: { ...formValues } })
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });
  console.log(`createUser response: `, response);

  dispatch({ type: CREATE_USER, payload: new User(response.data.user) });

  history.push('/users/new/success');
}

export const logIn = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post('/login', {
    user: { ...formValues }
  });

  console.log('logIn response:', response);

  // TODO: Replace with catch()
  if (response.data.status === 401) {
    throw new Error(response.data.errors);
  }

  dispatch({
    type: LOG_IN,
    payload: {
      isLoggedIn: true,
      user: new User(response.data.user)
    }
  });

  history.push('/');
}

export const logOut = () => async (dispatch: any) => {
  const response: any = await vifTech.post('/logout');
  console.log('logOut response:', response);

  // TODO: Replace with catch
  if (response.data.status === 500) {
    console.error('logOut error: ', response.data.errors);
    return;
  }

  dispatch({ type: LOG_OUT, payload: { isLoggedIn: false, user: null } });
}

export const fetchLoginStatus = () => async (dispatch: any) => {
  const response: any = await vifTech.get('/logged_in');
  // TODO: Add catch()
  console.log('fetchLoginStatus response:', response);

  const isLoggedIn: boolean = response.data.logged_in;
  const user: User | null = response.data.user ? new User(response.data.user) : null;

  dispatch({ type: FETCH_LOGIN_STATUS, payload: { isLoggedIn, user } });
}

export const fetchCompanies = () => async (dispatch: any) => {
  const response: any = await vifTech.get(`/companies`)
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });

  console.log('fetchCompanies response:', response);
  dispatch({ type: FETCH_COMPANIES, payload: Company.createCompanies(response.data.companies) });
}

export const createCompany = (formValues: any) => async (dispatch: any) => {
  const response: any = await vifTech.post(`/companies`, { company: { ...formValues } })
  .catch(({response: { data: { errors } }}) => {
    throw(new Error(errors.join('///')));
  });

  console.log('createCompany response:', response);
  dispatch({ type: CREATE_COMPANY, payload: new Company(response.data.company) });
}

export const fetchAllowlist = (usertype?: Usertype) => async (dispatch: any) => {
  const response_emails: any = await vifTech.get(`/allowlist_emails`)
  .catch(({response: { errors }}) => {
    throw(new Error(errors.join('///')))
  });
  const response_domains: any = await vifTech.get(`/allowlist_domains`)
  .catch(({response: { errors }}) => {
    throw(new Error(errors.join('///')))
  });

  console.log('fetchAllowlist (emails) response:', response_emails);
  console.log('fetchAllowlist (domains) response:', response_domains);

  const allowlist_emails: AllowlistEmail[] = AllowlistEmail.createAllowlistEmails(
    usertype ?
    response_emails.data.emails.filter((allowlist_email: IAllowlistEmail) => allowlist_email.usertype === usertype) :
    response_emails.data.emails
  );
  const allowlist_domains: AllowlistDomain[] = AllowlistDomain.createAllowlistDomains(
    usertype ?
    response_domains.data.domains.filter((allowlist_domain: IAllowlistDomain) => allowlist_domain.usertype === usertype) :
    response_domains.data.domains
  );

  dispatch({ type: FETCH_ALLOWLIST, payload: {allowlist_emails, allowlist_domains} });
}

export const createAllowlistEmail = (formValues: any) => async (dispatch: any, getState: any) => {
  const allowlist_email: AllowlistEmail = {...formValues};
  
  const response_create = await vifTech.post('/allowlist_emails', {
    email: { ...allowlist_email, isPrimaryContact: allowlist_email.isPrimaryContact ? 1 : 0 }
  });

  console.log('createAllowlistEmail response_create:', response_create);

  dispatch({ type: CREATE_ALLOWLIST_EMAIL, payload: new AllowlistEmail(response_create.data.email) });
}

export const createAllowlistDomain = (formValues: any) => async (dispatch: any, getState: any) => {
  const allowlist_domain: AllowlistDomain = {...formValues};
  
  const response_create = await vifTech.post('/allowlist_domains', {
    domain: { ...allowlist_domain }
  });

  console.log('createAllowlistDomain response_create:', response_create);

  dispatch({ type: CREATE_ALLOWLIST_DOMAIN, payload: new AllowlistDomain(response_create.data.domain) });
}

export const deleteAllowlistEmail = (id: number) => async (dispatch: any, getState: any) => {
  const response_delete = await vifTech.delete(`/allowlist_emails/${id}`);

  console.log('deleteAllowlistEmail response_delete:', response_delete);

  dispatch({ type: DELETE_ALLOWLIST_EMAIL, payload: id });
}

export const deleteAllowlistDomain = (id: number) => async (dispatch: any) => {
  const response_delete = await vifTech.delete(`/allowlist_domains/${id}`);

  console.log('deleteAllowlistDomain response_delete:', response_delete);

  dispatch({ type: DELETE_ALLOWLIST_DOMAIN, payload: id });
}

export const fetchFAQs = () => async (dispatch: any) => {
  const response_fetchFAQs = await vifTech.get('/faq');

  console.log('response_fetchFAQs:', response_fetchFAQs);

  dispatch({ type: FETCH_FAQS, payload: FAQ.createFAQs(response_fetchFAQs.data.faqs) });
}

export const createFAQ = (formValues: any) => async (dispatch: any) => {
  const response_createFAQ = await vifTech.post('/faq', { faq: {...formValues} });

  console.log('response_createFAQ:', response_createFAQ);

  dispatch({ type: CREATE_FAQ, payload: new FAQ(response_createFAQ.data.faq) });
}

export const updateFAQ = (id: number, formValues: any) => async (dispatch: any) => {
  const response_updateFAQ = await vifTech.put(`/faq/${id}`, { faq: {...formValues} });

  console.log('response_updateFAQ:', response_updateFAQ);

  dispatch({ type: UPDATE_FAQ, payload: new FAQ(response_updateFAQ.data.faq) });
}

export const deleteFAQ = (id: number) => async (dispatch: any) => {
  const response_deleteFAQ = await vifTech.delete(`/faq/${id}`);

  console.log('response_deleteFAQ:', response_deleteFAQ);

  dispatch({ type: DELETE_FAQ, payload: id });
}

export const showModal = (children: any) => {
  return { type: SHOW_MODAL, payload: children }
}

export const hideModal = () => {
  return { type: HIDE_MODAL };
}

// export const fetchCompanyAllowlists = () => async (dispatch: any, getState: any) => {
//   // FETCH COMPANIES AND THEN ALLOWLISTS
//   await fetchCompanies();
//   const response_domains: any = await vifTech.get('/allowlist_domains')
//   .catch(({response: { data: { errors } }}) => {
//     throw(new Error(errors.join('///')));
//   });
//   const response_emails: any = await vifTech.get('/allowlist_emails')
//   .catch(({response: { data: { errors } }}) => {
//     throw(new Error(errors.join('///')));
//   });
//   const companies = getState().companies;

//   const obj = {
//     companyAllowLists: {

//     },
//     studentAllowList: {

//     }
//     volunteerAllowList: {

//     }
//     adminAllowList: {

//     }
//   };

//   // response.forEach(({ usertype }) => {
//   //   switch(usertype) {
//   //     case 'company representative':
//   //       companyAllowLists
//   //   }
//   // })

//   console.log('fetchAllowList response_domains:', response_domains);
//   console.log('fetchAllowList response_emails:', response_emails);
//   // dispatch({ type: FETCH_ALLOW_LIST, payload:  })
// }
