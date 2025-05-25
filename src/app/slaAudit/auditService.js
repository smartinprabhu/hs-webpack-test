import {
  getSlaAuditListInfo, getSlaAuditCountInfo,
  createSlaAuditInfo,
  getSlaAuditDetails, getSlaAuditDetailsNoLoad, getSlaAuditExportInfo,
  getSlaAuditDashboardInfo, getSlaTemplatesInfo,
  getSLAConfigInfo, updateSlaAuditInfo, getSlaAuditActionInfo,
  updateSlaAuditStageInfo,
  getSlaAuditPerformaceDetailsInfo, getAuditExistsInfo,
  updateSlaAuditNoLoadInfo, getSlaSummaryDetails,
} from './actions';

export const SLA_AUDIT_FILTERS = 'SLA_AUDIT_FILTERS';
export const RESET_ADD_SLA_AUDIT = 'RESET_ADD_SLA_AUDIT';
export const GET_ROWS_SLA_AUDIT = 'GET_ROWS_SLA_AUDIT';
export const RESET_SLA_AUDIT_ACTION_INFO = 'RESET_SLA_AUDIT_ACTION_INFO';
export const RESET_UPDATE_SLA_AUDIT_STAGE_INFO = 'RESET_UPDATE_SLA_AUDIT_STAGE_INFO';

export function getSlaAuditList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getSlaAuditListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getSlaAuditExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getSlaAuditExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getSlaAuditCount(company, model, states, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getSlaAuditCountInfo(company, model, states, customFilters, globalFilter, keyword));
  };
}

export function getSlaAuditFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: SLA_AUDIT_FILTERS,
    payload: result,
  };
}

export function resetAddSlaAuditInfo(result) {
  return {
    type: RESET_ADD_SLA_AUDIT,
    payload: result,
  };
}

export function getSlaAuditDetail(id, model, nosla) {
  return (dispatch) => {
    dispatch(getSlaAuditDetails(id, model, nosla));
  };
}

export function getSlaAuditDetailNoLoad(id, model) {
  return (dispatch) => {
    dispatch(getSlaAuditDetailsNoLoad(id, model));
  };
}

export function createSlaAudit(model, payload) {
  return (dispatch) => {
    dispatch(createSlaAuditInfo(model, payload));
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

export function getSlaTemplates(domain, model) {
  return (dispatch) => {
    dispatch(getSlaTemplatesInfo(domain, model));
  };
}

export function getSLAConfig(id, model) {
  return (dispatch) => {
    dispatch(getSLAConfigInfo(id, model));
  };
}

export function updateSlaAudit(id, model, result, isChecklist) {
  return (dispatch) => {
    dispatch(updateSlaAuditInfo(id, model, result, isChecklist));
  };
}

export function getSlaAuditAction(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getSlaAuditActionInfo(id, state, modelName, data));
  };
}

export function resetSlaAuditActionInfo(result) {
  return {
    type: RESET_SLA_AUDIT_ACTION_INFO,
    payload: result,
  };
}

export function getSlaAuditPerformaceDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getSlaAuditPerformaceDetailsInfo(id, modelName));
  };
}

export function getAuditExists(id, tempId, auditDate, modelName) {
  return (dispatch) => {
    dispatch(getAuditExistsInfo(id, tempId, auditDate, modelName));
  };
}

export function updateSlaAuditNoLoad(id, model, result) {
  return (dispatch) => {
    dispatch(updateSlaAuditNoLoadInfo(id, model, result));
  };
}

export function updateSlaAuditStage(id, model, result) {
  return (dispatch) => {
    dispatch(updateSlaAuditStageInfo(id, model, result));
  };
}

export function getSlaSummaryDetailsInfo(id, modelName, nosla) {
  return (dispatch) => {
    dispatch(getSlaSummaryDetails(id, modelName, nosla));
  };
}

export function resetUpdateSlaAuditStage(result) {
  return {
    type: RESET_UPDATE_SLA_AUDIT_STAGE_INFO,
    payload: result,
  };
}
