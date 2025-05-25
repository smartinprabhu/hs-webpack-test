const initialState = {
  complianceCount: null,
  complianceCountErr: null,
  complianceCountLoading: false,
  complianceFilters: {},
  complianceRows: {},
  complianceExportInfo: {},
  complianceInfo: {},
  addComplianceInfo: {},
  actGroupInfo: {},
  complianceDetails: {},
  submittedToInfo: {},
  complianceActInfo: {},
  complianceTemplateInfo: {},
  complianceLogs: {},
  complianceEvidence: {},
  templateCompliance: {},
  stateChangeInfo: {},
  complianceDashboard: {},
  categoryGroupInfo: {},
  categoryInfo: {},
  complianceReportInfo: {},
  wasteReportsInfo: {},
  wasteReportFilters: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_COMPLIANCE_COUNT_INFO':
      return {
        ...state,
        complianceCountLoading: true,
      };
    case 'GET_COMPLIANCE_COUNT_INFO_SUCCESS':
      return {
        ...state,
        complianceCount: (state.complianceCount, action.payload),
        complianceCountLoading: false,
      };
    case 'GET_COMPLIANCE_COUNT_INFO_FAILURE':
      return {
        ...state,
        complianceCountErr: (state.complianceCountErr, action.error),
        complianceCountLoading: false,
      };
    case 'COMPLIANCE_FILTERS':
      return {
        ...state,
        complianceFilters: (state.complianceFilters, action.payload),
      };
    case 'GET_COMPLIANCE_INFO':
      return {
        ...state,
        complianceInfo: (state.complianceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_INFO_SUCCESS':
      return {
        ...state,
        complianceInfo: (state.complianceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_INFO_FAILURE':
      return {
        ...state,
        complianceInfo: (state.complianceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_COMPLIANCE_INFO':
      return {
        ...state,
        addComplianceInfo: (state.addComplianceInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_COMPLIANCE_INFO_SUCCESS':
      return {
        ...state,
        addComplianceInfo: (state.addComplianceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_COMPLIANCE_INFO_FAILURE':
      return {
        ...state,
        addComplianceInfo: (state.addComplianceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_COMPLIANCE_INFO':
      return {
        ...state,
        addComplianceInfo: (state.addComplianceInfo, { loading: false, err: null, data: null }),
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
    case 'GET_COMPLIANCE_DETAILS':
      return {
        ...state,
        complianceDetails: (state.complianceDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_DETAILS_SUCCESS':
      return {
        ...state,
        complianceDetails: (state.complianceDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_DETAILS_FAILURE':
      return {
        ...state,
        complianceDetails: (state.complianceDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_EXPORT_INFO':
      return {
        ...state,
        complianceExportInfo: (state.complianceExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        complianceExportInfo: (state.complianceExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_EXPORT_INFO_FAILURE':
      return {
        ...state,
        complianceExportInfo: (state.complianceExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_COMPLIANCE':
      return {
        ...state,
        complianceRows: (state.complianceRows, action.payload),
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
    case 'GET_COMPLIANCE_CATEGORY':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_CATEGORY_SUCCESS':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_CATEGORY_FAILURE':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_ACT_INFO':
      return {
        ...state,
        complianceActInfo: (state.complianceActInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_ACT_INFO_SUCCESS':
      return {
        ...state,
        complianceActInfo: (state.complianceActInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_ACT_INFO_FAILURE':
      return {
        ...state,
        complianceActInfo: (state.complianceActInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE_INFO':
      return {
        ...state,
        complianceTemplateInfo: (state.complianceTemplateInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE_INFO_SUCCESS':
      return {
        ...state,
        complianceTemplateInfo: (state.complianceTemplateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE_INFO_FAILURE':
      return {
        ...state,
        complianceTemplateInfo: (state.complianceTemplateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_LOGS':
      return {
        ...state,
        complianceLogs: (state.complianceLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_LOGS_SUCCESS':
      return {
        ...state,
        complianceLogs: (state.complianceLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_LOGS_FAILURE':
      return {
        ...state,
        complianceLogs: (state.complianceLogs, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_EVIDENCE':
      return {
        ...state,
        complianceEvidence: (state.complianceEvidence, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_EVIDENCE_SUCCESS':
      return {
        ...state,
        complianceEvidence: (state.complianceEvidence, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_EVIDENCE_FAILURE':
      return {
        ...state,
        complianceEvidence: (state.complianceEvidence, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE':
      return {
        ...state,
        templateCompliance: (state.templateCompliance, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE_SUCCESS':
      return {
        ...state,
        templateCompliance: (state.templateCompliance, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_TEMPLATE_FAILURE':
      return {
        ...state,
        templateCompliance: (state.templateCompliance, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_TEMPLATE_COMPLIANCE':
      return {
        ...state,
        templateCompliance: (state.templateCompliance, { loading: false, err: null, data: null }),
      };
    case 'GET_COMPLIANCE_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_COMPLIANCE_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMPLIANCE_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_COMPLIANCE_DASHBOARD_INFO':
      return {
        ...state,
        complianceDashboard: (state.complianceDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_COMPLIANCE_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        complianceDashboard: (state.complianceDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMPLIANCE_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        complianceDashboard: (state.complianceDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_REPORT_INFO':
      return {
        ...state,
        complianceReportInfo: (state.complianceReportInfo, { loading: true }),
      };
    case 'GET_REPORT_INFO_SUCCESS':
      return {
        ...state,
        complianceReportInfo: (state.complianceReportInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_REPORT_INFO_FAILURE':
      return {
        ...state,
        complianceReportInfo: (state.complianceReportInfo, { loading: false, err: action.error }),
      };
    case 'RESET_COMPLIANCE_REPORT':
      return {
        ...state,
        complianceReportInfo: (state.complianceReportInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_WASTE_REPORTS_INFO':
      return {
        ...state,
        wasteReportsInfo: (state.wasteReportsInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_WASTE_REPORTS_INFO_SUCCESS':
      return {
        ...state,
        wasteReportsInfo: (state.wasteReportsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WASTE_REPORTS_INFO_FAILURE':
      return {
        ...state,
        wasteReportsInfo: (state.wasteReportsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_WASTE_REPORTS_INFO':
      return {
        ...state,
        wasteReportsInfo: (state.wasteReportsInfo, { loading: false, err: null, data: null }),
      };
    case 'WASTE_REPORT_FILTERS':
      return {
        ...state,
        wasteReportFilters: (state.wasteReportFilters, action.payload),
      };
    default:
      return state;
  }
}

export default reducer;
