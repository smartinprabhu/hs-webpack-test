/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../assets/utils/utils';
import { getRuleTypeLabel } from '../utils/utils';
import {
  getDefaultNoValue,
} from '../../util/appUtils';

const SchedulerInfo = (props) => {
  const {
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('repeat')}
              onFocus={() => setCurrentTip('repeat')}
            >
              Repeat Every
            </span>
            {currentTooltip === 'repeat' && (
            <Tooltip title={getDefinitonByLabel('repeat')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.data[0].interval ? detailData.data[0].interval : '')}
              {getDefaultNoValue(getRuleTypeLabel(detailData.data[0].rrule_type ? detailData.data[0].rrule_type : ''))}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('recurrent')}
              onFocus={() => setCurrentTip('recurrent')}
            >
              Recurrent
            </span>
            {currentTooltip === 'recurrent' && (
            <Tooltip title={getDefinitonByLabel('recurrent')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className={` ${detailData.data[0].recurrency ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{detailData.data[0].recurrency ? 'Yes' : 'No'}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

SchedulerInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default SchedulerInfo;
