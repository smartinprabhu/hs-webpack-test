/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  Checkbox,
  Drawer,
} from '@mui/material';

import { getAuditReport, resetAuditReport, auditReportFilters } from '../../../equipmentService';
import { resetExtraMultipleList } from '../../../../helpdesk/ticketService';
import {
  getAllCompanies, getDatePickerFormat, getDateAndTimeForDifferentTimeZones,
} from '../../../../util/appUtils';
import assetActions from '../../../data/assetsActions.json';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterAudit = ({
  filterOpen, setFilterOpen, resetFilters, setResetFilters,
}) => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [validDateCollapse, setValidDateCollapse] = useState(true);
  const [groupCollapse, setGroupCollapse] = useState(true);
  const [date, changeDate] = useState([null, null]);
  const [datesValue, setDatesValue] = useState([]);
  const [groupBy, setGroupBy] = useState(false);
  const [validStatus, setValidStatus] = useState('Valid');
  const [customFilters, setCustomFilters] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { auditReportFiltersInfo } = useSelector((state) => state.equipment);
  const companies = getAllCompanies(userInfo, userRoles);

  const getFindData = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field);
    return result || '';
  };

  const getFindDate = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.key === field);
    return result ? result.value : [null, null];
  };

  useEffect(() => {
    setDatesValue(null);
    changeDate([null, null]);
    setGroupBy(false);
    const filters = [{
      id: 'Valid',
      key: 'validated status',
      label: 'By Validated Status',
      name: 'Valid',
      title: 'By Validated Status',
      type: 'text',
      value: 'Valid',
    }];
    setCustomFilters(filters);
    dispatch(resetAuditReport());
    dispatch(resetExtraMultipleList());
    setResetFilters(false);
    dispatch(auditReportFilters(filters));
  }, []);

  useEffect(() => {
    const group_by = getFindData('Group By') && getFindData('Group By').value;
    const statusValue = getFindData('By Validated Status') && getFindData('By Validated Status').value;

    if (userInfo && userInfo.data && userInfo.data.company) {
      let start = '';
      let end = '';
      let dateRangeObj = [];

      if (getFindDate('validated_on') && getFindDate('validated_on')[0] && getFindDate('validated_on')[0] !== null) {
        dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, getFindDate('validated_on')[0].$d, getFindDate('validated_on')[1].$d);
        start = dateRangeObj[0];
        end = dateRangeObj[1];

        //  start = `${moment(date[0]).utc().tz(timeZone).format('YYYY-MM-DD')} 00:30:59`;
        //  end = `${moment(date[1]).utc().tz(timeZone).format('YYYY-MM-DD')} 23:59:59`;
      }
      if (group_by && start && end && auditReportFiltersInfo && auditReportFiltersInfo.customFilters && auditReportFiltersInfo.customFilters.length) {
        dispatch(getAuditReport(companies, appModels.EQUIPMENT, start, end, group_by, statusValue));
      }
    }
  }, [auditReportFiltersInfo]);

  useEffect(() => {
    if (auditReportFiltersInfo && auditReportFiltersInfo.customFilters) {
      setCustomFilters(auditReportFiltersInfo.customFilters);
    }
  }, [auditReportFiltersInfo]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'validated_on');
      const filters = [{
        key: 'validated_on', value: dates, start: dates[0], end: dates[1], label: 'By Validated On', type: 'customdate', id: 'validated_on', name: 'validated_on', title: 'By Validated On',
      }];
      const customFiltersList = [...customFiltersOthers || [], ...filters];
      setCustomFilters(customFiltersList);
    } else {
      const customFiltersList = customFilters && customFilters.filter((item) => item.title !== 'By Validated On');
      setCustomFilters(customFiltersList);
    }
  };

  const handleGroupCheckboxChange = (event) => {
    if (event.target.value) {
      setGroupBy(event.target.value);
      const filters = [{
        key: 'group by', value: event.target.value, label: 'Group By', type: 'text', id: event.target.value, name: event.target.name, title: 'Group By',
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'group by');
      const customFiltersList = [...customFiltersOthers || [], ...filters];
      setCustomFilters(customFiltersList);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    if (event.target.value) {
      const filters = [{
        key: 'validated status', value: event.target.value, label: 'By Validated Status', type: 'text', id: event.target.value, name: event.target.name, title: 'By Validated Status',
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'validated status');
      const customFiltersList = [...customFiltersOthers || [], ...filters];
      setCustomFilters(customFiltersList);
    }
  };

  useEffect(() => {
    if (resetFilters) {
      changeDate([null, null]);
      setDatesValue(null);
      setGroupBy(false);
      const filters = [{
        id: 'Valid',
        key: 'validated status',
        label: 'By Validated Status',
        name: 'Valid',
        title: 'By Validated Status',
        type: 'text',
        value: 'Valid',
      }];
      setCustomFilters(filters);
      dispatch(resetAuditReport());
      dispatch(resetExtraMultipleList());
      setResetFilters(false);
      dispatch(auditReportFilters(filters));
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    dispatch(resetAuditReport());
    dispatch(resetExtraMultipleList());
    setFilterOpen(false);
    dispatch(auditReportFilters(customFilters));
  };

  const onCloseFilters = () => {
    setGroupBy(false);
    setCustomFilters(auditReportFiltersInfo.customFilters);
    setFilterOpen(false);
  };

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY VALIDATED ON
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DemoContainer components={['DateRangePicker']}>
      <DateRangePicker
        localeText={{ start: 'Start Date', end: 'End Date' }}
        onChange={onDateRangeChange}
        disableFuture
        value={getFindDate('validated_on') ? getFindDate('validated_on') : date}
        format={getDatePickerFormat(userInfo, 'date')}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
        }}
      />
    </DemoContainer>
  </LocalizationProvider>,
    },
    {
      title: (
        <span>
          BY VALIDATED STATUS
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <>
    {assetActions.validationTypes.map((tp, index) => (
      <span className="mb-1 d-block font-weight-500" key={tp.value}>
        <Checkbox
          type="checkbox"
          id={`checkboxvalidaction${index}`}
          value={tp.value}
          name={tp.label}
          checked={getFindData('By Validated Status') && getFindData('By Validated Status').value === tp.value}
          onChange={handleStatusCheckboxChange}
        />
        <Label htmlFor={`checkboxvalidaction${index}`}>
          <span className="ml-2">{tp.label}</span>
        </Label>
        {' '}
      </span>
    ))}
  </>,
    },
    {
      title: (
        <span>
          GROUP BY
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <>
    {assetActions.groupByList.map((tp, index) => (
      <span className="mb-1 d-block font-weight-500" key={tp.value}>
        <Checkbox
          type="checkbox"
          id={`checkboxslotaction${index}`}
          value={tp.value}
          name={tp.label}
          checked={getFindData('Group By') && getFindData('Group By').value === tp.value}
          onChange={handleGroupCheckboxChange}
        />
        <Label htmlFor={`checkboxslotaction${index}`}>
          <span className="ml-2">{tp.label}</span>
        </Label>
        {' '}
      </span>
    ))}
  </>,
    },
  ];

  useEffect(() => {
    const filters = [{
      id: 'Valid',
      key: 'validated status',
      label: 'By Validated Status',
      name: 'Valid',
      title: 'By Validated Status',
      type: 'text',
      value: 'Valid',
    }];
    setCustomFilters(filters);
    dispatch(auditReportFilters(filters));
  }, []);

  return (
    <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
      <ReportsFilterDrawer
        filtersComponentsArray={filtersComponentsArray}
        onApplyFilters={onApplyFilters}
        onCloseFilters={onCloseFilters}
        isDisabled={!(date && date.length && date[0] !== null && date[1] !== null && groupBy)}
      />
    </Drawer>
  );
};

export default SideFilterAudit;
