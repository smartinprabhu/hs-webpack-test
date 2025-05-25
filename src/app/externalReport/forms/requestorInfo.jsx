/* eslint-disable react/forbid-prop-types */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Row, Label,
} from 'reactstrap';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import warningDanger from '@images/icons/warningDanger.svg';
import {
  noSpecialChars, detectMob, integerKeyPress,
  getColumnArrayById,
  decodeJWT,
  decodeJWTNameValidate,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';

import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../themes/theme';

const appConfig = require('../../config/appConfig').default;

const requestorInfo = (props) => {
  const {
    detailData,
    setFieldValue,
    setDisclaimerTrue,
    disclaimerTrue,
    setOTPFormInfo,
    setSendOTPFormInfo,
    accid,
    formField: {
      personName,
      mobileValue,
      emailValue,
      otp,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    is_otp_verified,
    otp_code,
    email,
    mobile,
  } = formValues;
  const isMobileView = detectMob();
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const { ssoToken } = useSelector((state) => state.ticket);

  const [otpValidation, setOTPValidation] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });
  const [sendOtpInfo, setSendOTPInfo] = useState({ loading: false, data: null, err: null });
  const [domainValidation, setDomainValidation] = useState(false);

  const [counter, setCounter] = React.useState(59);

  React.useEffect(() => {
    if (sendOtpInfo && sendOtpInfo.data) {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, sendOtpInfo]);

  useEffect(() => {
    if (ssoToken && ssoToken.client && ssoToken.client.account) {
      setFieldValue('email', ssoToken.client.account.userName ? ssoToken.client.account.userName : '');
      setFieldValue('person_name', ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken) ? decodeJWT(ssoToken.tokens.accessToken) : '');
    }
  }, [ssoToken]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_customer_email', detailData.has_reviwer_email);
      setFieldValue('has_customer_name', detailData.has_reviwer_name);
      setFieldValue('has_customer_mobile', detailData.has_reviwer_mobile);
      setFieldValue('requires_verification_by_otp', detailData.requires_verification_by_otp);
    }
  }, [detailData]);

  useEffect(() => {
    if (!mobile || !email) {
      setOTPInfo({ loading: false, data: null, err: null });
      setSendOTPInfo({ loading: false, data: null, err: null });
      setOTPVerifyInfo({ loading: false, data: null, err: null });
      setOTPFormInfo({ loading: false, data: null, err: null });
      setSendOTPFormInfo({ loading: false, data: null, err: null });
      setOTPValidation(false);
      setCounter(59);
    }
  }, [mobile, email]);

  useEffect(() => {
    if (detailData && detailData.allowed_domains_host_ids && detailData.allowed_domains_host_ids.length && email && email.length > 2 && email.includes('@')) {
      const whitelist = detailData.allowed_domains_host_ids ? getColumnArrayById(detailData.allowed_domains_host_ids, 'name') : [];

      const userHasAccess = whitelist.some(
        (domain) => {
          const emailSplit = email.split('@');
          return emailSplit[emailSplit.length - 1].toLowerCase() === domain.toLowerCase();
        },
      );

      if (userHasAccess) {
        setDomainValidation(false);
        setFieldValue('has_email_validation', 'no');
      } else {
        setDomainValidation(true);
        setFieldValue('has_email_validation', '');
      }
    }
  }, [detailData, email]);

  const checkOTPVerify = () => {
    if (otp_code && otp_code.toString().length > 2) {
      setOTPVerifyInfo({ loading: true, data: null, err: null });
      setOTPValidation(false);
      const sendToken = sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.token ? sendOtpInfo.data.token : false;
      const reSendToken = resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.token ? resendOtpInfo.data.token : false;
      const data = {
        uuid: detailData.uuid,
        otp: otp_code,
        token: sendToken || reSendToken,
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/VerifyOTP`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };
      axios(config)
        .then((response) => {
          setOTPVerifyInfo({ loading: false, data: response.data.data, err: null });
          const result = response.data.data;
          if (result && result.verify_stats) {
            setFieldValue('is_otp_verified', 'yes');
            setOTPValidation(false);
          } else {
            setFieldValue('is_otp_verified', '');
            setOTPValidation(true);
          }
        })
        .catch((error) => {
          setOTPVerifyInfo({ loading: false, data: null, err: error });
          setFieldValue('is_otp_verified', '');
          setOTPValidation(true);
        });
    } else {
      setFieldValue('is_otp_verified', '');
      setOTPValidation(true);
    }
  };

  const sendOTP = () => {
    if ((email && email.includes('@') && !domainValidation) || (mobile && mobile.toString().length > 8)) {
      setSendOTPInfo({ loading: false, data: true, err: null });
      setSendOTPFormInfo({ loading: false, data: true, err: null });
      const data = {
        uuid: detailData.uuid,
        email: email && email.includes('@') ? email : 'None',
        mobile: mobile && mobile.toString().length > 8 ? mobile : 'None',
        type: 'send',
      };

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/sendOTP`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          setSendOTPInfo({ loading: false, data: response.data.data, err: null });
          setSendOTPFormInfo({ loading: false, data: response.data.data, err: null });
        })
        .catch((error) => {
          setSendOTPInfo({ loading: false, data: null, err: error });
          setSendOTPFormInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const resendOTP = () => {
    if ((email && email.includes('@') && !domainValidation) || (mobile && mobile.toString().length > 8)) {
      setOTPInfo({ loading: false, data: null, err: null });
      setOTPFormInfo({ loading: false, data: null, err: null });
      setOTPValidation(false);
      const data = {
        uuid: detailData.uuid,
        token: (sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.token) || (detailData.uuid),
        email: email && email.includes('@') ? email : 'None',
        mobile: mobile && mobile.toString().length > 8 ? mobile : 'None',
        type: 'resend',
      };

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/sendOTP`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          setOTPInfo({ loading: false, data: response.data.data, err: null });
          setOTPFormInfo({ loading: false, data: response.data.data, err: null });
        })
        .catch((error) => {
          setOTPInfo({ loading: false, data: null, err: error });
          setOTPFormInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const hideError = (resendOtpInfo && resendOtpInfo.data && (resendOtpInfo.data.length > 0 || !resendOtpInfo.data.length)) || (otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats);

  const isVerifyInfo = detailData && detailData.requires_verification_by_otp;
  const disableTicketInfo = isVerifyInfo && is_otp_verified;
  const disableFields = sendOtpInfo && sendOtpInfo.data;

  return (
    <Col
      md={(!isVerifyInfo || disableTicketInfo) ? 6 : 12}
      sm={12}
      lg={(!isVerifyInfo || disableTicketInfo) ? 6 : 12}
      xs={12}
    >
      <ThemeProvider theme={theme}>
        {detailData.has_reviwer_name && detailData.has_reviwer_name !== 'None' && (
        <Col md={12} sm={12} lg={12} xs={12}>
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                fontWeight: 500,
                margin: '10px 0px 10px 0px',
              })}
            >
              REQUESTOR INFO
            </Typography>
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={personName.name}
              label={personName.label}
              isRequired={detailData.has_reviwer_name && detailData.has_reviwer_name === 'Required'}
              type="text"
              setFieldValue={setFieldValue}
              disabled={disableTicketInfo || disableFields || !!(ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken))}
              customClassName="bg-lightblue"
              labelClassName="m-0"
              formGroupClassName="m-1"
              maxLength="50"
              customError={ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWTNameValidate(ssoToken.tokens.accessToken)}
              onKeyPress={noSpecialChars}
            />
          </Box>
        </Col>

        )}
        {detailData.has_reviwer_email && detailData.has_reviwer_email !== 'None' && (
        <Col md={12} sm={12} lg={12} xs={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              // eslint-disable-next-line indent
          }}
            name={emailValue.name}
            label={emailValue.label}
            disabled={disableTicketInfo || disableFields || !!(ssoToken && ssoToken.client && ssoToken.client.account && ssoToken.client.account.userName)}
            isRequired={detailData.has_reviwer_email && detailData.has_reviwer_email === 'Required'}
            type="email"
            setFieldValue={setFieldValue}
            customError={domainValidation ? 'Email ID does not have a valid domain' : false}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
          />
        </Col>
        )}
        {detailData.has_reviwer_mobile && detailData.has_reviwer_mobile !== 'None' && (
        <Col md={12} sm={12} lg={12} xs={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={mobileValue.name}
            label={mobileValue.label}
            setFieldValue={setFieldValue}
            disabled={disableTicketInfo || disableFields}
            isRequired={detailData.has_reviwer_mobile && detailData.has_reviwer_mobile === 'Required'}
            type={isMobileView ? 'number' : 'text'}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="13"
            onKeyPress={integerKeyPress}
          />
        </Col>
        )}
        {disclaimerTrue && detailData.requires_verification_by_otp && !is_otp_verified && ((email && email.includes('@') && !domainValidation) || (mobile && mobile.toString().length > 8)) && (
        <>
          {otpValidation && (
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <img src={warningDanger} alt="add" className="mr-2" width="10" height="10" />
            <span className="font-weight-800 font-tiny text-danger">Please enter a valid OTP code</span>
          </Col>
          )}
          <Row className="m-0">
            <Col md="8" sm="7" lg="8" xs="7">
              <MuiTextField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={otp.name}
                label={!otpValidation ? otp.label : ''}
                isRequired={!otpValidation ? otp.required : false}
                type={isMobileView ? 'number' : 'text'}
                hideError={hideError}
                customClassName="bg-lightblue"
                labelClassName="m-0"
                setFieldValue={setFieldValue}
                formGroupClassName={!otpValidation ? 'm-1' : 'line-height-empty m-1'}
                maxLength="5"
                onKeyPress={integerKeyPress}
              />
              {!otpValidation && resendOtpInfo && resendOtpInfo.data && !resendOtpInfo.data.ids && (
              <p className="ml-1 mt-1 text-danger mb-0">
                Already sent
              </p>
              )}
              {counter > 0 && (sendOtpInfo && sendOtpInfo.data) && (
              <p className="ml-1 text-info mb-0">
                Resend OTP in
                {' '}
                {counter}
                {' '}
                seconds
              </p>
              )}
              {!otpValidation && resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.ids && (
              <p className="ml-1 mt-1 text-success mb-0">
                OTP sent successfully
              </p>
              )}
              {!otpValidation && otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats && (
              <p className="ml-1 mt-1 text-success mb-0">
                OTP verified successfully
              </p>
              )}
            </Col>
            <Col md="4" sm="5" lg="4" xs="5" className={otpValidation ? 'mt-2 p-0' : 'mt-4 p-0'}>
              {(sendOtpInfo && sendOtpInfo.data) && (
              <Button
                type="button"
                size="md"
                color="primary"
                disabled={!(otp_code && otp_code.toString().length > 2) || (otpVerifyInfo && otpVerifyInfo.loading)}
                onClick={() => checkOTPVerify()}
              >
                <span>Verify</span>
              </Button>
              )}
              {(sendOtpInfo && !sendOtpInfo.data) && (
              <Button
                type="button"
                size="md"
                color="primary"
                disabled={(sendOtpInfo && sendOtpInfo.loading)}
                onClick={() => sendOTP()}
              >
                <span>Get OTP</span>
              </Button>
              )}
            </Col>
          </Row>
          <Col md="9" sm="12" lg="9" xs="12">
            {counter === 0 && (sendOtpInfo && sendOtpInfo.data) && resendOtpInfo && (!resendOtpInfo.data) && (
            <p className="ml-1 mt-1 mb-0">
              <span className="mr-1">Didn&apos;t receive OTP code?</span>
              <span
                aria-hidden="true"
                className="text-info font-weight-800 cursor-pointer"
                onClick={() => resendOTP()}
              >
                Click here to resend OTP code
              </span>
            </p>
            )}
          </Col>
        </>
        )}
        <Row className="ml-1">
          <Label for="disclaimer" className="mt-2">
            <p className="content">
              I agree to share my email Id and mobile number for the purpose of raising request to Facilities Helpdesk.
              <br />
              I understand, these details would be used for providing updates on my service request and for connecting with me on my service request.
              <br />
              In case you do not wish to share your details here, please contact the helpdesk for any facility related assistance.
            </p>
          </Label>
          <FormControlLabel
            sx={{ margin: '0px', padding: '0px' }}
            control={(
              <Checkbox
                id="disclaimer"
                value={disclaimerTrue}
                name="disclaimer"
                checked={disclaimerTrue}
                onChange={() => setDisclaimerTrue(!disclaimerTrue)}
              />
)}
          />
          <Label for="disclaimer" className="mt-2 pt-1">I hereby agree to provide above details</Label>
        </Row>
      </ThemeProvider>
    </Col>
  );
};

requestorInfo.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setOTPFormInfo: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setSendOTPFormInfo: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default requestorInfo;
