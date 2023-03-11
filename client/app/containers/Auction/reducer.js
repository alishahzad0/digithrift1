/*
 *
 * Product reducer
 *
 */

import {
  FETCH_AUCTIONS,
  FETCH_STORE_AUCTIONS,
  FETCH_AUCTION,
  FETCH_STORE_AUCTION,
  AUCTION_CHANGE,
  AUCTION_EDIT_CHANGE,
  AUCTION_SHOP_CHANGE,
  SET_AUCTION_FORM_ERRORS,
  SET_AUCTION_FORM_EDIT_ERRORS,
  SET_AUCTION_SHOP_FORM_ERRORS,
  RESET_AUCTION,
  RESET_AUCTION_SHOP,
  ADD_AUCTION,
  REMOVE_AUCTION,
  FETCH_AUCTIONS_SELECT,
  SET_AUCTIONS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS
} from './constants';

const initialState = {
  auctions: [],
  storeAuctions: [],
  auction: {
    _id: ''
  },
  storeAuction: {},
  productsSelect: [],
  productFormData: {
    name: '',
    description: '',
    duration: 1,
    price: 1,
    image: {},
    brand: {
      value: 0,
      label: 'No Options Selected'
    }
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

const auctionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUCTIONS:
      return {
        ...state,
        auctions: action.payload
      };
    case FETCH_STORE_AUCTIONS:
      return {
        ...state,
        storeAuctions: action.payload
      };
    case FETCH_AUCTION:
      return {
        ...state,
        auction: action.payload,
        editFormErrors: {}
      };
    case FETCH_STORE_AUCTION:
      return {
        ...state,
        storeAuction: action.payload,
        productShopData: {
          quantity: 1
        },
        shopFormErrors: {}
      };
    case SET_AUCTIONS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_AUCTIONS_SELECT:
      return { ...state, productsSelect: action.payload };
    case ADD_AUCTION:
      return {
        ...state,
        auctions: [...state.auctions, action.payload]
      };
    case REMOVE_AUCTION:
      const index = state.auctions.findIndex(b => b._id === action.payload);
      return {
        ...state,
        auctions: [
          ...state.auctions.slice(0, index),
          ...state.auctions.slice(index + 1)
        ]
      };
    case AUCTION_CHANGE:
      return {
        ...state,
        productFormData: {
          ...state.productFormData,
          ...action.payload
        }
      };
    case AUCTION_EDIT_CHANGE:
      return {
        ...state,
        auction: {
          ...state.auction,
          ...action.payload
        }
      };
    case AUCTION_SHOP_CHANGE:
      return {
        ...state,
        productShopData: {
          ...state.productShopData,
          ...action.payload
        }
      };
    case SET_AUCTION_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_AUCTION_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case SET_AUCTION_SHOP_FORM_ERRORS:
      return {
        ...state,
        shopFormErrors: action.payload
      };
    case RESET_AUCTION:
      return {
        ...state,
        productFormData: {
          sku: '',
          name: '',
          description: '',
          quantity: 1,
          price: 1,
          image: {},
          isActive: true,
          taxable: { value: 0, label: 'No' },
          brand: {
            value: 0,
            label: 'No Options Selected'
          }
        },
        auction: {
          _id: ''
        },
        formErrors: {}
      };
    case RESET_AUCTION_SHOP:
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

export default auctionReducer;
