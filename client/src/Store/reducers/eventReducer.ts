import { eventActionTypes } from "Store/actions/types";

import Event from "Shared/entityClasses/Event";

export interface Store_EventData {
  events: Event[];
  isStale: boolean;
}

const INITIAL_STATE: Store_EventData = {
  events: [],
  isStale: true,
}

const eventReducer = (state: Store_EventData = INITIAL_STATE, action: any): Store_EventData => {
  switch(action.type) {
    case eventActionTypes.FETCH_EVENTS__SUCCESS:
      return {...state, events: action.payload};
    case eventActionTypes.SET_EVENTS_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default eventReducer;
