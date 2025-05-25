import {
  getConsumptionTrackerListInfo, getConsumptionTrackerCountInfo,
  createConsumptionTrackerInfo,
  getCtDetails, getConsumptionTrackerExportInfo,
  getSlaAuditDashboardInfo, getTrackTemplatesInfo,
  getCtConfigInfo, updateCtInfo, getCtActionInfo,
  getSlaAuditPerformaceDetailsInfo,
  getCategoriesInfo, getLastCtInfo,
  getQuestionGroupsInfo,
  getQuestionsResultsInfo, getTrackerExistsInfo, getDecimalPrecisionGlobal,
  updateCtAltInfo,
} from './actions';

export const CONSUMPTION_TRACKER_FILTERS = 'CONSUMPTION_TRACKER_FILTERS';
export const RESET_ADD_CONS_TRACK = 'RESET_ADD_CONS_TRACK';
export const GET_ROWS_SLA_AUDIT = 'GET_ROWS_SLA_AUDIT';
export const RESET_CT_ACTION_INFO = 'RESET_CT_ACTION_INFO';
export const RESET_UPDATE_CT_INFO = 'RESET_UPDATE_CT_INFO';

export function getConsumptionTrackerList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getConsumptionTrackerListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getConsumptionTrackerExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getConsumptionTrackerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getConsumptionTrackerCount(company, model, states, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getConsumptionTrackerCountInfo(company, model, states, customFilters, globalFilter, keyword));
  };
}

export function getConsumptionTrackerFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: CONSUMPTION_TRACKER_FILTERS,
    payload: result,
  };
}

export function resetAddTrackerInfo(result) {
  return {
    type: RESET_ADD_CONS_TRACK,
    payload: result,
  };
}

export function getCtDetail(id, model) {
  return (dispatch) => {
    dispatch(getCtDetails(id, model));
  };
}

export function createConsumptionTracker(model, payload) {
  return (dispatch) => {
    dispatch(createConsumptionTrackerInfo(model, payload));
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

export function getTrackTemplates(domain, model) {
  return (dispatch) => {
    dispatch(getTrackTemplatesInfo(domain, model));
  };
}

export function getCtConfig(id, model) {
  return (dispatch) => {
    dispatch(getCtConfigInfo(id, model));
  };
}

export function updateCt(id, model, result, isChecklist) {
  return (dispatch) => {
    dispatch(updateCtInfo(id, model, result, isChecklist));
  };
}

export function getCtAction(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getCtActionInfo(id, state, modelName, data));
  };
}

export function resetCtAuditActionInfo(result) {
  return {
    type: RESET_CT_ACTION_INFO,
    payload: result,
  };
}

export function resetCtUpdateInfo(result) {
  return {
    type: RESET_UPDATE_CT_INFO,
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

export function updateCtAlt(id, model, result) {
  return (dispatch) => {
    dispatch(updateCtAltInfo(id, model, result));
  };
}

export function getDecimalPrecision(model) {
  return (dispatch) => {
    dispatch(getDecimalPrecisionGlobal(model));
  };
}
