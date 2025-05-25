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
import {
  debounce,
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getDatesOfQueryWithUtc,
  getListOfModuleOperations,
  getPagesCountV2,
  getNewDataGridFilterArray,
  queryGeneratorWithUtc,
  truncate, getNextPreview
} from '../../util/appUtils';
// import setSorting from '../../assets/equipmentService';
import { resetScrap } from '../../purchase/purchaseService';
import { InventoryModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  getCheckedRowsScrap,
  getScrapDetail,
  getScrapFilters,
  getScrapsCount,
  getScrapsExport,
  getScrapsList,
  resetCreateScrap,
  resetUpdateScrap,
  setInitialValues,
} from '../inventoryService';
import AddScrap from './addScrap';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import ScrapDetail from './scrapDetails/scrapDetail';
import { filterStringGenerator, getStateText } from './utils/utils';

import Drawer from "@mui/material/Drawer";
import CommonGrid from "../../commonComponents/commonGrid";
import DrawerHeader from "../../commonComponents/drawerHeader";
import { ScrapColumns } from "../../commonComponents/gridColumns";

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Scraps = (props) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [customFilters, setCustomFilters] = useState([]);
  const [viewId, setViewId] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [statusGroups, setStatusGroups] = useState([]);
  const [dateGroups, setDateGroups] = useState([]);
  const [reload, setReload] = useState(false);

  const [columnFields, setColumns] = useState(customData && customData.listFieldsShows ? customData.listFieldsShows : []);
  const apiFields = customData && customData.listfieldsShows ? customData.listfieldsShows : [];

  const [viewModal, setViewModal] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const classes = useStyles();

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    scrapCount, scrapsInfo, scrapCountLoading,
    scrapFilters, filterInitailValues, scrapDetail,
    updateScrapInfo, actionResultInfo, addScrapInfo, scrapsExportInfo,
  } = useSelector((state) => state.inventory);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Scrap']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Scrap']);
  const isViewable = allowedOperations.includes(actionCodes['View Scrap']);

  useEffect(() => {
    if (scrapsExportInfo && scrapsExportInfo.data && scrapsExportInfo.data.length > 0) {
      scrapsExportInfo.data.map((data) => {
        data.state = getStateText(data.state);
      });
    };
  }, [scrapsExportInfo]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getScrapFilters([]));
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue.sortBy && sortedValue.sortField) {
      const customFiltersList = scrapFilters && scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getScrapsList(companies, appModels.STOCKSCRAP, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue.sortBy && sortedValue.sortField) {
      const customFiltersList = scrapFilters && scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      console.log("Hello");
      dispatch(getScrapsCount(companies, appModels.STOCKSCRAP, customFiltersList, globalFilter));
    }
  }, [customFilters, globalFilter]);

  useEffect(() => {
    if (addScrapInfo && addScrapInfo.data) {
      const customFiltersList = scrapFilters && scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getScrapsCount(companies, appModels.STOCKSCRAP, customFiltersList, globalFilter));
      dispatch(getScrapsList(companies, appModels.STOCKSCRAP, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addScrapInfo]);

  useEffect(() => {
    if (updateScrapInfo && updateScrapInfo.data) {
      const customFiltersList = scrapFilters && scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getScrapsList(companies, appModels.STOCKSCRAP, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [updateScrapInfo]);

  useEffect(() => {
    if (actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status)) {
      const customFiltersList = scrapFilters && scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getScrapsList(companies, appModels.STOCKSCRAP, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [actionResultInfo]);


  useEffect(() => {
    if ((userInfo && userInfo.data) && (scrapCount && scrapCount.length)) {
      const offsetValue = 0;
      const customFilters = scrapFilters.customFilters ? queryGeneratorWithUtc(scrapFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getScrapsExport(companies, appModels.STOCKSCRAP, scrapCount.length, offsetValue, apiFields, customFilters, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, startExport]);

  const searchColumns = InventoryModule.scrapSearchColumn;
  const advanceSearchColumns = InventoryModule.scrapAdvanceSearchColumn;

  const columns = useMemo(() => (filtersFields.columns), []);
  const data = useMemo(() => (scrapsInfo.data ? scrapsInfo.data : [{}]), [scrapsInfo.data]);

  const hiddenColumns = InventoryModule.scrapHiddenColumn; // ['date_expected', 'origin'];

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
        product_id: true,
        date_expected: true,
        create_date: true,
        scrap_qty: true,
        location_id: true,
        scrap_location_id: true,
        state: true,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      "name",
      "product_id",
      "create_date",
      "date_expected",
      "scrap_qty",
      "location_id",
      "scrap_location_id",
      "state",
    ];
    let query =
      '"|","|","|","|","|","|","|",';

    const oldCustomFilters =
      scrapFilters && scrapFilters.customFilters
        ? scrapFilters.customFilters
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
        uniqueCustomFilter = getNewDataGridFilterArray(ScrapColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getScrapFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getScrapFilters(customFilters));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [scrapFilters]
  );


  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(scrapsInfo && scrapsInfo.data && scrapsInfo.data.length && scrapsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(scrapsInfo && scrapsInfo.data && scrapsInfo.data.length && scrapsInfo.data[scrapsInfo.data.length - 1].id);
    }
  }, [scrapsInfo]);

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

  useEffect(() => {
    if (scrapFilters && scrapFilters.customFilters) {
      setCustomFilters(scrapFilters.customFilters);
    }
  }, [scrapFilters]);

  useEffect(() => {
    if (openStatus) {
      setKeyword('');
      setOpenDate(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openDate) {
      setKeyword('');
      setOpenStatus(false);
    }
  }, [openDate]);

  useEffect(() => {
    if (viewId) {
      dispatch(getScrapDetail(viewId, appModels.STOCKSCRAP));
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId && updateScrapInfo && updateScrapInfo.data) {
      dispatch(getScrapDetail(viewId, appModels.STOCKSCRAP));
    }
  }, [updateScrapInfo]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsScrap(payload));
  }, [checkedRows]);

  const totalDataCount = scrapCount && scrapCount.length ? scrapCount.length : 0;
  const pages = getPagesCountV2(totalDataCount, limit);

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
      const dataValue = scrapsInfo && scrapsInfo.data ? scrapsInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = scrapsInfo && scrapsInfo.data ? scrapsInfo.data : [];
      const ids = getColumnArrayById(dataValue, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsets = (index - 1) * limit;
    setOffset(offsets);
    setPage(index);
    setIsAllChecked(false);
  };

  const onAddReset = () => {
    dispatch(resetCreateScrap());
    dispatch(resetScrap());
    showAddModal(false);
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateScrap());
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
    dispatch(getScrapFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('scrapForm')) {
      document.getElementById('scrapForm').reset();
    }
    dispatch(resetCreateScrap());
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
    const oldCustomFilters = scrapFilters && scrapFilters.customFilters
      ? scrapFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getScrapFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };


  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = scrapFilters && scrapFilters.customFilters ? scrapFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getScrapFilters(customFilters1));
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
      const oldCustomFilters = scrapFilters && scrapFilters.customFilters ? scrapFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getScrapFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const dateFilters = (scrapFilters && scrapFilters.customFilters && scrapFilters.customFilters.length > 0) ? scrapFilters.customFilters : [];

  const loading = (userInfo && userInfo.loading) || (scrapsInfo && scrapsInfo.loading) || (scrapCountLoading);
  const isUserError = userInfo && userInfo.err;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (scrapsInfo && scrapsInfo.err) ? generateErrorMessage(scrapsInfo) : userErrorMsg;

  const scrapData = scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) ? scrapDetail.data[0] : '';

  const drawertitleName = (
    <Tooltip title={scrapData.name} placement="right">
      {truncate(scrapData.name, '50')}
    </Tooltip>
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetCreateScrap());
    showAddModal(false);
  };

  const onClickClear = () => {
    dispatch(getScrapFilters([]));
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

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getScrapFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getScrapFilters(customFiltersList));
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
        // key: value, value, label: name, type: 'customdate', start, end,
        key: 'date_expected', title: 'Expected Date', value, label: 'Expected Date', type: 'customdate', start, end,
      }];
      if (start && end) {
        const oldCustomFilters = scrapFilters && scrapFilters.customFilters ? scrapFilters.customFilters : [];
        const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
        // setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
        dispatch(getScrapFilters(customFilters1));
        removeData('data-date_expected');
      }
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getScrapFilters(customFiltersList));
    }
    // if (checked) {
    //   const filters = [{
    //     key: 'date_expected', title: 'Expected Date', value, label: name, type: 'inarray',
    //   }];
    //   const customFiltersList = [...customFilters, ...filters];
    //   dispatch(getScrapFilters(customFiltersList));
    //   removeData('data-date_expected');
    // } else {
    //   const customFiltersList = customFilters.filter((item) => item.value !== value);
    //   dispatch(getScrapFilters(customFiltersList));
    // }
    setOffset(0);
    setPage(0);
  };

  function checkIsCompany(key) {
    let res = '';
    if (key) {
      if (key === 'company_id') {
        res = 'company_id.name';
      } else {
        res = key;
      }
    }
    return res;
  }

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? checkIsCompany(key.key) : checkIsCompany(key.id),
          title: key.label ? key.label : key.Header,
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
      dispatch(getScrapFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    state: setOpenStatus,
    date_expected: setOpenDate,
  };

  const stateValuesList = (scrapFilters && scrapFilters.customFilters && scrapFilters.customFilters.length > 0)
    ? scrapFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateValuesList = (scrapFilters && scrapFilters.customFilters && scrapFilters.customFilters.length > 0)
    ? scrapFilters.customFilters.filter((item) => item.type === 'customdate') : [];

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
          scrapsInfo && scrapsInfo.data && scrapsInfo.data.length
            ? scrapsInfo.data
            : []
        }
        columns={ScrapColumns()}
        checkboxSelection
        pagination={true}
        disableRowSelectionOnClick
        moduleName={'Scrap List'}
        exportFileName={'Scrap'}
        listCount={totalDataCount}
        exportInfo={scrapsExportInfo}
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
        filters={filterStringGenerator(scrapFilters)}
        loading={scrapsInfo && scrapsInfo.loading}
        err={scrapsInfo && scrapsInfo.err}
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
          headerName='Create Inventory Scrap'
          imagePath={''}
          onClose={onAddReset}
        />
        <AddScrap
          afterReset={() => { onAddReset(); }}
          isShow={true}
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
          headerName={scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0 && !scrapDetail.loading)
            ? drawertitleName : 'Scrap'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (scrapDetail && !scrapDetail.loading) && (scrapDetail.data && scrapDetail.data.length > 0 && scrapDetail.data[0].state === 'draft'))}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) ? scrapDetail.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetUpdateScrap());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', scrapsInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', scrapsInfo)); }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', scrapsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', scrapsInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', scrapsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', scrapsInfo));
          }}
        />
        <ScrapDetail />
      </Drawer>



      {/*  <Row className="ml-1 mr-1 mb-2 p-3 ppm-scheduler">
      <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2 itAsset-table-title">
              <Col md="9" xs="12" sm="9" lg="9">
                <span className="p-0 mr-2 font-weight-800 font-medium">
                  Scrap List :
                  {' '}
                  {columnHide && columnHide.length && totalDataCount}
                </span>
                {columnHide && columnHide.length ? (
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
                          {(cf.type === 'customdate' && cf.key !== 'date_expected') && (
                            <span>
                              {'  '}
                              :
                              {' '}
                              {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                              {' - '}
                              {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                            </span>
                          )}
                          {(cf.type === 'customdate' && cf.key === 'date_expected') && (
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
                    <CreateList name="Add Scrap" showCreateModal={addAdjustmentWindow} />
                  )}
                  <ExportList response={scrapsInfo && scrapsInfo.data && scrapsInfo.data.length} />
                  <DynamicColumns
                    setColumns={setColumns}
                    columnFields={columnFields}
                    allColumns={allColumns}
                    setColumnHide={setColumnHide}
                  />
                </div>
                {(scrapsInfo && scrapsInfo.data && scrapsInfo.data.length) && (
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
                          apiFields={InventoryModule.scrapApiFields}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
            {(scrapsInfo && scrapsInfo.data && scrapsInfo.data.length > 0) && (
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
                    tableData={scrapsInfo}
                    numToFloat={numToFloat}
                    stateLabelFunction={getStateLabel}
                    actions={{
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
            {columnHide && columnHide.length && ((scrapsInfo && scrapsInfo.err) || isUserError) ? (
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
                target="data-date_expected"
                title="Expected Date"
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
          title={scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0 && !scrapDetail.loading)
            ? drawertitleName : 'Scrap'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (scrapDetail && !scrapDetail.loading) && (scrapDetail.data && scrapDetail.data.length > 0 && scrapDetail.data[0].state === 'draft'))}
          closeDrawer={() => onViewReset()}
          onEdit={() => {
            setEditId(scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) ? scrapDetail.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetUpdateScrap());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <ScrapDetail />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={736}
        visible={addModal}
      >

        <DrawerHeader
          title="Create Inventory Scrap"
          imagePath={InventoryBlue}
          closeDrawer={() => onAddReset()}
        />
        <AddScrap
          isShow={addModal}
          afterReset={() => { onAddReset(); }}
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
          title="Update Inventory Scrap"
          imagePath={InventoryBlue}
          closeDrawer={() => onUpdateReset()}
        />
        <AddScrap
          editId={editId}
          isShow={editModal}
          afterReset={() => { onUpdateReset(); }}
        />
      </Drawer>
    </Row>*/}
    </>
  );
};

export default Scraps;
