import {
  getAuditGroupsInfo,
  getAuditViewerInfo,
  getHxAuditConfig,
  getAuditSystemsInfo,
  getAuditDepartmentsInfo,
  updateHxAuditInfo,
  createHxAuditInfo,
  getHxAuditDetailsInfo,
  getHxAuditChecklistsInfo,
  getHxAuditNamesInfo,
  getHxAuditRolesInfo,
  getHxActionDaysInfo,
  createHxActionInfo,
  getHxAuditActionsInfo,
  getAuditCategoriesInfo,
  getHxAuditActionsListInfo,
  getHxAuditActionsExportInfo,
  getHxAuditActionsCountInfo,
  getHxAuditActionDetailInfo,
  getHxAuditActionPerformInfo,
  getCustomGroupInfo,
  getDeleteAuditActionInfo,
  getSystemChecklistsInfo,
  getHxAuditChecklistDetailInfo,
  getHxAuditSystemsListInfo,
  getHxAuditSystemsExportInfo,
  getHxAuditSystemsCountInfo,
  getHxAuditSystemDetailInfo,
  createHxSystemInfo,
  updateHxSystemInfo,
  createHxQuestionGroupInfo,
  getAuditMetricsInfo,
  getAuditQuestionRepeatedInfo,
  getAuditExportViewerInfo,
  getHxAuditorsListInfo,
  getHxAuditorsExportInfo,
  getHxAuditorsCountInfo,
} from './actions';

export const RESET_AUDIT_VIEWER_GROUP_INFO = 'RESET_AUDIT_VIEWER_GROUP_INFO';
export const RESET_CREATE_HX_AUDIT_INFO = 'RESET_CREATE_HX_AUDIT_INFO';
export const RESET_UPDATE_HX_AUDIT_INFO = 'RESET_UPDATE_HX_AUDIT_INFO';
export const RESET_CREATE_HX_ACTION_INFO = 'RESET_CREATE_HX_ACTION_INFO';
export const AUDIT_ACTION_FILTERS = 'AUDIT_ACTION_FILTERS';
export const RESET_HXAUDIT_ACTION_PERFORM_INFO = 'RESET_HXAUDIT_ACTION_PERFORM_INFO';
export const RESET_CUSTOM_DATA_AUDIT_GROUP_INFO = 'RESET_CUSTOM_DATA_AUDIT_GROUP_INFO';
export const RESET_DELETE_AUDIT_ACTION_INFO = 'RESET_DELETE_AUDIT_ACTION_INFO';
export const AUDIT_SYSTEM_FILTERS = 'AUDIT_SYSTEM_FILTERS';
export const RESET_CREATE_HX_SYSTEM_INFO = 'RESET_CREATE_HX_SYSTEM_INFO';
export const RESET_UPDATE_HX_SYSTEM_INFO = 'RESET_UPDATE_HX_SYSTEM_INFO';
export const RESET_HX_QTN_GROUP_INFO = 'RESET_HX_QTN_GROUP_INFO';
export const AUDITORS_CONFIG_FILTERS = 'AUDITORS_CONFIG_FILTERS';

export function getAuditGroups(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters) {
  return (dispatch) => {
    dispatch(getAuditGroupsInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters));
  };
}

export function getAuditViewer(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit) {
  return (dispatch) => {
    dispatch(getAuditViewerInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit));
  };
}

export function getAuditExportViewer(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit) {
  return (dispatch) => {
    dispatch(getAuditExportViewerInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit));
  };
}

export function resetAuditViewer(result) {
  return {
    type: RESET_AUDIT_VIEWER_GROUP_INFO,
    payload: result,
  };
}

export function getAuditDepartments(domain, model) {
  return (dispatch) => {
    dispatch(getAuditDepartmentsInfo(domain, model));
  };
}

export function getAuditMetrics(domain, model) {
  return (dispatch) => {
    dispatch(getAuditMetricsInfo(domain, model));
  };
}

export function getAuditSystems(domain, model) {
  return (dispatch) => {
    dispatch(getAuditSystemsInfo(domain, model));
  };
}

export function getHxAuditConfigData(id, modelName) {
  return (dispatch) => {
    dispatch(getHxAuditConfig(id, modelName));
  };
}

export function createHxAudit(model, result) {
  return (dispatch) => {
    dispatch(createHxAuditInfo(model, result));
  };
}

export function updateHxAudit(id, model, result) {
  return (dispatch) => {
    dispatch(updateHxAuditInfo(id, model, result));
  };
}

export function resetCreateHxAudit(result) {
  return {
    type: RESET_CREATE_HX_AUDIT_INFO,
    payload: result,
  };
}

export function resetUpdateHxAudit(result) {
  return {
    type: RESET_UPDATE_HX_AUDIT_INFO,
    payload: result,
  };
}

export function getHxAuditDetails(id, modelName, noLoad) {
  return (dispatch) => {
    dispatch(getHxAuditDetailsInfo(id, modelName, noLoad));
  };
}

export function getHxAuditChecklists(id, modelName, noLoad) {
  return (dispatch) => {
    dispatch(getHxAuditChecklistsInfo(id, modelName, noLoad));
  };
}

export function getHxAuditNames(company, modelName, keyword, ids, isAuditee) {
  return (dispatch) => {
    dispatch(getHxAuditNamesInfo(company, modelName, keyword, ids, isAuditee));
  };
}

export function getHxAuditRoles(company, modelName, keyword, ids, isAuditee) {
  return (dispatch) => {
    dispatch(getHxAuditRolesInfo(company, modelName, keyword, ids, isAuditee));
  };
}

export function getHxActionDays() {
  return (dispatch) => {
    dispatch(getHxActionDaysInfo());
  };
}

export function createHxAction(model, result, editId) {
  return (dispatch) => {
    dispatch(createHxActionInfo(model, result, editId));
  };
}

export function resetCreateHxAction(result) {
  return {
    type: RESET_CREATE_HX_ACTION_INFO,
    payload: result,
  };
}

export function getHxAuditActions(modelName, id, questionId) {
  return (dispatch) => {
    dispatch(getHxAuditActionsInfo(modelName, id, questionId));
  };
}

export function getAuditCategories(domain, model) {
  return (dispatch) => {
    dispatch(getAuditCategoriesInfo(domain, model));
  };
}

export function getHxAuditActionsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxAuditActionsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getHxAuditActionsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxAuditActionsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId));
  };
}

export function getHxAuditActionsCount(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxAuditActionsCountInfo(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getActionFilters(customFiltersList) {
  return {
    type: AUDIT_ACTION_FILTERS,
    payload: customFiltersList,
  };
}

export function getHxAuditActionDetail(id, modelName, noLoad) {
  return (dispatch) => {
    dispatch(getHxAuditActionDetailInfo(id, modelName, noLoad));
  };
}

export function resetHxAuditActionPerform(result) {
  return {
    type: RESET_HXAUDIT_ACTION_PERFORM_INFO,
    payload: result,
  };
}

export function getHxAuditActionPerform(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getHxAuditActionPerformInfo(id, state, modelName, data));
  };
}

export function getCustomGroup(company, model, field, start, end) {
  return (dispatch) => {
    dispatch(getCustomGroupInfo(company, model, field, start, end));
  };
}

export function resetCustomGroup(result) {
  return {
    type: RESET_CUSTOM_DATA_AUDIT_GROUP_INFO,
    payload: result,
  };
}

export function resetDeleteAuditAction(result) {
  return {
    type: RESET_DELETE_AUDIT_ACTION_INFO,
    payload: result,
  };
}

export function getDeleteAuditAction(id, modelName) {
  return (dispatch) => {
    dispatch(getDeleteAuditActionInfo(id, modelName));
  };
}

export function getSystemChecklists(id, modelName) {
  return (dispatch) => {
    dispatch(getSystemChecklistsInfo(id, modelName));
  };
}

export function getHxAuditChecklistDetail(auditId, questionId) {
  return (dispatch) => {
    dispatch(getHxAuditChecklistDetailInfo(auditId, questionId));
  };
}

export function getHxAuditSystemsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditSystemsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getHxAuditSystemsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditSystemsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getHxAuditSystemsCount(company, model, states, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditSystemsCountInfo(company, model, states, customFilters, globalFilter));
  };
}

export function getSystemFilters(customFiltersList) {
  return {
    type: AUDIT_SYSTEM_FILTERS,
    payload: customFiltersList,
  };
}

export function getHxAuditSystemDetail(id, modelName, noLoad) {
  return (dispatch) => {
    dispatch(getHxAuditSystemDetailInfo(id, modelName, noLoad));
  };
}

export function updateHxSystem(id, model, result, noLoad) {
  return (dispatch) => {
    dispatch(updateHxSystemInfo(id, model, result, noLoad));
  };
}

export function createHxSystem(model, result) {
  return (dispatch) => {
    dispatch(createHxSystemInfo(model, result));
  };
}

export function resetCreateSytem(result) {
  return {
    type: RESET_CREATE_HX_SYSTEM_INFO,
    payload: result,
  };
}

export function resetUpdateSystem(result) {
  return {
    type: RESET_UPDATE_HX_SYSTEM_INFO,
    payload: result,
  };
}

export function createHxQuestionGroup(model, result) {
  return (dispatch) => {
    dispatch(createHxQuestionGroupInfo(model, result));
  };
}

export function resetHxQuestionGroup(result) {
  return {
    type: RESET_HX_QTN_GROUP_INFO,
    payload: result,
  };
}

export function getAuditQuestionRepeated(qtnId) {
  return (dispatch) => {
    dispatch(getAuditQuestionRepeatedInfo(qtnId));
  };
}

export function getHxAuditorsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditorsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getHxAuditorsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditorsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getHxAuditorsCount(company, model, states, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getHxAuditorsCountInfo(company, model, states, customFilters, globalFilter));
  };
}

export function getAuditorsFilters(customFiltersList) {
  return {
    type: AUDITORS_CONFIG_FILTERS,
    payload: customFiltersList,
  };
}
