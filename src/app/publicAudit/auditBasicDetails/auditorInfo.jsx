/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../util/appUtils';

const AuditorInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Name</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.sys_auditor_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Designation</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.auditor_designation)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Contact</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.auditor_contact)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Email</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 word-break-content">{getDefaultNoValue(detailData.auditor_email)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Date</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(moment.utc(detailData.date).local().format('MM/DD/YYYY hh:mm A'))}</span>
        </Row>
        <p className="mt-2" />
      </>
    )
  );
};

AuditorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AuditorInfo;
