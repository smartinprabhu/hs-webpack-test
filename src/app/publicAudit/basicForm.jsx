/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Button,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import warningDanger from '@images/icons/warningDanger.svg';

import { InputField } from '../shared/formFields';
import {
  lettersOnly,
  integerKeyPress,
  detectMob,
} from '../util/appUtils';
import { storeSurveyToken } from '../helpdesk/ticketService';

const appConfig = require('../config/appConfig').default;

const BasicForm = (props) => {
  const {
    setFieldValue,
    detailData,
    accid,
    formField: {
      nameValue,
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
  const dispatch = useDispatch();

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const [otpValidation, setOTPValidation] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });
  const [sendOtpInfo, setSendOTPInfo] = useState({ loading: false, data: null, err: null });

  const [counter, setCounter] = React.useState(59);

  React.useEffect(() => {
    if (sendOtpInfo && sendOtpInfo.data) {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, sendOtpInfo]);

  /* useEffect(() => {
    setFieldValue('email', localStorage.getItem('commentor_mail') ? localStorage.getItem('commentor_mail') : '');
    setFieldValue('name', localStorage.getItem('commentor_name') ? localStorage.getItem('commentor_name') : '');
    setFieldValue('mobile', localStorage.getItem('commentor_mobile') ? localStorage.getItem('commentor_mobile') : '');
  }, []); */

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_reviwer_email', detailData.has_reviwer_email);
      setFieldValue('has_reviwer_name', detailData.has_reviwer_name);
      setFieldValue('has_reviwer_mobile', detailData.has_reviwer_mobile);
      setFieldValue('requires_verification_by_otp', detailData.requires_verification_by_otp);
    }
  }, [detailData]);

  useEffect(() => {
    if (!mobile) {
      setOTPInfo({ loading: false, data: null, err: null });
      setOTPVerifyInfo({ loading: false, data: null, err: null });
      setSendOTPInfo({ loading: false, data: null, err: null });
      setOTPValidation(false);
      setFieldValue('is_otp_verified', '');
      setFieldValue('otp_code', '');
      setCounter(59);
    }
  }, [mobile]);

  useEffect(() => {
    if (sendOtpInfo && sendOtpInfo.data) {
      dispatch(storeSurveyToken(sendOtpInfo.data.token));
    } else {
      dispatch(storeSurveyToken(false));
    }
  }, [sendOtpInfo]);

  const checkOTPVerify = () => {
    if (otp_code && otp_code.length > 2) {
      setOTPVerifyInfo({ loading: true, data: null, err: null });
      setOTPValidation(false);
      const data = {
        uuid: detailData.uuid,
        otp: otp_code,
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Survey/VerifyOTP`,
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
    if ((email && email.includes('@')) || (mobile && mobile.toString().length > 8)) {
      setSendOTPInfo({ loading: false, data: true, err: null });
      const data = {
        uuid: detailData.uuid,
        token: detailData.token,
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
        url: `${WEBAPPAPIURL}public/api/v4/Survey/sendOTP`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setSendOTPInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setSendOTPInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const resendOTP = () => {
    if ((email && email.includes('@')) || (mobile && mobile.toString().length > 8)) {
      setOTPInfo({ loading: true, data: null, err: null });
      setOTPValidation(false);
      const data = {
        uuid: detailData.uuid,
        token: (detailData.token) || (sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.token),
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
        url: `${WEBAPPAPIURL}public/api/v4/Survey/sendOTP`,
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
  };

  const hideError = (resendOtpInfo && resendOtpInfo.data && (resendOtpInfo.data.length > 0 || !resendOtpInfo.data.length)) || (otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats);
  const isMobileView = detectMob();

  return (
    <>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
          {detailData.has_reviwer_name && detailData.has_reviwer_name !== 'None' && (
          <InputField
            name={nameValue.name}
            label={nameValue.label}
            isRequired={detailData.has_reviwer_name && detailData.has_reviwer_name === 'Required'}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
            onKeyPress={lettersOnly}
          />
          )}
        </Col>
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
          {detailData.has_reviwer_mobile && detailData.has_reviwer_mobile !== 'None' && (
          <InputField
            name={mobileValue.name}
            label={mobileValue.label}
            isRequired={detailData.has_reviwer_mobile && detailData.has_reviwer_mobile === 'Required'}
            type={isMobileView ? 'number' : 'text'}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="13"
            onKeyPress={integerKeyPress}
          />
          )}
        </Col>
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
          {detailData.has_reviwer_email && detailData.has_reviwer_email !== 'None' && (
          <InputField
            name={emailValue.name}
            label={emailValue.label}
            isRequired={detailData.has_reviwer_email && detailData.has_reviwer_email === 'Required'}
            type="email"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
          />
          )}
        </Col>
        {detailData.requires_verification_by_otp && !is_otp_verified && ((email && email.includes('@')) || (mobile && mobile.toString().length > 8)) && (
          <>
            {otpValidation && (
            <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : 'ml-1'}>
              <img src={warningDanger} alt="add" className="mr-2" width="10" height="10" />
              <span className="font-weight-800 font-tiny text-danger">Please enter a valid OTP code</span>
            </Col>
            )}
            <Col md="9" sm="9" lg="9" xs="9" className={isMobileView ? 'pl-4' : ''}>
              <InputField
                name={otp.name}
                label={!otpValidation ? otp.label : ''}
                isRequired={!otpValidation ? otp.required : false}
                type="text"
                hideError={hideError}
                customClassName="bg-lightblue"
                labelClassName="m-0"
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
            <Col md="3" sm="3" lg="3" xs="3" className={otpValidation ? 'mt-2 p-0' : 'mt-4 p-0'}>
              {(sendOtpInfo && sendOtpInfo.data) && (
              <Button
                type="button"
                size="md"
                color="primary"
                disabled={!(otp_code && otp_code.length > 2) || (otpVerifyInfo && otpVerifyInfo.loading)}
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
            <Col md="9" sm="12" lg="9" xs="12" className={isMobileView ? 'pl-4' : ''}>
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
      </Row>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicForm;
