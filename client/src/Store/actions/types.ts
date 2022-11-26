/********************************************************************************************* */
/**************************************************************************         USERS */
/********************************************************************************************* */
export const userActionTypes = {
  FETCH_USERS__REQUEST: 'FETCH_USERS__REQUEST',
  FETCH_USERS__SUCCESS: 'FETCH_USERS__SUCCESS',
  FETCH_USERS__FAILURE: 'FETCH_USERS__FAILURE',

  CREATE_USER__REQUEST: 'CREATE_USER__REQUEST',
  CREATE_USER__SUCCESS: 'CREATE_USER__SUCCESS',
  CREATE_USER__FAILURE: 'CREATE_USER__FAILURE',

  USERS_SET_STALENESS: 'USERS_SET_STALENESS',
}
  


/********************************************************************************************* */
/**************************************************************************         AUTH */
/********************************************************************************************* */
export const authActionTypes = {
  LOG_IN__REQUEST: 'LOG_IN__REQUEST',
  LOG_IN__SUCCESS: 'LOG_IN__SUCCESS',
  LOG_IN__FAILURE: 'LOG_IN__FAILURE',

  LOG_OUT__REQUEST: 'LOG_OUT__REQUEST',
  LOG_OUT__SUCCESS: 'LOG_OUT__SUCCESS',
  LOG_OUT__FAILURE: 'LOG_OUT__FAILURE',

  FETCH_LOGIN_STATUS__REQUEST: 'FETCH_LOGIN_STATUS__REQUEST',
  FETCH_LOGIN_STATUS__SUCCESS: 'FETCH_LOGIN_STATUS__SUCCESS',
  FETCH_LOGIN_STATUS__FAILURE: 'FETCH_LOGIN_STATUS__FAILURE',
}



/********************************************************************************************* */
/**************************************************************************         COMPANIES */
/********************************************************************************************* */
export const companyActionTypes = {
  FETCH_COMPANIES__REQUEST: 'FETCH_COMPANIES__REQUEST',
  FETCH_COMPANIES__SUCCESS: 'FETCH_COMPANIES__SUCCESS',
  FETCH_COMPANIES__FAILURE: 'FETCH_COMPANIES__FAILURE',
  
  CREATE_COMPANY__REQUEST: 'CREATE_COMPANY__REQUEST',
  CREATE_COMPANY__SUCCESS: 'CREATE_COMPANY__SUCCESS',
  CREATE_COMPANY__FAILURE: 'CREATE_COMPANY__FAILURE',
  
  SET_COMPANIES_STALENESS: 'SET_COMPANIES_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         ALLOWLIST */
/********************************************************************************************* */
export const allowlistActionTypes = {
  FETCH_ALLOWLIST__REQUEST: 'FETCH_ALLOWLIST__REQUEST',
  FETCH_ALLOWLIST__SUCCESS: 'FETCH_ALLOWLIST__SUCCESS',
  FETCH_ALLOWLIST__FAILURE: 'FETCH_ALLOWLIST__FAILURE',
  
  CREATE_ALLOWLIST_EMAIL__REQUEST: 'CREATE_ALLOWLIST_EMAIL__REQUEST',
  CREATE_ALLOWLIST_EMAIL__SUCCESS: 'CREATE_ALLOWLIST_EMAIL__SUCCESS',
  CREATE_ALLOWLIST_EMAIL__FAILURE: 'CREATE_ALLOWLIST_EMAIL__FAILURE',
  
  CREATE_ALLOWLIST_DOMAIN__REQUEST: 'CREATE_ALLOWLIST_DOMAIN__REQUEST',
  CREATE_ALLOWLIST_DOMAIN__SUCCESS: 'CREATE_ALLOWLIST_DOMAIN__SUCCESS',
  CREATE_ALLOWLIST_DOMAIN__FAILURE: 'CREATE_ALLOWLIST_DOMAIN__FAILURE',
  
  DELETE_ALLOWLIST_EMAIL__REQUEST: 'DELETE_ALLOWLIST_EMAIL__REQUEST',
  DELETE_ALLOWLIST_EMAIL__SUCCESS: 'DELETE_ALLOWLIST_EMAIL__SUCCESS',
  DELETE_ALLOWLIST_EMAIL__FAILURE: 'DELETE_ALLOWLIST_EMAIL__FAILURE',
  
  DELETE_ALLOWLIST_DOMAIN__REQUEST: 'DELETE_ALLOWLIST_DOMAIN__REQUEST',
  DELETE_ALLOWLIST_DOMAIN__SUCCESS: 'DELETE_ALLOWLIST_DOMAIN__SUCCESS',
  DELETE_ALLOWLIST_DOMAIN__FAILURE: 'DELETE_ALLOWLIST_DOMAIN__FAILURE',
  
  TRANSFER_PRIMARY_CONTACT__REQUEST: 'TRANSFER_PRIMARY_CONTACT__REQUEST',
  TRANSFER_PRIMARY_CONTACT__SUCCESS: 'TRANSFER_PRIMARY_CONTACT__SUCCESS',
  TRANSFER_PRIMARY_CONTACT__FAILURE: 'TRANSFER_PRIMARY_CONTACT__FAILURE',
  
  ALLOWLIST_SET_STALENESS: 'ALLOWLIST_SET_STALENESS',
}



/********************************************************************************************* */
/**************************************************************************         FAQ */
/********************************************************************************************* */
export const FETCH_FAQS = 'FETCH_FAQS';
export const CREATE_FAQ = 'CREATE_FAQ';
export const UPDATE_FAQ = 'UPDATE_FAQ';
export const DELETE_FAQ = 'DELETE_FAQ';



/********************************************************************************************* */
/**************************************************************************         MODAL */
/********************************************************************************************* */
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
