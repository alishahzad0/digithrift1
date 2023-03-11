/*
 *
 * Category reducer
 *
 */

import {
  FETCH_CATEGORIES,
  SET_CATEGORIES_LOADING
} from './constants';

const initialState = {
  userDocument: [],
  isLoading: false
};

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        userDocument: action.payload
      };
      case SET_CATEGORIES_LOADING:
        return {
          ...state,
          isLoading: action.payload
        };
    default:
      return state;
  }
};

export default documentReducer;
