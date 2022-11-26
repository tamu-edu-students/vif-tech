import { companyActionTypes } from "Store/actions/types";

import Company from "Shared/entityClasses/Company";

const companyReducer = (state: Company[] = [], action: any): Company[] => {
  switch(action.type) {
    case companyActionTypes.FETCH_COMPANIES__SUCCESS:
      return action.payload;
    case companyActionTypes.CREATE_COMPANY__SUCCESS:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default companyReducer;
