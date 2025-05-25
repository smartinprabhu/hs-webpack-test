/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Card,
  Col,
  Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Image } from 'antd';

import DetailViewFormat from '@shared/detailViewFormat';

import idcardIcon from '@images/icons/idcard.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import MobileVerification from './mobileVerification';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import { getDefaultNoValue, getAccountIdFromUrl, detectMimeType } from '../util/appUtils';
import {
  visitorStatusJson,
} from '../commonComponents/utils/util';

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;
const appModels = require('../util/appModels').default;

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [isNext, setNext] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [otpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [visitorInfo, setVisitorInfo] = useState({ loading: false, data: null, err: null });
  const [visitorCompanyInfo, setVisitCompanyInfo] = useState({ loading: false, data: null, err: null });
  const [visitorDetails, setVisitorDetails] = useState(false);
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const sizeValue = 200;

  // const { vpConfig } = useSelector((state) => state.setup);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');
  const stickyFooter = document.getElementById('sticky_footer');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setVisitorInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","name","visitor_name","image_medium","entry_status","phone","email","state","host_name","host_email","planned_in","organization","Visitor_id_details","purpose",("purpose_id", ["id", "name"]),("company_id", ["id", "name","logo"]),("id_proof", ["id", "name"])]';
      const payload = `domain=[["uuid","=","${uuid}"]]&model=${appModels.VISITREQUEST}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVisitorInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVisitorInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  const visitorData = visitorInfo && visitorInfo.data && visitorInfo.data.length ? visitorInfo.data[0] : '';

  useEffect(() => {
    if (visitorInfo && visitorInfo.data && visitorInfo.data.length && visitorInfo.data[0].state === 'Draft' && visitorInfo.data[0].company_id && visitorInfo.data[0].company_id.id) {
      // dispatch(getVpConfig(uuid));
      setVisitCompanyInfo({
        loading: true, data: null, count: 0, err: null,
      });
      /* const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSConfig?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
        },
      }; */

      const payload = `domain=[["company_id","=",${visitorInfo.data[0].company_id.id}]]&model=${appModels.VMSCONFIGURATION}&fields=["uuid"]&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVisitCompanyInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVisitCompanyInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [visitorInfo]);

  useEffect(() => {
    if (visitorCompanyInfo && visitorCompanyInfo.data && visitorCompanyInfo.data.length && visitorCompanyInfo.data[0].uuid) {
      // dispatch(getVpConfig(uuid));
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSConfig?uuid=${visitorCompanyInfo.data[0].uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [visitorCompanyInfo]);

  useEffect(() => {
    if (visitorInfo && visitorInfo.data && visitorInfo.data.length) {
      setVisitorDetails(visitorInfo.data[0]);
    }
  }, [visitorInfo]);

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';

  function handleSubmit(values) {
    if ((detailData.is_send_otp_email || detailData.is_send_otp_sms) && (values.email || values.phone)) {
      setOTPInfo({ loading: true, data: null, err: null });
      const data = {
        req_uuid: uuid, name: values.visitor_name, email: values.email, mobile: values.phone, type: 'send', log_id: 'none',
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/getVisitorOTP`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setOTPInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setOTPInfo({ loading: false, data: null, err: error });
        });
    }

    setVisitorDetails(values);
    setNext(true);
  }

  const handleReset = (resetForm) => {
    setVisitorDetails(false);
    resetForm();
  };

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/visitormanagement/visitrequest',
        state: { referrer: 'add-request' },
      }}
      />
    );
  }

  const checkVisitStatus = (val) => (
    <div className="d-inline-block">
      {visitorStatusJson.map((status) => val === status.status && (
        <div>
          {status.text}
        </div>
      ))}
    </div>
  );

  return (
    <Row className="external-link-tickets ml-1 mr-1 mt-2 mb-2 p-3">
      {vpConfig && vpConfig.data && vpConfig.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <>
          <CardBody className="p-0 mb-3 bg-ghost-white">
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="7" lg="8" xs="7">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="3" lg="2" xs="3">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="70"
                  height="auto"
                  className="d-inline-block align-top pr-2"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          </CardBody>
          <h5 className="mb-0 mt-4">
            <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
            Visitor Pass
          </h5>
          <hr className="mt-0" />
          {!isNext && (
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, values, setFieldValue, resetForm,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <BasicForm visitorDetails={visitorDetails} visitorData={visitorData} setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
                </ThemeProvider>
                <hr />
                <div className="float-right mt-1">
                  <Button
                    type="button"
                    size="md"
                    className="mr-2 btn-cancel"
                    onClick={handleReset.bind(null, resetForm)}
                    variant="contained"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    disabled={(!(isValid) && !(values.visitor_name))}
                    type="submit"
                    size="md"
                    variant="contained"
                  >
                    <span>Next</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          )}
          {isNext && (
            <MobileVerification accid={accid} uuid={uuid} visitorData={visitorData} visitorDetails={visitorDetails} onReset={() => setVisitorDetails(false)} onNext={() => setNext(false)} detailData={detailData} otpInfo={otpInfo} vpConfig={vpConfig} />
          )}
        </>
      </Col>
      )}
      {vpConfig && vpConfig.data && !vpConfig.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      {visitorInfo && visitorInfo.data && !visitorInfo.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      {visitorInfo && visitorInfo.data && visitorInfo.data.length > 0 && visitorInfo.data[0].state !== 'Draft' && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        {visitorInfo.data[0].state !== 'Approved' && (
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">
            Oops! Your request is
            {' '}
            &quot;
            {visitorInfo.data[0].state}
            &quot;
            {'  '}
            stage.
          </h4>
        </div>
        )}
        {visitorInfo.data[0].state === 'Approved' && (visitorInfo.data[0].entry_status !== 'Invited' && visitorInfo.data[0].entry_status !== 'Checkin') && (
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">
            Oops! Your request is
            {' '}
            &quot;
            {checkVisitStatus(visitorInfo.data[0].entry_status)}
            &quot;
            .
          </h4>
        </div>
        )}
        {visitorInfo.data[0].state === 'Approved' && (visitorInfo.data[0].entry_status === 'Invited' || visitorInfo.data[0].entry_status === 'Checkin') && (
          <>
            <CardBody className="p-2 mb-3 bg-ghost-white">
              <Row className="content-center">
                <Col md="1" sm="2" lg="1" xs="2">
                  <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
                </Col>
                <Col md="8" sm="8" lg="8" xs="8">
                  <h4 className="mb-1 mt-0">
                    Welcome to
                    {' '}
                    {visitorData.company_id && visitorData.company_id.name ? visitorData.company_id.name : ''}
                  </h4>
                </Col>
                <Col md="2" sm="2" lg="2" xs="2">
                  <img
                    src={visitorData.company_id && visitorData.company_id.logo ? `data:${detectMimeType(visitorData.company_id.logo)};base64,${visitorData.company_id.logo}` : getExportLogo()}
                    width="140"
                    height="auto"
                    className="d-inline-block align-top pr-2"
                    alt="Helixsense Portal"
                  />
                </Col>
              </Row>
            </CardBody>
            <h4 className="mb-0">
              <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
              Visitor Pass
            </h4>
            <hr className="mt-0" />
            <Card className="bg-lightblue mb-2" id="print_reports">
              <CardBody className="p-3">
                <h5 className="text-center mb-3">
                  Hi
                  {' '}
                  {visitorData.visitor_name}
                  , Please use QR code at Check In / Check Out
                </h5>
                {visitorData && visitorData.image_medium && (
                  <>
                    <hr className="mb-1 mt-1" />
                    <div className="text-center">
                      <Image.PreviewGroup>
                        <Image
                          width={100}
                          height={100}
                          src={`data:${detectMimeType(visitorData.image_medium)};base64,${visitorData.image_medium}`}
                        />
                      </Image.PreviewGroup>
                    </div>
                    <hr className="mb-1 mt-1" />
                  </>
                )}
                <Row>
                  <Col md="1" sm="12" lg="1" xs="12" />

                  <Col md="5" sm="12" lg="5" xs="12">
                    <p className="mb-0">
                      <span className="font-weight-400">Status : </span>
                      <span className="font-weight-800 ml-1 text-info">{getDefaultNoValue(visitorData.state)}</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">Name : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorData.visitor_name)}</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">Mobile : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorData.phone)}</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">Email : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorData.email)}</span>
                    </p>
                  </Col>
                  <Col md="5" sm="12" lg="5" xs="12">
                    <p className="mb-0">
                      <span className="font-weight-400">Organization : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorData.organization)}</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">Purpose : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorData.purpose_id && visitorData.purpose_id.name && visitorData.purpose_id.name !== 'Other' ? visitorData.purpose_id.name : visitorData.purpose)}</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">ID Proof : </span>
                      <span className="font-weight-800 ml-1">
                        {visitorData.id_proof && visitorData.id_proof.name ? visitorData.id_proof.name : '-'}
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">ID Proof Number : </span>
                      <span className="font-weight-800 ml-1">
                        {visitorData.Visitor_id_details && visitorData.Visitor_id_details ? visitorData.Visitor_id_details : '-'}
                      </span>
                    </p>
                  </Col>
                  <Col md="1" sm="12" lg="1" xs="12" />
                </Row>
                <hr className="mb-1 mt-1" />
                <div className="text-center">
                  <QRCode value={uuid} renderAs="svg" includeMargin level="H" size={sizeValue} />
                  <p className="mb-0">{visitorData.name}</p>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Col>
      )}
      <DetailViewFormat detailResponse={vpConfig} />
      <DetailViewFormat detailResponse={visitorInfo} />
    </Row>
  );
};

BasicInfo.defaultProps = {
  match: false,
};

BasicInfo.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default BasicInfo;
