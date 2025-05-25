import {
  getGatePassInfo, getGatePassExportInfo,
  getGatePassCountInfo, getGatePassDetailsInfo,
  getGatePassConfigInfo, geGatePassDashboardInfo,
  updateGatePassInfo, createGatePassInfo, getGpActionInfo,
} from './actions';

export const GATEPASS_FILTERS = 'GATEPASS_FILTERS';
export const RESET_CREATE_GP_INFO = 'RESET_CREATE_GP_INFO';
export const RESET_UPDATE_GP_INFO = 'RESET_UPDATE_GP_INFO';
export const GET_ROWS_PARTS_SELECTED = 'GET_ROWS_PARTS_SELECTED';
export const RESET_GP_ACTION_INFO = 'RESET_GP_ACTION_INFO';

export function getGatePass(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getGatePassInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getGatePassExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue,globalFilter) {
  return (dispatch) => {
    dispatch(getGatePassExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue,globalFilter));
  };
}

export function getGatePassCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getGatePassCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getGatePassFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: GATEPASS_FILTERS,
    payload: result,
  };
}

export function getGatePassDetails(id, modelName, noLoad) {
  return (dispatch) => {
    dispatch(getGatePassDetailsInfo(id, modelName, noLoad));
  };
}

export function getGatePassConfig(company, modelName) {
  return (dispatch) => {
    dispatch(getGatePassConfigInfo(company, modelName));
  };
}

export function geGatePassDashboard(start, end, dashboardName) {
  return (dispatch) => {
    dispatch(geGatePassDashboardInfo(start, end, dashboardName));
  };
}

export function createGatePass(model, result) {
  return (dispatch) => {
    dispatch(createGatePassInfo(model, result));
  };
}

export function updateGatePass(id, model, result, noLoad) {
  return (dispatch) => {
    dispatch(updateGatePassInfo(id, model, result, noLoad));
  };
}

export function getGpAction(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getGpActionInfo(id, state, modelName, data));
  };
}

export function resetCreateGatePass(result) {
  return {
    type: RESET_CREATE_GP_INFO,
    payload: result,
  };
}

export function resetUpdateGatePass(result) {
  return {
    type: RESET_UPDATE_GP_INFO,
    payload: result,
  };
}

export function getGatePassPartsData(result) {
  return {
    type: GET_ROWS_PARTS_SELECTED,
    payload: result,
  };
}

export function resetGpActionInfo(result) {
  return {
    type: RESET_GP_ACTION_INFO,
    payload: result,
  };
}
