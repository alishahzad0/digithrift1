/**
 *
 * ResetPasswordForm
 *
 */

import React, { useState } from "react";

import { Row, Col } from "reactstrap";
import axios from "axios";
import { error, success } from "react-notification-system-redux";

import Input from "../Input";
import Button from "../Button";
import { fetchProfile } from "../../../containers/Account/actions";
import { useDispatch } from "react-redux";
//import { Document, Page } from "react-pdf";

const ResetPasswordForm = (props) => {
  const [cnic, setcnic] = useState(null);
  const [bs, setbs] = useState(null);
  const [frb, setfrb] = useState(null);
  const [ntn, setntn] = useState(null);
  const [wgc, setwgc] = useState(null);
  const [sl, setsl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const dispatch = useDispatch();

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cnic && bs && frb && ntn && wgc && sl) {
      const formData = new FormData();
      formData.set("cnic", cnic);
      formData.set("bs", bs);
      formData.set("frb", frb);
      formData.set("ntn", ntn);
      formData.set("wgc", wgc);
      formData.set("sl", sl);

      const response = await axios.post(`/api/user/uploadDocument`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: "tr",
        autoDismiss: 1,
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch(fetchProfile());
      }
    } else {
      const successfulOptions = {
        title: `Please Upload All Document`,
        position: "tr",
        autoDismiss: 1,
      };

      dispatch(error(successfulOptions));
    }
  };

  return (
    <div className="reset-password-form">
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs="12" md="12">
            <label>CNIC</label>
            <input
              type="file"
              onChange={(e) => setcnic(e.target.files[0])}
              required
            />
          </Col>
          <Col xs="12" md="12">
            <label>Bank Statement</label>
            <input
              type="file"
              onChange={(e) => setbs(e.target.files[0])}
              required
            />
          </Col>
          <Col xs="12" md="12">
            <label>FBR Document</label>
            <input
              type="file"
              onChange={(e) => setfrb(e.target.files[0])}
              required
            />
          </Col>
          <Col xs="12" md="12">
            <label>NTN Document</label>
            <input
              type="file"
              onChange={(e) => setntn(e.target.files[0])}
              required
            />
          </Col>
          <Col xs="12" md="12">
            <label>Witnessor Garneter CNIC</label>
            <input
              type="file"
              onChange={(e) => setwgc(e.target.files[0])}
              required
            />
          </Col>
          <Col xs="12" md="12">
            <label>Store Letterhead</label>
            <input
              type="file"
              onChange={(e) => setsl(e.target.files[0])}
              required
            />
          </Col>
        </Row>
        <hr />
        <div className="reset-actions">
          <Button type="submit" text="Upload Document" />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
