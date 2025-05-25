import {
  getTankerInfo, getTankerExportInfo,
  getTankerCountInfo, geTankerDashboardInfo,
  getTankerDetailsInfo, getTankerConfigInfo, tankerStateChangeInfo, updateReasonBack, getTransactionRoomDatas, getCommodityInfo, getVendorGroupsInfo, getCommodityGroupsInfo, getTankerTransactionInfo,
} from './actions';

export const TANKER_FILTERS = 'TANKER_FILTERS';
export const RESET_REPORT_INFO = 'RESET_REPORT_INFO';
export const RESET_TANKER_STATE_CHANGE_INFO = 'RESET_TANKER_STATE_CHANGE_INFO';

export function getTanker(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getTankerInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getTankerExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getTankerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getTankerCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getTankerCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getTankerFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: TANKER_FILTERS,
    payload: result,
  };
}

export function geTankerDashboard(start, end, name) {
  return (dispatch) => {
    dispatch(geTankerDashboardInfo(start, end, name));
  };
}

export function getTankerDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getTankerDetailsInfo(id, modelName));
  };
}

export function getTransactionRoomData(company, model, start, end, start1, end1, commodity, vendor) {
  return (dispatch) => {
    dispatch(getTransactionRoomDatas(company, model, start, end, start1, end1, commodity, vendor));
  };
}

export function resetTransactionRoomReport(result) {
  return {
    type: RESET_REPORT_INFO,
    payload: result,
  };
}

export function getCommodity(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCommodityInfo(company, model, keyword));
  };
}

export function getTankerTransaction(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTankerTransactionInfo(company, model, keyword));
  };
}

export function getVendorGroups(company, model) {
  return (dispatch) => {
    dispatch(getVendorGroupsInfo(company, model));
  };
}
export function getCommodityGroups(company, model) {
  return (dispatch) => {
    dispatch(getCommodityGroupsInfo(company, model));
  };
}

export function getTankerConfig(id, modelName) {
  return (dispatch) => {
    dispatch(getTankerConfigInfo(id, modelName));
  };
}

export function tankerStateChange(id, state, modelName, contex) {
  return (dispatch) => {
    dispatch(tankerStateChangeInfo(id, state, modelName, contex));
  };
}

export function resetTankerState(result) {
  return {
    type: RESET_TANKER_STATE_CHANGE_INFO,
    payload: result,
  };
}

export function updateReason(id, result, modelName) {
  return (dispatch) => {
    dispatch(updateReasonBack(id, result, modelName));
  };
}
