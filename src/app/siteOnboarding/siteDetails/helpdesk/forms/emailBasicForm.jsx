/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormControl,
  TextField
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Label,
  Row
} from 'reactstrap';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import {
  extractOptionsObject,
  generateErrorMessage,
  getAllCompanies, getArrayFromValuesById,
  getColumnArrayById,
  isArrayColumnExists,
} from '../../../../util/appUtils';
import {
  getMailTemplate,
  getRecipientList,
  getSmsTemplate, setRecipientsLocationId,
} from '../../../siteService';
import SearchModalMultiple from '../../inspectionSchedule/forms/searchModalMultiple';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    editPageIndex,
    setFieldValue,
    setFieldTouched,
    selectedData,
    formField: {
      helpdeskState,
      isRequestee,
      isMaintenanceTeam,
      isRecipients,
      recipientsName,
      isSendEmail,
      mailTemplateId,
      isPushNotify,
      isSendSms,
      smsTemplateId,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    recipients_ids, is_recipients, is_send_email, mail_template_id, is_send_sms, sms_template_id, helpdesk_state,
  } = formValues;

  const [typeOpen, setTypeOpen] = useState(false);
  // const [recipientsLocationId, setRecipientsLocationId] = useState([]);
  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [mailOpen, setMailOpen] = useState(false);
  const [mailKeyword, setMailKeyword] = useState('');

  const [smsOpen, setSmsOpen] = useState(false);
  const [smsKeyword, setSmsKeyword] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo);
  const {
    recipientsInfo, mailInfoList, smsInfoList, recipientsLocationId,
  } = useSelector((state) => state.site);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (editId) {
      setRecipientsLocationId(recipients_ids);
    }
  }, [editId]);

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

  useEffect(() => {
    if (userInfo && userInfo.data && recipientsOpen) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsOpen, recipientsKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMailTemplate(companies, appModels.MAILTEMPLATE));
    }
  }, [userInfo, mailOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getSmsTemplate(companies, appModels.MAILTEMPLATE));
    }
  }, [userInfo, smsOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const handleRecipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setRecipientsLocationId(options));
    setCheckRows(options);
  };

  const onRecipientsKeywordClear = () => {
    setRecipientsKeyword(null);
    dispatch(setRecipientsLocationId([]));
    setCheckRows([]);
    setRecipientsOpen(false);
  };

  const onRecipientKeyWordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };

  const onMailKeywordClear = () => {
    setMailKeyword(null);
    setFieldValue('mail_template_id', '');
    setMailOpen(false);
  };

  const onSmsKeywordClear = () => {
    setSmsKeyword(null);
    setFieldValue('sms_template_id', '');
    setSmsOpen(false);
  };

  const onMailKeywordChange = (event) => {
    setMailKeyword(event.target.value);
  };

  const onSmsKeywordChange = (event) => {
    setSmsKeyword(event.target.value);
  };

  const showSearchModalMail = () => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName('mail_template_id');
    setModalName('Mail Template');
    setOtherFieldName('model_id');
    setOtherFieldValue('website.support.ticket');
    setCompanyValue('');
    setExtraModal(true);
  };

  const showSearchModalSms = () => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName('sms_template_id');
    setModalName('SMS Template');
    setOtherFieldName('model_id');
    setOtherFieldValue('website.support.ticket');
    setCompanyValue('');
    setExtraModal(true);
  };

  const showRecipientsModal = () => {
    setCheckRows([]);
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('recipients_ids');
    setModalName('Recipient List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  function getConditionLabel(value) {
    let res = '';
    if (customData && customData.stateText[value]) {
      res = customData.stateText[value].label;
    }

    return res;
  }

  const mailOptions = extractOptionsObject(mailInfoList, mail_template_id);
  const smsOptions = extractOptionsObject(smsInfoList, sms_template_id);

  const getTypes = (types) => {
    const array = customData.stateTypes;
    const newArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (!types.includes(array[i].value)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  // const types = !editId ? getColumnArrayById(selectedData, 'helpdesk_state') : '';
  // const typeOptions = !editId ? getTypes(types) : customData.stateTypes;
  const setLocationIds = (data) => {
    const Location = ([...recipientsLocationId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setRecipientsLocationId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };
  const notRemovedData = selectedData.filter((item) => item && !item.isRemove);

  const types = (!editId || !editPageIndex) ? getColumnArrayById(notRemovedData, 'helpdesk_state') : '';

  const typeOptions = (!editId || !editPageIndex) ? getTypes(types) : customData.stateTypes;

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={helpdeskState.name}
              label={helpdeskState.label}
              open={typeOpen}
              disabled={editId || editPageIndex}
              isRequired
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              disableClearable
              oldvalue={getConditionLabel(helpdesk_state)}
              value={helpdesk_state && helpdesk_state.label ? helpdesk_state.label : getConditionLabel(helpdesk_state)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
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
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isRequestee.name}
              label={isRequestee.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isMaintenanceTeam.name}
              label={isMaintenanceTeam.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isRecipients.name}
              label={isRecipients.label}
            />
          </Col>
          {is_recipients ? (
            <Col xs={12} sm={12} md={12} lg={12}>
              <div>
                <FormControl className={classes.margin}>
                  <Label for={recipientsName.name}>
                    {recipientsName.label}
                  </Label>
                  <MuiAutoComplete
                    sx={{
                      marginBottom: '20px',
                    }}
                    multiple
                    filterSelectedOptions
                    isRequired
                    name="Recipients"
                    open={recipientsOpen}
                    size="small"
                    className="bg-white"
                    onOpen={() => {
                      setRecipientsOpen(true);
                      setRecipientsKeyword('');
                    }}
                    onClose={() => {
                      setRecipientsOpen(false);
                      setRecipientsKeyword('');
                    }}
                    value={recipients_ids && recipients_ids.length ? recipients_ids : []}
                    defaultValue={recipientsLocationId}
                    onChange={(e, options) => handleRecipients(options)}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={recipientsOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        className={((getOldData(recipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        onChange={(e) => onRecipientKeyWordChange(e.target.value)}
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
                </FormControl>
              </div>
            </Col>
          ) : ''}
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isSendEmail.name}
              label={isSendEmail.label}
            />
          </Col>
          {is_send_email === true ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                name={mailTemplateId.name}
                label={mailTemplateId.label}
                isRequired={mailTemplateId.isRequired}
                className="bg-white"
                open={mailOpen}
                size="small"
                oldValue={getOldData(mail_template_id)}
                value={mail_template_id && mail_template_id.name ? mail_template_id.name : getOldData(mail_template_id)}
                onOpen={() => {
                  setMailOpen(true);
                }}
                onClose={() => {
                  setMailOpen(false);
                }}
                loading={mailInfoList && mailInfoList.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(mailInfoList && mailInfoList.err) ? generateErrorMessage(mailInfoList) : false}
                options={mailOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onMailKeywordChange}
                    variant="standard"
                    className={((getOldData(mail_template_id)) || (mail_template_id && mail_template_id.id) || (mailKeyword && mailKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(mail_template_id)) || (mail_template_id && mail_template_id.id) || (mailKeyword && mailKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onMailKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showSearchModalMail}
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
          ) : ''}
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isPushNotify.name}
              label={isPushNotify.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <MuiCheckboxField
              name={isSendSms.name}
              label={isSendSms.label}
            />
          </Col>
          {is_send_sms === true ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                name={smsTemplateId.name}
                label={smsTemplateId.label}
                isRequired={smsTemplateId.isRequired}
                className="bg-white"
                open={smsOpen}
                size="small"
                oldValue={getOldData(sms_template_id)}
                value={sms_template_id && sms_template_id.name ? sms_template_id.name : getOldData(sms_template_id)}
                onOpen={() => {
                  setSmsOpen(true);
                }}
                onClose={() => {
                  setSmsOpen(false);
                }}
                loading={smsInfoList && smsInfoList.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(smsInfoList && smsInfoList.err) ? generateErrorMessage(smsInfoList) : false}
                options={smsOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onSmsKeywordChange}
                    variant="standard"
                    className={((getOldData(sms_template_id)) || (sms_template_id && sms_template_id.id) || (smsKeyword && smsKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {smsInfoList && smsInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(sms_template_id)) || (sms_template_id && sms_template_id.id) || (smsKeyword && smsKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onSmsKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showSearchModalSms}
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
          ) : ''}
        </Col>
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
        <DialogHeader title={modalName} imagePath={false} onClose={() => {  setExtraMultipleModal(false); }} />
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
          // oldAccessData={accessLocationId && accessLocationId.length ? accessLocationId : []}
          />
         </DialogContentText>
                   </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                // onClick={() => { setExtraMultipleModal(false); if (fieldName === 'recipients_ids') { setRecipientsLocationId(checkedRows); } }}
                onClick={() => { if (fieldName === 'recipients_ids') { setLocationIds(checkedRows); } }}
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

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  editPageIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
