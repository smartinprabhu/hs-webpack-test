import {
  getAttendanceLogsData, getExportLinkInfo, getAttendanceCountData, createExportInfo, getAttendanceExportInfo, getAttendanceDetailsInfo,
} from './actions';

export const ATTENDANCE_FILTERS = 'ATTENDANCE_FILTERS';
export const RESET_CREATE_ATT_EXPORT_INFO = 'RESET_CREATE_ATT_EXPORT_INFO';
export const RESET_EXPORT_LINK_INFO = 'RESET_EXPORT_LINK_INFO';
export const ATTENDANCE_REPORT = 'ATTENDANCE_REPORT';

// export function setSorting(result) {
//   return {
//     type: SET_SORTING,
//     payload: result,
//   };
// }

export function getAttendanceLogs(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getAttendanceLogsData(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter));
  };
}

export function getAttendanceCount(company, model, categories, types, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getAttendanceCountData(company, model, categories, types, customFilters, globalFilter));
  };
}

export function getAttendanceDetails(model, id) {
  return (dispatch) => {
    dispatch(getAttendanceDetailsInfo(model, id));
  };
}

export function getAttendanceExport(company, model, fields, limit, offset, categories, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getAttendanceExportInfo(company, model, fields, limit, offset, categories, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function attendanceFiltersData(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: ATTENDANCE_FILTERS,
    payload: result,
  };
}

export function createExport(model, result, conetxt) {
  return (dispatch) => {
    dispatch(createExportInfo(model, result, conetxt));
  };
}

export function resetCteateExport(result) {
  return {
    type: RESET_CREATE_ATT_EXPORT_INFO,
    payload: result,
  };
}

export function getExportLink(id, state, modelName, pdf, context) {
  return (dispatch) => {
    dispatch(getExportLinkInfo(id, state, modelName, pdf, context));
  };
}

export function resetExportLink(result) {
  return {
    type: RESET_EXPORT_LINK_INFO,
    payload: result,
  };
}

export function attendanceReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: ATTENDANCE_REPORT,
    payload: resultData,
  };
}



