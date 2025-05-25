/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../util/appUtils';

const VendorInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Vendor</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.vendor_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Vendor POC</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.vendor_poc)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Vendor Email</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 word-break-content">{getDefaultNoValue(detailData.vendor_email)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Vendor Mobile</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.vendor_mobile)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">No of Vendor Technicians</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{detailData.no_vendor_technicians}</span>
        </Row>
        <p className="mt-2" />
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
