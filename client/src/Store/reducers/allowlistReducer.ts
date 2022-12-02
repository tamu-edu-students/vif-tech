import AllowlistDomain from "Shared/entityClasses/AllowlistDomain";
import AllowlistEmail from "Shared/entityClasses/AllowlistEmail";
import { allowlistActionTypes } from "Store/actions/types";

export interface Store_Allowlist {
  allowlist_emails: AllowlistEmail[];
  allowlist_domains: AllowlistDomain[];
  isStale: boolean;
}

const INITIAL_STATE: Store_Allowlist = {
  allowlist_emails: [],
  allowlist_domains: [],
  isStale: true,
};

const allowlistReducer = (state: Store_Allowlist = INITIAL_STATE, action: any): Store_Allowlist => {
  switch(action.type) {
    case allowlistActionTypes.FETCH_ALLOWLIST__SUCCESS:
      return {
        ...state,
        allowlist_emails: action.payload.allowlist_emails,
        allowlist_domains: action.payload.allowlist_domains,
      }
    case allowlistActionTypes.CREATE_ALLOWLIST_EMAIL__SUCCESS:
      return {
        ...state,
        allowlist_emails: [...state.allowlist_emails, action.payload],
      };
    case allowlistActionTypes.CREATE_ALLOWLIST_DOMAIN__SUCCESS:
      return {
        ...state,
        allowlist_domains: [...state.allowlist_domains, action.payload],
      };
    case allowlistActionTypes.DELETE_ALLOWLIST_EMAIL__SUCCESS:
      return {
        ...state,
        allowlist_emails: state.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.id !== action.payload)
      }
    case allowlistActionTypes.DELETE_ALLOWLIST_DOMAIN__SUCCESS:
      return {
        ...state,
        allowlist_domains: state.allowlist_domains.filter((allowlist_domain: AllowlistDomain) => allowlist_domain.id !== action.payload)
      }
      // const { newTo, newFrom } = action.payload;
      // return {
      //   ...state,
      //   allowlist_emails: [
      //     ...state.allowlist_emails.filter((allowlist_email: AllowlistEmail) => allowlist_email.id !== newTo.id && allowlist_email.id !== newFrom.id),
      //     ...[newTo, newFrom]
      //   ]
      // }
    case allowlistActionTypes.SET_ALLOWLIST_STALENESS:
      return { ...state, isStale: action.payload };
    case allowlistActionTypes.TRANSFER_PRIMARY_CONTACT__SUCCESS:
    default:
      return state;
  }
}

export default allowlistReducer;
