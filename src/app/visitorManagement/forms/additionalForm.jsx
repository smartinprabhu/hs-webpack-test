/* eslint-disable radix */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, FormControl, RadioGroup, TextField, Typography, Grid,
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  CheckboxField,
} from '@shared/formFields';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSpacePaths,
  getVisitPurposes,
} from '../../assets/equipmentService';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiFormLabel from '../../commonComponents/formFields/muiFormLabel';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../themes/theme';
import {
  generateErrorMessage,
  getAllowedCompanies,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import checkoutFormModel from '../formModel/checkoutFormModel';
import {
  getEntryStatusLabel,
} from '../utils/utils';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});
const { formField } = checkoutFormModel;

const AdditionalForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    errorMessage,
    isShow,
    values,
    formField: {
      plannedIn,
      plannedOut,
      spaceId,
      actualIn,
      actualOut,
      purpose,
      entryStatus,
      allowMultipleEntry,
      origin,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    planned_in, planned_out, actual_in, actual_out, space_id, entry_status, origin_status,
    purpose_id,
  } = formValues;

  const classes = useStyles();

  const [entryOpen, setEntryOpen] = useState(false);
  const [originOpen, setOriginOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [value, setValue] = useState(planned_in || new Date());
  const [valuess, setValues] = useState(planned_out || new Date());
  const [columns, setColumns] = useState(['id', 'space_name', 'path_name']);

  const [actualinvalue, setActualInValue] = useState(actual_in || new Date());
  const [actualoutvalue, setActualOutValue] = useState(actual_out || new Date());

  const [singletype, setSingletype] = useState('checked');
  const [multipletype, setMultipletype] = useState('');

  const [purposeOpen, setPurposeOpen] = useState(false);
  const [purposeKeyword, setPurposeKeyword] = useState('');

  const [dayType, setDayType] = useState('single');
  const { userInfo } = useSelector((state) => state.user);
  const defaultPlannedIn = planned_in ? dayjs(moment.utc(planned_in).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment.utc().local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
  const defaultPlannedOut = planned_out ? dayjs(moment.utc(planned_out).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  const defaultActualIn = actual_in ? dayjs(moment.utc(actual_in).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment.utc().local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
  const defaultActualOut = actual_out ? dayjs(moment.utc(actual_out).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment.utc().local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));

  const [plannedInDate, setPlannedInDate] = useState(defaultPlannedIn);
  const [plannedOutDate, setPlannedOutDate] = useState(defaultPlannedOut);
  const [actualInDate, setActualInDate] = useState(defaultActualIn);
  const [actualOutDate, setActualOutDate] = useState(defaultActualOut);

  const {
    visitorConfiguration,
  } = useSelector((state) => state.visitorManagement);

  const companies = getAllowedCompanies(userInfo);
  const {
    spacePathList, visitPurposes,
  } = useSelector((state) => state.equipment);

  const requiredCondition = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length ? visitorConfiguration.data[0] : false;

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpacePaths(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    if (!editId) {
      setFieldValue('planned_in', new Date());
    }
  }, [isShow]);

  useEffect(() => {
    if (!editId) {
      if (dayType === 'single') {
        setFieldValue('is_frequent_visitor', false);
        setFieldValue('allow_multiple_entry', false);
        if (requiredCondition.close_visit_request_by) {
          const dateAct1 = (planned_in || new Date()).toString();
          const hours = requiredCondition.close_visit_request_by;
          const splitHours = hours.toString().split('.');
          const plannedOutTime = `${hours >= 10 ? splitHours[0] : `0${splitHours[0]}`}:00:00`;
          const splitDate = dateAct1.split(' ');
          splitDate[4] = plannedOutTime;
          const finalDateAct = splitDate;
          let date = '';
          finalDateAct.map((obj) => {
            date = `${date + obj} `;
          });
          const configEndDate = `${date}`;
          if (planned_in) {
            setPlannedOutDate(dayjs(configEndDate));
            setFieldValue('planned_out', moment(configEndDate));
          } else {
            setPlannedOutDate(null);
            setFieldValue('planned_out', '');
          }
        }
      } else if (dayType === 'multiple') {
        setFieldValue('is_frequent_visitor', true);
        setFieldValue('allow_multiple_entry', true);
        if (requiredCondition.close_visit_request_by) {
          const dateAct1 = requiredCondition.max_days_allowed_for_a_frequent_visit
            ? moment(planned_in || new Date()).add(requiredCondition.max_days_allowed_for_a_frequent_visit + 1, 'days').format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
          const hours = requiredCondition.close_visit_request_by;
          const splitHours = hours.toString().split('.');
          const plannedOutTime = `${hours >= 10 ? splitHours[0] : `0${splitHours[0]}`}:00:00`;
          const splitDate = dateAct1.split(' ');
          splitDate[4] = plannedOutTime;
          const finalDateAct = splitDate;
          let date = '';
          finalDateAct.map((obj) => {
            date = `${date + obj} `;
          });
          const configEndDate = `${date}`;
          if (planned_in) {
            setPlannedOutDate(dayjs(configEndDate));
            setFieldValue('planned_out', moment(configEndDate));
          } else {
            setPlannedOutDate('');
            setFieldValue('planned_out', '');
          }
        }
      }
    }
  }, [dayType, isShow, planned_in]);

  useEffect(() => {
    (async () => {
      if (purposeOpen) {
        await dispatch(getVisitPurposes(companies, appModels.VISITPURPOSE, purposeKeyword));
      }
    })();
  }, [purposeKeyword, purposeOpen]);

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceKeywordClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setSpaceOpen(false);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space');
    setColumns(['id', 'space_name', 'path_name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onPurposeKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onPurposeKeywordClear = () => {
    setSpaceKeyword(null);
    setFieldValue('purpose_id', '');
    setSpaceOpen(false);
  };

  const showPurposeModal = () => {
    setModelValue(appModels.VISITPURPOSE);
    setFieldName('purpose_id');
    setModalName('Purpose');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  let spaceOptions = [];

  if (spacePathList && spacePathList.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (space_id && space_id.length && space_id.length > 0) {
    const oldId = [{ id: space_id[0], path_name: space_id[1] }];
    const newArr = [...spaceOptions, ...oldId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (spacePathList && spacePathList.data) {
    const arr = [...spaceOptions, ...spacePathList.data];
    spaceOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (spacePathList && spacePathList.err) {
    spaceOptions = [];
  }

  // const purposeOptions = extractOptionsObject(visitPurposes, purpose_id);

  useEffect(() => {
    if (requiredCondition) {
      setFieldValue('has_purpose', requiredCondition.has_purpose);
    }
  }, [requiredCondition]);

  const handleTimeChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      // setDayType(value);
      const date = new Date();
      if (value == 'multiple') { setMultipletype('checked'); setSingletype(''); setValues(date.setDate(date.getDate() + 1)); } else { setMultipletype(''); setSingletype('checked'); setValues(new Date()); }
      setFieldValue('planned_in', new Date());
    }
  };

  function disableEndDate() {
    let res = moment(planned_in).add(1, 'day').format('YYYY-MM-DD');
    if (dayType === 'single') {
      res = moment(planned_in).add(1, 'day').format('YYYY-MM-DD');
    } else if (dayType === 'multiple' && requiredCondition && requiredCondition.max_days_allowed_for_a_frequent_visit) {
      res = moment(planned_in).add(requiredCondition.max_days_allowed_for_a_frequent_visit + 2, 'days').format('YYYY-MM-DD');
    }
    return res;
  }

  const handlePlannedIn = (date) => {
    setPlannedInDate(date);
    setPlannedOutDate(null);
    setFieldValue('planned_out', 'null');
    setFieldValue('planned_in', date);
  };
  const handlePlannedOut = (date) => {
    setPlannedOutDate(date);
    setFieldValue('planned_out', date);
  };
  const handleActualIn = (date) => {
    setActualInDate(date);
    setFieldValue('actual_in', date);
  };
  const handleActualOut = (date) => {
    setActualOutDate(date);
    setFieldValue('actual_out', date);
  };

  return (
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
        Visit Info
      </Typography>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>

        {!editId && requiredCondition.allow_frequent_visits && (
          <>

            <Grid item xs={12} sm={4} md={4}>

              <RadioGroup
                row
                aria-labelledby="demo-form-control-label-placement"
                name="position"
                defaultValue="top"
              >
                <MuiFormLabel
                  name="single"
                  checkedvalue="One Day"
                  id="One Day"
                  onClick={handleTimeChange}
                  label="One Day"
                  value="single"
                  checked={singletype ? true : ''}
                />
                <MuiFormLabel
                  name="single"
                  checkedvalue="Multiple Days"
                  id="Multiple Days"
                  onClick={handleTimeChange}
                  label="Multiple Days"
                  value="multiple"
                  checked={multipletype ? true : ''}
                />
              </RadioGroup>
            </Grid>
            {/* <FormControl
          sx={{
            width: '30%',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
          >
          <Radio.Group value={dayType} className="mt-2 custom-radio-group" onChange={handleTimeChange}>
            <Radio.Button value="single">One Day</Radio.Button>
            <Radio.Button value="multiple">Multiple Days</Radio.Button>
          </Radio.Group>
          </FormControl> */}
          </>

        )}
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            sx={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  sx={{ width: '100%' }}
                  slotProps={{ textField: { variant: 'standard', required: true, error: false } }}
                  name={plannedIn.name}
                  label={plannedIn.label}
                  value={plannedInDate}
                  onChange={handlePlannedIn}
                  ampm={false}
                  disablePast
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
        </Grid>
        {/* <FormControl
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={plannedIn.name}
                label={plannedIn.label}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={planned_in ? planned_in : ''}
                ampm={false}
                format="dd/MM/yyyy HH:mm:ss"
                // value={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedIn.label}
                disablePast={!editId}
              />
            </MuiPickersUtilsProvider>
          </FormControl> */}
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            sx={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  sx={{ width: '100%' }}
                  slotProps={{
                    textField: {
                      variant: 'standard',
                      error: errorMessage,
                      helperText: errorMessage,
                      actionBar: {
                        actions: ['clear'],
                      },
                    },
                  }}
                  name={plannedOut.name}
                  label={plannedOut.label}
                  value={plannedOutDate}
                  onChange={handlePlannedOut}
                  ampm={false}
                  disablePast
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
        </Grid>
        {/* <FormControl
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={plannedOut.name}
                label={plannedOut.label}
                value={valuess}
                onChange={(newValue) => setValues(newValue)}
                //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={planned_out ? planned_out : ''}
                ampm={false}
                format="dd/MM/yyyy HH:mm:ss"
                //value={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedOut.label}
                disablePast={!editId}
                startDate={planned_out && new Date(planned_out)}
                maxDate={multipletype ? '' : moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}

              />
            </MuiPickersUtilsProvider>
          </FormControl> */}

        {/* <Col xs={12} sm={12} md={12} lg={12}>
          <DateTimeField
            name={plannedIn.name}
            label={plannedIn.label}
            isRequired={plannedIn.required}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={plannedIn.label}
            disablePastDate={!editId}
            className="w-100"
            formGroupClassName="m-1"
            labelClassName="ml-0 mb-1 mt-1 mr-1"
            defaultValue={planned_in ? new Date(getDateTimeSeconds(planned_in)) : ''}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <DateTimeField
            name={plannedOut.name}
            label={plannedOut.label}
            isRequired={plannedOut.required}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={plannedOut.label}
            disablePastDate={!editId}
            startDate={planned_in && new Date(planned_in)}
            endDate={planned_in && disableEndDate()}
            className="w-100"
            formGroupClassName="m-1"
            labelClassName="ml-0 mb-1 mt-1 mr-1"
            defaultValue={planned_out ? new Date(getDateTimeSeconds(planned_out)) : ''}
          />
        </Col> */}
        {editId && (
        <Grid item xs={12} sm={4} md={4}>
          <MuiAutoComplete
            sx={{
              // width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            options={spaceOptions}
            required={requiredCondition && requiredCondition.has_visitor_type === 'Required'}
            name={spaceId.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            open={spaceOpen}
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            getOptionSelected={(option, value) => option.path_name === value.path_name}
            oldValue={getOldData(space_id)}
            value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
            apiError={(spacePathList && spacePathList.err) ? generateErrorMessage(spacePathList) : false}
            loading={spacePathList && spacePathList.loading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                onChange={onSpaceKeywordChange}
                label={spaceId.label}
                className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacePathList && spacePathList.loading && spaceOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSpaceKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSpaceModal}
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

          {/*  <Col md="12" sm="12" lg="12" xs="12">
          <FormikAutocomplete
            name={spaceId.name}
            label={spaceId.label}
            formGroupClassName="m-1"
            open={spaceOpen}
            size="small"
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            oldValue={getOldData(space_id)}
            value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
            apiError={(spacePathList && spacePathList.err) ? generateErrorMessage(spacePathList) : false}
            loading={spacePathList && spacePathList.loading}
            getOptionSelected={(option, value) => option.path_name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={spaceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                onChange={onSpaceKeywordChange}
                className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spacePathList && spacePathList.loading && spaceOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSpaceKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSpaceModal}
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
        </Col> */}
        </Grid>
        )}
        {requiredCondition && requiredCondition.has_purpose !== 'None' && (
          <Grid item xs={12} sm={4} md={4}>
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={purpose.name}
              label={purpose.label}
              multiline
              value={values[formField.purpose.name]}
              required={requiredCondition && requiredCondition.has_purpose === 'Required'}
              maxRows="4"
            />
          </Grid>
        )}
        { /* requiredCondition && requiredCondition.has_purpose !== 'None' && (
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={purpose.name}
              label={purpose.label}
              formGroupClassName="m-1"
              open={purposeOpen}
              isRequired={requiredCondition && requiredCondition.has_purpose === 'Required'}
              size="small"
              onOpen={() => {
                setPurposeOpen(true);
                setPurposeKeyword('');
              }}
              onClose={() => {
                setPurposeOpen(false);
                setPurposeKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              oldValue={getOldData(purpose_id)}
              value={purpose_id && purpose_id.name ? purpose_id.name : getOldData(purpose_id)}
              apiError={(visitPurposes && visitPurposes.err) ? generateErrorMessage(visitPurposes) : false}
              getOptionDisabled={() => visitPurposes && visitPurposes.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={purposeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={onPurposeKeywordChange}
                  className={((getOldData(purpose_id)) || (purpose_id && purpose_id.id) || (purposeKeyword && purposeKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {visitPurposes && visitPurposes.loading && purposeOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(purpose_id)) || (purpose_id && purpose_id.id) || (purposeKeyword && purposeKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onPurposeKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showPurposeModal}
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
                ) */ }
      </Grid>
      {editId && (
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
          Status Info
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
          <Grid item xs={12} sm={4} md={4}>
            <FormControl
              sx={{
                // width: '30%',
                width: '100%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    sx={{ width: '100%' }}
                    slotProps={{ textField: { variant: 'standard', error: false } }}
                    name={actualIn.name}
                    label={actualIn.label}
                    value={actualInDate}
                    onChange={handleActualIn}
                    ampm={false}
                    disablePast={!editId}
                    readOnly={editId}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {/* <FormControl
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  variant="standard"
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      name={actualIn.name}
                      label={actualIn.label}
                      isRequired={actualIn.required}
                      value={actualinvalue}
                      onChange={(newValue) => setActualInValue(newValue)}
                      //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                      defaultValue={actual_in ? actual_in : ''}
                      ampm={false}
                      format="dd/MM/yyyy HH:mm:ss"
                      setFieldTouched={setFieldTouched}
                      placeholder={actualIn.label}
                      disablePastDate={!editId}
                      readOnly={editId}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl> */}

          {/*
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={actualIn.name}
              label={actualIn.label}
              isRequired={actualIn.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={actualIn.label}
              disablePastDate={!editId}
              className="w-100"
              formGroupClassName="m-1"
              labelClassName="ml-0 mb-1 mt-1 mr-1"
              readOnly={editId}
              defaultValue={actual_in ? new Date(getDateTimeSeconds(actual_in)) : ''}
            />
          </Col> */}
          <Grid item xs={12} sm={4} md={4}>
            <FormControl
              sx={{
                // width: '30%',
                width: '100%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    sx={{ width: '100%' }}
                    slotProps={{ textField: { variant: 'standard', error: false } }}
                    name={actualOut.name}
                    label={actualOut.label}
                    value={actualOutDate}
                    onChange={handleActualOut}
                    ampm={false}
                    disablePast={!editId}
                    readOnly={editId}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Grid>
          {/* <FormControl
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  variant="standard"
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      name={actualOut.name}
                      label={actualOut.label}
                      isRequired={actualOut.required}
                      value={actualoutvalue}
                      onChange={(newValue) => setActualOutValue(newValue)}
                      //maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                      defaultValue={actual_out ? actual_out : ''}
                      ampm={false}
                      format="dd/MM/yyyy HH:mm:ss"
                      setFieldTouched={setFieldTouched}
                      placeholder={actualOut.label}
                      disablePastDate={!editId}
                      readOnly={editId}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl> */}

          {/*   <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={actualOut.name}
              label={actualOut.label}
              isRequired={actualOut.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={actualOut.label}
              readOnly={editId}
              disablePastDate={!editId}
              className="w-100"
              formGroupClassName="m-1"
              labelClassName="ml-0 mb-1 mt-1 mr-1"
              defaultValue={actual_out ? new Date(getDateTimeSeconds(actual_out)) : ''}
            />
          </Col> */}
          <Grid item xs={12} sm={4} md={4}>
            <MuiAutoComplete
              sx={{
                // width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              options={customData.entryStates}
              name={entryStatus.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              open={entryOpen}
              onOpen={() => {
                setEntryOpen(true);
              }}
              onClose={() => {
                setEntryOpen(false);
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              oldvalue={getEntryStatusLabel(entry_status)}
              value={entry_status && entry_status.label ? entry_status.label : getEntryStatusLabel(entry_status)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={entryStatus.label}
                  variant="standard"
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
          </Grid>
          {/* <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={entryStatus.name}
              label={entryStatus.label}
              formGroupClassName="m-1"
              open={entryOpen}
              size="small"
              onOpen={() => {
                setEntryOpen(true);
              }}
              onClose={() => {
                setEntryOpen(false);
              }}
              oldvalue={getEntryStatusLabel(entry_status)}
              value={entry_status && entry_status.label ? entry_status.label : getEntryStatusLabel(entry_status)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.entryStates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
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
          </Col> */}
          { /* <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={origin.name}
              label={origin.label}
              formGroupClassName="mb-1 mt-3 mr-1 ml-1"
              open={originOpen}
              size="small"
              onOpen={() => {
                setOriginOpen(true);
              }}
              onClose={() => {
                setOriginOpen(false);
              }}
              oldvalue={getOriginStatusLabel(origin_status)}
              value={origin_status && origin_status.label ? origin_status.label : getOriginStatusLabel(origin_status)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.originStates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
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
          <Col xs={12} sm={12} md={12} lg={12} className="ml-2px pl-3">
            <h6 className="mt-4">Allow Multiple Entry</h6>
            <div className="ml-2"> */ }
          <Grid item xs={12} sm={4} md={4}>
            <FormControl
              sx={{
                // width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
              Allow Multiple Entry

              <CheckboxField
                name={allowMultipleEntry.name}
                label={allowMultipleEntry.label}
              />
            </FormControl>
            {/* </div>
          </Col>
         */}
          </Grid>
        </Grid>
      </Box>

      )}
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
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
    </Box>
  );
});

AdditionalForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalForm;
