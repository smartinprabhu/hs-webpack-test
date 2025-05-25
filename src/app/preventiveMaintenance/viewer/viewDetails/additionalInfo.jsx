/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Col,
  Row,
} from 'reactstrap';
import {
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdditionalInfo = (props) => {
  const {
    detailData,
  } = props;
  return (
    detailData && (
      <Row>
        {(detailData.at_start_mro || detailData.at_review_mro || detailData.at_done_mro) && (
          <Col sm="12" md="6" xs="12" lg="6">
            <h6 className="ml-3 mt-2 font-weight-500">Photo Required</h6>
            {detailData.at_start_mro && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>At Start</span>
                <br />
              </div>
            )}
            {detailData.at_review_mro && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>At Review</span>
                <br />
              </div>
            )}
            {detailData.at_done_mro && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>At Done</span>
              </div>
            )}
          </Col>
        )}
        {detailData.enforce_time && (
          <Col sm="12" md="6" xs="12" lg="6">
            <h6 className="ml-3 mt-2 font-weight-500">Enforce Time</h6>
            <div className="ml-3">
            <span className='text-success'>
            <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
            </span>
            <span>Enforce Time</span>
            </div>
          </Col>
        )}
        {(detailData.qr_scan_at_start || detailData.qr_scan_at_done) && (
          <Col sm="12" md="6" xs="12" lg="6">
             <h6 className="ml-3 mt-2 font-weight-500">QR</h6>
             {detailData.qr_scan_at_start && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>QR Scan At Start</span>
                <br />
              </div>
            )}
            {detailData.qr_scan_at_done && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>QR Scan At Done</span>
                <br />
              </div>
            )}
          </Col>
        )}
        {(detailData.nfc_scan_at_start || detailData.nfc_scan_at_done) && (
          <Col sm="12" md="6" xs="12" lg="6">
            <h6 className="ml-3 mt-2 font-weight-500">NFC</h6>
            {detailData.nfc_scan_at_start && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>NFC Scan At Start</span>
                <br />
              </div>
            )}
             {detailData.nfc_scan_at_done && (
              <div className="ml-3">
                <span className='text-success'>
                  <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                </span>
                <span>NFC Scan At Done</span>
                <br />
              </div>

            )}
          </Col>
        )}
        {detailData.is_generate_wo && (
          <Col sm="12" md="6" xs="12" lg="6">
            <h6 className="ml-3 mt-2 font-weight-500">Workorder</h6>
            <div className="ml-3">
              <span className='text-success'>
                <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
              </span>
              <span>Generate WO</span>
            </div>
          </Col>
        )}

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
