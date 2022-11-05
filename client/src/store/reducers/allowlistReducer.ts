import {
  CREATE_ALLOWLIST_EMAIL,
  CREATE_ALLOWLIST_DOMAIN,
  DELETE_ALLOWLIST_EMAIL,
  DELETE_ALLOWLIST_DOMAIN,
 } from "../actions/types";

interface Store_Allowlist {
  allowlist_emails: AllowlistEmail[];
  allowlist_domains: AllowlistDomain[];
}

const INITIAL_STATE = {
  allowlist_emails: [],
  allowlist_domains: [],
};

const allowlistReducer = (state: Store_Allowlist = INITIAL_STATE, action: any) => {
  switch(action.type) {
    case DELETE_ALLOWLIST_EMAIL:
    case CREATE_ALLOWLIST_EMAIL:
      return {
        ...state,
        allowlist_emails: [...state.allowlist_emails, action.payload],
      };
      case DELETE_ALLOWLIST_DOMAIN:
      case CREATE_ALLOWLIST_DOMAIN:
      return {
        ...state,
        allowlist_domains: [...state.allowlist_domains, action.payload],
      };
    default:
      return state;
  }
}

export default allowlistReducer;
