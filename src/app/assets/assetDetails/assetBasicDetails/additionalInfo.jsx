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
} from '../../../util/appUtils';
import { getDefinitonByLabel } from '../../utils/utils';

const AdditionalInfo = (props) => {
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
            onMouseEnter={() => setCurrentTip('geolocations')}
            onFocus={() => setCurrentTip('geolocations')}
          >
            Geo Location(Latitude , Longitude)
          </span>
          {currentTooltip === 'geolocations' && (
          <Tooltip title={getDefinitonByLabel('geolocations')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="mr-1 mt-0 ml-0 mb-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.latitude)}</span>
          {detailData.longitude && (<span>,</span>)}
          <span className="mr-0 mt-0 ml-1 mb-0 p-0 font-weight-700 text-capital">{(detailData.longitude ? detailData.longitude : '')}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('positions')}
            onFocus={() => setCurrentTip('positions')}
          >
            Positions(x , y)
          </span>
          {currentTooltip === 'positions' && (
          <Tooltip title={getDefinitonByLabel('positions')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="mr-1 mt-0 ml-0 mb-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.xpos)}</span>
          {detailData.ypos && (<span>,</span>)}
          <span className="mr-0 mt-0 ml-1 mb-0 p-0 font-weight-700 text-capital">
            {(detailData.ypos ? detailData.ypos : '')}
          </span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('operating_hours')}
            onFocus={() => setCurrentTip('operating_hours')}
          >
            {/* Operating Hours */}
            Working Hours
          </span>
          {currentTooltip === 'operating_hours' && (
          <Tooltip title={getDefinitonByLabel('operating_hours')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">
            {getDefaultNoValue(extractTextObject(detailData.operating_hours))}
          </span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('comment')}
            onFocus={() => setCurrentTip('comment')}
          >
            Comment
          </span>
          {currentTooltip === 'comment' && (
          <Tooltip title={getDefinitonByLabel('comment')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0 small-form-content hidden-scrollbar">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.comment)}</span>
        </Row>
        <p className="mt-2" />
        {detailData.make && (
          <>
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('make')}
                onFocus={() => setCurrentTip('make')}
              >
                Make
              </span>
              {currentTooltip === 'make' && (
              <Tooltip title={getDefinitonByLabel('make')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(detailData.make)}
              </span>
            </Row>
            <p className="mt-2" />
          </>
        )}
        {detailData.capacity && (
          <>
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('capacity')}
                onFocus={() => setCurrentTip('capacity')}
              >
                Capacity
              </span>
              {currentTooltip === 'capacity' && (
              <Tooltip title={getDefinitonByLabel('capacity')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(detailData.capacity)}
              </span>
            </Row>
            <p className="mt-2" />
          </>
        )}
        {detailData.last_service_done && (
          <>
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('last_service_done')}
                onFocus={() => setCurrentTip('last_service_done')}
              >
                Last Service Done Date
              </span>
              {currentTooltip === 'last_service_done' && (
              <Tooltip title={getDefinitonByLabel('last_service_done')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.last_service_done, userInfo, 'datetime'))}</span>
            </Row>
            <p className="mt-2" />
          </>
        )}
        {detailData.refilling_due_date && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('refilling_due_date')}
              onFocus={() => setCurrentTip('refilling_due_date')}
            >
              Refilling Due Date
            </span>
            {currentTooltip === 'refilling_due_date' && (
            <Tooltip title={getDefinitonByLabel('refilling_due_date')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.refilling_due_date, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
        </>
        )}
        {detailData.employee_id && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('employee_id')}
              onFocus={() => setCurrentTip('employee_id')}
            >
              Assigned To
            </span>
            {currentTooltip === 'employee_id' && (
            <Tooltip title={getDefinitonByLabel('employee_id')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(extractTextObject(detailData.employee_id))}
            </span>
          </Row>
          <p className="mt-2" />
        </>
        )}
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
