/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Col,
  Row,
} from 'reactstrap';
import {
  faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdditionalInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    detailData && (
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <h6 className="ml-3 mt-2 font-weight-500">Photo Required</h6>
          <div className="ml-3">
            <span className={detailData.at_start_mro ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.at_start_mro ? faCheckCircle : faTimesCircle} />
            </span>
            <span>At Start</span>
            <br />
            <span className={detailData.at_review_mro ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.at_review_mro ? faCheckCircle : faTimesCircle} />
            </span>
            <span>At Review</span>
            <br />
            <span className={detailData.at_done_mro ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.at_done_mro ? faCheckCircle : faTimesCircle} />
            </span>
            <span>At Done</span>
          </div>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <h6 className="ml-3 mt-2 font-weight-500">Enforce Time</h6>
          <div className="ml-3">
            <span className={detailData.enforce_time ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.enforce_time ? faCheckCircle : faTimesCircle} />
            </span>
            <span>Enforce Time</span>
          </div>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <h6 className="ml-3 font-weight-500">QR</h6>
          <div className="ml-3">
            <span className={detailData.is_qr_at_scan_start ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_qr_at_scan_start ? faCheckCircle : faTimesCircle} />
            </span>
            <span>QR Scan At Start</span>
            <br />
            <span className={detailData.is_qr_at_scan_done ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_qr_at_scan_done ? faCheckCircle : faTimesCircle} />
            </span>
            <span>QR Scan At Start</span>
          </div>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <h6 className="ml-3 font-weight-500">NFC</h6>
          <div className="ml-3">
            <span className={detailData.is_nfc_scan_at_start ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_nfc_scan_at_start ? faCheckCircle : faTimesCircle} />
            </span>
            <span>NFC Scan At Start</span>
            <br />
            <span className={detailData.is_nfc_scan_at_done ? 'text-success' : 'text-danger'}>
              <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_nfc_scan_at_done ? faCheckCircle : faTimesCircle} />
            </span>
            <span>NFC Scan At Done</span>
          </div>
          <p className="mt-2" />
        </Col>
      </Row>
    )
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
