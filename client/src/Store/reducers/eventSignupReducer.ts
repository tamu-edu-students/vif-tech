import { eventSignupActionTypes } from "Store/actions/types";

import EventSignup from "Shared/entityClasses/EventSignup";

export interface Store_EventSignupData {
  eventSignups: EventSignup[];
  isStale: boolean;
}

const INITIAL_STATE: Store_EventSignupData = {
  eventSignups: [],
  isStale: true,
}

const eventSignupReducer = (state: Store_EventSignupData = INITIAL_STATE, action: any): Store_EventSignupData => {
  switch(action.type) {
    case eventSignupActionTypes.FETCH_EVENT_SIGNUPS__SUCCESS:
      return {...state, eventSignups: action.payload};

    case eventSignupActionTypes.CREATE_EVENT_SIGNUP__SUCCESS:
      return {...state, eventSignups: [...state.eventSignups, action.payload]};

    case eventSignupActionTypes.DELETE_EVENT_SIGNUP__SUCCESS:
      return {...state, eventSignups: state.eventSignups.filter((eventSignup: EventSignup) => eventSignup.id === action.payload)};

    case eventSignupActionTypes.SET_EVENT_SIGNUPS_STALENESS:
      return {...state, isStale: action.payload};
      
    default:
      return state;
  }
};

export default eventSignupReducer;
