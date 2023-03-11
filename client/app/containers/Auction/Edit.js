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

class Edit extends React.PureComponent {
  componentDidMount() {
    this.props.resetAuction();
    const productId = this.props.match.params.id;
    this.props.fetchAuction(productId);
    this.props.fetchBrandsSelect();
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
      auctionEditChange,
      updateAuction,
      deleteAuction,
      activateAuction
    } = this.props;

    return (
      <SubPage
        title='Edit Auction'
        actionTitle='Cancel'
        handleAction={history.goBack}
      >
        {product?._id ? (
          <EditAuction
            user={user}
            product={product}
            formErrors={formErrors}
            brands={brands}
            auctionChange={auctionEditChange}
            updateAuction={updateAuction}
            deleteAuction={deleteAuction}
            activateAuction={activateAuction}
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
    product: state.auction.auction,
    formErrors: state.auction.editFormErrors,
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
//   const {auction} = useSelector((state) => state.auction);
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
//           product={auction}
//           formErrors={formErrors}
//           brands={brands}
//           auctionChange={auctionEditChange}
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

