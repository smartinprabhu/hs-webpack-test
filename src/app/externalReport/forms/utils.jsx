import React from 'react';
import {
  Row, Col,
} from 'reactstrap';

import checkoutFormModel from '../formModel/checkoutFormModel';

import ExternalReportSuccess from '../externalReportSuccess';
import RequestorInfo from './requestorInfo';
import TicketInfo from './ticketInfo';
import PreviewForm from './previewForm';

const { formField } = checkoutFormModel;

export function renderStepWebView(step, setFieldValue, detailData, uuid, spaceInfo, isRequestorInfo, reload, sid, cid, setDisclaimerTrue, disclaimerTrue, setOTPFormInfo, setSendOTPFormInfo, accid) {
  switch (step) {
    case 0:
      return (
        <Row>
          <>
            <RequestorInfo
              formField={formField}
              setFieldValue={setFieldValue}
              detailData={detailData}
              uuid={uuid}
              accid={accid}
              setDisclaimerTrue={setDisclaimerTrue}
              disclaimerTrue={disclaimerTrue}
              setOTPFormInfo={setOTPFormInfo}
              setSendOTPFormInfo={setSendOTPFormInfo}
            />
            <Col md={6} sm={6} lg={6} xs={6}>
              <TicketInfo accid={accid} formField={formField} setFieldValue={setFieldValue} sid={sid} cid={cid} detailData={detailData} uuid={uuid} spaceInfo={spaceInfo} reload={reload} />
            </Col>
          </>
        </Row>
      );
    case 1:
      return (
        <Row className="audits-list thin-scrollbar">
          <Col xs={12} sm={12} lg={12}>
            <PreviewForm spaceInfo={spaceInfo} isRequestorInfo={isRequestorInfo} detailData={detailData} />
          </Col>
        </Row>
      );
    default:
      return <ExternalReportSuccess />;
  }
}

export function renderStepMobileView(step, setFieldValue, detailData, uuid, spaceInfo, isRequestorInfo, reload, sid, cid, setDisclaimerTrue, disclaimerTrue, setOTPFormInfo, setSendOTPFormInfo, accid) {
  if (isRequestorInfo) {
    switch (step) {
      case 0:
        return (
          <Row>
            <RequestorInfo
              formField={formField}
              setFieldValue={setFieldValue}
              detailData={detailData}
              uuid={uuid}
              accid={accid}
              setDisclaimerTrue={setDisclaimerTrue}
              disclaimerTrue={disclaimerTrue}
              setOTPFormInfo={setOTPFormInfo}
              setSendOTPFormInfo={setSendOTPFormInfo}
            />
          </Row>
        );
      case 1:
        return (
          <Row className="audits-list thin-scrollbar">
            <Col md={12} sm={12} lg={12} xs={12}>
              <TicketInfo accid={accid} formField={formField} setFieldValue={setFieldValue} detailData={detailData} uuid={uuid} sid={sid} cid={cid} spaceInfo={spaceInfo} reload={reload} />
            </Col>
          </Row>
        );
      case 2:
        return (
          <Row className="audits-list thin-scrollbar">
            <Col xs={12} sm={12} lg={12}>
              <PreviewForm spaceInfo={spaceInfo} isRequestorInfo={isRequestorInfo} detailData={detailData} />
            </Col>
          </Row>
        );
      default:
        return <ExternalReportSuccess />;
    }
  } else {
    switch (step) {
      case 0:
        return (
          <Row className="audits-list thin-scrollbar">
            <Col md={12} sm={12} lg={12} xs={12}>
              <TicketInfo formField={formField} setFieldValue={setFieldValue} detailData={detailData} uuid={uuid} sid={sid} cid={cid} spaceInfo={spaceInfo} reload={reload} />
            </Col>
          </Row>
        );
      case 1:
        return (
          <Row className="audits-list thin-scrollbar">
            <Col xs={12} sm={12} lg={12}>
              <PreviewForm spaceInfo={spaceInfo} isRequestorInfo={isRequestorInfo} detailData={detailData} />
            </Col>
          </Row>
        );
      default:
        return <ExternalReportSuccess />;
    }
  }
}
