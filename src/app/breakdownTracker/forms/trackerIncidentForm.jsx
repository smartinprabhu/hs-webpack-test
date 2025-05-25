/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  FormControl,
  Typography,
} from '@mui/material';
import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';
import { Box } from '@mui/system';
import {
  CheckboxField,
} from '@shared/formFields';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
// import { Autocomplete } from '@material-ui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../commonComponents/formFields/muiCheckbox';
import { AddThemeColor } from '../../themes/theme';
import {
  extractOptionsObject,
  generateErrorMessage,
  getAllCompanies, getArrayFromValuesById,
  getColumnArrayById,
  isArrayColumnExists,
} from '../../util/appUtils';
import {
  getServiceCategory,
  getServiceImpacted,
  setServiceImpactedId,
} from '../breakdownService';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const IncidentForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    setIncidentDateEdit,
    editId,
    formField: {
      incidentDate,
      ciriticalitys,
      isServiceImpacted,
      incidentAge,
      serviceImpactedIds,
      resultsInStatutoryNonCompliance,
      breakdownDueToAgeing,
      serviceCategoryId,
      Priority,
    },
  } = props;

  const useStyles = makeStyles((themeStyle) => ({
    margin: {
      marginBottom: themeStyle.spacing(1.25),
      width: '20%',
    },
  }));

  const { values: formValues } = useFormikContext();
  const {
    ciriticality, priority, incident_date, is_service_impacted, service_category_id, services_impacted_ids, company_id, expexted_closure_date,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [extraModal1, setExtraModal1] = useState(false);

  const [criticalOpen, setCriticalOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);

  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceKeyword, setServiceKeyword] = useState('');
  const [checkedRows, setCheckRows] = useState([]);
  const [serviceImpactOptions, setServiceImpactOptions] = useState([]);

  const [serviceCategoryOpen, setServiceCategoryOpen] = useState(false);
  const [serviceCategoryKeyword, setServiceCategoryKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const [selectedDate, setDateChange] = useState(incident_date ? dayjs(moment.utc(incident_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);
  const {
    serviceImpactId, servicecatInfoList, serviceImpactInfo, btConfigInfo,
  } = useSelector((state) => state.breakdowntracker);

  const companies = getAllCompanies(userInfo);
  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';
  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;
  const isCritical = configData && configData.criticality;
  const defaultIntialValues = Array.isArray(configData?.additional_fields_ids) && configData.additional_fields_ids.length > 0
    ? configData.additional_fields_ids
    : [];

  const PrioriyDisableArray = defaultIntialValues.find((field) => field.label === 'is_priority_disable' && field.value === 'Yes') || null;
  const isPrioriyDisable = PrioriyDisableArray ? PrioriyDisableArray.value : '';

  function getDifferece(date2) {
    const date1 = new Date();
    const d = date2; // today!
    const x = 1; // go back 5 days!
    d.setDate(d.getDate() - x);
    const Difference_In_Time = d.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  useEffect(() => {
    if (serviceImpactId) {
      setFieldValue('services_impacted_ids', serviceImpactId);
    }
  }, [serviceImpactId]);

  useEffect(() => {
    if (!is_service_impacted) {
      setFieldValue('services_impacted_ids', '');
    }
  }, [is_service_impacted]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && serviceCategoryOpen) {
        const tempLevel = configData.service_category_access ? configData.service_category_access : '';
        let domain = '';
        if (tempLevel === 'Site') {
          domain = `["company_id","=",${userCompanyId}]`;
        } else if (tempLevel === 'Company') {
          domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
        } else if (tempLevel === 'Instance') {
          domain = '"|",["company_id","=",1],["company_id","=",false]';
        }

        if (tempLevel && serviceCategoryKeyword) {
          domain = `${domain},["name","ilike","${serviceCategoryKeyword}"]`;
        }

        if (!tempLevel && serviceCategoryKeyword) {
          domain = `["name","ilike","${serviceCategoryKeyword}"]`;
        }
        await dispatch(getServiceCategory(domain, appModels.BREAKDOWNTRACKERSERVICECATEGORY));
      }
    })();
  }, [serviceCategoryOpen, serviceCategoryKeyword, btConfigInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && serviceOpen) {
      dispatch(getServiceImpacted(companies, appModels.BREAKDOWNTRACKERSERVICE, serviceKeyword));
    }
  }, [userInfo, serviceOpen, serviceKeyword]);

  const onServiceImpactKeywordClear = () => {
    setServiceKeyword(null);
    dispatch(setServiceImpactedId([]));
    setCheckRows([]);
    setServiceOpen(false);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showServiceImpactModal = () => {
    setModelValue(appModels.BREAKDOWNTRACKERSERVICE);
    setFieldName('services_impacted_ids');
    setModalName('Service Impact List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(company_id && company_id.id ? company_id.id : companies);
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (serviceImpactInfo && serviceImpactInfo.data && serviceImpactInfo.data.length && serviceOpen) {
      setServiceImpactOptions(getArrayFromValuesById(serviceImpactInfo.data, isAssociativeArray(serviceImpactId || []), 'id'));
    } else if (serviceImpactInfo && serviceImpactInfo.loading) {
      setServiceImpactOptions([{ name: 'Loading...' }]);
    } else {
      setServiceImpactOptions([]);
    }
  }, [serviceImpactInfo, serviceOpen]);

  const handleServiceImpacted = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setServiceImpactedId(options));
    setCheckRows(options);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onServiceCategoryChange = (event) => {
    setServiceCategoryKeyword(event.target.value);
  };

  const showServiceCatModal = () => {
    setModelValue(appModels.BREAKDOWNTRACKERSERVICECATEGORY);
    setFieldName('service_category_id');
    setModalName('Service Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    const tempLevel = configData.service_category_access ? configData.service_category_access : '';
    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }
    dispatch(getServiceCategory(domain, appModels.BREAKDOWNTRACKERSERVICECATEGORY));
    setCompanyValue(domain);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setOldValues(service_category_id && service_category_id.id ? service_category_id.id : '');
    setExtraModal1(true);
  };

  const onServiceCategoryClear = () => {
    setServiceCategoryKeyword(null);
    setFieldValue('service_category_id', '');
    setServiceCategoryOpen(false);
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(setServiceImpactedId(services_impacted_ids));
    }
  }, [userInfo]);

  // useEffect(() => {
  //   dispatch(setServiceImpactedId(serviceImpactId));
  // }, [serviceImpactId]);

  // useEffect(() => {
  //   if (services_impacted_ids) {
  //     dispatch(setServiceImpactedId(services_impacted_ids));
  //   }
  // }, [services_impacted_ids]);

  // useEffect(() => {
  //   if (editId) {
  //     setServiceImpactedId(services_impacted_ids);
  //   }
  // }, [editId]);

  const setLocationIds = (data) => {
    const Location = ([...serviceImpactId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setServiceImpactedId(uniqueObjArray));
    setExtraMultipleModal(false);
    setCheckRows([]);
  };

  const onServiceImpactKeyWordChange = (event) => {
    setServiceKeyword(event.target.value);
  };

  function getCriticalLabel(data) {
    if (customData && customData.criticalTextForm[data]) {
      const s = customData.criticalTextForm[data].label;
      return s;
    }
    return '';
  }

  const serviceCategoryOptions = extractOptionsObject(servicecatInfoList, service_category_id);

  const handleDateChange = (date) => {
    if (editId) {
      setIncidentDateEdit(true);
    } else {
      setIncidentDateEdit(false);
    }
    setDateChange(date);
    setFieldValue('incident_date', date);
  };

  const onDataChange = (fieldRef, data) => {
    setFieldValue(fieldRef, data);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Incident Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          {/* <FormControl
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={incidentDate.name}
                label={incidentDate.label}
                value={selectedDate}
                onChange={handleDateChange}
                maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={incident_date ? new Date(getDateTimeSeconds(incident_date)) : null}
                ampm={false}
                format="dd/MM/yyyy HH:mm:ss"
              />
            </MuiPickersUtilsProvider>
          </FormControl> */}
          <FormControl
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  sx={{ width: '95%' }}
                  localeText={{ todayButtonLabel: 'Now' }}
                  slotProps={{
                    actionBar: {
                      actions: ['today', 'clear', 'accept'],
                    },
                    textField: { variant: 'standard', required: true },
                  }}
                  name={incidentDate.name}
                  label={incidentDate.label}
                  value={selectedDate}
                  onChange={handleDateChange}
                  ampm={false}
                  disableFuture
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
          {/* <DateTimeField
            name={incidentDate.name}
            label={incidentDate.label}
            isRequired={incidentDate.required}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={incidentDate.label}
            customClassName="bg-input-blue-small"
            labelClassName="mb-1"
            formGroupClassName="mb-1"
            disablePastDate
            disableFuture
            defaultValue={incident_date ? new Date(getDateTimeSeconds(incident_date)) : ''}
          /> */}
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={serviceCategoryId.name}
            label={serviceCategoryId.label}
            oldValue={getOldData(service_category_id)}
            value={service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id)}
            apiError={(servicecatInfoList && servicecatInfoList.err && serviceCategoryOpen) ? generateErrorMessage(servicecatInfoList) : false}
            open={serviceCategoryOpen}
            onOpen={() => {
              setServiceCategoryOpen(true);
              setServiceCategoryKeyword('');
            }}
            onClose={() => {
              setServiceCategoryOpen(false);
              setServiceCategoryKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            loading={servicecatInfoList && servicecatInfoList.loading && serviceCategoryOpen}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={serviceCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => { onServiceCategoryChange(e.target.value); }}
                variant="standard"
                label={serviceCategoryId.label}
                value={serviceCategoryKeyword}
                required
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {servicecatInfoList && servicecatInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((service_category_id && service_category_id.id) || (serviceCategoryKeyword && serviceCategoryKeyword.length > 0) || (service_category_id && service_category_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onServiceCategoryClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showServiceCatModal}
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
          {isCritical && (
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={ciriticalitys.name}
            label={ciriticalitys.label}
            open={criticalOpen}
            disableClearable
            oldValue={getCriticalLabel(ciriticality)}
            value={ciriticality && ciriticality.label ? ciriticality.label : getCriticalLabel(ciriticality)}
            onOpen={() => {
              setCriticalOpen(true);
            }}
            onClose={() => {
              setCriticalOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.critical}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={ciriticalitys.label}
                required
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
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={Priority.name}
            label={Priority.label}
            open={priorityOpen}
            disableClearable
            oldValue={priority}
            disabled={isPrioriyDisable === 'Yes'}
            value={priority && priority.label ? priority.label : priority}
            onOpen={() => {
              setPriorityOpen(true);
            }}
            onClose={() => {
              setPriorityOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.priorities}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={Priority.label}
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
          {configData && configData.is_non_compliance && (
            <>
              <MuiCheckboxField
                name={resultsInStatutoryNonCompliance.name}
                label={resultsInStatutoryNonCompliance.label}
              />
              <MuiCheckboxField
                name={breakdownDueToAgeing.name}
                label={breakdownDueToAgeing.label}
              />
              <MuiCheckboxField
                name={isServiceImpacted.name}
                label={isServiceImpacted.label}
              />
              <br />
              {is_service_impacted
                ? (
                  <Box>
                    <FormControl sx={{ width: '100%' }}>
                      <Autocomplete
                        multiple
                        filterSelectedOptions
                        name="categoryuser"
                        open={serviceOpen}
                        onOpen={() => {
                          setServiceOpen(true);
                          setServiceKeyword('');
                        }}
                        onClose={() => {
                          setServiceOpen(false);
                          setServiceKeyword('');
                        }}
                        value={services_impacted_ids && services_impacted_ids.length > 0 ? services_impacted_ids : []}
                        defaultValue={serviceImpactId}
                        onChange={(e, options) => handleServiceImpacted(options)}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={serviceImpactOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={serviceImpactedIds.label}
                            required={is_service_impacted}
                            placeholder={services_impacted_ids && services_impacted_ids.length ? '' : 'Search & Select'}
                            onChange={(e) => onServiceImpactKeyWordChange(e.target.value)}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {(serviceImpactInfo && serviceImpactInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {((serviceKeyword && serviceKeyword.length > 0) || (services_impacted_ids && services_impacted_ids.length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onServiceImpactKeywordClear}
                                    >
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                    )}
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={showServiceImpactModal}
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
                  </Box>
                )
                : ''}
            </>
          )}
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '800px' }} />
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
      <Dialog size="xl" fullWidth open={extraModal1}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalSingleStatic
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              headers={headers}
              data={serviceCategoryOptions}
              setFieldValue={onDataChange}
              modalName={modalName}
              oldValues={oldValues}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '800px' }} />
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
              oldServiceData={serviceImpactId && serviceImpactId.length ? serviceImpactId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                variant="contained"
                className="submit-btn"
                onClick={() => { if (fieldName === 'services_impacted_ids') { setLocationIds(checkedRows); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
  );
};

IncidentForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default IncidentForm;
