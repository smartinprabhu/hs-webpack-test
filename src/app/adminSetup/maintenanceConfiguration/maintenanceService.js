/* eslint-disable max-len */
import {
  getPPMListInfo, getPPMCountInfo, getCategoryGroupsInfo,
  getCheckListCountInfo, getCheckListInfo, getToolsInfo, getToolsCountInfo,
  getPartsInfo, getPartsCountInfo, getUpdateToolInfo, getDeleteChecklistInfo,
  getDeleteOperationInfo, getOperationsExportInfo, getChecklistsExportInfo,
  getToolsExportInfo, getPartsExportInfo, getExpensesInfo, getExpensesCountInfo, getExpensesTypeGroupsInfo, getExpensesDetailInfo, getExpensesTypesInfo, getExpensesExportInfo, createExpensesInfo, updateExpensesInfo, getExpensesSubTypesInfo, createImportIdInfo, uploadImportInfo,
} from './actions';

export const PPM_FILTERS = 'PPM_FILTERS';
export const CHECKLIST_FILTERS = 'CHECKLIST_FILTERS';
export const PARTS_FILTERS = 'PARTS_FILTERS';
export const TOOLS_FILTERS = 'TOOLS_FILTERS';
export const RESET_UPDATE_TOOl_INFO = 'RESET_UPDATE_TOOl_INFO';
export const RESET_DELETE_CHECKLIST_INFO = 'RESET_DELETE_CHECKLIST_INFO';
export const RESET_DELETE_OPERATION_INFO = 'RESET_DELETE_OPERATION_INFO';
export const OPERATIONAL_FILTERS = 'OPERATIONAL_FILTERS';
export const RESET_EXPENSES_UPDATE = 'RESET_EXPENSES_UPDATE';
export const RESET_UPLOAD_BULK_INFO = 'RESET_UPLOAD_BULK_INFO';
export const RESET_EXPENSES_INFO = 'RESET_EXPENSES_INFO';

export function getPPMList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getPPMListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getOperationsExport(company, model, limit, offset, fields, states, customFilters, rows, globalFilter) {
  return (dispatch) => {
    dispatch(getOperationsExportInfo(company, model, limit, offset, fields, states, customFilters, rows, globalFilter));
  };
}

export function getPPMCount(company, model, states, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getPPMCountInfo(company, model, states, customFilters, globalFilter));
  };
}

export function getCheckList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getCheckListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getCheckListCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getCheckListCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getTools(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getToolsInfo(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue));
  };
}

export function getToolsCount(company, model, statusValue, customFilters) {
  return (dispatch) => {
    dispatch(getToolsCountInfo(company, model, statusValue, customFilters));
  };
}

export function getParts(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue, menuType, globalFilter) {
  return (dispatch) => {
    dispatch(getPartsInfo(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue, menuType, globalFilter));
  };
}

export function getPartsCount(company, model, statusValue, customFilters, menuType, globalFilter) {
  return (dispatch) => {
    dispatch(getPartsCountInfo(company, model, statusValue, customFilters, menuType, globalFilter));
  };
}
export function getOperationalExpenses(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, menuType) {
  return (dispatch) => {
    dispatch(getExpensesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, menuType));
  };
}

export function getOperationalExpensesCount(company, model, customFilters, menuType) {
  return (dispatch) => {
    dispatch(getExpensesCountInfo(company, model, customFilters, menuType));
  };
}

export function getPPMFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PPM_FILTERS,
    payload: result,
  };
}

export function getChecklistFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: CHECKLIST_FILTERS,
    payload: result,
  };
}

export function getPartsFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PARTS_FILTERS,
    payload: result,
  };
}

export function getOperationalFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: OPERATIONAL_FILTERS,
    payload: result,
  };
}

export function getToolsFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: TOOLS_FILTERS,
    payload: result,
  };
}

export function updateTool(id, model, payload) {
  return (dispatch) => {
    dispatch(getUpdateToolInfo(id, model, payload));
  };
}

export function resetUpdateTool(result) {
  return {
    type: RESET_UPDATE_TOOl_INFO,
    payload: result,
  };
}

export function getDeleteChecklist(id, model) {
  return (dispatch) => {
    dispatch(getDeleteChecklistInfo(id, model));
  };
}

export function resetDeleteChecklist(result) {
  return {
    type: RESET_DELETE_CHECKLIST_INFO,
    payload: result,
  };
}

export function getDeleteOperation(id, model) {
  return (dispatch) => {
    dispatch(getDeleteOperationInfo(id, model));
  };
}

export function resetDeleteOperation(result) {
  return {
    type: RESET_DELETE_OPERATION_INFO,
    payload: result,
  };
}

export function getChecklistsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getChecklistsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getToolsExport(company, model, limit, offset, fields, statusValue, customFilters, rows) {
  return (dispatch) => {
    dispatch(getToolsExportInfo(company, model, limit, offset, fields, statusValue, customFilters, rows));
  };
}

export function getPartsExport(company, model, limit, offset, fields, statusValue, customFilters, rows, menuType, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getPartsExportInfo(company, model, limit, offset, fields, statusValue, customFilters, rows, menuType, sortByValue, sortFieldValue));
  };
}

export function getExpensesTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getExpensesTypeGroupsInfo(company, model));
  };
}

export function getExpensesDetail(id, fields, model) {
  return (dispatch) => {
    dispatch(getExpensesDetailInfo(id, fields, model));
  };
}

export function getExpensesTypes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getExpensesTypesInfo(company, model, keyword));
  };
}

export function getExpensesItemTypes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getExpensesSubTypesInfo(company, model, keyword));
  };
}

export function getExpensesExport(company, model, limit, offset, fields, customFilters, rows, menuType) {
  return (dispatch) => {
    dispatch(getExpensesExportInfo(company, model, limit, offset, fields, customFilters, rows, menuType));
  };
}

export function createExpenses(payload) {
  return (dispatch) => {
    dispatch(createExpensesInfo(payload));
  };
}

export function updateExpenses(id, model, payload) {
  return (dispatch) => {
    dispatch(updateExpensesInfo(id, model, payload));
  };
}

export function resetExpensesInfo(result) {
  return {
    type: RESET_EXPENSES_UPDATE,
    payload: result,
  };
}

export function createImportId(model, payload) {
  return (dispatch) => {
    dispatch(createImportIdInfo(model, payload));
  };
}

export function uploadImport(payload) {
  return (dispatch) => {
    dispatch(uploadImportInfo(payload));
  };
}

export function resetUploadImport(result) {
  return {
    type: RESET_UPLOAD_BULK_INFO,
    payload: result,
  };
}

export function resetExpenses(result) {
  return {
    type: RESET_EXPENSES_INFO,
    payload: result,
  };
}
