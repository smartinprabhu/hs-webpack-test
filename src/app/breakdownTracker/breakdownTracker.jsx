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
  useFilters, usePagination, useSortBy, useTable,
} from 'react-table';
import {
  Badge,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TrackerCheck from '@images/sideNavImages/breakdownTracker_black.svg';
import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';

import { resetUpdateTenant } from '../adminSetup/setupService';
import breakDownTrackerSideNav from './navbar/navlist.json';
import { BreakdownTrackerColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import { resetImage } from '../helpdesk/ticketService';
import { getDelete, resetDelete } from '../pantryManagement/pantryService';
import { resetReadings } from '../assets/equipmentService';
import { setInitialValues } from '../purchase/purchaseService';
import { getStatus } from '../survey/surveyService';
import { getAge } from './utils/utils';
import {
  checkIsCompany,
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  getAllCompanies,
  queryGeneratorWithUtc,
  truncate,
  truncateHTMLTags,
  getCompanyTimezoneDate,
  getNextPreview,
  formatFilterData,
  debounce,
} from '../util/appUtils';
import TrackerDetailView from './breakdownDetailView/breakdownDetails';
import {
  getBTConfig,
  getRaisedByGroups,
  getServiceCategoryGroups,
  getStatusByGroups,
  getTrackerCount,
  getTrackerDetail,
  getTrackerExport,
  getTrackerFilters,
  getTrackerList,
  resetAddTrackerInfo,
  resetCloseDuration,
} from './breakdownService';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import CreateTracker from './forms/createBreakdown';

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
  const subMenu = 'Breakdown Trackers';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(
    customData && customData.listfieldsShows ? customData.listfieldsShows : [],
  );
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

  const [categoriesGroups, setCategories] = useState([]);
  const [raisedByGroups, setRaisedBy] = useState([]);
  const [appliesGroups, setApplies] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [reload, setReload] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [companyGroups, setCompanyGroups] = useState([]);

  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [dataColumns, setDataColumns] = useState(BreakdownTrackerColumns(false));

  const { allowedCompanies } = useSelector((state) => state.setup);
  const apiFields = customData && customData.complianceListFields;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    trackerCount,
    trackerInfo,
    trackerCountLoading,
    trackerFilters,
    trackerDetails,
    addTrackerInfo,
    btConfigInfo,
    trackerExportInfo,
  } = useSelector((state) => state.breakdowntracker);
  const { surveyStatus } = useSelector((state) => state.survey);
  const { sortedValue } = useSelector((state) => state.equipment);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { deleteInfo } = useSelector((state) => state.pantry);
  const listHead = 'Breakdown Tracker List :';

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;
  const isCritical = configData && configData.criticality;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Breakdown Tracker',
    'code',
  );

  const hiddenColumns = ['id', 'create_date', 'remarks', 'is_results_in_statutory_non_compliance', 'type', 'amc_status', 'vendor_name', 'vendor_sr_number'];

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
  const data = useMemo(
    () => (trackerInfo && trackerInfo.data && trackerInfo.data.length > 0
      ? trackerInfo.data
      : [{}]),
    [trackerInfo.data],
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
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setGlobalvalue('');
      setCustomFilters([]);
      dispatch(getTrackerFilters([]));
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerCount(companies, appModels.BREAKDOWNTRACKER, customFiltersList, globalFilter));
    }
  }, [trackerFilters.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, trackerFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (trackerExportInfo && trackerExportInfo.data && trackerExportInfo.data.length > 0) {
      trackerExportInfo.data.map((data) => {
        data.incident_age = getAge(data.incident_date, data.closed_on);
        data.create_date = getCompanyTimezoneDate(data.create_date, userInfo, 'datetime');
        data.last_comments = data.last_comments ? truncateHTMLTags(data.last_comments) : '';
        data.is_results_in_statutory_non_compliance = data.is_results_in_statutory_non_compliance ? 'Yes' : 'No';
        data.is_service_impacted = data.is_service_impacted ? 'Yes' : 'No';
        data.state_id = data.is_on_hold_requested ? 'On-Hold Requested' : data.state_id;
        data.is_on_hold_requested = data.is_on_hold_requested ? 'Yes' : 'No';
      });
    }
  }, [trackerExportInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getStatus(companies, appModels.BREAKDOWNSTATE));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBTConfig(userInfo.data.company.id, appModels.BREAKDOWNCONFIG));
    }
  }, []);

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
    if (userInfo && userInfo.data && openCategory) {
      dispatch(getServiceCategoryGroups(companies, appModels.BREAKDOWNTRACKER));
    }
  }, [userInfo, openCategory]);

  useEffect(() => {
    if (userInfo && userInfo.data && openRaised) {
      dispatch(getRaisedByGroups(companies, appModels.BREAKDOWNTRACKER));
    }
  }, [userInfo, openRaised]);

  useEffect(() => {
    if (userInfo && userInfo.data && openStatus) {
      dispatch(getStatusByGroups(companies, appModels.BREAKDOWNTRACKER));
    }
  }, [userInfo, openStatus]);

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data) {
      dispatch(getTrackerDetail(viewId, appModels.BREAKDOWNTRACKER));
    }
  }, [updatePartsOrderInfo]);

  useEffect(() => {
    if ((addTrackerInfo && addTrackerInfo.data) || (deleteInfo && deleteInfo.data)) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerCount(companies, appModels.BREAKDOWNTRACKER, customFiltersList, globalFilter));
      dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addTrackerInfo, deleteInfo]);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) || (updatePartsOrderInfo && updatePartsOrderInfo.data)) {
      const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [tenantUpdateInfo, updatePartsOrderInfo]);

  useEffect(() => {
    if (trackerFilters && trackerFilters.customFilters) {
      setCustomFilters(trackerFilters.customFilters);
    }
  }, [trackerFilters]);

  useEffect(() => {
    if (tenantUpdateInfo && tenantUpdateInfo.data) {
      dispatch(getTrackerDetail(viewId, appModels.BREAKDOWNTRACKER));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTrackerDetail(viewId, appModels.BREAKDOWNTRACKER));
    }
  }, [viewId]);

  useEffect(() => {
    if (
      addTrackerInfo
      && addTrackerInfo.data
      && addTrackerInfo.data.length
      && !viewId
    ) {
      dispatch(
        getTrackerDetail(addTrackerInfo.data[0], appModels.BREAKDOWNTRACKER),
      );
    }
  }, [addTrackerInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && trackerCount && trackerCount.length && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = trackerFilters && trackerFilters.customFilters
        ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(
        getTrackerExport(
          companies,
          appModels.BREAKDOWNTRACKER,
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
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  const totalDataCount = trackerCount && trackerCount.length && columnFields.length
    ? trackerCount.length
    : 0;

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
      const datas = trackerInfo && trackerInfo.data ? trackerInfo.data : [];
      const newArr = [...getColumnArrayById(datas, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const datas = trackerInfo && trackerInfo.data ? trackerInfo.data : [];
      const ids = getColumnArrayById(datas, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCategoryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'service_category_id',
          title: 'Service Category',
          value: parseInt(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTrackerFilters(customFiltersList));
      removeData('data-service_category_id');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => parseInt(item.value) !== parseInt(value),
      );
      dispatch(getTrackerFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleRaisedChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'raised_by_id',
          title: 'Raised BY',
          value: parseInt(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTrackerFilters(customFiltersList));
      removeData('data-raised_by_id');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => parseInt(item.value) !== parseInt(value),
      );
      dispatch(getTrackerFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'state_id',
          title: 'Status',
          value: parseInt(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];

      dispatch(getTrackerFilters(customFiltersList));
      removeData('data-state_id');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => parseInt(item.value) !== parseInt(value),
      );
      dispatch(getTrackerFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCompanyCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'company_id',
          title: 'Company',
          value: parseInt(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getTrackerFilters(customFiltersList));
      removeData('data-company_id');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => parseInt(item.value) !== parseInt(value),
      );
      dispatch(getTrackerFilters(customFiltersList));
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
    const customFiltersList = customFilters.filter(
      (item) => item.value !== cfValue,
    );
    dispatch(getTrackerFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddTrackerInfo());
    dispatch(resetReadings());
    showAddModal(false);
    dispatch(resetCloseDuration());
  };

  const addTrackerWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    dispatch(resetAddTrackerInfo());
    dispatch(resetImage());
    dispatch(resetUpdateTenant());
    dispatch(resetImage());
    //  dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    showEditModal(false);
    dispatch(resetCloseDuration());
  };

  const onAddReset = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    dispatch(resetAddTrackerInfo());
    dispatch(resetCloseDuration());
    showAddModal(false);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.BREAKDOWNTRACKER));
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

  const stateValuesList = trackerFilters
    && trackerFilters.customFilters
    && trackerFilters.customFilters.length > 0
    ? trackerFilters.customFilters.filter((item) => item.type === 'inarray')
    : [];
  const companyValuesList = trackerFilters
    && trackerFilters.customFilters
    && trackerFilters.customFilters.length > 0
    ? trackerFilters.customFilters.filter(
      (item) => item.type === 'inarray' && item.key === 'company_id',
    )
    : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');
  const companyValues = getColumnArrayById(companyValuesList, 'value');

  const dateFilters = trackerFilters
    && trackerFilters.customFilters
    && trackerFilters.customFilters.length > 0
    ? trackerFilters.customFilters
    : [];
  const loading = (userInfo && userInfo.loading)
    || (trackerInfo && trackerInfo.loading)
    || trackerCountLoading;
  const trackerData = trackerDetails && trackerDetails.data && trackerDetails.data.length > 0
    ? trackerDetails.data[0]
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
      setPage(0);
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
    service_category_id: setOpenCategory,
    raised_by_id: setOpenRaised,
    state_id: setOpenStatus,
    company_id: setOpenCompany,
  };

  const getStateLabel = (staten) => {
    let status = staten;
    if (
      surveyStatus
      && surveyStatus.data
      && surveyStatus.data.length
      && surveyStatus.data.length > 0
    ) {
      {
        surveyStatus.data.map(
          (st) => st.name === staten
            && (status = (
              <Badge
                // color={st.color_code}
                style={{
                  background: `${'#'}${st.color_code !== '' ? st.color_code : '374152'
                  } `,
                }}
                className="badge-text no-border-radius"
                pill
              >
                {st.name}
              </Badge>
            )),
        );
      }
    }
    return status;
  };

  const stateCurrent = trackerDetails
    && trackerDetails.data
    && trackerDetails.data.length > 0
    && trackerDetails.data[0].state_id
    && trackerDetails.data[0].state_id.name
    ? trackerDetails.data[0].state_id.name
    : false;
  const isEditState = stateCurrent !== 'Closed';

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns(isCritical ? {
        _check_: true,
        name: true,
        title: true,
        service_category_id: true,
        incident_date: true,
        state_id: true,
        action_taken: true,
        raised_by_id: true,
        space_id: true,
        equipment_id: true,
        attended_on: true,
        closed_on: true,
        create_date: false,
        ciriticality: true,
        priority: false,
        is_results_in_statutory_non_compliance: false,
        is_service_impacted: true,
        incident_age: true,
        expexted_closure_date: true,
        description_of_breakdown: true,
        last_comments: true,
        remarks: true,
        type: false,
        amc_status: false,
        vendor_name: false,
        complaint_no: true,
        vendor_sr_number: false,
        company_id: true,
      } : {
        _check_: true,
        name: true,
        title: true,
        service_category_id: true,
        incident_date: true,
        state_id: true,
        action_taken: true,
        raised_by_id: true,
        space_id: true,
        equipment_id: true,
        attended_on: true,
        closed_on: true,
        create_date: false,
        priority: false,
        is_results_in_statutory_non_compliance: false,
        is_service_impacted: true,
        incident_age: true,
        expexted_closure_date: true,
        description_of_breakdown: true,
        last_comments: true,
        remarks: true,
        type: false,
        amc_status: false,
        vendor_name: false,
        complaint_no: true,
        vendor_sr_number: false,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      btConfigInfo
      && btConfigInfo.data
    ) {
      setVisibleColumns(isCritical ? {
        _check_: true,
        name: true,
        title: true,
        service_category_id: true,
        incident_date: true,
        state_id: true,
        action_taken: true,
        raised_by_id: true,
        space_id: true,
        equipment_id: true,
        attended_on: true,
        closed_on: true,
        create_date: false,
        ciriticality: true,
        priority: false,
        is_results_in_statutory_non_compliance: false,
        is_on_hold_requested: false,
        is_service_impacted: true,
        incident_age: true,
        expexted_closure_date: true,
        description_of_breakdown: true,
        last_comments: true,
        remarks: true,
        type: false,
        amc_status: false,
        vendor_name: false,
        complaint_no: true,
        vendor_sr_number: false,
        company_id: true,
      } : {
        _check_: true,
        name: true,
        title: true,
        service_category_id: true,
        incident_date: true,
        state_id: true,
        action_taken: true,
        raised_by_id: true,
        space_id: true,
        equipment_id: true,
        attended_on: true,
        closed_on: true,
        create_date: false,
        priority: false,
        is_results_in_statutory_non_compliance: false,
        is_on_hold_requested: false,
        is_service_impacted: true,
        incident_age: true,
        expexted_closure_date: true,
        description_of_breakdown: true,
        last_comments: true,
        remarks: true,
        type: false,
        amc_status: false,
        vendor_name: false,
        complaint_no: true,
        vendor_sr_number: false,
        company_id: true,
      });
    }
  }, [btConfigInfo]);

  useEffect(() => {
    if (
      btConfigInfo
      && btConfigInfo.data
    ) {
      if (isCritical) {
        setDataColumns(BreakdownTrackerColumns(isCritical));
      } else {
        setDataColumns(BreakdownTrackerColumns(false));
      }
    } else {
      setDataColumns(BreakdownTrackerColumns(false));
    }
  }, [btConfigInfo]);

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
    setGlobalvalue('');
    let fields = [
      'name',
      'title',
      'service_category_id',
      'incident_date',
      'state_id',
      'action_taken',
      'raised_by_id',
      'space_id',
      'equipment_id',
      'priority',
      'attended_on',
      'closed_on',
      'is_results_in_statutory_non_compliance',
      'is_service_impacted',
      'incident_age',
      'remarks',
      'type',
      'amc_status',
      'vendor_name',
      'complaint_no',
      'vendor_sr_number',
      'company_id',
    ];
    fields = isCritical ? fields.concat(['ciriticality']) : fields;
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';
    query = isCritical ? `${query}"|",` : query;

    const oldCustomFilters = trackerFilters && trackerFilters.customFilters
      ? trackerFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
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
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = dataColumns.find((column) => column.field === dataItem.field);
          dataItem.operator = dataItem.field === 'state_id' && dataItem.value === 'On-Hold Requested' ? 'boolean' : dataItem.operator;
          dataItem.field = dataItem.field === 'state_id' && dataItem.value === 'On-Hold Requested' ? 'is_on_hold_requested' : dataItem.field;
          dataItem.value = dataItem?.value ? (dataItem.value === 'On-Hold Requested' ? true : dataItem.value) : '';
          dataItem.header = label?.headerName;
        });
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const isStateData = uniqueCustomFilter.filter((item) => item.field === 'state_id');
        const isState = isStateData && isStateData.length > 0;
        if (isState) {
          const noReq = [{
            field: 'is_on_hold_requested', operator: 'boolean', id: 8093, value: false, header: 'On Hold Requested',
          }];
          uniqueCustomFilter = [...noReq, ...uniqueCustomFilter];
        }

        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getTrackerFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTrackerFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [trackerFilters],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Breakdown Tracker',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, breakDownTrackerSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Breakdown Trackers',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Breakdown Tracker',
        moduleName: 'Breakdown Tracker',
        menuName: 'Breakdown Trackers',
        link: '/breakdown-tracker',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      {/* <Header
        headerPath="Breakdown Tracker"
        nextPath="Breakdown Trackers"
        pathLink="/breakdown-tracker"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          trackerInfo && trackerInfo.data && trackerInfo.data.length
            ? trackerInfo.data
            : []
        }
        columns={dataColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Breakdown Trackers List"
        exportFileName="BreakdownTracker"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={{
          err: trackerExportInfo.err,
          loading: trackerExportInfo.loading,
          data: trackerExportInfo.data ? trackerExportInfo.data : false,
        }}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(
            actionCodes['Add Breakdown Tracker'],
          ),
          text: 'Add',
          func: () => { dispatch(resetCloseDuration()); showAddModal(true); },
        }}
        pdfStaticColumnWidth={{
          action_taken: { cellWidth: 150 },
          remarks: { cellWidth: 150 },
          last_comments: { cellWidth: 150 },
          description_of_breakdown: { cellWidth: 150 },
        }}
        setRows={setRows}
        rows={rows}
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
      {/* <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Breakdown Trackerrrr"
          imagePath={TrackerCheck}
          onClose={closeEditModalWindow}
        />
        <CreateTracker
          editId={editId}
          closeModal={closeEditModalWindow}
        />
      </Drawer> */}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Breakdown Tracker"
          imagePath={TrackerCheck}
          onClose={() => onViewReset()}
        />
        <CreateTracker
          closeModal={() => {
            onAddReset();
          }}
          afterReset={() => {
            onAddReset();
          }}
          addModal
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
        transitionDuration={0}
      >
        <DrawerHeader
          headerName={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              && !trackerDetails.loading
              ? drawertitleName
              : 'Breakdown Tracker'
          }
          imagePath={TrackerCheck}
          onClose={onViewReset}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', trackerInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', trackerInfo)); }}
        />
        <TrackerDetailView
          editId={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              ? trackerDetails.data[0].id
              : false
          }
        />
      </Drawer>
    </Box>
  );
};

export default BreakdownTracker;
