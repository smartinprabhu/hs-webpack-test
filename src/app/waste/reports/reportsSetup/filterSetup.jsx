/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Autocomplete,
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField
  ,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import uniqBy from 'lodash/uniqBy';

import {
  CircularProgress,
} from '@material-ui/core';
// import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import dateFiltersFields from '@shared/data/filtersFields.json';
import {
  getGlobalCategories,
} from '../../../assets/equipmentService';
// import SearchModalMultiple from './searchModalMultiple';
// import SearchModalSingle from './searchModal';

import {
  getSiteBasedCategory,
} from '../../../helpdesk/ticketService';
import { getComplianceTemplate, getReportFilters, resetWasteReport, getWasteReports } from '../../complianceService';
import {
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  queryGeneratorWithUtc,
  arraySortByString,
  getArrayFromValuesByIdIn,
  getAllCompanies,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import filtersFields from '../../data/filtersFields.json';
import actionCodes from '../../../helpdesk/data/helpdeskActionCodes.json';
import ReportsFilterDrawer from '../../../commonComponents/reportsFilterDrawer';

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
  filterOpen, setFilterOpen, resetFilters, setResetFilters,
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

  const [regionOpen, setRegionOpen] = useState(false);
  const [regionId, setRegionId] = useState([]);
  const [regionCollapse, setRegionCollapse] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);

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

  const [customFilters, setCustomFilters] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'code');

  const isViewable = allowedOperations.includes(actionCodes['Advanced Filters']);

  const {
    siteCategoriesInfo,
    maintenanceConfigurationData, vendorsCustmonList,
  } = useSelector((state) => state.ticket);

  const { wasteReportFilters, wasteReportsInfo, complianceTemplateInfo } = useSelector((state) => state.waste);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const companies = getAllCompanies(userInfo, userRoles);

  const operationTypes = [{ id: 'Collection', name: 'Collection' }, { id: 'Disposal', name: 'Disposal' }];

  const ctOptions = [{ id: 'AOR', name: 'AOR' }, { id: 'Office', name: 'Office' }];

  const [dateValue, setDateValue] = useState([null, null]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDateValue(dates);
    if (dates && dates.length && dates[0] !== null && dates[1] !== null) {
      const start = `${moment(dates[0].$d).format('YYYY-MM-DD')}`;
      const end = `${moment(dates[1].$d).format('YYYY-MM-DD')}`;
      const filters = [{
        key: 'create_date', title: 'Created On', value: 'Custom', label: 'Created On', type: 'customdate', start, end,
      }];

      const customFilters1 = [...customFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setCustomFilters(customFilters1);
    }
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (wasteReportFilters && wasteReportFilters.customFilters) {
      setCustomFilters(wasteReportFilters.customFilters);
    }
  }, [wasteReportFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && (wasteReportFilters.customFilters && wasteReportFilters.customFilters.length)) {
      const customFiltersList = wasteReportFilters.customFilters ? queryGeneratorWithUtc(wasteReportFilters.customFilters, 'create_date', userInfo.data) : '';
      const detailFields = filtersFields.columns;
      const fields = getColumnArrayById(detailFields, 'accessor');
      dispatch(getWasteReports(companies, appModels.WASTETRACKER, fields, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [wasteReportFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && statusOpen) {
      dispatch(getComplianceTemplate(companies, appModels.WASTETRACKERTYPE, statusKeyword));
    }
  }, [userInfo, statusOpen, statusKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length) {
      setCompanyOptions(getArrayFromValuesById(userInfo.data.allowed_companies, isAssociativeArray(companyId || []), 'id'));
      const regionsGroups = userInfo.data.allowed_companies.map((cl) => ({
        id: cl.region && cl.region.id ? cl.region.id : '',
        name: cl.region && cl.region.name ? cl.region.name : '',
      }));
      const validRegions = regionsGroups && regionsGroups.length ? regionsGroups.filter((item) => item.id) : [];
      const regionsUniqueGroups = [...new Map(validRegions.map((item) => [item.id, item])).values()];
      setRegionOptions(getArrayFromValuesById(regionsUniqueGroups, isAssociativeArray(vendorId || []), 'id'));
    } else if (userInfo && userInfo.loading) {
      setCompanyOptions([{ name: 'Loading...' }]);
      setVendorOptions([{ name: 'Loading...' }]);
    } else if (userInfo && userInfo.err) {
      setCompanyOptions([]);
      setVendorOptions([]);
    } else {
      setCompanyOptions([]);
      setVendorOptions([]);
    }
  }, [userInfo]);

  useEffect(() => {
    if (complianceTemplateInfo && complianceTemplateInfo.data && complianceTemplateInfo.data.length) {
      setStatusOptions(getArrayFromValuesById(complianceTemplateInfo.data, isAssociativeArray(statusId || []), 'id'));
    } else if (complianceTemplateInfo && complianceTemplateInfo.loading) {
      setStatusOptions([{ name: 'Loading...' }]);
    } else if (complianceTemplateInfo && complianceTemplateInfo.err) {
      setStatusOptions([]);
    } else {
      setStatusOptions([]);
    }
  }, [complianceTemplateInfo]);

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

  useEffect(() => {
    if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length && catId && catId.length) {
      const subData = getArrayFromValuesByIdIn(siteCategoriesInfo.data, getColumnArrayById(catId, 'id'), 'id');
      const loadedSubData = subData && subData.length ? subData[0].sub_category_id : [];
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

  useEffect(() => {
    const customFilter = wasteReportFilters && wasteReportFilters.customFilters && wasteReportFilters.customFilters.find((cFilter) => cFilter.label === 'Today');
    if (customFilter) {
      //setSelectedDate('');
      setDateValue([null, null]);
    }
  }, [wasteReportFilters]);

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
    setStatusId(data);
    data = uniqBy(data, 'id');
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const newData = data.map((cl) => ({
      key: 'type',
      title: 'Type',
      value: cl.id,
      label: cl.name,
      type: 'inarray',
      id: cl.id,
      name: cl.name,
    }));
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'type');
    const customFiltersList = [...customFiltersOthers, ...newData];
    setCustomFilters(customFiltersList);
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

  const onOperationChange = (data) => {
    setCtName(data);
    const sVal = data && data.name ? data.name.trim() : '';
    const filters = [{
      key: 'operation', value: encodeURIComponent(sVal), label: 'Operation', type: 'text', id: data.id, name: data.name, title: 'Operation',
    }];
    const customFiltersOthers = customFilters.filter((item) => item.key !== 'operation');
    const customFiltersList = [...customFiltersOthers, ...filters];
    setCustomFilters(customFiltersList);
  };

  const onCatChange = (data) => {
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
      label: cl.name,
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
    setRegionId([]);
    setRegionOpen(false);
    const customFiltersList = customFilters.filter((item) => item.key !== 'region_id');
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
      label: cl.name,
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
    setStatusId([]);
    const customFiltersList = customFilters.filter((item) => item.key !== 'type');
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
    const customFiltersList = customFilters.filter((item) => item.key !== 'operation');
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
      dispatch(getReportFilters([]));
      setSubCatId([]);
      setVendorId([]);
      setStatusId([]);
      setCompanyId([]);
      setRegionId([]);
      setCtName('');
      dispatch(resetWasteReport());
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
    dispatch(resetWasteReport());
    dispatch(getReportFilters([]));
  };

  const onApplyFilters = () => {
    dispatch(getReportFilters(customFilters));
    setFilterOpen(false);
  };

  const getFindData = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field);
    return result || '';
  };

  const onCloseFilters = () => {
   // const findData = wasteReportFilters.customFilters.find((cFilter) => cFilter.title === 'date');
    setCustomFilters(wasteReportFilters.customFilters);
    setFilterOpen(false);
   // setSelectedDate(findData && findData.label);
  };

  const getFilteredData = (field) => {
    if (!customFilters || !Array.isArray(customFilters)) return [];
    return customFilters.filter((cFilter) => cFilter.title === field);
  };

  const filtersComponentsArray = [
    {
      title: 'By Created on *',
      component:
  <FormGroup>
    {dateFiltersFields && dateFiltersFields.dateFilters.map((tp, index) => (
      <FormControlLabel
        control={(
          <Checkbox
            id={`checkboxstateaction${index}`}
            value={tp.label}
            name={tp.label}
            disabled={wasteReportsInfo.loading}
            checked={selectedDate === tp.label}
            onChange={handleCheckboxChange}
          />
)}
        label={tp.label}
      />
    ))}
    {selectedDate === 'Custom' && (
    <Box
      sx={{
        width: '30%',
        // display: "flex",
        justifyContent: 'center',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          value={dateValue}
          onChange={(date) => onDateRangeChange(date)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </LocalizationProvider>
    </Box>
    )}
  </FormGroup>,
    },
    {
      title: 'By Operation',
      component:
  <Autocomplete
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
    value={getFindData('Operation')}
    disableClearable={!(getFindData('Operation'))}
    onChange={(e, options) => onOperationChange(options)}
    getOptionDisabled={() => wasteReportsInfo.loading}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={operationTypes}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Operation"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {getFindData('Operation') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onCtClear}
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
    }, {
      title: "By Type",
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
          value={getFilteredData('Type')}
          disableClearable={!(getFilteredData('Type') && getFilteredData('Type').length)}
          onChange={(e, options) => onStatusChange(options)}
          getOptionDisabled={() => wasteReportsInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={statusOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Type"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {(complianceTemplateInfo && complianceTemplateInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((statusKeyword && statusKeyword.length > 0) || (getFilteredData('Type') && getFilteredData('Type').length > 0)) && (
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
        />
    },
  ];
  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={(selectedDate === '') && (!(selectedDate === 'Custom' && dateValue?.[0] != null && dateValue?.[1] != null))}
        />
      </Drawer>
      { /* <Dialog maxWidth={'xl'} open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
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
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth={'xl'} open={extraModalMultiple}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalMultiple(false); }} />
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
                regionOptions={fieldName === 'region_id' ? regionOptions : ''}
                companyOptions={fieldName === 'company_id' ? companyOptions : ''}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
            </Dialog> */ }
    </>
  );
};

export default FilterSetup;
