/* eslint-disable react/jsx-no-useless-fragment */
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

import { getDefinitonByLabel } from '../../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../util/appUtils';
// import { getInventText } from '../utils/utils';

const AdditionalInfo = (props) => {
  const {
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const loading = detailData && detailData.loading;

  return (
    <>
      {!loading && detail && (
      <>
        { /* <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('exhausted')}
            onFocus={() => setCurrentTip('exhausted')}
          >
            Include Exhausted Products
          </span>
          {currentTooltip === 'exhausted' && (
          <Tooltip title={getDefinitonByLabel('exhausted')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{detail.exhausted ? 'Yes' : 'No'}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('state')}
            onFocus={() => setCurrentTip('state')}
          >
            Status
          </span>
          {currentTooltip === 'state' && (
          <Tooltip title={getDefinitonByLabel('state')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getStateLabel(detail.state)}</span>
        </Row>
          <p className="mt-2" /> */ }
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
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.company_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('reason_id')}
            onFocus={() => setCurrentTip('reason_id')}
          >
            Reason
          </span>
          {currentTooltip === 'reason_id' && (
          <Tooltip title={getDefinitonByLabel('reason_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.reason_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('comments')}
            onFocus={() => setCurrentTip('comments')}
          >
            Comments
          </span>
          {currentTooltip === 'comments' && (
          <Tooltip title={getDefinitonByLabel('comments')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detail.comments)}</span>
        </Row>
        <p className="mt-2" />

      </>
      )}
    </>
  );
};

AdditionalInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AdditionalInfo;
