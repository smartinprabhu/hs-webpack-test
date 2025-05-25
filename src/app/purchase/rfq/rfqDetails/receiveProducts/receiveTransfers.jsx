/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip /* , Drawer */ } from 'antd';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  Badge
} from 'reactstrap';


import incomingIcon from '@images/icons/incomingStock.svg';
import outcomingIcon from '@images/icons/outgoingStock.svg';
import transferIcon from '@images/transfers.svg';

/* import DrawerHeader from '@shared/drawerHeader'; */
import Drawer from "@mui/material/Drawer";
import CommonGrid from "../../../../commonComponents/commonGrid";
import DrawerHeader from "../../../../commonComponents/drawerHeader";
import { MaterialRequestColumns, ReceiveTransferColumns } from "../../../../commonComponents/gridColumns";
import RpDetail from './receivedProductsDetail';

import {
  getInventorySettingDetails,
} from '../../../../siteOnboarding/siteService';
import actionCodes from '../../../../inventory/data/actionCodes.json';
import {
  getOperationType,
} from '../../../../inventory/inventoryService';
import { getPartsData } from '../../../../preventiveMaintenance/ppmService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDateAndTimeForDifferentTimeZones, getDatesOfQueryWithUtc,
  getListOfModuleOperations,
  getPagesCountV2,
  prepareDocuments, queryGeneratorWithUtc,
  truncate, debounce, getNewDataGridFilterArray, getNextPreview
} from '../../../../util/appUtils';
import {
  getCheckedRowsTransfers,
  getStockLocations,
  getStockPickingTypesList,
  getTransferDetail,
  getTransferExport,
  getTransferFilters,
  getTransfers, getTransfersCount,
  resetAddReceiptInfo,
  resetUpdateReceiptInfo,
  setInitialValues,
  resetUnreserveProducts,
} from '../../../purchaseService';
import { filterStringGeneratorTransfers } from '../../../utils/utils';
import AddReceipt from './addReceipt/addReceiptNew';
import filtersFields from './filters/filtersFields.json';

import AsyncFileUpload from '../../../../commonComponents/asyncFileUpload';
import customDataDashboard from '../../../../inventory/overview/data/customData.json';
import { AddThemeBackgroundColor } from '../../../../themes/theme';
import { InventoryModule } from '../../../../util/field';

const appModels = require('../../../../util/appModels').default;

const defaultIcon = {
  outgoing: outcomingIcon,
  incoming: incomingIcon,
  internal: transferIcon,
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ReceiveTransfers = (props) => {
  const {
    transferCode,
    listName,
    pickingId,
    fromOverview,
    setFromOverview
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [customFilters, setCustomFilters] = useState([]);
  const [addRfqModal, showAddRfqModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [isEdit, setEdit] = useState(false);
  let defaultColumnFields = InventoryModule.inventoryDefaultColumnField;
  if (transferCode === 'internal') {
    defaultColumnFields = InventoryModule.invenotryExtraDefaultColumnField;
  }
  const [columnFields, setColumns] = useState(defaultColumnFields);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  let apiFields = InventoryModule.inventoryApiFields;

  if (transferCode === 'outgoing') {
    apiFields = InventoryModule.inventoryOutgoingApiFields;
  } else if (transferCode === 'internal') {
    apiFields = InventoryModule.inventoryInternalApiFields;
  }

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openOperation, setOpenOperation] = useState(false);

  const [operationData, setOprationData] = useState([]);
  const [operationGroups, setOpration] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [dateGroups, setDateGroups] = useState([]);

  const [isMultiLocation, setMultiLocation] = useState(false);
  const [locationId, setLocationId] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [locationName, setLocationName] = useState(false);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { inventoryStatusDashboard } = useSelector((state) => state.inventory);
  const companies = getAllowedCompanies(userInfo);
  const {
    transfersInfo,
    transferFilters, transferDetails,
    transfersCount, transfersCountLoading,
    updateReceiptInfo, filterInitailValues, addReceiptInfo,
    stateChangeInfo, backorderInfo,
    operationTypesInfo, stateValidateInfo,
    stockLocations, statusUpdateInfo, transfersExportInfo,
    noStatusUpdateInfo, stockScrapInfo,
  } = useSelector((state) => state.purchase);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatableDefault = allowedOperations.includes(actionCodes['Add Transfer']);
  const isEditableDefault = allowedOperations.includes(actionCodes['Edit Transfer']);
  const isViewableDefault = allowedOperations.includes(actionCodes['View Transfer']);

  const isInwardCreatable = isCreatableDefault || allowedOperations.includes(actionCodes['Add Inward Transfer']);
  const isOutwardCreatable = isCreatableDefault || allowedOperations.includes(actionCodes['Add Outward Transfer']);
  const isMaterialCreatable = isCreatableDefault || allowedOperations.includes(actionCodes['Add Material Transfer']);

  const isInwardEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Inward Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';
  const isOutwardEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Outward Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';
  const isMaterialEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Material Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';

  const isInwardViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Inward Transfer']);
  const isOutwardViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Outward Transfer']);
  const isMaterialViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Material Transfer']);

  let isCreatable = false;
  let isEditable = false;
  let isViewable = false;

  if (transferCode === 'incoming') {
    isCreatable = isInwardCreatable;
    isEditable = isInwardEditable;
    isViewable = isInwardViewable;
  } else if (transferCode === 'outgoing') {
    isCreatable = isOutwardCreatable;
    isEditable = isOutwardEditable;
    isViewable = isOutwardViewable;
  } else if (transferCode === 'internal') {
    isCreatable = isMaterialCreatable;
    isEditable = isMaterialEditable;
    isViewable = isMaterialViewable;
  }

  const stateData = stateChangeInfo && stateChangeInfo.data ? stateChangeInfo.data : false;
  const validateData = stateValidateInfo && stateValidateInfo.data ? stateValidateInfo.data : false;
  const boData = backorderInfo && backorderInfo.data ? backorderInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isStateChange = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  const isNotValidated = (validateData && validateData.data && typeof validateData.data === 'object');
  const isValidated = (validateData && validateData.data && typeof validateData.data === 'boolean') || (validateData && !isNotValidated && validateData.status);

  const isBoNoStatus = (boData && boData.data && typeof boData.data === 'object');
  const isBoStatus = (boData && boData.data && typeof boData.data === 'boolean') || (boData && !isBoNoStatus && boData.status);

  const searchColumns = InventoryModule.inventorySearchColumn;
  const advanceSearchColumns = InventoryModule.inventoryAdvanceSearchColumn;

  function getMajorCloumns() {
    let res = filtersFields.columns;
    if (transferCode === 'outgoing') {
      res = filtersFields.outColumns;
    } else if (transferCode === 'internal') {
      res = filtersFields.intColumns;
    }
    return res;
  }

  const columns = useMemo(() => (getMajorCloumns()), []);
  const data = useMemo(() => (transfersInfo.data ? transfersInfo.data : [{}]), [transfersInfo.data]);

  let hiddenColumns = InventoryModule.inventoryHiddenColumn;

  if (transferCode === 'outgoing') {
    hiddenColumns = InventoryModule.inventoryOutgoingHiddenColumn;
  } else if (transferCode === 'internal') {
    hiddenColumns = InventoryModule.inventoryInternalHiddenColumn;
  }

  const customNames = customDataDashboard.types;

  const initialState = {
    hiddenColumns,
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(transfersInfo && transfersInfo.data && transfersInfo.data.length && transfersInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(transfersInfo && transfersInfo.data && transfersInfo.data.length && transfersInfo.data[transfersInfo.data.length - 1].id);
    }
  }, [transfersInfo]);

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
    }
  }, [userInfo]);

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

  const getPickingData = (array) => {
    const pickData = array;
    for (let i = 0; i < pickData.length; i += 1) {
      const pickValue = `${pickData[i].name} - ${pickData[i].warehouse_id[1]}`;
      pickData[i].picking_type_id = [pickData[i].id, pickValue];
    }
    return pickData;
  };

  /* useEffect(() => {
    dispatch(getTransferFilters([]));
  }, []); */

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      // dispatch(getStockLocations(companies, appModels.STOCKLOCATION, false, 'scrap'));
    }
  }, []); */

  useEffect(() => {
    if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setMultiLocation(true);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length) {
      setMultiLocation(false);
      setLocationId(stockLocations.data[0].id);
      setLocationName(stockLocations.data[0].name);
    }
  }, [stockLocations]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [viewId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsTransfers(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (editId && updateReceiptInfo && updateReceiptInfo.data) {
      dispatch(getTransferDetail(editId, appModels.STOCK));
    }
  }, [updateReceiptInfo]);

  useEffect(() => {
    if (pickingId && viewId) {
      dispatch(getOperationType(pickingId, appModels.STOCKPICKINGTYPES, 'mini'));
    }
  }, [pickingId, viewId]);

  useEffect(() => {
    if (pickingId && addRfqModal) {
      dispatch(getOperationType(pickingId, appModels.STOCKPICKINGTYPES, 'mini'));
    }
  }, [pickingId, addRfqModal]);

  useEffect(() => {
    if (transferFilters && transferFilters.customFilters) {
      setCustomFilters(transferFilters.customFilters);
    }
  }, [transferFilters]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getTransferFilters([]));
    }
  }, [reload]);


  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, 'requested_on', userInfo.data) : '';
      dispatch(getTransfersCount(companies, appModels.STOCK, customFiltersList, globalFilter, transferCode));
    }
  }, [userInfo, transferFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, 'requested_on', userInfo.data) : '';
      //  setCheckRows([])
      dispatch(getTransfers(companies, appModels.STOCK, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, transferCode));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, transferFilters, globalFilter]);

  useEffect(() => {
    if ((isStateChange) || (isValidated) || (isBoStatus) || (statusUpdateInfo && statusUpdateInfo.data) || (noStatusUpdateInfo?.data)) {
      const customFiltersList = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, false, userInfo.data) : '';
      // dispatch(getTransfersCount(companies, appModels.STOCK, customFiltersList, transferCode));
      dispatch(getTransfers(companies, appModels.STOCK, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, transferCode));
    }
  }, [stateChangeInfo, backorderInfo, stateValidateInfo, statusUpdateInfo, noStatusUpdateInfo]);

  useEffect(() => {
    if ((addReceiptInfo && addReceiptInfo.data) || (updateReceiptInfo && updateReceiptInfo.data) || (stockScrapInfo && stockScrapInfo.data)) {
      const customFiltersList = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTransfersCount(companies, appModels.STOCK, customFiltersList, globalFilter, transferCode));
      dispatch(getTransfers(companies, appModels.STOCK, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, transferCode));
    }
  }, [addReceiptInfo, updateReceiptInfo, stockScrapInfo]);


  useEffect(() => {
    if (operationTypesInfo && operationTypesInfo.data) {
      const pickingGroup = getPickingData(operationTypesInfo.data);
      setOpration(pickingGroup);
      // setOpration(operationTypesInfo.data);
    }
  }, [operationTypesInfo]);

  const totalDataCount = transfersCount && transfersCount.length ? transfersCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const onReset = () => {
    dispatch(resetUpdateReceiptInfo());
    dispatch(resetAddReceiptInfo());
    setEdit(false);
    setEditId(false);
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
      const dataValue = transfersInfo && transfersInfo.data ? transfersInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = transfersInfo && transfersInfo.data ? transfersInfo.data : [];
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
    dispatch(getTransferFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (transfersInfo && transfersInfo.loading) || (transfersCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (transfersInfo && transfersInfo.err) ? generateErrorMessage(transfersInfo) : userErrorMsg;

  const dateFilters = transferFilters && transferFilters.customFilters && transferFilters.customFilters.length > 0 ? transferFilters.customFilters : [];

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = transferFilters && transferFilters.customFilters ? transferFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getTransferFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
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
    const oldCustomFilters = transferFilters && transferFilters.customFilters
      ? transferFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getTransferFilters(customFilters1));

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
      const oldCustomFilters = transferFilters && transferFilters.customFilters ? transferFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getTransferFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('rfqForm')) {
      document.getElementById('rfqForm').reset();
    }
    dispatch(getPartsData([]));
    dispatch(resetAddReceiptInfo());
    showAddRfqModal(true);
  };

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={transferData.name} placement="right">
      {customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}
      {' '}
      -
      {' '}
      {truncate(transferData.name, '50')}
    </Tooltip>
  );
  const closeWindow = () => {
    showAddModal(false);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddReceiptInfo());
    showAddRfqModal(false);
  };

  const advanceSearchjson = {
    request_state: setOpenStatus,
    requested_on: setOpenDate,
  };

  useEffect(() => {
    if (openDate) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenOperation(false);
    }
  }, [openDate]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenDate(false);
      setOpenOperation(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openOperation) {
      setKeyword(' ');
      setOpenDate(false);
      setOpenStatus(false);
    }
  }, [openOperation]);

  useEffect(() => {

    if ((userInfo && userInfo.data) && (transfersCount && transfersCount.length) && startExport) {
      const offsetValue = 0;

      const customFiltersQuery = transferFilters && transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, 'requested_on', userInfo.data) : '';

      dispatch(getTransferExport(userInfo.data.company.id, appModels.STOCK, transfersCount.length, offsetValue, apiFields, encodeURIComponent(customFiltersQuery), rows, sortedValue.sortBy, sortedValue.sortField, transferCode));
    }
  }, [startExport]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'request_state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTransferFilters(customFiltersList));
      removeData('data-request_state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getTransferFilters(customFiltersList));
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
        key: 'requested_on', title: 'Expected Date', value, label: 'Requested on', type: 'customdate', start, end,
      }];
      if (start && end) {
        const oldCustomFilters = transferFilters && transferFilters.customFilters ? transferFilters.customFilters : [];
        const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
        dispatch(getTransferFilters(customFilters1));
        removeData('data-requested_on');
      }
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getTransferFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
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
      dispatch(getTransferFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  // const handleOperationChange = (event, dat) => {
  //   const { checked, value, name } = event.target;
  //   const whname = dat && dat.picking_type_id ? dat.picking_type_id[1] : 'Warehouse';
  //   const filters = {
  //     id: value, label: `${name} (${dat.code}) - ${whname}`, source_id: dat.default_location_src_id, destination_id: dat.default_location_dest_id, name,
  //   };
  //   if (checked) {
  //     const customFiltersList = [...customFilters, ...filters];
  //     dispatch(getTransferFilters(customFiltersList));
  //     removeData('data-picking_type_id');
  //   } else {
  //     setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
  //     setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
  //     if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
  //       dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems.filter((item) => item.id !== value), customFiltersList));
  //     }
  //   }
  //   setOffset(0);
  //   setPage(0);
  // };

  useEffect(() => {
    if (userInfo && userInfo.data && openOperation) {
      dispatch(getStockPickingTypesList(companies, appModels.STOCKPICKINGTYPES, [], []));
    }
  }, [userInfo, openOperation]);

  // const getPickingGroup = (array) => {
  //   console.log(array);
  //   // const pickData = [];
  //   // for (let i = 0; i < array.length; i++) {
  //   //   array[i].picking_type_id = [array[i].id, array[i].warehouse_id[1]];
  //   // }
  //   // return array;
  // };

  useEffect(() => {
    if (
      visibleColumns &&
      Object.keys(visibleColumns) &&
      Object.keys(visibleColumns).length === 0
    ) {
      if (transferCode === 'internal') {
        setVisibleColumns({
          _check_: true,
          name: true,
          use_in: true,
          request_state: true,
          asset_id: true,
          space_id: true,
          employee_id: true,
          department_id: true,
          requested_by_id: true,
          requested_on: true,
          approved_by_id: true,
          note: true,
          expires_on: false,
          location_id: false,
          location_dest_id: false,
        });
      } else {
        setVisibleColumns({
          _check_: true,
          name: true,
          partner_id: true,
          requested_on: true,
          note: true,
          request_state: true,
          dc_no: false,
          po_no: false,
          expires_on: false,
          location_id: false,
          location_dest_id: false,
        });
      }
    }
  }, [visibleColumns]);

  const onClickClear = () => {
    dispatch(getTransferFilters([]));
    setValueArray([]);
    const filterField = getMajorCloumns();
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenDate(false);
    setOpenStatus(false);
    setOpenOperation(false);
  };

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getStatusDynamicArray(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i += 1) {
      const dName = getStatusFieldName(arr[i].label);
      const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
      const ogData = pickingData.filter((item) => (item.code === transferCode));
      if (ogData && ogData.length && dName) {
        arr[i].label = ogData[0][dName];
        newArr.push(arr[i]);
      } else {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  const onFilterChange = (data) => {
    const fields = [
      "name",
      "partner_id",
      "note",
      "request_state",
      "dc_no",
      "po_no",
      "location_id",
      "location_dest_id",
    ];
    let query =
      '"|","|","|","|","|","|","|",';

    const oldCustomFilters =
      transferFilters && transferFilters.customFilters
        ? transferFilters.customFilters
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
        uniqueCustomFilter = getNewDataGridFilterArray(transferCode === 'internal' ? MaterialRequestColumns() : ReceiveTransferColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getTransferFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTransferFilters(customFilters));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [transferFilters]
  );

  const stateValuesList = (transferFilters && transferFilters.customFilters && transferFilters.customFilters.length > 0)
    ? transferFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateValuesList = (transferFilters && transferFilters.customFilters && transferFilters.customFilters.length > 0)
    ? transferFilters.customFilters.filter((item) => item.type === 'customdate') : [];

  const dateValues = getColumnArrayById(dateValuesList, 'value');
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  AsyncFileUpload(addReceiptInfo, uploadPhoto);

  const appliedFilters = filterStringGeneratorTransfers(transferFilters);

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
          transfersInfo && transfersInfo.data && transfersInfo.data.length
            ? transfersInfo.data
            : []
        }
        columns={transferCode === 'internal' ? MaterialRequestColumns() : ReceiveTransferColumns()}
        setFilterFromOverview={setFromOverview}
        checkboxSelection
        pagination={true}
        disableRowSelectionOnClick
        moduleName={transferCode == 'incoming' ? "Inward Stock List" : (transferCode == 'internal' ? 'Material Requests List' : 'Outward Stock List')}
        exportFileName={transferCode == 'incoming' ? "Inward_Stock" : (transferCode == 'internal' ? 'Material Requests' : 'Outward Stock')}
        listCount={totalDataCount}
        exportInfo={transfersExportInfo}
        filters={appliedFilters}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',//transferCode =='incoming' ? "Create Inward Stock" : ( transferCode =='internal' ? 'Create Material Requests' : 'Create Outward Stock'),
          func: () => { dispatch(getStockLocations(companies, appModels.STOCKLOCATION, false, 'scrap')); showAddModal(true); },
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={transfersInfo && transfersInfo.loading}
        err={transfersInfo && transfersInfo.err}
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
        moduleCustomHeader={
          fromOverview && customFilters && customFilters.length ?
            (<>
              {customFilters.map((cf) => (
                ((cf.type === 'customdate' || cf.type === 'date') && fromOverview || (cf.type !== 'customdate' && cf.type !== 'dates                                        ')) && <p key={cf.value} className="mr-2 content-inline">
                  <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
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
                    {cf.type === 'text' && (
                      <span>
                        {'  '}
                        :
                        {' '}
                        {decodeURIComponent(cf.value)}
                      </span>
                    )}
                    {(cf.type === 'customdate' && cf.key !== 'requested_on') && (
                      <span>
                        {'  '}
                        :
                        {' '}
                        {getCompanyTimezoneDate(cf.startDateDisplay ? cf.startDateDisplay : cf.start, userInfo, 'date')}
                        {' - '}
                        {getCompanyTimezoneDate(cf.endDateDisplay ? cf.endDateDisplay : cf.end, userInfo, 'date')}
                      </span>
                    )}
                    {(cf.type === 'customdate' && cf.key === 'requested_on' && cf.value) && (
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
              ))}
            </>
            ) : ''
        }
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
          headerName={`Create ${customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}`}
          onClose={closeWindow}
        />
        <AddReceipt
          id={false}
          editId={false}
          afterReset={() => { closeWindow(); onReset(); }}
          code={transferCode}
          isMultiLocation={isMultiLocation}
          locationId={locationId}
          locationName={locationName}
          isShow={addModal}
          pickingData={pickingId ? { id: pickingId, name: transferCode } : {}}
        />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={viewModal && isViewable}
      >
        <DrawerHeader
          headerName={transferDetails && (transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading)
            ? drawertitleName : 'Transfers'}
          isEditable={(isEditable && (transferDetails && !transferDetails.loading))}
          onClose={() => onViewReset()}
          onEdit={() => {
            dispatch(resetUnreserveProducts());
            setEditId(transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].id : false);
            setEdit(!isEdit);
            dispatch(resetUpdateReceiptInfo());
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', transfersInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', transfersInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', transfersInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', transfersInfo));
          }}
        />
        <RpDetail isEdits={editId} transferCode={transferCode} pickingId={pickingId} />
      </Drawer>
      {/*<Row className="ml-1 mr-1 mb-2 p-1 ppm-scheduler">
      <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2 itAsset-table-title">
              <Col md="9" xs="12" sm="9" lg="9">
                <span className="p-0 mr-2 font-weight-800 font-medium">
                  {listName}
                  {' '}
                  List :
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
                          {cf.type === 'text' && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {decodeURIComponent(cf.value)}
                            </span>
                          )}
                          {(cf.type === 'customdate' && cf.key !== 'requested_on') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {getCompanyTimezoneDate(cf.startDateDisplay ? cf.startDateDisplay : cf.start, userInfo, 'date')}
                              {' - '}
                              {getCompanyTimezoneDate(cf.endDateDisplay ? cf.endDateDisplay : cf.end, userInfo, 'date')}
                            </span>
                          )}
                          {(cf.type === 'customdate' && cf.key === 'requested_on' && cf.value) && (
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
                    <CreateList name={`Create ${listName}`} showCreateModal={addAdjustmentWindow} />
                  )}
                  <ExportList response={(transfersInfo && transfersInfo.data && transfersInfo.data.length)} />
                  <DynamicColumns
                    setColumns={setColumns}
                    columnFields={columnFields}
                    allColumns={allColumns}
                    setColumnHide={setColumnHide}
                  />
                </div>
                {(transfersInfo && transfersInfo.data && transfersInfo.data.length) && (
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
                          apiFields={InventoryModule.inventoryApiFields}
                          code={transferCode}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
            {(transfersInfo && transfersInfo.data && transfersInfo.data.length > 0) && (
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
                    tableData={transfersInfo}
                    transferLabelFunction={getStatusTransferDynamicLabel}
                    actions={{
                      /*  hideSorting: {
                        fieldName: ['line_ids.length', 'company_id'],
                      },
                       edit: {
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
            {columnHide && columnHide.length && ((transfersInfo && transfersInfo.err) || isUserError) ? (
              <ErrorContent errorTxt={errorMsg} />) : ''}
            {openStatus && (
              <StaticCheckboxFilter
                selectedValues={stateValues}
                dataGroup={statusGroups}
                onCheckboxChange={handleCheckboxChange}
                target="data-request_state"
                title="Status"
                openPopover={openStatus}
                toggleClose={() => setOpenStatus(false)}
                setDataGroup={setStatusGroups}
                keyword={keyword}
                data={getStatusDynamicArray(customData.statusTransferTypes)}
              />
            )}
            {openDate && (
              <StaticCheckboxFilter
                selectedValues={dateValues}
                dataGroup={dateGroups}
                onCheckboxChange={handleDateCheckboxChange}
                target="data-requested_on"
                title="Schedule Date"
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
        className="drawer-bg-lightblue"
        width="50%"
        visible={addRfqModal}
      >

        <DrawerHeader
          title={`Create ${customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}`}
          imagePath={transferCode && defaultIcon[transferCode] ? defaultIcon[transferCode] : transferIcon}
          closeDrawer={() => { showAddRfqModal(false); onReset(); }}
        />
        <AddReceipt
          id={false}
          editId={false}
          afterReset={() => { showAddRfqModal(false); onReset(); }}
          code={transferCode}
          isMultiLocation={isMultiLocation}
          locationId={locationId}
          isShow={addRfqModal}
          pickingData={pickingId ? { id: pickingId, name: transferCode } : {}}
        />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        width={1250}
        className="drawer-bg-lightblue"
        visible={viewModal}
      >
        <DrawerHeader
          title={transferDetails && (transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading)
            ? drawertitleName : 'Transfers'}
          imagePath={false}
          isEditable={(isEditable && (transferDetails && !transferDetails.loading))}
          closeDrawer={() => onViewReset()}
          onEdit={() => {
            setEditId(transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].id : false);
            setEdit(!isEdit);
            dispatch(resetUpdateReceiptInfo());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <RpDetail />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width="50%"
        visible={isEdit}
      >

        <DrawerHeader
          title={`Update ${customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}`}
          imagePath={transferCode && defaultIcon[transferCode] ? defaultIcon[transferCode] : transferIcon}
          closeDrawer={() => { setEdit(false); onReset(); }}
        />
        <AddReceipt
          id={false}
          editId={editId}
          afterReset={() => onReset()}
          closeEditModal={() => setEdit(false)}
          code={transferCode}
          isMultiLocation={isMultiLocation}
          locationId={locationId}
          isShow={isEdit}
          pickingData={transferDetails && (transferDetails.data && transferDetails.data.length > 0) && transferDetails.data[0].picking_type_id && transferDetails.data[0].picking_type_id.length ? { id: transferDetails.data[0].picking_type_id[0], name: transferDetails.data[0].picking_type_id[1] } : {}}
        />
      </Drawer>
    </Row>*/}
    </>
  );
};

ReceiveTransfers.propTypes = {
  listName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  transferCode: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  pickingId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default ReceiveTransfers;
