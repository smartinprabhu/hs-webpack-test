const initialState = {
  tankerTransactionFilters: {},
  tankerTransactions: {},
  tankerTransactionsExport: {},
  tankerTransactionsCount: null,
  tankerTransactionsCountErr: null,
  tankerTransactionsCountLoading: false,
  tankerDashboard: {},
  tankerTransactionDetail: {},
  reportTankerInfo: {},
  commodityInfo: {},
  tankerDataInfo: {},
  vendorGroupsInfo: {},
  commodityGroupsInfo: {},
  tankerConfig: {},
  tankerStatusInfo: {},
  reasonLoading: false,
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_TANKER_COUNT_INFO':
      return {
        ...state,
        tankerTransactionsCount: null,
        tankerTransactionsCountErr: null,
        tankerTransactionsCountLoading: true,
      };
    case 'GET_TANKER_COUNT_INFO_SUCCESS':
      return {
        ...state,
        tankerTransactionsCountErr: null,
        tankerTransactionsCount: (state.tankerTransactionsCount, action.payload),
        tankerTransactionsCountLoading: false,
      };
    case 'GET_TANKER_COUNT_INFO_FAILURE':
      return {
        ...state,
        tankerTransactionsCountErr: (state.tankerTransactionsCountErr, action.error),
        tankerTransactionsCount: (state.tankerTransactionsCount, false),
        tankerTransactionsCountLoading: false,
      };
    case 'TANKER_FILTERS':
      return {
        ...state,
        tankerTransactionFilters: (state.tankerTransactionFilters, action.payload),
      };
    case 'GET_TANKER_INFO':
      return {
        ...state,
        tankerTransactions: (state.tankerTransactions, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_INFO_SUCCESS':
      return {
        ...state,
        tankerTransactions: (state.tankerTransactions, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TANKER_INFO_FAILURE':
      return {
        ...state,
        tankerTransactions: (state.tankerTransactions, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TANKER_EXPORT_LIST_INFO':
      return {
        ...state,
        tankerTransactionsExport: (state.tankerTransactionsExport, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        tankerTransactionsExport: (state.tankerTransactionsExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TANKER_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        tankerTransactionsExport: (state.tankerTransactionsExport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TANKER_DASHBOARD_INFO':
      return {
        ...state,
        tankerDashboard: (state.tankerDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        tankerDashboard: (state.tankerDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TANKER_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        tankerDashboard: (state.tankerDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TANKER_DETAILS_INFO':
      return {
        ...state,
        tankerTransactionDetail: (state.tankerTransactionDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        tankerTransactionDetail: (state.tankerTransactionDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TANKER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        tankerTransactionDetail: (state.tankerTransactionDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_REPORT_INFO':
      return {
        ...state,
        reportTankerInfo: (state.reportTankerInfo, { loading: true }),
      };
    case 'GET_REPORT_INFO_SUCCESS':
      return {
        ...state,
        reportTankerInfo: (state.reportTankerInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_REPORT_INFO_FAILURE':
      return {
        ...state,
        reportTankerInfo: (state.reportTankerInfo, { loading: false, err: action.error }),
      };
    case 'RESET_REPORT_INFO':
      return {
        ...state,
        reportTankerInfo: (state.reportTankerInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_COMMODITY_INFO':
      return {
        ...state,
        commodityInfo: (state.commodityInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMMODITY_INFO_SUCCESS':
      return {
        ...state,
        commodityInfo: (state.commodityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMMODITY_INFO_FAILURE':
      return {
        ...state,
        commodityInfo: (state.commodityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TT_INFO':
      return {
        ...state,
        tankerDataInfo: (state.tankerDataInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TT_INFO_SUCCESS':
      return {
        ...state,
        tankerDataInfo: (state.tankerDataInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TT_INFO_FAILURE':
      return {
        ...state,
        tankerDataInfo: (state.tankerDataInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VENDOR_GROUP_INFO':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VENDOR_GROUP_INFO_SUCCESS':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VENDOR_GROUP_INFO_FAILURE':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMMODITY_GROUP_INFO':
      return {
        ...state,
        commodityGroupsInfo: (state.commodityGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMMODITY_GROUP_INFO_SUCCESS':
      return {
        ...state,
        commodityGroupsInfo: (state.commodityGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMMODITY_GROUP_INFO_FAILURE':
      return {
        ...state,
        commodityGroupsInfo: (state.commodityGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TANKER_CONFIG_INFO':
      return {
        ...state,
        tankerConfig: (state.tankerConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        tankerConfig: (state.tankerConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TANKER_CONFIG_INFO_FAILURE':
      return {
        ...state,
        tankerConfig: (state.tankerConfig, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TANKER_STATE_CHANGE_INFO':
      return {
        ...state,
        tankerStatusInfo: (state.tankerStatusInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TANKER_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        tankerStatusInfo: (state.tankerStatusInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_TANKER_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        tankerStatusInfo: (state.tankerStatusInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TANKER_STATE_CHANGE_INFO':
      return {
        ...state,
        tankerStatusInfo: (state.tankerStatusInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_REASON_INFO':
      return {
        ...state,
        reasonLoading: true,
      };
    case 'UPDATE_REASON_INFO_SUCCESS':
      return {
        ...state,
        reasonLoading: false,
      };
    case 'UPDATE_REASON_INFO_FAILURE':
      return {
        ...state,
        reasonLoading: false,
      };
    default:
      return state;
  }
}

export default reducer;
