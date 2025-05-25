/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Button } from '@mui/material';

import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import DetailViewFormat from '@shared/detailViewFormat';
import SSOValidation from '@shared/ssoValidation';

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
import { detectMimeType, getAccountIdFromUrl } from '../util/appUtils';

const queryString = require('query-string');

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const BasicInfo = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const propValues = props;
  const values = queryString.parse(propValues.location.search);
  const { hcid } = values;
  const [isNext, setNext] = useState(false);
  const [isSSOVerified, setSSOVerified] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [otpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [visitorDetails, setVisitorDetails] = useState(false);
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

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
      // dispatch(getVpConfig(uuid));
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSConfig?uuid=${uuid}&portalDomain=${window.location.origin}`,
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
  }, [uuid, isAuthenticated]);

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';

  function handleSubmit(values) {
    if ((detailData.is_send_otp_email || detailData.is_send_otp_sms) && (values.email || values.phone)) {
      setOTPInfo({ loading: true, data: null, err: null });
      const data = {
        uuid, name: values.visitor_name, email: values.email, mobile: values.phone, type: 'send', log_id: 'none',
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/sendOTP`,
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

  const handleReset = (resetForm, setFieldValue) => {
    setVisitorDetails(false);
    resetForm();
    setFieldValue('visitor_name', '');
    setFieldValue('type_of_visitor', null);
  };

  const isSSORequired = vpConfig && vpConfig.data && vpConfig.count > 0 && detailData && detailData.is_sso_required;

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/visitormanagement/visitrequest',
        state: { referrer: 'add-request' },
      }}
      />
    );
  }

  return (
    <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
      {accid && isSSORequired && !isSSOVerified && (vpConfig && vpConfig.data && vpConfig.count > 0) && (
      <SSOValidation
        accid={accid}
        setApprove={setSSOVerified}
        opLogo={idcardIcon}
        companyName={detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
        companyLogo={detailData.company && detailData.company.logo ? detailData.company.logo : false}
        title={detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Visitor Pass'}
        description=""
      />
      )}
      {((accid && isSSORequired && isSSOVerified) || (!isSSORequired) || !accid) && vpConfig && vpConfig.data && vpConfig.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <>
          <CardBody className="p-2 mb-3 bg-ghost-white">
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="8" lg="8" xs="8">
                <h4 className="mb-1 mt-0 font-family-tab">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="2" lg="2" xs="2">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="140"
                  height="auto"
                  className="d-inline-block align-top pr-2"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          </CardBody>
          <h4 className="mb-0 font-family-tab">
            <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
            {detailData && detailData.visit_pass_header ? detailData.visit_pass_header : 'Visitor Pass'}
          </h4>
          <hr className="mt-0" />
          {!isNext && (
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, values, setFieldValue, resetForm, errors,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <BasicForm visitorDetails={visitorDetails} setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
                </ThemeProvider>
                <hr />
                <div className="float-right mt-1">
                  <Button
                    type="button"
                    size="md"
                    className="mr-2 submit-btn"
                    onClick={handleReset.bind(null, resetForm, setFieldValue)}
                    variant="contained btn-cancel"
                  >
                    <span>CANCEL</span>
                  </Button>
                  <Button
                    disabled={(!(isValid) && !(values.visitor_name && values.type_of_visitor && values.type_of_visitor.value))}
                    type="submit"
                    size="md"
                    className="submit-btn"
                    variant="contained"
                  >
                    <span>NEXT</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          )}
          {isNext && (
            <MobileVerification accid={accid} visitorDetails={visitorDetails} onReset={() => setVisitorDetails(false)} onNext={() => setNext(false)} detailData={detailData} otpInfo={otpInfo} vpConfig={vpConfig} hcid={hcid} />
          )}
        </>
      </Col>
      )}
      {vpConfig && vpConfig.data && !vpConfig.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger font-family-tab">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      <DetailViewFormat detailResponse={vpConfig} />
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
