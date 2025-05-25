/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/system/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { IoCloseOutline } from 'react-icons/io5';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  generateErrorMessage,
  extractOptionsObject,
  getAllowedCompanies,
  getColumnArrayById,
  getColumnArrayByIdWithObj,
} from '../../util/appUtils';
import { returnThemeColor } from '../../themes/theme';

import { calculateRepeatingMonthlyEvents } from './utils/utils';

import { getSheduleList, getOperationsList } from '../ppmService';

import {
  getTeamList,
  getPartners,
} from '../../assets/equipmentService';
import SearchModalTeam from '../../assets/forms/advancedSearchModal';
import AdvancedSearchModal from '../../workPermit/configration/forms/advancedSearchModal';
import customData from './data/customData.json';

import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';

import ViewEvents from './viewEvents';
import WeekStartDatePicker from '../../commonComponents/formFields/weekStartDatePicker';
import WeekEndDatePicker from '../../commonComponents/formFields/weekEndDatePicker';

const appModels = require('../../util/appModels').default;

const AddScheduleConfiguration = ({
  formValues, editId, setFormValues, spaces, equipments, setBulkEvents, bulkEvents,
}) => {
  const [multipleModal, setMultipleModal] = useState(false);
  const [isBulkEvents, setViewBulkEvents] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [performOpen, setPerformOpen] = React.useState(false);
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);

  const [extraModalTeam, setExtraModalTeam] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [placeholderName, setPlaceholder] = useState('');

  const getLastDateOfCurrentYear = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 11, 31); // Month is 0-indexed: 11 = December
  };

  const [extraModal, setExtraModal] = useState(false);

  const [schedulekeyword, setSchedulekeyword] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [intervalOpen, setIntervalOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [assetType, setAssetType] = useState('');

  const addDueDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  // const [deadline, setDeadline] = useState(dayjs(addDueDays(365)));

  const {
    teamsInfo,
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);
  const { taskInfo, scheduleInfo } = useSelector((state) => state.ppm);

  const dispatch = useDispatch();

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (formValues.recurrency) {
      setFormValues((prevValues) => ({
        ...prevValues,
        interval: 1,
        rrule_type: 'monthly',
        weekno: 'First',
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        deadline: dayjs(getLastDateOfCurrentYear()),
      }));
    }
  }, [formValues.recurrency]);

  useEffect(() => {
    if (formValues.performed_by && formValues.performed_by === 'Internal') {
      setVendorKeyword(null);
      setFormValues((prevValues) => ({
        ...prevValues,
        vendor_id: '',
      }));
      setVendorOpen(false);
    }
  }, [formValues.recurrency]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && vendorOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, false, vendorKeyword));
    }
  }, [vendorKeyword, vendorOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const keywordTrim = schedulekeyword ? encodeURIComponent(schedulekeyword.trim()) : '';
      dispatch(getSheduleList(companies, appModels.SCHEDULE, keywordTrim));
    }
  }, [schedulekeyword]);

  function getUniqueValues(arr) {
    return [...new Map(arr.map((item) => [item, item])).values()];
  }

  useEffect(() => {
    (async () => {
      if (editId) {
        if (userInfo && userInfo.data && taskOpen) {
          const equipmentCategory = formValues.equipment_id && formValues.equipment_id.category_id && formValues.equipment_id.category_id.id ? formValues.equipment_id.category_id.id : false;
          const spaceCategory = formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.length ? formValues.space_id.asset_category_id[0] : formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.id ? formValues.space_id.asset_category_id.id : false;
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, formValues.category_type === 'e' ? 'equipment' : 'asset', false, formValues.category_type === 'e' ? equipmentCategory : spaceCategory, 'ppm'));
        }
      }
    })();
  }, [taskKeyword, taskOpen, formValues.category_type, formValues.equipment_id, formValues.space_id]);

  const onTeamChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: value,
    }));
  };

  const setDeadline = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      deadline: value,
    }));
  };

  const setStartsOn = (value) => {
    const weekEnd = value.add(6, 'days').endOf('day');
    setFormValues((prevValues) => ({
      ...prevValues,
      starts_on: value,
      ends_on: weekEnd,
    }));
  };

  const showTaskModal = () => {
    setModelValue(appModels.TASK);
    setColumns(['id', 'name']);
    setFieldName('task_id');
    setAssetType(formValues.category_type === 'e' ? 'equipment' : 'asset');
    setModalName('Maintenance Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTaskChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: value,
    }));
  };

  const onTaskClear = () => {
    setTaskKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: '',
    }));
    setTaskOpen(false);
  };

  const setEndsOn = (value) => {
    if (editId) {
      const weekStart = value.subtract(6, 'days').endOf('day');
      setFormValues((prevValues) => ({
        ...prevValues,
        starts_on: weekStart,
        ends_on: value,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        ends_on: value,
      }));
    }
  };

  const onVendorChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      vendor_id: value,
    }));
  };

  const onIntervalChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      interval: value.value,
    }));
  };

  const onWeekChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      weekno: value.value,
    }));
  };

  const handleCheckChange = (event, field) => {
    const { checked } = event.target;
    if (checked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: true,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: false,
      }));
    }
  };

  const onPerformChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      performed_by: value.label,
    }));
  };

  const onPeriodChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      rrule_type: value.value,
    }));
  };

  const handleScheduleChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      schedule_period_id: value,
    }));
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: '',
    }));
    setTeamOpen(false);
  };

  const onVendorClear = () => {
    setVendorKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      vendor_id: '',
    }));
    setVendorOpen(false);
  };

  const onScheduleClear = () => {
    setSchedulekeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      schedule_period_id: '',
    }));
    setScheduleOpen(false);
  };

  const onTeamSelect = (name, value) => {
    console.log(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: value,
    }));
  };

  function getCategoryId() {
    let equipmentCategory = false;
    let spaceCategory = false;
    if (editId) {
      equipmentCategory = formValues.equipment_id && formValues.equipment_id.category_id && formValues.equipment_id.category_id.id ? formValues.equipment_id.category_id.id : false;
      spaceCategory = formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.length ? formValues.space_id.asset_category_id[0] : formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.id ? formValues.space_id.asset_category_id.id : false;
    } else {
      equipmentCategory = equipments && equipments.length ? getUniqueValues(getColumnArrayByIdWithObj(equipments, 'category_id')) : false;
      spaceCategory = spaces && spaces.length ? getUniqueValues(getColumnArrayById(spaces, 'type')) : false;
    }
    return formValues.category_type === 'e' ? equipmentCategory : spaceCategory;
  }

  const onTaskSelect = (name, value) => {
    if (fieldName === 'task_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        task_id: value,
      }));
    } else if (fieldName === 'vendor_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        vendor_id: value,
      }));
    }
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModalTeam(true);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setColumns(['id', 'name']);
    setFieldName('vendor_id');
    setModalName('Vendors');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  function getNoOfEvents(months, week, endDate, sp, startWeekDate) {
    let res = 0;
    if (formValues.recurrency && months && parseInt(months) > 0 && week && endDate && sp && sp.name && startWeekDate) {
      const repeatUntilDate = new Date(formValues.deadline);

      const events = calculateRepeatingMonthlyEvents(parseInt(months), week, repeatUntilDate, sp.name, startWeekDate);
      setBulkEvents(events);
      res = events.length;
    } else {
      res = 0;
      setBulkEvents([]);
    }
    return res;
  }

  const [yearOpen, setYearOpen] = React.useState(false);

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => ({ year: (currentYear + i).toString() }));
    return years;
  };

  const onYearChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      year: value.year,
    }));
  };

  useMemo(() => {
    getNoOfEvents(formValues.interval, formValues.weekno, formValues.deadline, formValues.schedule_period_id, formValues.starts_on);
  }, [formValues.schedule_period_id, formValues.interval, formValues.weekno, formValues.deadline, formValues.recurrency, formValues.starts_on]);

  const teamOptions = extractOptionsObject(teamsInfo, formValues.maintenance_team_id);
  const scheduleOptions = extractOptionsObject(scheduleInfo, formValues.schedule_period_id);
  const partnerOptions = extractOptionsObject(partnersInfo, formValues.vendor_id);

  const performOptions = [{ label: 'Internal' }, { label: 'External' }];

  const taskOptions = extractOptionsObject(taskInfo, formValues.task_id);

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
        marginBottom: '30px',
      }}
    >
      <FormControl
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          // maxHeight: '600px',
          // overflowY: 'scroll',
          overflow: 'hidden',
          borderTop: '1px solid #0000001f',
        }}
      >
        <Box
          sx={{
            width: '30%',
            display: 'flex',
            gap: '35px',
          }}
        />
        <Box
          sx={{
            width: '70%',
            display: 'flex',
            gap: '35px',
          }}
        >
          <Box
            sx={{
              marginTop: '20px',
              width: '35%',
            }}
          >
            <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Maintenance Info</p>
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              options={getYearsList()}
              name="year"
              label="Maintenance Year"
              isRequired
              open={yearOpen}
              value={formValues.year}
              setValue={onYearChange}
              disableClearable
              readOnly
              onOpen={() => {
                setYearOpen(true);
              }}
              onClose={() => {
                setYearOpen(false);
              }}
              getOptionSelected={(option, value) => option.year === value.year}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.year)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Maintenance Year</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                              )}
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
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              options={performOptions}
              name="performed_by"
              label="Performed By"
              isRequired
              open={performOpen}
              value={formValues.performed_by}
              setValue={onPerformChange}
              onOpen={() => {
                setPerformOpen(true);
              }}
              onClose={() => {
                setPerformOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Performed By</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  className="without-padding"
                  placeholder="Select Performed By"
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
            {formValues.performed_by === 'External' && (
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name="vendor_id"
                label="Vendor"
                open={vendorOpen}
                value={formValues.vendor_id && formValues.vendor_id.name ? formValues.vendor_id.name : ''}
                apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
                setValue={onVendorChange}
                onOpen={() => {
                  setVendorOpen(true);
                  setVendorKeyword('');
                }}
                onClose={() => {
                  setVendorOpen(false);
                  setVendorKeyword('');
                }}
                loading={partnersInfo && partnersInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={partnerOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => setVendorKeyword(e.target.value)}
                    variant="standard"
                    label="Vendor"
                    value={teamKeyword}
                    className={((formValues.vendor_id && formValues.vendor_id.name) || (vendorKeyword && vendorKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select Vendor"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((formValues.vendor_id && formValues.vendor_id.name) || (vendorKeyword && vendorKeyword.length > 0)) && (
                            <Tooltip title="Clear" fontSize="small">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onVendorClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            )}
                            <Tooltip title="Search" fontSize="small">
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showVendorModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
            {editId && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name="task_id"
              label="Maintenance Operation"
              open={taskOpen}
              value={formValues.task_id && formValues.task_id.name ? formValues.task_id.name : ''}
              apiError={(taskInfo && taskInfo.err) ? generateErrorMessage(taskInfo) : false}
              setValue={onTaskChange}
              onOpen={() => {
                setTaskOpen(true);
                setTaskKeyword('');
              }}
              onClose={() => {
                setTaskOpen(false);
                setTaskKeyword('');
              }}
              loading={taskInfo && taskInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={taskOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTaskKeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Maintenance Operation</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                              )}
                  value={taskKeyword}
                  className={((formValues.task_id && formValues.task_id.name) || (taskKeyword && taskKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select Checklists"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.task_id && formValues.task_id.name) || (taskKeyword && taskKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onTaskClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTaskModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            )}
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name="maintenance_team_id"
              label="Maintenance Team"
              open={teamOpen}
              isRequired
              value={formValues.maintenance_team_id && formValues.maintenance_team_id.name ? formValues.maintenance_team_id.name : ''}
              apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
              setValue={onTeamChange}
              onOpen={() => {
                setTeamOpen(true);
                setTeamKeyword('');
              }}
              onClose={() => {
                setTeamOpen(false);
                setTeamKeyword('');
              }}
              loading={teamsInfo && teamsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTeamKeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Maintenance Team</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  value={teamKeyword}
                  className={((formValues.maintenance_team_id && formValues.maintenance_team_id.name) || (teamKeyword && teamKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select Maintenance Team"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.maintenance_team_id && formValues.maintenance_team_id.name) || (teamKeyword && teamKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onTeamClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTeamModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />

            <Box
              sx={{
                marginTop: '15px',
                marginBottom: '10px',
              }}
            >
              <FormControl>
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Photo Required</FormLabel>
                <FormGroup className="pl-2" aria-label="position" row>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.at_start_mro}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'at_start_mro')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
              )}
                    label="At Start"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.at_done_mro}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                   )}
                    label="At Complete"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
            >
              <FormControl>
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">QR Scan Required</FormLabel>
                <FormGroup className="pl-2" aria-label="position" row>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.qr_scan_at_start}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
              )}
                    label="At Start"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.qr_scan_at_done}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                   )}
                    label="At Complete"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
            >
              <FormControl>
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Service Report</FormLabel>
                <FormGroup className="pl-2" aria-label="position" row>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.is_service_report_required}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'is_service_report_required')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
              )}
                    label="Is Required to Complete PPM"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              width: '35%',
            }}
          >
            <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Schedule Info</p>
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name="schedule_period_id"
              label="Schedule Period"
              open={scheduleOpen}
              isRequired
              value={formValues.schedule_period_id && formValues.schedule_period_id.name ? formValues.schedule_period_id.name : ''}
              apiError={(scheduleInfo && scheduleInfo.err) ? generateErrorMessage(scheduleInfo) : false}
              setValue={handleScheduleChange}
              onOpen={() => {
                setScheduleOpen(true);
                setSchedulekeyword('');
              }}
              onClose={() => {
                setScheduleOpen(false);
                setSchedulekeyword('');
              }}
              loading={scheduleInfo && scheduleInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={scheduleOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setSchedulekeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Schedule Period</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  value={schedulekeyword}
                  className={((formValues.schedule_period_id && formValues.schedule_period_id.name) || (schedulekeyword && schedulekeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Select Schedule Period"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {scheduleInfo && scheduleInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.schedule_period_id && formValues.schedule_period_id.name) || (schedulekeyword && schedulekeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onScheduleClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {!editId && (
            <Box
              sx={{
                marginTop: '15px',
                marginBottom: '10px',
              }}
            >
              <FormControl>
                <FormGroup className="pl-2" aria-label="position" row>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.recurrency}
                        size="small"
                        className="p-0"
                        onChange={(e) => handleCheckChange(e, 'recurrency')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
              )}
                    label="Repeats"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            )}
            {!editId && formValues.recurrency && (
              <>
                {formValues.schedule_period_id && formValues.schedule_period_id.name === 'Monthly' && (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    gap: '5px',
                  }}
                >

                  <MuiAutoCompleteStatic
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                      width: '30%',
                    }}
                    options={customData.intervals}
                    name="interval"
                    label="Every"
                    open={intervalOpen}
                    value={formValues.interval ? formValues.interval.toString() : '1'}
                    disableClearable={!formValues.interval}
                    setValue={onIntervalChange}
                    onOpen={() => {
                      setIntervalOpen(true);
                    }}
                    onClose={() => {
                      setIntervalOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Every"
                        className="without-padding"
                        placeholder="Select Every"
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

                  <MuiAutoCompleteStatic
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                      width: '40%',
                    }}
                    options={customData.ruleTypes}
                    name="rrule_type"
                    label="Period"
                    open={periodOpen}
                    value="Month(s)"
                    disabled
                    disableClearable
                    setValue={onPeriodChange}
                    onOpen={() => {
                      setPeriodOpen(true);
                    }}
                    onClose={() => {
                      setPeriodOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Period"
                        className="without-padding"
                        placeholder="Select Period"
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

                  <MuiAutoCompleteStatic
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                      width: '30%',
                    }}
                    options={customData.dayRule}
                    name="weekno"
                    label="Week"
                    open={weekOpen}
                    value={formValues.weekno}
                    disableClearable={!formValues.weekno}
                    setValue={onWeekChange}
                    onOpen={() => {
                      setWeekOpen(true);
                    }}
                    onClose={() => {
                      setWeekOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Week"
                        className="without-padding"
                        placeholder="Select Week"
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
                </Box>
                )}
                <Box sx={{
                  width: '100%',
                  display: 'flex',
                  gap: '20px',
                }}
                >
                  <Box sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '70%',
                  }}
                  >
                    <WeekStartDatePicker startDate={formValues.starts_on} setStartDate={setStartsOn} />
                  </Box>
                  <Box sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '70%',
                  }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                        <DatePicker
                          minDate={dayjs(formValues.starts_on)}
                          maxDate={dayjs(getLastDateOfCurrentYear())}
                          localeText={{ todayButtonLabel: 'Now' }}
                          slotProps={{
                            actionBar: {
                              actions: ['accept'],
                            },
                            popper: {
                              modifiers: [
                                {
                                  name: 'flip',
                                  options: {
                                    fallbackPlacements: ['top'],
                                  },
                                },
                                {
                                  name: 'preventOverflow',
                                  options: {
                                    boundary: 'window',
                                    altAxis: true,
                                  },
                                },
                              ],
                            },
                            textField: {
                              inputRef: (input) => {
                                if (input) {
                                  input.setAttribute('readonly', 'true');
                                  input.onkeydown = (e) => e.preventDefault();
                                }
                              },
                            },
                          }}
                          disablePast
                          name="Repeats Until"
                          label="Repeats Until"
                          format="DD/MM/YYYY"
                          value={formValues.deadline}
                          onChange={(e) => setDeadline(e)}
                          ampm={false}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>

                </Box>
                {bulkEvents && bulkEvents.length > 0 && (
                  <p className="font-family-tab font-tiny mt-3">
                    Note:
                    {bulkEvents.length}
                    {' '}
                    events will be scheduled for the above date range.
                    <span
                      aria-hidden
                      onClick={() => setViewBulkEvents(true)}
                      className="font-family-tab font-tiny ml-2 cursor-pointer text-info"
                    >
                      View
                    </span>
                  </p>
                )}
              </>
            )}
            {(editId || !formValues.recurrency) && (
              <Box sx={{
                width: '100%',
                display: 'flex',
                gap: '20px',
              }}
              >
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <WeekStartDatePicker editId={editId} startDate={formValues.starts_on} endDate={formValues.ends_on} setStartDate={setStartsOn} />
                </Box>
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <WeekEndDatePicker editId={editId} startDate={formValues.starts_on} endDate={formValues.ends_on} setEndDate={setEndsOn} />
                </Box>
              </Box>
            )}
          </Box>

        </Box>
      </FormControl>
      <Dialog size="lg" fullWidth open={extraModalTeam}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalTeam(false); }} />
        <DialogContent>
          <SearchModalTeam
            modelName={modelValue}
            afterReset={() => { setExtraModalTeam(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={onTeamSelect}
          />
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              assetType={assetType}
              categoryId={getCategoryId()}
              company={companyValue}
              setFieldValue={onTaskSelect}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={isBulkEvents}>
        <DialogHeader title="View Events" onClose={() => { setViewBulkEvents(false); }} />
        <ViewEvents setFieldValue={setBulkEvents} events={bulkEvents && bulkEvents.length > 0 ? bulkEvents : []} onClose={() => { setViewBulkEvents(false); }} deadline={formValues.deadline} />
      </Dialog>
    </Box>
  );
};

export default AddScheduleConfiguration;
