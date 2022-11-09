import { LOG_IN, LOG_OUT, FETCH_LOGIN_STATUS } from "Store/actions/types";

export interface Store_Auth {
  isLoggedIn: boolean | null;
  user: User | null;
}

const INITIAL_STATE: Store_Auth = {
  isLoggedIn: null,
  user: null,
};

const authReducer = (state: Store_Auth = INITIAL_STATE, action: any): Store_Auth => {
  switch (action.type) {
    case LOG_IN:
    case LOG_OUT:
    case FETCH_LOGIN_STATUS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default authReducer;
