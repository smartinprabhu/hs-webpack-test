/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import { TransactionModule } from '../util/field';
import fieldsData from './data/customData.json';

export const GET_TANKER_INFO = 'GET_TANKER_INFO';
export const GET_TANKER_INFO_SUCCESS = 'GET_TANKER_INFO_SUCCESS';
export const GET_TANKER_INFO_FAILURE = 'GET_TANKER_INFO_FAILURE';

export const GET_TANKER_EXPORT_LIST_INFO = 'GET_TANKER_EXPORT_LIST_INFO';
export const GET_TANKER_EXPORT_LIST_INFO_SUCCESS = 'GET_TANKER_EXPORT_LIST_INFO_SUCCESS';
export const GET_TANKER_EXPORT_LIST_INFO_FAILURE = 'GET_TANKER_EXPORT_LIST_INFO_FAILURE';

export const GET_TANKER_COUNT_INFO = 'GET_TANKER_COUNT_INFO';
export const GET_TANKER_COUNT_INFO_SUCCESS = 'GET_TANKER_COUNT_INFO_SUCCESS';
export const GET_TANKER_COUNT_INFO_FAILURE = 'GET_TANKER_COUNT_INFO_FAILURE';

export const GET_TANKER_DASHBOARD_INFO = 'GET_TANKER_DASHBOARD_INFO';
export const GET_TANKER_DASHBOARD_INFO_SUCCESS = 'GET_TANKER_DASHBOARD_INFO_SUCCESS';
export const GET_TANKER_DASHBOARD_INFO_FAILURE = 'GET_TANKER_DASHBOARD_INFO_FAILURE';

export const GET_TANKER_DETAILS_INFO = 'GET_TANKER_DETAILS_INFO';
export const GET_TANKER_DETAILS_INFO_SUCCESS = 'GET_TANKER_DETAILS_INFO_SUCCESS';
export const GET_TANKER_DETAILS_INFO_FAILURE = 'GET_TANKER_DETAILS_INFO_FAILURE';

export const GET_VENDOR_GROUP_INFO = 'GET_VENDOR_GROUP_INFO';
export const GET_VENDOR_GROUP_INFO_SUCCESS = 'GET_VENDOR_GROUP_INFO_SUCCESS';
export const GET_VENDOR_GROUP_INFO_FAILURE = 'GET_VENDOR_GROUP_INFO_FAILURE';

export const GET_COMMODITY_GROUP_INFO = 'GET_COMMODITY_GROUP_INFO';
export const GET_COMMODITY_GROUP_INFO_SUCCESS = 'GET_COMMODITY_GROUP_INFO_SUCCESS';
export const GET_COMMODITY_GROUP_INFO_FAILURE = 'GET_COMMODITY_GROUP_INFO_FAILURE';

export const GET_REPORT_INFO = 'GET_REPORT_INFO';
export const GET_REPORT_INFO_SUCCESS = 'GET_REPORT_INFO_SUCCESS';
export const GET_REPORT_INFO_FAILURE = 'GET_REPORT_INFO_FAILURE';

export const GET_COMMODITY_INFO = 'GET_COMMODITY_INFO';
export const GET_COMMODITY_INFO_SUCCESS = 'GET_COMMODITY_INFO_SUCCESS';
export const GET_COMMODITY_INFO_FAILURE = 'GET_COMMODITY_INFO_FAILURE';

export const GET_TT_INFO = 'GET_TT_INFO';
export const GET_TT_INFO_SUCCESS = 'GET_TT_INFO_SUCCESS';
export const GET_TT_INFO_FAILURE = 'GET_TT_INFO_FAILURE';

export const GET_TANKER_CONFIG_INFO = 'GET_TANKER_CONFIG_INFO';
export const GET_TANKER_CONFIG_INFO_SUCCESS = 'GET_TANKER_CONFIG_INFO_SUCCESS';
export const GET_TANKER_CONFIG_INFO_FAILURE = 'GET_TANKER_CONFIG_INFO_FAILURE';

export const GET_TANKER_STATE_CHANGE_INFO = 'GET_TANKER_STATE_CHANGE_INFO';
export const GET_TANKER_STATE_CHANGE_INFO_SUCCESS = 'GET_TANKER_STATE_CHANGE_INFO_SUCCESS';
export const GET_TANKER_STATE_CHANGE_INFO_FAILURE = 'GET_TANKER_STATE_CHANGE_INFO_FAILURE';

export const UPDATE_REASON_INFO = 'UPDATE_REASON_INFO';
export const UPDATE_REASON_INFO_SUCCESS = 'UPDATE_REASON_INFO_SUCCESS';
export const UPDATE_REASON_INFO_FAILURE = 'UPDATE_REASON_INFO_FAILURE';

export function getTankerInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = TransactionModule.transactionApiFields;

  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["commodity","ilike","${keyword}"]`;
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

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TANKER_INFO, GET_TANKER_INFO_SUCCESS, GET_TANKER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTankerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TANKER_EXPORT_LIST_INFO, GET_TANKER_EXPORT_LIST_INFO_SUCCESS, GET_TANKER_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTankerCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_TANKER_COUNT_INFO, GET_TANKER_COUNT_INFO_SUCCESS, GET_TANKER_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function geTankerDashboardInfo(start, end, dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardName}`,
      types: [GET_TANKER_DASHBOARD_INFO, GET_TANKER_DASHBOARD_INFO_SUCCESS, GET_TANKER_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getTankerDetailsInfo(id, modelName) {
  const fields = '["id","name","is_enable_amount",["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]],"is_requires_verification", "state", ("commodity", ["id", "name"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),"create_date",("tanker_id", ["id", "name",("commodity", ["id", "name", "is_enable_amount"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),("uom_id", ["id", "name"])]),("location_id", ["id","path_name"]),("purchase_order", ["id", "name"]),("uom_id", ["id", "name"]),"initial_reading","final_reading","difference","sequence","in_datetime","out_datetime","remark","delivery_challan","driver","driver_contact","is_enable_amount","amount",["message_ids", ["id"]]]';
  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_TANKER_DETAILS_INFO, GET_TANKER_DETAILS_INFO_SUCCESS, GET_TANKER_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTransactionRoomDatas(company, model, start, end, start1, end1, commodity, vendor) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  const fields = '["id","name", "state", ("commodity", ["id", "name"]),"capacity","amount",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),"create_date",("tanker_id", ["id", "name"]),("location_id", ["id","path_name"]),("purchase_order", ["id", "name"]),("uom_id", ["id", "name"]),"initial_reading","final_reading","difference","sequence","in_datetime","out_datetime","remark","delivery_challan","driver","driver_contact",["message_ids", ["id"]]]';

  if (start && end) {
    payload = `${payload},["in_datetime",">=","${start}"],["in_datetime","<=","${end}"]`;
  }
  if (start1 && end1) {
    payload = `${payload},["out_datetime",">=","${start1}"],["out_datetime","<=","${end1}"]`;
  }
  if (vendor && vendor.length) {
    payload = `${payload},["vendor_id","in",${JSON.stringify(vendor)}]`;
  }
  if (commodity && commodity.length) {
    payload = `${payload},["commodity","in",${JSON.stringify(commodity)}]`;
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

export function getCommodityInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMMODITY_INFO, GET_COMMODITY_INFO_SUCCESS, GET_COMMODITY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTankerTransactionInfo(company, model, keyword) {
  const fields = '["id","name", ("commodity", ["id", "name", "is_enable_amount"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),("uom_id", ["id", "name"])]';

  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TT_INFO, GET_TT_INFO_SUCCESS, GET_TT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["vendor_id"]&groupby=["vendor_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_VENDOR_GROUP_INFO, GET_VENDOR_GROUP_INFO_SUCCESS, GET_VENDOR_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCommodityGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["commodity"]&groupby=["commodity"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_COMMODITY_GROUP_INFO, GET_COMMODITY_GROUP_INFO_SUCCESS, GET_COMMODITY_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTankerConfigInfo(id, modelName) {
  const fields = '["id","requires_verification",("verification_authority_id", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])])]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_TANKER_CONFIG_INFO, GET_TANKER_CONFIG_INFO_SUCCESS, GET_TANKER_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function tankerStateChangeInfo(id, state, modelName, contex) {
  let payload = {};
  if (contex) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, context: contex,
    };
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_TANKER_STATE_CHANGE_INFO, GET_TANKER_STATE_CHANGE_INFO_SUCCESS, GET_TANKER_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function updateReasonBack(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_REASON_INFO, UPDATE_REASON_INFO_SUCCESS, UPDATE_REASON_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
