/*
 *
 * Category actions
 *
 */

import { goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_CATEGORIES,
  SET_CATEGORIES_LOADING,
} from './constants';

import handleError from '../../utils/error';

// fetch categories api
export const fetchDocumentUser = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_CATEGORIES_LOADING, payload: true });
      const response = await axios.get(`/api/user/document`);

      dispatch({
        type: FETCH_CATEGORIES,
        payload: response.data.user
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_CATEGORIES_LOADING, payload: false });
    }
  };
};

export const verifyDocumentUser = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_CATEGORIES_LOADING, payload: true });
      const response = await axios.get(`/api/user/document`);

      dispatch({
        type: FETCH_CATEGORIES,
        payload: response.data.user
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_CATEGORIES_LOADING, payload: false });
    }
  };
};



