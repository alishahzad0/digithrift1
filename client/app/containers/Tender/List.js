/*
 *
 * List
 *
 */

import React, { useEffect, useState } from "react";

import { connect, useDispatch, useSelector } from "react-redux";

import actions from "../../actions";

import ProductList from "../../components/Manager/ProductList";
import SubPage from "../../components/Manager/SubPage";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import NotFound from "../../components/Common/NotFound";
import { fetchAuction, fetchAuctions } from "./actions";
import { useHistory } from "react-router-dom";
import AuctionList from "../../components/Manager/AuctionList";
import TenderList from "../../components/Manager/TenderList";

// class List extends React.PureComponent {
//   componentDidMount() {
//     this.props.fetchAuctions();
//   }

//   render() {
//     const { history, products, isLoading } = this.props;
//     console.log(products);
//     return (
//       <>
//         <SubPage
//           title="Auction"
//           actionTitle="Add"
//           handleAction={() => history.push("/dashboard/tender/add")}
//         >
//           {isLoading ? (
//             <LoadingIndicator inline />
//           ) : products.length > 0 ? (
//             <ProductList products={products} />
//           ) : (
//             <NotFound message="No products found." />
//           )}
//         </SubPage>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     products: state.product.products,
//     isLoading: state.product.isLoading,
//     user: state.account.user,
//   };
// };

// export default connect(mapStateToProps, actions)(List);

export default function List() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const {tenders} = useSelector((state) => state.tender);
  useEffect(() => {
    dispatch(fetchAuctions());
    setLoading(isLoading);
  }, []);
  return (
    <>
      <SubPage
        title="Auction"
        actionTitle="Add"
        handleAction={() => history.push("/dashboard/tender/add")}
      >
        {isLoading ? (
          <LoadingIndicator inline />
        ) : tenders.length > 0 ? (
          <TenderList products={tenders} />
        ) : (
          <NotFound message="No products found." />
        )}
      </SubPage>
    </>
  );
}
