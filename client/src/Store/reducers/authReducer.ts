import User from "Shared/entityClasses/User";
import { authActionTypes, userActionTypes } from "Store/actions/types";

export interface Store_Auth {
  isLoggedIn: boolean | null;
  user: User | null;
  isStale: boolean;
}

const INITIAL_STATE: Store_Auth = {
  isLoggedIn: null,
  user: null,
  isStale: true,
};

const authReducer = (state: Store_Auth = INITIAL_STATE, action: any): Store_Auth => {
  switch (action.type) {
    case authActionTypes.LOG_IN__SUCCESS:
    case authActionTypes.LOG_OUT__SUCCESS:
    case authActionTypes.FETCH_LOGIN_STATUS__SUCCESS:
      return { ...state, ...action.payload };
    case authActionTypes.FETCH_LOGIN_STATUS__FAILURE:
      return { ...state, isLoggedIn: false, user: null };
    case authActionTypes.SET_AUTH_STALENESS:
      return { ...state, isStale: action.payload };
    case userActionTypes.UPDATE_USER__SUCCESS:
      if (action.payload.id === state.user?.id) {
        return { ...state, user: action.payload }
      }
      else {
        return state;
      }
    default:
      return state;
  }
};

export default authReducer;
