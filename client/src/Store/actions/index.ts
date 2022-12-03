import {
  userActionTypes,
  authActionTypes,
  companyActionTypes,
  allowlistActionTypes,
  eventActionTypes,
  meetingActionTypes,
  eventSignupActionTypes,

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
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain  from 'Shared/entityClasses/AllowlistDomain';
import FAQ from 'Shared/entityClasses/FAQ';
import Event from 'Shared/entityClasses/Event';
import Meeting from 'Shared/entityClasses/Meeting';
import EventSignup from 'Shared/entityClasses/EventSignup';

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
  dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__REQUEST });
  await vifTech.post('/allowlist_emails', {allowlist_email: { ...formValues }})
  .then((response_create) => {
    dispatch({ type: allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__SUCCESS, payload: new AllowlistEmail(response_create.data.allowlist_email) });
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__SUCCESS });
  })
  .catch((response_create) => {
    console.log('createAllowlistEmail response_create:', response_create);
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__FAILURE, payload: { error: `ERROR: Failed to create allowlist email for ${formValues.email} in the ${allowlistTitle} allowlist` } });
  });
}

export const createAllowlistDomain = (formValues: any, allowlistTitle: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__REQUEST });
  await vifTech.post('/allowlist_domains', {allowlist_domain: { ...formValues }})
  .then((response_create) => {
    console.log('createAllowlistDomain response_create:', response_create);
    dispatch({ type: allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__SUCCESS, payload: new AllowlistDomain(response_create.data.allowlist_domain) });
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__SUCCESS });
  })
  .catch((response_create) => {
    console.log('createAllowlistDomain response_create:', response_create);
    dispatch({ type: allowlistTitle+allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__FAILURE, payload: { error: `ERROR: Failed to create allowlist domain for ${formValues.domain} in the ${allowlistTitle} allowlist` } });
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
    dispatch({ type: meetingActionTypes.SET_MEETINGS_STALENESS, payload: true });
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
    dispatch({ type: meetingActionTypes.SET_MEETINGS_STALENESS, payload: true });
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
/**************************************************************************         EVENTS */
/********************************************************************************************* */
export const fetchEvents = () => async (dispatch: any) => {
  dispatch({ type: eventActionTypes.FETCH_EVENTS__REQUEST });
  await vifTech.get('/events')
  .then((response) => {
    console.log('response_fetchEvents:', response);
    dispatch({ type: eventActionTypes.FETCH_EVENTS__SUCCESS, payload: Event.createEvents(response.data.events) });
    dispatch({ type: eventActionTypes.SET_EVENTS_STALENESS, payload: false });
  })
  .catch((response) => {
    console.log('response_fetchEvents:', response);
    dispatch({ type: eventActionTypes.FETCH_EVENTS__FAILURE, payload: {error: 'ERROR: Failed to fetch events data'} });
  });
}



/********************************************************************************************* */
/**************************************************************************         EVENT SIGNUPS */
/********************************************************************************************* */
export const fetchEventSignups = () => async (dispatch: any) => {
  dispatch({ type: eventSignupActionTypes.FETCH_EVENT_SIGNUPS__REQUEST });
  await vifTech.get('/event_signups')
  .then((response) => {
    console.log('response_fetchEventSignups:', response);
    dispatch({ type: eventSignupActionTypes.FETCH_EVENT_SIGNUPS__SUCCESS, payload: EventSignup.createEventSignups(response.data.event_signups) });
    dispatch({ type: eventSignupActionTypes.SET_EVENT_SIGNUPS_STALENESS, payload: false });
  })
  .catch((response) => {
    console.log('response_fetchEventSignups:', response);
    dispatch({ type: eventSignupActionTypes.FETCH_EVENT_SIGNUPS__FAILURE, payload: {error: 'ERROR: Failed to fetch events data'} });
  });
}

export const createEventSignup = (event_id: number, user_id?: number) => async (dispatch: any) => {
  dispatch({ type: eventSignupActionTypes.CREATE_EVENT_SIGNUP__REQUEST });
  await vifTech.post(`/events/${event_id}/signup/${user_id ?? ''}`)
  .then((response) => {
    console.log('response addEventAttendee:', response);
    dispatch({ type: eventSignupActionTypes.CREATE_EVENT_SIGNUP__SUCCESS, payload: EventSignup.createEventSignup(response.data.event_signup) });
  })
  .catch((response) => {
    console.log('response_addEventAttendee', response);
    dispatch({ type: eventSignupActionTypes.CREATE_EVENT_SIGNUP__FAILURE, payload: { error: 'ERROR: Failed to register for event' } });
  });
}

export const deleteEventSignup = (event_id: number, user_id?: number) => async (dispatch: any) => {
  dispatch({ type: eventSignupActionTypes.DELETE_EVENT_SIGNUP__REQUEST });
  await vifTech.delete(`/events/${event_id}/signout/${user_id ?? ''}`)
  .then((response) => {
    console.log('response removeEventAttendee:', response);
    dispatch({ type: eventSignupActionTypes.DELETE_EVENT_SIGNUP__SUCCESS, payload: response.data.event_signup.id });
  })
  .catch((response) => {
    console.log('response_removeEventAttendee', response);
    dispatch({ type: eventSignupActionTypes.DELETE_EVENT_SIGNUP__FAILURE, payload: { error: 'ERROR: Failed to unregister for event' } });
  });
}




/********************************************************************************************* */
/**************************************************************************         MEETINGS */
/********************************************************************************************* */
export const fetchMeetings = () => async (dispatch: any) => {
  dispatch({ type: meetingActionTypes.FETCH_MEETINGS__REQUEST });
  await vifTech.get('/meetings')
  .then((response) => {
    console.log('response_fetchMeetings:', response);
    dispatch({ type: meetingActionTypes.FETCH_MEETINGS__SUCCESS, payload: Meeting.createMeetings(response.data.meetings) });
    dispatch({ type: meetingActionTypes.SET_MEETINGS_STALENESS, payload: false });
  })
  .catch((response) => {
    console.log('response_fetchMeetings:', response);
    dispatch({ type: meetingActionTypes.FETCH_MEETINGS__FAILURE, payload: {error: 'ERROR: Failed to fetch meetings data'} });
  });
}

export const createMeeting = (formValues: any) => async (dispatch: any) => {
  dispatch({ type: meetingActionTypes.CREATE_MEETING__REQUEST });
  await vifTech.post(`/meetings`, { meeting: { ...formValues } })
  .then((response) => {
    console.log('createMeeting response:', response);
    dispatch({ type: meetingActionTypes.CREATE_MEETING__SUCCESS, payload: new Meeting(response.data.meeting) });
  })
  .catch((response) => {
    console.log('createMeeting response:', response);
    dispatch({ type: meetingActionTypes.CREATE_MEETING__FAILURE, payload: {error: `ERROR: Failed to create meeting`} });
  });
}



export const deleteMeeting = (id: number) => async (dispatch: any, getState: any) => {
  dispatch({ type: `${id}`+meetingActionTypes.DELETE_MEETING__REQUEST });
  await vifTech.delete(`/meetings/${id}`)
  .then((response_delete) => {
    console.log('deleteMeeting response_delete:', response_delete);
    dispatch({ type: meetingActionTypes.DELETE_MEETING__SUCCESS, payload: id });
    dispatch({ type: `${id}`+meetingActionTypes.DELETE_MEETING__SUCCESS });
  })
  .catch((response_delete) => {
    console.log('deleteMeeting response_delete:', response_delete);
    dispatch({ type: `${id}`+meetingActionTypes.DELETE_MEETING__FAILURE, payload: {error: `ERROR: Failed to delete meeting`} });
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
