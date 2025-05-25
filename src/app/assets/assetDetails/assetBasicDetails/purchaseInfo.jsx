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
  extractTextObject,
  getCompanyTimezoneDate,
  numToFloatView,
} from '../../../util/appUtils';
import { getDefinitonByLabel } from '../../utils/utils';

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
              onMouseEnter={() => setCurrentTip('purchase_date')}
              onFocus={() => setCurrentTip('purchase_date')}
            >
              Purchase Date
            </span>
            {currentTooltip === 'purchase_date' && (
            <Tooltip title={getDefinitonByLabel('purchase_date')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.purchase_date, userInfo, 'date'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('purchase_value')}
              onFocus={() => setCurrentTip('purchase_value')}
            >
              Purchase Value
            </span>
            {currentTooltip === 'purchase_value' && (
            <Tooltip title={getDefinitonByLabel('purchase_value')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{numToFloatView(detailData.purchase_value)}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('vendor_id')}
              onFocus={() => setCurrentTip('vendor_id')}
            >
              Vendor
            </span>
            {currentTooltip === 'vendor_id' && (
            <Tooltip title={getDefinitonByLabel('vendor_id')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.vendor_id))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('asset_id')}
              onFocus={() => setCurrentTip('asset_id')}
            >
              PO Reference #
            </span>
            {currentTooltip === 'asset_id' && (
            <Tooltip title={getDefinitonByLabel('asset_id')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.asset_id)}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('customer_id')}
              onFocus={() => setCurrentTip('customer_id')}
            >
              Customer Reference #
            </span>
            {currentTooltip === 'customer_id' && (
            <Tooltip title={getDefinitonByLabel('customer_id')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(extractTextObject(detailData.customer_id))}
            </span>
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
