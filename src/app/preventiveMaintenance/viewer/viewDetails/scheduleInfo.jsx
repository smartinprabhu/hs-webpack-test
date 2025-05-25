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
  extractTextObject,
  getCompanyTimezoneDate,
  getTimeFromDecimal,
} from '../../../util/appUtils';

const ScheduleInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Maintenance Team</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(detailData.maintenance_team_name)}
              </span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Maintenance Operation</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(extractTextObject(detailData.task_name))}
              </span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Duration</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getTimeFromDecimal(detailData.duration)}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Starts On</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.starts_on, userInfo, 'date'))}
              </span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Ends On</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.ends_on, userInfo, 'date'))}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
        </Row>
      </>
      )}
    </>
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
