/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAMCText, getDefinitonByLabel } from '../../utils/utils';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
  numToFloatView,
} from '../../../util/appUtils';

const WarrantyInfo = (props) => {
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
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('warranty_start_date')}
                onFocus={() => setCurrentTip('warranty_start_date')}
              >
                Warranty Start date
              </span>
              {currentTooltip === 'warranty_start_date' && (
              <Tooltip title={getDefinitonByLabel('warranty_start_date')} placement="right">
                <span className="text-info " onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('warranty_end_date')}
                onFocus={() => setCurrentTip('warranty_end_date')}
              >
                End date
              </span>
              {currentTooltip === 'warranty_end_date' && (
              <Tooltip title={getDefinitonByLabel('warranty_end_date')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.warranty_start_date, userInfo, 'date'))}</span>
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.warranty_end_date, userInfo, 'date'))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('amc_type')}
                onFocus={() => setCurrentTip('amc_type')}
              >
                AMC Type
              </span>
              {currentTooltip === 'amc_type' && (
              <Tooltip title={getDefinitonByLabel('amc_type')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('amc_cost')}
                onFocus={() => setCurrentTip('amc_cost')}
              >
                AMC Cost
              </span>
              {currentTooltip === 'amc_cost' && (
              <Tooltip title={getDefinitonByLabel('amc_cost')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getAMCText(detailData.amc_type))}</span>
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {numToFloatView(detailData.amc_cost)}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('amc_start_date')}
                onFocus={() => setCurrentTip('amc_start_date')}
              >
                AMC Start date
              </span>
              {currentTooltip === 'amc_start_date' && (
              <Tooltip title={getDefinitonByLabel('amc_start_date')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('amc_end_date')}
                onFocus={() => setCurrentTip('amc_end_date')}
              >
                End date
              </span>
              {currentTooltip === 'amc_end_date' && (
              <Tooltip title={getDefinitonByLabel('amc_end_date')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.amc_start_date, userInfo, 'date'))}
              </span>
            </Col>
            <Col sm="12" md="2" xs="12" lg="2" className="p-0 m-0" />
            <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.amc_end_date, userInfo, 'date'))}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('start_date')}
              onFocus={() => setCurrentTip('start_date')}
            >
              Installed Date
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
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.start_date, userInfo, 'date'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('warranty_description')}
              onFocus={() => setCurrentTip('warranty_description')}
            >
              Warranty Description
            </span>
            {currentTooltip === 'warranty_description' && (
            <Tooltip title={getDefinitonByLabel('warranty_description')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0 small-form-content hidden-scrollbar">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.warranty_description)}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

WarrantyInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WarrantyInfo;
