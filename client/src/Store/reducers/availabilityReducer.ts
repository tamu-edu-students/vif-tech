import { availabilityActionTypes } from "Store/actions/types";

import Availability from "Shared/entityClasses/Availability";

export interface Store_AvailabilityData {
  availabilities: Availability[];
  isStale: boolean;
}

const INITIAL_STATE: Store_AvailabilityData = {
 availabilities: [],
  isStale: true,
}

const availabilityReducer = (state: Store_AvailabilityData = INITIAL_STATE, action: any): Store_AvailabilityData => {
  switch(action.type) {
    case availabilityActionTypes.FETCH_AVAILABILITIES__SUCCESS:
      return {...state,availabilities: action.payload};
    case availabilityActionTypes.CREATE_AVAILABILITY__SUCCESS:
      return {...state,availabilities: [...state.availabilities, action.payload]};
    case availabilityActionTypes.SET_AVAILABILITIES_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default availabilityReducer;
