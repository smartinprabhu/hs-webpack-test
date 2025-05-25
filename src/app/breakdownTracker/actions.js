/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import complianceColumns from './data/customData.json';

export const GET_BT_INFO = 'GET_BT_INFO';
export const GET_BT_INFO_SUCCESS = 'GET_BT_INFO_SUCCESS';
export const GET_BT_INFO_FAILURE = 'GET_BT_INFO_FAILURE';

export const GET_BT_COUNT_INFO = 'GET_BT_COUNT_INFO';
export const GET_BT_COUNT_INFO_SUCCESS = 'GET_BT_COUNT_INFO_SUCCESS';
export const GET_BT_COUNT_INFO_FAILURE = 'GET_BT_COUNT_INFO_FAILURE';

export const GET_ACT_GROUP_INFO = 'GET_ACT_GROUP_INFO';
export const GET_ACT_GROUP_INFO_SUCCESS = 'GET_ACT_GROUP_INFO_SUCCESS';
export const GET_ACT_GROUP_INFO_FAILURE = 'GET_ACT_GROUP_INFO_FAILURE';

export const GET_CATEGORY_GROUP_INFO = 'GET_CATEGORY_GROUP_INFO';
export const GET_CATEGORY_GROUP_INFO_SUCCESS = 'GET_CATEGORY_GROUP_INFO_SUCCESS';
export const GET_CATEGORY_GROUP_INFO_FAILURE = 'GET_CATEGORY_GROUP_INFO_FAILURE';

export const GET_SERVICE_CATEGORY_GROUP_INFO = 'GET_SERVICE_CATEGORY_GROUP_INFO';
export const GET_SERVICE_CATEGORY_GROUP_INFO_SUCCESS = 'GET_SERVICE_CATEGORY_GROUP_INFO_SUCCESS';
export const GET_SERVICE_CATEGORY_GROUP_INFO_FAILURE = 'GET_SERVICE_CATEGORY_GROUP_INFO_FAILURE';

export const GET_RAISED_GROUP_INFO = 'GET_RAISED_GROUP_INFO';
export const GET_RAISED_GROUP_INFO_SUCCESS = 'GET_RAISED_GROUP_INFO_SUCCESS';
export const GET_RAISED_GROUP_INFO_FAILURE = 'GET_RAISED_GROUP_INFO_FAILURE';

export const GET_ST_GROUP_INFO = 'GET_ST_GROUP_INFO';
export const GET_ST_GROUP_INFO_SUCCESS = 'GET_ST_GROUP_INFO_SUCCESS';
export const GET_ST_GROUP_INFO_FAILURE = 'GET_ST_GROUP_INFO_FAILURE';

export const CREATE_BT_INFO = 'CREATE_BT_INFO';
export const CREATE_BT_INFO_SUCCESS = 'CREATE_BT_INFO_SUCCESS';
export const CREATE_BT_INFO_FAILURE = 'CREATE_BT_INFO_FAILURE';

export const GET_BT_DETAILS = 'GET_BT_DETAILS';
export const GET_BT_DETAILS_SUCCESS = 'GET_BT_DETAILS_SUCCESS';
export const GET_BT_DETAILS_FAILURE = 'GET_BT_DETAILS_FAILURE';

export const GET_BT_EXPORT_INFO = 'GET_BT_EXPORT_INFO';
export const GET_BT_EXPORT_INFO_SUCCESS = 'GET_BT_EXPORT_INFO_SUCCESS';
export const GET_BT_EXPORT_INFO_FAILURE = 'GET_BT_EXPORT_INFO_FAILURE';

export const GET_BT_TEMPLATE_INFO = 'GET_BT_TEMPLATE_INFO';
export const GET_BT_TEMPLATE_INFO_SUCCESS = 'GET_BT_TEMPLATE_INFO_SUCCESS';
export const GET_BT_TEMPLATE_INFO_FAILURE = 'GET_BT_TEMPLATE_INFO_FAILURE';

export const GET_BT_ACT_INFO = 'GET_BT_ACT_INFO';
export const GET_BT_ACT_INFO_SUCCESS = 'GET_BT_ACT_INFO_SUCCESS';
export const GET_BT_ACT_INFO_FAILURE = 'GET_BT_ACT_INFO_FAILURE';

export const GET_BT_EVIDENCE = 'GET_BT_EVIDENCE';
export const GET_BT_EVIDENCE_SUCCESS = 'GET_BT_EVIDENCE_SUCCESS';
export const GET_BT_EVIDENCE_FAILURE = 'GET_BT_EVIDENCE_FAILURE';

export const GET_SUBMITTED_TO_INFO = 'GET_SUBMITTED_TO_INFO';
export const GET_SUBMITTED_TO_INFO_SUCCESS = 'GET_SUBMITTED_TO_INFO_SUCCESS';
export const GET_SUBMITTED_TO_INFO_FAILURE = 'GET_SUBMITTED_TO_INFO_FAILURE';

export const GET_BT_LOGS = 'GET_BT_LOGS';
export const GET_BT_LOGS_SUCCESS = 'GET_BT_LOGS_SUCCESS';
export const GET_BT_LOGS_FAILURE = 'GET_BT_LOGS_FAILURE';

export const GET_BT_TEMPLATE = 'GET_BT_TEMPLATE';
export const GET_BT_TEMPLATE_SUCCESS = 'GET_BT_TEMPLATE_SUCCESS';
export const GET_BT_TEMPLATE_FAILURE = 'GET_BT_TEMPLATE_FAILURE';

export const GET_BT_STATE_CHANGE_INFO = 'GET_BT_STATE_CHANGE_INFO';
export const GET_BT_STATE_CHANGE_INFO_SUCCESS = 'GET_BT_STATE_CHANGE_INFO_SUCCESS';
export const GET_BT_STATE_CHANGE_INFO_FAILURE = 'GET_BT_STATE_CHANGE_INFO_FAILURE';

export const GET_BT_DASHBOARD_INFO = 'GET_BT_DASHBOARD_INFO';
export const GET_BT_DASHBOARD_INFO_SUCCESS = 'GET_BT_DASHBOARD_INFO_SUCCESS';
export const GET_BT_DASHBOARD_INFO_FAILURE = 'GET_BT_DASHBOARD_INFO_FAILURE';

export const GET_BT_CATEGORY = 'GET_BT_CATEGORY';
export const GET_BT_CATEGORY_SUCCESS = 'GET_BT_CATEGORY_SUCCESS';
export const GET_BT_CATEGORY_FAILURE = 'GET_BT_CATEGORY_FAILURE';

export const GET_REPORT_INFO = 'GET_REPORT_INFO';
export const GET_REPORT_INFO_SUCCESS = 'GET_REPORT_INFO_SUCCESS';
export const GET_REPORT_INFO_FAILURE = 'GET_REPORT_INFO_FAILURE';

export const GET_RAISED_INFO = 'GET_RAISED_INFO';
export const GET_RAISED_INFO_SUCCESS = 'GET_RAISED_INFO_SUCCESS';
export const GET_RAISED_INFO_FAILURE = 'GET_RAISED_INFO_FAILURE';

export const GET_INC_SERVICE_INFO = 'GET_INC_SERVICE_INFO';
export const GET_INC_SERVICE_INFO_SUCCESS = 'GET_INC_SERVICE_INFO_SUCCESS';
export const GET_INC_SERVICE_INFO_FAILURE = 'GET_INC_SERVICE_INFO_FAILURE';

export const GET_SERVICE_CAT_INFO = 'GET_SERVICE_CAT_INFO';
export const GET_SERVICE_CAT_INFO_SUCCESS = 'GET_SERVICE_CAT_INFO_SUCCESS';
export const GET_SERVICE_CAT_INFO_FAILURE = 'GET_SERVICE_CAT_INFO_FAILURE';

export const GET_SPACE_INFO = 'GET_SPACE_INFO';
export const GET_SPACE_INFO_SUCCESS = 'GET_SPACE_INFO_SUCCESS';
export const GET_SPACE_INFO_FAILURE = 'GET_SPACE_INFO_FAILURE';

export const GET_EQP_INFO = 'GET_EQP_INFO';
export const GET_EQP_INFO_SUCCESS = 'GET_EQP_INFO_SUCCESS';
export const GET_EQP_INFO_FAILURE = 'GET_EQP_INFO_FAILURE';

export const GET_SERVICE_IMP_INFO = 'GET_SERVICE_IMP_INFO';
export const GET_SERVICE_IMP_INFO_SUCCESS = 'GET_SERVICE_IMP_INFO_SUCCESS';
export const GET_SERVICE_IMP_INFO_FAILURE = 'GET_SERVICE_IMP_INFO_FAILURE';

export const GET_CAT_INFO = 'GET_CAT_INFO';
export const GET_CAT_INFO_SUCCESS = 'GET_CAT_INFO_SUCCESS';
export const GET_CAT_INFO_FAILURE = 'GET_CAT_INFO_FAILURE';

export const GET_BT_CONFIG_INFO = 'GET_BT_CONFIG_INFO';
export const GET_BT_CONFIG_INFO_SUCCESS = 'GET_BT_CONFIG_INFO_SUCCESS';
export const GET_BT_CONFIG_INFO_FAILURE = 'GET_BT_CONFIG_INFO_FAILURE';

export const GET_CLOSURE_DURATION_INFO = 'GET_CLOSURE_DURATION_INFO';
export const GET_CLOSURE_DURATION_INFO_SUCCESS = 'GET_CLOSURE_DURATION_INFO_SUCCESS';
export const GET_CLOSURE_DURATION_INFO_FAILURE = 'GET_CLOSURE_DURATION_INFO_FAILURE';

export const GET_BT_OH_REQUEST_INFO = 'GET_BT_OH_REQUEST_INFO';
export const GET_BT_OH_REQUEST_INFO_SUCCESS = 'GET_BT_OH_REQUEST_INFO_SUCCESS';
export const GET_BT_OH_REQUEST_INFO_FAILURE = 'GET_BT_OH_REQUEST_INFO_FAILURE';

export const GET_BT_OH_APPROVAL_INFO = 'GET_BT_OH_APPROVAL_INFO';
export const GET_BT_OH_APPROVAL_INFO_SUCCESS = 'GET_BT_OH_APPROVAL_INFO_SUCCESS';
export const GET_BT_OH_APPROVAL_INFO_FAILURE = 'GET_BT_OH_APPROVAL_INFO_FAILURE';

export const GET_SET_COMPLIANCE_REINITIATE_INFO = 'GET_SET_COMPLIANCE_REINITIATE_INFO';
export const GET_SET_COMPLIANCE_REINITIATE_INFO_SUCCESS = 'GET_SET_COMPLIANCE_REINITIATE_INFO_SUCCESS';
export const GET_SET_COMPLIANCE_REINITIATE_INFO_FAILURE = 'GET_SET_COMPLIANCE_REINITIATE_INFO_FAILURE';

export function getTrackerListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = complianceColumns && complianceColumns.complianceListFields ? complianceColumns.complianceListFields : [];
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
      types: [GET_BT_INFO, GET_BT_INFO_SUCCESS, GET_BT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_BT_EXPORT_INFO, GET_BT_EXPORT_INFO_SUCCESS, GET_BT_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_BT_COUNT_INFO, GET_BT_COUNT_INFO_SUCCESS, GET_BT_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createTrackerInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_BT_INFO, CREATE_BT_INFO_SUCCESS, CREATE_BT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getTrackerDetails(id, modelName) {
  const fields = '["id","name","raised_on","incident_date","is_on_hold_approval_required","is_on_hold_requested","on_hold_reject_reason","on_hold_requested_command","on_hold_requested_on","on_hold_requested_by","ciriticality","priority","title","description_of_breakdown","is_results_in_statutory_non_compliance","sla_status","is_breakdown_due_to_ageing","is_service_impacted","incident_age","expexted_closure_date","attended_on","action_taken","closed_on","remarks","type","amc_status","vendor_name","complaint_no","vendor_sr_number",("pause_reason_id", ["id", "name"]),("raised_by_id", ["id", "name"]),("service_category_id", ["id", "name"]),("company_id", ["id", "name"]),("state_id", ["id", "name","color_code"]),("space_id", ["id", "name","path_name"]),("equipment_id", ["id", "name",("location_id",["id","name","path_name"])]),"create_date",["services_impacted_ids", ["id","name"]],["message_ids", ["id"]],["escalation_matrix_ids", ["id", "level_date", "level", ("recipients_id", ["id", "name"])]],["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]]]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_BT_DETAILS, GET_BT_DETAILS_SUCCESS, GET_BT_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getActGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["compliance_act","!=",false]]&model=${model}&fields=["compliance_act"]&groupby=["compliance_act"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ACT_GROUP_INFO, GET_ACT_GROUP_INFO_SUCCESS, GET_ACT_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["compliance_category_id","!=",false]]&model=${model}&fields=["compliance_category_id"]&groupby=["compliance_category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORY_GROUP_INFO, GET_CATEGORY_GROUP_INFO_SUCCESS, GET_CATEGORY_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getServiceCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["service_category_id","!=",false]]&model=${model}&fields=["service_category_id"]&groupby=["service_category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SERVICE_CATEGORY_GROUP_INFO, GET_SERVICE_CATEGORY_GROUP_INFO_SUCCESS, GET_SERVICE_CATEGORY_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRaisedByGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["raised_by_id","!=",false]]&model=${model}&fields=["raised_by_id"]&groupby=["raised_by_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_RAISED_GROUP_INFO, GET_RAISED_GROUP_INFO_SUCCESS, GET_RAISED_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStatusByGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["state_id","!=",false]]&model=${model}&fields=["state_id"]&groupby=["state_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ST_GROUP_INFO, GET_ST_GROUP_INFO_SUCCESS, GET_ST_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerTemplates(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BT_TEMPLATE_INFO, GET_BT_TEMPLATE_INFO_SUCCESS, GET_BT_TEMPLATE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerActs(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BT_ACT_INFO, GET_BT_ACT_INFO_SUCCESS, GET_BT_ACT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSubmittedTos(company, model, type, keyword) {
  let payload = 'domain=[';
  if (type && type.length > 0) {
    payload = `${payload}["${type}","=",true]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SUBMITTED_TO_INFO, GET_SUBMITTED_TO_INFO_SUCCESS, GET_SUBMITTED_TO_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerCategorys(company, model, type, keyword) {
  let payload = 'domain=[';
  if (type && type.length > 0) {
    payload = `${payload}["${type}","=",true]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BT_CATEGORY, GET_BT_CATEGORY_SUCCESS, GET_BT_CATEGORY_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerLog(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["log_date","stage","user_id","description"]`;
  payload = `${payload}&limit=100&offset=0&order=log_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BT_LOGS, GET_BT_LOGS_SUCCESS, GET_BT_LOGS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerEvidences(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["evidences_date","version_status","user_id","description","file","id","download_link","file_path","file_name"]`;
  payload = `${payload}&limit=100&offset=0&order=evidences_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BT_EVIDENCE, GET_BT_EVIDENCE_SUCCESS, GET_BT_EVIDENCE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTrackerTemplateDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_BT_TEMPLATE, GET_BT_TEMPLATE_SUCCESS, GET_BT_TEMPLATE_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function complianceStateChangeInfo(id, state, modelName, contex) {
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
      types: [GET_BT_STATE_CHANGE_INFO, GET_BT_STATE_CHANGE_INFO_SUCCESS, GET_BT_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

// eslint-disable-next-line no-unused-vars
export function getTrackerDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: 'dashboard_data?name=Breakdown Tracker',
      types: [GET_BT_DASHBOARD_INFO, GET_BT_DASHBOARD_INFO_SUCCESS, GET_BT_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getTrackerReports(company, model, status, compliance, expiryDate) {
  const fields = '["name",("compliance_id", ["id", "name"]),("compliance_act", ["id", "name"]),("submitted_to", ["id", "name"]),"create_date",["company_ids", ["id","name"]],["asset_ids", ["id","name"]],"state","next_expiry_date",["location_ids", ["id","path_name"]],"applies_to","sla_status",["compliance_log_ids", ["stage","log_date","description",("user_id", ["id","name"])]]]';
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (expiryDate && expiryDate.length > 0) {
    payload = `${payload},["next_expiry_date",">=","${expiryDate[0]}"],["next_expiry_date","<=","${expiryDate[1]}"]`;
  }

  if (compliance && compliance.length > 0) {
    payload = `${payload},["compliance_act","in",[${compliance}]]`;
  }
  if (status) {
    payload = `${payload},["state","=","${status}"]`;
  }

  payload = `${payload}]&model=${model}`;

  payload = `${payload}&fields=${fields}`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_REPORT_INFO, GET_REPORT_INFO_SUCCESS, GET_REPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRaisedLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_RAISED_INFO, GET_RAISED_INFO_SUCCESS, GET_RAISED_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getServiceCategorys(domain, model) {
  const payload = `domain=[${domain}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: 'getServiceCategory',
      types: [GET_SERVICE_CAT_INFO, GET_SERVICE_CAT_INFO_SUCCESS, GET_SERVICE_CAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquipmentLists(company, model, keyword, assetCategory) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (assetCategory) {
    payload = `${payload},["category_id","=",${assetCategory}]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name", "equipment_seq", ("category_id",["id","name"]), ("block_id",["id","space_name"]), ("floor_id",["id","space_name"]), ("location_id",["id","path_name"]), ("maintenance_team_id",["id","name"]), "amc_start_date", "amc_end_date"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EQP_INFO, GET_EQP_INFO_SUCCESS, GET_EQP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getServiceImpacteds(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  // let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SERVICE_IMP_INFO, GET_SERVICE_IMP_INFO_SUCCESS, GET_SERVICE_IMP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAttachmentCategoryLists(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CAT_INFO, GET_CAT_INFO_SUCCESS, GET_CAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBTConfigInfo(id, modelName) {
  const fields = '["id","service_category_access","change_status_on_assets","is_cancel_ppm","is_cancel_ppm_space","is_cancel_inspection","is_cancel_inspection_space","is_edit_expected_closure_date","is_on_hold_approval_required","is_non_compliance","criticality",("on_hold_approval_id",["id","name"]),["additional_fields_ids", ["id","label","value"]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_BT_CONFIG_INFO, GET_BT_CONFIG_INFO_SUCCESS, GET_BT_CONFIG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getClosureDurationInfo(critical, priority, service) {
  let args = `['','${priority}','']`;
  if (service && critical) {
    args = `['${critical}','${priority}','${service}']`;
  } else if (!service && critical) {
    args = `['${critical}','${priority}','']`;
  } else if (service && !critical) {
    args = `['','${priority}','${service}']`;
  }
  const payload = {
    model: 'hx.breakdown_tracker', method: 'find_escalation_policy', context: { is_breakdown: 'True' }, args_new: args,
  };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_CLOSURE_DURATION_INFO, GET_CLOSURE_DURATION_INFO_SUCCESS, GET_CLOSURE_DURATION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getOnHoldRequestInfo(id, result) {
  const formValues = { id, values: result };
  return {
    [CALL_API]: {
      endpoint: 'breakdowntracker/onhold',
      types: [GET_BT_OH_REQUEST_INFO, GET_BT_OH_REQUEST_INFO_SUCCESS, GET_BT_OH_REQUEST_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function onHoldApprovalInfo(id, model, args, method, onHoldRejectRemarks) {
  const payload = {
    ids: `[${id}]`, model, args_new: `['${args}','${onHoldRejectRemarks}']`, method,
  };

  const mName = 'POST';
  const endpoint = 'call';

  return {
    [CALL_API]: {
      endpoint,
      types: [GET_BT_OH_APPROVAL_INFO, GET_BT_OH_APPROVAL_INFO_SUCCESS, GET_BT_OH_APPROVAL_INFO_FAILURE],
      method: mName,
      payload,
    },
  };
}

export function setComplianceReinitiateInfo(id, state, modelName, args, date) {
  let payload = {};
  if (args) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, args_new: `[${args},'${date}']`,
    };
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_SET_COMPLIANCE_REINITIATE_INFO, GET_SET_COMPLIANCE_REINITIATE_INFO_SUCCESS, GET_SET_COMPLIANCE_REINITIATE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
