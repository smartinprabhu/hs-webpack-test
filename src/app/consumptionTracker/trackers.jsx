/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/system';
import { Tooltip } from 'antd';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters, usePagination, useSortBy, useTable,
} from 'react-table';
import {
  Badge,
} from 'reactstrap';
/* import DrawerHeader from '@shared/drawerHeader'; */
import Drawer from '@mui/material/Drawer';
import TrackerCheck from '@images/sideNavImages/consumption_black.svg';
import DrawerHeader from '../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../themes/theme';

// import TrackerCheck from '@images/icons/complianceCheck.svg';

import { setInitialValues } from '../purchase/purchaseService';

import CommonGrid from '../commonComponents/commonGrid';
import { TrackerColumns } from '../commonComponents/gridColumns';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getComputedValidAnswer,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  queryGeneratorWithUtc,
  truncate, debounce, valueCheck, formatFilterData,
  getDynamicTabs,
} from '../util/appUtils';
import { ConsumptionTrackerModule } from '../util/field';
import AddTracker from './addTracker';
import AuditDetail from './auditDetail/auditDetail';
import {
  getConsumptionTrackerCount,
  getConsumptionTrackerExport,
  getConsumptionTrackerFilters,
  getConsumptionTrackerList,
  getCtDetail,
  resetAddTrackerInfo,
  updateCt,
} from './ctService';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  filterStringGenerator,
} from './utils/utils';

import trackersNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';
import esgTrackersNav from '../esg/navbar/navlist.json';
import SustainabilityNav from '../sustanablity/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Audits = ({ esgModule }) => {
  const limit = 10;
  const subMenu = 'Consumption Trackers';
  const tableColumns = TrackerColumns();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const { pinEnableData } = useSelector((state) => state.auth);
  const [addModal, showAddModal] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const [isLoad, setIsLoad] = useState(false);
  const [savedRecords, setSavedRecords] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState(false);
  const { apiFields } = ConsumptionTrackerModule;

  const [globalvalue, setGlobalvalue] = useState('');
  const [filterText, setFilterText] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    ctCount,
    ctInfo,
    ctCountLoading,
    ctFilters,
    ctDetailsInfo,
    addCtInfo,
    updateCtInfo,
    ctExportInfo,
  } = useSelector((state) => state.consumptionTracker);

  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { deleteInfo } = useSelector((state) => state.pantry);
  const listHead = 'Consumption Trackers List :';

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'SLA-KPI Audit',
    'code',
  );

  const isCreatable = true; // allowedOperations.includes(actionCodes['Add Breakdown Tracker']);
  const isEditable = false; // allowedOperations.includes(actionCodes['Edit Breakdown Tracker']);
  // const isDeleteable = allowedOperations.includes(actionCodes['Delete Breakdown Tracker']);

  const { searchColumns } = ConsumptionTrackerModule;
  const { advanceSearchColumns } = ConsumptionTrackerModule;

  const { hiddenColumns } = ConsumptionTrackerModule;

  const onClickClear = () => {
    dispatch(getConsumptionTrackerFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(
    () => (ctInfo && ctInfo.data && ctInfo.data.length > 0 ? ctInfo.data : [{}]),
    [ctInfo.data],
  );
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

  useEffect(() => {
    if (ctInfo && ctInfo.loading) {
      setOpenStatus(false);
    }
  }, [ctInfo]);

  useEffect(() => {
    if (ctInfo && ctInfo.loading) {
      setOpenStatus(false);
    }
  }, [ctInfo]);

  useEffect(() => {
    if (ctFilters && ctFilters.customFilters) {
      setCustomFilters(ctFilters.customFilters);
    }
  }, [ctFilters]);

  useEffect(() => {
    if (addCtInfo && addCtInfo.data) {
      const customFiltersList = ctFilters.customFilters
        ? queryGeneratorWithUtc(ctFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(
        getConsumptionTrackerCount(
          companies,
          appModels.CONSUMPTIONTRACKER,
          customFiltersList,
        ),
      );
      dispatch(
        getConsumptionTrackerList(
          companies,
          appModels.CONSUMPTIONTRACKER,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
        ),
      );
    }
  }, [addCtInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getConsumptionTrackerFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = ctFilters.customFilters
        ? queryGeneratorWithUtc(ctFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(
        getConsumptionTrackerCount(
          companies,
          appModels.CONSUMPTIONTRACKER,
          customFiltersList,
          globalFilter,
        ),
      );
    }
  }, [userInfo, JSON.stringify(ctFilters.customFilters), globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = ctFilters.customFilters
        ? queryGeneratorWithUtc(ctFilters.customFilters, false, userInfo.data)
        : '';
      setCheckRows([]);
      dispatch(
        getConsumptionTrackerList(
          companies,
          appModels.CONSUMPTIONTRACKER,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(ctFilters.customFilters), globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getCtDetail(viewId, appModels.CONSUMPTIONTRACKER));
    }
  }, [viewId]);

  useEffect(() => {
    if (addCtInfo && addCtInfo.data && addCtInfo.data.length && !viewId) {
      dispatch(getCtDetail(addCtInfo.data[0], appModels.CONSUMPTIONTRACKER));
    }
  }, [addCtInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && ctCount && ctCount.length && startExport) {
      const offsetValue = 0;
      const customFilters = ctFilters.customFilters
        ? queryGeneratorWithUtc(ctFilters.customFilters)
        : '';
      dispatch(
        getConsumptionTrackerExport(
          companies,
          appModels.CONSUMPTIONTRACKER,
          ctCount.length,
          offsetValue,
          apiFields,
          customFilters,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
        ),
      );
    }
  }, [startExport]);

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  const totalDataCount = ctCount && ctCount.length && columnFields.length ? ctCount.length : 0;

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
      setCheckRows(
        checkedRows.filter((item) => parseInt(item) !== parseInt(value)),
      );
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const datas = ctInfo && ctInfo.data ? ctInfo.data : [];
      const newArr = [...getColumnArrayById(datas, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const datas = ctInfo && ctInfo.data ? ctInfo.data : [];
      const ids = getColumnArrayById(datas, 'id');
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
      const customFiltersList = [...ctFilters.customFilters, ...filters];

      dispatch(getConsumptionTrackerFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = ctFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getConsumptionTrackerFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
      },
    ];
    if (checked) {
      const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ]);
      dispatch(getConsumptionTrackerFilters(customFilters1));
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
        header: 'Date Filter',
        id: value,
      },
    ];

    const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
    const customFilters1 = [
      ...(oldCustomFilters.length > 0
        ? oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        )
        : ''),
      ...filters,
    ];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getConsumptionTrackerFilters(customFilters1));

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
          header: 'Date Filter',
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getConsumptionTrackerFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getConsumptionTrackerFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };
  const handleCustomDateChangeold = (startDate, endDate) => {
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
        },
      ];
    }
    if (start && end) {
      const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getConsumptionTrackerFilters(customFilters1));
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
    const customFiltersList = ctFilters.customFilters.filter((item) => item.value !== cfValue);
    dispatch(getConsumptionTrackerFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  function getPendingQtns() {
    let res = false;
    const datass = savedRecords.filter((item) => item.is_update === 'start');
    if (datass && datass.length) {
      res = true;
    }
    return res;
  }

  function getPendingFullQtns() {
    let res = false;
    if (savedRecords && savedRecords.length) {
      res = true;
    }
    return res;
  }

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];
    /* const answeredQtns = savedRecords.filter((item) => item.is_update === 'start');

    if (answeredQtns.length && ctDetailsInfo && ctDetailsInfo.data && ctDetailsInfo.data.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].type === 'numerical_box') {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, value: getComputedValidAnswer(answeredQtns[i].answer), is_not_applicable: !!answeredQtns[i].is_not_applicable }];
          trackerLines.push(newData);
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, is_not_applicable: !!answeredQtns[i].is_not_applicable }];
          trackerLines.push(newData);
        }
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateCt(ctDetailsInfo.data[0].id, 'hx.tracker_line', payloadValues, 'checklist'));
    } */
    const detailData = ctDetailsInfo && (ctDetailsInfo.data && ctDetailsInfo.data.length > 0) ? ctDetailsInfo.data[0] : '';

    const filledChecklist = detailData && detailData.tracker_lines && detailData.tracker_lines.length > 0 ? detailData.tracker_lines : [];

    const filledAnsChecklist = filledChecklist.filter((item) => item.answer);

    const filledAnsChecklistNew = filledAnsChecklist.map((cl) => ({
      id: cl.id,
      answer: cl.answer,
      type: cl.mro_activity_id.type,
    }));

    if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
      for (let j = 0; j < filledAnsChecklistNew.length; j += 1) {
        if (filledAnsChecklistNew[j].type === 'numerical_box') {
          newData = [1, filledAnsChecklistNew[j].id, { answer: filledAnsChecklistNew[j].answer, value: getComputedValidAnswer(filledAnsChecklistNew[j].answer) }];
          trackerLines.push(newData);
        } else {
          newData = [1, filledAnsChecklistNew[j].id, { answer: filledAnsChecklistNew[j].answer }];
          trackerLines.push(newData);
        }
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateCt(ctDetailsInfo.data[0].id, 'hx.tracker_line', payloadValues, 'checklist'));
    }
  }

  const onViewReset = () => {
    if (getPendingFullQtns() && !isLoad) {
      setIsLoad(true);
      saveRecordbyTime();
      if (getPendingQtns()) {
        setIsLoad(true);
        alert('There are unsaved changes..If you leave before saving, your changes will be lost. Wait for the changes to be updated.');
      } else {
        setIsLoad(false);
        setViewId(false);
        setViewModal(false);
      }
    } else {
      setIsLoad(false);
      setViewId(false);
      setViewModal(false);
    }
    if (document.getElementById('consTrackform')) {
      document.getElementById('consTrackform').reset();
    }
    dispatch(resetAddTrackerInfo());
    setAddLink(false);
  };

  const addTrackerWindow = () => {
    if (document.getElementById('consTrackform')) {
      document.getElementById('consTrackform').reset();
    }
    dispatch(resetAddTrackerInfo());
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('consTrackform')) {
      document.getElementById('consTrackform').reset();
    }
    showEditModal(false);
  };

  const onAddClose = () => {
    if (document.getElementById('consTrackform')) {
      document.getElementById('consTrackform').reset();
    }
    // dispatch(resetAddTrackerInfo());
    showAddModal(false);
    setAddLink(false);
  };

  const onAddReset = () => {
    if (document.getElementById('consTrackform')) {
      document.getElementById('consTrackform').reset();
    }
    dispatch(resetAddTrackerInfo());
    showAddModal(false);
    setAddLink(false);
  };

  function getNextPreview(ids, type) {
    const array = ctInfo && ctInfo.data && ctInfo.data.length > 0 ? ctInfo.data : [];
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

  const onRemoveData = (id) => {
    // dispatch(getDelete(id, appModels.BREAKDOWNTRACKER));
  };

  const onRemoveDataCancel = () => {
    // dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const stateValuesList = ctFilters && ctFilters.customFilters && ctFilters.customFilters.length > 0
    ? ctFilters.customFilters.filter((item) => item.type === 'inarray')
    : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = ctFilters && ctFilters.customFilters && ctFilters.customFilters.length > 0
    ? ctFilters.customFilters
    : [];
  const loading = (userInfo && userInfo.loading)
    || (ctInfo && ctInfo.loading)
    || ctCountLoading;
  const trackerData = ctDetailsInfo && ctDetailsInfo.data && ctDetailsInfo.data.length > 0
    ? ctDetailsInfo.data[0]
    : '';

  const drawertitleName = (
    <Tooltip title={trackerData.name} placement="right">
      {truncate(trackerData.name, '50')}
    </Tooltip>
  );

  /* const onChangeFilter = (columnValue, text) => {
    columnValue.value = columnValue.value === undefined ? '' : columnValue.value;
    let array = value;
    const filterArray = [];
    if (columnValue.value) {
      array.push(columnValue);
      array = uniqBy(array, 'Header');
      const arrays = (array || []);
      arrays.map((key) => {
        const filters = {
          key: key.id, title: key.Header, value: key.value, label: key.Header, type: text, arrayLabel: key.label,
        };
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(0);
      const customFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = [...new Map(customFiltersList.map((m) => [m.key, m])).values()];
      dispatch(getTrackerFilters(uniquecustomFilter));
      setValueArray(array);
      removeData(`data-${columnValue.id}`, columnValue);
    }
  }; */

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        audit_for: true,
        name: true,
        temp_type_id: true,
        state: true,
        company_id: true,
        start_date: true,
        end_date: true,
        tracker_template_id: true,
        created_by_id: false,
        created_on: false,
        reviewed_by_id: false,
        reviewed_on: false,
        approved_by_id: false,
        approved_on: false,
      });
    }
  }, [visibleColumns]);

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
      const mergeFiltersList = [...ctFilters.customFilters, ...filterArray];
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getConsumptionTrackerFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'audit_for',
      'name',
      'temp_type_id',
      'state',
      'company_id',
      'start_date',
      'end_date',
      'tracker_template_id',
      'created_by_id',
      'created_on',
      'reviewed_by_id',
      'reviewed_on',
      'approved_by_id',
      'approved_on',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = ctFilters && ctFilters.customFilters ? ctFilters.customFilters : [];
    const dateFilters = oldCustomFilters.length > 0
      ? oldCustomFilters.filter(
        (item) => item.type === 'date' || item.type === 'customdate',
      )
      : [];

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
          const label = tableColumns.find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getConsumptionTrackerFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getConsumptionTrackerFilters(customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const customFiltersData = [...dateFilters, ...filtersData];

    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [ctFilters],
  );

  const advanceSearchjson = {
    state: setOpenStatus,
  };

  function numToFloat(num) {
    let result = 0;
    if (num) {
      result = num;
    }
    return parseFloat(result).toFixed(2);
  }

  function getFailedQtns() {
    let res = false;
    const datas = savedRecords.filter((item) => item.is_update === 'failed');
    if (datas && datas.length) {
      res = true;
    }
    return res;
  }

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(ctInfo && ctInfo.data && ctInfo.data.length && ctInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(ctInfo && ctInfo.data && ctInfo.data.length && ctInfo.data[ctInfo.data.length - 1].id);
    }
  }, [ctInfo]);

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

  const moduleName = esgModule || 'Consumption Tracker';
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    moduleName,
  );

  let activeTab;
  let tabs;

  if (headerTabs && !esgModule) {
    tabs = getTabs(
      headerTabs[0].menu,
      esgModule ? esgTrackersNav.data : trackersNav.data,
    );
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      esgModule ? 'ESG Tracker' : 'Consumption Trackers',
    );
  }

  if (headerTabs && esgModule && esgModule === 'ESG') {
    tabs = getTabs(headerTabs[0].menu, esgTrackersNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, esgTrackersNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(esgTrackersNav && esgTrackersNav.data && esgTrackersNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/esg/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'ESG Tracker',
    );
  }

  if (headerTabs && esgModule && esgModule === 'ESG Tracker') {
    tabs = getTabs(headerTabs[0].menu, SustainabilityNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'ESG Tracker',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: esgModule || 'Consumption Tracker',
        moduleName: esgModule || 'Consumption Trackers',
        menuName: esgModule ? `${esgModule} Tracker` : 'Consumption Trackers',
        link: esgModule ? '/esg-tracker' : '/consumption-trackers',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      <Box>
        {/* <Header
          headerPath={esgModule ? esgModule : "Consumption Trackers"}
          nextPath={esgModule ? `${esgModule} Tracker` : "Consumption Trackers"}
          pathLink={esgModule ? "/esg-tracker" : "/consumption-trackers"}
          headerTabs={tabs.filter((e) => e)}
          activeTab={activeTab}
        /> */}
        <CommonGrid
          className="tracker-table"
          tableData={
            ctInfo && ctInfo.data && ctInfo.data.length ? ctInfo.data : []
          }
          columns={TrackerColumns()}
          checkboxSelection
          pagination
          disableRowSelectionOnClick
          moduleName={
            esgModule ? `${esgModule} Tracker List` : 'Consumption Tracker List'
          }
          exportFileName="Trackers"
          isModuleDisplayName
          filters={filterText}
          listCount={totalDataCount}
          exportInfo={ctExportInfo}
          page={currentPage}
          rowCount={totalDataCount}
          limit={limit}
          handlePageChange={handlePageChange}
          setStartExport={setStartExport}
          createOption={{
            enable: true, // allowedOperations.includes(actionCodes['Create Consumption Tracker']),
            text: 'Add',
            func: () => setAddLink(true),
          }}
          setRows={setRows}
          rows={rows}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onFilterChanges={debouncedOnFilterChange}
          loading={ctInfo && ctInfo.loading}
          err={ctInfo && ctInfo.err}
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

        <Drawer
          PaperProps={{
            sx: { width: '50%' },
          }}
          anchor="right"
          open={addLink}
        >
          <DrawerHeader
            headerName={
              esgModule ? 'Create ESG Tracker' : 'Create Consumption Tracker'
            }
            imagePath={TrackerCheck}
            onClose={() => onViewReset()}
          />
          <AddTracker
            editId={false}
            closeModal={() => {
              onAddClose();
            }}
            afterReset={() => {
              onAddReset();
            }}
            isShow={addLink}
            addModal
            esgModule={esgModule}
          />
        </Drawer>

        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={viewModal}
        >
          <DrawerHeader
            headerName={
              ctDetailsInfo
                && ctDetailsInfo.data
                && ctDetailsInfo.data.length > 0
                && !ctDetailsInfo.loading
                ? drawertitleName
                : esgModule
                  ? 'ESG Tracker'
                  : 'Consumption Tracker'
            }
            imagePath={TrackerCheck}
            /*  isEditable={isEditable}
            loadingText={updateCtInfo && updateCtInfo.loading ? 'Saving..' : ''}
            isButtonDisabled={(updateCtInfo && updateCtInfo.loading) || getFailedQtns()} */
            onClose={() => onViewReset()}
          /*  onEdit={() => {
            setEditId(ctDetailsInfo && (ctDetailsInfo.data && ctDetailsInfo.data.length > 0) ? ctDetailsInfo.data[0].id : false);
            showEditModal(!editModal);
          }} */
            onPrev={() => {
              getNextPreview(viewId, 'Prev', ctInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', ctInfo));
            }}
            onNext={() => {
              getNextPreview(viewId, 'Next', ctInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', ctInfo));
            }}
          />
          <AuditDetail
            offset={offset}
            savedRecords={savedRecords}
            setSavedQuestions={setSavedRecords}
          />
        </Drawer>
      </Box>
      {/* <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
          <Card className="p-2 mb-2 h-100 bg-lightblue">
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2 itAsset-table-title">
                <Col md="10" xs="12" sm="10" lg="10">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    {listHead}
                    {' '}
                    {columnHide && columnHide.length && totalDataCount}
                  </span>
                  {columnHide && columnHide.length ? (
                    <div className="content-inline">
                      {ctFilters.customFilters && ctFilters.customFilters.map((cf) => (
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
                      {ctFilters.customFilters && ctFilters.customFilters.length ? (
                        <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
                          Clear
                        </span>
                      ) : ''}
                    </div>
                  ) : ''}
                </Col>
                <Col md="2" xs="12" sm="2" lg="2">
                  <div className="float-right">
                    <Refresh
                      setReload={setReload}
                      loadingTrue={loading}
                    />
                    <ListDateFilters
                      dateFilters={dateFilters}
                      customFilters={ctFilters.customFilters}
                      handleCustomFilterClose={handleCustomFilterClose}
                      setCustomVariable={setCustomVariable}
                      customVariable={customVariable}
                      onClickRadioButton={handleRadioboxChange}
                      onChangeCustomDate={handleCustomDateChange}
                      idNameFilter="slaAuditDate"
                      classNameFilter="drawerPopover popoverDate"
                    />
                    {isCreatable && (
                      <CreateList name="Create Consumption Tracker" showCreateModal={addTrackerWindow} />
                    )}
                    <ExportList idNameFilter="consumptionTrackerExport" response={(ctInfo && ctInfo.data && ctInfo.data.length)} />
                    <DynamicColumns
                      setColumns={setColumns}
                      columnFields={columnFields}
                      allColumns={allColumns}
                      setColumnHide={setColumnHide}
                    />
                  </div>
                  {ctInfo && ctInfo.data && ctInfo.data.length && (
                    <Popover target="consumptionTrackerExport" className="drawerPopover export-popover" placement="bottom" isOpen={filterInitailValues.download}>
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
                            apiFields={apiFields}
                          />
                        </div>
                      </PopoverBody>
                    </Popover>
                  )}
                </Col>
              </Row>
              {(ctInfo && ctInfo.data && ctInfo.data.length > 0) && (
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
                      tableData={ctInfo}
                      stateLabelFunction={getSlaStateLabel}
                      actions={{
                         edit: {
                          showEdit: true,
                          editFunc: editAsset,
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
                  {openStatus && (
                    <StaticCheckboxFilter
                      selectedValues={stateValues}
                      dataGroup={statusGroups}
                      onCheckboxChange={handleStatusCheckboxChange}
                      target="data-state"
                      title="Status"
                      openPopover={openStatus}
                      toggleClose={() => setOpenStatus(false)}
                      setDataGroup={setStatusGroups}
                      keyword={keyword}
                      data={customData && customData.stateTypes ? customData.stateTypes : []}
                    />
                  )}
                  {columnHide && columnHide.length ? (
                    <TableListFormat
                      userResponse={userInfo}
                      listResponse={ctInfo}
                      countLoad={ctCountLoading}
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
                    {columnHide && columnHide.length ? (<Pagination count={pages} page={currentpage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Drawer
          title=""
          closable={false}
          width={1300}
          className="drawer-bg-lightblue"
          visible={viewModal}
        >
          <DrawerHeader
            title={ctDetailsInfo && (ctDetailsInfo.data && ctDetailsInfo.data.length > 0 && !ctDetailsInfo.loading)
              ? drawertitleName : 'Consumption Tracker'}
            imagePath={TrackerCheck}
            isEditable={isEditable}
            loadingText={updateCtInfo && updateCtInfo.loading ? 'Saving..' : ''}
            isButtonDisabled={(updateCtInfo && updateCtInfo.loading) || getFailedQtns()}
            closeDrawer={() => onViewReset()}
            onEdit={() => {
              setEditId(ctDetailsInfo && (ctDetailsInfo.data && ctDetailsInfo.data.length > 0) ? ctDetailsInfo.data[0].id : false);
              showEditModal(!editModal);
            }}
            onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
            onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
          />
          <AuditDetail offset={offset} savedRecords={savedRecords} setSavedQuestions={setSavedRecords} />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue create-building-tracker"
          width="50%"
          visible={addModal}
        >

          <DrawerHeader
            title="Create Consumption Tracker"
            imagePath={TrackerCheck}
            closeDrawer={onViewReset}
          />
          <AddTracker
            editId={false}
            closeModal={() => { onAddReset(); }}
            afterReset={() => { onAddReset(); }}
            isShow={addModal}
            addModal
          />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width="50%"
          visible={editModal}
        >

          <DrawerHeader
            title="Update Breakdown Tracker"
            imagePath={TrackerCheck}
            closeDrawer={closeEditModalWindow}
          />
         <AddTracker editId={editId} closeModal={closeEditModalWindow} />
        </Drawer>
        <Modal
          size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
          className="border-radius-50px modal-dialog-centered"
          isOpen={deleteModal}
        >
          <ModalHeaderComponent
            title="Delete Tracker"
            imagePath={false}
            closeModalWindow={() => onRemoveDataCancel()}
            response={deleteInfo}
          />
          <ModalBody className="mt-0 pt-0">
            {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
              <p className="text-center">
                {`Are you sure, you want to remove ${removeName} ? `}
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
                successMessage="Tracker removed successfully.."
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
      </Col>
              </Row>
              */}
    </>
  );
};

export default Audits;
