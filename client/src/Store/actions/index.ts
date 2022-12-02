import {
  userActionTypes,
  authActionTypes,
  companyActionTypes,
  allowlistActionTypes,

  FETCH_FAQS,
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,

  SHOW_MODAL,
  HIDE_MODAL,
} from './types';
import history from "History/history";
import vifTech from "Apis/vifTech";
// import { Usertype } from "Shared/enums";
import Company from 'Shared/entityClasses/Company';
import User from 'Shared/entityClasses/User';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain  from 'Shared/entityClasses/AllowlistDomain';
import FAQ from 'Shared/entityClasses/FAQ';

/********************************************************************************************* */
/**************************************************************************         USERS */
/********************************************************************************************* */
export const fetchUsers = () => async (dispatch: any) => {
  dispatch({ type: userActionTypes.FETCH_USERS__REQUEST });
  await vifTech.get("/users")
    .then((response) => {
      console.log(`fetchUsers response: `, response);
      dispatch({ type: userActionTypes.FETCH_USERS__SUCCESS, payload: User.createNewUsers(response.data.users) });
      dispatch({ type: userActionTypes.SET_USERS_STALENESS, payload: false });
    })
    .catch((response) => {
      console.log(`fetchUsers response: `, response);
      dispatch({ type: userActionTypes.FETCH_USERS__FAILURE, payload: { error: 'ERROR: Failed to fetch users' } });
    });
}

export const createUser = (formValues: any) => async (dispatch: any) => {
  dispatch({ type: userActionTypes.CREATE_USER__REQUEST });
  await vifTech.post("/users", { user: { ...formValues } })
  .then((response) => {
    console.log(`createUser response: `, response);
    dispatch({ type: userActionTypes.CREATE_USER__SUCCESS, payload: new User(response.data.user) });
    history.push('/users/new/success');
  })
  .catch((response) => {
    console.log(`createUser response: `, response);
    dispatch({ type: userActionTypes.CREATE_USER__FAILURE, payload: {error: `ERROR: Failed to register new user ${formValues.firstname} ${formValues.lastname}`} });
  });
}



/********************************************************************************************* */
/**************************************************************************         AUTH */
/********************************************************************************************* */
export const logIn = (formValues: any) => async (dispatch: any) => {
  dispatch({ type: authActionTypes.LOG_IN__REQUEST });
  await vifTech.post('/login', { user: {...formValues} })
  .then((response) => {
    console.log('logIn response:', response);
    dispatch({ type: authActionTypes.LOG_IN__SUCCESS, payload: {isLoggedIn: true, user: new User(response.data.user)} });
    //TODO: don't?
    dispatch({ type: allowlistActionTypes.SET_ALLOWLIST_STALENESS, payload: true });
    history.push('/');
  })
  .catch((response) => {
    console.log('logIn response:', response);
    dispatch({ type: authActionTypes.LOG_IN__FAILURE, payload: {error: `ERROR: Failed to log in ${formValues.email}`} });
  });
}

export const logOut = () => async (dispatch: any, getState: any) => {
  dispatch({ type: authActionTypes.LOG_OUT__REQUEST });
  await vifTech.post('/logout')
  .then((response) => {
    console.log('logOut response:', response);
    dispatch({ type: authActionTypes.LOG_OUT__SUCCESS, payload: { isLoggedIn: false, user: null } })
  })
  .catch((response) => {
    console.log('logOut response:', response);
    dispatch({ type: authActionTypes.LOG_OUT__FAILURE, payload: {error: `ERROR: Failed to log out ${getState().auth.user.email}`} });
  });
}

export const fetchLoginStatus = () => async (dispatch: any) => {
  dispatch({ type: authActionTypes.FETCH_LOGIN_STATUS__REQUEST });
  await vifTech.get('/logged_in')
  .then((response) => {
    console.log('fetchLoginStatus response:', response);
    const isLoggedIn: boolean = response.data.logged_in;
    const user: User | null = response.data.user ? new User(response.data.user) : null;
    dispatch({ type: authActionTypes.FETCH_LOGIN_STATUS__SUCCESS, payload: { isLoggedIn, user } })
  })
  .catch((response) => {
    console.log('fetchLoginStatus response:', response);
    dispatch({ type: authActionTypes.FETCH_LOGIN_STATUS__FAILURE, payload: {error: `ERROR: Failed to fetch login status`} });
  });
  dispatch({ type: authActionTypes.SET_AUTH_STALENESS, payload: false });
}



/********************************************************************************************* */
/**************************************************************************         COMPANIES */
/********************************************************************************************* */
export const fetchCompanies = () => async (dispatch: any) => {
  dispatch({ type: companyActionTypes.FETCH_COMPANIES__REQUEST });
  await vifTech.get(`/companies`)
  .then((response) => {
    console.log('fetchCompanies response:', response);
    dispatch({ type: companyActionTypes.FETCH_COMPANIES__SUCCESS, payload: Company.createCompanies(response.data.companies) })
    dispatch({ type: companyActionTypes.SET_COMPANIES_STALENESS, payload: false })
  })
  .catch((response) => {
    console.log('fetchCompanies response:', response);
    dispatch({ type: companyActionTypes.FETCH_COMPANIES__FAILURE, payload: {error: `ERROR: Failed to fetch companies data`} });
  });
}

export const createCompany = (formValues: any) => async (dispatch: any) => {
  dispatch({ type: companyActionTypes.CREATE_COMPANY__REQUEST });
  await vifTech.post(`/companies`, { company: { ...formValues } })
  .then((response) => {
    console.log('createCompany response:', response);
    dispatch({ type: companyActionTypes.CREATE_COMPANY__SUCCESS, payload: new Company(response.data.company) });
  })
  .catch((response) => {
    console.log('createCompany response:', response);
    dispatch({ type: companyActionTypes.CREATE_COMPANY__FAILURE, payload: {error: `ERROR: Failed to fetch companies data`} });
  });
}


/********************************************************************************************* */
/**************************************************************************         ALLOWLIST */
/********************************************************************************************* */
export const fetchAllowlist = () => async (dispatch: any) => {
  //TODO: Clean
  dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__REQUEST });
  let success: boolean = true;
  let error403 = false;
  const response_emails: any = await vifTech.get(`/allowlist_emails`)
  .catch((response) => {
    success = false;
    console.error(response);
    if (response.response?.status !== 403) {
      dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__FAILURE, payload: {error: 'ERROR: Failed to fetch allowlist data'} });
    }
    else {
      error403 = true;
    }
  });
  if (!success && error403) {
    dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__SUCCESS, payload: {allowlist_emails: [], allowlist_domains: []} });
    dispatch({ type: allowlistActionTypes.SET_ALLOWLIST_STALENESS, payload: false });
    return;
  }
  const response_domains: any = await vifTech.get(`/allowlist_domains`)
  .catch((response) => {
    success = false;
    console.error(response);
    if (response.response?.status !== 403) {
      dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__FAILURE, payload: {error: 'ERROR: Failed to fetch allowlist data'} });
    }
    else {
      error403 = true;
    }
  });

  console.log('fetchAllowlist (emails) response:', response_emails);
  console.log('fetchAllowlist (domains) response:', response_domains);

  if (!success) {
    if (error403) {
      dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__SUCCESS, payload: {allowlist_emails: [], allowlist_domains: []} });
      dispatch({ type: allowlistActionTypes.SET_ALLOWLIST_STALENESS, payload: false });
    }
    return;
  }

  const allowlist_emails: AllowlistEmail[] = AllowlistEmail.createAllowlistEmails(response_emails.data.allowlist_emails);
  const allowlist_domains: AllowlistDomain[] = AllowlistDomain.createAllowlistDomains(response_domains.data.allowlist_domains);

  dispatch({ type: allowlistActionTypes.FETCH_ALLOWLIST__SUCCESS, payload: {allowlist_emails, allowlist_domains} });
  dispatch({ type: allowlistActionTypes.SET_ALLOWLIST_STALENESS, payload: false });
}

export const createAllowlistEmail = (formValues: any, allowlistTitle: string) => async (dispatch: any, getState: any) => {
  console.log(formValues)
  dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__REQUEST });
  const allowlist_email: AllowlistEmail = {...formValues};
  
  await vifTech.post('/allowlist_emails', {
    allowlist_email: { ...allowlist_email, is_primary_contact: allowlist_email.is_primary_contact ? 1 : 0 }
  })
  .then((response_create) => {
    dispatch({ type: allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__SUCCESS, payload: new AllowlistEmail(response_create.data.allowlist_email) });
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__SUCCESS });
    console.log('createAllowlistEmail response_create:', response_create);
  })
  .catch((response_create) => {
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__FAILURE, payload: { error: `ERROR: Failed to create allowlist email for ${formValues.email} in the ${allowlistTitle} allowlist` } });
    console.log('createAllowlistEmail response_create:', response_create);
  });
}

export const createAllowlistDomain = (formValues: any, allowlistTitle: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__REQUEST });
  const allowlist_domain: AllowlistDomain = {...formValues};

  await vifTech.post('/allowlist_domains', {
    allowlist_domain: { ...allowlist_domain }
  })
  .then((response_create) => {
    dispatch({ type: allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__SUCCESS, payload: new AllowlistDomain(response_create.data.allowlist_domain) });
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__SUCCESS });
    console.log('createAllowlistDomain response_create:', response_create);
  })
  .catch((response_create) => {
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__FAILURE, payload: { error: `ERROR: Failed to create allowlist domain for ${formValues.domain} in the ${allowlistTitle} allowlist` } });
    console.log('createAllowlistDomain response_create:', response_create);
  });
}

export const deleteAllowlistEmail = (id: number, allowlistTitle: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_EMAIL__REQUEST });
  await vifTech.delete(`/allowlist_emails/${id}`)
  .then((response_delete) => {
    console.log('deleteAllowlistEmail response_delete:', response_delete);
    dispatch({ type: allowlistActionTypes.DELETE_ALLOWLIST_EMAIL__SUCCESS, payload: id });
    dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_EMAIL__SUCCESS });
    dispatch({ type: userActionTypes.SET_USERS_STALENESS, payload: true });
  })
  .catch((response_delete) => {
    console.log('deleteAllowlistEmail response_delete:', response_delete);
    dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_EMAIL__FAILURE, payload: {error: `ERROR: Failed to delete allowlist email in the ${allowlistTitle} allowlist`} });
  });
}

export const deleteAllowlistDomain = (id: number, allowlistTitle: string) => async (dispatch: any) => {
  dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN__REQUEST });
  await vifTech.delete(`/allowlist_domains/${id}`)
  .then((response_delete) => {
    console.log('deleteAllowlistDomain response_delete:', response_delete);
    dispatch({ type: allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN__SUCCESS, payload: id });
    dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN__SUCCESS });
    dispatch({ type: userActionTypes.SET_USERS_STALENESS, payload: true });
  })
  .catch((response_delete) => {
    console.log('deleteAllowlistDomain response_delete:', response_delete);
    dispatch({ type: allowlistTitle+allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN__FAILURE, payload: {error: `ERROR: Failed to delete allowlist domain in the ${allowlistTitle} allowlist`} });
  });
}

export const transferPrimaryContact = (userId_to: number, isAdmin: boolean, allowlistTitle: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: allowlistTitle+allowlistActionTypes.TRANSFER_PRIMARY_CONTACT__REQUEST });
  await vifTech.post(`/allowlist_emails/transfer_primary_contact`, {to: userId_to})
  .then((response_transfer) => {
    console.log('response_transfer:', response_transfer);

    dispatch({ type: allowlistActionTypes.TRANSFER_PRIMARY_CONTACT__SUCCESS, payload: {} });
    dispatch({ type: allowlistTitle+allowlistActionTypes.TRANSFER_PRIMARY_CONTACT__SUCCESS });
    dispatch({ type: allowlistActionTypes.SET_ALLOWLIST_STALENESS, payload: true });
    
    if (!isAdmin) {
      history.push('/');
    }
  })
  .catch((response_transfer) => {
    console.log('response_transfer:', response_transfer); 
    dispatch({
      type: allowlistTitle+allowlistActionTypes.TRANSFER_PRIMARY_CONTACT__FAILURE,
      // TODO: Make more specific
      payload: {error: `ERROR: Failed to transfer primary contact privilege`}
    });
  });
}



/********************************************************************************************* */
/**************************************************************************         FAQ */
/********************************************************************************************* */
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



/********************************************************************************************* */
/**************************************************************************         MODAL */
/********************************************************************************************* */
export const showModal = (children: any) => {
  return { type: SHOW_MODAL, payload: children }
}

export const hideModal = () => {
  return { type: HIDE_MODAL };
}
