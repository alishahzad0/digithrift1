/*
 *
 * List
 *
 */

import React, { useEffect } from "react";

import { connect, useDispatch, useSelector } from "react-redux";

import actions from "../../actions";

import CategoryList from "../../components/Manager/CategoryList";
import SubPage from "../../components/Manager/SubPage";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import NotFound from "../../components/Common/NotFound";
import { Button, Table } from "reactstrap";
import { fetchDocumentUser } from "./actions";
import { fetchProfile } from "../Account/actions";
import { success } from "react-notification-system-redux";
import axios from "axios";

const List = () => {
  const {userDocument} = useSelector((state) => state.document);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDocumentUser());
  },[])
  const handleVerify = async (id) => {
    const response = await axios.get(`/api/user/DocumentVerify/${id}`);

    const successfulOptions = {
      title: `${response.data.message}`,
      position: 'tr',
      autoDismiss: 1
    };

    if (response.data.success === true) {
      dispatch(success(successfulOptions));
      dispatch(fetchProfile());
      dispatch(fetchDocumentUser());
    }
  }

  const handleDocument = (item) => {
    console.log();
    const link = document.createElement('a');
    link.href = `http://localhost:8080/uploads/documents/${item.CNIC}`;
    link.setAttribute('download', `${item.CNIC}`);
    document.body.appendChild(link);
    link.click();
    link.href = `http://localhost:8080/uploads/documents/${item.BS}`;
    link.setAttribute('download', `${item.BS}`);
    document.body.appendChild(link);
    link.click();
    link.href = `http://localhost:8080/uploads/documents/${item.WGC}`;
    link.setAttribute('download', `${item.WGC}`);
    document.body.appendChild(link);
    link.click();
    link.href = `http://localhost:8080/uploads/documents/${item.FBR}`;
    link.setAttribute('download', `${item.FBR}`);
    document.body.appendChild(link);
    link.click();
    link.href = `http://localhost:8080/uploads/documents/${item.NTN}`;
    link.setAttribute('download', `${item.NTN}`);
    document.body.appendChild(link);
    link.click();
    link.href = `http://localhost:8080/uploads/documents/${item.SL}`;
    link.setAttribute('download', `${item.SL}`);
    document.body.appendChild(link);
    link.click();
    
  }
  return (
    <>
        <SubPage title="Verify User">
          <Table responsive>
            <thead>
              <tr>
                <th>No.</th>
                <th>User name</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {userDocument?.map((item,index) => { return <tr>
                <th scope="row">{index+1}</th>
                <td>{item?.user.firstName+" "+item?.user.lastName} </td>
                <td><button onClick={() => handleDocument(item)}>Document</button></td>
                <td>{item?.user?.verifyDocument ? <span className="text-success" >Document Verify</span> :  <button className="bg-primary rounded text-light" onClick={() => {handleVerify(item?.user?._id)}}>Verify</button>}</td>
              </tr>})}
              
           </tbody>
          </Table>
        </SubPage>
      </>
  );
}

export default List;

