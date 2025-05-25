/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  numToFloat,
} from '../../../../util/appUtils';

const VendorInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Reorder Level
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(numToFloat(detailData.reordering_min_qty))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Reorder Quantity
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700">
              {' '}
              {getDefaultNoValue(numToFloat(detailData.reordering_max_qty))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Alert Level
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(numToFloat(detailData.alert_level_qty))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
      </>
    )
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
