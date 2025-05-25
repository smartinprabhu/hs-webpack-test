/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import fieldsData from './data/customData.json';
import { WorkPermitModule } from '../util/field';

export const GET_WORKPERMIT_INFO = 'GET_WORKPERMIT_INFO';
export const GET_WORKPERMIT_INFO_SUCCESS = 'GET_WORKPERMIT_INFO_SUCCESS';
export const GET_WORKPERMIT_INFO_FAILURE = 'GET_WORKPERMIT_INFO_FAILURE';

export const GET_WORKPERMIT_EXPORT_LIST_INFO = 'GET_WORKPERMIT_EXPORT_LIST_INFO';
export const GET_WORKPERMIT_EXPORT_LIST_INFO_SUCCESS = 'GET_WORKPERMIT_EXPORT_LIST_INFO_SUCCESS';
export const GET_WORKPERMIT_EXPORT_LIST_INFO_FAILURE = 'GET_WORKPERMIT_EXPORT_LIST_INFO_FAILURE';

export const GET_WORKPERMIT_COUNT_INFO = 'GET_WORKPERMIT_COUNT_INFO';
export const GET_WORKPERMIT_COUNT_INFO_SUCCESS = 'GET_WORKPERMIT_COUNT_INFO_SUCCESS';
export const GET_WORKPERMIT_COUNT_INFO_FAILURE = 'GET_WORKPERMIT_COUNT_INFO_FAILURE';

export const GET_WORKPERMIT_DASHBOARD_INFO = 'GET_WORKPERMIT_DASHBOARD_INFO';
export const GET_WORKPERMIT_DASHBOARD_INFO_SUCCESS = 'GET_WORKPERMIT_DASHBOARD_INFO_SUCCESS';
export const GET_WORKPERMIT_DASHBOARD_INFO_FAILURE = 'GET_WORKPERMIT_DASHBOARD_INFO_FAILURE';

export const GET_WORKPERMIT_DETAILS_INFO = 'GET_WORKPERMIT_DETAILS_INFO';
export const GET_WORKPERMIT_DETAILS_INFO_SUCCESS = 'GET_WORKPERMIT_DETAILS_INFO_SUCCESS';
export const GET_WORKPERMIT_DETAILS_INFO_FAILURE = 'GET_WORKPERMIT_DETAILS_INFO_FAILURE';

export const GET_VENDOR_GROUP_INFO = 'GET_VENDOR_GROUP_INFO';
export const GET_VENDOR_GROUP_INFO_SUCCESS = 'GET_VENDOR_GROUP_INFO_SUCCESS';
export const GET_VENDOR_GROUP_INFO_FAILURE = 'GET_VENDOR_GROUP_INFO_FAILURE';

export const GET_NATURE_GROUP_INFO = 'GET_NATURE_GROUP_INFO';
export const GET_NATURE_GROUP_INFO_SUCCESS = 'GET_NATURE_GROUP_INFO_SUCCESS';
export const GET_NATURE_GROUP_INFO_FAILURE = 'GET_NATURE_GROUP_INFO_FAILURE';

export const GET_PR_STATE_CHANGE_INFO = 'GET_PR_STATE_CHANGE_INFO';
export const GET_PR_STATE_CHANGE_INFO_SUCCESS = 'GET_PR_STATE_CHANGE_INFO_SUCCESS';
export const GET_PR_STATE_CHANGE_INFO_FAILURE = 'GET_PR_STATE_CHANGE_INFO_FAILURE';

export const GET_REPORT_INFO = 'GET_REPORT_INFO';
export const GET_REPORT_INFO_SUCCESS = 'GET_REPORT_INFO_SUCCESS';
export const GET_REPORT_INFO_FAILURE = 'GET_REPORT_INFO_FAILURE';

export const GET_TW_INFO = 'GET_TW_INFO';
export const GET_TW_INFO_SUCCESS = 'GET_TW_INFO_SUCCESS';
export const GET_TW_INFO_FAILURE = 'GET_TW_INFO_FAILURE';

export const GET_WN_INFO = 'GET_WN_INFO';
export const GET_WN_INFO_SUCCESS = 'GET_WN_INFO_SUCCESS';
export const GET_WN_INFO_FAILURE = 'GET_WN_INFO_FAILURE';

export const GET_PC_INFO = 'GET_PC_INFO';
export const GET_PC_INFO_SUCCESS = 'GET_PC_INFO_SUCCESS';
export const GET_PC_INFO_FAILURE = 'GET_PC_INFO_FAILURE';

export const GET_IP_INFO = 'GET_IP_INFO';
export const GET_IP_INFO_SUCCESS = 'GET_IP_INFO_SUCCESS';
export const GET_IP_INFO_FAILURE = 'GET_IP_INFO_FAILURE';

export const GET_VENDOR_INFO = 'GET_VENDOR_INFO';
export const GET_VENDOR_INFO_SUCCESS = 'GET_VENDOR_INFO_SUCCESS';
export const GET_VENDOR_INFO_FAILURE = 'GET_VENDOR_INFO_FAILURE';

export const GET_NATUREOFWORK_INFO = 'GET_NATUREOFWORK_INFO';
export const GET_NATUREOFWORK_INFO_SUCCESS = 'GET_NATUREOFWORK_INFO_SUCCESS';
export const GET_NATUREOFWORK_INFO_FAILURE = 'GET_NATUREOFWORK_INFO_FAILURE';

export const GET_NATUREOFWORK_COUNT_INFO = 'GET_NATUREOFWORK_COUNT_INFO';
export const GET_NATUREOFWORK_COUNT_INFO_SUCCESS = 'GET_NATUREOFWORK_COUNT_INFO_SUCCESS';
export const GET_NATUREOFWORK_COUNT_INFO_FAILURE = 'GET_NATUREOFWORK_COUNT_INFO_FAILURE';

export const GET_NATUREOFWORK_DETAILS_INFO = 'GET_NATUREOFWORK_DETAILS_INFO';
export const GET_NATUREOFWORK_DETAILS_INFO_SUCCESS = 'GET_NATUREOFWORK_DETAILS_INFO_SUCCESS';
export const GET_NATUREOFWORK_DETAILS_INFO_FAILURE = 'GET_NATUREOFWORK_DETAILS_INFO_FAILURE';

export const GET_NATUREOFWORK_EXPORT_LIST_INFO = 'GET_NATUREOFWORK_EXPORT_LIST_INFO';
export const GET_NATUREOFWORK_EXPORT_LIST_INFO_SUCCESS = 'GET_NATUREOFWORK_EXPORT_LIST_INFO_SUCCESS';
export const GET_NATUREOFWORK_EXPORT_LIST_INFO_FAILURE = 'GET_NATUREOFWORK_EXPORT_LIST_INFO_FAILURE';

export const GET_WP_CONFIG_DETAILS_INFO = 'GET_WP_CONFIG_DETAILS_INFO';
export const GET_WP_CONFIG_DETAILS_INFO_SUCCESS = 'GET_WP_CONFIG_DETAILS_INFO_SUCCESS';
export const GET_WP_CONFIG_DETAILS_INFO_FAILURE = 'GET_WP_CONFIG_DETAILS_INFO_FAILURE';

export const GET_MAINTENANCE_GROUP_INFO = 'GET_MAINTENANCE_GROUP_INFO';
export const GET_MAINTENANCE_GROUP_INFO_SUCCESS = 'GET_MAINTENANCE_GROUP_INFO_SUCCESS';
export const GET_MAINTENANCE_GROUP_INFO_FAILURE = 'GET_MAINTENANCE_GROUP_INFO_FAILURE';

export const GET_MO_CHECKLISTS_INFO = 'GET_MO_CHECKLISTS_INFO';
export const GET_MO_CHECKLISTS_INFO_SUCCESS = 'GET_MO_CHECKLISTS_INFO_SUCCESS';
export const GET_MO_CHECKLISTS_INFO_FAILURE = 'GET_MO_CHECKLISTS_INFO_FAILURE';

export const GET_WP_TASK_DETAILS_INFO = 'GET_WP_TASK_DETAILS_INFO';
export const GET_WP_TASK_DETAILS_INFO_SUCCESS = 'GET_WP_TASK_DETAILS_INFO_SUCCESS';
export const GET_WP_TASK_DETAILS_INFO_FAILURE = 'GET_WP_TASK_DETAILS_INFO_FAILURE';

export const GET_MAIL_LOGS_DETAILS_INFO = 'GET_MAIL_LOGS_DETAILS_INFO';
export const GET_MAIL_LOGS_DETAILS_INFO_SUCCESS = 'GET_MAIL_LOGS_DETAILS_INFO_SUCCESS';
export const GET_MAIL_LOGS_DETAILS_INFO_FAILURE = 'GET_MAIL_LOGS_DETAILS_INFO_FAILURE';

export const GET_IP_TASK_DETAILS_INFO = 'GET_IP_TASK_DETAILS_INFO';
export const GET_IP_TASK_DETAILS_INFO_SUCCESS = 'GET_IP_TASK_DETAILS_INFO_SUCCESS';
export const GET_IP_TASK_DETAILS_INFO_FAILURE = 'GET_IP_TASK_DETAILS_INFO_FAILURE';

export const GET_WP_DEPARTMENTS_INFO = 'GET_WP_DEPARTMENTS_INFO';
export const GET_WP_DEPARTMENTS_INFO_SUCCESS = 'GET_WP_DEPARTMENTS_INFO_SUCCESS';
export const GET_WP_DEPARTMENTS_INFO_FAILURE = 'GET_WP_DEPARTMENTS_INFO_FAILURE';

export function getWorkPermitInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = WorkPermitModule.workPermitApiFields;

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
      types: [GET_WORKPERMIT_INFO, GET_WORKPERMIT_INFO_SUCCESS, GET_WORKPERMIT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkPermitExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_WORKPERMIT_EXPORT_LIST_INFO, GET_WORKPERMIT_EXPORT_LIST_INFO_SUCCESS, GET_WORKPERMIT_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkPermitCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_WORKPERMIT_COUNT_INFO, GET_WORKPERMIT_COUNT_INFO_SUCCESS, GET_WORKPERMIT_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function geWorkPermitDashboardInfo(start, end, dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardName}`,
      types: [GET_WORKPERMIT_DASHBOARD_INFO, GET_WORKPERMIT_DASHBOARD_INFO_SUCCESS, GET_WORKPERMIT_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getWorkPermitDetailsInfo(id, modelName) {
  const fields = '["id","name", "reference","terms_conditions","po_reference","valid_through","sla_status",["escalation_matrix_ids", ["id", "type", "level_date", "level", ("recipients_id", ["id", "name"])]],("preparedness_checklist_id", ["id", "name"]),"ehs_instructions","job_description",["status_logs", ["id","from_state","to_state","performed_by","performed_on","description"]],("vendor_id", ["id", "name","mobile","email"]),"state",("department_id", ["id", "name"]),("company_id", ["id", "name"]),("space_id", ["id", "path_name","space_name"]),"create_date",("equipment_id", ["id", "name"]),("nature_work_id", ["id","_name"]),("requestor_id", ["id", "name"]),("maintenance_team_id", ["id", "name"]),"type","duration",("order_id", ["id",("employee_id", ["id", "name"]), "write_date", "checklist_json_data", "review_status","reviewed_remark","reviewed_on",("reviewed_by", ["id", "name"]),"name", "date_start_execution", "date_execution", ["check_list_ids", ["id", "answer_common", "type","answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "name", "type", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]],["parts_lines", ["id",("parts_id", ["id", "name","qty_available"]), "parts_qty", "received_qty", "used_qty"]],["preparedness_checklist_lines", ["id", "answer_common", "type", "answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "name", "type", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]),"order_state",("approval_authority_id", ["id", "name",["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("ehs_authority_id", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("issue_permit_approval_id", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("security_office_id", ["id", "name"]),"work_location","type_of_request",("reviewer_id", ["id", "name"]),"planned_start_time","duration","vendor_poc","vendor_email","vendor_mobile","no_vendor_technicians",("type_work_id", ["id", "name"]),("nature_work_id", ["id", "name", ("task_id", ["id", "name"]),("preparedness_checklist_id", ["id", "name"])]),["work_technician_ids", ["id", "name", "mobile","age"]],("issue_permit_checklist_id", ["id", "name"]),("task_id", ["id", "name"]),"planned_end_time","validated_status","validated_on",("validated_by", ["id", "name"]),["message_ids", ["id"]],["parts_lines", ["id", ("parts_id", ["id", "name","qty_available"]), ("parts_uom", ["id", "name"]), "parts_qty", "name"]],["issue_permit_checklist_lines", ["id","name","question_group","answer_type","answer_common","write_date"]],["equipment_ids", ["id","name","equipment_seq","state",("location_id",["path_name","space_name"]),("category_id",["name"])]],["space_ids", ["id","sequence_asset_hierarchy","path_name","space_name",("asset_category_id",["name"])]]]';
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
      types: [GET_WORKPERMIT_DETAILS_INFO, GET_WORKPERMIT_DETAILS_INFO_SUCCESS, GET_WORKPERMIT_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getNatureofWorkDetailsInfo(id, modelName) {
  const fields = '["id","name","terms_conditions","ehs_instructions","work_location","type_of_request",("preparedness_checklist_id", ["id", "name"]),("issue_permit_checklist_id", ["id", "name"]),("task_id", ["id", "name"]),("approval_authority_id", ["id", "name",["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("ehs_authority_id", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("issue_permit_approval_id", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]]),("security_office_id", ["id", "name"]),("company_id", ["id", "name"]),"is_can_be_extended"]';
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
      types: [GET_NATUREOFWORK_DETAILS_INFO, GET_NATUREOFWORK_DETAILS_INFO_SUCCESS, GET_NATUREOFWORK_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getWorkPermitReports(company, model, start, end, commodity, vendor) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  const fields = '["id","name", ("commodity", ["id", "name"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),"create_date",("tanker_id", ["id", "name"]),("location_id", ["id","path_name"]),("purchase_order", ["id", "name"]),("uom_id", ["id", "name"]),"initial_reading","final_reading","difference","sequence","in_datetime","out_datetime","remark","delivery_challan","driver","driver_contact",["message_ids", ["id"]]]';

  if (start && end) {
    payload = `${payload},["in_datetime",">=","${start}"],["in_datetime","<=","${end}"]`;
  }
  if (vendor && vendor.length) {
    payload = `${payload},["vendor_id","in",${JSON.stringify(vendor)}]`;
  }
  if (commodity && commodity.length) {
    payload = `${payload},["commodity","in",${JSON.stringify(commodity)}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_REPORT_INFO, GET_REPORT_INFO_SUCCESS, GET_REPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorInfo(company, model, type, keyword) {
  const fields = '["id","name", "email", "mobile"]';

  let payload = `domain=[["company_id","in",[${company}]],["email","!=",false],["display_name","!=",false]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (type && type.length > 0) {
    payload = `${payload},["${type}","=",true]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VENDOR_INFO, GET_VENDOR_INFO_SUCCESS, GET_VENDOR_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["vendor_id"]&groupby=["vendor_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_VENDOR_GROUP_INFO, GET_VENDOR_GROUP_INFO_SUCCESS, GET_VENDOR_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNatureGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["nature_work_id"]&groupby=["nature_work_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_NATURE_GROUP_INFO, GET_NATURE_GROUP_INFO_SUCCESS, GET_NATURE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["maintenance_team_id"]&groupby=["maintenance_team_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MAINTENANCE_GROUP_INFO, GET_MAINTENANCE_GROUP_INFO_SUCCESS, GET_MAINTENANCE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTypeWorkInfo(company, model, keyword, domain) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  if (domain) {
    payload = `domain=[${domain}`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TW_INFO, GET_TW_INFO_SUCCESS, GET_TW_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNatureInfo(company, model, keyword) {
  const fields = '["id", "name",("task_id", ["id", "name"]),("preparedness_checklist_id", ["id", "name"]),("issue_permit_checklist_id", ["id", "name"]),("approval_authority_id", ["id", "name"]), ("ehs_authority_id", ["id", "name"]),("issue_permit_approval_id", ["id", "name"]),("security_office_id", ["id", "name"]),"ehs_instructions","terms_conditions"]';

  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_WN_INFO, GET_WN_INFO_SUCCESS, GET_WN_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPrepareChecklistInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PC_INFO, GET_PC_INFO_SUCCESS, GET_PC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getIssuePermitChecklistInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_IP_INFO, GET_IP_INFO_SUCCESS, GET_IP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function permitStateChangeInfo(id, state, modelName, contex) {
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
      types: [GET_PR_STATE_CHANGE_INFO, GET_PR_STATE_CHANGE_INFO_SUCCESS, GET_PR_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getNatureWorkofListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = fieldsData && fieldsData.listNatureFields ? fieldsData.listNatureFields : [];

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
      types: [GET_NATUREOFWORK_INFO, GET_NATUREOFWORK_INFO_SUCCESS, GET_NATUREOFWORK_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNatureofWorkCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_NATUREOFWORK_COUNT_INFO, GET_NATUREOFWORK_COUNT_INFO_SUCCESS, GET_NATUREOFWORK_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNatureofWorkExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_NATUREOFWORK_EXPORT_LIST_INFO, GET_NATUREOFWORK_EXPORT_LIST_INFO_SUCCESS, GET_NATUREOFWORK_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWpConfigInfo(company, modelName) {
  const fields = '["id","general_shift_allow_multiple_days","is_include_multiple_equipment","is_include_multiple_space","is_track_sla_status","general_shift_max_allowed_days","night_shift_allow_multiple_days","night_shift_max_allowed_days","special_shift_allow_multiple_days","special_shift_max_allowed_days","is_general_type_of_work","is_night_type_of_work","is_special_type_of_work","special_shift_from","general_from_time_editable","general_to_time_editable","gen_max_dur_from_time","gen_max_dur_to_time","general_title","special_from_time_editable","special_to_time_editable","spl_max_dur_from_time","spl_max_dur_to_time","special_title","ngt_max_dur_from_time","ngt_max_dur_to_time","night_from_time_editable","night_to_time_editable","night_title","edit_actual_start_dt","edit_actual_end_dt","is_enable_type_of_work","type_of_work_access_level","is_enable_department","department_access_level","special_shift_to","general_shift_from","general_shift_to","night_shift_from","night_shift_to","work_location","is_parts_required","is_prepared_required","is_ehs_required","review_required","asset_type",("night_approval_authority_shift_id", ["id", "name",["member_ids", ["id", ("employee_id", ["id", "name"])]]]),("special_approval_authority_shift_id", ["id", "name",["member_ids", ["id", ("employee_id", ["id", "name"])]]]),("general_approval_authority_shift_id", ["id", "name",["member_ids", ["id", ("employee_id", ["id", "name"])]]]),"approved_button","approved_status","cancel_button","cancel_status","closed_button","closed_status","issued_permit_button","issued_permit_status","on_hold_button","on_hold_status","permit_rejected_button","permit_rejected_status","prepared_button","prepared_status","requested_button","requested_status","validated_button","validated_status","work_in_progress_button","work_in_progress_status"]';
  const payload = `["company_id","in",[${company}]]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_WP_CONFIG_DETAILS_INFO, GET_WP_CONFIG_DETAILS_INFO_SUCCESS, GET_WP_CONFIG_DETAILS_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getDepartmentsInfo(model, domain) {
  let payload = 'domain=[';
  if (domain) {
    payload = `domain=[${domain}`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name",("approval_authority_id",["id","name"]),("ehs_authority_id",["id","name"]),("security_office_id",["id","name"]),("issue_permit_approval_id",["id","name"])]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_WP_DEPARTMENTS_INFO, GET_WP_DEPARTMENTS_INFO_SUCCESS, GET_WP_DEPARTMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceOperationChecklistsInfo(id) {
  return {
    [CALL_API]: {
      endpoint: `order/operations?operations_ids=[${id}]`,
      types: [GET_MO_CHECKLISTS_INFO, GET_MO_CHECKLISTS_INFO_SUCCESS, GET_MO_CHECKLISTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTaskDetailsInfo(taskId) {
  const fields = '["id", "name", ["check_list_ids", ["id", ("check_list_id", ["id", ["activity_lines", ["id","name", "sequence", "type", ("mro_quest_grp_id", ["id", "name"]),"has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","is_multiple_line","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]]])]]]';
  return {
    [CALL_API]: {
      endpoint: `search/mro.task?model=mro.task&domain=[["id","=",${taskId}]]&fields=${fields}&offset=0&limit=1`,
      types: [GET_WP_TASK_DETAILS_INFO, GET_WP_TASK_DETAILS_INFO_SUCCESS, GET_WP_TASK_DETAILS_INFO_FAILURE],
      method: 'GET',
      taskId,
    },
  };
}

export function getIpTaskDetailsInfo(taskId) {
  return {
    [CALL_API]: {
      endpoint: `checklist/question?checklist_ids=[${taskId}]`,
      types: [GET_IP_TASK_DETAILS_INFO, GET_IP_TASK_DETAILS_INFO_SUCCESS, GET_IP_TASK_DETAILS_INFO_FAILURE],
      method: 'GET',
      taskId,
    },
  };
}

export function getMailLogsInfo(modelId, statusId) {
  const fields = '["id", "date", "subject", "email_to", "body", "state"]';
  return {
    [CALL_API]: {
      endpoint: `search/mro.work_permit_mail_logs?model=mro.work_permit_mail_logs&domain=[["res_id","=",${modelId}], ["res_status_id","=","${statusId}"]]&fields=${fields}&offset=0&limit=50`,
      types: [GET_MAIL_LOGS_DETAILS_INFO, GET_MAIL_LOGS_DETAILS_INFO_SUCCESS, GET_MAIL_LOGS_DETAILS_INFO_FAILURE],
      method: 'GET',
      modelId,
    },
  };
}
