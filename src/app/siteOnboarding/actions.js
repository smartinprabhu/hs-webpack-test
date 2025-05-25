/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import siteColumns from './data/customData.json';
import fieldsDataConfig from './siteDetails/helpdesk/data/customData.json';
import fieldsDataConfigAsset from './siteDetails/asset/data/customData.json';

export const GET_SITE_INFO = 'GET_SITE_INFO';
export const GET_SITE_INFO_SUCCESS = 'GET_SITE_INFO_SUCCESS';
export const GET_SITE_INFO_FAILURE = 'GET_SITE_INFO_FAILURE';

export const GET_SITE_COUNT_INFO = 'GET_SITE_COUNT_INFO';
export const GET_SITE_COUNT_INFO_SUCCESS = 'GET_SITE_COUNT_INFO_SUCCESS';
export const GET_SITE_COUNT_INFO_FAILURE = 'GET_SITE_COUNT_INFO_FAILURE';

export const GET_CODE_GROUP_INFO = 'GET_CODE_GROUP_INFO';
export const GET_CODE_GROUP_INFO_SUCCESS = 'GET_CODE_GROUP_INFO_SUCCESS';
export const GET_CODE_GROUP_INFO_FAILURE = 'GET_CODE_GROUP_INFO_FAILURE';

export const GET_PS_GROUP_INFO = 'GET_PS_GROUP_INFO';
export const GET_PS_GROUP_INFO_SUCCESS = 'GET_PS_GROUP_INFO_SUCCESS';
export const GET_PS_GROUP_INFO_FAILURE = 'GET_PS_GROUP_INFO_FAILURE';

export const GET_CATEGORY_GROUP_INFO = 'GET_CATEGORY_GROUP_INFO';
export const GET_CATEGORY_GROUP_INFO_SUCCESS = 'GET_CATEGORY_GROUP_INFO_SUCCESS';
export const GET_CATEGORY_GROUP_INFO_FAILURE = 'GET_CATEGORY_GROUP_INFO_FAILURE';

export const CREATE_SITE_INFO = 'CREATE_SITE_INFO';
export const CREATE_SITE_INFO_SUCCESS = 'CREATE_SITE_INFO_SUCCESS';
export const CREATE_SITE_INFO_FAILURE = 'CREATE_SITE_INFO_FAILURE';

export const UPDATE_SITE_INFO = 'UPDATE_SITE_INFO';
export const UPDATE_SITE_INFO_SUCCESS = 'UPDATE_SITE_INFO_SUCCESS';
export const UPDATE_SITE_INFO_FAILURE = 'UPDATE_SITE_INFO_FAILURE';

export const UPDATE_CONFIG_INFO = 'UPDATE_CONFIG_INFO';
export const UPDATE_CONFIG_INFO_SUCCESS = 'UPDATE_CONFIG_INFO_SUCCESS';
export const UPDATE_CONFIG_INFO_FAILURE = 'UPDATE_CONFIG_INFO_FAILURE';

export const GET_SITE_DETAILS = 'GET_SITE_DETAILS';
export const GET_SITE_DETAILS_SUCCESS = 'GET_SITE_DETAILS_SUCCESS';
export const GET_SITE_DETAILS_FAILURE = 'GET_SITE_DETAILS_FAILURE';

export const GET_SITE_EXPORT_INFO = 'GET_SITE_EXPORT_INFO';
export const GET_SITE_EXPORT_INFO_SUCCESS = 'GET_SITE_EXPORT_INFO_SUCCESS';
export const GET_SITE_EXPORT_INFO_FAILURE = 'GET_SITE_EXPORT_INFO_FAILURE';

export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'GET_USER_INFO_FAILURE';

export const GET_ALLOWED_MODULE_INFO = 'GET_ALLOWED_MODULE_INFO';
export const GET_ALLOWED_MODULE_INFO_SUCCESS = 'GET_ALLOWED_MODULE_INFO_SUCCESS';
export const GET_ALLOWED_MODULE_INFO_FAILURE = 'GET_ALLOWED_MODULE_INFO_FAILURE';

export const GET_TC_INFO = 'GET_TC_INFO';
export const GET_TC_INFO_SUCCESS = 'GET_TC_INFO_SUCCESS';
export const GET_TC_INFO_FAILURE = 'GET_TC_INFO_FAILURE';

export const GET_AG_INFO = 'GET_AG_INFO';
export const GET_AG_INFO_SUCCESS = 'GET_AG_INFO_SUCCESS';
export const GET_AG_INFO_FAILURE = 'GET_AG_INFO_FAILURE';

export const GET_VT_INFO = 'GET_VT_INFO';
export const GET_VT_INFO_SUCCESS = 'GET_VT_INFO_SUCCESS';
export const GET_VT_INFO_FAILURE = 'GET_VT_INFO_FAILURE';

export const GET_ASSET_INFO = 'GET_ASSET_INFO';
export const GET_ASSET_INFO_SUCCESS = 'GET_ASSET_INFO_SUCCESS';
export const GET_ASSET_INFO_FAILURE = 'GET_ASSET_INFO_FAILURE';

export const GET_LB_INFO = 'GET_LB_INFO';
export const GET_LB_INFO_SUCCESS = 'GET_LB_INFO_SUCCESS';
export const GET_LB_INFO_FAILURE = 'GET_LB_INFO_FAILURE';

export const GET_COPY_MODULE = 'GET_COPY_MODULE';
export const GET_COPY_MODULE_SUCCESS = 'GET_COPY_MODULE_SUCCESS';
export const GET_COPY_MODULE_FAILURE = 'GET_COPY_MODULE_FAILURE';

export const GET_SITE_DASHBOARD_INFO = 'GET_SITE_DASHBOARD_INFO';
export const GET_SITE_DASHBOARD_INFO_SUCCESS = 'GET_SITE_DASHBOARD_INFO_SUCCESS';
export const GET_SITE_DASHBOARD_INFO_FAILURE = 'GET_SITE_DASHBOARD_INFO_FAILURE';

export const GET_SITE_CATEGORY = 'GET_SITE_CATEGORY';
export const GET_SITE_CATEGORY_SUCCESS = 'GET_SITE_CATEGORY_SUCCESS';
export const GET_SITE_CATEGORY_FAILURE = 'GET_SITE_CATEGORY_FAILURE';

export const GET_PRODUCT_COMPANY = 'GET_PRODUCT_COMPANY';
export const GET_PRODUCT_COMPANY_SUCCESS = 'GET_PRODUCT_COMPANY_SUCCESS';
export const GET_PRODUCT_COMPANY_FAILURE = 'GET_PRODUCT_COMPANY_FAILURE';

export const GET_COMPANY_INFO = 'GET_COMPANY_INFO';
export const GET_COMPANY_INFO_SUCCESS = 'GET_COMPANY_INFO_SUCCESS';
export const GET_COMPANY_INFO_FAILURE = 'GET_COMPANY_INFO_FAILURE';

export const GET_PC_LIST_INFO = 'GET_PC_LIST_INFO';
export const GET_PC_LIST_INFO_SUCCESS = 'GET_PC_LIST_INFO_SUCCESS';
export const GET_PC_LIST_INFO_FAILURE = 'GET_PC_LIST_INFO_FAILURE';

export const GET_PC_COUNT_INFO = 'GET_PC_COUNT_INFO';
export const GET_PC_COUNT_INFO_SUCCESS = 'GET_PC_COUNT_INFO_SUCCESS';
export const GET_PC_COUNT_INFO_FAILURE = 'GET_PC_COUNT_INFO_FAILURE';

export const GET_PC_EXPORT_LIST_INFO = 'GET_PC_EXPORT_LIST_INFO';
export const GET_PC_EXPORT_LIST_INFO_SUCCESS = 'GET_PC_EXPORT_LIST_INFO_SUCCESS';
export const GET_PC_EXPORT_LIST_INFO_FAILURE = 'GET_PC_EXPORT_LIST_INFO_FAILURE';

export const GET_PC_INFO = 'GET_PC_INFO';
export const GET_PC_INFO_SUCCESS = 'GET_PC_INFO_SUCCESS';
export const GET_PC_INFO_FAILURE = 'GET_PC_INFO_FAILURE';

export const GET_PCG_LIST_INFO = 'GET_PCG_LIST_INFO';
export const GET_PCG_LIST_INFO_SUCCESS = 'GET_PCG_LIST_INFO_SUCCESS';
export const GET_PCG_LIST_INFO_FAILURE = 'GET_PCG_LIST_INFO_FAILURE';

export const GET_PCG_COUNT_INFO = 'GET_PCG_COUNT_INFO';
export const GET_PCG_COUNT_INFO_SUCCESS = 'GET_PCG_COUNT_INFO_SUCCESS';
export const GET_PCG_COUNT_INFO_FAILURE = 'GET_PCG_COUNT_INFO_FAILURE';

export const GET_PCG_EXPORT_LIST_INFO = 'GET_PCG_EXPORT_LIST_INFO';
export const GET_PCG_EXPORT_LIST_INFO_SUCCESS = 'GET_PCG_EXPORT_LIST_INFO_SUCCESS';
export const GET_PCG_EXPORT_LIST_INFO_FAILURE = 'GET_PCG_EXPORT_LIST_INFO_FAILURE';

export const GET_PCG_INFO = 'GET_PCG_INFO';
export const GET_PCG_INFO_SUCCESS = 'GET_PCG_INFO_SUCCESS';
export const GET_PCG_INFO_FAILURE = 'GET_PCG_INFO_FAILURE';

export const GET_SC_LIST_INFO = 'GET_SC_LIST_INFO';
export const GET_SC_LIST_INFO_SUCCESS = 'GET_SC_LIST_INFO_SUCCESS';
export const GET_SC_LIST_INFO_FAILURE = 'GET_SC_LIST_INFO_FAILURE';

export const GET_SC_COUNT_INFO = 'GET_SC_COUNT_INFO';
export const GET_SC_COUNT_INFO_SUCCESS = 'GET_SC_COUNT_INFO_SUCCESS';
export const GET_SC_COUNT_INFO_FAILURE = 'GET_SC_COUNT_INFO_FAILURE';

export const GET_SC_EXPORT_LIST_INFO = 'GET_SC_EXPORT_LIST_INFO';
export const GET_SC_EXPORT_LIST_INFO_SUCCESS = 'GET_SC_EXPORT_LIST_INFO_SUCCESS';
export const GET_SC_EXPORT_LIST_INFO_FAILURE = 'GET_SC_EXPORT_LIST_INFO_FAILURE';

export const GET_SC_INFO = 'GET_SC_INFO';
export const GET_SC_INFO_SUCCESS = 'GET_SC_INFO_SUCCESS';
export const GET_SC_INFO_FAILURE = 'GET_SC_INFO_FAILURE';

export const GET_AC_LIST_INFO = 'GET_AC_LIST_INFO';
export const GET_AC_LIST_INFO_SUCCESS = 'GET_AC_LIST_INFO_SUCCESS';
export const GET_AC_LIST_INFO_FAILURE = 'GET_AC_LIST_INFO_FAILURE';

export const GET_AC_COUNT_INFO = 'GET_AC_COUNT_INFO';
export const GET_AC_COUNT_INFO_SUCCESS = 'GET_AC_COUNT_INFO_SUCCESS';
export const GET_AC_COUNT_INFO_FAILURE = 'GET_AC_COUNT_INFO_FAILURE';

export const GET_AC_EXPORT_LIST_INFO = 'GET_AC_EXPORT_LIST_INFO';
export const GET_AC_EXPORT_LIST_INFO_SUCCESS = 'GET_AC_EXPORT_LIST_INFO_SUCCESS';
export const GET_AC_EXPORT_LIST_INFO_FAILURE = 'GET_AC_EXPORT_LIST_INFO_FAILURE';

export const GET_AC_INFO = 'GET_AC_INFO';
export const GET_AC_INFO_SUCCESS = 'GET_AC_INFO_SUCCESS';
export const GET_AC_INFO_FAILURE = 'GET_AC_INFO_FAILURE';

export const GET_HS_DETAILS_INFO = 'GET_HS_DETAILS_INFO';
export const GET_HS_DETAILS_INFO_SUCCESS = 'GET_HS_DETAILS_INFO_SUCCESS';
export const GET_HS_DETAILS_INFO_FAILURE = 'GET_HS_DETAILS_INFO_FAILURE';

export const GET_AUDIT_DETAILS_INFO = 'GET_AUDIT_DETAILS_INFO';
export const GET_AUDIT_DETAILS_INFO_SUCCESS = 'GET_AUDIT_DETAILS_INFO_SUCCESS';
export const GET_AUDIT_DETAILS_INFO_FAILURE = 'GET_AUDIT_DETAILS_INFO_FAILURE';

export const GET_WS_DETAILS_INFO = 'GET_WS_DETAILS_INFO';
export const GET_WS_DETAILS_INFO_SUCCESS = 'GET_WS_DETAILS_INFO_SUCCESS';
export const GET_WS_DETAILS_INFO_FAILURE = 'GET_WS_DETAILS_INFO_FAILURE';

export const GET_INV_DETAILS_INFO = 'GET_INV_DETAILS_INFO';
export const GET_INV_DETAILS_INFO_SUCCESS = 'GET_INV_DETAILS_INFO_SUCCESS';
export const GET_INV_DETAILS_INFO_FAILURE = 'GET_INV_DETAILS_INFO_FAILURE';

export const GET_PPM_DETAILS_INFO = 'GET_PPM_DETAILS_INFO';
export const GET_PPM_DETAILS_INFO_SUCCESS = 'GET_PPM_DETAILS_INFO_SUCCESS';
export const GET_PPM_DETAILS_INFO_FAILURE = 'GET_PPM_DETAILS_INFO_FAILURE';

export const GET_MAILROOM_DETAILS_INFO = 'GET_MAILROOM_DETAILS_INFO';
export const GET_MAILROOM_DETAILS_INFO_SUCCESS = 'GET_MAILROOM_DETAILS_INFO_SUCCESS';
export const GET_MAILROOM_DETAILS_INFO_FAILURE = 'GET_MAILROOM_DETAILS_INFO_FAILURE';

export const GET_PANTRY_DETAILS_INFO = 'GET_PANTRY_DETAILS_INFO';
export const GET_PANTRY_DETAILS_INFO_SUCCESS = 'GET_PANTRY_DETAILS_INFO_SUCCESS';
export const GET_PANTRY_DETAILS_INFO_FAILURE = 'GET_PANTRY_DETAILS_INFO_FAILURE';

export const GET_VMS_DETAILS_INFO = 'GET_VMS_DETAILS_INFO';
export const GET_VMS_DETAILS_INFO_SUCCESS = 'GET_VMS_DETAILS_INFO_SUCCESS';
export const GET_VMS_DETAILS_INFO_FAILURE = 'GET_VMS_DETAILS_INFO_FAILURE';

export const GET_INS_DETAILS_INFO = 'GET_INS_DETAILS_INFO';
export const GET_INS_DETAILS_INFO_SUCCESS = 'GET_INS_DETAILS_INFO_SUCCESS';
export const GET_INS_DETAILS_INFO_FAILURE = 'GET_INS_DETAILS_INFO_FAILURE';

export const GET_ESL_LIST_INFO = 'GET_ESL_LIST_INFO';
export const GET_ESL_LIST_INFO_SUCCESS = 'GET_ESL_LIST_INFO_SUCCESS';
export const GET_ESL_LIST_INFO_FAILURE = 'GET_ESL_LIST_INFO_FAILURE';

export const GET_ESL_COUNT_INFO = 'GET_ESL_COUNT_INFO';
export const GET_ESL_COUNT_INFO_SUCCESS = 'GET_ESL_COUNT_INFO_SUCCESS';
export const GET_ESL_COUNT_INFO_FAILURE = 'GET_ESL_COUNT_INFO_FAILURE';

export const GET_ESL_EXPORT_LIST_INFO = 'GET_ESL_EXPORT_LIST_INFO';
export const GET_ESL_EXPORT_LIST_INFO_SUCCESS = 'GET_ESL_EXPORT_LIST_INFO_SUCCESS';
export const GET_ESL_EXPORT_LIST_INFO_FAILURE = 'GET_ESL_EXPORT_LIST_INFO_FAILURE';

export const GET_SPACE_INFO = 'GET_SPACE_INFO';
export const GET_SPACE_INFO_SUCCESS = 'GET_SPACE_INFO_SUCCESS';
export const GET_SPACE_INFO_FAILURE = 'GET_SPACE_INFO_FAILURE';

export const GET_RECIPIENTS_INFO = 'GET_RECIPIENTS_INFO';
export const GET_RECIPIENTS_INFO_SUCCESS = 'GET_RECIPIENTS_INFO_SUCCESS';
export const GET_RECIPIENTS_INFO_FAILURE = 'GET_RECIPIENTS_INFO_FAILURE';

export const GET_ESCALATION_RECIPIENTS_INFO = 'GET_ESCALATION_RECIPIENTS_INFO';
export const GET_ESCALATION_RECIPIENTS_INFO_SUCCESS = 'GET_ESCALATION_RECIPIENTS_INFO_SUCCESS';
export const GET_ESCALATION_RECIPIENTS_INFO_FAILURE = 'GET_ESCALATION_RECIPIENTS_INFO_FAILURE';

export const GET_MAIL_INFO = 'GET_MAIL_INFO';
export const GET_MAIL_INFO_SUCCESS = 'GET_MAIL_INFO_SUCCESS';
export const GET_MAIL_INFO_FAILURE = 'GET_MAIL_INFO_FAILURE';

export const GET_WP_INFO = 'GET_WP_INFO';
export const GET_WP_INFO_SUCCESS = 'GET_WP_INFO_SUCCESS';
export const GET_WP_INFO_FAILURE = 'GET_WP_INFO_FAILURE';

export const GET_INS_MAIL_INFO = 'GET_INS_MAIL_INFO';
export const GET_INS_MAIL_INFO_SUCCESS = 'GET_INS_MAIL_INFO_SUCCESS';
export const GET_INS_MAIL_INFO_FAILURE = 'GET_INS_MAIL_INFO_FAILURE';

export const GET_INC_REP_B_INFO = 'GET_INC_REP_B_INFO';
export const GET_INC_REP_B_INFO_SUCCESS = 'GET_INC_REP_B_INFO_SUCCESS';
export const GET_INC_REP_B_INFO_FAILURE = 'GET_INC_REP_B_INFO_FAILURE';

export const GET_INC_REP_A_INFO = 'GET_INC_REP_A_INFO';
export const GET_INC_REP_A_INFO_SUCCESS = 'GET_INC_REP_A_INFO_SUCCESS';
export const GET_INC_REP_A_INFO_FAILURE = 'GET_INC_REP_A_INFO_FAILURE';

export const GET_SUB_CAT_INFO = 'GET_SUB_CAT_INFO';
export const GET_SUB_CAT_INFO_SUCCESS = 'GET_SUB_CAT_INFO_SUCCESS';
export const GET_SUB_CAT_INFO_FAILURE = 'GET_SUB_CAT_INFO_FAILURE';

export const GET_CAT_INFO = 'GET_CAT_INFO';
export const GET_CAT_INFO_SUCCESS = 'GET_CAT_INFO_SUCCESS';
export const GET_CAT_INFO_FAILURE = 'GET_CAT_INFO_FAILURE';

export const GET_AUD_SPACE_INFO = 'GET_AUD_SPACE_INFO';
export const GET_AUD_SPACE_INFO_SUCCESS = 'GET_AUD_SPACE_INFO_SUCCESS';
export const GET_AUD_SPACE_INFO_FAILURE = 'GET_AUD_SPACE_INFO_FAILURE';

export const GET_SMS_INFO = 'GET_SMS_INFO';
export const GET_SMS_INFO_SUCCESS = 'GET_SMS_INFO_SUCCESS';
export const GET_SMS_INFO_FAILURE = 'GET_SMS_INFO_FAILURE';

export const GET_EQUIPMENT_INFO = 'GET_EQUIPMENT_INFO';
export const GET_EQUIPMENT_INFO_SUCCESS = 'GET_EQUIPMENT_INFO_SUCCESS';
export const GET_EQUIPMENT_INFO_FAILURE = 'GET_EQUIPMENT_INFO_FAILURE';

export const GET_SPACECAT_INFO = 'GET_SPACECAT_INFO';
export const GET_SPACECAT_INFO_SUCCESS = 'GET_SPACECAT_INFO_SUCCESS';
export const GET_SPACECAT_INFO_FAILURE = 'GET_SPACECAT_INFO_FAILURE';

export const GET_ES_INFO = 'GET_ES_INFO';
export const GET_ES_INFO_SUCCESS = 'GET_ES_INFO_SUCCESS';
export const GET_ES_INFO_FAILURE = 'GET_ES_INFO_FAILURE';

export const GET_GP_DETAILS_INFO = 'GET_GP_DETAILS_INFO';
export const GET_GP_DETAILS_INFO_SUCCESS = 'GET_GP_DETAILS_INFO_SUCCESS';
export const GET_GP_DETAILS_INFO_FAILURE = 'GET_GP_DETAILS_INFO_FAILURE';

export const GET_ORDER_LINE_INFO = 'GET_ORDER_LINE_INFO';
export const GET_ORDER_LINE_INFO_SUCCESS = 'GET_ORDER_LINE_INFO_SUCCESS';
export const GET_ORDER_LINE_INFO_FAILURE = 'GET_ORDER_LINE_INFO_FAILURE';

export const GET_WAREHOUSE_GROUP_INFO = 'GET_WAREHOUSE_GROUP_INFO';
export const GET_WAREHOUSE_GROUP_INFO_SUCCESS = 'GET_WAREHOUSE_GROUP_INFO_SUCCESS';
export const GET_WAREHOUSE_GROUP_INFO_FAILURE = 'GET_WAREHOUSE_GROUP_INFO_FAILURE';

export const GET_CONFIGURATION_SUMMARY_INFO = 'GET_CONFIGURATION_SUMMARY_INFO';
export const GET_CONFIGURATION_SUMMARY_INFO_SUCCESS = 'GET_CONFIGURATION_SUMMARY_INFO_SUCCESS';
export const GET_CONFIGURATION_SUMMARY_INFO_FAILURE = 'GET_CONFIGURATION_SUMMARY_INFO_FAILURE';

export const UPDATE_HX_MODULE_INFO = 'UPDATE_HX_MODULE_INFO';
export const UPDATE_HX_MODULE_INFO_SUCCESS = 'UPDATE_HX_MODULE_INFO_SUCCESS';
export const UPDATE_HX_MODULE_INFO_FAILURE = 'UPDATE_HX_MODULE_INFO_FAILURE';

export const GET_TASK_MESSAGES_INFO = 'GET_TASK_MESSAGES_INFO';
export const GET_TASK_MESSAGES_INFO_SUCCESS = 'GET_TASK_MESSAGES_INFO_SUCCESS';
export const GET_TASK_MESSAGES_INFO_FAILURE = 'GET_TASK_MESSAGES_INFO_FAILURE';

export const UPDATE_HX_TASK_INFO = 'UPDATE_HX_TASK_INFO';
export const UPDATE_HX_TASK_INFO_SUCCESS = 'UPDATE_HX_TASK_INFO_SUCCESS';
export const UPDATE_HX_TASK_INFO_FAILURE = 'UPDATE_HX_TASK_INFO_FAILURE';

export const GET_TASK_CHECKLISTS_INFO = 'GET_TASK_CHECKLISTS_INFO';
export const GET_TASK_CHECKLISTS_INFO_SUCCESS = 'GET_TASK_CHECKLISTS_INFO_SUCCESS';
export const GET_TASK_CHECKLISTS_INFO_FAILURE = 'GET_TASK_CHECKLISTS_INFO_FAILURE';

export function getSiteListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter) {
  const fields = siteColumns && siteColumns.siteListFields ? siteColumns.siteListFields : [];
  let payload = `domain=["|",["parent_id","in",[${company}]],["id","=",${company}]`;

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
      types: [GET_SITE_INFO, GET_SITE_INFO_SUCCESS, GET_SITE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSiteExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=["|",["parent_id","in",[${company}]],["id","=",${company}]`;

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
      types: [GET_SITE_EXPORT_INFO, GET_SITE_EXPORT_INFO_SUCCESS, GET_SITE_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSiteCountInfo(company, model, customFilters, keyword, globalFilter) {
  let payload = `domain=["|",["parent_id","in",[${company}]],["id","=",${company}]`;
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
      types: [GET_SITE_COUNT_INFO, GET_SITE_COUNT_INFO_SUCCESS, GET_SITE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createSiteInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: 'onboard/site',
      types: [CREATE_SITE_INFO, CREATE_SITE_INFO_SUCCESS, CREATE_SITE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateSiteInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'onboard/site/module/update',
      types: [UPDATE_SITE_INFO, UPDATE_SITE_INFO_SUCCESS, UPDATE_SITE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateSiteConfiguartion(result) {
  return {
    [CALL_API]: {
      endpoint: 'onboard/site/configuration',
      types: [UPDATE_CONFIG_INFO, UPDATE_CONFIG_INFO_SUCCESS, UPDATE_CONFIG_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getSiteDetails(id, modelName) {
  const fields = '["id","name",("parent_id", ["id", "name"]),("res_company_categ_id", ["id", "name"]),("company_subcateg_id", ["id", "name"]),"code","city","create_date","street","area_sqft","zip",("state_id", ["id", "name"]),("country_id", ["id", "name"]),("region_id", ["id", "name"]),"company_tz","is_parent",("currency_id", ["id", "name"]),["allowed_module_ids", ["id","name","code"]]]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_SITE_DETAILS, GET_SITE_DETAILS_SUCCESS, GET_SITE_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getCodeGroupsInfo(company, model) {
  const payload = `domain=[["code","!=",false]]&model=${model}&fields=["code"]&groupby=["code"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CODE_GROUP_INFO, GET_CODE_GROUP_INFO_SUCCESS, GET_CODE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getParentSiteGroupsInfo(company, model) {
  const payload = `domain=[["parent_id","!=",false]]&model=${model}&fields=["parent_id"]&groupby=["parent_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PS_GROUP_INFO, GET_PS_GROUP_INFO_SUCCESS, GET_PS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["res_company_categ_id","!=",false]]&model=${model}&fields=["res_company_categ_id"]&groupby=["res_company_categ_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORY_GROUP_INFO, GET_CATEGORY_GROUP_INFO_SUCCESS, GET_CATEGORY_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUserSiteDetails(payload) {
  return {
    [CALL_API]: {
      endpoint: 'userinformation',
      types: [GET_USER_INFO, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllowedModules(model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name","code"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALLOWED_MODULE_INFO, GET_ALLOWED_MODULE_INFO_SUCCESS, GET_ALLOWED_MODULE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTCLists(company, model, keyword, sortField) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  const sortFieldName = sortField || 'name';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","path_name","title"]&limit=20&offset=0&order=${sortFieldName} ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TC_INFO, GET_TC_INFO_SUCCESS, GET_TC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAccessGroups(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","display_name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AG_INFO, GET_AG_INFO_SUCCESS, GET_AG_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorGroups(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","display_name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VT_INFO, GET_VT_INFO_SUCCESS, GET_VT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetGroups(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","display_name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ASSET_INFO, GET_ASSET_INFO_SUCCESS, GET_ASSET_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLabelLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","display_name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_LB_INFO, GET_LB_INFO_SUCCESS, GET_LB_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getParentCompanys(company, model, keyword) {
  const fields = '["id","name", ["allowed_module_ids", ["id","name","code"]]]';

  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SITE_CATEGORY, GET_SITE_CATEGORY_SUCCESS, GET_SITE_CATEGORY_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductCompanys(company, model, keyword) {
  const fields = '["id","name"]';
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PRODUCT_COMPANY, GET_PRODUCT_COMPANY_SUCCESS, GET_PRODUCT_COMPANY_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCompanyInfo(company, model, keyword, isUser) {
  const fields = '["id","name"]';
  let payload = 'domain=[';
  if (isUser) {
    payload = `${payload}"|",["parent_id","in",[${company}]],["id","in",[${company}]]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_COMPANY_INFO, GET_COMPANY_INFO_SUCCESS, GET_COMPANY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCopyAllowedModules(siteId, modelName) {
  const fields = '["id","state",("hx_onboard_module_id", ["id", "name","code"]),("company_id", ["id", "name"])]';

  const payload = `["company_id","=",${siteId}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_COPY_MODULE, GET_COPY_MODULE_SUCCESS, GET_COPY_MODULE_FAILURE],
      method: 'GET',
      siteId,
    },
  };
}

// eslint-disable-next-line no-unused-vars
export function getSiteDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: 'dashboard_data?name=Building Site',
      types: [GET_SITE_DASHBOARD_INFO, GET_SITE_DASHBOARD_INFO_SUCCESS, GET_SITE_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getProblemCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = fieldsDataConfig && fieldsDataConfig.listFieldsPC ? fieldsDataConfig.listFieldsPC : [];
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PC_LIST_INFO, GET_PC_LIST_INFO_SUCCESS, GET_PC_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProblemCategoryCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PC_COUNT_INFO, GET_PC_COUNT_INFO_SUCCESS, GET_PC_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProblemCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PC_EXPORT_LIST_INFO, GET_PC_EXPORT_LIST_INFO_SUCCESS, GET_PC_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPcDetail(id, modelName) {
  const fields = '["id","name","is_incident",("team_category_id", ["id", "name"]),("company_id", ["id", "name"]),["cat_user_ids", ["id", "name"]],("incident_type_id", ["id", "name"]),["access_group_ids", ["id", "name"]],["subcategory_ids", ["id", "name", "priority","sla_timer"]]]';

  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_PC_INFO, GET_PC_INFO_SUCCESS, GET_PC_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getProblemCategoryGroupListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = fieldsDataConfig && fieldsDataConfig.listFieldsPCG ? fieldsDataConfig.listFieldsPCG : [];
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PCG_LIST_INFO, GET_PCG_LIST_INFO_SUCCESS, GET_PCG_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProblemCategoryGroupCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PCG_COUNT_INFO, GET_PCG_COUNT_INFO_SUCCESS, GET_PCG_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProblemCategoryGroupListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_PCG_EXPORT_LIST_INFO, GET_PCG_EXPORT_LIST_INFO_SUCCESS, GET_PCG_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPCGDetail(id, modelName) {
  const fields = '["id","name","is_all_asset_category","type_category","is_all_category",["equipment_category_ids", ["id", "name"]],["space_category_ids", ["id", "name"]],["problem_category_ids", ["id", "name", "cat_display_name",("company_id",["id","name"])]]]';

  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_PCG_INFO, GET_PCG_INFO_SUCCESS, GET_PCG_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSpaceCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = fieldsDataConfigAsset && fieldsDataConfigAsset.listFieldsSCShows ? fieldsDataConfigAsset.listFieldsSCShows : [];
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_SC_LIST_INFO, GET_SC_LIST_INFO_SUCCESS, GET_SC_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceCategoryCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_SC_COUNT_INFO, GET_SC_COUNT_INFO_SUCCESS, GET_SC_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_SC_EXPORT_LIST_INFO, GET_SC_EXPORT_LIST_INFO_SUCCESS, GET_SC_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScDetail(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_SC_INFO, GET_SC_INFO_SUCCESS, GET_SC_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAssetCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = fieldsDataConfigAsset && fieldsDataConfigAsset.listFieldsACShows ? fieldsDataConfigAsset.listFieldsACShows : [];
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;

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
      types: [GET_AC_LIST_INFO, GET_AC_LIST_INFO_SUCCESS, GET_AC_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetCategoryCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
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
      types: [GET_AC_COUNT_INFO, GET_AC_COUNT_INFO_SUCCESS, GET_AC_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;

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
      types: [GET_AC_EXPORT_LIST_INFO, GET_AC_EXPORT_LIST_INFO_SUCCESS, GET_AC_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAcDetail(id, modelName) {
  const fields = '["id","name","categ_no","alias_name_categ","type","image_medium",("parent_id", ["id", "name","display_name","path_name"]),("company_id", ["id", "name"]),("commodity_id", ["id", "name","display_name"]),["space_label_ids", ["id", ("space_label_id",["id","name"]), "space_value"]]]';

  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_AC_INFO, GET_AC_INFO_SUCCESS, GET_AC_INFO_SUCCESS],
      method: 'GET',
      id,
    },
  };
}

export function getHelpdeskSettingDetail(id, modelName) {
  const fields = '["id","has_site_specific_category","is_auto_generate_mo_helpdesk","is_enable_it_ticket","helpdesk_attachment_limit","send_escatation_mails","send_reminder_mails","is_enable_helpdesk_feedback","helpdesk_button_text","is_send_helpdesk_email","feedback_expiry_days","reopen_on_feedback_ticket","email_team_on_dissatisfaction_feedback","is_enable_external_helpdesk",("incident_report_part_a_id", ["id", "name"]),("incident_report_part_b_id", ["id", "name"]),("helpdesk_survey", ["id", "title"]),"requires_verification_by_otp","uuid","has_reviwer_name","has_reviwer_email","has_reviwer_mobile","requires_attachment","work_location","requestor_mobile_visibility","problem_category_type",("share_mail_template_id", ["id", "name"]),["helpdesk_lines", ["id", "helpdesk_state", "is_requestee","is_maintenance_team","is_recipients","is_push_notify","is_send_email","is_send_sms",("mail_template_id", ["id", "name"]),["recipients_ids", ["id","name"]],("sms_template_id", ["id", "name"])]],"at_start_mro","at_review_mro","at_done_mro","is_auto_confirm","qr_scan_at_start","qr_scan_at_done","nfc_scan_at_start","nfc_scan_at_done",("resource_calendar_id", ["id", "name"]),"is_photo_mandatory","qr_code_image","submit_globally_in_app","is_smartlogger_scan","auto_sync_interval_mobile","os_app_id","os_url","has_audit_mode_qr","has_audit_mode_nfc","has_audit_mode_rfid","has_audit_mode_manual","is_generate_one_wo_for_each_reading","os_app_key","response","hspace_app_key","hsense_app_url","hsense_support_email","hsense_website_url","is_vendor_field","vendor_access_type", "is_constraints", "is_cost", "is_age"]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HS_DETAILS_INFO, GET_HS_DETAILS_INFO_SUCCESS, GET_HS_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getGatePassSettingDetail(id, modelName) {
  const fields = '["id","bearer_email","bearer_mobile","attachment","space","reference","reference_display","approval_required","approval_button",["approval_recipients_ids", ["id", "name"]],"uuid",("company_id", ["id", "name"]),"uuid",["order_lines", ["id", "state", "is_requestee",["recipients_ids", ["id","name"]]]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_GP_DETAILS_INFO, GET_GP_DETAILS_INFO_SUCCESS, GET_GP_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getAuditSettingDetail(id, modelName) {
  const fields = '["id","auto_create_tickets_from_action",("sub_category_id", ["id", "name"]),("category_id", ["id", "name"]),("space_id", ["id", "name"]),("company_id", ["id", "name"])]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_AUDIT_DETAILS_INFO, GET_AUDIT_DETAILS_INFO_SUCCESS, GET_AUDIT_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getWorkpermitSettingDetail(id, modelName) {
  const fields = '["id","work_location","asset_type","po_reference","is_parts_required","is_prepared_required","is_ehs_required","review_required","night_shift_from","night_shift_to",("night_approval_authority_shift_id",["id","name"]),"special_shift_from","special_shift_to",("special_approval_authority_shift_id",["id","name"]),"general_shift_from","general_shift_to",("general_approval_authority_shift_id",["id","name"]),"request_message_type","request_authorizer","authorized_message_type","authorized_authorizer","authorized_ehs","authorized_vendor","authorized_requestor","prepared_message_type","prepared_authorizer","prepared_requestor","prepared_ehs","issued_message_type","issued_authorizer","issued_ehs","issued_vendor","issued_requestor","issued_security","ehs_message_type","ehs_authorizer","ehs_ehs","ehs_vendor","ehs_requestor","ehs_security","order_message_type","order_review","order_authorizer","closed_message_type","closed_authorizer","closed_ehs","closed_vendor","closed_requestor","closed_security","within_a_day","special_from_time_editable","special_to_time_editable","spl_max_dur_from_time","spl_max_dur_to_time","special_title","is_special_type_of_work","general_from_time_editable","general_to_time_editable","gen_max_dur_from_time","gen_max_dur_to_time","general_title","is_general_type_of_work","night_from_time_editable","night_to_time_editable","ngt_max_dur_from_time","ngt_max_dur_to_time","night_title","is_night_type_of_work","requested_status","approved_status","prepared_status","issued_permit_status","validated_status","work_in_progress_status","on_hold_status","closed_status","permit_rejected_status","elapsed_status","cancel_status","requested_button","approved_button","prepared_button","issued_permit_button","validated_button","work_in_progress_button","on_hold_button","closed_button","permit_rejected_button","elapsed_button","cancel_button","edit_actual_start_dt","edit_actual_end_dttton","is_enable_type_of_work","type_of_work_access_level","is_enable_department","department_access_level",["line_ids", ["id", "state", "message_type","is_authorizer","is_ehs","is_vendor","is_requestor","is_security",["recipients_ids", ["id","name"]]]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_WS_DETAILS_INFO, GET_WS_DETAILS_INFO_SUCCESS, GET_WS_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getInventorySettingDetail(id, modelName) {
  const fields = '["id","is_product_category_mandatory","import_batch_size","products_list_access",("product_list_company_id",["id","name"]),"is_reorder_level_email","include_reminder_alert_items",["recipients_ids",["id","name"]], ["line_ids", ["id", "request_state", "code","is_requestee","is_recipients","is_send_email",["recipients_ids", ["id","name"]]]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_INV_DETAILS_INFO, GET_INV_DETAILS_INFO_SUCCESS, GET_INV_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getPPMSettingDetail(id, modelName) {
  const fields = '["id","is_subassets_viewer","reason_access_level","is_perform_missed_ppm","is_provide_missed_reason","service_report_file_formats","is_indirect_child","on_hold_max_grace_period","is_parent","at_start_mro","at_review_mro","at_done_mro","qr_scan_at_start","qr_scan_at_done","generate_ppm_in_advance","enforce_time","nfc_scan_at_start","nfc_scan_at_done","is_review_required","review_commment_is_required","is_sign_off_required",("review_role_id",["id","name"]),("sign_off_role_id",["id","name"]),("on_hold_approval_id",["id","name"]),("service_report_reason_id",["id","name","type","grace_period"]),"is_external_ppm_to_be_performed","is_send_external_ppm_email","send_email_before_weeks",["send_email_cc_recipients_ids", ["id","name"]],"send_vendor_emails_as",("external_reminder_email_template_id",["id","name"]),"is_fence_to_perform_ppm","instructions","terms_and_condition","disclaimer","is_on_hold_approval_required",["on_hold_recipients", ["id","name"]],("on_hold_mail_template_id",["id","name"]),("on_hold_mail_reject_id",["id","name"]),("on_hold_missed_mail_id",["id","name"]),("reminder_template_id",["id","name"]),("sla_template_id",["id","name"]),"reason_access_level","allow_postpone_prepone","allow_postpone_week","approval_required_for_postpone","exception_for_approval_lead_days","is_can_cancel","approval_required_for_cancel","cancel_approval_lead_days",("approval_authority", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])]),("cancel_approval_authority", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])])]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_PPM_DETAILS_INFO, GET_PPM_DETAILS_INFO_SUCCESS, GET_PPM_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getMailRoomSettingDetail(id, modelName) {
  const fields = '["id","inbound_collection_period","outbound_collection_period","inbound_reminders","outbound_reminders"]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_MAILROOM_DETAILS_INFO, GET_MAILROOM_DETAILS_INFO_SUCCESS, GET_MAILROOM_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getPantrySettingDetail(id, modelName) {
  const fields = '["id","is_created_notification","is_update_notification","is_confirmation_notification","is_delivered_notification","is_cancellation_notification","enable_qr_for_delivery","cleaning_threshold","is_integrate_with_inventory"]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_PANTRY_DETAILS_INFO, GET_PANTRY_DETAILS_INFO_SUCCESS, GET_PANTRY_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getVMSSettingDetail(id, modelName) {
  const fields = '["id","has_visitor_email","has_visitor_mobile","visit_pass_header","has_visitor_company","has_visitor_type","has_purpose","has_photo","has_identity_proof","has_vistor_id_details","has_identity_proof_number","has_visitor_badge","has_host_company","has_host_email","has_host_name","is_send_otp_email","is_send_otp_sms","is_send_whatsapp_message","is_send_visitor_invitation_email","is_send_visitor_invitation_sms","is_send_visitor_invitation_whatsapp","is_enable_host_email_verification","host_disclaimer","is_send_request_email","is_send_request_sms","is_send_request_whatsapp","is_send_check_in_email","is_send_check_in_sms","is_send_check_in_whatsapp","check_in_qr","check_in_otp","check_in_grace_period","is_send_check_out_email","is_send_check_out_sms","is_send_check_out_whatsapp","is_send_approval_email","is_send_approval_sms","is_send_approval_whatsapp","is_send_elapsed_email","is_send_elapsed_sms","is_send_elapsed_whatsapp","allow_gallery_images",("prescreen_survey", ["id", "title"]),"enable_prescreen","uuid","prescreen_period","prescreen_button_text","is_send_prescreen_email","approval_required_from_host","close_visit_request_by","enable_public_visit_request", "is_allow_visitor_assets", "is_enable_conditions","terms_and_conditions","visit_request_created_text","feedback_during_checkout","feedback_button_text","is_send_feedback_email",("feedback_survey",["id","title"]),("visitor_invitation_template_id", ["id", "name"]),("otp_template_id", ["id", "name"]),("request_template_id", ["id", "name"]),("check_in_template_id", ["id", "name"]),("check_out_template_id", ["id", "name"]),("approval_template_id", ["id", "name"]),("elapsed_template_id", ["id", "name"]),["allowed_sites_ids", ["id","name"]],["allowed_domains_host_ids", ["id","name"]], ["visitor_types", ["id","name"]],["visitor_allowed_asset_ids", ["id","name"]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_VMS_DETAILS_INFO, GET_VMS_DETAILS_INFO_SUCCESS, GET_VMS_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getInspectionSettingDetail(id, modelName) {
  const fields = '["id","override_duplicate_inspections","due_now_period","inspection_commenced_on","is_alarm","is_send_email",("mail_template_id", ["id", "name"]),["recipients_ids", ["id", "name"]]]';

  const payload = `["company_id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_INS_DETAILS_INFO, GET_INS_DETAILS_INFO_SUCCESS, GET_INS_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getEsDetail(id, modelName) {
  const fields = '["id", "name", "level", "type_category", ["company_id", ["id", "name"]], ["recipients_ids", ["id", "name"]], ["space_category_id", ["id", "name"]], ["category_id", ["id", "name"]], ["location_ids", ["id", "name"]]]';

  const payload = `["id","=",${id}]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_ES_INFO, GET_ES_INFO_SUCCESS, GET_ES_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getEscalationLevelListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  // const fields = fieldsDataConfig && fieldsDataConfig.listFieldsESLShows ? fieldsDataConfig.listFieldsESLShows : [] ;
  // ("recipients_ids", ["id", "name"]),("space_category_id", ["id", "name", "path_name","space_name"]),("category_id", ["id", "name"]);

  // const fields = fieldsDataConfig && fieldsDataConfig.listFieldsESL ? fieldsDataConfig.listFieldsESL : [];

  // const fields = '["name","level","type_category", "company_id"]';

  const fields = '["id","name","level","type_category",["company_id", ["id", "name"]],["recipients_ids", ["id", "name"]],["space_category_id", ["id", "name"]],["category_id", ["id", "name"]],["location_ids", ["id", "name"]]]';

  let payload = 'domain=[["name","!=",false]';

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ESL_LIST_INFO, GET_ESL_LIST_INFO_SUCCESS, GET_ESL_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEscalationLevelCountInfo(company, model, customFilters, globalFilter) {
  let payload = 'domain=[["name","!=",false]';
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
      types: [GET_ESL_COUNT_INFO, GET_ESL_COUNT_INFO_SUCCESS, GET_ESL_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEscalationLevelListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = 'domain=[["name","!=",false]';

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
      types: [GET_ESL_EXPORT_LIST_INFO, GET_ESL_EXPORT_LIST_INFO_SUCCESS, GET_ESL_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name", "path_name", "space_name"]&limit=20&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_INFO, GET_SPACE_INFO_SUCCESS, GET_SPACE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRecipientLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  // let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_RECIPIENTS_INFO, GET_RECIPIENTS_INFO_SUCCESS, GET_RECIPIENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEscalationRecipientLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  // let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ESCALATION_RECIPIENTS_INFO, GET_ESCALATION_RECIPIENTS_INFO_SUCCESS, GET_ESCALATION_RECIPIENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEqipmentCategorys(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EQUIPMENT_INFO, GET_EQUIPMENT_INFO_SUCCESS, GET_EQUIPMENT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWhatsappTemplates(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WP_INFO, GET_WP_INFO_SUCCESS, GET_WP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMailTemplates(company, model, keyword, tempModel) {
  // eslint-disable-next-line quotes
  let payload = `domain=[["model_id","=","${tempModel || 'website.support.ticket'}"]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAIL_INFO, GET_MAIL_INFO_SUCCESS, GET_MAIL_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionMailTemplates(company, model, keyword, module) {
  // eslint-disable-next-line quotes
  // let payload = `domain=[["company_id","in",[${company}]]`;
  let payload = 'domain=[["model_id","=","dw2.inspection_log"]';
  if (module === 'onboarding') {
    payload = 'domain=[["model_id","=","hx.inspection_checklist"]';
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INS_MAIL_INFO, GET_INS_MAIL_INFO_SUCCESS, GET_INS_MAIL_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncReportBs(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INC_REP_B_INFO, GET_INC_REP_B_INFO_SUCCESS, GET_INC_REP_B_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncReportAs(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INC_REP_A_INFO, GET_INC_REP_A_INFO_SUCCESS, GET_INC_REP_A_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSubCategoryLists(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SUB_CAT_INFO, GET_SUB_CAT_INFO_SUCCESS, GET_SUB_CAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategorytList(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CAT_INFO, GET_CAT_INFO_SUCCESS, GET_CAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditSpaceList(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_AUD_SPACE_INFO, GET_AUD_SPACE_INFO_SUCCESS, GET_AUD_SPACE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSmsTemplates(company, model, keyword) {
  // eslint-disable-next-line quotes
  let payload = `domain=[["model_id","=","website.support.ticket"]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SMS_INFO, GET_SMS_INFO_SUCCESS, GET_SMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceCategorys(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACECAT_INFO, GET_SPACECAT_INFO_SUCCESS, GET_SPACECAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderLinesInfo(company, model, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;

  if (ids) {
    payload = `${payload}`;
  }

  payload = `${payload}]&model=${model}&fields=["id","state","is_requestee",["recipients_ids", ["id","name"]]]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ORDER_LINE_INFO, GET_ORDER_LINE_INFO_SUCCESS, GET_ORDER_LINE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWarehousesIdsList(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload}]&model=${model}&fields=["id"]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_WAREHOUSE_GROUP_INFO, GET_WAREHOUSE_GROUP_INFO_SUCCESS, GET_WAREHOUSE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConfigurationSummaryInfo(company, model, noload) {
  let payload = `domain=[["company_id","=",${company}]`;

  payload = `${payload}]&model=${model}&fields=["id","name","state","description","target_date_from","target_date_to","__last_update","done_on",("responsible_person_id",["id","name",("user_id",["id","name"])]),("module_id",["id","name"]),["message_ids", ["id"]],["onboarding_task_ids", ["id","state","name","description","type","days_required","done_on","action","action_button_name","text_to_show_when_completed","entity","entity_id","reference","comments",("company_id",["id","name"]),["task_checklist_ids", ["id","status"]]]]]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [noload ? 'GET_CONFIGURATION_SUMMARY_NO_INFO' : GET_CONFIGURATION_SUMMARY_INFO, GET_CONFIGURATION_SUMMARY_INFO_SUCCESS, noload ? 'GET_CONFIGURATION_SUMMARY_NO_INFO_FAILURE' : GET_CONFIGURATION_SUMMARY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTaskMessagesInfo(id) {
  let payload = `domain=[["id","=",${id}]`;

  payload = `${payload}]&model=hx.onboarding_tasks&fields=["id",["message_ids", ["id"]]]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TASK_MESSAGES_INFO, GET_TASK_MESSAGES_INFO_SUCCESS, GET_TASK_MESSAGES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTaskChecklistsInfo(id) {
  let payload = `domain=[["task_checklist_id","=",${id}]`;

  payload = `${payload}]&model=hx.onboarding_task_template_checklist&fields=["id","name","status","action","action_button_name"]`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TASK_CHECKLISTS_INFO, GET_TASK_CHECKLISTS_INFO_SUCCESS, GET_TASK_CHECKLISTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateHxModuleInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_HX_MODULE_INFO, UPDATE_HX_MODULE_INFO_SUCCESS, UPDATE_HX_MODULE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateHxTaskInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_HX_TASK_INFO, UPDATE_HX_TASK_INFO_SUCCESS, UPDATE_HX_TASK_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
