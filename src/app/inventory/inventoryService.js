import {
  getAdjustmentsListInfo, getAdjustmentsCountInfo,
  getAdjustmentsExportInfo, getAdjustmentDetailInfo,
  createAdjustmentInfo, updateAdjustmentInfo,
  getActionDataInfo, getAdjustmentProductsInfo,
  getScrapsListInfo, getScrapsExportInfo,
  getScrapsCountInfo, getScrapDetailInfo,
  createScrapInfo, updateScrapInfo,
  getValuationsCountInfo, getValuationsListInfo,
  createStockHistoryInfo, getStockHistoryDetailInfo,
  getProductMovesListInfo, getProductMovesCountInfo,
  getProductMovesListExportInfo, getProductMoveInfo,
  getInventoryReportsListInfo, getInventoryReportsExportInfo,
  getInventoryReportsCountInfo, getInventoryReportInfo,
  getValuationsListExportInfo,
  getWareHouseListInfo, getWareHousesCountInfo, getWareHouseInfo, createWarehouseInfo,
  updateWarehouseInfo, getWareHouseListExportInfo,
  getLocationListInfo, getLocationsCountInfo, getLocationInfo, geLocationListExportInfo,
  getOperationTypeListInfo, getOperationTypeCountInfo, getStockReasonsInfo,
  createLocationInfo, updateLocationInfo, getSequenceInfo, getWarehousesInfo, getAddressGroupsInfo, getRoleInfo,
  createOperationTypeInfo, updateOperationTypeInfo, getOperationTypeInfo, getOperationTypeListExportInfo,
  getProductsGroupsInfo, getInventoryDashboardInfo, createImportIdInfo, uploadImportInfo,
  getMaterialsIssuedData, getMaterialsReceivedData, getAuditExistsInfo, getInventoryStatusDashboardInfo, getScrapFilter, getConsumptionSummaryInfo, clearConsumptionSummaryInfo, productCategoryList, getInwardSummaryInfo, getConsumptionDetailSummaryInfo, getInwardDetailSummaryInfo, setValidateStockInfo, getInventoryOverviewInfo, getInventoryOverviewCountInfo, getInventoryOverviewExportInfo,
} from './actions';

export const ADJUSTMENTS_FILTERS = 'ADJUSTMENTS_FILTERS';
export const GET_ROWS_ADJUSTMENTS = 'GET_ROWS_ADJUSTMENTS';
export const FILTER_VALUES = 'FILTER_VALUES';
export const RESET_CREATE_ADJUSTMENT_INFO = 'RESET_CREATE_ADJUSTMENT_INFO';
export const RESET_UPDATE_ADJUSTMENT_INFO = 'RESET_UPDATE_ADJUSTMENT_INFO';
export const RESET_ADJUSTMENT_OPERATION_INFO = 'RESET_ADJUSTMENT_OPERATION_INFO';
export const GET_PRODUCTS_SELECTED = 'GET_PRODUCTS_SELECTED';
export const SET_CURRENT_INVENTORY_TAB = 'SET_CURRENT_INVENTORY_TAB';
export const SCRAPS_FILTERS = 'SCRAPS_FILTERS';
export const GET_ROWS_SCRAPS = 'GET_ROWS_SCRAPS';
export const RESET_CREATE_SCRAP_INFO = 'RESET_CREATE_SCRAP_INFO';
export const RESET_CREATE_STOCK_HISTORY_INFO = 'RESET_CREATE_STOCK_HISTORY_INFO';
export const RESET_UPDATE_SCRAP_INFO = 'RESET_UPDATE_SCRAP_INFO';
export const PM_FILTERS = 'PM_FILTERS';
export const IR_FILTERS = 'IR_FILTERS';
export const GET_ROWS_PMS = 'GET_ROWS_PMS';
export const WH_FILTERS = 'WH_FILTERS';
export const GET_ROWS_WHS = 'GET_ROWS_WHS';
export const LOC_FILTERS = 'LOC_FILTERS';
export const GET_ROWS_LOCS = 'GET_ROWS_LOCS';
export const RESET_CREATE_WAREHOUSE_INFO = 'RESET_CREATE_WAREHOUSE_INFO';
export const RESET_UPDATE_WAREHOUSE_INFO = 'RESET_UPDATE_WAREHOUSE_INFO';
export const OPT_FILTERS = 'OPT_FILTERS';
export const RESET_CREATE_LOCATION_INFO = 'RESET_CREATE_LOCATION_INFO';
export const RESET_UPDATE_LOCATION_INFO = 'RESET_UPDATE_LOCATION_INFO';
export const RESET_CREATE_OPTYPE_INFO = 'RESET_CREATE_OPTYPE_INFO';
export const RESET_UPDATE_OPTYPE_INFO = 'RESET_UPDATE_OPTYPE_INFO';
export const GET_ROWS_OPTS = 'GET_ROWS_OPTS';
export const RESET_STOCK_HISTORY_DETAILS_INFO = 'RESET_STOCK_HISTORY_DETAILS_INFO';
export const SET_CURRENT_INVENTORY_DATE = 'SET_CURRENT_INVENTORY_DATE';
export const RESET_UPLOAD_BULK_INFO = 'RESET_UPLOAD_BULK_INFO';
export const RESET_CONS_SUM_INFO = 'RESET_CONS_SUM_INFO';
export const RESET_INWARD_INFO = 'RESET_INWARD_INFO';
export const RESET_CONS_DET_INFO = 'RESET_CONS_DET_INFO';
export const RESET_INWARD_DET_INFO = 'RESET_INWARD_DET_INFO';
export const BULK_UPLOAD_TRUE = 'BULK_UPLOAD_TRUE';
export const GET_ROLE_ID = 'GET_ROLE_ID';
export const RESET_INVENTORY_OVERVIEW_INFO = 'RESET_INVENTORY_OVERVIEW_INFO';

export const RESET_VALIDATE_STOCK_INFO = 'RESET_VALIDATE_STOCK_INFO';
export const RESET_AUDIT_EXISTS_INFO = 'RESET_AUDIT_EXISTS_INFO';

export function getAdjustmentsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getAdjustmentsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getAdjustmentsExport(company, model, limit, offset, fields, customFilters, sortByValue, sortFieldValue, rows) {
  return (dispatch) => {
    dispatch(getAdjustmentsExportInfo(company, model, limit, offset, fields, customFilters, sortByValue, sortFieldValue, rows));
  };
}

export function getAdjustmentsCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getAdjustmentsCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getAdjustmentFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: ADJUSTMENTS_FILTERS,
    payload: result,
  };
}

export function setBulkUploadTrue(data) {
  return {
    type: BULK_UPLOAD_TRUE,
    payload: data
  };
}

export function getCheckedRowsAdjustment(payload) {
  return {
    type: GET_ROWS_ADJUSTMENTS,
    payload,
  };
}

export function setInitialValues(filter, search, columns, download) {
  return {
    type: FILTER_VALUES,
    payload: {
      filter, search, columns, download,
    },
  };
}

export function getAdjustmentDetail(id, model) {
  return (dispatch) => {
    dispatch(getAdjustmentDetailInfo(id, model));
  };
}

export function createAdjustment(model, result) {
  return (dispatch) => {
    dispatch(createAdjustmentInfo(model, result));
  };
}

export function updateAdjustment(id, model, result) {
  return (dispatch) => {
    dispatch(updateAdjustmentInfo(id, model, result));
  };
}

export function resetCreateAdjustment(result) {
  return {
    type: RESET_CREATE_ADJUSTMENT_INFO,
    payload: result,
  };
}

export function resetUpdateAdjustment(result) {
  return {
    type: RESET_UPDATE_ADJUSTMENT_INFO,
    payload: result,
  };
}

export function getActionData(id, state, modelName) {
  return (dispatch) => {
    dispatch(getActionDataInfo(id, state, modelName));
  };
}

export function resetActionData(result) {
  return {
    type: RESET_ADJUSTMENT_OPERATION_INFO,
    payload: result,
  };
}

export function getAdjustmentProducts(company, ids, modelName) {
  return (dispatch) => {
    dispatch(getAdjustmentProductsInfo(company, ids, modelName));
  };
}

export function getSelectedProducts(result) {
  return {
    type: GET_PRODUCTS_SELECTED,
    payload: result,
  };
}

export function setCurrentTab(result) {
  return {
    type: SET_CURRENT_INVENTORY_TAB,
    payload: result,
  };
}

export function getScrapsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getScrapsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getScrapsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getScrapsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getScrapsCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getScrapsCountInfo(company, model, customFilters, globalFilter));
  };
}

// export function getScrapFilters(statusValues, dateValues, customFiltersList) {
//   const result = { statuses: statusValues, dates: dateValues, customFilters: customFiltersList };
//   return {
//     type: SCRAPS_FILTERS,
//     payload: result,
//   };
// }

export function getScrapFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: SCRAPS_FILTERS,
    payload: result,
  };
}

export function getCheckedRowsScrap(payload) {
  return {
    type: GET_ROWS_SCRAPS,
    payload,
  };
}

export function getScrapDetail(id, model) {
  return (dispatch) => {
    dispatch(getScrapDetailInfo(id, model));
  };
}

export function createScrap(model, result) {
  return (dispatch) => {
    dispatch(createScrapInfo(model, result));
  };
}

export function updateScrap(id, model, result) {
  return (dispatch) => {
    dispatch(updateScrapInfo(id, model, result));
  };
}

export function resetCreateScrap(result) {
  return {
    type: RESET_CREATE_SCRAP_INFO,
    payload: result,
  };
}

export function resetUpdateScrap(result) {
  return {
    type: RESET_UPDATE_SCRAP_INFO,
    payload: result,
  };
}

export function getValuationsList(company, model, limit, offset, states, customFilters, sortByValue, sortFieldValue, context, isReport) {
  return (dispatch) => {
    dispatch(getValuationsListInfo(company, model, limit, offset, states, customFilters, sortByValue, sortFieldValue, context, isReport));
  };
}

export function getValuationsListExport(company, model, limit, offset, fields, states, customFilters, rows, context, isReport) {
  return (dispatch) => {
    dispatch(getValuationsListExportInfo(company, model, limit, offset, fields, states, customFilters, rows, context, isReport));
  };
}

export function getValuationsCount(company, model, states, customFilters, context, isReport) {
  return (dispatch) => {
    dispatch(getValuationsCountInfo(company, model, states, customFilters, context, isReport));
  };
}

export function createStockHistory(model, result) {
  return (dispatch) => {
    dispatch(createStockHistoryInfo(model, result));
  };
}

export function resetCreateStockHistory(result) {
  return {
    type: RESET_CREATE_STOCK_HISTORY_INFO,
    payload: result,
  };
}

export function resetStockHistory(result) {
  return {
    type: RESET_STOCK_HISTORY_DETAILS_INFO,
    payload: result,
  };
}

export function getStockHistoryDetail(id, model) {
  return (dispatch) => {
    dispatch(getStockHistoryDetailInfo(id, model));
  };
}

export function getProductMovesList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getProductMovesListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue));
  };
}

export function getProductMovesListExport(company, model, limit, offset, fields, customFilters, rows) {
  return (dispatch) => {
    dispatch(getProductMovesListExportInfo(company, model, limit, offset, fields, customFilters, rows));
  };
}

export function getProductMovesCount(company, model, customFilters) {
  return (dispatch) => {
    dispatch(getProductMovesCountInfo(company, model, customFilters));
  };
}

export function getMoveFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PM_FILTERS,
    payload: result,
  };
}

export function getCheckedRowsPM(payload) {
  return {
    type: GET_ROWS_PMS,
    payload,
  };
}

export function getProductMove(id, modelName) {
  return (dispatch) => {
    dispatch(getProductMoveInfo(id, modelName));
  };
}

export function getInventoryReportsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, context) {
  return (dispatch) => {
    dispatch(getInventoryReportsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, context));
  };
}

export function getInventoryReportsExport(company, model, limit, offset, fields, customFilters, rows, context) {
  return (dispatch) => {
    dispatch(getInventoryReportsExportInfo(company, model, limit, offset, fields, customFilters, rows, context));
  };
}

export function getInventoryReportsCount(company, model, customFilters, context) {
  return (dispatch) => {
    dispatch(getInventoryReportsCountInfo(company, model, customFilters, context));
  };
}

export function getInventoryReportsFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: IR_FILTERS,
    payload: result,
  };
}

export function getInventoryReport(id, modelName) {
  return (dispatch) => {
    dispatch(getInventoryReportInfo(id, modelName));
  };
}

export function getWareHouseList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getWareHouseListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getWareHousesCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getWareHousesCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getWareHouse(id, modelName) {
  return (dispatch) => {
    dispatch(getWareHouseInfo(id, modelName));
  };
}

export function getLocationList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getLocationListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getLocationsCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getLocationsCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getLocation(id, modelName) {
  return (dispatch) => {
    dispatch(getLocationInfo(id, modelName));
  };
}

export function getWareHouseFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: WH_FILTERS,
    payload: result,
  };
}

export function getCheckedRowsWH(payload) {
  return {
    type: GET_ROWS_WHS,
    payload,
  };
}

export function getLocationFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: LOC_FILTERS,
    payload: result,
  };
}

export function getCheckedRowsLOC(payload) {
  return {
    type: GET_ROWS_LOCS,
    payload,
  };
}

export function createWarehouse(model, result) {
  return (dispatch) => {
    dispatch(createWarehouseInfo(model, result));
  };
}

export function resetCreateWarehouse(result) {
  return {
    type: RESET_CREATE_WAREHOUSE_INFO,
    payload: result,
  };
}

export function resetUpdateWarehouse(result) {
  return {
    type: RESET_UPDATE_WAREHOUSE_INFO,
    payload: result,
  };
}

export function updateWarehouse(id, model, result) {
  return (dispatch) => {
    dispatch(updateWarehouseInfo(id, model, result));
  };
}

export function getWareHouseListExport(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  return (dispatch) => {
    dispatch(getWareHouseListExportInfo(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows));
  };
}

export function geLocationListExport(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows) {
  return (dispatch) => {
    dispatch(geLocationListExportInfo(company, model, limit, offset, fields, sortByValue, sortFieldValue, customFilters, rows));
  };
}

export function getOperationTypeList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getOperationTypeListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getOperationTypeCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getOperationTypeCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getOperationTypeFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: OPT_FILTERS,
    payload: result,
  };
}

export function createLocation(model, result) {
  return (dispatch) => {
    dispatch(createLocationInfo(model, result));
  };
}

export function resetCreateLocation(result) {
  return {
    type: RESET_CREATE_LOCATION_INFO,
    payload: result,
  };
}

export function resetUpdateLocation(result) {
  return {
    type: RESET_UPDATE_LOCATION_INFO,
    payload: result,
  };
}

export function updateLocation(id, model, result) {
  return (dispatch) => {
    dispatch(updateLocationInfo(id, model, result));
  };
}

export function getSequence(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSequenceInfo(company, model, keyword));
  };
}

export function getWarehouses(company, model, keyword) {
  return (dispatch) => {
    dispatch(getWarehousesInfo(company, model, keyword));
  };
}

export function setRoleId(payload) {
  return {
    type: GET_ROLE_ID,
    payload,
  };
}
export function resetInventoryOverview(payload) {
  return {
    type: RESET_INVENTORY_OVERVIEW_INFO,
    payload,
  };
}

export function getRole(company, model, keyword) {
  return (dispatch) => {
    dispatch(getRoleInfo(company, model, keyword));
  };
}


export function createOperationType(model, result) {
  return (dispatch) => {
    dispatch(createOperationTypeInfo(model, result));
  };
}

export function updateOperationType(id, model, result) {
  return (dispatch) => {
    dispatch(updateOperationTypeInfo(id, model, result));
  };
}

export function resetCreateOpType(result) {
  return {
    type: RESET_CREATE_OPTYPE_INFO,
    payload: result,
  };
}

export function resetUpdateOpType(result) {
  return {
    type: RESET_UPDATE_OPTYPE_INFO,
    payload: result,
  };
}

export function getOperationType(id, modelName, isMini) {
  return (dispatch) => {
    dispatch(getOperationTypeInfo(id, modelName, isMini));
  };
}

export function getCheckedRowsOPT(payload) {
  return {
    type: GET_ROWS_OPTS,
    payload,
  };
}

export function getOperationTypeListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getOperationTypeListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getAddressGroups(company, model) {
  return (dispatch) => {
    dispatch(getAddressGroupsInfo(company, model));
  };
}

export function setInventoryDate(result) {
  return {
    type: SET_CURRENT_INVENTORY_DATE,
    payload: result,
  };
}

export function getProductsGroups(model) {
  return (dispatch) => {
    dispatch(getProductsGroupsInfo(model));
  };
}

export function getInventoryDashboard(start, end) {
  return (dispatch) => {
    dispatch(getInventoryDashboardInfo(start, end));
  };
}

export function createImportId(model, payload) {
  return (dispatch) => {
    dispatch(createImportIdInfo(model, payload));
  };
}

export function uploadImport(payload) {
  return (dispatch) => {
    dispatch(uploadImportInfo(payload));
  };
}

export function resetUploadImport(result) {
  return {
    type: RESET_UPLOAD_BULK_INFO,
    payload: result,
  };
}

export function getMaterialsIssuedInfo(start, end) {
  return (dispatch) => {
    dispatch(getMaterialsIssuedData(start, end));
  };
}

export function getMaterialsReceivedInfo(start, end) {
  return (dispatch) => {
    dispatch(getMaterialsReceivedData(start, end));
  };
}

export function getConsumptionSummary(start, end, product, productCateg, vendor, depart, opTypeValue) {
  return (dispatch) => {
    dispatch(getConsumptionSummaryInfo(start, end, product, productCateg, vendor, depart, opTypeValue));
  };
}

export function getInventoryOverview(start, end, product, productCateg, vendor, depart, limit, offset, isShowArc) {
  return (dispatch) => {
    dispatch(getInventoryOverviewInfo(start, end, product, productCateg, vendor, depart, limit, offset, isShowArc));
  };
}

export function getInventoryOverviewCount(start, end, product, productCateg, vendor, depart, isShowArc) {
  return (dispatch) => {
    dispatch(getInventoryOverviewCountInfo(start, end, product, productCateg, vendor, depart, isShowArc));
  };
}

export function getInventoryOverviewExport(start, end, product, productCateg, vendor, depart, isShowArc) {
  return (dispatch) => {
    dispatch(getInventoryOverviewExportInfo(start, end, product, productCateg, vendor, depart, isShowArc));
  };
}


export function getInwardSummary(start, end, product, productCateg, vendor, depart) {
  return (dispatch) => {
    dispatch(getInwardSummaryInfo(start, end, product, productCateg, vendor, depart));
  };
}

export function getConsumptionDetailSummary(start, end, product, productCateg, vendor, depart, opTypeValue, isStock) {
  return (dispatch) => {
    dispatch(getConsumptionDetailSummaryInfo(start, end, product, productCateg, vendor, depart, opTypeValue, isStock));
  };
}

export function getInwardDetailSummary(start, end, product, productCateg, vendor, depart) {
  return (dispatch) => {
    dispatch(getInwardDetailSummaryInfo(start, end, product, productCateg, vendor, depart));
  };
}

export function resetConsumptionSummary(result) {
  return {
    type: RESET_CONS_SUM_INFO,
    payload: result,
  };
}

export function resetInwardSummary(result) {
  return {
    type: RESET_INWARD_INFO,
    payload: result,
  };
}

export function resetConsumptionDetailSummary(result) {
  return {
    type: RESET_CONS_DET_INFO,
    payload: result,
  };
}

export function resetInwardDetailSummary(result) {
  return {
    type: RESET_INWARD_DET_INFO,
    payload: result,
  };
}

export function clearConsumptionSummary() {
  return (dispatch) => {
    dispatch(clearConsumptionSummaryInfo());
  };
}

export function getProductCategoryInfo(company, model, keyword) {
  return (dispatch) => {
    dispatch(productCategoryList(company, model, keyword));
  };
}

export function getInventoryStatusDashboard(start, end) {
  return (dispatch) => {
    dispatch(getInventoryStatusDashboardInfo(start, end));
  };
}

export function setValidateStock(id, state) {
  return (dispatch) => {
    dispatch(setValidateStockInfo(id, state));
  };
}

export function resetValidateStock(result) {
  return {
    type: RESET_VALIDATE_STOCK_INFO,
    payload: result,
  };
}

export function getStockReasons(company, model, keyword) {
  return (dispatch) => {
    dispatch(getStockReasonsInfo(company, model, keyword));
  };
}

export function getAuditExists(locId, products) {
  return (dispatch) => {
    dispatch(getAuditExistsInfo(locId, products));
  };
}

export function resetAuditExists(result) {
  return {
    type: RESET_AUDIT_EXISTS_INFO,
    payload: result,
  };
}
