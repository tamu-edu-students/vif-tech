import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { Store } from "redux";
import thunk from "redux-thunk";

import reducers, {IRootState} from "./reducers";

const createPreconfiguredStore = (initialState?: any) => createStore<IRootState, any, any, any>(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export const store: Store<IRootState> = createPreconfiguredStore();
