/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddAuction from '../../components/Manager/AddAuction';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      brands,
      auctionChange,
      addAuction
    } = this.props;

    return (
      <SubPage
        title='Add Auction'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddAuction
          user={user}
          productFormData={productFormData}
          formErrors={formErrors}
          brands={brands}
          auctionChange={auctionChange}
          addAuction={addAuction}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.auction.productFormData,
    formErrors: state.auction.formErrors,
    brands: state.brand.brandsSelect
  };
};

export default connect(mapStateToProps, actions)(Add);
