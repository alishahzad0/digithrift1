/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddAuction from '../../components/Manager/AddAuction';
import AddTender from '../../components/Manager/AddTender';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    //this.props.fetchBrandsSelect();
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      //brands,
      tenderChange,
      addTender
    } = this.props;

    return (
      <SubPage
        title='Add Tender'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddTender
          user={user}
          productFormData={productFormData}
          formErrors={formErrors}
          //brands={brands}
          tenderChange={tenderChange}
          addTender={addTender}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.tender.productFormData,
    formErrors: state.tender.formErrors,
    //brands: state.brand.brandsSelect
  };
};

export default connect(mapStateToProps, actions)(Add);
