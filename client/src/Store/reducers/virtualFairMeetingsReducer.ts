import VirtualFairMeeting from "Shared/entityClasses/VirtualFairMeeting";
import { virtualFairAttendanceActionTypes } from "Store/actions/types";

export interface Store_VirtualFairMeetingData {
  virtualFairMeetings: VirtualFairMeeting[];
  attendingCompanyIds: number[];
  isStale: boolean;
}

const INITIAL_STATE: Store_VirtualFairMeetingData = {
  virtualFairMeetings: [],
  attendingCompanyIds: [],
  isStale: true,
}

const virtualFairMeetingReducer = (state: Store_VirtualFairMeetingData = INITIAL_STATE, action: any): Store_VirtualFairMeetingData => {
  switch(action.type) {
    case virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE__SUCCESS:
      return {...state, ...action.payload};
    case virtualFairAttendanceActionTypes.SET_VIRTUAL_FAIR_ATTENDANCE_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default virtualFairMeetingReducer;
