/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import complianceColumns from './data/customData.json';

export const GET_INCIDENTS_INFO = 'GET_INCIDENTS_INFO';
export const GET_INCIDENTS_INFO_SUCCESS = 'GET_INCIDENTS_INFO_SUCCESS';
export const GET_INCIDENTS_INFO_FAILURE = 'GET_INCIDENTS_INFO_FAILURE';

export const GET_INCIDENTS_COUNT_INFO = 'GET_INCIDENTS_COUNT_INFO';
export const GET_INCIDENTS_COUNT_INFO_SUCCESS = 'GET_INCIDENTS_COUNT_INFO_SUCCESS';
export const GET_INCIDENTS_COUNT_INFO_FAILURE = 'GET_INCIDENTS_COUNT_INFO_FAILURE';

export const CREATE_HX_INCIDENT_INFO = 'CREATE_HX_INCIDENT_INFO';
export const CREATE_HX_INCIDENT_INFO_SUCCESS = 'CREATE_HX_INCIDENT_INFO_SUCCESS';
export const CREATE_HX_INCIDENT_INFO_FAILURE = 'CREATE_HX_INCIDENT_INFO_FAILURE';

export const GET_CT_DETAILS = 'GET_CT_DETAILS';
export const GET_CT_DETAILS_SUCCESS = 'GET_CT_DETAILS_SUCCESS';
export const GET_CT_DETAILS_FAILURE = 'GET_CT_DETAILS_FAILURE';

export const GET_INCIDENTS_EXPORT_INFO = 'GET_INCIDENTS_EXPORT_INFO';
export const GET_INCIDENTS_EXPORT_INFO_SUCCESS = 'GET_INCIDENTS_EXPORT_INFO_SUCCESS';
export const GET_INCIDENTS_EXPORT_INFO_FAILURE = 'GET_INCIDENTS_EXPORT_INFO_FAILURE';

export const GET_SLA_AUDIT_DASHBOARD_INFO = 'GET_SLA_AUDIT_DASHBOARD_INFO';
export const GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS = 'GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS';
export const GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE = 'GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE';

export const GET_HX_SEVERITIES_INFO = 'GET_HX_SEVERITIES_INFO';
export const GET_HX_SEVERITIES_INFO_SUCCESS = 'GET_HX_SEVERITIES_INFO_SUCCESS';
export const GET_HX_SEVERITIES_INFO_FAILURE = 'GET_HX_SEVERITIES_INFO_FAILURE';

export const GET_HX_INCIDENT_CONFIG_INFO = 'GET_HX_INCIDENT_CONFIG_INFO';
export const GET_HX_INCIDENT_CONFIG_INFO_SUCCESS = 'GET_HX_INCIDENT_CONFIG_INFO_SUCCESS';
export const GET_HX_INCIDENT_CONFIG_INFO_FAILURE = 'GET_HX_INCIDENT_CONFIG_INFO_FAILURE';

export const UPDATE_INCIDENT_INFO = 'UPDATE_INCIDENT_INFO';
export const UPDATE_INCIDENT_INFO_SUCCESS = 'UPDATE_INCIDENT_INFO_SUCCESS';
export const UPDATE_INCIDENT_INFO_FAILURE = 'UPDATE_INCIDENT_INFO_FAILURE';

export const GET_INCIDENT_ACTION_INFO = 'GET_INCIDENT_ACTION_INFO';
export const GET_INCIDENT_ACTION_INFO_SUCCESS = 'GET_INCIDENT_ACTION_INFO_SUCCESS';
export const GET_INCIDENT_ACTION_INFO_FAILURE = 'GET_INCIDENT_ACTION_INFO_FAILURE';

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

export const GET_HX_CATEGORIES_INFO = 'GET_HX_CATEGORIES_INFO';
export const GET_HX_CATEGORIES_INFO_SUCCESS = 'GET_HX_CATEGORIES_INFO_SUCCESS';
export const GET_HX_CATEGORIES_INFO_FAILURE = 'GET_HX_CATEGORIES_INFO_FAILURE';

export const GET_HX_SUB_CATEGORIES_INFO = 'GET_HX_SUB_CATEGORIES_INFO';
export const GET_HX_SUB_CATEGORIES_INFO_SUCCESS = 'GET_HX_SUB_CATEGORIES_INFO_SUCCESS';
export const GET_HX_SUB_CATEGORIES_INFO_FAILURE = 'GET_HX_SUB_CATEGORIES_INFO_FAILURE';

export const GET_HX_PRIORITIES_INFO = 'GET_HX_PRIORITIES_INFO';
export const GET_HX_PRIORITIES_INFO_SUCCESS = 'GET_HX_PRIORITIES_INFO_SUCCESS';
export const GET_HX_PRIORITIES_INFO_FAILURE = 'GET_HX_PRIORITIES_INFO_FAILURE';

export const GET_INCIDENT_DETAILS = 'GET_INCIDENT_DETAILS';
export const GET_INCIDENT_DETAILS_SUCCESS = 'GET_INCIDENT_DETAILS_SUCCESS';
export const GET_INCIDENT_DETAILS_FAILURE = 'GET_INCIDENT_DETAILS_FAILURE';

export const GET_HX_TASK_TYPES_INFO = 'GET_HX_TASK_TYPES_INFO';
export const GET_HX_TASK_TYPES_INFO_SUCCESS = 'GET_HX_TASK_TYPES_INFO_SUCCESS';
export const GET_HX_TASK_TYPES_INFO_FAILURE = 'GET_HX_TASK_TYPES_INFO_FAILURE';

export const UPDATE_INCIDENT_NO_INFO = 'UPDATE_INCIDENT_NO_INFO';
export const UPDATE_INCIDENT_NO_INFO_SUCCESS = 'UPDATE_INCIDENT_NO_INFO_SUCCESS';
export const UPDATE_INCIDENT_NO_INFO_FAILURE = 'UPDATE_INCIDENT_NO_INFO_FAILURE';

export const GET_HX_TYPES_INFO = 'GET_HX_TYPES_INFO';
export const GET_HX_TYPES_INFO_SUCCESS = 'GET_HX_TYPES_INFO_SUCCESS';
export const GET_HX_TYPES_INFO_FAILURE = 'GET_HX_TYPES_INFO_FAILURE';

export function getIncidentsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = complianceColumns && complianceColumns.incidentsListFields ? complianceColumns.incidentsListFields : [];
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
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

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENTS_INFO, GET_INCIDENTS_INFO_SUCCESS, GET_INCIDENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_INCIDENTS_EXPORT_INFO, GET_INCIDENTS_EXPORT_INFO_SUCCESS, GET_INCIDENTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentsCountInfo(company, model, customFilters, globalFilter, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_INCIDENTS_COUNT_INFO, GET_INCIDENTS_COUNT_INFO_SUCCESS, GET_INCIDENTS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createHxIncidentInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_HX_INCIDENT_INFO, CREATE_HX_INCIDENT_INFO_SUCCESS, CREATE_HX_INCIDENT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getIncidentDetailInfo(id, modelName) {
  const fields = '["id","name","reference","person_witnessed","reference","corrective_action","resolution","incident_on","reported_on","sla_status","acknowledged_on","resolved_on","validated_on","type_category","description",("probability_id", ["id", ("title_id",["id","name"]), "is_analysis_required", "description",("remediate_authority_id",["id","name"]),("risk_rating_id", ["id", "name","description","color"])]),("severity_id", ["id", "name","description","resolution_time",("priority_id", ["id", "name","resolution_time"]),["probability_ids", ["id",("title_id",["id","name"]),"sequence","description",("risk_rating_id", ["id", "name","description","color"])]]]),("equipment_id", ["id", "name",("location_id", ["id", "path_name"])]),("asset_id", ["id", "name", "path_name"]),("maintenance_team_id", ["id", "name"]),("category_id", ["id", "name"]),"state","target_closure_date",("company_id", ["id", "name", "logo"]),("priority_id", ["id", "name", "resolution_time"]),("maintenance_team_id", ["id", "name"]),("assigned_id", ["id", "name"]),("sub_category_id", ["id", "name"]),("incident_type_id", ["id", "name","is_show_category"]),("reported_by_id", ["id", "name"]),("acknowledged_by_id", ["id", "name"]),("resolved_by_id", ["id", "name"]),("validated_by_id", ["id", "name"]),["message_ids", ["id"]],["status_logs", ["id","from_state","to_state",("performed_by_id", ["id", "name"]),"performed_on","description"]],["injuries_sustained_ids", ["id", "name", "organization", "nature_of_injury","organ_injured","status","remarks"]],["analysis_ids", ["id", ("task_type_id", ["id", "name"]), "create_date", "summary_incident", "name", ("assigned_id", ["id", "name"]),"target_date","state","description","is_attachment_required"]],["escalation_matrix_ids", ["id", "level_date", "level", ("recipients_id", ["id", "name"])]],["analysis_checklist_ids", ["id","type","is_attachment_requried","doc_count","answer","rich_text",("mro_activity_id", ["id", "name","sequence","constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]])]],["validate_checklist_ids", ["id","type","doc_count","is_attachment_requried","answer","rich_text",("mro_activity_id", ["id", "name","sequence","constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]])]]]';

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
      types: [GET_INCIDENT_DETAILS, GET_INCIDENT_DETAILS_SUCCESS, GET_INCIDENT_DETAILS_FAILURE],
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

export function getHxSeveritiesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name","description","resolution_time",("priority_id", ["id", "name", "resolution_time"]),["probability_ids", ["id",("title_id",["id","name"]),"sequence","description",("risk_rating_id", ["id", "name","description","color"])]]]&limit=50&offset=0&order=id ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_SEVERITIES_INFO, GET_HX_SEVERITIES_INFO_SUCCESS, GET_HX_SEVERITIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxTypesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name","is_show_category",["category_ids", ["id"]]]&limit=50&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_TYPES_INFO, GET_HX_TYPES_INFO_SUCCESS, GET_HX_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxIncidentConfigInfo(id, modelName) {
  const fields = '["id","category_access","incident_type_access","priority_access","is_sign_off_required","has_incident_type","severity_access","services_access","has_attachment_for_reporting","has_sub_category","has_services_impacted","is_acknowledge_required","is_analyzed_required",("sign_off_role_role_id", ["id", "name"]),("acknowledge_role_id", ["id", "name"]),"is_validation_required",("validator_role_id", ["id", "name"])]';

  const payload = `["company_id","in",[${id}]]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HX_INCIDENT_CONFIG_INFO, GET_HX_INCIDENT_CONFIG_INFO_SUCCESS, GET_HX_INCIDENT_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateIncidentInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_INCIDENT_INFO, UPDATE_INCIDENT_INFO_SUCCESS, UPDATE_INCIDENT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateIncidentNoLoadInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_INCIDENT_NO_INFO, UPDATE_INCIDENT_NO_INFO_SUCCESS, UPDATE_INCIDENT_NO_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getIncidentActionInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_INCIDENT_ACTION_INFO, GET_INCIDENT_ACTION_INFO_SUCCESS, GET_INCIDENT_ACTION_INFO_FAILURE],
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

export function getHxcategoriesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HX_CATEGORIES_INFO, GET_HX_CATEGORIES_INFO_SUCCESS, GET_HX_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxSubCategoriesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HX_SUB_CATEGORIES_INFO, GET_HX_SUB_CATEGORIES_INFO_SUCCESS, GET_HX_SUB_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxPrioritiesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name","resolution_time"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HX_PRIORITIES_INFO, GET_HX_PRIORITIES_INFO_SUCCESS, GET_HX_PRIORITIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxTaskTypesInfo(domain, model) {
  const payload = `domain=[]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HX_TASK_TYPES_INFO, GET_HX_TASK_TYPES_INFO_SUCCESS, GET_HX_TASK_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
