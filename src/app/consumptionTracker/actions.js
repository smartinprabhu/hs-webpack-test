/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import complianceColumns from './data/customData.json';

export const GET_CT_INFO = 'GET_CT_INFO';
export const GET_CT_INFO_SUCCESS = 'GET_CT_INFO_SUCCESS';
export const GET_CT_INFO_FAILURE = 'GET_CT_INFO_FAILURE';

export const GET_CT_COUNT_INFO = 'GET_CT_COUNT_INFO';
export const GET_CT_COUNT_INFO_SUCCESS = 'GET_CT_COUNT_INFO_SUCCESS';
export const GET_CT_COUNT_INFO_FAILURE = 'GET_CT_COUNT_INFO_FAILURE';

export const CREATE_CONS_TRACK_INFO = 'CREATE_CONS_TRACK_INFO';
export const CREATE_CONS_TRACK_INFO_SUCCESS = 'CREATE_CONS_TRACK_INFO_SUCCESS';
export const CREATE_CONS_TRACK_INFO_FAILURE = 'CREATE_CONS_TRACK_INFO_FAILURE';

export const GET_CT_DETAILS = 'GET_CT_DETAILS';
export const GET_CT_DETAILS_SUCCESS = 'GET_CT_DETAILS_SUCCESS';
export const GET_CT_DETAILS_FAILURE = 'GET_CT_DETAILS_FAILURE';

export const GET_DP_DETAILS = 'GET_DP_DETAILS';
export const GET_DP_DETAILS_SUCCESS = 'GET_DP_DETAILS_SUCCESS';
export const GET_DP_DETAILS_FAILURE = 'GET_DP_DETAILS_FAILURE';

export const GET_CT_EXPORT_INFO = 'GET_CT_EXPORT_INFO';
export const GET_CT_EXPORT_INFO_SUCCESS = 'GET_CT_EXPORT_INFO_SUCCESS';
export const GET_CT_EXPORT_INFO_FAILURE = 'GET_CT_EXPORT_INFO_FAILURE';

export const GET_SLA_AUDIT_DASHBOARD_INFO = 'GET_SLA_AUDIT_DASHBOARD_INFO';
export const GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS = 'GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS';
export const GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE = 'GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE';

export const GET_TRACK_TEMPLATES_INFO = 'GET_TRACK_TEMPLATES_INFO';
export const GET_TRACK_TEMPLATES_INFO_SUCCESS = 'GET_TRACK_TEMPLATES_INFO_SUCCESS';
export const GET_TRACK_TEMPLATES_INFO_FAILURE = 'GET_TRACK_TEMPLATES_INFO_FAILURE';

export const GET_CT_CONFIG_INFO = 'GET_CT_CONFIG_INFO';
export const GET_CT_CONFIG_INFO_SUCCESS = 'GET_CT_CONFIG_INFO_SUCCESS';
export const GET_CT_CONFIG_INFO_FAILURE = 'GET_CT_CONFIG_INFO_FAILURE';

export const UPDATE_CT_INFO = 'UPDATE_CT_INFO';
export const UPDATE_CT_INFO_SUCCESS = 'UPDATE_CT_INFO_SUCCESS';
export const UPDATE_CT_INFO_FAILURE = 'UPDATE_CT_INFO_FAILURE';

export const GET_CT_ACTION_INFO = 'GET_CT_ACTION_INFO';
export const GET_CT_ACTION_INFO_SUCCESS = 'GET_CT_ACTION_INFO_SUCCESS';
export const GET_CT_ACTION_INFO_FAILURE = 'GET_CT_ACTION_INFO_FAILURE';

export const GET_SLA_AUDIT_SUMMARY_DETAILS = 'GET_SLA_AUDIT_SUMMARY_DETAILS';
export const GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS = 'GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS';
export const GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE = 'GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE';

export const GET_QUESTIONS_DETAILS = 'GET_QUESTIONS_DETAILS';
export const GET_QUESTIONS_DETAILS_SUCCESS = 'GET_QUESTIONS_DETAILS_SUCCESS';
export const GET_QUESTIONS_DETAILS_FAILURE = 'GET_QUESTIONS_DETAILS_FAILURE';

export const GET_CT_CATEGORIES_INFO = 'GET_CT_CATEGORIES_INFO';
export const GET_CT_CATEGORIES_INFO_SUCCESS = 'GET_CT_CATEGORIES_INFO_SUCCESS';
export const GET_CT_CATEGORIES_INFO_FAILURE = 'GET_CT_CATEGORIES_INFO_FAILURE';

export const GET_CT_QTN_GROUPS_INFO = 'GET_CT_QTN_GROUPS_INFO';
export const GET_CT_QTN_GROUPS_INFO_SUCCESS = 'GET_CT_QTN_GROUPS_INFO_SUCCESS';
export const GET_CT_QTN_GROUPS_INFO_FAILURE = 'GET_CT_QTN_GROUPS_INFO_FAILURE';

export const GET_LAST_CT_INFO = 'GET_LAST_CT_INFO';
export const GET_LAST_CT_INFO_SUCCESS = 'GET_LAST_CT_INFO_SUCCESS';
export const GET_LAST_CT_INFO_FAILURE = 'GET_LAST_CT_INFO_FAILURE';

export const GET_TRACKER_EXISTS_CT_INFO = 'GET_TRACKER_EXISTS_CT_INFO';
export const GET_TRACKER_EXISTS_CT_INFO_SUCCESS = 'GET_TRACKER_EXISTS_CT_INFO_SUCCESS';
export const GET_TRACKER_EXISTS_CT_INFO_FAILURE = 'GET_TRACKER_EXISTS_CT_INFO_FAILURE';

export const UPDATE_CT_ALT_INFO = 'UPDATE_CT_ALT_INFO';
export const UPDATE_CT_ALT_INFO_SUCCESS = 'UPDATE_CT_ALT_INFO_SUCCESS';
export const UPDATE_CT_ALT_INFO_FAILURE = 'UPDATE_CT_ALT_INFO_FAILURE';

export function getConsumptionTrackerListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = complianceColumns && complianceColumns.complianceListFields ? complianceColumns.complianceListFields : [];
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
      types: [GET_CT_INFO, GET_CT_INFO_SUCCESS, GET_CT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConsumptionTrackerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
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
      types: [GET_CT_EXPORT_INFO, GET_CT_EXPORT_INFO_SUCCESS, GET_CT_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConsumptionTrackerCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_CT_COUNT_INFO, GET_CT_COUNT_INFO_SUCCESS, GET_CT_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createConsumptionTrackerInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_CONS_TRACK_INFO, CREATE_CONS_TRACK_INFO_SUCCESS, CREATE_CONS_TRACK_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getCtDetails(id, modelName) {
  const fields = '["id","name","reason",("temp_type_id", ["id", "name"]),"start_date","end_date",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"audit_for","state","created_on","reviewed_on","approved_on",("tracker_template_id", ["id", "name","disclaimer"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),["sla_category_logs", ["id", ("sla_category_id",["id","name"]), "target", "achieved_score"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["tracker_lines", ["id","is_not_applicable",("category_id",["id","name"]),("question_group_id",["id","name","remarks","weightage","sequence"]),"target","answer",("mro_activity_id", ["id", "code", "calculation_type", "expression", "fixed_value", "sequence", "name", "target_score_type", "for_month", "data_source", "difference","target_placeholder","measured_placeholder",("decimal_accuracy_id",["id","name","digits"]),("metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "score"]]]), "has_attachment", "type", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]])]]]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_CT_DETAILS, GET_CT_DETAILS_SUCCESS, GET_CT_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSlaAuditDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: 'dashboard_data?name=Sla Audit',
      types: [GET_SLA_AUDIT_DASHBOARD_INFO, GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS, GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getTrackTemplatesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TRACK_TEMPLATES_INFO, GET_TRACK_TEMPLATES_INFO_SUCCESS, GET_TRACK_TEMPLATES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCtConfigInfo(id, modelName) {
  const fields = '["id","sla_category_access","audit_template_access"]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_CT_CONFIG_INFO, GET_CT_CONFIG_INFO_SUCCESS, GET_CT_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateCtInfo(id, model, result, isChecklist) {
  let payload = {
    ids: `[${id}]`, values: result,
  };
  let endPoint = `write/${model}`;
  if (isChecklist) {
    payload = {
      model, values: result,
    };
    endPoint = 'multi/write';
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_CT_INFO, UPDATE_CT_INFO_SUCCESS, UPDATE_CT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateCtAltInfo(id, model, result) {
  const payload = {
    model, values: result,
  };
  const endPoint = 'multi/write';

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_CT_ALT_INFO, UPDATE_CT_ALT_INFO_SUCCESS, UPDATE_CT_ALT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getCtActionInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_CT_ACTION_INFO, GET_CT_ACTION_INFO_SUCCESS, GET_CT_ACTION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getSlaAuditPerformaceDetailsInfo(id, modelName) {
  const fields = '["id","audit_for","is_notapplicable","target","weightage","achieved_score","weightage",("sla_category_id", ["id", "name"]),("question_group_id",["id","name","remarks","weightage"])]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["sla_audit_id","=",${id}]]&fields=${fields}`,
      types: [GET_SLA_AUDIT_SUMMARY_DETAILS, GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS, GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getCategoriesInfo(id, modelName) {
  const fields = '["id","name","type"]';

  // const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[]&fields=${fields}`,
      types: [GET_CT_CATEGORIES_INFO, GET_CT_CATEGORIES_INFO_SUCCESS, GET_CT_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getQuestionGroupsInfo(id, modelName) {
  const fields = '["id",("question_group_id",["id","name","remarks","weightage","sequence","target_score"])]';

  const payload = `["category_id","=",${id}],["question_group_id.target_score","=",1]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_CT_QTN_GROUPS_INFO, GET_CT_QTN_GROUPS_INFO_SUCCESS, GET_CT_QTN_GROUPS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getQuestionsResultsInfo(catId, qtnGrpId, tIds, modelName) {
  const fields = '["id","is_not_applicable",("tracker_id",["id","name"]),("category_id",["id","name"]),("question_group_id",["id","name","remarks","weightage","sequence"]),"target","answer",("mro_activity_id", ["id", "code", "calculation_type", "expression", "fixed_value", "sequence", "name", "target_score_type", "for_month", "data_source", "difference","target_placeholder","measured_placeholder", ("metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "score"]]]), "has_attachment", "type", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]])]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["category_id","=",${catId}],["question_group_id","=",${qtnGrpId}],["is_not_applicable","=",false],["tracker_id","in",[${tIds}]]]&fields=${fields}`,
      types: [GET_QUESTIONS_DETAILS, GET_QUESTIONS_DETAILS_SUCCESS, GET_QUESTIONS_DETAILS_FAILURE],
      method: 'GET',
      tIds,
    },
  };
}

export function getLastCtInfo(id, modelName) {
  const fields = '["id","name","audit_for","start_date","end_date","total_days"]';

  const payload = `["company_id","in",[${id}]]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}&limit=2&order=end_date DESC`,
      types: [GET_LAST_CT_INFO, GET_LAST_CT_INFO_SUCCESS, GET_LAST_CT_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTrackerExistsInfo(id, tempId, auditDate, modelName) {
  const fields = '["id"]';

  const payload = `["company_id","in",[${id}]],["tracker_template_id","=",${tempId}],["state","!=","Cancelled"],["audit_for","=","${auditDate}"]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}&limit=1&order=create_date DESC`,
      types: [GET_TRACKER_EXISTS_CT_INFO, GET_TRACKER_EXISTS_CT_INFO_SUCCESS, GET_TRACKER_EXISTS_CT_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getDecimalPrecisionGlobal(modelName) {
  const fields = '["id","name","digits"]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&fields=${fields}`,
      types: [GET_DP_DETAILS, GET_DP_DETAILS_SUCCESS, GET_DP_DETAILS_FAILURE],
      method: 'GET',
    },
  };
}
