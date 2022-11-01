import { combineReducers } from "redux";
import { reducer as formReducer} from "redux-form";
import userReducer from "./userReducer";
import authReducer from "./authReducer";
import companyReducer from "./companyReducer";

const rootReducer = combineReducers ({
  users: userReducer,
  form: formReducer,
  auth: authReducer,
  companies: companyReducer,
});

export default rootReducer;
