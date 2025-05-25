/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import uniqBy from 'lodash/unionBy';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
/* import {
  Drawer,
} from 'antd'; */
import CommodityIcon from '@images/sideNavImages/commodityTransactions_black.svg';

import Drawer from '@mui/material/Drawer';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
/* import DrawerHeader from '@shared/drawerHeader'; */
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';


import DrawerHeader from '../../commonComponents/drawerHeader';
import { CommodityTankersColumns } from '../../commonComponents/gridColumns';
import CommonGrid from '../../commonComponents/commonGrid';

import filtersFields from '../data/filtersFields.json';
import {
  getPagesCountV2,
  queryGeneratorV1, getAllCompanies, getColumnArrayById,
  queryGeneratorWithUtc,
  getArrayFromValuesByItem, getListOfModuleOperations,
  generateArrayFromValue, getDateAndTimeForDifferentTimeZones,
  formatFilterData, debounce, getNextPreview,
} from '../../util/appUtils';
import {
  getTanker, getTankerCount,
  getTankerFilters, getTankerDetails, getCommodityGroups, getVendorGroups, getTankerExport,
} from '../tankerService';
import {
  setSorting,
} from '../../assets/equipmentService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getDelete, resetDelete, resetCreateProductCategory, resetUpdateProductCategory,
} from '../../pantryManagement/pantryService';
import TankerDetail from './tankerDetail/tankerDetail';
import AddTanker from './addTanker';
import actionCodes from '../data/actionCodes.json';

import { TransactionModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Tankers = (props) => {
  const limit = 10;
  const tableColumns = CommodityTankersColumns();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(TransactionModule.tankersApiFields);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [editData, setEditData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(true);

  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [openVendor, setOpenVendor] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [openCommodity, setOpenCommodity] = useState(false);
  const [commodityGroups, setCommodityGroups] = useState([]);
  const [addModal, showAddModal] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    tankerTransactionsCount, tankerTransactions, tankerTransactionsCountLoading,
    tankerTransactionFilters, tankerTransactionDetail, vendorGroupsInfo, commodityGroupsInfo, tankerTransactionsExport,
  } = useSelector((state) => state.tanker);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    deleteInfo, addProductCategoryInfo, updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Tanker']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Tanker']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Tanker']);

  const listHead = 'Tanker List:';

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'id' }));
  }, []);

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
      dispatch(getVendorGroups(companies, appModels.TANKERS));
    }
  }, [openVendor]);

  useEffect(() => {
    if (openCommodity) {
      dispatch(getCommodityGroups(companies, appModels.TANKERS));
    }
  }, [openCommodity]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTankerCount(companies, appModels.TANKERS, customFiltersList));
      dispatch(getTanker(companies, appModels.TANKERS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo, stateChangeInfo]);

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
      dispatch(getTankerCount(companies, appModels.TANKERS, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getTanker(companies, appModels.TANKERS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, customFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTankerDetails(viewId, appModels.TANKERS));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (tankerTransactionsCount && tankerTransactionsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = tankerTransactionFilters && tankerTransactionFilters.customFilters ? queryGeneratorV1(tankerTransactionFilters.customFilters) : '';
      dispatch(getTankerExport(companies, appModels.TANKERS, tankerTransactionsCount.length, offsetValue, TransactionModule.transactionApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, tankerTransactionsCount, startExport]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getTankerDetails(addProductCategoryInfo.data[0], appModels.TANKERS));
    }
  }, [addProductCategoryInfo]);

  useEffect(() => {
    if (viewId && tankerTransactions && tankerTransactions.data) {
      const teamData = generateArrayFromValue(tankerTransactions.data, 'id', viewId);
      setEditData(teamData);
    }
  }, [viewId]);

  const searchColumns = TransactionModule.tankersSearchColumn;

  const hiddenColumns = TransactionModule.tankersHiddenColumn;

  const advanceSearchColumns = TransactionModule.tankersAdvanceSearchColumn;

  const columns = useMemo(() => filtersFields.tankercolumns, []);
  const data = useMemo(() => (tankerTransactions.data ? tankerTransactions.data : [{}]), [tankerTransactions.data]);
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

  const totalDataCount = tankerTransactionsCount && tankerTransactionsCount.length ? tankerTransactionsCount.length : 0;

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
      const datas = tankerTransactions && tankerTransactions.data ? tankerTransactions.data : [];
      const newArr = [...getColumnArrayById(datas, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const datas = tankerTransactions && tankerTransactions.data ? tankerTransactions.data : [];
      const ids = getColumnArrayById(datas, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const removeData = (id, column) => {
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
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters ? tankerTransactionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getTankerFilters(customFilters1));
    }
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
      const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters ? tankerTransactionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
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

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getTankerFilters([]));
    setOffset(0);
    setPage(1);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    showAddModal(false);
    showEditModal(false);
  };

  const openEditModalWindow = (values) => {
    setViewId(values.id);
    showEditModal(true);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getTankerFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  const onVendorSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = vendorGroups.filter((item) => {
        const searchValue = item.vendor_id ? item.vendor_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setVendorGroups(ndata);
    } else {
      setVendorGroups(vendorGroupsInfo && vendorGroupsInfo.data ? vendorGroupsInfo.data : []);
    }
  };

  const onCommoditySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = commodityGroups.filter((item) => {
        const searchValue = item.commodity ? item.commodity[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setCommodityGroups(ndata);
    } else {
      setCommodityGroups(commodityGroupsInfo && commodityGroupsInfo.data ? commodityGroupsInfo.data : []);
    }
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.TANKERS));
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

  const addAdjustmentWindow = () => {
    showAddModal(true);
  };

  const closeModal = () => {
    if (document.getElementById('configTankerForm')) {
      document.getElementById('configTankerForm').reset();
    }
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateProductCategory());
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateProductCategory());
    showEditModal(false);
    setSelectedUser(false);
  };

  const onClickClear = () => {
    dispatch(getTankerFilters([]));
    setValueArray([]);
    filtersFields.tankercolumns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenVendor(false);
    setOpenCommodity(false);
  };

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

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        commodity: true,
        capacity: true,
        vendor_id: true,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      'name',
      'commodity',
      'capacity',
      'vendor_id',
    ];
    let query = '"|","|","|",';

    const oldCustomFilters = tankerTransactionFilters && tankerTransactionFilters.customFilters
      ? tankerTransactionFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];

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
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
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
        columns={CommodityTankersColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Tankers List"
        exportFileName="Tankers"
        filters={filterText}
        listCount={totalDataCount}
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
            ? `${'Tanker'}${' - '}${tankerTransactionDetail.data[0].name}` : 'Tanker'}
          imagePath={CommodityIcon}
          onClose={() => onViewReset()}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', tankerTransactions)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', tankerTransactions)); }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', tankerTransactions) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', tankerTransactions));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', tankerTransactions) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', tankerTransactions));
          }}
        />
        <TankerDetail isTanker />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Add Tanker"
          imagePath={CommodityIcon}
          onClose={() => onViewReset()}
        />
        <AddTanker closeModal={closeModal} selectedUser={false} editData={false} />
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Tanker"
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
              successMessage="Tanker removed successfully.."
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
      {/*
    <Row className="pt-2">
      <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2 itAsset-table-title">
              <Col md="9" xs="12" sm="9" lg="9">
                <span className="p-0 mr-2 font-weight-800 font-medium">
                  {listHead}
                  {' '}
                  {totalDataCount}
                </span>
                <div className="content-inline">
                  {customFilters && customFilters.map((cf) => (
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
                  ))}
                  {customFilters && customFilters.length ? (
                    <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
                      Clear
                    </span>
                  ) : ''}
                </div>
              </Col>
              <Col md="3" xs="12" sm="3" lg="3">
                <div className="float-right">
                  <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  <ListDateFilters dateFilters={dateFilters} customFilters={customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  {isCreatable && (
                    <CreateList name="Add Transaction" showCreateModal={addAdjustmentWindow} />
                  )}
                  <ExportList response={tankerTransactions && tankerTransactions.data && tankerTransactions.data.length} />
                  {/* } <DynamicColumns
                    setColumns={setColumns}
                    columnFields={columnFields}
                    allColumns={allColumns}
                    setColumnHide={setColumnHide}
                  /> *
                </div>
                {tankerTransactions && tankerTransactions.data && tankerTransactions.data.length && (
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
                          apiFields={TransactionModule.tankersApiFields }
                          isTanker
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
            {(tankerTransactions && tankerTransactions.data) && (
              <span data-testid="success-case" />
            )}
            <div className="thin-scrollbar">
              <div className="table-responsive common-table">
                <Table responsive {...getTableProps()} className="mt-2">
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
                    tableData={tankerTransactions}
                    actions={{
                      edit: {
                        showEdit: isEditable,
                        editFunc: openEditModalWindow,
                      },
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
                {openCommodity && (
                  <DynamicCheckboxFilter
                    data={commodityGroupsInfo}
                    selectedValues={stateValues}
                    dataGroup={commodityGroups}
                    placeholder="Please search a Commodity"
                    filtervalue="commodity"
                    onCheckboxChange={handleCommodityChange}
                    toggleClose={() => setOpenCommodity(false)}
                    openPopover={openCommodity}
                    target="data-commodity"
                    title="Commodity"
                    keyword={keyword}
                    setDataGroup={setCommodityGroups}
                  />
                )}
                {openVendor && (
                  <DynamicCheckboxFilter
                    data={vendorGroupsInfo}
                    selectedValues={stateValues}
                    dataGroup={vendorGroups}
                    filtervalue="vendor_id"
                    onCheckboxChange={handleVendorChange}
                    toggleClose={() => setOpenVendor(false)}
                    openPopover={openVendor}
                    target="data-vendor_id"
                    title="Vendor"
                    keyword={keyword}
                    setDataGroup={setVendorGroups}
                  />
                )}
                <TableListFormat
                  userResponse={userInfo}
                  listResponse={tankerTransactions}
                  countLoad={tankerTransactionsCountLoading}
                />
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
      <Drawer
        title=""
        closable={false}
        width={1250}
        className="drawer-bg-lightblue"
        visible={viewModal}
      >
        <DrawerHeader
          title={tankerTransactionDetail && (tankerTransactionDetail.data && tankerTransactionDetail.data.length > 0)
            ? `${'Transaction'}${' - '}${tankerTransactionDetail.data[0].sequence}` : 'Transaction'}
          imagePath={TankerBlue}
          closeDrawer={() => onViewReset()}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <TankerDetail />
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Tanker"
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
            successMessage="Tanker removed successfully.."
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
            <Button size="sm"  variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
      <Drawer
        title=""
        closable={false}
        width={736}
        className="drawer-bg-lightblue"
        visible={addModal}
      >
        <DrawerHeader
          title="Add Tanker"
          imagePath={TankerBlue}
          closeDrawer={() => onViewReset()}
        />
        <AddTanker closeModal={closeModal} selectedUser={false} editData={false} />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        width={736}
        className="drawer-bg-lightblue"
        visible={editModal}
      >
        <DrawerHeader
          title="Edit Tanker"
          imagePath={TankerBlue}
          closeDrawer={() => onViewReset()}
        />
        <AddTanker closeModal={() => onUpdateReset()} selectedUser={viewId} editData={editData} />
      </Drawer>
      </Row> */}
    </>
  );
};

export default Tankers;
