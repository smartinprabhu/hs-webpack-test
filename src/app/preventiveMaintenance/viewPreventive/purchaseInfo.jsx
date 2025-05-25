/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getDefinitonByLabel } from '../../assets/utils/utils';

const PurchaseInfo = (props) => {
  const {
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('start_date')}
              onFocus={() => setCurrentTip('start_date')}
            >
              Start Date
            </span>
            {currentTooltip === 'start_date' && (
            <Tooltip title={getDefinitonByLabel('start_date')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].start_datetime, userInfo, 'date'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('end_date')}
              onFocus={() => setCurrentTip('end_date')}
            >
              End Date
            </span>
            {currentTooltip === 'end_date' && (
            <Tooltip title={getDefinitonByLabel('end_date')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].stop_datetime, userInfo, 'date'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('duration')}
              onFocus={() => setCurrentTip('duration')}
            >
              Duration
            </span>
            {currentTooltip === 'duration' && (
            <Tooltip title={getDefinitonByLabel('duration')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.data[0].duration ? `${detailData.data[0].duration} hours` : '')}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

PurchaseInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default PurchaseInfo;
