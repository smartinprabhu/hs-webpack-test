/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
  getTimeFromDecimal,
} from '../../../util/appUtils';

const Notifications = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Remind Before</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getTimeFromDecimal(detailData.remind_before)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Missed Alert?</span>
        </Row>
        <Row className="m-0">
          <span className={` ${detailData.is_missed_alert ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{detailData.is_missed_alert ? 'Yes' : 'No'}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Recipients</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.recipients_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

Notifications.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default Notifications;
