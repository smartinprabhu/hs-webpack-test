/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import {
  extractNameObject, getCompanyTimezoneDate, getDefaultNoValue,
} from '../../../util/appUtils';

const requestorInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Raised By
            </span>
          </Row>
          <Row className="m-0">
            {getDefaultNoValue(extractNameObject(detailData.raised_by_id, 'name'))}
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Raised On
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.raised_on, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

requestorInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default requestorInfo;
