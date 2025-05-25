/* eslint-disable react/destructuring-assignment */
/* eslint-disable comma-dangle */
// import { reduceRight } from "core-js/core/array";

const initialState = {
  pantryFilters: {},
  pantryListInfo: {},
  pantryExport: {},
  pantryCount: null,
  pantryCountErr: null,
  pantryCountLoading: false,
  pantryDetails: {},
  pantryDashboard: {},
  employeeGroupsInfo: {},
  configPantryListInfo: {},
  configPantryCount: null,
  configPantryCountErr: null,
  configPantryCountLoading: false,
  configPantryDetails: {},
  configPantryRows: {},
  locationId: {},
  configPantryFilters: {},
  addConfigPantryInfo: {},
  updateConfigPantryInfo: {},
  cpExportListInfo: {},
  pantryOrderLines: {},
  pantryOrderActionInfo: {},
  parentCategoryInfo: {},
  productCategoryListInfo: {},
  productCategoryCount: null,
  productCategoryCountErr: null,
  productCategoryCountLoading: false,
  productCategoryDetails: {},
  pcExportListInfo: {},
  productCategoryFilters: {},
  deleteInfo: {},
  pcInfo: {},
  addProductCategoryInfo: {},
  updateProductCategoryInfo: {},
  addOrderInfo: {},
  updateOrderInfo: {},
  pantrySearchInfo: {},
  pantryGroupsInfo: {},
  spaceGroupsInfo: {},
  reports: {},
  pantryInfoList: {},
  selectedReportType: null,
  fileDataImage: false,
  addEscalationLevelInfo: {},
  updateEscalationLevelInfo: {},
};

function Reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_PANTRY_COUNT_INFO':
      return {
        ...state,
        pantryCount: null,
        pantryCountErr: null,
        pantryCountLoading: true
      };
    case 'GET_PANTRY_COUNT_INFO_SUCCESS':
      return {
        ...state,
        pantryCountErr: null,
        pantryCount: (state.pantryCount, action.payload),
        pantryCountLoading: false
      };
    case 'GET_PANTRY_COUNT_INFO_FAILURE':
      return {
        ...state,
        pantryCountErr: (state.pantryCountErr, action.error),
        pantryCount: (state.pantryCount, false),
        pantryCountLoading: false
      };
    case 'PANTRY_FILTERS':
      return {
        ...state,
        pantryFilters: (state.pantryFilters, action.payload)
      };
    case 'GET_PANTRY_LIST_INFO':
      return {
        ...state,
        pantryListInfo: (state.pantryListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_LIST_INFO_SUCCESS':
      return {
        ...state,
        pantryListInfo: (state.pantryListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_LIST_INFO_FAILURE':
      return {
        ...state,
        pantryListInfo: (state.pantryListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_EXPORT_LIST_INFO':
      return {
        ...state,
        pantryExport: (state.pantryExport, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        pantryExport: (state.pantryExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        pantryExport: (state.pantryExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_DETAILS_INFO':
      return {
        ...state,
        pantryDetails: (state.pantryDetails, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        pantryDetails: (state.pantryDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_DETAILS_INFO_FAILURE':
      return {
        ...state,
        pantryDetails: (state.pantryDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_DASHBOARD_INFO':
      return {
        ...state,
        pantryDashboard: (state.pantryDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        pantryDashboard: (state.pantryDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        pantryDashboard: (state.pantryDashboard, { loading: false, err: action.error, data: null })
      };
    case 'GET_CP_LIST_INFO':
      return {
        ...state,
        configPantryListInfo: (state.configPantryListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_CP_LIST_INFO_SUCCESS':
      return {
        ...state,
        configPantryListInfo: (state.configPantryListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_CP_LIST_INFO_FAILURE':
      return {
        ...state,
        configPantryListInfo: (state.configPantryListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_CP_COUNT_INFO':
      return {
        ...state,
        configPantryCountLoading: true
      };
    case 'GET_CP_COUNT_INFO_SUCCESS':
      return {
        ...state,
        configPantryCount: (state.configPantryCount, action.payload),
        configPantryCountLoading: false
      };
    case 'GET_CP_COUNT_INFO_FAILURE':
      return {
        ...state,
        configPantryCountErr: (state.configPantryCountErr, action.error),
        configPantryCount: (state.configPantryCount, false),
        configPantryCountLoading: false
      };
    case 'GET_CP_DETAILS_INFO':
      return {
        ...state,
        configPantryDetails: (state.configPantryDetails, { loading: true, data: null, err: null })
      };
    case 'GET_CP_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        configPantryDetails: (state.configPantryDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_CP_DETAILS_INFO_FAILURE':
      return {
        ...state,
        configPantryDetails: (state.configPantryDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_ROWS_CP':
      return {
        ...state,
        configPantryRows: (state.configPantryRows, action.payload)
      };
    case 'GET_SPACE_PANTRY':
      return {
        ...state,
        locationId: (state.locationId, action.payload)
      };
    case 'CP_FILTERS':
      return {
        ...state,
        configPantryFilters: (state.configPantryFilters, action.payload)
      };
    case 'CREATE_CP_INFO':
      return {
        ...state,
        addConfigPantryInfo: (state.addConfigPantryInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_CP_INFO_SUCCESS':
      return {
        ...state,
        addConfigPantryInfo: (state.addConfigPantryInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_CP_INFO_FAILURE':
      return {
        ...state,
        addConfigPantryInfo: (state.addConfigPantryInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_CP_INFO':
      return {
        ...state,
        addConfigPantryInfo: (state.addConfigPantryInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_CP_INFO':
      return {
        ...state,
        updateConfigPantryInfo: (state.updateConfigPantryInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_CP_INFO_SUCCESS':
      return {
        ...state,
        updateConfigPantryInfo: (state.updateConfigPantryInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_CP_INFO_FAILURE':
      return {
        ...state,
        updateConfigPantryInfo: (state.updateConfigPantryInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_CP_INFO':
      return {
        ...state,
        updateConfigPantryInfo: (state.updateConfigPantryInfo, { loading: false, data: null, err: null })
      };
    case 'GET_CP_EXPORT_LIST_INFO':
      return {
        ...state,
        cpExportListInfo: (state.cpExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_CP_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        cpExportListInfo: (state.cpExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_CP_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        cpExportListInfo: (state.cpExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_EMPLOYEES_GROUP_INFO':
      return {
        ...state,
        employeeGroupsInfo: (state.employeeGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_EMPLOYEES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        employeeGroupsInfo: (state.employeeGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_EMPLOYEES_GROUP_INFO_FAILURE':
      return {
        ...state,
        employeeGroupsInfo: (state.employeeGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_ORDER_LINES':
      return {
        ...state,
        pantryOrderLines: (state.pantryOrderLines, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_ORDER_LINES_SUCCESS':
      return {
        ...state,
        pantryOrderLines: (state.pantryOrderLines, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_ORDER_LINES_FAILURE':
      return {
        ...state,
        pantryOrderLines: (state.pantryOrderLines, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_ORDER_OPERATION_INFO':
      return {
        ...state,
        pantryOrderActionInfo: (state.pantryOrderActionInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_ORDER_OPERATION_INFO_SUCCESS':
      return {
        ...state,
        pantryOrderActionInfo: (state.pantryOrderActionInfo, { loading: false, data: action.payload, err: null })
      };
    case 'GET_PANTRY_ORDER_OPERATION_INFO_FAILURE':
      return {
        ...state,
        pantryOrderActionInfo: (state.pantryOrderActionInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_PANTRY_ORDER_OPERATION_INFO':
      return {
        ...state,
        pantryOrderActionInfo: (state.pantryOrderActionInfo, { loading: false, data: null, err: null })
      };
    case 'GET_PARENT_CATEGORY_INFO':
      return {
        ...state,
        parentCategoryInfo: (state.parentCategoryInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PARENT_CATEGORY_INFO_SUCCESS':
      return {
        ...state,
        parentCategoryInfo: (state.parentCategoryInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PARENT_CATEGORY_INFO_FAILURE':
      return {
        ...state,
        parentCategoryInfo: (state.parentCategoryInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PC_LIST_INFO':
      return {
        ...state,
        productCategoryListInfo: (state.productCategoryListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PC_LIST_INFO_SUCCESS':
      return {
        ...state,
        productCategoryListInfo: (state.productCategoryListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PC_LIST_INFO_FAILURE':
      return {
        ...state,
        productCategoryListInfo: (state.productCategoryListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PC_COUNT_INFO':
      return {
        ...state,
        productCategoryCountLoading: true
      };
    case 'GET_PC_COUNT_INFO_SUCCESS':
      return {
        ...state,
        productCategoryCount: (state.productCategoryCount, action.payload),
        productCategoryCountLoading: false
      };
    case 'GET_PC_COUNT_INFO_FAILURE':
      return {
        ...state,
        productCategoryCountErr: (state.productCategoryCountErr, action.error),
        productCategoryCount: (state.productCategoryCount, false),
        productCategoryCountLoading: false
      };
    case 'GET_PC_EXPORT_LIST_INFO':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PC_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PC_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        pcExportListInfo: (state.pcExportListInfo, { loading: false, err: action.error, data: null })
      };
    case 'PC_FILTERS':
      return {
        ...state,
        productCategoryFilters: (state.productCategoryFilters, action.payload)
      };
    case 'DELETE_INFO':
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: true, data: null, err: null })
      };
    case 'DELETE_INFO_SUCCESS':
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'DELETE_INFO_FAILURE':
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_DELETE_INFO':
      return {
        ...state,
        deleteInfo: (state.deleteInfo, { loading: false, data: null, err: null })
      };
    case 'GET_PC_INFO':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PC_INFO_SUCCESS':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PC_INFO_FAILURE':
      return {
        ...state,
        pcInfo: (state.pcInfo, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_PC_INFO':
      return {
        ...state,
        addProductCategoryInfo: (state.addProductCategoryInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_PC_INFO_SUCCESS':
      return {
        ...state,
        addProductCategoryInfo: (state.addProductCategoryInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_PC_INFO_FAILURE':
      return {
        ...state,
        addProductCategoryInfo: (state.addProductCategoryInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_PC_INFO':
      return {
        ...state,
        addProductCategoryInfo: (state.addProductCategoryInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_PC_INFO':
      return {
        ...state,
        updateProductCategoryInfo: (state.updateProductCategoryInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_PC_INFO_SUCCESS':
      return {
        ...state,
        updateProductCategoryInfo: (state.updateProductCategoryInfo, { loading: false, data: action.payload.status, err: null })
      };
    case 'UPDATE_PC_INFO_FAILURE':
      return {
        ...state,
        updateProductCategoryInfo: (state.updateProductCategoryInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_PC_INFO':
      return {
        ...state,
        updateProductCategoryInfo: (state.updateProductCategoryInfo, { loading: false, data: null, err: null })
      };
    case 'CREATE_PANTRY_ORDER_INFO':
      return {
        ...state,
        addOrderInfo: (state.addOrderInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_PANTRY_ORDER_INFO_SUCCESS':
      return {
        ...state,
        addOrderInfo: (state.addOrderInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_PANTRY_ORDER_INFO_FAILURE':
      return {
        ...state,
        addOrderInfo: (state.addOrderInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_PANTRY_ORDER_INFO':
      return {
        ...state,
        addOrderInfo: (state.addOrderInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_PANTRY_ORDER_INFO':
      return {
        ...state,
        updateOrderInfo: (state.updateOrderInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_PANTRY_ORDER_INFO_SUCCESS':
      return {
        ...state,
        updateOrderInfo: (state.updateOrderInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_PANTRY_ORDER_INFO_FAILURE':
      return {
        ...state,
        updateOrderInfo: (state.updateOrderInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_PANTRY_ORDER_INFO':
      return {
        ...state,
        updateOrderInfo: (state.updateOrderInfo, { loading: false, data: null, err: null })
      };
    case 'GET_PC_DETAILS_INFO':
      return {
        ...state,
        productCategoryDetails: (state.productCategoryDetails, { loading: true, data: null, err: null })
      };
    case 'GET_PC_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        productCategoryDetails: (state.productCategoryDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PC_DETAILS_INFO_FAILURE':
      return {
        ...state,
        productCategoryDetails: (state.productCategoryDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_SEARCH_INFO':
      return {
        ...state,
        pantrySearchInfo: (state.pantrySearchInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_SEARCH_INFO_SUCCESS':
      return {
        ...state,
        pantrySearchInfo: (state.pantrySearchInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_SEARCH_INFO_FAILURE':
      return {
        ...state,
        pantrySearchInfo: (state.pantrySearchInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PANTRY_GROUP_INFO':
      return {
        ...state,
        pantryGroupsInfo: (state.pantryGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_GROUP_INFO_SUCCESS':
      return {
        ...state,
        pantryGroupsInfo: (state.pantryGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_GROUP_INFO_FAILURE':
      return {
        ...state,
        pantryGroupsInfo: (state.pantryGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_ORDER_SPACE_GROUP_INFO':
      return {
        ...state,
        spaceGroupsInfo: (state.spaceGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_ORDER_SPACE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        spaceGroupsInfo: (state.spaceGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ORDER_SPACE_GROUP_INFO_FAILURE':
      return {
        ...state,
        spaceGroupsInfo: (state.spaceGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_REPORTS_INFO':
      return {
        ...state,
        reports: (state.reports, { loading: true, data: null, err: null })
      };
    case 'GET_REPORTS_INFO_SUCCESS':
      return {
        ...state,
        reports: (state.reports, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_REPORTS_INFO_FAILURE':
      return {
        ...state,
        reports: (state.reports, { loading: false, err: action.error, data: null })
      };
    case 'GET_SELECTED_REPORT_TYPE':
      return {
        ...state,
        selectedReportType: (state.selectedReportType, action.payload)
      };
      case 'GET_PANTRY_NAME':
      return {
        ...state,
        pantryInfoList: (state.pantryInfoList, { loading: true, data: null, err: null })
      };
    case 'GET_PANTRY_NAME_SUCCESS':
      return {
        ...state,
        pantryInfoList: (state.pantryInfoList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PANTRY_NAME_FAILURE':
      return {
        ...state,
        pantryInfoList: (state.pantryInfoList, { loading: false, err: action.error, data: null })
      };
    case 'SET_PRODUCT_IMAGE':
      return {
        ...state,
        fileDataImage: (state.fileDataImage, action.payload)
      };
    case 'CREATE_ESL_INFO':
      return {
        ...state,
        addEscalationLevelInfo: (state.addEscalationLevelInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_ESL_INFO_SUCCESS':
      return {
        ...state,
        addEscalationLevelInfo: (state.addEscalationLevelInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_ESL_INFO_FAILURE':
      return {
        ...state,
        addEscalationLevelInfo: (state.addEscalationLevelInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_ESL_INFO':
      return {
        ...state,
        addEscalationLevelInfo: (state.addEscalationLevelInfo, { loading: false, data: null, err: null })
      };
    case 'UPDATE_ESL_INFO':
      return {
        ...state,
        updateEscalationLevelInfo: (state.updateEscalationLevelInfo, { loading: true, data: null, err: null })
      };
    case 'UPDATE_ESL_INFO_SUCCESS':
      return {
        ...state,
        updateEscalationLevelInfo: (state.updateEscalationLevelInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_ESL_INFO_FAILURE':
      return {
        ...state,
        updateEscalationLevelInfo: (state.updateEscalationLevelInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_ESL_INFO':
      return {
        ...state,
        updateEscalationLevelInfo: (state.updateEscalationLevelInfo, { loading: false, data: null, err: null })
      };
    default:
      return state;
  }
}

export default Reducer;
