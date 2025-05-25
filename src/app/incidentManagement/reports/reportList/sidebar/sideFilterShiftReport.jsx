/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormFeedback, 
  Label,
} from 'reactstrap';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import {
  Autocomplete,
  Box,
  Checkbox,
  Drawer,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import { shiftHandoverReportFilters } from '../../../../assets/equipmentService'
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists, getDatePickerFormat, getDateAndTimeForDifferentTimeZones,
} from '../../../../util/appUtils';
import {
  resetIncidentReport, getIncidentReport, getTeamList, getReportedByList,
  getAcceptedByList,
} from '../../../../assets/equipmentService';
import SearchModalSingle from './searchModalSingle';
import assetActions from '../../../../assets/data/assetsActions.json';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const SideFilterIncident = ({ filterOpen, setFilterOpen, resetFilters, setResetFilters }) => {
  const dispatch = useDispatch();
  const [teamCollapse, setTeamCollapse] = useState(true);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [teamValue, setTeamValue] = useState('');

  const [reportedByCollapse, setReportedByCollapse] = useState(true);
  const [reportedByOpen, setReportedByOpen] = useState(false);
  const [reportedByKeyword, setReportedByKeyword] = useState('');
  const [reportedByOptions, setReportedByOptions] = useState([]);
  const [reportedByValue, setReportedByValue] = useState('');

  const [acceptedByCollapse, setAcceptedByCollapse] = useState(true);
  const [acceptedByOpen, setAcceptedByOpen] = useState(false);
  const [acceptedByKeyword, setAcceptedByKeyword] = useState('');
  const [acceptedByOptions, setAcceptedByOptions] = useState([]);
  const [acceptedByValue, setAcceptedByValue] = useState('');

  const [reportedOnCollapse, setReportedOnCollapse] = useState(true);
  const [reportedOnDate, changeReportedOn] = useState(false);
  const [reportedOnValue, setReportedOnValue] = useState([]);

  const [acceptedOnCollapse, setAcceptedOnCollapse] = useState(true);
  const [acceptedOnDate, changeAcceptedOn] = useState(false);
  const [acceptedOnValue, setAcceptedOnValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);

  const [statusCollapse, setStatusCollapse] = useState(true);
  const [validStatus, setValidStatus] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const [customFilters, setCustomFilters] = useState([]);

  // const { spaceInfo } = useSelector((state) => state.ticket);

  const {
    incidentReportInfo,
    teamsInfo,
    reportedByInfo,
    acceptedByInfo,
    shiftHandoverFilters
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    changeReportedOn([null, null]);
    changeAcceptedOn([null, null]);
    setTeamValue([]);
    setAcceptedByValue([]);
    setReportedByValue([])
    setResetFilters(false)
    dispatch(shiftHandoverReportFilters([]))
  }, [])


  useEffect(() => {
    if (teamsInfo && teamsInfo.data && teamsInfo.data.length && teamOpen) {
      setTeamOptions(getArrayFromValuesById(teamsInfo.data, isAssociativeArray(teamValue || []), 'id'));
    } else if (teamsInfo && teamsInfo.loading) {
      setTeamOptions([{ name: 'Loading...' }]);
    } else {
      setTeamOptions([]);
    }
  }, [teamsInfo, teamOpen]);

  useEffect(() => {
    if (reportedByInfo && reportedByInfo.data && reportedByInfo.data.length && reportedByOpen) {
      setReportedByOptions(getArrayFromValuesById(reportedByInfo.data, isAssociativeArray(teamValue || []), 'id'));
    } else if (reportedByInfo && reportedByInfo.loading) {
      setReportedByOptions([{ name: 'Loading...' }]);
    } else {
      setReportedByOptions([]);
    }
  }, [reportedByInfo, reportedByOpen]);

  useEffect(() => {
    if (acceptedByInfo && acceptedByInfo.data && acceptedByInfo.data.length && acceptedByOpen) {
      setAcceptedByOptions(getArrayFromValuesById(acceptedByInfo.data, isAssociativeArray(teamValue || []), 'id'));
    } else if (acceptedByInfo && acceptedByInfo.loading) {
      setAcceptedByOptions([{ name: 'Loading...' }]);
    } else {
      setAcceptedByOptions([]);
    }
  }, [acceptedByInfo, acceptedByOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && teamOpen) {
      const keywordTrim = teamKeyword ? encodeURIComponent(teamKeyword.trim()) : '';
      dispatch(getTeamList(companies, appModels.TEAM, keywordTrim));
    }
  }, [userInfo, teamKeyword, teamOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && reportedByOpen) {
      const keywordTrim = reportedByKeyword ? encodeURIComponent(reportedByKeyword.trim()) : '';
      dispatch(getReportedByList(companies, appModels.EMPLOYEE, keywordTrim));
    }
  }, [userInfo, reportedByKeyword, reportedByOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && acceptedByOpen) {
      const keywordTrim = acceptedByKeyword ? encodeURIComponent(acceptedByKeyword.trim()) : '';
      dispatch(getAcceptedByList(companies, appModels.EMPLOYEE, keywordTrim));
    }
  }, [userInfo, acceptedByKeyword, acceptedByOpen]);

  const getFindData = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field)
    return result ? result : ''
  }

  const getFindDateRange = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.key === field)
    return result ? result.value : [null, null]
  }

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      const teamId = getFindData('By Team') && getFindData('By Team').id ? getFindData('By Team').id : '';
      const reportedId = getFindData('By Reported') && getFindData('By Reported').id ? getFindData('By Reported').id : '';
      const acceptedId = getFindData('By Accepted') && getFindData('By Accepted').id ? getFindData('By Accepted').id : '';

      let reportedStart = '';
      let reportedEnd = '';
      let dateRangeObj = [];

      let acceptedStart = '';
      let acceptedEnd = '';
      let dateRangeAccObj = [];

      const statusValue = getFindData('By Status') && getFindData('By Status').value
      if (getFindDateRange('reported_on') && getFindDateRange('reported_on')[0] && getFindDateRange('reported_on')[0] !== null) {
        dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, getFindDateRange('reported_on')[0].$d, getFindDateRange('reported_on')[1].$d);
        reportedStart = dateRangeObj[0];
        reportedEnd = dateRangeObj[1];
      }
      if (getFindDateRange('accepted_on') && getFindDateRange('accepted_on')[0] && getFindDateRange('accepted_on')[0] !== null) {
        dateRangeAccObj = getDateAndTimeForDifferentTimeZones(userInfo, getFindDateRange('accepted_on')[0].$d, getFindDateRange('accepted_on')[1].$d);
        acceptedStart = dateRangeAccObj[0];
        acceptedEnd = dateRangeAccObj[1];
      }
      dispatch(getIncidentReport(companies, appModels.MROSHIFT, teamId, reportedId, acceptedId, reportedStart, reportedEnd, acceptedStart, acceptedEnd, statusValue));
    }
  }, [userInfo, shiftHandoverFilters]);

  useEffect(() => {
    if (shiftHandoverFilters && shiftHandoverFilters.customFilters) {
      setCustomFilters(shiftHandoverFilters.customFilters);
    }
  }, [shiftHandoverFilters]);

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setTeamValue(data);
    if (data.name) {
      const filters = [{
        key: 'maintenance_team_id', value: data.name, label: 'By Team', type: 'text', id: data.id, name: data.name, title: 'By Team'
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'maintenance_team_id');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onStateChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setReportedByValue(data);
    if (data.name) {
      const filters = [{
        key: 'reported_by', value: data.name, label: 'By Reported', type: 'text', id: data.id, name: data.name, title: 'By Reported'
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'reported_by');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onAcceptedChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    if (data.name) {
      const filters = [{
        key: 'accepted_by', value: data.name, label: 'By Accepted', type: 'text', id: data.id, name: data.name, title: 'By Accepted'
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'accepted_by');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onTeamClear = () => {
    setTeamKeyword('');
    setTeamValue('');
    setTeamOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'maintenance_team_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const onStateClear = () => {
    setReportedByKeyword('');
    setReportedByOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'reported_by');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const onAcceptedClear = () => {
    setAcceptedByKeyword('');
    setAcceptedByValue('');
    setAcceptedByOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'accepted_by');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Team');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const showReportedBYModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('reported_by');
    setModalName('Reported By');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const showAcceptedBYModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('accepted_by');
    setModalName('Accepted By');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (resetFilters) {
      setTeamValue([]);
      setAcceptedByValue([]);
      setReportedByValue([])
      setResetFilters(false)
      dispatch(shiftHandoverReportFilters([]))
    }
  }, [resetFilters])

  const onDateRangeChange = (dates) => {
    changeReportedOn(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'reported_on');
      const filters = [{
        key: 'reported_on', value: dates, start: dates[0], end: dates[1], label: 'By Reported On', type: 'customdate', id: 'reported_on', name: 'reported_on', title: 'By Reported On'
      }];
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    } else {
      const customFiltersList = customFilters && customFilters.filter((item) => item.title !== 'By Reported On');
      setCustomFilters(customFiltersList)
    }
  };

  const onAcceptedRangeChange = (dates) => {
    changeAcceptedOn(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'accepted_on');
      const filters = [{
        key: 'accepted_on', value: dates, start: dates[0], end: dates[1], label: 'By Accepted On', type: 'customdate', id: 'accepted_on', name: 'accepted_on', title: 'By Accepted On'
      }];
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
    else {
      const customFiltersList = customFilters && customFilters.filter((item) => item.title !== 'By Accepted On');
      setCustomFilters(customFiltersList)
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (event.target.value && checked) {
      const filters = [{
        key: 'status', value: event.target.value, label: 'By Status', type: 'text', id: event.target.value, name: event.target.name, title: 'By Status'
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'status');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      setCustomFilters(customFiltersList);
    }
  };

  const onApplyFilters = () => {
    setFilterOpen(false)
    dispatch(resetIncidentReport())
    dispatch(shiftHandoverReportFilters(customFilters))
  }

  const onCloseFilters = () => {
    setCustomFilters(shiftHandoverFilters.customFilters)
    setFilterOpen(false)
  }

  const filtersComponentsArray = [
    {
      title: 'BY TEAM',
      component:
        <FormGroup>
          <Autocomplete
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
            open={teamOpen}
            size="small"
            onOpen={() => {
              setTeamOpen(true);
              setTeamKeyword('');
            }}
            onClose={() => {
              setTeamOpen(false);
              setTeamKeyword('');
            }}
            value={getFindData('By Team')}
            disableClearable={!(getFindData('By Team'))}
            onChange={(e, options) => onSpaceChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={teamKeyword}
                className={((teamValue && teamValue.id) || (teamKeyword && teamKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setTeamKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {getFindData('By Team') ? (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTeamClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        ) : ''}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showTeamModal}
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
          {(teamsInfo && teamsInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(teamsInfo)}</FormFeedback>
          )}
        </FormGroup>
    },
    {
      title: 'BY STATUS',
      component:
        <div>
          {assetActions.statusTypes.map((tp, index) => (
            <span className="mb-1 d-block font-weight-500" key={tp.value}>
              <Checkbox
                type="checkbox"
                id={`checkboxvalidaction${index}`}
                value={tp.value}
                name={tp.label}
                checked={getFindData('By Status') && getFindData('By Status').value === tp.value}
                onChange={handleStatusCheckboxChange}
              />
              <Label htmlFor={`checkboxvalidaction${index}`}>
                <span className="ml-2">{tp.label}</span>
              </Label>
              {' '}
            </span>
          ))}
        </div>
    },
    {
      title: 'BY REPORTED',
      component:
        <FormGroup>
          <Autocomplete
            // multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
            open={reportedByOpen}
            size="small"
            onOpen={() => {
              setReportedByOpen(true);
              setReportedByKeyword('');
            }}
            onClose={() => {
              setReportedByOpen(false);
              setReportedByKeyword('');
            }}
            value={getFindData('By Reported')}
            disableClearable={!(getFindData('By Reported'))}
            onChange={(e, options) => onStateChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={reportedByOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={reportedByKeyword}
                className={((reportedByValue && reportedByValue.id) || (reportedByKeyword && reportedByKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setReportedByKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {reportedByInfo && reportedByInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {getFindData('By Reported') ? (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onStateClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        ) : ''}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showReportedBYModal}
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
          {(reportedByInfo && reportedByInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(teamsInfo)}</FormFeedback>
          )}
        </FormGroup>
    },
    {
      title: 'BY REPORTED ON',
      component:
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker']}>
              <DateRangePicker
                localeText={{ start: 'Start Date', end: 'End Date' }}
                onChange={onDateRangeChange}
                disableFuture
                value={getFindDateRange('reported_on') ? getFindDateRange('reported_on') : reportedOnDate}
                format="DD-MM-YYYY"
                slotProps={{
                  actionBar: {
                    actions: ['clear'],
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
    },
    {
      title: 'BY ACCEPTED',
      component:
        <FormGroup>
          <Autocomplete
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
            open={acceptedByOpen}
            size="small"
            onOpen={() => {
              setAcceptedByOpen(true);
              setAcceptedByKeyword('');
            }}
            onClose={() => {
              setAcceptedByOpen(false);
              setAcceptedByKeyword('');
            }}
            value={getFindData('By Accepted')}
            disableClearable={!(getFindData('By Accepted'))}
            onChange={(e, options) => onAcceptedChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={acceptedByOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={acceptedByKeyword}
                className={((getFindData('By Accepted') && getFindData('By Accepted').id))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setAcceptedByKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {acceptedByInfo && acceptedByInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {getFindData('By Accepted') ? (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onAcceptedClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        ) : ''}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showAcceptedBYModal}
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
          {(acceptedByInfo && acceptedByInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(teamsInfo)}</FormFeedback>
          )}
        </FormGroup>
    },
    {
      title: 'BY ACCEPTED ON',
      component:
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker']}>
              <DateRangePicker
                localeText={{ start: 'Start Date', end: 'End Date' }}
                disableFuture
                value={getFindDateRange('accepted_on') ? getFindDateRange('accepted_on') : acceptedOnDate}
                onChange={(date) => onAcceptedRangeChange(date)}
                format={getDatePickerFormat(userInfo, 'date')}
                slotProps={{
                  actionBar: {
                    actions: ['clear'],
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
    }
  ]
  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <Dialog size="xl" open={extraMultipleModal} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            >
              <SearchModalSingle
                modelName={modelValue}
                modalName={modalName}
                afterReset={() => { setExtraMultipleModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldValue={otherFieldValue}
                setTeamValue={(data) => onSpaceChange(data)}
                setReportedByValue={(data) => onStateChange(data)}
                setAcceptedByValue={(data) => onAcceptedChange(data)}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideFilterIncident;
