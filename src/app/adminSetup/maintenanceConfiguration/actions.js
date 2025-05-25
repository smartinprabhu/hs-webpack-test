/* eslint-disable max-len */
import { CALL_API } from '../../../middleware/api';
import maintenanceCustomData from './data/maintenanceData.json';

export const GET_PPM_SCHEDULE_INFO = 'GET_PPM_SCHEDULE_INFO';
export const GET_PPM_SCHEDULE_INFO_SUCCESS = 'GET_PPM_SCHEDULE_INFO_SUCCESS';
export const GET_PPM_SCHEDULE_INFO_FAILURE = 'GET_PPM_SCHEDULE_INFO_FAILURE';

export const GET_PPM_SCHEDULE_COUNT = 'GET_PPM_SCHEDULE_COUNT';
export const GET_PPM_SCHEDULE_COUNT_SUCCESS = 'GET_PPM_SCHEDULE_COUNT_SUCCESS';
export const GET_PPM_SCHEDULE_COUNT_FAILURE = 'GET_PPM_SCHEDULE_COUNT_FAILURE';

export const GET_CATEGORIES_GROUP_INFO = 'GET_CATEGORIES_GROUP_INFO';
export const GET_CATEGORIES_GROUP_INFO_SUCCESS = 'GET_CATEGORIES_GROUP_INFO_SUCCESS';
export const GET_CATEGORIES_GROUP_INFO_FAILURE = 'GET_CATEGORIES_GROUP_INFO_FAILURE';

export const GET_CHECKLIST_INFO = 'GET_CHECKLIST_INFO';
export const GET_CHECKLIST_INFO_SUCCESS = 'GET_CHECKLIST_INFO_SUCCESS';
export const GET_CHECKLIST_INFO_FAILURE = 'GET_CHECKLIST_INFO_FAILURE';

export const GET_CHECKLIST_COUNT = 'GET_CHECKLIST_COUNT';
export const GET_CHECKLIST_COUNT_SUCCESS = 'GET_CHECKLIST_COUNT_SUCCESS';
export const GET_CHECKLIST_COUNT_FAILURE = 'GET_CHECKLIST_COUNT_FAILURE';

export const GET_TOOLS_INFO = 'GET_TOOLS_INFO';
export const GET_TOOLS_INFO_SUCCESS = 'GET_TOOLS_INFO_SUCCESS';
export const GET_TOOLS_INFO_FAILURE = 'GET_TOOLS_INFO_FAILURE';

export const GET_TOOLS_COUNT = 'GET_TOOLS_COUNT';
export const GET_TOOLS_COUNT_SUCCESS = 'GET_TOOLS_COUNT_SUCCESS';
export const GET_TOOLS_COUNT_FAILURE = 'GET_TOOLS_COUNT_FAILURE';

export const GET_PARTS_INFO = 'GET_PARTS_INFO';
export const GET_PARTS_INFO_SUCCESS = 'GET_PARTS_INFO_SUCCESS';
export const GET_PARTS_INFO_FAILURE = 'GET_PARTS_INFO_FAILURE';

export const GET_PARTS_COUNT = 'GET_PARTS_COUNT';
export const GET_PARTS_COUNT_SUCCESS = 'GET_PARTS_COUNT_SUCCESS';
export const GET_PARTS_COUNT_FAILURE = 'GET_PARTS_COUNT_FAILURE';

export const UPDATE_TOOL_INFO = 'UPDATE_TOOL_INFO';
export const UPDATE_TOOL_INFO_SUCCESS = 'UPDATE_TOOL_INFO_SUCCESS';
export const UPDATE_TOOL_INFO_FAILURE = 'UPDATE_TOOL_INFO_FAILURE';

export const DELETE_CHECKLIST_INFO = 'DELETE_CHECKLIST_INFO';
export const DELETE_CHECKLIST_INFO_SUCCESS = 'DELETE_CHECKLIST_INFO_SUCCESS';
export const DELETE_CHECKLIST_INFO_FAILURE = 'DELETE_CHECKLIST_INFO_FAILURE';

export const DELETE_OPERATION_INFO = 'DELETE_OPERATION_INFO';
export const DELETE_OPERATION_INFO_SUCCESS = 'DELETE_OPERATION_INFO_SUCCESS';
export const DELETE_OPERATION_INFO_FAILURE = 'DELETE_OPERATION_INFO_FAILURE';

export const GET_OPERATIONS_EXPORT_INFO = 'GET_OPERATIONS_EXPORT_INFO';
export const GET_OPERATIONS_EXPORT_INFO_SUCCESS = 'GET_OPERATIONS_EXPORT_INFO_SUCCESS';
export const GET_OPERATIONS_EXPORT_INFO_FAILURE = 'GET_OPERATIONS_EXPORT_INFO_FAILURE';

export const GET_CHECKLIST_EXPORT_INFO = 'GET_CHECKLIST_EXPORT_INFO';
export const GET_CHECKLIST_EXPORT_INFO_SUCCESS = 'GET_CHECKLIST_EXPORT_INFO_SUCCESS';
export const GET_CHECKLIST_EXPORT_INFO_FAILURE = 'GET_CHECKLIST_EXPORT_INFO_FAILURE';

export const GET_TOOLS_EXPORT_INFO = 'GET_TOOLS_EXPORT_INFO';
export const GET_TOOLS_EXPORT_INFO_SUCCESS = 'GET_TOOLS_EXPORT_INFO_SUCCESS';
export const GET_TOOLS_EXPORT_INFO_FAILURE = 'GET_TOOLS_EXPORT_INFO_FAILURE';

export const GET_PARTS_EXPORT_INFO = 'GET_PARTS_EXPORT_INFO';
export const GET_PARTS_EXPORT_INFO_SUCCESS = 'GET_PARTS_EXPORT_INFO_SUCCESS';
export const GET_PARTS_EXPORT_INFO_FAILURE = 'GET_PARTS_EXPORT_INFO_FAILURE';

export const GET_EXPENSES_COUNT = 'GET_EXPENSES_COUNT';
export const GET_EXPENSES_COUNT_SUCCESS = 'GET_EXPENSES_COUNT_SUCCESS';
export const GET_EXPENSES_COUNT_FAILURE = 'GET_EXPENSES_COUNT_FAILURE';

export const GET_EXPENSES_INFO = 'GET_EXPENSES_INFO';
export const GET_EXPENSES_INFO_SUCCESS = 'GET_EXPENSES_INFO_SUCCESS';
export const GET_EXPENSES_INFO_FAILURE = 'GET_EXPENSES_INFO_FAILURE';

export const GET_EXPENSES_GROUP_INFO = 'GET_EXPENSES_GROUP_INFO';
export const GET_EXPENSES_GROUP_INFO_SUCCESS = 'GET_EXPENSES_GROUP_INFO_SUCCESS';
export const GET_EXPENSES_GROUP_INFO_FAILURE = 'GET_EXPENSES_GROUP_INFO_FAILURE';

export const GET_EXPENSES_DETAILS_INFO = 'GET_EXPENSES_DETAILS_INFO';
export const GET_EXPENSES_DETAILS_INFO_SUCCESS = 'GET_EXPENSES_DETAILS_INFO_SUCCESS';
export const GET_EXPENSES_DETAILS_INFO_FAILURE = 'GET_EXPENSES_DETAILS_INFO_FAILURE';

export const GET_EXPENSES_TYPE_INFO = 'GET_EXPENSES_TYPE_INFO';
export const GET_EXPENSES_TYPE_INFO_SUCCESS = 'GET_EXPENSES_TYPE_INFO_SUCCESS';
export const GET_EXPENSES_TYPE_INFO_FAILURE = 'GET_EXPENSES_TYPE_INFO_FAILURE';

export const GET_EXPENSES_EXPORT_INFO = 'GET_EXPENSES_EXPORT_INFO';
export const GET_EXPENSES_EXPORT_INFO_SUCCESS = 'GET_EXPENSES_EXPORT_INFO_SUCCESS';
export const GET_EXPENSES_EXPORT_INFO_FAILURE = 'GET_EXPENSES_EXPORT_INFO_FAILURE';

export const CREATE_EXPENSES_INFO = 'CREATE_EXPENSES_INFO';
export const CREATE_EXPENSES_INFO_SUCCESS = 'CREATE_EXPENSES_INFO_SUCCESS';
export const CREATE_EXPENSES_INFO_FAILURE = 'CREATE_EXPENSES_INFO_FAILURE';

export const UPDATE_EXPENSES_INFO = 'UPDATE_EXPENSES_INFO';
export const UPDATE_EXPENSES_INFO_SUCCESS = 'UPDATE_EXPENSES_INFO_SUCCESS';
export const UPDATE_EXPENSES_INFO_FAILURE = 'UPDATE_EXPENSES_INFO_FAILURE';

export const GET_EXPENSES_SUB_TYPE_INFO = 'GET_EXPENSES_SUB_TYPE_INFO';
export const GET_EXPENSES_SUB_TYPE_INFO_SUCCESS = 'GET_EXPENSES_SUB_TYPE_INFO_SUCCESS';
export const GET_EXPENSES_SUB_TYPE_INFO_FAILURE = 'GET_EXPENSES_SUB_TYPE_INFO_FAILURE';

export const CREATE_IMPORT_ID_INFO = 'CREATE_IMPORT_ID_INFO';
export const CREATE_IMPORT_ID_INFO_SUCCESS = 'CREATE_IMPORT_ID_INFO_SUCCESS';
export const CREATE_IMPORT_ID_INFO_FAILURE = 'CREATE_IMPORT_ID_INFO_FAILURE';

export const UPLOAD_IMPORT_INFO = 'UPLOAD_IMPORT_INFO';
export const UPLOAD_IMPORT_INFO_SUCCESS = 'UPLOAD_IMPORT_INFO_SUCCESS';
export const UPLOAD_IMPORT_INFO_FAILURE = 'UPLOAD_IMPORT_INFO_FAILURE';

export function getPPMListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  // if (states && states.length > 0) {
  //   payload = `${payload},["maintenance_type","in",${JSON.stringify(states)}]`;
  // }  
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["order_duration","type_category","company_id","name","maintenance_type","active","create_date"]&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PPM_SCHEDULE_INFO, GET_PPM_SCHEDULE_INFO_SUCCESS, GET_PPM_SCHEDULE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOperationsExportInfo(company, model, limit, offset, fields, states, customFilters, rows, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["maintenance_type","in",${JSON.stringify(states)}]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_OPERATIONS_EXPORT_INFO, GET_OPERATIONS_EXPORT_INFO_SUCCESS, GET_OPERATIONS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMCountInfo(company, model, states, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["maintenance_type","in",${JSON.stringify(states)}]`;
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
      types: [GET_PPM_SCHEDULE_COUNT, GET_PPM_SCHEDULE_COUNT_SUCCESS, GET_PPM_SCHEDULE_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["category_id"]&groupby=["category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORIES_GROUP_INFO, GET_CATEGORIES_GROUP_INFO_SUCCESS, GET_CATEGORIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCheckListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=["name","active","create_date","company_id"]&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHECKLIST_INFO, GET_CHECKLIST_INFO_SUCCESS, GET_CHECKLIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCheckListCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CHECKLIST_COUNT, GET_CHECKLIST_COUNT_SUCCESS, GET_CHECKLIST_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getToolsInfo(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["tool_cost_unit","name","order_id","active","create_date","company_id"]&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TOOLS_INFO, GET_TOOLS_INFO_SUCCESS, GET_TOOLS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getToolsCountInfo(company, model, statusValue, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_TOOLS_COUNT, GET_TOOLS_COUNT_SUCCESS, GET_TOOLS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPartsInfo(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue, menuType, globalFilter) {
  // const fields = maintenanceCustomData && maintenanceCustomData.viewFieldsParts ? maintenanceCustomData.viewFieldsParts : [];
  // eslint-disable-next-line max-len
  const fields = '["id","list_price", "name","standard_price","weight","volume","create_date","minimum_order_qty","maximum_order_qty", "new_until", "image_medium","active", ("company_id", ["id", "name"]),"type",("categ_id", ["id", "name", "display_name"]),("uom_id", ["id", "name"]),("uom_po_id", ["id", "name"]),["pantry_ids", ["id", "name"]]]';
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
  }
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }
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
      types: [GET_PARTS_INFO, GET_PARTS_INFO_SUCCESS, GET_PARTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPartsCountInfo(company, model, statusValue, customFilters, menuType, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
  }
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PARTS_COUNT, GET_PARTS_COUNT_SUCCESS, GET_PARTS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, menuType) {
  const fields = maintenanceCustomData && maintenanceCustomData.operationalExpenses ? maintenanceCustomData.operationalExpenses : [];
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
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
      types: [GET_EXPENSES_INFO, GET_EXPENSES_INFO_SUCCESS, GET_EXPENSES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesCountInfo(company, model, customFilters, menuType) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_EXPENSES_COUNT, GET_EXPENSES_COUNT_SUCCESS, GET_EXPENSES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUpdateToolInfo(id, modelName, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_TOOL_INFO, UPDATE_TOOL_INFO_SUCCESS, UPDATE_TOOL_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getDeleteChecklistInfo(id, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName,
  };
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_CHECKLIST_INFO, DELETE_CHECKLIST_INFO_SUCCESS, DELETE_CHECKLIST_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getDeleteOperationInfo(id, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName,
  };
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_OPERATION_INFO, DELETE_OPERATION_INFO_SUCCESS, DELETE_OPERATION_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getChecklistsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_CHECKLIST_EXPORT_INFO, GET_CHECKLIST_EXPORT_INFO_SUCCESS, GET_CHECKLIST_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getToolsExportInfo(company, model, limit, offset, fields, statusValue, customFilters, rows) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TOOLS_EXPORT_INFO, GET_TOOLS_EXPORT_INFO_SUCCESS, GET_TOOLS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPartsExportInfo(company, model, limit, offset, fields, statusValue, customFilters, rows, menuType, sortByValue, sortFieldValue) {
  const fieldsNew = '["id","list_price", "name","standard_price","weight","volume","create_date","minimum_order_qty","maximum_order_qty", "new_until", "image_medium","active", ("company_id", ["id", "name"]),"type",("categ_id", ["id", "name", "display_name"]),("uom_id", ["id", "name"]),("uom_po_id", ["id", "name"]),["pantry_ids", ["id", "name"]]]';

  let payload = `domain=[["company_id","in",[${company}]]`;

  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
  }
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (statusValue && statusValue === 'no') {
    payload = `${payload},["active","=",false]`;
  }
  if (statusValue && statusValue === 'all') {
    payload = `${payload},"|",["active","=",false],["active","=",true]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${fieldsNew}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PARTS_EXPORT_INFO, GET_PARTS_EXPORT_INFO_SUCCESS, GET_PARTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesTypeGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["type_id"]&groupby=["type_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_EXPENSES_GROUP_INFO, GET_EXPENSES_GROUP_INFO_SUCCESS, GET_EXPENSES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesDetailInfo(id, fields, model) {
  // eslint-disable-next-line max-len
  const payload = `domain=[["id","=",${id}]]&model=${model}&fields=["name","consumption","unit_cost","total_cost","from_date","to_date","description",("item_id",["id","name"]),("type_id", ["id", "name"]),("equipment_id", ["id", "name"])]&offset=0&limit=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EXPENSES_DETAILS_INFO, GET_EXPENSES_DETAILS_INFO_SUCCESS, GET_EXPENSES_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getExpensesTypesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXPENSES_TYPE_INFO, GET_EXPENSES_TYPE_INFO_SUCCESS, GET_EXPENSES_TYPE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesSubTypesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXPENSES_SUB_TYPE_INFO, GET_EXPENSES_SUB_TYPE_INFO_SUCCESS, GET_EXPENSES_SUB_TYPE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpensesExportInfo(company, model, limit, offset, fields, customFilters, rows, menuType) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (menuType && menuType === 'pantry_product') {
    payload = `${payload},["is_pantry_item","=",true]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXPENSES_EXPORT_INFO, GET_EXPENSES_EXPORT_INFO_SUCCESS, GET_EXPENSES_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createExpensesInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'create/mro.opex',
      types: [CREATE_EXPENSES_INFO, CREATE_EXPENSES_INFO_SUCCESS, CREATE_EXPENSES_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateExpensesInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_EXPENSES_INFO, UPDATE_EXPENSES_INFO_SUCCESS, UPDATE_EXPENSES_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function createImportIdInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_IMPORT_ID_INFO, CREATE_IMPORT_ID_INFO_SUCCESS, CREATE_IMPORT_ID_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function uploadImportInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [UPLOAD_IMPORT_INFO, UPLOAD_IMPORT_INFO_SUCCESS, UPLOAD_IMPORT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}
