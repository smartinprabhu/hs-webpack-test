/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EnforceTime = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <div>
          <span className={detailData.enforce_time ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.enforce_time ? faCheckCircle : faTimesCircle} />
          </span>
          <span>Enforce Time</span>
          <span className={detailData.is_allow_future ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_allow_future ? faCheckCircle : faTimesCircle} />
          </span>
          <span>Allow Future</span>
          <span className={detailData.is_allow_past ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_allow_past ? faCheckCircle : faTimesCircle} />
          </span>
          <span>Allow Past</span>
        </div>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

EnforceTime.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default EnforceTime;
