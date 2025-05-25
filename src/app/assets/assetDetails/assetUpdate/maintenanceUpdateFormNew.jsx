/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import dayjs from 'dayjs';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import formFields from './formFields.json';
import { getOperatingHours, getTeamList } from '../../equipmentService';
import {
  generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import { getCriticalLabel } from '../../utils/utils';
import assetActionData from '../../data/assetsActions.json';
import AdvancedSearchModal from './advancedSearchModal';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiDatePicker from '../../../commonComponents/formFields/muiDatePicker';
import { AddThemeColor } from '../../../themes/theme';
import {
  Dialog, DialogContent, DialogContentText,
  TextField, Typography
} from '@mui/material';
import { Box } from "@mui/system";

const appModels = require('../../../util/appModels').default;

const MaintenanceUpdateForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    validateField,
    setFieldTouched,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    resource_calendar_id, criticality, maintained_by_id, monitored_by_id, managed_by_id, start_date
  } = formValues;
  const [hoursOpen, setHoursOpen] = useState(false);
  const [hoursKeyword, setHoursKeyword] = useState('');
  const [criticalOpen, setCriticalOpen] = useState(false);
  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { hoursInfo, teamsInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hoursOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, hoursKeyword));
      }
    })();
  }, [userInfo, hoursKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l2Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l2Keyword));
      }
    })();
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l3Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l3Keyword));
      }
    })();
  }, [userInfo, l3Keyword, l3Open]);

  const onHourKeywordChange = (event) => {
    setHoursKeyword(event.target.value);
  };

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const onHoursClear = () => {
    setHoursKeyword(null);
    setFieldValue('resource_calendar_id', '');
    setHoursOpen(false);
  };

  const showHoursModal = () => {
    setModelValue(appModels.RESOURCECALENDAR);
    setColumns(['id', 'name']);
    setFieldName('resource_calendar_id');
    setModalName('Working Hours List');
    setPlaceholder('Working Hours');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('monitored_by_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('monitored_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('managed_by_id', '');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('managed_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('maintained_by_id', '');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintained_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  let l1Options = [];
  let l2Options = [];
  let l3Options = [];

  if (teamsInfo && teamsInfo.loading) {
    if (l1Open) {
      l1Options = [{ name: 'Loading..' }];
    }
    if (l2Open) {
      l2Options = [{ name: 'Loading..' }];
    }
    if (l3Open) {
      l3Options = [{ name: 'Loading..' }];
    }
  }
  if (monitored_by_id && monitored_by_id.length && monitored_by_id.length > 0) {
    const oldId = [{ id: monitored_by_id[0], name: monitored_by_id[1] }];
    const newArr = [...l1Options, ...oldId];
    l1Options = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (managed_by_id && managed_by_id.length && managed_by_id.length > 0) {
    const oldId = [{ id: managed_by_id[0], name: managed_by_id[1] }];
    const newArr = [...l2Options, ...oldId];
    l2Options = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (maintained_by_id && maintained_by_id.length && maintained_by_id.length > 0) {
    const oldId = [{ id: maintained_by_id[0], name: maintained_by_id[1] }];
    const newArr = [...l3Options, ...oldId];
    l3Options = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (teamsInfo && teamsInfo.data) {
    if (l1Open) {
      const arr = [...l1Options, ...teamsInfo.data];
      l1Options = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (l2Open) {
      const arr = [...l2Options, ...teamsInfo.data];
      l2Options = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (l3Open) {
      const arr = [...l3Options, ...teamsInfo.data];
      l3Options = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  let hourOptions = [];

  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }
  if (resource_calendar_id && resource_calendar_id.length && resource_calendar_id.length > 0) {
    const oldHour = [{ id: resource_calendar_id[0], name: resource_calendar_id[1] }];
    const newArr = [...hourOptions, ...oldHour];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (hoursInfo && hoursInfo.data) {
    const arr = [...hourOptions, ...hoursInfo.data];
    hourOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldHourId = resource_calendar_id && resource_calendar_id.length && resource_calendar_id.length > 0 ? resource_calendar_id[1] : '';
  const oldL1Id = monitored_by_id && monitored_by_id.length && monitored_by_id.length > 0 ? monitored_by_id[1] : '';
  const oldL2Id = managed_by_id && managed_by_id.length && managed_by_id.length > 0 ? managed_by_id[1] : '';
  const oldL3Id = maintained_by_id && maintained_by_id.length && maintained_by_id.length > 0 ? maintained_by_id[1] : '';
  const oldCriticality = criticality || '';

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
            marginBottom: '20px',
          })}
        >
          Maintenance
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          {formFields && formFields.fields && formFields.fields.map((fields) => (
            <React.Fragment key={fields.id}>
              {(fields.type !== 'array' && fields.name !== 'start_date') && (
                <MuiTextField
                  sx={{
                    width: '30%',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  type={fields.type}
                  readOnly={fields.readonly}
                />
              )}
                  {fields.name === 'start_date' && (
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      readOnly={fields.readonly}
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                      validateField={validateField}
                      value={start_date ? dayjs(moment.utc(start_date).local().format('YYYY-MM-DD')) : null}
                    />
                  )}
              {(fields.type === 'array') && (fields.name === 'criticality') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getCriticalLabel(oldCriticality)}
                  value={criticality && criticality.label ? criticality.label : getCriticalLabel(oldCriticality)}
                  open={criticalOpen}
                  size="small"
                  onOpen={() => {
                    setCriticalOpen(true);
                  }}
                  onClose={() => {
                    setCriticalOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={assetActionData.criticalities}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={fields.label}
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
              )}
              {(fields.type === 'array') && (fields.name === 'monitored_by_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldL1Id}
                  value={monitored_by_id && monitored_by_id.name ? monitored_by_id.name : oldL1Id}
                  open={l1Open}
                  size="small"
                  onOpen={() => {
                    setL1Open(true);
                    setL1Keyword('');
                  }}
                  onClose={() => {
                    setL1Open(false);
                    setL1Keyword('');
                  }}
                  apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={l1Options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onL1KeywordChange}
                      variant="standard"
                      label={fields.label}
                      className={((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onL1Clear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showL1Modal}
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
              )}
              {(fields.type === 'array') && (fields.name === 'managed_by_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldL2Id}
                  value={managed_by_id && managed_by_id.name ? managed_by_id.name : oldL2Id}
                  open={l2Open}
                  size="small"
                  onOpen={() => {
                    setL2Open(true);
                    setL2Keyword('');
                  }}
                  onClose={() => {
                    setL2Open(false);
                    setL2Keyword('');
                  }}
                  apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={l2Options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onL2KeywordChange}
                      variant="standard"
                      label={fields.label}
                      className={((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {teamsInfo && teamsInfo.loading && l2Open ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onL2Clear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showL2Modal}
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
              )}
              {(fields.type === 'array') && (fields.name === 'maintained_by_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldL3Id}
                  value={maintained_by_id && maintained_by_id.name ? maintained_by_id.name : oldL3Id}
                  open={l3Open}
                  size="small"
                  onOpen={() => {
                    setL3Open(true);
                    setL3Keyword('');
                  }}
                  onClose={() => {
                    setL3Open(false);
                    setL3Keyword('');
                  }}
                  apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={l3Options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onL3KeywordChange}
                      variant="standard"
                      label={fields.label}
                      placeholder="Search & Select"
                      className={((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {teamsInfo && teamsInfo.loading && l3Open ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onL3Clear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showL3Modal}
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
              )}
              {(fields.type === 'array') && (fields.name === 'resource_calendar_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldHourId}
                  value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : oldHourId}
                  open={hoursOpen}
                  size="small"
                  onOpen={() => {
                    setHoursOpen(true);
                    setHoursKeyword('');
                  }}
                  onClose={() => {
                    setHoursOpen(false);
                    setHoursKeyword('');
                  }}
                  loading={hoursInfo && hoursInfo.loading}
                  apiError={(hoursInfo && hoursInfo.err) ? generateErrorMessage(hoursInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={hourOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onHourKeywordChange}
                      variant="standard"
                      label={fields.label}
                      className={((resource_calendar_id && resource_calendar_id.id) || (hoursKeyword && hoursKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((resource_calendar_id && resource_calendar_id.id) || (hoursKeyword && hoursKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onHoursClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showHoursModal}
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
              )}
            </React.Fragment >
          ))}
        </Box>
      </Box>
      <Dialog maxWidth="md" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

MaintenanceUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default MaintenanceUpdateForm;
