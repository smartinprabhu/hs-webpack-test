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

import { getDefinitonByLabel } from '../../../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../../util/appUtils';
import { getPriorityLabel } from '../../utils/utils';

const AdditionalInfo = (props) => {
  const {
    detail,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('company_id')}
            onFocus={() => setCurrentTip('company_id')}
          >
            Company
          </span>
          {currentTooltip === 'company_id' && (
          <Tooltip title={getDefinitonByLabel('company_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('priority')}
            onFocus={() => setCurrentTip('priority')}
          >
            Priority
          </span>
          {currentTooltip === 'priority' && (
          <Tooltip title={getDefinitonByLabel('priority')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getPriorityLabel(detailData.priority))}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

AdditionalInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AdditionalInfo;
