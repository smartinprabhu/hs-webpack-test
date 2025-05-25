/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import Table from '@mui/material/Table';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment-timezone';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Badge, Card, CardBody, Col, Row,
  Modal,
  ModalBody,
  Popover, PopoverHeader, PopoverBody, DropdownToggle,
  DropdownMenu,
  ButtonDropdown,
  DropdownItem,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faChevronDown,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import importMiniIcon from '@images/icons/importMini.svg';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'antd';
import uniqBy from 'lodash/unionBy';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import TableListFormat from '@shared/tableListFormat';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import ExportList from '@shared/listViewFilters/export';
import DrawerHeader from '@shared/drawerHeader';
import DynamicColumns from '@shared/filters/dynamicColumns';
import DynamicCheckboxFilter from '@shared/filters/dynamicCheckboxFilter';

import Loader from '@shared/loading';

import ticketIcon from '@images/icons/expense_icon.svg';
import AddExpenses from './addExpenses';
import maintenanceData from './data/maintenanceData.json';
import ExpensesBulkUpload from './expensesDetails/expensesBulkUpload';
import {
  getPagesCount, getTotalCount, generateErrorMessage,
  queryGeneratorV1, getAllowedCompanies,
  getListOfModuleOperations, getArrayFromValuesByItem,
  getColumnArrayById, extractNameObject, getCompanyTimezoneDate,
 getDatesOfQuery, getLocalDateFormat, getDefaultNoValue, htmlToReact, queryGeneratorWithUtc, 
} from '../../util/appUtils';
import CustomTable from '../../shared/customTable';
import customData from '../data/customData.json';
import {
  getOperationalExpenses, getOperationalExpensesCount, getOperationalFilters,
  resetDeleteChecklist,
  getDeleteChecklist, getExpensesTypeGroups, getExpensesDetail, resetExpenses,
} from './maintenanceService';
import actionCodes from '../data/actionCodes.json';
import pantryActionCodes from '../../pantryManagement/configuration/data/actionCodes.json';
import { setInitialValues } from '../../purchase/purchaseService';
import DataExport from './expensesExport/dataExport';
import ExpensesDetails from './expensesDetails/expensesDetails';
import Refresh from '@shared/listViewFilters/refresh';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const OperationalExpenses = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [columnFields, setColumns] = useState(maintenanceData && maintenanceData.operationalExpensesColumns ? maintenanceData.operationalExpensesColumns : []);
  const [addLink, setAddLink] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState([null, null]);
  const [datefilterList, setDatefilterList] = useState([]);

  const [size, setSize] = useState();

  const [expensesGroups, setExpensesGroups] = useState([]);
  const [expensesCollapse, setExpensesCollapse] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [listEditLink, setListEditLink] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [editId, setEditId] = useState(false);

  const [openDate, setOpenDate] = useState(false);
  const [openType, setOpenType] = useState(false);

  const [keyword, setKeyword] = useState(false);
  const [columnHide, setColumnHide] = useState([]);

  const [valueArray, setValueArray] = useState([]);
  const apiFields = maintenanceData && maintenanceData.operationalExpenses;

  const defaultActionText = 'OpEx Actions';
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);

  const history = useHistory();
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

  const {
    expensesCount, expensesListInfo, expensesCountLoading,
    operationalFilters, checklistDeleteInfo, expensesGroupsInfo, expensesDetailInfo, addExpensesInfo, updateExpensesInfo,
  } = useSelector((state) => state.maintenance);

  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  let listTitle = 'Operational Expenses';
  let otherTitle = 'Operational Expenses';
  let pantryProduct = false;
  if (history && history.location && history.location.pathname) {
    const pathName = history.location.pathname;
    if (pathName === '/pantry/configuration') {
      listTitle = 'Product List';
      otherTitle = 'Product';
      pantryProduct = true;
    }
  }

  const searchColumns = ['name', 'type_id'];

  const advanceSearchColumns = ['type_id'];

  const hiddenColumns = ['from_date', 'to_date', 'item_id', 'equipment_id', 'company_id', 'description'];

  const allowedOperations = pantryProduct
    ? getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code')
    : getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const menuType = pantryProduct ? 'pantry_product' : 'operationalExpenses';
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  useEffect(() => {
    if (selectedActions === 'Asset Bulk Upload') {
      showBulkUploadModal(true);
    }
  }, [enterAction]);

  const faIcons = {
    ASSETBULKUPLOAD: importMiniIcon,
    ASSETBULKUPLOADACTIVE: importMiniIcon,
  };

  useEffect(() => {
    dispatch(resetDeleteChecklist());
    dispatch(resetExpenses());
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = operationalFilters.customFilters ? queryGeneratorWithUtc(operationalFilters.customFilters, false,userInfo.data ) : '';
      dispatch(getOperationalExpensesCount(companies, appModels.OPERATIONALEXPANSES, customFiltersList, menuType));
    }
  }, [userInfo, operationalFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = operationalFilters.customFilters ? queryGeneratorWithUtc(operationalFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationalExpenses(companies, appModels.OPERATIONALEXPANSES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, menuType));
      dispatch(resetExpenses());
    }
  }, [userInfo, offset, sortedValue, operationalFilters, reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((checklistDeleteInfo && checklistDeleteInfo.data) || (addExpensesInfo && addExpensesInfo.data) || (updateExpensesInfo && updateExpensesInfo.data))) {
      const customFiltersList = operationalFilters.customFilters ? queryGeneratorWithUtc(operationalFilters.customFilters, false,userInfo.data) : '';
      dispatch(getOperationalExpensesCount(companies, appModels.OPERATIONALEXPANSES, customFiltersList, menuType));
      dispatch(getOperationalExpenses(companies, appModels.OPERATIONALEXPANSES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, menuType));
    }
  }, [checklistDeleteInfo, addExpensesInfo, updateExpensesInfo]);

  useEffect(() => {
    if (operationalFilters && operationalFilters.customFilters) {
      setCustomFilters(operationalFilters.customFilters);
    }
  }, [operationalFilters]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const start = `${moment(selectedDate[0]).utc().format('MM/DD/YYYY')}`;
        const end = `${moment(selectedDate[1]).utc().format('MM/DD/YYYY')}`;
        const startLabel = `${moment(selectedDate[0]).utc().format('MM/DD/YYYY')}`;
        const endLabel = `${moment(selectedDate[1]).utc().format('MM/DD/YYYY')}`;
        const value = 'Custom';
        const label = `${value} - ${startLabel} - ${endLabel}`;
        const filters = [{
          key: 'create_date', value, label, type: 'customdate', start, end,
        }];
        const customFilterCurrentList = customFilters.filter((item) => item.value !== value);
        const customFiltersList = [...customFilterCurrentList, ...filters];
        dispatch(getOperationalFilters(customFiltersList));
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (expensesGroupsInfo && expensesGroupsInfo.data) {
      setExpensesGroups(expensesGroupsInfo.data);
    }
  }, [expensesGroupsInfo]);

  useEffect(() => {
    if (openType) {
      dispatch(getExpensesTypeGroups(companies, appModels.OPERATIONALEXPANSES));
    }
  }, [openType]);

  useEffect(() => {
    setCustomFilters([]);
    dispatch(getOperationalFilters([]));
    setDatefilterList([]);
    setSelectedDate([null, null]);
  }, []);

  useEffect(() => {
    if (expensesCollapse) {
      dispatch(getExpensesTypeGroups(companies, appModels.OPERATIONALEXPANSES));
    }
  }, [expensesCollapse]);

  useEffect(() => {
    if (viewId) {
      const fields = (maintenanceData.operationalExpenses);
      dispatch(getExpensesDetail(viewId, fields, appModels.OPERATIONALEXPANSES));
    }
  }, [viewId]);

  const pages = getPagesCount(expensesCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
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
    const { checked } = event.target;
    dispatch(setInitialValues(false, false, false, false));
    if (checked) {
      const data = expensesListInfo && expensesListInfo.data ? expensesListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = expensesListInfo && expensesListInfo.data ? expensesListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getOperationalFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = operationalFilters && operationalFilters.customFilters ? operationalFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOperationalFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = operationalFilters && operationalFilters.customFilters ? operationalFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getOperationalFilters(customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'CustomDate';
    const filters = [{
      key: value, title: 'Order Date', value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = operationalFilters && operationalFilters.customFilters ? operationalFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOperationalFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = operationalFilters && operationalFilters.customFilters ? operationalFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getOperationalFilters(customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  const onRemove = (id) => {
    dispatch(getDeleteChecklist(id, appModels.OPERATIONALEXPANSES));
  };

  const onRemoveCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const dateFilters = (operationalFilters && operationalFilters.customFilters && operationalFilters.customFilters.length > 0) ? operationalFilters.customFilters : [];
  const formFields = (maintenanceData && maintenanceData.fields && maintenanceData.fields > 0) ? maintenanceData.fields : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (expensesListInfo && expensesListInfo.loading) || (expensesCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (expensesListInfo && expensesListInfo.err) ? generateErrorMessage(expensesListInfo) : userErrorMsg;

  const isCreatable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Add Product']) : allowedOperations.includes(actionCodes['Add Expenses']);
  const isEditable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Edit Product']) : allowedOperations.includes(actionCodes['Edit Expenses']);
  const isDeleteable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Delete Product']) : allowedOperations.includes(actionCodes['Delete Expenses']);

  const orderValuesList = (operationalFilters && operationalFilters.customFilters && operationalFilters.customFilters.length > 0)
    ? operationalFilters.customFilters.filter((item) => item.type === 'datecompare') : [];
  const orderValues = getColumnArrayById(orderValuesList, 'value');

  const stateValuesList = (operationalFilters && operationalFilters.customFilters && operationalFilters.customFilters.length > 0) ? operationalFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  function getNextPreview(ids, type) {
    const array = expensesListInfo && expensesListInfo.data ? expensesListInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (type === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const addDrawer = () => {
    if (document.getElementById('checkoutexpensesForm')) {
      document.getElementById('checkoutexpensesForm').reset();
    }
    dispatch(resetExpenses());
    setAddLink(true);
  };

  const onViewEditReset = () => {
    if (document.getElementById('checkoutexpensesForm')) {
      document.getElementById('checkoutexpensesForm').reset();
    }
    setViewModal(true);
    setEditLink(false);
    setAddLink(false);
    setViewId(false);
  };

  const onListEditReset = () => {
    setViewModal(false);
    setListEditLink(false);
    setAddLink(false);
    setViewId(false);
  };

  const onViewAddReset = () => {
    if (document.getElementById('checkoutexpensesForm')) {
      document.getElementById('checkoutexpensesForm').reset();
    }
    dispatch(resetExpenses());
    setEditLink(false);
    setListEditLink(false);
    setAddLink(false);
    setViewId(false);
  };

  const onClickClear = () => {
    dispatch(getOperationalFilters([]));
    setValueArray([]);
    const filterField = customData && customData.columns ? customData.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenType(false);
    setOpenDate(false);
    getOperationalFilters(false);
  };

  const columns = useMemo(() => customData && customData.columns, []);
  const data = useMemo(() => (expensesListInfo && expensesListInfo.data && expensesListInfo.data.length > 0 ? expensesListInfo.data : [{}]), [expensesListInfo.data]);
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

  useEffect(() => {
    if (expensesListInfo && expensesListInfo.loading) {
      setOpenDate(false);
      setOpenType(false);
    }
  }, [expensesListInfo]);

  useEffect(() => {
    if (openType) {
      setKeyword(' ');
      setOpenDate(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDate) {
      setKeyword(' ');
      setOpenType(false);
    }
  }, [openDate]);

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
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
      dispatch(getOperationalFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    type_id: setOpenType,
  };

  const handleTypeChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'type_id', title: 'Type', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getOperationalFilters(customFiltersList));
      removeData('data-type_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getOperationalFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  return (

    <Row className="pt-2">
      <Col sm="12" md="12" lg="12" xs="12">
        <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
          <Card className="p-2 mb-2 h-100 bg-lightblue">
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2 itAsset-table-title">
                <Col md="7" xs="12" sm="7" lg="7">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    {listTitle}
                    {' '}
                    :
                    {' '}
                    {columnHide && columnHide.length && getTotalCount(expensesCount)}
                  </span>
                  {columnHide && columnHide.length ? (
                    <div className="content-inline">
                      {customFilters && customFilters.length ? customFilters.map((cf) => (
                        <p key={cf.value} className="mr-2 content-inline">
                          <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                            {(cf.type === 'inarray') ? (
                              <>
                                {cf.title}
                                <span>
                                  {'  '}
                                  :
                                  {' '}
                                  {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                                </span>
                              </>
                            ) : (
                              cf.label
                            )}
                            {' '}
                            {(cf.type === 'text' || cf.type === 'id') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {decodeURIComponent(cf.value)}
                            </span>
                            )}
                            {(cf.type === 'customdate') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                              {' - '}
                              {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                            </span>
                            )}
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      )) : ''}
                      {customFilters && customFilters.length ? (
                        <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
                          Clear
                        </span>
                      ) : ''}
                    </div>
                  ) : ''}
                </Col>
                <Col md="5" xs="12" sm="5" lg="5">
                  <div className="float-right">
                    <Refresh
                      loadingTrue={loading}
                      setReload={setReload}
                    />
                    <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown pr-2">
                      <DropdownToggle
                        caret
                        className={selectedActionImage !== '' ? 'bg-white text-navy-blue pb-05 pt-05 font-11 rounded-pill text-left' : 'btn-navyblue pb-05 pt-05 font-11 rounded-pill text-left'}
                      >
                        {selectedActionImage !== ''
                          ? (
                            <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                          ) : ''}
                        <span className="font-weight-700">
                          {!selectedActionImage && (
                          <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                          )}
                          {selectedActions}
                          <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          id="switchAction"
                          className="pl-2 pr-0"
                          onClick={() => { showBulkUploadModal(true); }}
                        >
                          <img src={importMiniIcon} className="mr-2" height="15" width="15" alt="upload" />
                          <span className="mr-0">OpEx Bulk Upload</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                    <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                    {isCreatable && (
                    <CreateList name={`Add ${otherTitle}`} showCreateModal={addDrawer} />
                    )}
                    <ExportList response={expensesListInfo && expensesListInfo.data && expensesListInfo.data.length} />
                    <DynamicColumns
                      setColumns={setColumns}
                      columnFields={columnFields}
                      allColumns={allColumns}
                      setColumnHide={setColumnHide}
                    />
                  </div>
                  {expensesListInfo && expensesListInfo.data && expensesListInfo.data.length && (
                  <Popover className="export-popover" placement="bottom" isOpen={filterInitailValues.download} target="Export">
                    <PopoverHeader>
                      Export
                      <img
                        aria-hidden="true"
                        alt="close"
                        src={closeCircleIcon}
                        onClick={() => dispatch(setInitialValues(false, false, false, false))}
                        className="cursor-pointer mr-1 mt-1 float-right"
                      />
                    </PopoverHeader>
                    <PopoverBody>
                      <div className="p-2">
                        <DataExport
                          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                          fields={columnFields}
                          sortedValue={sortedValue}
                          rows={checkedRows}
                          apiFields={apiFields}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                  )}
                </Col>
              </Row>
              {(expensesListInfo && expensesListInfo.data && expensesListInfo.data.length > 0) && (
              <span data-testid="success-case" />
              )}
              <div className="thin-scrollbar">
                <div className="table-responsive common-table">
                  <Table responsive {...getTableProps()} className="mt-2 max-width">
                    <CustomTable
                      isAllChecked={isAllChecked}
                      handleTableCellAllChange={handleTableCellAllChange}
                      searchColumns={searchColumns}
                      advanceSearchColumns={advanceSearchColumns}
                      advanceSearchFunc={advanceSearchjson}
                      onChangeFilter={onChangeFilter}
                      removeData={removeData}
                      setKeyword={setKeyword}
                      handleTableCellChange={handleTableCellChange}
                      checkedRows={checkedRows}
                      setViewId={setViewId}
                      setViewModal={setViewModal}
                      tableData={expensesListInfo}
                      getCompanyTimezoneDate={getCompanyTimezoneDate}
                      actions={{
                        // edit: {
                        //   showEdit: isEditable,
                        //   editFunc: openEditModalWindow,
                        // },
                        delete: {
                          showDelete: isDeleteable,
                          deleteFunc: onClickRemoveData,
                        },
                      }}
                      tableProps={{
                        page,
                        prepareRow,
                        getTableBodyProps,
                        headerGroups,
                      }}
                    />
                  </Table>
                  {openType && (
                  <DynamicCheckboxFilter
                    data={expensesGroupsInfo}
                    selectedValues={stateValues}
                    dataGroup={expensesGroups}
                    filtervalue="type_id"
                    onCheckboxChange={handleTypeChange}
                    toggleClose={() => setOpenType(false)}
                    openPopover={openType}
                    target="data-type_id"
                    title="Expenses Type"
                    keyword={keyword}
                    setDataGroup={setExpensesGroups}
                  />
                  )}
                  {columnHide && columnHide.length ? (
                    <TableListFormat
                      userResponse={userInfo}
                      listResponse={expensesListInfo}
                      countLoad={expensesCountLoading}
                    />
                  ) : ''}
                  {columnHide && !columnHide.length ? (
                    <div className="text-center mb-4">
                      Please select the Columns
                    </div>
                  ) : ''}
                </div>
                {loading || pages === 0 ? (<span />) : (
                  <div className={`${classes.root} float-right`}>
                    {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                  </div>
                )}
              </div>
              {bulkUploadModal && (
              <ExpensesBulkUpload
                atFinish={() => {
                  showBulkUploadModal(false);
                }}
                bulkUploadModal
              />
              )}
            </CardBody>
          </Card>
        </Col>
        <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
          <ModalHeaderComponent title={`Delete ${otherTitle}`} imagePath={false} closeModalWindow={() => onRemoveCancel()} response={checklistDeleteInfo} />
          <ModalBody className="mt-0 pt-0">
            {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ${pantryProduct ? 'product' : 'expenses'} ?`}
            </p>
            )}
            {checklistDeleteInfo && checklistDeleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.err) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} />
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.data) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage={`${otherTitle} removed successfully..`} />
            )}
            <div className="pull-right mt-3">
              {checklistDeleteInfo && !checklistDeleteInfo.data && (
              <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  variant="contained" onClick={() => onRemove(removeId)}>Confirm</Button>
              )}
              {checklistDeleteInfo && checklistDeleteInfo.data && (
              <Button size="sm"  variant="contained" onClick={() => onRemoveCancel()}>Ok</Button>
              )}
            </div>
          </ModalBody>
        </Modal>
        <Drawer
          title=""
          closable={false}
          width="736px"
          className="drawer-bg-lightblue"
          visible={viewModal}
        >
          <DrawerHeader
            title={expensesDetailInfo && (expensesDetailInfo.data && expensesDetailInfo.data.length > 0)
              ? extractNameObject(expensesDetailInfo.data[0].type_id, 'name') : 'Name'}
            imagePath={false}
            isEditable={(allowedOperations.includes(actionCodes['Edit Expenses']) && (expensesDetailInfo && !expensesDetailInfo.loading))}
            closeDrawer={() => onViewReset()}
            onEdit={() => { setEditLink(true); }}
            onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
            onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
          />
          <ExpensesDetails />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width="736px"
          visible={editLink}
        >

          <DrawerHeader
            title="Update Operational Expenses"
            imagePath={ticketIcon}
            closeDrawer={() => onViewEditReset()}
          />
          <AddExpenses editIds={viewId} setEditLink={setEditLink} isDrawer />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width="736px"
          visible={listEditLink}
        >

          <DrawerHeader
            title="Update Operational Expenses"
            imagePath={ticketIcon}
            closeDrawer={() => onListEditReset()}
          />
          <AddExpenses editIds={viewId} setListEditLink={setListEditLink} isDrawer />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width="736px"
          visible={addLink}
        >

          <DrawerHeader
            title="Create Operational Expenses"
            imagePath={ticketIcon}
            closeDrawer={() => onViewAddReset()}
            className="w-auto height-28 ml-2 mr-2"
          />
          <AddExpenses setAddLink={setAddLink} isDrawer />
        </Drawer>
      </Col>
    </Row>
  );
};

export default OperationalExpenses;
