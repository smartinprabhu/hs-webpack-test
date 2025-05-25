/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const OtherInfo = (props) => {
  const {
    detailData,
  } = props;
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Job Description
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 pr-1 font-weight-700 text-capital">
            {' '}
            {getDefaultNoValue(detailData.job_description)}
          </span>
        </Row>
        <p className="mt-2" />
          {wpConfig && wpConfig.is_ehs_required
        && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              EHS Instructions
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 pr-1 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.ehs_instructions)}
            </span>
          </Row>
        </>
        )}
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Terms and Conditions
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 pr-1 font-weight-700 text-capital">
            {' '}
            {getDefaultNoValue(detailData.terms_conditions)}
          </span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

OtherInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default OtherInfo;
