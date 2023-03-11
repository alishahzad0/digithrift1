/*
 *
 * Edit
 *
 */

import React, { useEffect, useState } from "react";

import { connect, useDispatch, useSelector } from "react-redux";


import actions from '../../actions';

import EditProduct from '../../components/Manager/EditProduct';
import SubPage from '../../components/Manager/SubPage';
import NotFound from '../../components/Common/NotFound';
import EditAuction from "../../components/Manager/EditAuction";
import EditTender from "../../components/Manager/EditTender";

class Edit extends React.PureComponent {
  componentDidMount() {
    this.props.resetAuction();
    const productId = this.props.match.params.id;
    this.props.fetchAuction(productId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetAuction();
      const productId = this.props.match.params.id;
      this.props.fetchAuction(productId);
    }
  }

  render() {
    const {
      history,
      user,
      product,
      formErrors,
      brands,
      tenderEditChange,
      updateTender,
      deleteTender,
    } = this.props;

    return (
      <SubPage
        title='Edit Tender'
        actionTitle='Cancel'
        handleAction={history.goBack}
      >
        {product?._id ? (
          <EditTender
            user={user}
            product={product}
            formErrors={formErrors}
            tenderChange={tenderEditChange}
            updateTender={updateTender}
            deleteTender={deleteTender}
          />
        ) : (
          <NotFound message='No product found.' />
        )}
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    product: state.tender.tender,
    formErrors: state.tender.editFormErrors,
    brands: state.brand.brandsSelect
  };
};

export default connect(mapStateToProps, actions)(Edit);


// import React from 'react'
// import { fetchAuction, resetAuction } from "./actions";
// import { fetchBrandsSelect } from "../Brand/actions";

// export default function Edit() {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   //const [isLoading, setLoading] = useState(false);
//   const {tender} = useSelector((state) => state.tender);
//   useEffect(() => {
//     dispatch(resetAuction());
//     dispatch(fetchAuction());
//     dispatch(fetchBrandsSelect());
//     //setLoading(isLoading);
//   }, []);
//   return (
//     <SubPage
//       title='Edit Product'
//       actionTitle='Cancel'
//       handleAction={history.goBack}
//     >
//       {product?._id ? (
//         <EditProduct
//           user={user}
//           product={tender}
//           formErrors={formErrors}
//           brands={brands}
//           tenderChange={tenderEditChange}
//           updateAuction={updateAuction}
//           deleteAuction={deleteAuction}
//           activateAuction={activateAuction}
//         />
//       ) : (
//         <NotFound message='No product found.' />
//       )}
//     </SubPage>
//   );
// }

