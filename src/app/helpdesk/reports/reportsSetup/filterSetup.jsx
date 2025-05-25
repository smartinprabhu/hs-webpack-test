/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  Autocomplete,
  Box,
  Radio,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Dialog, DialogContent, DialogContentText,
  Chip,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import uniqBy from 'lodash/uniqBy';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import ticketIcon from '@images/sideNavImages/helpdesk_black.svg';

import {
  CircularProgress,
} from '@material-ui/core';
// import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import dateFiltersFields from '@shared/data/filtersFields.json';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import DrawerHeader from '../../../commonComponents/drawerHeader';
import MuiAccordion from '../../../commonComponents/muiAccordian';
import {
  getTypeId,
} from '../../../preventiveMaintenance/ppmService';
import {
  getGlobalCategories,
} from '../../../assets/equipmentService';
import SearchModalMultiple from './searchModalMultiple';
import SearchModalSingle from './searchModal';

import {
  getReportFilters,
  getStateGroups,
  resetHelpdeskReport,
  getHelpdeskReports,
  getSiteBasedCategory,
  getHelpdeskVendors,
  getModelFilters,
} from '../../ticketService';
import {
  generateErrorMessage,
  getDateTimeUtc,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  queryGeneratorWithUtc,
  arraySortByString,
  getArrayFromValuesByIdIn,
  getAllCompanies,
  getArrayToCommaValues,
  getColumnArrayString,
  getDatesOfQueryInventoryReport,
  getCompanyTimezoneDate,
  getListOfModuleOperations,
  isJsonString,
  getJsonString,
  extractValueArray,
} from '../../../util/appUtils';
import filtersFields from '../../data/filtersFields.json';
import actionCodes from '../../data/helpdeskActionCodes.json';
import DialogHeader from '../../../commonComponents/dialogHeader';
import ReportsFilterDrawer from '../../../commonComponents/reportsFilterDrawer';
import TabPanel from '../../../apexDashboards/assetsDashboard/tabPanel';
import {
  AddThemeBackgroundColor, DetailViewTabsColor, DetailViewTabsBackground, DetailViewTabsIndicator,
} from '../../../themes/theme';
import DefaultFilters from '../../../commonComponents/defaultFilters';
import { getTemplateSelectedFields, getTemplateData } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const { RangePicker } = DatePicker;

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

const FilterSetup = ({
  filterOpen, onReset, setFilterOpen, resetFilters, hideHead, setResetFilters, setActiveFilter, activeFilter, activeTemplate, setActiveTemplate,
  activeDateFilter, setActivedateFilter,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState([null, null]);
  const [datesValue, setDatesValue] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const [dateCollapse, setDateCollapse] = useState(true);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusKeyword, setStatusKeyword] = useState('');
  const [statusId, setStatusId] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [slaOpen, setSlaOpen] = useState(false);
  const [slaId, setSlaId] = useState([]);
  const [slaCollapse, setSlaCollapse] = useState(false);

  const [catOpen, setCatOpen] = useState(false);
  const [catId, setCatId] = useState([]);
  const [catCollapse, setCatCollapse] = useState(false);
  const [catOptions, setCatOptions] = useState([]);

  const [subCatOpen, setSubCatOpen] = useState(false);
  const [subCatId, setSubCatId] = useState([]);
  const [subCatCollapse, setSubCatCollapse] = useState(false);
  const [subCatOptions, setSubCatOptions] = useState([]);

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorId, setVendorId] = useState([]);
  const [vendorCollapse, setVendorCollapse] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyId, setCompanyId] = useState([]);
  const [companyCollapse, setCompanyCollapse] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyOptionsAdv, setCompanyOptionsAdv] = useState([]);

  const [regionOpen, setRegionOpen] = useState(false);
  const [regionId, setRegionId] = useState([]);
  const [regionCollapse, setRegionCollapse] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [regionOptionsAdv, setRegionOptionsAdv] = useState([]);

  const [ctOpen, setCtOpen] = useState(false);
  const [ctName, setCtName] = useState('');
  const [ctCollapse, setCtCollapse] = useState(false);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [extraModalMultiple, setExtraModalMultiple] = useState(false);
  const [reload, setReload] = useState(false);

  const [customFilters, setCustomFilters] = useState([]);

  const [value, setValue] = React.useState(0);
  const [selectedFilter, setSelectedFilter] = React.useState('');
  const [isDefaultFilter, setIsFilter] = React.useState(false);

  const [selectedDomain, setSelectedDomain] = React.useState('');
  const [filterDate, setFilterDate] = React.useState('');

  const [selectedTemplate, setSelectedTemplate] = React.useState('');
  const [selectedTemplateDisplay, setSelectedTemplateDisplay] = React.useState('');
  const [tempOpen, setTempOpen] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedFilter('');
    setSelectedDomain('');
    setFilterDate('');
    setActiveFilter('');
    setActivedateFilter('');
    setActiveTemplate('');
    setSelectedTemplateDisplay('');
    setSelectedTemplate('');
    setIsFilter(false);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'code');

  const isViewable = allowedOperations.includes(actionCodes['Advanced Filters']);

  const {
    helpdeskReportFilters, stateGroupsInfo, helpdeskDetailReportInfo, siteCategoriesInfo,
    maintenanceConfigurationData, vendorsCustmonList, moduleFilters,
  } = useSelector((state) => state.ticket);

  const isTenantTickets = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';
    const allowedTenants = userInfo && userInfo.data && userInfo.data.allowed_tenants && userInfo.data.allowed_tenants.length ? getColumnArrayById(userInfo.data.allowed_tenants, 'id') : [];

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const companies = getAllCompanies(userInfo, userRoles);

  const slaOptions = [{ id: 'Within SLA', name: 'Within SLA' }, { id: 'SLA Elapsed', name: 'SLA Elapsed' }];

  const ctOptions = [{ id: 'AOR', name: 'AOR' }, { id: 'Office', name: 'Office' }];

  const [dateValue, setDateValue] = useState([null, null]);

  const [filterDateValue, setFilterDateValue] = useState([null, null]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDateValue(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const startd = `${moment(dates[0].$d).format('YYYY-MM-DD')}`;
      const endd = `${moment(dates[1].$d).format('YYYY-MM-DD')}`;
      const start = getDateTimeUtc(`${startd} 00:00:00`);
      const end = getDateTimeUtc(`${endd} 23:59:00`);
      const filters = [{
        key: 'create_date', title: 'Created On', value: 'Custom', label: 'Created On', type: 'customdate', start, end,
      }];

      const customFilters1 = [...customFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setCustomFilters(customFilters1);
    }
  };

  const handleFilterDateRangeChange = (dates) => {
    setFilterDateValue(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const startd = `${moment(dates[0].$d).format('YYYY-MM-DD')}`;
      const endd = `${moment(dates[1].$d).format('YYYY-MM-DD')}`;
      const start = getDateTimeUtc(`${startd} 00:00:00`);
      const end = getDateTimeUtc(`${endd} 23:59:00`);
      const filters = [{
        key: 'create_date', title: 'Created On', value: 'Custom', label: 'Created On', type: 'customdate', start, end,
      }];

      setActivedateFilter(filters);
      const customFiltersList = queryGeneratorWithUtc(filters, 'create_date', userInfo.data);
      setSelectedDomain(customFiltersList);
    }
  };

  const handleFilterboxChange = (event) => {
    const resultDomain = event.target.value;
    if (resultDomain) {
      // const reString = resultDomain.toString().substring(1, selectedFilter.toString().length - 1);
      setSelectedFilter(resultDomain);
      setActiveFilter(resultDomain);
      // setSelectedDomain(reString);
    }
  };

  const handleFilterDateboxChange = (event) => {
    setFilterDate(event.target.value);
    const filters = [{
      key: event.target.value, value: event.target.value, label: event.target.value, type: 'date', title: 'date',
    }];
    setActivedateFilter(filters);
    const customFiltersList = queryGeneratorWithUtc(filters, 'create_date', userInfo.data);
    setSelectedDomain(customFiltersList);
    // setActiveFilter(`${selectedDomain},${customFiltersList}`);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (helpdeskReportFilters && helpdeskReportFilters.customFilters) {
      setCustomFilters(helpdeskReportFilters.customFilters);
    }
  }, [helpdeskReportFilters]);

  useEffect(() => {
    if (!activeFilter) {
      setSelectedFilter('');
      setSelectedDomain('');
      setFilterDate('');
      setIsFilter(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    if (!activeTemplate) {
      setSelectedTemplate('');
      setSelectedTemplateDisplay('');
    }
  }, [activeTemplate]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getModelFilters(companies, appModels.HELPDESKVIEW, appModels.FILTERS));
    }
  }, [userInfo]);

  function getActiveFilterFields() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    const fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    return fData && fData.length && fData[0].custom_fields && isJsonString(fData[0].custom_fields) && getJsonString(fData[0].custom_fields).fields ? getJsonString(fData[0].custom_fields).fields : false;
  }

  function getActiveFilterFieldsv1() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    const fData = data.filter(
      (item) => item.name === activeTemplate,
    );
    return fData && fData.length && fData[0].custom_fields && isJsonString(fData[0].custom_fields) && getJsonString(fData[0].custom_fields).fields ? getJsonString(fData[0].custom_fields).fields : false;
  }

  useEffect(() => {
    if (userInfo && userInfo.data && (helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.length) && !isDefaultFilter) {
      const customFiltersList = helpdeskReportFilters.customFilters ? queryGeneratorWithUtc(helpdeskReportFilters.customFilters, 'create_date', userInfo.data) : '';
      const detailFields = filtersFields.columns;
      const fields = getActiveFilterFieldsv1() ? getActiveFilterFieldsv1() : getColumnArrayById(detailFields, 'accessor');
      dispatch(getHelpdeskReports(companies, appModels.HELPDESKVIEW, fields, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, false, isTenantTickets, allowedTenants));
    }
  }, [JSON.stringify(helpdeskReportFilters)]);

  useEffect(() => {
    if (userInfo && userInfo.data && selectedFilter && isDefaultFilter) {
      const customFiltersList = helpdeskReportFilters.customFilters ? queryGeneratorWithUtc(helpdeskReportFilters.customFilters, 'create_date', userInfo.data) : '';
      const detailFields = filtersFields.columns;
      const fields = getActiveFilterFields() ? getActiveFilterFields() : getColumnArrayById(detailFields, 'accessor');
      dispatch(getHelpdeskReports(companies, appModels.HELPDESKVIEW, fields, customFiltersList, sortedValue.sortBy, sortedValue.sortField, selectedFilter, selectedDomain, isTenantTickets, allowedTenants));
    }
  }, [isDefaultFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && statusOpen) {
      dispatch(getStateGroups(companies, appModels.HELPDESK, false));
    }
  }, [userInfo, statusOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && catOpen) {
      dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
    }
  }, [catOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && vendorOpen) {
      dispatch(getHelpdeskVendors(userInfo.data.company.id));
    }
  }, [vendorOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length) {
      const mainCompany = userInfo.data.company.id;
      let filteredCompanies = userInfo.data.allowed_companies.filter(
        (company) => company.id !== 1,
      );
      if (mainCompany === 1) {
        filteredCompanies = userInfo.data.allowed_companies;
      }
      setCompanyOptions(getArrayFromValuesById(filteredCompanies, isAssociativeArray(companyId || []), 'id'));
      setCompanyOptionsAdv(filteredCompanies);
      let regionsGroups = userInfo.data.allowed_companies.map((cl) => ({
        id: cl.region && cl.region.id && cl.region.id.length && cl.region.id.length > 0 ? cl.region.id[0] : cl.region && cl.region.id ? cl.region.id : '',
        name: cl.region && cl.region.name ? cl.region.name : '',
      })).filter((company) => company.id !== 1);
      if (mainCompany === 1) {
        regionsGroups = userInfo.data.allowed_companies.map((cl) => ({
          id: cl.region && cl.region.id && cl.region.id.length && cl.region.id.length > 0 ? cl.region.id[0] : cl.region && cl.region.id ? cl.region.id : '',
          name: cl.region && cl.region.name ? cl.region.name : '',
        }));
      }
      const validRegions = regionsGroups && regionsGroups.length ? regionsGroups.filter((item) => item.id) : [];
      const regionsUniqueGroups = [...new Map(validRegions.map((item) => [item.id, item])).values()];
      setRegionOptionsAdv(regionsUniqueGroups);
      setRegionOptions(getArrayFromValuesById(regionsUniqueGroups, isAssociativeArray(vendorId || []), 'id'));
    } else if (userInfo && userInfo.loading) {
      setCompanyOptions([{ name: 'Loading...' }]);
      setRegionOptions([{ name: 'Loading...' }]);
    } else if (userInfo && userInfo.err) {
      setCompanyOptions([]);
      setRegionOptions([]);
    } else {
      setCompanyOptions([]);
      setRegionOptions([]);
    }
  }, [userInfo, resetFilters, reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length && regionId && regionId.length && regionId.length > 0) {
     // setCompanyOptions(getArrayFromValuesById(userInfo.data.allowed_companies, isAssociativeArray(companyId || []), 'id'));
      const mainCompany = userInfo.data.company.id;
      let regionsGroups = userInfo.data.allowed_companies.map((cl) => ({
        id: cl.region && cl.region.id && cl.region.id.length && cl.region.id.length > 0 ? cl.region.id[0] : cl.region && cl.region.id ? cl.region.id : '',
        name: cl.region && cl.region.name ? cl.region.name : '',
      })).filter((company) => company.id !== 1);
      if(mainCompany === 1){
        regionsGroups = userInfo.data.allowed_companies.map((cl) => ({
          id: cl.region && cl.region.id && cl.region.id.length && cl.region.id.length > 0 ? cl.region.id[0] : cl.region && cl.region.id ? cl.region.id : '',
          name: cl.region && cl.region.name ? cl.region.name : '',
        }));
      }
      const validRegions = regionsGroups && regionsGroups.length ? regionsGroups.filter((item) => item.id) : [];
      const regionsUniqueGroups = [...new Map(validRegions.map((item) => [item.id, item])).values()];
      setRegionOptionsAdv(regionsUniqueGroups);
      setRegionOptions(getArrayFromValuesById(regionsUniqueGroups, isAssociativeArray(regionId || []), 'id'));
    }else{
      setReload(Math.random());
    }
  }, [regionId]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length && regionId && regionId.length && regionId.length > 0) {
      const allowedRegionIds = regionId.map(item => item.id);
      const mainCompany = userInfo.data.company.id;
      let filteredCompanies = userInfo.data.allowed_companies.filter(
        (company) => allowedRegionIds.includes(company.region.id && company.region.id.length && company.region.id.length > 0 ? company.region.id[0] : company.region.id) && company.id !== 1,
      );
      if(mainCompany === 1){
        filteredCompanies = userInfo.data.allowed_companies.filter(
          (company) => allowedRegionIds.includes(company.region.id && company.region.id.length && company.region.id.length > 0 ? company.region.id[0] : company.region.id),
        );
      }
      setCompanyOptionsAdv(filteredCompanies);
      setCompanyOptions(getArrayFromValuesById(filteredCompanies, isAssociativeArray(companyId || []), 'id'));
    }else{
      setReload(Math.random());
    }
  }, [regionId, companyId]);

  useEffect(() => {
    if (stateGroupsInfo && stateGroupsInfo.data && stateGroupsInfo.data.length) {
      const valuedData = stateGroupsInfo.data.filter((item) => item.state_id_count && item.state_id && item.state_id.length);
      const stateGroups = valuedData.map((cl) => ({
        id: cl.state_id[0],
        name: cl.state_id[1],
      }));
      setStatusOptions(getArrayFromValuesById(stateGroups, isAssociativeArray(statusId || []), 'id'));
    } else if (stateGroupsInfo && stateGroupsInfo.loading) {
      setStatusOptions([{ name: 'Loading...' }]);
    } else if (stateGroupsInfo && stateGroupsInfo.err) {
      setStatusOptions([]);
    } else {
      setStatusOptions([]);
    }
  }, [stateGroupsInfo]);

  useEffect(() => {
    if (vendorsCustmonList && vendorsCustmonList.data && vendorsCustmonList.data.length) {
      setVendorOptions(getArrayFromValuesById(vendorsCustmonList.data, isAssociativeArray(vendorId || []), 'id'));
    } else if (vendorsCustmonList && vendorsCustmonList.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else if (vendorsCustmonList && vendorsCustmonList.err) {
      setVendorOptions([]);
    } else {
      setVendorOptions([]);
    }
  }, [vendorsCustmonList]);

  useEffect(() => {
    if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length) {
      const valuedData = getArrayFromValuesById(siteCategoriesInfo.data, isAssociativeArray(catId || []), 'id');
      setCatOptions(arraySortByString(valuedData, 'name'));
    } else if (siteCategoriesInfo && siteCategoriesInfo.loading) {
      setCatOptions([{ name: 'Loading...' }]);
    } else if (siteCategoriesInfo && siteCategoriesInfo.err) {
      setCatOptions([]);
      setSubCatOptions([]);
    } else {
      setCatOptions([]);
      setSubCatOptions([]);
    }
  }, [siteCategoriesInfo]);

  function getMultiArrayData(array) {
    const column = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].sub_category_id) {
        for (let j = 0; j < array[i].sub_category_id.length; j += 1) {
          column.push(array[i].sub_category_id[j]);
        }
      }
    }
    return column; // return column data..
  }

  useEffect(() => {
    if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length && catId && catId.length) {
      const subData = getArrayFromValuesByIdIn(siteCategoriesInfo.data, getColumnArrayById(catId, 'id'), 'id');
      const loadedSubData = subData && subData.length ? getMultiArrayData(subData) : [];
      const valuedData = getArrayFromValuesById(loadedSubData, isAssociativeArray(subCatId || []), 'id');
      if (loadedSubData && loadedSubData.length) {
        setSubCatOptions(arraySortByString(valuedData, 'name'));
      } else {
        setSubCatOptions([]);
      }
    }
  }, [catId]);

  const disabledDate = (current) => {
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 365;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 365;
    const overall = tooLate || (tooEarly || (current && current > moment().endOf('day')));
    return datesValue && datesValue.length ? overall : (current && current > moment().endOf('day'));
  };

  useEffect(() => {
    setSelectedDate('');
    setDateValue([null, null]);
  }, []);

  // useEffect(() => {
  //   const customFilter = helpdeskReportFilters && helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.find((cFilter) => cFilter.label === 'Today');
  //   if (customFilter) {
  //     setSelectedDate('');
  //     setDateValue([null, null]);
  //   }
  // }, [helpdeskReportFilters]);

  const handleCheckboxChange = (event) => {
    changeDate(null);
    setSelectedDate(event.target.value);
    setDateValue([null, null]);
    const { checked, value } = event.target;

    const filters = [{
      key: value, value, label: value, type: 'date', title: 'date',
    }];
    if (checked && value !== 'Custom') {
      const customFilters1 = [...customFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setCustomFilters(customFilters1);
    }
  };

  const onStatusChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const newData = data.map((cl) => ({
      key: 'state_id',
      title: 'Status',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'state_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onTemplateChange = (data) => {
    setSelectedTemplate(data.data_name);
    setActiveTemplate(data.data_name);
    setSelectedTemplateDisplay(data.name);
  };

  const onTemplateClear = () => {
    setSelectedTemplate('');
    setSelectedTemplateDisplay('');
    setActiveTemplate('');
  };

  const onSlaChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const newData = data.map((cl) => ({
      key: 'sla_status',
      title: 'SLA Status',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'sla_status');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onCtChange = (data) => {
    setCtName(data);
    const sVal = data && data.name ? data.name.trim() : '';
    const filters = [{
      key: 'company_id.company_subcateg_id', value: encodeURIComponent(sVal), label: 'Company Type', type: 'text', id: data.id, name: data.name, title: 'Company Type',
    }];
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'company_id.company_subcateg_id');
    const customFiltersList = [...customFiltersOthers, ...filters];
    setCustomFilters(customFiltersList);
  };

  const onCatChange = (data) => {
    setCatId(data);
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const newData = data.map((cl) => ({
      key: 'category_id',
      title: 'Category',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'category_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onSubCatChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setSubCatId(data);
    const newData = data.map((cl) => ({
      key: 'sub_category_id',
      title: 'Sub Category',
      value: cl.id,
      id: cl.id,
      label: cl.name,
      name: cl.name,
      type: 'inarray',
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'sub_category_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onVendorChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setVendorId(data);
    const newData = data.map((cl) => ({
      key: 'vendor_id',
      title: 'Vendor',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'vendor_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onCompanyChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setCompanyId(data);
    const newData = data.map((cl) => ({
      key: 'company_id',
      title: 'Company',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'company_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onRegionChange = (data) => {
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setRegionId(data);
    const newData = data.map((cl) => ({
      key: 'region_id',
      title: 'Region',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      name: cl.name,
      id: cl.id,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'region_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onCompanyClear = () => {
    setCompanyId([]);
    setCompanyOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'company_id');
    setCustomFilters(customFiltersList);
  };

  const onRegionClear = () => {
    setCompanyId([]);
    setRegionId([]);
    setCompanyOpen(false);
    setRegionOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'region_id' && item.key !== 'company_id');
    setCustomFilters(customFiltersList);
  };

  const onVendorClear = () => {
    setVendorId([]);
    setVendorOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'vendor_id');
    setCustomFilters(customFiltersList);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName('supplier');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile', 'name']);
    setExtraModal(true);
  };

  const onVendorChangeModal = (data) => {
    setVendorId(data);
    const newData = data.map((cl) => ({
      key: 'vendor_id',
      title: 'Vendor',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'vendor_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const showCatgoryModal = () => {
    setExtraModalMultiple(true);
    // setModelValue(appModels.TICKETCATEGORY);
    dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
    dispatch(getGlobalCategories(companies));
    setFieldName('category_id');
    setModalName('Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    // setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['name']);
  };

  const onCatChangeModal = (data) => {
    const newData = data.map((cl) => ({
      key: 'category_id',
      title: 'Category',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    setCatId(data);
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'category_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const showCatModal = () => {
    setExtraModalMultiple(true);
    dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
    dispatch(getGlobalCategories(companies));
    setFieldName('sub_category_id');
    setModalName('Sub Category List');
    setColumns(['name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
  };

  const onCategoryChangeModal = (data) => {
    setSubCatId(data);
    const newData = data.map((cl) => ({
      key: 'sub_category_id',
      title: 'Sub Category',
      value: cl.id,
      id: cl.id,
      label: cl.name,
      name: cl.name,
      type: 'inarray',
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'sub_category_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const showCompanyModal = () => {
    setExtraModalMultiple(true);
    // dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
    // dispatch(getGlobalCategories(companies));
    setFieldName('company_id');
    setModalName('Company List');
    setColumns(['name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
  };

  const onCompanyChangeModal = (data) => {
    setCompanyId(data);
    const newData = data.map((cl) => ({
      key: 'company_id',
      title: 'Company',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'company_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const showRegionModal = () => {
    setExtraModalMultiple(true);
    // dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
    // dispatch(getGlobalCategories(companies));
    setFieldName('region_id');
    setModalName('Region List');
    setColumns(['name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
  };

  const onRegionChangeModal = (data) => {
    setRegionId(data);
    const newData = data.map((cl) => ({
      key: 'region_id',
      title: 'Region',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      name: cl.name,
      id: cl.id,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'region_id');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
  };

  const onSubCatClear = () => {
    setSubCatId([]);
    setSubCatOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'sub_category_id');
    setCustomFilters(customFiltersList);
  };

  const onCatClear = () => {
    setCatId([]);
    setSubCatId([]);
    setSubCatOptions([]);
    setCatOpen(false);
    setSubCatOpen(false);
    const customFiltersList = customFilters.filter((item) => (item.key !== 'category_id' && item.key !== 'sub_category_id'));
    setCustomFilters(customFiltersList);
  };

  const onStatusClear = () => {
    setStatusKeyword(null);
    setStatusOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'state_id');
    setCustomFilters(customFiltersList);
  };

  const onSlaClear = () => {
    setSlaOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'sla_status');
    setCustomFilters(customFiltersList);
  };

  const onCtClear = () => {
    setCtName('');
    setCtOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'company_id.company_subcateg_id');
    setCustomFilters(customFiltersList);
  };

  const showProductModal = () => {
    setModelValue(appModels.PRODUCT);
    setFieldName('product_ids');
    setModalName('Product List');
    setColumns(['id', 'name']);
    setOtherFieldValue(false);
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (resetFilters) {
      setSelectedDate('');
      setCatId([]);
      setSubCatId([]);
      setVendorId([]);
      setCompanyId([]);
      setRegionId([]);
      setCtName('');
      setResetFilters(false);
    }
  }, [resetFilters]);

  const handleResetClick = (e) => {
    e.preventDefault();
    setSelectedDate('');
    setSubCatId([]);
    setVendorId([]);
    setCompanyId([]);
    setRegionId([]);
    setCtName('');
    changeDate(undefined);
    dispatch(resetHelpdeskReport());
    dispatch(getReportFilters([]));
  };

  const onApplyFilters = () => {
    dispatch(getReportFilters(customFilters));
    setFilterOpen(false);
  };

  const onApplyDefaultFilters = () => {
    setIsFilter(Math.random());
    setFilterOpen(false);
  };

  const getFindData = (field) => {
    const result = customFilters?.length && customFilters.find((cFilter) => cFilter.title === field);
    return result || '';
  };
  const onCloseFilters = () => {
    const findData = helpdeskReportFilters?.customFilters?.length && helpdeskReportFilters.customFilters.find((cFilter) => cFilter.title === 'date');

    setCustomFilters(helpdeskReportFilters.customFilters);
    setFilterOpen(false);
    setSelectedDate(findData && findData.label);
    setSelectedFilter('');
    setSelectedDomain('');
    setFilterDate('');
    setActiveFilter(' ');
    setCatId([]);
    setSubCatId([]);
    setActivedateFilter('');
    setActiveTemplate('');
    setSelectedTemplateDisplay('');
    setSelectedTemplate('');
    setIsFilter(false);
    if (onReset) {
      onReset();
    }
  };

  const handleRemove = (chipToDelete) => {
    setCompanyId([]);
    setCompanyOpen(false);
    setRegionId(regionId.filter((chip) => chip.id !== chipToDelete.id));
    const customFiltersList = customFilters.filter(
      (item) => !(item.key === 'region_id' && item.id === chipToDelete.id) && item.key !== 'company_id'
  );
    setCustomFilters(customFiltersList);
  };

  const getFilteredData = (field) => (customFilters?.length ? customFilters.filter((cFilter) => cFilter.title === field) : []);
  const moduleFData = moduleFilters && moduleFilters.data ? moduleFilters.data : [];

  const isFieldFilters = moduleFData && moduleFData.length ? moduleFData.filter((cFilter) => cFilter.custom_fields && isJsonString(cFilter.custom_fields) && getJsonString(cFilter.custom_fields).template_name) : [];

  let filtersComponentsArray = [
    {
      title: (
        <span>
          By Created on<span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <FormGroup>
    {dateFiltersFields && dateFiltersFields.dateFilters.map((tp, index) => (
      <FormControlLabel
        control={(
          <Radio
            id={`checkboxstateaction${index}`}
            value={tp.label}
            name={tp.label}
            disabled={helpdeskDetailReportInfo.loading}
            checked={selectedDate === tp.label}
            onChange={handleCheckboxChange}
          />
              )}
        label={tp.label}
      />
    ))}
    {selectedDate === 'Custom' && (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker
          localeText={{ start: 'Start Date', end: 'End Date' }}
          onChange={onDateRangeChange}
          value={dateValue}
          format="DD-MM-YYYY"
          slotProps={{
            actionBar: {
              actions: ['clear'],
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
    )}
  </FormGroup>,
    }, {
      title: 'By Status',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-outlined"
    size="small"
    name="block"
    open={statusOpen}
    onOpen={() => {
      setStatusOpen(true);
    }}
    onClose={() => {
      setStatusOpen(false);
    }}
    value={getFilteredData('Status')}
    disableClearable={!(getFilteredData('Status') && getFilteredData('Status').length)}
    onChange={(e, options) => onStatusChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={statusOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Status"
        placeholder="By Status"
        className={(((getFilteredData('Status') && getFilteredData('Status').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {(stateGroupsInfo && stateGroupsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                {((statusKeyword && statusKeyword.length > 0) || (getFilteredData('Status') && getFilteredData('Status').length > 0)) && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onStatusClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'By SLA Status',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={slaOpen}
    onOpen={() => {
      setSlaOpen(true);
    }}
    onClose={() => {
      setSlaOpen(false);
    }}
    value={getFilteredData('SLA Status')}
    disableClearable={!(getFilteredData('SLA Status') && getFilteredData('SLA Status').length)}
    onChange={(e, options) => onSlaChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={slaOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By SLA Status"
        placeholder="By SLA Status"
        className={(((getFilteredData('SLA Status') && getFilteredData('SLA Status').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFilteredData('SLA Status') && getFilteredData('SLA Status').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onSlaClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'By Category',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={catOpen}
    onOpen={() => {
      setCatOpen(true);
    }}
    onClose={() => {
      setCatOpen(false);
    }}
    value={getFilteredData('Category')}
    disableClearable={!(getFilteredData('Category') && getFilteredData('Category').length)}
    onChange={(e, options) => onCatChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={catOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Category"
        placeholder="By Category"
        className={(((getFilteredData('Category') && getFilteredData('Category').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {(siteCategoriesInfo && siteCategoriesInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                {getFilteredData('Category') && getFilteredData('Category').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onCatClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showCatgoryModal}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: catId && catId.length > 0 ? 'By Sub Category' : false,
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={subCatOpen}
    onOpen={() => {
      setSubCatOpen(true);
    }}
    onClose={() => {
      setSubCatOpen(false);
    }}
    value={getFilteredData('Sub Category')}
    disableClearable={!(getFilteredData('Sub Category') && getFilteredData('Sub Category').length)}
    onChange={(e, options) => onSubCatChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={subCatOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Sub Category"
        placeholder="By Sub Category"
        className={(((getFilteredData('Sub Category') && getFilteredData('Sub Category').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFilteredData('Sub Category') && getFilteredData('Sub Category').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onSubCatClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showCatModal}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    }, {
      title: userInfo && userInfo.data && userInfo.data.is_parent ? 'By Region' : false,
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={regionOpen}
    onOpen={() => {
      setRegionOpen(true);
    }}
    onClose={() => {
      setRegionOpen(false);
    }}
    value={getFilteredData('Region')}
    disableClearable={!(getFilteredData('Region') && getFilteredData('Region').length)}
    onChange={(e, options) => onRegionChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={regionOptions}
    renderTags={(selected, getTagProps) => selected.map((option, index) => (
      <Chip
        key={option.id}
        label={option.name}
        {...getTagProps({ index })}
        size="small"
        onDelete={() => handleRemove(option)}
      />
    ))}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Region"
        placeholder="By Region"
        className={(((getFilteredData('Region') && getFilteredData('Region').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFilteredData('Region') && getFilteredData('Region').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onRegionClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showRegionModal}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    }, {
      title: isViewable && userInfo && userInfo.data && userInfo.data.is_parent ? 'By Company' : false,
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={companyOpen}
    onOpen={() => {
      setCompanyOpen(true);
    }}
    onClose={() => {
      setCompanyOpen(false);
    }}
    value={getFilteredData('Company')}
    disableClearable={!(getFilteredData('Company') && getFilteredData('Company').length)}
    onChange={(e, options) => onCompanyChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={companyOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Company"
        placeholder="By Company"
        className={(((getFilteredData('Company') && getFilteredData('Company').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFilteredData('Company') && getFilteredData('Company').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onCompanyClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showCompanyModal}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    }, {
      title: 'By Vendor',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={vendorOpen}
    onOpen={() => {
      setVendorOpen(true);
    }}
    onClose={() => {
      setVendorOpen(false);
    }}
    value={getFilteredData('Vendor')}
    disableClearable={!(getFilteredData('Vendor') && getFilteredData('Vendor').length)}
    onChange={(e, options) => onVendorChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={vendorOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Vendor"
        placeholder="By Vendor"
        className={(((getFilteredData('Vendor') && getFilteredData('Vendor').length > 0)))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {(vendorsCustmonList && vendorsCustmonList.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                {getFilteredData('Vendor') && getFilteredData('Vendor').length > 0 && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onVendorClear}
                >
                  <IoCloseOutline />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showVendorModal}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    }, {
      title: 'By Company Type',
      component:
  <Autocomplete
    id="tags-filled"
    size="small"
    name="block"
    open={ctOpen}
    onOpen={() => {
      setCtOpen(true);
    }}
    onClose={() => {
      setCtOpen(false);
    }}
    value={getFindData('Company Type')}
    disableClearable={!(getFindData('Company Type'))}
    onChange={(e, options) => onCtChange(options)}
    getOptionDisabled={() => helpdeskDetailReportInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={ctOptions}
    renderInput={(params) => (
      <TextField
        {...params}
        label="By Company Type"
        placeholder="By Company Type"
        className={(getFindData('Company Type'))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFindData('Company Type') ? (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onCtClear}
                  >
                    <IoCloseOutline />
                  </IconButton>
                ) : ''}
              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
  ];

  if (isFieldFilters && isFieldFilters.length) {
    const filtersComponentsArrayByConfig = [
      {
        title: 'Fields Template (Optional)',
        component:
  <>
    <Autocomplete
      id="tags-outlined"
      size="small"
      name="template"
      open={tempOpen}
      onOpen={() => {
        setTempOpen(true);
      }}
      onClose={() => {
        setTempOpen(false);
      }}
      value={selectedTemplateDisplay}
      disableClearable
      onChange={(e, options) => onTemplateChange(options)}
      getOptionDisabled={() => helpdeskDetailReportInfo.loading}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={getTemplateData(isFieldFilters)}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          placeholder="Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment position="end">
                  {selectedTemplate && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onTemplateClear}
                  >
                    <IoCloseOutline />
                  </IconButton>
                  )}
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
    {selectedTemplateDisplay && (
    <p className="text-info p-2 mb-0">{getTemplateSelectedFields(isFieldFilters, selectedTemplateDisplay)}</p>
    )}
  </>,
      }];

    filtersComponentsArray = filtersComponentsArrayByConfig.concat(filtersComponentsArray);
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <DrawerHeader
          headerName="Filters"
          imagePath={ticketIcon}
          onClose={onCloseFilters}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={DetailViewTabsBackground({
              height: '50px',
            })}
            textcolor="secondary"
            TabIndicatorProps={{
              sx: DetailViewTabsIndicator({
                height: '5px',
              }),
            }}
            variant="fullWidth"
            centered
            aria-label="full width tabs example"
          >
            <Tab
              sx={DetailViewTabsColor({
                textTransform: 'capitalize',
                '&.Mui-selected': {
                  color: '#fff', 
                },
              })}
              label="Predefined Reports"
              {...a11yProps(0)}
            />
            <Tab
              sx={DetailViewTabsColor({
                textTransform: 'capitalize',
                '&.Mui-selected': {
                  color: '#fff', 
                },
              })}
              label="Custom Filters"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel dataValue={value} index={0}>
          <DefaultFilters
            defaultItems={moduleFilters}
            isLabelDisabled={helpdeskDetailReportInfo.loading}
            handleCheckboxChange={handleFilterboxChange}
            handleFilterDateboxChange={handleFilterDateboxChange}
            onApplyFilters={onApplyDefaultFilters}
            handleFilterDateRangeChange={handleFilterDateRangeChange}
            filterDateValue={filterDateValue}
            filterDate={filterDate}
            onCloseFilters={onCloseFilters}
            isDisabled={!selectedFilter}
            selectedValue={selectedFilter}
          />
        </TabPanel>
        <TabPanel dataValue={value} index={1}>
          <ReportsFilterDrawer
            hideHead
            filtersComponentsArray={filtersComponentsArray}
            onApplyFilters={onApplyFilters}
            onCloseFilters={onCloseFilters}
            isDisabled={!((selectedDate && selectedDate !== 'Custom' || (selectedDate === 'Custom' && date && date.length && date[0] !== null && date[1] !== null)))}
          />
        </TabPanel>
      </Drawer>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            > */}
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              onCategoryChange={onVendorChangeModal}
              onProductChange={onCatChangeModal}
              oldCategoryValues={vendorId}
              oldProductValues={catId}
              globalCategories={fieldName === 'category_id' ? siteCategoriesInfo : ''}
            />
            {/* </Box> */}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModalMultiple}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalMultiple(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            > */}
            <SearchModalSingle
              modelName={modelValue}
              afterReset={() => { setExtraModalMultiple(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              onCategoryChange={onCategoryChangeModal}
              onCatChange={onCatChangeModal}
              onCompanyChange={onCompanyChangeModal}
              onRegionChange={onRegionChangeModal}
              oldCategoryValues={subCatId}
              oldCatValues={catId}
              oldComValues={companyId}
              oldRegValues={regionId}
              globalCategories={fieldName === 'category_id' ? siteCategoriesInfo : ''}
              subCatOptions={fieldName === 'sub_category_id' ? subCatOptions : ''}
              regionOptions={fieldName === 'region_id' ? regionOptionsAdv : ''}
              companyOptions={fieldName === 'company_id' ? companyOptionsAdv : ''}
            />
            {/* </Box> */}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterSetup;
