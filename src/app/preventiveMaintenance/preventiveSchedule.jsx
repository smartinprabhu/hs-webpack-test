/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/system';
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



import CommonGrid from '../commonComponents/commonGrid';
import { PPMColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import {
  generateErrorMessage,
  getActiveTab,
  getAllCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getDynamicTabs,
  getHeaderTabs,
  getListOfOperations,
  getPagesCountV2,
  getTabs,
  queryGeneratorWithUtc, debounce, getNewDataGridFilterArray} from '../util/appUtils';
import {
  filterStringGenerator,
} from './utils/utils';
import filtersFields from './data/filtersFields.json';
import actionCodes from './data/preventiveActionCodes.json';
import PPMSideNav from "./navbar/navlist.json";
import {
  getPriorityLabel,
  getppmLabel,
} from './utils/utils';
import {
  getCheckedRows, getDeletePreventiveSchedule,
  getPreventiveCount,
  getPreventiveDetail,
  getPreventiveExport,
  getPreventiveFilter,
  getPreventiveList,
  getTeamGroups,
  resetDeletePreventiveSchedule,
} from './ppmService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const preventativeSchedule = (props) => {
  const { type } = props;
  const limit = 10;
  const subMenu = 'Scheduler';
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [customFilters, setCustomFilters] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [columnFields, setColumns] = useState(
    ['name', 'equipment_count', 'space_count', 'time_period', 'priority', 'scheduler_type', 'mro_ord_count', 'category_type', 'recurrent_id', 'duration'],
  );
  const apiFields = ['name', 'equipment_count', 'space_count', 'time_period', 'priority', 'scheduler_type', 'mro_ord_count', 'category_type', 'recurrent_id', 'duration', 'ppm_by', 'company_id', 'create_date', 'maintenance_team_id'];
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openPerformedBy, setOpenPerformedBy] = useState(false);

  const [categoryGroups, setCategoryGroups] = useState([]);
  const [performedByGroups, setPerformedByGroups] = useState([]);
  const [priorityGroups, setPriorityGroups] = useState([]);
  const [scheduleGroups, setScheduleGroups] = useState([]);
  const [teamGroups, setTeamGroups] = useState([]);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const classes = useStyles();
  const { pinEnableData } = useSelector((state) => state.auth);

  const isInspection = !!(type && type === 'Inspection');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    ppmCount, ppmInfo, ppmFilter, ppmDetail, preventiveScheduleDeleteInfo, addPreventiveInfo, updatePpmSchedulerInfo, teamGroupInfo, ppmExportInfo,
  } = useSelector((state) => state.ppm);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (ppmExportInfo && ppmExportInfo.data && ppmExportInfo.data.length > 0) {
      ppmExportInfo.data.map((data) => {
        data.priority = getPriorityLabel(data.priority);
        data.ppm_by = getppmLabel(data.ppm_by);
      });
    };
  }, [ppmExportInfo]);


  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      dispatch(getPreventiveList(
        companies,
        appModels.PPMCALENDAR,
        limit,
        offset,
        apiFields,
        customFiltersList,
        sortedValue.sortBy,
        sortedValue.sortField,
        isInspection,
        globalFilter,
      ));
      dispatch(getPreventiveCount(companies, appModels.PPMCALENDAR, customFiltersList, isInspection, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, ppmFilter.customFilters]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        time_period: true,
        priority: true,
        scheduler_type: true,
        category_type: true,
        duration: true,
        equipment_count: true,
        space_count: true,
        ppm_by: false,
        create_date: false,
        maintenance_team_id: false,
        company_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getPreventiveDetail(viewId, appModels.PPMCALENDAR));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (teamGroupInfo && teamGroupInfo.data) {
      setTeamGroups(teamGroupInfo.data);
    }
  }, [teamGroupInfo]);

  useEffect(() => {
    if ((preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data) || (addPreventiveInfo && addPreventiveInfo.data) || (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data)) {
      const customFiltersList = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      dispatch(getPreventiveCount(companies, appModels.PPMCALENDAR, customFiltersList, isInspection, globalFilter));
      dispatch(getPreventiveList(
        companies,
        appModels.PPMCALENDAR,
        limit,
        offset,
        apiFields,
        customFiltersList,
        sortedValue.sortBy,
        sortedValue.sortField,
        isInspection,
        globalFilter,
      ));
    }
  }, [preventiveScheduleDeleteInfo, addPreventiveInfo, updatePpmSchedulerInfo]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (ppmFilter && ppmFilter.customFilters) {
      setCustomFilters(ppmFilter.customFilters);
    }
  }, [ppmFilter]);

  const searchColumns = ['name', 'time_period', 'priority', 'ppm_by', 'maintenance_team_id', 'category_type'];
  const advanceSearchColumns = ['time_period', 'priority', 'ppm_by', 'maintenance_team_id', 'category_type'];

  const columns = useMemo(() => (isInspection ? filtersFields.inspectionColumns : filtersFields.columns), []);
  const data = useMemo(() => (ppmInfo.data ? ppmInfo.data : [{}]), [ppmInfo.data]);

  const hiddenColumns = ['ppm_by', 'company_id', 'create_date', 'maintenance_team_id'];

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

  const ppmCountValue = ppmCount && ppmCount.data && ppmCount.data.length ? ppmCount.data.length : 0;
  const pages = getPagesCountV2(ppmCountValue, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsets = (index - 1) * limit;
    setOffset(offsets);
    setPage(index);
    setIsAllChecked(false);
  };

  useEffect(() => {
    if ((userInfo && userInfo.data) && openTeam) {
      dispatch(getTeamGroups(companies, appModels.PPMCALENDAR));
    }
  }, [userInfo, openTeam]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const dataValue = ppmInfo && ppmInfo.data ? ppmInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = ppmInfo && ppmInfo.data ? ppmInfo.data : [];
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
    dispatch(getPreventiveFilter(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const onRemoveSchedule = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemove = (id) => {
    dispatch(getDeletePreventiveSchedule(id, appModels.PPMCALENDAR));
  };

  const onRemoveScheduleCancel = () => {
    dispatch(resetDeletePreventiveSchedule());
    showDeleteModal(false);
  };

  // const handleRadioboxChange = (event) => {
  //   const { checked, value } = event.target;
  //   const filters = [{
  //     key: value, value, label: value, type: 'date',
  //   }];
  //   if (checked) {
  //     const oldCustomFilters = ppmFilter && ppmFilter.customFilters ? ppmFilter.customFilters : [];
  //     const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
  //     dispatch(getPreventiveFilter(customFilters1));
  //   }
  //   setOffset(0);
  //   setPage(1);
  // };

  // const handleCustomDateChange = (startDate, endDate) => {
  //   const value = 'Custom';
  //   let start = '';
  //   let end = '';
  //   let filters = [];
  //   if (startDate && endDate) {
  //     start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
  //     end = `${moment(endDate).add(1, 'day').utc().format('YYYY-MM-DD')} 18:30:59`;
  //   }
  //   if (startDate && endDate) {
  //     filters = [{
  //       key: value, value, label: value, type: 'customdate', start, end,
  //     }];
  //   }
  //   if (start && end) {
  //     const oldCustomFilters = ppmFilter && ppmFilter.customFilters ? ppmFilter.customFilters : [];
  //     const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
  //     setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
  //     dispatch(getPreventiveFilter(customFilters1));
  //   }
  //   setOffset(0);
  //   setPage(1);
  // };

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
    const oldCustomFilters = ppmFilter && ppmFilter.customFilters
      ? ppmFilter.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getPreventiveFilter(customFilters1));
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
      const oldCustomFilters = ppmFilter && ppmFilter.customFilters
        ? ppmFilter.customFilters
        : [];
      const filterValues = {
        states:
          ppmFilter && ppmFilter.states ? ppmFilter.states : [],
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
      dispatch(getPreventiveFilter(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = ppmFilter && ppmFilter.customFilters
        ? ppmFilter.customFilters
        : [];
      const filterValues = {
        states:
          ppmFilter && ppmFilter.states ? ppmFilter.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getPreventiveFilter(filterValues));
    }
    setOffset(0);
    setPage(1);
  };


  const dateFilters = (ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.length > 0) ? ppmFilter.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (ppmInfo && ppmInfo.loading) || (ppmCount && ppmCount.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (ppmInfo && ppmInfo.err) ? generateErrorMessage(ppmInfo) : userErrorMsg;

  function getNextPreview(ids, types) {
    const array = ppmInfo && ppmInfo.data ? ppmInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (types === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const drawerOpen = () => {
    setViewId(false);
    setAddLink(true);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    setAddLink(false);
    setEditLink(false);
  };

  const onEditReset = () => {
    setViewId(false);
    setViewModal(true);
    setAddLink(false);
    setEditLink(false);
  };

  const onClickClear = () => {
    dispatch(getPreventiveFilter([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenCategory(false);
    setOpenPriority(false);
    setOpenStatus(false);
    setOpenTeam(false);
    setOpenPerformedBy(false);
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
      dispatch(getPreventiveFilter(customFiltersList));
      // dispatch(getAuditFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    time_period: setOpenStatus,
    priority: setOpenPriority,
    category_type: setOpenCategory,
    ppm_by: setOpenPerformedBy,
    maintenance_team_id: setOpenTeam,
  };

  useEffect(() => {
    if (openPriority) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenPerformedBy(false);
      setOpenCategory(false);
      setOpenTeam(false);
    }
  }, [openPriority]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenPriority(false);
      setOpenPerformedBy(false);
      setOpenCategory(false);
      setOpenTeam(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openPerformedBy) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenPriority(false);
      setOpenCategory(false);
      setOpenTeam(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openCategory) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenPriority(false);
      setOpenTeam(false);
      setOpenPerformedBy(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openTeam) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenPriority(false);
      setOpenPerformedBy(false);
      setOpenCategory(false);
    }
  }, [openTeam]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'time_period', title: 'Schedule', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPreventiveFilter(customFiltersList));
      removeData('data-time_period');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPreventiveFilter(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handlePriorityCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'priority', title: 'Priority', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPreventiveFilter(customFiltersList));
      removeData('data-priority');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPreventiveFilter(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handlePerformedCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'ppm_by', title: 'Performed By', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPreventiveFilter(customFiltersList));
      removeData('data-ppm_by');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPreventiveFilter(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'category_type', title: 'Category', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPreventiveFilter(customFiltersList));
      removeData('data-category_type');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPreventiveFilter(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleTeamCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'maintenance_team_id', title: 'Team', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPreventiveFilter(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPreventiveFilter(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const stateValuesList = (ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.length > 0)
    ? ppmFilter.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  useEffect(() => {
    if ((userInfo && userInfo.data) && (ppmCount && ppmCount.data && ppmCount.data.length) && startExport) {
      const offsetValue = 0;
      // const rows = ppmRows.rows ? ppmRows.rows : [];
      const customFiltersQuery = ppmFilter && ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      const ppmCountValue = ppmCount && ppmCount.data && ppmCount.data.length ? ppmCount.data.length : 0;
      dispatch(getPreventiveExport(companies, appModels.PPMCALENDAR, ppmCountValue, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, isInspection));
    }
  }, [startExport]);

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
      'time_period',
      'priority',
      'scheduler_type',
      'category_type',
      'duration',
      'equipment_count',
      'space_count',
      'ppm_by',
      'maintenance_team_id',
      'company_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = ppmFilter && ppmFilter.customFilters
      ? ppmFilter.customFilters
      : [];
    const oldCustomFiltersArray = Array.isArray(oldCustomFilters) ? oldCustomFilters : [oldCustomFilters];
    const dateFilters = oldCustomFiltersArray && oldCustomFiltersArray.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );
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
        uniqueCustomFilter = getNewDataGridFilterArray(PPMColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getPreventiveFilter(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getPreventiveFilter(customFilters));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [ppmFilter]
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "52 Week PPM"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, PPMSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(PPMSideNav && PPMSideNav.data && PPMSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/preventive-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Scheduler"
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "52 Week PPM",
        moduleName: "52 Week PPM",
        menuName: "Scheduler",
        link: "/preventive-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getPreventiveFilter([])
      })
    );
  }, [activeTab]);

  return (
    <Box
    // className={pinEnableData ? 'content-box-expand' : 'content-box'}
    >
      {/* <Header
        headerPath="52 Week PPM"
        nextPath="Scheduler"
        pathLink="/preventive-overview"
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          ppmInfo && ppmInfo.data && ppmInfo.data.length
            ? ppmInfo.data
            : []
        }
        columns={PPMColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Schedule List"
        exportFileName={isInspection ? 'Inspection Schedule' : 'PPM Schedule'}
        listCount={ppmCountValue}
        exportInfo={ppmExportInfo}
        page={currentPage}
        rowCount={ppmCountValue}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Create Schedule']),
          text: 'Add',
          func: () => setAddLink(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterStringGenerator(ppmFilter)}
        loading={ppmInfo && ppmInfo.loading}
        err={ppmInfo && ppmInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
      />
    </Box >
    // <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border ppm-scheduler">
    //   <Col sm="12" md="12" lg="12" xs="12">
    //     <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
    //       <Card className="p-2 mb-2 h-100 bg-lightblue">
    //         <CardBody className="bg-color-white p-1 m-0">

    //           <Row className="p-2 itAsset-table-title">
    //             <Col md="9" xs="12" sm="9" lg="9">
    //               <span className="p-0 mr-2 font-weight-800 font-medium">
    //                 Schedule List :
    //                 {' '}
    //                 {columnHide && columnHide.length && ppmCountValue}
    //               </span>
    //               {columnHide && columnHide.length ? (
    //                 <div className="content-inline">
    //                   {customFilters && customFilters.length ? customFilters.map((cf) => (
    //                     <p key={cf.value} className="mr-2 content-inline">
    //                       <Badge color="dark" className="p-2 mb-1 bg-zodiac">
    //                         {(cf.type === 'inarray') ? (
    //                           <>
    //                             {cf.title}
    //                             <span>
    //                               {'  '}
    //                               :
    //                               {' '}
    //                               {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
    //                             </span>
    //                           </>
    //                         ) : (
    //                           cf.label
    //                         )}
    //                         {' '}
    //                         {(cf.type === 'text' || cf.type === 'id') && (
    //                           <span>
    //                             {'  '}
    //                             :
    //                             {' '}
    //                             {decodeURIComponent(cf.value)}
    //                           </span>
    //                         )}
    //                         {(cf.type === 'customdate') && (
    //                           <span>
    //                             {'  '}
    //                             :
    //                             {' '}
    //                             {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
    //                             {' - '}
    //                             {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
    //                           </span>
    //                         )}
    //                         <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
    //                       </Badge>
    //                     </p>
    //                   )) : ''}
    //                   {customFilters && customFilters.length ? (
    //                     <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
    //                       Clear
    //                     </span>
    //                   ) : ''}
    //                 </div>
    //               ) : ''}
    //             </Col>
    //             <Col md="3" xs="12" sm="3" lg="3">
    //               <div className="float-right">
    //                 <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
    //                 {allowedOperations.includes(actionCodes['Create Schedule']) && (
    //                   <CreateList name="Add PPM Checklist" showCreateModal={drawerOpen} />
    //                 )}
    //                 <ExportList />
    //                 <DynamicColumns
    //                   setColumns={setColumns}
    //                   columnFields={columnFields}
    //                   allColumns={allColumns}
    //                   setColumnHide={setColumnHide}
    //                 />
    //               </div>
    //               <Popover className="export-popover" placement="bottom" isOpen={filterInitailValues.download} target="Export">
    //                 <PopoverHeader>
    //                   Export
    //                   <img
    //                     aria-hidden="true"
    //                     alt="close"
    //                     src={closeCircleIcon}
    //                     onClick={() => dispatch(setInitialValues(false, false, false, false))}
    //                     className="cursor-pointer mr-1 mt-1 float-right"
    //                   />
    //                 </PopoverHeader>
    //                 <PopoverBody>
    //                   <div className="p-2">
    //                     <DataExport
    //                       afterReset={() => dispatch(setInitialValues(false, false, false, false))}
    //                       fields={columnFields}
    //                       sortedValue={sortedValue}
    //                       rows={checkedRows}
    //                       apiFields={apiFields}
    //                     />
    //                   </div>
    //                 </PopoverBody>
    //               </Popover>
    //             </Col>
    //           </Row>
    //           {(ppmInfo && ppmInfo.data && ppmInfo.data.length > 0) && (
    //             <span data-testid="success-case" />
    //           )}
    //           <div className="thin-scrollbar">
    //             <div className="table-responsive common-table">
    //               <Table responsive {...getTableProps()} className="mt-2">
    //                 <CustomTable
    //                   isAllChecked={isAllChecked}
    //                   handleTableCellAllChange={handleTableCellAllChange}
    //                   searchColumns={searchColumns}
    //                   advanceSearchColumns={advanceSearchColumns}
    //                   advanceSearchFunc={advanceSearchjson}
    //                   onChangeFilter={onChangeFilter}
    //                   removeData={removeData}
    //                   setKeyword={setKeyword}
    //                   handleTableCellChange={handleTableCellChange}
    //                   checkedRows={checkedRows}
    //                   priorityLabelFunction={getWorkOrderPriorityLabel}
    //                   setViewId={setViewId}
    //                   setViewModal={setViewModal}
    //                   tableData={ppmInfo}
    //                   getppmLabel={getppmLabel}
    //                   categoryTypeFunction={getPpmCategoryLabel}
    //                   actions={{
    //                     /* edit: {
    //                       showEdit: true,
    //                       editFunc: editAsset,
    //                     }, */
    //                     delete: {
    //                       showDelete: true,
    //                       deleteFunc: onRemoveSchedule,
    //                     },
    //                   }}
    //                   tableProps={{
    //                     page,
    //                     prepareRow,
    //                     getTableBodyProps,
    //                     headerGroups,
    //                   }}
    //                 />
    //               </Table>
    //             </div>
    //           </div>
    //           {loading || pages === 0 ? (<span />) : (
    //             <div className={`${classes.root} float-right`}>
    //               {columnHide && columnHide.length ? (
    //                 <Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
    //               ) : ''}
    //             </div>
    //           )}
    //           {columnHide && !columnHide.length ? (
    //             <div className="text-center mb-4">
    //               Please select the Columns
    //             </div>
    //           ) : ''}
    //           {loading && (
    //             <div className="mb-2 mt-3 p-5" data-testid="loading-case">
    //               <Loader />
    //             </div>
    //           )}
    //           {columnHide && columnHide.length && ((ppmInfo && ppmInfo.err) || isUserError) ? (
    //             <ErrorContent errorTxt={errorMsg} />) : ''}
    //           {openStatus && (
    //             <StaticCheckboxFilter
    //               selectedValues={stateValues}
    //               dataGroup={scheduleGroups}
    //               onCheckboxChange={handleCheckboxChange}
    //               target="data-time_period"
    //               title="Schedule"
    //               openPopover={openStatus}
    //               toggleClose={() => setOpenStatus(false)}
    //               setDataGroup={setScheduleGroups}
    //               keyword={keyword}
    //               data={preventiveActions.timeperiod}
    //             />
    //           )}
    //           {openPriority && (
    //             <StaticCheckboxFilter
    //               selectedValues={stateValues}
    //               dataGroup={priorityGroups}
    //               onCheckboxChange={handlePriorityCheckboxChange}
    //               target="data-priority"
    //               title="Priority"
    //               openPopover={openPriority}
    //               toggleClose={() => setOpenPriority(false)}
    //               setDataGroup={setPriorityGroups}
    //               keyword={keyword}
    //               data={preventiveActions.priority}
    //             />
    //           )}
    //           {openPerformedBy && (
    //             <StaticCheckboxFilter
    //               selectedValues={stateValues}
    //               dataGroup={performedByGroups}
    //               onCheckboxChange={handlePerformedCheckboxChange}
    //               target="data-ppm_by"
    //               title="Performed By"
    //               openPopover={openPerformedBy}
    //               toggleClose={() => setOpenPerformedBy(false)}
    //               setDataGroup={setPerformedByGroups}
    //               keyword={keyword}
    //               data={preventiveActions.ppmBy}
    //             />
    //           )}
    //           {openCategory && (
    //             <StaticCheckboxFilter
    //               selectedValues={stateValues}
    //               dataGroup={categoryGroups}
    //               onCheckboxChange={handleCategoryCheckboxChange}
    //               target="data-category_type"
    //               title="Category"
    //               openPopover={openCategory}
    //               toggleClose={() => setOpenCategory(false)}
    //               setDataGroup={setCategoryGroups}
    //               keyword={keyword}
    //               data={preventiveActions.ppmFor}
    //             />
    //           )}
    //           {openTeam && (
    //             <DynamicCheckboxFilter
    //               data={teamGroupInfo}
    //               selectedValues={stateValues}
    //               dataGroup={teamGroups}
    //               filtervalue="maintenance_team_id"
    //               onCheckboxChange={handleTeamCheckboxChange}
    //               toggleClose={() => setOpenTeam(false)}
    //               openPopover={openTeam}
    //               target="data-maintenance_team_id"
    //               title="Team"
    //               keyword={keyword}
    //               setDataGroup={setTeamGroups}
    //             />
    //           )}
    //         </CardBody>
    //       </Card>
    //     </Col>
    //     <Drawer
    //       title=""
    //       closable={false}
    //       width={1250}
    //       className="drawer-bg-lightblue"
    //       visible={viewModal}
    //     >
    //       <DrawerHeader
    //         title={ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0)
    //           ? (ppmDetail.data[0].name) : 'Name'}
    //         imagePath={predictiveMaintenance}
    //         isEditable={(allowedOperations.includes(actionCodes['Edit Schedule']) && (ppmDetail && !ppmDetail.loading))}
    //         closeDrawer={() => onViewReset()}
    //         onEdit={() => { setEditLink(true); }}
    //         onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
    //         onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
    //       />
    //       <PreventiveDetail isInspection={isInspection} />
    //     </Drawer>
    //     <Drawer
    //       title=""
    //       closable={false}
    //       width={1250}
    //       className="drawer-bg-lightblue"
    //       visible={addLink}
    //     >
    //       <DrawerHeader
    //         title={isInspection ? 'Create Inspection Schedule' : 'Create PPM Schedule'}
    //         imagePath={predictiveMaintenance}
    //         closeDrawer={onViewReset}
    //       />
    //       {!isInspection ? <AddPreventiveMaintenance setAddLink={setAddLink} /> : <AddInspectionSchedule setAddLink={setAddLink} />}

    //     </Drawer>
    //     <Drawer
    //       title=""
    //       closable={false}
    //       width={1250}
    //       className="drawer-bg-lightblue"
    //       visible={editLink}
    //     >
    //       <DrawerHeader
    //         title={isInspection ? 'Update Inspection Schedule' : 'Update PPM Schedule'}
    //         imagePath={predictiveMaintenance}
    //         closeDrawer={onEditReset}
    //       />
    //       {!isInspection ? <AddPreventiveMaintenance setEditLink={setEditLink} editId={viewId} /> : <AddInspectionSchedule setEditLink={setEditLink} editId={viewId} />}
    //     </Drawer>
    //     <Modal
    //       size={(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data) ? 'sm' : 'lg'}
    //       className="border-radius-50px modal-dialog-centered purchase-modal"
    //       isOpen={deleteModal}
    //     >
    //       <ModalHeaderComponent
    //         title={isInspection ? 'Delete Inspection Scheduler' : 'Delete PPM Scheduler'}
    //         imagePath={false}
    //         closeModalWindow={() => onRemoveScheduleCancel()}
    //         response={preventiveScheduleDeleteInfo}
    //       />
    //       <ModalBody className="mt-0 pt-0">
    //         {preventiveScheduleDeleteInfo && (!preventiveScheduleDeleteInfo.data && !preventiveScheduleDeleteInfo.loading && !preventiveScheduleDeleteInfo.err) && (
    //           <p className="text-center">
    //             {`Are you sure, you want to remove ${removeName} ?`}
    //           </p>
    //         )}
    //         {preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.loading && (
    //           <div className="text-center mt-3">
    //             <Loader />
    //           </div>
    //         )}
    //         {(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.err) && (
    //           <SuccessAndErrorFormat response={preventiveScheduleDeleteInfo} />
    //         )}
    //         {(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data) && (
    //           <SuccessAndErrorFormat
    //             response={preventiveScheduleDeleteInfo}
    //             successMessage={isInspection ? 'Inspection Scheduler removed successfully..' : 'PPM Scheduler removed successfully..'}
    //           />
    //         )}
    //         <div className="pull-right mt-3">
    //           {preventiveScheduleDeleteInfo && !preventiveScheduleDeleteInfo.data && (
    //             <Button
    //               size="sm"
    //               disabled={preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.loading}
    //                variant="contained"
    //               onClick={() => onRemove(removeId)}
    //             >
    //               Confirm
    //             </Button>
    //           )}
    //           {preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data && (
    //             <Button size="sm"  variant="contained" onClick={() => onRemoveScheduleCancel()}>Ok</Button>
    //           )}
    //         </div>
    //       </ModalBody>
    //     </Modal>
    //   </Col>
    // </Row>

  );
};

preventativeSchedule.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
preventativeSchedule.defaultProps = {
  type: false,
};

export default preventativeSchedule;
