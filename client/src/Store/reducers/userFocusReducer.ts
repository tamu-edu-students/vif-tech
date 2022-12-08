import { userFocusActionTypes } from "Store/actions/types";

import UserFocus from "Shared/entityClasses/UserFocus";

export interface Store_UserFocusData {
  userFocuses: UserFocus[];
  isStale: boolean;
}

const INITIAL_STATE: Store_UserFocusData = {
  userFocuses: [],
  isStale: true,
}

const userFocusReducer = (state: Store_UserFocusData = INITIAL_STATE, action: any): Store_UserFocusData => {
  switch(action.type) {
    case userFocusActionTypes.FETCH_USER_FOCUSES__SUCCESS:
      return {...state, userFocuses: action.payload};
    // case userFocusActionTypes.CREATE_USER_FOCUS__SUCCESS:
    //   return {...state, userFocuses: [...state.userFocuses, action.payload]};
    // case userFocusActionTypes.DELETE_USER_FOCUS__SUCCESS:
    //   return {
    //     ...state,
    //     userFocuses: state.userFocuses.filter((userFocus: UserFocus) => userFocus.id !== action.payload)
    //   };
    // case userFocusActionTypes.UPDATE_USER_FOCUS__SUCCESS:
    //   return {
    //     ...state,
    //     userFocuses: state.userFocuses.map((userFocus: UserFocus) => userFocus.id === action.payload.id ? action.payload : userFocus)
    //   };
    case userFocusActionTypes.SET_USER_FOCUSES_STALENESS:
      return {...state, isStale: action.payload};
    default:
      return state;
  }
};

export default userFocusReducer;
