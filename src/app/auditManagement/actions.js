/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import { HxAuditActionModule, HxAuditSystemModule, HxAuditorsModule } from '../util/field';

export const GET_AUDIT_GROUP_INFO = 'GET_AUDIT_GROUP_INFO';
export const GET_AUDIT_GROUP_INFO_SUCCESS = 'GET_AUDIT_GROUP_INFO_SUCCESS';
export const GET_AUDIT_GROUP_INFO_FAILURE = 'GET_AUDIT_GROUP_INFO_FAILURE';

export const GET_AUDIT_VIEWER_GROUP_INFO = 'GET_AUDIT_VIEWER_GROUP_INFO';
export const GET_AUDIT_VIEWER_GROUP_INFO_SUCCESS = 'GET_AUDIT_VIEWER_GROUP_INFO_SUCCESS';
export const GET_AUDIT_VIEWER_GROUP_INFO_FAILURE = 'GET_AUDIT_VIEWER_GROUP_INFO_FAILURE';

export const GET_HX_AUIDIT_DEPARTMENTS_INFO = 'GET_HX_AUIDIT_DEPARTMENTS_INFO';
export const GET_HX_AUIDIT_DEPARTMENTS_INFO_SUCCESS = 'GET_HX_AUIDIT_DEPARTMENTS_INFO_SUCCESS';
export const GET_HX_AUIDIT_DEPARTMENTS_INFO_FAILURE = 'GET_HX_AUIDIT_DEPARTMENTS_INFO_FAILURE';

export const GET_HX_AUIDIT_SYSTEMS_INFO = 'GET_HX_AUIDIT_SYSTEMS_INFO';
export const GET_HX_AUIDIT_SYSTEMS_INFO_SUCCESS = 'GET_HX_AUIDIT_SYSTEMS_INFO_SUCCESS';
export const GET_HX_AUIDIT_SYSTEMS_INFO_FAILURE = 'GET_HX_AUIDIT_SYSTEMS_INFO_FAILURE';

export const GET_HX_AUDIT_CONFIG_INFO = 'GET_HX_AUDIT_CONFIG_INFO';
export const GET_HX_AUDIT_CONFIG_INFO_SUCCESS = 'GET_HX_AUDIT_CONFIG_INFO_SUCCESS';
export const GET_HX_AUDIT_CONFIG_INFO_FAILURE = 'GET_HX_AUDIT_CONFIG_INFO_FAILURE';

export const CREATE_HX_AUDIT_INFO = 'CREATE_HX_AUDIT_INFO';
export const CREATE_HX_AUDIT_INFO_SUCCESS = 'CREATE_HX_AUDIT_INFO_SUCCESS';
export const CREATE_HX_AUDIT_INFO_FAILURE = 'CREATE_HX_AUDIT_INFO_FAILURE';

export const UPDATE_HX_AUDIT_INFO = 'UPDATE_HX_AUDIT_INFO';
export const UPDATE_HX_AUDIT_INFO_SUCCESS = 'UPDATE_HX_AUDIT_INFO_SUCCESS';
export const UPDATE_HX_AUDIT_INFO_FAILURE = 'UPDATE_HX_AUDIT_INFO_FAILURE';

export const GET_HXAUDIT_DETAILS_INFO = 'GET_HXAUDIT_DETAILS_INFO';
export const GET_HXAUDIT_DETAILS_INFO_SUCCESS = 'GET_HXAUDIT_DETAILS_INFO_SUCCESS';
export const GET_HXAUDIT_DETAILS_INFO_FAILURE = 'GET_HXAUDIT_DETAILS_INFO_FAILURE';

export const GET_HXAUDIT_CHECKLISTS_INFO = 'GET_HXAUDIT_CHECKLISTS_INFO';
export const GET_HXAUDIT_CHECKLISTS_INFO_SUCCESS = 'GET_HXAUDIT_CHECKLISTS_INFO_SUCCESS';
export const GET_HXAUDIT_CHECKLISTS_INFO_FAILURE = 'GET_HXAUDIT_CHECKLISTS_INFO_FAILURE';

export const GET_HXAUDITOR_NAMES_INFO = 'GET_HXAUDITOR_NAMES_INFO';
export const GET_HXAUDITOR_NAMES_INFO_SUCCESS = 'GET_HXAUDITOR_NAMES_INFO_SUCCESS';
export const GET_HXAUDITOR_NAMES_INFO_FAILURE = 'GET_HXAUDITOR_NAMES_INFO_FAILURE';

export const GET_HXAUDIT_ROLES_INFO = 'GET_HXAUDIT_ROLES_INFO';
export const GET_HXAUDIT_ROLES_INFO_SUCCESS = 'GET_HXAUDIT_ROLES_INFO_SUCCESS';
export const GET_HXAUDIT_ROLES_INFO_FAILURE = 'GET_HXAUDIT_ROLES_INFO_FAILURE';

export const GET_HXACTION_DAYS_INFO = 'GET_HXACTION_DAYS_INFO';
export const GET_HXACTION_DAYS_INFO_SUCCESS = 'GET_HXACTION_DAYS_INFO_SUCCESS';
export const GET_HXACTION_DAYS_INFO_FAILURE = 'GET_HXACTION_DAYS_INFO_FAILURE';

export const CREATE_HX_ACTION_INFO = 'CREATE_HX_ACTION_INFO';
export const CREATE_HX_ACTION_INFO_SUCCESS = 'CREATE_HX_ACTION_INFO_SUCCESS';
export const CREATE_HX_ACTION_INFO_FAILURE = 'CREATE_HX_ACTION_INFO_FAILURE';

export const GET_HXAUDIT_ACTIONS_INFO = 'GET_HXAUDIT_ACTIONS_INFO';
export const GET_HXAUDIT_ACTIONS_INFO_SUCCESS = 'GET_HXAUDIT_ACTIONS_INFO_SUCCESS';
export const GET_HXAUDIT_ACTIONS_INFO_FAILURE = 'GET_HXAUDIT_ACTIONS_INFO_FAILURE';

export const GET_HX_AUIDIT_CATEGORIES_INFO = 'GET_HX_AUIDIT_CATEGORIES_INFO';
export const GET_HX_AUIDIT_CATEGORIES_INFO_SUCCESS = 'GET_HX_AUIDIT_CATEGORIES_INFO_SUCCESS';
export const GET_HX_AUIDIT_CATEGORIES_INFO_FAILURE = 'GET_HX_AUIDIT_CATEGORIES_INFO_FAILURE';

export const GET_HX_AUDIT_ACTIONS_LIST_INFO = 'GET_HX_AUDIT_ACTIONS_LIST_INFO';
export const GET_HX_AUDIT_ACTIONS_LIST_INFO_SUCCESS = 'GET_HX_AUDIT_ACTIONS_LIST_INFO_SUCCESS';
export const GET_HX_AUDIT_ACTIONS_LIST_INFO_FAILURE = 'GET_HX_AUDIT_ACTIONS_LIST_INFO_FAILURE';

export const GET_HX_AUDIT_ACTIONS_EXPORT_INFO = 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO';
export const GET_HX_AUDIT_ACTIONS_EXPORT_INFO_SUCCESS = 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO_SUCCESS';
export const GET_HX_AUDIT_ACTIONS_EXPORT_INFO_FAILURE = 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO_FAILURE';

export const GET_HX_AUDIT_ACTIONS_COUNT_INFO = 'GET_HX_AUDIT_ACTIONS_COUNT_INFO';
export const GET_HX_AUDIT_ACTIONS_COUNT_INFO_SUCCESS = 'GET_HX_AUDIT_ACTIONS_COUNT_INFO_SUCCESS';
export const GET_HX_AUDIT_ACTIONS_COUNT_INFO_FAILURE = 'GET_HX_AUDIT_ACTIONS_COUNT_INFO_FAILURE';

export const GET_HXAUDIT_ACTION_DETAIL_INFO = 'GET_HXAUDIT_ACTION_DETAIL_INFO';
export const GET_HXAUDIT_ACTION_DETAIL_INFO_SUCCESS = 'GET_HXAUDIT_ACTION_DETAIL_INFO_SUCCESS';
export const GET_HXAUDIT_ACTION_DETAIL_INFO_FAILURE = 'GET_HXAUDIT_ACTION_DETAIL_INFO_FAILURE';

export const GET_HXAUDIT_ACTION_PERFORM_INFO = 'GET_HXAUDIT_ACTION_PERFORM_INFO';
export const GET_HXAUDIT_ACTION_PERFORM_INFO_SUCCESS = 'GET_HXAUDIT_ACTION_PERFORM_INFO_SUCCESS';
export const GET_HXAUDIT_ACTION_PERFORM_INFO_FAILURE = 'GET_HXAUDIT_ACTION_PERFORM_INFO_FAILURE';

export const GET_CUSTOM_DATA_AUDIT_GROUP_INFO = 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO';
export const GET_CUSTOM_DATA_AUDIT_GROUP_INFO_SUCCESS = 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO_SUCCESS';
export const GET_CUSTOM_DATA_AUDIT_GROUP_INFO_FAILURE = 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO_FAILURE';

export const DELETE_AUDIT_ACTION_INFO = 'DELETE_AUDIT_ACTION_INFO';
export const DELETE_AUDIT_ACTION_INFO_SUCCESS = 'DELETE_AUDIT_ACTION_INFO_SUCCESS';
export const DELETE_AUDIT_ACTION_INFO_FAILURE = 'DELETE_AUDIT_ACTION_INFO_FAILURE';

export const GET_SYSTEM_CHECKLISTS_INFO = 'GET_SYSTEM_CHECKLISTS_INFO';
export const GET_SYSTEM_CHECKLISTS_INFO_SUCCESS = 'GET_SYSTEM_CHECKLISTS_INFO_SUCCESS';
export const GET_SYSTEM_CHECKLISTS_INFO_FAILURE = 'GET_SYSTEM_CHECKLISTS_INFO_FAILURE';

export const GET_HXCHECKLIST_DETAILS_INFO = 'GET_HXCHECKLIST_DETAILS_INFO';
export const GET_HXCHECKLIST_DETAILS_INFO_SUCCESS = 'GET_HXCHECKLIST_DETAILS_INFO_SUCCESS';
export const GET_HXCHECKLIST_DETAILS_INFO_FAILURE = 'GET_HXCHECKLIST_DETAILS_INFO_FAILURE';

export const GET_HX_AUDIT_SYSTEMS_LIST_INFO = 'GET_HX_AUDIT_SYSTEMS_LIST_INFO';
export const GET_HX_AUDIT_SYSTEMS_LIST_INFO_SUCCESS = 'GET_HX_AUDIT_SYSTEMS_LIST_INFO_SUCCESS';
export const GET_HX_AUDIT_SYSTEMS_LIST_INFO_FAILURE = 'GET_HX_AUDIT_SYSTEMS_LIST_INFO_FAILURE';

export const GET_HX_AUDIT_SYSTEMS_EXPORT_INFO = 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO';
export const GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_SUCCESS = 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_SUCCESS';
export const GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_FAILURE = 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_FAILURE';

export const GET_HX_AUDIT_SYSTEMS_COUNT_INFO = 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO';
export const GET_HX_AUDIT_SYSTEMS_COUNT_INFO_SUCCESS = 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO_SUCCESS';
export const GET_HX_AUDIT_SYSTEMS_COUNT_INFO_FAILURE = 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO_FAILURE';

export const GET_HXAUDIT_SYSTEM_DETAIL_INFO = 'GET_HXAUDIT_SYSTEM_DETAIL_INFO';
export const GET_HXAUDIT_SYSTEM_DETAIL_INFO_SUCCESS = 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_SUCCESS';
export const GET_HXAUDIT_SYSTEM_DETAIL_INFO_FAILURE = 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_FAILURE';

export const UPDATE_HX_SYSTEM_INFO = 'UPDATE_HX_SYSTEM_INFO';
export const UPDATE_HX_SYSTEM_INFO_SUCCESS = 'UPDATE_HX_SYSTEM_INFO_SUCCESS';
export const UPDATE_HX_SYSTEM_INFO_FAILURE = 'UPDATE_HX_SYSTEM_INFO_FAILURE';

export const CREATE_HX_SYSTEM_INFO = 'CREATE_HX_SYSTEM_INFO';
export const CREATE_HX_SYSTEM_INFO_SUCCESS = 'CREATE_HX_SYSTEM_INFO_SUCCESS';
export const CREATE_HX_SYSTEM_INFO_FAILURE = 'CREATE_HX_SYSTEM_INFO_FAILURE';

export const CREATE_HX_QTN_GROUP_INFO = 'CREATE_HX_QTN_GROUP_INFO';
export const CREATE_HX_QTN_GROUP_INFO_SUCCESS = 'CREATE_HX_QTN_GROUP_INFO_SUCCESS';
export const CREATE_HX_QTN_GROUP_INFO_FAILURE = 'CREATE_HX_QTN_GROUP_INFO_FAILURE';

export const GET_HX_SYSTEM_METRIC_INFO = 'GET_HX_SYSTEM_METRIC_INFO';
export const GET_HX_SYSTEM_METRIC_INFO_SUCCESS = 'GET_HX_SYSTEM_METRIC_INFO_SUCCESS';
export const GET_HX_SYSTEM_METRIC_INFO_FAILURE = 'GET_HX_SYSTEM_METRIC_INFO_FAILURE';

export const GET_HX_NCR_REPEAT_INFO = 'GET_HX_NCR_REPEAT_INFO';
export const GET_HX_NCR_REPEAT_INFO_SUCCESS = 'GET_HX_NCR_REPEAT_INFO_SUCCESS';
export const GET_HX_NCR_REPEAT_INFO_FAILURE = 'GET_HX_NCR_REPEAT_INFO_FAILURE';

export const GET_AUDIT_VIEWER_EXPORT_INFO = 'GET_AUDIT_VIEWER_EXPORT_INFO';
export const GET_AUDIT_VIEWER_EXPORT_INFO_SUCCESS = 'GET_AUDIT_VIEWER_EXPORT_INFO_SUCCESS';
export const GET_AUDIT_VIEWER_EXPORT_INFO_FAILURE = 'GET_AUDIT_VIEWER_EXPORT_INFO_FAILURE';

export const GET_HX_AUDITORS_CONFIG_LIST_INFO = 'GET_HX_AUDITORS_CONFIG_LIST_INFO';
export const GET_HX_AUDITORS_CONFIG_LIST_INFO_SUCCESS = 'GET_HX_AUDITORS_CONFIG_LIST_INFO_SUCCESS';
export const GET_HX_AUDITORS_CONFIG_LIST_INFO_FAILURE = 'GET_HX_AUDITORS_CONFIG_LIST_INFO_FAILURE';

export const GET_HX_AUDITORS_CONFIG_EXPORT_INFO = 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO';
export const GET_HX_AUDITORS_CONFIG_EXPORT_INFO_SUCCESS = 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO_SUCCESS';
export const GET_HX_AUDITORS_CONFIG_EXPORT_INFO_FAILURE = 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO_FAILURE';

export const GET_HX_AUDITORS_CONFIG_COUNT_INFO = 'GET_HX_AUDITORS_CONFIG_COUNT_INFO';
export const GET_HX_AUDITORS_CONFIG_COUNT_INFO_SUCCESS = 'GET_HX_AUDITORS_CONFIG_COUNT_INFO_SUCCESS';
export const GET_HX_AUDITORS_CONFIG_COUNT_INFO_FAILURE = 'GET_HX_AUDITORS_CONFIG_COUNT_INFO_FAILURE';


export function getAuditGroupsInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters) {
  let payload = `domain=[["company_id","in",[${company}]],["${groupField}","!=",false],["planned_start_date","<=","${end}"],["planned_end_date",">=","${start}"]`;
  if (selectedFilter && selectedFilter.length) {
    payload = `${payload},["state","in",${JSON.stringify(selectedFilter)}]`;
  }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }
  payload = `${payload}]&model=${model}&fields=["${groupField}"]&groupby=["${groupField}"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_AUDIT_GROUP_INFO, GET_AUDIT_GROUP_INFO_SUCCESS, GET_AUDIT_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditViewerInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit) {
  // eslint-disable-next-line max-len
  const fields = '["id","audit_system_id","objective","audit_category_id","scope","company_id","audit_spoc_id","audit_type","name","sequence","state","quarter","department_id","planned_start_date","planned_end_date"]';
  let payload;
  if (start !== undefined && end !== undefined) {
    payload = `domain=[["company_id","in",[${company}]],["planned_start_date","<=","${end}"],["planned_end_date",">=","${start}"]`;
  } else {
    payload = `domain=[["company_id","in",[${company}]]`;
  }
  if (selectedFilter && selectedFilter.length) {
    payload = `${payload},["state","in",${JSON.stringify(selectedFilter)}]`;
  }

  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }
  if (ids && ids.length) {
    payload = `${payload},["${groupField}","in",${JSON.stringify(ids)}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&offset=0&limit=${limit || 0}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AUDIT_VIEWER_GROUP_INFO, GET_AUDIT_VIEWER_GROUP_INFO_SUCCESS, GET_AUDIT_VIEWER_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditExportViewerInfo(company, model, groupField, start, end, selectedFilter, selectedField, groupFilters, ids, limit) {
  // eslint-disable-next-line max-len
  const fields = '["id","audit_system_id","objective","audit_category_id","scope","company_id","audit_spoc_id","audit_type","name","sequence","state","quarter","department_id","planned_start_date","planned_end_date"]';
  let payload;
  if (start !== undefined && end !== undefined) {
    payload = `domain=[["company_id","in",[${company}]],["planned_start_date","<=","${end}"],["planned_end_date",">=","${start}"]`;
  } else {
    payload = `domain=[["company_id","in",[${company}]]`;
  }
  if (selectedFilter && selectedFilter.length) {
    payload = `${payload},["state","in",${JSON.stringify(selectedFilter)}]`;
  }

  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&offset=0&limit=${limit || 0}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AUDIT_VIEWER_EXPORT_INFO, GET_AUDIT_VIEWER_EXPORT_INFO_SUCCESS, GET_AUDIT_VIEWER_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditDepartmentsInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_AUIDIT_DEPARTMENTS_INFO, GET_HX_AUIDIT_DEPARTMENTS_INFO_SUCCESS, GET_HX_AUIDIT_DEPARTMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditMetricsInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name",["scale_line_ids", ["id", "min", "max", "legend", "color"]]]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_SYSTEM_METRIC_INFO, GET_HX_SYSTEM_METRIC_INFO_SUCCESS, GET_HX_SYSTEM_METRIC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditSystemsInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name","scope","instructions_to_auditor",("audit_metric_id",["id","name"]),"overall_score","instructions_to_auditee","terms_and_conditions","objective",("department_id", ["id", "name"])]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_AUIDIT_SYSTEMS_INFO, GET_HX_AUIDIT_SYSTEMS_INFO_SUCCESS, GET_HX_AUIDIT_SYSTEMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditConfig(id, modelName) {
  const fields = '["id","audit_template_access","allow_missed_audits_to_be_performed","audit_category_access","department_access","auditors_access","auditees_access","action_category_access","applicable_standards_access","max_planned_interval_days","allow_postpone_prepone","approval_required_for_postpone","exception_for_approval_lead_days",("approval_authority", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])])]';

  const payload = `["company_id","in",[${id}]]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HX_AUDIT_CONFIG_INFO, GET_HX_AUDIT_CONFIG_INFO_SUCCESS, GET_HX_AUDIT_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateHxAuditInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_HX_AUDIT_INFO, UPDATE_HX_AUDIT_INFO_SUCCESS, UPDATE_HX_AUDIT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function createHxAuditInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_HX_AUDIT_INFO, CREATE_HX_AUDIT_INFO_SUCCESS, CREATE_HX_AUDIT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getHxAuditDetailsInfo(id, modelName, noLoad) {
  const fields = '["id","scope","audit_type",("audit_metric_id",["id","name", ["scale_line_ids", ["id", "min", "max", "legend", "color"]]]),"is_pending_for_approval","overall_score","name","objective","planned_start_date","planned_end_date","quarter","sequence","action_status","sla_status","state","instructions_to_auditor","instructions_to_auditee","terms_and_conditions","laste_scalation_level","sla_next_level_execution","sla_next_run_date",("audit_system_id", ["id", "name",("audit_metric_id",["id","name"]),"overall_score","scope","instructions_to_auditor","instructions_to_auditee","terms_and_conditions","objective",("department_id", ["id", "name"])]),("company_id", ["id", "name"]),("audit_category_id", ["id", "name"]),("audit_spoc_id", ["id", "name"]),("escalation_policy_id", ["id", "name"]),("department_id", ["id", "name"]),["message_ids", ["id"]],["escalation_matrix_ids", ["id", "type", "level_date", "level", ("recipients_id", ["id", "name"])]],["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]],["checklists_lines", ["id","remarks","answer","is_na","achieved_score",("page_id", ["id", "title"]),("question_group_id", ["id", "name"]),("mro_activity_id", ["id", "type", "question","sequence","procedure","helper_text","applicable_score",["applicable_standard_ids", ["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]]])]],["auditors_ids", ["id",("auditor_id", ["id", "name","certification_status","type","certificate_expires_on"]),"is_spoc",("role_id", ["id", "name"])]],["auditees_ids", ["id",("team_members_id", ["id", "name"]),"is_spoc",("role_id", ["id", "name"])]],["time_log_ids", ["id","name","hours_spent","comments","description"]],["audit_events_ids", ["id","name","date","duration","agenda","resources","notes"]],["summary_pages", ["id",("name", ["id", "title"]),"max_score","achieved_score","percentage","description"]],["prepone_approval_ids", ["id", "requested_on", "state", "remarks", "data", "expires_on", "approved_on", ("requested_by_id", ["id", "name"]),("approved_by_id", ["id", "name"]),("approval_authority_id", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])])]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [noLoad ? 'GET_HXAUDIT_DETAILS_INFO_NO' : GET_HXAUDIT_DETAILS_INFO, GET_HXAUDIT_DETAILS_INFO_SUCCESS, noLoad ? 'GET_HXAUDIT_DETAILS_INFO_FAILURE_NO' : GET_HXAUDIT_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getHxAuditChecklistsInfo(id, modelName, noLoad) {
  const fields = '["id","name","audit_type","planned_start_date","instructions_to_auditor","instructions_to_auditee","terms_and_conditions","planned_end_date",("audit_spoc_id", ["id", "name"]),"quarter","sequence","state",("audit_category_id", ["id", "name"]),("audit_system_id", ["id", "name","scope","objective","instructions_to_auditor","instructions_to_auditee","terms_and_conditions",("department_id", ["id", "name"])]),("company_id", ["id", "name"]),["checklists_lines",["id","remarks","answer","is_na","achieved_score",("page_id", ["id", "title"]),("question_group_id", ["id", "name"]),("mro_activity_id", ["id", "type", "question","sequence","is_attachment_mandatory","has_attachment","helper_text","risk_level","applicable_score","procedure","comments_allowed","constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["applicable_standard_ids", ["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]],["labels_ids", ["id","value","favicon","color","emoji","is_not_acceptable","is_na","is_ncr","quizz_mark","is_remark_required"]],["based_on_ids", ["id"]]])]],["summary_pages", ["id",("name", ["id", "title"]),"max_score","achieved_score","percentage","description"]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [noLoad ? 'GET_HXAUDIT_CHECKLISTS_INFO_NO' : GET_HXAUDIT_CHECKLISTS_INFO, GET_HXAUDIT_CHECKLISTS_INFO_SUCCESS, noLoad ? 'GET_HXAUDIT_CHECKLISTS_INFO_FAILURE_NO' : GET_HXAUDIT_CHECKLISTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getHxAuditNamesInfo(company, modelName, keyword, ids, isAuditee) {
  let fields = '["id","name","certification_status","type","certificate_expires_on"]';
  if (isAuditee) {
    fields = '["id","name"]';
  }
  let payload = isAuditee ? `["company_id","=",${company}]` : company;
  if (keyword && keyword.length > 1) {
    payload = `${payload}${isAuditee || company ? ',' : ''}["name","ilike","${keyword}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload}${(keyword || company) && !isAuditee ? ',' : ''}${isAuditee ? ',' : ''}["id","not in",${JSON.stringify(ids)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HXAUDITOR_NAMES_INFO, GET_HXAUDITOR_NAMES_INFO_SUCCESS, GET_HXAUDITOR_NAMES_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getHxAuditRolesInfo(company, modelName, keyword, ids, isAuditee) {
  const fields = '["id","name","is_spoc"]';
  let payload = isAuditee ? '["applies_to","=","Auditee"]' : '["applies_to","=","Auditor"]';
  if (keyword && keyword.length > 1) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HXAUDIT_ROLES_INFO, GET_HXAUDIT_ROLES_INFO_SUCCESS, GET_HXAUDIT_ROLES_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getHxActionDaysInfo() {
  const fields = '["id","name","days"]';
  const payload = '';

  return {
    [CALL_API]: {
      endpoint: `search/hx.action_resolution_window?model=hx.action_resolution_window&domain=[${payload}]&fields=${fields}`,
      types: [GET_HXACTION_DAYS_INFO, GET_HXACTION_DAYS_INFO_SUCCESS, GET_HXACTION_DAYS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createHxActionInfo(model, result, editId) {
  let payload = {};
  if (editId) {
    payload = {
      ids: `[${editId}]`, values: result,
    };
  }
  return {
    [CALL_API]: {
      endpoint: editId ? `write/${model}` : `create/${model}`,
      types: [CREATE_HX_ACTION_INFO, CREATE_HX_ACTION_INFO_SUCCESS, CREATE_HX_ACTION_INFO_FAILURE],
      method: editId ? 'PUT' : 'POST',
      payload: editId ? payload : result,
    },
  };
}

export function getHxAuditActionsInfo(modelName, id, questionId) {
  const fields = '["id","name","type",("question_id", ["id", "question"]),"state",("responsible_id", ["id", "name"]),"severity","deadline","description","sla_status","resolution",("resolution_window_id", ["id", "name"])]';
  let payload = `["audit_id","=",${id}]`;
  if (questionId) {
    payload = `${payload},["question_id","=",${questionId}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HXAUDIT_ACTIONS_INFO, GET_HXAUDIT_ACTIONS_INFO_SUCCESS, GET_HXAUDIT_ACTIONS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditCategoriesInfo(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["id","name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_AUIDIT_CATEGORIES_INFO, GET_HX_AUIDIT_CATEGORIES_INFO_SUCCESS, GET_HX_AUIDIT_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditActionsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId) {
  const fields = HxAuditActionModule && HxAuditActionModule.apiFields ? HxAuditActionModule.apiFields : [];
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
  if (buttonFilterType && buttonFilterType === 'My') {
    payload = `${payload},["responsible_id.user_id","=",${userId}]`;
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
      types: [GET_HX_AUDIT_ACTIONS_LIST_INFO, GET_HX_AUDIT_ACTIONS_LIST_INFO_SUCCESS, GET_HX_AUDIT_ACTIONS_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditActionsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId) {
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
  if (buttonFilterType && buttonFilterType === 'My') {
    payload = `${payload},["responsible_id.user_id","=",${userId}]`;
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
      types: [GET_HX_AUDIT_ACTIONS_EXPORT_INFO, GET_HX_AUDIT_ACTIONS_EXPORT_INFO_SUCCESS, GET_HX_AUDIT_ACTIONS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditActionsCountInfo(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId) {
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
  if (buttonFilterType && buttonFilterType === 'My') {
    payload = `${payload},["responsible_id.user_id","=",${userId}]`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_AUDIT_ACTIONS_COUNT_INFO, GET_HX_AUDIT_ACTIONS_COUNT_INFO_SUCCESS, GET_HX_AUDIT_ACTIONS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditActionDetailInfo(id, modelName, noLoad) {
  const fields = '["id","name","type","sla_status","repeated_count_company","repeated_count_site","deadline","resolution","description","state",("responsible_id", ["id", "name"]),("category_id", ["id", "name"]),("audit_id", ["id", "name"]),("company_id", ["id", "name"]),("question_id", ["id", "question"]),"severity",("resolution_window_id", ["id", "name"]),["escalation_matrix_ids", ["id", "type", "level_date", "level", ("recipients_id", ["id", "name"])]],["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [noLoad ? 'GET_HXAUDIT_ACTION_DETAIL_INFO_NO' : GET_HXAUDIT_ACTION_DETAIL_INFO, GET_HXAUDIT_ACTION_DETAIL_INFO_SUCCESS, noLoad ? 'GET_HXAUDIT_ACTION_DETAIL_INFO_FAILURE_NO' : GET_HXAUDIT_ACTION_DETAIL_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getHxAuditActionPerformInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.context = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_HXAUDIT_ACTION_PERFORM_INFO, GET_HXAUDIT_ACTION_PERFORM_INFO_SUCCESS, GET_HXAUDIT_ACTION_PERFORM_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getCustomGroupInfo(company, model, field, start, end) {
  const methodName = 'read_group';

  let payload;
  if (start !== undefined && end !== undefined) {
    payload = `domain=[["company_id","in",[${company}]],["planned_start_date","<=","${end}"],["planned_end_date",">=","${start}"]`;
  } else {
    payload = `domain=[["company_id","in",[${company}]]`;
  }

  payload = `${payload}]&model=${model}&fields=["${field}"]&groupby=["${field}"]`;

  return {
    [CALL_API]: {
      endpoint: `${methodName}?${payload}`,
      types: [GET_CUSTOM_DATA_AUDIT_GROUP_INFO, GET_CUSTOM_DATA_AUDIT_GROUP_INFO_SUCCESS, GET_CUSTOM_DATA_AUDIT_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getDeleteAuditActionInfo(id, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName,
  };
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_AUDIT_ACTION_INFO, DELETE_AUDIT_ACTION_INFO_SUCCESS, DELETE_AUDIT_ACTION_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getSystemChecklistsInfo(id, modelName) {
  const fields = '["id",["page_ids", ["id","title",["question_ids", ["id","question","sequence","helper_text","type",("question_group_id", ["id", "name"]),"risk_level","applicable_score","procedure",["applicable_standard_ids", ["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]]]]]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_SYSTEM_CHECKLISTS_INFO, GET_SYSTEM_CHECKLISTS_INFO_SUCCESS, GET_SYSTEM_CHECKLISTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getHxAuditChecklistDetailInfo(auditId, questionId) {
  const fields = '["id","remarks","answer","is_na","achieved_score",("page_id", ["id", "title"]),("question_group_id", ["id", "name"]),("mro_activity_id", ["id", "type", "question","sequence","procedure","helper_text","applicable_score",["applicable_standard_ids", ["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]]])]';
  const payload = `["audit_id","=",${auditId}],["mro_activity_id","=",${questionId}]`;

  return {
    [CALL_API]: {
      endpoint: `search/hx.audit_checklist_line?model=hx.audit_checklist_line&domain=[${payload}]&fields=${fields}`,
      types: [GET_HXCHECKLIST_DETAILS_INFO, GET_HXCHECKLIST_DETAILS_INFO_SUCCESS, GET_HXCHECKLIST_DETAILS_INFO_FAILURE],
      method: 'GET',
      auditId,
    },
  };
}

export function getHxAuditSystemsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = HxAuditSystemModule && HxAuditSystemModule.apiFields ? HxAuditSystemModule.apiFields : [];
  let payload = `domain=[["company_id","in",[${company}]]`;

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
      types: [GET_HX_AUDIT_SYSTEMS_LIST_INFO, GET_HX_AUDIT_SYSTEMS_LIST_INFO_SUCCESS, GET_HX_AUDIT_SYSTEMS_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditSystemsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_HX_AUDIT_SYSTEMS_EXPORT_INFO, GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_SUCCESS, GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditSystemsCountInfo(company, model, states, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
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
      types: [GET_HX_AUDIT_SYSTEMS_COUNT_INFO, GET_HX_AUDIT_SYSTEMS_COUNT_INFO_SUCCESS, GET_HX_AUDIT_SYSTEMS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditSystemDetailInfo(id, modelName, noLoad) {
  const fields = '["id","name","scope","state","create_date","short_code","instructions_to_auditor",("audit_metric_id",["id","name",["scale_line_ids", ["id", "min", "max", "legend", "color"]]]),("company_id",["id","name"]),"overall_score","instructions_to_auditee","terms_and_conditions","objective",("department_id", ["id", "name"]),["page_ids", ["id","title",["question_ids", ["id","question","sequence","has_attachment","comments_allowed","constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),"helper_text","type",("question_group_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji","is_not_acceptable","is_na","is_ncr","quizz_mark","is_remark_required"]],["based_on_ids", ["id"]],"risk_level","applicable_score","procedure",["applicable_standard_ids", ["id", "name", "disclosure", ("standard_id", ["id", "name"]),"description"]]]]]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [noLoad ? 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_NO' : GET_HXAUDIT_SYSTEM_DETAIL_INFO, GET_HXAUDIT_SYSTEM_DETAIL_INFO_SUCCESS, noLoad ? 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_FAILURE_NO' : GET_HXAUDIT_SYSTEM_DETAIL_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateHxSystemInfo(id, model, result, noLoad) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [noLoad ? 'UPDATE_HX_SYSTEM_INFO2' : UPDATE_HX_SYSTEM_INFO, noLoad ? 'UPDATE_HX_SYSTEM_INFO_SUCCESS2' : UPDATE_HX_SYSTEM_INFO_SUCCESS, noLoad ? 'UPDATE_HX_SYSTEM_INFO_FAILURE2' : UPDATE_HX_SYSTEM_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function createHxSystemInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_HX_SYSTEM_INFO, CREATE_HX_SYSTEM_INFO_SUCCESS, CREATE_HX_SYSTEM_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createHxQuestionGroupInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_HX_QTN_GROUP_INFO, CREATE_HX_QTN_GROUP_INFO_SUCCESS, CREATE_HX_QTN_GROUP_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getAuditQuestionRepeatedInfo(qtnId) {
  return {
    [CALL_API]: {
      endpoint: `hx/audit/question?question_id=${qtnId}`,
      types: [GET_HX_NCR_REPEAT_INFO, GET_HX_NCR_REPEAT_INFO_SUCCESS, GET_HX_NCR_REPEAT_INFO_FAILURE],
      method: 'GET',
      qtnId,
    },
  };
}

export function getHxAuditorsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = HxAuditorsModule && HxAuditorsModule.apiFields ? HxAuditorsModule.apiFields : [];
  let payload = `domain=[${company}`;

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
      types: [GET_HX_AUDITORS_CONFIG_LIST_INFO, GET_HX_AUDITORS_CONFIG_LIST_INFO_SUCCESS, GET_HX_AUDITORS_CONFIG_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditorsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[${company}`;
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
      types: [GET_HX_AUDITORS_CONFIG_EXPORT_INFO, GET_HX_AUDITORS_CONFIG_EXPORT_INFO_SUCCESS, GET_HX_AUDITORS_CONFIG_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxAuditorsCountInfo(company, model, states, customFilters, globalFilter) {
  let payload = `domain=[${company}`;
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
      types: [GET_HX_AUDITORS_CONFIG_COUNT_INFO, GET_HX_AUDITORS_CONFIG_COUNT_INFO_SUCCESS, GET_HX_AUDITORS_CONFIG_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
