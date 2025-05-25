/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  faCheckCircle, faTimesCircle, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getTagText, getDefinitonByLabel, getValidationTypesText } from '../../utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';

const ValidationInfo = (props) => {
  const {
    detailData,
    isITAsset,
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
            onMouseEnter={() => setCurrentTip('validation_status')}
            onFocus={() => setCurrentTip('validation_status')}
          >
            Validation Status
          </span>
          {currentTooltip === 'validation_status' && (
          <Tooltip title={getDefinitonByLabel('validation_status')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getValidationTypesText(detailData.validation_status))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('validated_by')}
            onFocus={() => setCurrentTip('validated_by')}
          >
            Last Validated By
          </span>
          {currentTooltip === 'validated_by' && (
          <Tooltip title={getDefinitonByLabel('validated_by')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.validated_by))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('validated_on')}
            onFocus={() => setCurrentTip('validated_on')}
          >
            Last Validated Date
          </span>
          {currentTooltip === 'validated_on' && (
          <Tooltip title={getDefinitonByLabel('validated_on')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.validated_on, userInfo, 'datetime'))}</span>
        </Row>
        <p className="mt-2" />
          {!isITAsset
            ? (
              <>
                <Row className="m-0">
                  <span
                    className="m-0 p-0 light-text"
                    aria-hidden
                    onMouseEnter={() => setCurrentTip('tag_status')}
                    onFocus={() => setCurrentTip('tag_status')}
                  >
                    Tag Status
                  </span>
                  {currentTooltip === 'tag_status' && (
                  <Tooltip title={getDefinitonByLabel('tag_status')} placement="right">
                    <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                  )}
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getTagText(detailData.tag_status))}</span>
                </Row>
              </>
            )
            : (
              <>
                <Row className="m-0">
                  <span
                    className="m-0 p-0 light-text"
                  >
                    Tag Status
                  </span>
                </Row>
                <Row className="m-0">
                  <div>
                    <span className={detailData.is_qr_tagged ? 'text-success' : 'text-danger'}>
                      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_qr_tagged ? faCheckCircle : faTimesCircle} />
                    </span>
                    <span>QR Tagged</span>
                    <span className={detailData.is_nfc_tagged ? 'text-success' : 'text-danger'}>
                      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_nfc_tagged ? faCheckCircle : faTimesCircle} />
                    </span>
                    <span>NFC Tagged</span>
                  </div>
                  <br />
                  <div>
                    <span className={detailData.is_rfid_tagged ? 'text-success' : 'text-danger'}>
                      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_rfid_tagged ? faCheckCircle : faTimesCircle} />
                    </span>
                    <span>RFID Tagged</span>
                    <span className={detailData.is_virtually_tagged ? 'text-success' : 'text-danger'}>
                      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailData.is_virtually_tagged ? faCheckCircle : faTimesCircle} />
                    </span>
                    <span>Virtually Tagged</span>
                  </div>
                </Row>
              </>
            )}
        <p className="mt-2" />
          {isITAsset && (
            <>
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                  onMouseEnter={() => setCurrentTip('assignment_status')}
                  onFocus={() => setCurrentTip('assignment_status')}
                >
                  Assignment Status
                </span>
                {currentTooltip === 'assignment_status' && (
                <Tooltip title={getDefinitonByLabel('assignment_status')} placement="right">
                  <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                    <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                  </span>
                </Tooltip>
                )}
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.assignment_status)}</span>
              </Row>
            </>
          )}
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

ValidationInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  isITAsset: PropTypes.bool,
};

ValidationInfo.defaultProps = {
  isITAsset: false,
};

export default ValidationInfo;
