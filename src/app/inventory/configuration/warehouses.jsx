/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-useless-fragment */
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
import { WarehouseColumns } from "../../commonComponents/gridColumns";
import {
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  truncate,
  formatFilterData, debounce, getNextPreview
} from '../../util/appUtils';
import { InventoryModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  getAddressGroups,
  getCheckedRowsWH, getWareHouse,
  getWareHouseFilters,
  getWareHouseList,
  getWareHouseListExport,
  getWareHousesCount,
  resetCreateWarehouse, resetUpdateWarehouse,
  setInitialValues,
} from '../inventoryService';
import AddWarehouse from './addWarehouse';
import WareHouseDetail from './wareHouseDetail/wareHouseDetail';
import { checklistStateLabel } from '../adjustments/utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const WareHouses = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const tableColumns = WarehouseColumns()
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsPMShows ? customData.listFieldsPMShows : []);
  const apiFields = customData && customData.listFieldsPMShows ? customData.listFieldsPMShows : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [addressGroups, setAddressGroups] = useState([]);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);

  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  // const [viewModal, showViewModal] = useState(false);
  const [columnHide, setColumnHide] = useState([]);

  const [valueArray, setValueArray] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [filterText, setFilterText] = useState('')

  const { sortedValue } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const {
    wareHouseCount, wareHouseListInfo, wareHouseCountLoading,
    wareHouseFilters, wareHouseDetails, filterInitailValues,
    addWarehouseInfo, updateWarehouseInfo, addressInfo, whExportListInfo,
  } = useSelector((state) => state.inventory);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Activate Warehouse']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Warehouse']);
  const isViewable = allowedOperations.includes(actionCodes['View Warehouse']);

  useEffect(() => {
    if (reload) {
      dispatch(getWareHouseFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWareHousesCount(companies, appModels.WAREHOUSE, customFiltersList, globalFilter));
    }
  }, [globalFilter, JSON.stringify(customFilters), reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getWareHouseList(companies, appModels.WAREHOUSE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, JSON.stringify(customFilters), sortedValue.sortBy, sortedValue.sortField, globalFilter, reload]);

  useEffect(() => {
    if (addWarehouseInfo && addWarehouseInfo.data) {
      const customFiltersList = wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWareHousesCount(companies, appModels.WAREHOUSE, customFiltersList));
      dispatch(getWareHouseList(companies, appModels.WAREHOUSE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addWarehouseInfo]);

  useEffect(() => {
    if (updateWarehouseInfo && updateWarehouseInfo.data) {
      const customFiltersList = wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWareHouseList(companies, appModels.WAREHOUSE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [updateWarehouseInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWareHouseList(companies, appModels.WAREHOUSE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (wareHouseCount && wareHouseCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = wareHouseFilters && wareHouseFilters.customFilters ? queryGeneratorWithUtc(wareHouseFilters.customFilters) : '';
      dispatch(getWareHouseListExport(companies, appModels.WAREHOUSE, wareHouseCount.length, offsetValue, apiFields, sortedValue.sortBy, sortedValue.sortField, customFiltersQuery, rows));
    }
  }, [userInfo, wareHouseCount, startExport]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsWH(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (wareHouseFilters && wareHouseFilters.customFilters) {
      setCustomFilters(wareHouseFilters.customFilters);
      const vid = isArrayValueExists(wareHouseFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [wareHouseFilters && wareHouseFilters.customFilters]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsWH(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (viewId) {
      dispatch(getWareHouse(viewId, appModels.WAREHOUSE));
    }
  }, [viewId]);

  // useEffect(() => {
  //   if (viewId && updateWarehouseInfo && updateWarehouseInfo.data) {
  //     dispatch(getWareHouse(viewId, appModels.WAREHOUSE));
  //   }
  // }, [updateWarehouseInfo]);

  useEffect(() => {
    if (wareHouseListInfo && wareHouseListInfo.data && viewId) {
      const arr = [...scrollDataList, ...wareHouseListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [wareHouseListInfo, viewId]);

  const totalDataCount = wareHouseCount && wareHouseCount.length ? wareHouseCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const searchColumns = InventoryModule.wareHouseSearchColumn;

  const hiddenColumns = InventoryModule.wareHouseHiddenColumn;

  const advanceSearchColumns = InventoryModule.wareHouseAdvanceSearchColumn;

  useEffect(() => {
    if (userInfo && userInfo.data && openAddress) {
      dispatch(getAddressGroups(companies, appModels.WAREHOUSE));
    }
  }, [userInfo, openAddress]);

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(() => (wareHouseListInfo.data ? wareHouseListInfo.data : [{}]), [wareHouseListInfo.data]);
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
        lot_stock_id: true,
        partner_id: true,
        active: true,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      "name",
      "lot_stock_id",
      "partner_id",
      "active",
    ];
    let query =
      '"|","|","|",';

    const oldCustomFilters =
      wareHouseFilters && wareHouseFilters.customFilters
        ? wareHouseFilters.customFilters
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
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field)
          dataItem.value = dataItem?.value ? dataItem.value : ''
          dataItem.header = label?.headerName
        })
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), "header")
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getWareHouseFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getWareHouseFilters(customFilters));
    }
    let filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : []
    setFilterText(formatFilterData(filtersData, data?.quickFilterValues?.[0]))
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [wareHouseFilters],
  );


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
    if (openAddress) {
      setKeyword(' ');
    }
  }, [openAddress]);

  useEffect(() => {
    dispatch(getWareHouseFilters([]));
  }, []);

  const advanceSearchjson = {
    partner_id: setOpenAddress,
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
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
      const data = wareHouseListInfo && wareHouseListInfo.data ? wareHouseListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = wareHouseListInfo && wareHouseListInfo.data ? wareHouseListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('wareHouseForm')) {
      document.getElementById('wareHouseForm').reset();
    }
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
    const oldCustomFilters = wareHouseFilters && wareHouseFilters.customFilters
      ? wareHouseFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getWareHouseFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };


  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = wareHouseFilters && wareHouseFilters.customFilters ? wareHouseFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getWareHouseFilters(customFilters1));
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
      const oldCustomFilters = wareHouseFilters && wareHouseFilters.customFilters ? wareHouseFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getWareHouseFilters(customFilters1));
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
          value: (key.value),
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
      dispatch(getWareHouseFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getWareHouseFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenAddress(false);
  };

  useEffect(() => {
    if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getWareHouseFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onAddReset = () => {
    showAddModal(false);
    dispatch(resetCreateWarehouse());
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateWarehouse());
    showEditModal(false);
  };

  useEffect(() => {
    if (addressInfo && addressInfo.data) {
      setAddressGroups(addressInfo.data);
    }
  }, [addressInfo]);

  const handleAddressCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'partner_id', title: 'Address', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getWareHouseFilters(customFiltersList));
      removeData('data-partner_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getWareHouseFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const stateValuesList = (wareHouseFilters && wareHouseFilters.customFilters && wareHouseFilters.customFilters.length > 0)
    ? wareHouseFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const addressValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (wareHouseFilters && wareHouseFilters.customFilters && wareHouseFilters.customFilters.length > 0) ? wareHouseFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (wareHouseListInfo && wareHouseListInfo.loading) || (wareHouseCountLoading) || (siteDetails && siteDetails.loading);

  const wareHouseData = wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0) ? wareHouseDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={wareHouseData.name} placement="right">
      {truncate(wareHouseData.name, 50)}
    </Tooltip>
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetCreateWarehouse());
    showAddModal(false);
  };

  useEffect(() => {
    if (whExportListInfo && whExportListInfo.data && whExportListInfo.data.length > 0) {
      whExportListInfo.data.map((data) => {
        data.active = checklistStateLabel(data.active);
        whExportListInfo.data.push(data);
      });
    };
  }, [whExportListInfo]);

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
        subTabs={{
          enable: true,
        }}
        sx={{
          height: "90%",
        }}
        tableData={
          wareHouseListInfo && wareHouseListInfo.data && wareHouseListInfo.data.length
            ? wareHouseListInfo.data
            : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination={true}
        filters={filterText}
        disableRowSelectionOnClick
        moduleName={'Warehouses List'}
        exportFileName={'Warehouses'}
        listCount={totalDataCount}
        exportInfo={whExportListInfo}
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
        loading={wareHouseListInfo && wareHouseListInfo.loading}
        err={wareHouseListInfo && wareHouseListInfo.err}
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
          headerName='Create Warehouse'
          imagePath={InventoryBlue}
          onClose={() => { onAddReset(); showAddModal(false) }}
        />
        <AddWarehouse closeModal={() => showAddModal(false)} afterReset={onAddReset} editId={false} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: "85%" },
        }}
        anchor="right"
        open={viewModal}

      >
        <DrawerHeader
          headerName={wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0)
            ? drawertitleName : wareHouseDetails.loading ? '' : 'Scrap'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (wareHouseDetails && !wareHouseDetails.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setEditId(wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0) ? wareHouseDetails.data[0].id : false); showEditModal(true); }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', wareHouseListInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', wareHouseListInfo)); }}
        />
        <WareHouseDetail />
      </Drawer>

      {/*} <Row className="pt-2">
      <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2 itAsset-table-title">
              <Col md="9" xs="12" sm="9" lg="9">
                <span className="p-0 mr-2 font-weight-800 font-medium">
                  Warehouses List :
                  {'  '}
                  {!loading && columnHide && columnHide.length && totalDataCount}
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
                            <>
                              {cf.label}
                            </>
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
                      <span onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
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
                    customFilters={customFilters}
                    handleCustomFilterClose={handleCustomFilterClose}
                    setCustomVariable={setCustomVariable}
                    customVariable={customVariable}
                    onClickRadioButton={handleRadioboxChange}
                    onChangeCustomDate={handleCustomDateChange}
                    idNameFilter="wareDate"
                    classNameFilter="drawerPopover popoverDate"
                  />
                  {isCreatable && (
                    <CreateList name="Add Warehouse" showCreateModal={addAdjustmentWindow} />
                  )}
                  <ExportList idNameFilter="wareExport" response={wareHouseListInfo && wareHouseListInfo.data && wareHouseListInfo.data.length} />
                  <DynamicColumns
                    setColumns={setColumns}
                    columnFields={columnFields}
                    allColumns={allColumns}
                    setColumnHide={setColumnHide}
                    idNameFilter="wareColumns"
                    classNameFilter="drawerPopover"
                  />
                </div>
                {wareHouseListInfo && wareHouseListInfo.data && wareHouseListInfo.data.length && (
                  <>
                    {document.getElementById('wareExport') && (
                      <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="wareExport">
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
                              apiFields={InventoryModule.wareHouseApiFields}
                            />
                          </div>
                        </PopoverBody>
                      </Popover>
                    )}
                  </>
                )}
              </Col>
            </Row>
            {(wareHouseListInfo && wareHouseListInfo.data) && (
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
                    setViewModal={showViewModal}
                    tableData={wareHouseListInfo}
                    checklistStateLabelFunction={checklistStateLabelFunction}
                    actions={{
                      hideSorting: {
                        fieldName: ['active'],
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
                {openAddress && (
                  <DynamicCheckboxFilter
                    data={addressInfo && addressInfo.data && addressInfo.data.length > 0 ? addressInfo : []}
                    selectedValues={addressValues}
                    dataGroup={addressGroups}
                    filtervalue="partner_id"
                    onCheckboxChange={handleAddressCheckboxChange}
                    toggleClose={() => setOpenAddress(false)}
                    openPopover={openAddress}
                    target="data-partner_id"
                    title="ADDRESS"
                    keyword={keyword}
                    setDataGroup={setAddressGroups}
                  />
                )}
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
              </div>
            </div>
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
          title={wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0)
            ? drawertitleName : wareHouseDetails.loading ? '' : 'Scrap'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (wareHouseDetails && !wareHouseDetails.loading))}
          closeDrawer={() => onViewReset()}
          onEdit={() => { setEditId(wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0) ? wareHouseDetails.data[0].id : false); showEditModal(true); }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <WareHouseDetail />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={736}
        visible={addModal}
      >

        <DrawerHeader
          title="Create Warehouse"
          imagePath={InventoryBlue}
          closeDrawer={onAddReset}
        />
        <AddWarehouse closeModal={() => showAddModal(false)} afterReset={onAddReset} editId={false} />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={736}
        visible={editModal}
      >

        <DrawerHeader
          title="Update Warehouse"
          imagePath={InventoryBlue}
          closeDrawer={onUpdateReset}
        />
        <AddWarehouse editId={editId} closeEditModal={() => showEditModal(false)} afterReset={onUpdateReset} />
      </Drawer>
    </Row>*/}
    </>
  );
};

export default WareHouses;
