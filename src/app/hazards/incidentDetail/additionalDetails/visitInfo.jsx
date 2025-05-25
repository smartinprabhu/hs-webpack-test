/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';

const FacilityInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <>
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Reported By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.reported_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Reported On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.reported_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Acknowledged By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.acknowledged_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Acknowledged On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.acknowledged_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Resolved By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.resolved_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Resolved On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.resolved_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Validated By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.validated_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Validated On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.validated_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
  </>
  )
  );
};

FacilityInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default FacilityInfo;
