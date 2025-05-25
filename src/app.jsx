/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, {
  useState, Suspense, lazy, useEffect,
} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { LoginCallback } from '@okta/okta-react';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';

import PageLoader from '@shared/pageLoader';
import ErrorContent from '@shared/errorContent';
import FallBackLoaderCoponent from '@shared/componentsLoading';
import ExternalComponentsLoading from '@shared/externalComponentsLoading';

import './app.scss';
import applicationDetails from './app/util/ClientDetails.json';
import AuthService from './app/util/authService';
import {
  getColumnArrayByIdCase,
  generateErrorMessage,
} from './app/util/appUtils';
import { NoInternetImage } from './app/themes/theme';

const Insightsoverview = lazy(() => import('./app/util/insightsOverView'));

const EmailRegistration = lazy(() => import('./app/registration/mailRegistration'));
const Dashboard = lazy(() => import('./app/dashboard/dashboard'));
const CompanyRegistration = lazy(() => import('./app/adminSetup/companyRegistration/companyRegistration'));
const ITAssetOverview = lazy(() => import('./app/itAsset/overview/assetOverview'));
const NotFound = lazy(() => import('./app/notFound'));
const AuthPending = lazy(() => import('./app/authPending'));
const AuthMobileUser = lazy(() => import('./app/authMobileUser'));
const EnergyOverView = lazy(() => import('./app/enery/energy-overview'));
const sixthFloorInsights = lazy(() => import('./app/enery/sixthFloorInsights'));
const seventhFloorInsights = lazy(() => import('./app/enery/seventhFloorInsights'));
const SldOverView = lazy(() => import('./app/enery/sld-overview'));
const EnergyMeter = lazy(() => import('./app/enery/energy-meter'));

const Restrooms = lazy(() => import('./app/restrooms/restrooms'));
const RestroomsSldOverview = lazy(() => import('./app/restrooms/restrooms-sld-overview'));
const IaqAnalyticsOverview = lazy(() => import('./app/iaq-dashboard/iaq-analytics-overview'));

const appConfig = require('./app/config/appConfig').default;

const OktaLogin = lazy(() => import('./app/oktaLogin/oktaLogin'));
const oktaLoginResponse = lazy(() => import('./app/oktaLogin/oktaLoginResponse'));
const awsResponse = lazy(() => import('./app/shared/awsToken'));
const Header = lazy(() => import('./app/core/header/header'));
const Footer = lazy(() => import('./app/core/footer'));
const Sidenav = lazy(() => import('./app/core/sidenav/sidenav'));
const InternalServerErr = lazy(() => import('./app/internalServerError/internalServerError'));

const Login = lazy(() => import('./app/auth/login'));
const AccountIdLogin = lazy(() => import('./app/auth/accountIdLogin'));

const VisitorPass = lazy(() => import('./app/visitorRequest/basicInfo'));
const CompanyVisitorPass = lazy(() => import('./app/companyLevelExternalVisitRequest/hostValidation'));
const HostVisitorPass = lazy(() => import('./app/visitRequestHost/basicInfo'));
const ExternalReport = lazy(() => import('./app/externalReport/externalReport'));
const VisitApproval = lazy(() => import('./app/visitorRequest/visitApproval'));
const WpApproval = lazy(() => import('./app/externalWorkPermit/publicWorkPermit'));
const PublicAudit = lazy(() => import('./app/publicAudit/basicInfo'));
const GatePassApproval = lazy(() => import('./app/externalGatePass/gatePassApproval'));

const SurveyForm = lazy(() => import('./app/feedback/basicInfo'));
const FeedbackForm = lazy(() => import('./app/feedbackSurvey/configuration'));

const teamMemberInvitation = lazy(() => import('./app/memberPasswordUpdate/basicInfo'));

const GetResetPasswordLink = lazy(() => import('./app/resetPassword/getResetPasswordLink'));
const CheckResetPasswordLink = lazy(() => import('./app/resetPassword/checkResetPasswordLink'));
const ResetPassword = lazy(() => import('./app/resetPassword/resetPassword'));
const AddTicket = lazy(() => import('./app/helpdesk/addTicketView'));
const DynamicTicketReport = lazy(() => import('./app/helpdesk/dynamicReport'));
const AddIncident = lazy(() => import('./app/incidentManagement/reportIncident'));
const AddFITTracker = lazy(() => import('./app/helpdesk/addTicket'));
const AddAsset = lazy(() => import('./app/assets/addAsset'));
const AssetMapView = lazy(() => import('./app/assets/mapView/mapView'));
const Spaces = lazy(() => import('./app/assets/viewSpace'));
const Equipments = lazy(() => import('./app/assets/equipments'));
const ItEquipments = lazy(() => import('./app/itAsset/assetSetup'));
const SpaceManagement = lazy(() => import('./app/spaceManagement/overview/spacemanagementOverview'));
const StyleGuide = lazy(() => import('./app/styleGuide/styleGuide'));
const UserProfile = lazy(() => import('./app/userProfile/userProfile'));
const Tickets = lazy(() => import('./app/helpdesk/tickets'));
const FITTracker = lazy(() => import('./app/fitTracker/fitTracker'));
const Incidents = lazy(() => import('./app/incidentManagement/incidents'));
const AnalyticsView = lazy(() => import('./app/analytics/analyticsView'));
const CompanySetup = lazy(() => import('./app/adminSetup/companySetup'));
const TeamSetup = lazy(() => import('./app/adminSetup/siteConfiguration/teamSetup'));
const SiteOverview = lazy(() => import('./app/adminSetup/overview/siteOverview'));
const MaintenanceSetup = lazy(() => import('./app/adminSetup/assetsLocationConfiguration/maintenance/maintenanceSegments'));
const Users = lazy(() => import('./app/adminSetup/companyConfiguration/adminUserListEditable'));
const AssetConfiguration = lazy(() => import('./app/adminSetup/assetConfiguration'));
const Workorders = lazy(() => import('./app/workorders/workorders'));
const PreventiveViewer = lazy(() => import('./app/preventiveMaintenance/viewer/ppmViewer'));
const PreventiveDynamicReport = lazy(() => import('./app/preventiveMaintenance/dynamicReport'));
const PreventiveOldViewer = lazy(() => import('./app/preventiveMaintenance/preventiveViewer'));
const PreventiveCancelRequests = lazy(() => import('./app/preventiveMaintenance/cancelRequests'));
const PreventiveCancelRequestsExternal = lazy(() => import('./app/preventiveMaintenance/cancelRequestsExternal'));
const PreventiveSchedule = lazy(() => import('./app/preventiveMaintenance/preventiveSchedule'));
const InspectionSchedule = lazy(() => import('./app/inspectionSchedule/inspectionSchedulers'));
const InspectionViewer = lazy(() => import('./app/inspectionSchedule/viewer/inspectionViewer'));
const InspectionDynamicReport = lazy(() => import('./app/inspectionSchedule/dynamicReport'));
const AddInspectionSchedule = lazy(() => import('./app/inspectionSchedule/addInspectionChecklist'));
const InspectionReports = lazy(() => import('./app/inspectionSchedule/inspectionReports'));
const InspectionCancelRequests = lazy(() => import('./app/inspectionSchedule/cancelRequests'));
const InspectionCancelRequestsExternal = lazy(() => import('./app/inspectionSchedule/cancelRequestsExternal'));
const InspectionOverview = lazy(() => import('./app/inspectionSchedule/overview/inspectionOverview'));
const AddPreventiveMaintenance = lazy(() => import('./app/preventiveMaintenance/addPreventiveMaintenance'));
const AddPPMs = lazy(() => import('./app/preventiveMaintenance/viewer/addPPMsNew'));
const AddPreventiveOperations = lazy(() => import(
  './app/preventiveMaintenance/preventiveOperations/addPreventiveOperations'
));
const AddPreventiveCheckList = lazy(() => import(
  './app/preventiveMaintenance/preventiveCheckList/addPreventiveCheckList'
));
const ReportsPreventive = lazy(() => import('./app/preventiveMaintenance/reports/reports'));
const ReportsAssets = lazy(() => import('./app/assets/reports/reportsView'));
const AssetDynamicReports = lazy(() => import('./app/assets/dynamicReport'));
const ReportsHelpdesk = lazy(() => import('./app/helpdesk/reports/reportsView'));
const ReportsFITTracker = lazy(() => import('./app/fitTracker/reports'));
const ReportsWorkorder = lazy(() => import('./app/workorders/reports/reports'));
const AddTools = lazy(() => import('./app/adminSetup/maintenanceConfiguration/addTools'));
const AddParts = lazy(() => import('./app/adminSetup/maintenanceConfiguration/addParts'));
const AddExpenses = lazy(() => import('./app/adminSetup/maintenanceConfiguration/addExpenses'));
const predictiveMintenance = lazy(() => import('./app/predictiveMaintenance/predictiveMaintenance'));
const Employees = lazy(() => import('./app/adminSetup/employees/employees'));
const PurchaseSetup = lazy(() => import('./app/purchase/purchaseSetup'));
const ReceiveProducts = lazy(() => import('./app/purchase/rfq/rfqDetails/receiveProducts/receiveProducts'));
const IotSystem = lazy(() => import('./app/staticPages/iotSystem'));
const EnergyManagement = lazy(() => import('./app/staticPages/energyManagement'));
const Washroom = lazy(() => import('./app/staticPages/smartWashroom'));
const WashroomDynamicReport = lazy(() => import('./app/staticPages/dynamicReport'));
const WashroomAnalytics = lazy(() => import('./app/staticPages/smartWashroomAnalytics'));
const ExternalApproval = lazy(() => import('./app/incidentBooking/externalApproval'));

const IaqDashboards = lazy(() => import('./app/iaq-dashboard/dashboard'));
const ReOrderingRules = lazy(() => import('./app/purchase/products/reorderingRules/reOrderingRules'));
const RequestForQuotation = lazy(() => import('./app/purchase/rfq/rfq'));
const PurchaseRequest = lazy(() => import('./app/purchase/purchaseRequest/purchaseRequest'));
const PurchaseOrders = lazy(() => import('./app/purchase/purchaseOrder/purchaseOrder'));
const PurchaseAgreements = lazy(() => import('./app/purchase/purchaseAgreement/purchaseAgreement'));
const Vendors = lazy(() => import('./app/purchase/vendors/vendors'));
const Products = lazy(() => import('./app/purchase/products/products'));
const InventoryOverview = lazy(() => import('./app/inventory/operationsSetup'));
const AssetReadingsLog = lazy(() => import('./app/assets/assetDetails/readingsLog'));
const InventoryReports = lazy(() => import('./app/inventory/reportsSetup'));
const BuildingCompliance = lazy(() => import('./app/buildingCompliance/buildingCompliance'));
const BuildingComplianceTemplates = lazy(() => import('./app/buildingCompliance/templates'));
const BuildingComplianceReports = lazy(() => import('./app/buildingCompliance/reports/reports'));
const VisitorManagement = lazy(() => import('./app/visitorManagement/visitRequest'));

const InventoryConfiguration = lazy(() => import('./app/inventory/configuration/configurationSetup'));
const Survey = lazy(() => import('./app/survey/survey'));
const SurveyDynamicReport = lazy(() => import('./app/survey/dynamicReport'));
const PantryOrders = lazy(() => import('./app/pantryManagement/orders'));
const PantryConfiguration = lazy(() => import('./app/pantryManagement/configuration/configurationSetup'));
const PantryReports = lazy(() => import('./app/pantryManagement/reports/reportSetup'));
const MailRoomOperations = lazy(() => import('./app/mailroomManagement/operations/operationsSetup'));
const MailRoomReports = lazy(() => import('./app/mailroomManagement/reports/reports'));
const upsSummary = lazy(() => import('./app/consumptionDashboards/upsSummary'));
const oneTwentyKvaUps = lazy(() => import('./app/consumptionDashboards/120KvaUps'));
const twentyKvaUps1 = lazy(() => import('./app/consumptionDashboards/20kvaUps#1'));
const twentyKvaUps2 = lazy(() => import('./app/consumptionDashboards/20kvaUps#2'));
const WorkPermitConfiguration = lazy(() => import('./app/workPermit/configration/configuration'));
const CommodityTransactionOperations = lazy(() => import('./app/commodityTransactions/operations/operationsSetup'));
const CommodityTransactionReports = lazy(() => import('./app/commodityTransactions/reports/reports'));
const WorkPermit = lazy(() => import('./app/workPermit/workPermit'));
const AuditOperations = lazy(() => import('./app/auditSystem/operations/operationSetup'));
const JumpLogin = lazy(() => import('./app/auth/jumpLogin'));
const GatePasses = lazy(() => import('./app/gatePass/gatePasses'));
const SiteOnBoardingOverview = lazy(() => import('./app/siteOnboarding/overview/overview'));
const SiteOnBoarding = lazy(() => import('./app/siteOnboarding/siteOnboarding'));
const BreakdownTracker = lazy(() => import('./app/breakdownTracker/breakdownTracker'));
const BmsAlarms = lazy(() => import('./app/bmsAlarms/bmsAlarms'));
const EnergyDashboard = lazy(() => import('./app/dashboard/energyDashboard'));
const BookingLayout = lazy(() => import('./app/booking/createBooking/bookingLayout'));
const AdminMaintenance = lazy(() => import('./app/adminMaintenance/adminMaintenance'));
const BookingManagement = lazy(() => import('./app/adminMaintenance/bookingManagement/adminMaintenance'));
const MyBookings = lazy(() => import('./app/myBookings/myBookings'));
const hrEmployees = lazy(() => import('./app/employees/employees'));
const SpaceManagementView = lazy(() => import('./app/spaceManagement/spaceManagement'));
const HspaceDashboard = lazy(() => import('./app/hspacedashboard/dashboard'));
const OneQR = lazy(() => import('./app/externalOneQR/externalOneQR'));
const AttendanceOverview = lazy(() => import('./app/attendanceLogs/attendanceOverView/attendanceOverview'));
const Attendance = lazy(() => import('./app/attendanceLogs/attendance'));
const Teams = lazy(() => import('./app/hrUsers/teams/teams'));
const TeamMembers = lazy(() => import('./app/hrUsers/teamMembers/teamMembers'));
const SlaAudits = lazy(() => import('./app/slaAudit/audits'));
const SiteAdmin = lazy(() => import('./app/adminSetup/companyConfiguration/sitesList/adminSitesListEditable'));

const ConsumptionTrackers = lazy(() => import('./app/consumptionTracker/trackers'));
const ConsumptionReports = lazy(() => import('./app/consumptionTracker/reports/reports'));

const HxIncidents = lazy(() => import('./app/incidentBooking/incidents'));
const ESGTracker = lazy(() => import('./app/esg/esgTracker'));
const ESGDynamicReports = lazy(() => import('./app/esg/dynamicReport'));
const EsgOverview = lazy(() => import('./app/esg/overview'));
const OccupancyDashboard = lazy(() => import('./app/occupancy/dashboard'));

const PantryOrder = lazy(() => import('./app/externalPantry/basicInfo'));

const EnergyDynamicReport = lazy(() => import('./app/enery/dynamicReport'));

const WasteTrackers = lazy(() => import('./app/waste/wasteTrackers'));

const ReportsWaste = lazy(() => import('./app/waste/reports/reportsView'));

const WasteTrackersOverView = lazy(() => import('./app/waste/overview/overview'));

const CxoSummary = lazy(() => import('./app/cxoAnalytics/summary'));

const CxoEntry = lazy(() => import('./app/cxoAnalytics/dataEntry'));

const ExternalPPM = lazy(() => import('./app/externalPPM/ppmSummary'));

const HazardOverview = lazy(() => import('./app/hazards/overview/overview'));
const EhsHazards = lazy(() => import('./app/hazards/incidents'));

const AttendaceReports = lazy(() => import('./app/attendanceLogs/reports/reportsView'));

const Audits = lazy(() => import('./app/auditManagement/audits'));
const AuditActions = lazy(() => import('./app/auditManagement/auditActions'));
const AuditReports = lazy(() => import('./app/auditManagement/auditReports'));
const AuditConfiguration = lazy(() => import('./app/auditManagement/configurationSegments'));
const ResponsiveAudit = lazy(() => import('./app/auditManagement/auditDetails/responsiveAudit'));
const Submenu = lazy(() => import('./app/sustanablity/Submenu'));
const EsgEnvironmentOverview = lazy(() => import('./app/sustanablity/overview/overview'));
const SocialOverview = lazy(() => import('./app/sustanablity/overview/socialOverview'));
const GoveranceOverview = lazy(() => import('./app/sustanablity/overview/goveranceOverview'));

const App = () => {
  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const serverError = authService.getServerError();
  const sessionExpiry = '1'; // authService.getSessionExpiry();
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);

  const [themeUrl, setThemeUrl] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authServiceInstance = AuthService();
    const currentRefreshToken = authServiceInstance.getRefreshToken();
    const publicPathsForBypassCheck = ['/bypassLogin', '/login', '/accountlogin', '/okta-login', '/aws/callback'];

    if (!currentRefreshToken) {
      if (!publicPathsForBypassCheck.some(path => window.location.pathname.includes(path))) {
        window.location.href = '/bypassLogin';
        // If we redirect, we might not want to immediately setLoading(false) here,
        // as the page will change. However, for simplicity and to ensure it's set if no redirect occurs:
        setLoading(false); 
        return; // Early exit after redirect
      }
    }
    
    setLoading(false); // Simulate loading time or set after checks
  }, []);

  const menuNames = getColumnArrayByIdCase(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'name',
  );
  const allowedPages = [];
  const isBookingDasboard = appConfig.SHOW_BOOKING_DASHBOARD;

  const routeMap = {
    inventory: Insightsoverview,
    'building compliance': Insightsoverview,
    hazards: HazardOverview,
    'cxo analytics': CxoSummary,
    'visitor management': Insightsoverview,
    survey: Insightsoverview,
    helpdesk: Insightsoverview,
    'asset registry': Insightsoverview,
    'smart washroom': Washroom,
    'work permit': Insightsoverview,
    'work orders': Insightsoverview,
    energy: EnergyOverView,
    restrooms: Restrooms,
    esg: ESGTracker,
    occupancy: OccupancyDashboard,
    '52 week ppm': Insightsoverview,
    'inspection schedule': Insightsoverview,
    'bms alarms': Insightsoverview,
  };

  const moduleMap = {
    'building compliance': 'Building Compliance',
    'visitor management': 'Visitor Management',
    survey: 'Survey',
    helpdesk: 'Helpdesk',
    'asset registry': 'Asset Registry',
    'work permit': 'Work Permit',
    'work orders': 'Work Orders',
    '52 week ppm': '52 Week PPM',
    'inspection schedule': 'Inspection Schedule',
  };

  // Function to determine routePath based on menuNames
  const determineRoutePath = (menu) => {
    // Iterate over the menuNames array
    if (menu && routeMap[menu]) {
      return routeMap[menu];
    }
    // Default route if no menu names match
    return Dashboard;
  };

  // Function to determine routePath based on menuNames
  const determineModulePath = (menu) => {
    // Iterate over the menuNames array
    if (menu && moduleMap[menu]) {
      return moduleMap[menu];
    }
    // Default route if no menu names match
    return '';
  };

  const isParentSite = userInfo
    && userInfo.data
    && userInfo.data.company
    && userInfo.data.company.is_parent;
  const pagesList = [
    {
      id: 1,
      path: '/',
      routePath: menuNames.includes('hspace - home')
        ? HspaceDashboard
        : menuNames.includes('home')
          ? Dashboard
          : determineRoutePath(menuNames && menuNames.length ? menuNames[0] : ''),
      module: determineModulePath(menuNames && menuNames.length ? menuNames[0] : ''),
    },
    { id: 2, path: '/style-guide', routePath: StyleGuide },
    { id: 22, path: '/user-profile', routePath: UserProfile },
    {
      id: 27,
      path: '/predictive-maintenance',
      routePath: predictiveMintenance,
    },
  ];

  if (menuNames.includes('admin setup')) {
    /* pagesList.push({
      id: 3,
      path: "/site-configuration",
      routePath: CompanySetup,
    }); */
    pagesList.push({
      id: 311,
      path: '/setup-overview',
      routePath: SiteOverview,
    });
    pagesList.push({
      id: 312,
      path: '/setup-facility',
      routePath: CompanySetup,
    });
    pagesList.push({
      id: 313,
      path: '/setup-team-management',
      routePath: TeamSetup,
    });
    pagesList.push({
      id: 314,
      path: '/setup-users',
      routePath: Users,
    });
    pagesList.push({
      id: 314,
      path: '/setup-site',
      routePath: SiteAdmin,
    });
    pagesList.push({
      id: 20,
      path: '/asset-configuration',
      routePath: AssetConfiguration,
    });
    pagesList.push({
      id: 21,
      path: '/setup-maintenance-configuration',
      routePath: MaintenanceSetup,
    });
    pagesList.push({
      id: 23,
      path: '/maintenance-configuration/add-tools',
      routePath: AddTools,
    });
    pagesList.push({
      id: 24,
      path: '/maintenance-configuration/add-parts',
      routePath: AddParts,
    });
    pagesList.push({
      id: 87,
      path: '/maintenance-configuration/add-expenses',
      routePath: AddExpenses,
    });
    pagesList.push({
      id: 88,
      path: '/maintenance-configuration/edit-expenses/:editId',
      routePath: AddExpenses,
    });
    pagesList.push({
      id: 18,
      path: '/maintenance-configuration/add-operations',
      routePath: AddPreventiveOperations,
    });
    pagesList.push({
      id: 35,
      path: '/maintenance-configuration/edit-operations/:editId',
      routePath: AddPreventiveOperations,
    });
    pagesList.push({
      id: 19,
      path: '/maintenance-configuration/add-checklist',
      routePath: AddPreventiveCheckList,
    });
    pagesList.push({
      id: 34,
      path: '/maintenance-configuration/edit-checklist/:editId',
      routePath: AddPreventiveCheckList,
    });
  }

  if (menuNames.includes('inventory')) {
    pagesList.push({
      id: 39,
      path: '/inventory-overview/inventory/operations',
      routePath: InventoryOverview,
    });
    pagesList.push({
      id: 45,
      path: '/inventory-overview/inventory/reports',
      routePath: InventoryReports,
    });
    pagesList.push({
      id: 144,
      path: '/inventory-overview/inventory/products',
      routePath: Products,
    });
    pagesList.push({
      id: 53,
      path: '/inventory-overview/inventory/configurations',
      routePath: InventoryConfiguration,
    });
    pagesList.push({
      id: 153,
      path: '/inventory-overview',
      routePath: Insightsoverview,
      module: 'Inventory',
    });
  }

  if (menuNames.includes('purchase')) {
    pagesList.push({ id: 28, path: '/purchase', routePath: PurchaseSetup });
    pagesList.push({
      id: 29,
      path: '/purchase/requestforquotation/receiveProducts/:id',
      routePath: ReceiveProducts,
    });
    pagesList.push({
      id: 30,
      path: '/purchase/purchaseorder/receiveProducts/:id',
      routePath: ReceiveProducts,
    });
    pagesList.push({
      id: 31,
      path: '/purchase/products/reordering-rules/:id',
      routePath: ReOrderingRules,
    });
    pagesList.push({
      id: 40,
      path: '/purchase/requestforquotation',
      routePath: RequestForQuotation,
    });
    pagesList.push({
      id: 41,
      path: '/purchase/purchaserequest',
      routePath: PurchaseRequest,
    });
    pagesList.push({
      id: 42,
      path: '/purchase/purchaseorders',
      routePath: PurchaseOrders,
    });
    pagesList.push({
      id: 42,
      path: '/purchase/purchaseagreements',
      routePath: PurchaseAgreements,
    });
    pagesList.push({ id: 43, path: '/purchase/vendors', routePath: Vendors });
    pagesList.push({ id: 44, path: '/purchase/products', routePath: Products });
  }

  if (menuNames.includes('building compliance')) {
    pagesList.push({
      id: 46,
      path: '/buildingcompliance-overview',
      routePath: Insightsoverview,
      module: 'Building Compliance',
    });
    pagesList.push({
      id: 47,
      path: '/buildingcompliance',
      routePath: BuildingCompliance,
    });
    pagesList.push({ id: 477, path: '/buildingcompliance/templates', routePath: BuildingComplianceTemplates });
    pagesList.push({
      id: 488,
      path: '/buildingcompliance/reports',
      routePath: BuildingComplianceReports,
    });
  }

  if (menuNames.includes('waste tracker')) {
    pagesList.push({
      id: 'waste_01',
      path: '/waste-overview',
      routePath: WasteTrackersOverView,
    });
    pagesList.push({
      id: 'waste_02',
      path: '/waste-trackers',
      routePath: WasteTrackers,
    });
    pagesList.push({
      id: 'waste_03',
      path: '/waste-reports',
      routePath: ReportsWaste,
    });
  }

  if (menuNames.includes('hazards')) {
    pagesList.push({
      id: 'hazard_01',
      path: '/hazard-overview',
      routePath: HazardOverview,
    });
    pagesList.push({
      id: 'hazard_02',
      path: '/ehs-hazards',
      routePath: EhsHazards,
    });
  }

  if (menuNames.includes('cxo analytics')) {
    pagesList.push({
      id: 'cxo_01',
      path: '/cxo-summary',
      routePath: CxoSummary,
    });
    pagesList.push({
      id: 'cxo_02',
      path: '/cxo-entry',
      routePath: CxoEntry,
    });
  }

  if (menuNames.includes('visitor management')) {
    pagesList.push({
      id: 48,
      path: '/visitormanagement-overview',
      routePath: Insightsoverview,
      module: 'Visitor Management',
    });
    pagesList.push({
      id: 49,
      path: '/visitormanagement/visitrequest',
      routePath: VisitorManagement,
    });
    pagesList.push({
      id: 60,
      path: '/visitorpass/:uuid',
      routePath: VisitorPass,
    });
    pagesList.push({
      id: 61,
      path: '/visitapproval/:uuid',
      routePath: VisitApproval,
    });
  }

  if (menuNames.includes('survey')) {
    pagesList.push({
      id: 62,
      path: '/survey-overview',
      routePath: Insightsoverview,
      module: 'Survey',
      moduleDynamicPath: '/survey/dynamic-report',
    });
    pagesList.push({ id: 63, path: '/survey', routePath: Survey });
    pagesList.push({ id: 64, path: '/survey/:uuid', routePath: SurveyForm });
    pagesList.push({ id: 65, path: '/survey/dynamic-report/:submenu', routePath: SurveyDynamicReport });
  }

  if (menuNames.includes('analytics')) {
    pagesList.push({ id: 4, path: '/analytics', routePath: AnalyticsView });
  }

  if (menuNames.includes('attendance logs')) {
    pagesList.push({
      id: 4,
      path: '/attendance-overview',
      routePath: AttendanceOverview,
    });
    pagesList.push({ id: 50, path: '/attendance', routePath: Attendance });
    pagesList.push({ id: 52, path: '/attendance/reports', routePath: AttendaceReports });
  }

  if (menuNames.includes('helpdesk')) {
    pagesList.push(
      {
        id: 5,
        path: '/helpdesk-insights-overview',
        routePath: Insightsoverview,
        module: 'Helpdesk',
        moduleDynamicPath: '/helpdesk-insights-overview/helpdesk/dynamic-report',
      },
      {
        id: 6,
        path: '/helpdesk-insights-overview/helpdesk/tickets',
        routePath: Tickets,
      },
      {
        id: 7,
        path: '/helpdesk-insights-overview/helpdesk/add-ticket',
        routePath: AddTicket,
      },
      {
        id: 8,
        path: '/helpdesk-insights-overview/helpdesk/dynamic-report/:submenu',
        routePath: DynamicTicketReport,
      },
      {
        id: 33,
        path: '/helpdesk-insights-overview/helpdesk/edit-ticket/:editId',
        routePath: AddTicket,
      },
      {
        id: 26,
        path: '/helpdesk-insights-overview/helpdesk/reports',
        routePath: ReportsHelpdesk,
      },
      {
        id: 84,
        path: '/helpdesk-insights-overview/ticket/:uuid',
        routePath: ExternalReport,
      },
    );
  }
  if (menuNames.includes('fit tracker')) {
    pagesList.push(
      {
        id: 515,
        path: '/fitTracker-overview',
        routePath: Insightsoverview,
        module: 'FIT Tracker',
      },
      { id: 516, path: '/fitTracker/tickets', routePath: FITTracker },
      { id: 517, path: '/fitTracker/add-ticket', routePath: AddFITTracker },
      {
        id: 518,
        path: '/fitTracker/edit-ticket/:editId',
        routePath: AddFITTracker,
      },
      { id: 519, path: '/fitTracker/reports', routePath: ReportsFITTracker },
    );
  }

  if (menuNames.includes('incident management')) {
    pagesList.push(
      {
        id: 54,
        path: '/incident-overview',
        routePath: Insightsoverview,
        module: 'Incident Management',
      },
      { id: 55, path: '/incident/incidents', routePath: Incidents },
      { id: 56, path: '/incident/report-incident', routePath: AddIncident },
      {
        id: 57,
        path: '/incident/report-incident/:editId',
        routePath: AddIncident,
      },
    );
  }

  if (menuNames.includes('asset registry')) {
    pagesList.push(
      {
        id: 8,
        path: '/asset-overview',
        routePath: Insightsoverview,
        module: 'Asset Registry',
        moduleDynamicPath: '/asset-overview/dynamic-report',
      },
      { id: 202, path: '/asset-overview/dynamic-report/:submenu', routePath: AssetDynamicReports },
      { id: 9, path: '/asset-overview/equipments', routePath: Equipments },
      { id: 10, path: '/asset-overview/add-asset', routePath: AddAsset },
      { id: 11, path: '/asset-overview/locations', routePath: Spaces },
      { id: 25, path: '/asset-overview/reports', routePath: ReportsAssets },
      { id: 201, path: '/asset-overview/mapview', routePath: AssetMapView },
      { id: 30, path: '/iot-system', routePath: IotSystem },
      { id: 31, path: '/energy-management', routePath: EnergyManagement },
      {
        id: 40,
        path: '/asset/readings-log/:editId',
        routePath: AssetReadingsLog,
      },
    );
  }

  if (menuNames.includes('smart washroom')) {
    pagesList.push(
      { id: 32, path: '/smart-clean', routePath: Washroom },
      {
        id: 34,
        path: '/smart-clean/smartwashroom-analytics',
        routePath: WashroomAnalytics,
      },
      { id: 35, path: '/smart-clean/dynamic-report/:submenu', routePath: WashroomDynamicReport },
    );
  }

  if (menuNames.includes('iaq dashboard')) {
    pagesList.push(
      { id: 3, path: '/iaq-dashboard', routePath: IaqDashboards },
      {
        id: 4,
        path: '/iaq-dashboard/iaq-analytics-overview',
        routePath: IaqAnalyticsOverview,
      },
    );
  }
  if (menuNames.includes('it asset management')) {
    pagesList.push(
      { id: 101, path: '/itasset-overview', routePath: ITAssetOverview },
      { id: 102, path: '/itasset/equipments', routePath: ItEquipments },
    );
  }

  if (menuNames.includes('work permit')) {
    pagesList.push(
      {
        id: 101,
        path: '/workpermit-overview',
        routePath: Insightsoverview,
        module: 'Work Permit',
      },
      { id: 102, path: '/workpermits', routePath: WorkPermit },
      {
        id: 103,
        path: '/workpermits-configuration',
        routePath: WorkPermitConfiguration,
      },
      { id: 108, path: '/workpermits/:uuid', routePath: WorkPermit },
      { id: 109, path: '/wp/:suuid/:ruuid', routePath: WpApproval },
    );
    pagesList.push({
      id: 205,
      path: '/workpermits-configuration/add-checklist',
      routePath: AddPreventiveCheckList,
    });
    pagesList.push({
      id: 206,
      path: '/workpermits-configuration/edit-checklist/:editId',
      routePath: AddPreventiveCheckList,
    });
  }

  if (menuNames.includes('hspace - space management')) {
    pagesList.push({
      id: 12,
      path: '/spaceManagement-overview',
      routePath: SpaceManagement,
    });
    if (!isParentSite) {
      pagesList.push({
        id: 12,
        path: '/hspace-home',
        routePath: HspaceDashboard,
      });
      pagesList.push({
        id: 5,
        path: '/space-management',
        routePath: SpaceManagementView,
      });
      pagesList.push(
        { id: 403, path: '/booking-maintenance', routePath: AdminMaintenance },
        { id: 404, path: '/booking-management', routePath: BookingManagement },
      );
      pagesList.push({
        id: 407,
        path: '/hr/employees',
        routePath: hrEmployees,
      });
      pagesList.push({ id: 401, path: '/mybookings', routePath: MyBookings });
      pagesList.push({
        id: 402,
        path: '/booking-layout',
        routePath: BookingLayout,
      });
    }
  }

  if (menuNames.includes('work orders')) {
    pagesList.push(
      {
        id: 13,
        path: '/workorders-overview',
        routePath: Insightsoverview,
        module: 'Work Orders',
      },
      { id: 14, path: '/maintenance/workorders', routePath: Workorders },
      {
        id: 901,
        path: '/maintenance/workorders/:viewId',
        routePath: Workorders,
      },
      { id: 24, path: '/workorders/reports', routePath: ReportsWorkorder },
    );
  }

  if (menuNames.includes('pantry management')) {
    pagesList.push(
      { id: 80, path: '/pantry/orders', routePath: PantryOrders },
      {
        id: 81,
        path: '/pantry-overview',
        routePath: Insightsoverview,
        module: 'Pantry Management',
      },
      { id: 82, path: '/pantry/configuration', routePath: PantryConfiguration },
      {
        id: 83,
        path: '/pantry/configuration/add-products',
        routePath: AddParts,
      },
      { id: 85, path: '/pantry/reports', routePath: PantryReports },
    );
  }

  if (menuNames.includes('52 week ppm')) {
    pagesList.push(
      {
        id: 666,
        path: '/preventive-overview',
        routePath: Insightsoverview,
        module: '52 Week PPM',
        moduleDynamicPath: '/preventive-overview/dynamic-report',
      },
      {
        id: 15,
        path: '/preventive-overview/preventive-viewer',
        routePath: PreventiveViewer,
      },
      {
        id: 667,
        path: '/preventive-overview/add-ppms',
        routePath: AddPPMs,
      },
      {
        id: 655,
        path: '/preventive-overview/dynamic-report/:submenu',
        routePath: PreventiveDynamicReport,
      },
      {
        id: 654,
        path: '/preventive-overview/preventive-calendar',
        routePath: PreventiveOldViewer,
      },
      {
        id: 16,
        path: '/preventive-overview/preventive/add-ppm',
        routePath: AddPreventiveMaintenance,
      },
      {
        id: 36,
        path: '/preventive-overview/preventive/edit-ppm/:editId',
        routePath: AddPreventiveMaintenance,
      },
      {
        id: 17,
        path: '/preventive-overview/preventive-schedule',
        routePath: PreventiveSchedule,
      },
      {
        id: 23,
        path: '/preventive-overview/preventive/reports',
        routePath: ReportsPreventive,
      },
      {
        id: 677,
        path: '/52week/prepone/approval/:uuid',
        routePath: PreventiveViewer,
      },
      {
        id: 680,
        path: '/ppm-overview/ppm-viewer/:uuid',
        routePath: PreventiveViewer,
      },
      {
        id: 678,
        path: '/52week/bulkcancel/approval/:uuid',
        routePath: PreventiveCancelRequestsExternal,
      },
      {
        id: 679,
        path: '/preventive-overview/cancel-requests',
        routePath: PreventiveCancelRequests,
      },
    );
  }

  if (menuNames.includes('inspection schedule')) {
    pagesList.push(
      {
        id: 70,
        path: '/inspection-overview',
        routePath: InspectionOverview,
        module: 'Inspection Schedule',
        moduleDynamicPath: '/inspection-overview/inspection/dynamic-report',
      },
      {
        id: 71,
        path: '/inspection-overview/inspection/add-inspection',
        routePath: AddInspectionSchedule,
      },
      {
        id: 72,
        path: '/inspection-overview/inspection/edit-inspection/:editId',
        routePath: AddInspectionSchedule,
      },
      {
        id: 73,
        path: '/inspection-overview/inspection-schedule',
        routePath: InspectionSchedule,
      },
      {
        id: 701,
        path: '/inspection-overview/inspection-viewer',
        routePath: InspectionViewer,
      },
      {
        id: 702,
        path: '/inspection-overview/inspection-viewer/:uuid',
        routePath: InspectionViewer,
      },
      {
        id: 787,
        path: '/inspection-overview/cancel-requests',
        routePath: InspectionCancelRequests,
      },
      {
        id: 74,
        path: '/inspection-overview/inspection/reports',
        routePath: InspectionReports,
      },
      {
        id: 75,
        path: '/inspection-overview/inspection/dynamic-report/:submenu',
        routePath: InspectionDynamicReport,
      },
      {
        id: 788,
        path: '/hxinspection/bulkcancel/approval/:uuid',
        routePath: InspectionCancelRequestsExternal,
      },
    );
  }

  if (menuNames.includes('hr settings')) {
    pagesList.push({ id: 21, path: '/hr/employees', routePath: Employees });
  }

  if (menuNames.includes('mail room management')) {
    pagesList.push({
      id: 801,
      path: '/mailroom-overview',
      routePath: Insightsoverview,
      module: 'Mail Room Management',
    });
    pagesList.push({
      id: 802,
      path: '/mailroom/operations',
      routePath: MailRoomOperations,
    });
    pagesList.push({
      id: 803,
      path: '/mailroom/reports',
      routePath: MailRoomReports,
    });
  }

  if (menuNames.includes('commodity transactions')) {
    pagesList.push({
      id: 804,
      path: '/commodity-overview',
      routePath: Insightsoverview,
      module: 'Commodity Transactions',
    });
    pagesList.push({
      id: 805,
      path: '/commodity/operations',
      routePath: CommodityTransactionOperations,
    });
    pagesList.push({
      id: 806,
      path: '/commodity/reports',
      routePath: CommodityTransactionReports,
    });
  }

  if (menuNames.includes('ups')) {
    pagesList.push({
      id: 803,
      path: '/ups-summary-overview',
      routePath: upsSummary,
    });
    pagesList.push({
      id: 803,
      path: '/ups-summary-overview/120-kva-ups-overview',
      routePath: oneTwentyKvaUps,
    });
    pagesList.push({
      id: 803,
      path: '/ups-summary-overview/120-kva-ups1-overview',
      routePath: twentyKvaUps1,
    });
    pagesList.push({
      id: 803,
      path: '/ups-summary-overview/120-kva-ups2-overview',
      routePath: twentyKvaUps2,
    });
  }
  if (menuNames.includes('audit system')) {
    pagesList.push(
      {
        id: 501,
        path: '/audit-overview',
        routePath: Insightsoverview,
        module: 'Audit System',
      },
      { id: 502, path: '/audit-operations', routePath: AuditOperations },
    );
  }

  if (menuNames.includes('audit management')) {
    pagesList.push(
      {
        id: 301,
        path: '/audit-management-overview',
        routePath: Insightsoverview,
        module: 'Audit Management',
      },
      { id: 302, path: '/audits', routePath: Audits },
      { id: 303, path: '/audits/configuration', routePath: AuditConfiguration },
      { id: 304, path: '/audit/reports', routePath: AuditReports },
      { id: 305, path: '/audits/actions', routePath: AuditActions },
      { id: 306, path: '/audit-checklists/perform/:uuid', routePath: ResponsiveAudit },
    );
  }

  if (menuNames.includes('gate pass')) {
    pagesList.push(
      {
        id: 503,
        path: '/gatepass-overview',
        routePath: Insightsoverview,
        module: 'Gate Pass',
      },
      { id: 504, path: '/gatepasses', routePath: GatePasses },
    );
  }
  if (menuNames.includes('configuration')) {
    pagesList.push(
      { id: 505, path: '/configuration/overview', routePath: SiteOnBoardingOverview },
      { id: 506, path: '/configuration/sites', routePath: SiteOnBoarding },
    );
  }
  if (menuNames.includes('bms alarms')) {
    pagesList.push(
      {
        id: 207, path: '/bms-alarms-overview', routePath: Insightsoverview, module: 'BMS Alarms',
      },
      { id: 208, path: '/bms-alarms', routePath: BmsAlarms },
    );
  }

  if (menuNames.includes('breakdown tracker')) {
    pagesList.push(
      {
        id: 507,
        path: '/breakdown-overview',
        routePath: Insightsoverview,
        module: 'Breakdown Tracker',
      },
      { id: 508, path: '/breakdown-tracker', routePath: BreakdownTracker },
    );
  }

  if (menuNames.includes('dashboards')) {
    pagesList.push({ id: 583, path: '/energy', routePath: EnergyDashboard });
  }

  if (menuNames.includes('hspace - my bookings') && !isParentSite) {
    // allowedPages.push("/bookings", "/booking-layout");
    pagesList.push({ id: 401, path: '/mybookings', routePath: MyBookings });
    pagesList.push({
      id: 402,
      path: '/booking-layout',
      routePath: BookingLayout,
    });
  }

  if (menuNames.includes('hspace - hr settings') && !isParentSite) {
    // allowedPages.push("/hr/employees");
    pagesList.push({ id: 407, path: '/hr/employees', routePath: hrEmployees });
  }

  if (menuNames.includes('hspace - maintenance') && !isParentSite) {
    // allowedPages.push("/maintenance", "/booking-management");
    pagesList.push(
      { id: 403, path: '/booking-maintenance', routePath: AdminMaintenance },
      { id: 404, path: '/booking-management', routePath: BookingManagement },
    );
  }

  /* if (menuNames.includes("air quality monitoring")) {
    pagesList.push(
      { id: 513, path: "/airquality-overview", routePath: SchoolDashboard },
      { id: 514, path: "/airquality-dashboard/:uuid", routePath: IaqDashboard }
    );
  } */

  if (menuNames.includes('users')) {
    pagesList.push(
      { id: 513, path: '/teams', routePath: Teams },
      { id: 514, path: '/team-members', routePath: TeamMembers },
    );
  }

  if (menuNames.includes('sla-kpi audit')) {
    pagesList.push(
      {
        id: 507,
        path: '/sla-audit-overview',
        routePath: Insightsoverview,
        module: 'SLA-KPI Audit',
      },
      { id: 508, path: '/sla-audits', routePath: SlaAudits },
    );
  }

  if (menuNames.includes('consumption tracker')) {
    pagesList.push(
      {
        id: 509,
        path: '/consumption-tracker-overview',
        routePath: Insightsoverview,
        module: 'Consumption Tracker',
      },
      {
        id: 510,
        path: '/consumption-trackers',
        routePath: ConsumptionTrackers,
      },
      {
        id: 511,
        path: '/consumption-tracker-reports',
        routePath: ConsumptionReports,
      },
    );
  }

  if (menuNames.includes('hx incident report')) {
    pagesList.push(
      {
        id: 512,
        path: '/hx-incident-overview',
        routePath: Insightsoverview,
        module: 'HX Incident Report',
        // moduleDisplay: 'Incident',
      },
      { id: 513, path: '/hx-incidents', routePath: HxIncidents },
      { id: 513, path: '/hx-incidents/:uuid', routePath: HxIncidents },
      { id: 516, path: '/incident/:uuid/:text', routePath: ExternalApproval },

    );
  }
  if (menuNames.includes('energy')) {
    pagesList.push({
      id: 803,
      path: '/energy-insights-overview',
      routePath: EnergyOverView,
    });
    pagesList.push({
      id: 803,
      path: '/energy-sixth-floor-insights',
      routePath: sixthFloorInsights,
    });
    pagesList.push({
      id: 803,
      path: '/energy-seventh-floor-insights',
      routePath: seventhFloorInsights,
    });
    pagesList.push({
      id: 803,
      path: '/energy-sld-overview',
      routePath: SldOverView,
    });
    pagesList.push({
      id: 803,
      path: '/energy-meter',
      routePath: EnergyMeter,
    });
    pagesList.push({
      id: 805,
      path: '/energy-overview/dynamic-report/:submenu',
      routePath: EnergyDynamicReport,
    });
  }

  /* if (menuNames.includes("ups")) {
    pagesList.push({
      id: 333,
      path: "/ups-summary-overview",
      routePath: UpsSummary,
    });
    pagesList.push({
      id: 334,
      path: "/ups-120kva-overview",
      routePath: UpsOverview,
    });
    pagesList.push({
      id: 335,
      path: "/ups1-20kva-overview",
      routePath: Ups1Overview,
    });
    pagesList.push({
      id: 336,
      path: "/ups2-20kva-overview",
      routePath: Ups2Overview,
    });
  } */

  if (menuNames.includes('restrooms')) {
    pagesList.push({
      id: 8036,
      path: '/restrooms-insights-overview',
      routePath: Restrooms,
    });
    pagesList.push({
      id: 8036,
      path: '/restrooms-sld-overview',
      routePath: RestroomsSldOverview,
    });
  }

  if (menuNames.includes('esg')) {
    pagesList.push({
      id: 8037,
      path: '/esg/overview',
      routePath: EsgOverview,
      module: 'ESG',
      moduleDynamicPath: '/esg/dynamic-report',
    }),
    pagesList.push({ id: 8038, path: '/esg/dynamic-report/:submenu', routePath: ESGDynamicReports });
    pagesList.push({
      id: 8039,
      path: '/esg-tracker',
      routePath: ESGTracker,
    });
  }

  if (menuNames.includes('occupancy')) {
    pagesList.push({
      id: 712,
      path: '/occupancy',
      routePath: OccupancyDashboard,
    });
  }

  if (menuNames.includes('occupancy')) {
    pagesList.push(
      { id: 712, path: '/occupancy', routePath: OccupancyDashboard },
    );
  }
  if (menuNames.includes('esg tracker')) {
    pagesList.push(
      { id: 910, path: '/environment', routePath: Submenu },
    );
    pagesList.push(
      { id: 910, path: '/energy-sld', routePath: Submenu },
    );
    pagesList.push(
      { id: 910, path: '/water-sld', routePath: Submenu },
    );
    pagesList.push(
      { id: 910, path: '/waste-sld', routePath: Submenu },
    );
    pagesList.push(
      { id: 910, path: '/emissions', routePath: Submenu },
    );

    pagesList.push(
      { id: 911, path: '/social', routePath: SocialOverview },
    );
    pagesList.push(
      { id: 912, path: '/governance', routePath: GoveranceOverview },
    );
    pagesList.push(
      { id: 913, path: '/esg-tracker', routePath: ESGTracker },
    );
    pagesList.push(
      { id: 915, path: '/esg-monitoring/overview', routePath: EsgEnvironmentOverview },
    );
  }

  const windowPath = window.location.pathname.replace('/v3', '') || '/';
  const whiteList = ['/', '/accountlogin', '/registration', '/forgot-password', '/reset-password', '/create-new-password', '/access-qr-scan', '/okta-login', '/okta-hosted-login', '/company-registration', '/visitorpass', '/visitapproval', '/survey', '/ticket', '/feedback', '/wp', '/audit/', '/saml/signin', '/visitorpass/companylevel', '/visitinvitation', '/airquality-dashboard', '/teammember/invitation', '/incident', '/oneqr', '/pantry-order', '/52week/external', 'inspection-viewer/','ppm-viewer/', '/audit-checklists/perform', '/aws/callback', '/52week/prepone', '/52week/bulkcancel', '/hxinspection/bulkcancel'];
  const pathExist = whiteList.includes(windowPath);
  const visitorExist = (windowPath.search('/visitorpass') !== -1) || (windowPath.search('/visitapproval') !== -1) || (windowPath.search('/visitorpass/companylevel') !== -1) || (windowPath.search('/visitinvitation') !== -1);
  const feedbackExists = (windowPath.search('/survey') !== -1);
  const externalHelpdeskExists = (windowPath.search('/ticket') !== -1);
  const feedbackSurveyExists = (windowPath.search('/feedback') !== -1);
  const wpApprovalExists = (windowPath.search('/wp') !== -1);
  const gpApprovalExists = (windowPath.search('/gp') !== -1);
  const auditExists = (windowPath.search('/audit/') !== -1);
  const oneQRExists = (windowPath.search('/oneqr') !== -1);
  const jumpcloudExists = (windowPath.search('/saml/signin') !== -1);
  const aqDashboardExists = (windowPath.search('/airquality-dashboard') !== -1);
  const teamMemberInvitationExists = (windowPath.search('/teammember/invitation') !== -1);
  const incidentExists = (windowPath.search('/incident') !== -1);
  const pantryExists = (windowPath.search('/pantry-order') !== -1);
  const externalPPMExists = (windowPath.search('/52week/external') !== -1);
  const externalInspectionExists = (windowPath.search('inspection-viewer/') !== -1);
  const externalPPMSExists = (windowPath.search('ppm-viewer/') !== -1);
  const externalAuditPerformExists = (windowPath.search('/audit-checklists/perform') !== -1);
  const externalPPMPreponeExists = (windowPath.search('/52week/prepone') !== -1);
  const externalPPMCancelExists = (windowPath.search('/52week/bulkcancel') !== -1);
  const externalInspectionCancelExists = (windowPath.search('/hxinspection/bulkcancel') !== -1);

  useEffect(() => {
    const favicon = document.getElementById('favicon');
    applicationDetails.map((details) => {
      if (details.client === appConfig.CLIENTNAME) {
        document.title = details.title;
        favicon.setAttribute('href', details.favicon);
      }
    });
  }, []);

  const reactUrl = `${window.location.origin}`;

  const isBasePath = !!(appConfig.BASE_PATH && appConfig.BASE_PATH.includes('/v3'));

  useEffect(() => {
    authService.clearServerError();
    if (!isAuthenticated && !pathExist && !visitorExist && !feedbackExists && !externalHelpdeskExists && !feedbackSurveyExists && !wpApprovalExists && !auditExists && !jumpcloudExists && !gpApprovalExists && !aqDashboardExists && !teamMemberInvitationExists && !oneQRExists && !incidentExists && !pantryExists && !externalPPMExists && !externalInspectionExists && !externalPPMSExists && !externalAuditPerformExists && !externalPPMCancelExists && !externalPPMPreponeExists && !externalInspectionCancelExists) {
      window.location.pathname = isBasePath ? '/v3' : '/';
    }
  }, [isAuthenticated, pathExist]);

  const ErrorFallback = ({ resetErrorBoundary }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '40%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '15px',
        }}
      >
        <Box>
          <p className="page-not-text">Sorry, something went wrong.</p>
          <Button
            sx={{
              textTransform: 'none',
              height: '50px',
              width: '150px',
              marginTop: '15px',
            }}
            onClick={resetErrorBoundary}
            variant="contained"
          >
            Retry
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: '60%',
          height: '100%',
        }}
      >
        <img alt="" src={NoInternetImage()} className="no-internet-page" />
      </Box>
    </Box>
  );

  let publicUrlCondition = false;
  let otherUrlCondition = false;

  const isAuthUser = userInfo && userInfo.data && userInfo.data.is_oauth_user_login;

  const isMobileUser = userInfo && userInfo.data && userInfo.data.is_mobile_user;

  if (ISAPIGATEWAY === 'true') {
    publicUrlCondition = !isAuthenticated || !sessionExpiry || sessionExpiry !== '1';
  } else {
    publicUrlCondition = !isAuthenticated || !sessionExpiry || sessionExpiry !== '1';
  }

  if (ISAPIGATEWAY === 'true') {
    otherUrlCondition = isAuthenticated && sessionExpiry && sessionExpiry === '1' && !serverError;
  } else {
    otherUrlCondition = isAuthenticated && sessionExpiry && sessionExpiry === '1' && !serverError;
  }

  return (
    <>
      {!loading && publicUrlCondition && (
        <Suspense fallback={<ExternalComponentsLoading />}>
          <Router basename={isBasePath ? '/v3' : '/'}>
            <Switch>
              <Route exact path="/" component={AccountIdLogin} />
              <Route exact path="/visitorpass/:uuid" component={VisitorPass} />
              <Route
                exact
                path="/visitapproval/:uuid"
                component={VisitApproval}
              />
              <Route exact path="/okta-hosted-login" component={OktaLogin} />
              <Route exact path="/okta-login" component={oktaLoginResponse} />
              <Route exact path="/aws/callback" component={awsResponse} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/login/callback" component={LoginCallback} />
              <Route exact path="/registration" component={EmailRegistration} />
              <Route
                exact
                path="/forgot-password"
                component={GetResetPasswordLink}
              />
              <Route
                exact
                path="/reset-password"
                component={CheckResetPasswordLink}
              />
              <Route
                exact
                path="/create-new-password"
                component={ResetPassword}
              />
              <Route
                exact
                path="/company-registration"
                component={CompanyRegistration}
              />
              <Route exact path="/survey/:uuid" component={SurveyForm} />
              <Route exact path="/ticket/:uuid" component={ExternalReport} />
              <Route
                exact
                path="/feedback/:uuid/:c_uuid/:ruuid/:type"
                component={FeedbackForm}
              />
              <Route exact path="/wp/:suuid/:ruuid" component={WpApproval} />
              <Route exact path="/audit/:uuid/:suuid" component={PublicAudit} />
              <Route exact path="/saml/signin" component={JumpLogin} />
              <Route
                exact
                path="/gp/:suuid/:ruuid"
                component={GatePassApproval}
              />
              <Route
                exact
                path="/visitorpass/companylevel/:uuid"
                component={CompanyVisitorPass}
              />
              <Route
                exact
                path="/visitinvitation/:uuid"
                component={HostVisitorPass}
              />
              <Route exact path="/oneqr/:uuid" component={OneQR} />
              <Route exact path="/teammember/invitation/:uuid" component={teamMemberInvitation} />
              <Route exact path="/incident/:uuid/:text" component={ExternalApproval} />
              <Route exact path="/pantry-order/:uuid" component={PantryOrder} />
              <Route exact path="/52week/external/:uuid" component={ExternalPPM} />
              <Route exact path="/inspection-overview/inspection-viewer/:uuid" component={InspectionViewer} />
              <Route exact path="/ppm-overview/ppm-viewer/:uuid" component={PreventiveViewer} />
              <Route exact path="/audit-checklists/perform/:uuid" component={ResponsiveAudit} />
              <Route exact path="/52week/prepone/approval/:uuid" component={PreventiveViewer} />
              <Route exact path="/52week/bulkcancel/approval/:uuid" component={PreventiveCancelRequestsExternal} />
              <Route exact path="/hxinspection/bulkcancel/approval/:uuid" component={InspectionCancelRequestsExternal} />
            </Switch>
          </Router>
        </Suspense>
      )}
      {!loading && otherUrlCondition && (
        <div className="main-layout" id="app-main-content">
          <Router basename={isBasePath ? '/v3' : '/'}>
            {!isMobileUser && (
              <Sidenav />
            )}
            <div
              className={pinEnableData ? 'content-box-expand' : 'content-box'}
              id="component-header"
              style={{ overflowX: 'hidden' }}
            >
              {!isMobileUser && (
                <Header />
              )}
              {/*
              <div className={pinEnableData ? 'm-0 row page-actions-header' : 'm-0 page-actions-header'}>
                <div className={pinEnableData ? 'side-nav-col col-lg-2 m-0 p-0' : ''}>

                </div>
        <div className={pinEnableData ? 'main-content-pinned col-lg-10' : ' main-content'} id="main-content-id"> */}
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<FallBackLoaderCoponent />}>
                  {userRoles && userRoles.loading && (
                    <div className="lazy-loader-box">
                      <PageLoader type="max" />
                    </div>
                  )}
                  {userRoles && userRoles.err && (
                    <div>
                      <Header headerPath="Home" nextPath="" pathLink="/" />
                      <ErrorContent
                        errorTxt={generateErrorMessage(userRoles)}
                      />
                    </div>
                  )}
                  {userRoles
                    && userRoles.data
                    && !isAuthUser
                    && !userInfo.loading && <AuthPending />}
                  {userRoles
                    && userRoles.data
                    && isMobileUser
                    && !userInfo.loading && <AuthMobileUser />}
                  {userRoles && userRoles.data && !isMobileUser && isAuthUser && (
                    <Switch>
                      {pagesList
                        && pagesList.map((item) => (
                          <Route
                            key={item.id}
                            exact
                            path={item.path}
                            component={withRouter((props) => (
                              <item.routePath {...props} module={item.module} moduleDisplay={item.moduleDisplay} moduleDynamicPath={item.moduleDynamicPath ? item.moduleDynamicPath : ''} />
                            ))}
                          />
                        ))}
                      <Route component={NotFound} />
                    </Switch>
                  )}
                </Suspense>
              </ErrorBoundary>
              {/* </div>
              </div> */}
            </div>
          </Router>
        </div>
      )}
      {loading && (
      <div className="main-layout" id="app-main-content">
        <div className="lazy-loader-box">
          <PageLoader type="max" />
        </div>
      </div>
      )}
      {serverError && (
        <div>
          <Router basename={isBasePath ? '/v3' : '/'}>
            <div className="main-content">
              <Switch>
                <Route
                  exact
                  path="/server-error"
                  component={InternalServerErr}
                />
              </Switch>
            </div>
          </Router>
        </div>
      )}
      <Footer />
    </>
  );
};

export default App;
