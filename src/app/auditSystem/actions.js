/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import { AuditSystemModule } from '../util/field';
import fieldsData from './data/customData.json';

export const GET_AUDITS_INFO = 'GET_AUDITS_INFO';
export const GET_AUDITS_INFO_SUCCESS = 'GET_AUDITS_INFO_SUCCESS';
export const GET_AUDITS_INFO_FAILURE = 'GET_AUDITS_INFO_FAILURE';

export const GET_AUDITS_EXPORT_LIST_INFO = 'GET_AUDITS_EXPORT_LIST_INFO';
export const GET_AUDITS_EXPORT_LIST_INFO_SUCCESS = 'GET_AUDITS_EXPORT_LIST_INFO_SUCCESS';
export const GET_AUDITS_EXPORT_LIST_INFO_FAILURE = 'GET_AUDITS_EXPORT_LIST_INFO_FAILURE';

export const GET_AUDITS_COUNT_INFO = 'GET_AUDITS_COUNT_INFO';
export const GET_AUDITS_COUNT_INFO_SUCCESS = 'GET_AUDITS_COUNT_INFO_SUCCESS';
export const GET_AUDITS_COUNT_INFO_FAILURE = 'GET_AUDITS_COUNT_INFO_FAILURE';

export const GET_AUDIT_DETAILS_INFO = 'GET_AUDIT_DETAILS_INFO';
export const GET_AUDIT_DETAILS_INFO_SUCCESS = 'GET_AUDIT_DETAILS_INFO_SUCCESS';
export const GET_AUDIT_DETAILS_INFO_FAILURE = 'GET_AUDIT_DETAILS_INFO_FAILURE';

export const GET_SYSTEM_GROUP_INFO = 'GET_SYSTEM_GROUP_INFO';
export const GET_SYSTEM_GROUP_INFO_SUCCESS = 'GET_SYSTEM_GROUP_INFO_SUCCESS';
export const GET_SYSTEM_GROUP_INFO_FAILURE = 'GET_SYSTEM_GROUP_INFO_FAILURE';

export const GET_STATUS_GROUP_INFO = 'GET_STATUS_GROUP_INFO';
export const GET_STATUS_GROUP_INFO_SUCCESS = 'GET_STATUS_GROUP_INFO_SUCCESS';
export const GET_STATUS_GROUP_INFO_FAILURE = 'GET_STATUS_GROUP_INFO_FAILURE';

export const GET_AUDIT_DASHBOARD_INFO = 'GET_AUDIT_DASHBOARD_INFO';
export const GET_AUDIT_DASHBOARD_INFO_SUCCESS = 'GET_AUDIT_DASHBOARD_INFO_SUCCESS';
export const GET_AUDIT_DASHBOARD_INFO_FAILURE = 'GET_AUDIT_DASHBOARD_INFO_FAILURE';

export const GET_NC_INFO = 'GET_NC_INFO';
export const GET_NC_INFO_SUCCESS = 'GET_NC_INFO_SUCCESS';
export const GET_NC_INFO_FAILURE = 'GET_NC_INFO_FAILURE';

export const GET_NC_EXPORT_LIST_INFO = 'GET_NC_EXPORT_LIST_INFO';
export const GET_NC_EXPORT_LIST_INFO_SUCCESS = 'GET_NC_EXPORT_LIST_INFO_SUCCESS';
export const GET_NC_EXPORT_LIST_INFO_FAILURE = 'GET_NC_EXPORT_LIST_INFO_FAILURE';

export const GET_NC_COUNT_INFO = 'GET_NC_COUNT_INFO';
export const GET_NC_COUNT_INFO_SUCCESS = 'GET_NC_COUNT_INFO_SUCCESS';
export const GET_NC_COUNT_INFO_FAILURE = 'GET_NC_COUNT_INFO_FAILURE';

export const GET_NC_DETAILS_INFO = 'GET_NC_DETAILS_INFO';
export const GET_NC_DETAILS_INFO_SUCCESS = 'GET_NC_DETAILS_INFO_SUCCESS';
export const GET_NC_DETAILS_INFO_FAILURE = 'GET_NC_DETAILS_INFO_FAILURE';

export const GET_AUDIT_ACTION_INFO = 'GET_AUDIT_ACTION_INFO';
export const GET_AUDIT_ACTION_INFO_SUCCESS = 'GET_AUDIT_ACTION_INFO_SUCCESS';
export const GET_AUDIT_ACTION_INFO_FAILURE = 'GET_AUDIT_ACTION_INFO_FAILURE';

export const GET_OPPORTUNITIES_INFO = 'GET_OPPORTUNITIES_INFO';
export const GET_OPPORTUNITIES_INFO_SUCCESS = 'GET_OPPORTUNITIES_INFO_SUCCESS';
export const GET_OPPORTUNITIES_INFO_FAILURE = 'GET_OPPORTUNITIES_INFO_FAILURE';

export const GET_OPPORTUNITIES_COUNT_INFO = 'GET_OPPORTUNITIES_COUNT_INFO';
export const GET_OPPORTUNITIES_COUNT_INFO_SUCCESS = 'GET_OPPORTUNITIES_COUNT_INFO_SUCCESS';
export const GET_OPPORTUNITIES_COUNT_INFO_FAILURE = 'GET_OPPORTUNITIES_COUNT_INFO_FAILURE';

export const GET_OPPORTUNITIES_DETAILS_INFO = 'GET_OPPORTUNITIES_DETAILS_INFO';
export const GET_OPPORTUNITIES_DETAILS_INFO_SUCCESS = 'GET_OPPORTUNITIES_DETAILS_INFO_SUCCESS';
export const GET_OPPORTUNITIES_DETAILS_INFO_FAILURE = 'GET_OPPORTUNITIES_DETAILS_INFO_FAILURE';

export const GET_STAGE_GROUP_INFO = 'GET_STAGE_GROUP_INFO';
export const GET_STAGE_GROUP_INFO_SUCCESS = 'GET_STAGE_GROUP_INFO_SUCCESS';
export const GET_STAGE_GROUP_INFO_FAILURE = 'GET_STAGE_GROUP_INFO_FAILURE';

export const GET_SA_INFO = 'GET_SA_INFO';
export const GET_SA_INFO_SUCCESS = 'GET_SA_INFO_SUCCESS';
export const GET_SA_INFO_FAILURE = 'GET_SA_INFO_FAILURE';

export const GET_TM_INFO = 'GET_TM_INFO';
export const GET_TM_INFO_SUCCESS = 'GET_TM_INFO_SUCCESS';
export const GET_TM_INFO_FAILURE = 'GET_TM_INFO_FAILURE';

export const GET_AUDIT_ASSESSMENTS_INFO = 'GET_AUDIT_ASSESSMENTS_INFO';
export const GET_AUDIT_ASSESSMENTS_INFO_SUCCESS = 'GET_AUDIT_ASSESSMENTS_INFO_SUCCESS';
export const GET_AUDIT_ASSESSMENTS_INFO_FAILURE = 'GET_AUDIT_ASSESSMENTS_INFO_FAILURE';

export const GET_AUDIT_ACTIONS_INFO = 'GET_AUDIT_ACTIONS_INFO';
export const GET_AUDIT_ACTIONS_INFO_SUCCESS = 'GET_AUDIT_ACTIONS_INFO_SUCCESS';
export const GET_AUDIT_ACTIONS_INFO_FAILURE = 'GET_AUDIT_ACTIONS_INFO_FAILURE';

export const UPDATE_AUDIT_ACTION_INFO = 'UPDATE_AUDIT_ACTION_INFO';
export const UPDATE_AUDIT_ACTION_INFO_SUCCESS = 'UPDATE_AUDIT_ACTION_INFO_SUCCESS';
export const UPDATE_AUDIT_ACTION_INFO_FAILURE = 'UPDATE_AUDIT_ACTION_INFO_FAILURE';

export function getNonConformitiesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = AuditSystemModule.actionApiFields;

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
      types: [GET_NC_INFO, GET_NC_INFO_SUCCESS, GET_NC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNonConformitieExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_NC_EXPORT_LIST_INFO, GET_NC_EXPORT_LIST_INFO_SUCCESS, GET_NC_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNonConformitieCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_NC_COUNT_INFO, GET_NC_COUNT_INFO_SUCCESS, GET_NC_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNonConformitieDetailsInfo(id, modelName) {
  const fields = '["id","name","date_deadline","type_action","description","state",("audit_id", ["id", "name"]),("user_id", ["id", "name"]),"create_date",("helpdesk_id", ["id", "ticket_number"]),("company_id", ["id", "name"])]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_NC_DETAILS_INFO, GET_NC_DETAILS_INFO_SUCCESS, GET_NC_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditsInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = fieldsData && fieldsData.listFields ? fieldsData.listFields : [];

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
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AUDITS_INFO, GET_AUDITS_INFO_SUCCESS, GET_AUDITS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_AUDITS_EXPORT_LIST_INFO, GET_AUDITS_EXPORT_LIST_INFO_SUCCESS, GET_AUDITS_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_AUDITS_COUNT_INFO, GET_AUDITS_COUNT_INFO_SUCCESS, GET_AUDITS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditDetailsInfo(id, modelName) {
  const fields = '["id","name","date","uuid","reference","auto_create_tickets_from_action","state","auditor_designation","auditor_contact","auditor_email","facility_manager_contact","facility_manager_email",("category_id", ["id", "name"]),("sub_category_id", ["id", "name"]),("sys_auditor_id", ["id", "name"]),("facility_manager_id", ["id", "name"]),("company_id", ["id", "name"]),("space_id", ["id", "name", "path_name",("asset_category_id", ["id", "name"])]),("audit_system_id", ["id","display_name","description","question_name","question_description","requires_verification_by_otp","has_reviwer_email","has_reviwer_name","has_reviwer_mobile","feedback_text","successful_homepage_return_time","survey_time","uuid",["page_ids", ["id", "title", ["question_ids", ["id","sequence","question_description","max_score","question","type","max_score","constr_mandatory","comments_allowed","constr_error_msg","validation_required","validation_length_min","validation_min_date","validation_max_date","validation_min_float_value","validation_max_float_value","validation_length_max","validation_error_msg",["labels_ids", ["id","value","favicon","color","emoji","quizz_mark"]]]]]]])]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_AUDIT_DETAILS_INFO, GET_AUDIT_DETAILS_INFO_SUCCESS, GET_AUDIT_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSystemGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["audit_system_id"]&groupby=["audit_system_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SYSTEM_GROUP_INFO, GET_SYSTEM_GROUP_INFO_SUCCESS, GET_SYSTEM_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStatusGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["audit_id"]&groupby=["audit_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_STATUS_GROUP_INFO, GET_STATUS_GROUP_INFO_SUCCESS, GET_STATUS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Audit System`,
      types: [GET_AUDIT_DASHBOARD_INFO, GET_AUDIT_DASHBOARD_INFO_SUCCESS, GET_AUDIT_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getOpportunitiesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  const fields = fieldsData && fieldsData.listFields ? fieldsData.listFields : [];

  let payload = `domain=[["company_id","in",[${company}]]`;

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
      types: [GET_OPPORTUNITIES_INFO, GET_OPPORTUNITIES_INFO_SUCCESS, GET_OPPORTUNITIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOpportunitiesCountInfo(company, model, customFilters, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

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
      types: [GET_OPPORTUNITIES_COUNT_INFO, GET_OPPORTUNITIES_COUNT_INFO_SUCCESS, GET_OPPORTUNITIES_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOpportunitiesDetailsInfo(id, modelName) {
  const fields = '["name","reference","type_action",("user_id", ["id", "name"]),"date_deadline",("stage_id", ["id", "name"]),("company_id", ["id", "name"]),"sequence","create_date",("system_id", ["id", "name"]),["non_conformity_ids", ["id","ref","create_date","description",("partner_id", ["id", "name"]),("user_id", ["id", "name"]),("responsible_user_id", ["id", "name"]),("manager_user_id", ["id", "name"]),("system_id", ["id", "name"]),("company_id", ["id", "name"]),("stage_id", ["id", "name"])]]]';
  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_OPPORTUNITIES_DETAILS_INFO, GET_OPPORTUNITIES_DETAILS_INFO_SUCCESS, GET_OPPORTUNITIES_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditActionInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args = data;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_AUDIT_ACTION_INFO, GET_AUDIT_ACTION_INFO_SUCCESS, GET_AUDIT_ACTION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getSystemAudits(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["title","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["title"]&limit=20&offset=0&order=title ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SA_INFO, GET_SA_INFO_SUCCESS, GET_SA_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamMembers(company, model, keyword) {
  const fields = '["id", "name","email","phone_number"]';

  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TM_INFO, GET_TM_INFO_SUCCESS, GET_TM_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditAssessmentsInfo(id, modelName) {
  const fields = '["id","quizz_score",["user_input_line_ids", ["id",("page_id", ["id", "title"]),("question_id", ["id", "question", "question_description"]),"answer_type","quizz_mark",("value_suggested", ["id", "value"]),"value_text","value_number","value_date","value_free_text","remarks"]]]';
  const payload = `["audit_id","=",${id}],["state","=","done"]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}&offset=0&limit=1&order=id DESC`,
      types: [GET_AUDIT_ASSESSMENTS_INFO, GET_AUDIT_ASSESSMENTS_INFO_SUCCESS, GET_AUDIT_ASSESSMENTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditActionsInfo(id, modelName) {
  const fields = '["id","type_action","auto_create_tickets_from_action","state","name",("category_id", ["id", "name"]),("sub_category_id", ["id", "name"]),("space_id", ["id", "name", "path_name",("asset_category_id", ["id", "name"])]),("user_id", ["id", "name"]),"date_deadline",("helpdesk_id", ["id", "ticket_number"])]';
  const payload = `["audit_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_AUDIT_ACTIONS_INFO, GET_AUDIT_ACTIONS_INFO_SUCCESS, GET_AUDIT_ACTIONS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateAuditActionInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_AUDIT_ACTION_INFO, UPDATE_AUDIT_ACTION_INFO_SUCCESS, UPDATE_AUDIT_ACTION_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
