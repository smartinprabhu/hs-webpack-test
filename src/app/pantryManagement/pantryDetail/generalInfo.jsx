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

const GeneralInfo = (props) => {
  const {
    detailData,
  } = props;


  return (
    <>
      {detailData && (
      <>
        <Row className="m-0 ">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
          >
            Location
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.data[0].space_id, 'path_name'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
          >
            Employee Name
          </span>
        </Row>
        <Row className="m-0">
        <span className="m-0 p-0 font-weight-700">
          {getDefaultNoValue(extractNameObject(detailData.data[0].employee_id, 'name'))}
        </span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
          >
            Employee Mail
          </span>
        </Row>
        <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-break">
          {getDefaultNoValue(extractNameObject(detailData.data[0].employee_id, 'work_email'))}
        </span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
