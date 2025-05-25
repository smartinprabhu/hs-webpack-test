import { CALL_API } from '../../middleware/api';
import orderColumns from './data/workorderActions.json';

export const GET_WORK_ORDERS_INFO = 'GET_WORK_ORDERS_INFO';
export const GET_WORK_ORDERS_INFO_SUCCESS = 'GET_WORK_ORDERS_INFO_SUCCESS';
export const GET_WORK_ORDERS_INFO_FAILURE = 'GET_WORK_ORDERS_INFO_FAILURE';

export const GET_WORK_ORDERS_COUNT = 'GET_WORK_ORDERS_COUNT';
export const GET_WORK_ORDERS_COUNT_SUCCESS = 'GET_WORK_ORDERS_COUNT_SUCCESS';
export const GET_WORK_ORDERS_COUNT_FAILURE = 'GET_WORK_ORDERS_COUNT_FAILURE';

export const GET_WORK_ORDERS_EXPORT_INFO = 'GET_WORK_ORDERS_EXPORT_INFO';
export const GET_WORK_ORDERS_EXPORT_INFO_SUCCESS = 'GET_WORK_ORDERS_EXPORT_INFO_SUCCESS';
export const GET_WORK_ORDERS_EXPORT_INFO_FAILURE = 'GET_WORK_ORDERS_EXPORT_INFO_FAILURE';

export const GET_TEAMS_GROUP_INFO = 'GET_TEAMS_GROUP_INFO';
export const GET_TEAMS_GROUP_INFO_SUCCESS = 'GET_TEAMS_GROUP_INFO_SUCCESS';
export const GET_TEAMS_GROUP_INFO_FAILURE = 'GET_TEAMS_GROUP_INFO_FAILURE';

export const GET_STATES_GROUP_INFO = 'GET_STATES_GROUP_INFO';
export const GET_STATES_GROUP_INFO_SUCCESS = 'GET_STATES_GROUP_INFO_SUCCESS';
export const GET_STATES_GROUP_INFO_FAILURE = 'GET_STATES_GROUP_INFO_FAILURE';

export const GET_PRIORITIES_GROUP_INFO = 'GET_PRIORITIES_GROUP_INFO';
export const GET_PRIORITIES_GROUP_INFO_SUCCESS = 'GET_PRIORITIES_GROUP_INFO_SUCCESS';
export const GET_PRIORITIES_GROUP_INFO_FAILURE = 'GET_PRIORITIES_GROUP_INFO_FAILURE';

export const GET_MAINTENANCE_TYPE_GROUP_INFO = 'GET_MAINTENANCE_TYPE_GROUP_INFO';
export const GET_MAINTENANCE_TYPE_GROUP_INFO_SUCCESS = 'GET_MAINTENANCE_TYPE_GROUP_INFO_SUCCESS';
export const GET_MAINTENANCE_TYPE_GROUP_INFO_FAILURE = 'GET_MAINTENANCE_TYPE_GROUP_INFO_FAILURE';

export const GET_TYPE_GROUP_INFO = 'GET_TYPE_GROUP_INFO';
export const GET_TYPE_GROUP_INFO_SUCCESS = 'GET_TYPE_GROUP_INFO_SUCCESS';
export const GET_TYPE_GROUP_INFO_FAILURE = 'GET_TYPE_GROUP_INFO_FAILURE';

export const GET_ORDER_DETAILS_INFO = 'GET_ORDER_DETAILS_INFO';
export const GET_ORDER_DETAILS_INFO_SUCCESS = 'GET_ORDER_DETAILS_INFO_SUCCESS';
export const GET_ORDER_DETAILS_INFO_FAILURE = 'GET_ORDER_DETAILS_INFO_FAILURE';

export const GET_COMMENTS_INFO = 'GET_COMMENTS_INFO';
export const GET_COMMENTS_INFO_SUCCESS = 'GET_COMMENTS_INFO_SUCCESS';
export const GET_COMMENTS_INFO_FAILURE = 'GET_COMMENTS_INFO_FAILURE';

export const CREATE_COMMENT_INFO = 'CREATE_COMMENT_INFO';
export const CREATE_COMMENT_INFO_SUCCESS = 'CREATE_COMMENT_INFO_SUCCESS';
export const CREATE_COMMENT_INFO_FAILURE = 'CREATE_COMMENT_INFO_FAILURE';

export const CREATE_PART_INFO = 'CREATE_PART_INFO';
export const CREATE_PART_INFO_SUCCESS = 'CREATE_PART_INFO_SUCCESS';
export const CREATE_PART_INFO_FAILURE = 'CREATE_PART_INFO_FAILURE';

export const CREATE_INVENTORY_INFO = 'CREATE_INVENTORY_INFO';
export const CREATE_INVENTORY_INFO_SUCCESS = 'CREATE_INVENTORY_INFO_SUCCESS';
export const CREATE_INVENTORY_INFO_FAILURE = 'CREATE_INVENTORY_INFO_FAILURE';

export const DELETE_PART_INFO = 'DELETE_PART_INFO';
export const DELETE_PART_INFO_SUCCESS = 'DELETE_PART_INFO_SUCCESS';
export const DELETE_PART_INFO_FAILURE = 'DELETE_PART_INFO_FAILURE';

export const GET_WO_STATE_CHANGE_INFO = 'GET_WO_STATE_CHANGE_INFO';
export const GET_WO_STATE_CHANGE_INFO_SUCCESS = 'GET_WO_STATE_CHANGE_INFO_SUCCESS';
export const GET_WO_STATE_CHANGE_INFO_FAILURE = 'GET_WO_STATE_CHANGE_INFO_FAILURE';

export const UPDATE_CHECKLIST_ANSWER_INFO = 'UPDATE_CHECKLIST_ANSWER_INFO';
export const UPDATE_CHECKLIST_ANSWER_INFO_SUCCESS = 'UPDATE_CHECKLIST_ANSWER_INFO_SUCCESS';
export const UPDATE_CHECKLIST_ANSWER_INFO_FAILURE = 'UPDATE_CHECKLIST_ANSWER_INFO_FAILURE';

export const REMOVE_CHECKLIST_ANSWER_INFO = 'REMOVE_CHECKLIST_ANSWER_INFO';
export const REMOVE_CHECKLIST_ANSWER_INFO_SUCCESS = 'REMOVE_CHECKLIST_ANSWER_INFO_SUCCESS';
export const REMOVE_CHECKLIST_ANSWER_INFO_FAILURE = 'REMOVE_CHECKLIST_ANSWER_INFO_FAILURE';

export const GET_EXTRA_LIST_INFO = 'GET_EXTRA_LIST_INFO';
export const GET_EXTRA_LIST_INFO_SUCCESS = 'GET_EXTRA_LIST_INFO_SUCCESS';
export const GET_EXTRA_LIST_INFO_FAILURE = 'GET_EXTRA_LIST_INFO_FAILURE';

export const GET_EXTRA_COUNT_INFO = 'GET_EXTRA_COUNT_INFO';
export const GET_EXTRA_COUNT_INFO_SUCCESS = 'GET_EXTRA_COUNT_INFO_SUCCESS';
export const GET_EXTRA_COUNT_INFO_FAILURE = 'GET_EXTRA_COUNT_INFO_FAILURE';

export const GET_WORKORDERS_DASHBOARD_INFO = 'GET_WORKORDERS_DASHBOARD_INFO';
export const GET_WORKORDERS_DASHBOARD_INFO_SUCCESS = 'GET_WORKORDERS_DASHBOARD_INFO_SUCCESS';
export const GET_WORKORDERS_DASHBOARD_INFO_FAILURE = 'GET_WORKORDERS_DASHBOARD_INFO_FAILURE';

export const GET_PARTS_INFO = 'GET_PARTS_INFO';
export const GET_PARTS_INFO_SUCCESS = 'GET_PARTS_INFO_SUCCESS';
export const GET_PARTS_INFO_FAILURE = 'GET_PARTS_INFO_FAILURE';

export const GET_STOCK_INFO = 'GET_STOCK_INFO';
export const GET_STOCK_INFO_SUCCESS = 'GET_STOCK_INFO_SUCCESS';
export const GET_STOCK_INFO_FAILURE = 'GET_STOCK_INFO_FAILURE';

export const GET_CHECK_LISTS_INFO = 'GET_CHECK_LISTS_INFO';
export const GET_CHECK_LISTS_INFO_SUCCESS = 'GET_CHECK_LISTS_INFO_SUCCESS';
export const GET_CHECK_LISTS_INFO_FAILURE = 'GET_CHECK_LISTS_INFO_FAILURE';

export const GET_TIMESHEETS_INFO = 'GET_TIMESHEETS_INFO';
export const GET_TIMESHEETS_INFO_SUCCESS = 'GET_TIMESHEETS_INFO_SUCCESS';
export const GET_TIMESHEETS_INFO_FAILURE = 'GET_TIMESHEETS_INFO_FAILURE';

export const GET_ORDER_TOOLS_INFO = 'GET_ORDER_TOOLS_INFO';
export const GET_ORDER_TOOLS_INFO_SUCCESS = 'GET_ORDER_TOOLS_INFO_SUCCESS';
export const GET_ORDER_TOOLS_INFO_FAILURE = 'GET_ORDER_TOOLS_INFO_FAILURE';

export const GET_SUGGESTED_VALUE_INFO = 'GET_SUGGESTED_VALUE_INFO';
export const GET_SUGGESTED_VALUE_INFO_SUCCESS = 'GET_SUGGESTED_VALUE_INFO_SUCCESS';
export const GET_SUGGESTED_VALUE_INFO_FAILURE = 'GET_SUGGESTED_VALUE_INFO_FAILURE';

export const GET_INVENTORY_INFO = 'GET_INVENTORY_INFO';
export const GET_INVENTORY_INFO_SUCCESS = 'GET_INVENTORY_INFO_SUCCESS';
export const GET_INVENTORY_INFO_FAILURE = 'GET_INVENTORY_INFO_FAILURE';

export const UPDATE_PART_INFO = 'UPDATE_PART_INFO';
export const UPDATE_PART_INFO_SUCCESS = 'UPDATE_PART_INFO_SUCCESS';
export const UPDATE_PART_INFO_FAILURE = 'UPDATE_PART_INFO_FAILURE';

export const GET_REASSIGN_TEAM_INFO = 'GET_REASSIGN_TEAM_INFO';
export const GET_REASSIGN_TEAM_INFO_SUCCESS = 'GET_REASSIGN_TEAM_INFO_SUCCESS';
export const GET_REASSIGN_TEAM_INFO_FAILURE = 'GET_REASSIGN_TEAM_INFO_FAILURE';

export const GET_ORDER_OPERATION_INFO = 'GET_ORDER_OPERATION_INFO';
export const GET_ORDER_OPERATION_INFO_SUCCESS = 'GET_ORDER_OPERATION_INFO_SUCCESS';
export const GET_ORDER_OPERATION_INFO_FAILURE = 'GET_ORDER_OPERATION_INFO_FAILURE';

export const CREATE_ORDER_DURATION_INFO = 'CREATE_ORDER_DURATION_INFO';
export const CREATE_ORDER_DURATION_INFO_SUCCESS = 'CREATE_ORDER_DURATION_INFO_SUCCESS';
export const CREATE_ORDER_DURATION_INFO_FAILURE = 'CREATE_ORDER_DURATION_INFO_FAILURE';

export const GET_PAUSE_REASONS_INFO = 'GET_PAUSE_REASONS_INFO';
export const GET_PAUSE_REASONS_INFO_SUCCESS = 'GET_PAUSE_REASONS_INFO_SUCCESS';
export const GET_PAUSE_REASONS_INFO_FAILURE = 'GET_PAUSE_REASONS_INFO_FAILURE';

export const SLA_REPORT = 'SLA_REPORT';
export const SLA_REPORT_SUCCESS = 'SLA_REPORT_SUCCESS';
export const SLA_REPORT_FAILURE = 'SLA_REPORT_FAILURE';

export const CREATE_ORDER_TS_INFO = 'CREATE_ORDER_TS_INFO';
export const CREATE_ORDER_TS_INFO_SUCCESS = 'CREATE_ORDER_TS_INFO_SUCCESS';
export const CREATE_ORDER_TS_INFO_FAILURE = 'CREATE_ORDER_TS_INFO_FAILURE';

export const GET_EMPLOYEES_MEMBERS_INFO = 'GET_EMPLOYEES_MEMBERS_INFO';
export const GET_EMPLOYEES_MEMBERS_INFO_SUCCESS = 'GET_EMPLOYEES_MEMBERS_INFO_SUCCESS';
export const GET_EMPLOYEES_MEMBERS_INFO_FAILURE = 'GET_EMPLOYEES_MEMBERS_INFO_FAILURE';

export const GET_EMP_REPORT = 'GET_EMP_REPORT';
export const GET_EMP_REPORT_SUCCESS = 'GET_EMP_REPORT_SUCCESS';
export const GET_EMP_REPORT_FAILURE = 'GET_EMP_REPORT_FAILURE';

export const GET_EMP_GROUP_INFO = 'GET_EMP_GROUP_INFO';
export const GET_EMP_GROUP_INFO_SUCCESS = 'GET_EMP_GROUP_INFO_SUCCESS';
export const GET_EMP_GROUP_INFO_FAILURE = 'GET_EMP_GROUP_INFO_FAILURE';

export const GET_OP_WO_INFO = 'GET_OP_WO_INFO';
export const GET_OP_WO_INFO_SUCCESS = 'GET_OP_WO_INFO_SUCCESS';
export const GET_OP_WO_INFO_FAILURE = 'GET_OP_WO_INFO_FAILURE';

export const GET_OR_LISTS_INFO = 'GET_OR_LISTS_INFO';
export const GET_OR_LISTS_INFO_SUCCESS = 'GET_OR_LISTS_INFO_SUCCESS';
export const GET_OR_LISTS_INFO_FAILURE = 'GET_OR_LISTS_INFO_FAILURE';

export const UPDATE_PART_NO_LOAD_INFO = 'UPDATE_PART_NO_LOAD_INFO';
export const UPDATE_PART_NO_LOAD_INFO_SUCCESS = 'UPDATE_PART_NO_LOAD_INFO_SUCCESS';
export const UPDATE_PART_NO_LOAD_INFO_FAILURE = 'UPDATE_PART_NO_LOAD_INFO_FAILURE';

export const GET_WO_NO_STATE_CHANGE_INFO = 'GET_WO_NO_STATE_CHANGE_INFO';
export const GET_WO_NO_STATE_CHANGE_INFO_SUCCESS = 'GET_WO_NO_STATE_CHANGE_INFO_SUCCESS';
export const GET_WO_NO_STATE_CHANGE_INFO_FAILURE = 'GET_WO_NO_STATE_CHANGE_INFO_FAILURE';

export const GET_WO_PPM_ONHOLD_INFO = 'GET_WO_PPM_ONHOLD_INFO';
export const GET_WO_PPM_ONHOLD_INFO_SUCCESS = 'GET_WO_PPM_ONHOLD_INFO_SUCCESS';
export const GET_WO_PPM_ONHOLD_INFO_FAILURE = 'GET_WO_PPM_ONHOLD_INFO_FAILURE';

export const GET_WO_OH_REQUEST_INFO = 'GET_WO_OH_REQUEST_INFO';
export const GET_WO_OH_REQUEST_INFO_SUCCESS = 'GET_WO_OH_REQUEST_INFO_SUCCESS';
export const GET_WO_OH_REQUEST_INFO_FAILURE = 'GET_WO_OH_REQUEST_INFO_FAILURE';

export const GET_FILTER_WORKORDER = 'GET_FILTER_WORKORDER';

export function getWorkordersInfo(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, sortByValue, sortFieldValue, keyword, globalFilter) {
  fields = ['sequence', 'asset_id', 'equipment_id', 'name', 'maintenance_team_id', 'state', 'equipment_location_id', 'priority', 'date_scheduled', 'employee_id', 'type_category', 'task_id', 'date_planned', 'date_execution', 'create_date', 'pause_reason_id', 'description', 'equip_asset_common', 'maintenance_type'];

  let payload = `domain=[["company_id","in",[${company}]],["active","=",true],["scheduler_type","not in",["Inspection Checklist"]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }
  if (teams && teams.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${teams}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority","in",[${priorities}]]`;
  }
  if (mtypes && mtypes.length > 0) {
    payload = `${payload},["maintenance_type","in",[${mtypes}]]`;
  }
  if (types && types.length > 0) {
    payload = `${payload},["type_category","in",[${types}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=${JSON.stringify(fields)}`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0 && sortByValue && sortByValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WORK_ORDERS_INFO, GET_WORK_ORDERS_INFO_SUCCESS, GET_WORK_ORDERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkorderCountInfo(company, model, states, teams, priorities, mtypes, types, customFilters, keyword, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true],["scheduler_type","not in",["Inspection Checklist"]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (teams && teams.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${teams}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority","in",[${priorities}]]`;
  }
  if (mtypes && mtypes.length > 0) {
    payload = `${payload},["maintenance_type","in",[${mtypes}]]`;
  }
  if (types && types.length > 0) {
    payload = `${payload},["type_category","in",[${types}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_WORK_ORDERS_COUNT, GET_WORK_ORDERS_COUNT_SUCCESS, GET_WORK_ORDERS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkordersExportInfo(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true],["scheduler_type","not in",["Inspection Checklist"]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }
  if (teams && teams.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${teams}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority","in",[${priorities}]]`;
  }
  if (mtypes && mtypes.length > 0) {
    payload = `${payload},["maintenance_type","in",[${mtypes}]]`;
  }
  if (types && types.length > 0) {
    payload = `${payload},["type_category","in",[${types}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=${JSON.stringify(fields)}`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WORK_ORDERS_EXPORT_INFO, GET_WORK_ORDERS_EXPORT_INFO_SUCCESS, GET_WORK_ORDERS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["maintenance_team_id","!=",false]]&model=${model}&fields=["maintenance_team_id"]&groupby=["maintenance_team_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_TEAMS_GROUP_INFO, GET_TEAMS_GROUP_INFO_SUCCESS, GET_TEAMS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStateGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["state","!=",false]]&model=${model}&fields=["state"]&groupby=["state"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_STATES_GROUP_INFO, GET_STATES_GROUP_INFO_SUCCESS, GET_STATES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPriorityGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["priority","!=",false]]&model=${model}&fields=["priority"]&groupby=["priority"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PRIORITIES_GROUP_INFO, GET_PRIORITIES_GROUP_INFO_SUCCESS, GET_PRIORITIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceTypeGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["maintenance_type","!=",false]]&model=${model}&fields=["maintenance_type"]&groupby=["maintenance_type"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MAINTENANCE_TYPE_GROUP_INFO, GET_MAINTENANCE_TYPE_GROUP_INFO_SUCCESS, GET_MAINTENANCE_TYPE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTypeGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["type_category","!=",false]]&model=${model}&fields=["type_category"]&groupby=["type_category"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_TYPE_GROUP_INFO, GET_TYPE_GROUP_INFO_SUCCESS, GET_TYPE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderData(id, modelName) {
  const fields = orderColumns && orderColumns.viewFields ? orderColumns.viewFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_ORDER_DETAILS_INFO, GET_ORDER_DETAILS_INFO_SUCCESS, GET_ORDER_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getOrdersCommentsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]],["message_type","=","notification"],["body","!=",false],["body","!=",""]]`;
  payload = `${payload}&model=${modelName}&fields=["body","date","author_id","compute_body"]`;
  payload = `${payload}&limit=100&offset=0&order=date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMMENTS_INFO, GET_COMMENTS_INFO_SUCCESS, GET_COMMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderPartsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  // payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PARTS_INFO, GET_PARTS_INFO_SUCCESS, GET_PARTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStockPartsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  // payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_INFO, GET_STOCK_INFO_SUCCESS, GET_STOCK_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInventoryPartLists(keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  return {
    [CALL_API]: {
      endpoint: `maintenance/order/parts?${payload}]&limit=10&offset=0`,
      types: [GET_INVENTORY_INFO, GET_INVENTORY_INFO_SUCCESS, GET_INVENTORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderCheckListsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHECK_LISTS_INFO, GET_CHECK_LISTS_INFO_SUCCESS, GET_CHECK_LISTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderToolsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ORDER_TOOLS_INFO, GET_ORDER_TOOLS_INFO_SUCCESS, GET_ORDER_TOOLS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderTimeSheetsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["start_date","end_date","reason","description","address","latitude","longitude","total_hours"]`;
  payload = `${payload}&limit=${values.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TIMESHEETS_INFO, GET_TIMESHEETS_INFO_SUCCESS, GET_TIMESHEETS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createOrderCommentInfo(result, modelName) {
  const formValues = { model: modelName, values: result };
  return {
    [CALL_API]: {
      endpoint: `create/${modelName}`,
      types: [CREATE_COMMENT_INFO, CREATE_COMMENT_INFO_SUCCESS, CREATE_COMMENT_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function getEvaluationReports(result) {
  return {
    [CALL_API]: {
      endpoint: 'sla_evaluation/report',
      types: [SLA_REPORT, SLA_REPORT_SUCCESS, SLA_REPORT_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createPartsOrders(result, modelName) {
  const formValues = { model: modelName, values: result };
  return {
    [CALL_API]: {
      endpoint: `create/${modelName}`,
      types: [CREATE_PART_INFO, CREATE_PART_INFO_SUCCESS, CREATE_PART_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function updatePartsOrders(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_PART_INFO, UPDATE_PART_INFO_SUCCESS, UPDATE_PART_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updatePartsOrdersNoLoadInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_PART_NO_LOAD_INFO, UPDATE_PART_NO_LOAD_INFO_SUCCESS, UPDATE_PART_NO_LOAD_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function createInventoryOrders(result) {
  const formValues = result;
  return {
    [CALL_API]: {
      endpoint: 'maintenance/order/parts',
      types: [CREATE_INVENTORY_INFO, CREATE_INVENTORY_INFO_SUCCESS, CREATE_INVENTORY_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function deleteParts(id, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName,
  };
  return {
    [CALL_API]: {
      endpoint: `unlink/${modelName}`,
      types: [DELETE_PART_INFO, DELETE_PART_INFO_SUCCESS, DELETE_PART_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function orderStateChangeInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_WO_STATE_CHANGE_INFO, GET_WO_STATE_CHANGE_INFO_SUCCESS, GET_WO_STATE_CHANGE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function orderStateChangeNoInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_WO_NO_STATE_CHANGE_INFO, GET_WO_NO_STATE_CHANGE_INFO_SUCCESS, GET_WO_NO_STATE_CHANGE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateChecklistAnswers(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_CHECKLIST_ANSWER_INFO, UPDATE_CHECKLIST_ANSWER_INFO_SUCCESS, UPDATE_CHECKLIST_ANSWER_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function removeChecklistQuestions(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [REMOVE_CHECKLIST_ANSWER_INFO, REMOVE_CHECKLIST_ANSWER_INFO_SUCCESS, REMOVE_CHECKLIST_ANSWER_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getExtraSelectionInfo(model, limit, offset, fields, name, ids) {
  let payload = 'domain=[["id","!=",false]';
  if (name && name.length > 0) {
    payload = `${payload},["value","ilike","${name}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload},["id","in",[${ids}]]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=[${JSON.stringify(fields)}]`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXTRA_LIST_INFO, GET_EXTRA_LIST_INFO_SUCCESS, GET_EXTRA_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExtraSelectionCountInfo(model, name) {
  let payload = 'domain=[["id","!=",false]';
  if (name && name.length > 0) {
    payload = `${payload},["value","ilike","${name}"]`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EXTRA_COUNT_INFO, GET_EXTRA_COUNT_INFO_SUCCESS, GET_EXTRA_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSuggestedValueInfo(values, modelName, fields) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}`;
  payload = `${payload}&fields=[${JSON.stringify(fields)}]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SUGGESTED_VALUE_INFO, GET_SUGGESTED_VALUE_INFO_SUCCESS, GET_SUGGESTED_VALUE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkOrderDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Workorder`,
      types: [GET_WORKORDERS_DASHBOARD_INFO, GET_WORKORDERS_DASHBOARD_INFO_SUCCESS, GET_WORKORDERS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getWorkorderFilters(payload) {
  return {
    type: GET_FILTER_WORKORDER,
    payload,
  };
}

export function updateReassignTeamInfo(teamId, orderId, state, modelName) {
  const payload = {
    maintenance_team_id: teamId, order_id: orderId, model: modelName, method: state,
  };
  return {
    [CALL_API]: {
      endpoint: `call/${modelName}`,
      types: [GET_REASSIGN_TEAM_INFO, GET_REASSIGN_TEAM_INFO_SUCCESS, GET_REASSIGN_TEAM_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getActionDataInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_ORDER_OPERATION_INFO, GET_ORDER_OPERATION_INFO_SUCCESS, GET_ORDER_OPERATION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getOrderAssignInfo(team, employee, order, state, modelName) {
  const payload = {
    args: { maintenance_team_id: team, employee_id: employee, order_id: order }, model: modelName, method: state,
  };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [CREATE_ORDER_DURATION_INFO, CREATE_ORDER_DURATION_INFO_SUCCESS, CREATE_ORDER_DURATION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function createOrderDurationInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_ORDER_DURATION_INFO, CREATE_ORDER_DURATION_INFO_SUCCESS, CREATE_ORDER_DURATION_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getPauseReasonsInfo(company, model, keyword, onHold, domain) {
  let payload = 'domain=[["name","!=",false]';
  if (onHold && !domain) {
    payload = `domain=[["name","!=",false],["company_id","in",[${company}]],["type","=","${onHold}"]`;
  }
  if (keyword && keyword.length > 0 && !domain) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  if (onHold && domain) {
    payload = `domain=[${domain},["type","=","${onHold}"]]`;
  }

  if (onHold) {
    if (domain) {
      payload = `${payload}&model=${model}&fields=["name","grace_period","is_can_vverride"]&offset=0&order=name ASC`;
    } else {
      payload = `${payload}]&model=${model}&fields=["name","grace_period","is_can_vverride"]&offset=0&order=name ASC`;
    }
  } else {
    payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PAUSE_REASONS_INFO, GET_PAUSE_REASONS_INFO_SUCCESS, GET_PAUSE_REASONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createOrderTimesheetInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_ORDER_TS_INFO, CREATE_ORDER_TS_INFO_SUCCESS, CREATE_ORDER_TS_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getEmployeeMembersInfo(company, model, keyword, ids, limit, field, custom, id) {
  let payload = '';
  if (ids && ids.length > 0 && field !== 'user') {
    payload = 'domain=[["employee_id","!=",false]';
  } else if (ids && ids.length > 0 && field === 'user') {
    payload = 'domain=[["user_id","!=",false]';
  } else if (!limit) {
    payload = `domain=[["company_id","in",[${company}]],["employee_id","!=",false],["user_id","!=",false]`;
  }
  if (keyword && keyword.length > 0 && field !== 'user') {
    payload = `${payload},["employee_id.name","ilike","${keyword}"]`;
  }
  if (keyword && keyword.length > 0 && field === 'user') {
    payload = `${payload},["user_id.name","ilike","${keyword}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload},["id","in",[${ids}]]`;
  }
  if (ids && ids.length === 0 && limit) {
    payload = `domain=[["employee_id","!=",false],["id","in",[${ids}]]`;
  }
  const lValue = limit || 100;
  payload = `${payload}]&model=${model}&fields=["employee_id","user_id","work_email"]&limit=${lValue}&offset=0&order=employee_id ASC`;
  return {
    [CALL_API]: {
      endpoint: custom ? `order/technician?maintenance_team_ids=[${id}]` : `search_read?${payload}`,
      types: [GET_EMPLOYEES_MEMBERS_INFO, GET_EMPLOYEES_MEMBERS_INFO_SUCCESS, GET_EMPLOYEES_MEMBERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeDatas(company, model, start, end, employee, space, team) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  const fields = '["id", ("employee_id",["id","name"]), "maintenance_type", "date_start_execution", ("space_block_id",["id","path_name"]), ("maintenance_team_id",["id","name"])]';

  if (start && end) {
    payload = `${payload},["date_start_execution",">=","${start}"],["date_start_execution","<=","${end}"]`;
  }
  if (employee && employee.id) {
    payload = `${payload},["employee_id","in",${JSON.stringify([employee.id])}]`;
  }
  if (space && space.length) {
    payload = `${payload},'|',["equipment_location_id","in",${JSON.stringify(space)}],["asset_id","in",${JSON.stringify(space)}]`;
  }
  if (team && team.id) {
    payload = `${payload},["maintenance_team_id","in",${JSON.stringify([team.id])}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EMP_REPORT, GET_EMP_REPORT_SUCCESS, GET_EMP_REPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeGroupsInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]],["employee_id","!=",false]`;

  if (keyword && keyword.length > 0) {
    payload = `${payload},["employee_id","ilike","${keyword}"]`;
  }

  payload = `${payload}]&model=${model}&fields=["employee_id"]&groupby=["employee_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_EMP_GROUP_INFO, GET_EMP_GROUP_INFO_SUCCESS, GET_EMP_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOperationCheckListDatas(id) {
  let payload = '';
  const model = 'order/operations';

  if (id) {
    payload = `operations_ids=[${id}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}`,
      types: [GET_OP_WO_INFO, GET_OP_WO_INFO_SUCCESS, GET_OP_WO_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getOrderChecklists(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["name","task_id"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_OR_LISTS_INFO, GET_OR_LISTS_INFO_SUCCESS, GET_OR_LISTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWoPPMDetailInfo(id, modelName) {
  let payload = `domain=[["id","=",${id}]]`;
  payload = `${payload}&model=ppm.scheduler_week&fields=["id","name","ends_on","is_service_report_required","missed_remark","state","is_on_hold_approval_required","is_on_hold_requested","on_hold_requested_by","on_hold_requested_email","on_hold_requested_on","on_hold_requested_command","on_hold_reject_reason","paused_on",("pause_reason_id",["id","name","grace_period","is_can_vverride"]),("missed_reason_id",["id","name","grace_period","is_can_vverride"]),("vendor_id",["id","name"]),"on_hold_end_date"]`;
  payload = `${payload}&limit=1&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_WO_PPM_ONHOLD_INFO, GET_WO_PPM_ONHOLD_INFO_SUCCESS, GET_WO_PPM_ONHOLD_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMOnHoldRequestInfo(id, result) {
  const formValues = { id, values: result };
  return {
    [CALL_API]: {
      endpoint: 'ppmweek/onhold',
      types: [GET_WO_OH_REQUEST_INFO, GET_WO_OH_REQUEST_INFO_SUCCESS, GET_WO_OH_REQUEST_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}
