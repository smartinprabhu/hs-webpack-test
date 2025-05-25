/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { Tooltip } from 'antd';

import {
  getCompanyTimezoneDate, extractNameObject, getDefaultNoValue, truncate,
} from '../../../util/appUtils';

const resolutionInfo = (props) => {
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
              Expected Closure Date
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.expexted_closure_date, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Attended On
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.attended_on, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Action Taken
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital text-break">
              {detailData.action_taken
                ? (
                  <Tooltip title={detailData.action_taken} placement="bottom">
                    {truncate(detailData.action_taken, '120')}
                  </Tooltip>
                )
                : ' - '}
            </span>
          </Row>
          <p className="mt-2" />
          {extractNameObject(detailData.state_id, 'name') === 'Closed' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Closed On
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital text-break">{getDefaultNoValue(getCompanyTimezoneDate(detailData.closed_on, userInfo, 'datetime'))}</span>
              </Row>
              <p className="mt-2" />
            </>
          )}
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Remarks
            </span>
          </Row>
          <Row className="m-0 small-form-content thin-scrollbar">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {detailData.remarks
                ? (
                  <Tooltip title={detailData.remarks} placement="bottom">
                    {truncate(detailData.remarks, '120')}
                  </Tooltip>
                )
                : ' - '}
            </span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

resolutionInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default resolutionInfo;
