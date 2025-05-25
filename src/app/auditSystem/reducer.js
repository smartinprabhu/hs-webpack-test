/* eslint-disable comma-dangle */
const initialState = {
  auditFilters: {},
  opportunitiesFilters: {},
  auditsInfo: {},
  auditsExport: {},
  auditsCount: null,
  auditsCountErr: null,
  auditsCountLoading: false,
  opportunitiesCount: null,
  opportunitiesCountErr: null,
  opportunitiesCountLoading: false,
  auditDetail: {},
  systemGroupInfo: {},
  statusGroupInfo: {},
  auditDashboard: {},
  nonConformitieFilters: {},
  nonConformitiesInfo: {},
  nonConformitiesExport: {},
  nonConformitiesCount: null,
  nonConformitiesCountErr: null,
  nonConformitiesCountLoading: false,
  nonConformitieDetail: {},
  auditAction: {},
  opportunitiesInfo: {},
  opportunitiesDetails: {},
  stageGroupInfo: {},
  systemAudit: {},
  teamMembers: {},
  auditAssessmentDetail: {},
  auditActionDetails: {},
  updateAuditAction: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_AUDITS_COUNT_INFO':
      return {
        ...state,
        auditsCount: null,
        auditsCountErr: null,
        auditsCountLoading: true
      };
    case 'GET_AUDITS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        auditsCountErr: null,
        auditsCount: (state.auditsCount, action.payload),
        auditsCountLoading: false
      };
    case 'GET_AUDITS_COUNT_INFO_FAILURE':
      return {
        ...state,
        auditsCountErr: (state.auditsCountErr, action.error),
        auditsCount: (state.auditsCount, false),
        auditsCountLoading: false
      };
    case 'AUDIT_FILTERS':
      return {
        ...state,
        auditFilters: (state.auditFilters, action.payload)
      };
    case 'OPPORTUNITIES_FILTERS':
      return {
        ...state,
        opportunitiesFilters: (state.opportunitiesFilters, action.payload)
      };
    case 'GET_AUDITS_INFO':
      return {
        ...state,
        auditsInfo: (state.auditsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_AUDITS_INFO_SUCCESS':
      return {
        ...state,
        auditsInfo: (state.auditsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDITS_INFO_FAILURE':
      return {
        ...state,
        auditsInfo: (state.auditsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDITS_EXPORT_LIST_INFO':
      return {
        ...state,
        auditsExport: (state.auditsExport, { loading: true, data: null, err: null })
      };
    case 'GET_AUDITS_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        auditsExport: (state.auditsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDITS_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        auditsExport: (state.auditsExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_DETAILS_INFO':
      return {
        ...state,
        auditDetail: (state.auditDetail, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        auditDetail: (state.auditDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_DETAILS_INFO_FAILURE':
      return {
        ...state,
        auditDetail: (state.auditDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_SYSTEM_GROUP_INFO':
      return {
        ...state,
        systemGroupInfo: (state.systemGroupInfo, { loading: true, data: null, err: null })
      };
    case 'GET_SYSTEM_GROUP_INFO_SUCCESS':
      return {
        ...state,
        systemGroupInfo: (state.systemGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SYSTEM_GROUP_INFO_FAILURE':
      return {
        ...state,
        systemGroupInfo: (state.systemGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_STATUS_GROUP_INFO':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: true, data: null, err: null })
      };
    case 'GET_STATUS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_STATUS_GROUP_INFO_FAILURE':
      return {
        ...state,
        statusGroupInfo: (state.statusGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_DASHBOARD_INFO':
      return {
        ...state,
        auditDashboard: (state.auditDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        auditDashboard: (state.auditDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        auditDashboard: (state.auditDashboard, { loading: false, err: action.error, data: null })
      };
    case 'GET_NC_COUNT_INFO':
      return {
        ...state,
        nonConformitiesCount: null,
        nonConformitiesCountErr: null,
        nonConformitiesCountLoading: true
      };
    case 'GET_NC_COUNT_INFO_SUCCESS':
      return {
        ...state,
        nonConformitiesCountErr: null,
        nonConformitiesCount: (state.nonConformitiesCount, action.payload),
        nonConformitiesCountLoading: false
      };
    case 'GET_NC_COUNT_INFO_FAILURE':
      return {
        ...state,
        nonConformitiesCountErr: (state.nonConformitiesCountErr, action.error),
        nonConformitiesCount: (state.nonConformitiesCount, false),
        nonConformitiesCountLoading: false
      };
    case 'NC_FILTERS':
      return {
        ...state,
        nonConformitieFilters: (state.nonConformitieFilters, action.payload)
      };
    case 'GET_NC_INFO':
      return {
        ...state,
        nonConformitiesInfo: (state.nonConformitiesInfo, { loading: true, data: null, err: null })
      };
    case 'GET_NC_INFO_SUCCESS':
      return {
        ...state,
        nonConformitiesInfo: (state.nonConformitiesInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NC_INFO_FAILURE':
      return {
        ...state,
        nonConformitiesInfo: (state.nonConformitiesInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_NC_EXPORT_LIST_INFO':
      return {
        ...state,
        nonConformitiesExport: (state.nonConformitiesExport, { loading: true, data: null, err: null })
      };
    case 'GET_NC_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        nonConformitiesExport: (state.nonConformitiesExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NC_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        nonConformitiesExport: (state.nonConformitiesExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_NC_DETAILS_INFO':
      return {
        ...state,
        nonConformitieDetail: (state.nonConformitieDetail, { loading: true, data: null, err: null })
      };
    case 'GET_NC_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        nonConformitieDetail: (state.nonConformitieDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NC_DETAILS_INFO_FAILURE':
      return {
        ...state,
        nonConformitieDetail: (state.nonConformitieDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_ACTION_INFO':
      return {
        ...state,
        auditAction: (state.auditAction, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        auditAction: (state.auditAction, { loading: false, data: action.payload, err: null })
      };
    case 'GET_AUDIT_ACTION_INFO_FAILURE':
      return {
        ...state,
        auditAction: (state.auditAction, { loading: false, err: action.error, data: null })
      };
    case 'RESET_AUDIT_ACTION':
      return {
        ...state,
        auditAction: (state.auditAction, { loading: false, err: null, data: null })
      };
    case 'GET_OPPORTUNITIES_INFO':
      return {
        ...state,
        opportunitiesInfo: (state.opportunitiesInfo, { loading: true, data: null, err: null })
      };
    case 'GET_OPPORTUNITIES_INFO_SUCCESS':
      return {
        ...state,
        opportunitiesInfo: (state.opportunitiesInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OPPORTUNITIES_INFO_FAILURE':
      return {
        ...state,
        opportunitiesInfo: (state.opportunitiesInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_OPPORTUNITIES_COUNT_INFO':
      return {
        ...state,
        opportunitiesCount: null,
        opportunitiesCountErr: null,
        opportunitiesCountLoading: true
      };
    case 'GET_OPPORTUNITIES_COUNT_INFO_SUCCESS':
      return {
        ...state,
        opportunitiesCountErr: null,
        opportunitiesCount: (state.opportunitiesCount, action.payload),
        opportunitiesCountLoading: false
      };
    case 'GET_OPPORTUNITIES_COUNT_INFO_FAILURE':
      return {
        ...state,
        opportunitiesCountErr: (state.opportunitiesCountErr, action.error),
        opportunitiesCount: (state.opportunitiesCount, false),
        opportunitiesCountLoading: false
      };
    case 'GET_OPPORTUNITIES_DETAILS_INFO':
      return {
        ...state,
        opportunitiesDetails: (state.opportunitiesDetails, { loading: true, data: null, err: null })
      };
    case 'GET_OPPORTUNITIES_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        opportunitiesDetails: (state.opportunitiesDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_OPPORTUNITIES_DETAILS_INFO_FAILURE':
      return {
        ...state,
        opportunitiesDetails: (state.opportunitiesDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_STAGE_GROUP_INFO':
      return {
        ...state,
        stageGroupInfo: (state.stageGroupInfo, { loading: true, data: null, err: null })
      };
    case 'GET_STAGE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        stageGroupInfo: (state.stageGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_STAGE_GROUP_INFO_FAILURE':
      return {
        ...state,
        stageGroupInfo: (state.stageGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_SA_INFO':
      return {
        ...state,
        systemAudit: (state.systemAudit, { loading: true, data: null, err: null })
      };
    case 'GET_SA_INFO_SUCCESS':
      return {
        ...state,
        systemAudit: (state.systemAudit, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SA_INFO_FAILURE':
      return {
        ...state,
        systemAudit: (state.systemAudit, { loading: false, err: action.error, data: null })
      };
    case 'GET_TM_INFO':
      return {
        ...state,
        teamMembers: (state.teamMembers, { loading: true, data: null, err: null })
      };
    case 'GET_TM_INFO_SUCCESS':
      return {
        ...state,
        teamMembers: (state.teamMembers, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_TM_INFO_FAILURE':
      return {
        ...state,
        teamMembers: (state.teamMembers, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_ASSESSMENTS_INFO':
      return {
        ...state,
        auditAssessmentDetail: (state.auditAssessmentDetail, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_ASSESSMENTS_INFO_SUCCESS':
      return {
        ...state,
        auditAssessmentDetail: (state.auditAssessmentDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_ASSESSMENTS_INFO_FAILURE':
      return {
        ...state,
        auditAssessmentDetail: (state.auditAssessmentDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_ACTIONS_INFO':
      return {
        ...state,
        auditActionDetails: (state.auditActionDetails, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_ACTIONS_INFO_SUCCESS':
      return {
        ...state,
        auditActionDetails: (state.auditActionDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_ACTIONS_INFO_FAILURE':
      return {
        ...state,
        auditActionDetails: (state.auditActionDetails, { loading: false, err: action.error, data: null })
      };
    case 'UPDATE_AUDIT_ACTION_INFO':
      return {
        ...state,
        updateAuditAction: (state.updateAuditAction, { loading: true, data: null, err: null })
      };
    case 'UPDATE_AUDIT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        updateAuditAction: (state.updateAuditAction, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_AUDIT_ACTION_INFO_FAILURE':
      return {
        ...state,
        updateAuditAction: (state.updateAuditAction, { loading: false, err: action.error, data: null })
      };
    case 'RESET_AUDIT_ACTION_UPDATE':
      return {
        ...state,
        updateAuditAction: (state.updateAuditAction, { loading: false, err: null, data: null })
      };
    default:
      return state;
  }
}

export default reducer;
