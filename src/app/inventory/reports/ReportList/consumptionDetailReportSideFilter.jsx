/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import {
  FormFeedback,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import SearchModalMultipleStatic from '@shared/searchModals/multiSearchModelStatic';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ReportsFilterDrawer from '../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../commonComponents/dialogHeader';

import {
  getTypeId,
  getInspectionOrders, getSelectedReportDate,
} from '../../../preventiveMaintenance/ppmService';
import {
  getDepartments,
} from '../../../adminSetup/setupService';
import { getConsumptionDetailSummary, resetConsumptionDetailSummary } from '../../inventoryService';
import { getEquipmentList, getSpaceAllSearchList } from '../../../helpdesk/ticketService';
import { getProductCategoryInfo, getVendorGroups, getProductsInfo } from '../../../purchase/purchaseService';
import {
  getPartners,
} from '../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  getArrayToCommaValues,
  getDatesOfQueryInventoryReport,
  getDatesOfQueryInventoryReportV1,
  getCompanyTimezoneDate,
  getListOfModuleOperations,
  getColumnArrayString,
} from '../../../util/appUtils';
import customData1 from './customData.json';
import customData from '../data/customData.json';
import SearchModalSingle from './searchModalSingle';
import SearchModalMultiple from './searchModalMultiple';
import actionCodes from '../../data/actionCodes.json';
import { getInspectionCommenceDate } from '../../../inspectionSchedule/inspectionService';

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

const FilterConsumptionDetailReport = (props) => {
  const {
    setTableHeaders,
    tableHeaders,
    selectedDate,
    setSelectedDate,
    filterOpen,
    setFilterOpen,
    resetFilters,
    setResetFilters,
    setShowResetOption,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [customFilters, setCustomFilters] = useState({
    date: [null, null], productCategoryId: [], vendorId: [], departmentValue: [], productId: [], opType: '',
  });
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [date, changeDate] = useState(customFilters.date);
  const [datesValue, setDatesValue] = useState([]);
  const [preventiveFor, setPreventiveFor] = useState('e');
  const [scheduleValue, setScheduleValue] = useState('');

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [equipmentCollapse, setEquipmentCollapse] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [productOptions1, setProductOptions1] = useState([]);
  const [extraModal3, setExtraModal3] = useState(false);

  const [spaceOptions, setSpaceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [typeOpen, setTypeOpen] = useState(false);
  const [opTypeValue, setOpTypeValue] = useState('');

  const [addColumcCollapse, setAddColumnsCollapse] = useState(true);

  const [spaceValue, setSpaceValue] = useState([]);
  const [equipValue, setEquipValue] = useState([]);

  const [productCategoryCollapse, setProductCategoryCollapse] = useState(true);
  const [productCategoryOpen, setProductCategoryOpen] = useState(false);
  const [productCategoryKeyword, setProductCategoryKeyword] = useState('');
  const [productCategoryId, setProductCategoryId] = useState(customFilters.productCategoryId);
  const [blockOptions, setBlockOptions] = useState([]);
  const [blockOptions1, setBlockOptions1] = useState([]);

  const [productCollapse, setProductCollapse] = useState(true);
  const [productOpen, setProductOpen] = useState(false);
  const [productKeyword, setProductKeyword] = useState('');
  const [productId, setProductId] = useState(customFilters.productId);
  const [productOptions, setProductOptions] = useState([]);

  const [vendorCollapse, setVendorCollapse] = useState(true);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorId, setVendorId] = useState(customFilters.vendorId);
  const [vendorOptions, setVendorOptions] = useState([]);
  // const [selectedDate, setSelectedDate] = useState('%(current_week)s');
  const [departmentCollapse, setDepartmentCollapse] = useState(true);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');
  const [departmentValue, setDepartmentValue] = useState(customFilters.departmentValue);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);
  const [commenceDate, setCommenceDate] = useState(new Date());

  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [extraModal1, setExtraModal1] = useState(false);
  const [extraModal2, setExtraModal2] = useState(false);
  const [departmentOptions1, setDepartmentOptions1] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { equipmentInfo, spaceInfoList } = useSelector((state) => state.ticket);
  const { inspectionCommenceInfo } = useSelector((state) => state.inspection);
  const { productCategoryInfo, productsData } = useSelector((state) => state.purchase);
  const { partnersInfo } = useSelector((state) => state.equipment);
  const { consumptionDetailSummary } = useSelector((state) => state.inventory);

  const {
    departmentsInfo,
  } = useSelector((state) => state.setup);

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;

  const companies = getAllowedCompanies(userInfo);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isStock = allowedOperations.includes(actionCodes['View All Stock']);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    setSelectedDate('');
    dispatch(getSelectedReportDate());
  }, []);

  function getStartTime(startDate) {
    let res = new Date();
    if (startDate) {
      res = new Date(startDate);
      res.setHours(0);
      res.setMinutes(0);
      res.setSeconds(0);
    }
    return res;
  }

  function getEndTime(endDate) {
    let res = new Date();
    if (endDate) {
      res = new Date(endDate);
      res.setHours(23);
      res.setMinutes(59);
      res.setSeconds(59);
    }
    return res;
  }

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate && selectedDate !== 'Custom' && opTypeValue && opTypeValue.id) {
      let start = '';
      let end = '';
      const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo);
      const productCateg = getColumnArrayString(productCategoryId, 'name');
      const product = getColumnArrayString(productId, 'id');
      const vendor = getColumnArrayString(vendorId, 'name');
      const depart = getColumnArrayString(departmentValue, 'name');
      if (dates.length > 0) {
        start = dates[0];
        end = dates[1];
      }
      dispatch(getSelectedReportDate(getDatesOfQueryInventoryReport(selectedDate, userInfo)));
      dispatch(getConsumptionDetailSummary(start, end, product, productCateg, vendor, depart, opTypeValue.id, isStock));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'datetimesecs');
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && selectedDate && selectedDate === 'Custom' && opTypeValue && opTypeValue.id) {
      dispatch(resetConsumptionDetailSummary());
      dispatch(getSelectedReportDate());
      let start = '';
      let end = '';
      let selectedReportDate = '';
      // const dates = getDatesOfQueryInventoryReport(selectedDate);
      const productCateg = getColumnArrayString(productCategoryId, 'name');
      const product = getColumnArrayString(productId, 'id');
      const vendor = getColumnArrayString(vendorId, 'name');
      const depart = getColumnArrayString(departmentValue, 'name');
      if (date && date[0] && date[1] && date[0] !== null) {
        const calendarSelectedFirstDay = (getStartTime(date[0]));
        const calendarSelectedLastDay = (getEndTime(date[1]));
        const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo, calendarSelectedFirstDay, calendarSelectedLastDay);
        start = dates[0];
        end = dates[1];
        selectedReportDate = `${getCompanyTimezoneDate(calendarSelectedFirstDay, userInfo, 'date')} - ${getCompanyTimezoneDate(calendarSelectedLastDay, userInfo, 'date')}`;
      }

      if (start && end) {
        dispatch(getSelectedReportDate((selectedReportDate)));
        dispatch(getConsumptionDetailSummary(start, end, product, productCateg, vendor, depart, opTypeValue.id, isStock));
      }
    }
  }, [userInfo, customFilters]);

  const handleCheckboxChange = (event) => {
    changeDate([null, null]);
    setSelectedDate(event.target.value);
    setDatesValue([]);
  };

  useEffect(() => {
    if (productsData && productsData.data && productsData.data.length && productOpen && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
      setProductOptions(getArrayFromValuesById(productsData.data, isAssociativeArray(productId || []), 'id'));
    } else if (productsData && productsData.loading) {
      setProductOptions([{ name: 'Loading...' }]);
    } else {
      setProductOptions([]);
    }
  }, [productsData, productOpen]);

  useEffect(() => {
    if (productsData && productsData.data && productsData.data.length && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
      setProductOptions1(getArrayFromValuesById(productsData.data, isAssociativeArray(productId || []), 'id'));
    } else if (productsData && productsData.loading) {
      setProductOptions1([{ name: 'Loading...' }]);
    } else {
      setProductOptions1([]);
    }
  }, [productsData]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
        let start = '';
        let end = '';
        if (selectedDate && selectedDate !== 'Custom') {
          const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo);
          if (dates.length > 0) {
            start = dates[0];
            end = dates[1];
          }
        } else if (selectedDate && selectedDate === 'Custom') {
          if (date && date[0] && date[1] && date[0] !== null) {
            const calendarSelectedFirstDay = (getStartTime(date[0]));
            const calendarSelectedLastDay = (getEndTime(date[1]));
            const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo, calendarSelectedFirstDay, calendarSelectedLastDay);
            start = dates[0];
            end = dates[1];
          }
        }
        if (start && end) {
          await dispatch(getProductsInfo(productsListId || companies, appModels.PRODUCT, productKeyword, 'report', start, end, opTypeValue.id, getColumnArrayById(productCategoryId, 'name')));
        }
      }
    })();
  }, [userInfo, selectedDate, date, opTypeValue, productCategoryId]);

  useEffect(() => {
    if (inspectionCommenceInfo && inspectionCommenceInfo.data) {
      setCommenceDate(new Date(inspectionCommenceInfo.data[0].inspection_commenced_on));
    }
  }, [inspectionCommenceInfo]);

  useEffect(() => {
    if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length && productCategoryOpen && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
      setBlockOptions(getArrayFromValuesById(productCategoryInfo.data, isAssociativeArray(productCategoryId || []), 'id'));
    } else if (productCategoryInfo && productCategoryInfo.loading) {
      setBlockOptions([{ name: 'Loading...' }]);
    } else {
      setBlockOptions([]);
    }
  }, [productCategoryInfo, productCategoryOpen]);

  useEffect(() => {
    if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
      setBlockOptions1(getArrayFromValuesById(productCategoryInfo.data, isAssociativeArray([]), 'id'));
    } else if (productCategoryInfo && productCategoryInfo.loading) {
      setBlockOptions1([{ name: 'Loading...' }]);
    } else {
      setBlockOptions1([]);
    }
  }, [productCategoryInfo]);

  useEffect(() => {
    if (partnersInfo && partnersInfo.data && partnersInfo.data.length && vendorOpen) {
      setVendorOptions(getArrayFromValuesById(partnersInfo.data, isAssociativeArray(vendorId || []), 'id'));
    } else if (partnersInfo && partnersInfo.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [partnersInfo, vendorOpen]);

  useEffect(() => {
    if (departmentsInfo && departmentsInfo.data && departmentsInfo.data.length && departmentOpen) {
      setDepartmentOptions(getArrayFromValuesById(departmentsInfo.data, isAssociativeArray(departmentValue || []), 'id'));
    } else if (departmentsInfo && departmentsInfo.loading) {
      setDepartmentOptions([{ name: 'Loading...' }]);
    } else {
      setDepartmentOptions([]);
    }
  }, [departmentsInfo, departmentOpen]);

  useEffect(() => {
    if (departmentsInfo && departmentsInfo.data && departmentsInfo.data.length) {
      setDepartmentOptions1(getArrayFromValuesById(departmentsInfo.data, isAssociativeArray([]), 'id'));
    } else if (departmentsInfo && departmentsInfo.loading) {
      setDepartmentOptions1([{ name: 'Loading...' }]);
    } else {
      setDepartmentOptions1([]);
    }
  }, [departmentsInfo]);

  useEffect(() => {
    if (spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(spaceInfoList.data, isAssociativeArray(spaceValue || []), 'id'));
    } else if (spaceInfoList && spaceInfoList.loading) {
      setSpaceOptions([{ path_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [spaceInfoList, spaceOpen]);

  useEffect(() => {
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(equipmentInfo.data, isAssociativeArray(equipValue || []), 'id'));
    } else if (equipmentInfo && equipmentInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfo, equipmentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && opTypeValue && opTypeValue.id && ((selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && date && date.length > 1))) {
        // await dispatch(getBuildings(companies, appModels.SPACE, productCategoryKeyword));
        let start = '';
        let end = '';
        if (selectedDate && selectedDate !== 'Custom') {
          const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo);
          if (dates.length > 0) {
            start = dates[0];
            end = dates[1];
          }
        } else if (selectedDate && selectedDate === 'Custom') {
          if (date && date[0] && date[1] && date[0] !== null) {
            const calendarSelectedFirstDay = (getStartTime(date[0]));
            const calendarSelectedLastDay = (getEndTime(date[1]));
            const dates = getDatesOfQueryInventoryReportV1(selectedDate, userInfo, calendarSelectedFirstDay, calendarSelectedLastDay);
            start = dates[0];
            end = dates[1];
          }
        }
        if (start && end) {
          await dispatch(getProductCategoryInfo(companies, appModels.PRODUCTCATEGORY, productCategoryKeyword, 'report', start, end, opTypeValue.id));
        }
      }
    })();
  }, [userInfo, selectedDate, date, opTypeValue]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && departmentOpen) {
        await dispatch(getDepartments(companies, appModels.DEPARTMENT1, departmentKeyword, 'inventory'));
      }
    })();
  }, [userInfo]);

  //   useEffect(() => {
  //     (async () => {
  //       if (userInfo && userInfo.data && vendorOpen) {
  //         // await dispatch(getBuildings(companies, appModels.SPACE, productCategoryKeyword));
  //         await dispatch(getVendorGroups(companies, appModels.PURCHASEORDER, vendorKeyword));
  //         // dispatch(getVendorGroups(companies, appModels.WORKPERMIT));
  //       }
  //     })();
  //   }, [userInfo, vendorKeyword, vendorOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword, false, true));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onDepChangeModal = (data) => {
    setDepartmentValue(data);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen && productCategoryId && productCategoryId.length > 0) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      const filterValue = getArrayToCommaValues(productCategoryId, 'id');
      const filterBy = 'block_id';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim, filterBy, filterValue));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    if (userInfo.data && equipmentOpen && productCategoryId && productCategoryId.length > 0) {
      const keywordTrim = equipmentKeyword ? encodeURIComponent(equipmentKeyword.trim()) : '';
      const filterValue = getArrayToCommaValues(productCategoryId, 'id');
      const filterBy = 'block_id';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, keywordTrim, false, filterBy, filterValue));
    }
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  // useEffect(() => {
  //   if ((userInfo && userInfo.data && userInfo.data.company) && (date && date.length) && (preventiveFor) && ((spaceValue && spaceValue.length > 0) || (equipValue && equipValue.length > 0))) {
  //     let start = '';
  //     let end = '';
  //     const assetId = preventiveFor === 'e' ? getColumnArrayById(equipValue, 'id') : getColumnArrayById(spaceValue, 'id');
  //     if (date && date[0] && date[0] !== null) {
  //       start = `${moment(getStartTime(date[0])).utc().format('YYYY-MM-DD')} 23:59:59`;
  //       end = `${moment(getEndTime(date[1])).utc().format('YYYY-MM-DD')} 23:59:59`;
  //     }
  //     dispatch(getSelectedReportDate(getDatesOfQueryInventoryReport(selectedDate, userInfo)));
  //     dispatch(getConsumptionDetailSummary(start, end, preventiveFor, assetId, commenceDate));

  //   }
  // }, [userInfo, date, preventiveFor, spaceValue, equipValue]);

  function getDifferece(date1, date2) {
    // const date1 = new Date();
    const DifferenceInTime = date2.getTime() - date1.getTime();
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    return DifferenceInDays;
  }

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    let disable = false;
    const subnoofdays = commenceDate ? getDifferece(new Date(datesValue[0]), new Date(commenceDate)) : 0;
    if (subnoofdays > 0 && subnoofdays < 30) {
      const days = Math.abs(subnoofdays);
      const tooLates = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > (days + 1);
      const tooEarlys = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > (days + 1);
      disable = tooEarlys || tooLates;
    } else {
      const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 30;
      const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 30;
      disable = tooEarly || tooLate;
    }
    return disable;
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDatesValue(dates);
    setScheduleValue('');
  };

  const oTypeChange = (data) => {
    setProductCategoryId([]);
    setProductId([]);
    setOpTypeValue(data);
  };

  const onTypeClear = () => {
    setTypeOpen(false);
    setOpTypeValue('');
    setProductCategoryId([]);
    setProductId([]);
  };

  const onVendorKeywordClear = () => {
    // dispatch(resetWarrentyAgeReport());
    setVendorKeyword('');
    setVendorId([]);
    setDepartmentValue([]);
    setVendorOpen(false);
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

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space');
    setModalName('Spaces');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'path_name', 'space_name', 'block_id']);
  };

  const handleResetClick = () => {
    const list = [...tableHeaders];
    list.forEach((x) => {
      if (x.valueKey) {
        x.isChecked = false;
      }
    });
    setScheduleValue();
    setPreventiveFor('e');
    setSelectedDate('');
    setSpaceValue([]);
    setEquipValue([]);
    setProductCategoryId([]);
    setVendorId([]);
    setProductId([]);
    setDepartmentValue([]);
    setOpTypeValue('');
    changeDate([null, null]);
    dispatch(resetConsumptionDetailSummary());
    dispatch(getTypeId({
      date: [null, null], productCategoryId: [], vendorId: [], departmentValue: [], productId: [], opType: '',
    }));
  };
  const onProductCategoryChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setProductCategoryId(data);
    setProductId([]);
  };

  const onVendorChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setVendorId(data);
  };

  const onDepartmentChange = (data) => {
    // dispatch(resetMailRoomReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setDepartmentValue(data);
  };

  const onBlockClear = () => {
    setProductCategoryKeyword(null);
    setProductCategoryId([]);
    setProductId([]);
    setProductCategoryOpen(false);
  };

  const onVendorClear = () => {
    setProductCategoryKeyword(null);
    setVendorId([]);
    setProductCategoryOpen(false);
  };

  const onDepartmentClear = () => {
    setProductCategoryKeyword(null);
    setDepartmentValue([]);
    setProductCategoryOpen(false);
  };

  const showDepartmentModal = () => {
    setFieldName('department_id');
    setExtraModal2(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Departments');
    setOldValues(departmentValue);
  };

  const showProductCategoryModal = () => {
    setFieldName('category_id');
    setExtraModal1(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Categories');
    setOldValues(productCategoryId);
  };

  const onBlockChangeModal = (data) => {
    setProductCategoryId(data);
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setEquipValue([]);
    setSpaceValue(data);
    setScheduleValue('');
  };

  const onScheduleChangeModal = (data) => {
    setScheduleValue(data);
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEquipValue(data);
    setSpaceValue([]);
    setScheduleValue('');
  };

  const onEquipmentChangeModal = (data) => {
    setEquipValue(data);
    setSpaceValue([]);
    setScheduleValue('');
  };

  const onSpaceChangeModal = (data) => {
    setEquipValue([]);
    setScheduleValue('');
    setSpaceValue(data);
  };

  const onVendorChangeModal = (data) => {
    setVendorId(data);
  };

  const onDepartmentChangeModal = (data) => {
    setDepartmentValue(data);
  };

  const onProductCategoryChangeModal = (data) => {
    setProductCategoryId(data);
    setProductId([]);
  };

  const onProdutChangeModal = (data) => {
    setProductId(data);
  };


  const onProductChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setProductId(data);
  };

  const onProductClear = () => {
    setProductKeyword(null);
    setProductId([]);
    setProductOpen(false);
  };

  const showProductModal = () => {
    setFieldName('product_ids');
    setExtraModal3(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Product List');
    setOldValues(productId);
  };

  const onProductChangeModal = (data) => {
    setProductId(data);
  };

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY DATE FILTER
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <div>
    {customData.reportFilterSmart.map((tp, index) => (
      <FormControlLabel
        control={(
          <Checkbox
            id={`checkboxstateaction${index}`}
            value={tp.label}
            name={tp.label}
            checked={selectedDate === tp.label}
            onChange={handleCheckboxChange}
          />
              )}
        label={tp.label}
      />
    ))}
    {selectedDate === 'Custom' ? (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateRangePicker']}>
            <DateRangePicker
              localeText={{ start: 'Start Date', end: 'End Date' }}
              onChange={onDateRangeChange}
              shouldDisableDate={disabledDate}
              value={date}
              format="DD-MM-YYYY"
              slotProps={{
                actionBar: {
                  actions: ['clear'],
                },
                field: {
                  readOnly: true,
                },
              }}
            />
          </DemoContainer>
          {!date || date && date.length && date[0] === null && date[1] === null && (
          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
          )}
        </LocalizationProvider>
      </div>
    ) : ''}
  </div>,
    },
    {
      title: (
        <span>
          BY OPERATION TYPE
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <Autocomplete
    size="small"
    name="block"
    open={typeOpen}
    onOpen={() => {
      setTypeOpen(true);
    }}
    onClose={() => {
      setTypeOpen(false);
    }}
    value={opTypeValue && opTypeValue.name ? opTypeValue.name : ''}
    disableClearable={!opTypeValue}
    onChange={(e, options) => oTypeChange(options)}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={customData1.types}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className={(opTypeValue)
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        placeholder="Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {(opTypeValue) && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onTypeClear}
                >
                  <BackspaceIcon fontSize="small" />
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
      title: (
        <span>
          BY PRODUCT CATEGORY
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={productCategoryOpen}
    onOpen={() => {
      setProductCategoryOpen(true);
      setProductCategoryKeyword('');
    }}
    onClose={() => {
      setProductCategoryOpen(false);
      setProductCategoryKeyword('');
    }}
    value={productCategoryId}
    disableClearable={!(productCategoryId.length)}
    onChange={(e, options) => onProductCategoryChange(options)}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    options={blockOptions}
    renderOption={(option) => (
      <div>
        <h6>{option.name}</h6>
        <p className="float-left font-tiny">
          {option.display_name && (
          <>
            {option.display_name}
          </>
          )}
        </p>
      </div>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className={(((productCategoryId && productCategoryId.length > 0)) || (productCategoryKeyword && productCategoryKeyword.length > 0))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        placeholder={productCategoryId && productCategoryId.length > 0 ? '' : 'Search & Select'}
        onChange={(e) => setProductCategoryKeyword(e.target.value)}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {(productCategoryInfo && productCategoryInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
              <InputAdornment position="end">
                {((productCategoryKeyword && productCategoryKeyword.length > 0) || (productCategoryId && productCategoryId.length > 0)) && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onBlockClear}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showProductCategoryModal}
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
      title: 'BY PRODUCT',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filled"
    size="small"
    name="block"
    open={productOpen}
    onOpen={() => {
      setProductOpen(true);
      setProductKeyword('');
    }}
    onClose={() => {
      setProductOpen(false);
      setProductKeyword('');
    }}
    value={productId}
    classes={{
      option: classes.option,
    }}
    disableClearable={!(productId.length)}
    onChange={(e, options) => onProductChange(options)}
    getOptionSelected={(option, value) => option.name === value.name}
    getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} ${option.unique_code ? `| ${option.unique_code}` : ''}`)}
    options={productOptions}
    renderOption={(option) => (
      <div>
        <h6>
          {option.name}
          {option.unique_code && (
          <>
            {'  '}
            |
            <span className="ml-1">{option.unique_code}</span>
          </>

          )}
        </h6>
        <p className="float-left font-tiny">
          {option.brand && (
          <>
            {option.brand}
          </>
          )}
        </p>
      </div>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className={(((productId && productId.length > 0)) || (productKeyword && productKeyword.length > 0))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        placeholder={productId && productId.length > 0 ? '' : 'Search & Select'}
        onChange={(e) => setProductKeyword(e.target.value)}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {(productsData && productsData.loading) ? <CircularProgress color="inherit" size={20} /> : null}
              <InputAdornment position="end">
                {((productKeyword && productKeyword.length > 0) || (productId && productId.length > 0)) && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onProductClear}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={showProductModal}
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
      title: 'BY VENDOR',
      component:
  <>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledvendor"
      name={vendorId.name}
      label={vendorId.label}
      formGroupClassName="m-1"
      open={vendorOpen}
      size="small"
      onOpen={() => {
        setVendorOpen(true);
        setVendorKeyword('');
      }}
      onClose={() => {
        setVendorOpen(false);
        setVendorKeyword('');
      }}
      classes={{
        option: classes.option,
      }}
      value={vendorId}
      loading={partnersInfo && partnersInfo.loading}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      onChange={(e, options, action, value) => onVendorChange(options, action, value)}
      options={vendorOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={onVendorKeywordChange}
          variant="outlined"
          value={vendorKeyword}
          className={((vendorKeyword && vendorKeyword.length > 0) || (vendorId && vendorId.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder={vendorId && vendorId.length > 0 ? '' : 'Search & Select'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((vendorKeyword && vendorKeyword.length > 0) || (vendorId && vendorId.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onVendorClear}
                  >
                    <BackspaceIcon fontSize="small" />
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
    />
    {(partnersInfo && partnersInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(partnersInfo)}</FormFeedback>
    )}
  </>,

    },
    {
      title: 'BY DEPARTMENT',
      component:
  <>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filleddepartment"
      name="department"
      open={departmentOpen}
      size="small"
      onOpen={() => {
        setDepartmentOpen(true);
        setDepartmentKeyword('');
      }}
      onClose={() => {
        setDepartmentOpen(false);
        setDepartmentKeyword('');
      }}
      value={departmentValue}
      disableClearable={!(departmentValue.length)}
      onChange={(e, options) => onDepartmentChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={departmentOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={departmentKeyword}
          className={((departmentValue && departmentValue.length > 0) || (departmentKeyword && departmentKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder={departmentValue && departmentValue.length > 0 ? '' : 'Search & Select'}
          onChange={(e) => setDepartmentKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((departmentValue && departmentValue.length > 0) || (departmentKeyword && departmentKeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onDepartmentClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showDepartmentModal}
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
    {(date && date.length) && (departmentsInfo && departmentsInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(departmentsInfo)}</FormFeedback>
    )}
  </>,
    },
  ];

  const onApplyFilters = () => {
    setFilterOpen(false);
    setCustomFilters({
      date, productCategoryId, departmentValue, vendorId, productId, selectedDate, opType: opTypeValue,
    });
    dispatch(getTypeId({
      date, productCategoryId, vendorId, departmentValue, productId, selectedDate, opType: opTypeValue,
    }));
  };
  const onCloseFilters = () => {
    changeDate(customFilters.date);
    setProductId(customFilters.productId);
    setProductCategoryId(customFilters.productCategoryId);
    setDepartmentValue(customFilters.departmentValue);
    setVendorId(customFilters.vendorId);
    setSelectedDate(customFilters.selectedDate);
    setFilterOpen(false);
  };

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      handleResetClick();
      setSelectedDate('');
      dispatch(getSelectedReportDate());
    }
  }, [resetFilters]);

  useEffect(() => {
    if (customFilters && ((customFilters.departmentValue && customFilters.departmentValue.length > 0)
      || (customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null)
      || (customFilters.productCategoryId && customFilters.productCategoryId.length > 0)
      || (customFilters.productId && customFilters.productId.length > 0)
      || (customFilters.vendorId && customFilters.vendorId.length > 0)
      || selectedDate
    )) {
      setShowResetOption(true);
    }
  }, [customFilters]);

  useEffect(() => {
    setCustomFilters({
      date: [null, null], productCategoryId: [], vendorId: [], departmentValue: [], productId: [], opType: '',
    });
    setSelectedDate('');
    dispatch(resetConsumptionDetailSummary());
  }, []);

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!((selectedDate && selectedDate !== 'Custom' || (selectedDate === 'Custom' && date && date.length && date[0] !== null && date[1] !== null)) && (opTypeValue && opTypeValue.id) && (productCategoryId && productCategoryId.length > 0))}
        />
      </Drawer>

      <Dialog maxWidth="xl" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <SearchModalSingle
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            // onEquipmentChange={onEquipmentChangeModal}
            // onSpaceChange={onSpaceChangeModal}
            // onScheduleChange={onScheduleChangeModal}
            onDepartmentChange={onDepartmentChangeModal}
            onProductCategoryChange={onProductCategoryChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldEquipValues={equipValue}
            oldSpaceValues={spaceValue}
            blockValues={getArrayToCommaValues(productCategoryId, 'id')}
            oldProductCategoryValues={productCategoryId}
            oldProductValues={productId}
            onProductChange={onProductChangeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="xl" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            onCategoryChange={onVendorChangeModal}
            oldCategoryValues={vendorId}
          />
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="xl" open={extraModal1}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <SearchModalMultipleStatic
            afterReset={() => { setExtraModal1(false); }}
            fieldName={fieldName}
            fields={columns}
            headers={headers}
            data={blockOptions1}
            modalName={modalName}
            dataChange={onProductCategoryChangeModal}
            oldValues={oldValues}
          />
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="xl" open={extraModal2}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal2(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <SearchModalMultipleStatic
            afterReset={() => { setExtraModal2(false); }}
            fieldName={fieldName}
            fields={columns}
            headers={headers}
            data={departmentOptions1}
            modalName={modalName}
            dataChange={onDepChangeModal}
            oldValues={oldValues}
          />
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="xl" open={extraModal3}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal3(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <SearchModalMultipleStatic
            afterReset={() => { setExtraModal3(false); }}
            fieldName={fieldName}
            fields={columns}
            headers={headers}
            data={productOptions1}
            modalName={modalName}
            dataChange={onProdutChangeModal}
            oldValues={oldValues}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterConsumptionDetailReport;
