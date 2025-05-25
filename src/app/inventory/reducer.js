/* eslint-disable comma-dangle */
import { GET_INWARD_DET_INFO, GET_INWARD_INFO } from './actions'
const initialState = {
  adjustmentCount: null,
  adjustmentCountErr: null,
  adjustmentCountLoading: false,
  adjustmentFilters: {},
  adjustmentRows: {},
  adjustmentExportInfo: {},
  adjustmentsInfo: {},
  filterInitailValues: {},
  adjustmentDetail: {},
  addAdjustmentInfo: {},
  updateAdjustmentInfo: {},
  actionResultInfo: {},
  adjustmentProducts: {},
  productsListSelected: {},
  currentWorkingTab: {},
  scrapCountLoading: false,
  scrapCount: null,
  scrapCountErr: null,
  scrapFilters: {},
  scrapsInfo: {},
  scrapsExportInfo: {},
  scrapRows: {},
  scrapDetail: {},
  updateScrapInfo: {},
  addScrapInfo: {},
  valuationsList: {},
  valuationCount: null,
  valuationCountErr: null,
  valuationCountLoading: false,
  createStockHistory: {},
  stockHistoryDetail: {},
  movesFilters: {},
  pmListInfo: {},
  pmExportListInfo: {},
  movesRows: {},
  pmCount: null,
  pmCountErr: null,
  pmCountLoading: false,
  pmDetails: {},
  invReportFilters: {},
  invReportListInfo: {},
  invReportExportListInfo: {},
  invReportCount: null,
  invReportCountErr: null,
  invReportCountLoading: false,
  invReportDetails: {},
  wareHouseListInfo: {},
  wareHouseCount: null,
  wareHouseCountErr: null,
  wareHouseCountLoading: false,
  wareHouseDetails: {},
  wareHouseRows: {},
  wareHouseFilters: {},
  locationListInfo: {},
  locationCount: null,
  locationCountErr: null,
  locationCountLoading: false,
  locationDetails: {},
  locationFilters: {},
  locationsRows: {},
  addWarehouseInfo: {},
  updateWarehouseInfo: {},
  updateLocationInfo: {},
  whExportListInfo: {},
  locationExportListInfo: {},
  operationTypeListInfo: {},
  operationTypeCount: null,
  operationTypeCountErr: null,
  operationTypeCountLoading: false,
  operationTypeFilters: {},
  addLocationInfo: {},
  referenceSequence: {},
  warehouseList: {},
  addOpTypeInfo: {},
  updateOpTypeInfo: {},
  operationTypeDetails: {},
  operationTypeRows: {},
  optExportListInfo: {},
  addressInfo: {},
  currentInventoryDate: false,
  productGroupsInfo: {},
  inventoryDashboard: {},
  bulkImportInitiateInfo: {},
  bulkUploadInfo: {},
  materialIssued: {},
  materialReceived: {},
  inventoryStatusDashboard: {},
  consumptionSummary: {},
  productCategoryInfo: {},
  inwardSummary: {},
  consumptionDetailSummary: {},
  inwardDetailSummary: {},
  stockValidateInfo: {},
  stockReasons: {},
  inventoryOverview: {},
  bulkUploadTrue: false,
  inventoryOverviewCount: null,
  inventoryOverviewCountErr: null,
  inventoryOverviewCountLoading: false,
  inventoryOverviewExport: {},
  roleInfoList: {},
  roleId: {},
  auditExistsInfo: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_INVENTORY_OVERVIEW_COUNT_INFO':
      return {
        ...state,
        inventoryOverviewCountLoading: true,
      };
    case 'GET_INVENTORY_OVERVIEW_COUNT_INFO_SUCCESS':
      return {
        ...state,
        inventoryOverviewCount: (state.inventoryOverviewCount, action.payload),
        inventoryOverviewCountLoading: false,
      };
    case 'GET_INVENTORY_OVERVIEW_COUNT_INFO_FAILURE':
      return {
        ...state,
        inventoryOverviewCountErr: (state.inventoryOverviewCountErr, action.error),
        inventoryOverviewCount: (state.inventoryOverviewCount, false),
        inventoryOverviewCountLoading: false,
      };
    case 'GET_ADJUSTMENTS_COUNT_INFO':
      return {
        ...state,
        adjustmentCountLoading: true
      };
    case 'GET_ADJUSTMENTS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        adjustmentCount: (state.adjustmentCount, action.payload),
        adjustmentCountLoading: false
      };
    case 'GET_ADJUSTMENTS_COUNT_INFO_FAILURE':
      return {
        ...state,
        adjustmentCountErr: (state.adjustmentCountErr, action.error),
        adjustmentCountLoading: false
      };
    case 'ADJUSTMENTS_FILTERS':
      return {
        ...state,
        adjustmentFilters: (state.adjustmentFilters, action.payload)
      };
    case 'GET_ADJUSTMENTS_INFO':
      return {
        ...state,
        adjustmentsInfo: (state.adjustmentsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_ADJUSTMENTS_INFO_SUCCESS':
      return {
        ...state,
        adjustmentsInfo: (state.adjustmentsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ADJUSTMENTS_INFO_FAILURE':
      return {
        ...state,
        adjustmentsInfo: (state.adjustmentsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ADJUSTMENTS_EXPORT_INFO':
      return {
        ...state,
        adjustmentExportInfo: (state.adjustmentExportInfo, { loading: true, data: null, err: null })
      };
    case 'GET_ADJUSTMENTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        adjustmentExportInfo: (state.adjustmentExportInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ADJUSTMENTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        adjustmentExportInfo: (state.adjustmentExportInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_ADJUSTMENTS':
      return {
        ...state,
        adjustmentRows: (state.adjustmentRows, action.payload)
      };
    case 'FILTER_VALUES':
      return {
        ...state,
        filterInitailValues: (state.filterInitailValues, action.payload)
      };
    case 'GET_ADJUSTMENT_DETAILS_INFO':
      return {
        ...state,
        adjustmentDetail: (state.adjustmentDetail, { loading: true, data: null, err: null })
      };
    case 'GET_ADJUSTMENT_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        adjustmentDetail: (state.adjustmentDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ADJUSTMENT_DETAILS_INFO_FAILURE':
      return {
        ...state,
        adjustmentDetail: (state.adjustmentDetail, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_ADJUSTMENT_INFO':
      return {
        ...state,
        addAdjustmentInfo: (state.addAdjustmentInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_ADJUSTMENT_INFO_SUCCESS':
      return {
        ...state,
        addAdjustmentInfo: (state.addAdjustmentInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_ADJUSTMENT_INFO_FAILURE':
      return {
        ...state,
        addAdjustmentInfo: (state.addAdjustmentInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_ADJUSTMENT_INFO':
      return {
        ...state,
        addAdjustmentInfo: (state.addAdjustmentInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_ADJUSTMENT_INFO':
      return {
        ...state,
        updateAdjustmentInfo: (state.updateAdjustmentInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_ADJUSTMENT_INFO_SUCCESS':
      return {
        ...state,
        updateAdjustmentInfo: (state.updateAdjustmentInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_ADJUSTMENT_INFO_FAILURE':
      return {
        ...state,
        updateAdjustmentInfo: (state.updateAdjustmentInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_ADJUSTMENT_INFO':
      return {
        ...state,
        updateAdjustmentInfo: (state.updateAdjustmentInfo, { loading: false, data: null, err: null })
      };
    case 'GET_ADJUSTMENT_OPERATION_INFO':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: true, data: null, err: null })
      };
    case 'GET_ADJUSTMENT_OPERATION_INFO_SUCCESS':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, data: action.payload, err: null })
      };
    case 'GET_ADJUSTMENT_OPERATION_INFO_FAILURE':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_ADJUSTMENT_OPERATION_INFO':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, data: null, err: null })
      };
    case 'GET_ADJUSTMENT_PRODUCTS':
      return {
        ...state,
        adjustmentProducts: (state.adjustmentProducts, { loading: true, data: null, err: null })
      };
    case 'GET_ADJUSTMENT_PRODUCTS_SUCCESS':
      return {
        ...state,
        adjustmentProducts: (state.adjustmentProducts, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ADJUSTMENT_PRODUCTS_FAILURE':
      return {
        ...state,
        adjustmentProducts: (state.adjustmentProducts, { loading: false, err: action.error, data: null })
      };
    case 'GET_PRODUCTS_SELECTED':
      return {
        ...state,
        productsListSelected: (state.productsListSelected, action.payload)
      };
    case 'SET_CURRENT_INVENTORY_TAB':
      return {
        ...state,
        currentWorkingTab: (state.currentWorkingTab, { data: action.payload })
      };
    case 'SET_CURRENT_INVENTORY_DATE':
      return {
        ...state,
        currentInventoryDate: (state.currentInventoryDate, { data: action.payload })
      };
    case 'GET_SCRAPS_COUNT_INFO':
      return {
        ...state,
        scrapCountLoading: true
      };
    case 'GET_SCRAPS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        scrapCount: (state.scrapCount, action.payload),
        scrapCountLoading: false
      };
    case 'GET_SCRAPS_COUNT_INFO_FAILURE':
      return {
        ...state,
        scrapCountErr: (state.scrapCountErr, action.error),
        scrapCountLoading: false
      };
    case 'SCRAPS_FILTERS':
      return {
        ...state,
        scrapFilters: (state.scrapFilters, action.payload)
      };
    case 'GET_SCRAPS_INFO':
      return {
        ...state,
        scrapsInfo: (state.scrapsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_SCRAPS_INFO_SUCCESS':
      return {
        ...state,
        scrapsInfo: (state.scrapsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SCRAPS_INFO_FAILURE':
      return {
        ...state,
        scrapsInfo: (state.scrapsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_SCRAPS_EXPORT_INFO':
      return {
        ...state,
        scrapsExportInfo: (state.scrapsExportInfo, { loading: true, data: null, err: null })
      };
    case 'GET_SCRAPS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        scrapsExportInfo: (state.scrapsExportInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SCRAPS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        scrapsExportInfo: (state.scrapsExportInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_SCRAPS':
      return {
        ...state,
        scrapRows: (state.scrapRows, action.payload)
      };
    case 'GET_SCRAP_DETAILS_INFO':
      return {
        ...state,
        scrapDetail: (state.scrapDetail, { loading: true, data: null, err: null })
      };
    case 'GET_SCRAP_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        scrapDetail: (state.scrapDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SCRAP_DETAILS_INFO_FAILURE':
      return {
        ...state,
        scrapDetail: (state.scrapDetail, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_SCRAP_INFO':
      return {
        ...state,
        addScrapInfo: (state.addScrapInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_SCRAP_INFO_SUCCESS':
      return {
        ...state,
        addScrapInfo: (state.addScrapInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_SCRAP_INFO_FAILURE':
      return {
        ...state,
        addScrapInfo: (state.addScrapInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_SCRAP_INFO':
      return {
        ...state,
        addScrapInfo: (state.addScrapInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_SCRAP_INFO':
      return {
        ...state,
        updateScrapInfo: (state.updateScrapInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_SCRAP_INFO_SUCCESS':
      return {
        ...state,
        updateScrapInfo: (state.updateScrapInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_SCRAP_INFO_FAILURE':
      return {
        ...state,
        updateScrapInfo: (state.updateScrapInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_SCRAP_INFO':
      return {
        ...state,
        updateScrapInfo: (state.updateScrapInfo, { loading: false, data: null, err: null })
      };
    case 'GET_VALUATIONS_COUNT_INFO':
      return {
        ...state,
        valuationCountLoading: true
      };
    case 'GET_VALUATIONS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        valuationCount: (state.valuationCount, action.payload),
        valuationCountLoading: false
      };
    case 'GET_VALUATIONS_COUNT_INFO_FAILURE':
      return {
        ...state,
        valuationCountErr: (state.valuationCountErr, action.error),
        valuationCountLoading: false
      };
    case 'GET_VALUATIONS_INFO':
      return {
        ...state,
        valuationsList: (state.valuationsList, { loading: true, data: null, err: null })
      };
    case 'GET_VALUATIONS_INFO_SUCCESS':
      return {
        ...state,
        valuationsList: (state.valuationsList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_VALUATIONS_INFO_FAILURE':
      return {
        ...state,
        valuationsList: (state.valuationsList, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_STOCK_HISTORY_INFO':
      return {
        ...state,
        createStockHistory: (state.createStockHistory, { loading: true, data: null, err: null })
      };
    case 'CREATE_STOCK_HISTORY_INFO_SUCCESS':
      return {
        ...state,
        createStockHistory: (state.createStockHistory, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_STOCK_HISTORY_INFO_FAILURE':
      return {
        ...state,
        createStockHistory: (state.createStockHistory, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_STOCK_HISTORY_INFO':
      return {
        ...state,
        createStockHistory: (state.createStockHistory, { loading: false, data: null, err: null })
      };
    case 'GET_STOCK_HISTORY_DETAILS_INFO':
      return {
        ...state,
        stockHistoryDetail: (state.stockHistoryDetail, { loading: true, data: null, err: null })
      };
    case 'GET_STOCK_HISTORY_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        stockHistoryDetail: (state.stockHistoryDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_STOCK_HISTORY_DETAILS_INFO_FAILURE':
      return {
        ...state,
        stockHistoryDetail: (state.stockHistoryDetail, { loading: false, err: action.error, data: null })
      };
    case 'RESET_STOCK_HISTORY_DETAILS_INFO':
      return {
        ...state,
        stockHistoryDetail: (state.stockHistoryDetail, { loading: false, data: null, err: null })
      };
    case 'GET_PM_COUNT_INFO':
      return {
        ...state,
        pmCountLoading: true
      };
    case 'GET_PM_COUNT_INFO_SUCCESS':
      return {
        ...state,
        pmCount: (state.pmCount, action.payload),
        pmCountLoading: false
      };
    case 'GET_PM_COUNT_INFO_FAILURE':
      return {
        ...state,
        pmCountErr: (state.pmCountErr, action.error),
        pmCount: (state.pmCount, false),
        pmCountLoading: false
      };
    case 'PM_FILTERS':
      return {
        ...state,
        movesFilters: (state.movesFilters, action.payload)
      };
    case 'GET_PM_LIST_INFO':
      return {
        ...state,
        pmListInfo: (state.pmListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PM_LIST_INFO_SUCCESS':
      return {
        ...state,
        pmListInfo: (state.pmListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PM_LIST_INFO_FAILURE':
      return {
        ...state,
        pmListInfo: (state.pmListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PM_EXPORT_LIST_INFO':
      return {
        ...state,
        pmExportListInfo: (state.pmExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PM_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        pmExportListInfo: (state.pmExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PM_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        pmExportListInfo: (state.pmExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_PMS':
      return {
        ...state,
        movesRows: (state.movesRows, action.payload)
      };
    case 'GET_PM_DETAILS_INFO':
      return {
        ...state,
        pmDetails: (state.pmDetails, { loading: true, data: null, err: null })
      };
    case 'GET_PM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        pmDetails: (state.pmDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        pmDetails: (state.pmDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_IR_COUNT_INFO':
      return {
        ...state,
        invReportCountLoading: true
      };
    case 'GET_IR_COUNT_INFO_SUCCESS':
      return {
        ...state,
        invReportCount: (state.invReportCount, action.payload),
        invReportCountLoading: false
      };
    case 'GET_IR_COUNT_INFO_FAILURE':
      return {
        ...state,
        invReportCountErr: (state.invReportCountErr, action.error),
        invReportCount: (state.invReportCount, false),
        invReportCountLoading: false
      };
    case 'IR_FILTERS':
      return {
        ...state,
        invReportFilters: (state.invReportFilters, action.payload)
      };
    case 'GET_IR_LIST_INFO':
      return {
        ...state,
        invReportListInfo: (state.invReportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_IR_LIST_INFO_SUCCESS':
      return {
        ...state,
        invReportListInfo: (state.invReportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_IR_LIST_INFO_FAILURE':
      return {
        ...state,
        invReportListInfo: (state.invReportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_IR_EXPORT_LIST_INFO':
      return {
        ...state,
        invReportExportListInfo: (state.invReportExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_IR_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        invReportExportListInfo: (state.invReportExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_IR_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        invReportExportListInfo: (state.invReportExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_IR_DETAILS_INFO':
      return {
        ...state,
        invReportDetails: (state.invReportDetails, { loading: true, data: null, err: null })
      };
    case 'GET_IR_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        invReportDetails: (state.invReportDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_IR_DETAILS_INFO_FAILURE':
      return {
        ...state,
        invReportDetails: (state.invReportDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_VALUATIONS_EXPORT_INFO':
      return {
        ...state,
        valuationExportList: (state.valuationExportList, { loading: true, data: null, err: null })
      };
    case 'GET_VALUATIONS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        valuationExportList: (state.valuationExportList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_VALUATIONS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        valuationExportList: (state.valuationExportList, { loading: false, err: action.error, data: null })
      };
    case 'GET_WAREHOUSE_LIST_INFO':
      return {
        ...state,
        wareHouseListInfo: (state.wareHouseListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_WAREHOUSE_LIST_INFO_SUCCESS':
      return {
        ...state,
        wareHouseListInfo: (state.wareHouseListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WAREHOUSE_LIST_INFO_FAILURE':
      return {
        ...state,
        wareHouseListInfo: (state.wareHouseListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_WAREHOUSE_COUNT_INFO':
      return {
        ...state,
        wareHouseCountLoading: true
      };
    case 'GET_WAREHOUSE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        wareHouseCount: (state.wareHouseCount, action.payload),
        wareHouseCountLoading: false
      };
    case 'GET_WAREHOUSE_COUNT_INFO_FAILURE':
      return {
        ...state,
        wareHouseCountErr: (state.wareHouseCountErr, action.error),
        wareHouseCount: (state.wareHouseCount, false),
        wareHouseCountLoading: false
      };
    case 'GET_WAREHOUSE_DETAILS_INFO':
      return {
        ...state,
        wareHouseDetails: (state.wareHouseDetails, { loading: true, data: null, err: null })
      };
    case 'GET_WAREHOUSE_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        wareHouseDetails: (state.wareHouseDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WAREHOUSE_DETAILS_INFO_FAILURE':
      return {
        ...state,
        wareHouseDetails: (state.wareHouseDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_WHS':
      return {
        ...state,
        wareHouseRows: (state.wareHouseRows, action.payload)
      };
    case 'WH_FILTERS':
      return {
        ...state,
        wareHouseFilters: (state.wareHouseFilters, action.payload)
      };
    case 'GET_LOCATION_LIST_INFO':
      return {
        ...state,
        locationListInfo: (state.locationListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_LOCATION_LIST_INFO_SUCCESS':
      return {
        ...state,
        locationListInfo: (state.locationListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_LOCATION_LIST_INFO_FAILURE':
      return {
        ...state,
        locationListInfo: (state.locationListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_LOCATION_COUNT_INFO':
      return {
        ...state,
        locationCountLoading: true
      };
    case 'GET_LOCATION_COUNT_INFO_SUCCESS':
      return {
        ...state,
        locationCount: (state.locationCount, action.payload),
        locationCountLoading: false
      };
    case 'GET_LOCATION_COUNT_INFO_FAILURE':
      return {
        ...state,
        locationCountErr: (state.locationCountErr, action.error),
        locationCount: (state.locationCount, false),
        locationCountLoading: false
      };
    case 'GET_LOCATION_DETAILS_INFO':
      return {
        ...state,
        locationDetails: (state.locationDetails, { loading: true, data: null, err: null })
      };
    case 'GET_LOCATION_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        locationDetails: (state.locationDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_LOCATION_DETAILS_INFO_FAILURE':
      return {
        ...state,
        locationDetails: (state.locationDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_LOCS':
      return {
        ...state,
        locationsRows: (state.locationsRows, action.payload)
      };
    case 'LOC_FILTERS':
      return {
        ...state,
        locationFilters: (state.locationFilters, action.payload)
      };
    case 'CREATE_WAREHOUSE_INFO':
      return {
        ...state,
        addWarehouseInfo: (state.addWarehouseInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_WAREHOUSE_INFO_SUCCESS':
      return {
        ...state,
        addWarehouseInfo: (state.addWarehouseInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_WAREHOUSE_INFO_FAILURE':
      return {
        ...state,
        addWarehouseInfo: (state.addWarehouseInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_WAREHOUSE_INFO':
      return {
        ...state,
        addWarehouseInfo: (state.addWarehouseInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_WAREHOUSE_INFO':
      return {
        ...state,
        updateWarehouseInfo: (state.updateWarehouseInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_WAREHOUSE_INFO_SUCCESS':
      return {
        ...state,
        updateWarehouseInfo: (state.updateWarehouseInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_WAREHOUSE_INFO_FAILURE':
      return {
        ...state,
        updateWarehouseInfo: (state.updateWarehouseInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_WAREHOUSE_INFO':
      return {
        ...state,
        updateWarehouseInfo: (state.updateWarehouseInfo, { loading: false, data: null, err: null })
      };
    case 'GET_WH_EXPORT_LIST_INFO':
      return {
        ...state,
        whExportListInfo: (state.whExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_WH_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        whExportListInfo: (state.whExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WH_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        whExportListInfo: (state.whExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_LOCATION_EXPORT_LIST_INFO':
      return {
        ...state,
        locationExportListInfo: (state.locationExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_LOCATION_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        locationExportListInfo: (state.locationExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_LOCATION_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        locationExportListInfo: (state.locationExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_OPERATIONTYPE_LIST_INFO':
      return {
        ...state,
        operationTypeListInfo: (state.operationTypeListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_OPERATIONTYPE_LIST_INFO_SUCCESS':
      return {
        ...state,
        operationTypeListInfo: (state.operationTypeListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OPERATIONTYPE_LIST_INFO_FAILURE':
      return {
        ...state,
        operationTypeListInfo: (state.operationTypeListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_OPERATIONTYPE_COUNT_INFO':
      return {
        ...state,
        operationTypeCountLoading: true
      };
    case 'GET_OPERATIONTYPE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        operationTypeCount: (state.operationTypeCount, action.payload),
        operationTypeCountLoading: false
      };
    case 'GET_OPERATIONTYPE_COUNT_INFO_FAILURE':
      return {
        ...state,
        operationTypeCountErr: (state.operationTypeCountErr, action.error),
        operationTypeCount: (state.operationTypeCount, false),
        operationTypeCountLoading: false
      };
    case 'OPT_FILTERS':
      return {
        ...state,
        operationTypeFilters: (state.operationTypeFilters, action.payload)
      };
    case 'CREATE_LOCATION_INFO':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_LOCATION_INFO_SUCCESS':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_LOCATION_INFO_FAILURE':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_LOCATION_INFO':
      return {
        ...state,
        addLocationInfo: (state.addLocationInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_LOCATION_INFO':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_LOCATION_INFO_SUCCESS':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_LOCATION_INFO_FAILURE':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_LOCATION_INFO':
      return {
        ...state,
        updateLocationInfo: (state.updateLocationInfo, { loading: false, data: null, err: null })
      };
    case 'GET_SEQUENCE_INFO':
      return {
        ...state,
        referenceSequence: (state.referenceSequence, { loading: true, data: null, err: null })
      };
    case 'GET_SEQUENCE_INFO_SUCCESS':
      return {
        ...state,
        referenceSequence: (state.referenceSequence, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SEQUENCE_INFO_FAILURE':
      return {
        ...state,
        referenceSequence: (state.referenceSequence, { loading: false, err: action.error, data: null })
      };
    case 'GET_WAREHOUSES_INFO':
      return {
        ...state,
        warehouseList: (state.warehouseList, { loading: true, data: null, err: null })
      };
    case 'GET_WAREHOUSES_INFO_SUCCESS':
      return {
        ...state,
        warehouseList: (state.warehouseList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WAREHOUSES_INFO_FAILURE':
      return {
        ...state,
        warehouseList: (state.warehouseList, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_OPTYPE_INFO':
      return {
        ...state,
        addOpTypeInfo: (state.addOpTypeInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_OPTYPE_INFO_SUCCESS':
      return {
        ...state,
        addOpTypeInfo: (state.addOpTypeInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_OPTYPE_INFO_FAILURE':
      return {
        ...state,
        addOpTypeInfo: (state.addOpTypeInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_OPTYPE_INFO':
      return {
        ...state,
        addOpTypeInfo: (state.addOpTypeInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_OPTYPE_INFO':
      return {
        ...state,
        updateOpTypeInfo: (state.updateOpTypeInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_OPTYPE_INFO_SUCCESS':
      return {
        ...state,
        updateOpTypeInfo: (state.updateOpTypeInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_OPTYPE_INFO_FAILURE':
      return {
        ...state,
        updateOpTypeInfo: (state.updateOpTypeInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_OPTYPE_INFO':
      return {
        ...state,
        updateOpTypeInfo: (state.updateOpTypeInfo, { loading: false, data: null, err: null })
      };
    case 'GET_OPTYPE_DETAILS_INFO':
      return {
        ...state,
        operationTypeDetails: (state.operationTypeDetails, { loading: true, data: null, err: null })
      };
    case 'GET_OPTYPE_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        operationTypeDetails: (state.operationTypeDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OPTYPE_DETAILS_INFO_FAILURE':
      return {
        ...state,
        operationTypeDetails: (state.operationTypeDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_OPTS':
      return {
        ...state,
        operationTypeRows: (state.operationTypeRows, action.payload)
      };
    case 'GET_OPT_EXPORT_LIST_INFO':
      return {
        ...state,
        optExportListInfo: (state.optExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_OPT_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        optExportListInfo: (state.optExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OPT_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        optExportListInfo: (state.optExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ADDRESS_GROUP_INFO':
      return {
        ...state,
        addressInfo: (state.addressInfo, { loading: true, data: null, err: null })
      };
    case 'GET_ADDRESS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        addressInfo: (state.addressInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ADDRESS_GROUP_INFO_FAILURE':
      return {
        ...state,
        addressInfo: (state.addressInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PRODUCTS_GROUP_INFO':
      return {
        ...state,
        productGroupsInfo: (state.productGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PRODUCTS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        productGroupsInfo: (state.productGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PRODUCTS_GROUP_INFO_FAILURE':
      return {
        ...state,
        productGroupsInfo: (state.productGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_INVENTORY_DASHBOARD_INFO':
      return {
        ...state,
        inventoryDashboard: (state.inventoryDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_INVENTORY_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        inventoryDashboard: (state.inventoryDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INVENTORY_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        inventoryDashboard: (state.inventoryDashboard, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_IMPORT_ID_INFO':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: true, err: null, data: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_SUCCESS':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_IMPORT_ID_INFO_FAILURE':
      return {
        ...state,
        bulkImportInitiateInfo: (state.bulkImportInitiateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: true, err: null, data: null }),
      };
    case 'UPLOAD_IMPORT_INFO_SUCCESS':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPLOAD_IMPORT_INFO_FAILURE':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPLOAD_BULK_INFO':
      return {
        ...state,
        bulkUploadInfo: (state.bulkUploadInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_MATERIALS_ISSUED':
      return {
        ...state,
        materialIssued: (state.materialIssued, { loading: true, data: null, err: null }),
      };
    case 'GET_MATERIALS_ISSUED_SUCCESS':
      return {
        ...state,
        materialIssued: (state.materialIssued, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MATERIALS_ISSUED_FAILURE':
      return {
        ...state,
        materialIssued: (state.materialIssued, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MATERIALS_RECEIVED':
      return {
        ...state,
        materialReceived: (state.materialReceived, { loading: true, data: null, err: null }),
      };
    case 'GET_MATERIALS_RECEIVED_SUCCESS':
      return {
        ...state,
        materialReceived: (state.materialReceived, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MATERIALS_RECEIVED_FAILURE':
      return {
        ...state,
        materialReceived: (state.materialReceived, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INVENTORY_STATUS_DASHBOARD_INFO':
      return {
        ...state,
        inventoryStatusDashboard: (state.inventoryStatusDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_INVENTORY_STATUS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        inventoryStatusDashboard: (state.inventoryStatusDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INVENTORY_STATUS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        inventoryStatusDashboard: (state.inventoryStatusDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CONS_SUM_INFO':
      return {
        ...state,
        consumptionSummary: (state.consumptionSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_CONS_SUM_INFO_SUCCESS':
      return {
        ...state,
        consumptionSummary: (state.consumptionSummary, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_CONS_SUM_INFO_FAILURE':
      return {
        ...state,
        consumptionSummary: (state.consumptionSummary, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_INVENTORY_OVERVIEW_INFO':
      return {
        ...state,
        inventoryOverview: (state.inventoryOverview, { loading: false, data: null, err: null })
      };
    case 'GET_INVENTORY_OVERVIEW_INFO':
      return {
        ...state,
        inventoryOverview: (state.inventoryOverview, { loading: true, data: null, err: null }),
      };
    case 'GET_INVENTORY_OVERVIEW_INFO_SUCCESS':
      return {
        ...state,
        inventoryOverview: (state.inventoryOverview, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INVENTORY_OVERVIEW_INFO_FAILURE':
      return {
        ...state,
        inventoryOverview: (state.inventoryOverview, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INVENTORY_OVERVIEW_EXPORT_INFO':
      return {
        ...state,
        inventoryOverviewExport: (state.inventoryOverviewExport, { loading: true, data: null, err: null }),
      };
    case 'GET_INVENTORY_OVERVIEW_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        inventoryOverviewExport: (state.inventoryOverviewExport, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INVENTORY_OVERVIEW_EXPORT_INFO_FAILURE':
      return {
        ...state,
        inventoryOverviewExport: (state.inventoryOverviewExport, { loading: false, err: action.error, data: null }),
      };

    case GET_INWARD_INFO:
      return {
        ...state,
        inwardSummary: (state.inwardSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_INWARD_INFO_SUCCESS':
      return {
        ...state,
        inwardSummary: (state.inwardSummary, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INWARD_INFO_FAILURE':
      return {
        ...state,
        inwardSummary: (state.inwardSummary, { loading: false, err: action.error, data: null }),
      };
    case GET_INWARD_DET_INFO:
      return {
        ...state,
        inwardDetailSummary: (state.inwardDetailSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_INWARD_DET_INFO_SUCCESS':
      return {
        ...state,
        inwardDetailSummary: (state.inwardDetailSummary, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INWARD_DET_INFO_FAILURE':
      return {
        ...state,
        inwardDetailSummary: (state.inwardDetailSummary, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CONS_DET_INFO':
      return {
        ...state,
        consumptionDetailSummary: (state.consumptionDetailSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_CONS_DET_INFO_SUCCESS':
      return {
        ...state,
        consumptionDetailSummary: (state.consumptionDetailSummary, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_CONS_DET_INFO_FAILURE':
      return {
        ...state,
        consumptionDetailSummary: (state.consumptionDetailSummary, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CONS_SUM_INFO':
      return {
        ...state,
        consumptionSummary: (state.consumptionSummary, { loading: false, data: null, err: null }),
      };
    case 'RESET_INWARD_INFO':
      return {
        ...state,
        inwardSummary: (state.inwardSummary, { loading: false, data: null, err: null }),
      };
    case 'RESET_CONS_DET_INFO':
      return {
        ...state,
        consumptionDetailSummary: (state.consumptionDetailSummary, { loading: false, data: null, err: null }),
      };
    case 'RESET_INWARD_DET_INFO':
      return {
        ...state,
        inwardDetailSummary: (state.inwardDetailSummary, { loading: false, data: null, err: null }),
      };
    case 'CLEAR_CONS_SUM_INFO':
      return {
        ...state,
        consumptionSummary: {},
      };
    case 'PRODUCT_CATEGORY_INFO':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: true, data: null, err: null })
      };
    case 'PRODUCT_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'PRODUCT_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        productCategoryInfo: (state.productCategoryInfo, { loading: false, data: null, err: action.error })
      };
    case 'SET_VALIDATE_STOCK_INFO':
      return {
        ...state,
        stockValidateInfo: (state.stockValidateInfo, { loading: true, data: null, err: null }),
      };
    case 'SET_VALIDATE_STOCK_INFO_SUCCESS':
      return {
        ...state,
        stockValidateInfo: (state.stockValidateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'SET_VALIDATE_STOCK_INFO_FAILURE':
      return {
        ...state,
        stockValidateInfo: (state.stockValidateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_VALIDATE_STOCK_INFO':
      return {
        ...state,
        stockValidateInfo: (state.stockValidateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_STOCK_REASONS_INFO':
      return {
        ...state,
        stockReasons: (state.stockReasons, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_REASONS_INFO_SUCCESS':
      return {
        ...state,
        stockReasons: (state.stockReasons, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_REASONS_INFO_FAILURE':
      return {
        ...state,
        stockReasons: (state.stockReasons, { loading: false, err: action.error, data: null }),
      };
    case 'BULK_UPLOAD_TRUE':
      return {
        ...state,
        bulkUploadTrue: action.payload
      };
    case 'GET_ROLE_INFO':
      return {
        ...state,
        roleInfoList: (state.roleInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_ROLE_INFO_SUCCESS':
      return {
        ...state,
        roleInfoList: (state.roleInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ROLE_INFO_FAILURE':
      return {
        ...state,
        roleInfoList: (state.roleInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROLE_ID':
      return {
        ...state,
        roleId: (state.roleId, action.payload),
      };
      case 'GET_AUDIT_EXISTS_INFO':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AUDIT_EXISTS_INFO_SUCCESS':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: false, data: action.payload && action.payload.data, err: null }),
      };
    case 'GET_AUDIT_EXISTS_INFO_FAILURE':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_AUDIT_EXISTS_INFO':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
