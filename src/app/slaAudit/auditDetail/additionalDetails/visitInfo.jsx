/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';

import DetailViewLeftPanel from "../../../commonComponents/detailViewLeftPanel";

const FacilityInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  const { slaAuditConfig } = useSelector((state) => state.slaAudit);

  const hasSecondApprove = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_second_level_approval;

  return (detailData && (
    <>
      <DetailViewLeftPanel
        panelData={[
          {
            header: "LOGS INFORMATION",
            leftSideData: [
              {
                property: "Created By",
                value: getDefaultNoValue(extractNameObject(detailData.created_by_id, 'name')),
              },
              {
                property: "Reviewed By",
                value: getDefaultNoValue(extractNameObject(detailData.reviewed_by_id, 'name')),
              },
              {
                property: "Approved By",
                value: getDefaultNoValue(extractNameObject(detailData.approved_by_id, 'name')),
              },
              detailData.is_second_level_approval ? (
                {
                  property: "Second Level Approved By",
                  value: getDefaultNoValue(detailData.second_approved_by),
                }
              ) : ''
            ],
            rightSideData: [
              {
                property: "Created On",
                value: getDefaultNoValue(getCompanyTimezoneDate(detailData.created_on, userInfo, 'datetime')),
              },
              {
                property: "Reviewed On",
                value: getDefaultNoValue(getCompanyTimezoneDate(detailData.reviewed_on, userInfo, 'datetime')),
              },
              {
                property: "Approved On",
                value: getDefaultNoValue(getCompanyTimezoneDate(detailData.approved_on, userInfo, 'datetime')),
              },
              hasSecondApprove ? (
                {
                  property: "Second Level Approved On",
                  value: getDefaultNoValue(getCompanyTimezoneDate(detailData.second_approved_on, userInfo, 'datetime')),
                }
              ) : ''
            ]
          }
        ]}
      />

      {/*  <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Created By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.created_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Created On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.created_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Reviewed By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.reviewed_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Reviewed On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.reviewed_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Approved By</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.approved_by_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Approved On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.approved_on, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" /> */}
    </>
  )
  );
};

FacilityInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default FacilityInfo;
