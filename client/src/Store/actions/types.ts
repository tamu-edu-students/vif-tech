/********************************************************************************************* */
/**************************************************************************         USERS */
/********************************************************************************************* */
export const userActionTypes = {
  FETCH_USERS: 'FETCH_USERS',
  FETCH_USERS__REQUEST: 'FETCH_USERS__REQUEST',
  FETCH_USERS__SUCCESS: 'FETCH_USERS__SUCCESS',
  FETCH_USERS__FAILURE: 'FETCH_USERS__FAILURE',

  CREATE_USER: 'CREATE_USER',
  CREATE_USER__REQUEST: 'CREATE_USER__REQUEST',
  CREATE_USER__SUCCESS: 'CREATE_USER__SUCCESS',
  CREATE_USER__FAILURE: 'CREATE_USER__FAILURE',

  SET_USERS_STALENESS: 'SET_USERS_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         AUTH */
/********************************************************************************************* */
export const authActionTypes = {
  LOG_IN: 'LOG_IN',
  LOG_IN__REQUEST: 'LOG_IN__REQUEST',
  LOG_IN__SUCCESS: 'LOG_IN__SUCCESS',
  LOG_IN__FAILURE: 'LOG_IN__FAILURE',

  LOG_OUT: 'LOG_OUT',
  LOG_OUT__REQUEST: 'LOG_OUT__REQUEST',
  LOG_OUT__SUCCESS: 'LOG_OUT__SUCCESS',
  LOG_OUT__FAILURE: 'LOG_OUT__FAILURE',

  FETCH_LOGIN_STATUS: 'FETCH_LOGIN_STATUS',
  FETCH_LOGIN_STATUS__REQUEST: 'FETCH_LOGIN_STATUS__REQUEST',
  FETCH_LOGIN_STATUS__SUCCESS: 'FETCH_LOGIN_STATUS__SUCCESS',
  FETCH_LOGIN_STATUS__FAILURE: 'FETCH_LOGIN_STATUS__FAILURE',

  SET_AUTH_STALENESS: 'SET_AUTH_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         COMPANIES */
/********************************************************************************************* */
export const companyActionTypes = {
  FETCH_COMPANIES: 'FETCH_COMPANIES',
  FETCH_COMPANIES__REQUEST: 'FETCH_COMPANIES__REQUEST',
  FETCH_COMPANIES__SUCCESS: 'FETCH_COMPANIES__SUCCESS',
  FETCH_COMPANIES__FAILURE: 'FETCH_COMPANIES__FAILURE',
  
  CREATE_COMPANY: 'CREATE_COMPANY',
  CREATE_COMPANY__REQUEST: 'CREATE_COMPANY__REQUEST',
  CREATE_COMPANY__SUCCESS: 'CREATE_COMPANY__SUCCESS',
  CREATE_COMPANY__FAILURE: 'CREATE_COMPANY__FAILURE',
  
  SET_COMPANIES_STALENESS: 'SET_COMPANIES_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         ALLOWLIST */
/********************************************************************************************* */
export const allowlistActionTypes = {
  FETCH_ALLOWLIST: 'FETCH_ALLOWLIST',
  FETCH_ALLOWLIST__REQUEST: 'FETCH_ALLOWLIST__REQUEST',
  FETCH_ALLOWLIST__SUCCESS: 'FETCH_ALLOWLIST__SUCCESS',
  FETCH_ALLOWLIST__FAILURE: 'FETCH_ALLOWLIST__FAILURE',
  
  CREATE_ALLOWLIST_EMAIL: 'CREATE_ALLOWLIST_EMAIL',
  CREATE_ALLOWLIST_EMAIL__REQUEST: 'CREATE_ALLOWLIST_EMAIL__REQUEST',
  CREATE_ALLOWLIST_EMAIL__SUCCESS: 'CREATE_ALLOWLIST_EMAIL__SUCCESS',
  CREATE_ALLOWLIST_EMAIL__FAILURE: 'CREATE_ALLOWLIST_EMAIL__FAILURE',
  
  CREATE_ALLOWLIST_DOMAIN: 'CREATE_ALLOWLIST_DOMAIN',
  CREATE_ALLOWLIST_DOMAIN__REQUEST: 'CREATE_ALLOWLIST_DOMAIN__REQUEST',
  CREATE_ALLOWLIST_DOMAIN__SUCCESS: 'CREATE_ALLOWLIST_DOMAIN__SUCCESS',
  CREATE_ALLOWLIST_DOMAIN__FAILURE: 'CREATE_ALLOWLIST_DOMAIN__FAILURE',
  
  DELETE_ALLOWLIST_EMAIL: 'DELETE_ALLOWLIST_EMAIL',
  DELETE_ALLOWLIST_EMAIL__REQUEST: 'DELETE_ALLOWLIST_EMAIL__REQUEST',
  DELETE_ALLOWLIST_EMAIL__SUCCESS: 'DELETE_ALLOWLIST_EMAIL__SUCCESS',
  DELETE_ALLOWLIST_EMAIL__FAILURE: 'DELETE_ALLOWLIST_EMAIL__FAILURE',
  
  DELETE_ALLOWLIST_DOMAIN: 'DELETE_ALLOWLIST_DOMAIN',
  DELETE_ALLOWLIST_DOMAIN__REQUEST: 'DELETE_ALLOWLIST_DOMAIN__REQUEST',
  DELETE_ALLOWLIST_DOMAIN__SUCCESS: 'DELETE_ALLOWLIST_DOMAIN__SUCCESS',
  DELETE_ALLOWLIST_DOMAIN__FAILURE: 'DELETE_ALLOWLIST_DOMAIN__FAILURE',
  
  TRANSFER_PRIMARY_CONTACT: 'TRANSFER_PRIMARY_CONTACT',
  TRANSFER_PRIMARY_CONTACT__REQUEST: 'TRANSFER_PRIMARY_CONTACT__REQUEST',
  TRANSFER_PRIMARY_CONTACT__SUCCESS: 'TRANSFER_PRIMARY_CONTACT__SUCCESS',
  TRANSFER_PRIMARY_CONTACT__FAILURE: 'TRANSFER_PRIMARY_CONTACT__FAILURE',
  
  SET_ALLOWLIST_STALENESS: 'SET_ALLOWLIST_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         FAQ */
/********************************************************************************************* */
export const FETCH_FAQS = 'FETCH_FAQS';
export const CREATE_FAQ = 'CREATE_FAQ';
export const UPDATE_FAQ = 'UPDATE_FAQ';
export const DELETE_FAQ = 'DELETE_FAQ';



/********************************************************************************************* */
/**************************************************************************         EVENTS */
/********************************************************************************************* */
export const eventActionTypes = {
  FETCH_EVENTS: 'FETCH_EVENTS',
  FETCH_EVENTS__REQUEST: 'FETCH_EVENTS__REQUEST',
  FETCH_EVENTS__SUCCESS: 'FETCH_EVENTS__SUCCESS',
  FETCH_EVENTS__FAILURE: 'FETCH_EVENTS__FAILURE',
  
  SET_EVENTS_STALENESS: 'SET_EVENTS_STALENESS',
};



/********************************************************************************************* */
/**************************************************************************         EVENT SIGNUPS */
/********************************************************************************************* */
export const eventSignupActionTypes = {
  FETCH_EVENT_SIGNUPS: 'FETCH_EVENT_SIGNUPS',
  FETCH_EVENT_SIGNUPS__REQUEST: 'FETCH_EVENT_SIGNUPS__REQUEST',
  FETCH_EVENT_SIGNUPS__SUCCESS: 'FETCH_EVENT_SIGNUPS__SUCCESS',
  FETCH_EVENT_SIGNUPS__FAILURE: 'FETCH_EVENT_SIGNUPS__FAILURE',

  CREATE_EVENT_SIGNUP: 'CREATE_EVENT_SIGNUP',
  CREATE_EVENT_SIGNUP__REQUEST: 'CREATE_EVENT_SIGNUP__REQUEST',
  CREATE_EVENT_SIGNUP__SUCCESS: 'CREATE_EVENT_SIGNUP__SUCCESS',
  CREATE_EVENT_SIGNUP__FAILURE: 'CREATE_EVENT_SIGNUP__FAILURE',

  DELETE_EVENT_SIGNUP: 'DELETE_EVENT_SIGNUP',
  DELETE_EVENT_SIGNUP__REQUEST: 'DELETE_EVENT_SIGNUP__REQUEST',
  DELETE_EVENT_SIGNUP__SUCCESS: 'DELETE_EVENT_SIGNUP__SUCCESS',
  DELETE_EVENT_SIGNUP__FAILURE: 'DELETE_EVENT_SIGNUP__FAILURE',
  
  SET_EVENT_SIGNUPS_STALENESS: 'SET_EVENT_SIGNUPS_STALENESS',
};



/********************************************************************************************* */
/**************************************************************************         MEETINGS */
/********************************************************************************************* */
export const meetingActionTypes = {
  FETCH_MEETINGS: 'FETCH_MEETINGS',
  FETCH_MEETINGS__REQUEST: 'FETCH_MEETINGS__REQUEST',
  FETCH_MEETINGS__SUCCESS: 'FETCH_MEETINGS__SUCCESS',
  FETCH_MEETINGS__FAILURE: 'FETCH_MEETINGS__FAILURE',
  
  CREATE_MEETING: 'CREATE_MEETING',
  CREATE_MEETING__REQUEST: 'CREATE_MEETING__REQUEST',
  CREATE_MEETING__SUCCESS: 'CREATE_MEETING__SUCCESS',
  CREATE_MEETING__FAILURE: 'CREATE_MEETING__FAILURE',

  DELETE_MEETING: 'DELETE_MEETING',
  DELETE_MEETING__REQUEST: 'DELETE_MEETING__REQUEST',
  DELETE_MEETING__SUCCESS: 'DELETE_MEETING__SUCCESS',
  DELETE_MEETING__FAILURE: 'DELETE_MEETING__FAILURE',

  UPDATE_MEETING: 'UPDATE_MEETING',
  UPDATE_MEETING__REQUEST: 'UPDATE_MEETING__REQUEST',
  UPDATE_MEETING__SUCCESS: 'UPDATE_MEETING__SUCCESS',
  UPDATE_MEETING__FAILURE: 'UPDATE_MEETING__FAILURE',
  
  SET_MEETINGS_STALENESS: 'SET_MEETINGS_STALENESS',
};



export const focusActionTypes = {
  FETCH_FOCUSES: 'FETCH_FOCUSES',
  FETCH_FOCUSES__REQUEST: 'FETCH_FOCUSES__REQUEST',
  FETCH_FOCUSES__SUCCESS: 'FETCH_FOCUSES__SUCCESS',
  FETCH_FOCUSES__FAILURE: 'FETCH_FOCUSES__FAILURE',
  
  CREATE_FOCUS: 'CREATE_FOCUS',
  CREATE_FOCUS__REQUEST: 'CREATE_FOCUS__REQUEST',
  CREATE_FOCUS__SUCCESS: 'CREATE_FOCUS__SUCCESS',
  CREATE_FOCUS__FAILURE: 'CREATE_FOCUS__FAILURE',

  DELETE_FOCUS: 'DELETE_FOCUS',
  DELETE_FOCUS__REQUEST: 'DELETE_FOCUS__REQUEST',
  DELETE_FOCUS__SUCCESS: 'DELETE_FOCUS__SUCCESS',
  DELETE_FOCUS__FAILURE: 'DELETE_FOCUS__FAILURE',
  
  SET_FOCUSES_STALENESS: 'SET_FOCUSES_STALENESS',
};



/********************************************************************************************* */
/**************************************************************************         MODAL */
/********************************************************************************************* */
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
