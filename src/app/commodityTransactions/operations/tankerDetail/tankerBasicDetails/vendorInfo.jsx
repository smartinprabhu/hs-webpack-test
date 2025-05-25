/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../../../util/appUtils';

const VendorInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Vendor
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.vendor_id, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Delivery Challan
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.delivery_challan)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Driver
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span
              className="m-0 p-0 light-text"
            >
              Driver`s Contact
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.driver)}
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.driver_contact)}
            </span>
          </Col>
        </Row>
      </>
      )}
    </>
  );
};

VendorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default VendorInfo;
