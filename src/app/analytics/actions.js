/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import AuthService from '../util/authService';

export const GET_ANALYTICS_INFO = 'GET_ANALYTICS_INFO';
export const GET_ANALYTICS_INFO_SUCCESS = 'GET_ANALYTICS_INFO_SUCCESS';
export const GET_ANALYTICS_INFO_FAILURE = 'GET_ANALYTICS_INFO_FAILURE';

export const GET_NATIVE_DASHBOARD_INFO = 'GET_NATIVE_DASHBOARD_INFO';
export const GET_NATIVE_DASHBOARD_INFO_SUCCESS = 'GET_NATIVE_DASHBOARD_INFO_SUCCESS';
export const GET_NATIVE_DASHBOARD_INFO_FAILURE = 'GET_NATIVE_DASHBOARD_INFO_FAILURE';

export const GET_NINJA_DASHBOARD_INFO = 'GET_NINJA_DASHBOARD_INFO';
export const GET_NINJA_DASHBOARD_INFO_SUCCESS = 'GET_NINJA_DASHBOARD_INFO_SUCCESS';
export const GET_NINJA_DASHBOARD_INFO_FAILURE = 'GET_NINJA_DASHBOARD_INFO_FAILURE';

export const GET_NINJA_DASHBOARD_ITEM_INFO = 'GET_NINJA_DASHBOARD_ITEM_INFO';
export const GET_NINJA_DASHBOARD_ITEM_INFO_SUCCESS = 'GET_NINJA_DASHBOARD_ITEM_INFO_SUCCESS';
export const GET_NINJA_DASHBOARD_ITEM_INFO_FAILURE = 'GET_NINJA_DASHBOARD_ITEM_INFO_FAILURE';

export const GET_ND_DETAILS_INFO = 'GET_ND_DETAILS_INFO';
export const GET_ND_DETAILS_INFO_SUCCESS = 'GET_ND_DETAILS_INFO_SUCCESS';
export const GET_ND_DETAILS_INFO_FAILURE = 'GET_ND_DETAILS_INFO_FAILURE';
export const GET_ND_DETAILS_FROM_CACHE = 'GET_ND_DETAILS_FROM_CACHE';

export const UPDATE_DASHBOARD_LAYOUT_INFO = 'UPDATE_DASHBOARD_LAYOUT_INFO';
export const UPDATE_DASHBOARD_LAYOUT_INFO_SUCCESS = 'UPDATE_DASHBOARD_LAYOUT_INFO_SUCCESS';
export const UPDATE_DASHBOARD_LAYOUT_INFO_FAILURE = 'UPDATE_DASHBOARD_LAYOUT_INFO_FAILURE';

export const GET_NINJA_DASHBOARD_TIMER_INFO = 'GET_NINJA_DASHBOARD_TIMER_INFO';
export const GET_NINJA_DASHBOARD_TIMER_INFO_SUCCESS = 'GET_NINJA_DASHBOARD_TIMER_INFO_SUCCESS';
export const GET_NINJA_DASHBOARD_TIMER_INFO_FAILURE = 'GET_NINJA_DASHBOARD_TIMER_INFO_FAILURE';

export const GET_ND_DRILL_DETAILS_INFO = 'GET_ND_DRILL_DETAILS_INFO';
export const GET_ND_DRILL_DETAILS_INFO_SUCCESS = 'GET_ND_DRILL_DETAILS_INFO_SUCCESS';
export const GET_ND_DRILL_DETAILS_INFO_FAILURE = 'GET_ND_DRILL_DETAILS_INFO_FAILURE';

export const GET_NINJA_DASHBOARD_TIMER_DRILL_INFO = 'GET_NINJA_DASHBOARD_TIMER_DRILL_INFO';
export const GET_NINJA_DASHBOARD_TIMER_DRILL_INFO_SUCCESS = 'GET_ND_DRILL_DETAILS_INFO_SUCCESS';
export const GET_NINJA_DASHBOARD_TIMER_DRILL_INFO_FAILURE = 'GET_ND_DRILL_DETAILS_INFO_FAILURE';

export const GET_NINJA_DASHBOARD_DRILL_INFO = 'GET_NINJA_DASHBOARD_DRILL_INFO';
export const GET_NINJA_DASHBOARD_DRILL_INFO_SUCCESS = 'GET_NINJA_DASHBOARD_DRILL_INFO_SUCCESS';
export const GET_NINJA_DASHBOARD_DRILL_INFO_FAILURE = 'GET_NINJA_DASHBOARD_DRILL_INFO_FAILURE';

export const GET_CHART_ITEM_DETAILS_INFO = 'GET_CHART_ITEM_DETAILS_INFO';
export const GET_CHART_ITEM_DETAILS_INFO_SUCCESS = 'GET_CHART_ITEM_DETAILS_INFO_SUCCESS';
export const GET_CHART_ITEM_DETAILS_INFO_FAILURE = 'GET_CHART_ITEM_DETAILS_INFO_FAILURE';

export const UPDATE_DASHBOARD_ITEM_INFO = 'UPDATE_DASHBOARD_ITEM_INFO';
export const UPDATE_DASHBOARD_ITEM_INFO_SUCCESS = 'UPDATE_DASHBOARD_ITEM_INFO_SUCCESS';
export const UPDATE_DASHBOARD_ITEM_INFO_FAILURE = 'UPDATE_DASHBOARD_ITEM_INFO_FAILURE';

export const GET_DC_DASHBOARD_INFO = 'GET_DC_DASHBOARD_INFO';
export const GET_DC_DASHBOARD_INFO_SUCCESS = 'GET_DC_DASHBOARD_INFO_SUCCESS';
export const GET_DC_DASHBOARD_INFO_FAILURE = 'GET_DC_DASHBOARD_INFO_FAILURE';

export const GET_SLD = 'GET_SLD';
export const GET_SLD_SUCCESS = 'GET_SLD_SUCCESS';
export const GET_SLD_FAILURE = 'GET_SLD_FAILURE';

export const GET_TREE_DASHBOARD_DETAILS_INFO = 'GET_TREE_DASHBOARD_DETAILS_INFO';
export const GET_TREE_DASHBOARD_DETAILS_INFO_SUCCESS = 'GET_TREE_DASHBOARD_DETAILS_INFO_SUCCESS';
export const GET_TREE_DASHBOARD_DETAILS_INFO_FAILURE = 'GET_TREE_DASHBOARD_DETAILS_INFO_FAILURE';

export const GET_ND_DETAILS_EXPAND_INFO = 'GET_ND_DETAILS_EXPAND_INFO';
export const GET_ND_DETAILS_EXPAND_INFO_SUCCESS = 'GET_ND_DETAILS_EXPAND_INFO_SUCCESS';
export const GET_ND_DETAILS_EXPAND_INFO_FAILURE = 'GET_ND_DETAILS_EXPAND_INFO_FAILURE';

export const GET_DEFAULT_FILTERS_INFO = 'GET_DEFAULT_FILTERS_INFO';
export const GET_DEFAULT_FILTERS_INFO_SUCCESS = 'GET_DEFAULT_FILTERS_INFO_SUCCESS';
export const GET_DEFAULT_FILTERS_INFO_FAILURE = 'GET_DEFAULT_FILTERS_INFO_FAILURE';

const isV3Dashboard = true;

export function getSldInfo(sldCode) {
  return {
    [CALL_API]: {
      endpoint: `sld/configuration?code=${sldCode}`,
      types: [GET_SLD, GET_SLD_SUCCESS, GET_SLD_FAILURE],
      method: 'GET',
    },
  };
}

export function getAnalyticsInfo(company, model, userRole) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload},["role_ids","in",[${userRole}]]`;
  payload = `${payload},["application","=","HSense"]`;
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ANALYTICS_INFO, GET_ANALYTICS_INFO_SUCCESS, GET_ANALYTICS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNativeDashboardInfo(start, end, dashboardId) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardId}`,
      types: [GET_NATIVE_DASHBOARD_INFO, GET_NATIVE_DASHBOARD_INFO_SUCCESS, GET_NATIVE_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getNinjaDashboardInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  const authService = AuthService();
  let payload = {
    method, model, args: [dashboardId], context,
  };
  let endPoint = `call/${model}/${method}`;

  const fields = '["name","ks_dashboard_menu_name","id","dashboard_json",["ks_dashboard_items_ids", ["id", ("ks_date_filter_field", ["id", "name"]), "name", "dashboard_item_json", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';

  code = isV3Dashboard ? `${code}V3` : code;

  if (isIot) {
    endPoint = 'warehouse/getDashboardv1';

    payload = {
      dashboard_code: code, uuid, token: authService.getAccessToken(), fields, context, company_info: userCompany ? JSON.stringify({ id: userCompany.id, name: userCompany.name, parent_id: userCompany.parent_id }) : false,
    };
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_NINJA_DASHBOARD_INFO, GET_NINJA_DASHBOARD_INFO_SUCCESS, GET_NINJA_DASHBOARD_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getNinjaDashboardTimerInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  const authService = AuthService();
  let payload = {
    method, model, args: [dashboardId], context,
  };
  let endPoint = `call/${model}/${method}`;

  const fields = '["name","ks_dashboard_menu_name","id","dashboard_json",["ks_dashboard_items_ids", ["id", "name", "dashboard_item_json", ("ks_date_filter_field", ["id", "name"]), ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';

  code = isV3Dashboard ? `${code}V3` : code;

  if (isIot) {
    endPoint = 'warehouse/getDashboardv1';

    payload = {
      dashboard_code: code, uuid, token: authService.getAccessToken(), fields, context, company_info: userCompany ? JSON.stringify({ id: userCompany.id, name: userCompany.name, parent_id: userCompany.parent_id }) : false,
    };
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_NINJA_DASHBOARD_TIMER_INFO, GET_NINJA_DASHBOARD_TIMER_INFO_SUCCESS, GET_NINJA_DASHBOARD_TIMER_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getNinjaDashboardItemInfo(method, model, dashboardId, domain, sequence, isIot, uuid) {
  const authService = AuthService();
  let payload = {
    method, model, args: [dashboardId, domain, sequence],
  };
  let endPoint = `call/${model}/${method}`;
  if (isIot) {
    payload = {
      uuid, token: authService.getAccessToken(), ids: `[${dashboardId}]`, domain, sequence,
    };
    endPoint = 'warehouse/drill_down_data';
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_NINJA_DASHBOARD_ITEM_INFO, GET_NINJA_DASHBOARD_ITEM_INFO_SUCCESS, GET_NINJA_DASHBOARD_ITEM_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getNinjaCodeInfo(id, modelName, operator, comsumptionDashboard, code) {
  return (dispatch, getState) => { // Convert to thunk
    const { analytics } = getState();
    const cacheKey = isV3Dashboard ? `${id}V3` : id; // isV3Dashboard is already defined in the file

    if (analytics.ninjaCodeCache && analytics.ninjaCodeCache[cacheKey]) {
      // Data found in cache
      dispatch({
        type: GET_ND_DETAILS_FROM_CACHE,
        payload: { data: analytics.ninjaCodeCache[cacheKey].data }, // Pass cacheKey in payload for reducer if needed, though reducer might already have it via action.id
        id: cacheKey, // Ensure action itself carries cacheKey if reducer needs it directly from action
      });
      return Promise.resolve(); // Prevent API call
    }

    // Data not in cache, proceed with API call
    const fields = '["name",("company_id",["name","id"]),"ks_dashboard_menu_name","id","ks_date_filter_selection","code","ks_set_interval","dashboard_json",["ks_dashboard_items_ids", ["id", "name", ("ks_date_filter_field", ["id", "name"]), "dashboard_item_json", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';
    
    let apiId = isV3Dashboard ? `${id}V3` : id; // This is the ID for the API endpoint if not overridden by 'code' param
    // The 'id' parameter to this function is the original dashboard code (e.g., "XYZ_Dashboard")
    // 'cacheKey' is this original 'id' potentially with "V3" (e.g., "XYZ_DashboardV3")
    // 'apiId' is also this original 'id' potentially with "V3", used for forming the API endpoint URL.

    let domainPayload = `["code","=","${apiId}"]`; // Default domain uses apiId (which is id + V3 or id)

    if (operator) {
      // If operator is present, domain uses the original 'id' (e.g. "XYZ_Dashboard"), not apiId or cacheKey
      domainPayload = `["code","${operator}",${JSON.stringify(id)}]`; 
    }
    // If 'code' parameter is present, it overrides the domain for search. This 'code' is a specific record ID.
    if (code) { 
      domainPayload = `["id","=",${code}]`;
    }

    let endpoint = `ninjadashboard/configuration?code=${apiId}&fields=${fields}`; // Default endpoint uses apiId
    if (comsumptionDashboard || code) { // if 'code' (param) or comsumptionDashboard, use search with domainPayload
      endpoint = `search/${modelName}?model=${modelName}&domain=[${domainPayload}]&fields=${fields}`;
    }

    dispatch({
      [CALL_API]: {
        endpoint,
        types: [GET_ND_DETAILS_INFO, GET_ND_DETAILS_INFO_SUCCESS, GET_ND_DETAILS_INFO_FAILURE],
        method: 'GET',
        id: cacheKey, // This 'id' is for the reducer to use the cacheKey for storing the data
      },
    });
  };
}

export function getNinjaCodeExpandInfo(id) {
  const fields = '["name",("company_id",["name","id"]),"ks_dashboard_menu_name","id","ks_date_filter_selection","code","ks_set_interval","dashboard_json",["ks_dashboard_items_ids", ["id", "name", ("ks_date_filter_field", ["id", "name"]), "dashboard_item_json", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';
  id = isV3Dashboard ? `${id}V3` : id;
  const endpoint = `ninjadashboard/configuration?code=${id}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint,
      types: [GET_ND_DETAILS_EXPAND_INFO, GET_ND_DETAILS_EXPAND_INFO_SUCCESS, GET_ND_DETAILS_EXPAND_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function updateDashboardLayoutsInfo(id, model, result, isIot, uuid, table) {
  const authService = AuthService();
  let payload = {
    ids: `[${id}]`, values: result,
  };
  let endPoint = `write/${model}`;
  let method = 'PUT';
  if (isIot) {
    payload = {
      uuid, token: authService.getAccessToken(), ids: `[${id}]`, values: result,
    };
    if (table) {
      payload = {
        uuid, token: authService.getAccessToken(), ids: `[${id}]`, model: table, values: result,
      };
    }
    endPoint = 'warehouse/dashboard';
    method = 'POST';
  }
  if (table) {
    payload = {
      uuid, token: authService.getAccessToken(), ids: `[${id}]`, model: table, values: result,
    };
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_DASHBOARD_LAYOUT_INFO, UPDATE_DASHBOARD_LAYOUT_INFO_SUCCESS, UPDATE_DASHBOARD_LAYOUT_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function getNinjaCodeDrillInfo(id, modelName, isIot, uuid) {
  const fields = '["name","ks_dashboard_menu_name","id","ks_date_filter_selection","code","ks_set_interval","dashboard_json",["ks_dashboard_items_ids", ["id", "name", ("ks_date_filter_field", ["id", "name"]), ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';
  const payload = `["id","=",${id}]`;
  let endpoint = `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`;

  if (isIot) {
    const authService = AuthService();
    endpoint = `public/api/v2/search?model=${modelName}&domain=[${payload}]&fields=${fields}&uuid=${uuid}&token=${authService.getAccessToken()}`;
  }

  return {
    [CALL_API]: {
      endpoint,
      types: [GET_ND_DRILL_DETAILS_INFO, GET_ND_DRILL_DETAILS_INFO_SUCCESS, GET_ND_DRILL_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getNinjaDashboardDrillInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  const authService = AuthService();
  let payload = {
    method, model, args: [dashboardId], context,
  };
  let endPoint = `call/${model}/${method}`;

  const fields = '["name","ks_dashboard_menu_name","id","dashboard_json",["ks_dashboard_items_ids", ["id", ("ks_date_filter_field", ["id", "name"]), "name", "dashboard_item_json", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';

  code = isV3Dashboard ? `${code}V3` : code;

  if (isIot) {
    endPoint = 'warehouse/getDashboardv1';

    payload = {
      dashboard_code: code, uuid, token: authService.getAccessToken(), fields, context, company_info: userCompany ? JSON.stringify({ id: userCompany.id, name: userCompany.name, parent_id: userCompany.parent_id }) : false,
    };
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_NINJA_DASHBOARD_DRILL_INFO, GET_NINJA_DASHBOARD_DRILL_INFO_SUCCESS, GET_NINJA_DASHBOARD_DRILL_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getNinjaDashboardTimerDrillInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  const authService = AuthService();
  let payload = {
    method, model, args: [dashboardId], context,
  };
  let endPoint = `call/${model}/${method}`;

  const fields = '["name","ks_dashboard_menu_name","id","dashboard_json",["ks_dashboard_items_ids", ["id", ("ks_date_filter_field", ["id", "name"]), "name", "dashboard_item_json", ("company_id", ["id", "name", ("state_id", ["id", "name"])]), ["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]]]';

  code = isV3Dashboard ? `${code}V3` : code;

  if (isIot) {
    endPoint = 'warehouse/getDashboardv1';

    payload = {
      dashboard_code: code, uuid, token: authService.getAccessToken(), fields, context, company_info: userCompany ? JSON.stringify({ id: userCompany.id, name: userCompany.name, parent_id: userCompany.parent_id }) : false,
    };
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_NINJA_DASHBOARD_TIMER_DRILL_INFO, GET_NINJA_DASHBOARD_TIMER_DRILL_INFO_SUCCESS, GET_NINJA_DASHBOARD_TIMER_DRILL_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getChartItemInfo(id, modelName) {
  const fields = '["action","code","id","name","ks_bar_chart_stacked","ks_chart_data","ks_dashboard_item_type","ks_domain","ks_description","title_x_axis","title_y_axis","x_axis_label","max_sequnce","ks_model_name","ks_chart_date_groupby","ks_data_calculation_type",["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]';
  const payload = `["id","=",${id}]`;

  const endpoint = `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fields}`;

  return {
    [CALL_API]: {
      endpoint,
      types: [GET_CHART_ITEM_DETAILS_INFO, GET_CHART_ITEM_DETAILS_INFO_SUCCESS, GET_CHART_ITEM_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTreeDashboardInfo(company, code) {
  const fields = '["code","id","name","dashboard_json","config_json"]';
  let payload = `["company_id","=",${company}]`;

  if (code) {
    payload = `${payload},["code","=","${code}"]`;
  }

  const endpoint = `search_read/hx.dashboard_tree?model=hx.dashboard_tree&domain=[${payload}]&fields=${fields}&limit=1&offset=0`;

  return {
    [CALL_API]: {
      endpoint,
      types: [GET_TREE_DASHBOARD_DETAILS_INFO, GET_TREE_DASHBOARD_DETAILS_INFO_SUCCESS, GET_TREE_DASHBOARD_DETAILS_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function updateDashboardItemInfo(id, model, result, isIot, uuid, table) {
  const authService = AuthService();
  let payload = {
    ids: `[${id}]`, values: result,
  };
  let endPoint = `write/${model}`;
  let method = 'PUT';

  if (isIot) {
    payload = {
      uuid, token: authService.getAccessToken(), ids: `[${id}]`, values: result,
    };
    endPoint = 'warehouse/dashboard';
    method = 'POST';
  }
  if (table) {
    payload = {
      uuid, token: authService.getAccessToken(), ids: `[${id}]`, model: table, values: result,
    };
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_DASHBOARD_ITEM_INFO, UPDATE_DASHBOARD_ITEM_INFO_SUCCESS, UPDATE_DASHBOARD_ITEM_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function getDcDashboardInfo(code, uuid) {
  const authService = AuthService();

  const fields = '["name","code","configuration"]';

  code = isV3Dashboard ? `${code}V3` : code;

  const endPoint = 'getanalyticdashboard/ASSET';

  const payload = {
    dashboard_code: code, uuid, token: authService.getAccessToken(), fields,
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_DC_DASHBOARD_INFO, GET_DC_DASHBOARD_INFO_SUCCESS, GET_DC_DASHBOARD_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getDefaultFilterInfo(modelName, uuid, dashboardCode, companyId, code) {
  const fields = '["name",("dw_company_id", ["id", "name"]),"domain"]';
  const payload = `["dashboard_code","=","${dashboardCode}V3"],["dw_company_id.parent_id","=",${companyId}],["dw_company_id.company_code","=","${code}"]`;
  const authService = AuthService();
  const endpoint = `public/api/v2/search?model=${modelName}&domain=[${payload}]&fields=${fields}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint,
      types: [GET_DEFAULT_FILTERS_INFO, GET_DEFAULT_FILTERS_INFO_SUCCESS, GET_DEFAULT_FILTERS_INFO_FAILURE],
      method: 'GET',
      modelName,
    },
  };
}
