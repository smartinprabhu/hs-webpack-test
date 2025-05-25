/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getWorkOrderStateLabelNew } from '../../workorders/utils/utils';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

const ReviewInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <Row className="m-0">
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Review Status</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.review_status ? getWorkOrderStateLabelNew(detailData.review_status) : '')}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Reviewed By</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.reviewed_by_name ? detailData.reviewed_by_name : '')}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Reviewed On</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.reviewed_on ? getCompanyTimezoneDate(detailData.reviewed_on, userInfo, 'datetime') : '')}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Review Remarks</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.reviewed_remark ? detailData.reviewed_remark : '')}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
      </Row>
      )}
    </>
  );
};

ReviewInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ReviewInfo;
