/* eslint-disable comma-dangle */
const initialState = {
  inspectionFilters: {
    customFilters: []
  },
  inspectionListInfo: {},
  inspectionExport: {},
  inspectionCount: null,
  inspectionCountErr: null,
  inspectionCountLoading: false,
  inspectionGroupInfo: {},
  checklistGroupsInfo: {},
  customDataGroup: {},
  inspectionChecklistDetail: {},
  inspectionSchedulerDetail: {},
  addInspectionScheduleInfo: {},
  inspectionCommenceInfo: {},
  inspectionDashboardFilters: {},
  ppmGroupInfo: {},
  ppmWeekInfo: {},
  ppmChecklistCount: null,
  ppmChecklistErr: null,
  ppmChecklistLoading: false,
  inspectionChecklistCount: null,
  inspectionChecklistErr: null,
  inspectionChecklistLoading: false,
  inspectionChecklistCountLoading: false,
  inspectionChecklistExport: {},
  inspectionPageGroups: {},
  inspectionSpacePageGroups: {},
  inspectionStatusGroups: {},
  inspectionChecklists: {},
  inspectionOrderInfo: {},
  inspectionParentsInfo: {},
  hxInspCancelList: {},
  hxInspCancelCount: null,
  hxInspCancelCountErr: null,
  hxInspCancelLoading: false,
  hxInspCancelFilters: {
    customFilters: [],
  },
  hxInspCancelExport: {},
  ppmAssetsSchedules: {},
  hxInspCancelDetails: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_INSPECTION_COUNT_INFO':
      return {
        ...state,
        inspectionCount: null,
        inspectionCountErr: null,
        inspectionCountLoading: true
      };
    case 'GET_INSPECTION_COUNT_INFO_SUCCESS':
      return {
        ...state,
        inspectionCountErr: null,
        inspectionCount: (state.inspectionCount, action.payload),
        inspectionCountLoading: false
      };
    case 'GET_INSPECTION_COUNT_INFO_FAILURE':
      return {
        ...state,
        inspectionCountErr: (state.inspectionCountErr, action.error),
        inspectionCount: (state.inspectionCount, false),
        inspectionCountLoading: false
      };
    case 'INSPECTION_FILTERS':
      return {
        ...state,
        inspectionFilters: (state.inspectionFilters, action.payload)
      };
    case 'GET_INSPECTION_LIST_INFO':
      return {
        ...state,
        inspectionListInfo: (state.inspectionListInfo, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_LIST_INFO_SUCCESS':
      return {
        ...state,
        inspectionListInfo: (state.inspectionListInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_LIST_INFO_FAILURE':
      return {
        ...state,
        inspectionListInfo: (state.inspectionListInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSPECTION_EXPORT_LIST_INFO':
      return {
        ...state,
        inspectionExport: (state.inspectionExport, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_EXPORT_LIST_INFO_SUCCESS':
      return {
        ...state,
        inspectionExport: (state.inspectionExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_EXPORT_LIST_INFO_FAILURE':
      return {
        ...state,
        inspectionExport: (state.inspectionExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_INFO':
      return {
        ...state,
        inspectionGroupInfo: (state.inspectionGroupInfo, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_INFO_SUCCESS':
      return {
        ...state,
        inspectionGroupInfo: (state.inspectionGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_INFO_FAILURE':
      return {
        ...state,
        inspectionGroupInfo: (state.inspectionGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_INSPECTION_CHECKLIST_GROUP_INFO':
      return {
        ...state,
        inspectionGroupInfo: (state.inspectionGroupInfo, { loading: false, data: null, err: null })
      };
    case 'GET_INS_CHECKLISTS_GROUP_INFO':
      return {
        ...state,
        checklistGroupsInfo: (state.checklistGroupsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_INS_CHECKLISTS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        checklistGroupsInfo: (state.checklistGroupsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INS_CHECKLISTS_GROUP_INFO_FAILURE':
      return {
        ...state,
        checklistGroupsInfo: (state.checklistGroupsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_CUSTOM_DATA_GROUP_INFO':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: true, data: null, err: null })
      };
    case 'GET_CUSTOM_DATA_GROUP_INFO_SUCCESS':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_CUSTOM_DATA_GROUP_INFO_FAILURE':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CUSTOM_GROUP':
      return {
        ...state,
        inspectionPageGroups: (state.inspectionPageGroups, { loading: false, err: null, data: null }),
      };
    case 'GET_INSPECTION_DETAILS_INFO':
      return {
        ...state,
        inspectionChecklistDetail: (state.inspectionChecklistDetail, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        inspectionChecklistDetail: (state.inspectionChecklistDetail, { loading: false, data: action.payload, err: null })
      };
    case 'GET_INSPECTION_DETAILS_INFO_FAILURE':
      return {
        ...state,
        inspectionChecklistDetail: (state.inspectionChecklistDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSPECTION_SCHEDULER_DETAILS_INFO':
      return {
        ...state,
        inspectionSchedulerDetail: (state.inspectionSchedulerDetail, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_SCHEDULER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        inspectionSchedulerDetail: (state.inspectionSchedulerDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_SCHEDULER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        inspectionSchedulerDetail: (state.inspectionSchedulerDetail, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_INSPECTION_INFO':
      return {
        ...state,
        addInspectionScheduleInfo: (state.addInspectionScheduleInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_INSPECTION_INFO_SUCCESS':
      return {
        ...state,
        addInspectionScheduleInfo: (state.addInspectionScheduleInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_INSPECTION_INFO_FAILURE':
      return {
        ...state,
        addInspectionScheduleInfo: (state.addInspectionScheduleInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSPECTION_COMMENCED_DATE_INFO':
      return {
        ...state,
        inspectionCommenceInfo: (state.inspectionCommenceInfo, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_COMMENCED_DATE_INFO_SUCCESS':
      return {
        ...state,
        inspectionCommenceInfo: (state.inspectionCommenceInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_COMMENCED_DATE_INFO_FAILURE':
      return {
        ...state,
        inspectionCommenceInfo: (state.inspectionCommenceInfo, { loading: false, err: action.error, data: null })
      };
    case 'INSPECTION_DASHBOARD_FILTERS':
      return {
        ...state,
        inspectionDashboardFilters: (state.inspectionDashboardFilters, action.payload)
      };
    case 'GET_PPM_CHECKLIST_GROUP_INFO':
      return {
        ...state,
        ppmGroupInfo: (state.ppmGroupInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PPM_CHECKLIST_GROUP_INFO_SUCCESS':
      return {
        ...state,
        ppmGroupInfo: (state.ppmGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PPM_CHECKLIST_GROUP_INFO_FAILURE':
      return {
        ...state,
        ppmGroupInfo: (state.ppmGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PPM_WEEK_DETAILS_INFO':
      return {
        ...state,
        ppmWeekInfo: (state.ppmWeekInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PPM_WEEK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ppmWeekInfo: (state.ppmWeekInfo, { loading: false, data: action.payload, err: null })
      };
    case 'GET_PPM_WEEK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ppmWeekInfo: (state.ppmWeekInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO':
      return {
        ...state,
        ppmChecklistCount: (state.ppmChecklistCount, null),
        ppmChecklistErr: (state.ppmChecklistErr, null),
        ppmChecklistCountLoading: true
      };
    case 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO_SUCCESS':
      return {
        ...state,
        ppmChecklistCount: (state.ppmChecklistCount, action.payload),
        ppmChecklistErr: (state.ppmChecklistErr, null),
        ppmChecklistCountLoading: false
      };
    case 'GET_PPM_CHECKLIST_GROUP_COUNT_INFO_FAILURE':
      return {
        ...state,
        ppmChecklistErr: (state.ppmChecklistErr, action.error),
        ppmChecklistCount: (state.ppmChecklistCount, null),
        ppmChecklistCountLoading: false
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO':
      return {
        ...state,
        inspectionChecklistCount: (state.inspectionChecklistCount, null),
        inspectionChecklistErr: (state.inspectionChecklistErr, null),
        inspectionChecklistCountLoading: true
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_SUCCESS':
      return {
        ...state,
        inspectionChecklistCount: (state.ppmChecklistCount, action.payload),
        inspectionChecklistErr: (state.inspectionChecklistErr, null),
        inspectionChecklistCountLoading: false
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_COUNT_INFO_FAILURE':
      return {
        ...state,
        inspectionChecklistErr: (state.inspectionChecklistErr, action.error),
        inspectionChecklistCount: (state.inspectionChecklistCount, null),
        inspectionChecklistCountLoading: false
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO':
      return {
        ...state,
        inspectionChecklistExport: (state.inspectionChecklistExport, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        inspectionChecklistExport: (state.inspectionChecklistExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_CHECKLIST_GROUP_EXPORT_INFO_FAILURE':
      return {
        ...state,
        inspectionChecklistExport: (state.inspectionChecklistExport, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO':
      return {
        ...state,
        inspectionPageGroups: (state.inspectionPageGroups, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        inspectionPageGroups: (state.inspectionPageGroups, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_PAGE_GROUP_EXPORT_INFO_FAILURE':
      return {
        ...state,
        inspectionPageGroups: (state.inspectionPageGroups, { loading: false, err: action.error, data: null })
      };
    case 'RESET_EQUIPMENT_GROUP_INFO':
      return {
        ...state,
        inspectionPageGroups: (state.inspectionPageGroups, { loading: false, err: null, data: null }),
      };
    case 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO':
      return {
        ...state,
        inspectionSpacePageGroups: (state.inspectionSpacePageGroups, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        inspectionSpacePageGroups: (state.inspectionSpacePageGroups, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_PAGE_SPACE_GROUP_EXPORT_INFO_FAILURE':
      return {
        ...state,
        inspectionSpacePageGroups: (state.inspectionSpacePageGroups, { loading: false, err: action.error, data: null })
      };
    case 'RESET_SPACE_GROUP_INFO':
      return {
        ...state,
        inspectionSpacePageGroups: (state.inspectionSpacePageGroups, { loading: false, err: null, data: null }),
      };
    case 'GET_INSPECTION_STATUS_GROUP_INFO':
      return {
        ...state,
        inspectionStatusGroups: (state.inspectionStatusGroups, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_STATUS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        inspectionStatusGroups: (state.inspectionStatusGroups, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_STATUS_GROUP_INFO_FAILURE':
      return {
        ...state,
        inspectionStatusGroups: (state.inspectionStatusGroups, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_INSPECTION':
      return {
        ...state,
        addInspectionScheduleInfo: (state.addInspectionScheduleInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_INSPECTION_CHECKLISTS_INFO':
      return {
        ...state,
        inspectionChecklists: (state.inspectionChecklists, { loading: true, data: null, err: null })
      };
    case 'GET_INSPECTION_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        inspectionChecklists: (state.inspectionChecklists, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSPECTION_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        inspectionChecklists: (state.inspectionChecklists, { loading: false, err: action.error, data: null })
      };
    case 'GET_INSP_ORDER_INFO':
      return {
        ...state,
        inspectionOrderInfo: (state.inspectionOrderInfo, { loading: true, data: null, err: null })
      };
    case 'GET_INSP_ORDER_INFO_SUCCESS':
      return {
        ...state,
        inspectionOrderInfo: (state.inspectionOrderInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_INSP_ORDER_INFO_FAILURE':
      return {
        ...state,
        inspectionOrderInfo: (state.inspectionOrderInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_PARENT_SCHEDULES_INFO':
      return {
        ...state,
        inspectionParentsInfo: (state.inspectionParentsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_PARENT_SCHEDULES_INFO_SUCCESS':
      return {
        ...state,
        inspectionParentsInfo: (state.inspectionParentsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_PARENT_SCHEDULES_INFO_FAILURE':
      return {
        ...state,
        inspectionParentsInfo: (state.inspectionParentsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO':
      return {
        ...state,
        hxInspCancelList: (state.hxInspCancelList, { loading: true, data: null, err: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_SUCCESS':
      return {
        ...state,
        hxInspCancelList: (state.hxInspCancelList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_LIST_INFO_FAILURE':
      return {
        ...state,
        hxInspCancelList: (state.hxInspCancelList, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO':
      return {
        ...state,
        hxInspCancelExport: (state.hxInspCancelExport, { loading: true, data: null, err: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        hxInspCancelExport: (state.hxInspCancelExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        hxInspCancelExport: (state.hxInspCancelExport, { loading: false, err: action.error, data: null })
      };
    case 'HX_INSP_CANCEL_FILTERS':
      return {
        ...state,
        hxInspCancelFilters: (state.hxInspCancelFilters, action.payload),
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO':
      return {
        ...state,
        hxInspCancelCount: null,
        hxInspCancelCountErr: null,
        hxInspCancelCountLoading: true,
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        hxInspCancelCount: (state.hxInspCancelCount, action.payload),
        hxInspCancelCountErr: null,
        hxInspCancelCountLoading: false,
      };
    case 'GET_HX_INSP_CANCEL_REQUESTS_COUNT_INFO_FAILURE':
      return {
        ...state,
        hxInspCancelCountErr: (state.hxInspCancelCountErr, action.error),
        hxInspCancelCount: null,
        hxInspCancelCountLoading: false,
      };
    case 'GET_HX_INSP_CANCEL_DETAILS_INFO':
      return {
        ...state,
        hxInspCancelDetails: (state.hxInspCancelDetails, { loading: true, data: null, err: null })
      };
    case 'GET_HX_INSP_CANCEL_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        hxInspCancelDetails: (state.hxInspCancelDetails, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_INSP_CANCEL_DETAILS_INFO_FAILURE':
      return {
        ...state,
        hxInspCancelDetails: (state.hxInspCancelDetails, { loading: false, err: action.error, data: null })
      };
    case 'GET_ASSET_PPM_SCHEDULES_INFO':
      return {
        ...state,
        ppmAssetsSchedules: (state.ppmAssetsSchedules, { loading: true, data: null, err: null })
      };
    case 'GET_ASSET_PPM_SCHEDULES_INFO_SUCCESS':
      return {
        ...state,
        ppmAssetsSchedules: (state.ppmAssetsSchedules, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_ASSET_PPM_SCHEDULES_INFO_FAILURE':
      return {
        ...state,
        ppmAssetsSchedules: (state.ppmAssetsSchedules, { loading: false, err: action.error, data: null })
      };
    default:
      return state;
  }
}

export default reducer;
