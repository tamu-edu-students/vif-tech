import User from "Shared/entityClasses/User";
import { userActionTypes } from "Store/actions/types";

export interface Store_UserData {
  users: User[];
  isStale: boolean;
}

const INITIAL_STATE: Store_UserData = {
  users: [],
  isStale: true,
}

const userReducer = (state: Store_UserData = INITIAL_STATE, action: any): Store_UserData => {
  switch(action.type) {
    case userActionTypes.FETCH_USERS__SUCCESS:
      return {...state, users: action.payload};
    case userActionTypes.CREATE_USER__SUCCESS:
      return {...state, users: [...state.users, action.payload]};
    case userActionTypes.UPDATE_USER__SUCCESS:
      return {
        ...state,
        users: [
          state.users.map((user: User) => user.id !== action.payload.id),
          action.payload
        ] 
      };
    case userActionTypes.SET_USERS_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default userReducer;
