import {
  SHOW_MODAL,
  HIDE_MODAL,
 } from "Store/actions/types";

export interface Store_Modal {
  shouldRender: boolean;
  children: JSX.Element | null;
  handlers: {onDismiss?: Function, onShow?: Function};
}

const INITIAL_STATE: Store_Modal = {
  shouldRender: false,
  children: null,
  handlers: {onDismiss: () => {}, onShow: () => {}},
};

const modalReducer = (state: Store_Modal = INITIAL_STATE, action: any): Store_Modal => {
  switch(action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        shouldRender: true,
        children: action.payload.children,
        handlers: action.payload.handlers ?? INITIAL_STATE.handlers,
      };
    case HIDE_MODAL:
      return {
        ...state,
        shouldRender: false,
        children: null,
        handlers: INITIAL_STATE.handlers,
      };
    default:
      return state;
  }
}

export default modalReducer;
