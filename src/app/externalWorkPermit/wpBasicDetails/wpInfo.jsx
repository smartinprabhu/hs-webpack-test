/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
  getLocalTime,
  getTimeFromDecimal,
} from '../../util/appUtils';

const WpInfo = (props) => {
  const {
    detailData,
    wpConfigData,
  } = props;

  return (
    <>
      {detailData && (
        <>
          {wpConfigData && wpConfigData.is_enable_type_of_work && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Type of Work</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.type_work_id, 'name'))}</span>
              </Row>
              <p className="mt-2" />
            </>
          )}
          {wpConfigData && wpConfigData.is_enable_department && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Department</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.department_id, 'name'))}</span>
              </Row>
              <p className="mt-2" />
            </>
          )}
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Nature of Work</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.nature_work_id, 'name'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Planned Start Time</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(getLocalTime(detailData.planned_start_time))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Duration</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(getTimeFromDecimal(detailData.duration))}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

WpInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WpInfo;
