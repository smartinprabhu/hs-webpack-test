/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Badge
  ,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';



import uniqBy from 'lodash/unionBy';



import { ProductColumns } from '../../commonComponents/gridColumns';
import CommonGrid from '../../commonComponents/commonGrid';
import maintenanceData from '../../adminSetup/maintenanceConfiguration/data/maintenanceData.json';
import {
  getPagesCount, getTotalCount, generateErrorMessage, getAllowedCompanies,
  getListOfModuleOperations, getArrayFromValuesByItem,
  getColumnArrayById, getCompanyTimezoneDate, queryGeneratorWithUtc,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  queryGeneratorV1,
  getDefaultNoValue,
  extractValueArray, extractNameObject,
  getDateAndTimeForDifferentTimeZones,
} from '../../util/appUtils';
import {
  setSorting,
} from '../../assets/equipmentService';
import {
  getParts, getPartsCount, getPartsFilters,
  resetDeleteChecklist,
  getDeleteChecklist,
  getPartsExport,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';
import {
  resetCreateParts, getCheckListData, getActiveStep,
} from '../../adminSetup/setupService';
import pantryActionCodes from './data/actionCodes.json';
import filtersFields from './data/filtersFields.json';
import { setInitialValues, clearEditProduct } from '../../purchase/purchaseService';
import customData from './data/customData.json';
import { PantryModule } from '../../util/field';
import ordersNav from '../navbar/navlist.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Parts = (props) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [statusValue, setStatusValue] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  // const [customFilters, setCustomFilters] = useState([]);
  const [columnFields, setColumns] = useState(maintenanceData && maintenanceData.productTableColumnsShow ? maintenanceData.productTableColumnsShow : []);
  const [addLink, setAddLink] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const [editData, setEditData] = useState([]);
  const [updateModal, showUpdateModal] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { sortedValue } = useSelector((state) => state.equipment);

  const {
    partsCount, partsListInfo, partsCountLoading,
    partsFilters, checklistDeleteInfo, createPartsInfo, partsExportData,
  } = useSelector((state) => state.maintenance);

  const {
    updateProductInfo,
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const searchColumns = PantryModule.pantryProductSearchColumn;

  const hiddenColumns = PantryModule.pantryProductHiddenColumn;

  const advanceSearchColumns = PantryModule.pantryProdcutAdvanceSearchCOlumn;

  const { pinEnableData } = useSelector((state) => state.auth);

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(() => (partsListInfo.data ? partsListInfo.data : [{}]), [partsListInfo.data]);
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
    if (openStatus) {
      setKeyword(' ');
    }
  }, [openStatus]);

  const advanceSearchjson = {
    active: setOpenStatus,
  };

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
      dispatch(getPartsFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    setStatusValue(value);
    if (checked) {
      const filters = [{
        key: 'active', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...filters];
      dispatch(getPartsFilters(customFiltersList));
      removeData('data-active');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPartsFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  let pantryProduct = false;
  if (history && history.location && history.location.pathname) {
    const pathName = history.location.pathname;
    if (pathName === '/pantry/configuration') {
      pantryProduct = true;
    }
  }
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code');

  const stateValuesList = (partsFilters && partsFilters.customFilters && partsFilters.customFilters.length > 0)
    ? partsFilters.customFilters.filter((item) => (item.type === 'inarray' || item.type === 'boolean')) : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');
  const menuType = 'pantry_product';

  useEffect(() => {
    dispatch(resetDeleteChecklist());
    dispatch(clearEditProduct());
  }, []);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        categ_id: true,
        pantry_ids: true,
        minimum_order_qty: true,
        maximum_order_qty: true,
        active: false,
        weight: false,
        volume: false,
        new_until: false,
        company_id: false,
        uom_id: false,
        uom_po_id: false,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType, globalFilter));
    }
  }, [userInfo, statusValue, partsFilters, customFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) || (createPartsInfo && createPartsInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField, menuType, globalFilter));
      dispatch(resetCreateParts());
    }
  }, [userInfo, offset, sortedValue, statusValue, partsFilters, createPartsInfo, reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (checklistDeleteInfo && checklistDeleteInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType, globalFilter));
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField, menuType, globalFilter));
    }
  }, [checklistDeleteInfo]);

  useEffect(() => {
    if (partsFilters && partsFilters.customFilters) {
      setCustomFilters(partsFilters.customFilters);
    }
  }, [partsFilters]);

  const pages = getPagesCount(partsCount, limit);

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
      const dataValue = partsListInfo && partsListInfo.data ? partsListInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = partsListInfo && partsListInfo.data ? partsListInfo.data : [];
      const ids = getColumnArrayById(dataValue, 'id');
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
    dispatch(getPartsFilters(customFiltersList));
    setOffset(0);
    setPage(1);
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
    const oldCustomFilters = partsFilters && partsFilters.customFilters
      ? partsFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getPartsFilters(customFilters1));
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
      const oldCustomFilters = partsFilters && partsFilters.customFilters
        ? partsFilters.customFilters
        : [];
      const filterValues = {
        states:
          partsFilters && partsFilters.states ? partsFilters.states : [],
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
      dispatch(getPartsFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = partsFilters && partsFilters.customFilters
        ? partsFilters.customFilters
        : [];
      const filterValues = {
        states:
          partsFilters && partsFilters.states ? partsFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getPartsFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const onRemove = (id) => {
    dispatch(getDeleteChecklist(id, appModels.PARTS));
  };

  const openEditModalWindow = (data) => {
    dispatch(clearEditProduct());
    setEditData(data);
    showUpdateModal(true);
  };

  const onRemoveCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('productFormPantry')) {
      document.getElementById('productFormPantry').reset();
    }
    if ((userInfo && userInfo.data) && (updateProductInfo && updateProductInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType, globalFilter));
    }
    dispatch(clearEditProduct());
    setEditData([]);
    showUpdateModal(false);
  };

  const dateFilters = (partsFilters && partsFilters.customFilters && partsFilters.customFilters.length > 0) ? partsFilters.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (partsListInfo && partsListInfo.loading) || (partsCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (partsListInfo && partsListInfo.err) ? generateErrorMessage(partsListInfo) : userErrorMsg;

  const isCreatable = allowedOperations.includes(pantryActionCodes['Add Product']);
  const isEditable = allowedOperations.includes(pantryActionCodes['Edit Product']);
  const isDeleteable = allowedOperations.includes(pantryActionCodes['Delete Product']);

  const onAddReset = () => {
    if (document.getElementById('productFormPantry')) {
      document.getElementById('productFormPantry').reset();
    }
    const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
    dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType, globalFilter));
    dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType, globalFilter));
    dispatch(resetCreateParts());
    dispatch(getCheckListData([]));
    dispatch(getActiveStep(0));
    setAddLink(false);
  };

  const addWindowOpen = () => {
    if (document.getElementById('productFormPantry')) {
      document.getElementById('productFormPantry').reset();
    }
    dispatch(resetCreateParts());
    dispatch(getCheckListData([]));
    setAddLink(true);
  };

  const onReset = () => {
    if (document.getElementById('productFormPantry')) {
      document.getElementById('productFormPantry').reset();
      if (document.getElementById('pantryProductImageEdit')) {
        document.getElementById('pantryProductImageEdit').reset();
      }
    }
    setAddLink(false);
  };

  const onClickClear = () => {
    dispatch(getPartsFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const checklistStateLabelFunction = (staten) => {
    if (customData && customData.statesLabels[staten] && staten === true) {
      return <Badge color={customData.statesLabels[staten].color} className="badge-text no-border-radius" pill>{customData.statesLabels[staten].text}</Badge>;
    }
    return <Badge color={customData.statesLabels[staten].color} className="badge-text no-border-radius" pill>{customData.statesLabels[staten].text}</Badge>;
  };

  const listPantryData = (dataValue, col) => {
    const newArray = [];
    if (dataValue && dataValue.length && dataValue.length > 0) {
      for (let i = 0; i < dataValue.length; i += 1) {
        const newValue = dataValue[i][col];
        newArray.push(newValue);
      }
    }
    const value = newArray.join(',');
    return value;
  };

  const listCatData = (values, field) => {
    let value = '';
    if (values && typeof values === 'object' && values[field]) {
      value = values[field];
    }
    return value;
  };

  useEffect(() => {
    if ((userInfo && userInfo.data) && (partsCount && partsCount.length)) {
      const offsetValues = 0;
      const customFiltersQuery = partsFilters && partsFilters.customFilters ? queryGeneratorV1(partsFilters.customFilters) : '';
      dispatch(getPartsExport(companies, appModels.PARTS, getTotalCount(partsCount), offsetValues, PantryModule.pantryProductApiFields, statusValue, customFiltersQuery, rows, menuType, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, partsCount, startExport]);

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
      // 'categ_id.name',
      // 'pantry_ids',
      // 'minimum_order_qty',
      // 'maximum_order_qty',
      // 'active',
      // 'weight',
      // 'volume',
      // 'company_id',
      // 'uom_id',
      // 'uom_po_id',
    ];
    let query = '';

    const oldCustomFilters = partsFilters && partsFilters.customFilters
      ? partsFilters.customFilters
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
        const CustomFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getPartsFilters(CustomFilters));
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getPartsFilters(CustomFilters));
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

  const getNewArray = (array) => {
    const resources = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        const val = array[i];
        val.pantry_ids = getDefaultNoValue(extractValueArray(val.pantry_ids, 'name'));
        val.active = val.active ? 'Active' : 'Inactive';
        val.minimum_order_qty = val.minimum_order_qty ? val.minimum_order_qty : '0';
        val.maximum_order_qty = val.maximum_order_qty ? val.maximum_order_qty : '0';
        val.weight = val.weight ? val.weight : '0';
        val.volume = val.volume ? val.volume : '0';
        val.create_date = getCompanyTimezoneDate(val.create_date, userInfo, 'datetime');
        val.new_until = getCompanyTimezoneDate(val.new_until, userInfo, 'datetime');
        val.categ_id = getDefaultNoValue(extractNameObject(val.categ_id, 'display_name'));
        val.company_id = getDefaultNoValue(extractNameObject(val.company_id, 'name'));
        val.uom_id = getDefaultNoValue(extractNameObject(val.uom_id, 'name'));
        val.uom_po_id = getDefaultNoValue(extractNameObject(val.uom_po_id, 'name'));
        resources.push(val);
      }
    }
    return resources;
  };

  return (
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        createTabs={{
          enable: true,
          menuList:  props.menuList,
          tabs: props.tabs,
        }} 
        tableData={
        partsListInfo && partsListInfo.data && partsListInfo.data.length
          ? partsListInfo.data
          : []
        }
        columns={ProductColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Product"
        exportFileName={pantryProduct ? 'Products' : 'Parts'}
        listCount={getTotalCount(partsCount)}
        exportInfo={{ err: partsExportData.err, loading: partsExportData.loading, data: partsExportData.data ? getNewArray(partsExportData.data) : false }}
        page={currentPage}
        rowCount={getTotalCount(partsCount)}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(pantryActionCodes['Add Product']),
          text: "Add",
          func: () => setAddLink(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={onFilterChange}
        loading={partsListInfo && partsListInfo.loading}
        err={partsListInfo && partsListInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        setActive={props.setActive}     
        setCurrentTab={props.setCurrentTab}     
        isSet={props.isSet}  
        currentTab={props.currentTab} 
      />

  // <Row className="pt-2">
  //   <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
  //     <Card className="p-2 mb-2 h-100 bg-lightblue">
  //       <CardBody className="bg-color-white p-1 m-0">
  //         <Row className="p-2 itAsset-table-title">
  //           <Col md="9" xs="12" sm="9" lg="9">
  //             <span className="p-0 mr-2 font-weight-800 font-medium">
  //               Product List
  //               {' '}
  //               :
  //               {' '}
  //               {columnHide && columnHide.length && getTotalCount(partsCount)}
  //             </span>
  //             {columnHide && columnHide.length ? (
  //               <div className="content-inline">
  //                 {customFilters && customFilters.map((cf) => (
  //                   <p key={cf.value} className="mr-2 content-inline">
  //                     <Badge color="dark" className="p-2 mb-1 bg-zodiac">
  //                       {(cf.type === 'inarray') ? (
  //                         <>
  //                           {cf.title}
  //                           <span>
  //                             {'  '}
  //                             :
  //                             {' '}
  //                             {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
  //                           </span>
  //                         </>
  //                       ) : (
  //                         cf.label
  //                       )}
  //                       {' '}
  //                       {(cf.type === 'text' || cf.type === 'id') && (
  //                         <span>
  //                           {'  '}
  //                           :
  //                           {' '}
  //                           {decodeURIComponent(cf.value)}
  //                         </span>
  //                       )}
  //                       {(cf.type === 'customdate') && (
  //                         <span>
  //                           {'  '}
  //                           :
  //                           {' '}
  //                           {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
  //                           {' - '}
  //                           {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
  //                         </span>
  //                       )}
  //                       <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
  //                     </Badge>
  //                   </p>
  //                 ))}
  //                 {customFilters && customFilters.length ? (
  //                   <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
  //                     Clear
  //                   </span>
  //                 ) : ''}
  //               </div>
  //             ) : ''}
  //           </Col>
  //           <Col md="3" xs="12" sm="3" lg="3">
  //             <div className="float-right">
  //               <Refresh
  //                 loadingTrue={loading}
  //                 setReload={setReload}
  //               />
  //               <ListDateFilters
  //                 dateFilters={dateFilters}
  //                 customFilters={customFilters}
  //                 handleCustomFilterClose={handleCustomFilterClose}
  //                 setCustomVariable={setCustomVariable}
  //                 customVariable={customVariable}
  //                 onClickRadioButton={handleRadioboxChange}
  //                 onChangeCustomDate={handleCustomDateChange}
  //                 idNameFilter="productDate"
  //                 classNameFilter="drawerPopover popoverDate"
  //               />
  //               {isCreatable && (
  //                 <CreateList name="Add Product" showCreateModal={() => addWindowOpen()} />
  //               )}
  //               <ExportList idNameFilter="productExport" response={partsListInfo && partsListInfo.data && partsListInfo.data.length > 0 ? partsListInfo && partsListInfo.data && partsListInfo.data.length : ''} />
  //               <DynamicColumns
  //                 setColumns={setColumns}
  //                 columnFields={columnFields}
  //                 allColumns={allColumns}
  //                 setColumnHide={setColumnHide}
  //                 idNameFilter="productColumns"
  //                 classNameFilter="drawerPopover"
  //               />
  //             </div>
  //             {partsListInfo && partsListInfo.data && partsListInfo.data.length > 0 && (
  //               <>
  //                 {document.getElementById('productExport') && (
  //                   <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="productExport">
  //                     <PopoverHeader>
  //                       Export
  //                       <img
  //                         aria-hidden="true"
  //                         alt="close"
  //                         src={closeCircleIcon}
  //                         onClick={() => dispatch(setInitialValues(false, false, false, false))}
  //                         className="cursor-pointer mr-1 mt-1 float-right"
  //                       />
  //                     </PopoverHeader>
  //                     <PopoverBody>
  //                       <div className="p-2">
  //                         <DataExport
  //                           afterReset={() => dispatch(setInitialValues(false, false, false, false))}
  //                           fields={columnFields}
  //                           sortedValue={sortedValue}
  //                           statusValue={statusValue}
  //                           menuType={menuType}
  //                           pantryProduct={pantryProduct}
  //                           rows={checkedRows}
  //                           apiFields={PantryModule.pantryProductApiFields}
  //                         />
  //                       </div>
  //                     </PopoverBody>
  //                   </Popover>
  //                 )}
  //               </>
  //             )}
  //           </Col>
  //         </Row>
  //         {(partsListInfo && partsListInfo.data && partsListInfo.data.length > 0) && (
  //           <span data-testid="success-case" />
  //         )}
  //         <div className="thin-scrollbar">
  //           <div className="table-responsive common-table">
  //             <Table responsive {...getTableProps()} className="mt-2">
  //               <CustomTable
  //                 isAllChecked={isAllChecked}
  //                 handleTableCellAllChange={handleTableCellAllChange}
  //                 searchColumns={searchColumns}
  //                 advanceSearchColumns={advanceSearchColumns}
  //                 advanceSearchFunc={advanceSearchjson}
  //                 onChangeFilter={onChangeFilter}
  //                 removeData={removeData}
  //                 setKeyword={setKeyword}
  //                 handleTableCellChange={handleTableCellChange}
  //                 checkedRows={checkedRows}
  //                 setViewId={setViewId}
  //                 setViewModal={setViewModal}
  //                 tableData={partsListInfo}
  //                 listPantryData={listPantryData}
  //                 listCatData={listCatData}
  //                 checklistStateLabelFunction={checklistStateLabelFunction}
  //                 actions={{
  //                   hideSorting: {
  //                     fieldName: ['company_id.name'],
  //                   },
  //                   edit: {
  //                     showEdit: isEditable,
  //                     editFunc: openEditModalWindow,
  //                   },
  //                   delete: {
  //                     showDelete: isDeleteable,
  //                     deleteFunc: onClickRemoveData,
  //                   },
  //                 }}
  //                 tableProps={{
  //                   page,
  //                   prepareRow,
  //                   getTableBodyProps,
  //                   headerGroups,
  //                 }}
  //               />
  //             </Table>
  //             {openStatus && (
  //               <StaticCheckboxFilter
  //                 selectedValues={stateValues}
  //                 dataGroup={statusGroups}
  //                 onCheckboxChange={handleStatusCheckboxChange}
  //                 target="data-active"
  //                 title="Status"
  //                 openPopover={openStatus}
  //                 toggleClose={() => setOpenStatus(false)}
  //                 setDataGroup={setStatusGroups}
  //                 keyword={keyword}
  //                 data={customData && customData.stateTypes ? customData.stateTypes : []}
  //               />
  //             )}
  //             {columnHide && columnHide.length ? (
  //               <TableListFormat
  //                 userResponse={userInfo}
  //                 listResponse={partsListInfo}
  //                 countLoad={partsCountLoading}
  //               />
  //             ) : ''}
  //             {columnHide && !columnHide.length ? (
  //               <div className="text-center mb-4">
  //                 Please select the Columns
  //               </div>
  //             ) : ''}
  //           </div>
  //           {loading || pages === 0 ? (<span />) : (
  //             <div className={`${classes.root} float-right`}>
  //               {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
  //             </div>
  //           )}

  //         </div>
  //       </CardBody>
  //     </Card>
  //   </Col>
  //   <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
  //     <ModalHeaderComponent title="Delete Product" imagePath={false} closeModalWindow={() => onRemoveCancel()} response={checklistDeleteInfo} />
  //     <ModalBody className="mt-0 pt-0">
  //       {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
  //         <p className="text-center">
  //           {`Are you sure, you want to remove ${removeName} ${pantryProduct ? 'product' : 'part'} ?`}
  //         </p>
  //       )}
  //       {checklistDeleteInfo && checklistDeleteInfo.loading && (
  //         <div className="text-center mt-3">
  //           <Loader />
  //         </div>
  //       )}
  //       {(checklistDeleteInfo && checklistDeleteInfo.err) && (
  //         <SuccessAndErrorFormat response={checklistDeleteInfo} />
  //       )}
  //       {(checklistDeleteInfo && checklistDeleteInfo.data) && (
  //         <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Product removed successfully.." />
  //       )}
  //       <div className="pull-right mt-3">
  //         {checklistDeleteInfo && !checklistDeleteInfo.data && (
  //           <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  variant="contained" onClick={() => onRemove(removeId)}>Confirm</Button>
  //         )}
  //         {checklistDeleteInfo && checklistDeleteInfo.data && (
  //           <Button size="sm"  variant="contained" onClick={() => onRemoveCancel()}>Ok</Button>
  //         )}
  //       </div>
  //     </ModalBody>
  //   </Modal>
  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={updateModal}
  //   >

  //     <DrawerHeader
  //       title="Edit Product"
  //       imagePath={productBlack}
  //       closeDrawer={() => { showUpdateModal(false); onReset(); }}
  //     />
  //     <AddProduct
  //       editData={editData}
  //       afterReset={() => { closeEditModalWindow(); }}
  //       closeEditModal={() => { showUpdateModal(false); }}
  //     />
  //   </Drawer>
  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={addLink}
  //   >

  //     <DrawerHeader
  //       title="Add Product"
  //       imagePath={productBlack}
  //       closeDrawer={() => { onReset(); }}
  //     />
  //     <AddProduct
  //       editData={false}
  //       afterReset={() => { onAddReset(); }}
  //       closeEditModal={() => { setAddLink(false); }}
  //     />
  //   </Drawer>
  // </Row>
  );
};

export default Parts;
