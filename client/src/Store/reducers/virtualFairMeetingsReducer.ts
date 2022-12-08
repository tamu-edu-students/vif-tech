import VirtualFairMeeting from "Shared/entityClasses/VirtualFairMeeting";
import { virtualFairMeetingActionTypes } from "Store/actions/types";

export interface Store_VirtualFairMeetingData {
  virtualFairMeetings: VirtualFairMeeting[];
  isStale: boolean;
}

const INITIAL_STATE: Store_VirtualFairMeetingData = {
  virtualFairMeetings: [],
  isStale: true,
}

const virtualFairMeetingReducer = (state: Store_VirtualFairMeetingData = INITIAL_STATE, action: any): Store_VirtualFairMeetingData => {
  switch(action.type) {
    case virtualFairMeetingActionTypes.FETCH_VIRTUAL_FAIR_MEETINGS__SUCCESS:
      return {...state, virtualFairMeetings: action.payload};
    case virtualFairMeetingActionTypes.SET_VIRTUAL_FAIR_MEETINGS_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default virtualFairMeetingReducer;
