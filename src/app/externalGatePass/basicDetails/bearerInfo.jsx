/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  getLocalTime,
} from '../../util/appUtils';

const BearerInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Name
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.name)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Email
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700">
              {getDefaultNoValue(detailData.email)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Mobile
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.mobile)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        {detailData.type && detailData.type !== 'Non-Returnable'
          ? (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  To be Returned on
                </span>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">
                    {getDefaultNoValue(getLocalTime(detailData.to_be_returned_on))}
                  </span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )
          : ''}
      </>
    )
  );
};

BearerInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default BearerInfo;
