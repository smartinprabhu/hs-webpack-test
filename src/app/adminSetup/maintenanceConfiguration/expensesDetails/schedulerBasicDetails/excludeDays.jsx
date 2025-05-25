/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ExcludeDays = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <div>
          {detailData.mo && (
          <>
            <span className={detailData.mo ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.mo ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Mon</span>
          </>
          )}
          {detailData.tu && (
          <>
            <span className={detailData.tu ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.tu ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Tue</span>
          </>
          )}
          {detailData.we && (
          <>
            <span className={detailData.we ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.we ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Wed</span>
          </>
          )}
          {detailData.th && (
          <>
            <span className={detailData.th ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.th ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Thu</span>
          </>
          )}
          {detailData.fr && (
          <>
            <span className={detailData.fr ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.fr ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Fri</span>
          </>
          )}
          {detailData.sa && (
          <>
            <span className={detailData.sa ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.sa ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Sat</span>
          </>
          )}
          {detailData.su && (
          <>
            <span className={detailData.su ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.su ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Sun</span>
          </>
          )}
        </div>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

ExcludeDays.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ExcludeDays;
