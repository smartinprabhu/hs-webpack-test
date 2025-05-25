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
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate,
} from '../../../util/appUtils';

const GeneralInfo = (props) => {
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
            onMouseEnter={() => setCurrentTip('picking_id')}
            onFocus={() => setCurrentTip('picking_id')}
          >
            Picking
          </span>
          {currentTooltip === 'picking_id' && (
          <Tooltip title={getDefinitonByLabel('picking_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.picking_id)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('location_id')}
            onFocus={() => setCurrentTip('location_id')}
          >
            Location
          </span>
          {currentTooltip === 'location_id' && (
          <Tooltip title={getDefinitonByLabel('location_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
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
        { /* <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('origin')}
            onFocus={() => setCurrentTip('origin')}
          >
            Source Document
          </span>
          {currentTooltip === 'origin' && (
          <Tooltip title={getDefinitonByLabel('origin')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.origin)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('date_expected')}
            onFocus={() => setCurrentTip('date_expected')}
          >
            Expected Date
          </span>
          {currentTooltip === 'date_expected' && (
          <Tooltip title={getDefinitonByLabel('date_expected')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_expected, userInfo, 'datetime'))}</span>
        </Row>
          <p className="mt-2" /> */ }
      </>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
