/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { Tooltip } from 'antd';
import uniqBy from 'lodash/unionBy';
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
} from 'reactstrap';
import Button from '@mui/material/Button';

import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import TrackerCheck from '@images/alarms/alarmsBlue.svg';
import { AddThemeBackgroundColor } from '../themes/theme';

// import TrackerCheck from '@images/icons/complianceCheck.svg';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { bmsAlarmsColumns } from '../commonComponents/gridColumns';

import {
  resetUpdateTenant,
} from '../adminSetup/setupService';
import {
  resetImage,
} from '../helpdesk/ticketService';
import {
  getDelete, resetDelete,
} from '../pantryManagement/pantryService';
import {
  getStatus,
} from '../survey/surveyService';
import {
  checkIsCompany,
  debounce, formatFilterData,
  getActiveTab,
  getAllCompanies,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations, getNextPreview,
  getPickingFilterData,
  getTabs,
  queryGeneratorWithUtc, truncate,
  valueCheck,
} from '../util/appUtils';
import AddAlarm from './addAlarm';
import TrackerDetail from './breakdownDetailView/breakdownDetails';
import {
  getBTConfig, getTrackerCount, getTrackerDetail,
  getTrackerExport,
  getTrackerFilters, getTrackerList, resetAddTrackerInfo,
} from './breakdownService';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
// import DataExport from './dataExport/dataExport';
import { updateHeaderData } from '../core/header/actions';
import bcSideNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const BreakdownTracker = () => {
  const limit = 10;
  const subMenu = 'BMS Alarms';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [reload, setReload] = useState(false);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [openRaised, setOpenRaised] = useState(false);

  const [statusGroups, setStatusGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [companyGroups, setCompanyGroups] = useState([]);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);
  const apiFields = customData && customData.complianceListFields;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    trackerCount, trackerInfo, trackerCountLoading,
    trackerFilters, trackerDetails, addTrackerInfo, trackerExportInfo, raisedByGroupInfo, statusGroupInfo,
  } = useSelector((state) => state.bmsAlarms);
  const { surveyStatus } = useSelector((state) => state.survey);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const listHead = 'BMS Alarms List :';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'BMS Alarms', 'code');

  const workData = trackerDetails && trackerDetails.data && trackerDetails.data.length ? trackerDetails.data[0] : false;
  const isStatusEditable = workData.state && (workData.state === 'Open' || workData.state === 'In Progress');

  const isCreatable = allowedOperations.includes(actionCodes['Add Alarm']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Alarm']) && isStatusEditable;
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Alarm']);

  const searchColumns = ['subject', 'severity', 'category_id', 'sub_category_id', 'space_id', 'equipment_id', 'company_id', 'state', 'maintenance_team_id', 'requested_by'];
  const advanceSearchColumns = ['state', 'company_id'];

  const hiddenColumns = ['id', 'maintenance_team_id', 'requested_by', 'planned_sla_end_date', 'resolution'];

  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const companyData = useMemo(() => ({ data: userCompanies }), [userCompanies]);

  const onClickClear = () => {
    dispatch(getTrackerFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenCategory(false);
    setOpenStatus(false);
    setOpenRaised(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (trackerInfo && trackerInfo.data && trackerInfo.data.length > 0 ? trackerInfo.data : [{}]), [trackerInfo.data]);
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
    if (reload) {
      setPage(0);
      setOffset(0);
      dispatch(getTrackerFilters([]));
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && trackerCount
      && trackerCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = trackerFilters && trackerFilters.customFilters
        ? queryGeneratorWithUtc(trackerFilters.customFilters)
        : '';
      dispatch(
        getTrackerExport(
          companies,
          appModels.BMSALARMS,
          trackerCount.length,
          offsetValue,
          apiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        company_id: true,
        state: true,
        generated_on: true,
        subject: true,
        severity: true,
        type_category: true,
        equipment_id: true,
        space_id: true,
        category_id: true,
        sub_category_id: true,
        maintenance_team_id: false,
        requested_by: false,
        planned_sla_end_date: false,
        resolution: false,
      });
    }
  }, [visibleColumns]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerCount(companies, appModels.BMSALARMS, customFiltersList, false, globalFilter));
    }
  }, [trackerFilters.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getTrackerList(companies, appModels.BMSALARMS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, trackerFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getStatus(companies, appModels.BREAKDOWNSTATE));
    }
  }, [userInfo]);

  useEffect(() => {
    if (trackerInfo && trackerInfo.loading) {
      setOpenCategory(false);
      setOpenStatus(false);
      setOpenRaised(false);
    }
  }, [trackerInfo]);

  useEffect(() => {
    if (openCategory) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenRaised(false);
    }
  }, [openCategory]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenCategory(false);
      setOpenRaised(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openRaised) {
      setKeyword(' ');
      setOpenCategory(false);
      setOpenStatus(false);
    }
  }, [openRaised]);

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data) {
      dispatch(getTrackerDetail(viewId, appModels.BMSALARMS));
    }
  }, [updatePartsOrderInfo]);

  useEffect(() => {
    if ((addTrackerInfo && addTrackerInfo.data) || (deleteInfo && deleteInfo.data)) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerCount(companies, appModels.BMSALARMS, customFiltersList));
      dispatch(getTrackerList(companies, appModels.BMSALARMS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addTrackerInfo, deleteInfo]);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) || (updatePartsOrderInfo && updatePartsOrderInfo.data)) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerList(companies, appModels.BMSALARMS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [tenantUpdateInfo, updatePartsOrderInfo]);

  useEffect(() => {
    if (trackerFilters && trackerFilters.customFilters) {
      setCustomFilters(trackerFilters.customFilters);
    }
  }, [trackerFilters]);

  useEffect(() => {
    if (tenantUpdateInfo && tenantUpdateInfo.data) {
      dispatch(getTrackerDetail(viewId, appModels.BMSALARMS));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTrackerDetail(viewId, appModels.BMSALARMS));
    }
  }, [viewId]);

  /* useEffect(() => {
    if (addTrackerInfo && addTrackerInfo.data && addTrackerInfo.data.length && !viewId) {
      dispatch(getTrackerDetail(addTrackerInfo.data[0], appModels.BREAKDOWNTRACKER));
    }
  }, [addTrackerInfo]); */

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  const totalDataCount = trackerCount && trackerCount.length && columnFields.length ? trackerCount.length : 0;

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'BMS Alarms',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, bcSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'BMS Alarms',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'BMS Alarms',
        moduleName: 'BMS Alarms',
        menuName: '',
        link: '/bms-alarms',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

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
    const oldCustomFilters = trackerFilters && trackerFilters.customFilters
      ? trackerFilters.customFilters
      : [];
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
    dispatch(getTrackerFilters(customFilters1));
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
      const oldCustomFilters = trackerFilters && trackerFilters.customFilters
        ? trackerFilters.customFilters
        : [];
      const filterValues = {
        states:
          trackerFilters && trackerFilters.states ? trackerFilters.states : [],
        customFilters: [
          ...(oldCustomFilters.length > 0
            ? oldCustomFilters.filter(
              (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
            )
            : ''),
          ...filters,
        ],
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
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getTrackerFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = trackerFilters && trackerFilters.customFilters
        ? trackerFilters.customFilters
        : [];
      const filterValues = {
        states:
          trackerFilters && trackerFilters.states ? trackerFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getTrackerFilters(filterValues.customFilters));
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
    dispatch(getTrackerFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const onViewReset = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddTrackerInfo());
    showAddModal(false);
  };

  const addTrackerWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    dispatch(resetAddTrackerInfo());
    dispatch(resetImage());
    dispatch(resetUpdateTenant());
    dispatch(resetImage());
    dispatch(getBTConfig(userInfo.data.company.id, appModels.BMSCONFIG));
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    showEditModal(false);
  };

  const onAddReset = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    dispatch(resetUpdateTenant());
    dispatch(resetAddTrackerInfo());
    showAddModal(false);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.BMSALARMS));
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

  const stateValuesList = (trackerFilters && trackerFilters.customFilters && trackerFilters.customFilters.length > 0)
    ? trackerFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const companyValuesList = (trackerFilters && trackerFilters.customFilters && trackerFilters.customFilters.length > 0)
    ? trackerFilters.customFilters.filter((item) => (item.type === 'inarray') && (item.key === 'company_id')) : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');
  const companyValues = getColumnArrayById(companyValuesList, 'value');

  const dateFilters = (trackerFilters && trackerFilters.customFilters && trackerFilters.customFilters.length > 0) ? trackerFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (trackerInfo && trackerInfo.loading) || (trackerCountLoading);
  const trackerData = trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) ? trackerDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={trackerData.subject} placement="right">
      {truncate(trackerData.subject, '50')}
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
      setPage(1);
      const customFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = [...new Map(customFiltersList.map((m) => [m.key, m])).values()];
      dispatch(getTrackerFilters(uniquecustomFilter));
      setValueArray(array);
      removeData(`data-${columnValue.id}`, columnValue);
    }
  }; */

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
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getTrackerFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    state: setOpenStatus,
    company_id: setOpenCompany,
  };

  const getStateLabel = (staten) => {
    let status = staten;
    if (surveyStatus && surveyStatus.data && surveyStatus.data.length && surveyStatus.data.length > 0) {
      {
        surveyStatus.data.map((st) => (
          (st.name === staten) && (

            status = (
              <Badge
                // color={st.color_code}
                style={{
                  background: `${'#'}${(st.color_code) !== '' ? st.color_code : '374152'} `,
                }}
                className="badge-text no-border-radius"
                pill
              >
                {st.name}
              </Badge>
            )
          )
        ));
      }
    }
    return status;
  };

  /* const stateCurrent = trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) && trackerDetails.data[0].state ? trackerDetails.data[0].state : false;
  const isEditState = stateCurrent !== 'Closed'; */

  function numToFloat(num) {
    let result = '-';
    if (num) {
      result = num;
    }
    return parseFloat(result).toFixed(2);
  }
  useEffect(() => {
    if (openCompany && userCompanies) {
      const pickingGroup = getPickingFilterData(userCompanies, 'company_id');
      setCompanyGroups(pickingGroup);
    }
  }, [openCompany, userCompanies]);

  const tableColumns = bmsAlarmsColumns(isDeleteable, onClickRemoveData);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'company_id',
      'state',
      'generated_on',
      'subject',
      'severity',
      'type_category',
      'equipment_id',
      'space_id',
      'category_id',
      'sub_category_id',
      'maintenance_team_id',
      'requested_by',
      'planned_sla_end_date',
      'resolution',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = trackerFilters && trackerFilters.customFilters
      ? trackerFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
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
        dispatch(getTrackerFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTrackerFilters(customFilters));
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
    [trackerFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(trackerInfo && trackerInfo.data && trackerInfo.data.length && trackerInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(trackerInfo && trackerInfo.data && trackerInfo.data.length && trackerInfo.data[trackerInfo.data.length - 1].id);
    }
  }, [trackerInfo]);

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

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          trackerInfo && trackerInfo.data && trackerInfo.data.length
            ? trackerInfo.data
            : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="BMS Alarms"
        exportFileName="BMS Alarms"
        listCount={totalDataCount}
        exportInfo={trackerExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(
            actionCodes['Add Alarm'],
          ),
          text: 'Add',
          func: () => { dispatch(getBTConfig(userInfo.data.company.id, appModels.BMSCONFIG)); showAddModal(true); },
        }}
        setRows={setRows}
        pdfStaticColumnWidth={{
          location_ids: { cellWidth: 180 },
        }}
        rows={rows}
        isModuleDisplayName
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={trackerInfo && trackerInfo.loading}
        err={trackerInfo && trackerInfo.err}
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
              ((cf.type === 'id' || cf.type === 'text') && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                      )}
                      {(cf.type === 'id') && (
                        <span>
                          {cf.label}
                          {'  '}
                          :
                          {' '}
                          {decodeURIComponent(cf.value)}
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
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0 && !trackerDetails.loading)
            ? drawertitleName : 'BMS Alarm'}
          imagePath={TrackerCheck}
          isEditable={(isEditable && (trackerDetails && !trackerDetails.loading))}
          onClose={() => onViewReset()}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', trackerInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', trackerInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', trackerInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', trackerInfo));
          }}
        />
        <TrackerDetail
          offset={offset}
          editId={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              ? trackerDetails.data[0].id
              : false
          }
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create BMS Alarm"
          imagePath={TrackerCheck}
          onClose={onViewReset}
        />
        <AddAlarm
          isShow={addModal}
          closeModal={() => { onAddReset(); }}
          afterReset={() => { onAddReset(); }}
          addModal
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >

        <DrawerHeader
          headerName="Update BMS Alarm"
          imagePath={TrackerCheck}
          onClose={closeEditModalWindow}
        />
        <AddAlarm isShow={editModal} editId={editId} closeModal={closeEditModalWindow} />
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete BMS Alarm"
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
              successMessage="BMS Alarm removed successfully.."
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
  );
};

export default BreakdownTracker;
