/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip /* , Drawer */ } from 'antd';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

/* import DrawerHeader from '@shared/drawerHeader'; */
// import editIcon from '@images/icons/edit.svg';
// import editWhiteIcon from '@images/icons/editWhite.svg';
// import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones, getDatesOfQueryWithUtc,
  getListOfModuleOperations,
  getNewDataGridFilterArray,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  truncate,
  filterStringGeneratorDynamic, getNextPreview
} from '../../util/appUtils';
import { InventoryModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  getAdjustmentDetail,
  getAdjustmentFilters,
  getAdjustmentsCount,
  getAdjustmentsExport,
  getAdjustmentsList,
  getCheckedRowsAdjustment,
  getSelectedProducts, resetActionData,
  resetCreateAdjustment, resetUpdateAdjustment,
  resetValidateStock,
  resetAuditExists,
  setInitialValues,
} from '../inventoryService';
import AddAdjustment from './addAdjustment';
import AdjustmentDetail from './adjustmentDetails/adjustmentDetail';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import { filterStringGenerator, getStateText } from './utils/utils';

import Drawer from "@mui/material/Drawer";
import CommonGrid from "../../commonComponents/commonGrid";
import DrawerHeader from "../../commonComponents/drawerHeader";
import { StockAuditColumns } from "../../commonComponents/gridColumns";

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Adjustments = (props) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentPage, setPage] = useState(0);
  const [statusValue, setStatusValue] = useState(0);
  const [dateValue, setDateValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkDateItems, setCheckDateItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [viewId, setViewId] = useState(false);
  // const [isButtonHover, setButtonHover] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  // const [isButtonHover1, setButtonHover1] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [columnFields, setColumns] = useState(customData && customData.listAdjustmentFieldsShows ? customData.listAdjustmentFieldsShows : []);
  const apiFields = customData && customData.listAdjustmentFieldsShows ? customData.listAdjustmentFieldsShows : [];
  const [viewModal, setViewModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const [statusGroups, setStatusGroups] = useState([]);
  const [dateGroups, setDateGroups] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    adjustmentCount, adjustmentsInfo, adjustmentCountLoading,
    adjustmentFilters, filterInitailValues, adjustmentDetail,
    updateAdjustmentInfo, addAdjustmentInfo, actionResultInfo,
    stockValidateInfo, adjustmentExportInfo,
  } = useSelector((state) => state.inventory);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Adjustment']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Adjustment']);
  const isViewable = allowedOperations.includes(actionCodes['View Adjustment']);

  useEffect(() => {
    if (adjustmentExportInfo && adjustmentExportInfo.data && adjustmentExportInfo.data.length > 0) {
      adjustmentExportInfo.data.map((data) => {
        data.state = getStateText(data.state);
      });
    };
  }, [adjustmentExportInfo]);

  useEffect(() => {
    if (adjustmentFilters && adjustmentFilters.statuses) {
      setCheckItems(adjustmentFilters.statuses);
    }
    if (adjustmentFilters && adjustmentFilters.dates) {
      setCheckDateItems(adjustmentFilters.dates);
    }
    if (adjustmentFilters && adjustmentFilters.customFilters) {
      setCustomFilters(adjustmentFilters.customFilters);
      const vid = isArrayValueExists(adjustmentFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [adjustmentFilters]);

  const searchColumns = InventoryModule.stockAuditSearchColumn;
  const advanceSearchColumns = InventoryModule.stockAuditAdvanceSearchColumn;

  const columns = useMemo(() => (filtersFields.columns), []);
  const data = useMemo(() => (adjustmentsInfo.data ? adjustmentsInfo.data : [{}]), [adjustmentsInfo.data]);

  const hiddenColumns = InventoryModule.stockAuditHiddenColumn;

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
  const removeData = (id, column) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  /* useEffect(() => {
    dispatch(getAdjustmentFilters([]));
  }, []); */

  useEffect(() => {
    if (reload) {
      setGlobalFilter(false);
      dispatch(getAdjustmentFilters([]));
      setPage(0);
      setOffset(0);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue.sortBy && sortedValue.sortField) {
      const customFiltersList = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, 'date', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, adjustmentFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, 'date', userInfo.data) : '';
      dispatch(getAdjustmentsCount(companies, appModels.INVENTORY, customFiltersList, globalFilter));
    }
  }, [adjustmentFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAdjustmentDetail(viewId, appModels.INVENTORY));
    }
  }, [viewId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsAdjustment(payload));
  }, [checkedRows]);

  const totalDataCount = adjustmentCount && adjustmentCount.length ? adjustmentCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columnFields.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    dispatch(resetValidateStock());
  }, []);

  useEffect(() => {
    if (addAdjustmentInfo && addAdjustmentInfo.data) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilter = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAdjustmentsCount(companies, appModels.INVENTORY, statusValues, dateValues, customFilters, globalFilter));
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, customFilter, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addAdjustmentInfo]);

  useEffect(() => {
    if (updateAdjustmentInfo && updateAdjustmentInfo.data) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilter = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, customFilter, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [updateAdjustmentInfo]);

  useEffect(() => {
    if (actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status)) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilter = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, customFilter, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [actionResultInfo]);

  useEffect(() => {
    if (stockValidateInfo && stockValidateInfo.data && !stockValidateInfo.loading) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilter = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, customFilter, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [stockValidateInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && adjustmentCount && adjustmentCount.length) {
      const offsetValue = 0;
      const customFilters = adjustmentFilters.customFilters ? queryGeneratorWithUtc(adjustmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAdjustmentsExport(companies, appModels.INVENTORY, adjustmentCount.length, offsetValue, apiFields, customFilters, sortedValue.sortBy, sortedValue.sortField, rows));
    }
  }, [userInfo, adjustmentCount, startExport]);


  useEffect(() => {
    if (
      visibleColumns &&
      Object.keys(visibleColumns) &&
      Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        date: true,
        create_uid: true,
        location_id: true,
        state: true,
        reason_id: false,
        comments: false,
        total_qty: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      "name",
      "create_uid",
      "location_id",
      "state",
      "reason_id",
      "comments",

    ];
    let query =
      '"|","|","|","|","|",';

    const oldCustomFilters =
      adjustmentFilters && adjustmentFilters.customFilters
        ? adjustmentFilters.customFilters
        : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === "date" || item.type === "customdate"
    )) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
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
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), "field")
        );
        uniqueCustomFilter = getNewDataGridFilterArray(StockAuditColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getAdjustmentFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getAdjustmentFilters(customFilters));
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
    const oldCustomFilters = adjustmentFilters && adjustmentFilters.customFilters
      ? adjustmentFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getAdjustmentFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };


  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length && adjustmentsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length && adjustmentsInfo.data[adjustmentsInfo.data.length - 1].id);
    }
  }, [adjustmentsInfo]);

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
      const data = adjustmentsInfo && adjustmentsInfo.data ? adjustmentsInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = adjustmentsInfo && adjustmentsInfo.data ? adjustmentsInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const onAddReset = () => {
    dispatch(resetCreateAdjustment());
    dispatch(resetAuditExists());
    dispatch(getSelectedProducts());
    showAddModal(false);
  };

  const onUpdateReset = () => {
    dispatch(getSelectedProducts());
    dispatch(resetAuditExists());
    dispatch(resetUpdateAdjustment());
    showEditModal(false);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getAdjustmentFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const addAdjustmentWindow = () => {
    dispatch(resetActionData());
    if (document.getElementById('adjustmentForm')) {
      document.getElementById('adjustmentForm').reset();
    }
    dispatch(resetCreateAdjustment());
    dispatch(resetAuditExists());
    dispatch(resetUpdateAdjustment());
    dispatch(getSelectedProducts());
    showAddModal(true);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = adjustmentFilters && adjustmentFilters.customFilters ? adjustmentFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getAdjustmentFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
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
      const oldCustomFilters = adjustmentFilters && adjustmentFilters.customFilters ? adjustmentFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getAdjustmentFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const dateFilters = (adjustmentFilters && adjustmentFilters.customFilters && adjustmentFilters.customFilters.length > 0) ? adjustmentFilters.customFilters : [];

  const loading = (userInfo && userInfo.loading) || (adjustmentsInfo && adjustmentsInfo.loading) || (adjustmentCountLoading);

  const adjustmentData = adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) ? adjustmentDetail.data[0] : '';

  const isUserError = userInfo && userInfo.err;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (adjustmentsInfo && adjustmentsInfo.err) ? generateErrorMessage(adjustmentsInfo) : userErrorMsg;

  const drawertitleName = (
    <Tooltip title={adjustmentData.name} placement="right">
      {truncate(adjustmentData.name, '50')}
    </Tooltip>
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetCreateAdjustment());
    showAddModal(false);
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
      setPage(0);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getAdjustmentFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getAdjustmentFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getAdjustmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleDateCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const datesList = getDatesOfQueryWithUtc(value);
      const start = datesList[0];
      const end = datesList[1];
      const filters = [{
        key: 'date', title: 'Inventory Date', value, label: 'Inventory Date', type: 'customdate', start, end,
      }];
      if (start && end) {
        const oldCustomFilters = adjustmentFilters && adjustmentFilters.customFilters ? adjustmentFilters.customFilters : [];
        const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
        dispatch(getAdjustmentFilters(customFilters1));
        removeData('data-date');
      }
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getAdjustmentFilters(customFiltersList));
    }
  };

  const onClickClear = () => {
    dispatch(getAdjustmentFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
    setOpenDate(false);
  };

  const advanceSearchjson = {
    state: setOpenStatus,
    date: setOpenDate,
  };

  useEffect(() => {
    if (openDate) {
      setKeyword(' ');
      setOpenStatus(false);
    }
  }, [openDate]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenDate(false);
    }
  }, [openStatus]);

  const stateValuesList = (adjustmentFilters && adjustmentFilters.customFilters && adjustmentFilters.customFilters.length > 0)
    ? adjustmentFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateValuesList = (adjustmentFilters && adjustmentFilters.customFilters && adjustmentFilters.customFilters.length > 0)
    ? adjustmentFilters.customFilters.filter((item) => item.type === 'customdate') : [];

  const dateValues = getColumnArrayById(dateValuesList, 'value');


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
          height: "90%",
        }}
        tableData={
          adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length
            ? adjustmentsInfo.data
            : []
        }
        columns={StockAuditColumns()}
        checkboxSelection
        pagination={true}
        disableRowSelectionOnClick
        moduleName={'Stock Audits List'}
        exportFileName={'Stock Audits_On'}
        listCount={totalDataCount}
        exportInfo={adjustmentExportInfo}
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
        onFilterChanges={onFilterChange}
        loading={adjustmentsInfo && adjustmentsInfo.loading}
        filters={filterStringGeneratorDynamic(adjustmentFilters)}
        err={adjustmentsInfo && adjustmentsInfo.err}
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
        reload={{
          show: true,
          setReload,
          loading
        }}
      />

      <Drawer
        PaperProps={{
          sx: { width: "50%" },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Stock Audit"
          imagePath={InventoryBlue}
          onClose={() => onAddReset()}
        />
        <AddAdjustment
          isShow={true}
          isDrawerOpen={addModal}
          afterReset={() => { showAddModal(false); onAddReset(); dispatch(resetAuditExists()); }}
        />
      </Drawer>


      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={'Stock Audit'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data.length && (adjustmentDetail.data[0].state === 'draft' || adjustmentDetail.data[0].state === 'confirm') && (adjustmentDetail && !adjustmentDetail.loading))}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) ? adjustmentDetail.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetAuditExists());
            dispatch(resetCreateAdjustment());
            dispatch(resetUpdateAdjustment());
            dispatch(getSelectedProducts());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', adjustmentsInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', adjustmentsInfo)); }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', adjustmentsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', adjustmentsInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', adjustmentsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', adjustmentsInfo));
          }}
        />
        <AdjustmentDetail />
      </Drawer>

      {/*
    <Row className="ml-1 mr-1 mb-2 p-1 ppm-scheduler">
      <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2 itAsset-table-title">
              <Col md="9" xs="12" sm="9" lg="9">
                <span className="p-0 mr-2 font-weight-800 font-medium">
                  Stock Audits List :
                  {' '}
                  {columnHide && columnHide.length && totalDataCount}
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
                          {(cf.type === 'customdate' && cf.key !== 'date') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                              {' - '}
                              {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                            </span>
                          )}
                          {(cf.type === 'customdate' && cf.key === 'date') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {decodeURIComponent(cf.arrayLabel ? cf.value : cf.value)}
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
              <Col md="3" xs="12" sm="3" lg="3">
                <div className="float-right">
                  <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  <ListDateFilters dateFilters={dateFilters} customFilters={customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  {isCreatable && (
                    <CreateList name="Add Stock Audit" showCreateModal={addAdjustmentWindow} />
                  )}
                  <ExportList response={(adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length)} />
                  <DynamicColumns
                    setColumns={setColumns}
                    columnFields={columnFields}
                    allColumns={allColumns}
                    setColumnHide={setColumnHide}
                  />
                </div>
                {(adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length) && (
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
                          apiFields={InventoryModule.stockAuditApiFields}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
            {(adjustmentsInfo && adjustmentsInfo.data && adjustmentsInfo.data.length > 0) && (
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
                    tableData={adjustmentsInfo}
                    stateLabelFunction={getStateLabel}
                    actions={{
                      hideSorting: {
                        fieldName: ['line_ids.length', 'company_id'],
                      },
                      /* edit: {
                          showEdit: true,
                          editFunc: editAsset,
                        },
                        delete: {
                          showDelete: true,
                          deleteFunc: onRemoveSchedule,
                        }, *
                    }}
                    tableProps={{
                      page,
                      prepareRow,
                      getTableBodyProps,
                      headerGroups,
                    }}
                  />
                </Table>
              </div>
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                {columnHide && columnHide.length ? (
                  <Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                ) : ''}
              </div>
            )}
            {columnHide && !columnHide.length ? (
              <div className="text-center mb-4">
                Please select the Columns
              </div>
            ) : ''}
            {loading && (
              <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                <Loader />
              </div>
            )}
            {columnHide && columnHide.length && ((adjustmentsInfo && adjustmentsInfo.err) || isUserError) ? (
              <ErrorContent errorTxt={errorMsg} />) : ''}
            {openStatus && (
              <StaticCheckboxFilter
                selectedValues={stateValues}
                dataGroup={statusGroups}
                onCheckboxChange={handleCheckboxChange}
                target="data-state"
                title="Status"
                openPopover={openStatus}
                toggleClose={() => setOpenStatus(false)}
                setDataGroup={setStatusGroups}
                keyword={keyword}
                data={customData.stateTypes}
              />
            )}
            {openDate && (
              <StaticCheckboxFilter
                selectedValues={dateValues}
                dataGroup={dateGroups}
                onCheckboxChange={handleDateCheckboxChange}
                target="data-date"
                title="Inventory Date"
                openPopover={openDate}
                toggleClose={() => setOpenDate(false)}
                setDataGroup={setDateGroups}
                keyword={keyword}
                data={customData.orderDateFilters}
              />
            )}
          </CardBody>
        </Card>
      </Col>
      <Drawer
        title=""
        closable={false}
        width={736}
        className="drawer-bg-lightblue"
        visible={viewModal}
      >
        <DrawerHeader
          title={adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0 && !adjustmentDetail.loading)
            ? drawertitleName : 'Stock Audit'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data.length && (adjustmentDetail.data[0].state === 'draft' || adjustmentDetail.data[0].state === 'confirm') && (adjustmentDetail && !adjustmentDetail.loading))}
          closeDrawer={() => onViewReset()}
          onEdit={() => {
            setEditId(adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) ? adjustmentDetail.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetCreateAdjustment());
            dispatch(resetUpdateAdjustment());
            dispatch(getSelectedProducts());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <AdjustmentDetail />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={736}
        visible={addModal}
      >

        <DrawerHeader
          title="Create Stock Audit"
          imagePath={InventoryBlue}
          closeDrawer={() => onAddReset()}
        />
        <AddAdjustment
          isShow={addModal}
          isDrawerOpen={addModal}
          afterReset={() => { showAddModal(false); onAddReset(); }}
        />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={736}
        visible={editModal}
      >

        <DrawerHeader
          title="Update Stock Audit"
          imagePath={InventoryBlue}
          closeDrawer={() => onUpdateReset()}
        />
        <AddAdjustment
          isShow={addModal}
          editId={editId}
          isDrawerOpen={editModal}
          afterReset={() => { showEditModal(false); onUpdateReset(); }}
        />
      </Drawer>
        </Row> */}
    </>
  );
};

export default Adjustments;
