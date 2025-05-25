import {
  getIncidentsListInfo, getIncidentsExportInfo,
  createHxIncidentInfo,
  getIncidentDetailInfo, getIncidentsCountInfo,
  getSlaAuditDashboardInfo, getHxSeveritiesInfo, getHxTypesInfo,
  getHxIncidentConfigInfo, updateIncidentInfo, getIncidentActionInfo,
  getSlaAuditPerformaceDetailsInfo,
  getCategoriesInfo, getLastCtInfo,
  getQuestionGroupsInfo, updateIncidentNoLoadInfo,
  getQuestionsResultsInfo, getTrackerExistsInfo,
  getHxcategoriesInfo, getHxSubCategoriesInfo, getHxPrioritiesInfo,
  getHxTaskTypesInfo,
} from './actions';

export const INCIDENTS_FILTERS = 'INCIDENTS_FILTERS';
export const RESET_CREATE_HX_INCIDENT = 'RESET_CREATE_HX_INCIDENT';
export const GET_ROWS_SLA_AUDIT = 'GET_ROWS_SLA_AUDIT';
export const RESET_INCIDENT_ACTION_INFO = 'RESET_INCIDENT_ACTION_INFO';
export const RESET_UPDATE_HX_INCIDENT = 'RESET_UPDATE_HX_INCIDENT';
export const RESET_INCIDENT_NO_INFO = 'RESET_INCIDENT_NO_INFO';

export function getIncidentsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getIncidentsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getIncidentsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getIncidentsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getIncidentsCount(company, model, states, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getIncidentsCountInfo(company, model, states, customFilters, globalFilter, keyword));
  };
}

export function getIncidentsFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: INCIDENTS_FILTERS,
    payload: customFiltersList,
  };
}

export function resetAddIncidentInfo(result) {
  return {
    type: RESET_CREATE_HX_INCIDENT,
    payload: result,
  };
}

export function getIncidentDetail(id, model) {
  return (dispatch) => {
    dispatch(getIncidentDetailInfo(id, model));
  };
}

export function createHxIncident(model, payload) {
  return (dispatch) => {
    dispatch(createHxIncidentInfo(model, payload));
  };
}

export function getCheckedRowsSlaAudit(payload) {
  return {
    type: GET_ROWS_SLA_AUDIT,
    payload,
  };
}

export function getSlaAuditDashboard(start, end) {
  return (dispatch) => {
    dispatch(getSlaAuditDashboardInfo(start, end));
  };
}

export function getHxSeverities(domain, model) {
  return (dispatch) => {
    dispatch(getHxSeveritiesInfo(domain, model));
  };
}

export function getHxTypes(domain, model) {
  return (dispatch) => {
    dispatch(getHxTypesInfo(domain, model));
  };
}

export function getHxIncidentConfig(id, model) {
  return (dispatch) => {
    dispatch(getHxIncidentConfigInfo(id, model));
  };
}

export function updateIncident(id, model, result) {
  return (dispatch) => {
    dispatch(updateIncidentInfo(id, model, result));
  };
}

export function updateIncidentNoLoad(id, model, result, noload) {
  return (dispatch) => {
    dispatch(updateIncidentNoLoadInfo(id, model, result, noload));
  };
}

export function getIncidentAction(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getIncidentActionInfo(id, state, modelName, data));
  };
}

export function resetCtAuditActionInfo(result) {
  return {
    type: RESET_INCIDENT_ACTION_INFO,
    payload: result,
  };
}

export function resetChecklistNoLoad(result) {
  return {
    type: RESET_INCIDENT_NO_INFO,
    payload: result,
  };
}

export function getSlaAuditPerformaceDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getSlaAuditPerformaceDetailsInfo(id, modelName));
  };
}

export function getCategories(id, modelName) {
  return (dispatch) => {
    dispatch(getCategoriesInfo(id, modelName));
  };
}

export function getQuestionGroups(id, modelName) {
  return (dispatch) => {
    dispatch(getQuestionGroupsInfo(id, modelName));
  };
}

export function getQuestionsResults(catId, qtnGrpId, tIds, modelName) {
  return (dispatch) => {
    dispatch(getQuestionsResultsInfo(catId, qtnGrpId, tIds, modelName));
  };
}

export function getLastCt(id, modelName) {
  return (dispatch) => {
    dispatch(getLastCtInfo(id, modelName));
  };
}

export function getTrackerExists(id, tempId, auditDate, modelName) {
  return (dispatch) => {
    dispatch(getTrackerExistsInfo(id, tempId, auditDate, modelName));
  };
}

export function getHxcategories(domain, model) {
  return (dispatch) => {
    dispatch(getHxcategoriesInfo(domain, model));
  };
}

export function getHxSubCategories(domain, model) {
  return (dispatch) => {
    dispatch(getHxSubCategoriesInfo(domain, model));
  };
}

export function getHxPriorities(domain, model) {
  return (dispatch) => {
    dispatch(getHxPrioritiesInfo(domain, model));
  };
}

export function resetUpdateIncidentInfo(result) {
  return {
    type: RESET_UPDATE_HX_INCIDENT,
    payload: result,
  };
}

export function getHxTaskTypes(domain, model) {
  return (dispatch) => {
    dispatch(getHxTaskTypesInfo(domain, model));
  };
}
