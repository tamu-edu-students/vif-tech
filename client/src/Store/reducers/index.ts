import { combineReducers } from "redux";
import { reducer as formReducer} from "redux-form";
import userReducer from './userReducer';
import authReducer, { Store_Auth } from './authReducer';
import allowlistReducer, { Store_Allowlist } from './allowlistReducer';
import companyReducer from './companyReducer';
import modalReducer, { Store_Modal } from './modalReducer';
import faqReducer from "./faqReducer";

import Company from "Shared/entityClasses/Company";
import User from "Shared/entityClasses/User";

export interface IRootState {
  users: User[];
  form: any;
  auth: Store_Auth;
  allowlist: Store_Allowlist;
  companies: Company[];
  modal: Store_Modal;
  faqs: IFAQ[];
}

const rootReducer = combineReducers<IRootState> ({
  users: userReducer,
  form: formReducer,
  auth: authReducer,
  allowlist: allowlistReducer,
  companies: companyReducer,
  modal: modalReducer,
  faqs: faqReducer,
});

export default rootReducer;
