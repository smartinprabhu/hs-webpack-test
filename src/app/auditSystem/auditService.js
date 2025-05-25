import {
  getAuditsInfo, getAuditExportInfo,
  getAuditCountInfo,
  getAuditDetailsInfo,
  getSystemGroupsInfo,
  getAuditDashboardInfo,
  getNonConformitiesInfo,
  getNonConformitieExportInfo,
  getNonConformitieCountInfo,
  getNonConformitieDetailsInfo,
  getStatusGroupsInfo,
  getAuditActionInfo,
  getOpportunitiesInfo,
  getOpportunitiesCountInfo,
  getOpportunitiesDetailsInfo,
  getSystemAudits,
  getTeamMembers,
  getAuditAssessmentsInfo,
  getAuditActionsInfo,
  updateAuditActionInfo,
} from './actions';

export const AUDIT_FILTERS = 'AUDIT_FILTERS';
export const NC_FILTERS = 'NC_FILTERS';
export const RESET_AUDIT_ACTION = 'RESET_AUDIT_ACTION';
export const OPPORTUNITIES_FILTERS = 'OPPORTUNITIES_FILTERS';
export const RESET_AUDIT_ACTION_UPDATE = 'RESET_AUDIT_ACTION_UPDATE';

export function getNonConformities(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getNonConformitiesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getNonConformitieExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getNonConformitieExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getNonConformitieCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getNonConformitieCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getNonConformitieFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: NC_FILTERS,
    payload: result,
  };
}

export function getNonConformitieDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getNonConformitieDetailsInfo(id, modelName));
  };
}

export function getAudits(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getAuditsInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getAuditExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getAuditExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getAuditCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getAuditCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getAuditFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: AUDIT_FILTERS,
    payload: result,
  };
}

export function getAuditDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getAuditDetailsInfo(id, modelName));
  };
}

export function getSystemGroups(company, model) {
  return (dispatch) => {
    dispatch(getSystemGroupsInfo(company, model));
  };
}

export function getStatusGroups(company, model) {
  return (dispatch) => {
    dispatch(getStatusGroupsInfo(company, model));
  };
}

export function getAuditDashboard(start, end, dashboardName) {
  return (dispatch) => {
    dispatch(getAuditDashboardInfo(start, end, dashboardName));
  };
}

export function getAuditAction(id, method, model, data) {
  return (dispatch) => {
    dispatch(getAuditActionInfo(id, method, model, data));
  };
}

export function resetAuditAction(result) {
  return {
    type: RESET_AUDIT_ACTION,
    payload: result,
  };
}

export function getOpportunities(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  return (dispatch) => {
    dispatch(getOpportunitiesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword));
  };
}

export function getOpportunitiesCount(company, model, customFilters, keyword) {
  return (dispatch) => {
    dispatch(getOpportunitiesCountInfo(company, model, customFilters, keyword));
  };
}

export function getOpportunitiesFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: OPPORTUNITIES_FILTERS,
    payload: result,
  };
}

export function getOpportunitiesDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getOpportunitiesDetailsInfo(id, modelName));
  };
}

export function getStageGroups(company, model) {
  return (dispatch) => {
    dispatch(getStatusGroupsInfo(company, model));
  };
}

export function getSystemAudit(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSystemAudits(company, model, keyword));
  };
}

export function getTeamMember(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTeamMembers(company, model, keyword));
  };
}

export function getAuditAssessments(id, modelName) {
  return (dispatch) => {
    dispatch(getAuditAssessmentsInfo(id, modelName));
  };
}

export function getAuditActions(id, modelName, type) {
  return (dispatch) => {
    dispatch(getAuditActionsInfo(id, modelName, type));
  };
}

export function updateAuditActionData(id, model, result) {
  return (dispatch) => {
    dispatch(updateAuditActionInfo(id, model, result));
  };
}

export function resetAuditUpdateAction(result) {
  return {
    type: RESET_AUDIT_ACTION_UPDATE,
    payload: result,
  };
}
