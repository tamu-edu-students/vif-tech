import {
  FETCH_COMPANIES,
  CREATE_COMPANY,
} from "../actions/types";

const companyReducer = (state: Company[] = [], action: any) => {
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
