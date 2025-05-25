/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

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
          <span className="m-0 p-0 light-text">Planned In</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_in, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Planned Out</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_out, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Space</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.space_id))}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Purpose</span>
        </Row>
        <Row className="m-0 small-form-content hidden-scrollbar">
          <span className="m-0 p-0 font-weight-700 text-capital">
            {getDefaultNoValue(detailData.purpose)}
          </span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Visitor Badge</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.visitor_badge)}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Visiting Company</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.tenant_id))}</span>
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
