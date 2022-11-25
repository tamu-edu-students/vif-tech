import {
  FETCH_FAQS,
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,
} from "Store/actions/types";

const faqReducer = (state: IFAQ[] = [], action: any): IFAQ[] => {
  switch(action.type) {
    case FETCH_FAQS:
      return action.payload;
    case CREATE_FAQ:
      return [...state, action.payload];
    case UPDATE_FAQ:
      return state.map((faq: IFAQ) => faq.id === action.payload.id ? action.payload : faq);
    case DELETE_FAQ:
      return state.filter((faq: IFAQ) => faq.id !== action.payload);
    default:
      return state;
  }
};

export default faqReducer;
