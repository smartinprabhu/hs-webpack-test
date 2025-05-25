/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';

const RecurrenceInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Has Expiry ?</span>
          <span className={detailData.is_has_expiry ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_has_expiry ? faCheckCircle : faTimesCircle} />
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0" />
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Next Expiry Date
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.next_expiry_date, userInfo, 'datetime'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Expiry Schedule
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.expiry_schedule)}
              {getDefaultNoValue(detailData.expiry_schedule_type)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Repeat Until
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.repeat_until)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
          {detailData.repeat_until === 'Ends On' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Repeat Until
                </span>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">
                    {' '}
                    {getCompanyTimezoneDate(detailData.end_date, userInfo, 'datetime')}
                  </span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Renewal Lead Time
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {detailData.renewal_lead_time ? detailData.renewal_lead_time : 0}
              {' '}
              days
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

RecurrenceInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default RecurrenceInfo;
