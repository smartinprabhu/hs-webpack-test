import {
  getInboundMailInfo, getInboundMailExportInfo, createCourier,
  getInboundMailCountInfo, geMailDashboardInfo,
  getOutboundMailInfo, getOutboundMailExportInfo,
  getOutboundMailCountInfo, getOutboundMailDetailsInfo,
  getInboundMailDetailsInfo, getMailRoomDatas, getCourierInfo,
} from './actions';

export const MAIL_INBOUND_FILTERS = 'MAIL_INBOUND_FILTERS';
export const MAIL_OUTBOUND_FILTERS = 'MAIL_OUTBOUND_FILTERS';
export const RESET_REPORT_INFO = 'RESET_REPORT_INFO';

export function getInboundMail(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getInboundMailInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getInboundMailExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getInboundMailExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getInboundMailCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getInboundMailCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getInBoundFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: MAIL_INBOUND_FILTERS,
    payload: result,
  };
}

export function getOutboundMail(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getOutboundMailInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getOutboundMailExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getOutboundMailExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getOutboundMailCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getOutboundMailCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getOutboundFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: MAIL_OUTBOUND_FILTERS,
    payload: result,
  };
}

export function geMailDashboard(start, end, name) {
  return (dispatch) => {
    dispatch(geMailDashboardInfo(start, end, name));
  };
}

export function getInboundMailDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getInboundMailDetailsInfo(id, modelName));
  };
}

export function getOutboundMailDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getOutboundMailDetailsInfo(id, modelName));
  };
}

export function getMailRoomData(company, model, start, end, status, employee, courier, department, isOutbound) {
  return (dispatch) => {
    dispatch(getMailRoomDatas(company, model, start, end, status, employee, courier, department, isOutbound));
  };
}

export function resetMailRoomReport(result) {
  return {
    type: RESET_REPORT_INFO,
    payload: result,
  };
}

export function getCourier(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCourierInfo(company, model, keyword));
  };
}

export function addCourierData(model, result) {
  return (dispatch) => {
    dispatch(createCourier(model, result));
  };
}
export function resetCourierData(result) {
  return {
    type: 'RESET_COURIER_DATA',
    payload: result,
  };
}