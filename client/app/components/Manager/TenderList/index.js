/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

const TenderList = props => {
  const { products } = props;

  return (
    <div className='p-list'>
      {products.map((product, index) => (
        <Link
          to={`/dashboard/tender/edit/${product._id}`}
          key={index}
          className='d-flex flex-row align-items-center mx-0 mb-3 product-box'
        >
          <img
            className='item-image'
            src={`${
              product && product.imageUrl
                ? `http://localhost:8080/uploads/images/${product.imageUrl}`
                : '/images/placeholder-image.png'
            }`}
          />
          <div className='d-flex flex-column justify-content-center px-3 text-truncate'>
            <h4 className='text-truncate'>{product.name}</h4>
            <p className='mb-2 text-truncate'>{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TenderList;
