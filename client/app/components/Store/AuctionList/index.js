/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';

const AuctionList = props => {
  const { products, updateWishlist, authenticated } = props;

  return (
    <div className='product-list'>
      {products.map((product, index) => (
        <div key={index} className='mb-3 mb-md-0'>
          <div className='product-container'>
            <div className='item-box'>

              <div className='item-link'>
                <Link
                  to={`/auctions/${product.name}`}
                  className='d-flex flex-column h-100'
                >
                  <div className='item-image-container'>
                    <div className='item-image-box'>
                      <img
                        className='item-image'
                        src={`${
                          product.imageUrl
                            ? `http://localhost:8080/uploads/images/${product.imageUrl}`
                            : '/images/placeholder-image.png'
                        }`}
                      />
                    </div>
                  </div>
                  <div className='item-body'>
                    <div className='item-details p-3'>
                      <h1 className='item-name'>{product.name}</h1>
                      {product.brand && Object.keys(product.brand).length > 0 && (
                        <p className='by'>
                          By <span>{product.brand.name}</span>
                        </p>
                      )}
                      <p className='item-desc mb-0'>Description: {product.description}</p>
                      <p className='item-desc mb-0'>Duration: {product.duration === 1 ? product.duration+" Day" : product.duration+" Days"}</p>
                      <p className='item-desc mb-0'>Total Bids: {product.bids.length}</p>
                    </div>
                  </div>
                  <div className=' p-3 mb-2 item-footer'>
                    <p className='item-desc mb-0'><b>Base Price: ${product.price}</b></p>
                    <p className='item-desc mb-0'><b>Current Price: ${product.currentPrice}</b></p>
                    {product.totalReviews > 0 && (
                      <p className='mb-0'>
                        <span className='fs-16 fw-normal mr-1'>
                          {parseFloat(product?.averageRating).toFixed(1)}
                        </span>
                        <span
                          className={`fa fa-star ${
                            product.totalReviews !== 0 ? 'checked' : ''
                          }`}
                          style={{ color: '#ffb302' }}
                        ></span>
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
