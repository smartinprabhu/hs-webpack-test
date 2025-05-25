/* eslint-disable import/no-unresolved */
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import {
  Button,
  TextField,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DocumentViewer from '@shared/documentViewer';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Col,
  Nav,
  NavLink,
  Popover,
  PopoverBody,
  Row,
} from 'reactstrap';

import assetIcon from '@images/icons/assetDefault.svg';
import complianceIcon from '@images/icons/complianceBlack.svg';
import TrackerIcon from '@images/icons/incidentManagementBlack.svg';
import TrackerCheck from '@images/sideNavImages/consumption_black.svg';
import ordersIcon from '@images/icons/orders.svg';
import pantryOrderBlackIcon from '@images/icons/pantry/pantryOrderBlack.svg';
import ticketIcon from '@images/icons/ticketBlue.svg';
import VisitRequest from '@images/icons/visitRequest.svg';
import workPermitBlack from '@images/icons/workPermitBlue.svg';
import GatepassBlack from '@images/sideNavImages/gatepass_black.svg';
import CommodityIcon from '@images/sideNavImages/commodityTransactions_black.svg';
import BMSIcon from '@images/sideNavImages/alarms_blue.svg';
import DrawerHeader from './drawerHeader';

import actionCodesAsset from '../assets/data/assetActionCodes.json';
import actionCodesAudit from '../auditSystem/data/actionCodes.json';
import actionCodesBT from '../breakdownTracker/data/actionCodes.json';
import actionCodesBC from '../buildingCompliance/data/complianceActionCodes.json';
import actionCodesCT from '../consumptionTracker/data/actionCodes.json';
import actionCodesHelpdesk from '../helpdesk/data/helpdeskActionCodes.json';
import actionCodesEHS from '../incidentBooking/data/actionCodes.json';
import actionCodesIncident from '../incidentManagement/data/actionCodes.json';
import actionCodesPantry from '../pantryManagement/data/actionCodes.json';
import actionCodesSLAAudit from '../slaAudit/data/actionCodes.json';
import actionCodesSurvey from '../survey/data/actionCodes.json';
import actionCodesVMS from '../visitorManagement/data/actionCodes.json';
import actionCodesWP from '../workPermit/data/actionCodes.json';
import actionCodesGP from '../gatePass/data/actionCodes.json';
import actionCodesCommodity from '../commodityTransactions/data/actionCodes.json';
import actionCodesBMS from '../bmsAlarms/data/actionCodes.json';
import {
  getEquipmentFilters,
  resetAddAssetInfo,
} from '../assets/equipmentService';
import { getTrackerFilters, resetAddTrackerInfo } from '../breakdownTracker/breakdownService';
import { getTrackerFilters as getBMSFilters, resetAddTrackerInfo as resetBMSTrackerInfo } from '../bmsAlarms/breakdownService';
import {
  getComplianceFilters, resetAddComplianceInfo,
} from '../buildingCompliance/complianceService';
import {
  getConsumptionTrackerFilters,
} from '../consumptionTracker/ctService';
import {
  getGatePassFilters,
  resetCreateGatePass,
  getGatePassConfig,
} from '../gatePass/gatePassService';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
  getHelpdeskFilter,
  resetAddTicket,
} from '../helpdesk/ticketService';
import { getIncidentsFilters, resetAddIncidentInfo } from '../incidentBooking/ctService';
import {
  resetCreateOrder,
  resetCreateProductCategory,
  getPantryFilters,
} from '../pantryManagement/pantryService';
import {
  getSlaAuditFilters, resetAddSlaAuditInfo,
} from '../slaAudit/auditService';
import { getSurveyFilters, resetAddSurvey } from '../survey/surveyService';
import { getVisitorRequestFilters, resetAddVisitRequest, getVmsConfigurationData } from '../visitorManagement/visitorManagementService';
import { getWorkorderFilter } from '../workorders/workorderService';
import { getTankerFilters } from '../commodityTransactions/tankerService';

import AddEquipment from '../assets/forms/createAsset';
import AddAuditSystem from '../auditSystem/operations/addAudit';
import AddTracker from '../breakdownTracker/forms/createBreakdown';
import AddCompliance from '../buildingCompliance/forms/createCompliance';
import AddCTracker from '../consumptionTracker/addTracker';
import AddTicket from '../helpdesk/forms/createTicketForm';
import AddIncidentEHS from '../incidentBooking/addIncident';
import AddIncident from '../incidentManagement/reportIncident';
import AddOrder from '../pantryManagement/addOrder';
import AddAudit from '../slaAudit/addAudit';
import AddSurvey from '../survey/addSurvey';
import AddVisitRequest from '../visitorManagement/addVisitRequest';
import AddWorkPermit from '../workPermit/addWorkPermit';
import AddGatePass from '../gatePass/addGatePass';
import AddTransaction from '../commodityTransactions/operations/addTransaction';
import AddAlarm from '../bmsAlarms/addAlarm';

import { getAuditFilters } from '../auditSystem/auditService';
import { getStateLabel } from '../auditSystem/utils/utils';
import { getComplianceStateLabel } from '../buildingCompliance/utils/utils';
import { getSlaStateLabelCT } from '../consumptionTracker/utils/utils';
import { getSlaStateLabel } from '../incidentBooking/utils/utils';
import { getSlaStateLabelAudit } from '../slaAudit/utils/utils';
import { getSurveyState } from '../survey/utils/utils';
import {
  extractTextObject,
  generateErrorMessage,
  getAllCompanies,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
  getPagesCountV2,
} from '../util/appUtils';
import { getWorkPermitFilters, getWpConfig } from '../workPermit/workPermitService';
import { getMTName } from '../workorders/utils/utils';
import { useTheme } from '../ThemeContext';

const appModels = require('../util/appModels').default;

const actionCodes = {
  ...actionCodesAsset, ...actionCodesHelpdesk, ...actionCodesSurvey, ...actionCodesVMS, ...actionCodesEHS, ...actionCodesIncident, ...actionCodesBT, ...actionCodesBC, ...actionCodesSLAAudit, ...actionCodesCT, ...actionCodesAudit, ...actionCodesWP, ...actionCodesPantry, ...actionCodesGP, ...actionCodesCommodity, ...actionCodesBMS,
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Navbar = (props) => {
  const { themes } = useTheme();
  const { headerData } = props;
  const limit = 10;
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading, listDataMultipleCountErr,
  } = useSelector((state) => state.ticket);
  const {
    visitorConfiguration,
  } = useSelector((state) => state.visitorManagement);
  const {
    gatePassConfig,
  } = useSelector((state) => state.gatepass);
  const { ninjaDashboard, ninjaDashboardCode } = useSelector(
    (state) => state.analytics,
  );
  const [partsData, setPartsData] = useState([]);

  const globalSearchAsset = !!(headerData?.moduleName === 'Asset Registry' && headerData?.menuName === 'Insights');
  const globalSearchHelpdesk = !!(headerData?.moduleName === 'Helpdesk' && headerData?.menuName === 'Insights');
  const globalSearchWorkOrders = !!(headerData?.moduleName === 'Work Orders' && headerData?.menuName === 'Insights');
  const globalSearchSurvey = !!(headerData?.moduleName === 'Survey' && headerData?.menuName === 'Insights');
  const globalSearchVMS = !!(headerData?.moduleName === 'Visitor Management' && headerData?.menuName === 'Insights');
  const globalSearchEHS = !!(headerData?.moduleName === 'Incident' && headerData?.menuName === 'Insights');
  const globalSearchIncident = !!(headerData?.moduleName === 'Incident Management' && headerData?.menuName === 'Insights');
  const globalSearchBT = !!(headerData?.moduleName === 'Breakdown Tracker' && headerData?.menuName === 'Insights');
  const globalSearchBC = !!(headerData?.moduleName === 'Building Compliance' && headerData?.menuName === 'Insights');
  const globalSearchSLA = !!(headerData?.moduleName === 'SLA-KPI Audit' && headerData?.menuName === 'Insights');
  const globalSearchCT = !!(headerData?.moduleName === 'Consumption Tracker' && headerData?.menuName === 'Insights');
  const globalSearchAudit = !!(headerData?.moduleName === 'Audit System' && headerData?.menuName === 'Insights');
  const globalSearchWorkpermit = !!(headerData?.moduleName === 'Work Permit' && headerData?.menuName === 'Insights');
  const globalSearchPantry = !!(headerData?.moduleName === 'Pantry Management' && headerData?.menuName === 'Insights');
  const globalSearchGP = !!(headerData?.moduleName === 'Gate Pass' && headerData?.menuName === 'Insights');
  const globalSearchCommodity = !!(headerData?.moduleName === 'Commodity Transactions' && headerData?.menuName === 'Insights');
  const globalSearchBMS = !!(headerData?.moduleName === 'BMS Alarms' && headerData?.menuName === 'Insights');

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const [addModal, showAddModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalDataCount, setTotalCount] = useState(0);
  const companies = getAllCompanies(userInfo, userRoles);
  const pages = getPagesCountV2(totalDataCount, limit);

  const getColumns = () => {
    let listColumns = [];
    if (globalSearchAsset) {
      listColumns = ['name', 'state', 'location_id', 'category_id', 'equipment_seq'];
    }
    if (globalSearchHelpdesk) {
      listColumns = ['ticket_number', 'category_id', 'subject', 'create_date'];
    }
    if (globalSearchWorkOrders) {
      listColumns = ['name', 'maintenance_type', 'cause'];
    }
    if (globalSearchSurvey) {
      listColumns = ['title', 'stage_id', 'create_date'];
    }
    if (globalSearchVMS) {
      listColumns = ['visitor_name', 'type_of_visitor', 'company_id'];
    }
    if (globalSearchEHS) {
      listColumns = ['name', 'reference', 'state'];
    }
    if (globalSearchIncident) {
      listColumns = ['ticket_number', 'subject', 'create_date'];
    }
    if (globalSearchBT) {
      listColumns = ['name', 'service_category_id', 'raised_by_id'];
    }
    if (globalSearchBC) {
      listColumns = ['name', 'state', 'create_date'];
    }
    if (globalSearchSLA) {
      listColumns = ['name', 'audit_template_id', 'state'];
    }
    if (globalSearchCT) {
      listColumns = ['name', 'tracker_template_id', 'state'];
    }
    if (globalSearchAudit) {
      listColumns = ['name', 'state', 'create_date'];
    }
    if (globalSearchWorkpermit) {
      listColumns = ['name', 'requestor_id', 'vendor_id'];
    }
    if (globalSearchPantry) {
      listColumns = ['name', 'employee_id', 'state'];
    }
    if (globalSearchGP) {
      listColumns = ['description', 'type', 'requestor_id'];
    }
    if (globalSearchCommodity) {
      listColumns = ['commodity', 'capacity', 'vendor_id', 'initial_reading', 'final_reading', 'difference', 'tanker_id', 'sequence', 'location_id', 'in_datetime', 'out_datetime', 'id'];
    }
    if (globalSearchBMS) {
      listColumns = ['subject', 'generated_on', 'severity'];
    }
    return listColumns;
  };

  useEffect(() => {
    dispatch(getEquipmentFilters([]));
    dispatch(getHelpdeskFilter([]));
    dispatch(getWorkorderFilter([]));
    dispatch(getSurveyFilters([]));
    dispatch(getVisitorRequestFilters([]));
    dispatch(getIncidentsFilters([]));
    dispatch(getTrackerFilters([]));
    dispatch(getAuditFilters([]));
    dispatch(getWorkPermitFilters([]));
    dispatch(getPantryFilters([]));
    dispatch(getGatePassFilters([]));
    dispatch(getBMSFilters([]));
    if (globalSearchVMS) {
      dispatch(getVmsConfigurationData(companies, appModels.VMSCONFIGURATION));
    }
    if (globalSearchGP) {
      dispatch(getGatePassConfig(companies, appModels.GATEPASSCONFIGURATION));
    }
    if (globalSearchWorkpermit) {
      dispatch(getWpConfig(companies, appModels.WPCONFIGURATION));
    }
    if (globalSearchBMS) {
      dispatch(getWpConfig(companies, appModels.BMSCONFIG));
    }
  }, [headerData]);

  useEffect(() => {
    if (searchOpen) {
      let searchValueMultiple = `[["company_id", "in", [${companies}]]]`;
      let appModel = '';
      if (globalSearchAsset) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],["is_itasset","!=","true"],"|","|",
      ["name", "ilike", "${keyword}"],["location_id", "ilike", "${keyword}"],["category_id", "ilike", "${keyword}"]]`;
        appModel = appModels.EQUIPMENT;
      }
      if (globalSearchHelpdesk) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["issue_type","!=","incident"],["help_problem_id","!=","incident"],"|",["ticket_number", "ilike", "${keyword}"],["subject", "ilike", "${keyword}"]]`;
        appModel = appModels.HELPDESK;
      }
      if (globalSearchWorkOrders) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],["active", "=", true],["scheduler_type","not in",["Inspection Checklist"]],"|","|",["name", "ilike", "${keyword}"],["maintenance_type", "ilike", "${keyword}"],["cause", "ilike", "${keyword}"]]`;
        appModel = appModels.ORDER;
      }
      if (globalSearchSurvey) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|",["title", "ilike", "${keyword}"],["stage_id", "ilike", "${keyword}"]]`;
        appModel = appModels.SURVEY;
      }
      if (globalSearchVMS) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["visitor_name", "ilike", "${keyword}"],["type_of_visitor", "ilike", "${keyword}"],["company_id", "ilike", "${keyword}"]]`;
        appModel = appModels.VISITREQUEST;
      }
      if (globalSearchEHS) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["reference", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.HXINCIDENT;
      }
      if (globalSearchIncident) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["issue_type","=","incident"],["help_problem_id","!=","incident"],"|",["ticket_number", "ilike", "${keyword}"],["subject", "ilike", "${keyword}"]]`;
        appModel = appModels.HELPDESK;
      }
      if (globalSearchBT) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["service_category_id", "ilike", "${keyword}"],["raised_by_id", "ilike", "${keyword}"]]`;
        appModel = appModels.BREAKDOWNTRACKER;
      }
      if (globalSearchBC) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|",["name", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.BULIDINGCOMPLIANCE;
      }
      if (globalSearchSLA) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["audit_template_id", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.SLAAUDIT;
      }
      if (globalSearchCT) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["tracker_template_id", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.CONSUMPTIONTRACKER;
      }
      if (globalSearchAudit) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|",["name", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.SYSTEMAUDIT;
      }
      if (globalSearchWorkpermit) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["requestor_id", "ilike", "${keyword}"],["vendor_id", "ilike", "${keyword}"]]`;
        appModel = appModels.WORKPERMIT;
      }
      if (globalSearchPantry) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["name", "ilike", "${keyword}"],["state", "ilike", "${keyword}"],["state", "ilike", "${keyword}"]]`;
        appModel = appModels.PANTRYORDER;
      }
      if (globalSearchGP) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["description", "ilike", "${keyword}"],["type", "ilike", "${keyword}"],["requestor_id", "ilike", "${keyword}"]]`;
        appModel = appModels.GATEPASS;
      }
      if (globalSearchCommodity) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|","|",["commodity", "ilike", "${keyword}"],["vendor_id", "ilike", "${keyword}"],["tanker_id", "ilike", "${keyword}"]]`;
        appModel = appModels.TANKERTRANSACTIONS;
      }
      if (globalSearchBMS) {
        searchValueMultiple = `["&",["company_id","in",[${companies}]],"|",["subject", "ilike", "${keyword}"],["severity", "ilike", "${keyword}"]]`;
        appModel = appModels.BMSALARMS;
      }
      dispatch(getExtraSelectionMultiple(companies, appModel, limit, offset, getColumns(), searchValueMultiple, true));
      dispatch(getExtraSelectionMultipleCount(companies, appModel, getColumns(), searchValueMultiple));
    }
  }, [searchOpen, offset, keyword]);

  useEffect(() => {
    if ((listDataMultipleInfo && listDataMultipleInfo.err) || (listDataMultipleCountErr)) {
      setTotalCount(0);
    }
  }, [listDataMultipleInfo, listDataMultipleCountErr]);

  useEffect(() => {
    if (listDataMultipleCountInfo && listDataMultipleCountInfo.length) {
      setTotalCount(listDataMultipleCountInfo.length);
    } else if (listDataMultipleCountInfo && (listDataMultipleCountInfo.loading || listDataMultipleCountInfo.err)) {
      setTotalCount(0);
    }
  }, [listDataMultipleCountInfo]);

  const onReset = () => {
    showAddModal(false);
    if (globalSearchAsset) {
      dispatch(resetAddAssetInfo());
    }
    if (globalSearchHelpdesk) {
      dispatch(resetAddTicket());
    }
    if (globalSearchSurvey) {
      dispatch(resetAddSurvey());
    }
    if (globalSearchVMS) {
      dispatch(resetAddVisitRequest());
    }
    if (globalSearchEHS) {
      dispatch(resetAddIncidentInfo());
    }
    if (globalSearchIncident) {
      dispatch(resetAddTicket());
    }
    if (globalSearchBT) {
      dispatch(resetAddTrackerInfo());
    }
    if (globalSearchBC) {
      dispatch(resetAddComplianceInfo());
    }
    if (globalSearchSLA) {
      dispatch(resetAddSlaAuditInfo());
    }
    if (globalSearchCT) {
      dispatch(resetAddTrackerInfo());
    }
    if (globalSearchAudit) {
      dispatch(resetCreateProductCategory());
    }
    if (globalSearchWorkpermit) {
      dispatch(resetCreateProductCategory());
    }
    if (globalSearchPantry) {
      dispatch(resetCreateOrder());
    }
    if (globalSearchGP) {
      dispatch(resetCreateGatePass());
    }
    if (globalSearchCommodity) {
      dispatch(resetCreateProductCategory());
    }
    if (globalSearchBMS) {
      dispatch(resetBMSTrackerInfo());
    }
  };

  const setData = (data) => {
    if (globalSearchAsset) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'text', name: data.name, refNumber: data.equipment_seq,
      }];
      dispatch(getEquipmentFilters(filters));
      history.push({ pathname: '/asset-overview/equipments', state: { id: data.id } });
    }
    if (globalSearchHelpdesk) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.ticket_number,
      }];
      const filterValues = {
        statusValues: false,
        categories: false,
        priorities: false,
        customFilters: filters,
      };
      dispatch(getHelpdeskFilter(filterValues));
      history.push({ pathname: '/helpdesk-insights-overview/helpdesk/tickets', state: { id: data.id } });
    }
    if (globalSearchWorkOrders) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];
      const filterValues = {
        statusValues: [],
        teams: [],
        priorities: [],
        customFilters: filters,
      };
      dispatch(getWorkorderFilter(filterValues));
      history.push({ pathname: '/maintenance/workorders' });
    }
    if (globalSearchSurvey) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.title,
      }];
      dispatch(getSurveyFilters(filters));
      history.push({ pathname: '/survey' });
    }
    if (globalSearchVMS) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.visitor_name,
      }];
      dispatch(getVisitorRequestFilters(filters));
      history.push({ pathname: '/visitormanagement/visitrequest', from: 'Insights' });
    }
    if (globalSearchEHS) {
      const filters = {
        customFilters: [{
          key: 'id', value: data.id, label: 'ID', type: 'id', name: data.reference,
        }],
      };
      dispatch(getIncidentsFilters(filters));
      history.push({ pathname: '/hx-incidents', state: { id: data.id } });
    }
    if (globalSearchIncident) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.ticket_number,
      }];
      dispatch(getHelpdeskFilter(filters));
      history.push({ pathname: '/incident/incidents', state: { id: data.id } });
    }
    if (globalSearchBT) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];
      dispatch(getTrackerFilters(filters));
      history.push({ pathname: '/breakdown-tracker', state: { id: data.id } });
    }
    if (globalSearchBC) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getComplianceFilters(filters));
      history.push({ pathname: '/buildingcompliance', state: { id: data.id } });
    }
    if (globalSearchSLA) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getSlaAuditFilters(filters));
      history.push({ pathname: '/sla-audits', state: { id: data.id } });
    }
    if (globalSearchCT) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getConsumptionTrackerFilters(filters));
      history.push({ pathname: '/consumption-trackers', state: { id: data.id } });
    }
    if (globalSearchAudit) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getAuditFilters(filters));
      history.push({ pathname: '/audit-operations', state: { id: data.id } });
    }
    if (globalSearchWorkpermit) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getWorkPermitFilters(filters));
      history.push({ pathname: '/workpermits', state: { id: data.id } });
    }
    if (globalSearchPantry) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.name,
      }];

      dispatch(getPantryFilters(filters));
      history.push({ pathname: '/pantry/orders', state: { id: data.id } });
    }
    if (globalSearchGP) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.description,
      }];

      dispatch(getGatePassFilters(filters));
      history.push({ pathname: '/gatepasses', state: { id: data.id } });
    }
    if (globalSearchCommodity) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data?.commodity?.[1],
      }];
      dispatch(getTankerFilters(filters));
      history.push({ pathname: '/commodity/operations', state: { id: data.id } });
    }
    if (globalSearchBMS) {
      const filters = [{
        key: 'id', value: data.id, label: 'ID', type: 'id', name: data.subject,
      }];
      dispatch(getBMSFilters(filters));
      history.push({ pathname: '/bms-alarms', state: { id: data.id } });
    }
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  useEffect(() => {
    if (!searchOpen) {
      setKeyword('');
      setPage(1);
      setOffset(0);
    }
  }, [searchOpen]);

  const getTabName = () => {
    let tabName = '';
    if (globalSearchAsset) {
      tabName = 'Assets';
    }
    if (globalSearchHelpdesk) {
      tabName = 'Helpdesk';
    }
    if (globalSearchWorkOrders) {
      tabName = 'Work Orders';
    }
    if (globalSearchSurvey) {
      tabName = 'Survey';
    }
    if (globalSearchVMS) {
      tabName = 'Visit Request';
    }
    if (globalSearchEHS) {
      tabName = 'Incidents';
    }
    if (globalSearchIncident) {
      tabName = 'Incidents';
    }
    if (globalSearchBT) {
      tabName = 'Breakdown Tracker';
    }
    if (globalSearchBC) {
      tabName = 'Building Compliance';
    }
    if (globalSearchSLA) {
      tabName = 'SLA Audit';
    }
    if (globalSearchCT) {
      tabName = 'Consumption Trackers';
    }
    if (globalSearchAudit) {
      tabName = 'Audits';
    }
    if (globalSearchWorkpermit) {
      tabName = 'Work Permit';
    }
    if (globalSearchPantry) {
      tabName = 'Pantry Orders';
    }
    if (globalSearchGP) {
      tabName = 'Gate Passes';
    }
    if (globalSearchCommodity) {
      tabName = 'Commodity Transactions';
    }
    if (globalSearchBMS) {
      tabName = 'BMS Alarms';
    }
    return tabName;
  };

  const getHeaderName = () => {
    let hName = '';
    if (globalSearchAsset) {
      hName = 'Create Asset';
    }
    if (globalSearchHelpdesk) {
      hName = 'Raise a Ticket';
    }
    if (globalSearchSurvey) {
      hName = 'Create Survey';
    }
    if (globalSearchVMS) {
      hName = 'Create Visit Request';
    }
    if (globalSearchEHS) {
      hName = 'Create Incident';
    }
    if (globalSearchIncident) {
      hName = 'Report a Incident';
    }
    if (globalSearchBT) {
      hName = 'Create Breakdown Tracker';
    }
    if (globalSearchBC) {
      hName = 'Create Building Compliance';
    }
    if (globalSearchSLA) {
      hName = 'Create SLA Audit';
    }
    if (globalSearchCT) {
      hName = 'Create Consumption Tracker';
    }
    if (globalSearchAudit) {
      hName = 'Create Audit';
    }
    if (globalSearchWorkpermit) {
      hName = 'Create Work Permit';
    }
    if (globalSearchPantry) {
      hName = 'Create Order';
    }
    if (globalSearchGP) {
      hName = 'Create Gate Pass';
    }
    if (globalSearchCommodity) {
      hName = 'Create Transaction';
    }
    if (globalSearchBMS) {
      hName = 'Create BMS Alarms';
    }
    return hName;
  };

  const getButtonText = () => {
    let buttonName = '';
    if (globalSearchAsset) {
      buttonName = 'Create Asset';
    }
    if (globalSearchHelpdesk) {
      buttonName = 'Raise a Ticket';
    }
    if (globalSearchSurvey) {
      buttonName = 'Create Survey';
    }
    if (globalSearchVMS) {
      buttonName = 'Create Visit Request';
    }
    if (globalSearchEHS) {
      buttonName = 'Create Incident';
    }
    if (globalSearchIncident) {
      buttonName = 'Report a Incident';
    }
    if (globalSearchBT) {
      buttonName = 'Create Tracker';
    }
    if (globalSearchBC) {
      buttonName = 'Create Compliance';
    }
    if (globalSearchSLA) {
      buttonName = 'Create SLA Audit';
    }
    if (globalSearchCT) {
      buttonName = 'Create Tracker';
    }
    if (globalSearchAudit) {
      buttonName = 'Create Audit';
    }
    if (globalSearchWorkpermit) {
      buttonName = 'Create Work Permit';
    }
    if (globalSearchPantry) {
      buttonName = 'Create Order';
    }
    if (globalSearchGP) {
      buttonName = 'Create Gate Pass';
    }
    if (globalSearchCommodity) {
      buttonName = 'Create Transaction';
    }
    if (globalSearchBMS) {
      buttonName = 'Create BMS Alarms';
    }
    return buttonName;
  };

  const getActionCode = () => {
    let actionCode = '';
    if (globalSearchAsset) {
      actionCode = 'Add an Asset';
    }
    if (globalSearchHelpdesk) {
      actionCode = 'Raise a ticket';
    }
    if (globalSearchSurvey) {
      actionCode = 'Add Survey';
    }
    if (globalSearchVMS) {
      actionCode = 'Create New Visit Request';
    }
    if (globalSearchEHS) {
      actionCode = 'Create EHS';
    }
    if (globalSearchIncident) {
      actionCode = 'Create Incident';
    }
    if (globalSearchBT) {
      actionCode = 'Add Breakdown Tracker';
    }
    if (globalSearchBC) {
      actionCode = 'Add Compliance Obligation';
    }
    if (globalSearchSLA) {
      actionCode = 'Add Breakdown Tracker';
    }
    if (globalSearchCT) {
      actionCode = 'Add Tracker';
    }
    if (globalSearchAudit) {
      actionCode = 'Add Breakdown Tracker';
    }
    if (globalSearchWorkpermit) {
      actionCode = 'Create Work Permit';
    }
    if (globalSearchPantry) {
      actionCode = 'Ordered';
    }
    if (globalSearchGP) {
      actionCode = 'Create Gate Pass';
    }
    if (globalSearchCommodity) {
      actionCode = 'Create Transaction';
    }
    if (globalSearchBMS) {
      actionCode = 'Create BMS Alarms';
    }
    return actionCode;
  };

  const getAddModule = () => {
    let addModule = '';
    if (globalSearchAsset) {
      addModule = (
        <AddEquipment
          afterReset={() => { onReset(); }}
          closeAddModal={() => { showAddModal(false); }}
          visibility={addModal}
        />
      );
    }
    if (globalSearchHelpdesk) {
      addModule = (
        <AddTicket editLink={addModal} randomProp={false} editIds={false} closeModal={() => showAddModal(false)} afterReset={onReset} isDrawer={false} />
      );
    }
    if (globalSearchSurvey) {
      addModule = (
        <AddSurvey
          closeModal={() => showAddModal(false)}
          afterReset={() => {
            onReset();
          }}
        />
      );
    }
    if (globalSearchEHS) {
      addModule = (
        <AddIncidentEHS
          editId={false}
          closeModal={() => showAddModal(false)}
          afterReset={() => { onReset(); }}
          isShow={addModal}
          addModal
        />
      );
    }
    if (globalSearchIncident) {
      addModule = (
        <AddIncident editIds={false} closeModal={() => showAddModal(false)} setEditLink={false} afterReset={onReset} isDrawer />
      );
    }
    if (globalSearchBT) {
      addModule = (
        <AddTracker
          isShow={addModal}
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
          addModal
        />
      );
    }
    if (globalSearchVMS) {
      addModule = (
        <AddVisitRequest
          editId={false}
          afterReset={() => { showAddModal(false); onReset(); }}
          change={false}
          nameKeyword=""
          visitorConfiguration={visitorConfiguration}
          partsData={false}
          isShow={addModal}
        />
      );
    }
    if (globalSearchBC) {
      addModule = (
        <AddCompliance
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
        />
      );
    }
    if (globalSearchSLA) {
      addModule = (
        <AddAudit
          editId={false}
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
          isShow={addModal}
          addModal
        />
      );
    }
    if (globalSearchCT) {
      addModule = (
        <AddCTracker
          editId={false}
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
          isShow={addModal}
          addModal
        />
      );
    }
    if (globalSearchAudit) {
      addModule = (
        <AddAuditSystem
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
        />
      );
    }
    if (globalSearchWorkpermit) {
      addModule = (
        <AddWorkPermit
          isShow={Math.random()}
          afterReset={() => { onReset(); }}
          closeModal={() => { showAddModal(false); }}
          visibility={addModal}
        />
      );
    }
    if (globalSearchPantry) {
      addModule = (
        <AddOrder
          editId={false}
          closeAddModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
          setAddModal={() => { onReset(); }}
          isShow={addModal}
          addModal
          partsData={partsData}
          setPartsData={setPartsData}
        />
      );
    }
    if (globalSearchGP) {
      addModule = (
        <AddGatePass closeModal={() => { showAddModal(false); }} afterReset={() => { onReset(); }} />
      );
    }
    if (globalSearchCommodity) {
      addModule = (
        <AddTransaction closeModal={onReset} addModal={addModal} />
      );
    }
    if (globalSearchBMS) {
      addModule = (
        <AddAlarm
          isShow={addModal}
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onReset(); }}
          addModal={addModal}
        />
      );
    }
    return addModule;
  };

  const getImageIcon = () => {
    let image = '';
    if (globalSearchAsset) {
      image = assetIcon;
    }
    if (globalSearchHelpdesk) {
      image = ticketIcon;
    }
    if (globalSearchWorkOrders) {
      image = ordersIcon;
    }
    if (globalSearchSurvey) {
      image = VisitRequest;
    }
    if (globalSearchVMS) {
      image = VisitRequest;
    }
    if (globalSearchEHS) {
      image = TrackerIcon;
    }
    if (globalSearchIncident) {
      image = TrackerIcon;
    }
    if (globalSearchBT) {
      image = TrackerIcon;
    }
    if (globalSearchBC) {
      image = complianceIcon;
    }
    if (globalSearchSLA) {
      image = TrackerIcon;
    }
    if (globalSearchCT) {
      image = TrackerCheck;
    }
    if (globalSearchAudit) {
      image = pantryOrderBlackIcon;
    }
    if (globalSearchWorkpermit) {
      image = workPermitBlack;
    }
    if (globalSearchPantry) {
      image = pantryOrderBlackIcon;
    }
    if (globalSearchGP) {
      image = GatepassBlack;
    }
    if (globalSearchCommodity) {
      image = CommodityIcon;
    }
    if (globalSearchBMS) {
      image = BMSIcon;
    }
    return image;
  };

  const getColumn1 = (listData) => {
    let columnData1 = '';
    if (globalSearchAsset) {
      columnData1 = listData.name;
    }
    if (globalSearchHelpdesk) {
      columnData1 = listData.ticket_number;
    }
    if (globalSearchWorkOrders) {
      columnData1 = listData.name;
    }
    if (globalSearchSurvey) {
      columnData1 = listData.title;
    }
    if (globalSearchVMS) {
      columnData1 = listData.visitor_name;
    }
    if (globalSearchEHS) {
      columnData1 = listData.reference;
    }
    if (globalSearchIncident) {
      columnData1 = listData.ticket_number;
    }
    if (globalSearchBT) {
      columnData1 = listData.name;
    }
    if (globalSearchBC) {
      columnData1 = listData.name;
    }
    if (globalSearchSLA) {
      columnData1 = listData.name;
    }
    if (globalSearchCT) {
      columnData1 = listData.name;
    }
    if (globalSearchAudit) {
      columnData1 = listData.name;
    }
    if (globalSearchWorkpermit) {
      columnData1 = listData.name;
    }
    if (globalSearchPantry) {
      columnData1 = listData.name;
    }
    if (globalSearchGP) {
      columnData1 = listData.description;
    }
    if (globalSearchCommodity) {
      columnData1 = getDefaultNoValue(extractTextObject(listData.commodity));
    }
    if (globalSearchBMS) {
      columnData1 = listData.subject;
    }
    return columnData1;
  };

  const getColumn2 = (listData) => {
    let columnData2 = '';
    if (globalSearchAsset) {
      columnData2 = listData && listData.location_id && listData.location_id.length && listData.location_id[1];
    }
    if (globalSearchHelpdesk) {
      columnData2 = listData.subject;
    }
    if (globalSearchWorkOrders) {
      columnData2 = listData.cause;
    }
    if (globalSearchSurvey) {
      columnData2 = getSurveyState(extractTextObject(listData.stage_id));
    }
    if (globalSearchVMS) {
      columnData2 = listData.type_of_visitor ? listData.type_of_visitor : '';
    }
    if (globalSearchEHS) {
      columnData2 = getDefaultNoValue(listData.name);
    }
    if (globalSearchIncident) {
      columnData2 = listData.subject ? listData.subject : '';
    }
    if (globalSearchBT) {
      columnData2 = getDefaultNoValue(extractTextObject(listData.service_category_id));
    }
    if (globalSearchBC) {
      columnData2 = getDefaultNoValue(getComplianceStateLabel(listData.state));
    }
    if (globalSearchSLA) {
      columnData2 = getDefaultNoValue(extractTextObject(listData.audit_template_id));
    }
    if (globalSearchCT) {
      columnData2 = getDefaultNoValue(extractTextObject(listData.tracker_template_id));
    }
    if (globalSearchAudit) {
      columnData2 = getDefaultNoValue(getStateLabel(listData.state));
    }
    if (globalSearchWorkpermit) {
      columnData2 = getDefaultNoValue(extractTextObject(listData.requestor_id));
    }
    if (globalSearchPantry) {
      columnData2 = listData.state ? listData.state : '';
    }
    if (globalSearchGP) {
      columnData2 = listData.type ? listData.type : '';
    }
    if (globalSearchCommodity) {
      columnData2 = getDefaultNoValue(listData.capacity);
    }
    if (globalSearchBMS) {
      columnData2 = getCompanyTimezoneDate(listData.generated_on, userInfo, 'datetime');
    }
    return columnData2;
  };

  const getColumn3 = (listData) => {
    let columnData3 = '';
    if (globalSearchAsset) {
      columnData3 = listData && listData.category_id && listData.category_id.length && listData.category_id[1];
    }
    if (globalSearchHelpdesk) {
      columnData3 = getCompanyTimezoneDate(listData.create_date, userInfo, 'datetime');
    }
    if (globalSearchWorkOrders) {
      columnData3 = getMTName(listData.maintenance_type);
    }
    if (globalSearchSurvey) {
      columnData3 = getCompanyTimezoneDate(listData.create_date, userInfo, 'datetime');
    }
    if (globalSearchVMS) {
      columnData3 = listData.company_id ? listData.company_id[1] : '';
    }
    if (globalSearchEHS) {
      columnData3 = getDefaultNoValue(getSlaStateLabel(listData.state));
    }
    if (globalSearchIncident) {
      columnData3 = getCompanyTimezoneDate(listData.create_date, userInfo, 'datetime');
    }
    if (globalSearchBT) {
      columnData3 = getDefaultNoValue(extractTextObject(listData.raised_by_id));
    }
    if (globalSearchBC) {
      columnData3 = getCompanyTimezoneDate(listData.create_date, userInfo, 'datetime');
    }
    if (globalSearchSLA) {
      columnData3 = getDefaultNoValue(getSlaStateLabelAudit(listData.state));
    }
    if (globalSearchCT) {
      columnData3 = getDefaultNoValue(getSlaStateLabelCT(listData.state));
    }
    if (globalSearchAudit) {
      columnData3 = getCompanyTimezoneDate(listData.create_date, userInfo, 'datetime');
    }
    if (globalSearchWorkpermit) {
      columnData3 = getDefaultNoValue(extractTextObject(listData.vendor_id));
    }
    if (globalSearchPantry) {
      columnData3 = getDefaultNoValue(extractTextObject(listData.employee_id));
    }
    if (globalSearchGP) {
      columnData3 = getDefaultNoValue(extractTextObject(listData.requestor_id));
    }
    if (globalSearchCommodity) {
      columnData3 = getDefaultNoValue(extractTextObject(listData.vendor_id));
    }
    if (globalSearchBMS) {
      columnData3 = getDefaultNoValue(listData.severity);
    }

    return columnData3;
  };

  const getRowData = (listData) => {
    let rowData = '';

    rowData = (
      <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
        <Col sm="4" md="4" lg="4" className="px-0 pl-3">
          <img
            aria-hidden="true"
            id="Add"
            alt="Add"
            width="10px"
            className="cursor-pointer mr-1"
            src={getImageIcon()}
          />
          {getColumn1(listData)}
        </Col>
        <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
          {getColumn2(listData)}
        </Col>
        <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
          {getColumn3(listData)}
        </Col>
      </Row>
    );
    return rowData;
  };

  const onAddData = () => {
    if (globalSearchAsset) {
      if (document.getElementById('assetForm')) {
        document.getElementById('assetForm').reset();
      }
    }
    if (globalSearchHelpdesk) {
      if (document.getElementById('checkoutForm')) {
        document.getElementById('checkoutForm').reset();
      }
    }
    if (globalSearchSurvey) {
      if (document.getElementById('surveyForm')) {
        document.getElementById('surveyForm').reset();
      }
    }
    if (globalSearchVMS) {
      if (document.getElementById('visitormanagementForm')) {
        document.getElementById('visitormanagementForm').reset();
      }
    }
    if (globalSearchEHS) {
      if (document.getElementById('hxIncidentform')) {
        document.getElementById('hxIncidentform').reset();
      }
    }
    if (globalSearchIncident) {
      if (document.getElementById('checkoutForm')) {
        document.getElementById('checkoutForm').reset();
      }
    }
    if (globalSearchBT) {
      if (document.getElementById('trackercheckoutForm')) {
        document.getElementById('trackercheckoutForm').reset();
      }
    }
    if (globalSearchBC) {
      if (document.getElementById('complianceForm')) {
        document.getElementById('complianceForm').reset();
      }
    }
    if (globalSearchSLA) {
      if (document.getElementById('slaAuditSystemform')) {
        document.getElementById('slaAuditSystemform').reset();
      }
    }
    if (globalSearchCT) {
      if (document.getElementById('consTrackform')) {
        document.getElementById('consTrackform').reset();
      }
    }
    if (globalSearchAudit) {
      if (document.getElementById('auditSystemform')) {
        document.getElementById('auditSystemform').reset();
      }
    }
    if (globalSearchWorkpermit) {
      if (document.getElementById('workpermitform')) {
        document.getElementById('workpermitform').reset();
      }
    }
    if (globalSearchPantry) {
      if (document.getElementById('pantryOrderForm')) {
        document.getElementById('pantryOrderForm').reset();
      }
    }
    if (globalSearchGP) {
      if (document.getElementById('gatePassForm')) {
        document.getElementById('gatePassForm').reset();
      }
    }
    if (globalSearchCommodity) {
      if (document.getElementById('configTransactionForm')) {
        document.getElementById('configTransactionForm').reset();
      }
    }
    if (globalSearchBMS) {
      if (document.getElementById('trackercheckoutForm')) {
        document.getElementById('trackercheckoutForm').reset();
      }
    }
    showAddModal(false);
  };

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <>
      {(ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length > 0) && (ninjaDashboard && ninjaDashboard.data)
        && (ninjaDashboardCode && !ninjaDashboardCode.loading && ninjaDashboard && !ninjaDashboard.loading) && (globalSearchAsset || globalSearchHelpdesk || globalSearchWorkOrders || globalSearchSurvey || globalSearchVMS || globalSearchEHS || globalSearchIncident || globalSearchBT || globalSearchBC || globalSearchSLA || globalSearchCT || globalSearchAudit || globalSearchWorkpermit || globalSearchPantry || globalSearchGP || globalSearchCommodity || globalSearchBMS) && (
        <>
          <TextField
            className="rounded-pill mt-2 padding-left-30px"
            id="asset-search"
            value={keyword}
            bsSize="sm"
            autoComplete="off"
            placeholder="Search Here"
            variant="standard"
            onClick={() => setSearchOpen(!searchOpen)}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <SearchIcon className={themes === 'light' ? 'light-mode-icon' : ''} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Popover trigger="legacy" className="search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
            <PopoverBody>
              <Row>
                <Nav>
                  <NavLink className="insights-nav-link">{getTabName()}</NavLink>
                </Nav>
              </Row>
              <hr className="mb-2 mt-1" />
              <>
                {loading && (
                <Loader />
                )}
                {listDataMultipleInfo && listDataMultipleInfo.err && (
                <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />
                )}
                {!loading && listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length && listDataMultipleInfo.data.map((listData) => (
                  <div key={listData.id} aria-hidden className="cursor-pointer" onClick={() => setData(listData)}>
                    {getRowData(listData)}
                  </div>
                ))}
                {keyword === '' || loading || pages === 0 ? (<span />) : (
                  <div className={`${classes.root} float-right`}>
                    <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
                  </div>
                )}
              </>
            </PopoverBody>
          </Popover>
          {allowedOperations.includes(actionCodes[getActionCode()]) && (
          <Button
            onClick={() => showAddModal(!addModal)}
            sx={{
              marginTop: '9px !important',
            }}
            type="button"
            variant="contained"
            className="header-create-btn"
          >
            {getButtonText()}
          </Button>
          )}
          <Drawer
            PaperProps={{
              sx: { width: '85%' },
            }}
            anchor="right"
            open={addModal}
          >

            <DrawerHeader
              headerName={getHeaderName()}
              imagePath={getImageIcon()}
              onClose={() => onAddData()}
            />
            {getAddModule()}
          </Drawer>
          <hr className="m-0 mt-1" />
        </>
      )}
      <DocumentViewer module={headerData?.moduleName} />
    </>
  );
};

Navbar.propTypes = {
  headerData: PropTypes.number.isRequired,
};

export default Navbar;
