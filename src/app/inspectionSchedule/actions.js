/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { CALL_API } from '../../middleware/api';
import { InspectionModule, HxInspCancelModule } from '../util/field';

export const GET_INSPECTION_LIST_INFO = 'GET_INSPECTION_LIST_INFO';
export const GET_INSPECTION_LIST_INFO_SUCCESS = 'GET_INSPECTION_LIST_INFO_SUCCESS';
export const GET_INSPECTION_LIST_INFO_FAILURE = 'GET_INSPECTION_LIST_INFO_FAILURE';

export const GET_INSPECTION_EXPORT_LIST_INFO = 'GET_INSPECTION_EXPORT_LIST_INFO';
export const GET_INSPECTION_EXPORT_LIST_INFO_SUCCESS = 'GET_INSPECTION_EXPORT_LIST_INFO_SUCCESS';
export const GET_INSPECTION_EXPORT_LIST_INFO_FAILURE = 'GET_INSPECTION_EXPORT_LIST_INFO_FAILURE';

export const GET_INSPECTION_COUNT_INFO = 'GET_INSPECTION_COUNT_INFO';
export const GET_INSPECTION_COUNT_INFO_SUCCESS = 'GET_INSPECTION_COUNT_INFO_SUCCESS';
export const GET_INSPECTION_COUNT_INFO_FAILURE = 'GET_INSPECTION_COUNT_INFO_FAILURE';

export const GET_INSPECTION_CHECKLIST_GROUP_INFO = 'GET_INSPECTION_CHECKLIST_GROUP_INFO';
export const GET_INSPECTION_CHECKLIST_GROUP_INFO_SUCCESS = 'GET_INSPECTION_CHECKLIST_GROUP_INFO_SUCCESS';
export const GET_INSPECTION_CHECKLIST_GROUP_INFO_FAILURE = 'GET_INSPECTION_CHECKLIST_GROUP_INFO_FAILURE';

export const GET_INS_CHECKLISTS_GROUP_INFO = 'GET_INS_CHECKLISTS_GROUP_INFO';
export const GET_INS_CHECKLISTS_GROUP_INFO_SUCCESS = 'GET_INS_CHECKLISTS_GROUP_INFO_SUCCESS';
export const GET_INS_CHECKLISTS_GROUP_INFO_FAILURE = 'GET_INS_CHECKLISTS_GROUP_INFO_FAILURE';

export const GET_CUSTOM_DATA_GROUP_INFO = 'GET_CUSTOM_DATA_GROUP_INFO';
export const GET_CUSTOM_DATA_GROUP_INFO_SUCCESS = 'GET_CUSTOM_DATA_GROUP_INFO_SUCCESS';
export const GET_CUSTOM_DATA_GROUP_INFO_FAILURE = 'GET_CUSTOM_DATA_GROUP_INFO_FAILURE';

export const GET_INSPECTION_DETAILS_INFO = 'GET_INSPECTION_DETAILS_INFO';
export const GET_INSPECTION_DETAILS_INFO_SUCCESS = 'GET_INSPECTION_DETAILS_INFO_SUCCESS';
export const GET_INSPECTION_DETAILS_INFO_FAILURE = 'GET_INSPECTION_DETAILS_INFO_FAILURE';

export const CREATE_INSPECTION_INFO = 'CREATE_INSPECTION_INFO';
export const CREATE_INSPECTION_INFO_SUCCESS = 'CREATE_INSPECTION_INFO_SUCCESS';
export const CREATE_INSPECTION_INFO_FAILURE = 'CREATE_INSPECTION_INFO_FAILURE';

export const GET_INSPECTION_SCHEDULER_DETAILS_INFO = 'GET_INSPECTION_SCHEDULER_DETAILS_INFO';
export const GET_INSPECTION_SCHEDULER_DETAILS_INFO_SUCCESS = 'GET_INSPECTION_SCHEDULER_DETAILS_INFO_SUCCESS';
export const GET_INSPECTION_SCHEDULER_DETAILS_INFO_FAILURE = 'GET_INSPECTION_SCHEDULER_DETAILS_INFO_FAILURE';

export const GET_INSPECTION_COMMENCED_DATE_INFO = 'GET_INSPECTION_COMMENCED_DATE_INFO';
export const GET_INSPECTION_COMMENCED_DATE_INFO_SUCCESS = 'GET_INSPECTION_COMMENCED_DATE_INFO_SUCCESS';
export const GET_INSPECTION_COMMENCED_DATE_INFO_FAILURE = 'GET_INSPECTION_COMMENCED_DATE_INFO_FAILURE';

export const GET_PPM_CHECKLIST_GROUP_INFO = 'GET_PPM_CHECKLIST_GROUP_INFO';
export const GET_PPM_CHECKLIST_GROUP_INFO_SUCCESS = 'GET_PPM_CHECKLIST_GROUP_INFO_SUCCESS';
export const GET_PPM_CHECKLIST_GROUP_INFO_FAILURE = 'GET_PPM_CHECKLIST_GROUP_INFO_FAILURE';

export const GET_PPM_WEEK_DETAILS_INFO = 'GET_PPM_WEEK_DETAILS_INFO';
export const GET_PPM_WEEK_DETAILS_INFO_SUCCESS = 'GET_PPM_WEEK_DETAILS_INFO_SUCCESS';
export const GET_PPM_WEEK_DETAILS_INFO_FAILURE = 'GET_PPM_WEEK_DETAILS_INFO_FAILURE';

export const GET_PPM_CHECKLIST_GROUP_COUNT_INFO = 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO';
export const GET_PPM_CHECKLIST_GROUP_COUNT_INFO_SUCCESS = 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO_SUCCESS';
export const GET_PPM_CHECKLIST_GROUP_COUNT_INFO_FAILURE = 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO_FAILURE';

export const GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO = 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO';
export const GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_SUCCESS = 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_SUCCESS';
export const GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_FAILURE = 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_FAILURE';

export const GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO = 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO';
export const GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_SUCCESS = 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_SUCCESS';
export const GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_FAILURE = 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_FAILURE';

export const GET_INSPECTION_PAGE_GROUP_EXPORT_INFO = 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO';
export const GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_SUCCESS = 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_SUCCESS';
export const GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_FAILURE = 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_FAILURE';

export const GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO = 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO';
export const GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_SUCCESS = 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_SUCCESS';
export const GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_FAILURE = 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_FAILURE';

export const GET_INSPECTION_STATUS_GROUP_INFO = 'GET_INSPECTION_STATUS_GROUP_INFO';
export const GET_INSPECTION_STATUS_GROUP_INFO_SUCCESS = 'GET_INSPECTION_STATUS_GROUP_INFO_SUCCESS';
export const GET_INSPECTION_STATUS_GROUP_INFO_FAILURE = 'GET_INSPECTION_STATUS_GROUP_INFO_FAILURE';

export const GET_INSPECTION_CHECKLISTS_INFO = 'GET_INSPECTION_CHECKLISTS_INFO';
export const GET_INSPECTION_CHECKLISTS_INFO_SUCCESS = 'GET_INSPECTION_CHECKLISTS_INFO_SUCCESS';
export const GET_INSPECTION_CHECKLISTS_INFO_FAILURE = 'GET_INSPECTION_CHECKLISTS_INFO_FAILURE';

export const GET_INSP_ORDER_INFO = 'GET_INSP_ORDER_INFO';
export const GET_INSP_ORDER_INFO_SUCCESS = 'GET_INSP_ORDER_INFO_SUCCESS';
export const GET_INSP_ORDER_INFO_FAILURE = 'GET_INSP_ORDER_INFO_FAILURE';

export const GET_PARENT_SCHEDULES_INFO = 'GET_PARENT_SCHEDULES_INFO';
export const GET_PARENT_SCHEDULES_INFO_SUCCESS = 'GET_PARENT_SCHEDULES_INFO_SUCCESS';
export const GET_PARENT_SCHEDULES_INFO_FAILURE = 'GET_PARENT_SCHEDULES_INFO_FAILURE';

export const GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO = 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO';
export const GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_SUCCESS = 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_SUCCESS';
export const GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_FAILURE = 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_FAILURE';

export const GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO = 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO';
export const GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_SUCCESS = 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_SUCCESS';
export const GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_FAILURE = 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_FAILURE';

export const GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO = 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO';
export const GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_SUCCESS = 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_SUCCESS';
export const GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_FAILURE = 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_FAILURE';

export const GET_HX_INSP_CANCEL_DETAILS_INFO = 'GET_HX_INSP_CANCEL_DETAILS_INFO';
export const GET_HX_INSP_CANCEL_DETAILS_INFO_SUCCESS = 'GET_HX_INSP_CANCEL_DETAILS_INFO_SUCCESS';
export const GET_HX_INSP_CANCEL_DETAILS_INFO_FAILURE = 'GET_HX_INSP_CANCEL_DETAILS_INFO_FAILURE';

export const GET_ASSET_PPM_SCHEDULES_INFO = 'GET_ASSET_PPM_SCHEDULES_INFO';
export const GET_ASSET_PPM_SCHEDULES_INFO_SUCCESS = 'GET_ASSET_PPM_SCHEDULES_INFO_SUCCESS';
export const GET_ASSET_PPM_SCHEDULES_INFO_FAILURE = 'GET_ASSET_PPM_SCHEDULES_INFO_FAILURE';

export function getInspectionCheckListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = InspectionModule.inspectionApiFields;
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
      types: [GET_INSPECTION_LIST_INFO, GET_INSPECTION_LIST_INFO_SUCCESS, GET_INSPECTION_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionCheckListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_INSPECTION_EXPORT_LIST_INFO, GET_INSPECTION_EXPORT_LIST_INFO_SUCCESS, GET_INSPECTION_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionCheckListCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_INSPECTION_COUNT_INFO, GET_INSPECTION_COUNT_INFO_SUCCESS, GET_INSPECTION_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionViewerGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, ids, limit, teamsList, enforceTime, inspectionGroup) {
  // eslint-disable-next-line max-len
  const group = 'group';
  const individual = 'individual';
  const fields = '["id","enforce_time","order_state","state","is_abnormal","group_name","start_datetime","end_datetime","category_type","order_name","maintenance_team_name","asset_id","asset_name","asset_number","asset_path","hx_inspection_uuid","review_status"]';
  let payload;
  if (start !== undefined && end !== undefined) {
    payload = `domain=[["company_id","in",[${company}]],["date",">=","${start}"],["date","<=","${end}"]`;
  } else {
    payload = `domain=[["company_id","in",[${company}]]`;
  }
  if (selectedFilter && selectedFilter.length) {
    const states = selectedFilter.filter((item) => item !== 'Abnormal');
    const abnormalData = selectedFilter.filter((item) => item === 'Abnormal');
    if (abnormalData && abnormalData.length && states && states.length) {
      payload = `${payload},"|"`;
    }
    if (abnormalData && abnormalData.length) {
      payload = `${payload},["is_abnormal","=",true]`;
    }
    if (states && states.length) {
      payload = `${payload},["state","in",${JSON.stringify(states)}]`;
    }
    if (teamsList && teamsList.length && selectedField !== 'maintenance_team_id') {
      payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
    }
    if (selectedField && groupFilters && groupFilters.length) {
      payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
    }
    if (ids && ids.length && (selectedField !== 'asset_name')) {
      payload = `${payload},["asset_id","in",${JSON.stringify(ids)}]`;
    }
  }
  if (selectedField && selectedField === 'equipment_id' && groupFilters && groupFilters.length) {
    payload = `${payload},["category_type","=","Equipment"]`;
  }
  if (selectedField && selectedField === 'space_id' && groupFilters && groupFilters.length) {
    payload = `${payload},["category_type","=","Space"]`;
  }
  if (enforceTime === 'enforce_time') {
    payload = `${payload},["enforce_time","=",true]`;
  } else if (enforceTime === 'no_enforce_time') {
    payload = `${payload},["enforce_time","=",false]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&offset=0&limit=${limit || 0}`;

  if (inspectionGroup === 'group_inspection') {
    payload = `${payload}&inspection_type=${group}`;
  } else if (inspectionGroup === 'individual_inspection') {
    payload = `${payload}&inspection_type=${individual}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INSPECTION_CHECKLIST_GROUP_INFO, GET_INSPECTION_CHECKLIST_GROUP_INFO_SUCCESS, GET_INSPECTION_CHECKLIST_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionChecklistsGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["group_id"]&groupby=["group_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_INS_CHECKLISTS_GROUP_INFO, GET_INS_CHECKLISTS_GROUP_INFO_SUCCESS, GET_INS_CHECKLISTS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCustomGroupInfo(company, model, field, id, companyType, isPpm, teamsList, isDate, start, end, isMonth) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  let methodName = 'read_group';

  if (isDate && isPpm) {
    payload = `${payload},["starts_on",">","${start}"],["ends_on","<${isMonth ? '' : '='}","${end}"]`;
  }

  if (isDate && !isPpm) {
    payload = `${payload},["date",">=","${start}"],["date","<=","${end}"]`;
  }

  if (field === 'space_id') {
    if (isPpm) {
      payload = `${payload},["category_type","=","ah"]`;
    } else {
      payload = `${payload},["category_type","=","Space"]`;
    }
  }

  if (field === 'equipment_id') {
    if (isPpm) {
      payload = `${payload},["category_type","=","e"]`;
    } else {
      payload = `${payload},["category_type","=","Equipment"]`;
    }
  }

  if (teamsList && teamsList.length && !isPpm && field !== 'maintenance_team_id') {
    payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
  }

  if (field === 'vendor_name') {
    payload = `${payload},["vendor_name","!=",false]]&model=${model}&fields=["${field}"]&groupby=["${field}"]`;
    methodName = 'read_group';
  } else {
    payload = `${payload}]&model=${model}&fields=["${field}"]&groupby=["${field}"]`;
  }

  if (field === 'maintenance_team_id') {
    if (companyType) {
      payload = `domain=[["company_id","in",[${company}]]]&model=employee.team.members&fields=["id",("maintenance_team_id",["id","name"])]&offset=0&limit=500`;
    } else {
      payload = `domain=[["company_id","in",[${company}]],["user_id","in",[${id}]]]&model=employee.team.members&fields=["id",("maintenance_team_id",["id","name"])]&offset=0&limit=3000`;
    }
    methodName = 'search';
  }
  return {
    [CALL_API]: {
      endpoint: `${methodName}?${payload}`,
      types: [GET_CUSTOM_DATA_GROUP_INFO, GET_CUSTOM_DATA_GROUP_INFO_SUCCESS, GET_CUSTOM_DATA_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionDetailInfo(company, model, id) {
  // eslint-disable-next-line max-len
  const fields = '["id","enforce_time",("check_list_id", ["id", "name",["activity_lines", ["id", "name", "type", "sequence",("mro_quest_grp_id", ["id", "name"])]]]),"order_state","state","start_datetime","end_datetime","category_type",("order_id", ["id", "name", "review_status", "date_start_execution", "date_execution", "reviewed_remark", "reviewed_on", ("employee_id", ["id", "name"]), ("reviewed_by", ["id", "name"]), ("create_uid", ["id", "name"]),"create_date","checklist_json_data",["check_list_ids", ["id", "answer_common", "answer_type", "write_date", "is_abnormal", ("mro_activity_id", ["id", "name"]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]),("maintenance_team_id", ["id", "name"]),("equipment_id", ["id", "name", "equipment_seq", ("location_id", ["id", "path_name"])]),("space_id", ["id", "name", "path_name","space_name","sequence_asset_hierarchy"]),("hx_inspection_list", ["id",("parent_id",["id","uuid"]),("group_id", ["id", "name"])])]';
  const payload = `domain=[["company_id","in",[${company}]],"|",["id","=",${id}],["order_id","=",${id}]]&model=${model}&fields=${fields}&offset=0&limit=1`;
  return {
    [CALL_API]: {
      endpoint: `read/${model}?ids=[${id}]&fields=[]`,
      types: [GET_INSPECTION_DETAILS_INFO, GET_INSPECTION_DETAILS_INFO_SUCCESS, GET_INSPECTION_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionSchedulertDetailInfo(id, modelName, modulename) {
  // eslint-disable-next-line max-len
  const fields = '["id","asset_number","commences_on","category_type","at_done_mro","at_review_mro","at_start_mro","mo","tu","we","th","fr","sa","su","starts_at","duration","priority","ends_on","remind_before","description","enforce_time","is_missed_alert","is_exclude_holidays","is_allow_past","is_allow_future","nfc_scan_at_done","nfc_scan_at_start","is_enable_time_tracking","max_duration","min_duration","qr_scan_at_done","qr_scan_at_start",("check_list_id", ["id", "name"]),("maintenance_team_id", ["id", "name"]),("region_id", ["id", "name"]),("equipment_id", ["id", "name", "equipment_seq", ("location_id", ["id", "path_name"]),("category_id", ["id", "name"])]),("space_id", ["id", "name", "path_name","space_name", "sequence_asset_hierarchy",("asset_category_id", ["id", "name"])]),("parent_id", ["id", ("group_id", ["id", "name"])]),("task_id", ["id", "name"]),("group_id", ["id", "name"]),("company_id", ["id", "name"]), ("recipients_id", ["id", "name"]),["date_range_ids", ["from_date", "to_date", "reason"]]]';
  let payload = `domain=[["id","=",${id}]]&model=${modelName}&fields=${fields}&offset=0&limit=1`;
  if (modulename === 'warehouse') {
    payload = `domain=[["uuid","=","${id}"]]&model=${modelName}&fields=${fields}&offset=0&limit=1`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_INSPECTION_SCHEDULER_DETAILS_INFO, GET_INSPECTION_SCHEDULER_DETAILS_INFO_SUCCESS, GET_INSPECTION_SCHEDULER_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function createInspectionInfo(result) {
  return {
    [CALL_API]: {
      endpoint: `create/${result.model ? result.model : 'hx.inspection_checklist'}`,
      types: [CREATE_INSPECTION_INFO, CREATE_INSPECTION_INFO_SUCCESS, CREATE_INSPECTION_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getInspectionCommenceDateInfo(company, modelName) {
  const fields = '["id","inspection_commenced_on","is_allow_cancellation_of_past_days","is_can_cancel","approval_required_for_cancel","cancel_approval_lead_days",("cancel_approval_authority", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])])]';
  return {
    [CALL_API]: {
      endpoint: `search?domain=[["company_id","in",[${company}]]]&model=${modelName}&fields=${fields}&offset=0&limit=1`,
      types: [GET_INSPECTION_COMMENCED_DATE_INFO, GET_INSPECTION_COMMENCED_DATE_INFO_SUCCESS, GET_INSPECTION_COMMENCED_DATE_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getPPMChecklistsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, isMonth, request) {
  // eslint-disable-next-line max-len
  const fields = '["id","asset_code","asset_id","is_pending_for_approval","is_rescheduled","is_cancellation_requested","compliance_type","is_on_hold_requested","is_service_report_required","asset_name","asset_path","is_signed_off","task_name","category_type","code","company_id","description","display_name","duration","enforce_time","escalation_matrix_id","maintenance_team_name","maintenance_year_id","order_id","order_name","order_state","review_status","schedule_period_name","starts_on","state","performed_by","ends_on","week","name","vendor_name","vendor_id"]';
  let payload = `domain=[["company_id","in",[${company}]],["starts_on",">","${start}"],["ends_on","<${isMonth ? '' : '='}","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    payload = `${payload},["state","in",${JSON.stringify(selectedFilter)}]`;
  }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${encodeURIComponent(JSON.stringify(groupFilters))}]`;
  }
  if (request && request.length > 0) {
    for (let i = 0; i < request.length; i += 1) {
      if (request[i] && request[i].label && request[i].label === 'Yes') {
        payload = `${payload},["${request[i].field}","=",true]`;
      }
      if (request[i] && request[i].label && request[i].label === 'No') {
        payload = `${payload},["${request[i].field}","!=",true]`;
      }
      if (request[i] && request[i].label && request[i].field === 'compliance_type') {
        payload = `${payload},["${request[i].field}","=","${request[i].label}"]`;
      }
    }
  }
  payload = `${payload}]&model=${model}&fields=${fields}&offset=${offset}&limit=${limit}`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PPM_CHECKLIST_GROUP_INFO, GET_PPM_CHECKLIST_GROUP_INFO_SUCCESS, GET_PPM_CHECKLIST_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMChecklistsCountInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, isMonth, request) {
  let payload = `domain=[["company_id","in",[${company}]],["starts_on",">","${start}"],["ends_on","<${isMonth ? '' : '='}","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    payload = `${payload},["state","in",${JSON.stringify(selectedFilter)}]`;
  }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${encodeURIComponent(JSON.stringify(groupFilters))}]`;
  }
  if (request && request.length > 0) {
    for (let i = 0; i < request.length; i += 1) {
      if (request[i] && request[i].label && request[i].label === 'Yes') {
        payload = `${payload},["${request[i].field}","=",true]`;
      }
      if (request[i] && request[i].label && request[i].label === 'No') {
        payload = `${payload},["${request[i].field}","!=",true]`;
      }
      if (request[i] && request[i].label && request[i].field === 'compliance_type') {
        payload = `${payload},["${request[i].field}","=","${request[i].label}"]`;
      }
    }
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PPM_CHECKLIST_GROUP_COUNT_INFO, GET_PPM_CHECKLIST_GROUP_COUNT_INFO_SUCCESS, GET_PPM_CHECKLIST_GROUP_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMDetailInfo(company, model, id, isEdit) {
  // eslint-disable-next-line max-len
  const fields = '["id","at_start_mro","at_done_mro","enforce_time","qr_scan_at_start","qr_scan_at_done","nfc_scan_at_start","nfc_scan_at_done","state","starts_on","ends_on","name","duration","category_type",("maintenance_team_id", ["id", "name"]),("equipment_id", ["id", "name", "equipment_seq", ("location_id", ["id", "path_name"]),("category_id", ["id", "name"])]),("space_id", ["id", "name", "path_name","space_name","sequence_asset_hierarchy",("asset_category_id", ["id", "name"])]),("task_id", ["id", "name",("category_id", ["id", "name"]),("asset_category_id", ["id", "name"])]),("schedule_period_id", ["id", "name"]),"performed_by","is_service_report_required",("maintenance_year_id", ["id", "name"]),("vendor_id", ["id", "name"])]';
  const payload = `domain=[["company_id","in",[${company}]],["id","=",${id}]]&model=${model}&fields=${fields}&offset=0&limit=1`;
  let endPoint = `read/${model}?ids=[${id}]&fields=[]`;
  if (isEdit) {
    endPoint = `search?${payload}`;
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_PPM_WEEK_DETAILS_INFO, GET_PPM_WEEK_DETAILS_INFO_SUCCESS, GET_PPM_WEEK_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionViewerGroupsCountInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamsList, ids, enforceTime, inspectionGroup) {
  const group = 'group';
  const individual = 'individual';
  let payload = `domain=[["company_id","in",[${company}]],["date",">=","${start}"],["date","<=","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    const states = selectedFilter.filter((item) => item !== 'Abnormal');
    const abnormalData = selectedFilter.filter((item) => item === 'Abnormal');
    if (teamsList && teamsList.length && selectedField !== 'maintenance_team_id') {
      payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
    }
    if (abnormalData && abnormalData.length && states && states.length) {
      payload = `${payload},"|"`;
    }
    if (abnormalData && abnormalData.length) {
      payload = `${payload},["is_abnormal","=",true]`;
    }
    if (states && states.length) {
      payload = `${payload},["state","in",${JSON.stringify(states)}]`;
    }
  }
  // if (
  //   ids &&
  //   ids.length &&
  //   selectedField !== "equipment_id" &&
  //   selectedField !== "space_id"
  // ) {
  //   payload = `${payload},"|",["equipment_id","in",${JSON.stringify(
  //     ids
  //   )}],["space_id","in",${JSON.stringify(ids)}]`;
  // }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }
  if (enforceTime === 'enforce_time') {
    payload = `${payload},["enforce_time","=",true]`;
  } else if (enforceTime === 'no_enforce_time') {
    payload = `${payload},["enforce_time","=",false]`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  if (inspectionGroup === 'group_inspection') {
    payload = `${payload}&inspection_type=${group}`;
  } else if (inspectionGroup === 'individual_inspection') {
    payload = `${payload}&inspection_type=${individual}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO, GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_SUCCESS, GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionViewerGroupsExportInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, teamsList, ids, enforceTime, inspectionGroup) {
  // eslint-disable-next-line max-len
  const fields = '["id","enforce_time","order_state","state","check_list_name","is_abnormal","group_name","start_datetime","end_datetime","category_type","order_name","maintenance_team_name","asset_id","asset_name","asset_number","asset_path","hx_inspection_list","date_start_execution","date_execution"]';
  const group = 'group';
  const individual = 'individual';
  let payload = `domain=[["company_id","in",[${company}]],["date",">=","${start}"],["date","<=","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    const states = selectedFilter.filter((item) => item !== 'Abnormal');
    const abnormalData = selectedFilter.filter((item) => item === 'Abnormal');
    if (teamsList && teamsList.length && selectedField !== 'maintenance_team_id') {
      payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
    }
    if (abnormalData && abnormalData.length && states && states.length) {
      payload = `${payload},"|"`;
    }
    if (abnormalData && abnormalData.length) {
      payload = `${payload},["is_abnormal","=",true]`;
    }
    if (states && states.length) {
      payload = `${payload},["state","in",${JSON.stringify(states)}]`;
    }
  }
  // if (
  //   ids &&
  //   ids.length &&
  //   selectedField !== "equipment_id" &&
  //   selectedField !== "space_id"
  // ) {
  //   payload = `${payload},"|",["equipment_id","in",${JSON.stringify(
  //     ids
  //   )}],["space_id","in",${JSON.stringify(ids)}]`;
  // }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(
      groupFilters,
    )}]`;
  }
  if (enforceTime === 'enforce_time') {
    payload = `${payload},["enforce_time","=",true]`;
  } else if (enforceTime === 'no_enforce_time') {
    payload = `${payload},["enforce_time","=",false]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&offset=${offset}&limit=${limit}`;

  if (inspectionGroup === 'group_inspection') {
    payload = `${payload}&inspection_type=${group}`;
  } else if (inspectionGroup === 'individual_inspection') {
    payload = `${payload}&inspection_type=${individual}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO, GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_SUCCESS, GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPageGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamsList, enforceTime, inspectionGroup) {
  const group = 'group';
  const individual = 'individual';
  let payload = `domain=[["company_id","in",[${company}]],["category_type","=","Equipment"],["equipment_id","!=",false],["date",">=","${start}"],["date","<=","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    const states = selectedFilter.filter((item) => item !== 'Abnormal');
    const abnormalData = selectedFilter.filter((item) => item === 'Abnormal');
    if (abnormalData && abnormalData.length && states && states.length) {
      payload = `${payload},"|"`;
    }
    if (abnormalData && abnormalData.length) {
      payload = `${payload},["is_abnormal","=",true]`;
    }
    if (states && states.length) {
      payload = `${payload},["state","in",${JSON.stringify(states)}]`;
    }
  }
  if (teamsList && teamsList.length && selectedField !== 'maintenance_team_id') {
    payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
  }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }
  if (enforceTime === 'enforce_time') {
    payload = `${payload},["enforce_time","=",true]`;
  } else if (enforceTime === 'no_enforce_time') {
    payload = `${payload},["enforce_time","=",false]`;
  }
  payload = `${payload}]&model=${model}&fields=["equipment_id"]&groupby=["equipment_id"]`;

  if (inspectionGroup === 'group_inspection') {
    payload = `${payload}&inspection_type=${group}`;
  } else if (inspectionGroup === 'individual_inspection') {
    payload = `${payload}&inspection_type=${individual}`;
  }
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_INSPECTION_PAGE_GROUP_EXPORT_INFO, GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_SUCCESS, GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPageSpaceGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamsList, enforceTime, inspectionGroup) {
  const group = 'group';
  const individual = 'individual';
  let payload = `domain=[["company_id","in",[${company}]],["asset_id","!=",false],["date",">=","${start}"],["date","<=","${end}"]`;
  if (selectedFilter && selectedFilter.length) {
    const states = selectedFilter.filter((item) => item !== 'Abnormal');
    const abnormalData = selectedFilter.filter((item) => item === 'Abnormal');
    if (abnormalData && abnormalData.length && states && states.length) {
      payload = `${payload},"|"`;
    }
    if (abnormalData && abnormalData.length) {
      payload = `${payload},["is_abnormal","=",true]`;
    }
    if (states && states.length) {
      payload = `${payload},["state","in",${JSON.stringify(states)}]`;
    }
  }
  if (teamsList && teamsList.length && selectedField !== 'maintenance_team_id') {
    payload = `${payload},["maintenance_team_id","in",${JSON.stringify(teamsList)}]`;
  }
  if (selectedField && groupFilters && groupFilters.length) {
    payload = `${payload},["${selectedField}","in",${JSON.stringify(groupFilters)}]`;
  }
  if (enforceTime === 'enforce_time') {
    payload = `${payload},["enforce_time","=",true]`;
  } else if (enforceTime === 'no_enforce_time') {
    payload = `${payload},["enforce_time","=",false]`;
  }
  payload = `${payload}]&model=${model}&fields=["asset_id"]&groupby=["asset_id"]`;

  if (inspectionGroup === 'group_inspection') {
    payload = `${payload}&inspection_type=${group}`;
  } else if (inspectionGroup === 'individual_inspection') {
    payload = `${payload}&inspection_type=${individual}`;
  }
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO, GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_SUCCESS, GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionStatusGroupsInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `hx/trend/dashboard?start_date=${start}&end_date=${end}`,
      types: [GET_INSPECTION_STATUS_GROUP_INFO, GET_INSPECTION_STATUS_GROUP_INFO_SUCCESS, GET_INSPECTION_STATUS_GROUP_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInspectionChecklistsInfo(id) {
  return {
    [CALL_API]: {
      endpoint: `hx/workorder/checklist/jsondata?order_id=${id}`,
      types: [GET_INSPECTION_CHECKLISTS_INFO, GET_INSPECTION_CHECKLISTS_INFO_SUCCESS, GET_INSPECTION_CHECKLISTS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getOrderDataInfo(id, modelName) {
  const fields = '["id","name","state","reviewed_on"]';

  const payload = `["hx_inspection_log_id","=",${id}],["state","=","done"]`;

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}&limit=1&order=id DESC`,
      types: [GET_INSP_ORDER_INFO, GET_INSP_ORDER_INFO_SUCCESS, GET_INSP_ORDER_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getParentSchdulesInfo(company, model, assetType, assetId, id, recId, targetModel, startDate, endDate) {
  let fields = '["id","starts_at","duration","category_type","ends_on",("maintenance_team_id", ["id", "name"]),("task_id", ["id", "name"]),("check_list_id", ["id", "name"]),("group_id", ["id", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "name","space_name","path_name"])]),("space_id", ["id", "name","space_name","path_name"])]';
  let payload = `[["company_id","in",[${company}]],`;
  if (!(recId && targetModel)) {
    if (!id) {
      if (typeof assetId === 'number') {
        if (assetType === 'Space') {
          payload = `${payload}["category_type","=","${assetType}"],["space_id","=",${assetId}]`;
        } else {
          payload = `${payload}["category_type","=","${assetType}"],["equipment_id","=",${assetId}]`;
        }
      } else if (typeof assetId === 'object') {
        if (assetType === 'Space') {
          payload = `${payload}["category_type","=","${assetType}"],["space_id","in",${JSON.stringify(assetId)}]`;
        } else {
          payload = `${payload}["category_type","=","${assetType}"],["equipment_id","in",${JSON.stringify(assetId)}]`;
        }
      }
      if (startDate && endDate) {
        payload = `${payload},"|","&",["ends_on",">=","${startDate}"],["ends_on","<=","${endDate}"],["ends_on", "=", false]`;
      }
    } else {
      payload = `${payload}["uuid","=","${id}"]`;
    }
  }

  if (recId && targetModel) {
    fields = '["id", ["date_range_ids", ["id","from_date","to_date"]]]';
    payload = `${payload}["rec_model","=","${targetModel}"],["rec_id","=",${recId}]`;
  }

  payload = `${payload}]`;
  const params = new URLSearchParams();
  params.set('domain', payload);
  params.set('model', model);
  params.set('fields', fields);
  params.set('offset', 0);
  const endPoint = `search?${params.toString()}`;

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_PARENT_SCHEDULES_INFO, GET_PARENT_SCHEDULES_INFO_SUCCESS, GET_PARENT_SCHEDULES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetPPMSchdulesInfo(company, model, assetType, assetId, id, startWeek, endWeek, recId, targetModel) {
  let fields = '["id","name","category_type","week","starts_on","ends_on","state",("maintenance_team_id", ["id", "name"]),("task_id", ["id", "name"]),("schedule_period_id", ["id", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "name","space_name","path_name"])]),("space_id", ["id", "name","space_name","path_name"])]';
  let payload = `domain=[["company_id","in",[${company}]],`;
  if (!(recId && targetModel)) {
    if (!id) {
      if (typeof assetId === 'number') {
        if (assetType === 'Space') {
          payload = `${payload}["category_type","=","ah"],["space_id","=",${assetId}]`;
        } else {
          payload = `${payload}["category_type","=","e"],["equipment_id","=",${assetId}]`;
        }
      } else if (typeof assetId === 'object') {
        if (assetType === 'Space') {
          payload = `${payload}["category_type","=","ah"],["space_id","in",${JSON.stringify(assetId)}]`;
        } else {
          payload = `${payload}["category_type","=","e"],["equipment_id","in",${JSON.stringify(assetId)}]`;
        }
      }
      if (startWeek && endWeek) {
        payload = `${payload},["state","!=","Completed"],["state","!=","Pause"],["state","!=","Cancelled"],["starts_on",">=","${startWeek}"],["starts_on","<=","${endWeek}"]`;
      }
    } else {
      payload = `${payload}["uuid","=","${id}"]`;
    }
  }

  if (recId && targetModel) {
    fields = '["id", ["ppm_scheduler_ids", ["id","name","category_type","week","starts_on","ends_on","state",("maintenance_team_id", ["id", "name"]),("task_id", ["id", "name"]),("schedule_period_id", ["id", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "name","space_name","path_name"])]),("space_id", ["id", "name","space_name","path_name"])]]]';
    payload = `${payload}["rec_model","=","${targetModel}"],["rec_id","=",${recId}]`;
  }

  payload = `${payload}]&model=${model}&fields=${fields}&offset=0`;
  const endPoint = `search?${payload}`;

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_ASSET_PPM_SCHEDULES_INFO, GET_ASSET_PPM_SCHEDULES_INFO_SUCCESS, GET_ASSET_PPM_SCHEDULES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxCancelRequestsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId) {
  const fields = HxInspCancelModule && HxInspCancelModule.apiFields ? HxInspCancelModule.apiFields : [];
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
  if (buttonFilterType && buttonFilterType === 'Holiday') {
    payload = `${payload},["is_cancel_for_all_assets","=",true]`;
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
      types: [GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO, GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_SUCCESS, GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxCancelRequestsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId) {
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
  if (buttonFilterType && buttonFilterType === 'Holiday') {
    payload = `${payload},["is_cancel_for_all_assets","=",true]`;
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
      types: [GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO, GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_SUCCESS, GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxCancelRequestsCountInfo(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId) {
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
  if (buttonFilterType && buttonFilterType === 'Holiday') {
    payload = `${payload},["is_cancel_for_all_assets","=",true]`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO, GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_SUCCESS, GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHxInspCancelDetailsInfo(id, modelName, isCheck, targetModel, targetId) {
  let fields = '["id","requested_on","expires_on","state","is_cancel_for_all_assets","from_date","to_date","reason","remarks","approved_on",("requested_by_id", ["id", "name"]),("company_id", ["id", "name"]),("approved_by_id", ["id", "name"]),["message_ids", ["id"]],("cancel_approval_authority", ["id", "type", "name",("role_id", ["id", "name"]),["users_ids", ["id", "name"]],"user_defined_email_ids",("team_members", ["id", "name", ["member_ids", ["id", ("employee_id", ["id", "name"]), ("user_id", ["id", "name"])]]])]),["date_range_ids", ["id","from_date","to_date","is_all_upcoming"]],["hx_inspection_ids", ["id", "category_type", "starts_at", "duration", ("group_id", ["id", "name"]),("task_id", ["id", "name"]),("check_list_id", ["id", "name"]),("equipment_id", ["id", "name",("location_id", ["id", "name","space_name","path_name"])]),("space_id", ["id", "name","space_name","path_name"])]]]';
  let payload = `["id","=",${id}]`;

  if (isCheck) {
    payload = `["rec_id","=",${id}],["rec_model","=","${targetModel}"]`;
    fields = '["id"]';
  }

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`,
      types: [GET_HX_INSP_CANCEL_DETAILS_INFO, GET_HX_INSP_CANCEL_DETAILS_INFO_SUCCESS, GET_HX_INSP_CANCEL_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}
