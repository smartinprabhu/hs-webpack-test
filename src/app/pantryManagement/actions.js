import { CALL_API } from '../../middleware/api';
import fieldsData from './data/customData.json';
import fieldsDataConfig from './configuration/data/customData.json';
import { InventoryModule, PantryModule } from '../util/field';

export const GET_PANTRY_LIST_INFO = 'GET_PANTRY_LIST_INFO';
export const GET_PANTRY_LIST_INFO_SUCCESS = 'GET_PANTRY_LIST_INFO_SUCCESS';
export const GET_PANTRY_LIST_INFO_FAILURE = 'GET_PANTRY_LIST_INFO_FAILURE';

export const GET_PANTRY_EXPORT_LIST_INFO = 'GET_PANTRY_EXPORT_LIST_INFO';
export const GET_PANTRY_EXPORT_LIST_INFO_SUCCESS = 'GET_PANTRY_EXPORT_LIST_INFO_SUCCESS';
export const GET_PANTRY_EXPORT_LIST_INFO_FAILURE = 'GET_PANTRY_EXPORT_LIST_INFO_FAILURE';

export const GET_PANTRY_COUNT_INFO = 'GET_PANTRY_COUNT_INFO';
export const GET_PANTRY_COUNT_INFO_SUCCESS = 'GET_PANTRY_COUNT_INFO_SUCCESS';
export const GET_PANTRY_COUNT_INFO_FAILURE = 'GET_PANTRY_COUNT_INFO_FAILURE';

export const GET_PANTRY_DETAILS_INFO = 'GET_PANTRY_DETAILS_INFO';
export const GET_PANTRY_DETAILS_INFO_SUCCESS = 'GET_PANTRY_DETAILS_INFO_SUCCESS';
export const GET_PANTRY_DETAILS_INFO_FAILURE = 'GET_PANTRY_DETAILS_INFO_FAILURE';

export const GET_PANTRY_DASHBOARD_INFO = 'GET_PANTRY_DASHBOARD_INFO';
export const GET_PANTRY_DASHBOARD_INFO_SUCCESS = 'GET_PANTRY_DASHBOARD_INFO_SUCCESS';
export const GET_PANTRY_DASHBOARD_INFO_FAILURE = 'GET_PANTRY_DASHBOARD_INFO_FAILURE';

export const GET_EMPLOYEES_GROUP_INFO = 'GET_EMPLOYEES_GROUP_INFO';
export const GET_EMPLOYEES_GROUP_INFO_SUCCESS = 'GET_EMPLOYEES_GROUP_INFO_SUCCESS';
export const GET_EMPLOYEES_GROUP_INFO_FAILURE = 'GET_EMPLOYEES_GROUP_INFO_FAILURE';

export const GET_CP_LIST_INFO = 'GET_CP_LIST_INFO';
export const GET_CP_LIST_INFO_SUCCESS = 'GET_CP_LIST_INFO_SUCCESS';
export const GET_CP_LIST_INFO_FAILURE = 'GET_CP_LIST_INFO_FAILURE';

export const GET_CP_COUNT_INFO = 'GET_CP_COUNT_INFO';
export const GET_CP_COUNT_INFO_SUCCESS = 'GET_CP_COUNT_INFO_SUCCESS';
export const GET_CP_COUNT_INFO_FAILURE = 'GET_CP_COUNT_INFO_FAILURE';

export const GET_CP_DETAILS_INFO = 'GET_CP_DETAILS_INFO';
export const GET_CP_DETAILS_INFO_SUCCESS = 'GET_CP_DETAILS_INFO_SUCCESS';
export const GET_CP_DETAILS_INFO_FAILURE = 'GET_CP_DETAILS_INFO_FAILURE';

export const GET_PC_DETAILS_INFO = 'GET_PC_DETAILS_INFO';
export const GET_PC_DETAILS_INFO_SUCCESS = 'GET_PC_DETAILS_INFO_SUCCESS';
export const GET_PC_DETAILS_INFO_FAILURE = 'GET_PC_DETAILS_INFO_FAILURE';

export const CREATE_CP_INFO = 'CREATE_CP_INFO';
export const CREATE_CP_INFO_SUCCESS = 'CREATE_CP_INFO_SUCCESS';
export const CREATE_CP_INFO_FAILURE = 'CREATE_CP_INFO_FAILURE';

export const UPDATE_CP_INFO = 'UPDATE_CP_INFO';
export const UPDATE_CP_INFO_SUCCESS = 'UPDATE_CP_INFO_SUCCESS';
export const UPDATE_CP_INFO_FAILURE = 'UPDATE_CP_INFO_FAILURE';

export const GET_CP_EXPORT_LIST_INFO = 'GET_CP_EXPORT_LIST_INFO';
export const GET_CP_EXPORT_LIST_INFO_SUCCESS = 'GET_CP_EXPORT_LIST_INFO_SUCCESS';
export const GET_CP_EXPORT_LIST_INFO_FAILURE = 'GET_CP_EXPORT_LIST_INFO_FAILURE';

export const GET_PANTRY_ORDER_LINES = 'GET_PANTRY_ORDER_LINES';
export const GET_PANTRY_ORDER_LINES_SUCCESS = 'GET_PANTRY_ORDER_LINES_SUCCESS';
export const GET_PANTRY_ORDER_LINES_FAILURE = 'GET_PANTRY_ORDER_LINES_FAILURE';

export const GET_PANTRY_ORDER_OPERATION_INFO = 'GET_PANTRY_ORDER_OPERATION_INFO';
export const GET_PANTRY_ORDER_OPERATION_INFO_SUCCESS = 'GET_PANTRY_ORDER_OPERATION_INFO_SUCCESS';
export const GET_PANTRY_ORDER_OPERATION_INFO_FAILURE = 'GET_PANTRY_ORDER_OPERATION_INFO_FAILURE';

export const GET_PARENT_CATEGORY_INFO = 'GET_PARENT_CATEGORY_INFO';
export const GET_PARENT_CATEGORY_INFO_SUCCESS = 'GET_PARENT_CATEGORY_INFO_SUCCESS';
export const GET_PARENT_CATEGORY_INFO_FAILURE = 'GET_PARENT_CATEGORY_INFO_FAILURE';

export const GET_PC_LIST_INFO = 'GET_PC_LIST_INFO';
export const GET_PC_LIST_INFO_SUCCESS = 'GET_PC_LIST_INFO_SUCCESS';
export const GET_PC_LIST_INFO_FAILURE = 'GET_PC_LIST_INFO_FAILURE';

export const GET_PC_COUNT_INFO = 'GET_PC_COUNT_INFO';
export const GET_PC_COUNT_INFO_SUCCESS = 'GET_PC_COUNT_INFO_SUCCESS';
export const GET_PC_COUNT_INFO_FAILURE = 'GET_PC_COUNT_INFO_FAILURE';

export const GET_PC_EXPORT_LIST_INFO = 'GET_PC_EXPORT_LIST_INFO';
export const GET_PC_EXPORT_LIST_INFO_SUCCESS = 'GET_PC_EXPORT_LIST_INFO_SUCCESS';
export const GET_PC_EXPORT_LIST_INFO_FAILURE = 'GET_PC_EXPORT_LIST_INFO_FAILURE';

export const DELETE_INFO = 'DELETE_INFO';
export const DELETE_INFO_SUCCESS = 'DELETE_INFO_SUCCESS';
export const DELETE_INFO_FAILURE = 'DELETE_INFO_FAILURE';

export const GET_PC_INFO = 'GET_PC_INFO';
export const GET_PC_INFO_SUCCESS = 'GET_PC_INFO_SUCCESS';
export const GET_PC_INFO_FAILURE = 'GET_PC_INFO_FAILURE';

export const CREATE_PC_INFO = 'CREATE_PC_INFO';
export const CREATE_PC_INFO_SUCCESS = 'CREATE_PC_INFO_SUCCESS';
export const CREATE_PC_INFO_FAILURE = 'CREATE_PC_INFO_FAILURE';

export const UPDATE_PC_INFO = 'UPDATE_PC_INFO';
export const UPDATE_PC_INFO_SUCCESS = 'UPDATE_PC_INFO_SUCCESS';
export const UPDATE_PC_INFO_FAILURE = 'UPDATE_PC_INFO_FAILURE';

export const CREATE_PANTRY_ORDER_INFO = 'CREATE_PANTRY_ORDER_INFO';
export const CREATE_PANTRY_ORDER_INFO_SUCCESS = 'CREATE_PANTRY_ORDER_INFO_SUCCESS';
export const CREATE_PANTRY_ORDER_INFO_FAILURE = 'CREATE_PANTRY_ORDER_INFO_FAILURE';

export const UPDATE_PANTRY_ORDER_INFO = 'UPDATE_PANTRY_ORDER_INFO';
export const UPDATE_PANTRY_ORDER_INFO_SUCCESS = 'UPDATE_PANTRY_ORDER_INFO_SUCCESS';
export const UPDATE_PANTRY_ORDER_INFO_FAILURE = 'UPDATE_PANTRY_ORDER_INFO_FAILURE';

export const GET_PANTRY_SEARCH_INFO = 'GET_PANTRY_SEARCH_INFO';
export const GET_PANTRY_SEARCH_INFO_SUCCESS = 'GET_PANTRY_SEARCH_INFO_SUCCESS';
export const GET_PANTRY_SEARCH_INFO_FAILURE = 'GET_PANTRY_SEARCH_INFO_FAILURE';

export const GET_PANTRY_GROUP_INFO = 'GET_PANTRY_GROUP_INFO';
export const GET_PANTRY_GROUP_INFO_SUCCESS = 'GET_PANTRY_GROUP_INFO_SUCCESS';
export const GET_PANTRY_GROUP_INFO_FAILURE = 'GET_PANTRY_GROUP_INFO_FAILURE';

export const GET_ORDER_SPACE_GROUP_INFO = 'GET_ORDER_SPACE_GROUP_INFO';
export const GET_ORDER_SPACE_GROUP_INFO_SUCCESS = 'GET_ORDER_SPACE_GROUP_INFO_SUCCESS';
export const GET_ORDER_SPACE_GROUP_INFO_FAILURE = 'GET_ORDER_SPACE_GROUP_INFO_FAILURE';

export const GET_REPORTS_INFO = 'GET_REPORTS_INFO';
export const GET_REPORTS_INFO_SUCCESS = 'GET_REPORTS_INFO_SUCCESS';
export const GET_REPORTS_INFO_FAILURE = 'GET_REPORTS_INFO_FAILURE';

export const GET_PANTRY_NAME = 'GET_PANTRY_NAME';
export const GET_PANTRY_NAME_SUCCESS = 'GET_PANTRY_NAME_SUCCESS';
export const GET_PANTRY_NAME_FAILURE = 'GET_PANTRY_NAME_FAILURE';

export const CREATE_ESL_INFO = 'CREATE_ESL_INFO';
export const CREATE_ESL_INFO_SUCCESS = 'CREATE_ESL_INFO_SUCCESS';
export const CREATE_ESL_INFO_FAILURE = 'CREATE_ESL_INFO_FAILURE';

export const UPDATE_ESL_INFO = 'UPDATE_ESL_INFO';
export const UPDATE_ESL_INFO_SUCCESS = 'UPDATE_ESL_INFO_SUCCESS';
export const UPDATE_ESL_INFO_FAILURE = 'UPDATE_ESL_INFO_FAILURE';

export function getPantryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  const fields = PantryModule.ordersAPiFields;
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
      types: [GET_PANTRY_LIST_INFO, GET_PANTRY_LIST_INFO_SUCCESS, GET_PANTRY_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
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
      types: [GET_PANTRY_EXPORT_LIST_INFO, GET_PANTRY_EXPORT_LIST_INFO_SUCCESS, GET_PANTRY_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryCountInfo(company, model, customFilters, globalFilter, keyword) {
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
      types: [GET_PANTRY_COUNT_INFO, GET_PANTRY_COUNT_INFO_SUCCESS, GET_PANTRY_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryDetailInfo(id, modelName) {
  // eslint-disable-next-line max-len
  const fields = '["id","name","reason_for_cancellation_pantry","reason_for_cancellation","employee_name","employee_email","order_create_type",("employee_id", ["id", "name","work_email"]),("space_id", ["id", "name", "path_name","space_name"]),("pantry_id", ["id", "name"]),"ordered_on",("company_id", ["id", "name"]),("cancelled_by_id", ["id", "name"]),"reason_for_cancellation","state","confirmed_on","cancelled_on","delivered_on",["order_lines", ["id", ("product_id", ["id", "name"]), "ordered_qty", "delivered_qty", "confirmed_qty", "price", "reason_from_pantry", "notes_from_employee"]]]';

  return {
    [CALL_API]: {
      endpoint: `search/${modelName}?model=${modelName}&domain=[["id","=",${id}]]&fields=${fields}`,
      types: [GET_PANTRY_DETAILS_INFO, GET_PANTRY_DETAILS_INFO_SUCCESS, GET_PANTRY_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getPantryDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Pantry Dashboard`,
      types: [GET_PANTRY_DASHBOARD_INFO, GET_PANTRY_DASHBOARD_INFO_SUCCESS, GET_PANTRY_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getProductsGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["employee_id"]&groupby=["employee_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_EMPLOYEES_GROUP_INFO, GET_EMPLOYEES_GROUP_INFO_SUCCESS, GET_EMPLOYEES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConfigPantryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = PantryModule.pantryApiFields;
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
      types: [GET_CP_LIST_INFO, GET_CP_LIST_INFO_SUCCESS, GET_CP_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConfigPantrysCountInfo(company, model, customFilters, globalFilter) {
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
      types: [GET_CP_COUNT_INFO, GET_CP_COUNT_INFO_SUCCESS, GET_CP_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getConfigPantryInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_CP_DETAILS_INFO, GET_CP_DETAILS_INFO_SUCCESS, GET_CP_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function createConfigPantryInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_CP_INFO, CREATE_CP_INFO_SUCCESS, CREATE_CP_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateConfigPantryInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_CP_INFO, UPDATE_CP_INFO_SUCCESS, UPDATE_CP_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getConfigPantryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = 'domain=[["name","!=",false]';

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
      types: [GET_CP_EXPORT_LIST_INFO, GET_CP_EXPORT_LIST_INFO_SUCCESS, GET_CP_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryOrderLinesInfo(company, values, modelName) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["product_id","ordered_qty","confirmed_qty","delivered_qty","reason_from_pantry","notes_from_employee"]`;
  payload = `${payload}&limit=200&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PANTRY_ORDER_LINES, GET_PANTRY_ORDER_LINES_SUCCESS, GET_PANTRY_ORDER_LINES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getActionDataInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_PANTRY_ORDER_OPERATION_INFO, GET_PANTRY_ORDER_OPERATION_INFO_SUCCESS, GET_PANTRY_ORDER_OPERATION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getParentCategoryInfo(model) {
  const payload = `domain=[]&model=${model}&fields=[]&groupby=["parent_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PARENT_CATEGORY_INFO, GET_PARENT_CATEGORY_INFO_SUCCESS, GET_PARENT_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = InventoryModule.inventoryProductCategoryApiFields;
  let payload = 'domain=[["name","!=",false]';

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
      types: [GET_PC_LIST_INFO, GET_PC_LIST_INFO_SUCCESS, GET_PC_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductCategoryCountInfo(company, model, customFilters, globalFilter) {
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
      types: [GET_PC_COUNT_INFO, GET_PC_COUNT_INFO_SUCCESS, GET_PC_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = 'domain=[["name","!=",false]';

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

export function getProductCategoryInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_PC_DETAILS_INFO, GET_PC_DETAILS_INFO_SUCCESS, GET_PC_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getDeleteInfo(id, modelName, state) {
  let payload = {
    ids: `[${id}]`, model: modelName,
  };
  if(state){
    payload = {
      ids: `[${id}]`, model: modelName, method: state,
    };
  }
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_INFO, DELETE_INFO_SUCCESS, DELETE_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getPcInfo(model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["display_name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PC_INFO, GET_PC_INFO_SUCCESS, GET_PC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createProductCategoryInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_PC_INFO, CREATE_PC_INFO_SUCCESS, CREATE_PC_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateProductCategoryInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_PC_INFO, UPDATE_PC_INFO_SUCCESS, UPDATE_PC_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function createOrderInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_PANTRY_ORDER_INFO, CREATE_PANTRY_ORDER_INFO_SUCCESS, CREATE_PANTRY_ORDER_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateOrderInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_PANTRY_ORDER_INFO, UPDATE_PANTRY_ORDER_INFO_SUCCESS, UPDATE_PANTRY_ORDER_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getPantrySearchListInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["pantry_sequence","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","pantry_sequence","maintenance_team_id"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PANTRY_SEARCH_INFO, GET_PANTRY_SEARCH_INFO_SUCCESS, GET_PANTRY_SEARCH_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["pantry_id"]&groupby=["pantry_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PANTRY_GROUP_INFO, GET_PANTRY_GROUP_INFO_SUCCESS, GET_PANTRY_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["space_id"]&groupby=["space_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ORDER_SPACE_GROUP_INFO, GET_ORDER_SPACE_GROUP_INFO_SUCCESS, GET_ORDER_SPACE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllReportsList(company, customFilters, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  // eslint-disable-next-line max-len
  const fields = '["name",("employee_id", ["id", "name","work_email"]),("space_id", ["id", "name", "path_name","space_name"]),("pantry_id", ["id", "name"]),"ordered_on",("company_id", ["id", "name"]),"reason_for_cancellation","state","confirmed_on","cancelled_on","delivered_on",["order_lines", ["id", ("product_id", ["id", "name"]), "ordered_qty", "delivered_qty", "confirmed_qty", "price", "reason_from_pantry", "notes_from_employee"]]]';

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  } 
  payload = `${payload}]&model=${model}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_REPORTS_INFO, GET_REPORTS_INFO_SUCCESS, GET_REPORTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPantryNames(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&limit=100&offset=0&order=name ASC&fields=["name","id"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PANTRY_NAME, GET_PANTRY_NAME_SUCCESS, GET_PANTRY_NAME_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createEscalationLevelInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_ESL_INFO, CREATE_ESL_INFO_SUCCESS, CREATE_ESL_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateEscalationLevelInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_ESL_INFO, UPDATE_ESL_INFO_SUCCESS, UPDATE_ESL_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
