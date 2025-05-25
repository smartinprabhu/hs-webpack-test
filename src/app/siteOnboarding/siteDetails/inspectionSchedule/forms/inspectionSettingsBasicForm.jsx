/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import {
  Row, Col,
} from 'reactstrap';
import { useFormikContext } from 'formik';

import {
  Dialog, DialogContent, DialogContentText, DialogActions, Button, Typography,
} from '@mui/material';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import dayjs from 'dayjs';
import {
  generateErrorMessage, extractOptionsObject, getAllowedCompanies, decimalKeyPressDown, getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
} from '../../../../util/appUtils';
import { AddThemeColor } from '../../../../themes/theme';
import { getDefinitonByLabel } from '../../../utils/utils';
import {
  getRecipientList, getInspectionMailTemplate, setRecipientsLocationId,
} from '../../../siteService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiDateTimeField from '../../../../commonComponents/formFields/muiDateTimeField';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const BasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      overrideDuplicateInspections,
      dueNowPeriod,
      inspectionCommencedOn,
      isAlarm,
      sendEmail,
      mailTemplateId,
      recipientsId,
      configJson,
    },
  } = props;

  const useStyles = makeStyles((themeStyle) => ({
    margin: {
      marginBottom: themeStyle.spacing(1.25),
      width: '100%',
    },
  }));
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const classes = useStyles();
  const {
    recipients_ids, inspection_commenced_on, due_now_period, is_send_email, mail_template_id,
  } = formValues;
  // const [recipientsLocationId, setRecipientsLocationId] = useState([]);
  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [companyOpen, setCompanyOpen] = useState(false);

  const [mailOpen, setMailOpen] = useState(false);
  const [mailKeyword, setMailKeyword] = useState('');
  const [mailLocationId, setMailLocationId] = useState([]);
  const [mailOptions, setMailOptions] = useState([]);

  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [currentTooltip, setCurrentTip] = useState('');

  const [mailTemplateOpen, setMailTemplateOpen] = useState(false);
  const [mailTemplateKeyword, setMailTemplateKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const userCompanies = userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const companies = getAllowedCompanies(userInfo);
  const { recipientsInfo, insMailInfoList, recipientsLocationId } = useSelector((state) => state.site);

  const dateFormat = 'DD-MM-y';

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length && recipientsOpen) {
      setRecipientsOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(recipientsLocationId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setRecipientsOptions([{ name: 'Loading...' }]);
    } else {
      setRecipientsOptions([]);
    }
  }, [recipientsInfo, recipientsOpen]);

  useEffect(() => {
    if (recipientsLocationId) {
      setFieldValue('recipients_ids', recipientsLocationId);
    }
  }, [recipientsLocationId]);

  // useEffect(() => {
  //   if (mailLocationId) {
  //     setFieldValue('mail_template_id', mailLocationId);
  //   }
  // }, [mailLocationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && recipientsOpen) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsOpen, recipientsKeyword]);

  useEffect(() => {
    if ((recipients_ids && recipients_ids.length > 0) || (mail_template_id && mail_template_id.length > 0)) {
      dispatch(setRecipientsLocationId(recipients_ids));
      setRecipientsKeyword(recipients_ids);
      setMailLocationId(mail_template_id);
      setMailKeyword(mail_template_id);
    }
  }, [recipients_ids, mail_template_id]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : oldData && oldData.name ? oldData.name : '';
  }

  function getMailOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[0] : '';
  }

  const handleRecipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setRecipientsLocationId(options));
    setCheckRows(options);
  };
  const onRecipientKeyWordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };
  const onRecipientsKeywordClear = () => {
    setRecipientsKeyword(null);
    dispatch(setRecipientsLocationId([]));
    setCheckRows([]);
    setRecipientsOpen(false);
  };

  const handleMailTemplate = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setMailLocationId(options);
    setCheckRows(options);
  };

  const onMailKeywordClear = () => {
    setMailKeyword(null);
    setMailLocationId([]);
    setCheckRows([]);
    setMailOpen(false);
  };

  const onMailKeywordChange = (event) => {
    setMailKeyword(event.target.value);
  };

  const showRecipientsModal = () => {
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('recipients_ids');
    setModalName('Recipient List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const setLocationIds = (data) => {
    const Location = ([...recipientsLocationId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setRecipientsLocationId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getInspectionMailTemplate(companies, appModels.MAILTEMPLATE, mailTemplateKeyword, 'onboarding'));
      }
    })();
  }, [mailTemplateOpen, mailTemplateKeyword]);

  const onLocationKeyWordChange = (event) => {
    setMailTemplateKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setMailTemplateKeyword(null);
    setFieldValue('mail_template_id', '');
    setMailTemplateOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName('mail_template_id');
    setModalName('Mail Template List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraMultipleModal(true);
  };

  const mailsOptions = extractOptionsObject(insMailInfoList, mail_template_id);

  return (
    <>
      <Row className="mb-1">
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
            General
          </Typography>
          <Col xs={12} md={12} lg={12} sm={12}>
            <MuiCheckboxField
              name={overrideDuplicateInspections.name}
              label={overrideDuplicateInspections.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              name={dueNowPeriod.name}
              label={dueNowPeriod.label}
              onKeyPress={decimalKeyPressDown}
              formGroupClassName="m-1"
              type="text"
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            {/* <DateTimeField
              name={inspectionCommencedOn.name}
              label={inspectionCommencedOn.label}
              isRequired={inspectionCommencedOn.isRequired}
              formGroupClassName="m-1"
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={inspectionCommencedOn.label}
              disablePastDate
              defaultValue={inspection_commenced_on ? new Date(getDateTimeSeconds(inspection_commenced_on)) : ''}
            /> */}
            <MuiDateTimeField
              sx={{
                marginBottom: '20px',
              }}
              name={inspectionCommencedOn.name}
              localeText={{ todayButtonLabel: 'Now' }}
              slotProps={{
                actionBar: {
                  actions: ['today', 'clear', 'accept'],
                },
                textField: { variant: 'standard', error: false },
              }}
              label={inspectionCommencedOn.label}
              isRequired={inspectionCommencedOn.required}
              value={inspection_commenced_on ? dayjs(inspection_commenced_on) : null}
              ampm={false}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              isErrorHandle
              disablePast
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
            Anomaly Settings
            <Tooltip title={getDefinitonByLabel('anomaly')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="md" icon={faInfoCircle} />
              </span>
            </Tooltip>
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MuiCheckboxField
              name={isAlarm.name}
              label={isAlarm.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MuiCheckboxField
              name={sendEmail.name}
              label={sendEmail.label}
            />
          </Col>
          {is_send_email === true ? (
            <>
              <Col xs={12} sm={12} lg={12} md={12} className="pl-2">
                <MuiAutoComplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={mailTemplateId.name}
                  label={mailTemplateId.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(mail_template_id)}
                  value={mail_template_id && mail_template_id.name ? mail_template_id.name : getOldData(mail_template_id)}
                  apiError={(insMailInfoList && insMailInfoList.err && mailTemplateOpen) ? generateErrorMessage(insMailInfoList) : false}
                  open={mailTemplateOpen}
                  size="small"
                  onOpen={() => {
                    setMailTemplateOpen(true);
                    setMailTemplateKeyword('');
                  }}
                  onClose={() => {
                    setMailTemplateOpen(false);
                    setMailTemplateKeyword('');
                  }}
                  loading={insMailInfoList && insMailInfoList.loading && mailTemplateOpen}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={mailsOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onLocationKeyWordChange}
                      variant="standard"
                      label={mailTemplateId.label}
                      value={mailTemplateKeyword}
                      className={((mail_template_id && mail_template_id.id) || (mailTemplateKeyword && mailTemplateKeyword.length > 0) || (mail_template_id && mail_template_id.length))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {insMailInfoList && insMailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((mailTemplateKeyword && mailTemplateKeyword.length > 0) || (mail_template_id && mail_template_id.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onKeywordClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showRequestorModal}
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
              {/* <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
                <div className="">
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    isRequired
                    name="Recipients"
                    open={recipientsOpen}
                    size="small"
                    className="bg-white w-100"
                    onOpen={() => {
                      setRecipientsOpen(true);
                      setRecipientsKeyword('');
                    }}
                    onClose={() => {
                      setRecipientsOpen(false);
                      setRecipientsKeyword('');
                    }}
                    value={recipients_ids && recipients_ids.length > 0 ? recipients_ids : []}
                    defaultValue={recipientsLocationId}
                    onChange={(e, options) => handleRecipients(options)}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={recipientsOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={recipientsId.label}
                        value={recipientsKeyword}
                        required
                        onChange={onRecipientKeyWordChange}
                        className={((getOldData(recipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        // onChange={(e) => setRecipientsKeyword(e.target.value)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {(recipientsInfo && recipientsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((recipientsKeyword && recipientsKeyword.length > 0) || (recipients_ids && recipients_ids.length > 0)) && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onRecipientsKeywordClear}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showRecipientsModal}
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
                </div>
              </Col> */}
            </>
          )
            : ''}
        </Col>
        {/* <Col xs={12} sm={6} lg={6} md={6}>
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
            Json Info
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              name={configJson.name}
              label={configJson.label}
              formGroupClassName="m-1"
              type="text"
            />
          </Col>
        </Col> */}
      </Row>
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
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setCheckedRows={setCheckRows}
              olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
              oldRecipientsData={recipientsLocationId && recipientsLocationId.length ? recipientsLocationId : []}
              oldMailData={mailLocationId && mailLocationId.length ? mailLocationId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'recipients_ids') { setLocationIds(checkedRows); } }}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
