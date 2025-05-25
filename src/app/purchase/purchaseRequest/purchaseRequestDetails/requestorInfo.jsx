/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const requestorInfo = () => {
  const {
    requestDetails,
  } = useSelector((state) => state.purchase);

  const detailData = requestDetails && requestDetails.data && requestDetails.data.length > 0 ? requestDetails.data[0] : [];

  return (
    <>
      <Row className="ml-1 mr-1 mt-3">
        <Col sm="12" md="12" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Requestor Name</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.requestor_full_name)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Email</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(detailData.requestor_email)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Site SPOC</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.site_spoc)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Site Contact Details</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.site_contact_details)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Comments</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.comments)}</span>
          </Row>
          <hr className="mt-0" />
        </Col>
        <Col sm="12" md="12" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Requisation Code</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.HS_requisition_id)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Billing Address</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.bill_to_address)}</span>
          </Row>
          <hr className="mt-0" />
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-roman-silver">Shipping Address</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.ship_to_address)}</span>
          </Row>
          <hr className="mt-0" />
        </Col>
      </Row>
    </>
  );
};
export default requestorInfo;
