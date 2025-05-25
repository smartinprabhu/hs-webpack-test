/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Badge,
} from 'reactstrap';

import workOrdersBlack from '@images/sideNavImages/workorder_black.svg';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { WorkOderColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import { setInitialValues } from '../purchase/purchaseService';
import { AddThemeBackgroundColor } from '../themes/theme';
import {
  getActiveTab,
  getAllowedCompanies,
  getColumnArray,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones, getHeaderTabs, getTabs,
  queryGeneratorWithUtc,
  generateErrorMessage,
  isArrayValueExists,
  formatFilterData, getNextPreview, debounce,
} from '../util/appUtils';
import { WorkOrdersModule } from '../util/field';
import woSideNav from './navbar/navlist.json';
import {
  getIssueTypeName,
  getMTName,
  getWorkOrderPriorityText,
  getWorkOrderStateText,
  getWorkOrderTypeName,
} from './utils/utils';
import WorkorderDetails from './workorderDetails/workorderDetails';
import {
  getCheckedRows,
  getOrderDetail,
  getWorkorderCount,
  getWorkorderFilter,
  getWorkorders,
  getWorkordersExport,
  resetOrderCheckList,
} from './workorderService';
import './workordersOverview/workordersOverview';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));
const appModels = require('../util/appModels').default;

const Workorders = (props) => {
  const { match, isDrawer } = props;
  const { params } = match;
  const paramViewId = params && params.viewId ? params.viewId : false;
  const limit = 10;
  const dispatch = useDispatch();
  const history = useHistory();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [checkItems, setCheckItems] = useState([]);
  const [checkTeams, setCheckTeams] = useState([]);
  const [checkPriorities, setCheckPriorities] = useState([]);
  const [checkMTypes, setCheckMTypes] = useState([]);
  const [checkTypes, setCheckTypes] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [viewId, setViewId] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [viewModal, setViewModal] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);
  const {
    workorderCount,
    workordersInfo,
    stateChangeInfo,
    workorderFilters,
    workorderDetails,
    workordersExportInfo,
    workorderCountLoading,
  } = useSelector((state) => state.workorder);

  const apiFields = WorkOrdersModule.workApiFields;
  const companies = getAllowedCompanies(userInfo);
  const tableColumns = WorkOderColumns();
  const loading = (userInfo && userInfo.loading)
    || (workordersInfo && workordersInfo.loading)
    || workorderCountLoading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = workordersInfo && workordersInfo.err
    ? generateErrorMessage(workordersInfo)
    : userErrorMsg;

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (isDrawer) {
      setOffset(0);
      setPage(0);
    }
  }, [isDrawer]);

  useEffect(() => {
    if (paramViewId) {
      setViewId(paramViewId);
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [paramViewId]);

  useEffect(() => {
    if (workordersExportInfo && workordersExportInfo.data && workordersExportInfo.data.length > 0) {
      workordersExportInfo.data.map((data) => {
        data.priority = getWorkOrderPriorityText(data.priority);
        data.state = getWorkOrderStateText(data.state);
        data.issue_type = getIssueTypeName(data.issue_type);
        data.maintenance_type = getMTName(data.maintenance_type);
        data.type_category = getWorkOrderTypeName(data.type_category);
      });
    }
  }, [workordersExportInfo]);

  useEffect(() => {
    if (workorderFilters && workorderFilters.states) {
      setCheckItems(workorderFilters.states);
    }
    if (workorderFilters && workorderFilters.teams) {
      setCheckTeams(workorderFilters.teams);
    }
    if (workorderFilters && workorderFilters.priorities) {
      setCheckPriorities(workorderFilters.priorities);
    }
    if (workorderFilters && workorderFilters.maintenanceTypes) {
      setCheckMTypes(workorderFilters.maintenanceTypes);
    }
    if (workorderFilters && workorderFilters.types) {
      setCheckTypes(workorderFilters.types);
    }
    if (workorderFilters && workorderFilters.customFilters) {
      setCustomFilters(workorderFilters.customFilters);
      const idExists = isArrayValueExists(
        workorderFilters.customFilters,
        'type',
        'id',
      );
      if (idExists) {
        const idData = workorderFilters.customFilters.filter(
          (item) => item.type === 'id',
        );
        const vId = idData && idData.length ? idData[0].value : false;
        if (vId) {
          setViewId(vId);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [workorderFilters]);

  useEffect(() => {
    if (reload) {
      const filterValues = {
        statusValues: [],
        teams: [],
        priorities: [],
        maintenanceTypes: [],
        customFilters: [],
      };
      dispatch(getWorkorderFilter(filterValues));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getWorkorders(companies, appModels.ORDER, limit, offset, WorkOrdersModule.workApiFields, statusValues, teams, priorities, maintenanceTypes, types, customFilters, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [userInfo, workorderFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, offset, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getWorkorderCount(companies, appModels.ORDER, statusValues, teams, priorities, maintenanceTypes, types, customFilters, false, globalFilter));
    }
  }, [workorderFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.data) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getWorkorders(
        companies,
        appModels.ORDER,
        limit,
        offset,
        WorkOrdersModule.workApiFields,
        statusValues,
        teams,
        priorities,
        maintenanceTypes,
        types,
        customFilters,
        sortedValue.sortBy,
        sortedValue.sortFieldfalse,
        globalFilter,
      ));
    }
  }, [stateChangeInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (customFilters) {
      {
        customFilters && customFilters.length ? customFilters.map((cf) => {
          if (cf.type === 'customdatedynamic' && !(customVariable)) {
            handleCustomFilterClose(cf.key, cf.value, cf.type, cf);
          }
        }) : '';
      }
    }
  }, [customFilters, customVariable]);

  useEffect(() => {
    if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  const totalDataCount = workorderCount && workorderCount.length ? workorderCount.length : 0;

  const handleMTypeClose = (value) => {
    setOffset(0);
    setPage(0);
    const payload = {
      states: checkItems, teams: checkTeams, maintenanceTypes: checkMTypes.filter((item) => item.id !== value), priorities: checkPriorities, customFilters, types: checkTypes,
    };
    dispatch(getWorkorderFilter(payload));
    setCheckMTypes(checkMTypes.filter((item) => item.id !== value));
  };

  const handleCustomFilterClose = (cfValue, arrValue, typeData, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
    let filterData = [];
    if (typeData === 'inarray') {
      setCustomFilters(customFilters.filter((item) => item.value !== arrValue));
      filterData = customFilters.filter((item) => item.value !== arrValue);
    } else {
      setCustomFilters(customFilters.filter((item) => item.key !== cfValue));
      filterData = customFilters.filter((item) => item.key !== cfValue);
    }
    const payload = {
      states: checkItems,
      teams: checkTeams,
      priorities: checkPriorities,
      maintenanceTypes: checkMTypes,
      types: checkTypes,
      customFilters: filterData,
    };
    dispatch(getWorkorderFilter(payload));
  };

  function checkDateField(oData, cData) {
    let res = 'date_start_scheduled';
    if (oData && oData.length) {
      res = 'date_start_scheduled';
    } else if (cData && cData.length) {
      res = 'date_start_scheduled';
    }
    return res;
  }

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const openData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'ready') : false;
    const closeData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'done') : false;
    const filters = [{
      key: value, value, label: value, type: 'customdatefield', datefield: checkDateField(openData, closeData), header: 'Date Filter', id: value,
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = workorderFilters && workorderFilters.customFilters ? workorderFilters.customFilters : [];
      const filterValues = {
        states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
        teams: workorderFilters && workorderFilters.teams ? workorderFilters.teams : [],
        priorities: workorderFilters && workorderFilters.priorities ? workorderFilters.priorities : [],
        maintenanceTypes: workorderFilters && workorderFilters.maintenanceTypes ? workorderFilters.maintenanceTypes : [],
        types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
        customFilters: [...oldCustomFilters.filter((item) => item.type !== 'customdatefield'), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'customdatefield'), ...filters]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getWorkorderFilter(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'customdatefield',
      ));
      const filterValues = {
        states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
        teams: workorderFilters && workorderFilters.teams ? workorderFilters.teams : [],
        priorities: workorderFilters && workorderFilters.priorities ? workorderFilters.priorities : [],
        maintenanceTypes: workorderFilters && workorderFilters.maintenanceTypes ? workorderFilters.maintenanceTypes : [],
        types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
        customFilters: customFiltersList.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'customdatefield',
        ),
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray'
            && item.type !== 'customdatefield',
        ),
      );
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getWorkorderFilter(filterValues));
    }
    setOffset(0); setPage(0);
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
    const openData = workorderFilters && workorderFilters.states
      ? workorderFilters.states.filter((item) => item.id === 'ready')
      : false;
    const closeData = workorderFilters && workorderFilters.states
      ? workorderFilters.states.filter((item) => item.id === 'done')
      : false;
    if (startDate && endDate) {
      filters = [{
        key: value,
        value,
        label: value,
        type: 'customdatedynamic',
        datefield: checkDateField(openData, closeData),
        start,
        end,
        header: 'Date Filter',
        id: value,
      }];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = workorderFilters && workorderFilters.customFilters
        ? workorderFilters.customFilters
        : [];
      const filterValues = {
        states:
          workorderFilters && workorderFilters.states
            ? workorderFilters.states
            : [],
        teams:
          workorderFilters && workorderFilters.teams
            ? workorderFilters.teams
            : [],
        priorities:
          workorderFilters && workorderFilters.priorities
            ? workorderFilters.priorities
            : [],
        maintenanceTypes:
          workorderFilters && workorderFilters.maintenanceTypes
            ? workorderFilters.maintenanceTypes
            : [],
        types:
          workorderFilters && workorderFilters.types
            ? workorderFilters.types
            : [],
        customFilters: [
          ...oldCustomFilters.filter(
            (item) => item.type !== 'customdatedynamic'
              && item.type !== 'customdatefieldarray'
              && item.type !== 'customdatefield',
          ),
          ...filters,
        ],
      };
      setValueArray([...valueArray.filter((item) => (item.type !== 'customdatedynamic' && item.type !== 'customdatefieldarray' && item.type !== 'customdatefield')), ...filters]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getWorkorderFilter(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = workorderFilters && workorderFilters.customFilters
        ? workorderFilters.customFilters
        : [];
      const filterValues = {
        states:
          workorderFilters && workorderFilters.states
            ? workorderFilters.states
            : [],
        teams:
          workorderFilters && workorderFilters.teams
            ? workorderFilters.teams
            : [],
        priorities:
          workorderFilters && workorderFilters.priorities
            ? workorderFilters.priorities
            : [],
        maintenanceTypes:
          workorderFilters && workorderFilters.maintenanceTypes
            ? workorderFilters.maintenanceTypes
            : [],
        types:
          workorderFilters && workorderFilters.types
            ? workorderFilters.types
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getWorkorderFilter(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetOrderCheckList());
  };

  const showLabelOnTop = (data, closeFunc, text) => (
    <>
      {data
          && data.map((item) => (
            <p key={item.id} className="mx-2 content-inline">
              <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                {item.title}
                <span>
                  {text}
                  {' '}
                  {' '}
                  :
                  {' '}
                  {' '}
                  {item.label}
                </span>
                <FontAwesomeIcon
                  className="ml-2 cursor-pointer"
                  onClick={() => closeFunc(item.id)}
                  size="sm"
                  icon={faTimesCircle}
                />
              </Badge>
            </p>
          ))}
    </>
  );

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
    setGlobalvalue('');
    const fields = [
      'name',
      'sequence',
      'maintenance_team_id',
      'state',
      'equipment_location_id',
      'priority',
      'issue_type',
      'employee_id',
      'maintenance_type',
      'type_category',
      'task_id',
      'description',
      'pause_reason_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = workorderFilters && workorderFilters.customFilters
      ? workorderFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate' || item.type === 'customdatefield',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    const payload = {
      states: checkItems,
      teams: checkTeams,
      priorities: checkPriorities,
      maintenanceTypes: checkMTypes,
      types: checkTypes,
    };

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
        payload.customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getWorkorderFilter(payload));

        setFilterText(formatFilterData(payload, data?.quickFilterValues?.[0]));
      }
    } else {
      payload.customFilters = [...dateFilters];
      dispatch(getWorkorderFilter(payload));
      setFilterText(formatFilterData(payload, data?.quickFilterValues?.[0]));
    }
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [workorderFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(workordersInfo && workordersInfo.data && workordersInfo.data.length && workordersInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(workordersInfo && workordersInfo.data && workordersInfo.data.length && workordersInfo.data[workordersInfo.data.length - 1].id);
    }
  }, [workordersInfo]);

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

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        sequence: true,
        maintenance_team_id: true,
        state: true,
        equipment_location_id: true,
        priority: true,
        issue_type: false,
        employee_id: false,
        equip_asset_common: false,
        maintenance_type: false,
        type_category: false,
        task_id: false,
        description: false,
        date_planned: false,
        date_execution: false,
        create_date: false,
        pause_reason_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && workorderCount
      && workorderCount.length && startExport
      && workorderFilters
      && ((workorderFilters.states && workorderFilters.states.length > 0)
        || (workorderFilters.teams && workorderFilters.teams.length > 0)
        || (workorderFilters.priorities
          && workorderFilters.priorities.length > 0)
        || (workorderFilters.maintenanceTypes
          && workorderFilters.maintenanceTypes.length > 0)
        || (workorderFilters.types && workorderFilters.types.length > 0)
        || (workorderFilters.customFilters
          && workorderFilters.customFilters.length > 0)
        || (rows && rows.length > 0) || (globalFilter && globalFilter.length))
    ) {
      const offsetValue = 0;
      const statusValues = workorderFilters.states
        ? getColumnArray(workorderFilters.states, 'id')
        : [];
      const teams = workorderFilters.teams
        ? getColumnArrayById(workorderFilters.teams, 'id')
        : [];
      const priorities = workorderFilters.priorities
        ? getColumnArray(workorderFilters.priorities, 'id')
        : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes
        ? getColumnArray(workorderFilters.maintenanceTypes, 'id')
        : [];
      const types = workorderFilters.types
        ? getColumnArray(workorderFilters.types, 'id')
        : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      dispatch(
        getWorkordersExport(
          companies,
          appModels.ORDER,
          workorderCount.length,
          offsetValue,
          apiFields,
          statusValues,
          teams,
          priorities,
          maintenanceTypes,
          types,
          customFilters,
          rows,
          sortBy,
          sortField,
          globalFilter,
        ),
      );
    }
  }, [userInfo, workorderCount, startExport]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Work Orders',
  );

  let activeTab;
  let tabs = [];

  if (headerTabs && headerTabs.length) {
    tabs = getTabs(headerTabs[0].menu, woSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Work Orders',
    );
  }

  useEffect(() => {
    if (!isDrawer) {
      dispatch(
        updateHeaderData({
          module: 'Work Orders',
          moduleName: 'Work Orders',
          menuName: 'Work Orders',
          link: '/maintenance/workorders',
          headerTabs: tabs.filter((e) => e),
          activeTab,
        }),
      );
    }
  }, [activeTab]);

  const exportCondition = workorderFilters && ((workorderFilters.states && workorderFilters.states.length > 0) || (workorderFilters.teams && workorderFilters.teams.length > 0)
    || (workorderFilters.maintenanceTypes && workorderFilters.maintenanceTypes.length > 0) || (workorderFilters.types && workorderFilters.types.length > 0)
    || (workorderFilters.priorities && workorderFilters.priorities.length > 0) || (workorderFilters.customFilters && workorderFilters.customFilters.length > 0
      || (rows && rows.length)) || globalFilter?.length
  );

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
            workordersInfo && workordersInfo.data && workordersInfo.data.length
              ? workordersInfo.data
              : []
          }
        columns={tableColumns}
        filters={filterText}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Work Orders List"
        exportFileName="Work Orders"
        listCount={totalDataCount}
        exportInfo={workordersExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={workordersInfo && workordersInfo.loading}
        err={workordersInfo && workordersInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        exportCondition={{ filter: exportCondition, show: true }}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {isDrawer && checkMTypes && showLabelOnTop(checkMTypes, handleMTypeClose, 'Maintenance Type')}
            {isDrawer && customFilters && customFilters.map((cf) => (
              <p key={cf.key} className="content-inline">
                <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                  {cf.filter}
                  {' '}
                  :
                  {' '}
                  {cf.label}
                  <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key, cf.value, cf.type, cf)} size="sm" icon={faTimesCircle} />
                </Badge>
              </p>
            ))}
            {isDrawer === false && customFilters && customFilters.length > 0 && customFilters.map((cf) => (
              ((cf.type === 'id' || cf.label) && cf.type != 'customdatefield')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key, cf.value, cf.type, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            ))}
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
          headerName={
              workorderDetails
                && workorderDetails.data
                && workorderDetails.data.length > 0
                ? `${'Work Order'}${' - '}${workorderDetails.data[0].name}`
                : 'Work Order'
            }
          imagePath={workOrdersBlack}
          onClose={() => onViewReset()}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', workordersInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', workordersInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', workordersInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', workordersInfo));
          }}
        />
        <WorkorderDetails setViewModal={setViewModal} />
      </Drawer>
    </Box>
  );
};

Workorders.defaultProps = {
  match: false,
  isDrawer: false,
};

Workorders.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default Workorders;
