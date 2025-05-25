import {
  getWorkPermitInfo, getWorkPermitExportInfo,
  getTaskDetailsInfo, getMailLogsInfo,
  getWorkPermitCountInfo, geWorkPermitDashboardInfo, getDepartmentsInfo, getWpConfigInfo, getIpTaskDetailsInfo,
  getWorkPermitDetailsInfo, getWorkPermitReports, getVendorGroupsInfo,
  getNatureGroupsInfo, getVendorInfo, getTypeWorkInfo, getNatureInfo, getPrepareChecklistInfo, getMaintenanceGroupsInfo,
  permitStateChangeInfo, getNatureWorkofListInfo, getNatureofWorkCountInfo, getNatureofWorkDetailsInfo, getNatureofWorkExportInfo, getIssuePermitChecklistInfo,
} from './actions';

export const WORKPERMIT_FILTERS = 'WORKPERMIT_FILTERS';
export const RESET_REPORT_INFO = 'RESET_REPORT_INFO';
export const GET_PR_STATE_RESET_INFO = 'GET_PR_STATE_RESET_INFO';
export const NATUREOFWORK_FILTERS = 'NATUREOFWORK_FILTERS';
export const RESET_PARTSSELECTED_INFO = 'RESET_PARTSSELECTED_INFO';
export const GET_WP_ROWS_PARTS_SELECTED = 'GET_WP_ROWS_PARTS_SELECTED';
export const RESET_IP_TASK_DETAILS_INFO = 'RESET_IP_TASK_DETAILS_INFO';

export function getWorkPermit(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getWorkPermitInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getWorkPermitExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getWorkPermitExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getWorkPermitCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getWorkPermitCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getWorkPermitFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: WORKPERMIT_FILTERS,
    payload: result,
  };
}

export function getNatureofWorkFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: NATUREOFWORK_FILTERS,
    payload: result,
  };
}

export function geWorkPermitDashboard(start, end, name) {
  return (dispatch) => {
    dispatch(geWorkPermitDashboardInfo(start, end, name));
  };
}

export function getWorkPermitDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getWorkPermitDetailsInfo(id, modelName));
  };
}

export function getNatureofWorkDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getNatureofWorkDetailsInfo(id, modelName));
  };
}

export function getWorkPermitReport(company, model, start, end, commodity, vendor) {
  return (dispatch) => {
    dispatch(getWorkPermitReports(company, model, start, end, commodity, vendor));
  };
}

export function resetTransactionRoomReport(result) {
  return {
    type: RESET_REPORT_INFO,
    payload: result,
  };
}

export function getVendor(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getVendorInfo(company, model, type, keyword));
  };
}

export function getVendorGroups(company, model) {
  return (dispatch) => {
    dispatch(getVendorGroupsInfo(company, model));
  };
}
export function getNatureGroups(company, model) {
  return (dispatch) => {
    dispatch(getNatureGroupsInfo(company, model));
  };
}

export function getMaintenanceGroups(company, model) {
  return (dispatch) => {
    dispatch(getMaintenanceGroupsInfo(company, model));
  };
}

export function getTypeWork(company, model, keyword, domain) {
  return (dispatch) => {
    dispatch(getTypeWorkInfo(company, model, keyword, domain));
  };
}

export function getDepartments(model, domain) {
  return (dispatch) => {
    dispatch(getDepartmentsInfo(model, domain));
  };
}

export function getNatureWork(company, model, keyword) {
  return (dispatch) => {
    dispatch(getNatureInfo(company, model, keyword));
  };
}

export function getPrepareChecklist(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPrepareChecklistInfo(company, model, keyword));
  };
}

export function getIssuePermitChecklist(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIssuePermitChecklistInfo(company, model, keyword));
  };
}

export function permitStateChange(id, state, model) {
  return (dispatch) => {
    dispatch(permitStateChangeInfo(id, state, model));
  };
}

export function resetPermitState(result) {
  return {
    type: GET_PR_STATE_RESET_INFO,
    payload: result,
  };
}

export function getNatureofWorkList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getNatureWorkofListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getNatureofWorkCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getNatureofWorkCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getNatureofWorkExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getNatureofWorkExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getWpConfig(company, model) {
  return (dispatch) => {
    dispatch(getWpConfigInfo(company, model));
  };
}

export function resetPartsSelected(result) {
  return {
    type: RESET_PARTSSELECTED_INFO,
    payload: result,
  };
}

export function getWorkPermitPartsData(result) {
  return {
    type: GET_WP_ROWS_PARTS_SELECTED,
    payload: result,
  };
}

export function getTaskDetails(id) {
  return (dispatch) => {
    dispatch(getTaskDetailsInfo(id));
  };
}

export function getIpTaskDetails(id) {
  return (dispatch) => {
    dispatch(getIpTaskDetailsInfo(id));
  };
}


export function getMailLogs(modelId, statusId) {
  return (dispatch) => {
    dispatch(getMailLogsInfo(modelId, statusId));
  };
}

export function getIPDetailsReset(result) {
  return {
    type: RESET_IP_TASK_DETAILS_INFO,
    payload: result,
  };
}
