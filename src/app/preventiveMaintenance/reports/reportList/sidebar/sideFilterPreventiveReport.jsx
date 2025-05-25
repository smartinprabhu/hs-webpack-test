/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
  Drawer,
  FormControlLabel,
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  getPPMReport, getSelectedReportDate,
} from '../../../ppmService';
import { getAllowedCompanies, getDatesOfQueryReport, getCompanyTimezoneDate, getDateAndTimeForReports } from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';

const { RangePicker } = DatePicker;

const SideFilterPreventiveReport = (props) => {
  const {
    apiReportName,
    filterOpen,
    setFilterOpen,
    resetFilters,
    setResetFilters,
    setShowResetOption
  } = props;
  const dispatch = useDispatch();
  const [customFilters, setCustomFilters] = useState({
    date: [null, null], preventiveFor: '', includeDaily: false, selectedDate: ''
  })
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [dailyCollapse, setDailyCollapse] = useState(true);
  const [selectedDate, setSelectedDate] = useState(customFilters.selectedDate);
  const [date, changeDate] = useState(customFilters.date);
  const [datesValue, setDatesValue] = useState([]);
  const [preventiveFor, setPreventiveFor] = useState(customFilters.preventiveFor);
  const [includeDaily, setIncludeDaily] = useState(customFilters.includeDaily);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  console.log(customFilters, 'customFilters');
  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'datetimesecs');
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    const tooLate = datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && customFilters.selectedDate && customFilters.selectedDate !== '%(custom)s' && customFilters.selectedDate !== 'Custom' && customFilters.preventiveFor) {
      let values = {
        company_id: companies, category_type: customFilters.preventiveFor, domain_type: customFilters.selectedDate,
      };
      if (includeDaily) {
        values = {
          company_id: companies, category_type: customFilters.preventiveFor, domain_type: customFilters.selectedDate, is_include_daily: customFilters.includeDaily,
        };
      }
      dispatch(getSelectedReportDate(getDatesOfQueryReport(customFilters.selectedDate, userInfo)));
      dispatch(getPPMReport(values, apiReportName));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && customFilters.selectedDate && (customFilters.selectedDate === '%(custom)s' || customFilters.selectedDate === 'Custom')) {
      let start = '';
      let end = '';
      if (customFilters.date && customFilters.date[0] && customFilters.date[0] && customFilters.date[1] !== null) {
        const dates = getDateAndTimeForReports(selectedDate, customFilters.date[0], customFilters.date[1])

        start = dates[0]; // getCompanyTimezoneDate(date[0], userInfo, 'date');
        end = dates[1]; // getCompanyTimezoneDate(date[1], userInfo, 'date');
      }
      let values = {
        company_id: companies, category_type: customFilters.preventiveFor, domain_type: selectedDate, start_date: start, end_date: end,
      };
      if (includeDaily) {
        values = {
          company_id: companies, category_type: customFilters.preventiveFor, domain_type: selectedDate, is_include_daily: customFilters.includeDaily, start_date: start, end_date: end,
        };
      }
      dispatch(getSelectedReportDate(getDatesOfQueryReport(selectedDate, userInfo, start, end)));
      dispatch(getPPMReport(values, apiReportName));
    }
  }, [userInfo, customFilters]);

  const handleCheckboxChange = (event) => {
    changeDate([null, null]);
    setSelectedDate(event.target.value);
  };

  const handleTimeCheckboxChange = (event) => {
    setPreventiveFor(event.target.value);
  };

  const handleIncludeDailyChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      setIncludeDaily(true);
    } else {
      setIncludeDaily(false);
    }
  };

  const handleResetClick = () => {
    setIncludeDaily(false);
    setSelectedDate('%(this_month)s');
    setPreventiveFor('e');
    changeDate([null, null]);
  };

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false)
      setShowResetOption(false)
      setCustomFilters({ date: [null, null], preventiveFor: 'e', includeDaily: false, selectedDate: '%(this_month)s' })
      handleResetClick()
    }
  }, [resetFilters])

  useEffect(() => {
    if (customFilters.preventiveFor !== 'e' || customFilters.selectedDate !== '%(this_month)s' || customFilters.includeDaily) {
      setShowResetOption(true)
    }
  }, [customFilters])

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY TIME FILTER
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
        <div>
          {preventiveActions.reportTimeFilter.map((tp, index) => (
            <>
              <span className="mb-1 d-block font-weight-500" key={tp.value}>
                <FormControlLabel
                  control={<Checkbox
                    id={`checkboxstateaction${index}`}
                    value={tp.value}
                    name={tp.label}
                    checked={selectedDate === tp.value}
                    onChange={handleCheckboxChange}
                  />}
                  label={tp.label}
                />
              </span>
            </>
          ))}
          {selectedDate === '%(custom)s' ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker
                    localeText={{ start: 'Start Date', end: 'End Date' }}
                    onChange={onDateRangeChange}
                    value={date}
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
            </>
          ) : ''}
        </div>
    },
    {
      title: (
        <span>
          BY PPM FOR
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
        <>
          {preventiveActions.ppmFor.map((tp, index) => (
            <span className="mb-1 d-block font-weight-500" key={tp.value}>
              <FormControlLabel
                control={<Checkbox
                  id={`checkboxslotaction${index}`}
                  value={tp.value}
                  name={tp.label}
                  checked={preventiveFor === tp.value}
                  onChange={handleTimeCheckboxChange}
                />}
                label={tp.label}
              />
            </span>
          ))}
        </>
    },
    {
      title: 'BY DAILY PPM',
      component:
        <FormControlLabel
          control={<Checkbox
            id={`checkboxdailyaction`}
            value={includeDaily}
            name={'dailyppm'}
            checked={includeDaily}
            onChange={handleIncludeDailyChange}
          />}
          label={'Include Daily PPM'}
        />
    }
  ]

  const onApplyFilters = () => {
    setCustomFilters({
      date, preventiveFor, includeDaily, selectedDate
    })
    setFilterOpen(false)
  }

  const onCloseFilters = () => {
    changeDate(customFilters.date)
    setPreventiveFor(customFilters.preventiveFor)
    setIncludeDaily(customFilters.includeDaily)
    setSelectedDate(customFilters.selectedDate)
    setFilterOpen(false)
  }

  return (
    <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
      <ReportsFilterDrawer
        filtersComponentsArray={filtersComponentsArray}
        onApplyFilters={onApplyFilters}
        onCloseFilters={onCloseFilters}
        isDisabled={preventiveFor && (selectedDate || (date && date.length && date[0] !== null && date[1] !== null)) ? false : true}
      />
    </Drawer>
  );
};

SideFilterPreventiveReport.propTypes = {
  apiReportName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default SideFilterPreventiveReport;
