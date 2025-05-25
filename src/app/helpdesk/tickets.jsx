/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-danger */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';

import ticketIcon from '@images/sideNavImages/helpdesk_black.svg';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { TicketsColumns } from '../commonComponents/gridColumns';
import { setInitialValues } from '../purchase/purchaseService';
import {
  copyToClipboard,
  generateErrorMessage,
  getActiveTab,
  getAllCompanies,
  getArrayFromValuesByItem,
  getColumnArray,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getDynamicTabs,
  getHeaderTabs,
  getListOfOperations,
  getPagesCountV2,
  getTabs,
  isArrayValueExists,
  getTenentOptions,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  debounce,
  getNewDataGridFilterArray,
  getNextPreview,
} from '../util/appUtils';
import { AddThemeBackgroundColor } from '../themes/theme';
import { HelpdeskModule, IncidentModule } from '../util/field';
import filtersFields from './data/filtersFields.json';
import actionCodes from './data/helpdeskActionCodes.json';
import CreateTicketForm from './forms/createTicketForm';
import TicketDetailView from './ticketDetails/ticketDetails';
import {
  activeStepInfo,
  getCategoryGroups,
  getCheckedRows,
  getHelpdeskFilter,
  getIncidentStateGroups,
  getMaintenanceConfigurationData,
  getTenantConfiguration,
  getMaintenanceGroups,
  getPriorityGroups,
  getStateGroups,
  getTicketCount,
  getTicketDetail,
  getTicketList,
  getTicketsExport,
  onDocumentCreatesAttach,
  resetAddTicket,
  resetImage,
  resetUpdateTicket,
  updateTicket,
} from './ticketService';
import {
  convertTicketFields, filterStringGenerator,
} from './utils/utils';

import helpdeskNav from './navbar/navlist.json';

import { updateHeaderData } from '../core/header/actions';
import AiChat from '../shared/aiChat';
import AuthService from '../util/authService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const TabPanel = (props) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            padding: '20px',
          }}
        >
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Tickets = React.memo((props) => {
  const { type } = props;
  const limit = 10;
  const subMenu = 'Tickets';
  const subIncMenu = 2;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [statusValue, setStatusValue] = useState(0);
  const [incidentStatusValue, setIncidentStatusValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState(0);
  const [priorityValue, setPriorityValue] = useState(0);
  const [maintenanceTeamValue, setMaintenanceTeamValue] = useState(0);
  const [regionValue, setRegionValue] = useState(0);
  const [companyValue, setCompanyValue] = useState(0);
  const [subCategoryValue, setSubCategoryValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkCategories, setCheckCategories] = useState([]);
  const [checkSubCategory, setSubCheckCategory] = useState([]);
  const [checkPriorities, setCheckPriorities] = useState([]);
  const [checkIncident, setCheckIncident] = useState([]);
  const [checkMaintenanceTeam, setCheckMaintenanceTeam] = useState([]);
  const [checkRegion, setCheckRegion] = useState([]);
  const [checkCompany, setCheckCompany] = useState([]);
  const [channelGroups, setChannelGroups] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [randomValue, setRandomValue] = useState(false);
  const [reload, setReload] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);

  const [raiseTicket, setRaiseTicket] = useState(false);
  const [aiFilter, setAiFilter] = useState(false);
  const [aiFilterTemp, setAiFilterTemp] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isClear, setClear] = useState(false);
  const [tableColumns, setTableColumns] = useState(TicketsColumns());

  const authService = AuthService();

  const onClearHistory = () => {
    authService.storeAiMessages(JSON.stringify([]));
    setClear(Math.random());
  };

  const { pinEnableData } = useSelector((state) => state.auth);

  const apiFields = [
    'parent_id',
    'sla_end_date',
    'sla_end_date',
    'description',
    'issue_type',
    'sub_category_id',
    'asset_id',
    'closed_by_id',
    'incident_state',
    'maintenance_team_id',
    'current_escalation_level',
    'sla_timer',
    'channel',
    'close_time',
    'purchase_date',
    'requestee_id',
    'asset_id',
    'company_id',
    'person_name',
    'sla_status',
    'type_category',
    'create_uid',
    'create_date',
    'log_note',
    'last_commented_by',
    'log_note_date',
    'category_id',
    'priority_id',
    'state_id',
    'work_location',
    'incident_type_id',
    'equipment_location_id',
    'subject',
    'ticket_number',
    'id',
    'sla_time',
    'email',
    'city_name',
    'state_name',
    'region_id',
  ];

  const [collapse, setCollapse] = useState(false);
  const [columnHide, setColumnHide] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const [parentTicket, setParentTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(false);
  const [aiModal, showAIModal] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const classes = useStyles();

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    ticketsCount,
    ticketsInfo,
    ticketCountLoading,
    helpdeskFilter,
    ticketDetail,
    maintenanceGroupsInfo,
    regionsGroupsInfo,
    updateTicketInfo,
    onHoldRequestInfo,
    documentCreateAttach,
    maintenanceConfigList,
    maintenanceConfigurationData,
    tenantConfig,
    subCategoryGroupsInfo,
    addTicketInfo,
    uploadPhoto,
    categoryGroupsInfo,
    stateGroupsInfo,
    priorityGroupsInfo,
    displayNames,
    stateIncidentGroupsInfo,
    ticketsExportInfo,
  } = useSelector((state) => state.ticket);

  const {
    createTenantinfo, allowedCompanies,
  } = useSelector((state) => state.setup);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const isAIEnabled = allowedOperations.includes(actionCodes['AI Option']);

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  let isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].tenant_visible && maintenanceConfigurationData.data[0].tenant_visible !== 'None';

  const isTicketType = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].ticket_type_visible;

  let isChannelVisible = configData && configData.channel_visible !== 'None';
  let isTicketTypeVisible = isTicketType && isTicketType !== 'None';
  let isTeamVisible = configData && configData.maintenance_team_visible !== 'None';

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig)) {
    const tConfig = getTenentOptions(userInfo, tenantConfig);
    isTenant = tConfig.tenant_visible !== 'None';
    isChannelVisible = tConfig.channel_visible !== 'None';
    isTicketTypeVisible = tConfig.ticket_type_visible !== 'None';
    isTeamVisible = tConfig.maintenance_team_visible !== 'None';
  }

  useEffect(() => {
    if (maintenanceConfigurationData && maintenanceConfigurationData.data) {
      setTableColumns(TicketsColumns(isVendorShow, isTenant, isTicketTypeVisible, isChannelVisible, isTeamVisible));
    }
  }, [maintenanceConfigurationData]);

  const showFields = HelpdeskModule.helpdeskShowFields;

  const [columnsFields, setColumns] = useState(showFields);

  const companies = getAllCompanies(userInfo, userRoles);

  const isIncident = !!(type && type === 'Incident');
  const isFITTracker = !!(type && type === 'FITTracker');

  const isTenantTickets = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';
  const allowedTenants = userInfo && userInfo.data && userInfo.data.allowed_tenants && userInfo.data.allowed_tenants.length ? getColumnArrayById(userInfo.data.allowed_tenants, 'id') : [];

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant') {
      dispatch(getTenantConfiguration());
    }
  }, [userInfo]);

  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone;

  useEffect(() => {
    if ((addTicketInfo && addTicketInfo.data) || loadData) {
      const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const incidentValues = helpdeskFilter && helpdeskFilter.incidentStates ? getColumnArray(helpdeskFilter.incidentStates, 'id') : [];
      const categories = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const maintenanceTeam = helpdeskFilter && helpdeskFilter.maintenanceTeam ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id') : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter && helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketList(companies, appModels.HELPDESK, limit, offset, HelpdeskModule.helpdeskApiFields, statusValues, categories, priorities, customFilters, sortedValue.sortBy, sortedValue.sortField, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants));
      dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, false, isTenantTickets, allowedTenants));
    }
  }, [addTicketInfo, loadData]);

  useEffect(() => {
    if (reload) {
      const filterValues = {
        statusValues: false,
        categories: false,
        priorities: false,
        customFilters: [],
      };
      dispatch(getHelpdeskFilter(filterValues));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setAiFilter(false);
      setAiFilterTemp(false);
      setAiPrompt('');
      setLoadData(Math.random());
    }
  }, [reload]);

  const onResetAiFilter = () => {
    setAiFilter(false);
    setAiFilterTemp(false);
    setAiPrompt('');
    setLoadData(Math.random());
  };

  useEffect(() => {
    if ((updateTicketInfo && updateTicketInfo.data) || (onHoldRequestInfo && onHoldRequestInfo.data)) {
      const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const incidentValues = helpdeskFilter && helpdeskFilter.incidentStates ? getColumnArray(helpdeskFilter.incidentStates, 'id') : [];
      const categories = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const maintenanceTeam = helpdeskFilter && helpdeskFilter.maintenanceTeam ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id') : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter && helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketList(companies, appModels.HELPDESK, limit, offset, HelpdeskModule.helpdeskApiFields, statusValues, categories, priorities, customFilters, sortedValue.sortBy, sortedValue.sortField, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants));
    }
  }, [updateTicketInfo, onHoldRequestInfo]);

  const exportCondition = helpdeskFilter && ((helpdeskFilter.states && helpdeskFilter.states.length > 0) || (helpdeskFilter.incidentStates && helpdeskFilter.incidentStates.length > 0)
    || (helpdeskFilter.categories && helpdeskFilter.categories.length > 0) || (helpdeskFilter.priorities && helpdeskFilter.priorities.length > 0)
    || (helpdeskFilter.company && helpdeskFilter.company.length > 0) || (helpdeskFilter.subCategory && helpdeskFilter.subCategory.length > 0)
    || (helpdeskFilter.customFilters && helpdeskFilter.customFilters.length > 0) || (helpdeskFilter.maintenanceTeam && helpdeskFilter.maintenanceTeam.length > 0)
    || helpdeskFilter.region && helpdeskFilter.region.length > 0 || (rows && rows.length) || globalFilter?.length
  );

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (userInfo && userInfo.data && parentTicket) {
      dispatch(getTicketDetail(parentTicket, appModels.HELPDESK));
    }
  }, [userInfo, parentTicket]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (helpdeskFilter && helpdeskFilter.states) {
      setCheckItems(helpdeskFilter.states);
      setStatusValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.incidentStates) {
      setCheckIncident(helpdeskFilter.incidentStates);
      setIncidentStatusValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.categories) {
      setCheckCategories(helpdeskFilter.categories);
      setCategoryValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.subCategory) {
      setSubCheckCategory(helpdeskFilter.subCategory);
      setSubCategoryValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.priorities) {
      setCheckPriorities(helpdeskFilter.priorities);
      setPriorityValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.maintenanceTeam) {
      setCheckMaintenanceTeam(helpdeskFilter.maintenanceTeam);
      setMaintenanceTeamValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.region) {
      setCheckRegion(helpdeskFilter.region);
      setRegionValue(0);
    }
    if (helpdeskFilter && helpdeskFilter.company) {
      setCheckCompany(helpdeskFilter.company);
      setCompanyValue(0);
    }

    if (helpdeskFilter && helpdeskFilter.customFilters) {
      setCustomFilters(helpdeskFilter.customFilters);
      const idExists = isArrayValueExists(
        helpdeskFilter.customFilters,
        'type',
        'id',
      );
      if (idExists) {
        const idData = helpdeskFilter.customFilters.filter(
          (item) => item.type === 'id',
        );
        const vId = idData && idData.length ? idData[0].value : false;
        if (vId) {
          // setViewId(vId);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [helpdeskFilter]);

  const totalDataCount = ticketsCount && ticketsCount.length ? ticketsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  useEffect(() => {
    if (isIncident) {
      setColumns(IncidentModule.incidentApiFields);
    }
  }, [isIncident]);

  const onViewReset = () => {
    if (!parentTicket) {
      setOffset(offset);
      setPage(currentPage);
      setViewId(0);
      setViewModal(false);
    } else {
      setViewId(currentTicket);
      dispatch(getTicketDetail(currentTicket, appModels.HELPDESK));
      setParentTicket(false);
    }
  };

  const onViewEditReset = () => {
    dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    // setViewModal(true);
    setEditLink(false);
    dispatch(resetUpdateTicket());
    dispatch(resetImage());
    setEditId(false);
    dispatch(resetAddTicket());
  };

  const onAddReset = () => {
    if (document.getElementById('checkoutForm')) {
      document.getElementById('checkoutForm').reset();
    }
    /* if (addTicketInfo && addTicketInfo.data && addTicketInfo.data.length > 0) {
      if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0) {
        const dcreate = prepareDocuments(uploadPhoto, addTicketInfo.data[0]);
        dispatch(onDocumentCreatesAttach(dcreate));
      }
      if (createTenantinfo && createTenantinfo.data) {
        const updateData = { requestee_id: createTenantinfo.data[0] };
        dispatch(
          updateTicket(addTicketInfo.data[0], appModels.HELPDESK, updateData),
        );
      }
    } */
    dispatch(activeStepInfo(0));
    setAddLink(false);
    //  dispatch(resetUpdateTicket());
    dispatch(resetImage());
    setEditId(false);
    dispatch(resetAddTicket());
    setRandomValue(Math.random());
  };

  const handleCustomFilterClose = (fValue, arrValue, typeData) => {
    setOffset(0);
    setPage(0);
    let filterData = [];
    if (typeData === 'inarray') {
      setCustomFilters(customFilters.filter((item) => item.value !== arrValue));
      filterData = customFilters.filter((item) => item.value !== arrValue);
    } else {
      setCustomFilters(customFilters.filter((item) => item.key !== fValue));
      filterData = customFilters.filter((item) => item.key !== fValue);
    }
    const payload = {
      states: checkItems,
      categories: checkCategories,
      priorities: checkPriorities,
      incidentStates: checkIncident,
      customFilters: filterData,
    };
    setValueArray(valueArray.filter((item) => item.id !== fValue));
    dispatch(getHelpdeskFilter(payload));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
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
    if (checked) {
      //  setCustomFiltersList([...customFiltersList, ...filters]);
      const oldCustomFilters = helpdeskFilter && helpdeskFilter.customFilters
        ? helpdeskFilter.customFilters
        : [];
      const filterValues = {
        states:
          helpdeskFilter && helpdeskFilter.states ? helpdeskFilter.states : [],
        categories:
          helpdeskFilter && helpdeskFilter.categories
            ? helpdeskFilter.categories
            : [],
        priorities:
          helpdeskFilter && helpdeskFilter.priorities
            ? helpdeskFilter.priorities
            : [],
        incidentStates:
          helpdeskFilter && helpdeskFilter.incidentStates
            ? helpdeskFilter.incidentStates
            : [],
        customFilters: [
          ...(oldCustomFilters.length > 0 ? oldCustomFilters.filter(
            (item) => item.type !== 'date' && item.type !== 'customdate',
          ) : ''),
          ...filters,
        ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ]);
      dispatch(getHelpdeskFilter(filterValues));
    } else {
      setCustomFiltersList(
        customFiltersList.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
      );
      const oldCustomFilters = helpdeskFilter && helpdeskFilter.customFilters
        ? helpdeskFilter.customFilters
        : [];
      const filterValues = {
        states:
          helpdeskFilter && helpdeskFilter.states ? helpdeskFilter.states : [],
        categories:
          helpdeskFilter && helpdeskFilter.categories
            ? helpdeskFilter.categories
            : [],
        priorities:
          helpdeskFilter && helpdeskFilter.priorities
            ? helpdeskFilter.priorities
            : [],
        incidentStates:
          helpdeskFilter && helpdeskFilter.incidentStates
            ? helpdeskFilter.incidentStates
            : [],
        customFilters: customFiltersList.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
      );
      dispatch(getHelpdeskFilter(filterValues));
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
      // start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
      // end = `${moment(endDate).add(1, 'day').utc().format('YYYY-MM-DD')} 18:30:59`;
      // start = `${moment(startDate).tz(companyTimeZone).startOf('date').utc().format('YYYY-MM-DD HH:mm:ss')}`;
      // end = `${moment(endDate).tz(companyTimeZone).endOf('date').utc().format('YYYY-MM-DD HH:mm:ss')}`;
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
      const oldCustomFilters = helpdeskFilter && helpdeskFilter.customFilters
        ? helpdeskFilter.customFilters
        : [];
      const filterValues = {
        states:
          helpdeskFilter && helpdeskFilter.states ? helpdeskFilter.states : [],
        categories:
          helpdeskFilter && helpdeskFilter.categories
            ? helpdeskFilter.categories
            : [],
        priorities:
          helpdeskFilter && helpdeskFilter.priorities
            ? helpdeskFilter.priorities
            : [],
        incidentStates:
          helpdeskFilter && helpdeskFilter.incidentStates
            ? helpdeskFilter.incidentStates
            : [],
        customFilters: [
          ...oldCustomFilters.filter(
            (item) => item.type !== 'date'
              && item.type !== 'customdate'
              && item.type !== 'datearray',
          ),
          ...filters,
        ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getHelpdeskFilter(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = helpdeskFilter && helpdeskFilter.customFilters
        ? helpdeskFilter.customFilters
        : [];
      const filterValues = {
        states:
          helpdeskFilter && helpdeskFilter.states ? helpdeskFilter.states : [],
        categories:
          helpdeskFilter && helpdeskFilter.categories
            ? helpdeskFilter.categories
            : [],
        priorities:
          helpdeskFilter && helpdeskFilter.priorities
            ? helpdeskFilter.priorities
            : [],
        incidentStates:
          helpdeskFilter && helpdeskFilter.incidentStates
            ? helpdeskFilter.incidentStates
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getHelpdeskFilter(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

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

  const isUserError = userInfo && userInfo.err;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = ticketsInfo && ticketsInfo.err
    ? generateErrorMessage(ticketsInfo)
    : userErrorMsg;
  const [openPriority, setOpenPriority] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openChannel, setOpenChannel] = useState(false);
  const [openSlaStatus, setOpenSlaStatus] = useState(false);
  const [openMaintenanceTeam, setOpenMaintenanceTeam] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [openIncidentState, setOpenIncidentState] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);

  const [priorityGroups, setPriorityGroups] = useState([]);
  const [stateGroups, setStateGroups] = useState([]);
  const [incidentStateGroups, setIncidentStateGroups] = useState([]);
  const [maintenanceGroups, setMaintenanceGroups] = useState([]);
  const [categoriesGroups, setCategories] = useState([]);
  const [regionGroups, setRegionGroups] = useState([]);
  const [companyGroups, setCompanyGroups] = useState([]);
  const [subCategoryGroups, setsubCategoryGroups] = useState([]);
  const [modifiedTicketsInfo, setModifiedTicketsInfo] = useState([]);

  const loading = (userInfo && userInfo.loading)
    || ticketCountLoading
    || !modifiedTicketsInfo.data
    || (ticketsInfo && ticketsInfo.loading);

  const [openStatus, setOpenStatus] = useState(false);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        ticket_number: true,
        subject: true,
        log_note: false,
        last_commented_by: false,
        log_note_date: false,
        state_id: true,
        maintenance_team_id: true,
        asset_id: true,
        priority_id: true,
        category_id: true,
        description: true,
        create_date: true,
        create_uid: true,
        requestee_id: true,
        closed_by_id: true,
        close_time: true,
        channel: false,
        sla_status: true,
        sub_category_id: false,
        issue_type: false,
        sla_end_date: false,
        parent_id: false,
        company_id: true,
        email: false,
        vendor_id: false,
        tenant_name: false,
        region_id: false,
        city_name: false,
        state_name: false,
        site_sub_categ_id: false,
        constraints: true,
        cost: true,
        ticket_type: true,
        is_cancelled: true,
        is_on_hold_requested: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (userInfo && userInfo.data && openCategory) {
      dispatch(getCategoryGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, openCategory]);

  useEffect(() => {
    if (userInfo && userInfo.data && openSubCategory) {
      dispatch(getSubCategoryGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, openSubCategory]);

  useEffect(() => {
    if (userInfo && userInfo.data && openState) {
      dispatch(getStateGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, openState]);

  useEffect(() => {
    if (userInfo && userInfo.data && openIncidentState) {
      dispatch(
        getIncidentStateGroups(companies, appModels.HELPDESK, isIncident),
      );
    }
  }, [userInfo, openIncidentState]);

  useEffect(() => {
    if (userInfo && userInfo.data && openPriority) {
      dispatch(getPriorityGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, openPriority]);

  useEffect(() => {
    if (userInfo && userInfo.data && openMaintenanceTeam) {
      dispatch(getMaintenanceGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, openMaintenanceTeam]);

  useEffect(() => {
    if (userInfo && userInfo.data && openRegion) {
      dispatch(getRegionsGroups(companies, appModels.HELPDESK));
    }
  }, [userInfo, openRegion]);

  const userCompanies = allowedCompanies
    && allowedCompanies.data
    && allowedCompanies.data.allowed_companies
    && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies
    : userInfo
      && userInfo.data
      && userInfo.data.allowed_companies
      && userInfo.data.allowed_companies.length > 0
      ? userInfo.data.allowed_companies
      : [];

  const companyData = useMemo(() => ({ data: userCompanies }), [userCompanies]);

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(
        categoryGroupsInfo.data.filter((item) => item.category_id_count),
      );
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    if (subCategoryGroupsInfo && subCategoryGroupsInfo.data) {
      setsubCategoryGroups(subCategoryGroupsInfo.data);
    }
  }, [subCategoryGroupsInfo]);

  useEffect(() => {
    if (stateGroupsInfo && stateGroupsInfo.data) {
      setStateGroups(stateGroupsInfo.data);
    }
  }, [stateGroupsInfo]);

  useEffect(() => {
    if (stateIncidentGroupsInfo && stateIncidentGroupsInfo.data) {
      setIncidentStateGroups(stateIncidentGroupsInfo.data);
    }
  }, [stateIncidentGroupsInfo]);

  useEffect(() => {
    if (maintenanceGroupsInfo && maintenanceGroupsInfo.data) {
      setMaintenanceGroups(maintenanceGroupsInfo.data);
    }
  }, [maintenanceGroupsInfo]);

  useEffect(() => {
    if (regionsGroupsInfo && regionsGroupsInfo.data) {
      setRegionGroups(regionsGroupsInfo.data);
    }
  }, [regionsGroupsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // setCompanyGroups(userInfo.data);
    }
  }, [userInfo]);

  useEffect(() => {
    if (priorityGroupsInfo && priorityGroupsInfo.data) {
      setPriorityGroups(priorityGroupsInfo.data);
    }
  }, [priorityGroupsInfo]);

  const drawerHeading = isIncident ? 'Incident' : 'Ticket';

  useEffect(() => {
    if (userInfo && userInfo.data && ticketsCount && ticketsCount.length && startExport) {
      const offsetValue = 0;
      const statusValues = helpdeskFilter.states
        ? getColumnArray(helpdeskFilter.states, 'id')
        : [];
      const categories = helpdeskFilter.categories
        ? getColumnArrayById(helpdeskFilter.categories, 'id')
        : [];
      const priorities = helpdeskFilter.priorities
        ? getColumnArrayById(helpdeskFilter.priorities, 'id')
        : [];
      const maintenanceTeam = helpdeskFilter.maintenanceTeam
        ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id')
        : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter.customFilters
        ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data)
        : '';
      dispatch(
        getTicketsExport(
          companies,
          appModels.HELPDESK,
          ticketsCount.length,
          offsetValue,
          HelpdeskModule.helpdeskApiFields,
          statusValues,
          categories,
          priorities,
          customFilters,
          rows,
          isIncident,
          sortedValue.sortBy,
          sortedValue.sortField,
          maintenanceTeam,
          region,
          companyFilters,
          subCategory,
          globalFilter,
          aiFilter,
          isTenantTickets,
          allowedTenants,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (ticketsInfo && ticketsInfo.data) {
      const convertedArray = convertTicketFields(ticketsInfo.data); const dataObj = {
        data: convertedArray,
      };
      setModifiedTicketsInfo(dataObj);
    } else if (ticketsInfo && ticketsInfo.loading) {
      const dataObj = {
        loading: true,
      };
      setModifiedTicketsInfo(dataObj);
    } else if (ticketsInfo && ticketsInfo.err) {
      const dataObj = {
        err: ticketsInfo.err,
      };
      setModifiedTicketsInfo(dataObj);
    }
  }, [ticketsInfo]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue.sortBy && sortedValue.sortField) {
      const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const incidentValues = helpdeskFilter && helpdeskFilter.incidentStates ? getColumnArray(helpdeskFilter.incidentStates, 'id') : [];
      const categories = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const maintenanceTeam = helpdeskFilter && helpdeskFilter.maintenanceTeam ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id') : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter && helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(
        getTicketList(
          companies,
          appModels.HELPDESK,
          limit,
          offset,
          HelpdeskModule.helpdeskApiFields,
          statusValues,
          categories,
          priorities,
          customFilters,
          sortedValue.sortBy,
          sortedValue.sortField,
          isIncident,
          maintenanceTeam,
          incidentValues,
          region,
          companyFilters,
          subCategory,
          globalFilter,
          aiFilter,
          isTenantTickets,
          allowedTenants,
        ),
      );
      // dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter));
    }
  }, [
    userInfo,
    offset,
    sortedValue.sortBy,
    sortedValue.sortField,
    JSON.stringify(helpdeskFilter.customFilters),
    globalFilter,
    aiFilter,
  ]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const incidentValues = helpdeskFilter && helpdeskFilter.incidentStates ? getColumnArray(helpdeskFilter.incidentStates, 'id') : [];
      const categories = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const maintenanceTeam = helpdeskFilter && helpdeskFilter.maintenanceTeam ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id') : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter && helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilterTemp, isTenantTickets, allowedTenants));
    }
  }, [userInfo, JSON.stringify(helpdeskFilter.customFilters), sortedValue.sortBy, sortedValue.sortField, globalFilter, aiFilterTemp]);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(modifiedTicketsInfo && modifiedTicketsInfo.data && modifiedTicketsInfo.data.length && modifiedTicketsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(modifiedTicketsInfo && modifiedTicketsInfo.data && modifiedTicketsInfo.data.length && modifiedTicketsInfo.data[modifiedTicketsInfo.data.length - 1].id);
    }
  }, [modifiedTicketsInfo]);

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

  const updateValueConditionally = (filters, filterData) => {
    let updated = false;

    filters.forEach((filter) => {
      if (filterData[0].value !== 'On-Hold Requested' && filterData[0].value !== 'Cancelled') {
        updated = true;
        filters.push(
          {
            field: 'is_on_hold_requested',
            operator: 'boolean',
            id: filter.id,
            value: false,
            key: 'is_on_hold_requested',
            type: 'contains',
            title: 'Is On Hold Requested',
          },
        );
      }
      if (filterData[0].value === 'Cancelled') {
        filter.value = true;
        filter.field = 'is_cancelled';
        filter.operator = 'boolean';
        updated = true;
      }
      if (filterData[0].value === 'On-Hold Requested') {
        filter.value = true;
        filter.field = 'is_on_hold_requested';
        filter.operator = 'boolean';
        updated = true;
        filters.push(
          {
            field: 'state_id',
            operator: 'not',
            id: filter.id,
            value: 'On Hold',
            key: 'state_id',
            type: 'contains',
            title: 'Status',
          },
        );
      }
    });

    // Return the updated filters only if modifications were made, else return original
    return updated ? filters : filters;
  };

  const onFilterChange = (data) => {
    data.items && data.items.length && data.items.map((data) => {
      data.type = 'contains';
    });
    const fields = [
      'ticket_number',
      'subject',
      'log_note',
      'last_commented_by',
      'log_note_date',
      'state_id',
      'maintenance_team_id',
      'asset_id',
      'priority_id',
      'category_id',
      'description',
      'create_date',
      'create_uid',
      'requestee_id',
      'closed_by_id',
      'close_time',
      'channel',
      'sla_status',
      'current_escalation_level',
      'sub_category_id',
      'issue_type',
      'sla_end_date',
      'parent_id',
      'company_id',
      'vendor_id',
      'tenant_name',
      'email',
      'region_id',
      'city_name',
      'state_name',
      'site_sub_categ_id',
      'constraints',
      'cost',
      'ticket_type',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const payload = {
      states: checkItems,
      categories: checkCategories,
      priorities: checkPriorities,
      maintenanceTeam: checkMaintenanceTeam,
      incidentStates: checkIncident,
    };

    const oldCustomFilters = helpdeskFilter && helpdeskFilter.customFilters
      ? helpdeskFilter.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }

    if (data && data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = TicketsColumns().find((column) => column.field === dataItem.field);
          dataItem.operator = dataItem.field === 'state_id' && (dataItem.value === 'On-Hold Requested' || dataItem.value === 'Cancelled') ? 'isNotEmpty' : dataItem.operator;
          dataItem.field = dataItem.field === 'state_id' && dataItem.value === 'On-Hold Requested' ? 'is_on_hold_requested' : dataItem.value === 'Cancelled' ? 'is_cancelled' : dataItem.field;
          dataItem.value = dataItem?.value ? (dataItem.value === 'On-Hold Requested' || dataItem.value === 'Cancelled' ? true : dataItem.value) : '';
          dataItem.header = label?.headerName;
        });
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        const checkFilters = [...uniqueCustomFilter];
        const isStateData = checkFilters.filter((item) => item.field === 'state_id');
        const isState = isStateData && isStateData.length > 0;
        if (isState) {
          const noReq = [{
            field: 'is_on_hold_requested', type: 'isEmpty', operator: 'boolean', id: 37100, value: false, header: 'On Hold Requested',
          },
          {
            field: 'is_cancelled', type: 'isEmpty', operator: 'boolean', id: 69158, value: false, header: 'Cancelled',
          }];
          const newFilter = uniqueCustomFilter.filter((item) => item.field !== 'is_on_hold_requested' && item.field !== 'is_cancelled');
          uniqueCustomFilter = [...noReq, ...newFilter];
        }
        uniqueCustomFilter = getNewDataGridFilterArray(TicketsColumns(), uniqueCustomFilter);
        payload.customFilters = [...dateFilters, ...uniqueCustomFilter];
        // payload.customFilters = payload.customFilters && payload.customFilters.length && payload.customFilters.length > 0 ? updateValueConditionally(payload.customFilters, data.items) : payload.customFilters;
        dispatch(getHelpdeskFilter(payload));
      }
    } else {
      payload.customFilters = [...dateFilters];
      dispatch(getHelpdeskFilter(payload));
    }
    setCustomFiltersList(payload.customFilters);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [helpdeskFilter],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    isFITTracker ? 'FIT Tracker' : 'Helpdesk',
  );

  let activeTab;
  let tabs;

  const navData = isFITTracker ? helpdeskNav.data1 : helpdeskNav.data;

  if (headerTabs && headerTabs.length) {
    const tabsDef = getTabs(headerTabs[0].menu, navData);
    let dynamicList = headerTabs[0].menu.filter((item) => !(navData && navData[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/helpdesk-insights-overview/helpdesk/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Tickets',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: isFITTracker ? 'FIT Tracker' : 'Helpdesk',
        moduleName: isFITTracker ? 'FIT Tracker' : 'Helpdesk',
        menuName: 'Tickets',
        link: '/helpdesk-insights-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getHelpdeskFilter([]),
      }),
    );
  }, [activeTab]);

  const cards = [
    {
      id: 1,
      title: 'Open tickets',
      description: 'Show me the list of open tickets created in last 30 days',
    },
    {
      id: 2,
      title: 'SLA elapsed tickets',
      description: 'Show the list of SLA elapsed tickets for last 7 days',
    },
    {
      id: 3,
      title: 'On-hold tickets',
      description: 'Show the list of on-hold tickets',
    },
  ];

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
            modifiedTicketsInfo
              && modifiedTicketsInfo.data
              && modifiedTicketsInfo.data.length
              ? modifiedTicketsInfo.data
              : []
          }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Tickets List"
        isAI={isAIEnabled}
        aiFilter={aiFilter}
        aiPrompt={aiPrompt}
        onResetAiFilter={onResetAiFilter}
        setOpenAI={() => { setClear(false); showAIModal(true); }}
        exportFileName="Tickets"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={{
          err: ticketsExportInfo.err,
          loading: ticketsExportInfo.loading,
          data: ticketsExportInfo.data
            ? convertTicketFields(ticketsExportInfo.data)
            : false,
        }}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Raise a ticket']),
          text: isIncident ? 'Report a Incident' : 'Raise a Ticket',
          func: () => setAddLink(true),
        }}
        setRows={setRows}
        rows={rows}
        filters={filterStringGenerator(helpdeskFilter)}
        pdfStaticColumnWidth={{
          subject: { cellWidth: 150 },
          log_note: { cellWidth: 120 },
          description: { cellWidth: 150 },
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={ticketsInfo && ticketsInfo.loading}
        err={ticketsInfo && ticketsInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        linkButton={{
          show:
              !isIncident
              && maintenanceConfigurationData
              && !maintenanceConfigurationData.loading
              && maintenanceConfigurationData.data
              && maintenanceConfigurationData.data.length
              && maintenanceConfigurationData.data[0].uuid,
          onClick: () => {
            copyToClipboard(
              maintenanceConfigurationData.data[0].uuid,
              'ticket',
            );
          },
        }}
        placeholderText="Search Ticket No, Subject ..."
        reload={{
          show: true,
          setReload,
          loading,
        }}
        exportCondition={{ filter: exportCondition, show: true }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'id' || cf.label && cf.label !== 'Custom' && cf.type !== 'date')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text' || cf.type === 'id') && (
                      <span>
                        {decodeURIComponent(cf.name)}
                      </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key, cf.value, cf.type)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
          )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '30%' },
        }}
        anchor="right"
        open={aiModal}
        transitionDuration={0}
      >
        <DrawerHeader
          headerName="Ask AI (Beta)"
          isAI
          clearHistory={() => onClearHistory()}
          onClose={() => { showAIModal(false); }}
        />
        <Box
          sx={{
            width: '100%',
            height: '60vh',
            overflow: 'auto',
            marginBottom: '30px',
          }}
          className="hidden-scrollbar"
        >
          <AiChat
            onView={() => showAIModal(false)}
            count={totalDataCount}
            moduleName="Tickets"
            cards={cards}
            isClear={isClear}
            model={appModels.HELPDESK}
            setAiFilter={setAiFilter}
            setAiFilterTemp={setAiFilterTemp}
            setAiPrompt={setAiPrompt}
          />
        </Box>
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={
              !isIncident ? 'Raise a Ticket' : 'Raise a Incident Ticket'
            }
          imagePath={ticketIcon}
          onClose={() => onAddReset()}
        />
        <CreateTicketForm
          randomProp={randomValue}
          editIds={editId}
          setAddLink={setAddLink}
          closeModal={() => setAddLink(false)}
          afterReset={onAddReset}
          isAIEnabled={isAIEnabled}
          isDrawer
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
              ticketDetail && ticketDetail && !ticketDetail.loading
                && ticketDetail.data
                && ticketDetail.data.length
                && ticketDetail.data[0]
                ? ticketDetail.data[0].ticket_number
                : ''
            }
          imagePath={ticketDetail && !ticketDetail.loading && ticketIcon}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', modifiedTicketsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', modifiedTicketsInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', modifiedTicketsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', modifiedTicketsInfo));
          }}
          loading={ticketDetail && ticketDetail.loading}
          onClose={onViewReset}
        />
        <TicketDetailView
          isAIEnabled={isAIEnabled}
          onViewEditReset={onViewEditReset}
          editId={editId}
          setEditId={setEditId}
          isIncident={isIncident}
          setViewModal={setViewModal}
          setParentTicket={setParentTicket}
          setCurrentTicket={setCurrentTicket}
        />
      </Drawer>
    </Box>
  );
});

Tickets.propTypes = {
  type: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
Tickets.defaultProps = {
  type: false,
};

export default Tickets;
