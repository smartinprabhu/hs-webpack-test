import { CALL_API } from '../../middleware/api';
import visitRequestCustomData from './data/customData.json';

export const GET_VR_LIST_INFO = 'GET_VR_LIST_INFO';
export const GET_VR_LIST_INFO_SUCCESS = 'GET_VR_LIST_INFO_SUCCESS';
export const GET_VR_LIST_INFO_FAILURE = 'GET_VR_LIST_INFO_FAILURE';

export const GET_VR_COUNT_INFO = 'GET_VR_COUNT_INFO';
export const GET_VR_COUNT_INFO_SUCCESS = 'GET_VR_COUNT_INFO_SUCCESS';
export const GET_VR_COUNT_INFO_FAILURE = 'GET_VR_COUNT_INFO_FAILURE';

export const GET_VR_EXPORT_LIST_INFO = 'GET_VR_EXPORT_LIST_INFO';
export const GET_VR_EXPORT_LIST_INFO_SUCCESS = 'GET_VR_EXPORT_LIST_INFO_SUCCESS';
export const GET_VR_EXPORT_LIST_INFO_FAILURE = 'GET_VR_EXPORT_LIST_INFO_FAILURE';

export const GET_VR_DETAILS_INFO = 'GET_VR_DETAILS_INFO';
export const GET_VR_DETAILS_INFO_SUCCESS = 'GET_VR_DETAILS_INFO_SUCCESS';
export const GET_VR_DETAILS_INFO_FAILURE = 'GET_VR_DETAILS_INFO_FAILURE';

export const GET_VM_DASHBOARD_INFO = 'GET_VM_DASHBOARD_INFO';
export const GET_VM_DASHBOARD_INFO_SUCCESS = 'GET_VM_DASHBOARD_INFO_SUCCESS';
export const GET_VM_DASHBOARD_INFO_FAILURE = 'GET_VM_DASHBOARD_INFO_FAILURE';

export const GET_VR_STATE_CHANGE_INFO = 'GET_VR_STATE_CHANGE_INFO';
export const GET_VR_STATE_CHANGE_INFO_SUCCESS = 'GET_VR_STATE_CHANGE_INFO_SUCCESS';
export const GET_VR_STATE_CHANGE_INFO_FAILURE = 'GET_VR_STATE_CHANGE_INFO_FAILURE';

export const CREATE_VR_INFO = 'CREATE_VR_INFO';
export const CREATE_VR_INFO_SUCCESS = 'CREATE_VR_INFO_SUCCESS';
export const CREATE_VR_INFO_FAILURE = 'CREATE_VR_INFO_FAILURE';

export const GET_ID_PROOF_INFO = 'GET_ID_PROOF_INFO';
export const GET_ID_PROOF_INFO_SUCCESS = 'GET_ID_PROOF_INFO_SUCCESS';
export const GET_ID_PROOF_INFO_FAILURE = 'GET_ID_PROOF_INFO_FAILURE';

export const GET_VISITOR_TYPE_INFO = 'GET_VISITOR_TYPE_INFO';
export const GET_VISITOR_TYPE_INFO_SUCCESS = 'GET_VISITOR_TYPE_INFO_SUCCESS';
export const GET_VISITOR_TYPE_INFO_FAILURE = 'GET_VISITOR_TYPE_INFO_FAILURE';

export const GET_ASSET_DETAIL_INFO = 'GET_ASSET_DETAIL_INFO';
export const GET_ASSET_DETAIL_INFO_SUCCESS = 'GET_ASSET_DETAIL_INFO_SUCCESS';
export const GET_ASSET_DETAIL_INFO_FAILURE = 'GET_ASSET_DETAIL_INFO_FAILURE';

export const GET_ASSET_TYPE_INFO = 'GET_ASSET_TYPE_INFO';
export const GET_ASSET_TYPE_INFO_SUCCESS = 'GET_ASSET_TYPE_INFO_SUCCESS';
export const GET_ASSET_TYPE_INFO_FAILURE = 'GET_ASSET_TYPE_INFO_FAILURE';

export const GET_HOST_COMPANY_INFO = 'GET_HOST_COMPANY_INFO';
export const GET_HOST_COMPANY_INFO_SUCCESS = 'GET_HOST_COMPANY_INFO_SUCCESS';
export const GET_HOST_COMPANY_INFO_FAILURE = 'GET_HOST_COMPANY_INFO_FAILURE';

export const GET_HC_GROUP_INFO = 'GET_HC_GROUP_INFO';
export const GET_HC_GROUP_INFO_SUCCESS = 'GET_HC_GROUP_INFO_SUCCESS';
export const GET_HC_GROUP_INFO_FAILURE = 'GET_HC_GROUP_INFO_FAILURE';

export const GET_VISITOR_TYPE_GROUP_INFO = 'GET_VISITOR_TYPE_GROUP_INFO';
export const GET_VISITOR_TYPE_GROUP_INFO_SUCCESS = 'GET_VISITOR_TYPE_GROUP_INFO_SUCCESS';
export const GET_VISITOR_TYPE_GROUP_INFO_FAILURE = 'GET_VISITOR_TYPE_GROUP_INFO_FAILURE';

export const GET_VMS_CONFIG_LIST = 'GET_VMS_CONFIG_LIST';
export const GET_VMS_CONFIG_SUCCESS_LIST = 'GET_VMS_CONFIG_SUCCESS_LIST';
export const GET_VMS_CONFIG_FAILURE_LIST = 'GET_VMS_CONFIG_FAILURE_LIST';

export const GET_VMS_CONFIGUARATION_INFO = 'GET_VMS_CONFIGUARATION_INFO';
export const GET_VMS_CONFIGUARATION_INFO_SUCCESS = 'GET_VMS_CONFIGUARATION_INFO_SUCCESS';
export const GET_VMS_CONFIGUARATION_INFO_FAILURE = 'GET_VMS_CONFIGUARATION_INFO_FAILURE';

export const UPDATE_TIME_ELAPSED = 'UPDATE_TIME_ELAPSED';
export const UPDATE_TIME_ELAPSED_SUCCESS = 'UPDATE_TIME_ELAPSED_SUCCESS';
export const UPDATE_TIME_ELAPSED_FAILURE = 'UPDATE_TIME_ELAPSED_FAILURE';

export const GET_VISITOR_LOG = 'GET_VISITOR_LOG';
export const GET_VISITOR_LOG_SUCCESS = 'GET_VISITOR_LOG_SUCCESS';
export const GET_VISITOR_LOG_FAILURE = 'GET_VISITOR_LOG_FAILURE';

export const GET_SLOGS_COUNT_INFO = 'GET_SLOGS_COUNT_INFO';
export const GET_SLOGS_COUNT_INFO_SUCCESS = 'GET_SLOGS_COUNT_INFO_SUCCESS';
export const GET_SLOGS_COUNT_INFO_FAILURE = 'GET_SLOGS_COUNT_INFO_FAILURE';

export const getVisitorLog = (company, model, apiFields, keyword, onClickYes) => {
  let payload = `domain=[["company_id","in",[${company}]],["name", "!=", false],["is_visitor","=",true]`;
  if (keyword && keyword.length && !onClickYes) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["email","ilike","${keyword}"],["phone","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(apiFields)}&&limit=10`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VISITOR_LOG, GET_VISITOR_LOG_SUCCESS, GET_VISITOR_LOG_FAILURE],
      method: 'GET',
    },
  };
};

export function timeElapsedDetailsInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_TIME_ELAPSED, UPDATE_TIME_ELAPSED_SUCCESS, UPDATE_TIME_ELAPSED_FAILURE],
      method: 'PUT',
      payload: {
        ids: `[${id}]`, values: result,
      },
    },
  };
}

export const getVmsConfigList = (company, model) => {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VMS_CONFIG_LIST, GET_VMS_CONFIG_SUCCESS_LIST, GET_VMS_CONFIG_FAILURE_LIST],
      method: 'GET',
    },
  };
};

export const getVmsConfigurationInfo = (companyId, model) => ({
  [CALL_API]: {
    endpoint: `search_read?model=${model}&domain=[["company_id","in",[${companyId}]]]&fields=["is_allow_visitor_assets","allowed_sites_ids","uuid","web_encoded_url","has_purpose","allow_frequent_visits","max_days_allowed_for_a_frequent_visit","close_visit_request_by","visitor_allowed_asset_ids","visitor_types","visitor_allowed_asset_ids","has_host_email","has_host_name","has_host_company","allow_gallery_images","has_visitor_type","has_visitor_mobile","has_visitor_company","has_visitor_email","has_identity_proof","has_vistor_id_details","has_photo"]&offset=0&limit=1`,
    types: [GET_VMS_CONFIGUARATION_INFO, GET_VMS_CONFIGUARATION_INFO_SUCCESS, GET_VMS_CONFIGUARATION_INFO_FAILURE],
    method: 'GET',
  },
});

export function getVisitorRequestListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = visitRequestCustomData && visitRequestCustomData.listFieldsVR ? visitRequestCustomData.listFieldsVR : [];
  const fieldsnew = '["id","organization","type_of_visitor","host_name","entry_status","actual_in","actual_out","visitor_name","state","name","planned_in","planned_out","visitor_badge","time_elapsed_reason","purpose","email","phone",("purpose_id", ["id", "name"]),("tenant_id", ["id", "name"]),("company_id", ["id", "name"]),("allowed_sites_id", ["id", "name"]),["additional_fields_ids", ["id","name","value"]]]';
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["visitor_name","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${fieldsnew || JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VR_LIST_INFO, GET_VR_LIST_INFO_SUCCESS, GET_VR_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorRequestListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  const fieldsnew = '["id","organization","type_of_visitor","host_name","entry_status","actual_in","actual_out","visitor_name","state","name","planned_in","planned_out","visitor_badge","time_elapsed_reason","purpose","email","phone",("purpose_id", ["id", "name"]),("tenant_id", ["id", "name"]),("company_id", ["id", "name"]),("allowed_sites_id", ["id", "name"]),["additional_fields_ids", ["id","name","value"]]]';

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${fieldsnew || JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VR_EXPORT_LIST_INFO, GET_VR_EXPORT_LIST_INFO_SUCCESS, GET_VR_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorRequestCountInfo(company, model, customFilters, globalFilter, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["visitor_name","ilike","${keyword}"]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VR_COUNT_INFO, GET_VR_COUNT_INFO_SUCCESS, GET_VR_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorRequestDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_VR_DETAILS_INFO, GET_VR_DETAILS_INFO_SUCCESS, GET_VR_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getVmDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Visitor Pass`,
      types: [GET_VM_DASHBOARD_INFO, GET_VM_DASHBOARD_INFO_SUCCESS, GET_VM_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function visitStateChangeInfo(id, state, modelName, contex, isUpdate, result) {
  let payload = {};
  let endPoint = 'call';
  if (contex) {
    payload = {
      ids: `[${id}]`, model: modelName, method: state, context: contex,
    };
  } else if (isUpdate) {
    payload = {
      ids: `[${id}]`, values: result,
    };
    endPoint = `write/${modelName}`;
  } else {
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_VR_STATE_CHANGE_INFO, GET_VR_STATE_CHANGE_INFO_SUCCESS, GET_VR_STATE_CHANGE_INFO_SUCCESS],
      method: isUpdate ? 'PUT' : 'POST',
      payload,
    },
  };
}

export function updateProductCategoryInfoNoLoad(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [GET_VR_STATE_CHANGE_INFO, GET_VR_STATE_CHANGE_INFO_SUCCESS, GET_VR_STATE_CHANGE_INFO_SUCCESS],
      method: 'PUT',
      payload,
    },
  };
}

export function createVisitRequestInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_VR_INFO, CREATE_VR_INFO_SUCCESS, CREATE_VR_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getIdProofInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ID_PROOF_INFO, GET_ID_PROOF_INFO_SUCCESS, GET_ID_PROOF_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorTypesInfo(company, model, keyword, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VISITOR_TYPE_INFO, GET_VISITOR_TYPE_INFO_SUCCESS, GET_VISITOR_TYPE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetsDetailInfo(model, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;
  payload = `${payload}]&model=${model}&fields=["visitor_asset_name","asset_quantity","remarks"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ASSET_DETAIL_INFO, GET_ASSET_DETAIL_INFO_SUCCESS, GET_ASSET_DETAIL_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetTypesInfo(company, model, keyword, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ASSET_TYPE_INFO, GET_ASSET_TYPE_INFO_SUCCESS, GET_ASSET_TYPE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHostCompanyInfo(company, model, keyword, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HOST_COMPANY_INFO, GET_HOST_COMPANY_INFO_SUCCESS, GET_HOST_COMPANY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHostCompanyGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["allowed_sites_id","!=",false]]&model=${model}&fields=["allowed_sites_id"]&groupby=["allowed_sites_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_HC_GROUP_INFO, GET_HC_GROUP_INFO_SUCCESS, GET_HC_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitorTypeGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["type_of_visitor","!=",false]]&model=${model}&fields=["type_of_visitor"]&groupby=["type_of_visitor"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_VISITOR_TYPE_GROUP_INFO, GET_VISITOR_TYPE_GROUP_INFO_SUCCESS, GET_VISITOR_TYPE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStatusLogsInfo(ids, model, limit) {
  let payload = `domain=[["id","in",[${ids}]]`;
  payload = `${payload}]&fields=["status","date","description"]&model=${model}&offset=0&limit=${limit}`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLOGS_COUNT_INFO, GET_SLOGS_COUNT_INFO_SUCCESS, GET_SLOGS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
