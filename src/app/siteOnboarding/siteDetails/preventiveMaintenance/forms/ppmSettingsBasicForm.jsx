/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { getRolesGroups } from '../../../../adminSetup/setupService';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../../../commonComponents/formFields/muiTextarea';
import { AddThemeColor } from '../../../../themes/theme';
import {
  extractOptionsObject,
  generateErrorMessage,
  getAllCompanies,
  integerKeyPress,
} from '../../../../util/appUtils';
import { getPauseReasons } from '../../../../workorders/workorderService';
import {
  getMailTemplate,
  getTCList,
} from '../../../siteService';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';
import {getAccessLabel} from '../../../utils/utils';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      atStart,
      atReview,
      atDone,
      qrScanStart,
      qrScanDone,
      generatePpmAdvance,
      enforceTime,
      nfcScanStart,
      nfcScanDone,
      reviewRequired,
      reviewApproval,
      reviewComment,
      signoffApproval,
      signoffRequired,
      subAssets,
      indirectChild,
      isParent,
      performMissed,
      allowUsers,
      formatType,
      reportReason,
      allowExternalPPM,
      sendExternalPPM,
      sendEmail,
      sendCopyEmail,
      sendVendorEmail,
      externalEmail,
      restrictPPM,
      instructions,
      terms,
      disclaimer,
      isonHoldApproval,
      onHoldMax,
      onHoldApproval,
      onHoldRecipients,
      onHoldRequest,
      onHoldMail,
      onHoldTemplate,
      remainderMail,
      slaMail,
      reasonAccess,
      companyId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    name, generate_ppm_in_advance, send_email_before_weeks, reason_access_level, send_vendor_emails_as,
    is_external_ppm_to_be_performed, review_role_id, sign_off_role_id, is_sign_off_required, is_review_required,
    service_report_reason_id, on_hold_approval_id, is_on_hold_approval_required, external_reminder_email_template_id, sla_template_id, reminder_template_id,
    on_hold_missed_mail_id, on_hold_mail_reject_id, on_hold_mail_template_id,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [vendorEmailOpen, setVendorEmailOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    mailInfoList,
  } = useSelector((state) => state.site);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);

  const [defaultRoleOpen, setDefaultRoleOpen] = useState(false);
  const [defaultRoleKeyword, setDefaultRoleKeyword] = useState(false);

  const [defaultRoleOpen1, setDefaultRoleOpen1] = useState(false);
  const [defaultRoleKeyword1, setDefaultRoleKeyword1] = useState(false);

  const [defaultRoleOpen2, setDefaultRoleOpen2] = useState(false);
  const [defaultRoleKeyword2, setDefaultRoleKeyword2] = useState(false);

  const [serviceOpen2, setServiceOpen2] = useState(false);
  const [serviceKeyword2, setServiceKeyword2] = useState(false);

  const [cMailOpen1, setCmailOpen1] = useState(false);
  const [cMailOpen2, setCmailOpen2] = useState(false);
  const [cMailOpen3, setCmailOpen3] = useState(false);
  const [cMailOpen4, setCmailOpen4] = useState(false);
  const [cMailOpen5, setCmailOpen5] = useState(false);
  const [cMailOpen6, setCmailOpen6] = useState(false);

  const companies = getAllCompanies(userInfo);
  const {
    pauseReasons,
  } = useSelector((state) => state.workorder);

  const {
    roleGroupsInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && defaultRoleOpen) {
      dispatch(getRolesGroups(companies, appModels.USERROLE, defaultRoleKeyword));
    }
  }, [defaultRoleOpen, defaultRoleKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && defaultRoleOpen1) {
      dispatch(getRolesGroups(companies, appModels.USERROLE, defaultRoleKeyword1));
    }
  }, [defaultRoleOpen1, defaultRoleKeyword1]);

  useEffect(() => {
    if (userInfo && userInfo.data && serviceOpen2) {
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, serviceKeyword2));
    }
  }, [serviceOpen2, serviceKeyword2]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMailTemplate(companies, appModels.MAILTEMPLATE, false, appModels.PPMSCHEDULERWEEk));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && defaultRoleOpen2) {
      dispatch(getRolesGroups(companies, appModels.USERROLE, defaultRoleKeyword2));
    }
  }, [defaultRoleOpen2, defaultRoleKeyword2]);

  const showSearchModal = () => {
    setModelValue(appModels.SURVEY);
    setFieldName('helpdesk_survey');
    setModalName('Helpdesk Survey');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('team_category_id', '');
    setCategoryOpen(false);
  };

  let roleOptions = [];

  if (roleGroupsInfo && roleGroupsInfo.loading) {
    roleOptions = [{ name: 'Loading..' }];
  }

  if (roleGroupsInfo && roleGroupsInfo.data && roleGroupsInfo.data.length) {
    roleGroupsInfo.data.map((roleItem) => {
      const role = roleItem.name.toLowerCase();
      roleOptions.push(roleItem);
    });
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : oldData && oldData.name ? oldData.name : '';
  }

  const onDefaultRoleClear = () => {
    setFieldValue('review_role_id', '');
    setDefaultRoleOpen(false);
  };

  const onDefaultRoleClear1 = () => {
    setFieldValue('sign_off_role_id', '');
    setDefaultRoleOpen1(false);
  };

  const onDefaultRoleClear2 = () => {
    setFieldValue('on_hold_approval_id', '');
    setDefaultRoleOpen1(false);
  };

  const onServiceClear2 = () => {
    setFieldValue('service_report_reason_id', '');
    setDefaultRoleOpen1(false);
  };

  const onCmailClear1 = () => {
    setCmailOpen1(false);
    setFieldValue('external_reminder_email_template_id', '');
  };
  const onCmailClear2 = () => {
    setCmailOpen2(false);
    setFieldValue('on_hold_mail_template_id', '');
  };
  const onCmailClear3 = () => {
    setCmailOpen3(false);
    setFieldValue('on_hold_mail_reject_id', '');
  };
  const onCmailClear4 = () => {
    setCmailOpen4(false);
    setFieldValue('on_hold_missed_mail_id', '');
  };
  const onCmailClear5 = () => {
    setCmailOpen5(false);
    setFieldValue('reminder_template_id', '');
  };
  const onCmailClear6 = () => {
    setCmailOpen6(false);
    setFieldValue('sla_template_id', '');
  };

  const onRequestorSearch = () => {
    setModelValue(appModels.USERROLE);
    setColumns(['id', 'name']);
    setFieldName('review_role_id');
    setModalName('Review Approval');
    setCompanyValue('');
    setExtraModal(true);
  };

  const onSignSearch = () => {
    setModelValue(appModels.USERROLE);
    setColumns(['id', 'name']);
    setFieldName('sign_off_role_id');
    setModalName('Sign off Approval');
    setCompanyValue('');
    setExtraModal(true);
  };

  const onApprovalSearch = () => {
    setModelValue(appModels.USERROLE);
    setColumns(['id', 'name']);
    setFieldName('on_hold_approval_id');
    setModalName('On Hold Approval');
    setCompanyValue('');
    setExtraModal(true);
  };

  const onServiceReportSearch = () => {
    setModelValue(appModels.ORDERPAUSEREASONS);
    setColumns(['id', 'name']);
    setFieldName('service_report_reason_id');
    setModalName('Service Report Reason');
    setCompanyValue('');
    setExtraModal(true);
  };

  const showMailModal = (fieldName1, headerName) => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName(fieldName1);
    setModalName(headerName);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const serviceOptions = extractOptionsObject(pauseReasons, service_report_reason_id);

  return (
    <>
      <Row className="mb-1 requestorForm-input">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Photo Required
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atStart.name}
              label={atStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atReview.name}
              label={atReview.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atDone.name}
              label={atDone.label}
            />
          </Col>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            QR Required
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Enforce Time
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={enforceTime.name}
              label={enforceTime.label}
            />
          </Col>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            NFC
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={nfcScanStart.name}
              label={nfcScanStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={nfcScanDone.name}
              label={nfcScanDone.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Generate PPM Advance
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiAutoComplete
              sx={{
                marginBottom: '10px',
              }}
              name={generatePpmAdvance.name}
              isRequired={generatePpmAdvance.required}
              className="bg-white"
              open={typeOpen}
              disableClearable
              oldvalue={generate_ppm_in_advance}
              value={generate_ppm_in_advance && generate_ppm_in_advance.value ? generate_ppm_in_advance.value : generate_ppm_in_advance}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.GenerateAdvancePpm}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={generatePpmAdvance.label}
                  className="without-padding"
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
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Review/Sign off
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={reviewRequired.name}
              label={reviewRequired.label}
            />
          </Col>
          {is_review_required && (
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiAutoComplete
                sx={{
                  marginBottom: '10px',
                }}
                name={reviewApproval.name}
                label={reviewApproval.label}
                isRequired={reviewApproval.required}
                formGroupClassName="mb-1"
                oldValue={getOldData(review_role_id)}
                value={review_role_id && review_role_id.name ? review_role_id.name : getOldData(review_role_id)}
                open={defaultRoleOpen}
                size="small"
                onOpen={() => {
                  setDefaultRoleOpen(true);
                  setDefaultRoleKeyword('');
                }}
                onClose={() => {
                  setDefaultRoleOpen(false);
                  setDefaultRoleKeyword('');
                }}
                apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
                loading={roleGroupsInfo && roleGroupsInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={roleOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={reviewApproval.label}
                    required={reviewApproval.required}
                    className={((getOldData(review_role_id)) || (review_role_id && review_role_id.id))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    value={defaultRoleKeyword}
                    onChange={(e) => setDefaultRoleKeyword(e.target.value)}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {roleGroupsInfo && roleGroupsInfo.loading && defaultRoleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(review_role_id)) || (review_role_id && review_role_id.id)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onDefaultRoleClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={onRequestorSearch}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={reviewComment.name}
              label={reviewComment.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={signoffRequired.name}
              label={signoffRequired.label}
            />
          </Col>
          {is_sign_off_required && (
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiAutoComplete
                sx={{
                  marginBottom: '10px',
                }}
                name={signoffApproval.name}
                label={signoffApproval.label}
                isRequired={signoffApproval.required}
                formGroupClassName="mb-1"
                oldValue={getOldData(sign_off_role_id)}
                value={sign_off_role_id && sign_off_role_id.name ? sign_off_role_id.name : getOldData(sign_off_role_id)}
                open={defaultRoleOpen1}
                size="small"
                onOpen={() => {
                  setDefaultRoleOpen1(true);
                  setDefaultRoleKeyword1('');
                }}
                onClose={() => {
                  setDefaultRoleOpen1(false);
                  setDefaultRoleKeyword1('');
                }}
                apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
                loading={roleGroupsInfo && roleGroupsInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={roleOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={signoffApproval.label}
                    required={signoffApproval.required}
                    className={((getOldData(sign_off_role_id)) || (sign_off_role_id && sign_off_role_id.id))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    value={defaultRoleKeyword}
                    onChange={(e) => setDefaultRoleKeyword1(e.target.value)}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {roleGroupsInfo && roleGroupsInfo.loading && defaultRoleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(sign_off_role_id)) || (sign_off_role_id && sign_off_role_id.id)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onDefaultRoleClear1}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={onSignSearch}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Missed PPM
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={performMissed.name}
              label={performMissed.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={allowUsers.name}
              label={allowUsers.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Assets Viewer
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={subAssets.name}
              label={subAssets.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={indirectChild.name}
              label={indirectChild.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={isParent.name}
              label={isParent.label}
            />
          </Col>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Service Report
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              name={formatType.name}
              label={formatType.label}
              isRequired
              formGroupClassName="m-1"
              type="text"
              inputProps={{
                maxLength: 150,
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiAutoComplete
              sx={{
                marginBottom: '10px',
              }}
              name={reportReason.name}
              label={reportReason.label}
              isRequired={reportReason.required}
              formGroupClassName="mb-1"
              oldValue={getOldData(service_report_reason_id)}
              value={service_report_reason_id && service_report_reason_id.name ? service_report_reason_id.name : getOldData(service_report_reason_id)}
              open={serviceOpen2}
              size="small"
              onOpen={() => {
                setServiceOpen2(true);
                setServiceKeyword2('');
              }}
              onClose={() => {
                setServiceOpen2(false);
                setServiceKeyword2('');
              }}
              apiError={(pauseReasons && pauseReasons.err) ? generateErrorMessage(pauseReasons) : false}
              loading={pauseReasons && pauseReasons.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={serviceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={reportReason.label}
                  required={reportReason.required}
                  className={((getOldData(service_report_reason_id)) || (service_report_reason_id && service_report_reason_id.id))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  value={defaultRoleKeyword2}
                  onChange={(e) => setServiceKeyword2(e.target.value)}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {pauseReasons && pauseReasons.loading && serviceOpen2 ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(service_report_reason_id)) || (service_report_reason_id && service_report_reason_id.id)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onServiceClear2}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={onServiceReportSearch}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            External PPM
          </Typography>

          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={allowExternalPPM.name}
              label={allowExternalPPM.label}
            />
          </Col>
          {is_external_ppm_to_be_performed && (
          <>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={sendExternalPPM.name}
                label={sendExternalPPM.label}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={sendEmail.name}
                isRequired={sendEmail.required}
                className="bg-white"
                open={emailOpen}
                disableClearable
                oldvalue={send_email_before_weeks}
                value={send_email_before_weeks && send_email_before_weeks.value ? send_email_before_weeks.value : send_email_before_weeks}
                size="small"
                onOpen={() => {
                  setEmailOpen(true);
                }}
                onClose={() => {
                  setEmailOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.sendEmailBefore}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={sendEmail.label}
                    className="without-padding"
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
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={sendVendorEmail.name}
                isRequired={sendVendorEmail.required}
                className="bg-white"
                open={vendorEmailOpen}
                disableClearable
                oldvalue={send_vendor_emails_as}
                value={send_vendor_emails_as && send_vendor_emails_as.value ? send_vendor_emails_as.value : send_vendor_emails_as}
                size="small"
                onOpen={() => {
                  setVendorEmailOpen(true);
                }}
                onClose={() => {
                  setVendorEmailOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.vendorEmail}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={sendVendorEmail.label}
                    className="without-padding"
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
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={externalEmail.name}
                label={externalEmail.label}
                open={cMailOpen1}
                size="small"
                oldValue={getOldData(external_reminder_email_template_id)}
                value={external_reminder_email_template_id && external_reminder_email_template_id.name ? external_reminder_email_template_id.name : getOldData(external_reminder_email_template_id)}
                onOpen={() => {
                  setCmailOpen1(true);
                }}
                onClose={() => {
                  setCmailOpen1(false);
                }}
                loading={mailInfoList && mailInfoList.loading}
                getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={mailInfoList?.data || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={externalEmail.label}
                    placeholder="Search & Select"
                    className={((getOldData(external_reminder_email_template_id)) || (external_reminder_email_template_id && external_reminder_email_template_id.id))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {cMailOpen1 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(external_reminder_email_template_id)) || (external_reminder_email_template_id && external_reminder_email_template_id.id)) && (
                            <IconButton onClick={onCmailClear1}>
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton onClick={() => showMailModal('external_reminder_email_template_id','External Reminder Email Template')}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={restrictPPM.name}
                label={restrictPPM.label}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiTextarea
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                fullWidth
                variant="standard"
                multiline
                name={instructions.name}
                label={instructions.label}
                formGroupClassName="m-1"
                type="textarea"
                maxRows="4"
                inputProps={{
                  maxLength: 300,
                }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiTextarea
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                fullWidth
                variant="standard"
                multiline
                name={terms.name}
                label={terms.label}
                formGroupClassName="m-1"
                type="textarea"
                maxRows="4"
                inputProps={{
                  maxLength: 300,
                }}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiTextarea
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                fullWidth
                variant="standard"
                multiline
                name={disclaimer.name}
                label={disclaimer.label}
                formGroupClassName="m-1"
                type="textarea"
                maxRows="4"
                inputProps={{
                  maxLength: 300,
                }}
              />
            </Col>
          </>
          )}
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            On Hold Request Approval
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={isonHoldApproval.name}
              label={isonHoldApproval.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              name={onHoldMax.name}
              label={onHoldMax.label}
              isRequired
              onKeyPress={integerKeyPress}
              formGroupClassName="m-1"
              type="text"
              inputProps={{
                maxLength: 4,
              }}
            />
          </Col>
          {is_on_hold_approval_required && (
            <>
              <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
                <MuiAutoComplete
                  sx={{
                    marginBottom: '10px',
                  }}
                  name={onHoldApproval.name}
                  label={onHoldApproval.label}
                  isRequired={onHoldApproval.required}
                  formGroupClassName="mb-1"
                  oldValue={getOldData(on_hold_approval_id)}
                  value={on_hold_approval_id && on_hold_approval_id.name ? on_hold_approval_id.name : getOldData(on_hold_approval_id)}
                  open={defaultRoleOpen2}
                  size="small"
                  onOpen={() => {
                    setDefaultRoleOpen2(true);
                    setDefaultRoleKeyword2('');
                  }}
                  onClose={() => {
                    setDefaultRoleOpen2(false);
                    setDefaultRoleKeyword2('');
                  }}
                  apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
                  loading={roleGroupsInfo && roleGroupsInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={roleOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={onHoldApproval.label}
                      required={onHoldApproval.required}
                      className={((getOldData(on_hold_approval_id)) || (on_hold_approval_id && on_hold_approval_id.id))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      value={defaultRoleKeyword2}
                      onChange={(e) => setDefaultRoleKeyword2(e.target.value)}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {roleGroupsInfo && roleGroupsInfo.loading && defaultRoleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(on_hold_approval_id)) || (on_hold_approval_id && on_hold_approval_id.id)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onDefaultRoleClear2}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={onApprovalSearch}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={onHoldRequest.name}
                  label={onHoldRequest.label}
                  open={cMailOpen2}
                  size="small"
                  oldValue={getOldData(on_hold_mail_template_id)}
                  value={on_hold_mail_template_id && on_hold_mail_template_id.name ? on_hold_mail_template_id.name : getOldData(on_hold_mail_template_id)}
                  onOpen={() => {
                    setCmailOpen2(true);
                  }}
                  onClose={() => {
                    setCmailOpen2(false);
                  }}
                  loading={mailInfoList && mailInfoList.loading}
                  getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={mailInfoList?.data || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={onHoldRequest.label}
                      placeholder="Search & Select"
                      className={((getOldData(on_hold_mail_template_id)) || (on_hold_mail_template_id && on_hold_mail_template_id.id))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {cMailOpen2 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(on_hold_mail_template_id)) || (on_hold_mail_template_id && on_hold_mail_template_id.id)) && (
                                <IconButton onClick={onCmailClear2}>
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={() => showMailModal('on_hold_mail_template_id','On Hold Request Approval Mail')}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={onHoldMail.name}
                  label={onHoldMail.label}
                  open={cMailOpen3}
                  size="small"
                  oldValue={getOldData(on_hold_mail_reject_id)}
                  value={on_hold_mail_reject_id && on_hold_mail_reject_id.name ? on_hold_mail_reject_id.name : getOldData(on_hold_mail_reject_id)}
                  onOpen={() => {
                    setCmailOpen3(true);
                  }}
                  onClose={() => {
                    setCmailOpen3(false);
                  }}
                  loading={mailInfoList && mailInfoList.loading}
                  getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={mailInfoList?.data || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={onHoldMail.label}
                      placeholder="Search & Select"
                      className={((getOldData(on_hold_mail_reject_id)) || (on_hold_mail_reject_id && on_hold_mail_reject_id.id))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {cMailOpen3 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(on_hold_mail_reject_id)) || (on_hold_mail_reject_id && on_hold_mail_reject_id.id)) && (
                                <IconButton onClick={onCmailClear3}>
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={() => showMailModal('on_hold_mail_reject_id','On Hold Approval/Reject Mail')}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={onHoldTemplate.name}
                  label={onHoldTemplate.label}
                  open={cMailOpen4}
                  size="small"
                  oldValue={getOldData(on_hold_missed_mail_id)}
                  value={on_hold_missed_mail_id && on_hold_missed_mail_id.name ? on_hold_missed_mail_id.name : getOldData(on_hold_missed_mail_id)}
                  onOpen={() => {
                    setCmailOpen4(true);
                  }}
                  onClose={() => {
                    setCmailOpen4(false);
                  }}
                  loading={mailInfoList && mailInfoList.loading}
                  getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={mailInfoList?.data || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={onHoldTemplate.label}
                      placeholder="Search & Select"
                      className={((getOldData(on_hold_missed_mail_id)) || (on_hold_missed_mail_id && on_hold_missed_mail_id.id))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {cMailOpen4 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(on_hold_missed_mail_id)) || (on_hold_missed_mail_id && on_hold_missed_mail_id.id)) && (
                                <IconButton onClick={onCmailClear4}>
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={() => showMailModal('on_hold_missed_mail_id','On-Hold Request Missed Template')}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Col>
            </>
          )}
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Other Info
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={remainderMail.name}
              label={remainderMail.label}
              open={cMailOpen5}
              size="small"
              oldValue={getOldData(reminder_template_id)}
              value={reminder_template_id && reminder_template_id.name ? reminder_template_id.name : getOldData(reminder_template_id)}
              onOpen={() => {
                setCmailOpen5(true);
              }}
              onClose={() => {
                setCmailOpen5(false);
              }}
              loading={mailInfoList && mailInfoList.loading}
              getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={mailInfoList?.data || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={remainderMail.label}
                  placeholder="Search & Select"
                  className={((getOldData(reminder_template_id)) || (reminder_template_id && reminder_template_id.id))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cMailOpen5 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(reminder_template_id)) || (reminder_template_id && reminder_template_id.id)) && (
                            <IconButton onClick={onCmailClear5}>
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton onClick={() => showMailModal('reminder_template_id', 'Reminder Mail Template')}>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={slaMail.name}
              label={slaMail.label}
              open={cMailOpen6}
              size="small"
              oldValue={getOldData(sla_template_id)}
              value={sla_template_id && sla_template_id.name ? sla_template_id.name : getOldData(sla_template_id)}
              onOpen={() => {
                setCmailOpen6(true);
              }}
              onClose={() => {
                setCmailOpen6(false);
              }}
              loading={mailInfoList && mailInfoList.loading}
              getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={mailInfoList?.data || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={slaMail.label}
                  placeholder="Search & Select"
                  className={((getOldData(sla_template_id)) || (sla_template_id && sla_template_id.id))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cMailOpen6 && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(sla_template_id)) || (sla_template_id && sla_template_id.id)) && (
                            <IconButton onClick={onCmailClear6}>
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton onClick={() => showMailModal('sla_template_id', 'SLA Mail Template')}>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiAutoComplete
              name={reasonAccess.name}
              isRequired={reasonAccess.required}
              className="bg-white"
              open={accessOpen}
              disableClearable
              oldvalue={reason_access_level}
              value={reason_access_level && reason_access_level.label ? reason_access_level.label : getAccessLabel(reason_access_level)}
              size="small"
              onOpen={() => {
                setAccessOpen(true);
              }}
              onClose={() => {
                setAccessOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.randomTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={reasonAccess.label}
                  className="without-padding"
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
        </Col>
        <Dialog size="xl" fullWidth open={extraModal}>
          <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AdvancedSearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                setFieldValue={setFieldValue}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Row>
    </>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
