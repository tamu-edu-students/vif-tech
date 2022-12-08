import { companyFocusActionTypes } from "Store/actions/types";

import CompanyFocus from "Shared/entityClasses/CompanyFocus";

export interface Store_CompanyFocusData {
  companyFocuses: CompanyFocus[];
  isStale: boolean;
}

const INITIAL_STATE: Store_CompanyFocusData = {
  companyFocuses: [],
  isStale: true,
}

const companyFocusReducer = (state: Store_CompanyFocusData = INITIAL_STATE, action: any): Store_CompanyFocusData => {
  switch(action.type) {
    case companyFocusActionTypes.FETCH_COMPANY_FOCUSES__SUCCESS:
      return {...state, companyFocuses: action.payload};
    // case companyFocusActionTypes.CREATE_COMPANY_FOCUS__SUCCESS:
    //   return {...state, companyFocuses: [...state.companyFocuses, action.payload]};
    // case companyFocusActionTypes.DELETE_COMPANY_FOCUS__SUCCESS:
    //   return {
    //     ...state,
    //     companyFocuses: state.companyFocuses.filter((companyFocus: CompanyFocus) => companyFocus.id !== action.payload)
    //   };
    // case companyFocusActionTypes.UPDATE_COMPANY_FOCUS__SUCCESS:
    //   return {
    //     ...state,
    //     companyFocuses: state.companyFocuses.map((companyFocus: CompanyFocus) => companyFocus.id === action.payload.id ? action.payload : companyFocus)
    //   };
    case companyFocusActionTypes.SET_COMPANY_FOCUSES_STALENESS:
      return {...state, isStale: action.payload};
    default:
      return state;
  }
};

export default companyFocusReducer;
