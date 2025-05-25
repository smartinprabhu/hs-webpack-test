/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import valuationCustomData from './reports/data/customData.json';
import configurationCustomData from './configuration/data/customData.json';
import { InventoryModule } from '../util/field';

export const GET_ADJUSTMENTS_INFO = 'GET_ADJUSTMENTS_INFO';
export const GET_ADJUSTMENTS_INFO_SUCCESS = 'GET_ADJUSTMENTS_INFO_SUCCESS';
export const GET_ADJUSTMENTS_INFO_FAILURE = 'GET_ADJUSTMENTS_INFO_FAILURE';

export const GET_ADJUSTMENTS_COUNT_INFO = 'GET_ADJUSTMENTS_COUNT_INFO';
export const GET_ADJUSTMENTS_COUNT_INFO_SUCCESS = 'GET_ADJUSTMENTS_COUNT_INFO_SUCCESS';
export const GET_ADJUSTMENTS_COUNT_INFO_FAILURE = 'GET_ADJUSTMENTS_COUNT_INFO_FAILURE';

export const GET_ADJUSTMENTS_EXPORT_INFO = 'GET_ADJUSTMENTS_EXPORT_INFO';
export const GET_ADJUSTMENTS_EXPORT_INFO_SUCCESS = 'GET_ADJUSTMENTS_EXPORT_INFO_SUCCESS';
export const GET_ADJUSTMENTS_EXPORT_INFO_FAILURE = 'GET_ADJUSTMENTS_EXPORT_INFO_FAILURE';

export const GET_ADJUSTMENT_DETAILS_INFO = 'GET_ADJUSTMENT_DETAILS_INFO';
export const GET_ADJUSTMENT_DETAILS_INFO_SUCCESS = 'GET_ADJUSTMENT_DETAILS_INFO_SUCCESS';
export const GET_ADJUSTMENT_DETAILS_INFO_FAILURE = 'GET_ADJUSTMENT_DETAILS_INFO_FAILURE';

export const CREATE_ADJUSTMENT_INFO = 'CREATE_ADJUSTMENT_INFO';
export const CREATE_ADJUSTMENT_INFO_SUCCESS = 'CREATE_ADJUSTMENT_INFO_SUCCESS';
export const CREATE_ADJUSTMENT_INFO_FAILURE = 'CREATE_ADJUSTMENT_INFO_FAILURE';

export const UPDATE_ADJUSTMENT_INFO = 'UPDATE_ADJUSTMENT_INFO';
export const UPDATE_ADJUSTMENT_INFO_SUCCESS = 'UPDATE_ADJUSTMENT_INFO_SUCCESS';
export const UPDATE_ADJUSTMENT_INFO_FAILURE = 'UPDATE_ADJUSTMENT_INFO_FAILURE';

export const GET_ADJUSTMENT_OPERATION_INFO = 'GET_ADJUSTMENT_OPERATION_INFO';
export const GET_ADJUSTMENT_OPERATION_INFO_SUCCESS = 'GET_ADJUSTMENT_OPERATION_INFO_SUCCESS';
export const GET_ADJUSTMENT_OPERATION_INFO_FAILURE = 'GET_ADJUSTMENT_OPERATION_INFO_FAILURE';

export const GET_ADJUSTMENT_PRODUCTS = 'GET_ADJUSTMENT_PRODUCTS';
export const GET_ADJUSTMENT_PRODUCTS_SUCCESS = 'GET_ADJUSTMENT_PRODUCTS_SUCCESS';
export const GET_ADJUSTMENT_PRODUCTS_FAILURE = 'GET_ADJUSTMENT_PRODUCTS_FAILURE';

export const GET_SCRAPS_INFO = 'GET_SCRAPS_INFO';
export const GET_SCRAPS_INFO_SUCCESS = 'GET_SCRAPS_INFO_SUCCESS';
export const GET_SCRAPS_INFO_FAILURE = 'GET_SCRAPS_INFO_FAILURE';

export const GET_SCRAPS_COUNT_INFO = 'GET_SCRAPS_COUNT_INFO';
export const GET_SCRAPS_COUNT_INFO_SUCCESS = 'GET_SCRAPS_COUNT_INFO_SUCCESS';
export const GET_SCRAPS_COUNT_INFO_FAILURE = 'GET_SCRAPS_COUNT_INFO_FAILURE';

export const GET_SCRAPS_EXPORT_INFO = 'GET_SCRAPS_EXPORT_INFO';
export const GET_SCRAPS_EXPORT_INFO_SUCCESS = 'GET_SCRAPS_EXPORT_INFO_SUCCESS';
export const GET_SCRAPS_EXPORT_INFO_FAILURE = 'GET_SCRAPS_EXPORT_INFO_FAILURE';

export const GET_SCRAP_DETAILS_INFO = 'GET_SCRAP_DETAILS_INFO';
export const GET_SCRAP_DETAILS_INFO_SUCCESS = 'GET_SCRAP_DETAILS_INFO_SUCCESS';
export const GET_SCRAP_DETAILS_INFO_FAILURE = 'GET_SCRAP_DETAILS_INFO_FAILURE';

export const CREATE_SCRAP_INFO = 'CREATE_SCRAP_INFO';
export const CREATE_SCRAP_INFO_SUCCESS = 'CREATE_SCRAP_INFO_SUCCESS';
export const CREATE_SCRAP_INFO_FAILURE = 'CREATE_SCRAP_INFO_FAILURE';

export const UPDATE_SCRAP_INFO = 'UPDATE_SCRAP_INFO';
export const UPDATE_SCRAP_INFO_SUCCESS = 'UPDATE_SCRAP_INFO_SUCCESS';
export const UPDATE_SCRAP_INFO_FAILURE = 'UPDATE_SCRAP_INFO_FAILURE';

export const GET_VALUATIONS_INFO = 'GET_VALUATIONS_INFO';
export const GET_VALUATIONS_INFO_SUCCESS = 'GET_VALUATIONS_INFO_SUCCESS';
export const GET_VALUATIONS_INFO_FAILURE = 'GET_VALUATIONS_INFO_FAILURE';

export const GET_VALUATIONS_COUNT_INFO = 'GET_VALUATIONS_COUNT_INFO';
export const GET_VALUATIONS_COUNT_INFO_SUCCESS = 'GET_VALUATIONS_COUNT_INFO_SUCCESS';
export const GET_VALUATIONS_COUNT_INFO_FAILURE = 'GET_VALUATIONS_COUNT_INFO_FAILURE';

export const CREATE_STOCK_HISTORY_INFO = 'CREATE_STOCK_HISTORY_INFO';
export const CREATE_STOCK_HISTORY_INFO_SUCCESS = 'CREATE_STOCK_HISTORY_INFO_SUCCESS';
export const CREATE_STOCK_HISTORY_INFO_FAILURE = 'CREATE_STOCK_HISTORY_INFO_FAILURE';

export const GET_STOCK_HISTORY_DETAILS_INFO = 'GET_STOCK_HISTORY_DETAILS_INFO';
export const GET_STOCK_HISTORY_DETAILS_INFO_SUCCESS = 'GET_STOCK_HISTORY_DETAILS_INFO_SUCCESS';
export const GET_STOCK_HISTORY_DETAILS_INFO_FAILURE = 'GET_STOCK_HISTORY_DETAILS_INFO_FAILURE';

export const GET_PM_LIST_INFO = 'GET_PM_LIST_INFO';
export const GET_PM_LIST_INFO_SUCCESS = 'GET_PM_LIST_INFO_SUCCESS';
export const GET_PM_LIST_INFO_FAILURE = 'GET_PM_LIST_INFO_FAILURE';

export const GET_PM_COUNT_INFO = 'GET_PM_COUNT_INFO';
export const GET_PM_COUNT_INFO_SUCCESS = 'GET_PM_COUNT_INFO_SUCCESS';
export const GET_PM_COUNT_INFO_FAILURE = 'GET_PM_COUNT_INFO_FAILURE';

export const GET_PM_EXPORT_LIST_INFO = 'GET_PM_EXPORT_LIST_INFO';
export const GET_PM_EXPORT_LIST_INFO_SUCCESS = 'GET_PM_EXPORT_LIST_INFO_SUCCESS';
export const GET_PM_EXPORT_LIST_INFO_FAILURE = 'GET_PM_EXPORT_LIST_INFO_FAILURE';

export const GET_PM_DETAILS_INFO = 'GET_PM_DETAILS_INFO';
export const GET_PM_DETAILS_INFO_SUCCESS = 'GET_PM_DETAILS_INFO_SUCCESS';
export const GET_PM_DETAILS_INFO_FAILURE = 'GET_PM_DETAILS_INFO_FAILURE';

export const GET_IR_LIST_INFO = 'GET_IR_LIST_INFO';
export const GET_IR_LIST_INFO_SUCCESS = 'GET_IR_LIST_INFO_SUCCESS';
export const GET_IR_LIST_INFO_FAILURE = 'GET_IR_LIST_INFO_FAILURE';

export const GET_IR_COUNT_INFO = 'GET_IR_COUNT_INFO';
export const GET_IR_COUNT_INFO_SUCCESS = 'GET_IR_COUNT_INFO_SUCCESS';
export const GET_IR_COUNT_INFO_FAILURE = 'GET_IR_COUNT_INFO_FAILURE';

export const GET_IR_EXPORT_LIST_INFO = 'GET_IR_EXPORT_LIST_INFO';
export const GET_IR_EXPORT_LIST_INFO_SUCCESS = 'GET_IR_EXPORT_LIST_INFO_SUCCESS';
export const GET_IR_EXPORT_LIST_INFO_FAILURE = 'GET_IR_EXPORT_LIST_INFO_FAILURE';

export const GET_IR_DETAILS_INFO = 'GET_IR_DETAILS_INFO';
export const GET_IR_DETAILS_INFO_SUCCESS = 'GET_IR_DETAILS_INFO_SUCCESS';
export const GET_IR_DETAILS_INFO_FAILURE = 'GET_IR_DETAILS_INFO_FAILURE';

export const GET_VALUATIONS_EXPORT_INFO = 'GET_VALUATIONS_EXPORT_INFO';
export const GET_VALUATIONS_EXPORT_INFO_SUCCESS = 'GET_VALUATIONS_EXPORT_INFO_SUCCESS';
export const GET_VALUATIONS_EXPORT_INFO_FAILURE = 'GET_VALUATIONS_EXPORT_INFO_FAILURE';

export const GET_WAREHOUSE_LIST_INFO = 'GET_WAREHOUSE_LIST_INFO';
export const GET_WAREHOUSE_LIST_INFO_SUCCESS = 'GET_WAREHOUSE_LIST_INFO_SUCCESS';
export const GET_WAREHOUSE_LIST_INFO_FAILURE = 'GET_WAREHOUSE_LIST_INFO_FAILURE';

export const GET_WAREHOUSE_COUNT_INFO = 'GET_WAREHOUSE_COUNT_INFO';
export const GET_WAREHOUSE_COUNT_INFO_SUCCESS = 'GET_WAREHOUSE_COUNT_INFO_SUCCESS';
export const GET_WAREHOUSE_COUNT_INFO_FAILURE = 'GET_WAREHOUSE_COUNT_INFO_FAILURE';

export const GET_WAREHOUSE_DETAILS_INFO = 'GET_WAREHOUSE_DETAILS_INFO';
export const GET_WAREHOUSE_DETAILS_INFO_SUCCESS = 'GET_WAREHOUSE_DETAILS_INFO_SUCCESS';
export const GET_WAREHOUSE_DETAILS_INFO_FAILURE = 'GET_WAREHOUSE_DETAILS_INFO_FAILURE';

export const GET_LOCATION_LIST_INFO = 'GET_LOCATION_LIST_INFO';
export const GET_LOCATION_LIST_INFO_SUCCESS = 'GET_LOCATION_LIST_INFO_SUCCESS';
export const GET_LOCATION_LIST_INFO_FAILURE = 'GET_LOCATION_LIST_INFO_FAILURE';

export const GET_LOCATION_COUNT_INFO = 'GET_LOCATION_COUNT_INFO';
export const GET_LOCATION_COUNT_INFO_SUCCESS = 'GET_LOCATION_COUNT_INFO_SUCCESS';
export const GET_LOCATION_COUNT_INFO_FAILURE = 'GET_LOCATION_COUNT_INFO_FAILURE';

export const GET_LOCATION_DETAILS_INFO = 'GET_LOCATION_DETAILS_INFO';
export const GET_LOCATION_DETAILS_INFO_SUCCESS = 'GET_LOCATION_DETAILS_INFO_SUCCESS';
export const GET_LOCATION_DETAILS_INFO_FAILURE = 'GET_LOCATION_DETAILS_INFO_FAILURE';

export const CREATE_WAREHOUSE_INFO = 'CREATE_WAREHOUSE_INFO';
export const CREATE_WAREHOUSE_INFO_SUCCESS = 'CREATE_WAREHOUSE_INFO_SUCCESS';
export const CREATE_WAREHOUSE_INFO_FAILURE = 'CREATE_WAREHOUSE_INFO_FAILURE';

export const UPDATE_WAREHOUSE_INFO = 'UPDATE_WAREHOUSE_INFO';
export const UPDATE_WAREHOUSE_INFO_SUCCESS = 'UPDATE_WAREHOUSE_INFO_SUCCESS';
export const UPDATE_WAREHOUSE_INFO_FAILURE = 'UPDATE_WAREHOUSE_INFO_FAILURE';

export const GET_WH_EXPORT_LIST_INFO = 'GET_WH_EXPORT_LIST_INFO';
export const GET_WH_EXPORT_LIST_INFO_SUCCESS = 'GET_WH_EXPORT_LIST_INFO_SUCCESS';
export const GET_WH_EXPORT_LIST_INFO_FAILURE = 'GET_WH_EXPORT_LIST_INFO_FAILURE';

export const GET_LOCATION_EXPORT_LIST_INFO = 'GET_LOCATION_EXPORT_LIST_INFO';
export const GET_LOCATION_EXPORT_LIST_INFO_SUCCESS = 'GET_LOCATION_EXPORT_LIST_INFO_SUCCESS';
export const GET_LOCATION_EXPORT_LIST_INFO_FAILURE = 'GET_LOCATION_EXPORT_LIST_INFO_FAILURE';

export const GET_OPERATIONTYPE_LIST_INFO = 'GET_OPERATIONTYPE_LIST_INFO';
export const GET_OPERATIONTYPE_LIST_INFO_SUCCESS = 'GET_OPERATIONTYPE_LIST_INFO_SUCCESS';
export const GET_OPERATIONTYPE_LIST_INFO_FAILURE = 'GET_OPERATIONTYPE_LIST_INFO_FAILURE';

export const GET_OPERATIONTYPE_COUNT_INFO = 'GET_OPERATIONTYPE_COUNT_INFO';
export const GET_OPERATIONTYPE_COUNT_INFO_SUCCESS = 'GET_OPERATIONTYPE_COUNT_INFO_SUCCESS';
export const GET_OPERATIONTYPE_COUNT_INFO_FAILURE = 'GET_OPERATIONTYPE_COUNT_INFO_FAILURE';

export const CREATE_LOCATION_INFO = 'CREATE_LOCATION_INFO';
export const CREATE_LOCATION_INFO_SUCCESS = 'CREATE_LOCATION_INFO_SUCCESS';
export const CREATE_LOCATION_INFO_FAILURE = 'CREATE_LOCATION_INFO_FAILURE';

export const UPDATE_LOCATION_INFO = 'UPDATE_LOCATION_INFO';
export const UPDATE_LOCATION_INFO_SUCCESS = 'UPDATE_LOCATION_INFO_SUCCESS';
export const UPDATE_LOCATION_INFO_FAILURE = 'UPDATE_LOCATION_INFO_FAILURE';

export const GET_SEQUENCE_INFO = 'GET_SEQUENCE_INFO';
export const GET_SEQUENCE_INFO_SUCCESS = 'GET_SEQUENCE_INFO_SUCCESS';
export const GET_SEQUENCE_INFO_FAILURE = 'GET_SEQUENCE_INFO_FAILURE';

export const GET_WAREHOUSES_INFO = 'GET_WAREHOUSES_INFO';
export const GET_WAREHOUSES_INFO_SUCCESS = 'GET_WAREHOUSES_INFO_SUCCESS';
export const GET_WAREHOUSES_INFO_FAILURE = 'GET_WAREHOUSES_INFO_FAILURE';

export const CREATE_OPTYPE_INFO = 'CREATE_OPTYPE_INFO';
export const CREATE_OPTYPE_INFO_SUCCESS = 'CREATE_OPTYPE_INFO_SUCCESS';
export const CREATE_OPTYPE_INFO_FAILURE = 'CREATE_OPTYPE_INFO_FAILURE';

export const UPDATE_OPTYPE_INFO = 'UPDATE_OPTYPE_INFO';
export const UPDATE_OPTYPE_INFO_SUCCESS = 'UPDATE_OPTYPE_INFO_SUCCESS';
export const UPDATE_OPTYPE_INFO_FAILURE = 'UPDATE_OPTYPE_INFO_FAILURE';

export const GET_OPTYPE_DETAILS_INFO = 'GET_OPTYPE_DETAILS_INFO';
export const GET_OPTYPE_DETAILS_INFO_SUCCESS = 'GET_OPTYPE_DETAILS_INFO_SUCCESS';
export const GET_OPTYPE_DETAILS_INFO_FAILURE = 'GET_OPTYPE_DETAILS_INFO_FAILURE';

export const GET_OPT_EXPORT_LIST_INFO = 'GET_OPT_EXPORT_LIST_INFO';
export const GET_OPT_EXPORT_LIST_INFO_SUCCESS = 'GET_OPT_EXPORT_LIST_INFO_SUCCESS';
export const GET_OPT_EXPORT_LIST_INFO_FAILURE = 'GET_OPT_EXPORT_LIST_INFO_FAILURE';

export const GET_ADDRESS_GROUP_INFO = 'GET_ADDRESS_GROUP_INFO';
export const GET_ADDRESS_GROUP_INFO_SUCCESS = 'GET_ADDRESS_GROUP_INFO_SUCCESS';
export const GET_ADDRESS_GROUP_INFO_FAILURE = 'GET_ADDRESS_GROUP_INFO_FAILURE';

export const GET_PRODUCTS_GROUP_INFO = 'GET_PRODUCTS_GROUP_INFO';
export const GET_PRODUCTS_GROUP_INFO_SUCCESS = 'GET_PRODUCTS_GROUP_INFO_SUCCESS';
export const GET_PRODUCTS_GROUP_INFO_FAILURE = 'GET_PRODUCTS_GROUP_INFO_FAILURE';

export const GET_INVENTORY_DASHBOARD_INFO = 'GET_INVENTORY_DASHBOARD_INFO';
export const GET_INVENTORY_DASHBOARD_INFO_SUCCESS = 'GET_INVENTORY_DASHBOARD_INFO_SUCCESS';
export const GET_INVENTORY_DASHBOARD_INFO_FAILURE = 'GET_INVENTORY_DASHBOARD_INFO_FAILURE';

export const CREATE_IMPORT_ID_INFO = 'CREATE_IMPORT_ID_INFO';
export const CREATE_IMPORT_ID_INFO_SUCCESS = 'CREATE_IMPORT_ID_INFO_SUCCESS';
export const CREATE_IMPORT_ID_INFO_FAILURE = 'CREATE_IMPORT_ID_INFO_FAILURE';

export const UPLOAD_IMPORT_INFO = 'UPLOAD_IMPORT_INFO';
export const UPLOAD_IMPORT_INFO_SUCCESS = 'UPLOAD_IMPORT_INFO_SUCCESS';
export const UPLOAD_IMPORT_INFO_FAILURE = 'UPLOAD_IMPORT_INFO_FAILURE';

export const GET_MATERIALS_ISSUED = 'GET_MATERIALS_ISSUED';
export const GET_MATERIALS_ISSUED_SUCCESS = 'GET_MATERIALS_ISSUED_SUCCESS';
export const GET_MATERIALS_ISSUED_FAILURE = 'GET_MATERIALS_ISSUED_FAILURE';

export const GET_MATERIALS_RECEIVED = 'GET_MATERIALS_RECEIVED';
export const GET_MATERIALS_RECEIVED_SUCCESS = 'GET_MATERIALS_RECEIVED_SUCCESS';
export const GET_MATERIALS_RECEIVED_FAILURE = 'GET_MATERIALS_RECEIVED_FAILURE';

export const GET_INVENTORY_STATUS_DASHBOARD_INFO = 'GET_INVENTORY_STATUS_DASHBOARD_INFO';
export const GET_INVENTORY_STATUS_DASHBOARD_INFO_SUCCESS = 'GET_INVENTORY_STATUS_DASHBOARD_INFO_SUCCESS';
export const GET_INVENTORY_STATUS_DASHBOARD_INFO_FAILURE = 'GET_INVENTORY_STATUS_DASHBOARD_INFO_FAILURE';

export const GET_CONS_SUM_INFO = 'GET_CONS_SUM_INFO';
export const GET_CONS_SUM_INFO_SUCCESS = 'GET_CONS_SUM_INFO_SUCCESS';
export const GET_CONS_SUM_INFO_FAILURE = 'GET_CONS_SUM_INFO_FAILURE';

export const GET_INVENTORY_OVERVIEW_INFO = 'GET_INVENTORY_OVERVIEW_INFO';
export const GET_INVENTORY_OVERVIEW_INFO_SUCCESS = 'GET_INVENTORY_OVERVIEW_INFO_SUCCESS';
export const GET_INVENTORY_OVERVIEW_INFO_FAILURE = 'GET_INVENTORY_OVERVIEW_INFO_FAILURE';

export const GET_INVENTORY_OVERVIEW_EXPORT_INFO = 'GET_INVENTORY_OVERVIEW_EXPORT_INFO';
export const GET_INVENTORY_OVERVIEW_EXPORT_INFO_SUCCESS = 'GET_INVENTORY_OVERVIEW_EXPORT_INFO_SUCCESS';
export const GET_INVENTORY_OVERVIEW_EXPORT_INFO_FAILURE = 'GET_INVENTORY_OVERVIEW_EXPORT_INFO_FAILURE';

export const GET_CONS_DET_INFO = 'GET_CONS_DET_INFO';
export const GET_CONS_DET_INFO_SUCCESS = 'GET_CONS_DET_INFO_SUCCESS';
export const GET_CONS_DET_INFO_FAILURE = 'GET_CONS_DET_INFO_FAILURE';

export const GET_INWARD_INFO = 'GET_INWARD_INFO ';
export const GET_INWARD_INFO_SUCCESS = 'GET_INWARD_INFO_SUCCESS';
export const GET_INWARD_INFO_FAILURE = 'GET_INWARD_INFO_FAILURE';

export const GET_INWARD_DET_INFO = 'GET_INWARD_DET_INFO ';
export const GET_INWARD_DET_INFO_SUCCESS = 'GET_INWARD_DET_INFO_SUCCESS';
export const GET_INWARD_DET_INFO_FAILURE = 'GET_INWARD_DET_INFO_FAILURE';

export const PRODUCT_CATEGORY_INFO = 'PRODUCT_CATEGORY_INFO';
export const PRODUCT_CATEGORY_INFO_SUCCESS = 'PRODUCT_CATEGORY_INFO_SUCCESS';
export const PRODUCT_CATEGORY_INFO_FAILURE = 'PRODUCT_CATEGORY_INFO_FAILURE';

export const CLEAR_CONS_SUM_INFO = 'CLEAR_CONS_SUM_INFO';
export const SET_VALIDATE_STOCK_INFO = 'SET_VALIDATE_STOCK_INFO';
export const SET_VALIDATE_STOCK_INFO_SUCCESS = 'SET_VALIDATE_STOCK_INFO_SUCCESS';
export const SET_VALIDATE_STOCK_INFO_FAILURE = 'SET_VALIDATE_STOCK_INFO_FAILURE';

export const GET_STOCK_REASONS_INFO = 'GET_STOCK_REASONS_INFO';
export const GET_STOCK_REASONS_INFO_SUCCESS = 'GET_STOCK_REASONS_INFO_SUCCESS';
export const GET_STOCK_REASONS_INFO_FAILURE = 'GET_STOCK_REASONS_INFO_FAILURE';

export const GET_INVENTORY_OVERVIEW_COUNT_INFO = 'GET_INVENTORY_OVERVIEW_COUNT_INFO';
export const GET_INVENTORY_OVERVIEW_COUNT_INFO_SUCCESS = 'GET_INVENTORY_OVERVIEW_COUNT_INFO_SUCCESS';
export const GET_INVENTORY_OVERVIEW_COUNT_INFO_FAILURE = 'GET_INVENTORY_OVERVIEW_COUNT_INFO_FAILURE';

export const GET_ROLE_INFO = 'GET_ROLE_INFO';
export const GET_ROLE_INFO_SUCCESS = 'GET_ROLE_INFO_SUCCESS';
export const GET_ROLE_INFO_FAILURE = 'GET_ROLE_INFO_FAILURE';


export const GET_AUDIT_EXISTS_INFO = 'GET_AUDIT_EXISTS_INFO';
export const GET_AUDIT_EXISTS_INFO_SUCCESS = 'GET_AUDIT_EXISTS_INFO_SUCCESS';
export const GET_AUDIT_EXISTS_INFO_FAILURE = 'GET_AUDIT_EXISTS_INFO_FAILURE';

export const SCRAPS_FILTERS = 'SCRAPS_FILTERS';

export function getMaterialsIssuedData(start, end) {
  const payload = {
    start_date: start, end_date: end,
  };
  return {
    [CALL_API]: {
      endpoint: 'material_issued',
      types: [GET_MATERIALS_ISSUED, GET_MATERIALS_ISSUED_SUCCESS, GET_MATERIALS_ISSUED_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
export function getMaterialsReceivedData(start, end) {
  const payload = {
    start_date: start, end_date: end,
  };
  return {
    [CALL_API]: {
      endpoint: 'material_received',
      types: [GET_MATERIALS_RECEIVED, GET_MATERIALS_RECEIVED_SUCCESS, GET_MATERIALS_RECEIVED_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
export function getAdjustmentsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = InventoryModule.stockAuditApiFields;
  let payload = `domain=[["company_id","in",[${company}]]`;

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
      types: [GET_ADJUSTMENTS_INFO, GET_ADJUSTMENTS_INFO_SUCCESS, GET_ADJUSTMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAdjustmentsExportInfo(company, model, limit, offset, fields, customFilters, sortByValue, sortFieldValue, rows) {
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
      types: [GET_ADJUSTMENTS_EXPORT_INFO, GET_ADJUSTMENTS_EXPORT_INFO_SUCCESS, GET_ADJUSTMENTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAdjustmentsCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;

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
      types: [GET_ADJUSTMENTS_COUNT_INFO, GET_ADJUSTMENTS_COUNT_INFO_SUCCESS, GET_ADJUSTMENTS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAdjustmentDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_ADJUSTMENT_DETAILS_INFO, GET_ADJUSTMENT_DETAILS_INFO_SUCCESS, GET_ADJUSTMENT_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function createAdjustmentInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: 'inventory/audit',
      types: [CREATE_ADJUSTMENT_INFO, CREATE_ADJUSTMENT_INFO_SUCCESS, CREATE_ADJUSTMENT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateAdjustmentInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_ADJUSTMENT_INFO, UPDATE_ADJUSTMENT_INFO_SUCCESS, UPDATE_ADJUSTMENT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getActionDataInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_ADJUSTMENT_OPERATION_INFO, GET_ADJUSTMENT_OPERATION_INFO_SUCCESS, GET_ADJUSTMENT_OPERATION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getAdjustmentProductsInfo(company, values, modelName) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["product_id","product_uom_id","location_id","theoretical_qty","product_qty"]`;
  payload = `${payload}&limit=200&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ADJUSTMENT_PRODUCTS, GET_ADJUSTMENT_PRODUCTS_SUCCESS, GET_ADJUSTMENT_PRODUCTS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScrapsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = InventoryModule.scrapApiFields;
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
      types: [GET_SCRAPS_INFO, GET_SCRAPS_INFO_SUCCESS, GET_SCRAPS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScrapsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
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
      types: [GET_SCRAPS_EXPORT_INFO, GET_SCRAPS_EXPORT_INFO_SUCCESS, GET_SCRAPS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScrapsCountInfo(company, model, customFilters, globalFilter) {
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
      types: [GET_SCRAPS_COUNT_INFO, GET_SCRAPS_COUNT_INFO_SUCCESS, GET_SCRAPS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getScrapDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_SCRAP_DETAILS_INFO, GET_SCRAP_DETAILS_INFO_SUCCESS, GET_SCRAP_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function createScrapInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SCRAP_INFO, CREATE_SCRAP_INFO_SUCCESS, CREATE_SCRAP_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateScrapInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_SCRAP_INFO, UPDATE_SCRAP_INFO_SUCCESS, UPDATE_SCRAP_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getValuationsListInfo(company, model, limit, offset, statusValue, customFilters, sortByValue, sortFieldValue, context, reportDate) {
  const fields = valuationCustomData && valuationCustomData.listFields ? valuationCustomData.listFields : [];
  let payload = `domain=[["company_id","in",[${company}]],["type","=","product"]`;
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (reportDate && !reportDate.data) {
    payload = `${payload},["qty_available","!=",0]`;
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
  payload = `${payload}]&model=${model}`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  payload = `${payload}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VALUATIONS_INFO, GET_VALUATIONS_INFO_SUCCESS, GET_VALUATIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getValuationsCountInfo(company, model, statusValue, customFilters, context, reportDate) {
  let payload = `domain=[["company_id","in",[${company}]],["type","=","product"]`;
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (reportDate && !reportDate.data) {
    payload = `${payload},["qty_available","!=",0]`;
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
  payload = `${payload}]&model=${model}&count=1`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_VALUATIONS_COUNT_INFO, GET_VALUATIONS_COUNT_INFO_SUCCESS, GET_VALUATIONS_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createStockHistoryInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_STOCK_HISTORY_INFO, CREATE_STOCK_HISTORY_INFO_SUCCESS, CREATE_STOCK_HISTORY_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getStockHistoryDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=["compute_at_date","date"]`,
      types: [GET_STOCK_HISTORY_DETAILS_INFO, GET_STOCK_HISTORY_DETAILS_INFO_SUCCESS, GET_STOCK_HISTORY_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getProductMovesListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue) {
  const fields = valuationCustomData && valuationCustomData.listFieldsPM ? valuationCustomData.listFieldsPM : [];
  let payload = 'domain=[["product_id","!=",false]';

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
      types: [GET_PM_LIST_INFO, GET_PM_LIST_INFO_SUCCESS, GET_PM_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductMovesListExportInfo(company, model, limit, offset, fields, customFilters, rows) {
  let payload = 'domain=[["product_id","!=",false]';

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PM_EXPORT_LIST_INFO, GET_PM_EXPORT_LIST_INFO_SUCCESS, GET_PM_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getValuationsListExportInfo(company, model, limit, offset, fields, statusValue, customFilters, rows, context, reportDate) {
  let payload = `domain=[["company_id","in",[${company}]],["type","=","product"]`;
  if (statusValue && statusValue === 'yes') {
    payload = `${payload},["active","=",true]`;
  }
  if (reportDate && !reportDate.data) {
    payload = `${payload},["qty_available","!=",0]`;
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
  payload = `${payload}]&model=${model}`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  payload = `${payload}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VALUATIONS_EXPORT_INFO, GET_VALUATIONS_EXPORT_INFO_SUCCESS, GET_VALUATIONS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductMovesCountInfo(company, model, customFilters) {
  let payload = 'domain=[["product_id","!=",false]';
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_PM_COUNT_INFO, GET_PM_COUNT_INFO_SUCCESS, GET_PM_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductMoveInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_PM_DETAILS_INFO, GET_PM_DETAILS_INFO_SUCCESS, GET_PM_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getInventoryReportsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, context) {
  const fields = valuationCustomData && valuationCustomData.listFieldsIR ? valuationCustomData.listFieldsIR : [];
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  payload = `${payload}]&model=${model}`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  payload = `${payload}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_IR_LIST_INFO, GET_IR_LIST_INFO_SUCCESS, GET_IR_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInventoryReportsExportInfo(company, model, limit, offset, fields, customFilters, rows, context) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  payload = `${payload}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_IR_EXPORT_LIST_INFO, GET_IR_EXPORT_LIST_INFO_SUCCESS, GET_IR_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInventoryReportsCountInfo(company, model, customFilters, context) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  if (context) {
    payload = `${payload}&context=${JSON.stringify(context)}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_IR_COUNT_INFO, GET_IR_COUNT_INFO_SUCCESS, GET_IR_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInventoryReportInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_IR_DETAILS_INFO, GET_IR_DETAILS_INFO_SUCCESS, GET_IR_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getWareHouseListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = InventoryModule.wareHouseApiFields;
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
      types: [GET_WAREHOUSE_LIST_INFO, GET_WAREHOUSE_LIST_INFO_SUCCESS, GET_WAREHOUSE_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWareHousesCountInfo(company, model, customFilters, globalFilter) {
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
      types: [GET_WAREHOUSE_COUNT_INFO, GET_WAREHOUSE_COUNT_INFO_SUCCESS, GET_WAREHOUSE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWareHouseInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_WAREHOUSE_DETAILS_INFO, GET_WAREHOUSE_DETAILS_INFO_SUCCESS, GET_WAREHOUSE_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getLocationListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = configurationCustomData && configurationCustomData.listFieldsLocation ? configurationCustomData.listFieldsLocation : [];
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true],["name","!=",false]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  } else {
    payload = `${payload}&order=create_date DESC`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_LOCATION_LIST_INFO, GET_LOCATION_LIST_INFO_SUCCESS, GET_LOCATION_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLocationsCountInfo(company, model, customFilters, globalFilter) {
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
      types: [GET_LOCATION_COUNT_INFO, GET_LOCATION_COUNT_INFO_SUCCESS, GET_LOCATION_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLocationInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_LOCATION_DETAILS_INFO, GET_LOCATION_DETAILS_INFO_SUCCESS, GET_LOCATION_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function createWarehouseInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_WAREHOUSE_INFO, CREATE_WAREHOUSE_INFO_SUCCESS, CREATE_WAREHOUSE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateWarehouseInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_WAREHOUSE_INFO, UPDATE_WAREHOUSE_INFO_SUCCESS, UPDATE_WAREHOUSE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getWareHouseListExportInfo(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false]`;

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
      types: [GET_WH_EXPORT_LIST_INFO, GET_WH_EXPORT_LIST_INFO_SUCCESS, GET_WH_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function geLocationListExportInfo(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true],["name","!=",false]`;

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  } else {
    payload = `${payload}&order=create_date DESC`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_LOCATION_EXPORT_LIST_INFO, GET_LOCATION_EXPORT_LIST_INFO_SUCCESS, GET_LOCATION_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOperationTypeListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  const fields = InventoryModule.operationTypeApiField;
  let payload = 'domain=[["active","=",true],["name","!=",false]';
  if (company) {
    payload = `${payload},["warehouse_id","in",[${company}]]`;
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
      types: [GET_OPERATIONTYPE_LIST_INFO, GET_OPERATIONTYPE_LIST_INFO_SUCCESS, GET_OPERATIONTYPE_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOperationTypeCountInfo(company, model, customFilters, globalFilter) {
  let payload = 'domain=[["active","=",true],["name","!=",false]';
  if (company) {
    payload = `${payload},["warehouse_id","in",[${company}]]`;
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
      types: [GET_OPERATIONTYPE_COUNT_INFO, GET_OPERATIONTYPE_COUNT_INFO_SUCCESS, GET_OPERATIONTYPE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createLocationInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_LOCATION_INFO, CREATE_LOCATION_INFO_SUCCESS, CREATE_LOCATION_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateLocationInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_LOCATION_INFO, UPDATE_LOCATION_INFO_SUCCESS, UPDATE_LOCATION_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSequenceInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=[]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SEQUENCE_INFO, GET_SEQUENCE_INFO_SUCCESS, GET_SEQUENCE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWarehousesInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=[]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WAREHOUSES_INFO, GET_WAREHOUSES_INFO_SUCCESS, GET_WAREHOUSES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRoleInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ROLE_INFO, GET_ROLE_INFO_SUCCESS, GET_ROLE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}


export function createOperationTypeInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_OPTYPE_INFO, CREATE_OPTYPE_INFO_SUCCESS, CREATE_OPTYPE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateOperationTypeInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_OPTYPE_INFO, UPDATE_OPTYPE_INFO_SUCCESS, UPDATE_OPTYPE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getOperationTypeInfo(id, modelName, isMini) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&${isMini ? 'fields=["id","is_confirmed"]' : 'fields=[]'}`,
      types: [GET_OPTYPE_DETAILS_INFO, GET_OPTYPE_DETAILS_INFO_SUCCESS, GET_OPTYPE_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getOperationTypeListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  let payload = 'domain=[["active","=",true],["name","!=",false]';
  if (company) {
    payload = `${payload},["warehouse_id","in",[${company}]]`;
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
      types: [GET_OPT_EXPORT_LIST_INFO, GET_OPT_EXPORT_LIST_INFO_SUCCESS, GET_OPT_EXPORT_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAddressGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["partner_id","!=",false]]&model=${model}&fields=["partner_id"]&groupby=["partner_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ADDRESS_GROUP_INFO, GET_ADDRESS_GROUP_INFO_SUCCESS, GET_ADDRESS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getProductsGroupsInfo(model) {
  const payload = `domain=[["product_id","!=",false]]&model=${model}&fields=["product_id"]&groupby=["product_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PRODUCTS_GROUP_INFO, GET_PRODUCTS_GROUP_INFO_SUCCESS, GET_PRODUCTS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInventoryDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Inventory`,
      types: [GET_INVENTORY_DASHBOARD_INFO, GET_INVENTORY_DASHBOARD_INFO_SUCCESS, GET_INVENTORY_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
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

export function getInventoryStatusDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `inventory/dashboard?start_date=${start}&end_date=${end}`,
      types: [GET_INVENTORY_STATUS_DASHBOARD_INFO, GET_INVENTORY_STATUS_DASHBOARD_INFO_SUCCESS, GET_INVENTORY_STATUS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getScrapFilter(payload) {
  return {
    type: SCRAPS_FILTERS,
    payload,
  };
}

export function getConsumptionSummaryInfo(start, end, product, productCateg, vendor, depart, opTypeValue) {
  let payload = '';
  const model = 'transfers/summary/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/consumption/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }

  if (opTypeValue) {
    payload = `${payload}&operation_type=${opTypeValue}`;
  }

  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }

  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}`,
      types: [GET_CONS_SUM_INFO, GET_CONS_SUM_INFO_SUCCESS, GET_CONS_SUM_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInventoryOverviewInfo(start, end, product, productCateg, vendor, depart, limit, offset, isShowArc) {
  let payload = '';
  const model = 'transfers/overview/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/consumption/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }
  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}&show_archived=${isShowArc}`,
      types: [GET_INVENTORY_OVERVIEW_INFO, GET_INVENTORY_OVERVIEW_INFO_SUCCESS, GET_INVENTORY_OVERVIEW_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInventoryOverviewExportInfo(start, end, product, productCateg, vendor, depart, isShowArc) {
  let payload = '';
  const model = 'transfers/overview/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/consumption/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }
  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}&show_archived=${isShowArc}`,
      types: [GET_INVENTORY_OVERVIEW_EXPORT_INFO, GET_INVENTORY_OVERVIEW_EXPORT_INFO_SUCCESS, GET_INVENTORY_OVERVIEW_EXPORT_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInventoryOverviewCountInfo(start, end, product, productCateg, vendor, depart, isShowArc) {
  let payload = '';
  const model = 'consumption/allproducts/count';

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }
  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}&show_archived=${isShowArc}`,
      types: [GET_INVENTORY_OVERVIEW_COUNT_INFO, GET_INVENTORY_OVERVIEW_COUNT_INFO_SUCCESS, GET_INVENTORY_OVERVIEW_COUNT_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInwardSummaryInfo(start, end, product, productCateg, vendor, depart) {
  let payload = '';
  const model = 'inwardstock/summary/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/inwardstock/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }
  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }
  // if (id) {
  //   const typeField = type === 'e' ? 'equipment_ids' : 'space_ids';
  //   payload = `${payload}&${typeField}=${JSON.stringify(id)}`;
  // }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}`,
      types: [GET_INWARD_INFO, GET_INWARD_INFO_SUCCESS, GET_INWARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getConsumptionDetailSummaryInfo(start, end, product, productCateg, vendor, depart, opTypeValue, isStock) {
  let payload = '';
  const model = 'transfers/detailed/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/inwardstock/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }
  if (opTypeValue) {
    payload = `${payload}&operation_type=${opTypeValue}`;
  }
  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }
  payload = `${payload}&is_opening_stock_required=${isStock ? 'True' : 'False'}`;
  // if (id) {
  //   const typeField = type === 'e' ? 'equipment_ids' : 'space_ids';
  //   payload = `${payload}&${typeField}=${JSON.stringify(id)}`;
  // }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}`,
      types: [GET_CONS_DET_INFO, GET_CONS_DET_INFO_SUCCESS, GET_CONS_DET_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getInwardDetailSummaryInfo(start, end, product, productCateg, vendor, depart) {
  let payload = '';
  const model = 'inwardstock/detailed/report';

  // if (new Date(start) >= new Date(date)) {
  //   model = 'hx/inwardstock/summary/report';
  // }

  if (start && end) {
    payload = `${payload}start_date=${start}&end_date=${end}`;
  }

  if (product && product.length > 0) {
    payload = `${payload}&product_ids=[${encodeURIComponent(product)}]`;
  }
  if (productCateg && productCateg.length > 0) {
    payload = `${payload}&category=[${encodeURIComponent(productCateg)}]`;
  }
  if (vendor && vendor.length > 0) {
    payload = `${payload}&vendor=[${encodeURIComponent(vendor)}]`;
  }
  if (depart && depart.length > 0) {
    payload = `${payload}&department=[${encodeURIComponent(depart)}]`;
  }
  // if (id) {
  //   const typeField = type === 'e' ? 'equipment_ids' : 'space_ids';
  //   payload = `${payload}&${typeField}=${JSON.stringify(id)}`;
  // }

  return {
    [CALL_API]: {
      endpoint: `${model}?${payload}`,
      types: [GET_INWARD_DET_INFO, GET_INWARD_DET_INFO_SUCCESS, GET_INWARD_DET_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function clearConsumptionSummaryInfo() {
  return {
    type: CLEAR_CONS_SUM_INFO,
  };
}

export function productCategoryList(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","display_name"]&limit=100&offset=0&order=name ASC`;

  // const payload = `domain=[]&model=${model}&limit=100&offset=0&order=name ASC&fields=["name","display_name"]`;

  return {
    [CALL_API]: {
      endpoint: 'inventory/product/category',
      types: [PRODUCT_CATEGORY_INFO, PRODUCT_CATEGORY_INFO_SUCCESS, PRODUCT_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function setValidateStockInfo(id, state) {
  const payload = { ids: `[${id}]` };
  return {
    [CALL_API]: {
      endpoint: 'inventory/audit',
      types: [SET_VALIDATE_STOCK_INFO, SET_VALIDATE_STOCK_INFO_SUCCESS, SET_VALIDATE_STOCK_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getStockReasonsInfo(company, model, keyword) {
  let payload = 'domain=[';

  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STOCK_REASONS_INFO, GET_STOCK_REASONS_INFO_SUCCESS, GET_STOCK_REASONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditExistsInfo(locId, products) {
  const payload = { location_id: locId, values: products };
  return {
    [CALL_API]: {
      endpoint: 'inventory/validation/audit',
      types: [GET_AUDIT_EXISTS_INFO, GET_AUDIT_EXISTS_INFO_SUCCESS, GET_AUDIT_EXISTS_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}