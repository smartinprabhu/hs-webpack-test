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

const ScrapInfo = (props) => {
  const {
    detail,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

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
            onMouseEnter={() => setCurrentTip('product_id')}
            onFocus={() => setCurrentTip('product_id')}
          >
            Product
          </span>
          {currentTooltip === 'product_id' && (
          <Tooltip title={getDefinitonByLabel('product_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.product_id))}</span>
          <hr className="mt-0" />
          {detail.filter === 'category' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Product Category</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.category_id))}</span>
              </Row>
              <hr className="mt-0" />
            </>
          )}
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('scrap_qty')}
            onFocus={() => setCurrentTip('scrap_qty')}
          >
            Quantity
          </span>
          {currentTooltip === 'scrap_qty' && (
          <Tooltip title={getDefinitonByLabel('scrap_qty')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.scrap_qty)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('scrap_location_id')}
            onFocus={() => setCurrentTip('scrap_location_id')}
          >
            Scrap Location
          </span>
          {currentTooltip === 'scrap_location_id' && (
          <Tooltip title={getDefinitonByLabel('scrap_location_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.scrap_location_id)}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

ScrapInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ScrapInfo;
