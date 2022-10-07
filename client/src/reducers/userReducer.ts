import {
  FETCH_USERS,
  CREATE_USER,
} from "../actions/types";

export default (state = [], action: any) => {
  switch(action.type) {
    case FETCH_USERS:
      return action.payload;
    case CREATE_USER:
      return [...state, action.payload];
    default:
      return state;
  }
};
