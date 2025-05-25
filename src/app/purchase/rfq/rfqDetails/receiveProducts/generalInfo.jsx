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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detail,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('location_id')}
              onFocus={() => setCurrentTip('location_id')}
            >
              From Location
            </span>
            {currentTooltip === 'location_id' && (
              <Tooltip title={getDefinitonByLabel('v')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('location_dest_id')}
              onFocus={() => setCurrentTip('location_dest_id')}
            >
              To Location
            </span>
            {currentTooltip === 'location_dest_id' && (
              <Tooltip title={getDefinitonByLabel('location_dest_id')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
            )}
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_dest_id))}</span>
          </Row>
          {(detailData.picking_type_code === 'incoming' || detailData.picking_type_code === 'outgoing') && (
            <>
              <p className="mt-2" />
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                  onMouseEnter={() => setCurrentTip('dc_no')}
                  onFocus={() => setCurrentTip('dc_no')}
                >
                  DC#
                </span>
                {currentTooltip === 'dc_no' && (
                  <Tooltip title={getDefinitonByLabel('dc_no')} placement="right">
                    <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                )}
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.dc_no)}</span>
              </Row>
              <p className="mt-2" />
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                  onMouseEnter={() => setCurrentTip('po_no')}
                  onFocus={() => setCurrentTip('po_no')}
                >
                  PO#
                </span>
                {currentTooltip === 'po_no' && (
                  <Tooltip title={getDefinitonByLabel('po_no')} placement="right">
                    <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                )}
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.po_no)}</span>
              </Row>

            </>
          )}
          {(detailData.cancel_comment) && (
            <>
              <p className="mt-2" />
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                  onMouseEnter={() => setCurrentTip('cancel_comment')}
                  onFocus={() => setCurrentTip('cancel_comment')}
                >
                  Reason For Rejection
                </span>
                {currentTooltip === 'cancel_comment' && (
                  <Tooltip title={getDefinitonByLabel('cancel_comment')} placement="right">
                    <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                )}
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 w-100 text-capital">{getDefaultNoValue(detailData.cancel_comment)}</span>
              </Row>
            </>
          )}
          <p className="mt-2" />
          <Row className="m-0">
            <span
              className="m-0 p-0 light-text"
              aria-hidden
              onMouseEnter={() => setCurrentTip('note')}
              onFocus={() => setCurrentTip('note')}
            >
              Description
            </span>
            {currentTooltip === 'note' && (
              <Tooltip title={getDefinitonByLabel('note')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
            )}
          </Row>
          <Row className="m-0 small-form-content thin-scrollbar">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.note)}</span>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
