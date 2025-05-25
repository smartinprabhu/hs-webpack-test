import {
  getEmployeeList,
  getEmployeeCount,
  getEmployeeDetailsById,
  getRegistrationStatusForEmp,
  getAllowedNeighbourhoodBySpace,
  getNotInAllowedNeighbourhoodBySpace,
  getAlarmsCountInfo,
  getAlarmsInfo,
  updateAlarmInfo,
  getAlarmsNotificationsInfo,
  getChecklistAlarmsInfo,
  getChecklistAlarmsCountInfo,
  getAlarmsGroupInfo,
  getAlarmsGroupPriorityInfo,
} from './actions';

export const SITE_FILTER = 'SITE_FILTER';
export const RESET_ALARM_UPDATE_INFO = 'RESET_ALARM_UPDATE_INFO';
export const RESET_ALARM_INFO = 'RESET_ALARM_INFO';

export function getSearchfilter(addValues) {
  const result = { statuses: addValues };
  return {
    type: SITE_FILTER,
    payload: result,
  };
}

export function getEmployees(companyIds, model, limit, offset, status, sortFieldValue) {
  return (dispatch) => {
    dispatch(getEmployeeList(companyIds, model, limit, offset, status, sortFieldValue));
  };
}

export function getEmployeesCount(companyIds, model, status) {
  return (dispatch) => {
    dispatch(getEmployeeCount(companyIds, model, status));
  };
}

export function getEmployeeDetails(employeeId) {
  return (dispatch) => {
    dispatch(getEmployeeDetailsById(employeeId));
  };
}

export function getRegStatusForEmp(companyId, model) {
  return (dispatch) => {
    dispatch(getRegistrationStatusForEmp(companyId, model));
  };
}

export function getAllowedNeighbourhood(neighbourhood, model, employeeId) {
  return (dispatch) => {
    dispatch(getAllowedNeighbourhoodBySpace(neighbourhood, model, employeeId));
  };
}

export function getNotInAllowedNeighbourhood(neighbourhood, model, employeeId) {
  return (dispatch) => {
    dispatch(getNotInAllowedNeighbourhoodBySpace(neighbourhood, model, employeeId));
  };
}

export function getAlarms(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters) {
  return (dispatch) => {
    dispatch(getAlarmsInfo(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters));
  };
}

export function getAlarmsCount(company, employeeId, model, resModel, statusValues, priorityValues, customFilters) {
  return (dispatch) => {
    dispatch(getAlarmsCountInfo(company, employeeId, model, resModel, statusValues, priorityValues, customFilters));
  };
}

export function updateAlarm(id, model, result) {
  return (dispatch) => {
    dispatch(updateAlarmInfo(id, model, result));
  };
}

export function getAlarmsNotifications(company, employeeId, model, limit, offset) {
  return (dispatch) => {
    dispatch(getAlarmsNotificationsInfo(company, employeeId, model, limit, offset));
  };
}

export function resetUpdateAlarm(result) {
  return {
    type: RESET_ALARM_UPDATE_INFO,
    payload: result,
  };
}

export function resetAlarm(result) {
  return {
    type: RESET_ALARM_INFO,
    payload: result,
  };
}

export function getChecklistAlarms(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters) {
  return (dispatch) => {
    dispatch(getChecklistAlarmsInfo(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters));
  };
}

export function getChecklistAlarmsCount(company, employeeId, model, resModel, statusValues, priorityValues, customFilters) {
  return (dispatch) => {
    dispatch(getChecklistAlarmsCountInfo(company, employeeId, model, resModel, statusValues, priorityValues, customFilters));
  };
}

export function getAlarmsGroup(start, end) {
  return (dispatch) => {
    dispatch(getAlarmsGroupInfo(start, end));
  };
}

export function getAlarmsGroupPriority(start, end) {
  return (dispatch) => {
    dispatch(getAlarmsGroupPriorityInfo(start, end));
  };
}
