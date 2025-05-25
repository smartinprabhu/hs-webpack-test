const initialState = {
  trackerCount: null,
  trackerCountErr: null,
  trackerCountLoading: false,
  trackerFilters: {},
  trackerRows: {},
  trackerExportInfo: {},
  trackerInfo: {},
  addTrackerInfo: {},
  actGroupInfo: {},
  trackerDetails: {},
  bmsDetails: {},
  submittedToInfo: {},
  trackerActInfo: {},
  trackerTemplateInfo: {},
  trackerLogs: {},
  trackerEvidence: {},
  stateChangeInfo: {},
  trackerDashboard: {},
  categoryGroupInfo: {},
  categoryInfo: {},
  trackerReportInfo: {},
  raisedInfoList: {},
  servicecatInfoList: {},
  equInfoList: {},
  serviceImpactId: {},
  serviceImpactInfo: {},
  serviceCategoryGroupInfo: {},
  raisedByGroupInfo: {},
  statusGroupInfo: {},
  uploadPhotoService: {},
  uploadPhotoRca: {},
  attachmentCategoryInfo: {},
  btConfigInfo: {},
  reasonLoading: false,
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_BT_COUNT_INFO':
      return {
        ...state,
        trackerCountLoading: true,
      };
    case 'GET_BT_COUNT_INFO_SUCCESS':
      return {
        ...state,
        trackerCount: (state.trackerCount, action.payload),
        trackerCountLoading: false,
      };
    case 'GET_BT_COUNT_INFO_FAILURE':
      return {
        ...state,
        trackerCountErr: (state.trackerCountErr, action.error),
        trackerCountLoading: false,
      };
    case 'BT_FILTERS':
      return {
        ...state,
        trackerFilters: (state.trackerFilters, action.payload),
      };
    case 'GET_BT_INFO':
      return {
        ...state,
        trackerInfo: (state.trackerInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_INFO_SUCCESS':
      return {
        ...state,
        trackerInfo: (state.trackerInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_INFO_FAILURE':
      return {
        ...state,
        trackerInfo: (state.trackerInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_BT_INFO':
      return {
        ...state,
        addTrackerInfo: (state.addTrackerInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_BT_INFO_SUCCESS':
      return {
        ...state,
        addTrackerInfo: (state.addTrackerInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_BT_INFO_FAILURE':
      return {
        ...state,
        addTrackerInfo: (state.addTrackerInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_BT_INFO':
      return {
        ...state,
        addTrackerInfo: (state.addTrackerInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ACT_GROUP_INFO':
      return {
        ...state,
        actGroupInfo: (state.actGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ACT_GROUP_INFO_SUCCESS':
      return {
        ...state,
        actGroupInfo: (state.actGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ACT_GROUP_INFO_FAILURE':
      return {
        ...state,
        actGroupInfo: (state.actGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO_SUCCESS':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CATEGORY_GROUP_INFO_FAILURE':
      return {
        ...state,
        categoryGroupInfo: (state.categoryGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SERVICE_CATEGORY_GROUP_INFO':
      return {
        ...state,
        serviceCategoryGroupInfo: (state.serviceCategoryGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SERVICE_CATEGORY_GROUP_INFO_SUCCESS':
      return {
        ...state,
        serviceCategoryGroupInfo: (state.serviceCategoryGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SERVICE_CATEGORY_GROUP_INFO_FAILURE':
      return {
        ...state,
        serviceCategoryGroupInfo: (state.serviceCategoryGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_RAISED_GROUP_INFO':
      return {
        ...state,
        raisedByGroupInfo: (state.raisedByGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_RAISED_GROUP_INFO_SUCCESS':
      return {
        ...state,
        raisedByGroupInfo: (state.raisedByGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RAISED_GROUP_INFO_FAILURE':
      return {
        ...state,
        raisedByGroupInfo: (state.raisedByGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ST_GROUP_INFO':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ST_GROUP_INFO_SUCCESS':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ST_GROUP_INFO_FAILURE':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_DETAILS':
      return {
        ...state,
        trackerDetails: (state.trackerDetails, { loading: true, data: null, err: null }),
        bmsDetails: (state.bmsDetails, { loading: false, err: null, data: null }),
      };
    case 'GET_BT_DETAILS_SUCCESS':
      return {
        ...state,
        trackerDetails: (state.trackerDetails, { loading: false, data: action.payload.data, err: null }),
        bmsDetails: (state.bmsDetails, { loading: false, err: null, data: action.payload.data }),
      };
    case 'GET_BT_DETAILS_FAILURE':
      return {
        ...state,
        trackerDetails: (state.trackerDetails, { loading: false, err: action.error, data: null }),
        bmsDetails: (state.bmsDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_EXPORT_INFO':
      return {
        ...state,
        trackerExportInfo: (state.trackerExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        trackerExportInfo: (state.trackerExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_EXPORT_INFO_FAILURE':
      return {
        ...state,
        trackerExportInfo: (state.trackerExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_BT':
      return {
        ...state,
        trackerRows: (state.trackerRows, action.payload),
      };
    case 'GET_SUBMITTED_TO_INFO':
      return {
        ...state,
        submittedToInfo: (state.submittedToInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SUBMITTED_TO_INFO_SUCCESS':
      return {
        ...state,
        submittedToInfo: (state.submittedToInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SUBMITTED_TO_INFO_FAILURE':
      return {
        ...state,
        submittedToInfo: (state.submittedToInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_CATEGORY':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_CATEGORY_SUCCESS':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_CATEGORY_FAILURE':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_ACT_INFO':
      return {
        ...state,
        trackerActInfo: (state.trackerActInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_ACT_INFO_SUCCESS':
      return {
        ...state,
        trackerActInfo: (state.trackerActInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_ACT_INFO_FAILURE':
      return {
        ...state,
        trackerActInfo: (state.trackerActInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_TEMPLATE_INFO':
      return {
        ...state,
        trackerTemplateInfo: (state.trackerTemplateInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_TEMPLATE_INFO_SUCCESS':
      return {
        ...state,
        trackerTemplateInfo: (state.trackerTemplateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_TEMPLATE_INFO_FAILURE':
      return {
        ...state,
        trackerTemplateInfo: (state.trackerTemplateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_LOGS':
      return {
        ...state,
        trackerLogs: (state.trackerLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_LOGS_SUCCESS':
      return {
        ...state,
        trackerLogs: (state.trackerLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_LOGS_FAILURE':
      return {
        ...state,
        trackerLogs: (state.trackerLogs, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_EVIDENCE':
      return {
        ...state,
        trackerEvidence: (state.trackerEvidence, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_EVIDENCE_SUCCESS':
      return {
        ...state,
        trackerEvidence: (state.trackerEvidence, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_EVIDENCE_FAILURE':
      return {
        ...state,
        trackerEvidence: (state.trackerEvidence, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_TEMPLATE':
      return {
        ...state,
        templateTracker: (state.templateTracker, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_TEMPLATE_SUCCESS':
      return {
        ...state,
        templateTracker: (state.templateTracker, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_TEMPLATE_FAILURE':
      return {
        ...state,
        templateTracker: (state.templateTracker, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_BT_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_BT_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_BT_DASHBOARD_INFO':
      return {
        ...state,
        trackerDashboard: (state.trackerDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        trackerDashboard: (state.trackerDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        trackerDashboard: (state.trackerDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_REPORT_INFO':
      return {
        ...state,
        trackerReportInfo: (state.trackerReportInfo, { loading: true }),
      };
    case 'GET_REPORT_INFO_SUCCESS':
      return {
        ...state,
        trackerReportInfo: (state.trackerReportInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_REPORT_INFO_FAILURE':
      return {
        ...state,
        trackerReportInfo: (state.trackerReportInfo, { loading: false, err: action.error }),
      };
    case 'RESET_BT_REPORT':
      return {
        ...state,
        trackerReportInfo: (state.trackerReportInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_RAISED_INFO':
      return {
        ...state,
        raisedInfoList: (state.raisedInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_RAISED_INFO_SUCCESS':
      return {
        ...state,
        raisedInfoList: (state.raisedInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RAISED_INFO_FAILURE':
      return {
        ...state,
        raisedInfoList: (state.raisedInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SERVICE_CAT_INFO':
      return {
        ...state,
        servicecatInfoList: (state.servicecatInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_SERVICE_CAT_INFO_SUCCESS':
      return {
        ...state,
        servicecatInfoList: (state.servicecatInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SERVICE_CAT_INFO_FAILURE':
      return {
        ...state,
        servicecatInfoList: (state.servicecatInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EQP_INFO':
      return {
        ...state,
        equInfoList: (state.equInfoList, { loading: true, data: null, err: null }),
      };
    case 'GET_EQP_INFO_SUCCESS':
      return {
        ...state,
        equInfoList: (state.equInfoList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EQP_INFO_FAILURE':
      return {
        ...state,
        equInfoList: (state.equInfoList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SERVICE_IMPACTED_ID':
      return {
        ...state,
        serviceImpactId: (state.serviceImpactId, action.payload),
      };
    case 'GET_SERVICE_IMP_INFO':
      return {
        ...state,
        serviceImpactInfo: (state.serviceImpactInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SERVICE_IMP_INFO_SUCCESS':
      return {
        ...state,
        serviceImpactInfo: (state.serviceImpactInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SERVICE_IMP_INFO_FAILURE':
      return {
        ...state,
        serviceImpactInfo: (state.serviceImpactInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CAT_INFO':
      return {
        ...state,
        attachmentCategoryInfo: (state.attachmentCategoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CAT_INFO_SUCCESS':
      return {
        ...state,
        attachmentCategoryInfo: (state.attachmentCategoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CAT_INFO_FAILURE':
      return {
        ...state,
        attachmentCategoryInfo: (state.attachmentCategoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_UPLOAD_SERVICE_IMAGE':
      return {
        ...state,
        uploadPhotoService: (state.uploadPhotoService, action.payload),
      };
    case 'GET_UPLOAD_RCA_IMAGE':
      return {
        ...state,
        uploadPhotoRca: (state.uploadPhotoRca, action.payload),
      };
    case 'GET_IMAGE_RESET_SERVICE_INFO':
      return {
        ...state,
        uploadPhotoService: (state.uploadPhotoService, {}),
      };
    case 'GET_IMAGE_RESET_RAC_INFO':
      return {
        ...state,
        uploadPhotoRca: (state.uploadPhotoRca, {}),
      };
    case 'GET_BT_CONFIG_INFO':
      return {
        ...state,
        btConfigInfo: (state.btConfigInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_BT_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        btConfigInfo: (state.btConfigInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_BT_CONFIG_INFO_FAILURE':
      return {
        ...state,
        btConfigInfo: (state.btConfigInfo, { loading: false, err: action.error, data: null }),
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
