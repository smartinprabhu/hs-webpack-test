/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* import {
  Drawer,
} from 'antd'; */

import uniqBy from 'lodash/unionBy';


// import DrawerHeader from '@shared/drawerHeader';
import Drawer from '@mui/material/Drawer';

import {
  Box,
} from '@mui/system';
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';
import DrawerHeader from '../commonComponents/drawerHeader';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, 
  getAllCompanies, getColumnArrayById, queryGeneratorWithUtc,
  
  getArrayFromValuesByItem, getTimeFromDecimal,
  getListOfOperations, extractNameObject, getDateAndTimeForDifferentTimeZones, getHeaderTabs,
  getTabs,
  getDynamicTabs,
  getActiveTab, debounce, getNewDataGridFilterArray, filterStringGeneratorDynamic, getNextPreview,
} from '../util/appUtils';
import {
  getInspectionCheckListCount, getInspectionCheckList,
  getInspectionFilters, getInspectionChecklistsGroups,
  getInspectionSchedulertDetail, getInspectionCheckListExport,
} from './inspectionService';
import {
  setInitialValues,
} from '../purchase/purchaseService';

import {
  

  getWorkOrderPriorityText,
} from '../workorders/utils/utils';
import { getTeamGroups } from '../workorders/workorderService';
import SchedulerDetail from './inspectionDetails/inspectionDetails';
import actionCodes from './data/actionCodes.json';
import AddInspectionChecklist from './addInspectionChecklist';
import fieldsData from './data/customData.json';
import { InspectionSchedulerColumns } from '../commonComponents/gridColumns';
import CommonGrid from '../commonComponents/commonGrid';
import { InspectionModule } from '../util/field';

import inspectionNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InspectionSchedulers = () => {
  const limit = 10;
  const subMenu = 'Scheduler';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnsFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const apiFields = fieldsData && fieldsData.listFields ? fieldsData.listFields : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [pdfBody, setPdfBody] = useState([]);
  const [reload, setReload] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [teamGroups, setTeamGroups] = useState([]);
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [editLink, setEditLink] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openMTeam, setOpenMTeam] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [typeGroups, setTypeGroups] = useState([]);
  const [priorityGroups, setPriorityGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const { pinEnableData } = useSelector((state) => state.auth);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [editId, setEditId] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    inspectionCount, inspectionListInfo, inspectionCountLoading, inspectionExport,
    inspectionFilters, checklistGroupsInfo, inspectionSchedulerDetail, addInspectionScheduleInfo,
  } = useSelector((state) => state.inspection);
  const { teamGroupsInfo } = useSelector((state) => state.workorder);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    updatePpmSchedulerInfo,
  } = useSelector((state) => state.ppm);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        equipment_id: true,
        asset_number: true,
        category_type: true,
        commences_on: true,
        starts_at: true,
        duration: true,
        group_id: true,
        maintenance_team_id: true,
        check_list_id: true,
        task_id: false,
        priority: false,
        uuid: false,
        parent_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckListCount(companies, appModels.INSPECTIONCHECKLIST, customFiltersList, globalFilter));
    }
  }, [userInfo, inspectionFilters.customFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getInspectionFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getInspectionCheckList(companies, appModels.INSPECTIONCHECKLIST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, inspectionFilters.customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((addInspectionScheduleInfo && addInspectionScheduleInfo.data))) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckList(companies, appModels.INSPECTIONCHECKLIST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
      dispatch(getInspectionCheckListCount(companies, appModels.INSPECTIONCHECKLIST, customFiltersList));
    }
  }, [addInspectionScheduleInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((updatePpmSchedulerInfo && updatePpmSchedulerInfo.data))) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckList(companies, appModels.INSPECTIONCHECKLIST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
      dispatch(getInspectionSchedulertDetail(viewId, appModels.INSPECTIONCHECKLIST));
    }
  }, [updatePpmSchedulerInfo]);

  useEffect(() => {
    if (openMTeam) {
      dispatch(getTeamGroups(companies, appModels.INSPECTIONCHECKLIST));
    }
  }, [openMTeam]);

  useEffect(() => {
    if (openGroup) {
      dispatch(getInspectionChecklistsGroups(companies, appModels.INSPECTIONCHECKLIST));
    }
  }, [openGroup]);

  useEffect(() => {
    if (teamGroupsInfo && teamGroupsInfo.data) {
      setTeamGroups(teamGroupsInfo.data);
    }
  }, [teamGroupsInfo]);

  useEffect(() => {
    if (checklistGroupsInfo && checklistGroupsInfo.data) {
      setChecklistGroups(checklistGroupsInfo.data);
    }
  }, [checklistGroupsInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getInspectionSchedulertDetail(viewId, appModels.INSPECTIONCHECKLIST));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (inspectionCount && inspectionCount.length) && startExport) {
      const offsetValue = 0;
      //  setPdfBody([]);
      const customFiltersQuery = inspectionFilters && inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckListExport(companies, appModels.INSPECTIONCHECKLIST, inspectionCount.length, offsetValue, InspectionModule.inspectionApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  const totalDataCount = inspectionCount && inspectionCount.length ? inspectionCount.length : 0;

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
      setColumns(columnsFields.filter((item) => item !== value));
    }
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
      const data = inspectionListInfo && inspectionListInfo.data ? inspectionListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = inspectionListInfo && inspectionListInfo.data ? inspectionListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'category_type', title: 'Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...inspectionFilters.customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-category_type');
    } else {
      const customFiltersList = inspectionFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handlePriorityCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'priority', title: name, value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...inspectionFilters.customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-priority');
    } else {
      const customFiltersList = inspectionFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date', Header: value, id: value,
    }];
    if (checked) {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters ? inspectionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getInspectionFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const onTeamSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = teamGroups.filter((item) => {
        const searchValue = item.maintenance_team_id ? item.maintenance_team_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setTeamGroups(ndata);
    } else {
      setTeamGroups(teamGroupsInfo && teamGroupsInfo.data ? teamGroupsInfo.data : []);
    }
  };

  const handleTeamChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'maintenance_team_id', title: 'Team', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...inspectionFilters.customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = inspectionFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const onGroupSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = checklistGroups.filter((item) => {
        const searchValue = item.group_id ? item.group_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setChecklistGroups(ndata);
    } else {
      setChecklistGroups(checklistGroupsInfo && checklistGroupsInfo.data ? checklistGroupsInfo.data : []);
    }
  };

  const handleGroupChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'group_id', title: 'Group', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...inspectionFilters.customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-group_id');
    } else {
      const customFiltersList = inspectionFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getInspectionFilters(customFiltersList));
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

    const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
      ? inspectionFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getInspectionFilters(customFilters1));

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
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
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
      dispatch(getInspectionFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getInspectionFilters(filterValues));
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
        key: value, value, label: value, type: 'customdate', start, end, Header: value, id: value,
      }];
    }
    if (start && end) {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters ? inspectionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];

      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getInspectionFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (fValue, cf) => {
    setCustomFilters(inspectionFilters.customFilters.filter((item) => item.value !== fValue));
    const customFiltersList = inspectionFilters.customFilters.filter((item) => item.value !== fValue);
    dispatch(getInspectionFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const handleResetClick = () => {
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setCustomFilters([]);
    dispatch(getInspectionFilters([]));
    setOffset(0);
    setPage(0);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
    setViewModal(true);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    setAddLink(false);
    setEditLink(false);
  };

  const onEditReset = () => {
    setViewModal(true);
    setAddLink(false);
    setEditLink(false);
  };

  const afterReset = () => {
    setAddLink(false);
    setEditLink(false);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...inspectionFilters.customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getInspectionFilters(customFilters1));
    setOffset(0);
    setPage(0);
  };

  const stateValuesList = (inspectionFilters && inspectionFilters.customFilters && inspectionFilters.customFilters.length > 0)
    ? inspectionFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (inspectionFilters && inspectionFilters.customFilters && inspectionFilters.customFilters.length > 0) ? inspectionFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading)
    || (inspectionListInfo && inspectionListInfo.loading)
    || (inspectionCountLoading);

  // eslint-disable-next-line no-lone-blocks
  { /* if (addLink) {
    return (
      <Redirect to={{
        pathname: '/inspection/add-inspection',
        state: { referrer: 'inspection-schedule' },
      }}
      />
    );
  }

  if (editLink) {
    return (
      <Redirect to={{
        pathname: `/inspection/edit-inspection/${viewId}`,
        state: { referrer: 'inspection-schedule' },
      }}
      />
    );
  } */ }

  const columns = useMemo(() => filtersFields.columns, []);

  const data = useMemo(
    () => (inspectionListInfo.data ? inspectionListInfo.data : [{}]),
    [inspectionListInfo.data],
  );

  const hiddenColumns = ['uuid', 'priority', 'task_id', 'parent_id', 'id'];
  const searchColumns = ['asset_number', 'priority', 'group_id', 'uuid', 'equipment_id', 'category_type', 'maintenance_team_id'];
  const advanceSearchjson = {
    category_type: setOpenType,
    priority: setOpenPriority,
    group_id: setOpenGroup,
    maintenance_team_id: setOpenMTeam,
  };

  useEffect(() => {
    if (openType) {
      setKeyword('');
      setOpenPriority(false);
      setOpenGroup(false);
      setOpenMTeam(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openPriority) {
      setKeyword('');
      setOpenType(false);
      setOpenGroup(false);
      setOpenMTeam(false);
    }
  }, [openPriority]);

  useEffect(() => {
    if (openGroup) {
      setKeyword('');
      setOpenType(false);
      setOpenPriority(false);
      setOpenMTeam(false);
    }
  }, [openGroup]);

  useEffect(() => {
    if (openMTeam) {
      setKeyword('');
      setOpenType(false);
      setOpenPriority(false);
      setOpenGroup(false);
    }
  }, [openMTeam]);

  const advanceSearchColumns = InspectionModule.inspectionAdvanceSearchColumns;
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
      dispatch(getInspectionFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(inspectionListInfo && inspectionListInfo.data && inspectionListInfo.data.length && inspectionListInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(inspectionListInfo && inspectionListInfo.data && inspectionListInfo.data.length && inspectionListInfo.data[inspectionListInfo.data.length - 1].id);
    }
  }, [inspectionListInfo]);

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

  const onFilterChange = (data) => {
    const fields = [
      'equipment_id',
      'asset_number',
      'category_type',
      'commences_on',
      'starts_at',
      'duration',
      'group_id',
      'maintenance_team_id',
      'check_list_id',
      'task_id',
      'priority',
      'uuid',
      'parent_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
      ? inspectionFilters.customFilters
      : [];

    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
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
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        uniqueCustomFilter = getNewDataGridFilterArray(InspectionSchedulerColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getInspectionFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getInspectionFilters(customFilters));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [inspectionFilters],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Inspection Schedule',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, inspectionNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(inspectionNav && inspectionNav.data && inspectionNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/inspection-overview/inspection/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Scheduler',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Inspection Schedule',
        moduleName: 'Inspection Schedule',
        menuName: 'Scheduler',
        link: '/inspection-overview/inspection-schedule',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    if (inspectionExport && inspectionExport.data && inspectionExport.data.length > 0) {
      inspectionExport.data.map((data) => {
        data.priority = getWorkOrderPriorityText(data.priority);
        data.starts_at = getTimeFromDecimal(data.starts_at);
        data.duration = getTimeFromDecimal(data.duration);
        inspectionExport.data.push(data);
      });
    }
  }, [inspectionExport]);

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          inspectionListInfo && inspectionListInfo.data
            ? inspectionListInfo.data
            : []
        }
        columns={InspectionSchedulerColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Inspection Checklist"
        exportFileName="Inspection"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={inspectionExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Create Inspection Schedule']),
          text: 'Add',
          func: () => setAddLink(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterStringGeneratorDynamic(inspectionFilters)}
        loading={inspectionListInfo && inspectionListInfo.loading}
        err={inspectionListInfo && inspectionListInfo.err}
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
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName="Create Inspection Schedule"
          title={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
            ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : 'Name'}
          isEditable={(allowedOperations.includes(actionCodes['Edit Inspection Schedule']) && (inspectionSchedulerDetail && !inspectionSchedulerDetail.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setEditLink(true); }}
          imagePath={InspectionIcon}

        />
        <AddInspectionChecklist setAddLink={setAddLink} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
            ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : ''}
          imagePath={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0) ? InspectionIcon : ''}
          isEditable={(allowedOperations.includes(actionCodes['Edit Inspection Schedule']) && (inspectionSchedulerDetail && !inspectionSchedulerDetail.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setEditLink(true); }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', inspectionListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', inspectionListInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', inspectionListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', inspectionListInfo));
          }}
        />
        <SchedulerDetail editId={editId} setEditId={setEditId} onEditReset={onEditReset} />
      </Drawer>

    </Box>

  /*  <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
       <Col sm="12" md="12" lg="12" xs="12">
         <Row>
           <Col md="12" sm="12" lg="12" xs="12" className={'inspection-checklist pl-1 pt-2 pr-2'}>
             <Card className={'p-2 mb-2 h-100 bg-lightblue'}>
               <CardBody className="bg-color-white p-1 m-0">
                 <Row className="p-2">
                   <Col md="8" xs="12" sm="8" lg="8">
                     <span className="p-0 mr-2 font-weight-800 font-medium">
                       Inspection Checklist :
                       {'  '}
                       {columnHide && columnHide.length && totalDataCount}
                     </span>
                     {columnHide && columnHide.length ? (
                       <div className="content-inline">
                         {inspectionFilters.customFilters && inspectionFilters.customFilters.map((cf) => (
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
                                   :
                                   {'  '}
                                   {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                                   {' - '}
                                   {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                                 </span>
                               )}
                               <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                             </Badge>
                           </p>
                         ))}
                         {inspectionFilters.customFilters && inspectionFilters.customFilters.length ? (
                           <span onClick={() => handleResetClick()} className="cursor-pointer text-info mr-2">
                             Clear
                           </span>
                         ) : ''}
                       </div>
                     ) : ''}
                   </Col>
                   <Col md="4" xs="12" sm="4" lg="4">
                     <div className="float-right">
                       <Refresh
                         setReload={setReload}
                         loadingTrue={loading}
                       />
                       <ListDateFilters dateFilters={dateFilters} customFilters={inspectionFilters.customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                       {allowedOperations.includes(actionCodes['Create Inspection Schedule']) && (
                         <CreateList name="Add Inspection Checklist" showCreateModal={() => setAddLink(true)} />
                       )}
                       <ExportList response={(inspectionListInfo && inspectionListInfo.data && inspectionListInfo.data.length)} />
                       <DynamicColumns
                         setColumns={setColumns}
                         columnFields={columnsFields}
                         allColumns={allColumns}
                         setColumnHide={setColumnHide}
                       />
                     </div>
                     <Popover className="export-popover" placement="bottom" isOpen={filterInitailValues.download} target="Export">
                       <PopoverHeader>
                         Export
                         <img
                           src={closeCircleIcon}
                           aria-hidden="true"
                           className="cursor-pointer mr-1 mt-1 float-right"
                           onClick={() => dispatch(setInitialValues(false, false, false, false))}
                           alt="close"
                         />
                       </PopoverHeader>
                       <PopoverBody>
                         <DataExport
                           afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                           fields={columnsFields}
                           rows={checkedRows}
                           sortBy={sortedValue.sortBy}
                           sortField={sortedValue.sortField}
                           apiFields={apiFields}
                         />
                       </PopoverBody>
                     </Popover>
                   </Col>
                 </Row>
                 <div className="thin-scrollbar">
                   <div className="table-responsive common-table">
                     <Table responsive {...getTableProps()} className="mt-2">
                       <CustomTable
                         isAllChecked={isAllChecked}
                         handleTableCellAllChange={handleTableCellAllChange}
                         searchColumns={searchColumns}
                         onChangeFilter={onChangeFilter}
                         removeData={removeData}
                         setKeyword={setKeyword}
                         handleTableCellChange={handleTableCellChange}
                         checkedRows={checkedRows}
                         setViewId={setViewId}
                         setViewModal={setViewModal}
                         tableData={inspectionListInfo}
                         priorityLabelFunction={getWorkOrderPriorityLabel}
                         advanceSearchColumns={advanceSearchColumns}
                         advanceSearchFunc={advanceSearchjson}
                         tableProps={{
                           page: page,
                           prepareRow: prepareRow,
                           getTableBodyProps: getTableBodyProps,
                           headerGroups: headerGroups
                         }}
                       />
                     </Table>
                   </div>
                 </div>
                 {openType && (
                   <StaticCheckboxFilter
                     selectedValues={stateValues}
                     dataGroup={typeGroups}
                     onCheckboxChange={handleStatusCheckboxChange}
                     target="data-category_type"
                     title='Type'
                     openPopover={openType}
                     toggleClose={() => setOpenType(false)}
                     setDataGroup={setTypeGroups}
                     keyword={keyword}
                     data={customData && customData.inspectionTypes ? customData.inspectionTypes : []}
                   />
                 )}
                 {openPriority && (
                   <StaticCheckboxFilter
                     selectedValues={stateValues}
                     dataGroup={priorityGroups}
                     onCheckboxChange={handlePriorityCheckboxChange}
                     target="data-priority"
                     title='Priority'
                     openPopover={openPriority}
                     toggleClose={() => setOpenPriority(false)}
                     setDataGroup={setPriorityGroups}
                     keyword={keyword}
                     data={customData && customData.inspectionPriorities ? customData.inspectionPriorities : []}
                   />
                 )}
                 {openMTeam && (
                   <DynamicCheckboxFilter
                     data={teamGroupsInfo}
                     selectedValues={stateValues}
                     dataGroup={teamGroups}
                     filtervalue="maintenance_team_id"
                     onCheckboxChange={handleTeamChange}
                     toggleClose={() => setOpenMTeam(false)}
                     openPopover={openMTeam}
                     target="data-maintenance_team_id"
                     title='Maintenance Teams'
                     keyword={keyword}
                     setDataGroup={setTeamGroups}
                   />
                 )}
                 {openGroup && (
                   <DynamicCheckboxFilter
                     data={checklistGroupsInfo}
                     selectedValues={stateValues}
                     dataGroup={checklistGroups}
                     filtervalue="group_id"
                     onCheckboxChange={handleGroupChange}
                     toggleClose={() => setOpenGroup(false)}
                     openPopover={openGroup}
                     target="data-group_id"
                     title='Groups'
                     keyword={keyword}
                     setDataGroup={setChecklistGroups}
                   />
                 )}
                 {columnHide && !columnHide.length ? (
                   <div className='text-center mb-4'>
                     Please select the Columns
                   </div>
                 ) : ''}
                 {loading || pages === 0 ? (<span />) : (
                   <div className={`${classes.root} float-right`}>
                     {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                   </div>
                 )}

                 <Drawer
                   title=""
                   closable={false}
                   width={1250}
                   className="drawer-bg-lightblue"
                   visible={viewModal}
                 >
                   <DrawerHeader
                     title={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
                       ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : 'Name'}
                     imagePath={false}
                     isEditable={(allowedOperations.includes(actionCodes['Edit Inspection Schedule']) && (inspectionSchedulerDetail && !inspectionSchedulerDetail.loading))}
                     closeDrawer={() => onViewReset()}
                     onEdit={() => { setEditLink(true); }}
                     onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
                     onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
                   />
                   <SchedulerDetail />
                 </Drawer>
                 <Drawer
                   title=""
                   closable={false}
                   className="drawer-bg-lightblue create-inspection"
                   width={1250}
                   visible={addLink}
                 >

                   <DrawerHeader
                     title="Create Inspection Checklist"
                     imagePath={InspectionIcon}
                     closeDrawer={onViewReset}
                   />
                   <AddInspectionChecklist setAddLink={setAddLink} />
                 </Drawer>
                 <Drawer
                   title=""
                   closable={false}
                   className="drawer-bg-lightblue"
                   width={1250}
                   visible={editLink}
                 >

                   <DrawerHeader
                     title="Update Inspection Checklist"
                     imagePath={InspectionIcon}
                     closeDrawer={onEditReset}
                   />
                   {editLink && (<AddInspectionChecklist setEditLink={setEditLink} editId={viewId} afterReset={afterReset} />)}
                 </Drawer>
                 {columnHide && columnHide.length ? (
                   <TableListFormat
                     userResponse={userInfo}
                     listResponse={inspectionListInfo}
                     countLoad={inspectionCountLoading}
                   />
                 ) : ''}
               </CardBody>
             </Card>
           </Col>
         </Row>
       </Col>
     </Row> */
  );
};

export default InspectionSchedulers;
