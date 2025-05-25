/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../../util/appUtils';

const ApprovalInfo = (props) => {
  const {
    detailData,
  } = props;
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Approval Authority
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.approval_authority_id, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
          {wpConfig && wpConfig.is_ehs_required && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  EHS Authority
                </span>
              </Row>
              <Row className="m-0">
                <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                  <span className="m-0 p-0 font-weight-700 text-capital">
                    {' '}
                    {getDefaultNoValue(extractNameObject(detailData.ehs_authority_id, 'name'))}
                  </span>
                </Col>
              </Row>
              <p className="mt-2" />
            </>
          )}
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Security Office
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.security_office_id, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        {wpConfig && wpConfig.review_required && (
          <>
            <Row className="m-0">
              <span className="m-0 p-0 light-text">
                Reviewer
              </span>
            </Row>
            <Row className="m-0">
              <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {' '}
                  {getDefaultNoValue(extractNameObject(detailData.reviewer_id, 'name'))}
                </span>
              </Col>
            </Row>
            <p className="mt-2" />
          </>
        )}
      </>
    )
  );
};

ApprovalInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ApprovalInfo;
