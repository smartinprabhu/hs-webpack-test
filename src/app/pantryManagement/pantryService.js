import {
  getPantryListInfo, getPantryListExportInfo,
  getPantryCountInfo, getPantryDetailInfo,
  getPantryOrderLinesInfo, getActionDataInfo,
  updateOrderInfo, createOrderInfo,
  getPantrySearchListInfo, getPantryGroupsInfo,
  getSpaceGroupsInfo,
  getPantryDashboardInfo, getProductsGroupsInfo, getConfigPantryListInfo, getConfigPantrysCountInfo,
  getConfigPantryInfo, createConfigPantryInfo, updateConfigPantryInfo, getConfigPantryListExportInfo, getParentCategoryInfo,
  getProductCategoryListInfo, getProductCategoryCountInfo, getProductCategoryListExportInfo, getDeleteInfo, getPcInfo,
  createProductCategoryInfo, updateProductCategoryInfo, getProductCategoryInfo, getAllReportsList, getPantryNames, createEscalationLevelInfo, updateEscalationLevelInfo,
} from './actions';

export const PANTRY_FILTERS = 'PANTRY_FILTERS';
export const CP_FILTERS = 'CP_FILTERS';
export const GET_ROWS_CP = 'GET_ROWS_CP';
export const RESET_CREATE_CP_INFO = 'RESET_CREATE_CP_INFO';
export const RESET_UPDATE_CP_INFO = 'RESET_UPDATE_CP_INFO';
export const RESET_PANTRY_ORDER_OPERATION_INFO = 'RESET_PANTRY_ORDER_OPERATION_INFO';
export const PC_FILTERS = 'PC_FILTERS';
export const RESET_DELETE_INFO = 'RESET_DELETE_INFO';
export const RESET_CREATE_PC_INFO = 'RESET_CREATE_PC_INFO';
export const RESET_UPDATE_PC_INFO = 'RESET_UPDATE_PC_INFO';
export const RESET_CREATE_PANTRY_ORDER_INFO = 'RESET_CREATE_PANTRY_ORDER_INFO';
export const RESET_UPDATE_PANTRY_ORDER_INFO = 'RESET_UPDATE_PANTRY_ORDER_INFO';
export const GET_SELECTED_REPORT_TYPE = 'GET_SELECTED_REPORT_TYPE';
export const SET_PRODUCT_IMAGE = 'SET_PRODUCT_IMAGE';
export const RESET_CREATE_ESL_INFO = 'RESET_CREATE_ESL_INFO';
export const RESET_UPDATE_ESL_INFO = 'RESET_UPDATE_ESL_INFO';
export const GET_SPACE_PANTRY = 'GET_SPACE_PANTRY';

export function getPantryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getPantryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getPantryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getPantryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getPantryCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getPantryCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getPantryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PANTRY_FILTERS,
    payload: result,
  };
}

export function getPantryDetail(id, modelName) {
  return (dispatch) => {
    dispatch(getPantryDetailInfo(id, modelName));
  };
}

export function getPantryDashboard(start, end) {
  return (dispatch) => {
    dispatch(getPantryDashboardInfo(start, end));
  };
}

export function getProductsGroups(company, model) {
  return (dispatch) => {
    dispatch(getProductsGroupsInfo(company, model));
  };
}

export function getConfigPantryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getConfigPantryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getConfigPantrysCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getConfigPantrysCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getConfigPantry(id, modelName) {
  return (dispatch) => {
    dispatch(getConfigPantryInfo(id, modelName));
  };
}

export function getConfigPantryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: CP_FILTERS,
    payload: result,
  };
}

export function getCheckedRowsConfigPantry(payload) {
  return {
    type: GET_ROWS_CP,
    payload,
  };
}

export function setLocationId(payload) {
  return {
    type: GET_SPACE_PANTRY,
    payload,
  };
}

export function createConfigPantry(model, result) {
  return (dispatch) => {
    dispatch(createConfigPantryInfo(model, result));
  };
}

export function resetCreateConfigPantry(result) {
  return {
    type: RESET_CREATE_CP_INFO,
    payload: result,
  };
}

export function resetUpdateConfigPantry(result) {
  return {
    type: RESET_UPDATE_CP_INFO,
    payload: result,
  };
}

export function updateConfigPantry(id, model, result) {
  return (dispatch) => {
    dispatch(updateConfigPantryInfo(id, model, result));
  };
}

export function getConfigPantryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getConfigPantryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getPantryOrderLines(id, model, result) {
  return (dispatch) => {
    dispatch(getPantryOrderLinesInfo(id, model, result));
  };
}

export function resetPantryAction(result) {
  return {
    type: RESET_PANTRY_ORDER_OPERATION_INFO,
    payload: result,
  };
}

export function getActionData(id, method, model) {
  return (dispatch) => {
    dispatch(getActionDataInfo(id, method, model));
  };
}

export function getParentCategory(model) {
  return (dispatch) => {
    dispatch(getParentCategoryInfo(model));
  };
}

export function getProductCategoryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getProductCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getProductCategoryCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getProductCategoryCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getProductCategoryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getProductCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getProductCategoryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PC_FILTERS,
    payload: result,
  };
}

export function getProductCategory(id, modelName) {
  return (dispatch) => {
    dispatch(getProductCategoryInfo(id, modelName));
  };
}

export function getDelete(id, model, state) {
  return (dispatch) => {
    dispatch(getDeleteInfo(id, model, state));
  };
}

export function resetDelete(result) {
  return {
    type: RESET_DELETE_INFO,
    payload: result,
  };
}

export function getPcList(model, keyword) {
  return (dispatch) => {
    dispatch(getPcInfo(model, keyword));
  };
}

export function createProductCategory(model, result) {
  return (dispatch) => {
    dispatch(createProductCategoryInfo(model, result));
  };
}

export function updateProductCategory(id, model, result) {
  return (dispatch) => {
    dispatch(updateProductCategoryInfo(id, model, result));
  };
}

export function updateProductCategoryNo(id, model, result) {
  return (dispatch) => {
    dispatch(updateProductCategoryInfoNoLoad(id, model, result));
  };
}

export function resetCreateProductCategory(result) {
  return {
    type: RESET_CREATE_PC_INFO,
    payload: result,
  };
}

export function resetUpdateProductCategory(result) {
  return {
    type: RESET_UPDATE_PC_INFO,
    payload: result,
  };
}

export function resetCreateOrder(result) {
  return {
    type: RESET_CREATE_PANTRY_ORDER_INFO,
    payload: result,
  };
}

export function resetUpdateOrder(result) {
  return {
    type: RESET_UPDATE_PANTRY_ORDER_INFO,
    payload: result,
  };
}

export function createOrder(model, payload) {
  return (dispatch) => {
    dispatch(createOrderInfo(model, payload));
  };
}

export function updateOrder(id, model, payload) {
  return (dispatch) => {
    dispatch(updateOrderInfo(id, model, payload));
  };
}

export function getPantrySearchList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPantrySearchListInfo(company, model, keyword));
  };
}

export function getPantryGroups(company, model) {
  return (dispatch) => {
    dispatch(getPantryGroupsInfo(company, model));
  };
}

export function getSpaceGroups(company, model) {
  return (dispatch) => {
    dispatch(getSpaceGroupsInfo(company, model));
  };
}

export function getAllReports(companyId, customFilters, model) {
  return (dispatch) => {
    dispatch(getAllReportsList(companyId, customFilters, model));
  };
}

export function getSelectedReportType(date) {
  return {
    type: GET_SELECTED_REPORT_TYPE,
    payload: date,
  };
}

export function getPantryName(company, model) {
  return (dispatch) => {
    dispatch(getPantryNames(company, model));
  };
}

export function setFileDataImage(result) {
  return {
    type: SET_PRODUCT_IMAGE,
    payload: result,
  };
}


export function createEscalationLevel(model, result) {
  return (dispatch) => {
    dispatch(createEscalationLevelInfo(model, result));
  };
}

export function updateEscalationLevel(id, model, result) {
  return (dispatch) => {
    dispatch(updateEscalationLevelInfo(id, model, result));
  };
}

export function resetCreateEscalationLevel(result) {
  return {
    type: RESET_CREATE_ESL_INFO,
    payload: result,
  };
}

export function resetUpdateEscalationLevel(result) {
  return {
    type: RESET_UPDATE_ESL_INFO,
    payload: result,
  };
}