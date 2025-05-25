/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../util/appUtils';

const FacilityInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Manager</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.facility_manager_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Contact</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.facility_manager_contact)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Email</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 word-break-content">{getDefaultNoValue(detailData.facility_manager_email)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Space</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
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
