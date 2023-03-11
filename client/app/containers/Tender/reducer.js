/*
 *
 * Product reducer
 *
 */

import {
  FETCH_TENDERS,
  FETCH_STORE_TENDERS,
  FETCH_TENDER,
  FETCH_STORE_TENDER,
  TENDER_CHANGE,
  TENDER_EDIT_CHANGE,
  TENDER_SHOP_CHANGE,
  SET_TENDER_FORM_ERRORS,
  SET_TENDER_FORM_EDIT_ERRORS,
  SET_TENDER_SHOP_FORM_ERRORS,
  RESET_TENDER,
  RESET_TENDER_SHOP,
  ADD_TENDER,
  REMOVE_TENDER,
  FETCH_TENDERS_SELECT,
  SET_TENDERS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS
} from './constants';

const initialState = {
  tenders: [],
  storeAuctions: [],
  tender: {
    _id: ''
  },
  storeAuction: {},
  productsSelect: [],
  productFormData: {
    name: '',
    description: '',
    duration: 1,
    price: 1,
    startingDate: '',
    endingDate: '',
    image: {},
  },
  isLoading: false,
  productShopData: {
    amount: 1
  },
  formErrors: {},
  editFormErrors: {},
  shopFormErrors: {},
  advancedFilters: {
    name: 'all',
    category: 'all',
    brand: 'all',
    min: 1,
    max: 2500,
    rating: 0,
    order: 0,
    totalPages: 1,
    currentPage: 1,
    count: 0,
    limit: 10
  }
};

const tenderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TENDERS:
      return {
        ...state,
        tenders: action.payload
      };
    case FETCH_STORE_TENDERS:
      return {
        ...state,
        storeAuctions: action.payload
      };
    case FETCH_TENDER:
      return {
        ...state,
        tender: action.payload,
        editFormErrors: {}
      };
    case FETCH_STORE_TENDER:
      return {
        ...state,
        storeAuction: action.payload,
        productShopData: {
          quantity: 1
        },
        shopFormErrors: {}
      };
    case SET_TENDERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_TENDERS_SELECT:
      return { ...state, productsSelect: action.payload };
    case ADD_TENDER:
      return {
        ...state,
        tenders: [...state.tenders, action.payload]
      };
    case REMOVE_TENDER:
      const index = state.tenders.findIndex(b => b._id === action.payload);
      return {
        ...state,
        tenders: [
          ...state.tenders.slice(0, index),
          ...state.tenders.slice(index + 1)
        ]
      };
    case TENDER_CHANGE:
      return {
        ...state,
        productFormData: {
          ...state.productFormData,
          ...action.payload
        }
      };
    case TENDER_EDIT_CHANGE:
      return {
        ...state,
        tender: {
          ...state.tender,
          ...action.payload
        }
      };
    case TENDER_SHOP_CHANGE:
      return {
        ...state,
        productShopData: {
          ...state.productShopData,
          ...action.payload
        }
      };
    case SET_TENDER_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_TENDER_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case SET_TENDER_SHOP_FORM_ERRORS:
      return {
        ...state,
        shopFormErrors: action.payload
      };
    case RESET_TENDER:
      return {
        ...state,
        productFormData: {
          name: '',
          description: '',
          quantity: 1,
          price: 1,
          startingDate: '',
          endingDate: '',
          image: {},
        },
        tender: {
          _id: ''
        },
        formErrors: {}
      };
    case RESET_TENDER_SHOP:
      return {
        ...state,
        productShopData: {
          quantity: 1
        },
        shopFormErrors: {}
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case RESET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          name: 'all',
          category: 'all',
          brand: 'all',
          min: 1,
          max: 2500,
          rating: 0,
          order: 0,
          totalPages: 1,
          currentPage: 1,
          count: 0,
          limit: 10
        }
      };
    default:
      return state;
  }
};

export default tenderReducer;
