import { LOG_IN, LOG_OUT, FETCH_LOGIN_STATUS } from "../actions/types";

const INITIAL_STATE = {
  isLoggedIn: null,
  user: null,
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case LOG_IN:
      return { ...state, isLoggedIn: true, user: action.payload };
    case LOG_OUT:
      return { ...state, isLoggedIn: false, user: null };
    case FETCH_LOGIN_STATUS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
