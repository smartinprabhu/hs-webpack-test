/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
  extractNameObject,
} from '../../../util/appUtils';

const RequestorInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Requestor
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(extractNameObject(detailData.requestor_id, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Requested on
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.requested_on, userInfo, 'datetime'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Type
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700">
              {getDefaultNoValue(detailData.type)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Purpose
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0 small-form-content hidden-scrollbar">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.description)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
      </>
    )
  );
};

RequestorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default RequestorInfo;
