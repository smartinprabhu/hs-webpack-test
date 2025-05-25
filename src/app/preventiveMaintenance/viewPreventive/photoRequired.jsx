/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PhotoRequired = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <div>
          <span className={detailData.data[0].at_start_mro ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.data[0].at_start_mro ? faCheckCircle : faTimesCircle} />
          </span>
          <span>At Start</span>
          <span className={detailData.data[0].at_review_mro ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.data[0].at_review_mro ? faCheckCircle : faTimesCircle} />
          </span>
          <span>At Review</span>
          <span className={detailData.data[0].at_done_mro ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.data[0].at_done_mro ? faCheckCircle : faTimesCircle} />
          </span>
          <span>At Done</span>
          <span className={detailData.data[0].enforce_time ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.data[0].enforce_time ? faCheckCircle : faTimesCircle} />
          </span>
          <span>Enforce Time</span>

        </div>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

PhotoRequired.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default PhotoRequired;
