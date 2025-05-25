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
          <span className={detailData.qr_scan_at_start ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.qr_scan_at_start ? faCheckCircle : faTimesCircle} />
          </span>
          <span>QR Scan At Start</span>
          <span className={detailData.qr_scan_at_done ? 'text-success' : 'text-danger'}>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.qr_scan_at_done ? faCheckCircle : faTimesCircle} />
          </span>
          <span>QR Scan At Done</span>
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
