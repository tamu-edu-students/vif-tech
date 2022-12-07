import { focusActionTypes } from "Store/actions/types";

import Focus from "Shared/entityClasses/Focus";

export interface Store_FocusData {
  focuses: Focus[];
  isStale: boolean;
}

const INITIAL_STATE: Store_FocusData = {
  focuses: [],
  isStale: true,
}

const focusReducer = (state: Store_FocusData = INITIAL_STATE, action: any): Store_FocusData => {
  switch(action.type) {
    case focusActionTypes.FETCH_FOCUSES__SUCCESS:
      return {...state, focuses: action.payload};
    case focusActionTypes.CREATE_FOCUS__SUCCESS:
      return {...state, focuses: [...state.focuses, action.payload]};
    case focusActionTypes.DELETE_FOCUS__SUCCESS:
      return {
        ...state,
        focuses: state.focuses.filter((focus: Focus) => focus.id !== action.payload)
      };
    case focusActionTypes.SET_FOCUSES_STALENESS:
      return {...state, isStale: action.payload};
    default:
      return state;
  }
};

export default focusReducer;
