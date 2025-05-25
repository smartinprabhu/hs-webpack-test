/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import fieldsData from './data/customData.json';

export const GET_MAILROOM_INBOUND_INFO = 'GET_MAILROOM_INBOUND_INFO';
export const GET_MAILROOM_INBOUND_INFO_SUCCESS = 'GET_MAILROOM_INBOUND_INFO_SUCCESS';
export const GET_MAILROOM_INBOUND_INFO_FAILURE = 'GET_MAILROOM_INBOUND_INFO_FAILURE';

export const GET_MAILROOM_INBOUND_EXPORT_LIST_INFO = 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO';
export const GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_SUCCESS = 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_SUCCESS';
export const GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_FAILURE = 'GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_FAILURE';

export const GET_MAILROOM_INBOUND_COUNT_INFO = 'GET_MAILROOM_INBOUND_COUNT_INFO';
export const GET_MAILROOM_INBOUND_COUNT_INFO_SUCCESS = 'GET_MAILROOM_INBOUND_COUNT_INFO_SUCCESS';
export const GET_MAILROOM_INBOUND_COUNT_INFO_FAILURE = 'GET_MAILROOM_INBOUND_COUNT_INFO_FAILURE';

export const GET_MAILROOM_DASHBOARD_INFO = 'GET_MAILROOM_DASHBOARD_INFO';
export const GET_MAILROOM_DASHBOARD_INFO_SUCCESS = 'GET_MAILROOM_DASHBOARD_INFO_SUCCESS';
export const GET_MAILROOM_DASHBOARD_INFO_FAILURE = 'GET_MAILROOM_DASHBOARD_INFO_FAILURE';

export const GET_MAILROOM_OUTBOUND_INFO = 'GET_MAILROOM_OUTBOUND_INFO';
export const GET_MAILROOM_OUTBOUND_INFO_SUCCESS = 'GET_MAILROOM_OUTBOUND_INFO_SUCCESS';
export const GET_MAILROOM_OUTBOUND_INFO_FAILURE = 'GET_MAILROOM_OUTBOUND_INFO_FAILURE';

export const GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO = 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO';
export const GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_SUCCESS = 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_SUCCESS';
export const GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_FAILURE = 'GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_FAILURE';

export const GET_MAILROOM_OUTBOUND_COUNT_INFO = 'GET_MAILROOM_OUTBOUND_COUNT_INFO';
export const GET_MAILROOM_OUTBOUND_COUNT_INFO_SUCCESS = 'GET_MAILROOM_OUTBOUND_COUNT_INFO_SUCCESS';
export const GET_MAILROOM_OUTBOUND_COUNT_INFO_FAILURE = 'GET_MAILROOM_OUTBOUND_COUNT_INFO_FAILURE';

export const GET_INBOUND_MAIL_DETAILS_INFO = 'GET_INBOUND_MAIL_DETAILS_INFO';
export const GET_INBOUND_MAIL_DETAILS_INFO_SUCCESS = 'GET_INBOUND_MAIL_DETAILS_INFO_SUCCESS';
export const GET_INBOUND_MAIL_DETAILS_INFO_FAILURE = 'GET_INBOUND_MAIL_DETAILS_INFO_FAILURE';

export const GET_OUTBOUND_MAIL_DETAILS_INFO = 'GET_OUTBOUND_MAIL_DETAILS_INFO';
export const GET_OUTBOUND_MAIL_DETAILS_INFO_SUCCESS = 'GET_OUTBOUND_MAIL_DETAILS_INFO_SUCCESS';
export const GET_OUTBOUND_MAIL_DETAILS_INFO_FAILURE = 'GET_OUTBOUND_MAIL_DETAILS_INFO_FAILURE';

export const GET_REPORT_INFO = 'GET_REPORT_INFO';
export const GET_REPORT_INFO_SUCCESS = 'GET_REPORT_INFO_SUCCESS';
export const GET_REPORT_INFO_FAILURE = 'GET_REPORT_INFO_FAILURE';

export const GET_COURIER_INFO = 'GET_COURIER_INFO';
export const GET_COURIER_INFO_SUCCESS = 'GET_COURIER_INFO_SUCCESS';
export const GET_COURIER_INFO_FAILURE = 'GET_COURIER_INFO_FAILURE';

export const CREATE_COURIER = 'CREATE_COURIER';
export const CREATE_COURIER_SUCCESS = 'CREATE_COURIER_SUCCESS';
export const CREATE_COURIER_FAILURE = 'CREATE_COURIER_FAILURE';

export function createCourier(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_COURIER, CREATE_COURIER_SUCCESS, CREATE_COURIER_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getInboundMailInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = fieldsData && fieldsData.listFields ? fieldsData.listFields : [];

  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  if (!(sortByValue && sortByValue.length > 0 && sortFieldValue && sortFieldValue.length > 0)) {
    payload = `${payload}&order=create_date DESC`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAILROOM_INBOUND_INFO, GET_MAILROOM_INBOUND_INFO_SUCCESS, GET_MAILROOM_INBOUND_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInboundMailExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }
  if (!(sortByValue && sortByValue.length > 0 && sortFieldValue && sortFieldValue.length > 0)) {
    payload = `${payload}&order=create_date DESC`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAILROOM_INBOUND_EXPORT_LIST_INFO, GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_SUCCESS, GET_MAILROOM_INBOUND_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInboundMailCountInfo(company, model, customFilters, globalFilter, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_MAILROOM_INBOUND_COUNT_INFO, GET_MAILROOM_INBOUND_COUNT_INFO_SUCCESS, GET_MAILROOM_INBOUND_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function geMailDashboardInfo(start, end, dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardName}`,
      types: [GET_MAILROOM_DASHBOARD_INFO, GET_MAILROOM_DASHBOARD_INFO_SUCCESS, GET_MAILROOM_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getOutboundMailInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = fieldsData && fieldsData.listFieldsOutbound ? fieldsData.listFieldsOutbound : [];

  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  if (!(sortByValue && sortByValue.length > 0 && sortFieldValue && sortFieldValue.length > 0)) {
    payload = `${payload}&order=create_date DESC`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAILROOM_OUTBOUND_INFO, GET_MAILROOM_OUTBOUND_INFO_SUCCESS, GET_MAILROOM_OUTBOUND_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOutboundMailExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  if (!(sortByValue && sortByValue.length > 0 && sortFieldValue && sortFieldValue.length > 0)) {
    payload = `${payload}&order=create_date DESC`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO, GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_SUCCESS, GET_MAILROOM_OUTBOUND_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOutboundMailCountInfo(company, model, customFilters, globalFilter, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_MAILROOM_OUTBOUND_COUNT_INFO, GET_MAILROOM_OUTBOUND_COUNT_INFO_SUCCESS, GET_MAILROOM_OUTBOUND_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInboundMailDetailsInfo(id, modelName) {
  const fields = '["id",("collected_by", ["id", "name"]),"collected_on",("company_id", ["id", "name"]),("courier_id", ["id", "name"]),"create_date",("department_id", ["id", "display_name"]),("employee_id", ["id","name", "employee_id_seq", "work_email"]),"notes","parcel_dimensions",("received_by", ["id", "name"]),"received_on","recipient","sender","shelf","state","tracking_no",["message_ids", ["id"]]]';
  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_INBOUND_MAIL_DETAILS_INFO, GET_INBOUND_MAIL_DETAILS_INFO_SUCCESS, GET_INBOUND_MAIL_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getOutboundMailDetailsInfo(id, modelName) {
  const fields = '["id","address", "agent_name","signature",("delivered_by", ["id", "name"]),"delivered_on",("company_id", ["id", "name"]),("courier_id", ["id", "name"]),"create_date",("department_id", ["id", "display_name"]),("employee_id", ["id","name", "employee_id_seq", "work_email"]),"notes","parcel_dimensions",("sent_by", ["id", "name"]),"sent_on","recipient","sent_to","shelf","state","tracking_no",["message_ids", ["id"]]]';
  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_OUTBOUND_MAIL_DETAILS_INFO, GET_OUTBOUND_MAIL_DETAILS_INFO_SUCCESS, GET_OUTBOUND_MAIL_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getMailRoomDatas(company, model, start, end, status, employee, courier, department, isOutbound) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  let fields = '["id",("collected_by", ["id", "name"]),"collected_on",("company_id", ["id", "name"]),("courier_id", ["id", "name"]),"create_date",("department_id", ["id", "display_name"]),("employee_id", ["id","name"]),"notes","parcel_dimensions",("received_by", ["id", "name"]),"received_on","recipient","sender","shelf","state","tracking_no",["message_ids", ["id"]]]';
  if (isOutbound) {
    fields = '["id","address", ("delivered_by", ["id", "name"]),"delivered_on",("company_id", ["id", "name"]),("courier_id", ["id", "name"]),"create_date",("department_id", ["id", "display_name"]),("employee_id", ["id","name"]),"notes","parcel_dimensions",("sent_by", ["id", "name"]),"sent_on","recipient","sent_to","shelf","state","tracking_no",["message_ids", ["id"]]]';
  }

  if (start && end && isOutbound) {
    payload = `${payload},["sent_on",">=","${start}"],["sent_on","<=","${end}"]`;
  }
  if (start && end && !isOutbound) {
    payload = `${payload},["received_on",">=","${start}"],["received_on","<=","${end}"]`;
  }
  if (status && status.length) {
    payload = `${payload},["state","in",${JSON.stringify(status)}]`;
  }
  if (employee && employee.length) {
    payload = `${payload},["employee_id","in",${JSON.stringify(employee)}]`;
  }
  if (courier && courier.length) {
    payload = `${payload},["courier_id","in",${JSON.stringify(courier)}]`;
  }
  if (department && department.length) {
    payload = `${payload},["department_id","in",${JSON.stringify(department)}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_REPORT_INFO, GET_REPORT_INFO_SUCCESS, GET_REPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCourierInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COURIER_INFO, GET_COURIER_INFO_SUCCESS, GET_COURIER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
