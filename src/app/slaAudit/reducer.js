const initialState = {
  slaAuditCount: null,
  slaAuditCountErr: null,
  slaAuditCountLoading: false,
  slaAuditFilters: {
    slaAuditFilters: [],
  },
  slaAuditRows: {},
  slaAuditExportInfo: {},
  slaAuditInfo: {},
  addSlaAuditInfo: {},
  slaAuditDetails: {},
  slaAuditDashboard: {},
  slaTemplates: {},
  slaAuditConfig: {},
  updateSlaAuditInfo: {},
  updateSlaAuditStageInfo: {},
  slaAuditAction: {},
  slaAuditSummary: {},
  auditExistsInfo: {},
  updateSlaAuditNoInfo: {},
  slaSummaryDetails: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_SLA_AUDIT_COUNT_INFO':
      return {
        ...state,
        slaAuditCount: null,
        slaAuditCountErr: null,
        slaAuditCountLoading: true,
      };
    case 'GET_SLA_AUDIT_COUNT_INFO_SUCCESS':
      return {
        ...state,
        slaAuditCount: (state.slaAuditCount, action.payload),
        slaAuditCountErr: null,
        slaAuditCountLoading: false,
      };
    case 'GET_SLA_AUDIT_COUNT_INFO_FAILURE':
      return {
        ...state,
        slaAuditCountErr: (state.slaAuditCountErr, action.error),
        slaAuditCount: null,
        slaAuditCountLoading: false,
      };
    case 'SLA_AUDIT_FILTERS':
      return {
        ...state,
        slaAuditFilters: (state.slaAuditFilters, action.payload),
      };
    case 'GET_SLA_AUDIT_INFO':
      return {
        ...state,
        slaAuditInfo: (state.slaAuditInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        slaAuditInfo: (state.slaAuditInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_AUDIT_INFO_FAILURE':
      return {
        ...state,
        slaAuditInfo: (state.slaAuditInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_SLA_AUDIT_INFO':
      return {
        ...state,
        addSlaAuditInfo: (state.addSlaAuditInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_SLA_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        addSlaAuditInfo: (state.addSlaAuditInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_SLA_AUDIT_INFO_FAILURE':
      return {
        ...state,
        addSlaAuditInfo: (state.addSlaAuditInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_SLA_AUDIT':
      return {
        ...state,
        addSlaAuditInfo: (state.addSlaAuditInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_SLA_AUDIT_DETAILS':
      return {
        ...state,
        slaAuditDetails: (state.slaAuditDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_DETAILS_SUCCESS':
      return {
        ...state,
        slaAuditDetails: (state.slaAuditDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_AUDIT_DETAILS_FAILURE':
      return {
        ...state,
        slaAuditDetails: (state.slaAuditDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_AUDIT_EXPORT_INFO':
      return {
        ...state,
        slaAuditExportInfo: (state.slaAuditExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        slaAuditExportInfo: (state.slaAuditExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_AUDIT_EXPORT_INFO_FAILURE':
      return {
        ...state,
        slaAuditExportInfo: (state.slaAuditExportInfo, { loading: false, err: action.error, data: null }),
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
    case 'GET_SLA_TEMPLATES_INFO':
      return {
        ...state,
        slaTemplates: (state.slaTemplates, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_TEMPLATES_INFO_SUCCESS':
      return {
        ...state,
        slaTemplates: (state.slaTemplates, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_TEMPLATES_INFO_FAILURE':
      return {
        ...state,
        slaTemplates: (state.slaTemplates, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_CONFIG_INFO':
      return {
        ...state,
        slaAuditConfig: (state.slaAuditConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        slaAuditConfig: (state.slaAuditConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_CONFIG_INFO_FAILURE':
      return {
        ...state,
        slaAuditConfig: (state.slaAuditConfig, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SLA_AUDIT_INFO':
      return {
        ...state,
        updateSlaAuditInfo: (state.updateSlaAuditInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        updateSlaAuditInfo: (state.updateSlaAuditInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_INFO_FAILURE':
      return {
        ...state,
        updateSlaAuditInfo: (state.updateSlaAuditInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_AUDIT_ACTION_INFO':
      return {
        ...state,
        slaAuditAction: (state.slaAuditAction, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_AUDIT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        slaAuditAction: (state.slaAuditAction, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_SLA_AUDIT_ACTION_INFO_FAILURE':
      return {
        ...state,
        slaAuditAction: (state.slaAuditAction, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SLA_AUDIT_ACTION_INFO':
      return {
        ...state,
        slaAuditAction: (state.slaAuditAction, { loading: false, data: null, err: null }),
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
    case 'GET_AUDIT_EXISTS_INFO':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_AUDIT_EXISTS_INFO_SUCCESS':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_AUDIT_EXISTS_INFO_FAILURE':
      return {
        ...state,
        auditExistsInfo: (state.auditExistsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SLA_AUDIT_NO_INFO':
      return {
        ...state,
        updateSlaAuditNoInfo: (state.updateSlaAuditNoInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_NO_INFO_SUCCESS':
      return {
        ...state,
        updateSlaAuditNoInfo: (state.updateSlaAuditNoInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_NO_INFO_FAILURE':
      return {
        ...state,
        updateSlaAuditNoInfo: (state.updateSlaAuditNoInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SLA_SUMMARY_DETAILS':
      return {
        ...state,
        slaSummaryDetails: (state.slaSummaryDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_SLA_SUMMARY_DETAILS_SUCCESS':
      return {
        ...state,
        slaSummaryDetails: (state.slaSummaryDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SLA_SUMMARY_DETAILS_FAILURE':
      return {
        ...state,
        slaSummaryDetails: (state.slaSummaryDetails, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SLA_AUDIT_STAGE_INFO':
      return {
        ...state,
        updateSlaAuditStageInfo: (state.updateSlaAuditStageInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_STAGE_INFO_SUCCESS':
      return {
        ...state,
        updateSlaAuditStageInfo: (state.updateSlaAuditStageInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SLA_AUDIT_STAGE_INFO_FAILURE':
      return {
        ...state,
        updateSlaAuditStageInfo: (state.updateSlaAuditStageInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_SLA_AUDIT_STAGE_INFO':
      return {
        ...state,
        updateSlaAuditStageInfo: (state.updateSlaAuditStageInfo, { loading: false, err: null, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
