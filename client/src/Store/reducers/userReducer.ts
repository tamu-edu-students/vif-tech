import {
  FETCH_USERS,
  CREATE_USER,
} from "Store/actions/types";

const userReducer = (state: User[] = [], action: any): User[] => {
  switch(action.type) {
    case FETCH_USERS:
      return action.payload;
    case CREATE_USER:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default userReducer;
