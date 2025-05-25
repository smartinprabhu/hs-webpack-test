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

import { getDefinitonByLabel } from '../../assets/utils/utils';
// import { getRuleTypeLabel } from '../../utils/utils';
import {
  getDefaultNoValue, extractNameObject,
} from '../../util/appUtils';

const SchedulerInfo = (props) => {
  const {
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
            >
              Company Name
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(extractNameObject(detailData.data[0].company_id, 'name'))}
              {/*  {getDefaultNoValue(getRuleTypeLabel(detailData.data[0].rrule_type ? detailData.data[0].rrule_type : ''))} */}
            </span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

SchedulerInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default SchedulerInfo;
