/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import complianceColumns from './data/customData.json';

export const GET_SLA_AUDIT_INFO = 'GET_SLA_AUDIT_INFO';
export const GET_SLA_AUDIT_INFO_SUCCESS = 'GET_SLA_AUDIT_INFO_SUCCESS';
export const GET_SLA_AUDIT_INFO_FAILURE = 'GET_SLA_AUDIT_INFO_FAILURE';

export const GET_SLA_AUDIT_COUNT_INFO = 'GET_SLA_AUDIT_COUNT_INFO';
export const GET_SLA_AUDIT_COUNT_INFO_SUCCESS = 'GET_SLA_AUDIT_COUNT_INFO_SUCCESS';
export const GET_SLA_AUDIT_COUNT_INFO_FAILURE = 'GET_SLA_AUDIT_COUNT_INFO_FAILURE';

export const CREATE_SLA_AUDIT_INFO = 'CREATE_SLA_AUDIT_INFO';
export const CREATE_SLA_AUDIT_INFO_SUCCESS = 'CREATE_SLA_AUDIT_INFO_SUCCESS';
export const CREATE_SLA_AUDIT_INFO_FAILURE = 'CREATE_SLA_AUDIT_INFO_FAILURE';

export const GET_SLA_AUDIT_DETAILS = 'GET_SLA_AUDIT_DETAILS';
export const GET_SLA_AUDIT_DETAILS_SUCCESS = 'GET_SLA_AUDIT_DETAILS_SUCCESS';
export const GET_SLA_AUDIT_DETAILS_FAILURE = 'GET_SLA_AUDIT_DETAILS_FAILURE';

export const GET_SLA_AUDIT_EXPORT_INFO = 'GET_SLA_AUDIT_EXPORT_INFO';
export const GET_SLA_AUDIT_EXPORT_INFO_SUCCESS = 'GET_SLA_AUDIT_EXPORT_INFO_SUCCESS';
export const GET_SLA_AUDIT_EXPORT_INFO_FAILURE = 'GET_SLA_AUDIT_EXPORT_INFO_FAILURE';

export const GET_SLA_AUDIT_DASHBOARD_INFO = 'GET_SLA_AUDIT_DASHBOARD_INFO';
export const GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS = 'GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS';
export const GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE = 'GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE';

export const GET_SLA_TEMPLATES_INFO = 'GET_SLA_TEMPLATES_INFO';
export const GET_SLA_TEMPLATES_INFO_SUCCESS = 'GET_SLA_TEMPLATES_INFO_SUCCESS';
export const GET_SLA_TEMPLATES_INFO_FAILURE = 'GET_SLA_TEMPLATES_INFO_FAILURE';

export const GET_SLA_CONFIG_INFO = 'GET_SLA_CONFIG_INFO';
export const GET_SLA_CONFIG_INFO_SUCCESS = 'GET_SLA_CONFIG_INFO_SUCCESS';
export const GET_SLA_CONFIG_INFO_FAILURE = 'GET_SLA_CONFIG_INFO_FAILURE';

export const UPDATE_SLA_AUDIT_INFO = 'UPDATE_SLA_AUDIT_INFO';
export const UPDATE_SLA_AUDIT_INFO_SUCCESS = 'UPDATE_SLA_AUDIT_INFO_SUCCESS';
export const UPDATE_SLA_AUDIT_INFO_FAILURE = 'UPDATE_SLA_AUDIT_INFO_FAILURE';

export const GET_SLA_AUDIT_ACTION_INFO = 'GET_SLA_AUDIT_ACTION_INFO';
export const GET_SLA_AUDIT_ACTION_INFO_SUCCESS = 'GET_SLA_AUDIT_ACTION_INFO_SUCCESS';
export const GET_SLA_AUDIT_ACTION_INFO_FAILURE = 'GET_SLA_AUDIT_ACTION_INFO_FAILURE';

export const GET_SLA_AUDIT_SUMMARY_DETAILS = 'GET_SLA_AUDIT_SUMMARY_DETAILS';
export const GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS = 'GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS';
export const GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE = 'GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE';

export const GET_AUDIT_EXISTS_INFO = 'GET_AUDIT_EXISTS_INFO';
export const GET_AUDIT_EXISTS_INFO_SUCCESS = 'GET_AUDIT_EXISTS_INFO_SUCCESS';
export const GET_AUDIT_EXISTS_INFO_FAILURE = 'GET_AUDIT_EXISTS_INFO_FAILURE';

export const UPDATE_SLA_AUDIT_NO_INFO = 'UPDATE_SLA_AUDIT_NO_INFO';
export const UPDATE_SLA_AUDIT_NO_INFO_SUCCESS = 'UPDATE_SLA_AUDIT_NO_INFO_SUCCESS';
export const UPDATE_SLA_AUDIT_NO_INFO_FAILURE = 'UPDATE_SLA_AUDIT_NO_INFO_FAILURE';

export const GET_SLA_AUDIT_NO_LOAD_DETAILS = 'GET_SLA_AUDIT_NO_LOAD_DETAILS';
export const GET_SLA_AUDIT_NO_LOAD_DETAILS_SUCCESS = 'GET_SLA_AUDIT_NO_LOAD_DETAILS_SUCCESS';
export const GET_SLA_AUDIT_NO_LOAD_DETAILS_FAILURE = 'GET_SLA_AUDIT_NO_LOAD_DETAILS_FAILURE';

export const GET_SLA_SUMMARY_DETAILS = 'GET_SLA_SUMMARY_DETAILS';
export const GET_SLA_SUMMARY_DETAILS_SUCCESS = 'GET_SLA_SUMMARY_DETAILS_SUCCESS';
export const GET_SLA_SUMMARY_DETAILS_FAILURE = 'GET_SLA_SUMMARY_DETAILS_FAILURE';

export const UPDATE_SLA_AUDIT_STAGE_INFO = 'UPDATE_SLA_AUDIT_STAGE_INFO';
export const UPDATE_SLA_AUDIT_STAGE_INFO_SUCCESS = 'UPDATE_SLA_AUDIT_STAGE_INFO_SUCCESS';
export const UPDATE_SLA_AUDIT_STAGE_INFO_FAILURE = 'UPDATE_SLA_AUDIT_STAGE_INFO_FAILURE';

export function getSlaAuditListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
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
      types: [GET_SLA_AUDIT_INFO, GET_SLA_AUDIT_INFO_SUCCESS, GET_SLA_AUDIT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaAuditExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_SLA_AUDIT_EXPORT_INFO, GET_SLA_AUDIT_EXPORT_INFO_SUCCESS, GET_SLA_AUDIT_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaAuditCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_SLA_AUDIT_COUNT_INFO, GET_SLA_AUDIT_COUNT_INFO_SUCCESS, GET_SLA_AUDIT_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createSlaAuditInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SLA_AUDIT_INFO, CREATE_SLA_AUDIT_INFO_SUCCESS, CREATE_SLA_AUDIT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getSlaAuditDetails(id, modelName, nosla) {
  let fields = '["id","name","reason","is_second_level_approval","overall_score","overall_score_sum","has_targe_management_fee","has_target_amount_penalized","monthly_billing_value","sla_json_data","po_no","po_value","occupancy_slab","management_fee_cost","penalty_cost","management_fee",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"management_fee_risk","audit_date","audit_for","state","created_on","reviewed_on","approved_on",("audit_template_id", ["id", "name"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),"second_approved_on","second_approved_by",["sla_category_logs", ["id", ["checker_ids", ["id"]],["approver_ids", ["id"]],("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "score", "min", "max", "legend"]]]),"state",("sla_category_id",["id","name","sequence"]), "weightage","penatly","penalty_amount","target", "achieved_score","achieved_score_sum"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["second_approver_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["sla_audit_lines", ["id",("sla_category_id",["id","name","sequence"]),("question_group_id",["id","name","sequence","remarks","weightage","target_score"]),"target","answer",["evaluations_ids", ["id","target","measured_value",("evaluator_id",["id","name"])]],"remarks","achieved_score",("mro_activity_id", ["id", "code", "has_related_questions", "calculation_type", "expression", "fixed_value", "sequence", "name", "target_score_type", "for_month", "data_source", "difference","target_placeholder","measured_placeholder", ["labels_ids", ["id","value","favicon","color","emoji"]],("metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "score"]]]), "has_attachment", "comments_allowed", "type", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]])]],["stage_ids", ["id","sequence","remarks","__last_update","state",("stage_id",["id","name",["evaluators_ids", ["id","name",("role_id",["id","name"])]]]),["evaluators_ids", ["id","name"]]]]]';
  if (nosla) {
    fields = '["id","name","reason","is_second_level_approval","overall_score","overall_score_sum","has_targe_management_fee","has_target_amount_penalized","monthly_billing_value","sla_json_data","po_no","po_value","occupancy_slab","management_fee_cost","penalty_cost","management_fee",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"management_fee_risk","audit_date","audit_for","state","created_on","reviewed_on","approved_on",("audit_template_id", ["id", "name"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),"second_approved_on","second_approved_by",["sla_category_logs", ["id", ["checker_ids", ["id"]],["approver_ids", ["id"]],("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "score", "min", "max", "legend"]]]),"state",("sla_category_id",["id","name","sequence"]), "weightage","penatly","penalty_amount","target", "achieved_score","achieved_score_sum"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["second_approver_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["stage_ids", ["id","sequence","remarks","__last_update","state",("stage_id",["id","name",["evaluators_ids", ["id","name",("role_id",["id","name"])]]]),["evaluators_ids", ["id","name"]]]]]';
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_SLA_AUDIT_DETAILS, GET_SLA_AUDIT_DETAILS_SUCCESS, GET_SLA_AUDIT_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSlaAuditDetailsNoLoad(id, modelName) {
  const fields = '["id","name","reason","is_second_level_approval","overall_score","overall_score_sum","has_targe_management_fee","has_target_amount_penalized","monthly_billing_value","sla_json_data","po_no","po_value","occupancy_slab","management_fee_cost","penalty_cost","management_fee",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"management_fee_risk","audit_date","audit_for","state","created_on","reviewed_on","approved_on",("audit_template_id", ["id", "name"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),"second_approved_on","second_approved_by",["sla_category_logs", ["id", ["checker_ids", ["id"]],["approver_ids", ["id"]],("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "score", "min", "max", "legend"]]]),"state",("sla_category_id",["id","name","sequence"]), "weightage","penatly","penalty_amount","target", "remarks", "achieved_score_sum","achieved_score"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["second_approver_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["sla_audit_lines", ["id",("sla_category_id",["id","name","sequence"]),("question_group_id",["id","name","sequence","remarks","weightage","target_score"]),"target","answer",["evaluations_ids", ["id","target","measured_value",("evaluator_id",["id","name"])]],"remarks","achieved_score",("mro_activity_id", ["id", "code", "has_related_questions", "calculation_type", "expression", "fixed_value", "sequence", "name", "target_score_type", "for_month", "data_source", "difference","target_placeholder","measured_placeholder", ["labels_ids", ["id","value","favicon","color","emoji"]],("metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "score"]]]), "has_attachment", "comments_allowed", "type", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]])]],["stage_ids", ["id","sequence","remarks","__last_update","state",("stage_id",["id","name",["evaluators_ids", ["id","name",("role_id",["id","name"])]]]),["evaluators_ids", ["id","name"]]]]]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_SLA_AUDIT_NO_LOAD_DETAILS, GET_SLA_AUDIT_NO_LOAD_DETAILS_SUCCESS, GET_SLA_AUDIT_NO_LOAD_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSlaSummaryDetails(id, modelName, nosla) {
  let fields = '["id","name","reason","is_second_level_approval","overall_score","overall_score_sum","has_targe_management_fee","has_target_amount_penalized","monthly_billing_value","sla_json_data","po_no","po_value","occupancy_slab","management_fee_cost","penalty_cost","management_fee",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"management_fee_risk","audit_date","audit_for","state","created_on","reviewed_on","approved_on",("audit_template_id", ["id", "name"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),"second_approved_on","second_approved_by",["sla_category_logs", ["id", ["checker_ids", ["id"]],["approver_ids", ["id"]],("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "score", "min", "max", "legend"]]]),"state",("sla_category_id",["id","name","sequence"]), "weightage","penatly","penalty_amount","target", "achieved_score_sum","achieved_score"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["second_approver_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["sla_audit_lines", ["id",("sla_category_id",["id","name","sequence"]),("question_group_id",["id","name","sequence","remarks","weightage","target_score"]),"target","answer",["evaluations_ids", ["id","target","measured_value",("evaluator_id",["id","name"])]],"remarks","achieved_score",("mro_activity_id", ["id", "code", "has_related_questions", "calculation_type", "expression", "fixed_value", "sequence", "name", "target_score_type", "for_month", "data_source", "difference","target_placeholder","measured_placeholder", ["labels_ids", ["id","value","favicon","color","emoji"]],("metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "score"]]]), "has_attachment", "comments_allowed", "type", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]])]],["stage_ids", ["id","sequence","remarks","__last_update","state",("stage_id",["id","name",["evaluators_ids", ["id","name",("role_id",["id","name"])]]]),["evaluators_ids", ["id","name"]]]]]';
  if (nosla) {
    fields = '["id","name","reason","is_second_level_approval","overall_score","overall_score_sum","has_targe_management_fee","has_target_amount_penalized","monthly_billing_value","sla_json_data","po_no","po_value","occupancy_slab","management_fee_cost","penalty_cost","management_fee",("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),("sla_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend"]]]),"management_fee_risk","audit_date","audit_for","state","created_on","reviewed_on","approved_on",("audit_template_id", ["id", "name"]),("company_id", ["id", "name"]),("created_by_id", ["id", "name"]),("reviewed_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),"second_approved_on","second_approved_by",["sla_category_logs", ["id", ["checker_ids", ["id"]],["approver_ids", ["id"]],("sla_penalty_metric_id",["id","name", ["scale_line_ids", ["id", "score", "min", "max", "legend"]]]),"state",("sla_category_id",["id","name","sequence"]), "weightage","penatly","penalty_amount","target", "achieved_score_sum","achieved_score"]],["maker_ids", ["id","name"]],["checker_ids", ["id","name"]],["second_approver_ids", ["id","name"]],["message_ids", ["id"]],["approver_ids", ["id","name"]],["stage_ids", ["id","sequence","remarks","__last_update","state",("stage_id",["id","name",["evaluators_ids", ["id","name",("role_id",["id","name"])]]]),["evaluators_ids", ["id","name"]]]]]';
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_SLA_SUMMARY_DETAILS, GET_SLA_SUMMARY_DETAILS_SUCCESS, GET_SLA_SUMMARY_DETAILS_FAILURE],
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

export function getSlaTemplatesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SLA_TEMPLATES_INFO, GET_SLA_TEMPLATES_INFO_SUCCESS, GET_SLA_TEMPLATES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSLAConfigInfo(id, modelName) {
  const fields = '["id","sla_category_access","audit_template_access","has_target","is_multiple_evaluation","is_second_level_approval",["line_ids", ["id", "sla_state", "is_requestee","is_recipients","is_send_email",("mail_template_id", ["id", "name"]),["recipients_ids", ["id","name"]]]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_SLA_CONFIG_INFO, GET_SLA_CONFIG_INFO_SUCCESS, GET_SLA_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateSlaAuditInfo(id, model, result, isChecklist) {
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
      types: [UPDATE_SLA_AUDIT_INFO, UPDATE_SLA_AUDIT_INFO_SUCCESS, UPDATE_SLA_AUDIT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateSlaAuditNoLoadInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  const endPoint = `write/${model}`;
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_SLA_AUDIT_NO_INFO, UPDATE_SLA_AUDIT_NO_INFO_SUCCESS, UPDATE_SLA_AUDIT_NO_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateSlaAuditStageInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  const endPoint = `write/${model}`;
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_SLA_AUDIT_STAGE_INFO, UPDATE_SLA_AUDIT_STAGE_INFO_SUCCESS, UPDATE_SLA_AUDIT_STAGE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSlaAuditActionInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_SLA_AUDIT_ACTION_INFO, GET_SLA_AUDIT_ACTION_INFO_SUCCESS, GET_SLA_AUDIT_ACTION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getSlaAuditPerformaceDetailsInfo(id, modelName) {
  const fields = '["id","audit_for","is_notapplicable","target","weightage","achieved_score","calculated_weightage","target_weightage_score",("sla_category_id", ["id", "name","sequence"]),("question_group_id",["id","name","remarks","weightage","sequence"])]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["sla_audit_id","=",${id}]]&fields=${fields}`,
      types: [GET_SLA_AUDIT_SUMMARY_DETAILS, GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS, GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditExistsInfo(id, tempId, auditDate, modelName) {
  const fields = '["id"]';

  const payload = `["company_id","in",[${id}]],["audit_template_id","=",${tempId}],["state","!=","Cancelled"],["audit_for","=","${auditDate}"]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}&limit=1&order=create_date DESC`,
      types: [GET_AUDIT_EXISTS_INFO, GET_AUDIT_EXISTS_INFO_SUCCESS, GET_AUDIT_EXISTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}
