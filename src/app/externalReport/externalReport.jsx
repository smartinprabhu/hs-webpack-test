/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button as Old, CardBody,
  Row, Col, Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Box,
  IconButton,
  Button,
} from '@mui/material';

import externalReportBlack from '@images/icons/externalReport/externalReportBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import Loader from '@shared/loading';
import SSOValidation from '@shared/ssoValidation';

import ExternalReportSuccess from './externalReportSuccess';
import validationSchema from './formModel/validationSchema';
import validationRequestorMobile from './formModel/validationRequestorMobile';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import AuthService from '../util/authService';
import { last } from '../util/staticFunctions';
import { detectMob, getAccountIdFromUrl, prepareDocuments } from '../util/appUtils';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import { renderStepWebView, renderStepMobileView } from './forms/utils';
import {
  getUploadImage,
} from '../helpdesk/ticketService';
import StaticUrls from './staticUrls.json';

import useStyles from './styles';

const queryString = require('query-string');

const appConfig = require('../config/appConfig').default;

const { formId } = checkoutFormModel;

const ExternalReport = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const isMobileView = detectMob();
  const propValues = props;
  const values = queryString.parse(propValues.location.search);
  const { sid } = values;
  const { cid } = values;
  const accid = getAccountIdFromUrl(props);
  const [ticketConfig, setTicketConfig] = useState({ loading: false, data: null, err: null });
  const [spaceInfo, setSpaceInfo] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [activeStep, setActiveStep] = useState(0);
  const [reset, setReset] = useState(false);
  const [responseModal, showResponseModal] = useState(false);
  const [reload, setReload] = useState('1');

  const [resendOtpInfo, setOTPFormInfo] = useState({ loading: false, data: null, err: null });
  const [sendOtpInfo, setSendOTPFormInfo] = useState({ loading: false, data: null, err: null });

  const detailData = ticketConfig && ticketConfig.data ? ticketConfig.data : '';

  const isRequestorInfo = detailData && detailData.is_enable_external_helpdesk;

  const currentValidationSchema = isMobileView && isRequestorInfo ? validationRequestorMobile[activeStep] : validationSchema[activeStep];

  const steps = isMobileView && isRequestorInfo ? ['Requestor Info', 'Ticket Info', 'Summary of Report'] : ['Raise a Ticket', 'Summary of Report'];

  const isLastStep = activeStep === steps.length - 1;
  const headingTxt = isLastStep ? 'Summary' : 'Raise a Ticket';

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const [attachmentDetail, setAttachmentDetail] = useState(false);
  const [createInfo, setCreateInfo] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const [disclaimerTrue, setDisclaimerTrue] = useState(false);
  const [isSSOVerified, setSSOVerified] = useState(false);
  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const CompareUrl = StaticUrls.data.find((data) => data === window.location.href);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const isAttachmentInfo = detailData && detailData.requires_attachment === 'Required';

  let imageAttach = true;
  if (isAttachmentInfo && (!isMobileView || (isMobileView && activeStep === 1))) {
    imageAttach = !!(uploadPhoto && uploadPhoto.length > 0);
  }

  const oneSignalDiv = document.getElementById('onesignal-bell-container');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (CompareUrl) {
    window.location.replace(`${StaticUrls.replaceUrl}/ticket${CompareUrl.split('ticket')[1]}`);
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setTicketConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getHelpdeskConfig?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setTicketConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setTicketConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    setSpaceInfo({
      loading: true, data: null, count: 0, err: null,
    });
    const config = {
      method: 'get',
      url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/getSpaces?uuid=${uuid}&portalDomain=${window.location.origin}`,
      headers: {
        portalDomain: window.location.origin,
        accountId: accid,
      },
    };
    axios(config)
      .then((response) => setSpaceInfo({
        loading: false, data: response.data.data, count: response.data.length, err: null,
      }))
      .catch((error) => {
        setSpaceInfo({
          loading: false, data: null, count: 0, err: error,
        });
      });
  }, []);

  useEffect(() => {
    if (reset) {
      setSpaceInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/getSpaces?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setSpaceInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setSpaceInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (createInfo && createInfo.data) {
      localStorage.setItem('ticket_name', '');
      localStorage.setItem('ticket_mobile', '');
      localStorage.setItem('ticket_mail', '');

      const attachments = [];

      if (attachmentDetail) {
        setStatusInfo({ loading: true, data: null, err: null });
        // attachmentDetail.res_id = createInfo.data && createInfo.data.length ? createInfo.data[0] : '';
        const createId = createInfo.data && createInfo.data.length ? createInfo.data[0] : '';
        const dcreate = prepareDocuments(uploadPhoto, createId);
        attachments.push(JSON.stringify(dcreate));
        const data = {
          uuid,
          values: attachments,
        };
        const postData = new FormData();
        Object.keys(data).map((payloadObj) => {
          postData.append(payloadObj, data[payloadObj]);
          return postData;
        });
        const config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/attachment`,
          headers: {
            'Content-Type': 'multipart/form-data',
            portalDomain: window.location.origin,
            accountId: accid,
          },
          data: postData,
        };
        dispatch(getUploadImage());
        axios(config)
          .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
          .catch((error) => {
            setStatusInfo({ loading: false, data: null, err: error });
          });
      }
    }
  }, [createInfo]);

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'string') {
      return arr[0];
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }

  function getLogId() {
    let result = 0;
    if (resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.ids && resendOtpInfo.data.ids.length) {
      result = resendOtpInfo.data.ids[0];
    } else if (sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.ids && sendOtpInfo.data.ids.length) {
      result = sendOtpInfo.data.ids[0];
    }
    return result;
  }

  function submitForm(values, actions) {
    setCreateInfo({
      loading: true, data: null, count: 0, err: null,
    });
    const postValues = [{
      mobile: values.mobile,
      email: values.email,
      person_name: values.person_name,
      category_id: values.category_id ? values.category_id.id : '',
      sub_category_id: values.sub_category_id ? values.sub_category_id.id : '',
      asset_id: values.asset_id && values.asset_id.length > 0 ? checkDataType(values.asset_id) : false,
      subject: values.subject,
      work_location: values.work_location,
      description: values.description,
      ticket_type: 'Reactive',
    }];

    if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0) {
      setAttachmentDetail(uploadPhoto);
    }

    const payload = { uuid: detailData.uuid, values: postValues };

    const postData = new FormData();
    postData.append('values', JSON.stringify(payload.values));
    postData.append('uuid', payload.uuid);
    postData.append('log_id', getLogId());

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/submitticket`,
      headers: {
        'Content-Type': 'multipart/form-data',
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
    showResponseModal(true);
    actions.setSubmitting(false);
  }

  function handleSubmit(values, actions) {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function handleBack() {
    setActiveStep(activeStep - 1);
    setReload('0');
  }

  const handleReset = (resetForm) => {
    setActiveStep(0);
    setReset(true);
    setDisclaimerTrue(false);
    resetForm();
    showResponseModal(false);
    dispatch(getUploadImage([]));
  };

  const saveBtnTxt = isLastStep ? 'Submit' : 'Next';

  const onCancel = () => {
    setActiveStep(0);
  };

  const loading = (createInfo && createInfo.loading) || (statusInfo && statusInfo.loading);
  const configLoading = (ticketConfig && ticketConfig.loading);

  const isSSORequired = ticketConfig && ticketConfig.data && ticketConfig.count > 0 && detailData && detailData.is_sso_required;

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/helpdesk/add-ticket',
      }}
      />
    );
  }

  if (ticketConfig && ticketConfig.data && (!ticketConfig.count || !isRequestorInfo)) {
    return (
      <Redirect to={{
        pathname: `/oneqr/${uuid}`,
      }}
      />
    );
  }

  return (
    <Box sx={{ fontFamily: 'Suisse Intl' }}>
      {accid && isSSORequired && !isSSOVerified && (ticketConfig && ticketConfig.data && ticketConfig.count > 0 && isRequestorInfo) && (
      <SSOValidation
        accid={accid}
        setApprove={setSSOVerified}
        opLogo={externalReportBlack}
        companyName={detailData && detailData.company_id && detailData.company_id.name ? detailData.company_id.name : ''}
        companyLogo={detailData.company_id && detailData.company_id.logo ? detailData.company_id.logo : false}
        title={headingTxt}
        description=""
      />
      )}
      {((accid && isSSORequired && isSSOVerified) || (!isSSORequired) || !accid) && ticketConfig && ticketConfig.data && ticketConfig.count > 0 && isRequestorInfo && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <CardBody className="p-2 mb-1 bg-ghost-white">
          <Row className="content-center">
            <Col md="9" sm="9" lg="9" xs="9">
              <div className="header-text text-uppercase">
                {detailData && detailData.company_id && detailData.company_id.name ? detailData.company_id.name : ''}
              </div>
            </Col>
            <Col md="3" sm="3" lg="3" xs="3">
              <img
                src={getExportLogo()}
                width="130"
                height="auto"
                className="d-inline-block align-top"
                alt="Helixsense Portal"
              />
            </Col>
          </Row>
        </CardBody>
        <Formik
          initialValues={formInitialValues}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm,
          }) => (
            <>
              <Form id={formId}>
                <Row>
                  <Col md="8" sm="8" xs="8" lg="8">
                    <h5 className={isMobileView ? 'mb-0 collapse-heading' : 'mb-0 '}>
                      <img src={externalReportBlack} alt="ticket" className="w-auto height-28 ml-2 mr-2" />
                      {headingTxt}
                    </h5>
                    {/* <Typography
                            sx={{
                              font: "normal normal medium 20px/24px Suisse Intl",
                              fontWeight: 500,
                            }}
                          >
                            <img src={externalReportBlack} alt="ticket" className="w-auto height-28 ml-2 mr-2" />

                            {headingTxt}
                          </Typography> */}
                  </Col>
                  <Col md="4" sm="4" xs="4" lg="4">
                    <span className="float-right">
                      <IconButton
                        onClick={handleReset.bind(null, resetForm)}
                        className="btn"
                        type="button"
                      >
                        <IoCloseOutline size={28} />
                      </IconButton>
                    </span>
                  </Col>
                </Row>
                <hr className="m-0" />
                {configLoading && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
                )}
                {!configLoading && isMobileView && (
                  renderStepMobileView(activeStep, setFieldValue, detailData, uuid, spaceInfo, isRequestorInfo, reload, sid, cid, setDisclaimerTrue, disclaimerTrue, setOTPFormInfo, setSendOTPFormInfo, accid)
                )}
                {!configLoading && !isMobileView && (
                  renderStepWebView(activeStep, setFieldValue, detailData, uuid, spaceInfo, isRequestorInfo, reload, sid, cid, setDisclaimerTrue, disclaimerTrue, setOTPFormInfo, setSendOTPFormInfo, accid))}
                <hr />
                <div className="float-right">
                  {activeStep !== 0 && (activeStep !== steps.length) ? (
                    <Button onClick={handleBack} sx={{ marginRight: '10px' }} className={classes.button} variant="contained">
                      Back
                    </Button>
                  ) : (<span />)}
                  <Button
                    disabled={!(isValid && dirty) || !disclaimerTrue || (loading) || !imageAttach}
                    type="submit"
                    variant="contained"
                    className={classes.button}
                  >
                    {saveBtnTxt}
                  </Button>
                </div>
              </Form>
              <Modal size="sm" className="border-radius-50px lookupModal" isOpen={responseModal}>
                <ModalHeader className="modal-ticket-header">
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      { /* ((createInfo && createInfo.data && !createInfo.loading)) && (
                      <img
                        aria-hidden="true"
                        className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                        onClick={handleReset.bind(null, resetForm)}
                        alt="close"
                        width="15"
                        height="15"
                        src={closeCirclegreyIcon}
                      />
                      )}
                      {((createInfo && createInfo.err && !createInfo.data)) && (
                      <img
                        aria-hidden="true"
                        className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                        onClick={() => { resetForm(); onCancel(); showResponseModal(false); }}
                        alt="close"
                        width="15"
                        height="15"
                        src={closeCirclegreyIcon}
                      />
                      ) */ }
                      <Row>
                        <Col sm="2" md="2" lg="2" xs="3" className="mt-2 text-right">
                          <img src={externalReportBlack} alt="ticket" width="20" />
                        </Col>
                        <Col sm="10" md="10" lg="10" xs="9" className="mt-2 p-0">
                          <h6 className="ml-1 font-weight-800 font-medium mt-1">
                            Ticket Submitted
                          </h6>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ModalHeader>
                <ModalBody className="text-center">
                  <ExternalReportSuccess createInfo={createInfo} statusInfo={statusInfo} />
                  <hr className="m-0" />
                </ModalBody>
                <div className="text-center p-3">
                  {(((createInfo && createInfo.data) || (statusInfo && statusInfo.data)) && !loading) && (
                  <Button
                    size="sm"
                    type="button"
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                    disabled={createInfo && createInfo.loading}
                  >
                    OK
                  </Button>
                  )}
                  {(createInfo && createInfo.err && !createInfo.data && !createInfo.loading) && (
                  <Button
                    size="sm"
                    type="button"
                    variant="contained"
                    onClick={() => { onCancel(); showResponseModal(false); }}
                    disabled={createInfo && createInfo.loading}
                  >
                    OK
                  </Button>
                  )}
                </div>
              </Modal>
            </>
          )}
        </Formik>
      </Col>
      )}
      {ticketConfig && ticketConfig.data && (!ticketConfig.count || !isRequestorInfo) && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-1">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger font-family-tab">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      {configLoading && (
      <div className="mb-2 mt-3 p-5" data-testid="loading-case">
        <Loader />
      </div>
      )}
    </Box>
  );
};

ExternalReport.defaultProps = {
  match: false,
};

ExternalReport.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default ExternalReport;
