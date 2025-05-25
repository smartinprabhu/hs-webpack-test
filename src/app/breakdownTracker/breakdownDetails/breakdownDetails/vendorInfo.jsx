/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'reactstrap';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const vendorInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Vendor Name
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.vendor_name)}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Complaint No
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.complaint_no)}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Vendor FSR Number (Field Service Number)
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.vendor_sr_number)}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

vendorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default vendorInfo;
