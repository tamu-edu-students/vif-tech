import { meetingActionTypes } from "Store/actions/types";

import Meeting from "Shared/entityClasses/Meeting";

export interface Store_MeetingData {
  meetings: Meeting[];
  isStale: boolean;
}

const INITIAL_STATE: Store_MeetingData = {
 meetings: [],
  isStale: true,
}

const meetingReducer = (state: Store_MeetingData = INITIAL_STATE, action: any): Store_MeetingData => {
  switch(action.type) {
    case meetingActionTypes.FETCH_MEETINGS__SUCCESS:
      return {...state,meetings: action.payload};
    case meetingActionTypes.CREATE_MEETING__SUCCESS:
      return {...state,meetings: [...state.meetings, action.payload]};
    case meetingActionTypes.DELETE_MEETING__SUCCESS:
      return {
        ...state,
        meetings: state.meetings.filter((meeting: Meeting) => meeting.id !== action.payload)
      }
    case meetingActionTypes.SET_MEETINGS_STALENESS:
      return {...state, isStale: action.payload}
    default:
      return state;
  }
};

export default meetingReducer;
