/*
 *
 * Auction actions
 *
 */

import { goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

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
  RESET_AUCTION,
  ADD_AUCTION,
  REMOVE_AUCTION,
  FETCH_AUCTIONS_SELECT,
  SET_AUCTIONS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS
} from './constants';

import { ROLES } from '../../constants';
import handleError from '../../utils/error';
import { formatSelectOptions, unformatSelectOptions } from '../../utils/select';
import { allFieldsValidation } from '../../utils/validation';

export const auctionChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: AUCTION_CHANGE,
    payload: formData
  };
};

export const auctionEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: AUCTION_EDIT_CHANGE,
    payload: formData
  };
};

export const auctionShopChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: AUCTION_SHOP_CHANGE,
    payload: formData
  };
};

export const resetAuction = () => {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_AUCTION });
  };
};

export const setAuctionLoading = value => {
  return {
    type: SET_AUCTIONS_LOADING,
    payload: value
  };
};

// fetch store auctions by filterAuctions api
export const filterAuctions = (n, v) => {
  return async (dispatch, getState) => {
    try {
      n ?? dispatch({ type: RESET_ADVANCED_FILTERS });

      dispatch(setAuctionLoading(true));
      const advancedFilters = getState().product.advancedFilters;
      let payload = auctionsFilterOrganizer(n, v, advancedFilters);
      dispatch({ type: SET_ADVANCED_FILTERS, payload });
      const sortOrder = getSortOrder(payload.order);
      payload = { ...payload, sortOrder };

      const response = await axios.get(`/api/auction/list`, {
        params: {
          ...payload
        }
      });
      const { products, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_STORE_AUCTIONS,
        payload: products
      });

      const newPayload = {
        ...payload,
        totalPages,
        currentPage,
        count
      };
      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: newPayload
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setAuctionLoading(false));
    }
  };
};

// fetch store product api
export const fetchStoreAuction = slug => {
  return async (dispatch, getState) => {
    dispatch(setAuctionLoading(true));

    try {
      const response = await axios.get(`/api/auction/item/${slug}`);

      const inventory = response.data.product.quantity;
      const product = { ...response.data.product, inventory };

      dispatch({
        type: FETCH_STORE_AUCTION,
        payload: product
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setAuctionLoading(false));
    }
  };
};

export const fetchBrandAuctions = slug => {
  return async (dispatch, getState) => {
    try {
      dispatch(setAuctionLoading(true));

      const response = await axios.get(`/api/auction/list/brand/${slug}`);

      const s = getState().product.advancedFilters;
      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: Object.assign(s, {
          pages: response.data.pages,
          pageNumber: response.data.page,
          totalProducts: response.data.totalProducts
        })
      });
      dispatch({
        type: FETCH_STORE_AUCTIONS,
        payload: response.data.products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setAuctionLoading(false));
    }
  };
};

export const fetchAuctionsSelect = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/auction/list/select`);

      const formattedProducts = formatSelectOptions(response.data.products);

      dispatch({
        type: FETCH_AUCTIONS_SELECT,
        payload: formattedProducts
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch products api
export const fetchAuctions = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setAuctionLoading(true));

      const response = await axios.get(`/api/auction`);
      console.log(response.data.products,"Sdsdsd");
      dispatch({
        type: FETCH_AUCTIONS,
        payload: response.data.products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setAuctionLoading(false));
    }
  };
};

// fetch product api
export const fetchAuction = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/auction/${id}`);

      const inventory = response.data.product.quantity;

      const brand = response.data.product.brand;
      const isBrand = brand ? true : false;
      const brandData = formatSelectOptions(
        isBrand && [brand],
        !isBrand,
        'fetchAuction'
      );

      response.data.product.brand = brandData[0];

      const product = { ...response.data.product, inventory };

      dispatch({
        type: FETCH_AUCTION,
        payload: product
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const addBid = id => {
  return async (dispatch, getState) => {
    try {
      const {amount} = getState().auction.productShopData;
      const formData = new FormData();
      formData.set("amount", amount);
      const response = await axios.post(`/api/auction/bid/${id}`,{amount: amount});


      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      console.log(response);

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: FETCH_STORE_AUCTIONS,
          payload: response.data.product
        });
      }

      // const inventory = response.data.product.quantity;

      // const brand = response.data.product.brand;
      // const isBrand = brand ? true : false;
      // const brandData = formatSelectOptions(
      //   isBrand && [brand],
      //   !isBrand,
      //   'fetchAuction'
      // );

      // response.data.product.brand = brandData[0];

      // const product = { ...response.data.product, inventory };

      // dispatch({
      //   type: FETCH_AUCTION,
      //   payload: product
      // });
    } catch (error) {
      console.log(error);
      handleError(error, dispatch);
    }
  };
};

// add product api
export const addAuction = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required',
        description: 'required|max:200',
        duration: 'required|numeric',
        price: 'required|numeric',
        image: 'required',
        brand: 'required'
      };

      const product = getState().auction.productFormData;
      const user = getState().account.user;
      const brands = getState().brand.brandsSelect;

      const brand = unformatSelectOptions([product.brand]);

      const newAuction = {
        name: product.name,
        description: product.description,
        price: product.price,
        duration: product.duration,
        image: product.image,
        brand:
          user.role !== ROLES.Merchant
            ? brand != 0
              ? brand
              : null
            : brands[1].value
      };

      const { isValid, errors } = allFieldsValidation(newAuction, rules, {
        'required.sku': 'Sku is required.',
        'alpha_dash.sku':
          'Sku may have alpha-numeric characters, as well as dashes and underscores only.',
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description':
          'Description may not be greater than 200 characters.',
        'required.duration': 'Duration is required.',
        'required.price': 'Price is required.',
        'required.taxable': 'Taxable is required.',
        'required.image': 'Please upload files with jpg, jpeg, png format.',
        'required.brand': 'Brand is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_AUCTION_FORM_ERRORS, payload: errors });
      }
      const formData = new FormData();
      if (newAuction.image) {
        for (const key in newAuction) {
          if (newAuction.hasOwnProperty(key)) {
            if (key === 'brand' && newAuction[key] === null) {
              continue;
            } else {
              formData.set(key, newAuction[key]);
            }
          }
        }
      }

      const response = await axios.post(`/api/auction/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: ADD_AUCTION,
          payload: response.data.product
        });
        dispatch(resetAuction());
        dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// update Auction api
export const updateAuction = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required',
        description: 'required|max:200',
        duration: 'required|numeric',
        price: 'required|numeric',
        brand: 'required'
      };

      const product = getState().auction.auction;

      const brand = unformatSelectOptions([product.brand]);

      const newAuction = {
        name: product.name,
        description: product.description,
        duration: product.duration,
        price: product.price,
        brand: brand != 0 ? brand : null
      };

      const { isValid, errors } = allFieldsValidation(newAuction, rules, {
        'required.name': 'Name is required.',
        'required.sku': 'Sku is required.',
        'alpha_dash.sku':
          'Sku may have alpha-numeric characters, as well as dashes and underscores only.',
        'required.slug': 'Slug is required.',
        'alpha_dash.slug':
          'Slug may have alpha-numeric characters, as well as dashes and underscores only.',
        'required.description': 'Description is required.',
        'max.description':
          'Description may not be greater than 200 characters.',
        'required.quantity': 'Quantity is required.',
        'required.price': 'Price is required.',
        'required.taxable': 'Taxable is required.',
        'required.brand': 'Brand is required.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_AUCTION_FORM_EDIT_ERRORS,
          payload: errors
        });
      }

      const response = await axios.put(`/api/auction/${product._id}`, {
        product: newAuction
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));

        //dispatch(goBack());
      }
    } catch (error) {
      
      handleError(error, dispatch);
    }
  };
};

// activate product api
export const activateAuction = (id, value) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(`/api/auction/${id}/active`, {
        product: {
          isActive: value
        }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// delete product api
export const deleteAuction = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`/api/auction/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: REMOVE_AUCTION,
          payload: id
        });
        dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

const auctionsFilterOrganizer = (n, v, s) => {
  switch (n) {
    case 'category':
      return {
        name: s.name,
        category: v,
        brand: s.brand,
        min: s.min,
        max: s.max,
        rating: s.rating,
        order: s.order,
        page: s.currentPage,
        limit: s.limit
      };
    case 'brand':
      return {
        name: s.name,
        category: s.category,
        brand: v,
        min: s.min,
        max: s.max,
        rating: s.rating,
        order: s.order,
        page: s.currentPage,
        limit: s.limit
      };
    case 'sorting':
      return {
        name: s.name,
        category: s.category,
        brand: s.brand,
        min: s.min,
        max: s.max,
        rating: s.rating,
        order: v,
        page: s.currentPage,
        limit: s.limit
      };
    case 'price':
      return {
        name: s.name,
        category: s.category,
        brand: s.brand,
        min: v[0],
        max: v[1],
        rating: s.rating,
        order: s.order,
        page: s.currentPage,
        limit: s.limit
      };
    case 'rating':
      return {
        name: s.name,
        category: s.category,
        brand: s.brand,
        min: s.min,
        max: s.max,
        rating: v,
        order: s.order,
        page: s.currentPage,
        limit: s.limit
      };
    case 'pagination':
      return {
        name: s.name,
        category: s.category,
        brand: s.brand,
        min: s.min,
        max: s.max,
        rating: s.rating,
        order: s.order,
        page: v ?? s.currentPage,
        limit: s.limit
      };
    default:
      return {
        name: s.name,
        category: s.category,
        brand: s.brand,
        min: s.min,
        max: s.max,
        rating: s.rating,
        order: s.order,
        page: s.currentPage,
        limit: s.limit
      };
  }
};

const getSortOrder = value => {
  let sortOrder = {};
  switch (value) {
    case 0:
      sortOrder._id = -1;
      break;
    case 1:
      sortOrder.price = -1;
      break;
    case 2:
      sortOrder.price = 1;
      break;

    default:
      break;
  }

  return sortOrder;
};
