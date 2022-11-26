import User from "Shared/entityClasses/User";
import { authActionTypes } from "Store/actions/types";

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
    case authActionTypes.SET_AUTH_STALENESS:
      return { ...state, isStale: action.payload }
    default:
      return state;
  }
};

export default authReducer;
