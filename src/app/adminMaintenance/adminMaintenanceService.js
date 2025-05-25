import {
  getTypeGroupsInfo, getStateGroupsInfo, getWorkorderFilters, getClearBookingsCount, getclearBookingMaintainanceInfo,
  getMaintenanceExportInfo, createOrderCommentInfo, orderStateChangeInfo, getclearBookingWorkorderFilters,
  getWorkOrderDashboardInfo, getMaintenanceInfo, getMaintenanceCountInfo, saveClearCleaningWorkOrderFilters,
  saveBulkCleanBookings, clearCleaningRes, deleteBookingItem, clearBookingRes, getWorkordersCountInfo, getWorkorderList, getCleaningWorkorderFilters,
} from './actions';

export const GET_ROWS_WO = 'GET_ROWS_WO';
export const GET_STATE_RESET_INFO = 'GET_STATE_RESET_INFO';
export const RESET_COMMENTS_INFO = 'RESET_COMMENTS_INFO';

export function getMaintenance(company, limit, offset, states, types, custom, sortByValue, sortFieldValue, orderId, defaultWorkOrderStatus, searchFilter, bookingCheckBoxType) {
  return (dispatch) => {
    dispatch(getMaintenanceInfo(company, limit, offset, states, types, custom, sortByValue, sortFieldValue, orderId, defaultWorkOrderStatus, searchFilter, bookingCheckBoxType));
  };
}

export function getMaintenanceCount(company, states, types, custom, orderId, defaultWorkOrderStatus, searchFilter, bookingCheckBoxType) {
  return (dispatch) => {
    dispatch(getMaintenanceCountInfo(company, states, types, custom, orderId, defaultWorkOrderStatus, searchFilter, bookingCheckBoxType));
  };
}

export function getWorkorders(company, workorderValue, limit, offset, states, types, custom, sortByValue, sortFieldValue, orderId, defaultWorkOrderStatus) {
  return (dispatch) => {
    dispatch(getWorkorderList(company, workorderValue, limit, offset, states, types, custom, sortByValue, sortFieldValue, orderId, defaultWorkOrderStatus));
  };
}

export function getWorkordersCount(company, states, types, workorderValue, custom, orderId, defaultWorkOrderStatus) {
  return (dispatch) => {
    dispatch(getWorkordersCountInfo(company, states, types, workorderValue, custom, orderId, defaultWorkOrderStatus));
  };
}

export function getMaintenanceExport(company, model, limit, offset, fields, rows, statusValues, typeValues, customFilters, bookMaintenance, searchFilter) {
  return (dispatch) => {
    dispatch(getMaintenanceExportInfo(company, model, limit, offset, fields, rows, statusValues, typeValues, customFilters, bookMaintenance, searchFilter));
  };
}

export function getStateGroups(company, model) {
  return (dispatch) => {
    dispatch(getStateGroupsInfo(company, model));
  };
}

export function setClearCleaningWorkOrderFilters() {
  return (dispatch) => {
    dispatch(saveClearCleaningWorkOrderFilters());
  };
}

export function setclearBookingMaintainanceInfo() {
  return (dispatch) => {
    dispatch(getclearBookingMaintainanceInfo());
  };
}

export function setclearBookingWorkorderFilters() {
  return (dispatch) => {
    dispatch(getclearBookingWorkorderFilters());
  };
}

export function setclearBookingsCount() {
  return (dispatch) => {
    dispatch(getClearBookingsCount());
  };
}

export function getTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getTypeGroupsInfo(company, model));
  };
}
export function createOrderComment(values, model) {
  return (dispatch) => {
    dispatch(createOrderCommentInfo(values, model));
  };
}

export function orderStateChange(id, state, modelName) {
  return (dispatch) => {
    dispatch(orderStateChangeInfo(id, state, modelName));
  };
}

export function getWorkOrderDashboard(start, end) {
  return (dispatch) => {
    dispatch(getWorkOrderDashboardInfo(start, end));
  };
}

export function deleteBooking(id) {
  return (dispatch) => {
    dispatch(deleteBookingItem(id));
  };
}

export function getWorkorderFilter(payload) {
  return (dispatch) => {
    dispatch(getWorkorderFilters(payload));
  };
}

export function getCleaningWorkorderFilter(payload) {
  return (dispatch) => {
    dispatch(getCleaningWorkorderFilters(payload));
  };
}

export function getCheckedRows(result) {
  return {
    type: GET_ROWS_WO,
    payload: result,
  };
}

export function clearBookingData() {
  return (dispatch) => {
    dispatch(clearBookingRes());
  };
}

export function resetEscalate(result) {
  return {
    type: GET_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetComments(result) {
  return {
    type: RESET_COMMENTS_INFO,
    payload: result,
  };
}
export function clearCleaning() {
  return (dispatch) => {
    dispatch(clearCleaningRes());
  };
}

export function saveBulkClean(bookingIds, employeeId, startDate, endDate, payload) {
  return (dispatch) => {
    dispatch(saveBulkCleanBookings(bookingIds, employeeId, startDate, endDate, payload));
  };
}
