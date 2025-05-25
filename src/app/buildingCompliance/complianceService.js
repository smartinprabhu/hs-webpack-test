import {
  getComplianceListInfo, getComplianceCountInfo,
  createComplianceInfo,
  getComplianceDetails, getComplianceExportInfo, getActGroupsInfo, getComplianceTemplates,
  getComplianceActs, getSubmittedTos, getComplianceLog, getComplianceEvidences, getComplianceTemplateDetails, complianceStateChangeInfo,
  getComplianceDashboardInfo, getCategoryGroupsInfo, getComplianceConfigInfo, getComplianceCategorys, getComplianceReports, getComplianceDocumentsInfo, getComplianceTempCountInfo, getComplianceTempExportInfo, getComplianceTempListInfo,
} from './actions';

export const COMPLIANCE_FILTERS = 'COMPLIANCE_FILTERS';
export const RESET_ADD_COMPLIANCE_INFO = 'RESET_ADD_COMPLIANCE_INFO';
export const GET_ROWS_COMPLIANCE = 'GET_ROWS_COMPLIANCE';
export const RESET_TEMPLATE_COMPLIANCE = 'RESET_TEMPLATE_COMPLIANCE';
export const GET_COMPLIANCE_STATE_RESET_INFO = 'GET_COMPLIANCE_STATE_RESET_INFO';
export const RESET_RENEWAL_DETAIL = 'RESET_RENEWAL_DETAIL';
export const RESET_COMPLIANCE_REPORT = 'RESET_COMPLIANCE_REPORT';
export const COMPLIANCE_TEMP_FILTERS = 'COMPLIANCE_TEMP_FILTERS';

export function getComplianceList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getComplianceListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getComplianceExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getComplianceExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getComplianceCount(company, model, states, globalFilter, customFilters, keyword) {
  return (dispatch) => {
    dispatch(getComplianceCountInfo(company, model, states, globalFilter, customFilters, keyword));
  };
}

export function getComplianceTempList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword,globalFilter) {
  return (dispatch) => {
    dispatch(getComplianceTempListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter));
  };
}

export function getComplianceTempExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getComplianceTempExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, keyword, globalFilter));
  };
}

export function getComplianceTempCount(company, model, states, customFilters, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getComplianceTempCountInfo(company, model, states, customFilters, keyword, globalFilter));
  };
}

export function getComplianceFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: COMPLIANCE_FILTERS,
    payload: result,
  };
}

export function getComplianceTempFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: COMPLIANCE_TEMP_FILTERS,
    payload: result,
  };
}

export function resetAddComplianceInfo(result) {
  return {
    type: RESET_ADD_COMPLIANCE_INFO,
    payload: result,
  };
}

export function resetComplianceTemplate(result) {
  return {
    type: RESET_TEMPLATE_COMPLIANCE,
    payload: result,
  };
}

export function getComplianceDetail(id, model) {
  return (dispatch) => {
    dispatch(getComplianceDetails(id, model));
  };
}

export function createCompliance(model, payload) {
  return (dispatch) => {
    dispatch(createComplianceInfo(model, payload));
  };
}

export function getCheckedRowsCompliance(payload) {
  return {
    type: GET_ROWS_COMPLIANCE,
    payload,
  };
}

export function getActGroups(company, model) {
  return (dispatch) => {
    dispatch(getActGroupsInfo(company, model));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getComplianceTemplate(company, model, keyword) {
  return (dispatch) => {
    dispatch(getComplianceTemplates(company, model, keyword));
  };
}

export function getComplianceAct(company, model, keyword) {
  return (dispatch) => {
    dispatch(getComplianceActs(company, model, keyword));
  };
}

export function getSubmittedTo(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getSubmittedTos(company, model, type, keyword));
  };
}

export function getComplianceCategory(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getComplianceCategorys(company, model, type, keyword));
  };
}

export function getComplianceLogs(ids, model) {
  return (dispatch) => {
    dispatch(getComplianceLog(ids, model));
  };
}

export function getComplianceEvidence(ids, model) {
  return (dispatch) => {
    dispatch(getComplianceEvidences(ids, model));
  };
}

export function getComplianceTemplateDetail(id, model) {
  return (dispatch) => {
    dispatch(getComplianceTemplateDetails(id, model));
  };
}

export function complianceStateChange(id, state, model, contex, fileDate) {
  return (dispatch) => {
    dispatch(complianceStateChangeInfo(id, state, model, contex, fileDate));
  };
}

export function resetComplianceState(result) {
  return {
    type: GET_COMPLIANCE_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetRenewalDetail(result) {
  return {
    type: RESET_RENEWAL_DETAIL,
    payload: result,
  };
}

export function getComplianceDashboard(start, end) {
  return (dispatch) => {
    dispatch(getComplianceDashboardInfo(start, end));
  };
}

export function getComplianceReport(company, model, status, compliance, expiryDate) {
  return (dispatch) => {
    dispatch(getComplianceReports(company, model, status, compliance, expiryDate));
  };
}

export function resetComplianceReport(result) {
  return {
    type: RESET_COMPLIANCE_REPORT,
    payload: result,
  };
}

export function getComplianceDocuments(id, modelName) {
  return (dispatch) => {
    dispatch(getComplianceDocumentsInfo(id, modelName));
  };
}

export function getComplianceConfig(id, modelName) {
  return (dispatch) => {
    dispatch(getComplianceConfigInfo(id, modelName));
  };
}
