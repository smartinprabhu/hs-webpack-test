/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import { GatePassModule } from '../util/field';
import fieldsData from './data/customData.json';

export const GET_GATEPASS_INFO = 'GET_GATEPASS_INFO';
export const GET_GATEPASS_INFO_SUCCESS = 'GET_GATEPASS_INFO_SUCCESS';
export const GET_GATEPASS_INFO_FAILURE = 'GET_GATEPASS_INFO_FAILURE';

export const GET_GATEPASS_EXPORT_LIST_INFO = 'GET_GATEPASS_EXPORT_LIST_INFO';
export const GET_GATEPASS_EXPORT_LIST_INFO_SUCCESS = 'GET_GATEPASS_EXPORT_LIST_INFO_SUCCESS';
export const GET_GATEPASS_EXPORT_LIST_INFO_FAILURE = 'GET_GATEPASS_EXPORT_LIST_INFO_FAILURE';

export const GET_GATEPASS_COUNT_INFO = 'GET_GATEPASS_COUNT_INFO';
export const GET_GATEPASS_COUNT_INFO_SUCCESS = 'GET_GATEPASS_COUNT_INFO_SUCCESS';
export const GET_GATEPASS_COUNT_INFO_FAILURE = 'GET_GATEPASS_COUNT_INFO_FAILURE';

export const GET_GATEPASS_DETAILS_INFO = 'GET_GATEPASS_DETAILS_INFO';
export const GET_GATEPASS_DETAILS_INFO_SUCCESS = 'GET_GATEPASS_DETAILS_INFO_SUCCESS';
export const GET_GATEPASS_DETAILS_INFO_FAILURE = 'GET_GATEPASS_DETAILS_INFO_FAILURE';

export const GET_GATEPASS_CONFIG_DETAILS_INFO = 'GET_GATEPASS_CONFIG_DETAILS_INFO';
export const GET_GATEPASS_CONFIG_DETAILS_INFO_SUCCESS = 'GET_GATEPASS_CONFIG_DETAILS_INFO_SUCCESS';
export const GET_GATEPASS_CONFIG_DETAILS_INFO_FAILURE = 'GET_GATEPASS_CONFIG_DETAILS_INFO_FAILURE';

export const GET_GATEPASS_DASHBOARD_INFO = 'GET_GATEPASS_DASHBOARD_INFO';
export const GET_GATEPASS_DASHBOARD_INFO_SUCCESS = 'GET_GATEPASS_DASHBOARD_INFO_SUCCESS';
export const GET_GATEPASS_DASHBOARD_INFO_FAILURE = 'GET_GATEPASS_DASHBOARD_INFO_FAILURE';

export const CREATE_GP_INFO = 'CREATE_GP_INFO';
export const CREATE_GP_INFO_SUCCESS = 'CREATE_GP_INFO_SUCCESS';
export const CREATE_GP_INFO_FAILURE = 'CREATE_GP_INFO_FAILURE';

export const UPDATE_GP_INFO = 'UPDATE_GP_INFO';
export const UPDATE_GP_INFO_SUCCESS = 'UPDATE_GP_INFO_SUCCESS';
export const UPDATE_GP_INFO_FAILURE = 'UPDATE_GP_INFO_FAILURE';

export const GET_GP_ACTION_INFO = 'GET_GP_ACTION_INFO';
export const GET_GP_ACTION_INFO_SUCCESS = 'GET_GP_ACTION_INFO_SUCCESS';
export const GET_GP_ACTION_INFO_FAILURE = 'GET_GP_ACTION_INFO_FAILURE';

export function getGatePassInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = GatePassModule.gatePassApiFields;

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

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_GATEPASS_INFO, GET_GATEPASS_INFO_SUCCESS, GET_GATEPASS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getGatePassExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
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
      types: [GET_GATEPASS_EXPORT_LIST_INFO, GET_GATEPASS_EXPORT_LIST_INFO_SUCCESS, GET_GATEPASS_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getGatePassCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_GATEPASS_COUNT_INFO, GET_GATEPASS_COUNT_INFO_SUCCESS, GET_GATEPASS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getGatePassDetailsInfo(id, modelName, noLoad) {
  const fields = '["id","create_date","name","receiver_name","receiver_mobile","receiver_email","gatepass_type","gatepass_number","reference","description","state","email","mobile","type","requested_on","bearer_return_on","approved_by","approved_on","sla_status","exit_on","exit_description","return_on","return_description",("requestor_id", ["id", "name","mobile","email"]),("company_id", ["id", "name"]),("space_id", ["id", "path_name", "space_name"]),("approved_by", ["id", "name"]),("exit_allowed_by", ["id", "name"]),("return_allowed_by", ["id", "name"]),["message_ids", ["id"]],["order_lines", ["id", ("asset_id", ["id", "name"]), "parts_qty", "description"]],["escalation_matrix_ids", ["id", "type", "level_date", "level", ("recipients_id", ["id", "name"])]],["asset_lines", ["id", ("asset_id", ["id", "name","model","make","equipment_seq","serial","state","brand", ("category_id", ["id", "name"]), ("location_id", ["id", "path_name"]),["space_label_ids", ["id","space_value",("space_label_id", ["id", "name"])]]]), "parts_qty", "description"]],("vendor_id", ["id", "name"]),"to_be_returned_on",["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]]]';
  const type = typeof id;
  let payload;
  if (type === 'string') {
    payload = `["uuid","=","${id}"]`;
  } else {
    payload = `["id","=",${id}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [noLoad ? 'GET_GATEPASS_DETAILS_NO_INFO' : GET_GATEPASS_DETAILS_INFO, GET_GATEPASS_DETAILS_INFO_SUCCESS, GET_GATEPASS_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getGatePassConfigInfo(company, modelName) {
  const fields = '["id","vendor","config_json_data","reject_text","reject_return_text",["approval_recipients_ids", ["id", "type", "name", ("role_id", ["id", "name"]), ["users_ids", ["id", "name"]], "user_defined_email_ids", ("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])]],["approval_receiving_recipients_ids", ["id", "type", "name", ("role_id", ["id", "name"]), ["users_ids", ["id", "name"]], "user_defined_email_ids", ("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])]],"receiver_name","receiver_mobile","approval_required","approval_button","approval_receiving_required","approve","show_assets","show_items","reference_display","reference","space","attachment","bearer_mobile","bearer_email"]';
  const payload = `["company_id","in",[${company}]]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_GATEPASS_CONFIG_DETAILS_INFO, GET_GATEPASS_CONFIG_DETAILS_INFO_SUCCESS, GET_GATEPASS_CONFIG_DETAILS_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function geGatePassDashboardInfo(start, end, dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardName}`,
      types: [GET_GATEPASS_DASHBOARD_INFO, GET_GATEPASS_DASHBOARD_INFO_SUCCESS, GET_GATEPASS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function createGatePassInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_GP_INFO, CREATE_GP_INFO_SUCCESS, CREATE_GP_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateGatePassInfo(id, model, result, noLoad) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [!noLoad ? UPDATE_GP_INFO : 'UPDATE_GP_INFO_NO', !noLoad ? UPDATE_GP_INFO_SUCCESS : 'UPDATE_GP_INFO_SUCCESS_NO', !noLoad ? UPDATE_GP_INFO_FAILURE : 'UPDATE_GP_INFO_FAILURE_NO'],
      method: 'PUT',
      payload,
    },
  };
}

export function getGpActionInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_GP_ACTION_INFO, GET_GP_ACTION_INFO_SUCCESS, GET_GP_ACTION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
