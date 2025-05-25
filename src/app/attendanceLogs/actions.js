/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
// import assetColumns from './data/assetsActions.json';

export const GET_ATTENDANCE_DATA = 'GET_ATTENDANCE_DATA';
export const GET_ATTENDANCE_DATA_SUCCESS = 'GET_ATTENDANCE_DATA_SUCCESS';
export const GET_ATTENDANCE_DATA_FAILURE = 'GET_ATTENDANCE_DATA_FAILURE';

export const GET_ATTENDANCE_COUNT = 'GET_ATTENDANCE_COUNT';
export const GET_ATTENDANCE_COUNT_SUCCESS = 'GET_ATTENDANCE_COUNT_SUCCESS';
export const GET_ATTENDANCE_COUNT_FAILURE = 'GET_ATTENDANCE_COUNT_FAILURE';

export const GET_ATTEDANCE_EXPORT = 'GET_ATTEDANCE_EXPORT';
export const GET_ATTEDANCE_EXPORT_SUCCESS = 'GET_ATTEDANCE_EXPORT_SUCCESS';
export const GET_ATTEDANCE_EXPORT_FAILURE = 'GET_ATTEDANCE_EXPORT_FAILURE';

export const ATTENDANCE_FILTERS = 'ATTENDANCE_FILTERS';

export const GET_ATTEDANCE_DETAILS = 'GET_ATTEDANCE_DETAILS';
export const GET_ATTEDANCE_DETAILS_SUCCESS = 'GET_ATTEDANCE_DETAILS_SUCCESS';
export const GET_ATTEDANCE_DETAILS_FAILURE = 'GET_ATTEDANCE_DETAILS_FAILURE';

export const CREATE_ATT_EXPORT_INFO = 'CREATE_ATT_EXPORT_INFO';
export const CREATE_ATT_EXPORT_INFO_SUCCESS = 'CREATE_ATT_EXPORT_INFO_SUCCESS';
export const CREATE_ATT_EXPORT_INFO_FAILURE = 'CREATE_ATT_EXPORT_INFO_FAILURE';

export const GET_EXPORT_LINK_INFO = 'GET_EXPORT_LINK_INFO';
export const GET_EXPORT_LINK_INFO_SUCCESS = 'GET_EXPORT_LINK_INFO_SUCCESS';
export const GET_EXPORT_LINK_INFO_FAILURE = 'GET_EXPORT_LINK_INFO_FAILURE';

export function getAttendanceLogsData(company, model, limit, offset, sortByValue, sortFieldValue, categories, types, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=[]&limit=${limit}&offset=${offset}`;
  if (sortFieldValue) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue) {
    payload = `${payload} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ATTENDANCE_DATA, GET_ATTENDANCE_DATA_SUCCESS, GET_ATTENDANCE_DATA_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAttendanceCountData(company, model, categories, types, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ATTENDANCE_COUNT, GET_ATTENDANCE_COUNT_SUCCESS, GET_ATTENDANCE_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAttendanceExportInfo(company, model, fields, limit, offset, categories, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (types && types.length) {
    payload = `${payload},["type","in",${JSON.stringify(types)}]`;
  }
  if (categories && categories.length) {
    payload = `${payload},["categ_id","in",[${categories}]]`;
  }
  if (customFilters && customFilters.length) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ATTEDANCE_EXPORT, GET_ATTEDANCE_EXPORT_SUCCESS, GET_ATTEDANCE_EXPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAttendanceDetailsInfo(modelName, id) {
  const payload = `["id","ilike","${id}"]`;
  return {
    [CALL_API]: {
      endpoint: `isearch_read/${modelName}?domain=[${payload}]&fields=[]`,
      types: [GET_ATTEDANCE_DETAILS, GET_ATTEDANCE_DETAILS_SUCCESS, GET_ATTEDANCE_DETAILS_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function createExportInfo(model, result, context) {
  const payload = { model, values: result, context };
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_ATT_EXPORT_INFO, CREATE_ATT_EXPORT_INFO_SUCCESS, CREATE_ATT_EXPORT_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getExportLinkInfo(id, state, modelName, pdf, context) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state, context,
  };
  let method = 'POST';
  let endPoint = 'call';

  if (pdf) {
    endPoint = `report/download?ids=[${id}]&report=${modelName}`;
    method = 'GET';
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_EXPORT_LINK_INFO, GET_EXPORT_LINK_INFO_SUCCESS, GET_EXPORT_LINK_INFO_FAILURE],
      method,
      payload,
    },
  };
}
