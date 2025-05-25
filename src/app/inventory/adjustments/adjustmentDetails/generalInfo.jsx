/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row, Col
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
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');
  const { userInfo } = useSelector((state) => state.user);

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
            onMouseEnter={() => setCurrentTip('filter')}
            onFocus={() => setCurrentTip('filter')}
          >
            Inventory of
          </span>
          {currentTooltip === 'filter' && (
          <Tooltip title={getDefinitonByLabel('filter')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getInventText(detail.filter))}</span>
          <hr className="mt-0" />
          {detail.filter === 'category' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Product Category</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detail.category_id))}</span>
              </Row>
              <hr className="mt-0" />
            </>
          )}
        </Row>
        <p className="mt-2" /> */ }
          <Row className="mr-0">
          <Col className="col-sm-6 col-md-6 col-lg-6">
          <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('location_id')}
              onFocus={() => setCurrentTip('location_id')}
            >
              Audit Location
            </span>
            {currentTooltip === 'location_id' && (
              <Tooltip title={getDefinitonByLabel('location_id')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
            )}
          </Col>
            <Col className="col-sm-6 col-md-6 col-lg-6">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('create_uid')}
                onFocus={() => setCurrentTip('create_uid')}
              >
                Audited By
              </span>
              {currentTooltip === 'create_uid' && (
                <Tooltip title={getDefinitonByLabel('create_uid')} placement="right">
                  <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                    <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                  </span>
                </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="mr-0">
            <Col className="col-sm-6 col-md-6 col-lg-6">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.location_id))}</span>
            </Col>
            <Col className="col-sm-6 col-md-6 col-lg-6">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.create_uid))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          { /* <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('category_id')}
            onFocus={() => setCurrentTip('category_id')}
          >
            Product Category
          </span>
          {currentTooltip === 'category_id' && (
          <Tooltip title={getDefinitonByLabel('category_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.category_id))}</span>
        </Row>
          <p className="mt-2" /> */ }
          <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('date')}
                onFocus={() => setCurrentTip('date')}
              >
                Audit Date
              </span>
              {currentTooltip === 'date' && (
                <Tooltip title={getDefinitonByLabel('date')} placement="right">
                  <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                    <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                  </span>
                </Tooltip>
              )}
          </Row>
          <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detail.date, userInfo, 'datetime'))}</span>
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
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detail.create_date, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
          { /* <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('accounting_date')}
            onFocus={() => setCurrentTip('accounting_date')}
          >
            Accounting Date
          </span>
          {currentTooltip === 'accounting_date' && (
          <Tooltip title={getDefinitonByLabel('accounting_date')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detail.accounting_date, userInfo, 'datetime'))}</span>
        </Row>
        <p className="mt-2" /> */ }
        </>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
