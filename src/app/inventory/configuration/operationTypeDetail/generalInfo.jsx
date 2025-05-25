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
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('sequence_id')}
            onFocus={() => setCurrentTip('sequence_id')}
          >
            Reference Sequence
          </span>
          {currentTooltip === 'sequence_id' && (
          <Tooltip title={getDefinitonByLabel('sequence_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.sequence_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('default_location_dest_id')}
            onFocus={() => setCurrentTip('default_location_dest_id')}
          >
            Default Destination Location
          </span>
          {currentTooltip === 'default_location_dest_id' && (
          <Tooltip title={getDefinitonByLabel('default_location_dest_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.default_location_dest_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('warehouse_id')}
            onFocus={() => setCurrentTip('warehouse_id')}
          >
            Warehouse
          </span>
          {currentTooltip === 'warehouse_id' && (
          <Tooltip title={getDefinitonByLabel('warehouse_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detail.warehouse_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('create_date')}
            onFocus={() => setCurrentTip('create_date')}
          >
            Create Date
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
