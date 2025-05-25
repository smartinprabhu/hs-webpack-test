const initialState = {
  ctCount: null,
  ctCountErr: null,
  ctCountLoading: false,
  ctFilters: {
    customFilters: []
  },
  slaAuditRows: {},
  ctExportInfo: {},
  ctInfo: {},
  addCtInfo: {},
  ctDetailsInfo: {},
  slaAuditDashboard: {},
  trackerTemplates: {},
  ctConfig: {},
  updateCtInfo: {},
  ctAction: {},
  slaAuditSummary: {},
  ctCategories: {},
  ctQuestionGroups: {},
  ctQuestionDetails: {},
  ctlastRecords: {},
  ctExistsRecords: {},
  updateCtAltInfo: {},
  decimalPrecisionGlobal: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_CT_COUNT_INFO':
      return {
        ...state,
        ctCount: null,
        ctCountErr: null,
        ctCountLoading: true,
      };
    case 'GET_CT_COUNT_INFO_SUCCESS':
      return {
        ...state,
        ctCount: (state.ctCount, action.payload),
        ctCountErr: null,
        ctCountLoading: false,
      };
    case 'GET_CT_COUNT_INFO_FAILURE':
      return {
        ...state,
        ctCountErr: (state.ctCountErr, action.error),
        ctCount: null,
        ctCountLoading: false,
      };
    case 'CONSUMPTION_TRACKER_FILTERS':
      return {
        ...state,
        ctFilters: (state.ctFilters, action.payload),
      };
    case 'GET_CT_INFO':
      return {
        ...state,
        ctInfo: (state.ctInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_INFO_SUCCESS':
      return {
        ...state,
        ctInfo: (state.ctInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_INFO_FAILURE':
      return {
        ...state,
        ctInfo: (state.ctInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_CONS_TRACK_INFO':
      return {
        ...state,
        addCtInfo: (state.addCtInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_CONS_TRACK_INFO_SUCCESS':
      return {
        ...state,
        addCtInfo: (state.addCtInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_CONS_TRACK_INFO_FAILURE':
      return {
        ...state,
        addCtInfo: (state.addCtInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_CONS_TRACK':
      return {
        ...state,
        addCtInfo: (state.addCtInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CT_DETAILS':
      return {
        ...state,
        ctDetailsInfo: (state.ctDetailsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_DETAILS_SUCCESS':
      return {
        ...state,
        ctDetailsInfo: (state.ctDetailsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_DETAILS_FAILURE':
      return {
        ...state,
        ctDetailsInfo: (state.ctDetailsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CT_EXPORT_INFO':
      return {
        ...state,
        ctExportInfo: (state.ctExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        ctExportInfo: (state.ctExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_EXPORT_INFO_FAILURE':
      return {
        ...state,
        ctExportInfo: (state.ctExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_SLA_AUDIT':
      return {
        ...state,
        slaAuditRows: (state.slaAuditRows, action.payload),
      };
    case 'GET_SLA_AUDIT_DASHBOARD_INFO':
      return {
        ...state,
        slaAuditDashboard: (state.slaAuditDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        slaAuditDashboard: (state.slaAuditDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_AUDIT_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        slaAuditDashboard: (state.slaAuditDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TRACK_TEMPLATES_INFO':
      return {
        ...state,
        trackerTemplates: (state.trackerTemplates, { loading: true, data: null, err: null }),
      };
    case 'GET_TRACK_TEMPLATES_INFO_SUCCESS':
      return {
        ...state,
        trackerTemplates: (state.trackerTemplates, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRACK_TEMPLATES_INFO_FAILURE':
      return {
        ...state,
        trackerTemplates: (state.trackerTemplates, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CT_CONFIG_INFO':
      return {
        ...state,
        ctConfig: (state.ctConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        ctConfig: (state.ctConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_CONFIG_INFO_FAILURE':
      return {
        ...state,
        ctConfig: (state.ctConfig, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_CT_INFO':
      return {
        ...state,
        updateCtInfo: (state.updateCtInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CT_INFO_SUCCESS':
      return {
        ...state,
        updateCtInfo: (state.updateCtInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CT_INFO_FAILURE':
      return {
        ...state,
        updateCtInfo: (state.updateCtInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_CT_INFO':
      return {
        ...state,
        updateCtInfo: (state.updateCtInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_CT_ACTION_INFO':
      return {
        ...state,
        ctAction: (state.ctAction, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        ctAction: (state.ctAction, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_CT_ACTION_INFO_FAILURE':
      return {
        ...state,
        ctAction: (state.ctAction, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CT_ACTION_INFO':
      return {
        ...state,
        ctAction: (state.ctAction, { loading: false, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_SUMMARY_DETAILS':
      return {
        ...state,
        slaAuditSummary: (state.slaAuditSummary, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_SUMMARY_DETAILS_SUCCESS':
      return {
        ...state,
        slaAuditSummary: (state.slaAuditSummary, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_AUDIT_SUMMARY_DETAILS_FAILURE':
      return {
        ...state,
        slaAuditSummary: (state.slaAuditSummary, { loading: false, err: action.error, data: null }),
      };
    case 'GET_QUESTIONS_DETAILS':
      return {
        ...state,
        ctQuestionDetails: (state.ctQuestionDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTIONS_DETAILS_SUCCESS':
      return {
        ...state,
        ctQuestionDetails: (state.ctQuestionDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUESTIONS_DETAILS_FAILURE':
      return {
        ...state,
        ctQuestionDetails: (state.ctQuestionDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CT_CATEGORIES_INFO':
      return {
        ...state,
        ctCategories: (state.ctCategories, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        ctCategories: (state.ctCategories, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        ctCategories: (state.ctCategories, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CT_QTN_GROUPS_INFO':
      return {
        ...state,
        ctQuestionGroups: (state.ctQuestionGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_CT_QTN_GROUPS_INFO_SUCCESS':
      return {
        ...state,
        ctQuestionGroups: (state.ctQuestionGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CT_QTN_GROUPS_INFO_FAILURE':
      return {
        ...state,
        ctQuestionGroups: (state.ctQuestionGroups, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LAST_CT_INFO':
      return {
        ...state,
        ctlastRecords: (state.ctlastRecords, { loading: true, data: null, err: null }),
      };
    case 'GET_LAST_CT_INFO_SUCCESS':
      return {
        ...state,
        ctlastRecords: (state.ctlastRecords, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LAST_CT_INFO_FAILURE':
      return {
        ...state,
        ctlastRecords: (state.ctlastRecords, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TRACKER_EXISTS_CT_INFO':
      return {
        ...state,
        ctExistsRecords: (state.ctExistsRecords, { loading: true, data: null, err: null }),
      };
    case 'GET_TRACKER_EXISTS_CT_INFO_SUCCESS':
      return {
        ...state,
        ctExistsRecords: (state.ctlastRecords, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRACKER_EXISTS_CT_INFO_FAILURE':
      return {
        ...state,
        ctExistsRecords: (state.ctExistsRecords, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_CT_ALT_INFO':
      return {
        ...state,
        updateCtAltInfo: (state.updateCtAltInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CT_ALT_INFO_SUCCESS':
      return {
        ...state,
        updateCtAltInfo: (state.updateCtAltInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CT_ALT_INFO_FAILURE':
      return {
        ...state,
        updateCtAltInfo: (state.updateCtAltInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DP_DETAILS':
      return {
        ...state,
        decimalPrecisionGlobal: (state.decimalPrecisionGlobal, { loading: true, data: null, err: null }),
      };
    case 'GET_DP_DETAILS_SUCCESS':
      return {
        ...state,
        decimalPrecisionGlobal: (state.decimalPrecisionGlobal, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DP_DETAILS_FAILURE':
      return {
        ...state,
        decimalPrecisionGlobal: (state.decimalPrecisionGlobal, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
