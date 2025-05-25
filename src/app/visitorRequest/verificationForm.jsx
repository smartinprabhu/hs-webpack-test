/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  FormGroup,
  CardBody,
  Badge,
  Row,
} from 'reactstrap';
import { Button, Box, Typography } from '@mui/material';
import {
  FormHelperText, TextField,
} from '@material-ui/core';
import ReactFileReader from 'react-file-reader';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { Markup } from 'interweave';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';

import imageUpload from '@images/userProfile.jpeg';
import warningDanger from '@images/icons/warningDanger.svg';
import trashRed from '@images/icons/trashRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import editIcon from '@images/icons/edit.svg';
import scannerIcon from '@images/icons/scanner.svg';

import { makeStyles } from '@material-ui/core/styles';
import Webcam from './webCam';
import DialogHeader from '../commonComponents/dialogHeader';
import {
  CheckboxField, DateTimeFieldDefault,
} from '../shared/formFields';
import MuiAutoComplete from '../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../commonComponents/formFields/muiTextField';
import BooleanField from '../shared/formFields/booleanField';
import {
  noSpecialChars, integerKeyPress, getDateTimeSeconds,
  getColumnArrayById, truncateStars, truncateFrontSlashs,
  getDefaultNoValue, generateFieldName, isJsonString, getJsonString,
  detectMob,
} from '../util/appUtils';
import { bytesToSize } from '../util/staticFunctions';
import { AddThemeColor } from '../themes/theme';

const appConfig = require('../config/appConfig').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
  root: {
    // input label when focused
    '& label.Mui-focused': {
      color: AddThemeColor({}).color,
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: AddThemeColor({}).color,
      },
    },
  },
});

const VerificationForm = React.memo((props) => {
  const {
    onNext,
    accid,
    setFieldValue,
    setFieldTouched,
    detailData,
    otpInfo,
    visitorEmail,
    visitorMobile,
    visitorName,
    setPhotoType,
    setDocType,
    setResendOTPInfo,
    hcid,
    formField: {
      otp,
      plannedIn,
      companyName,
      hostCompany,
      Company,
      contactPerson,
      idProof,
      Purpose,
      Disclaimer,
      idDetails,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    is_otp_verified,
    otp_code,
    id_proof,
    attachment,
    planned_in,
    host_email,
    disclaimer,
  } = formValues;
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [companyOpen, setCompanyOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);

  const [imgValidation1, setimgValidation1] = useState(false);
  const [imgSize1, setimgSize1] = useState(false);
  const [fileDataImage1, setFileDataImage1] = useState(attachment);
  const [fileDataType1, setFileDataType1] = useState(false);

  const [otpValidation, setOTPValidation] = useState(false);
  const [domainValidation, setDomainValidation] = useState(false);

  const [currentId, setCurrentId] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });

  const [counter, setCounter] = React.useState(59);

  const [camModal, showCamModal] = useState(false);

  const isMobileView = detectMob();

  React.useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_host_company', detailData.has_host_company);
      setFieldValue('has_host_name', detailData.has_host_name);
      setFieldValue('has_host_email', detailData.has_host_email);
      setFieldValue('has_identity_proof', detailData.has_identity_proof);
      setFieldValue('has_photo', detailData.has_photo);
      setFieldValue('has_purpose', detailData.has_purpose);
      setFieldValue('has_visitor_id_details', detailData.has_visitor_id_details);
      setFieldValue('has_visitor_company', detailData.has_visitor_company);
      setFieldValue('has_otp_verification', detailData.is_send_otp_sms || detailData.is_send_otp_email ? 'Required' : 'None');
      setFieldValue('is_enable_conditions', detailData.is_enable_conditions ? 'Required' : 'None');
    }
  }, [detailData]);

  useEffect(() => {
    if (disclaimer) {
      setFieldValue('disclaimer', 'yes');
    } else {
      setFieldValue('disclaimer', '');
    }
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

  useEffect(() => {
    setFieldValue('planned_in', new Date());
  }, []);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType(remfile);
        setPhotoType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
      }
    }
  };

  const getBase64 = (file) => new Promise((resolve) => {
    let fileInfo;
    let baseURL = '';
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      console.log('Called', reader);
      baseURL = reader.result;
      resolve(baseURL);
    };
  });

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files.length ? e.target.files[0] : false;
    setimgValidation(false);
    setimgSize(false);
    if (file) {
      const { type } = file;

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(file.size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${file.type};base64,`;
        setPhotoType(remfile);
        setFileDataType(remfile);
        getBase64(file)
          .then((result) => {
            const fileData = result.replace(remfile, '');
            setFileDataImage(fileData);
            setFieldValue('image_medium', fileData);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleFileCamChange = (data) => {
    if (data) {
      const remfile = data.split(',')[0];
      const base64Data = data.split(',')[1];
      setPhotoType(`${remfile},`);
      setFileDataType(`${remfile},`);
      setFileDataImage(base64Data);
      setFieldValue('image_medium', base64Data);
      showCamModal(false);
    }
  };

  const handleFiles1 = (files) => {
    setimgValidation1(false);
    setimgSize1(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation1(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize1(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType1(remfile);
        setDocType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage1(fileData);
        setFieldValue('attachment', fileData);
      }
    }
  };

  const clearDocument = () => {
    setimgValidation1(false);
    setimgSize1(false);
    setFileDataType1(false);
    setFileDataImage1(false);
    setFieldValue('attachment', '');
    setDocType(false);
  };

  useEffect(() => {
    if (id_proof && id_proof.id) {
      clearDocument();
    }
  }, [id_proof]);

  function getLogId() {
    let result = 'None';
    if (otpInfo && otpInfo.data && otpInfo.data.length) {
      result = otpInfo.data[0];
    } else if (resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.length) {
      result = resendOtpInfo.data[0];
    }
    return result;
  }

  const checkOTPVerify = () => {
    if (otp_code && otp_code.length > 2) {
      setOTPVerifyInfo({ loading: true, data: null, err: null });
      const data = {
        uuid: detailData.uuid,
        email: visitorEmail,
        mobile: visitorMobile,
        otp: otp_code,
        log_id: getLogId(),
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/VerifyOTP`,
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

  const resendOTP = () => {
    if (detailData && detailData.uuid && (detailData.is_send_otp_email || detailData.is_send_otp_sms) && (visitorMobile || visitorEmail)) {
      setOTPInfo({ loading: true, data: null, err: null });
      setResendOTPInfo({ loading: true, data: null, err: null });
      const data = {
        uuid: detailData.uuid,
        name: visitorName,
        email: visitorEmail,
        mobile: visitorMobile,
        type: otpInfo && otpInfo.data && otpInfo.data.length ? 'resend' : 'send',
        log_id: otpInfo && otpInfo.data && otpInfo.data.length ? otpInfo.data[0] : 'none',
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
        .then((response) => {
          setOTPInfo({ loading: false, data: response.data.data, err: null });
          setResendOTPInfo({ loading: false, data: response.data.data, err: null });
        })
        .catch((error) => {
          setOTPInfo({ loading: false, data: null, err: error });
          setResendOTPInfo({ loading: false, data: null, err: error });
        });
    }
  };

  useEffect(() => {
    if (detailData && detailData.tenant_ids && detailData.tenant_ids.length && detailData.tenant_ids.length === 1) {
      setFieldValue('tenant_id', detailData.tenant_ids[0]);
    }
  }, [detailData]);

  useEffect(() => {
    if (hcid) {
      const hostCompany = detailData && detailData.tenant_ids && detailData.tenant_ids.length && detailData.tenant_ids.find((site) => site.id.toString() === hcid.toString());
      console.log(hostCompany, 'hostCompany');
      if (hostCompany) { setFieldValue('tenant_id', hostCompany); }
    }
  }, [hcid]);

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.sequence - b.sequence,
    );
    return dataSectionsNew;
  };

  const showHr = ((detailData.has_visitor_company && detailData.has_visitor_company !== 'None') || (detailData.has_host_name && detailData.has_host_name !== 'None')
  || (detailData.has_host_company && detailData.has_host_company !== 'None' && detailData && detailData.tenant_ids && detailData.tenant_ids.length > 1)
  || (detailData.has_host_email && detailData.has_host_email !== 'None') || (detailData.show_planned_in)
  || (detailData.has_identity_proof && detailData.has_identity_proof !== 'None') || (detailData.has_visitor_id_details && detailData.has_visitor_id_details !== 'None')
  || (detailData.has_purpose && detailData.has_purpose !== 'None') || (detailData.is_enable_conditions) || (detailData && detailData.additional_fields_ids && detailData.additional_fields_ids.length > 0));

  return (
    <>
      <Row>
        <Col md="3" sm="12" lg="3" xs="12" className="text-center">
          <div>
            <div className="image-upload">
              <label htmlFor="file-input">
                <img src={fileDataImage ? `${fileDataType}${fileDataImage}` : imageUpload} alt="imageUpload" width="80" height="80" className="cursor-pointer mt-3 mb-3 border-radius-50 user-circle" />
                {detailData.allow_gallery_images && (<p style={{ color: AddThemeColor({}).color }} className="cursor-pointer font-weight-700 mb-1">Upload Image</p>)}
              </label>
              {detailData.allow_gallery_images && (
              <input id="file-input" type="file" accept=".png, .jpg, .jpeg" onChange={handleFileInputChange} />
              )}
              {!detailData.allow_gallery_images && isMobileView && (
              <input id="file-input" type="file" accept="image/*" capture="camera" onChange={handleFileInputChange} />
              )}
            </div>

            {!isMobileView && (
              <p className="cursor-pointer font-weight-700" style={{ color: AddThemeColor({}).color }} onClick={() => showCamModal(true)}>
                Capture Image
              </p>
            )}
            {!fileDataImage && detailData.has_photo && detailData.has_photo === 'Required' && (
            <>
              {' '}
              <br />
              <span className="text-danger font-weight-700">(Required)</span>
            </>
            )}
            {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only</span></FormHelperText>)}
            {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB</span></FormHelperText>)}
          </div>
        </Col>
        <Col md="9" sm="12" lg="9" xs="12">
          <div>
            <img
              aria-hidden="true"
              src={editIcon}
              onClick={onNext}
              alt="edit"
              width="20"
              height="20"
              className="float-right cursor-pointer"
            />
            <p className="mb-2">
              <span className="font-weight-400">Name :</span>
              <span className="font-weight-800 ml-1 mb-2">{visitorName}</span>
            </p>
            {detailData.has_visitor_mobile && detailData.has_visitor_mobile !== 'None' && (
              <p className="mb-2">
                <span className="font-weight-400">Mobile :</span>
                <span className="font-weight-800 ml-1 mb-2">{getDefaultNoValue(visitorMobile)}</span>
              </p>
            )}
            {detailData.has_visitor_email && detailData.has_visitor_email !== 'None' && (
              <p className="mb-2">
                <span className="font-weight-400">E-mail :</span>
                <span className="font-weight-800 ml-1 mb-2">{getDefaultNoValue(visitorEmail)}</span>
              </p>
            )}
            {!is_otp_verified && (visitorMobile || visitorEmail) && (detailData.is_send_otp_email || detailData.is_send_otp_sms) && (
              <Badge className="badge-text border-radius-15px text-outrageous-orange pr-2 pl-2 bg-white border-outrageous-orange">Not Verified</Badge>
            )}
            {is_otp_verified && (
              <Badge className="badge-text badge-success border-radius-15px text-success pr-2 pl-2 bg-white border border-success">
                <img src={checkGreen} alt="verified" className="mr-2" width="15" height="15" />
                Verified
              </Badge>
            )}
          </div>
        </Col>
      </Row>
      {showHr && (
      <hr />
      )}

      <Row>
        {!is_otp_verified && (visitorMobile || visitorEmail) && (detailData.is_send_otp_email || detailData.is_send_otp_sms) && (
          <>
            <Col md="10" sm="9" lg="10" xs="9">
              {otpValidation && (
                <>
                  <img src={warningDanger} alt="add" className="mr-2" width="15" height="15" />
                  <span className="font-weight-800 text-danger">Please enter a valid OTP code</span>
                </>
              )}
              <MuiTextField
                sx={{
                  marginBottom: '20px',
                }}
                name={otp.name}
                label={!otpValidation ? otp.label : ''}
                isRequired={!otpValidation ? otp.required : false}
                type="text"
                labelClassName="m-0"
                formGroupClassName={!otpValidation ? 'm-1' : 'line-height-empty m-0'}
                inputProps={{
                  maxLength: 5,
                }}
                onKeyPress={integerKeyPress}
              />
              {counter === 0 && resendOtpInfo && (!resendOtpInfo.data) && (
                <p className="ml-1 mb-0">
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
              {counter > 0 && (
                <p className="ml-1 text-info mb-0">
                  Resend OTP in
                  {' '}
                  {counter}
                  {' '}
                  seconds
                </p>
              )}
              {resendOtpInfo && resendOtpInfo.data && !resendOtpInfo.data.length && (
                <p className="ml-1 text-danger mb-0">
                  Already sent
                </p>
              )}
              {resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.length > 0 && (
                <p className="ml-1 text-success mb-0">
                  OTP sent successfully
                </p>
              )}
              {otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats && (
                <p className="ml-1 text-success mb-0">
                  OTP verified successfully
                </p>
              )}
            </Col>
            <Col md="1" sm="2" lg="1" xs="2">
              <Button
                type="button"
                size="md"
                className="mt-4 submit-btn"
                variant="contained"
                disabled={otpVerifyInfo && otpVerifyInfo.loading}
                onClick={() => checkOTPVerify()}
              >
                <span>Verify</span>
              </Button>
            </Col>
          </>
        )}
        {detailData && detailData.additional_fields_ids && detailData.additional_fields_ids.length > 0 && sortSections(detailData.additional_fields_ids).map((item) => (
          <Col md="12" sm="12" lg="12" xs="12" key={item.label}>
            {(item.type === 'Text' || item.type === 'Number') && (
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={generateFieldName(item.label)}
              label={item.label}
              type="text"
              customClassName="bg-lightblue"
              labelClassName="m-0"
              formGroupClassName="m-1"
              onKeyPress={item.type === 'Number' ? integerKeyPress : ''}
              inputProps={{
                maxLength: item.length,
              }}
            />
            )}
            {(item.type === 'Boolean') && (
            <BooleanField
              name={generateFieldName(item.label)}
              label={item.label}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              labelClassName="m-0"
              formGroupClassName="m-1"
            />
            )}
            {(item.type === 'Dropdown') && (
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={generateFieldName(item.label)}
              label={item.label}
              isRequired={false}
              labelClassName="m-0"
              formGroupClassName="m-1"
              open={currentId === item.id}
              size="small"
              onOpen={() => {
                setCurrentId(item.id);
              }}
              onClose={() => {
                setCurrentId(false);
              }}
              classes={{
                root: classes.root,
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={item.description && isJsonString(item.description) ? getJsonString(item.description) : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={item.label}
                  variant="standard"
                  className="bg-lightblue without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            )}
          </Col>
        ))}
        {detailData.has_visitor_company && detailData.has_visitor_company !== 'None' && (
          <Col md="12" sm="12" lg="12" xs="12">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={companyName.name}
              label={companyName.label}
              isRequired={detailData.has_visitor_company && detailData.has_visitor_company === 'Required'}
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
        {detailData.has_host_name && detailData.has_host_name !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
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
        {detailData.has_host_company && detailData.has_host_company !== 'None' && detailData && detailData.tenant_ids && detailData.tenant_ids.length > 1 && (
          <Col md="12" sm="12" lg="12" xs="12">
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={hostCompany.name}
              label={hostCompany.label}
              isRequired={detailData.has_host_company && detailData.has_host_company === 'Required'}
              labelClassName="m-0"
              formGroupClassName="m-1"
              open={companyOpen}
              size="small"
              onOpen={() => {
                setCompanyOpen(true);
              }}
              onClose={() => {
                setCompanyOpen(false);
              }}
              classes={{
                root: classes.root,
              }}
              disabled={hcid}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={detailData && detailData.tenant_ids ? detailData.tenant_ids : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  className="bg-lightblue without-padding"
                  label={hostCompany.label}
                  required={detailData.has_host_company && detailData.has_host_company === 'Required'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
        )}
        {detailData.has_host_email && detailData.has_host_email !== 'None' && (
          <Col md="12" sm="12" lg="12" xs="12">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={contactPerson.name}
              label={contactPerson.label}
              isRequired={detailData.has_host_email && detailData.has_host_email === 'Required'}
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
        {detailData.show_planned_in && (
        <Col md="12" sm="12" lg="12" xs="12">
          <DateTimeFieldDefault
            name={plannedIn.name}
            label={plannedIn.label}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={plannedIn.label}
            disablePastDate
            disableCustom
            noofdays={detailData.close_visit_request_by ? detailData.close_visit_request_by : 0}
            isRequired={plannedIn.required}
            className="m-1 w-100 bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            defaultValue={planned_in ? moment(new Date(getDateTimeSeconds(planned_in)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
            currentValue={planned_in ? moment(new Date(getDateTimeSeconds(planned_in)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
          />
        </Col>
        )}
        {detailData.has_identity_proof && detailData.has_identity_proof !== 'None' && (
          <Col md="12" sm="12" lg="12" xs="12">
            <FormGroup>
              {/* <Label className="m-0" for="id_proof">
                ID Proof
                {' '}
                <span className="ml-1 text-danger">{detailData.has_identity_proof && detailData.has_identity_proof === 'Required' ? '*' : ''}</span>
              </Label> */}
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={idProof.name}
                label=""
                labelClassName="m-0"
                formGroupClassName="mt-0 mb-1 line-height-small"
                open={proofOpen}
                size="small"
                onOpen={() => {
                  setProofOpen(true);
                }}
                onClose={() => {
                  setProofOpen(false);
                }}
                classes={{
                  root: classes.root,
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={detailData && detailData.id_proof ? detailData.id_proof : []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={idProof.label}
                    className={id_proof && id_proof.id ? 'bg-lightblue without-padding' : 'bg-lightblue mb-2 without-padding'}
                    required={detailData.has_identity_proof && detailData.has_identity_proof === 'Required'}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {id_proof && id_proof.id && (
                <>
                  {!fileDataImage1 && (
                    <Box
                      sx={{
                        padding: '20px',
                        border: '1px dashed #868686',
                        width: '100%',
                        display: 'block',
                        alignItems: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ReactFileReader
                          elementId="fileUpload1"
                          handleFiles={handleFiles1}
                          fileTypes=".png,.jpg,.jpeg"
                          base64
                        >
                          <CardBody className="p-2 bg-denim cursor-pointer">
                            <Button
                              variant="contained"
                              component="label"
                            >
                              Upload ID Proof
                            </Button>
                            <img src={scannerIcon} alt="scan" className="mr-2 float-right" width="17" height="17" />

                          </CardBody>
                        </ReactFileReader>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            font: 'normal normal normal 14px Suisse Intl',
                            letterSpacing: '0.63px',
                            color: '#000000',
                            marginBottom: '10px',
                            marginTop: '10px',
                            marginLeft: '5px',
                            justifyContent: 'center',
                            display: 'flex',
                          }}
                        >
                          (Upload files less than 20 MB)
                        </Typography>
                        <Typography
                          sx={{
                            font: 'normal normal normal 12px Suisse Intl',
                            letterSpacing: '0.63px',
                            color: 'grey',
                            marginBottom: '10px',
                            marginLeft: '5px',
                            justifyContent: 'center',
                            display: 'flex',
                          }}
                        >
                          (Number of attachments maximum upload :
                          {' '}
                          1
                          )
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {fileDataImage1 && (
                    <Box
                      sx={{
                        padding: '20px',
                        border: '1px dashed #868686',
                        width: '100%',
                        display: 'block',
                        alignItems: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <CardBody className="p-2 bg-lightblue">
                        <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">
                          <img src={`${fileDataType1 || 'data:image/png;base64,'}${fileDataImage1}`} alt="files" className="ml-2" width="40" height="40" />
                          <img
                            aria-hidden="true"
                            src={trashRed}
                            alt="scan"
                            className="mr-2 float-right cursor-pointer mt-2"
                            onClick={() => clearDocument()}
                            width="17"
                            height="17"
                          />
                        </p>
                      </CardBody>
                    </Box>
                  )}
                  {imgValidation1 && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
                  {imgSize1 && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                </>
              )}
            </FormGroup>
          </Col>

        )}
        {detailData.has_visitor_id_details && detailData.has_visitor_id_details !== 'None' && (
          <Col xs={12} md={12} lg={12} sm={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={idDetails.name}
              label={idDetails.label}
              isRequired={detailData.has_visitor_id_details && detailData.has_visitor_id_details === 'Required'}
              formGroupClassName="m-1"
              type="text"
              inputProps={{
                maxLength: 4,
                minLength: 4,
              }}
              placeholder={idDetails.placeholder}
              autoComplete="off"
            />
          </Col>
        )}
        {detailData.has_purpose && detailData.has_purpose !== 'None' && (
          <Col md="12" sm="12" lg="12" xs="12">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={Purpose.name}
              label={Purpose.label}
              isRequired={detailData.has_purpose && detailData.has_purpose === 'Required'}
              type="textarea"
              rows="4"
              labelClassName="m-0"
              formGroupClassName="m-1"
              inputProps={{
                maxLength: 250,
              }}
            />
          </Col>
        )}
        {detailData.is_enable_conditions && (
          <>
            <Col md="12" sm="12" lg="12" xs="12" className="mb-2 ml-1 mt-2">
              <h6 style={{ color: AddThemeColor({}).color }}>Terms and Conditions</h6>
              <div className="small-form-content thin-scrollbar">
                <Markup content={truncateFrontSlashs(truncateStars(detailData.terms_and_conditions))} />
              </div>
            </Col>
            <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
              <CheckboxField
                name={Disclaimer.name}
                label={Disclaimer.label}
              />
            </Col>
          </>
        )}
        <Dialog maxWidth="md" open={camModal}>
          <DialogHeader title="Capture Visitor Photo" onClose={() => showCamModal(false)} response={false} imagePath={false} />
          <Webcam onCapture={handleFileCamChange} />
        </Dialog>
      </Row>
    </>
  );
});

VerificationForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  setPhotoType: PropTypes.func.isRequired,
  setResendOTPInfo: PropTypes.func.isRequired,
  setDocType: PropTypes.func.isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visitorEmail: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  visitorMobile: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  visitorName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otpInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default VerificationForm;
