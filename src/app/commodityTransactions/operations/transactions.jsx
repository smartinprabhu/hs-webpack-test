/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import uniqBy from 'lodash/unionBy';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Badge,  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import Drawer from '@mui/material/Drawer';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
/* import DrawerHeader from '@shared/drawerHeader'; */
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import CommodityIcon from '@images/sideNavImages/commodityTransactions_black.svg';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { CommodityTranscationColumns } from '../../commonComponents/gridColumns';
import CommonGrid from '../../commonComponents/commonGrid';

import customData from '../data/customData.json';
import {
  getPagesCountV2,
  queryGeneratorV1, getAllCompanies, getColumnArrayById,
  getCompanyTimezoneDate, queryGeneratorWithUtc,
  getArrayFromValuesByItem, getListOfModuleOperations, generateErrorMessage, getDateAndTimeForDifferentTimeZones,
  formatFilterData, debounce, getNextPreview,
} from '../../util/appUtils';
import {
  getTanker, getTankerCount,
  getTankerFilters, getTankerDetails, getTankerConfig, getCommodityGroups, getVendorGroups, getTankerExport,
} from '../tankerService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getDelete, resetDelete, resetCreateProductCategory,
} from '../../pantryManagement/pantryService';
import TankerDetail from './tankerDetail/tankerDetail';
import DataExport from '../dataExport/dataExport';
import actionCodes from '../data/actionCodes.json';
import AddTransaction from './addTransaction';
import filtersFields from '../data/filtersFields.json';
import { TransactionModule } from '../../util/field';
import { AddThemeBackgroundColor } from '../../themes/theme';
import {
  setSorting,
} from '../../assets/equipmentService';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Transactions = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const apiFields = customData && customData.detailFields;
  const [openVendor, setOpenVendor] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [openCommodity, setOpenCommodity] = useState(false);
  const [commodityGroups, setCommodityGroups] = useState([]);
  const [addModal, showAddModal] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);
  const [filterText, setFilterText] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    tankerTransactionsCount, tankerTransactions, tankerTransactionsCountLoading,
    tankerTransactionFilters, tankerConfig, tankerTransactionDetail, vendorGroupsInfo, commodityGroupsInfo, tankerTransactionsExport,
  } = useSelector((state) => state.tanker);
  const { sortedValue } = useSelector((state) => state.equipment);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    addProductCategoryInfo, updateProductCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);

  const isVerification = true; // tankerConfig && tankerConfig.data && tankerConfig.data.length ? tankerConfig.data[0].requires_verification : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Transaction']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Transaction']);

  const listHead = 'Transactions List:';

  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (tankerTransactions && tankerTransactions.err) ? generateErrorMessage(tankerTransactions) : userErrorMsg;


  const tableColumns = CommodityTranscationColumns(false, isVerification, isDeleteable);

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'id' }));
  }, []);

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getTankerConfig(userInfo.data.company.id, appModels.TANKERCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (vendorGroupsInfo && vendorGroupsInfo.data) {
      setVendorGroups(vendorGroupsInfo.data);
    }
  }, [vendorGroupsInfo]);

  useEffect(() => {
    if (commodityGroupsInfo && commodityGroupsInfo.data) {
      setCommodityGroups(commodityGroupsInfo.data);
    }
  }, [commodityGroupsInfo]);

  useEffect(() => {
    if (openVendor) {
      dispatch(getVendorGroups(companies, appModels.TANKERTRANSACTIONS));
    }
  }, [openVendor]);

  useEffect(() => {
    if (openCommodity) {
      dispatch(getCommodityGroups(companies, appModels.TANKERTRANSACTIONS));
    }
  }, [openCommodity]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTankerCount(companies, appModels.TANKERTRANSACTIONS, customFiltersList));
      dispatch(getTanker(companies, appModels.TANKERTRANSACTIONS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo, stateChangeInfo, sortedValue]);

  useEffect(() => {
    if (tankerTransactionFilters && tankerTransactionFilters.customFilters) {
      setCustomFilters(tankerTransactionFilters.customFilters);
    }
  }, [tankerTransactionFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getTankerFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTankerCount(companies, appModels.TANKERTRANSACTIONS, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTanker(companies, appModels.TANKERTRANSACTIONS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, customFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTankerDetails(viewId, appModels.TANKERTRANSACTIONS));
    }
  }, [viewId]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length) && !viewId) {
      dispatch(getTankerDetails(addProductCategoryInfo.data[0], appModels.TANKERTRANSACTIONS));
    }
  }, [addProductCategoryInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (tankerTransactionsCount && tankerTransactionsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = tankerTransactionFilters && tankerTransactionFilters.customFilters ? queryGeneratorV1(tankerTransactionFilters.customFilters) : '';
      dispatch(getTankerExport(companies, appModels.TANKERTRANSACTIONS, tankerTransactionsCount.length, offsetValue, TransactionModule.transactionApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, startExport]);

  const totalDataCount = tankerTransactionsCount && tankerTransactionsCount.length && columnFields.length ? tankerTransactionsCount.length : 0;

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
      const data = tankerTransactions && tankerTransactions.data ? tankerTransactions.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = tankerTransactions && tankerTransactions.data ? tankerTransactions.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const handleVendorChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'vendor_id', title: 'Vendor', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTankerFilters(customFiltersList));
      removeData('data-vendor_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getTankerFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCommodityChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'commodity', title: 'Commodity', value: name, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTankerFilters(customFiltersList));
      removeData('data-commodity');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== name);
      dispatch(getTankerFilters(customFiltersList));
    }
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
    const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters
      ? tankerTransactionFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getTankerFilters(customFilters1));

    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChangeold = (event) => {
    const { value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date', Header: value, id: value,
    }];
    const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters ? tankerTransactionFilters.customFilters : [];
    const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
    setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
    dispatch(getTankerFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];

    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, startDate, endDate);

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters ? tankerTransactionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getTankerFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getTankerFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    showAddModal(false);
  };

  const addAdjustmentWindow = () => {
    resetCreateProductCategory();
    showAddModal(true);
  };

  const onAddReset = () => {
    if (document.getElementById('configTransactionForm')) {
      document.getElementById('configTransactionForm').reset();
    }
    showAddModal(false);
    dispatch(resetCreateProductCategory());
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.TANKERTRANSACTIONS));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const searchColumns = TransactionModule.transactionSeachColumns;

  const hiddenColumns = TransactionModule.transactionHiddenColumns;

  const advanceSearchColumns = TransactionModule.transactionAdvanceSearchColumns;

  const onClickClear = () => {
    dispatch(getTankerFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenVendor(false);
    setOpenCommodity(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (tankerTransactions.data ? tankerTransactions.data : [{}]), [tankerTransactions.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        commodity: true,
        capacity: true,
        vendor_id: true,
        initial_reading: true,
        final_reading: true,
        difference: true,
        tanker_id: true,
        sequence: false,
        location_id: false,
        in_datetime: false,
        out_datetime: false,
        company_id: false,
        state:true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length !== 0 && tankerConfig?.data
    ) {
      setVisibleColumns({
        _check_: true,
        commodity: true,
        capacity: true,
        vendor_id: true,
        initial_reading: true,
        final_reading: true,
        difference: true,
        tanker_id: true,
        sequence: false,
        location_id: false,
        in_datetime: false,
        out_datetime: false,
        company_id: false,
        ...(isVerification ? { state: true } : {}),
      });
    }
  }, [tankerConfig]);

  const onFilterChange = (data) => {
    const fields = [
      'commodity',
      'capacity',
      'vendor_id',
      'initial_reading',
      'final_reading',
      'difference',
      'tanker_id',
      'sequence',
      'location_id',
    ];
    let query = '"|","|","|","|","|","|","|","|",';

    const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters
      ? tankerTransactionFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];
    console.log(data.quickFilterValues);
    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getTankerFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTankerFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1 ? data.quickFilterValues[0] : false));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [tankerTransactionFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(tankerTransactions && tankerTransactions.data && tankerTransactions.data.length && tankerTransactions.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(tankerTransactions && tankerTransactions.data && tankerTransactions.data.length && tankerTransactions.data[tankerTransactions.data.length - 1].id);
    }
  }, [tankerTransactions]);

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
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

  useEffect(() => {
    if (tankerTransactions && tankerTransactions.loading) {
      setOpenCommodity(false);
      setOpenVendor(false);
    }
  }, [tankerTransactions]);

  useEffect(() => {
    if (openCommodity) {
      setKeyword(' ');
      setOpenVendor(false);
    }
  }, [openCommodity]);

  useEffect(() => {
    if (openVendor) {
      setKeyword(' ');
      setOpenCommodity(false);
    }
  }, [openVendor]);

  /* useEffect(() => {
    if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(customFilters);
    }
  }, [customFilters]); */

  const advanceSearchjson = {
    vendor_id: setOpenVendor,
    commodity: setOpenCommodity,
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
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getTankerFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const stateValuesList = (tankerTransactionFilters && tankerTransactionFilters.customFilters && tankerTransactionFilters.customFilters.length > 0)
    ? tankerTransactionFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (tankerTransactionFilters && tankerTransactionFilters.customFilters && tankerTransactionFilters.customFilters.length > 0) ? tankerTransactionFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (tankerTransactions && tankerTransactions.loading) || (tankerTransactionsCountLoading);

  return (
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        sx={{
          height: '90%',
        }}
        tableData={
          tankerTransactions && tankerTransactions.data && tankerTransactions.data.length
            ? tankerTransactions.data
            : []
        }
        columns={CommodityTranscationColumns(false, isVerification, isDeleteable)}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Transactions List"
        exportFileName="Transactions"
        isModuleDisplayName
        listCount={totalDataCount}
        filters={filterText}
        exportInfo={tankerTransactionsExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={tankerTransactions && tankerTransactions.loading}
        err={tankerTransactions && tankerTransactions.err}
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
        removeData={onClickRemoveData}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'id' && cf.label && cf.label !== '')
                ? (
<p key={cf.value} className="mr-2 content-inline">
                  <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                    {(cf.type === 'id') && (
                      <span>
                        {cf.label}
                        {' '}
:
{' '}
                        {decodeURIComponent(cf.value)}
                      </span>
                    )}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                  </Badge>
</p>
                ) : ''
            )) : ''}
          </>
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={tankerTransactionDetail && (tankerTransactionDetail.data && tankerTransactionDetail.data.length > 0)
            ? `${'Transaction'}${' - '}${tankerTransactionDetail.data[0].sequence}` : 'Transaction'}
          imagePath={CommodityIcon}
          onClose={() => onViewReset()}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', tankerTransactions) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', tankerTransactions));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', tankerTransactions) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', tankerTransactions));
          }}
        />
        <TankerDetail isTanker={false} offset={offset} />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Add Transaction"
          imagePath={CommodityIcon}
          onClose={() => onViewReset()}
        />
        <AddTransaction closeModal={onAddReset} addModal={addModal} />
      </Drawer>

      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Transaction"
          imagePath={false}
          closeModalWindow={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <ModalBody className="mt-0 pt-0">
          {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ?`}
            </p>
          )}
          {deleteInfo && deleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(deleteInfo && deleteInfo.err) && (
            <SuccessAndErrorFormat response={deleteInfo} />
          )}
          {(deleteInfo && deleteInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteInfo}
              successMessage="Transaction removed successfully.."
            />
          )}
          <div className="pull-right mt-3">
            {deleteInfo && !deleteInfo.data && (
              <Button
                size="sm"
                disabled={deleteInfo && deleteInfo.loading}
               variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
            )}
            {deleteInfo && deleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>

    </>
  );
};

export default Transactions;
