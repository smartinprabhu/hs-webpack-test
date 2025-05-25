/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { Markup } from 'interweave';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import warningDanger from '@images/icons/warningDanger.svg';

import MuiTextField from '../commonComponents/formFields/muiTextField';
import {
  noSpecialChars,
  integerKeyPress,
  getColumnArrayById,
  detectMob,
  truncateFrontSlashs,
  truncateStars,
} from '../util/appUtils';

const appConfig = require('../config/appConfig').default;

const BasicForm = (props) => {
  const {
    setFieldValue,
    detailData,
    visitorDetails,
    accid,
    formField: {
      Company,
      contactPerson,
      otp,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    is_otp_verified,
    host_email,
    otp_code,
    host_name,
    disclaimer,
  } = formValues;

  const isMobileView = detectMob();
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const [otpValidation, setOTPValidation] = useState(false);
  const [domainValidation, setDomainValidation] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });
  const [sendOtpInfo, setSendOTPInfo] = useState({ loading: false, data: null, err: null });

  const [disclaimerTrue, setDisclaimerTrue] = useState(false);
  const [counter, setCounter] = React.useState(59);

  useEffect(() => {
    if (!host_email) {
      setOTPInfo({ loading: false, data: null, err: null });
      setSendOTPInfo({ loading: false, data: null, err: null });
      setOTPVerifyInfo({ loading: false, data: null, err: null });
      setOTPValidation(false);
      setDomainValidation(false);
      setFieldValue('is_otp_verified', '');
      setFieldValue('otp_code', '');
      setCounter(59);
    }
  }, [host_email]);

  React.useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    setFieldValue('host_name', visitorDetails && visitorDetails.host_name ? visitorDetails.host_name : '');
    setFieldValue('host_email', visitorDetails && visitorDetails.host_email ? visitorDetails.host_email : '');
  }, [visitorDetails]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_host_email', detailData && detailData.is_enable_host_email_verification ? 'Required' : 'Optional');
      setFieldValue('has_host_name', detailData.has_host_name);
    }
  }, [detailData, host_email]);

  useEffect(() => {
    setFieldValue('disclaimer', disclaimerTrue ? 'yes' : '');
  }, [disclaimerTrue]);

  useEffect(() => {
    setDisclaimerTrue(!!disclaimer);
  }, [disclaimer]);

  useEffect(() => {
    if (detailData && host_email && host_email.length > 2 && host_email.includes('@')) {
      const whitelist = detailData.allowed_domains_host_ids ? getColumnArrayById(detailData.allowed_domains_host_ids, 'name') : [];

      const userHasAccess = whitelist.some(
        (domain) => {
          const emailSplit = host_email.split('@');
          return emailSplit[emailSplit.length - 1].toLowerCase() === domain;
        },
      );

      if (userHasAccess) {
        setDomainValidation(false);
      } else {
        setDomainValidation(true);
      }
    }
  }, [detailData, host_email]);

  const checkOTPVerify = () => {
    if (otp_code && otp_code.toString().length > 2) {
      setOTPVerifyInfo({ loading: true, data: null, err: null });
      setOTPValidation(false);
      const sendToken = sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.uuid ? sendOtpInfo.data.uuid : false;
      const reSendToken = resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.uuid ? resendOtpInfo.data.uuid : false;
      const data = {
        c_uuid: detailData.uuid,
        otp: otp_code,
        l_uuid: sendToken || reSendToken,
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/checkHostOTP`,
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
    if (host_email && host_email.includes('@')) {
      setSendOTPInfo({ loading: false, data: true, err: null });
      const data = {
        uuid: detailData.uuid,
        name: host_name,
        email: host_email && host_email.includes('@') ? host_email : 'None',
        type: 'send',
      };

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/sendHostOTP`,
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
        })
        .catch((error) => {
          setSendOTPInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const resendOTP = () => {
    if (host_email && host_email.includes('@')) {
      setOTPInfo({ loading: false, data: null, err: null });
      setOTPValidation(false);
      const data = {
        uuid: detailData.uuid,
        name: host_name,
        token: (sendOtpInfo && sendOtpInfo.data && sendOtpInfo.data.uuid) || (detailData.uuid),
        email: host_email && host_email.includes('@') ? host_email : 'None',
        type: 'resend',
      };

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/sendHostOTP`,
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
        })
        .catch((error) => {
          setOTPInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const hideError = (resendOtpInfo && resendOtpInfo.data && (resendOtpInfo.data.length > 0 || !resendOtpInfo.data.length)) || (otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats);

  return (
    <>
      <p className="text-center mt-2 mb-2 text-info">
        <FontAwesomeIcon
          color="info"
          className="mr-2"
          size="sm"
          icon={faInfoCircle}
        />
        Enter Host Information
      </p>
      <Row>
        {detailData.has_host_name && detailData.has_host_name !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            name={Company.name}
            label={Company.label}
            isRequired={detailData.has_host_name && detailData.has_host_name === 'Required'}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 100,
            }}
            onKeyPress={noSpecialChars}
          />
        </Col>
        )}
        {detailData.has_host_email && detailData.has_host_email !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            name={contactPerson.name}
            label={contactPerson.label}
            isRequired={detailData.is_enable_host_email_verification}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            customError={domainValidation ? 'Email ID does not have a valid domain' : false}
            inputProps={{
              maxLength: 50,
            }}
          />
        </Col>
        )}
        <Row className="ml-2 pl-1">
          {!detailData.host_disclaimer && (
          <Label for="disclaimer" className="mt-2">
            <p className="content">
              I agree to share my email Id for the purpose of raising visitor invitation to VMS.
              <br />
              I understand, these details would be used for providing updates on my visitor invitation.
              <br />
              In case you do not wish to share your details here, please contact the facility related assistance.
            </p>
          </Label>
          )}
          {detailData.host_disclaimer && (
          <div className="small-form-content thin-scrollbar p-2">
            <Markup content={truncateFrontSlashs(truncateStars(detailData.host_disclaimer))} />
          </div>
          )}
          <FormGroup className="pl-3">
            <FormControlLabel
              control={(
                <Checkbox
                  size="small"
                  color="default"
                  name="disclaimer"
                  id="disclaimer"
                  onChange={() => setDisclaimerTrue(!disclaimerTrue)}
                  value={disclaimerTrue}
                  checked={disclaimerTrue}
                />
)}
              label="I hereby agree to provide above details"
            />
          </FormGroup>
        </Row>
        {!domainValidation && disclaimerTrue && detailData.is_enable_host_email_verification && !is_otp_verified && (host_email && host_email.includes('@')) && (
        <>
          {otpValidation && (
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <img src={warningDanger} alt="add" className="mr-2" width="10" height="10" />
            <span className="font-weight-800 font-tiny text-danger">Please enter a valid OTP code</span>
          </Col>
          )}
          <Col md="9" sm="7" lg="9" xs="7">
            {(sendOtpInfo && sendOtpInfo.data) && (
            <MuiTextField
              name={otp.name}
              label={!otpValidation ? otp.label : ''}
              isRequired={!otpValidation ? otp.required : false}
              type={isMobileView ? 'number' : 'text'}
              hideError={hideError}
              customClassName="bg-lightblue"
              labelClassName="m-0"
              formGroupClassName={!otpValidation ? 'm-1' : 'line-height-empty m-1'}
              inputProps={{
                maxLength: 5,
              }}
              onKeyPress={integerKeyPress}
            />
            )}
            {!otpValidation && resendOtpInfo && resendOtpInfo.data && !resendOtpInfo.data.uuid && (
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
            {!otpValidation && resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.uuid && (
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
          <Col md="3" sm="5" lg="3" xs="5" className={otpValidation ? 'mt-2 p-0' : 'mt-4 p-0'}>
            {(sendOtpInfo && sendOtpInfo.data) && (
            <Button
              type="button"
              size="md"
              variant="contained"
              className="submit-btn"
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
              variant="contained"
              className="submit-btn"
              disabled={(sendOtpInfo && sendOtpInfo.loading) || !(host_email && host_email.includes('@'))}
              onClick={() => sendOTP()}
            >
              <span>Get OTP</span>
            </Button>
            )}
          </Col>
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
  visitorDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicForm;
