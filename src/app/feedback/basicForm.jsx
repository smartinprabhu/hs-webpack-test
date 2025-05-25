/* eslint-disable react/forbid-prop-types */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  FormGroup,
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import warningDanger from '@images/icons/warningDanger.svg';
import { Checkbox, Button, TextField } from '@mui/material';

import editIcon from '@images/icons/edit.svg';
import { Cascader, Divider } from 'antd';
import uniq from 'lodash/uniq';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  lettersOnly,
  integerKeyPress,
  getColumnArrayById,
  detectMob,
  decodeJWT,
  decodeJWTNameValidate,
  generateErrorMessage,
  preprocessData,
} from '../util/appUtils';
import { getSpaceChildLocationsPublic } from '../helpdesk/utils/utils';
import { storeSurveyToken } from '../helpdesk/ticketService';
import MuiTextField from '../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../commonComponents/formFields/muiAutocomplete';

const appConfig = require('../config/appConfig').default;

const BasicForm = (props) => {
  const {
    setFieldValue,
    detailData,
    lid,
    uuid,
    accid,
    formField: {
      nameValue,
      mobileValue,
      emailValue,
      employeeCode,
      // diclaimerValue,
      otp,
      locationId,
      partnerId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    is_otp_verified,
    otp_code,
    email,
    space_path,
    mobile,
    disclaimer_text,
    location_id,
    // has_disclaimer,

  } = formValues;
  const dispatch = useDispatch();
  const { ssoToken } = useSelector((state) => state.ticket);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [otpValidation, setOTPValidation] = useState(false);

  const [resendOtpInfo, setOTPInfo] = useState({ loading: false, data: null, err: null });
  const [otpVerifyInfo, setOTPVerifyInfo] = useState({ loading: false, data: null, err: null });
  const [sendOtpInfo, setSendOTPInfo] = useState({ loading: false, data: null, err: null });
  const [spaceInfo, setSpaceInfo] = useState({ loading: false, data: null, err: null });

  const [typeOpen, setTypeOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [disclaimerTrue, setDisclaimerTrue] = useState(false);
  const [isCascader, setCascader] = useState(false);
  const [domainValidation, setDomainValidation] = useState(false);

  const [counter, setCounter] = React.useState(59);

  React.useEffect(() => {
    if (sendOtpInfo && sendOtpInfo.data) {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, sendOtpInfo]);

  useEffect(() => {
    if (uuid && detailData && detailData.is_show_all_spaces && detailData.company && detailData.company.id) {
      setSpaceInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/Survey/getSpaces?uuid=${uuid}&company_id=${detailData.company.id}&portalDomain=${window.location.origin}`,
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
    }
  }, [uuid, detailData]);

  /* useEffect(() => {
    setFieldValue('email', localStorage.getItem('commentor_mail') ? localStorage.getItem('commentor_mail') : '');
    setFieldValue('name', localStorage.getItem('commentor_name') ? localStorage.getItem('commentor_name') : '');
    setFieldValue('mobile', localStorage.getItem('commentor_mobile') ? localStorage.getItem('commentor_mobile') : '');
  }, []); */

  useEffect(() => {
    if (ssoToken && ssoToken.client && ssoToken.client.account) {
      setFieldValue('email', ssoToken.client.account.userName ? ssoToken.client.account.userName : '');
      setFieldValue('name', ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken) ? decodeJWT(ssoToken.tokens.accessToken) : '');
    }
  }, [ssoToken]);

  useEffect(() => {
    const lidList = detailData && detailData.location_ids && detailData.location_ids.length ? detailData.location_ids : [];
    if (detailData && !detailData.is_show_all_spaces) {
      if (lid && lidList && lidList.length) {
        const data = lidList.filter((item) => parseInt(item.id) === parseInt(lid));
        if (data && data.length) {
          setFieldValue('location_id', data[0]);
        }
      } else if (!lid && lidList && lidList.length === 1) {
        setFieldValue('location_id', lidList[0]);
      }
    }
  }, [lid, detailData]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_reviwer_email', detailData.has_reviwer_email);
      setFieldValue('has_reviwer_name', detailData.has_reviwer_name);
      setFieldValue('has_reviwer_mobile', detailData.has_reviwer_mobile);
      setFieldValue('has_disclaimer', detailData.has_disclaimer);
      setFieldValue('has_employee_code', detailData.has_employee_code);
      setFieldValue('requires_verification_by_otp', detailData.requires_verification_by_otp);
      setFieldValue('has_tenant', detailData.has_tenant);
      setFieldValue('has_location', (detailData && detailData.category_type && detailData.category_type === 'ah' && detailData.location_ids && detailData.location_ids.length) || (detailData && detailData.category_type && detailData.category_type === 'ah' && detailData.is_show_all_spaces) ? 'Required' : 'None');
    }
  }, [detailData]);

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

  useEffect(() => {
    setFieldValue('disclaimer_text', disclaimerTrue ? 'yes' : '');
  }, [disclaimerTrue]);

  useEffect(() => {
    setDisclaimerTrue(!!disclaimer_text);
  }, [disclaimer_text]);

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {spaceInfo && spaceInfo.loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
        </>
      )}
      {(spaceInfo && spaceInfo.err) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={generateErrorMessage(spaceInfo)} />
        </>
      )}
    </div>
  );
  const getPathName = (value) => {
    const path = false;
    /* for (let i = 0; i < value.length; i += 1) {
      path = path ? `${path} / ${value[i].name}` : `${value[i].name}`;
    } */
    setFieldValue('space_path', value && value.length ? value[value.length - 1].name : '');
  };

  const getParentPath = (id, assetIds) => {
    const parent = spaceInfo.data.find((data) => data.id === id);
    if (parent && parent.id) {
      assetIds.push(id);
      if (parent && parent.parent_id && parent.parent_id.id) {
        getParentPath(parent.parent_id.id, assetIds);
      }
    }
  };
  const fetchSpace = (id) => {
    const assetIds = [];
    for (let i = 0; i < spaceInfo.data.length; i += 1) {
      if (id === spaceInfo.data[i].id) {
        assetIds.push(spaceInfo.data[i].id);
        if (spaceInfo.data[i].id && spaceInfo.data[i].parent_id && spaceInfo.data[i].parent_id.id) {
          getParentPath(spaceInfo.data[i].id, assetIds);
        }
      }
    }
    return uniq(assetIds).reverse();
  };

  /* useEffect(() => {
    if (spaceInfo.data && spaceInfo.data.length && sid) {
      const data = fetchSpace(parseInt(sid));
      setFieldValue('asset_id', data);
      const array = [];
      if (data && data.length) {
        data.map((arrayele) => {
          array.push(spaceInfo.data.find((ele) => ele.id === arrayele));
        });
      }
      getPathName(array);
      const space = spaceInfo.data.find((ele) => ele.id === last(data));
      if (space && space.id) {
        setSpaceCategoryId(space);
      }
    }
  }, [spaceInfo]); */

  const onChange = (value, selectedOptions) => {
    if (value && value.length && detailData.space_level) {
      if (parseInt(detailData.space_level) >= value.length) {
        setFieldValue('location_id', value);
        getPathName(selectedOptions);
      } else {
        setCascader(true);
      }
    } else {
      setCascader(false);
      setFieldValue('location_id', value);
      getPathName(selectedOptions);
    }
  };

  const onClear = () => {
    setFieldValue('location_id', '');
    getPathName('');
  };

  const filter = (inputValue, path) => path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

  const spaceList = spaceInfo && spaceInfo.data && spaceInfo.data.length > 0 ? getSpaceChildLocationsPublic(spaceInfo.data) : [];

  const hideError = (resendOtpInfo && resendOtpInfo.data && (resendOtpInfo.data.length > 0 || !resendOtpInfo.data.length)) || (otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats);
  const isMobileView = detectMob();

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        {detailData.has_reviwer_name && detailData.has_reviwer_name !== 'None' && (
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={nameValue.name}
            label={nameValue.label}
            isRequired={detailData.has_reviwer_name && detailData.has_reviwer_name === 'Required'}
            type="text"
            disabled={!!(ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken))}
            customClassName="bg-lightblue"
            setFieldValue={setFieldValue}
            customError={ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWTNameValidate(ssoToken.tokens.accessToken)}
            labelClassName="m-0"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={lettersOnly}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        {detailData.has_reviwer_mobile && detailData.has_reviwer_mobile !== 'None' && (
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={mobileValue.name}
            label={mobileValue.label}
            isRequired={detailData.has_reviwer_mobile && detailData.has_reviwer_mobile === 'Required'}
            type={isMobileView ? 'number' : 'text'}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            setFieldValue={setFieldValue}
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 13,
            }}
            onKeyPress={integerKeyPress}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        {detailData.has_reviwer_email && detailData.has_reviwer_email !== 'None' && (
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={emailValue.name}
            label={emailValue.label}
            disabled={!!(ssoToken && ssoToken.client && ssoToken.client.account && ssoToken.client.account.userName)}
            isRequired={detailData.has_reviwer_email && detailData.has_reviwer_email === 'Required'}
            type="email"
            customClassName="bg-lightblue"
            setFieldValue={setFieldValue}
            customError={domainValidation ? 'Email ID does not have a valid domain' : false}
            labelClassName="m-0"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 50,
            }}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        {detailData.has_employee_code && detailData.has_employee_code !== 'None' && (
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={employeeCode.name}
            label={employeeCode.label}
            isRequired={detailData.has_employee_code && detailData.has_employee_code === 'Required'}
            type="text"
            setFieldValue={setFieldValue}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: detailData.employee_code_limit ? detailData.employee_code_limit : '',
            }}
          />
        )}
      </Col>
      {(detailData.has_tenant && detailData.has_tenant !== 'None' && ((detailData && detailData.tenant_ids && detailData.tenant_ids.length > 0) || (detailData.has_tenant && detailData.has_tenant === 'Required'))) && (
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : 'mb-2'}>
          <MuiAutoComplete
            name={partnerId.name}
            label={partnerId.label}
            isRequired={detailData.has_tenant && detailData.has_tenant === 'Required'}
            labelClassName="m-0"
            formGroupClassName="m-1"
            open={partnerOpen}
            size="small"
            onOpen={() => {
              setPartnerOpen(true);
            }}
            onClose={() => {
              setPartnerOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={detailData && detailData.tenant_ids && detailData.tenant_ids.length ? detailData.tenant_ids : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={`${partnerId.label}${detailData.has_tenant && detailData.has_tenant === 'Required' ? ' *' : ''}`}
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
        </Col>
      )}
      {detailData && detailData.category_type && detailData.category_type === 'ah' && detailData.is_show_all_spaces && (
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
          <FormGroup className="m-1">
            <span className="mui-custom-label m-0 d-inline-block">
              {locationId.label}
              <span className="ml-1 text-danger">*</span>
            </span>
            <br />
            <Cascader
              options={preprocessData(spaceList && spaceList.length > 0 ? spaceList : [])}
              dropdownClassName="custom-cascader-popup"
              value={spaceList && spaceList.length > 0 ? location_id : []}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              onChange={onChange}
              placeholder="Select Space"
              dropdownRender={dropdownRender}
              notFoundContent="No options"
              className={location_id && (location_id.length === parseInt(detailData.space_level)) ? 'custom-cascader-disabled thin-scrollbar m-0 w-100' : 'thin-scrollbar bg-lightblue m-0 w-100'}
              showSearch={{ filter }}
              changeOnSelect
            />
            <span className="text-success">
              {space_path}
              {location_id && (location_id.length === parseInt(detailData.space_level)) && (
                <img
                  aria-hidden="true"
                  src={editIcon}
                  onClick={onClear}
                  alt="edit"
                  width="12"
                  height="12"
                  className="ml-2 cursor-pointer"
                />
              )}
            </span>
            {!location_id && (
            <span className="mt-2 text-danger font-tiny">Location is Required</span>
            )}
          </FormGroup>
        </Col>
      )}
      {detailData && !detailData.is_show_all_spaces && detailData.category_type && detailData.category_type === 'ah' && detailData.location_ids && detailData.location_ids.length > 0 && (
        <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
          <MuiAutoComplete
            name={locationId.name}
            label={locationId.label}
            isRequired
            labelClassName="m-0"
            disabled={(detailData && detailData.location_ids && detailData.location_ids.length > 0 && detailData.location_ids.length === 1) || lid}
            disableClearable={(detailData && detailData.location_ids && detailData.location_ids.length > 0 && detailData.location_ids.length === 1) || lid}
            formGroupClassName="m-1"
            open={typeOpen}
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            /* renderOption={(option) => (
               <>
                 <h6>{option.name || option.space_name}</h6>
                 <p className="float-left font-tiny">
                   {option.path_name && (
                     <>
                       {option.path_name}
                     </>
                   )}
                 </p>
                 <p className="float-right font-tiny">
                   {option.asset_category_id && (
                     <>
                       {extractTextObject(option.asset_category_id)}
                     </>
                   )}
                 </p>
               </>
             )} */
            options={detailData && detailData.location_ids && detailData.location_ids.length ? detailData.location_ids : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={locationId.label}
                className="bg-lightblue without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(detailData && detailData.location_ids && detailData.location_ids.length > 0 && detailData.location_ids.length === 1) || lid ? null : params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
      )}
      {detailData.requires_verification_by_otp && !is_otp_verified && ((email && email.includes('@') && !domainValidation) || (mobile && mobile.toString().length > 8)) && (
        <>
          {otpValidation && (
            <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : 'ml-1'}>
              <img src={warningDanger} alt="add" className="mr-2" width="10" height="10" />
              <span className="font-weight-800 font-tiny text-danger font-family-tab">Please enter a valid OTP code</span>
            </Col>
          )}
          <Col md="9" sm="9" lg="9" xs="9" className={isMobileView ? 'pl-4' : ''}>
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={otp.name}
              label={!otpValidation ? otp.label : ''}
              isRequired={!otpValidation ? otp.required : false}
              type="text"
              hideError={hideError}
              customClassName="bg-lightblue"
              setFieldValue={setFieldValue}
              labelClassName="m-0"
              formGroupClassName={!otpValidation ? 'm-1' : 'line-height-empty m-1'}
              inputProps={{
                maxLength: 5,
              }}
              onKeyPress={integerKeyPress}
            />
            {!otpValidation && resendOtpInfo && resendOtpInfo.data && !resendOtpInfo.data.ids && (
              <p className="ml-1 mt-1 text-danger mb-0 font-family-tab">
                Already sent
              </p>
            )}
            {counter > 0 && (sendOtpInfo && sendOtpInfo.data) && (
              <p className="ml-1 text-info mb-0 font-family-tab">
                Resend OTP in
                {' '}
                {counter}
                {' '}
                seconds
              </p>
            )}
            {!otpValidation && resendOtpInfo && resendOtpInfo.data && resendOtpInfo.data.ids && (
              <p className="ml-1 mt-1 text-success mb-0 font-family-tab">
                OTP sent successfully
              </p>
            )}
            {!otpValidation && otpVerifyInfo && otpVerifyInfo.data && otpVerifyInfo.data.verify_stats && (
              <p className="ml-1 mt-1 text-success mb-0 font-family-tab">
                OTP verified successfully
              </p>
            )}
          </Col>
          <Col md="3" sm="3" lg="3" xs="3" className={otpValidation ? 'mt-2 p-0' : 'mt-4 p-0'}>
            {(sendOtpInfo && sendOtpInfo.data) && (
              <Button
                type="button"
                variant="cotained"
                disabled={!(otp_code && otp_code.length > 2) || (otpVerifyInfo && otpVerifyInfo.loading)}
                onClick={() => checkOTPVerify()}
              >
                <span>Verify</span>
              </Button>
            )}
            {(sendOtpInfo && !sendOtpInfo.data) && (
              <Button
                type="button"
                variant="cotained"
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
                <span className="mr-1 font-family-tab">Didn&apos;t receive OTP code?</span>
                <span
                  aria-hidden="true"
                  className="text-info font-weight-800 cursor-pointer font-family-tab"
                  onClick={() => resendOTP()}
                >
                  Click here to resend OTP code
                </span>
              </p>
            )}
          </Col>
        </>
      )}
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        {detailData.has_disclaimer && detailData.has_disclaimer !== 'None' && (
          <Row className={isMobileView ? 'text-break content-center' : ''}>
            <Col md="1" sm="1" lg="1" xs="1" className={isMobileView ? '' : 'mt-1'}>
              <Checkbox
                name="disclaimer_text"
                id="disclaimer_text"
                onChange={() => setDisclaimerTrue(!disclaimerTrue)}
                value={disclaimerTrue}
                checked={disclaimerTrue}
              />
            </Col>
            <Col md="10" sm="10" lg="10" xs="10" className={isMobileView ? '' : 'p-0'}>
              <Label for="disclaimer" className="mt-2 pt-1 font-family-tab">{detailData.disclaimer_text}</Label>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
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
