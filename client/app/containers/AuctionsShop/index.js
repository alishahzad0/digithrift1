/**
 *
 * ProductsShop
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import AuctionList from '../../components/Store/AuctionList';

class ProductsShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterAuctions(slug);
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist } = this.props;

    const displayProducts = products && products.length > 0;

    return (
      <div className='products-shop'>
        {isLoading && <LoadingIndicator />}
        {displayProducts && (
          <AuctionList
            products={products}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
          />
        )}
        {!isLoading && !displayProducts && (
          <NotFound message='No products found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.auction.storeAuctions,
    isLoading: state.auction.isLoading,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(ProductsShop);
