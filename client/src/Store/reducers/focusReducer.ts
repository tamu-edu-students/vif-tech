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

const focusNameComparator = ({name: name1}: Focus, {name: name2}: Focus): number => name1.toLowerCase().localeCompare(name2.toLowerCase());

const focusReducer = (state: Store_FocusData = INITIAL_STATE, action: any): Store_FocusData => {
  switch(action.type) {
    case focusActionTypes.FETCH_FOCUSES__SUCCESS:
      return {...state, focuses: action.payload.sort(focusNameComparator)};
    case focusActionTypes.CREATE_FOCUS__SUCCESS:
      return {...state, focuses: [...state.focuses, action.payload].sort(focusNameComparator)};
    case focusActionTypes.DELETE_FOCUS__SUCCESS:
      return {
        ...state,
        focuses: state.focuses.filter((focus: Focus) => focus.id !== action.payload)
      };
    case focusActionTypes.UPDATE_FOCUS__SUCCESS:
      return {
        ...state,
        focuses: state.focuses
          .map((focus: Focus) => focus.id === action.payload.id ? action.payload : focus)
          .sort(focusNameComparator)
      };
    case focusActionTypes.SET_FOCUSES_STALENESS:
      return {...state, isStale: action.payload};
    default:
      return state;
  }
};

export default focusReducer;
