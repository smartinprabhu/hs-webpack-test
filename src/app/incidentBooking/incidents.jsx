/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { Tooltip } from 'antd';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination, useSortBy, useTable,
} from 'react-table';
import {
  Badge,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

// import TrackerCheck from '@images/icons/complianceCheck.svg';
import TrackerCheck from '@images/sideNavImages/incident_black.svg';
import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import { HxIncidentColumns } from '../commonComponents/gridColumns';
import DialogHeader from '../commonComponents/dialogHeader';
import { updateHeaderData } from '../core/header/actions';

import {
  setInitialValues,
} from '../purchase/purchaseService';

import DrawerHeader from '../commonComponents/drawerHeader';
import {
  resetImage,
} from '../helpdesk/ticketService';
import {
  getActiveTab,
  getAllCompanies, getArrayFromValuesByItem, getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations, getPagesCountV2,
  getTabs,
  queryGeneratorV1,
  queryGeneratorWithUtc, truncate, debounce, getNewDataGridFilterArray, getNextPreview,
} from '../util/appUtils';
import { IncidentNewModule } from '../util/field';
import {
  filterStringGenerator,
} from './utils/utils';
import AddIncident from './addIncident';
import {
  getHxIncidentConfig,
  getIncidentDetail,
  getIncidentsCount,
  getIncidentsExport,
  getIncidentsFilters, getIncidentsList, resetAddIncidentInfo,
  resetUpdateIncidentInfo,
} from './ctService';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import IncidentDetail from './incidentDetails/incidentDetails';
import incidentNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Incidents = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const subMenu = 'Incident';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);

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

  const [statusGroups, setStatusGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [questionValuesView, setQuestionsView] = useState([]);
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [isSave, setSave] = useState(false);
  const [isCancel, setCancel] = useState(false);

  const [actionModal, setActionModal] = useState(false);

  const { apiFields } = IncidentNewModule;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    incidentHxCount, incidentHxInfo, incidentHxCountLoading,
    incidentHxFilters, incidentDetailsInfo, updateIncidentNoInfo, hxIncidentConfig, addIncidentInfo, updateIncidentInfo, incidentHxExportInfo,
  } = useSelector((state) => state.hxIncident);
  const { pinEnableData } = useSelector((state) => state.auth);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const listHead = 'Incidents List :';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'SLA-KPI Audit', 'code');

  const isCreatable = true;// allowedOperations.includes(actionCodes['Add Breakdown Tracker']);
  const isEditable = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length && (incidentDetailsInfo.data[0].state === 'Reported' || incidentDetailsInfo.data[0].state === 'Work in Progress' || incidentDetailsInfo.data[0].state === 'Acknowledged');// allowedOperations.includes(actionCodes['Edit Breakdown Tracker']);
  // const isDeleteable = allowedOperations.includes(actionCodes['Delete Breakdown Tracker']);

  const { searchColumns } = IncidentNewModule;
  const { advanceSearchColumns } = IncidentNewModule;

  const { hiddenColumns } = IncidentNewModule;

  const onClickClear = () => {
    dispatch(getIncidentsFilters([]));
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
  const data = useMemo(() => (incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length > 0 ? incidentHxInfo.data : [{}]), [incidentHxInfo.data]);
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
    if (incidentHxInfo && incidentHxInfo.loading) {
      setOpenStatus(false);
    }
  }, [incidentHxInfo]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        reference: true,
        name: true,
        state: true,
        category_id: true,
        severity_id: true,
        priority_id: true,
        probability_id: true,
        incident_type_id: true,
        incident_on: true,
        target_closure_date: true,
        maintenance_team_id: true,
        company_id: true,
        assigned_id: false,
        corrective_action: false,
        sub_category_id: false,
        reported_by_id: false,
        reported_on: false,
        acknowledged_by_id: false,
        acknowledged_on: false,
        resolved_by_id: false,
        resolved_on: false,
        validated_by_id: false,
        validated_on: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (incidentHxFilters && incidentHxFilters.customFilters) {
      setCustomFilters(incidentHxFilters.customFilters);
    }
  }, [incidentHxFilters]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
    }
  }, [openStatus]);

  useEffect(() => {
    if (
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  useEffect(() => {
    if ((addIncidentInfo && addIncidentInfo.data) || (updateIncidentInfo && updateIncidentInfo.data)) {
      const customFiltersList = incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, 'incident_on', userInfo.data) : '';
      if (addIncidentInfo && addIncidentInfo.data) {
        dispatch(getIncidentsCount(companies, appModels.HXINCIDENT, false, customFiltersList, globalFilter));
      }
      dispatch(getIncidentsList(companies, appModels.HXINCIDENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addIncidentInfo, updateIncidentInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getIncidentsFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (incidentHxCount && incidentHxCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = incidentHxFilters && incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, 'incident_on', userInfo.data) : '';
      dispatch(getIncidentsExport(companies, appModels.HXINCIDENT, incidentHxCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [startExport]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, 'incident_on', userInfo.data) : '';
      dispatch(getIncidentsCount(companies, appModels.HXINCIDENT, false, customFiltersList, globalFilter));
    }
  }, [userInfo, incidentHxFilters.customFilters]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, 'incident_on', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getIncidentsList(companies, appModels.HXINCIDENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, incidentHxFilters.customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getIncidentDetail(viewId, appModels.HXINCIDENT));
      dispatch(getHxIncidentConfig(companies, appModels.INCIDENTCONFIG));
      dispatch(resetUpdateIncidentInfo());
    }
  }, [viewId]);

  useEffect(() => {
    if (addIncidentInfo && addIncidentInfo.data && addIncidentInfo.data.length && !viewId) {
      dispatch(getIncidentDetail(addIncidentInfo.data[0], appModels.HXINCIDENT));
    }
  }, [addIncidentInfo]);

  useEffect(() => {
    if (updateIncidentInfo && updateIncidentInfo.data && viewId) {
      dispatch(getIncidentDetail(viewId, appModels.HXINCIDENT));
    }
  }, [updateIncidentInfo]);

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  useEffect(() => {
    if (uuid) {
      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

  const totalDataCount = incidentHxCount && incidentHxCount.length && columnFields.length ? incidentHxCount.length : 0;

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
      const datas = incidentHxInfo && incidentHxInfo.data ? incidentHxInfo.data : [];
      const newArr = [...getColumnArrayById(datas, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const datas = incidentHxInfo && incidentHxInfo.data ? incidentHxInfo.data : [];
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
      const customFiltersList = [...incidentHxFilters.customFilters, ...filters];

      dispatch(getIncidentsFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = incidentHxFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getIncidentsFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters ? incidentHxFilters.customFilters : [];
      setCustomFiltersList(filters);
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getIncidentsFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'));
      const filterValues = {
        customFilters: customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'),
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
      );
      dispatch(getIncidentsFilters(filterValues));
    }
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
      const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
        ? incidentHxFilters.customFilters
        : [];
      const filterValues = {
        states:
          incidentHxFilters && incidentHxFilters.states ? incidentHxFilters.states : [],
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
      dispatch(getIncidentsFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
        ? incidentHxFilters.customFilters
        : [];
      const filterValues = {
        states:
          incidentHxFilters && incidentHxFilters.states ? incidentHxFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getIncidentsFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const getPendingQtns = useMemo(() => (questionValuesView.filter((item) => item.isNew === 'yes')), [questionValuesView]);

  function isValidateUser() {
    let res = false;
    const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.validator_role_id && configData.validator_role_id.id && userRoleId === configData.validator_role_id.id) {
      res = true;
    }
    return res;
  }

  const onViewReset = () => {
    const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
    let isManagable = inspDeata && (inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged' || inspDeata.state === 'Work in Progress');
    if (inspDeata.state === 'Resolved') {
      isManagable = inspDeata && inspDeata.state === 'Resolved' && isValidateUser();
    }
    if (isManagable && getPendingQtns && getPendingQtns.length > 0) {
      setActionModal(true);
    } else {
      if (document.getElementById('hxIncidentform')) {
        document.getElementById('hxIncidentform').reset();
      }
      setViewId(false);
      dispatch(resetUpdateIncidentInfo());
      setViewModal(false);
      dispatch(resetAddIncidentInfo());
      showAddModal(false);
    }
  };

  const addTrackerWindow = () => {
    if (document.getElementById('hxIncidentform')) {
      document.getElementById('hxIncidentform').reset();
    }
    dispatch(resetAddIncidentInfo());
    dispatch(resetImage());
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('hxIncidentform')) {
      document.getElementById('hxIncidentform').reset();
    }
    showEditModal(false);
    dispatch(resetUpdateIncidentInfo());
  };

  const onAddReset = () => {
    if (document.getElementById('hxIncidentform')) {
      document.getElementById('hxIncidentform').reset();
    }
    dispatch(resetAddIncidentInfo());
    showAddModal(false);
    showEditModal(false);
  };

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

  const stateValuesList = (incidentHxFilters && incidentHxFilters.customFilters && incidentHxFilters.customFilters.length > 0)
    ? incidentHxFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (incidentHxFilters && incidentHxFilters.customFilters && incidentHxFilters.customFilters.length > 0) ? incidentHxFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (incidentHxInfo && incidentHxInfo.loading) || (incidentHxCountLoading);
  const trackerData = incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0) ? incidentDetailsInfo.data[0] : '';

  const drawertitleName = (
    <Tooltip title={trackerData.reference} placement="right">
      {truncate(trackerData.reference, '50')}
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

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter(
      (item) => item.value !== cfValue,
    );
    dispatch(getIncidentsFilters(customFiltersList));
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
      const mergeFiltersList = [...incidentHxFilters.customFilters, ...filterArray];
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getIncidentsFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

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

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'HX Incident Report',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, incidentNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Incident',
    );
  }
  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length && incidentHxInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length && incidentHxInfo.data[incidentHxInfo.data.length - 1].id);
    }
  }, [incidentHxInfo]);

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
      'reference',
      'name',
      'state',
      'category_id',
      'severity_id',
      'priority_id',
      'probability_id',
      'incident_type_id',
      'maintenance_team_id',
      'company_id',
      'assigned_id',
      'sub_category_id',
      'reported_by_id',
      'corrective_action',
      'acknowledged_by_id',
      'resolved_by_id',
      'validated_by_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
      ? incidentHxFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
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
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        uniqueCustomFilter = getNewDataGridFilterArray(HxIncidentColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getIncidentsFilters({ customFilters }));
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getIncidentsFilters({ customFilters: CustomFilters }));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [incidentHxFilters],
  );

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'HX Incident Report',
        moduleName: 'HX Incident Report',
        menuName: 'Incident',
        link: '/incident-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getIncidentsFilters([]),
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        /* sx={{
         height: '90%',
       }} */
        tableData={
          incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length
            ? incidentHxInfo.data
            : []
        }
        columns={HxIncidentColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Incidents List"
        exportFileName="Hx_Incidents"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={{ err: incidentHxExportInfo.err, loading: incidentHxExportInfo.loading, data: incidentHxExportInfo.data ? incidentHxExportInfo.data : false }}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterStringGenerator(incidentHxFilters)}
        onFilterChanges={debouncedOnFilterChange}
        loading={incidentHxInfo && incidentHxInfo.loading}
        err={incidentHxInfo && incidentHxInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        placeholderText="Search Reference, Subject ..."
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
          sx: { width: '90%' },
        }}
        anchor="right"
        open={viewModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 && !incidentDetailsInfo.loading)
            ? drawertitleName : 'Incident'}
          imagePath={TrackerCheck}
          isEditable={isEditable}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0) ? incidentDetailsInfo.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetUpdateIncidentInfo());
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', incidentHxInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', incidentHxInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', incidentHxInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', incidentHxInfo));
          }}
        />
        <IncidentDetail setCancel={setCancel} isCancel={isCancel} setSave={setSave} isSave={isSave} setQuestionsView={setQuestionsView} questionValuesView={questionValuesView} offset={offset} editId={editId} setEditId={setEditId} onViewReset={onViewReset} />
        <Dialog maxWidth="md" open={actionModal}>
          <DialogHeader title="Are you sure you want to close?" hideClose />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: '600px',
                  height: '100%',
                  backgroundColor: '#F6F8FA',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                  fontFamily: 'Suisse Intl',
                }}
              >
                <Row className="justify-content-center">
                  <p className="text-danger font-weight-800 m-0" style={{ whiteSpace: 'nowrap' }}>
                    You have unsaved changes.
                  </p>
                </Row>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mr-3 ml-3">
            {updateIncidentNoInfo && !updateIncidentNoInfo.loading && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  className="reset-btn float-right mr-2"
                  onClick={() => { setCancel(Math.random()); setActionModal(false); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="submit-btn float-right mr-2"
                  onClick={() => { setSave(Math.random()); setActionModal(false); }}
                >
                  Save
                </Button>

              </>
            )}
          </DialogActions>
        </Dialog>
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Incident"
          imagePath={TrackerCheck}
          onClose={onViewReset}
        />
        <AddIncident
          editId={false}
          closeModal={() => { onAddReset(); }}
          afterReset={() => { onAddReset(); }}
          isShow={addModal}
          addModal
          setViewId={setViewId}
          setViewModal={setViewModal}
        />
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
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Box>
    // <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
    //   <Col sm="12" md="12" lg="12" xs="12">
    //     <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
    //       <Card className="p-2 mb-2 h-100 bg-lightblue">
    //         <CardBody className="bg-color-white p-1 m-0">
    //           <Row className="p-2 itAsset-table-title">
    //             <Col md="10" xs="12" sm="10" lg="10">
    //               <span className="p-0 mr-2 font-weight-800 font-medium">
    //                 {listHead}
    //                 {' '}
    //                 {columnHide && columnHide.length && totalDataCount}
    //               </span>
    //               {columnHide && columnHide.length ? (
    //                 <div className="content-inline">
    //                   {customFilters && customFilters.map((cf) => (
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
    //                             {'  '}:
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
    //                   ))}
    //                   {customFilters && customFilters.length ? (
    //                     <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
    //                       Clear
    //                     </span>
    //                   ) : ''}
    //                 </div>
    //               ) : ''}
    //             </Col>
    //             <Col md="2" xs="12" sm="2" lg="2">
    //               <div className="float-right">
    //                 <Refresh
    //                   setReload={setReload}
    //                   loadingTrue={loading}
    //                 />
    //                 <ListDateFilters
    //                   dateFilters={dateFilters}
    //                   customFilters={customFilters}
    //                   handleCustomFilterClose={handleCustomFilterClose}
    //                   setCustomVariable={setCustomVariable}
    //                   customVariable={customVariable}
    //                   onClickRadioButton={handleRadioboxChange}
    //                   onChangeCustomDate={handleCustomDateChange}
    //                   idNameFilter="slaAuditDate"
    //                   classNameFilter="drawerPopover popoverDate"
    //                 />
    //                 {isCreatable && (
    //                   <CreateList name="Create Incident" showCreateModal={addTrackerWindow} />
    //                 )}
    //                 <ExportList idNameFilter="hxIncidentExport" response={(incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length)} />
    //                 <DynamicColumns
    //                   setColumns={setColumns}
    //                   columnFields={columnFields}
    //                   allColumns={allColumns}
    //                   setColumnHide={setColumnHide}
    //                 />
    //               </div>
    //               {incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length && (
    //               <Popover target="hxIncidentExport" className="drawerPopover export-popover" placement="bottom" isOpen={filterInitailValues.download}>
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
    //               )}
    //             </Col>
    //           </Row>
    //           {(incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length > 0) && (
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
    //                   setViewId={setViewId}
    //                   setViewModal={setViewModal}
    //                   tableData={incidentHxInfo}
    //                   stateLabelFunction={getSlaStateLabel}
    //                   actions={{
    //                     /* edit: {
    //                       showEdit: true,
    //                       editFunc: editAsset,
    //                     }, */
    //                     /* delete: {
    //                       showDelete: isDeleteable,
    //                       deleteFunc: onClickRemoveData,
    //                     }, */
    //                   }}
    //                   tableProps={{
    //                     page,
    //                     prepareRow,
    //                     getTableBodyProps,
    //                     headerGroups,
    //                   }}
    //                 />
    //               </Table>
    //               {openStatus && (
    //                 <StaticCheckboxFilter
    //                   selectedValues={stateValues}
    //                   dataGroup={statusGroups}
    //                   onCheckboxChange={handleStatusCheckboxChange}
    //                   target="data-state"
    //                   title="Status"
    //                   openPopover={openStatus}
    //                   toggleClose={() => setOpenStatus(false)}
    //                   setDataGroup={setStatusGroups}
    //                   keyword={keyword}
    //                   data={customData && customData.stateTypes ? customData.stateTypes : []}
    //                 />
    //               )}
    //               {columnHide && columnHide.length ? (
    //                 <TableListFormat
    //                   userResponse={userInfo}
    //                   listResponse={incidentHxInfo}
    //                   countLoad={incidentHxCountLoading}
    //                 />
    //               ) : ''}
    //               {columnHide && !columnHide.length ? (
    //                 <div className="text-center mb-4">
    //                   Please select the Columns
    //                 </div>
    //               ) : ''}
    //             </div>
    //             {loading || pages === 0 ? (<span />) : (
    //               <div className={`${classes.root} float-right`}>
    //                 {columnHide && columnHide.length ? (<Pagination count={pages} page={currentpage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
    //               </div>
    //             )}
    //           </div>
    //         </CardBody>
    //       </Card>
    //     </Col>
    //   </Col>
    // </Row>
  );
};

Incidents.defaultProps = {
  match: false,
};

Incidents.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default Incidents;
