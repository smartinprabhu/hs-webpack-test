/* eslint-disable comma-dangle */
const initialState = {
  workPermitFilters: {
    customFilters: []
  },
  workPermits: {},
  workPermitsExport: {},
  workPermitsCount: null,
  workPermitsCountErr: null,
  workPermitsCountLoading: false,
  workPermitDashboard: {},
  workPermitDetail: {},
  reportWorkPermitInfo: {},
  commodityInfo: {},
  vendorData: {},
  vendorGroupsInfo: {},
  natureGroupsInfo: {},
  typeWork: {},
  workNature: {},
  prepareInfo: {},
  issuePermitInfo: {},
  permitStateChangeInfo: {},
  natureofWorkFilters: {
    customFilters: []
  },
  natureofWork: {},
  natureofWorkDetail: {},
  natureofWorkExport: {},
  partsSelected: {},
  workPermitConfig: {},
  maintenanceGroupsInfo: {},
  moChecklists: {},
  wpTaskLists: {},
  wpIpLists: {},
  mailLogs: {},
  wpDepartments: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_WORKPERMIT_COUNT_INFO':
      return {
        ...state,
        workPermitsCount: null,
        workPermitsCountErr: null,
        workPermitsCountLoading: true
      };
    case 'GET_WORKPERMIT_COUNT_INFO_SUCCESS':
      return {
        ...state,
        workPermitsCountErr: null,
        workPermitsCount: (state.workPermitsCount, action.payload),
        workPermitsCountLoading: false
      };
    case 'GET_WORKPERMIT_COUNT_INFO_FAILURE':
      return {
        ...state,
        workPermitsCountErr: (state.workPermitsCountErr, action.error),
        workPermitsCount: (state.workPermitsCount, false),
        workPermitsCountLoading: false
      };
    case 'GET_NATUREOFWORK_COUNT_INFO':
      return {
        ...state,
        natureofWorkCount: null,
        natureofWorkCountErr: null,
        natureofWorkCountLoading: true
      };
    case 'GET_NATUREOFWORK_COUNT_INFO_SUCCESS':
      return {
        ...state,
        natureofWorkCountErr: null,
        natureofWorkCount: (state.natureofWorkCount, action.payload),
        natureofWorkCountLoading: false
      };
    case 'GET_NATUREOFWORK_COUNT_INFO_FAILURE':
      return {
        ...state,
        natureofWorkCountErr: (state.natureofWorkCountErr, action.error),
        natureofWorkCount: (state.natureofWorkCount, false),
        natureofWorkCountLoading: false
      };
    case 'WORKPERMIT_FILTERS':
      return {
        ...state,
        workPermitFilters: (state.workPermitFilters, action.payload)
      };
    case 'NATUREOFWORK_FILTERS':
      return {
        ...state,
        natureofWorkFilters: (state.natureofWorkFilters, action.payload)
      };
    case 'GET_WORKPERMIT_INFO':
      return {
        ...state,
        workPermits: (state.workPermits, { loading: true, data: null, err: null })
      };
    case 'GET_WORKPERMIT_INFO_SUCCESS':
      return {
        ...state,
        workPermits: (state.workPermits, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WORKPERMIT_INFO_FAILURE':
      return {
        ...state,
        workPermits: (state.workPermits, { loading: false, err: action.error, data: null })
      };
    case 'GET_WORKPERMIT_EXPORT_LIST_INFO':
      return {
        ...state,
        workPermitsExport: (state.workPermitsExport, { loading: true, data: null, err: null })
      };
    case 'GET_WORKPERMIT_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        workPermitsExport: (state.workPermitsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WORKPERMIT_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        workPermitsExport: (state.workPermitsExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_WORKPERMIT_DASHBOARD_INFO':
      return {
        ...state,
        workPermitDashboard: (state.workPermitDashboard, { loading: true, data: null, err: null })
      };
    case 'GET_WORKPERMIT_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        workPermitDashboard: (state.workPermitDashboard, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WORKPERMIT_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        workPermitDashboard: (state.workPermitDashboard, { loading: false, err: action.error, data: null })
      };
    case 'GET_WORKPERMIT_DETAILS_INFO':
      return {
        ...state,
        workPermitDetail: (state.workPermitDetail, { loading: true, data: null, err: null })
      };
    case 'GET_WORKPERMIT_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        workPermitDetail: (state.workPermitDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WORKPERMIT_DETAILS_INFO_FAILURE':
      return {
        ...state,
        workPermitDetail: (state.workPermitDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_NATUREOFWORK_DETAILS_INFO':
      return {
        ...state,
        natureofWorkDetail: (state.natureofWorkDetail, { loading: true, data: null, err: null })
      };
    case 'GET_NATUREOFWORK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        natureofWorkDetail: (state.natureofWorkDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NATUREOFWORK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        natureofWorkDetail: (state.natureofWorkDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_REPORT_INFO':
      return {
        ...state,
        reportWorkPermitInfo: (state.reportWorkPermitInfo, { loading: true })
      };
    case 'GET_REPORT_INFO_SUCCESS':
      return {
        ...state,
        reportWorkPermitInfo: (state.reportWorkPermitInfo, { loading: false, data: action.payload.data })
      };
    case 'GET_REPORT_INFO_FAILURE':
      return {
        ...state,
        reportWorkPermitInfo: (state.reportWorkPermitInfo, { loading: false, err: action.error })
      };
    case 'RESET_REPORT_INFO':
      return {
        ...state,
        reportWorkPermitInfo: (state.reportWorkPermitInfo, { loading: false, err: null, data: null })
      };
    case 'GET_TW_INFO':
      return {
        ...state,
        typeWork: (state.typeWork, { loading: true, data: null, err: null })
      };
    case 'GET_TW_INFO_SUCCESS':
      return {
        ...state,
        typeWork: (state.typeWork, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_TW_INFO_FAILURE':
      return {
        ...state,
        typeWork: (state.typeWork, { loading: false, err: action.error, data: null })
      };
    case 'GET_WN_INFO':
      return {
        ...state,
        workNature: (state.workNature, { loading: true, data: null, err: null })
      };
    case 'GET_WN_INFO_SUCCESS':
      return {
        ...state,
        workNature: (state.workNature, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WN_INFO_FAILURE':
      return {
        ...state,
        workNature: (state.workNature, { loading: false, err: action.error, data: null })
      };
    case 'GET_PC_INFO':
      return {
        ...state,
        prepareInfo: (state.prepareInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PC_INFO_SUCCESS':
      return {
        ...state,
        prepareInfo: (state.prepareInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PC_INFO_FAILURE':
      return {
        ...state,
        prepareInfo: (state.prepareInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_IP_INFO':
      return {
        ...state,
        issuePermitInfo: (state.issuePermitInfo, { loading: true, data: null, err: null })
      };
    case 'GET_IP_INFO_SUCCESS':
      return {
        ...state,
        issuePermitInfo: (state.issuePermitInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_IP_INFO_FAILURE':
      return {
        ...state,
        issuePermitInfo: (state.issuePermitInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_VENDOR_INFO':
      return {
        ...state,
        vendorData: (state.vendorData, { loading: true, data: null, err: null })
      };
    case 'GET_VENDOR_INFO_SUCCESS':
      return {
        ...state,
        vendorData: (state.vendorData, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_VENDOR_INFO_FAILURE':
      return {
        ...state,
        vendorData: (state.vendorData, { loading: false, err: action.error, data: null })
      };
    case 'GET_VENDOR_GROUP_INFO':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_VENDOR_GROUP_INFO_SUCCESS':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_VENDOR_GROUP_INFO_FAILURE':
      return {
        ...state,
        vendorGroupsInfo: (state.vendorGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_MAINTENANCE_GROUP_INFO':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_GROUP_INFO_FAILURE':
      return {
        ...state,
        maintenanceGroupsInfo: (state.maintenanceGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_NATURE_GROUP_INFO':
      return {
        ...state,
        natureGroupsInfo: (state.natureGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_NATURE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        natureGroupsInfo: (state.natureGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NATURE_GROUP_INFO_FAILURE':
      return {
        ...state,
        natureGroupsInfo: (state.natureGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PR_STATE_CHANGE_INFO':
      return {
        ...state,
        permitStateChangeInfo: (state.permitStateChangeInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PR_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        permitStateChangeInfo: (state.permitStateChangeInfo, { loading: false, data: action.payload, err: null })
      };
    case 'GET_PR_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        permitStateChangeInfo: (state.permitStateChangeInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PR_STATE_RESET_INFO':
      return {
        ...state,
        permitStateChangeInfo: (state.permitStateChangeInfo, { loading: false, err: null, data: null })
      };
    case 'GET_NATUREOFWORK_INFO':
      return {
        ...state,
        natureofWork: (state.natureofWork, { loading: true, data: null, err: null })
      };
    case 'GET_NATUREOFWORK_INFO_SUCCESS':
      return {
        ...state,
        natureofWork: (state.natureofWork, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NATUREOFWORK_INFO_FAILURE':
      return {
        ...state,
        natureofWork: (state.natureofWork, { loading: false, err: action.error, data: null })
      };
    case 'GET_NATUREOFWORK_EXPORT_LIST_INFO':
      return {
        ...state,
        natureofWorkExport: (state.natureofWorkExport, { loading: true, data: null, err: null })
      };
    case 'GET_NATUREOFWORK_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        natureofWorkExport: (state.natureofWorkExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_NATUREOFWORK_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        natureofWorkExport: (state.natureofWorkExport, { loading: false, err: action.error, data: null })
      };
    case 'RESET_PARTSSELECTED_INFO':
      return {
        ...state,
        partsSelected: (state.partsSelected, { loading: false, err: null, data: null })
      };
    case 'GET_WP_ROWS_PARTS_SELECTED':
      return {
        ...state,
        partsSelected: (state.partsSelected, action.payload),
      };
    case 'GET_WP_CONFIG_DETAILS_INFO':
      return {
        ...state,
        workPermitConfig: (state.workPermitConfig, { loading: true, data: null, err: null })
      };
    case 'GET_WP_CONFIG_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        workPermitConfig: (state.workPermitConfig, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WP_CONFIG_DETAILS_INFO_FAILURE':
      return {
        ...state,
        workPermitConfig: (state.workPermitConfig, { loading: false, err: action.error, data: null })
      };
    case 'GET_MO_CHECKLISTS_INFO':
      return {
        ...state,
        moChecklists: (state.moChecklists, { loading: true, data: null, err: null })
      };
    case 'GET_MO_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        moChecklists: (state.moChecklists, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MO_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        moChecklists: (state.moChecklists, { loading: false, err: action.error, data: null })
      };
    case 'GET_WP_TASK_DETAILS_INFO':
      return {
        ...state,
        wpTaskLists: (state.wpTaskLists, { loading: true, data: null, err: null })
      };
    case 'GET_WP_TASK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        wpTaskLists: (state.wpTaskLists, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WP_TASK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        wpTaskLists: (state.wpTaskLists, { loading: false, err: action.error, data: null })
      };
    case 'GET_IP_TASK_DETAILS_INFO':
      return {
        ...state,
        wpIpLists: (state.wpIpLists, { loading: true, data: null, err: null })
      };
    case 'GET_IP_TASK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        wpIpLists: (state.wpIpLists, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_IP_TASK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        wpIpLists: (state.wpIpLists, { loading: false, err: action.error, data: null })
      };
    case 'RESET_IP_TASK_DETAILS_INFO':
      return {
        ...state,
        wpIpLists: (state.wpIpLists, { loading: false, err: null, data: null })
      };
    case 'GET_MAIL_LOGS_DETAILS_INFO':
      return {
        ...state,
        mailLogs: (state.mailLogs, { loading: true, data: null, err: null })
      };
    case 'GET_MAIL_LOGS_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        mailLogs: (state.mailLogs, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_MAIL_LOGS_DETAILS_INFO_FAILURE':
      return {
        ...state,
        mailLogs: (state.mailLogs, { loading: false, err: action.error, data: null })
      };
    case 'GET_WP_DEPARTMENTS_INFO':
      return {
        ...state,
        wpDepartments: (state.wpDepartments, { loading: true, data: null, err: null })
      };
    case 'GET_WP_DEPARTMENTS_INFO_SUCCESS':
      return {
        ...state,
        wpDepartments: (state.wpDepartments, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_WP_DEPARTMENTS_INFO_FAILURE':
      return {
        ...state,
        wpDepartments: (state.wpDepartments, { loading: false, err: action.error, data: null })
      };
    default:
      return state;
  }
}

export default reducer;
