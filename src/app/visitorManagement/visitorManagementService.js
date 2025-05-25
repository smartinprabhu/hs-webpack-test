import {
  getVisitorRequestListInfo, getStatusLogsInfo, getVisitorRequestCountInfo, getVmsConfigList, getVmsConfigurationInfo,
  getVisitorRequestListExportInfo, getVisitorRequestDetails, getVmDashboardInfo, visitStateChangeInfo,
  createVisitRequestInfo, getIdProofInfo, getHostCompanyInfo, getHostCompanyGroupsInfo, timeElapsedDetailsInfo, getVisitorLog, getVisitorTypesInfo, getAssetTypesInfo, getVisitorTypeGroupsInfo, getAssetsDetailInfo,
} from './actions';

export const VR_FILTERS = 'VR_FILTERS';
export const GET_ROWS_VRS = 'GET_ROWS_VRS';
export const GET_VR_STATE_RESET_INFO = 'GET_VR_STATE_RESET_INFO';
export const RESET_ADD_VR_INFO = 'RESET_ADD_VR_INFO';
export const STORE_CUSTOM_DATE_FILTERS = 'STORE_CUSTOM_DATE_FILTERS';
export const GET_ROWS_PARTS_SELECTED = 'GET_ROWS_PARTS_SELECTED';


export function getVisitorRequestList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getVisitorRequestListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getVisitorRequestListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getVisitorRequestListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getPartsData(result) {
  return {
    type: GET_ROWS_PARTS_SELECTED,
    payload: result,
  };
}

export function getVisitorRequestCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getVisitorRequestCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getVisitorRequestFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: VR_FILTERS,
    payload: result,
  };
}

export function storeDateFilters(payload) {
  return {
    type: STORE_CUSTOM_DATE_FILTERS,
    payload,
  };
}

export function timeElapsedDetails(id, state, modelName) {
  return (dispatch) => {
    dispatch(timeElapsedDetailsInfo(id, state, modelName));
  };
}

export function getVisitorRequestRows(payload) {
  return {
    type: GET_ROWS_VRS,
    payload,
  };
}

export function getVisitorRequestDetail(id, modelName) {
  return (dispatch) => {
    dispatch(getVisitorRequestDetails(id, modelName));
  };
}

export function getVmDashboard(start, end) {
  return (dispatch) => {
    dispatch(getVmDashboardInfo(start, end));
  };
}

export function visitStateChange(id, state, model, contex, isUpdate, payload) {
  return (dispatch) => {
    dispatch(visitStateChangeInfo(id, state, model, contex, isUpdate, payload));
  };
}

export function resetVisitState(result) {
  return {
    type: GET_VR_STATE_RESET_INFO,
    payload: result,
  };
}

export function createVisitRequest(model, payload) {
  return (dispatch) => {
    dispatch(createVisitRequestInfo(model, payload));
  };
}

export function resetAddVisitRequest(result) {
  return {
    type: RESET_ADD_VR_INFO,
    payload: result,
  };
}

export function getIdProof(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIdProofInfo(company, model, keyword));
  };
}

export function getVisitorTypes(company, model, keyword, ids) {
  return (dispatch) => {
    dispatch(getVisitorTypesInfo(company, model, keyword, ids));
  };
}

export function getAssetDetails(model, ids) {
  return (dispatch) => {
    dispatch(getAssetsDetailInfo(model, ids));
  };
}

export function getAssetTypes(company, model, keyword, ids) {
  return (dispatch) => {
    dispatch(getAssetTypesInfo(company, model, keyword, ids));
  };
}

export function getHostCompany(company, model, keyword, ids) {
  return (dispatch) => {
    dispatch(getHostCompanyInfo(company, model, keyword, ids));
  };
}

export function getHostCompanyGroups(company, model) {
  return (dispatch) => {
    dispatch(getHostCompanyGroupsInfo(company, model));
  };
}

export function getVmsConfigInfo(company, model) {
  return (dispatch) => {
    dispatch(getVmsConfigList(company, model));
  };
}

export function getVisitorTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getVisitorTypeGroupsInfo(company, model));
  };
}

export function getVmsConfigurationData(company, model) {
  return (dispatch) => {
    dispatch(getVmsConfigurationInfo(company, model));
  };
}

export function getVisitorLogData(company, model, apiFields, keyword, onClickYes) {
  return (dispatch) => {
    dispatch(getVisitorLog(company, model, apiFields, keyword, onClickYes));
  };
}

export function getStatusLogs(ids, model, limit) {
  return (dispatch) => {
    dispatch(getStatusLogsInfo(ids, model, limit));
  };
}
