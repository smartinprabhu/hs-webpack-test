/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractTextObject,
} from '../../util/appUtils';
import {
  getTypeLabel,
} from '../utils/utils';

const WorkPermitInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Description
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <Row className="m-0 small-form-content hidden-scrollbar">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.description)}</span>
            </Row>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Type
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getTypeLabel(detailData.category_type))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        {detailData.category_type === 'e' && (
          <>
            <Row className="m-0">
              <span className="m-0 p-0 light-text">
                Equipment
              </span>
            </Row>
            <Row className="m-0">
              <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {' '}
                  {getDefaultNoValue(extractTextObject(detailData.equipment_id))}
                </span>
              </Col>
            </Row>
            <p className="mt-2" />
          </>
        )}
        {detailData && detailData.category_type === 'ah' && (
          <>
            <Row className="m-0">
              <span className="m-0 p-0 light-text">
                Space
              </span>
            </Row>
            <Row className="m-0">
              <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {' '}
                  {getDefaultNoValue(extractTextObject(detailData.location_id))}
                </span>
              </Col>
            </Row>
            <p className="mt-2" />
          </>
        )}
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Requires Verification by OTP (SMS/Email)
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {detailData.requires_verification_by_otp ? 'Yes' : 'No'}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
      </>
    )
  );
};

WorkPermitInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WorkPermitInfo;
