import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from "redux-thunk";

import reducers, {IRootState} from "./reducers";

const createPreconfiguredStore = (initialState?: any) => createStore<IRootState, any, any, any>(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default createPreconfiguredStore;
