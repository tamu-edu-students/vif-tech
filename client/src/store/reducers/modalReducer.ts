import {
  SHOW_MODAL,
  HIDE_MODAL,
 } from "../actions/types";

export interface Store_Modal {
  shouldRender: boolean;
  children: JSX.Element | null;
}

const INITIAL_STATE: Store_Modal = {
  shouldRender: false,
  children: null,
};

const modalReducer = (state: Store_Modal = INITIAL_STATE, action: any): Store_Modal => {
  switch(action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        shouldRender: true,
        children: action.payload,
      };
    case HIDE_MODAL:
      return {
        ...state,
        shouldRender: false,
        children: null,
      };
    default:
      return state;
  }
}

export default modalReducer;
