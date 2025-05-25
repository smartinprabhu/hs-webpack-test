/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@mui/material/Table';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import uniqBy from 'lodash/unionBy';
import Drawer from "@mui/material/Drawer";
import { Box } from '@mui/system';
import PantryBlue from '@images/icons/pantry/pantryBlue.svg';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import TableListFormat from '@shared/tableListFormat';
import CreateList from '@shared/listViewFilters/create';
import ExportList from '@shared/listViewFilters/export';
import SearchList from '@shared/listViewFilters/search';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import DynamicColumns from '@shared/filters/dynamicColumns';
import CustomTable from '@shared/customTable';
import StaticCheckboxFilter from '@shared/filters/staticCheckboxFilter';
import DynamicCheckboxFilter from '@shared/filters/dynamicCheckboxFilter';
import DetailViewFormat from '@shared/detailViewFormat';
import CollapseImg from '@shared/sideTools/collapseImg';
import CardTitleCustom from '@shared/sideTools/cardTitleCustom';
import Refresh from '@shared/listViewFilters/refresh';
import Header from '../core/header/header';
import CommonGrid from '../commonComponents/commonGrid';
import { OrderColumns } from '../commonComponents/gridColumns';
import DrawerHeader from "../commonComponents/drawerHeader";

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById,
  isArrayValueExists, getCompanyTimezoneDate,
  getArrayFromValuesByItem, getListOfOperations, extractTextObject, getDefaultNoValue, truncate, getDateAndTimeForDifferentTimeZones, queryGeneratorWithUtc,
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../util/appUtils';
import {
  getOrderStateLabel,
} from './utils/utils';
import {
  getPantryCount, getPantryList,
  getPantryFilters, getPantryDetail,
  getProductsGroups, resetCreateOrder,
  resetUpdateOrder, getPantryGroups,
  getSpaceGroups, getPantryListExport,
} from './pantryService';
import {
  setInitialValues,
} from '../purchase/purchaseService';
import { getSelectedProducts } from '../inventory/inventoryService';
import Navbar from './navbar/navbar';
import PantryDetail from './pantryDetail/pantryDetail';
import DataExport from './dataExport/dataExport';
import AddOrder from './addOrder';
import actionCodes from './configuration/data/actionCodes.json';
import { PantryModule } from '../util/field';
import ordersNav from './navbar/navlist.json';
import PantryDetails from './pantryDetails/pantryDetails';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Orders = () => {
  const limit = 10;
  const subMenu = 'Orders';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);

  const [scrollDataList, setScrollData] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [partsData, setPartsData] = useState([]);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [spaceGroups, setSpaceGroups] = useState([]);

  const [viewModal, setViewModal] = useState(0);

  const [employeeGroups, setEmployeeGroups] = useState([]);
  const [pantryGroups, setPantryGroups] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [addModal, setAddModal] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [openEmployeeId, setOpenEmployeeId] = useState(false);
  const [openPantry, setOpenPantry] = useState(false);
  const [openSpace, setOpenSpace] = useState(false);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { pinEnableData } = useSelector((state) => state.auth);
  const companies = getAllowedCompanies(userInfo);
  const {
    pantryCount, pantryListInfo, pantryCountLoading,
    pantryFilters, pantryDetails, employeeGroupsInfo,
    addOrderInfo, updateOrderInfo, pantryGroupsInfo,
    spaceGroupsInfo, pantryExport,
  } = useSelector((state) => state.pantry);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const searchColumns = PantryModule.ordersSearchColumn;
  const hiddenColumns = PantryModule.ordersHiddenColumn;
  const advanceSearchColumns = PantryModule.ordersAdvanceSearchColumn;

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(() => (pantryListInfo.data ? pantryListInfo.data : [{}]), [pantryListInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    allColumns,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  const advanceSearchjson = {
    state: setOpenStatus,
    employee_id: setOpenEmployeeId,
    pantry_id: setOpenPantry,
    space_id: setOpenSpace,
  };

  useEffect(() => {
    if (openStatus || openPantry) {
      setKeyword('');
    }
  }, [openStatus]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        employee_id: true,
        pantry_id: true,
        space_id: true,
        state: true,
        ordered_on: false,
        confirmed_on: false,
        cancelled_on: false,
        delivered_on: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (pantryCount && pantryCount.length)) {
      const offsetValues = 0;
      // setPdfBody([]);
      const customFiltersQuery = pantryFilters && pantryFilters.customFilters ? queryGeneratorV1(pantryFilters.customFilters) : '';
      dispatch(getPantryListExport(companies, appModels.PANTRYORDER, pantryCount.length, offsetValues, PantryModule.ordersAPiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, pantryCount, startExport]);

  useEffect(() => {
    if ((userInfo && userInfo.data && openPantry)) {
      dispatch(getPantryGroups(companies, appModels.PANTRYORDER));
    }
  }, [userInfo, openPantry]);

  useEffect(() => {
    if ((userInfo && userInfo.data && openEmployeeId)) {
      dispatch(getProductsGroups(companies, appModels.PANTRYORDER));
    }
  }, [userInfo, openEmployeeId]);

  useEffect(() => {
    if ((userInfo && userInfo.data && openSpace)) {
      dispatch(getSpaceGroups(companies, appModels.PANTRYORDER));
    }
  }, [userInfo, openSpace]);

  // useEffect(() => {
  //   if (pantryFilters && (!pantryFilters.customFilters || !pantryFilters.customFilters.length)) {
  //     const filters = [{
  //       key: 'state', title: 'Status', value: 'Ordered', label: 'Ordered', type: 'inarray',
  //     }];
  //     dispatch(getPantryFilters(filters));
  //   }
  // }, []);

  useEffect(() => {
    if (employeeGroupsInfo && employeeGroupsInfo.data) {
      setEmployeeGroups(employeeGroupsInfo.data);
    }
  }, [employeeGroupsInfo]);

  useEffect(() => {
    if (pantryGroupsInfo && pantryGroupsInfo.data) {
      setPantryGroups(pantryGroupsInfo.data);
    }
  }, [pantryGroupsInfo]);

  useEffect(() => {
    if (spaceGroupsInfo && spaceGroupsInfo.data) {
      setSpaceGroups(spaceGroupsInfo.data);
    }
  }, [spaceGroupsInfo]);

  /* useEffect(() => {
    if (addOrderInfo && addOrderInfo.data) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorV1(pantryFilters.customFilters) : '';
      dispatch(getPantryCount(companies, appModels.PANTRYORDER, customFiltersList));
      dispatch(getPantryList(companies, appModels.PANTRYORDER, limit, offset, customFiltersList, sortBy, sortField));
    }
  }, [addOrderInfo]); */

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPantryCount(companies, appModels.PANTRYORDER, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters, addOrderInfo, updateOrderInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPantryList(companies, appModels.PANTRYORDER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue, customFilters, addOrderInfo, updateOrderInfo, reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPantryList(companies, appModels.PANTRYORDER, limit, offsetValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offsetValue, sortedValue, customFilters, scrollTop]);

  // useEffect(() => {
  //   if (pantryFilters && pantryFilters.customFilters) {
  //     setCustomFilters(pantryFilters.customFilters);
  //     const vid = isArrayValueExists(pantryFilters.customFilters, 'type', 'id');
  //     if (vid) {
  //       if (viewId !== vid) {
  //         const datas = pantryFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(vid));
  //         setCustomFilters(datas);
  //         dispatch(getPantryFilters(datas));
  //         setViewId(vid);
  //         dispatch(setInitialValues(false, false, false, false));
  //       }
  //     }
  //   }
  // }, [pantryFilters]);

  useEffect(() => {
    if (pantryFilters && pantryFilters.customFilters) {
      setCustomFilters(pantryFilters.customFilters);
      const vid = isArrayValueExists(pantryFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false, false));
        }
      }
    }
  }, [pantryFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPantryList(companies, appModels.PANTRYORDER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [viewId]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getPantryDetail(viewId, appModels.PANTRYORDER));
    }
  }, [viewId]);

  useEffect(() => {
    if (addOrderInfo && addOrderInfo.data && addOrderInfo.data.length && !viewId) {
      dispatch(getPantryDetail(addOrderInfo.data[0], appModels.PANTRYORDER));
    }
  }, [addOrderInfo]);

  useEffect(() => {
    if (pantryListInfo && pantryListInfo.data && viewId) {
      const arr = [...scrollDataList, ...pantryListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [pantryListInfo, viewId]);

  const totalDataCount = pantryCount && pantryCount.length ? pantryCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const dataValue = pantryListInfo && pantryListInfo.data ? pantryListInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = pantryListInfo && pantryListInfo.data ? pantryListInfo.data : [];
      const ids = getColumnArrayById(dataValue, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        Header: value,
        id: value,
      },
    ];
    const oldCustomFilters = pantryFilters && pantryFilters.customFilters
      ? pantryFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getPantryFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
          Header: value,
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = pantryFilters && pantryFilters.customFilters
        ? pantryFilters.customFilters
        : [];
      const filterValues = {
        states:
          pantryFilters && pantryFilters.states ? pantryFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getPantryFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = pantryFilters && pantryFilters.customFilters
        ? pantryFilters.customFilters
        : [];
      const filterValues = {
        states:
          pantryFilters && pantryFilters.states ? pantryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getPantryFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getPantryFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPantryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleEmployeeChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'employee_id', title: 'Employee', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
      removeData('data-employee_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getPantryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handlePantryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'pantry_id', title: 'Pantry', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
      removeData('data-pantry_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getPantryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleSpaceChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'space_id', title: 'Space', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersList));
      removeData('data-space_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getPantryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onLoadPantry = (eid) => {
    if (eid && pantryDetails && pantryDetails.data) {
      const filters = [{
        key: 'id',
        value: eid,
        label: pantryDetails.data[0].name,
        type: 'id',
      }];
      const customFiltersLoad = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersLoad));
      setAddModal(false);
      setScrollData([]);
      dispatch(resetCreateOrder());
      dispatch(resetUpdateOrder());
    }
  };

  function getNextPreview(ids, types) {
    const array = pantryListInfo && pantryListInfo.data ? pantryListInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (types === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const addOrderWindow = () => {
    setAddModal(true);
  };

  const onUpdateReset = () => {
    setViewId(false);
    setViewModal(true);
    setEditId(false);
    setAddModal(false);
    showEditModal(false);
    dispatch(resetUpdateOrder());
    dispatch(setInitialValues(false, false, false, false));
    if (updateOrderInfo && updateOrderInfo.data) {
      dispatch(getPantryDetail(editId, appModels.PANTRYORDER));
    }
  };

  const onViewReset = () => {
    if (document.getElementById('pantryOrderForm')) {
      document.getElementById('pantryOrderForm').reset();
    }
    setViewId(false);
    setViewModal(false);
    setAddModal(false);
    showEditModal(false);
    dispatch(resetCreateOrder());
    dispatch(resetUpdateOrder());
  };

  const onAddReset = () => {
    setAddModal(false);
    dispatch(resetCreateOrder());
    dispatch(resetUpdateOrder());
  };

  const onClickClear = () => {
    dispatch(getPantryFilters([]));
    dispatch(setInitialValues(false, false, false, false));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? key.key : key.id,
          title: key.title ? key.title : key.Header,
          value: encodeURIComponent(key.value),
          label: key.label ? key.label : key.Header,
          type: key.type ? key.type : text,
          arrayLabel: key.label,
        };
        if (key.start && key.end) {
          filters.start = key.start;
          filters.end = key.end;
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(1);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getPantryFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getPantryFilters([]));
    setOffset(0);
    setPage(1);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getPantryFilters(customFilters1));
    setOffset(0);
    setPage(1);
    setOffsetValue(0);
    setScrollData([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const scrollListCount = scrollDataList && scrollDataList.length ? scrollDataList.length : 0;
    if ((pantryListInfo && !pantryListInfo.loading) && bottom && (totalDataCount !== scrollListCount) && (totalDataCount >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const stateValuesList = (pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.length > 0) ? pantryFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.length > 0) ? pantryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (pantryListInfo && pantryListInfo.loading) || (pantryCountLoading);

  const viewData = pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? pantryDetails.data[0] : false;

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    const fields = [
      'name',
      'employee_id',
      'pantry_id',
      'space_id',
      'state',
    ];
    let query = '"|","|","|","|",';

    const oldCustomFilters = pantryFilters && pantryFilters.customFilters
      ? pantryFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length) {
      fields.filter((field) => {
        query += `["${field}","ilike","${data.quickFilterValues[0]}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'columnField'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getPantryFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getPantryFilters(customFilters));
    }
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Pantry Management',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Orders',
    );
  }

  return (
    <Box className={pinEnableData ? 'content-box-expand' : 'content-box'}>
      <Header
        headerPath="Pantry"
        nextPath="Orders"
        pathLink="/pantry-overview"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      />
      <CommonGrid
        className="tickets-table"
        sx={{
          height: '90%',
        }}
        tableData={
        pantryListInfo && pantryListInfo.data && pantryListInfo.data.length
          ? pantryListInfo.data
          : []
      }
        columns={OrderColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Orders"
        exportFileName="Pantry_Orders"
        listCount={totalDataCount}
        exportInfo={{ err: pantryExport.err, loading: pantryExport.loading, data: pantryExport.data ? pantryExport.data : false }}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => setAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={onFilterChange}
        loading={pantryListInfo && pantryListInfo.loading}
        err={pantryListInfo && pantryListInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
      />
      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? (pantryDetails.data[0].name) : 'Name'}
          imagePath={false}
          onClose={onViewReset}
        />
        <PantryDetails />
      </Drawer>
    </Box>

  // <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border pantry-module">
  //   <Col sm="12" md="12" lg="12" xs="12">
  //     <Row>
  //       <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
  //         <Card className="p-2 mb-2 h-100 bg-lightblue">
  //           <CardBody className="bg-color-white p-1 m-0">
  //             <Row className="p-2 itAsset-table-title">
  //               <Col md="9" xs="12" sm="9" lg="9">
  //                 <span className="p-0 mr-2 font-weight-800 font-medium">
  //                   Orders List :
  //                   {' '}
  //                   {columnHide && columnHide.length && totalDataCount}
  //                 </span>
  //                 {columnHide && columnHide.length && customFilters && customFilters.length ? (
  //                   <div className="content-inline">
  //                     {customFilters && customFilters.length && customFilters.map((cf) => (
  //                       <p key={cf.value} className="mr-2 content-inline">
  //                         <Badge color="dark" className="p-2 mb-1 bg-zodiac">
  //                           {(cf.type === 'inarray') ? (
  //                             <>
  //                               {cf.title}
  //                               <span>
  //                                 {'  '}
  //                                 :
  //                                 {' '}
  //                                 {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
  //                               </span>
  //                             </>
  //                           ) : (
  //                             cf.label
  //                           )}
  //                           {' '}
  //                           {(cf.type === 'text' || cf.type === 'id') && (
  //                           <span>
  //                             {'  '}
  //                             :
  //                             {' '}
  //                             {decodeURIComponent(cf.value)}
  //                           </span>
  //                           )}
  //                           {(cf.type === 'customdate') && (
  //                           <span>
  //                             {'  '}
  //                             :
  //                             {' '}
  //                             {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
  //                             {' - '}
  //                             {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
  //                           </span>
  //                           )}
  //                           <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
  //                         </Badge>
  //                       </p>
  //                     ))}
  //                     {customFilters && customFilters.length ? (
  //                       <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
  //                         Clear
  //                       </span>
  //                     ) : ''}
  //                   </div>
  //                 ) : ''}
  //               </Col>
  //               <Col md="3" xs="12" sm="3" lg="3">
  //                 <div className="float-right">
  //                   <Refresh
  //                     loadingTrue={loading}
  //                     setReload={setReload}
  //                   />
  //                   <ListDateFilters customFilters={customFilters} handleCustomFilterClose={handleCustomFilterClose} dateFilters={dateFilters} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
  //                   <CreateList name="Add Order" showCreateModal={addOrderWindow} />
  //                   <ExportList response={pantryListInfo && pantryListInfo.data && pantryListInfo.data.length} />
  //                   <DynamicColumns
  //                     setColumns={setColumns}
  //                     columnFields={columnFields}
  //                     allColumns={allColumns}
  //                     setColumnHide={setColumnHide}
  //                   />
  //                 </div>
  //                 {pantryListInfo && pantryListInfo.data && pantryListInfo.data.length && (
  //                   <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
  //                     <PopoverHeader>
  //                       Export
  //                       <img
  //                         src={closeCircleIcon}
  //                         aria-hidden="true"
  //                         className="cursor-pointer mr-1 mt-1 float-right"
  //                         onClick={() => dispatch(setInitialValues(false, false, false, false))}
  //                         alt="close"
  //                       />
  //                     </PopoverHeader>
  //                     <PopoverBody>
  //                       <DataExport
  //                         afterReset={() => dispatch(setInitialValues(false, false, false, false))}
  //                         fields={columnFields}
  //                         sortedValue={sortedValue}
  //                         rows={checkedRows}
  //                         apiFields={PantryModule.ordersAPiFields}
  //                       />
  //                     </PopoverBody>
  //                   </Popover>
  //                 )}
  //               </Col>
  //             </Row>
  //             {(pantryListInfo && pantryListInfo.data) && (
  //             <span data-testid="success-case" />
  //             )}
  //             <div className="thin-scrollbar">
  //               <div className="table-responsive common-table">
  //                 <Table responsive {...getTableProps()} className="mt-2">
  //                   <CustomTable
  //                     isAllChecked={isAllChecked}
  //                     handleTableCellAllChange={handleTableCellAllChange}
  //                     searchColumns={searchColumns}
  //                     advanceSearchColumns={advanceSearchColumns}
  //                     advanceSearchFunc={advanceSearchjson}
  //                     onChangeFilter={onChangeFilter}
  //                     removeData={removeData}
  //                     setKeyword={setKeyword}
  //                     handleTableCellChange={handleTableCellChange}
  //                     checkedRows={checkedRows}
  //                     setViewId={setViewId}
  //                     setViewModal={setViewModal}
  //                     tableData={pantryListInfo}
  //                     stateLabelFunction={getOrderStateLabel}
  //                     tableProps={{
  //                       page,
  //                       prepareRow,
  //                       getTableBodyProps,
  //                       headerGroups,
  //                     }}
  //                   />
  //                 </Table>
  //                 {openStatus && (
  //                 <StaticCheckboxFilter
  //                   selectedValues={stateValues}
  //                   data={customData && customData.pantryStates ? customData.pantryStates : []}
  //                   onCheckboxChange={handleStatusCheckboxChange}
  //                   target="data-state"
  //                   title="Status"
  //                   openPopover={openStatus}
  //                   toggleClose={() => setOpenStatus(false)}
  //                   setDataGroup={setStatusGroups}
  //                   dataGroup={statusGroups}
  //                   keyword={keyword}
  //                 />
  //                 )}
  //                 {openEmployeeId && (
  //                 <DynamicCheckboxFilter
  //                   data={employeeGroupsInfo}
  //                   selectedValues={stateValues}
  //                   dataGroup={employeeGroups}
  //                   filtervalue="employee_id"
  //                   onCheckboxChange={handleEmployeeChange}
  //                   toggleClose={() => setOpenEmployeeId(false)}
  //                   openPopover={openEmployeeId}
  //                   target="data-employee_id"
  //                   title="Employee"
  //                   keyword={keyword}
  //                   setDataGroup={setEmployeeGroups}
  //                 />
  //                 )}
  //                 {openPantry && (
  //                 <DynamicCheckboxFilter
  //                   data={pantryGroupsInfo}
  //                   selectedValues={stateValues}
  //                   dataGroup={pantryGroups}
  //                   filtervalue="pantry_id"
  //                   onCheckboxChange={handlePantryChange}
  //                   toggleClose={() => setOpenPantry(false)}
  //                   openPopover={openPantry}
  //                   target="data-pantry_id"
  //                   title="Pantry"
  //                   keyword={keyword}
  //                   setDataGroup={setPantryGroups}
  //                 />
  //                 )}
  //                 {openSpace && (
  //                 <DynamicCheckboxFilter
  //                   data={spaceGroupsInfo}
  //                   selectedValues={stateValues}
  //                   dataGroup={spaceGroups}
  //                   filtervalue="space_id"
  //                   onCheckboxChange={handleSpaceChange}
  //                   toggleClose={() => setOpenSpace(false)}
  //                   openPopover={openSpace}
  //                   target="data-space_id"
  //                   title="Space"
  //                   keyword={keyword}
  //                   setDataGroup={setSpaceGroups}
  //                 />
  //                 )}
  //                 {columnHide && columnHide.length ? (
  //                   <TableListFormat
  //                     userResponse={userInfo}
  //                     listResponse={pantryListInfo}
  //                     countLoad={pantryCountLoading}
  //                   />
  //                 ) : ''}
  //               </div>
  //               {columnHide && !columnHide.length ? (
  //                 <div className="text-center mb-4">
  //                   Please select the Columns
  //                 </div>
  //               ) : ''}
  //               {loading || pages === 0 ? (<span />) : (
  //                 <div className={`${classes.root} float-right`}>
  //                   {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
  //                 </div>
  //               )}
  //             </div>
  //           </CardBody>
  //         </Card>
  //       </Col>
  //     </Row>
  //   </Col>
  //   <Drawer
  //     title=""
  //     closable={false}
  //     width={1250}
  //     className="drawer-bg-lightblue"
  //     visible={viewModal}
  //   >
  //     <DrawerHeader
  //       title={pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0)
  //         ? (pantryDetails.data[0].name) : 'Name'}
  //       imagePath={false}
  //       isEditable={(allowedOperations.includes(actionCodes['Edit Pantry']) && (pantryDetails && !pantryDetails.loading))}
  //       actionAllowed={viewData.state}
  //       actionText={customData && customData.disableEditButton ? customData.disableEditButton : []}
  //       closeDrawer={() => onViewReset()}
  //       onEdit={() => { setEditId(pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? pantryDetails.data[0].id : false); showEditModal(true); }}
  //       onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
  //       onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}

  //     />
  //     <PantryDetail />
  //   </Drawer>
  //   <Drawer
  //     title=""
  //     className="drawer-bg-lightblue"
  //     closable={false}
  //     width={1250}
  //     visible={editModal}
  //   >
  //     <DrawerHeader
  //       title="Update Order"
  //       imagePath={PantryBlue}
  //       closeDrawer={() => onUpdateReset()}
  //     />
  //     <AddOrder editId={editId} setAddModal={() => onUpdateReset()} onLoadPantry={() => onLoadPantry()} closeEditModal={() => showEditModal(false)} partsData={partsData} setPartsData={setPartsData}/>

  //   </Drawer>
  //   <Drawer
  //     title=""
  //     className="drawer-bg-lightblue"
  //     closable={false}
  //     width={1250}
  //     visible={addModal}
  //   >
  //     <DrawerHeader
  //       title="Add Order"
  //       imagePath={PantryBlue}
  //       closeDrawer={() => {onViewReset(); setPartsData([]); setAddModal(false);}}
  //     />
  //     <AddOrder
  //       editId={false}
  //       setAddModal={() => onAddReset()}
  //       closeAddModal={() => setAddModal(false)}
  //       onLoadPantry={() => onLoadPantry()}
  //       partsData={partsData}
  //       setPartsData={setPartsData}
  //     />

  //   </Drawer>
  // </Row>
  );
};

export default Orders;
