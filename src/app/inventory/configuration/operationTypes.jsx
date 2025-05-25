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

import InventoryBlue from '@images/icons/inventoryBlue.svg';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';


import Drawer from "@mui/material/Drawer";
import CommonGrid from "../../commonComponents/commonGrid";
import DrawerHeader from "../../commonComponents/drawerHeader";
import { OperationTypeColumns } from "../../commonComponents/gridColumns";

import {
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  truncate, getNextPreview
} from '../../util/appUtils';
import { InventoryModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  getCheckedRowsOPT, getOperationType,
  getOperationTypeCount,
  getOperationTypeFilters,
  getOperationTypeList,
  getOperationTypeListExport,
  resetCreateOpType, resetUpdateOpType,
  setInitialValues,
} from '../inventoryService';
import AddOperationType from './addOperationType';
import OperationTypeDetail from './operationTypeDetail/operationTypeDetail';
import { checklistStateLabel, operationData } from '../adjustments/utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const OperationTypes = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columnFields, setColumns] = useState(customData && customData.listFieldsOPTShows ? customData.listFieldsOPTShows : []);
  const apiFields = customData && customData.listFieldsOPTShows ? customData.listFieldsOPTShows : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});


  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [filtersIcon, setFilterIcon] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [customVariable, setCustomVariable] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);

  const [valueArray, setValueArray] = useState([]);

  const [viewModal, setViewModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);
  const {
    operationTypeCount, operationTypeListInfo, operationTypeCountLoading,
    operationTypeFilters, operationTypeDetails, filterInitailValues,
    addOpTypeInfo, updateOpTypeInfo, optExportListInfo,
  } = useSelector((state) => state.inventory);
  const {
    warhouseIds,
  } = useSelector((state) => state.site);

  const companies = warhouseIds && warhouseIds.data && warhouseIds.data.length ? getColumnArrayById(warhouseIds.data, 'id') : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Operation Type']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Operation Type']);
  const isViewable = allowedOperations.includes(actionCodes['View Operation Type']);

  const searchColumns = InventoryModule.operationTypeSearchColumn;

  const advanceSearchColumns = InventoryModule.operationTypeAdvanceSearchColumn;

  const hiddenColumns = InventoryModule.operationTypeHiddenCoulmn;

  /* useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []); */

  // const AddOperationType = React.lazy(() => import('./addOperationType'));

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = operationTypeFilters.customFilters ? queryGeneratorWithUtc(operationTypeFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationTypeCount(companies, appModels.STOCKPICKINGTYPES, customFiltersList, globalFilter));
    }
  }, [JSON.stringify(customFilters), reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((addOpTypeInfo && addOpTypeInfo.data))) {
      const customFiltersList = operationTypeFilters.customFilters ? queryGeneratorWithUtc(operationTypeFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationTypeCount(companies, appModels.STOCKPICKINGTYPES, customFiltersList));
      dispatch(getOperationTypeList(companies, appModels.STOCKPICKINGTYPES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(customFilters), reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = operationTypeFilters.customFilters ? queryGeneratorWithUtc(operationTypeFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationTypeList(companies, appModels.STOCKPICKINGTYPES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(customFilters), globalFilter, reload]);

  useEffect(() => {
    if (addOpTypeInfo && addOpTypeInfo.data) {
      const customFiltersList = operationTypeFilters.customFilters ? queryGeneratorWithUtc(operationTypeFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationTypeCount(companies, appModels.STOCKPICKINGTYPES, customFiltersList));
      dispatch(getOperationTypeList(companies, appModels.STOCKPICKINGTYPES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addOpTypeInfo]);

  useEffect(() => {
    if (updateOpTypeInfo && updateOpTypeInfo.data) {
      const customFiltersList = operationTypeFilters.customFilters ? queryGeneratorWithUtc(operationTypeFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOperationTypeList(companies, appModels.STOCKPICKINGTYPES, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [updateOpTypeInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (operationTypeCount && operationTypeCount.length && startExport)) {
      const offsetValue = 0;
      const customFiltersQuery = operationTypeFilters && operationTypeFilters.customFilters ? queryGeneratorV1(operationTypeFilters.customFilters) : '';
      dispatch(getOperationTypeListExport(companies, appModels.STOCKPICKINGTYPES, operationTypeCount.length, offsetValue, InventoryModule.operationTypeApiField, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, operationTypeCount, startExport]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsOPT(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (operationTypeFilters && operationTypeFilters.customFilters) {
      setCustomFilters(operationTypeFilters.customFilters);
      const vid = isArrayValueExists(operationTypeFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [operationTypeFilters]);

  useEffect(() => {
    setCustomFilters([]);
  }, []);

  useEffect(() => {
    if (viewId) {
      dispatch(getOperationType(viewId, appModels.STOCKPICKINGTYPES));
    }
  }, [viewId]);

  /*useEffect(() => {
    if (updateOpTypeInfo && updateOpTypeInfo.data && viewId) {
      dispatch(getOperationType(viewId, appModels.STOCKPICKINGTYPES));
    }
  }, [updateOpTypeInfo]);*/

  useEffect(() => {
    if (operationTypeListInfo && operationTypeListInfo.data && viewId) {
      const arr = [...scrollDataList, ...operationTypeListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [operationTypeListInfo, viewId]);

  const onClickClear = () => {
    dispatch(getOperationTypeFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.operationTypesColumns ? filtersFields.operationTypesColumns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.operationTypesColumns, []);
  const data = useMemo(() => (operationTypeListInfo && operationTypeListInfo.data && operationTypeListInfo.data.length > 0 ? operationTypeListInfo.data : [{}]), [operationTypeListInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (
      visibleColumns &&
      Object.keys(visibleColumns) &&
      Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        warehouse_id: true,
        sequence_id: true,
        active: true,
        code: false,
        default_location_src_id: false,
        default_location_dest_id: false,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      "name",
      "warehouse_id",
      "sequence_id",
      "code",
      "default_location_src_id",
      "default_location_dest_id",
    ];
    let query =
      '"|","|","|","|","|",';

    const oldCustomFilters =
      operationTypeFilters && operationTypeFilters.customFilters
        ? operationTypeFilters.customFilters
        : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === "date" || item.type === "customdate"
    )) : [];

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
          _.uniqBy(_.reverse([...data.items]), "columnField")
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getOperationTypeFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getOperationTypeFilters(customFilters));
    }
  };


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
    if (operationTypeListInfo && operationTypeListInfo.loading) {
      setOpenStatus(false);
    }
  }, [operationTypeListInfo]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
    }
  }, [openStatus]);

  //const totalDataCount = getTotalFromArray(operationTypeCount && operationTypeCount.data ? operationTypeCount.data : [], 'warehouse_id_count'); // operationTypeCount && operationTypeCount.length ? operationTypeCount.length : 0;
  const totalDataCount = operationTypeCount && operationTypeCount.length ? operationTypeCount.length : 0;

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
      const data = operationTypeListInfo && operationTypeListInfo.data ? operationTypeListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = operationTypeListInfo && operationTypeListInfo.data ? operationTypeListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const addAdjustmentWindow = () => {
    showAddModal(true);
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
    const oldCustomFilters = operationTypeFilters && operationTypeFilters.customFilters
      ? operationTypeFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getOperationTypeFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };


  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = operationTypeFilters && operationTypeFilters.customFilters ? operationTypeFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOperationTypeFilters(customFilters1));
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
      const oldCustomFilters = operationTypeFilters && operationTypeFilters.customFilters ? operationTypeFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOperationTypeFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getOperationTypeFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onAddReset = () => {
    if (document.getElementById('optForm')) {
      document.getElementById('optForm').reset();
    }
    dispatch(resetCreateOpType());
    showAddModal(false);
  };

  const onUpdateReset = () => {
    if (document.getElementById('optForm')) {
      document.getElementById('optForm').reset();
    }
    dispatch(resetUpdateOpType());
    showEditModal(false);
  };

  const stateValuesList = (operationTypeFilters && operationTypeFilters.customFilters && operationTypeFilters.customFilters.length > 0)
    ? operationTypeFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (operationTypeFilters && operationTypeFilters.customFilters && operationTypeFilters.customFilters.length > 0) ? operationTypeFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (operationTypeListInfo && operationTypeListInfo.loading) || (operationTypeCountLoading) || (warhouseIds && warhouseIds.loading);

  const opTypeData = operationTypeDetails && operationTypeDetails.data && operationTypeDetails.data.length > 0 ? operationTypeDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={opTypeData.name} placement="right">
      {truncate(opTypeData, 50)}
    </Tooltip>
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetCreateOpType());
    showAddModal(false);
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
      setPage(0);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getOperationTypeFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    code: setOpenStatus,
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'code', title: 'Type of Operation', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getOperationTypeFilters(customFiltersList));
      removeData('data-code');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getOperationTypeFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  useEffect(() => {
    if (optExportListInfo && optExportListInfo.data && optExportListInfo.data.length > 0) {
      optExportListInfo.data.map((data) => {
        data.active = checklistStateLabel(data.active);
        data.code = operationData(data.code);
        optExportListInfo.data.push(data);
      });
    };
  }, [optExportListInfo]);

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
          operationTypeListInfo && operationTypeListInfo.data && operationTypeListInfo.data.length
            ? operationTypeListInfo.data
            : []
        }
        columns={OperationTypeColumns()}
        checkboxSelection
        pagination={true}
        disableRowSelectionOnClick
        moduleName={'Operation Types List'}
        exportFileName={'Operation Types'}
        listCount={totalDataCount}
        exportInfo={optExportListInfo}
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
        loading={operationTypeListInfo && operationTypeListInfo.loading}
        err={operationTypeListInfo && operationTypeListInfo.err}
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
          headerName="Create OperationTypes"
          imagePath={InventoryBlue}
          onClose={onAddReset}
        />
        <AddOperationType closeAddModal={() => showAddModal(false)} afterReset={onAddReset} editId={false} />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={operationTypeDetails && (operationTypeDetails.data && operationTypeDetails.data.length > 0 && !operationTypeDetails.loading)
            ? opTypeData.name : 'OperationType'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (operationTypeDetails && !operationTypeDetails.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setEditId(operationTypeDetails && (operationTypeDetails.data && operationTypeDetails.data.length > 0) ? operationTypeDetails.data[0].id : false); showEditModal(true); }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', operationTypeListInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', operationTypeListInfo)); }}
        />
        <OperationTypeDetail />
      </Drawer>


      {/*<Row className="pt-2">
      <Col sm="12" md="12" lg="12" xs="12">
        <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
          <Card className="p-2 mb-2 h-100 bg-lightblue">
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2 itAsset-table-title">
                <Col md="9" xs="12" sm="9" lg="9">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    Operation Types List :
                    {' '}
                    {!loading && (columnHide && columnHide.length && totalDataCount)}
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
                <Col md="3" xs="12" sm="3" lg="3">
                  <div className="float-right">
                    <Refresh
                      setReload={setReload}
                      loadingTrue={loading}
                    />
                    <ListDateFilters
                      dateFilters={dateFilters}
                      onClickRadioButton={handleRadioboxChange}
                      onChangeCustomDate={handleCustomDateChange}
                      idNameFilter="operationColumns"
                      classNameFilter="drawerPopover popoverDate"
                    />
                    {isCreatable && (
                      <CreateList name="Add Operation Type" showCreateModal={addAdjustmentWindow} />
                    )}
                    <ExportList idNameFilter="operationExport" response={operationTypeListInfo && operationTypeListInfo.data && operationTypeListInfo.data.length} />
                    <DynamicColumns
                      setColumns={setColumns}
                      columnFields={columnFields}
                      allColumns={allColumns}
                      setColumnHide={setColumnHide}
                      idNameFilter="operationColumns"
                      classNameFilter="drawerPopover"
                    />
                  </div>
                  {operationTypeListInfo && operationTypeListInfo.data && operationTypeListInfo.data.length && (
                    <>
                      {document.getElementById('operationExport') && (
                        <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="operationExport">
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
                                apiFields={InventoryModule.operationTypeApiField}
                              />
                            </div>
                          </PopoverBody>
                        </Popover>
                      )}
                    </>
                  )}
                </Col>
              </Row>
              {(operationTypeListInfo && operationTypeListInfo.data && operationTypeListInfo.data.length > 0) && (
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
                      tableData={operationTypeListInfo}
                      checklistStateLabelFunction={checklistStateLabelFunction}
                      operationData={operationData}
                      actions={{
                        /* edit: {
                            showEdit: true,
                            editFunc: editAsset,
                          },
                          delete: {
                            showDelete: isDeleteable,
                            deleteFunc: onClickRemoveData,
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
                  {openStatus && (
                    <StaticCheckboxFilter
                      selectedValues={stateValues}
                      dataGroup={statusGroups}
                      onCheckboxChange={handleStatusCheckboxChange}
                      target="data-code"
                      title="TYPE OF OPERATION"
                      openPopover={openStatus}
                      toggleClose={() => setOpenStatus(false)}
                      setDataGroup={setStatusGroups}
                      keyword={keyword}
                      data={customData && customData.operationTypes ? customData.operationTypes : []}
                    />
                  )}
                  {columnHide && columnHide.length ? (
                    <TableListFormat
                      userResponse={userInfo}
                      listResponse={operationTypeListInfo}
                      countLoad={operationTypeCountLoading}
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
            </CardBody>
          </Card>
        </Col>
        {/* <Drawer
          title=""
          closable={false}
          width={736}
          className="drawer-bg-lightblue"
          visible={viewModal}
        >
          <DrawerHeader
            title={operationTypeDetails && (operationTypeDetails.data && operationTypeDetails.data.length > 0 && !operationTypeDetails.loading)
              ? opTypeData.name : 'OperationType'}
            imagePath={InventoryBlue}
            isEditable={(isEditable && (operationTypeDetails && !operationTypeDetails.loading))}
            closeDrawer={() => onViewReset()}
            onEdit={() => { setEditId(operationTypeDetails && (operationTypeDetails.data && operationTypeDetails.data.length > 0) ? operationTypeDetails.data[0].id : false); showEditModal(true); }}
            onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
            onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
          />
          <OperationTypeDetail />
        </Drawer> *
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width={1250}
          visible={addModal}
        >

          <DrawerHeader
            title="Create OperationTypes"
            imagePath={InventoryBlue}
            closeDrawer={onAddReset}
          />
          <AddOperationType closeAddModal={() => showAddModal(false)} afterReset={onAddReset} editId={false} />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width={736}
          visible={editModal}
        >

          <DrawerHeader
            title="Update OperationTypes"
            imagePath={InventoryBlue}
            closeDrawer={onUpdateReset}
          />
          <AddOperationType editId={editId} closeEditModal={() => showEditModal(false)} afterReset={onUpdateReset} />
        </Drawer>
      </Col>
    </Row> */}
    </>
  );
};

export default OperationTypes;
