/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import { Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import QRCode from 'qrcode.react';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import imageUpload from '@images/userProfile.jpeg';
import checkGreen from '@images/icons/checkGreen.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import validationSchema from './mainFormModel/validationSchema';
import mainFormModel from './mainFormModel/formModel';
import formInitialValues from './mainFormModel/formInitialValues';
import theme from '../util/materialTheme';
import VerificationForm from './verificationForm';

import { getDefaultNoValue, generateFieldName, getMutliFieldsAddArray } from '../util/appUtils';
import { getTabName } from '../util/getDynamicClientData';

const { formId, formField } = mainFormModel;
const appConfig = require('../config/appConfig').default;

const MobileVerification = (props) => {
  const {
    onNext,
    detailData,
    onReset,
    accid,
    visitorDetails,
    vpConfig,
    otpInfo,
    hcid,
  } = props;
  const [createInfo, setCreateInfo] = useState({ loading: false, data: null, err: null });
  const [visitorDetail, setVisitorDetail] = useState(false);
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const [photoType, setPhotoType] = useState(false);
  const [docType, setDocType] = useState(false);

  const [resendOtpInfo, setResendOTPInfo] = useState({ loading: false, data: null, err: null });

  const sizeValue = 200;

  const visitorMobile = visitorDetails && visitorDetails.phone ? visitorDetails.phone : '';
  const visitorName = visitorDetails && visitorDetails.visitor_name ? visitorDetails.visitor_name : '';
  const visitorEmail = visitorDetails && visitorDetails.email ? visitorDetails.email : '';
  // const visitorType = visitorDetails && visitorDetails.visitor_type && visitorDetails.visitor_type.value ? visitorDetails.visitor_type.value : false;
  // values.type_of_visitor ? values.type_of_visitor.value ? values.type_of_visitor.value : values.type_of_visitor.name : false;
  const visitorType = visitorDetails && visitorDetails.type_of_visitor ? visitorDetails.type_of_visitor.value ? visitorDetails.type_of_visitor.value : visitorDetails.type_of_visitor.name : false;

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  useEffect(() => {
    if (createInfo && createInfo.data && createInfo.data.id) {
      onReset();
      if (visitorDetail && (visitorDetail.image_medium || visitorDetail.attachment)) {
        setStatusInfo({ loading: true, data: null, err: null });
        const data = {
          uuid: createInfo.data.uuid,
          attachment: visitorDetail.attachment,
          image_medium: visitorDetail.image_medium && visitorDetail.image_medium.length ? visitorDetail.image_medium : false,
        };

        const postData = new FormData();
        Object.keys(data).map((payloadObj) => {
          postData.append(payloadObj, data[payloadObj]);
          return postData;
        });
        const config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/vms/Attachment`,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept-Language': 'en-US',
            portalDomain: window.location.origin,
            accountId: accid,
          },
          data: postData,
        };

        axios(config)
          .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
          .catch((error) => {
            setStatusInfo({ loading: false, data: null, err: error });
          });
      }
    }
  }, [createInfo]);

  function getLogId() {
    let result = 0;
    if (resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.length) {
      result = resendOtpInfo.data[0];
    } else if (otpInfo && otpInfo.data && otpInfo.data.length) {
      result = otpInfo.data[0];
    }
    return result;
  }

  function getAdditionalFields(values) {
    let result = [];
    console.log(values);
    if (detailData && detailData.additional_fields_ids && detailData.additional_fields_ids.length > 0) {
      result = detailData.additional_fields_ids.map((cl) => ({
        name: cl.label,
        value: values[generateFieldName(cl.label)] ? values[generateFieldName(cl.label)] : '',
      }));
    }
    return result;
  }

  function handleSubmit(values) {
    setCreateInfo({
      loading: true, data: null, count: 0, err: null,
    });
    const data = {
      type_of_visitor: visitorType,
      visitor_name: visitorName,
      email: visitorEmail,
      phone: visitorMobile,
      organization: values.organization,
      tenant_id: values.tenant_id && values.tenant_id.name ? values.tenant_id.name : false,
      host_name: values.host_name,
      host_email: values.host_email,
      purpose: values.purpose,
      Visitor_id_details: values.Visitor_id_details,
      id_proof: values.id_proof,
      attachment: values.attachment,
      additional_fields_ids: getAdditionalFields(values),
      planned_in: values.planned_in ? moment(values.planned_in).utc().format('YYYY-MM-DD HH:mm:ss') : false,
      image_medium: values.image_medium && values.image_medium.length ? values.image_medium : false,
    };

    setVisitorDetail(data);

    const postValues = {
      type_of_visitor: visitorType,
      visitor_name: visitorName,
      email: visitorEmail,
      phone: visitorMobile,
      organization: values.organization,
      tenant_id: values.tenant_id && values.tenant_id.id ? values.tenant_id.id : false,
      host_name: values.host_name,
      host_email: values.host_email,
      purpose: values.purpose,
      Visitor_id_details: values.Visitor_id_details,
      id_proof: values.id_proof && values.id_proof.id ? values.id_proof.id : false,
      planned_in: values.planned_in ? moment(values.planned_in).utc().format('YYYY-MM-DD HH:mm:ss') : false,
      origin_status: 'Guest Initiated',
      additional_fields_ids: getMutliFieldsAddArray(getAdditionalFields(values)),
      // attachment: values.attachment,
      // image_medium: values.image_medium && values.image_medium.length ? values.image_medium : false,
    };

    const context = { lang: 'en_US' };

    const payload = { uuid: detailData.uuid, values: postValues };

    const postData = new FormData();
    postData.append('values', JSON.stringify(payload.values));
    /* if (typeof payload === 'object') {
      Object.keys(payload).map((payloadObj) => {
        if (payloadObj !== 'uuid') {
          postData.append(payloadObj, payload[payloadObj]);
        }
        return postData;
      });
    } */
    postData.append('uuid', payload.uuid);
    postData.append('context', JSON.stringify(context));
    postData.append('log_id', getLogId());

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/vms/createRequest`,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept-Language': 'en-US',
        portalDomain: window.location.origin,
        accountId: accid,
      },
      data: postData,
    };

    axios(config)
      .then((response) => setCreateInfo({
        loading: false, data: response.data.data, count: response.data.status, err: response.data.error,
      }))
      .catch((error) => {
        setCreateInfo({
          loading: false, data: null, count: 0, err: error,
        });
      });
  }

  const resetRequest = () => {
    setPhotoType(false);
    setDocType(false);
    onReset();
    onNext();
  };

  const handleQRExport = () => {
    const telephoneImg = document.getElementById('telephone_img');
    const mailImg = document.getElementById('mail_img');

    if (telephoneImg) {
      telephoneImg.style.display = 'none';
    }
    if (mailImg) {
      mailImg.style.display = 'none';
    }
    setTimeout(() => {
      const content = document.getElementById('print_report');
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      if (telephoneImg) {
        telephoneImg.style.display = 'initial';
      }
      if (mailImg) {
        mailImg.style.display = 'initial';
      }
    }, 3000);
  };

  const showHr = ((detailData.has_visitor_company && detailData.has_visitor_company !== 'None') || (detailData.has_host_name && detailData.has_host_name !== 'None')
  || (detailData.has_host_company && detailData.has_host_company !== 'None' && detailData && detailData.tenant_ids && detailData.tenant_ids.length > 1)
  || (detailData.has_host_email && detailData.has_host_email !== 'None') || (detailData.show_planned_in)
  || (detailData.has_identity_proof && detailData.has_identity_proof !== 'None') || (detailData.has_visitor_id_details && detailData.has_visitor_id_details !== 'None')
  || (detailData.has_purpose && detailData.has_purpose !== 'None') || (detailData.is_enable_conditions) || (detailData && detailData.additional_fields_ids && detailData.additional_fields_ids.length > 0));

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, setFieldValue, setFieldTouched, dirty,
      }) => (
        <Form id={formId}>
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <ThemeProvider theme={theme}>
              <VerificationForm
                onNext={onNext}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                formField={formField}
                detailData={detailData}
                otpInfo={otpInfo}
                visitorMobile={visitorMobile}
                visitorName={visitorName}
                visitorEmail={visitorEmail}
                accid={accid}
                setPhotoType={setPhotoType}
                setDocType={setDocType}
                setResendOTPInfo={setResendOTPInfo}
                hcid={hcid}
              />
            </ThemeProvider>
          )}
          {(createInfo && createInfo.data && !createInfo.count) && (
            <div className="text-center mt-5">
              <SuccessAndErrorFormat response={createInfo} />
            </div>
          )}
          {(createInfo && createInfo.loading) && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(createInfo && createInfo.data && createInfo.data.id) && (
            <div className="mt-2">
              {visitorDetail && (
              <>
                <Card className="bg-lightblue mb-2" id="print_report">
                  <CardBody className="p-3">
                    <Row>
                      <Col md="2" sm="12" lg="2" xs="12" className="text-center">
                        <img
                          src={visitorDetail.image_medium && photoType ? `${photoType}${visitorDetail.image_medium}` : imageUpload}
                          alt="imageUpload"
                          width="80"
                          height="80"
                          className="mb-3 border-radius-50 user-circle"
                        />
                      </Col>
                      <Col md="10" sm="12" lg="10" xs="12">
                        <h5>
                          Welcome,
                          {'   '}
                          {visitorDetail.visitor_name}
                          {' '}
                          !
                        </h5>
                        {detailData.has_visitor_mobile && detailData.has_visitor_mobile !== 'None' && (
                        <p className="mb-0">
                          <img src={telephoneIcon} id="telephone_img" className="mr-2" alt="phone" width="15" height="15" />
                          <span className="ml-1">{getDefaultNoValue(visitorDetail.phone)}</span>
                        </p>
                        )}
                        {detailData.has_visitor_email && detailData.has_visitor_email !== 'None' && (
                        <p className="mb-0">
                          <img src={envelopeIcon} id="mail_img" className="mr-2" alt="mail" width="15" height="15" />
                          <span className="ml-1">{getDefaultNoValue(visitorDetail.email)}</span>
                        </p>
                        )}
                      </Col>
                    </Row>
                    {showHr && (
                    <hr className="mb-1 mt-1" />
                    )}
                    {visitorDetail.additional_fields_ids && visitorDetail.additional_fields_ids.length > 0 && visitorDetail.additional_fields_ids.map((item) => (
                      <p className="mb-0">
                        <span className="font-weight-400">
                          {item.name}
                          {' '}
                          :
                          {' '}
                        </span>
                        <span className="font-weight-800 ml-1">{item.value && item.value.label ? item.value.label : getDefaultNoValue(item.value)}</span>
                      </p>
                    ))}
                    {detailData.has_visitor_company && detailData.has_visitor_company !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">Visitor Company : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.organization)}</span>
                    </p>
                    )}
                    {detailData.has_host_name && detailData.has_host_name !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">Host Name : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.host_name)}</span>
                    </p>
                    )}
                    {detailData.has_host_company && detailData.has_host_company !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">Visiting Company : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.tenant_id)}</span>
                    </p>
                    )}
                    {detailData.has_host_email && detailData.has_host_email !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">Host Email : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.host_email)}</span>
                    </p>
                    )}
                    {detailData.has_purpose && detailData.has_purpose !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">Purpose : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.purpose)}</span>
                    </p>
                    )}
                    {detailData.has_identity_proof && detailData.has_identity_proof !== 'None' && (
                    <p className="mb-0">
                      <span className="font-weight-400">ID Proof : </span>
                      <span className="font-weight-800 ml-1">
                        {visitorDetail.attachment && docType && visitorDetail.id_proof && visitorDetail.id_proof.name ? visitorDetail.id_proof.name : '-'}
                      </span>
                    </p>
                    )}
                    {detailData.has_vistor_id_details && detailData.has_vistor_id_details !== 'None' && (
                      <p className="mb-0">
                        <span className="font-weight-400">ID Proof Number : </span>
                        <span className="font-weight-800 ml-1">
                          {visitorDetail.Visitor_id_details && visitorDetail.Visitor_id_details ? visitorDetail.Visitor_id_details : '-'}
                        </span>
                      </p>
                    )}
                    {detailData && !detailData.approval_required_from_host_external && (
                    <>
                      <hr className="mb-1 mt-1" />
                      <div className="text-center">
                        <p className="font-weight-800">
                          {vpConfig && vpConfig.data && vpConfig.data.visit_request_created_text ? vpConfig.data.visit_request_created_text : (
                            <>
                              Please use QR code at Check In / Check Out
                            </>
                          )}
                        </p>
                        <QRCode value={createInfo.data.uuid} renderAs="svg" includeMargin level="H" size={sizeValue} />
                      </div>
                    </>
                    )}
                    {detailData && detailData.approval_required_from_host_external && (
                    <div className="text-center p-2">
                      <img src={checkGreen} className="mr-2" alt="Approved" width="20" height="20" />
                      <span className="text-success">
                        The visit request has been created successfully,Waiting for the host approval.
                      </span>
                    </div>
                    )}
                  </CardBody>
                </Card>
                <iframe name="print_frame" title="Visitor_Pass" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
              </>
              )}
              <div className="float-right">
                <Button
                  type="button"
                  size="md"
                  onClick={() => resetRequest()}
                  variant={detailData && detailData.approval_required_from_host_external ? 'contained' : 'contained btn-cancel'}
                >
                  <span>{detailData && detailData.approval_required_from_host_external ? 'Ok' : 'Cancel'}</span>
                </Button>
                {detailData && !detailData.approval_required_from_host_external && (
                <Button
                  type="button"
                  size="md"
                  className="ml-2"
                  onClick={() => handleQRExport()}
                  variant="contained"
                >
                  <span>Print</span>
                </Button>
                )}
              </div>
            </div>
          )}
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <>
              <hr />
              <div className="float-right mt-1">
                <Button
                  type="button"
                  size="md"
                  className="mr-2 submit-btn"
                  onClick={() => resetRequest()}
                  variant="contained btn-cancel"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  disabled={(!isValid || (createInfo && createInfo.loading) || (statusInfo && statusInfo.loading))}
                  type="submit"
                  size="md"
                  className="submit-btn"
                  variant="contained"
                >
                  <span>Submit</span>
                </Button>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

MobileVerification.propTypes = {
  onNext: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  otpInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visitorDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  vpConfig: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default MobileVerification;
