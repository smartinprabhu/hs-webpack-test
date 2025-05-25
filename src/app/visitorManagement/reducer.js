const initialState = {
  visitorRequestFilters: {},
  visitorRequestListInfo: {},
  visitorRequestExport: {},
  visitorRequestRows: {},
  visitorRequestCount: null,
  visitorRequestCountErr: null,
  visitorRequestCountLoading: false,
  visitorRequestDetails: {},
  visitorDashboard: {},
  stateChangeInfo: {},
  addVisitRequestInfo: {},
  visitIdProof: {},
  visitTypes: {},
  visitHostCompany: {},
  hostCompanyGroupInfo: {},
  visitorTypeGroupInfo: {},
  vmsConfigList: {},
  visitorConfiguration: {},
  customDateFilters: [null, null],
  visitRequestUpdate: {},
  visitorLog: {},
  assetTypes: {},
  partsSelected: {},
  assetDetails: {},
  statusLogs: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_VR_COUNT_INFO':
      return {
        ...state,
        visitorRequestCount: null,
        visitorRequestCountErr: null,
        visitorRequestCountLoading: true,
      };
    case 'GET_ROWS_PARTS_SELECTED':
      return {
        ...state,
        partsSelected: (state.partsSelected, action.payload),
      };
    case 'GET_VR_COUNT_INFO_SUCCESS':
      return {
        ...state,
        visitorRequestCountErr: null,
        visitorRequestCount: (state.visitorRequestCount, action.payload),
        visitorRequestCountLoading: false,
      };
    case 'STORE_CUSTOM_DATE_FILTERS':
      return {
        ...state,
        customDateFilters: (state.customDateFilters, action.payload),
      };
    case 'GET_VR_COUNT_INFO_FAILURE':
      return {
        ...state,
        visitorRequestCountErr: (state.visitorRequestCountErr, action.error),
        visitorRequestCount: (state.visitorRequestCount, false),
        visitorRequestCountLoading: false,
      };
    case 'VR_FILTERS':
      return {
        ...state,
        visitorRequestFilters: (state.visitorRequestFilters, action.payload),
      };
    case 'GET_VR_LIST_INFO':
      return {
        ...state,
        visitorRequestListInfo: (state.visitorRequestListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VR_LIST_INFO_SUCCESS':
      return {
        ...state,
        visitorRequestListInfo: (state.visitorRequestListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VR_LIST_INFO_FAILURE':
      return {
        ...state,
        visitorRequestListInfo: (state.visitorRequestListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VR_EXPORT_LIST_INFO':
      return {
        ...state,
        visitorRequestExport: (state.visitorRequestExport, { loading: true, data: null, err: null }),
      };
    case 'GET_VR_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        visitorRequestExport: (state.visitorRequestExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VR_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        visitorRequestExport: (state.visitorRequestExport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_VRS':
      return {
        ...state,
        visitorRequestRows: (state.visitorRequestRows, action.payload),
      };
    case 'GET_VR_DETAILS_INFO':
      return {
        ...state,
        visitorRequestDetails: (state.visitorRequestDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_VR_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        visitorRequestDetails: (state.visitorRequestDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VR_DETAILS_INFO_FAILURE':
      return {
        ...state,
        visitorRequestDetails: (state.visitorRequestDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VM_DASHBOARD_INFO':
      return {
        ...state,
        visitorDashboard: (state.visitorDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_VM_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        visitorDashboard: (state.visitorDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VM_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        visitorDashboard: (state.visitorDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VR_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VR_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_VR_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_TIME_ELAPSED':
      return {
        ...state,
        visitRequestUpdate: (state.visitRequestUpdate, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_TIME_ELAPSED_SUCCESS':
      return {
        ...state,
        visitRequestUpdate: (state.visitRequestUpdate, { loading: false, data: action.payload, err: null }),
      };
    case 'UPDATE_TIME_ELAPSED_FAILURE':
      return {
        ...state,
        visitRequestUpdate: (state.visitRequestUpdate, { loading: false, err: action.error, data: null }),
      };

    case 'GET_VR_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_VR_INFO':
      return {
        ...state,
        addVisitRequestInfo: (state.addVisitRequestInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_VR_INFO_SUCCESS':
      return {
        ...state,
        addVisitRequestInfo: (state.addVisitRequestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_VR_INFO_FAILURE':
      return {
        ...state,
        addVisitRequestInfo: (state.addVisitRequestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_VR_INFO':
      return {
        ...state,
        addVisitRequestInfo: (state.addVisitRequestInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ID_PROOF_INFO':
      return {
        ...state,
        visitIdProof: (state.visitIdProof, { loading: true, data: null, err: null }),
      };
    case 'GET_ID_PROOF_INFO_SUCCESS':
      return {
        ...state,
        visitIdProof: (state.visitIdProof, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ID_PROOF_INFO_FAILURE':
      return {
        ...state,
        visitIdProof: (state.visitIdProof, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VISITOR_TYPE_INFO':
      return {
        ...state,
        visitTypes: (state.visitTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_VISITOR_TYPE_INFO_SUCCESS':
      return {
        ...state,
        visitTypes: (state.visitTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VISITOR_TYPE_INFO_FAILURE':
      return {
        ...state,
        visitTypes: (state.visitTypes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSET_DETAIL_INFO':
      return {
        ...state,
        assetDetails: (state.assetDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_DETAIL_INFO_SUCCESS':
      return {
        ...state,
        assetDetails: (state.assetDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_DETAIL_INFO_FAILURE':
      return {
        ...state,
        assetDetails: (state.assetDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSET_TYPE_INFO':
      return {
        ...state,
        assetTypes: (state.assetTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_TYPE_INFO_SUCCESS':
      return {
        ...state,
        assetTypes: (state.assetTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_TYPE_INFO_FAILURE':
      return {
        ...state,
        assetTypes: (state.assetTypes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HOST_COMPANY_INFO':
      return {
        ...state,
        visitHostCompany: (state.visitHostCompany, { loading: true, data: null, err: null }),
      };
    case 'GET_HOST_COMPANY_INFO_SUCCESS':
      return {
        ...state,
        visitHostCompany: (state.visitHostCompany, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HOST_COMPANY_INFO_FAILURE':
      return {
        ...state,
        visitHostCompany: (state.visitHostCompany, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HC_GROUP_INFO':
      return {
        ...state,
        hostCompanyGroupInfo: (state.hostCompanyGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_HC_GROUP_INFO_SUCCESS':
      return {
        ...state,
        hostCompanyGroupInfo: (state.hostCompanyGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HC_GROUP_INFO_FAILURE':
      return {
        ...state,
        hostCompanyGroupInfo: (state.hostCompanyGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VISITOR_TYPE_GROUP_INFO':
      return {
        ...state,
        visitorTypeGroupInfo: (state.visitorTypeGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_VISITOR_TYPE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        visitorTypeGroupInfo: (state.visitorTypeGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VISITOR_TYPE_GROUP_INFO_FAILURE':
      return {
        ...state,
        visitorTypeGroupInfo: (state.visitorTypeGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VMS_CONFIG_LIST':
      return {
        ...state,
        vmsConfigList: (state.vmsConfigList, { loading: true, data: null, err: null }),
      };
    case 'GET_VMS_CONFIG_SUCCESS_LIST':
      return {
        ...state,
        vmsConfigList: (state.vmsConfigList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VMS_CONFIG_FAILURE_LIST':
      return {
        ...state,
        vmsConfigList: (state.vmsConfigList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VMS_CONFIGUARATION_INFO':
      return {
        ...state,
        visitorConfiguration: (state.visitorConfiguration, { loading: true, data: null, err: null }),
      };
    case 'GET_VMS_CONFIGUARATION_INFO_SUCCESS':
      return {
        ...state,
        visitorConfiguration: (state.visitorConfiguration, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VMS_CONFIGUARATION_INFO_FAILURE':
      return {
        ...state,
        visitorConfiguration: (state.visitorConfiguration, { loading: false, err: action.error, data: null }),
      };
    case 'GET_VISITOR_LOG':
      return {
        ...state,
        visitorLog: (state.visitorLog, { loading: true, data: null, err: null }),
      };
    case 'GET_VISITOR_LOG_SUCCESS':
      return {
        ...state,
        visitorLog: (state.visitorLog, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_VISITOR_LOG_FAILURE':
      return {
        ...state,
        visitorLog: (state.visitorLog, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLOGS_COUNT_INFO':
      return {
        ...state,
        statusLogs: (state.statusLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_SLOGS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        statusLogs: (state.statusLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLOGS_COUNT_INFO_FAILURE':
      return {
        ...state,
        statusLogs: (state.statusLogs, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
