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
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate,
} from '../../../util/appUtils';
// import { getInventText } from '../utils/utils';

const AdditionalInfo = (props) => {
  const {
    detail,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');
  const { userInfo } = useSelector((state) => state.user);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const loading = detailData && detailData.loading;

  return (
    <>
      {!loading && detail && (
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
            onMouseEnter={() => setCurrentTip('create_date')}
            onFocus={() => setCurrentTip('create_date')}
          >
            Created Date
          </span>
          {currentTooltip === 'create_date' && (
          <Tooltip title={getDefinitonByLabel('create_date')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}</span>
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
