import VirtualFairMeeting from "Shared/entityClasses/VirtualFairMeeting";
import { virtualFairAttendanceActionTypes } from "Store/actions/types";

export interface Store_VirtualFairAttendanceData {
  virtualFairMeetings: VirtualFairMeeting[];
  attendingCompanyIds: number[];
  isStale: boolean;
}

const INITIAL_STATE: Store_VirtualFairAttendanceData = {
  virtualFairMeetings: [],
  attendingCompanyIds: [],
  isStale: true,
}

const virtualFairAttendanceReducer = (state: Store_VirtualFairAttendanceData = INITIAL_STATE, action: any): Store_VirtualFairAttendanceData => {
  switch(action.type) {
    case virtualFairAttendanceActionTypes.FETCH_VIRTUAL_FAIR_ATTENDANCE__SUCCESS:
      return {...state, ...action.payload};
    case virtualFairAttendanceActionTypes.SET_VIRTUAL_FAIR_ATTENDANCE_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default virtualFairAttendanceReducer;
