/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
} from '@material-ui/core';
import { FormControl } from "@mui/material";
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';


import { getTrackTemplates, getCtConfig, getTrackerExists } from '../ctService';
import {
  getAllowedCompanies, extractOptionsObject, getDateTimeSeconds,
} from '../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';

import checkoutFormModel from '../formModel/checkoutFormModel';
import MuiAutoComplete from "../../commonComponents/formFields/muiAutocomplete";
import MuiTextField from "../../commonComponents/formFields/muiTextField";
import DialogHeader from '../../commonComponents/dialogHeader';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const { formField } = checkoutFormModel;

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    isShow,
    editId,
    values,
    formField: {
      title,
      dateAudit,
      trackerTemplateId,
      startDate,
      endDate,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    audit_date, audit_for, tracker_template_id, end_date, start_date,
  } = formValues;
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemKeyword, setSystemKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const [dateauditvalue, setDateAuditValue] = useState(audit_for ? new Date(getDateTimeSeconds(audit_for)) : new Date());
  const [startdateval, setStartDateValue] = useState(start_date ? start_date : new Date());
  const [enddateval, setEndDateValue] = useState(end_date ? end_date : new Date());

  const {
    trackerTemplates,
    ctConfig,
  } = useSelector((state) => state.consumptionTracker);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  useEffect(() => {
    if (audit_date && tracker_template_id && tracker_template_id.name) {
      setFieldValue('name', `${moment(audit_date).format('MMM-YY')} - ${tracker_template_id.name}`);
      dispatch(getTrackerExists(companies, tracker_template_id.id, moment(audit_date).format('MMM-YY'), appModels.CONSUMPTIONTRACKER));
    }

    if (!audit_date || !tracker_template_id) {
      setFieldValue('name', '');
    }
  }, [audit_date, tracker_template_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && userCompanyId && isShow) {
      dispatch(getCtConfig(userCompanyId, appModels.CONSUMPTIONTRACKERCONFIG));
      setFieldValue('audit_date', new Date());
    }
  }, [userInfo]);

  useEffect(() => {
    if (!editId) {
      const date = new Date(audit_date);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      setFieldValue('start_date', firstDay);
      setStartDateValue(firstDay);
      setFieldValue('end_date', lastDay);
      setEndDateValue(lastDay);
    }
  }, [isShow, audit_date]);

  useEffect(() => {
    if (userInfo && userInfo.data && systemOpen && ctConfig && ctConfig.data) {
      const tempLevel = ctConfig.data.length ? ctConfig.data[0].audit_template_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && systemKeyword) {
        domain = `${domain},["name","ilike","${systemKeyword}"]`;
      }

      if (!tempLevel && systemKeyword) {
        domain = `["name","ilike","${systemKeyword}"]`;
      }

      dispatch(getTrackTemplates(domain, appModels.CONSUMPTIONTRACKERTEMPLATE));
    }
  }, [userInfo, systemKeyword, systemOpen, ctConfig]);

  const onWorkClear = () => {
    setSystemKeyword(null);
    setFieldValue('tracker_template_id', '');
    setSystemOpen(false);
  };

  const showWorkModal = () => {
    setModelValue(appModels.CONSUMPTIONTRACKERTEMPLATE);
    setColumns(['id', 'name']);
    setFieldName('tracker_template_id');
    setModalName('Audit Template List');
    let domain = '';
    const tempLevel = ctConfig && ctConfig.data && ctConfig.data.length ? ctConfig.data[0].audit_template_access : '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const systemOptions = extractOptionsObject(trackerTemplates, tracker_template_id);

  function getOldDataId(oldData) {
    return oldData && oldData.name ? oldData.name : '';
  }

  function disableEndDate() {
    const res = moment(start_date || new Date()).add(32, 'days').format('YYYY-MM-DD');
    return res;
  }
  console.log(audit_date);

  return (
    <>
     <Box
      sx={{
      width: "100%",
      marginTop: "20px",
      }}
    >
      <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "3%",
                flexWrap: "wrap",
            }}
        > 
      <FormControl
            sx={{
              width: '45%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                name={dateAudit.name}
                label={dateAudit.label}
                isRequired={dateAudit.required}
                slotProps={{
                  textField: { required: dateAudit.required} 
                }}
                value={dateauditvalue}
                onChange={(newValue) => { setDateAuditValue(newValue);    setFieldValue('audit_date', new Date(newValue)); }}
                defaultValue={audit_for ? new Date(getDateTimeSeconds(audit_for)) : ''}
                setFieldTouched={setFieldTouched}
                placeholder={dateAudit.label}
                format='MMM-yy'
                views={['month', 'year']}
                disablePastDate
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </FormControl>

          <MuiAutoComplete
          sx={{
              width: "45%",
              marginTop: "auto",
              marginBottom: "20px",
          }}
          options={systemOptions}
          name={trackerTemplateId.name}
          label={trackerTemplateId.label}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          open={systemOpen}          
          onOpen={() => {
            setSystemOpen(true);
            setSystemKeyword('');
          }}
          onClose={() => {
            setSystemOpen(false);
            setSystemKeyword('');
          }}
          value={tracker_template_id && tracker_template_id.name ? tracker_template_id.name : getOldDataId(tracker_template_id)}
          getOptionSelected={(option, value) => option.name === value.name}
          required
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={trackerTemplateId.label}
                  onChange={(e) => setSystemKeyword(e.target.value)}
                  variant="standard"
                  value={systemKeyword}
                  required
                  className={((getOldDataId(tracker_template_id)) || (tracker_template_id && tracker_template_id.id) || (systemKeyword && systemKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {trackerTemplates && trackerTemplates.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldDataId(tracker_template_id)) || (tracker_template_id && tracker_template_id.id) || (systemKeyword && systemKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onWorkClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showWorkModal}
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

          <FormControl
            sx={{
              width: '45%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={startDate.name}
                label={startDate.label}
                isRequired 
                slotProps={{
                  textField: { required: true} 
                }}
                value={startdateval}
                onChange={(newValue) => setStartDateValue(newValue)}
                //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={start_date ?  start_date  : ''}
                ampm={false}
                format="dd/MM/yyyy"
                setFieldTouched={setFieldTouched}
                placeholder={startDate.label}                
              />
            </MuiPickersUtilsProvider>
          </FormControl>


          <FormControl
            sx={{
              width: '45%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={endDate.name}
                label={endDate.label}
                isRequired 
                slotProps={{
                  textField: { required: true} 
                }}
                value={enddateval}
                onChange={(newValue) => setEndDateValue(newValue)}
                //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={end_date ? end_date : ''}
                ampm={false}
                format="dd/MM/yyyy"
                setFieldTouched={setFieldTouched}
                placeholder={endDate.label}   
                startDate={start_date && new Date(start_date)}
                endDate={start_date && disableEndDate()}             
                disablePastDate={!editId}
              />
            </MuiPickersUtilsProvider>
          </FormControl>

          <MuiTextField
        sx={{
            width: "45%",
            marginBottom: "20px",
        }}
        name={title.name}
        label={title.label}          
        type="text"
        value={values[formField.title.name]}
        required={'Required'}        
        />

       {/*/*  <Row className="p-1">
       <Col xs={12} md={12} lg={6} sm={12}>
          <DateTimeField
            name={dateAudit.name}
            label={dateAudit.label}
            isRequired
            dateFormat="MMM-YY"
            picker="month"
            formGroupClassName="m-1"
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={dateAudit.label}
            disablePastDate
            disableFuture
            defaultValue={audit_date ? new Date(getDateTimeSeconds(audit_date)) : ''}
          />
        </Col>
        <Col xs={12} md={12} lg={6} sm={12}>
          <FormikAutocomplete
            name={trackerTemplateId.name}
            label={trackerTemplateId.label}
            isRequired
            className="bg-white"
            formGroupClassName="m-1"
            oldValue={getOldDataId(tracker_template_id)}
            value={tracker_template_id && tracker_template_id.name ? tracker_template_id.name : getOldDataId(tracker_template_id)}
            apiError={(trackerTemplates && trackerTemplates.err) ? generateErrorMessage(trackerTemplates) : false}
            open={systemOpen}
            size="small"
            onOpen={() => {
              setSystemOpen(true);
              setSystemKeyword('');
            }}
            onClose={() => {
              setSystemOpen(false);
              setSystemKeyword('');
            }}
            loading={trackerTemplates && trackerTemplates.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={systemOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setSystemKeyword(e.target.value)}
                variant="outlined"
                value={systemKeyword}
                className={((getOldDataId(tracker_template_id)) || (tracker_template_id && tracker_template_id.id) || (systemKeyword && systemKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {trackerTemplates && trackerTemplates.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldDataId(tracker_template_id)) || (tracker_template_id && tracker_template_id.id) || (systemKeyword && systemKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onWorkClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showWorkModal}
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
        <Col xs={12} sm={12} md={6} lg={6}>
          <DateTimeField
            name={startDate.name}
            label={startDate.label}
            isRequired
            dateFormat={getDatePickerFormat(userInfo, 'date')}
            showTime={false}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={startDate.label}
            className="w-100"
            formGroupClassName="m-1"
            labelClassName="ml-0 mb-1 mt-1 mr-1"
            defaultValue={start_date ? new Date(getDateTimeSeconds(start_date)) : ''}
          />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <DateTimeField
            name={endDate.name}
            label={endDate.label}
            isRequired
            dateFormat={getDatePickerFormat(userInfo, 'date')}
            showTime={false}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={endDate.label}
            disablePastDate={!editId}
            startDate={start_date && new Date(start_date)}
            endDate={start_date && disableEndDate()}
            className="w-100"
            formGroupClassName="m-1"
            labelClassName="ml-0 mb-1 mt-1 mr-1"
            defaultValue={end_date ? new Date(getDateTimeSeconds(end_date)) : ''}
          />
        </Col>
       

        <Col xs={12} md={12} lg={12} sm={12}>
          <InputField
            name={title.name}
            label={title.label}
            isRequired
            formGroupClassName="m-1"
            type="text"
            maxLength="150"
          />
        </Col>

        
              </Row> */}

              <Dialog maxWidth={'xl'} open={extraModal} >
            <DialogHeader title={modalName} onClose={() => { setExtraModal(false); }} imagePath={false}/>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">           

            <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName="Search Template"
            setFieldValue={setFieldValue}
          />
 
          
            </DialogContentText>
            </DialogContent>
          
            </Dialog> 
     {/*  <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName="Search Template"
            setFieldValue={setFieldValue}
          />
        </ModalBody>
      </Modal> */}
      </Box>
      </Box>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isShow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default BasicForm;
