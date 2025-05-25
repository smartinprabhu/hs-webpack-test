/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import CollapseItemDynamic from '@shared/sideTools/collapseItemDynamic';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';
import CollapseItemCustomDate from '@shared/sideTools/collapseItemCustomDate';

import {
  getColumnArrayById, getAllowedCompanies, isArrayValueExists, getDatesOfQueryWithUtc, getDateAndTimeForDifferentTimeZones, queryGeneratorWithUtc, defaultTimeZone
} from '../../../util/appUtils';
import customData from '../../data/customData.json';
import {
  getPantryFilters, getPantryGroups, getProductsGroups, getAllReports, getSelectedReportType,
} from '../../pantryService';

const appModels = require('../../../util/appModels').default;

const InventorySideFilters = (props) => {
  const { isEmployee } = props;
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [pantryGroups, setPantryGroups] = useState([]);
  const [employeeGroups, setEmployeeGroups] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [pantryCollapse, setPantryCollapse] = useState(false);
  const [employeeCollapse, setEmployeeCollapse] = useState(false);
  const [orderCollapse, setOrderCollapse] = useState(true);
  const [typeCollapse, setTypeCollapse] = useState(false);
  const [typeValue, setTypeValue] = useState([{ value: 'Summary', label: 'Summary' }]);
  const [datefilterList, setDatefilterList] = useState([]);
  const { userInfo } = useSelector((state) => state.user);

  const timezone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone

  const setDefaultPantryFilter = () => {
    const dateArray = getDatesOfQueryWithUtc('Today', timezone);
    dispatch(getPantryFilters([{
      key: 'ordered_on', title: 'Order Date', value: 'Today', label: 'Today', type: 'datecompare', start: dateArray[0], end: dateArray[1], date: true
    }]))
  }

  const [selectedDate, setSelectedDate] = useState([null, null]);

  const companies = getAllowedCompanies(userInfo);

  const {
    pantryGroupsInfo, pantryFilters, employeeGroupsInfo, reports
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    dispatch(getSelectedReportType('Summary'));
  }, []);

  useEffect(() => {
    if (pantryCollapse) {
      dispatch(getPantryGroups(companies, appModels.PANTRYORDER));
    }
  }, [pantryCollapse]);

  useEffect(() => {
    if (employeeCollapse) {
      dispatch(getProductsGroups(companies, appModels.PANTRYORDER));
    }
  }, [employeeCollapse]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate === null) {
      if (userInfo.data.timezone) {
        // const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'date');
        const todayDate = (new Date(), userInfo, 'datetimesecs');
        setSelectedDate(todayDate);
      }
    }
  }, [userInfo, selectedDate]);

  useEffect(() => {
    if (pantryGroupsInfo && pantryGroupsInfo.data) {
      setPantryGroups(pantryGroupsInfo.data);
    }
  }, [pantryGroupsInfo]);

  useEffect(() => {
    if (employeeGroupsInfo && employeeGroupsInfo.data) {
      setEmployeeGroups(employeeGroupsInfo.data);
    }
  }, [employeeGroupsInfo]);

  useEffect(() => {
    if (pantryFilters && pantryFilters.customFilters) {
      setCustomFilters(pantryFilters.customFilters);
      const vid = isArrayValueExists(pantryFilters.customFilters, 'type', 'id');
      if (vid) {
        // if (viewId !== vid) {
        const data = pantryFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(vid));
        setCustomFilters(data);
        dispatch(getPantryFilters(data));
        // setViewId(vid);
        // dispatch(setInitialValues(false, false, false, false));
        // }
      }
    }
  }, [pantryFilters]);

  const customFilter = pantryFilters.customFilters && pantryFilters.customFilters.length && pantryFilters.customFilters.find((filter) => filter.value === 'Custom')
  const datesSelected = datefilterList && datefilterList.length ? true : false

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.length) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters, false, userInfo.data) : '';
      if ((datesSelected && customFilter && customFilter.start && customFilter.end) || (!datesSelected && !customFilter)) {
        dispatch(getAllReports(companies, customFiltersList, appModels.PANTRYORDER));
      }
    }
  }, [pantryFilters]);

  useEffect(() => {
    setDefaultPantryFilter()
  }, [])

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    setDefaultPantryFilter()
    setDatefilterList([]);
    setSelectedDate([null, null]);
  };

  const onPantrySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = pantryGroups.filter((item) => {
        const searchValue = item.pantry_id ? item.pantry_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setPantryGroups(ndata);
    } else {
      setPantryGroups(pantryGroupsInfo && pantryGroupsInfo.data ? pantryGroupsInfo.data : []);
    }
  };

  const onSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = employeeGroups.filter((item) => {
        const searchValue = item.employee_id ? item.employee_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setEmployeeGroups(ndata);
    } else {
      setEmployeeGroups(employeeGroupsInfo && employeeGroupsInfo.data ? employeeGroupsInfo.data : []);
    }
  };

  const handlePantryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'pantry_id', title: 'Pantry', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getPantryFilters(customFiltersList));
    }
  };

  const handleTypeChange = (event) => {
    const { checked, value, name } = event.target;
    dispatch(getSelectedReportType(value));
    const filters = [{
      value, label: name,
    }];
    if (checked) {
      setTypeValue(filters);
    } else {
      setTypeValue([]);
    }
  };

  const handleEmployeeChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'employee_id', title: 'Employee', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getPantryFilters(customFiltersList));
    }
  };

  function setSelectedDates(dates) {
    setSelectedDate(dates);
  }

  const handleOrderCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      if (value === 'Custom') {
        const filters = [{
          key: value, title: 'Order Date', value, label: value, type: 'date',
        }];
        setDatefilterList(filters);
        const customFilterCurrentList = customFilters.filter((item) => item.type !== 'datecompare');
        dispatch(getPantryFilters(customFilterCurrentList));
      } else {
        const dateArray = getDatesOfQueryWithUtc(value, timezone);
        const filters = [{
          key: 'ordered_on', title: 'Order Date', value, label: name, type: 'datecompare', start: dateArray[0], end: dateArray[1], date: true
        }];
        setDatefilterList([]);
        setSelectedDate([null, null]);
        const customFilterCurrentList = customFilters.filter((item) => item.type !== 'datecompare');
        const customFiltersList = [...customFilterCurrentList, ...filters];
        dispatch(getPantryFilters(customFiltersList));
      }
    }
  };

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1])
        const start = dateRangeObj[0];
        const end = dateRangeObj[1];
        const startLabel = start;
        const endLabel = end;
        const value = 'Custom';
        const label = `${value} - ${startLabel} - ${endLabel}`;
        const filters = [{
          key: 'ordered_on', value, label, type: 'datecompare', start, end, date: true
        }];
        const customFilterCurrentList = customFilters.filter((item) => item.value !== value);
        const customFiltersList = [...customFilterCurrentList, ...filters];
        dispatch(getPantryFilters(customFiltersList));
      }
    }
  }, [selectedDate]);

  const stateValuesList = (pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.length > 0) ? pantryFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');
  const orderValuesList = (pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.length > 0)
    ? pantryFilters.customFilters.filter((item) => item.type === 'datecompare') : [];

  const orderValues = getColumnArrayById(orderValuesList, 'value');
  const typeValues = getColumnArrayById(typeValue, 'value');

  return (
    <>
      <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
        {isEmployee
          ? (
            <CollapseItemDynamic
              title="EMPLOYEE"
              data={employeeGroupsInfo}
              selectedValues={stateValues}
              dataGroup={employeeGroups}
              placeholder="Employee"
              filtervalue="employee_id"
              onCollapse={() => setEmployeeCollapse(!employeeCollapse)}
              isOpen={employeeCollapse}
              onCheckboxChange={handleEmployeeChange}
              onSearchChange={onSearchChange}
            />
          ) : ''}
        <CollapseItemCustomDate
          title="DATE"
          data={customData && customData.orderDateFilters ? customData.orderDateFilters : []}
          selectedValues={orderValues}
          onCollapse={() => setOrderCollapse(!orderCollapse)}
          afterSelect={(dates) => setSelectedDates(dates)}
          isOpen={orderCollapse}
          datefilterList={datefilterList}
          onCheckboxChange={handleOrderCheckboxChange}
          disableSelection={reports && reports.loading}
        />
        <CollapseItemDynamic
          title="PANTRY"
          data={pantryGroupsInfo}
          selectedValues={stateValues}
          dataGroup={pantryGroups}
          placeholder="Pantry"
          filtervalue="pantry_id"
          onCollapse={() => setPantryCollapse(!pantryCollapse)}
          isOpen={pantryCollapse}
          onCheckboxChange={handlePantryChange}
          onSearchChange={onPantrySearchChange}
        />
        {isEmployee
          ? (
            <CollapseItemCustom
              title="TYPE"
              data={customData && customData.reportTypes ? customData.reportTypes : []}
              selectedValues={typeValues}
              onCollapse={() => setTypeCollapse(!typeCollapse)}
              isOpen={typeCollapse}
              onCheckboxChange={handleTypeChange}
            />
          ) : ''}
        {(customFilters && customFilters.length > 0) && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
        )}
      </CardBody>
    </>
  );
};

InventorySideFilters.propTypes = {
  isEmployee: PropTypes.bool,
};
InventorySideFilters.defaultProps = {
  isEmployee: false,
};
export default InventorySideFilters;
