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

import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
  numToFloatView,
} from '../../../util/appUtils';
import { getDefinitonByLabel } from '../../utils/utils';

const MaintenanceInfo = (props) => {
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
                onMouseEnter={() => setCurrentTip('maintained_by_id')}
                onFocus={() => setCurrentTip('maintained_by_id')}
              >
                Maintained By
              </span>
              {currentTooltip === 'maintained_by_id' && (
              <Tooltip title={getDefinitonByLabel('maintained_by_id')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('monitored_by_id')}
                onFocus={() => setCurrentTip('monitored_by_id')}
              >
                Monitored By
              </span>
              {currentTooltip === 'monitored_by_id' && (
              <Tooltip title={getDefinitonByLabel('monitored_by_id')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.maintained_by_id, userInfo, 'date'))}</span>
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.monitored_by_id))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('managed_by_id')}
              onFocus={() => setCurrentTip('managed_by_id')}
            >
              Managed By
            </span>
            {currentTooltip === 'managed_by_id' && (
            <Tooltip title={getDefinitonByLabel('managed_by_id')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.managed_by_id))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('last_breakdown_on')}
                onFocus={() => setCurrentTip('last_breakdown_on')}
              >
                Last Breakdown
              </span>
              {currentTooltip === 'last_breakdown_on' && (
              <Tooltip title={getDefinitonByLabel('last_breakdown_on')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('breakdown_reason')}
                onFocus={() => setCurrentTip('breakdown_reason')}
              >
                Breakdown Reason
              </span>
              {currentTooltip === 'breakdown_reason' && (
              <Tooltip title={getDefinitonByLabel('breakdown_reason')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.last_breakdown_on, userInfo, 'date'))}</span>
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.breakdown_reason)}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('expected_mtbf')}
                onFocus={() => setCurrentTip('expected_mtbf')}
              >
                Expected MTBF
              </span>
              {currentTooltip === 'expected_mtbf' && (
              <Tooltip title={getDefinitonByLabel('expected_mtbf')} placement="right">
                <span className="text-info">
                  <FontAwesomeIcon className="ml-1 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('mtbf_hours')}
                onFocus={() => setCurrentTip('mtbf_hours')}
              >
                Actual MTBF
              </span>
              {currentTooltip === 'mtbf_hours' && (
              <Tooltip title={getDefinitonByLabel('mtbf_hours')} placement="right">
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
                {numToFloatView(detailData.expected_mtbf)}
              </span>
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {numToFloatView(detailData.mtbf_hours)}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('rav')}
                onFocus={() => setCurrentTip('rav')}
              >
                RAV
              </span>
              {currentTooltip === 'rav' && (
              <Tooltip title={getDefinitonByLabel('rav')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('mttf_hours')}
                onFocus={() => setCurrentTip('mttf_hours')}
              >
                MTTR
              </span>
              {currentTooltip === 'mttf_hours' && (
              <Tooltip title={getDefinitonByLabel('mttf_hours')} placement="right">
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
                {numToFloatView(detailData.rav)}
              </span>
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {numToFloatView(detailData.mttf_hours)}
              </span>
            </Col>

          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('total_parts_cost')}
                onFocus={() => setCurrentTip('total_parts_cost')}
              >
                Total Parts Cost
              </span>
              {currentTooltip === 'total_parts_cost' && (
              <Tooltip title={getDefinitonByLabel('total_parts_cost')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('total_tools_cost')}
                onFocus={() => setCurrentTip('total_tools_cost')}
              >
                Total Tools Cost
              </span>
              {currentTooltip === 'total_tools_cost' && (
              <Tooltip title={getDefinitonByLabel('total_tools_cost')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{numToFloatView(detailData.total_parts_cost)}</span>
            </Col>
            <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
            <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {numToFloatView(detailData.total_tools_cost)}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('total_labor_cost')}
              onFocus={() => setCurrentTip('total_labor_cost')}
            >
              Total Labor Cost
            </span>
            {currentTooltip === 'total_labor_cost' && (
            <Tooltip title={getDefinitonByLabel('total_labor_cost')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {numToFloatView(detailData.total_labor_cost)}
              </span>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

MaintenanceInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default MaintenanceInfo;
