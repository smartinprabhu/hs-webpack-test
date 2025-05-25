/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
/* import {
  Drawer,
} from 'antd'; */

import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import GatepassIcon from '@images/sideNavImages/gatepass_black.svg';
import Loader from '@shared/loading';
import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { GatePassColumns } from '../commonComponents/gridColumns';
/* import DrawerHeader from '@shared/drawerHeader'; */
import {
  setInitialValues,
} from '../purchase/purchaseService';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  getNextPreview,
  queryGeneratorWithUtc,
  formatFilterData,
} from '../util/appUtils';
import { GatePassModule } from '../util/field';
import AddGatePass from './addGatePass';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import GatePassDetail from './gatePassDetails/gatePassDetails';
import {
  getGatePass,
  getGatePassConfig,
  getGatePassCount,
  getGatePassDetails,
  getGatePassExport,
  getGatePassFilters,
  resetCreateGatePass, resetUpdateGatePass,
} from './gatePassService';
import { filterStringGenerator, getCustomButtonName } from './utils/utils';

import { updateHeaderData } from '../core/header/actions';
import gatepassNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const GatePasses = () => {
  const limit = 10;
  const subMenu = 'Gate Passes';
  const classes = useStyles();
  const dispatch = useDispatch();
  // let tableColumns = GatePassColumns()
  const [tableColumns, setTableColumns] = useState([]);
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const apiFields = customData && customData.listfieldsShows ? customData.listfieldsShows : [];
  const [visibleColumns, setVisibleColumns] = useState({});
  const [customVariable, setCustomVariable] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [typesGroups, setTypesGroups] = useState([]);
  const [filterText, setFilterText] = useState('');

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { pinEnableData } = useSelector((state) => state.auth);

  const [addModal, showAddModal] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    gatePassesCount, gatePasses, gatePassesCountLoading, updateGatePassInfo,
    gatePassFilters, gatePassDetails, gatePassConfig, gatePassesExport,
  } = useSelector((state) => state.gatepass);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  const [openPermitStatus, setOpenPermitStatus] = useState(false);
  const [openTypeId, setOpenTypeId] = useState(false);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Gate Pass', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Gate Pass']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Gate Pass']);

  const advanceSearchjson = {
    state: setOpenPermitStatus,
    type: setOpenTypeId,
  };

  useEffect(() => {
    if (openPermitStatus || openTypeId) {
      setKeyword('');
    }
  }, [openPermitStatus, openTypeId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getGatePassConfig(companies, appModels.GATEPASSCONFIGURATION));
    }
  }, [userInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getGatePassDetails(viewId, appModels.GATEPASS));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (gatePassesCount && gatePassesCount.length) && startExport) {
      const offsetValue = 0;
      //  setPdfBody([]);
      const customFiltersQuery = gatePassFilters && gatePassFilters.customFilters ? queryGeneratorWithUtc(gatePassFilters.customFilters) : '';
      dispatch(getGatePassExport(companies, appModels.GATEPASS, gatePassesCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [startExport]);

  useEffect(() => {
    if (gatePassFilters && gatePassFilters.customFilters) {
      setCustomFilters(gatePassFilters.customFilters);
    }
  }, [gatePassFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getGatePassFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = gatePassFilters.customFilters ? queryGeneratorWithUtc(gatePassFilters.customFilters, false, userInfo.data) : '';
      dispatch(getGatePassCount(companies, appModels.GATEPASS, customFiltersList, globalFilter));
    }
  }, [JSON.stringify(customFilters), globalFilter, reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = gatePassFilters.customFilters ? queryGeneratorWithUtc(gatePassFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getGatePass(companies, appModels.GATEPASS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(customFilters), globalFilter, reload]);

  const totalDataCount = gatePassesCount && gatePassesCount.length ? gatePassesCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
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
      const data = gatePasses && gatePasses.data ? gatePasses.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = gatePasses && gatePasses.data ? gatePasses.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getGatePassFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getGatePassFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'type', title: 'Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getGatePassFilters(customFiltersList));
      removeData('data-type');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getGatePassFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        gatepass_number: true,
        gatepass_type: true,
        description: true,
        type: true,
        requestor_id: true,
        requested_on: true,
        state: true,
        reference: true,
        space_id: true,
        name: false,
        email: false,
        bearer_return_on: false,
        approved_on: false,
        approved_by: false,
      });
    }
  }, [visibleColumns]);

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

    const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters
      ? gatePassFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getGatePassFilters(customFilters1));

    setOffset(0);
    setPage(0);
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
      const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters
        ? gatePassFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getGatePassFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters
        ? gatePassFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getGatePassFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };
  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters ? gatePassFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getGatePassFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChangeold = (startDate, endDate) => {
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
      const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters ? gatePassFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      dispatch(getGatePassFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getGatePassFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const addWindow = () => {
    if (document.getElementById('gatePassForm')) {
      document.getElementById('gatePassForm').reset();
    }
    showAddModal(true);
    dispatch(resetCreateGatePass());
  };

  const closeWindow = () => {
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateGatePass());
  };

  const afterReset = () => {
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateGatePass());
    dispatch(resetUpdateGatePass());
  };

  const closeEditWindow = () => {
    showAddModal(false);
    showEditModal(false);
    setViewModal(true);
    dispatch(resetCreateGatePass());
    dispatch(resetUpdateGatePass());
  };

  const stateValuesList = (gatePassFilters && gatePassFilters.customFilters && gatePassFilters.customFilters.length > 0)
    ? gatePassFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (gatePassFilters && gatePassFilters.customFilters && gatePassFilters.customFilters.length > 0) ? gatePassFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (gatePasses && gatePasses.loading) || (gatePassesCountLoading);

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = [];
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
      dispatch(getGatePassFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getGatePassFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const searchColumns = GatePassModule.gatePassSearchColumn;
  const hiddenColumns = GatePassModule.gatePassHiddenColumn;
  const advanceSearchColumns = GatePassModule.gatePassAdvanceSearchColumn;

  function setRef(data, isRef) {
    let res = [];
    if (isRef) {
      const refIndex = data.findIndex((item) => item.accessor === 'reference');
      if (refIndex !== '-1') {
        const newData = data;
        newData[refIndex].Header = isRef;
        res = newData;
      }
    } else {
      res = data;
    }
    return res;
  }

  const refName =  useMemo(() => (gatePassConfig && gatePassConfig.data && gatePassConfig.data.length && gatePassConfig.data[0].reference_display ? gatePassConfig.data[0].reference_display : false), [gatePassConfig])
  const fColumns = setRef(filtersFields.columns, refName);

  const columns = useMemo(() => fColumns, [refName]);
  const data = useMemo(() => (gatePasses.data ? gatePasses.data : [{}]), [gatePasses.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(gatePasses && gatePasses.data && gatePasses.data.length && gatePasses.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(gatePasses && gatePasses.data && gatePasses.data.length && gatePasses.data[gatePasses.data.length - 1].id);
    }
  }, [gatePasses]);

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
    console.log(data, 'dataaaaaaaaaaa');
    const fields = [
      'description',
      'gatepass_number',
      'gatepass_type',
      'type',
      'requestor_id',
      'requested_on',
      'state',
      'reference',
      'space_id',
      'name',
      'email',
      'bearer_return_on',
      'approved_on',
      'approved_by',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = gatePassFilters && gatePassFilters.customFilters
      ? gatePassFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length) {
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
      dispatch(getGatePassFilters(customFilters));
    }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getGatePassFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Gate Pass',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, gatepassNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Gate Passes',
    );
  }

  useEffect(() => {
    const columns = GatePassColumns(gpConfig);
    if (refName) {
      columns[7].headerName = refName;
    }
    setTableColumns(columns);
  }, [gatePassConfig]);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Gate Pass',
        moduleName: 'Gate Pass',
        menuName: 'Gate Passes',
        link: '/gatepass-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getGatePassFilters([]),
      }),
    );
  }, [activeTab]);

  return (
    <Box>
        {/* <Header
          headerPath="Gate Pass"
          nextPath=""
          pathLink="/gatepass-overview"
          headerTabs={tabs.filter((e) => e)}
          activeTab={activeTab}
        /> */}
        {tableColumns && tableColumns.length > 0 && (
          <CommonGrid
            className="tickets-table"
            componentClassName="commonGrid"
            sx={{
              height: '90%',
            }}
            tableData={
              gatePasses && gatePasses.data && gatePasses.data.length
                ? gatePasses.data
                : []
            }
            columns={tableColumns}
           // filters={filterText}
            filters={filterStringGenerator(gatePassFilters) ? filterStringGenerator(gatePassFilters) : filterText}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            moduleName="Gate Passes"
            exportFileName="Gate Pass"
            isModuleDisplayName
            listCount={totalDataCount}
            configData={gpConfig}
            exportInfo={gatePassesExport}
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
            loading={gatePasses && gatePasses.loading}
            err={gatePasses && gatePasses.err}
            onClickRadioButton={handleRadioboxChange}
            onChangeCustomDate={handleCustomDateChange}
            setCustomVariable={setCustomVariable}
            customVariable={customVariable}
            setViewModal={setViewModal}
            setViewId={setViewId}
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
                        {(cf.type === 'text' || cf.type === 'id') && (
                          <span>
                            {decodeURIComponent(cf.name)}
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
        )}
        {(tableColumns && tableColumns.length === 0) && (
          <div className=" loader mb-2 mt-3 p-5 " data-testid="loading-case">
            <Loader />
          </div>
        )}
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={viewModal}
        >
          <DrawerHeader
            headerName={gatePassDetails && (gatePassDetails.data && gatePassDetails.data.length > 0)
              ? `${'Gate Pass'}${' - '}${gatePassDetails.data[0].reference}` : 'Gate Pass'}
            imagePath={GatepassIcon}
            onClose={() => onViewReset()}
            isEditable={(isEditable && (gatePassDetails && !gatePassDetails.loading))}
            onEdit={() => {
              setEditId(gatePassDetails && (gatePassDetails.data && gatePassDetails.data.length > 0) ? gatePassDetails.data[0].id : false);
              showEditModal(!editModal);
            }}
            onPrev={() => {
              getNextPreview(viewId, 'Prev', gatePasses) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', gatePasses));
            }}
            onNext={() => {
              getNextPreview(viewId, 'Next', gatePasses) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', gatePasses));
            }}
          />
          <GatePassDetail offset={offset} setViewModal={setViewModal} editId={editId} />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '70%' },
          }}
          anchor="right"
          open={addModal}
        >

          <DrawerHeader
            headerName={`${getCustomButtonName('Create', gpConfig)} Gate Pass`}
            imagePath={GatepassIcon}
            onClose={closeWindow}
          />
          <AddGatePass closeModal={closeWindow} afterReset={afterReset} addModal={addModal} />
        </Drawer>
    </Box>
  );
};

GatePasses.defaultProps = {
  match: false,
};

GatePasses.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default GatePasses;
