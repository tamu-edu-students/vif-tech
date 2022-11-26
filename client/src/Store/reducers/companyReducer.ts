import { companyActionTypes } from "Store/actions/types";

import Company from "Shared/entityClasses/Company";

export interface Store_CompanyData {
  companies: Company[];
  isStale: boolean;
}

const INITIAL_STATE: Store_CompanyData = {
  companies: [],
  isStale: true,
}

const companyReducer = (state: Store_CompanyData = INITIAL_STATE, action: any): Store_CompanyData => {
  switch(action.type) {
    case companyActionTypes.FETCH_COMPANIES__SUCCESS:
      return {...state, companies: []};
    case companyActionTypes.CREATE_COMPANY__SUCCESS:
      return {...state, companies: [...state.companies, action.payload]};
    case companyActionTypes.SET_COMPANIES_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default companyReducer;
