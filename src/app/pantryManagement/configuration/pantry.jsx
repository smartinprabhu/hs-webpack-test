/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import uniqBy from 'lodash/unionBy';
import CommonGrid from '../../commonComponents/commonGrid';
import { PantryColumns } from '../../commonComponents/gridColumns';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, 
  getAllowedCompanies, getColumnArrayById,
  isArrayValueExists, 
  getArrayFromValuesByItem,
  getListOfModuleOperations, queryGeneratorWithUtc, getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  queryGeneratorV1,
} from '../../util/appUtils';
import {
  getConfigPantrysCount, getConfigPantryList, setLocationId,
  getConfigPantryFilters, getCheckedRowsConfigPantry, getConfigPantry, resetCreateConfigPantry, resetUpdateConfigPantry, getDelete, resetDelete, getConfigPantryListExport,
} from '../pantryService';
import { getTeamGroups } from '../../preventiveMaintenance/ppmService';
import { setInitialValues } from '../../purchase/purchaseService';
import actionCodes from './data/actionCodes.json';
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

const Pantry = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsCPTShows ? customData.listFieldsCPTShows : []);

  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [addressGroups, setAddressGroups] = useState([]);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(0);

  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [openTeam, setOpenTeam] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code');
  const companies = getAllowedCompanies(userInfo);
  const {
    configPantryCount, configPantryListInfo, configPantryCountLoading,
    configPantryFilters, configPantryDetails,
    addConfigPantryInfo, updateConfigPantryInfo, deleteInfo, cpExportListInfo,
  } = useSelector((state) => state.pantry);

  const { pinEnableData } = useSelector((state) => state.auth);
  const {
    teamGroupInfo,
  } = useSelector((state) => state.ppm);
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const searchColumns = PantryModule.pantrySearchColumn;
  const hiddenColumns = PantryModule.pantryHiddenColumn;
  const advanceSearchColumns = PantryModule.pantryAdvanceSearchColumn;

  const columns = useMemo(() => filtersFields.pantryColumns, []);
  const data = useMemo(() => (configPantryListInfo.data ? configPantryListInfo.data : [{}]), [configPantryListInfo.data]);
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
    maintenance_team_id: setOpenTeam,
  };

  useEffect(() => {
    if ((userInfo && userInfo.data && openTeam)) {
      dispatch(getTeamGroups(companies, appModels.PANTRY));
    }
  }, [userInfo, openTeam]);

  useEffect(() => {
    if (userInfo && userInfo.data && configPantryCount && configPantryCount.length) {
      const offsetValues = 0;
      // setPdfBody([]);
      const customFiltersQuery = configPantryFilters && configPantryFilters.customFilters ? queryGeneratorV1(configPantryFilters.customFilters) : '';
      dispatch(getConfigPantryListExport(companies, appModels.PANTRY, configPantryCount.length, offsetValues, PantryModule.pantryApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, configPantryCount, startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        pantry_sequence: true,
        maintenance_team_id: true,
        resource_calendar_id: true,
        state: true,
        company_id: true,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = configPantryFilters.customFilters ? queryGeneratorWithUtc(configPantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getConfigPantrysCount(companies, appModels.PANTRY, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = configPantryFilters.customFilters ? queryGeneratorWithUtc(configPantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getConfigPantryList(companies, appModels.PANTRY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue, customFilters, reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((addConfigPantryInfo && addConfigPantryInfo.data) || (deleteInfo && deleteInfo.data) || (updateConfigPantryInfo && updateConfigPantryInfo.data))) {
      const customFiltersList = configPantryFilters.customFilters ? queryGeneratorWithUtc(configPantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getConfigPantrysCount(companies, appModels.PANTRY, customFiltersList, globalFilter));
      dispatch(getConfigPantryList(companies, appModels.PANTRY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addConfigPantryInfo, updateConfigPantryInfo, deleteInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const customFiltersList = configPantryFilters.customFilters ? queryGeneratorWithUtc(configPantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getConfigPantryList(companies, appModels.PANTRY, limit, offsetValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offsetValue, sortedValue, customFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = configPantryFilters.customFilters ? queryGeneratorWithUtc(configPantryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getConfigPantryList(companies, appModels.PANTRY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [viewId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsConfigPantry(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (configPantryFilters && configPantryFilters.customFilters) {
      setCustomFilters(configPantryFilters.customFilters);
      const vid = isArrayValueExists(configPantryFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false, false));
        }
      }
    }
  }, [configPantryFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getConfigPantry(viewId, appModels.PANTRY));
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId && updateConfigPantryInfo && updateConfigPantryInfo.data) {
      dispatch(getConfigPantry(viewId, appModels.PANTRY));
    }
  }, [updateConfigPantryInfo]);

  useEffect(() => {
    if (configPantryListInfo && configPantryListInfo.data && viewId) {
      const arr = [...scrollDataList, ...configPantryListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [configPantryListInfo, viewId]);

  useEffect(() => {
    if (teamGroupInfo && teamGroupInfo.data) {
      setAddressGroups(teamGroupInfo.data);
    }
  }, [teamGroupInfo]);

  const totalDataCount = configPantryCount && configPantryCount.length ? configPantryCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const dataValue = configPantryListInfo && configPantryListInfo.data ? configPantryListInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = configPantryListInfo && configPantryListInfo.data ? configPantryListInfo.data : [];
      const ids = getColumnArrayById(dataValue, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const addAdjustmentWindow = () => {
    dispatch(resetCreateConfigPantry());
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
    const oldCustomFilters = configPantryFilters && configPantryFilters.customFilters
      ? configPantryFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getConfigPantryFilters(customFilters1));
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
      const oldCustomFilters = configPantryFilters && configPantryFilters.customFilters
        ? configPantryFilters.customFilters
        : [];
      const filterValues = {
        states:
          configPantryFilters && configPantryFilters.states ? configPantryFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
        // customFilters: [
        //   ...oldCustomFilters.filter(
        //     (item) => item.type !== 'date'
        //       && item.type !== 'customdate'
        //       && item.type !== 'datearray',
        //   ),
        //   ...filters,
        // ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getConfigPantryFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = configPantryFilters && configPantryFilters.customFilters
        ? configPantryFilters.customFilters
        : [];
      const filterValues = {
        states:
          configPantryFilters && configPantryFilters.states ? configPantryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getConfigPantryFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getConfigPantryFilters(customFiltersList));
    setOffset(0);
    setPage(1);
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
      dispatch(getConfigPantryFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onAddReset = () => {
    if (document.getElementById('configPantryForm')) {
      document.getElementById('configPantryForm').reset();
    }
    dispatch(setLocationId([]));
    dispatch(resetCreateConfigPantry());
    dispatch(getTeamGroups(companies, appModels.PANTRY));
    showAddModal(false);
  };

  const onUpdateReset = () => {
    if (document.getElementById('configPantryForm')) {
      document.getElementById('configPantryForm').reset();
    }
    dispatch(resetUpdateConfigPantry());
    showEditModal(false);
    setEditId(false);
  };

  const handleTeamCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'maintenance_team_id', title: 'Maintenance Team', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getConfigPantryFilters(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getConfigPantryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.PANTRY));
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

  const onClickClear = () => {
    dispatch(getConfigPantryFilters([]));
    setValueArray([]);
    filtersFields.pantryColumns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  function getNextPreview(ids, type) {
    const array = configPantryListInfo && configPantryListInfo.data ? configPantryListInfo.data : [];
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

  const stateValuesList = (configPantryFilters && configPantryFilters.customFilters && configPantryFilters.customFilters.length > 0)
    ? configPantryFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const addressValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (configPantryFilters && configPantryFilters.customFilters && configPantryFilters.customFilters.length > 0) ? configPantryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (configPantryListInfo && configPantryListInfo.loading) || (configPantryCountLoading);

  // eslint-disable-next-line no-unused-vars
  const onLoadRequest = (eid, ename) => {
    if (eid) {
      /* const customFiltersList = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }]; */
      if (addConfigPantryInfo && addConfigPantryInfo.data && addConfigPantryInfo.data && addConfigPantryInfo.data.length) {
        setViewId(addConfigPantryInfo.data[0]);
        dispatch(setInitialValues(false, false, false, false));
      }
      onAddReset();
      // dispatch(getConfigPantryFilters(customFiltersList));
    }
  };

  const onReset = () => {
    if (document.getElementById('configPantryForm')) {
      document.getElementById('configPantryForm').reset();
    }
    showAddModal(false);
  };

  const isCreatable = allowedOperations.includes(actionCodes['Add Pantry']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Pantry']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Pantry Order']);

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
      'pantry_sequence',
      'maintenance_team_id',
      'resource_calendar_id',
      'state',
      'company_id',
    ];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = configPantryFilters && configPantryFilters.customFilters
      ? configPantryFilters.customFilters
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
        dispatch(getConfigPantryFilters(CustomFilters));
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getConfigPantryFilters(CustomFilters));
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

    <CommonGrid
      className="tickets-table"
      componentClassName="commonGrid"
      sx={{
        height: '90%',
      }}
      createTabs={{
        enable: true,
        menuList: props.menuList,
        tabs: props.tabs,
      }}
      tableData={
        configPantryListInfo && configPantryListInfo.data && configPantryListInfo.data.length
          ? configPantryListInfo.data
          : []
        }
      columns={PantryColumns()}
      checkboxSelection
      pagination
      disableRowSelectionOnClick
      moduleName="Pantry"
      exportFileName="Pantry"
      listCount={totalDataCount}
      exportInfo={{ err: cpExportListInfo.err, loading: cpExportListInfo.loading, data: cpExportListInfo.data ? cpExportListInfo.data : false }}
      page={currentPage}
      rowCount={totalDataCount}
      limit={limit}
      handlePageChange={handlePageChange}
      setStartExport={setStartExport}
      createOption={{
        enable: allowedOperations.includes(actionCodes['Add Pantry']),
        text: 'Add',
        func: () => showAddModal(true),
      }}
      setRows={setRows}
      rows={rows}
      visibleColumns={visibleColumns}
      setVisibleColumns={setVisibleColumns}
      onFilterChanges={onFilterChange}
      loading={configPantryListInfo && configPantryListInfo.loading}
      err={configPantryListInfo && configPantryListInfo.err}
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
  //               Pantry List :
  //               {' '}
  //               {columnHide && columnHide.length && totalDataCount}
  //             </span>
  //             {columnHide && columnHide.length && customFilters && customFilters.length ? (
  //               <div className="content-inline">
  //                 {customFilters && customFilters.length && customFilters.map((cf) => (
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
  //                 idNameFilter="problemDate"
  //                 classNameFilter="drawerPopover popoverDate"
  //               />
  //               {isCreatable && (
  //                 <CreateList name="Add Pantry" showCreateModal={addAdjustmentWindow} />
  //               )}
  //               {/* <AddColumns columns={customData.tableColumnsCPT} handleColumnChange={handleColumnChange} columnFields={columns} /> */}
  //               <ExportList  idNameFilter="pantryExport" response={configPantryListInfo && configPantryListInfo.data && configPantryListInfo.data.length}/>
  //               <DynamicColumns
  //                 setColumns={setColumns}
  //                 columnFields={columnFields}
  //                 allColumns={allColumns}
  //                 setColumnHide={setColumnHide}
  //                 idNameFilter="problemColumns"
  //                 classNameFilter="drawerPopover"
  //               />
  //             </div>
  //             {configPantryListInfo && configPantryListInfo.data && configPantryListInfo.data.length && (
  //               <>
  //                 {document.getElementById('pantryExport') && (
  //                   <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="pantryExport">
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
  //                         apiFields={PantryModule.pantryApiFields}
  //                       />
  //                     </PopoverBody>
  //                   </Popover>
  //                 )}
  //               </>
  //             )}
  //           </Col>
  //         </Row>
  //         {(configPantryListInfo && configPantryListInfo.data) && (
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
  //                 tableData={configPantryListInfo}
  //                 stateLabelFunction={getPantryStateLabel}
  //                 actions={{
  //                   hideSorting: {
  //                     fieldName: ['state'],
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
  //             {openTeam && (
  //               <DynamicCheckboxFilter
  //                 data={teamGroupInfo && teamGroupInfo.data && teamGroupInfo.data.length > 0 ? teamGroupInfo : []}
  //                 selectedValues={addressValues}
  //                 dataGroup={addressGroups}
  //                 filtervalue="maintenance_team_id"
  //                 onCheckboxChange={handleTeamCheckboxChange}
  //                 toggleClose={() => setOpenTeam(false)}
  //                 openPopover={openTeam}
  //                 target="data-maintenance_team_id"
  //                 title="Team"
  //                 keyword={keyword}
  //                 setDataGroup={setAddressGroups}
  //               />
  //             )}
  //             {columnHide && columnHide.length ? (
  //               <TableListFormat
  //                 userResponse={userInfo}
  //                 listResponse={configPantryListInfo}
  //                 countLoad={configPantryCountLoading}
  //               />
  //             ) : ''}
  //           </div>
  //           {columnHide && !columnHide.length ? (
  //             <div className="text-center mb-4">
  //               Please select the Columns
  //             </div>
  //           ) : ''}
  //           {loading || pages === 0 ? (<span />) : (
  //             <div className={`${classes.root} float-right`}>
  //               {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
  //             </div>
  //           )}
  //         </div>
  //       </CardBody>
  //     </Card>
  //   </Col>
  //   {/* )} */}

  //   <Modal
  //     size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
  //     className="border-radius-50px modal-dialog-centered add-pantry "
  //     isOpen={deleteModal}
  //   >
  //     <ModalHeaderComponent
  //       title="Delete Pantry"
  //       imagePath={false}
  //       closeModalWindow={() => onRemoveDataCancel()}
  //       response={deleteInfo}
  //     />
  //     <ModalBody className="mt-0 pt-0">
  //       {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
  //         <p className="text-center">
  //           {`Are you sure, you want to remove ${removeName} ?`}
  //         </p>
  //       )}
  //       {deleteInfo && deleteInfo.loading && (
  //         <div className="text-center mt-3">
  //           <Loader />
  //         </div>
  //       )}
  //       {(deleteInfo && deleteInfo.err) && (
  //         <SuccessAndErrorFormat response={deleteInfo} />
  //       )}
  //       {(deleteInfo && deleteInfo.data) && (
  //         <SuccessAndErrorFormat
  //           response={deleteInfo}
  //           successMessage="Pantry removed successfully.."
  //         />
  //       )}
  //       <div className="pull-right mt-3">
  //         {deleteInfo && !deleteInfo.data && (
  //           <Button
  //             size="sm"
  //             disabled={deleteInfo && deleteInfo.loading}
  //              variant="contained"
  //             onClick={() => onRemoveData(removeId)}
  //           >
  //             Confirm
  //           </Button>
  //         )}
  //         {deleteInfo && deleteInfo.data && (
  //           <Button size="sm"  variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
  //         )}
  //       </div>
  //     </ModalBody>
  //   </Modal>

  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={editModal}
  //   >

  //     <DrawerHeader
  //       title="Edit Pantry"
  //       imagePath={false}
  //       closeDrawer={() => { onUpdateReset(); onReset(); }}
  //     />
  //     <AddPantry
  //       editId={editId}
  //       afterReset={() => onUpdateReset()}
  //       closeEditModal={() => { showEditModal(false); }}
  //     />
  //   </Drawer>
  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={viewModal}
  //   >
  //     <DrawerHeader
  //       title="Pantry"
  //       imagePath={false}
  //       isEditable={isEditable && (configPantryDetails && !configPantryDetails.loading)}
  //       closeDrawer={() => setViewModal(false)}
  //       onEdit={() => { setEditId(configPantryDetails && (configPantryDetails.data && configPantryDetails.data.length > 0) ? configPantryDetails.data[0].id : false); showEditModal(true); }}
  //       onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
  //       onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
  //     />
  //     <PantryDetail isEdit={false} afterUpdate={false} setViewModal={setViewModal} viewModal={viewModal} />
  //   </Drawer>
  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={addModal}
  //   >

  //     <DrawerHeader
  //       title="Add Pantry"
  //       imagePath={false}
  //       closeDrawer={() => { onAddReset(); onReset(); }}
  //     />
  //     <AddPantry
  //       editId={false}
  //       afterReset={() => onAddReset()}
  //       closeEditModal={() => { showAddModal(false); }}
  //     />
  //   </Drawer>
  // </Row>
  );
};

export default Pantry;
