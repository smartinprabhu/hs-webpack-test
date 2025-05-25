const initialState = {
  incidentHxCount: null,
  incidentHxCountErr: null,
  incidentHxCountLoading: false,
  incidentHxFilters: {
    customFilters:[]
  },
  slaAuditRows: {},
  incidentHxExportInfo: {},
  incidentHxInfo: {},
  addIncidentInfo: {},
  incidentDetailsInfo: {},
  slaAuditDashboard: {},
  hxSeverities: {},
  hxIncidentConfig: {},
  updateIncidentInfo: {},
  incidentAction: {},
  slaAuditSummary: {},
  ctCategories: {},
  ctQuestionGroups: {},
  ctQuestionDetails: {},
  ctlastRecords: {},
  ctExistsRecords: {},
  hxCategories: {},
  hxSubCategories: {},
  hxPriorities: {},
  hxTaskTypes: {},
  hxTypes: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_INCIDENTS_COUNT_INFO':
      return {
        ...state,
        incidentHxCount: null,
        incidentHxCountErr: null,
        incidentHxCountLoading: true,
      };
    case 'GET_INCIDENTS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        incidentHxCount: (state.incidentHxCount, action.payload),
        incidentHxCountErr: null,
        incidentHxCountLoading: false,
      };
    case 'GET_INCIDENTS_COUNT_INFO_FAILURE':
      return {
        ...state,
        incidentHxCountErr: (state.incidentHxCountErr, action.error),
        incidentHxCount: null,
        incidentHxCountLoading: false,
      };
    case 'INCIDENTS_FILTERS':
      return {
        ...state,
        incidentHxFilters: (state.incidentHxFilters, action.payload),
      };
    case 'GET_INCIDENTS_INFO':
      return {
        ...state,
        incidentHxInfo: (state.incidentHxInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENTS_INFO_SUCCESS':
      return {
        ...state,
        incidentHxInfo: (state.incidentHxInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENTS_INFO_FAILURE':
      return {
        ...state,
        incidentHxInfo: (state.incidentHxInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_HX_INCIDENT_INFO':
      return {
        ...state,
        addIncidentInfo: (state.addIncidentInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_HX_INCIDENT_INFO_SUCCESS':
      return {
        ...state,
        addIncidentInfo: (state.addIncidentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_HX_INCIDENT_INFO_FAILURE':
      return {
        ...state,
        addIncidentInfo: (state.addIncidentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_HX_INCIDENT':
      return {
        ...state,
        addIncidentInfo: (state.addIncidentInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_INCIDENT_DETAILS':
      return {
        ...state,
        incidentDetailsInfo: (state.incidentDetailsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_DETAILS_SUCCESS':
      return {
        ...state,
        incidentDetailsInfo: (state.incidentDetailsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENT_DETAILS_FAILURE':
      return {
        ...state,
        incidentDetailsInfo: (state.incidentDetailsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INCIDENTS_EXPORT_INFO':
      return {
        ...state,
        incidentHxExportInfo: (state.incidentHxExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        incidentHxExportInfo: (state.incidentHxExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INCIDENTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        incidentHxExportInfo: (state.incidentHxExportInfo, { loading: false, err: action.error, data: null }),
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
    case 'GET_HX_SEVERITIES_INFO':
      return {
        ...state,
        hxSeverities: (state.hxSeverities, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_SEVERITIES_INFO_SUCCESS':
      return {
        ...state,
        hxSeverities: (state.hxSeverities, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_SEVERITIES_INFO_FAILURE':
      return {
        ...state,
        hxSeverities: (state.hxSeverities, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_INCIDENT_CONFIG_INFO':
      return {
        ...state,
        hxIncidentConfig: (state.hxIncidentConfig, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_INCIDENT_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        hxIncidentConfig: (state.hxIncidentConfig, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_INCIDENT_CONFIG_INFO_FAILURE':
      return {
        ...state,
        hxIncidentConfig: (state.hxIncidentConfig, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_INCIDENT_INFO':
      return {
        ...state,
        updateIncidentInfo: (state.updateIncidentInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_INCIDENT_INFO_SUCCESS':
      return {
        ...state,
        updateIncidentInfo: (state.updateIncidentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_INCIDENT_INFO_FAILURE':
      return {
        ...state,
        updateIncidentInfo: (state.updateIncidentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_HX_INCIDENT':
      return {
        ...state,
        updateIncidentInfo: (state.updateIncidentInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_INCIDENT_ACTION_INFO':
      return {
        ...state,
        incidentAction: (state.incidentAction, { loading: true, data: null, err: null }),
      };
    case 'GET_INCIDENT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        incidentAction: (state.incidentAction, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INCIDENT_ACTION_INFO_FAILURE':
      return {
        ...state,
        incidentAction: (state.incidentAction, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_INCIDENT_ACTION_INFO':
      return {
        ...state,
        incidentAction: (state.incidentAction, { loading: false, data: null, err: null }),
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
        ctExistsRecords: (state.ctExistsRecords, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TRACKER_EXISTS_CT_INFO_FAILURE':
      return {
        ...state,
        ctExistsRecords: (state.ctExistsRecords, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_CATEGORIES_INFO':
      return {
        ...state,
        hxCategories: (state.hxCategories, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        hxCategories: (state.hxCategories, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        hxCategories: (state.hxCategories, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_SUB_CATEGORIES_INFO':
      return {
        ...state,
        hxSubCategories: (state.hxSubCategories, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_SUB_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        hxSubCategories: (state.hxSubCategories, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_SUB_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        hxSubCategories: (state.hxSubCategories, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_PRIORITIES_INFO':
      return {
        ...state,
        hxPriorities: (state.hxPriorities, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_PRIORITIES_INFO_SUCCESS':
      return {
        ...state,
        hxPriorities: (state.hxPriorities, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_PRIORITIES_INFO_FAILURE':
      return {
        ...state,
        hxPriorities: (state.hxPriorities, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_TASK_TYPES_INFO':
      return {
        ...state,
        hxTaskTypes: (state.hxTaskTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_TASK_TYPES_INFO_SUCCESS':
      return {
        ...state,
        hxTaskTypes: (state.hxTaskTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_TASK_TYPES_INFO_FAILURE':
      return {
        ...state,
        hxTaskTypes: (state.hxTaskTypes, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_TYPES_INFO':
      return {
        ...state,
        hxTypes: (state.hxTypes, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_TYPES_INFO_SUCCESS':
      return {
        ...state,
        hxTypes: (state.hxTypes, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_TYPES_INFO_FAILURE':
      return {
        ...state,
        hxTypes: (state.hxTypes, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
