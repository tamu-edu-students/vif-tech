import {
  FETCH_COMPANIES,
  CREATE_COMPANY,
} from "Store/actions/types";

const companyReducer = (state: Company[] = [], action: any): Company[] => {
  switch(action.type) {
    case FETCH_COMPANIES:
      return action.payload;
    case CREATE_COMPANY:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default companyReducer;
