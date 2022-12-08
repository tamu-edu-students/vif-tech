import { combineReducers } from "redux";
import { reducer as formReducer} from "redux-form";
import userReducer, { Store_UserData } from './userReducer';
import authReducer, { Store_Auth } from './authReducer';
import allowlistReducer, { Store_Allowlist } from './allowlistReducer';
import companyReducer, { Store_CompanyData } from './companyReducer';
import eventReducer, { Store_EventData } from "./eventReducer";
import virtualFairMeetingReducer, { Store_VirtualFairMeetingData } from "./virtualFairMeetingsReducer";
import eventSignupReducer, { Store_EventSignupData } from "./eventSignupReducer";
import meetingReducer, { Store_MeetingData } from "./meetingReducer";
import focusReducer, { Store_FocusData } from "./focusReducer";
import userFocusReducer, { Store_UserFocusData } from "./userFocusReducer";
import companyFocusReducer, { Store_CompanyFocusData } from "./companyFocusReducer";
import modalReducer, { Store_Modal } from './modalReducer';
import faqReducer from "./faqReducer";
import loadingReducer from "./loadingReducer";
import errorReducer from "./errorReducer";

import FAQ from "Shared/entityClasses/FAQ";

export interface IRootState {
  userData: Store_UserData;
  form: any;
  auth: Store_Auth;
  allowlist: Store_Allowlist;
  companyData: Store_CompanyData;
  eventData: Store_EventData;
  eventSignupData: Store_EventSignupData;
  virtualFairMeetingData: Store_VirtualFairMeetingData;
  meetingData: Store_MeetingData;
  focusData: Store_FocusData;
  userFocusData: Store_UserFocusData;
  companyFocusData: Store_CompanyFocusData;
  modal: Store_Modal;
  faqs: FAQ[];
  loading: any;
  errors: any;
}

const rootReducer = combineReducers<IRootState> ({
  userData: userReducer,
  form: formReducer,
  auth: authReducer,
  allowlist: allowlistReducer,
  companyData: companyReducer,
  eventData: eventReducer,
  eventSignupData: eventSignupReducer,
  virtualFairMeetingData: virtualFairMeetingReducer,
  meetingData: meetingReducer,
  focusData: focusReducer,
  userFocusData: userFocusReducer,
  companyFocusData: companyFocusReducer,
  modal: modalReducer,
  faqs: faqReducer,
  loading: loadingReducer,
  errors: errorReducer,
});

export default rootReducer;
