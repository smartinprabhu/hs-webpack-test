/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

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
                <span className="m-0 p-0 light-text">Scheduler</span>
                {detailData && detailData.enforce_time && (
                  <Button size='sm' className='px-1 py-0 ml-2 bg-white text-dark cursor-default'>
                    T
                  </Button>
                )}
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                    {getDefaultNoValue(detailData.group_name)}
                </span>
              </Row>
              <p className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Maintenance Team</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {getDefaultNoValue(detailData.maintenance_team_name)}
                </span>
              </Row>
              <p className="mt-2" />
            </Col>
            <Col sm="12" md="6" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Start Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.start_datetime, userInfo, 'datetime'))}
                </span>
              </Row>
              <p className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 light-text">End Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.end_datetime, userInfo, 'datetime'))}
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
