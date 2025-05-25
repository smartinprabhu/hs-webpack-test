import { combineReducers } from 'redux';
import authReducer from './app/auth/authReducer';
import configReducer from './app/dashboard/reducer';
import equipmentReducer from './app/assets/reducer';
import ticketReducer from './app/helpdesk/reducer';
import spaceReducer from './app/spaceManagement/reducer';
import setupReducer from './app/adminSetup/reducer';
import userReducer from './app/user/reducer';
import headerReducer from './app/core/header/reducer';
import mailRegistrationReducer from './app/registration/reducer';
import resetPasswordReducer from './app/resetPassword/reducer';
import workorderReducer from './app/workorders/reducer';
import ppmReducer from './app/preventiveMaintenance/reducer';
import userProfileReducer from './app/userProfile/reducer';
import analyticsReducer from './app/analytics/reducer';
import maintenanceReducer from './app/adminSetup/maintenanceConfiguration/reducer';
import purchaseReducer from './app/purchase/reducer';
import inventoryReducer from './app/inventory/reducer';
import complianceReducer from './app/buildingCompliance/reducer';
import visitorManagementReducer from './app/visitorManagement/reducer';
import surveyReducer from './app/survey/reducer';
import pantryReducer from './app/pantryManagement/reducer';
import inspectionReducer from './app/inspectionSchedule/reducer';
import mailReducer from './app/mailroomManagement/reducer';
import tankerReducer from './app/commodityTransactions/reducer';
import workPermitReducer from './app/workPermit/reducer';
import auditReducer from './app/auditSystem/reducer';
import gatePassReducer from './app/gatePass/reducer';
import myBookingsReducer from './app/myBookings/reducer';
import bookingUserReducer from './app/booking/reducer';
import bookingMaintenanceReducer from './app/adminMaintenance/reducer';
import employeeReducer from './app/employees/reducer';
import preScreeningProcessReducer from './app/booking/preScreening/reducer';
import accessReducer from './app/booking/access/reducer';
import occupyReducer from './app/booking/occupySpace/reducer';
import releaseReducer from './app/booking/release/reducer';
// import onBoardingReducer from './app/onBoarding/reducer';
import siteOnboardingReducer from './app/siteOnboarding/reducer';
import breakdownReducer from './app/breakdownTracker/reducer';
import attendanceReducer from './app/attendanceLogs/reducer';
import slaAuditReducer from './app/slaAudit/reducer';
import consumptionTrackerReducer from './app/consumptionTracker/reducer';
import hxIncidentReducer from './app/incidentBooking/reducer';
import wasteReducer from './app/waste/reducer';
import hazardReducer from './app/hazards/reducer';
import bmsReducer from './app/bmsAlarms/reducer';
import hxAuditReducer from './app/auditManagement/reducer';

export default combineReducers({
  auth: authReducer,
  config: configReducer,
  equipment: equipmentReducer,
  ticket: ticketReducer,
  space: spaceReducer,
  setup: setupReducer,
  user: userReducer,
  header: headerReducer,
  analytics: analyticsReducer,
  mailRegister: mailRegistrationReducer,
  resetPassword: resetPasswordReducer,
  workorder: workorderReducer,
  ppm: ppmReducer,
  userProfile: userProfileReducer,
  maintenance: maintenanceReducer,
  purchase: purchaseReducer,
  inventory: inventoryReducer,
  compliance: complianceReducer,
  visitorManagement: visitorManagementReducer,
  survey: surveyReducer,
  pantry: pantryReducer,
  inspection: inspectionReducer,
  mailroom: mailReducer,
  tanker: tankerReducer,
  workpermit: workPermitReducer,
  audit: auditReducer,
  gatepass: gatePassReducer,
  bookingInfo: bookingUserReducer,
  myBookings: myBookingsReducer,
  bookingWorkorder: bookingMaintenanceReducer,
  employee: employeeReducer,
  access: accessReducer,
  occupy: occupyReducer,
  release: releaseReducer,
  // onBoard: onBoardingReducer,
  preScreening: preScreeningProcessReducer,
  site: siteOnboardingReducer,
  breakdowntracker: breakdownReducer,
  attendance: attendanceReducer,
  slaAudit: slaAuditReducer,
  consumptionTracker: consumptionTrackerReducer,
  hxIncident: hxIncidentReducer,
  waste: wasteReducer,
  hazards: hazardReducer,
  bmsAlarms: bmsReducer,
  hxAudits: hxAuditReducer,
});
