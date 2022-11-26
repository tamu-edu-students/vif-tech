import User from "Shared/entityClasses/User";
import { userActionTypes } from "Store/actions/types";

const userReducer = (state: User[] = [], action: any): User[] => {
  switch(action.type) {
    case userActionTypes.FETCH_USERS__SUCCESS:
      return action.payload;
    case userActionTypes.CREATE_USER__SUCCESS:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default userReducer;
