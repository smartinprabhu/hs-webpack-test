/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getTimeFromFloat,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

const ScheduleInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <Row className="m-0">
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Scheduled Period</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_start_scheduled, userInfo, 'datetime'))}
          <br />
          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_scheduled, userInfo, 'datetime'))}
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Requested Date</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_planned, userInfo, 'datetime'))}
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Planned Duration</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getTimeFromFloat(detailData.order_duration))}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Execution Period</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_start_execution, userInfo, 'datetime'))}
          <br />
          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_execution, userInfo, 'datetime'))}
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Actual Duration</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getTimeFromFloat(detailData.actual_duration))}
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Worked Duration</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getTimeFromFloat(detailData.worked_hours))}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
  </Row>
  )
  );
};

ScheduleInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ScheduleInfo;
