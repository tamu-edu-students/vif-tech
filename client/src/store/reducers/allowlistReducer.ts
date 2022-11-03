import { FETCH_ALLOW_LIST } from "../actions/types";

const INITIAL_STATE = {
};

const allowlistReducer = (state = {}, action: any) => {
  switch(action.type) {
    case FETCH_ALLOW_LIST:
      return { state, ...state };
    default:
      return state;
  }
}

export default allowlistReducer;
