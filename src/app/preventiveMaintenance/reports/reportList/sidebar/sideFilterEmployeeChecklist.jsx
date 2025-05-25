/* eslint-disable no-shadow */
/* eslint-disable space-in-parens */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Drawer,
} from "@mui/material";

import { Autocomplete } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  getTypeId,
  getInspectionEmployee, resetInspectionEmployee, getEmployeeGroups,
} from '../../../ppmService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getColumnArrayById,
} from '../../../../util/appUtils';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const sideFilterEmployeeChecklist = ({ filterOpen, setFilterOpen, resetFilters, setResetFilters, setShowResetOption }) => {
  const dispatch = useDispatch();
  const [customFilters, setCustomFilters] = useState({
    date: [null, null],
    employeeIds: []
  });

  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState(customFilters.date);
  const [datesValue, setDatesValue] = useState([]);

  const [employeeCollapse, setEmployeeCollapse] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState(customFilters.employeeIds);
  const [employeeValue, setEmployeeValue] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    employeeGroupInfo,
  } = useSelector((state) => state.ppm);

  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(array) {
    const result = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] && array[i].employee_name) {
        result.push({ id: array[i].employee_name, name: array[i].employee_name });
      }
    }
    return result;
  }

  useEffect(() => {
    dispatch(resetInspectionEmployee());
    dispatch(getTypeId({
      date, employeeValue,
    }));
  }, []);

  useEffect(() => {
    if (employeeGroupInfo && employeeGroupInfo.data && employeeGroupInfo.data.length && employeeOpen) {
      setEmployeeOptions(isAssociativeArray(employeeGroupInfo.data));
    } else if (employeeGroupInfo && employeeGroupInfo.loading) {
      setEmployeeOptions([{ name: 'Loading...' }]);
    } else {
      setEmployeeOptions([]);
    }
  }, [employeeGroupInfo, employeeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && (date && date.length) && employeeOpen) {
      let start = '';
      let end = '';
      if (date && date[0] && date[0] !== null && date[1] && date[1] !== null) {
        start = moment(date[0].toDate()).format("YYYY-MM-DD");
        end = moment(date[1].toDate()).format("YYYY-MM-DD");
      }
      dispatch(getEmployeeGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end));
    }
  }, [userInfo, date, employeeOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && customFilters && customFilters.date && customFilters.date.length) {
      let start = '';
      let end = '';
      if (date && date[0] && date[0] !== null && date[1] && date[1] !== null) {
        start = moment(date[0].toDate()).format("YYYY-MM-DD");
        end = moment(date[1].toDate()).format("YYYY-MM-DD");
        const employeeValues = getColumnArrayById(employeeValue, 'id');
        dispatch(getTypeId({
          date: [start, end], employeeValue,
        }));
        dispatch(getInspectionEmployee(start, end, employeeValues));
      }
    }
  }, [userInfo, customFilters]);

  const disabledDate = (current) => {
    if (!date || date.length === 0) {
      return false;
    }
    let disable = false;
    const tooLate = date && date.length && date[0] && current.diff(date[0], 'days') > 30;
    const tooEarly = date && date.length && date[1] && date[1].diff(current, 'days') > 30;
    disable = tooEarly || tooLate;
    return disable;
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDatesValue(dates);
    const sDate = moment(dates[0].toDate()).format("YYYY-MM-DD");
    const eDate = moment(dates[1].toDate()).format("YYYY-MM-DD");
    /*dispatch(getTypeId({
      date: [sDate, eDate], employeeValue,
    }));*/
  };

  const onEmployeeChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEmployeeOpen(false);
    setEmployeeValue(data);
    let reportDate = false;
    if (date && date.length) {
      const sDate = moment(date[0].toDate()).format("YYYY-MM-DD");
      const eDate = moment(date[1].toDate()).format("YYYY-MM-DD");
      reportDate = [sDate, eDate];
    }
    /*dispatch(getTypeId({
      date: reportDate, employeeValue: data,
    }));*/
  };

  const handleResetClick = () => {
    setEmployeeValue([]);
    changeDate([null, null]);
    dispatch(resetInspectionEmployee());
    dispatch(getTypeId({
      date: false, employeeValue: [],
    }));
  };

  useEffect(() => {
    if (customFilters && ((customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[0] !== null) || customFilters.employeeIds && customFilters.employeeIds.length)) {
      setShowResetOption(true)
    }
  }, [customFilters])

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false)
      setShowResetOption(false)
      dispatch(resetInspectionEmployee());
      handleResetClick()
    }
  }, [resetFilters])

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY DATE FILTER
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
        <>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateRangePicker']}>
                <DateRangePicker
                  localeText={{ start: 'Start Date', end: 'End Date' }}
                  onChange={onDateRangeChange}
                  value={date}
                  shouldDisableDate={disabledDate}
                  format="DD-MM-YYYY"
                  slotProps={{
                    actionBar: {
                      actions: ['clear'],
                    },
                    textField: { variant: 'filled' },
                    field: {
                      readOnly: true
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            {!date || date && date.length && date[0] === null && date[1] === null && (
              <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
            )}
          </div>
        </>
    },
    {
      title: 'BY EMPLOYEE',
      component:
        <>
          <FormGroup>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filledemployee"
              name="employee"
              open={employeeOpen}
              size="small"
              onOpen={() => {
                setEmployeeOpen(true);
                setEmployeeKeyword('');
              }}
              onClose={() => {
                setEmployeeOpen(false);
                setEmployeeKeyword('');
              }}
              value={employeeValue}
              disableClearable={!(employeeValue.length)}
              onChange={(e, options) => onEmployeeChange(options)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={employeeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  value={employeeKeyword}
                  className={((employeeValue && employeeValue.length > 0) || (employeeKeyword && employeeKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setEmployeeKeyword(e.target.value)}
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
                            {(employeeGroupInfo && employeeGroupInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
            {date && date.length && employeeGroupInfo && employeeGroupInfo.err && (
              <FormFeedback className="display-block">{generateErrorMessage(employeeGroupInfo)}</FormFeedback>
            )}
          </FormGroup>
        </>
    }
  ]

  const onApplyFilters = () => {
    setCustomFilters({
      date: date,
      employeeIds: employeeValue
    })
    dispatch(resetInspectionEmployee());
    setFilterOpen(false)
  }

  const onCloseFilters = () => {
    changeDate(customFilters.date)
    setEmployeeValue(customFilters.employeeIds)
    setFilterOpen(false)
  }

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!(date && date.length && date[0] !== null && date[1] !== null)}
        />
      </Drawer>
    </>
  );
};

export default sideFilterEmployeeChecklist;
