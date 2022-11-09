import { combineReducers } from "redux";
import { reducer as formReducer} from "redux-form";
import userReducer from "./userReducer";
import authReducer from "./authReducer";
import allowlistReducer from "./allowlistReducer";
import companyReducer from "./companyReducer";

const rootReducer = combineReducers ({
  users: userReducer,
  form: formReducer,
  auth: authReducer,
  allowlist: allowlistReducer,
  companies: companyReducer,
});

export default rootReducer;
