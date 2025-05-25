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
  Label,
  Card,
  CardBody,
  Badge,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import {
  FormHelperText, TextField,
} from '@material-ui/core';
import ReactFileReader from 'react-file-reader';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { Markup } from 'interweave';

import imageUpload from '@images/userProfile.jpeg';
import warningDanger from '@images/icons/warningDanger.svg';
import trashRed from '@images/icons/trashRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import scannerIcon from '@images/icons/scanner.svg';

import {
  InputField, FormikAutocomplete, CheckboxField,
} from '../shared/formFields';
import {
  integerKeyPress,
  truncateStars, truncateFrontSlashs,
  getDefaultNoValue, noSpecialChars,
} from '../util/appUtils';
import { bytesToSize } from '../util/staticFunctions';

const appConfig = require('../config/appConfig').default;

const VerificationForm = React.memo((props) => {
  const {
    onNext,
    uuid,
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
    formField: {
      otp,
      idProof,
      companyName,
      Purpose,
      Disclaimer,
      idDetails,
      PurposeText,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    is_otp_verified,
    otp_code,
    id_proof,
    attachment,
    disclaimer,
    purpose,
  } = formValues;
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const [proofOpen, setProofOpen] = useState(false);
  const [purposeOpen, setPurposeOpen] = useState(false);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);

  const [imgValidation1, setimgValidation1] = useState(false);
  const [imgSize1, setimgSize1] = useState(false);
  const [fileDataImage1, setFileDataImage1] = useState(attachment);
  const [fileDataType1, setFileDataType1] = useState(false);

  const [otpValidation, setOTPValidation] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });

  const [counter, setCounter] = React.useState(59);

  React.useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_identity_proof', detailData.has_identity_proof);
      setFieldValue('has_photo', detailData.has_photo);
      setFieldValue('has_purpose', detailData.has_purpose);
      setFieldValue('has_visitor_company', detailData.has_visitor_company);
      setFieldValue('has_visitor_id_details', detailData.has_visitor_id_details);
      setFieldValue('has_otp_verification', detailData.is_send_otp_sms || detailData.is_send_otp_email ? 'Required' : 'None');
      setFieldValue('is_enable_conditions', detailData.is_enable_conditions ? 'Required' : 'None');
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData.has_purpose && detailData.has_purpose === 'Required' && purpose && purpose.name && purpose.name === 'Other') {
      setFieldValue('has_purpose_text', 'Required');
    }
  }, [detailData, purpose]);

  useEffect(() => {
    if (disclaimer) {
      setFieldValue('disclaimer', 'yes');
    } else {
      setFieldValue('disclaimer', '');
    }
  }, [disclaimer]);

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
        setFileDataType(remfile);
        setPhotoType(remfile);
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
    if (otpInfo && otpInfo.data && otpInfo.data.uuid) {
      result = otpInfo.data.uuid;
    } else if (resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.uuid) {
      result = resendOtpInfo.data.uuid;
    }
    return result;
  }

  const checkOTPVerify = () => {
    if (otp_code && otp_code.length > 2) {
      setOTPVerifyInfo({ loading: true, data: null, err: null });
      const data = {
        c_uuid: detailData.uuid,
        // email: visitorEmail,
        // mobile: visitorMobile,
        otp: otp_code,
        l_uuid: getLogId(),
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

  const resendOTP = () => {
    if (detailData && detailData.uuid && (detailData.is_send_otp_email || detailData.is_send_otp_sms) && (visitorMobile || visitorEmail)) {
      setOTPInfo({ loading: true, data: null, err: null });
      setResendOTPInfo({ loading: true, data: null, err: null });
      const data = {
        req_uuid: uuid,
        name: visitorName,
        email: visitorEmail,
        mobile: visitorMobile,
        type: otpInfo && otpInfo.data && otpInfo.data.uuid ? 'resend' : 'send',
        log_id: otpInfo && otpInfo.data && otpInfo.data.uuid ? otpInfo.data.uuid : 'none',
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

  return (
    <>
      <Row>
        <Col md="3" sm="12" lg="3" xs="12" className="text-center">
          <div>
            <div className="image-upload">
              <label htmlFor="file-input">
                <img src={fileDataImage ? `${fileDataType}${fileDataImage}` : imageUpload} alt="imageUpload" width="80" height="80" className="cursor-pointer mt-3 mb-3 border-radius-50 user-circle" />
              </label>
              {detailData.allow_gallery_images && (
              <input id="file-input" type="file" accept=".png, .jpg, .jpeg" onChange={handleFileInputChange} />
              )}
              {!detailData.allow_gallery_images && (
              <input id="file-input" type="file" accept="image/*" capture="camera" onChange={handleFileInputChange} />
              )}
            </div>
            {!fileDataImage && (<span className="text-info cursor-pointer font-weight-700">Upload Image</span>)}
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
            { /* <img
              aria-hidden="true"
              src={editIcon}
              onClick={onNext}
              alt="edit"
              width="20"
              height="20"
              className="float-right cursor-pointer"
              /> */}
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
      <hr />

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
              <InputField
                name={otp.name}
                label={!otpValidation ? otp.label : ''}
                isRequired={!otpValidation ? otp.required : false}
                type="text"
                customClassName="bg-lightblue"
                labelClassName="m-0"
                formGroupClassName={!otpValidation ? 'm-1' : 'line-height-empty m-0'}
                maxLength="5"
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
                className="mt-4"
                variant="contained"
                disabled={otpVerifyInfo && otpVerifyInfo.loading}
                onClick={() => checkOTPVerify()}
              >
                <span>Verify</span>
              </Button>
            </Col>
          </>
        )}
        {detailData.has_visitor_company && detailData.has_visitor_company !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={companyName.name}
            label={companyName.label}
            isRequired={detailData.has_visitor_company && detailData.has_visitor_company === 'Required'}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="100"
            onKeyPress={noSpecialChars}
          />
        </Col>
        )}
        {detailData.has_identity_proof && detailData.has_identity_proof !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <FormGroup className="m-1">
            <Label className="m-0" for="id_proof">
              ID Proof
              {' '}
              <span className="ml-1 text-danger">{detailData.has_identity_proof && detailData.has_identity_proof === 'Required' ? '*' : ''}</span>
            </Label>
            <FormikAutocomplete
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
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={detailData && detailData.id_proof ? detailData.id_proof : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={id_proof && id_proof.id ? 'bg-lightblue without-padding' : 'bg-lightblue mb-2 without-padding'}
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
                <Card className="no-border-radius mb-2">
                  <ReactFileReader
                    elementId="fileUpload1"
                    handleFiles={handleFiles1}
                    fileTypes=".png,.jpg,.jpeg"
                    base64
                  >
                    <CardBody className="p-2 bg-denim cursor-pointer">
                      <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">
                        Upload ID Proof
                        {' '}
                        <span className="ml-1 text-danger">{detailData.has_identity_proof && detailData.has_identity_proof === 'Required' ? '*' : ''}</span>
                        <img src={scannerIcon} alt="scan" className="mr-2 float-right" width="17" height="17" />
                      </p>
                    </CardBody>
                  </ReactFileReader>
                </Card>
                )}
                {fileDataImage1 && (
                <Card className="no-border-radius mb-2">
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
                </Card>
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
            <InputField
              name={idDetails.name}
              label={idDetails.label}
              isRequired={detailData.has_visitor_id_details && detailData.has_visitor_id_details === 'Required'}
              formGroupClassName="m-1"
              type="text"
              maxLength="4"
              minLength="4"
              placeholder={idDetails.placeholder}
              autoComplete="off"
            />
          </Col>
        )}
        {detailData.has_purpose && detailData.has_purpose !== 'None' && (
          <>
            <Col md="12" sm="12" lg="12" xs="12">
              <FormGroup className="m-1">
                <Label className="m-0" for={Purpose.name}>
                  {Purpose.label}
                  {' '}
                  <span className="ml-1 text-danger">{detailData.has_purpose && detailData.has_purpose === 'Required' ? '*' : ''}</span>
                </Label>
                <FormikAutocomplete
                  name={Purpose.name}
                  label=""
                  labelClassName="m-0"
                  formGroupClassName="mt-0 mb-1 line-height-small"
                  open={purposeOpen}
                  size="small"
                  onOpen={() => {
                    setPurposeOpen(true);
                  }}
                  onClose={() => {
                    setPurposeOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={detailData && detailData.purpose_ids && detailData.purpose_ids.length > 0 ? detailData.purpose_ids : []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className={purpose && purpose.id ? 'bg-lightblue without-padding' : 'bg-lightblue mb-2 without-padding'}
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
              </FormGroup>
            </Col>
            {purpose && purpose.name && purpose.name === 'Other' && (
            <Col xs={12} md={12} lg={12} sm={12}>
              <InputField
                name={PurposeText.name}
                label={PurposeText.label}
                isRequired={detailData.has_purpose && detailData.has_purpose === 'Required'}
                formGroupClassName="m-1"
                type="text"
                maxLength="100"
                autoComplete="off"
              />
            </Col>
            )}
          </>
        )}
        {detailData.is_enable_conditions && (
          <>
            <Col md="12" sm="12" lg="12" xs="12" className="mb-2 ml-1 mt-2">
              <h6>
                Terms and Conditions
                <span className="ml-1 text-danger">*</span>
              </h6>
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
      </Row>
    </>
  );
});

VerificationForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  setPhotoType: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
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
