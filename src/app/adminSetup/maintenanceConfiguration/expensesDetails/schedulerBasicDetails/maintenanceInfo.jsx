/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
  getTimeFromDecimal,
} from '../../../../util/appUtils';

const MaintenanceInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>

        <Row className="m-0">
          <span className="m-0 p-0 light-text">Maintenance Team</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.maintenance_team_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Maintenance Operation</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.task_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Checklist</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.check_list_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Starts At</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getTimeFromDecimal(detailData.starts_at)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Duration</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getTimeFromDecimal(detailData.duration)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Exclude Holidays?</span>
        </Row>
        <Row className="m-0">
          <span className={` ${detailData.is_missed_alert ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{detailData.is_exclude_holidays ? 'Yes' : 'No'}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

MaintenanceInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default MaintenanceInfo;
