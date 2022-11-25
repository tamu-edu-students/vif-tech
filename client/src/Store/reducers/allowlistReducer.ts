import AllowlistDomain from "Shared/entityClasses/AllowlistDomain";
import AllowlistEmail from "Shared/entityClasses/AllowlistEmail";
import {
  FETCH_ALLOWLIST,
  CREATE_ALLOWLIST_EMAIL,
  CREATE_ALLOWLIST_DOMAIN,
  DELETE_ALLOWLIST_EMAIL,
  DELETE_ALLOWLIST_DOMAIN,
 } from "Store/actions/types";

export interface Store_Allowlist {
  allowlist_emails: AllowlistEmail[];
  allowlist_domains: AllowlistDomain[];
}

const INITIAL_STATE: Store_Allowlist = {
  allowlist_emails: [],
  allowlist_domains: [],
};

const allowlistReducer = (state: Store_Allowlist = INITIAL_STATE, action: any): Store_Allowlist => {
  switch(action.type) {
    case FETCH_ALLOWLIST:
      return {
        ...state,
        allowlist_emails: action.payload.allowlist_emails,
        allowlist_domains: action.payload.allowlist_domains,
      }
    case CREATE_ALLOWLIST_EMAIL:
      return {
        ...state,
        allowlist_emails: [...state.allowlist_emails, action.payload],
      };
    case CREATE_ALLOWLIST_DOMAIN:
      return {
        ...state,
        allowlist_domains: [...state.allowlist_domains, action.payload],
      };
    case DELETE_ALLOWLIST_EMAIL:
      return {
        ...state,
        allowlist_emails: state.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.id !== action.payload)
      }
    case DELETE_ALLOWLIST_DOMAIN:
      return {
        ...state,
        allowlist_domains: state.allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.id !== action.payload)
      }
    default:
      return state;
  }
}

export default allowlistReducer;
