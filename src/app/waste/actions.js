/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import { WasteModule } from '../util/field';

export const GET_COMPLIANCE_INFO = 'GET_COMPLIANCE_INFO';
export const GET_COMPLIANCE_INFO_SUCCESS = 'GET_COMPLIANCE_INFO_SUCCESS';
export const GET_COMPLIANCE_INFO_FAILURE = 'GET_COMPLIANCE_INFO_FAILURE';

export const GET_COMPLIANCE_COUNT_INFO = 'GET_COMPLIANCE_COUNT_INFO';
export const GET_COMPLIANCE_COUNT_INFO_SUCCESS = 'GET_COMPLIANCE_COUNT_INFO_SUCCESS';
export const GET_COMPLIANCE_COUNT_INFO_FAILURE = 'GET_COMPLIANCE_COUNT_INFO_FAILURE';

export const GET_ACT_GROUP_INFO = 'GET_ACT_GROUP_INFO';
export const GET_ACT_GROUP_INFO_SUCCESS = 'GET_ACT_GROUP_INFO_SUCCESS';
export const GET_ACT_GROUP_INFO_FAILURE = 'GET_ACT_GROUP_INFO_FAILURE';

export const GET_CATEGORY_GROUP_INFO = 'GET_CATEGORY_GROUP_INFO';
export const GET_CATEGORY_GROUP_INFO_SUCCESS = 'GET_CATEGORY_GROUP_INFO_SUCCESS';
export const GET_CATEGORY_GROUP_INFO_FAILURE = 'GET_CATEGORY_GROUP_INFO_FAILURE';

export const CREATE_COMPLIANCE_INFO = 'CREATE_COMPLIANCE_INFO';
export const CREATE_COMPLIANCE_INFO_SUCCESS = 'CREATE_COMPLIANCE_INFO_SUCCESS';
export const CREATE_COMPLIANCE_INFO_FAILURE = 'CREATE_COMPLIANCE_INFO_FAILURE';

export const GET_COMPLIANCE_DETAILS = 'GET_COMPLIANCE_DETAILS';
export const GET_COMPLIANCE_DETAILS_SUCCESS = 'GET_COMPLIANCE_DETAILS_SUCCESS';
export const GET_COMPLIANCE_DETAILS_FAILURE = 'GET_COMPLIANCE_DETAILS_FAILURE';

export const GET_COMPLIANCE_EXPORT_INFO = 'GET_COMPLIANCE_EXPORT_INFO';
export const GET_COMPLIANCE_EXPORT_INFO_SUCCESS = 'GET_COMPLIANCE_EXPORT_INFO_SUCCESS';
export const GET_COMPLIANCE_EXPORT_INFO_FAILURE = 'GET_COMPLIANCE_EXPORT_INFO_FAILURE';

export const GET_COMPLIANCE_TEMPLATE_INFO = 'GET_COMPLIANCE_TEMPLATE_INFO';
export const GET_COMPLIANCE_TEMPLATE_INFO_SUCCESS = 'GET_COMPLIANCE_TEMPLATE_INFO_SUCCESS';
export const GET_COMPLIANCE_TEMPLATE_INFO_FAILURE = 'GET_COMPLIANCE_TEMPLATE_INFO_FAILURE';

export const GET_COMPLIANCE_ACT_INFO = 'GET_COMPLIANCE_ACT_INFO';
export const GET_COMPLIANCE_ACT_INFO_SUCCESS = 'GET_COMPLIANCE_ACT_INFO_SUCCESS';
export const GET_COMPLIANCE_ACT_INFO_FAILURE = 'GET_COMPLIANCE_ACT_INFO_FAILURE';

export const GET_COMPLIANCE_EVIDENCE = 'GET_COMPLIANCE_EVIDENCE';
export const GET_COMPLIANCE_EVIDENCE_SUCCESS = 'GET_COMPLIANCE_EVIDENCE_SUCCESS';
export const GET_COMPLIANCE_EVIDENCE_FAILURE = 'GET_COMPLIANCE_EVIDENCE_FAILURE';

export const GET_SUBMITTED_TO_INFO = 'GET_SUBMITTED_TO_INFO';
export const GET_SUBMITTED_TO_INFO_SUCCESS = 'GET_SUBMITTED_TO_INFO_SUCCESS';
export const GET_SUBMITTED_TO_INFO_FAILURE = 'GET_SUBMITTED_TO_INFO_FAILURE';

export const GET_COMPLIANCE_LOGS = 'GET_COMPLIANCE_LOGS';
export const GET_COMPLIANCE_LOGS_SUCCESS = 'GET_COMPLIANCE_LOGS_SUCCESS';
export const GET_COMPLIANCE_LOGS_FAILURE = 'GET_COMPLIANCE_LOGS_FAILURE';

export const GET_COMPLIANCE_TEMPLATE = 'GET_COMPLIANCE_TEMPLATE';
export const GET_COMPLIANCE_TEMPLATE_SUCCESS = 'GET_COMPLIANCE_TEMPLATE_SUCCESS';
export const GET_COMPLIANCE_TEMPLATE_FAILURE = 'GET_COMPLIANCE_TEMPLATE_FAILURE';

export const GET_COMPLIANCE_STATE_CHANGE_INFO = 'GET_COMPLIANCE_STATE_CHANGE_INFO';
export const GET_COMPLIANCE_STATE_CHANGE_INFO_SUCCESS = 'GET_COMPLIANCE_STATE_CHANGE_INFO_SUCCESS';
export const GET_COMPLIANCE_STATE_CHANGE_INFO_FAILURE = 'GET_COMPLIANCE_STATE_CHANGE_INFO_FAILURE';

export const GET_COMPLIANCE_DASHBOARD_INFO = 'GET_COMPLIANCE_DASHBOARD_INFO';
export const GET_COMPLIANCE_DASHBOARD_INFO_SUCCESS = 'GET_COMPLIANCE_DASHBOARD_INFO_SUCCESS';
export const GET_COMPLIANCE_DASHBOARD_INFO_FAILURE = 'GET_COMPLIANCE_DASHBOARD_INFO_FAILURE';

export const GET_COMPLIANCE_CATEGORY = 'GET_COMPLIANCE_CATEGORY';
export const GET_COMPLIANCE_CATEGORY_SUCCESS = 'GET_COMPLIANCE_CATEGORY_SUCCESS';
export const GET_COMPLIANCE_CATEGORY_FAILURE = 'GET_COMPLIANCE_CATEGORY_FAILURE';

export const GET_REPORT_INFO = 'GET_REPORT_INFO';
export const GET_REPORT_INFO_SUCCESS = 'GET_REPORT_INFO_SUCCESS';
export const GET_REPORT_INFO_FAILURE = 'GET_REPORT_INFO_FAILURE';

export const GET_WASTE_REPORTS_INFO = 'GET_WASTE_REPORTS_INFO';
export const GET_WASTE_REPORTS_INFO_SUCCESS = 'GET_WASTE_REPORTS_INFO_SUCCESS';
export const GET_WASTE_REPORTS_INFO_FAILURE = 'GET_WASTE_REPORTS_INFO_FAILURE';

export function getComplianceListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = WasteModule.buildingApiFields;
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
      types: [GET_COMPLIANCE_INFO, GET_COMPLIANCE_INFO_SUCCESS, GET_COMPLIANCE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
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
      types: [GET_COMPLIANCE_EXPORT_INFO, GET_COMPLIANCE_EXPORT_INFO_SUCCESS, GET_COMPLIANCE_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_COMPLIANCE_COUNT_INFO, GET_COMPLIANCE_COUNT_INFO_SUCCESS, GET_COMPLIANCE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createComplianceInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_COMPLIANCE_INFO, CREATE_COMPLIANCE_INFO_SUCCESS, CREATE_COMPLIANCE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getComplianceDetails(id, modelName) {
  const fields = '["id","name","operation","vendor","tenant","carried_by","security_by","accompanied_by","weight","logged_on",("type",["id","name"])]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_COMPLIANCE_DETAILS, GET_COMPLIANCE_DETAILS_SUCCESS, GET_COMPLIANCE_DETAILS_FAILURE],
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

export function getComplianceTemplates(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPLIANCE_TEMPLATE_INFO, GET_COMPLIANCE_TEMPLATE_INFO_SUCCESS, GET_COMPLIANCE_TEMPLATE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceActs(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPLIANCE_ACT_INFO, GET_COMPLIANCE_ACT_INFO_SUCCESS, GET_COMPLIANCE_ACT_INFO_FAILURE],
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

export function getComplianceCategorys(company, model, type, keyword) {
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
      types: [GET_COMPLIANCE_CATEGORY, GET_COMPLIANCE_CATEGORY_SUCCESS, GET_COMPLIANCE_CATEGORY_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceLog(id, modelName) {
  const fields = '["id","waste_type_access_level","has_security_by","has_carried_by","has_accompanied_by","configuration_json"]';

  const payload = `["company_id","=",${id}]`;
  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_COMPLIANCE_LOGS, GET_COMPLIANCE_LOGS_SUCCESS, GET_COMPLIANCE_LOGS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceEvidences(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["evidences_date","version_status","user_id","description","file","id","download_link","file_path","file_name"]`;
  payload = `${payload}&limit=100&offset=0&order=evidences_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPLIANCE_EVIDENCE, GET_COMPLIANCE_EVIDENCE_SUCCESS, GET_COMPLIANCE_EVIDENCE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getComplianceTemplateDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_COMPLIANCE_TEMPLATE, GET_COMPLIANCE_TEMPLATE_SUCCESS, GET_COMPLIANCE_TEMPLATE_FAILURE],
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
      types: [GET_COMPLIANCE_STATE_CHANGE_INFO, GET_COMPLIANCE_STATE_CHANGE_INFO_SUCCESS, GET_COMPLIANCE_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

// eslint-disable-next-line no-unused-vars
export function getComplianceDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: 'dashboard_data?name=Building Compliance',
      types: [GET_COMPLIANCE_DASHBOARD_INFO, GET_COMPLIANCE_DASHBOARD_INFO_SUCCESS, GET_COMPLIANCE_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getComplianceReports(company, model, status, compliance, expiryDate) {
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

export function getWasteReportsInfo(company, model, fields, customFilters, sortByValue, sortFieldValue) {
  let conditions = `[["company_id","in",[${company}]]`;
  if (customFilters && customFilters.length > 0) {
    conditions = `${conditions},${customFilters}`;
  }
  const payload = {
    domain: `${conditions}]`, model, fields: JSON.stringify(fields), offset: 0,
  };

  if (sortByValue && sortFieldValue) {
    payload.order = `${sortFieldValue} ${sortByValue}`;
  }

  const endPointName = 'isearch_read';
  const requestMethod = 'POST';

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_WASTE_REPORTS_INFO, GET_WASTE_REPORTS_INFO_SUCCESS, GET_WASTE_REPORTS_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}
