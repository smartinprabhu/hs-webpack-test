/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  CheckboxFieldGroup,
} from '@shared/formFields';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Button,
  Tooltip,
  Typography,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Label, Row,
} from 'reactstrap';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import {
  getTCList, getMailTemplate,
} from '../../../siteService';
import customData from '../data/customData.json';
import {
  copyToClipboard, extractOptionsObjectWithName, getAllCompanies, generateErrorMessage, extractOptionsObject,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import { AddThemeColor } from '../../../../themes/theme';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      hasSiteSpecificCategory,
      isEnableItTicket,
      isAutoWo,
      attachmentLimit,
      sendEscalation,
      isAge,
      isConstraints,
      isCost,
      sendReminder,
      helpdeskFeedback,
      helpdeskSurvey,
      buttonText,
      helpdeskEmail,
      expiryDays,
      feedbackTicket,
      emailFeedback,
      enableExternalHelpdesk,
      uuidValue,
      externalUrl,
      verificationOtp,
      reviewerName,
      reviewerEmail,
      reviewerMobile,
      attachment,
      workLocation,
      mobileVisibility,
      problemCatSubCat,
      shareMailTemplate,
      isVendorField,
      vendorAccessType,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    uuid, helpdesk_survey, is_enable_helpdesk_feedback, is_enable_external_helpdesk, share_mail_template_id, vendor_access_type, is_vendor_field, problem_category_type,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, siteDetails, mailInfoList,
  } = useSelector((state) => state.site);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);

  const [mailOpen, setMailRepOpen] = useState(false);
  const [mailRepKeyword, setMailRepKeyword] = useState('');

  const [accessTypeOpen, setAccessTypeOpen] = useState(false);

  const companies = getAllCompanies(userInfo);
  const companiesSiteSpecific = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companiesSiteSpecific, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  const categoryOptions = extractOptionsObjectWithName(tcInfo, helpdesk_survey, 'title');

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

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
    setFieldValue('helpdesk_survey', '');
    setCategoryOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getMailTemplate(companies, appModels.MAILTEMPLATE, mailRepKeyword));
      }
    })();
  }, [mailOpen, mailRepKeyword]);

  const onMailKeyWordChange = (event) => {
    setMailRepKeyword(event.target.value);
  };

  const onKeywordMailClear = () => {
    setMailRepKeyword(null);
    setFieldValue('share_mail_template_id', '');
    setMailRepOpen(false);
  };

  const showRequestorAModal = () => {
    setModelValue(appModels.TASK);
    setFieldName('share_mail_template_id');
    setModalName('Share Mail List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  function typeLable(staten) {
    if (customData && customData.accessTypesLabel[staten]) {
      const s = customData.accessTypesLabel[staten].label;
      return s;
    }
    return '';
  }

  const mailOptions = extractOptionsObject(mailInfoList, share_mail_template_id);

  return (
    <>
      <Row className="mb-1 requestorForm-input">
        <Col xs={12} sm={4} lg={4} md={4}>
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
            General
            <Tooltip title="General settings allowed for the Helpdesk module" placement="right">
              <span className="text-info">
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={isEnableItTicket.name}
              label={isEnableItTicket.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={isAutoWo.name}
              label={isAutoWo.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={hasSiteSpecificCategory.name}
              label={hasSiteSpecificCategory.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={attachmentLimit.name}
              label={attachmentLimit.label}
              formGroupClassName="m-0"
              autoComplete="off"
              type="text"
              inputProps={{
                maxLength: 30,
              }}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={mobileVisibility.name}
              label={mobileVisibility.label}
              formGroupClassName="m-0"
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              disableClearable
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.mobileTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={mobileVisibility.label}
                  className="without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      params.InputProps.endAdornment
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={problemCatSubCat.name}
              label={problemCatSubCat.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={catOpen}
              oldvalue={typeLable(problem_category_type)}
              value={problem_category_type && problem_category_type.label ? problem_category_type.label : typeLable(problem_category_type)}
              size="small"
              onOpen={() => {
                setCatOpen(true);
              }}
              onClose={() => {
                setCatOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.catTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={problemCatSubCat.label}
                  className="input-small-custom without-padding"
                  placeholder="Search"
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
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={sendEscalation.name}
              label={sendEscalation.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={sendReminder.name}
              label={sendReminder.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={isAge.name}
              label={isAge.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={isConstraints.name}
              label={isConstraints.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <MuiCheckboxField
              name={isCost.name}
              label={isCost.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
            <Label for={isVendorField.name} className="m-0">
              {isVendorField.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={isVendorField.name}
              checkedvalue="Yes"
              id="Yes"
              className="ml-1"
              label={isVendorField.label1}
            />
            <CheckboxFieldGroup
              name={isVendorField.name}
              checkedvalue="No"
              id="No"
              label={isVendorField.label2}
            />
          </Col>
          {is_vendor_field === 'Yes'
            ? (
              <Col xs={12} sm={12} lg={12} md={12}>
                <MuiAutoComplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={vendorAccessType.name}
                  label={vendorAccessType.label}
                  labelClassName="mb-1"
                  formGroupClassName="mb-1 w-100"
                  open={accessTypeOpen}
                  oldvalue={typeLable(vendor_access_type)}
                  value={vendor_access_type && vendor_access_type.label ? vendor_access_type.label : typeLable(vendor_access_type)}
                  size="small"
                  onOpen={() => {
                    setAccessTypeOpen(true);
                  }}
                  onClose={() => {
                    setAccessTypeOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={customData.accessTypes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={vendorAccessType.label}
                      className="input-small-custom without-padding"
                      placeholder="Search"
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
            )
            : ''}
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={shareMailTemplate.name}
              label={shareMailTemplate.label}
              formGroupClassName="m-0"
              oldValue={getOldData(share_mail_template_id)}
              value={share_mail_template_id && share_mail_template_id.name ? share_mail_template_id.name : getOldData(share_mail_template_id)}
              apiError={(mailInfoList && mailInfoList.err && mailOpen) ? generateErrorMessage(mailInfoList) : false}
              open={mailOpen}
              size="small"
              onOpen={() => {
                setMailRepOpen(true);
                setMailRepKeyword('');
              }}
              onClose={() => {
                setMailRepOpen(false);
                setMailRepKeyword('');
              }}
              loading={mailInfoList && mailInfoList.loading && mailOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={mailOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => { onMailKeyWordChange(e.target.value); }}
                  variant="standard"
                  label={shareMailTemplate.label}
                  value={mailRepKeyword}
                  className={((share_mail_template_id && share_mail_template_id.id) || (mailRepKeyword && mailRepKeyword.length > 0) || (share_mail_template_id && share_mail_template_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((share_mail_template_id && share_mail_template_id.id) || (mailRepKeyword && mailRepKeyword.length > 0) || (share_mail_template_id && share_mail_template_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordMailClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          {/* <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showRequestorAModal}
                                >
                                  <SearchIcon fontSize="small" />
                                </IconButton> */}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>

        </Col>
        <Col xs={12} sm={4} lg={4} md={4}>
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
            External Helpdesk Settings
            <Tooltip title="Through these settings, users can be allowed to create tickets using a public URL. The applicable fields for the  public URL can also be configured below under field settings" placement="right">
              <span className="text-info">
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <MuiCheckboxField
              name={enableExternalHelpdesk.name}
              label={enableExternalHelpdesk.label}
            />
          </Col>
          {is_enable_external_helpdesk
            ? (
              <>
                <Col xs={12} sm={12} md={12} lg={12} className="text-center">
                  <Tooltip placement="bottom" title={copySuccess ? 'Copied!' : 'Copy URL'}>
                    <Button
                      variant="contained"
                      size="sm"
                      onMouseLeave={() => setCopySuccess(false)}
                      onClick={() => { copyToClipboard(uuid, 'ticket'); setCopySuccess(true); }}
                      className="pb-05 pt-05 font-11 mb-1 mr-2"
                    >
                      <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faCopy} />
                      <span className="mr-2">Copy URL</span>
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
                  <MuiCheckboxField
                    name={verificationOtp.name}
                    label={verificationOtp.label}
                  />
                </Col>
                <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
                  Field Settings
                </span>
                <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
                  <Label for={reviewerName.name} className="m-0">
                    {reviewerName.label}
                  </Label>
                  <br />
                  <CheckboxFieldGroup
                    name={reviewerName.name}
                    checkedvalue="Required"
                    id="Required"
                    className="ml-1"
                    label={reviewerName.label1}
                  />
                  <CheckboxFieldGroup
                    name={reviewerName.name}
                    checkedvalue="Optional"
                    id="Optional"
                    label={reviewerName.label2}
                  />
                  <CheckboxFieldGroup
                    name={reviewerName.name}
                    checkedvalue="None"
                    id="None"
                    label={reviewerName.label3}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
                  <Label for={reviewerEmail.name} className="m-0">
                    {reviewerEmail.label}
                  </Label>
                  <br />
                  <CheckboxFieldGroup
                    name={reviewerEmail.name}
                    checkedvalue="Required"
                    id="Required"
                    className="ml-1"
                    label={reviewerEmail.label1}
                  />
                  <CheckboxFieldGroup
                    name={reviewerEmail.name}
                    checkedvalue="Optional"
                    id="Optional"
                    label={reviewerEmail.label2}
                  />
                  <CheckboxFieldGroup
                    name={reviewerEmail.name}
                    checkedvalue="None"
                    id="None"
                    label={reviewerEmail.label3}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
                  <Label for={reviewerMobile.name} className="m-0">
                    {reviewerMobile.label}
                  </Label>
                  <br />
                  <CheckboxFieldGroup
                    name={reviewerMobile.name}
                    checkedvalue="Required"
                    id="Required"
                    className="ml-1"
                    label={reviewerMobile.label1}
                  />
                  <CheckboxFieldGroup
                    name={reviewerMobile.name}
                    checkedvalue="Optional"
                    id="Optional"
                    label={reviewerMobile.label2}
                  />
                  <CheckboxFieldGroup
                    name={reviewerMobile.name}
                    checkedvalue="None"
                    id="None"
                    label={reviewerMobile.label3}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
                  <Label for={attachment.name} className="m-0">
                    {attachment.label}
                  </Label>
                  <br />
                  <CheckboxFieldGroup
                    name={attachment.name}
                    checkedvalue="Required"
                    id="Required"
                    className="ml-1"
                    label={attachment.label1}
                  />
                  <CheckboxFieldGroup
                    name={attachment.name}
                    checkedvalue="Optional"
                    id="Optional"
                    label={attachment.label2}
                  />
                  <CheckboxFieldGroup
                    name={attachment.name}
                    checkedvalue="None"
                    id="None"
                    label={attachment.label3}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
                  <Label for={workLocation.name} className="m-0">
                    {workLocation.label}
                  </Label>
                  <br />
                  <CheckboxFieldGroup
                    name={workLocation.name}
                    checkedvalue="Required"
                    id="Required"
                    className="ml-1"
                    label={workLocation.label1}
                  />
                  <CheckboxFieldGroup
                    name={workLocation.name}
                    checkedvalue="Optional"
                    id="Optional"
                    label={workLocation.label2}
                  />
                  <CheckboxFieldGroup
                    name={workLocation.name}
                    checkedvalue="None"
                    id="None"
                    label={workLocation.label3}
                  />
                </Col>
              </>
            ) : ''}
        </Col>
        <Col xs={12} sm={4} lg={4} md={4}>
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
            Feedback
            <Tooltip title="Collecting feedbacks from the ticket requestor can be enabled using these settings. Feedbacks can also be using the automated way of reopening the tickets and notifying the maintenance team" placement="right">
              <span className="text-info">
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <MuiCheckboxField
              name={helpdeskFeedback.name}
              label={helpdeskFeedback.label}
            />
          </Col>
          {is_enable_helpdesk_feedback ? (
            <>
              <Col xs={12} sm={12} lg={12} md={12}>
                <MuiAutoComplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={helpdeskSurvey.name}
                  label={helpdeskSurvey.label}
                  labelClassName="mb-2"
                  formGroupClassName="mb-1"
                  open={categoryOpen}
                  oldValue={getOldData(helpdesk_survey)}
                  value={helpdesk_survey && helpdesk_survey.title ? helpdesk_survey.title : getOldData(helpdesk_survey)}
                  size="small"
                  onOpen={() => {
                    setCategoryOpen(true);
                    setCategoryKeyword('');
                  }}
                  onClose={() => {
                    setCategoryOpen(false);
                    setCategoryKeyword('');
                  }}
                  loading={tcInfo && tcInfo.loading && categoryOpen}
                  getOptionSelected={(option, value) => option.title === value.title}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
                  apiError={(tcInfo && tcInfo.err) ? generateErrorMessage(tcInfo) : false}
                  options={categoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onCategoryKeywordChange}
                      variant="standard"
                      label={helpdeskSurvey.label}
                      value={categoryKeyword}
                      className={((getOldData(helpdesk_survey)) || (helpdesk_survey && helpdesk_survey.id) || (categoryKeyword && categoryKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {tcInfo && tcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(helpdesk_survey)) || (helpdesk_survey && helpdesk_survey.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCategoryKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showSearchModal}
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
              <Col xs={12} sm={12} md={12} lg={12}>
                <MuiTextField
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={buttonText.name}
                  label={buttonText.label}
                  autoComplete="off"
                  type="text"
                  inputProps={{
                    maxLength: 30,
                  }}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
                <MuiCheckboxField
                  name={helpdeskEmail.name}
                  label={helpdeskEmail.label}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <MuiTextField
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={expiryDays.name}
                  label={expiryDays.label}
                  autoComplete="off"
                  type="text"
                  inputProps={{
                    maxLength: 30,
                  }}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
                <MuiCheckboxField
                  name={feedbackTicket.name}
                  label={feedbackTicket.label}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
                <MuiCheckboxField
                  name={emailFeedback.name}
                  label={emailFeedback.label}
                />
              </Col>
            </>
          ) : ''}
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
