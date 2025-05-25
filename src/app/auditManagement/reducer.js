/* eslint-disable comma-dangle */
const initialState = {
  auditGroups: {},
  customDataGroup: {},
  auditViewerInfo: {},
  auditViewerExportInfo: {},
  hxSystemsInfo: {},
  hxDepartmentsInfo: {},
  hxAuditConfig: {},
  hxAuditCreate: {},
  hxAuditUpdate: {},
  hxAuditDetailsInfo: {},
  hxAuditChecklistsInfo: {},
  hxAuditors: {},
  hxRoleIds: {},
  hxAuditDays: {},
  hxActionCreate: {},
  hxAuditActions: {},
  hxCategoriesInfo: {},
  hxAuditActionsList: {},
  hxAuditActionsCount: null,
  hxAuditActionsCountErr: null,
  hxAuditActionsCountLoading: false,
  hxAuditActionsFilters: {
    customFilters: [],
  },
  hxAuditActionsExport: {},
  hxAuditActionDetail: {},
  hxAuditActionPerform: {},
  hxDeleteAuditAction: {},
  hxSystemChecklists: {},
  hxChecklistDetail: {},
  hxAuditSystemsList: {},
  hxAuditSystemsExport: {},
  hxAuditSystemDetail: {},
  hxAuditSystemsCount: null,
  hxAuditSystemsCountErr: null,
  hxAuditSystemsCountLoading: false,
  hxAuditSystemsFilters: {
    customFilters: [],
  },
  hxSystemUpdateQtn: {},
  hxSystemUpdate: {},
  hxSystemCreate: {},
  createQtnGroupInfo: {},
  hxSystemMetrics: {},
  hxNcrRepeatInfo: {},
  hxAuditorsConfigList: {},
  hxAuditorsExportConfigList: {},
  hxAuditorsConfigCount: null,
  hxAuditorsConfigCountErr: null,
  hxAuditorsConfigCountLoading: false,
  hxAuditorsFilters: {
    customFilters: [],
  },
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_AUDIT_GROUP_INFO':
      return {
        ...state,
        auditGroups: (state.auditGroups, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_GROUP_INFO_SUCCESS':
      return {
        ...state,
        auditGroups: (state.auditGroups, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_GROUP_INFO_FAILURE':
      return {
        ...state,
        auditGroups: (state.auditGroups, { loading: false, err: action.error, data: null })
      };
    case 'GET_AUDIT_VIEWER_GROUP_INFO':
      return {
        ...state,
        auditViewerInfo: (state.auditViewerInfo, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_VIEWER_GROUP_INFO_SUCCESS':
      return {
        ...state,
        auditViewerInfo: (state.auditViewerInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_VIEWER_GROUP_INFO_FAILURE':
      return {
        ...state,
        auditViewerInfo: (state.auditViewerInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_AUDIT_VIEWER_GROUP_INFO':
      return {
        ...state,
        auditViewerInfo: (state.auditViewerInfo, { loading: false, err: null, data: null })
      };
    case 'GET_AUDIT_VIEWER_EXPORT_INFO':
      return {
        ...state,
        auditViewerExportInfo: (state.auditViewerExportInfo, { loading: true, data: null, err: null })
      };
    case 'GET_AUDIT_VIEWER_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        auditViewerExportInfo: (state.auditViewerExportInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_AUDIT_VIEWER_EXPORT_INFO_FAILURE':
      return {
        ...state,
        auditViewerExportInfo: (state.auditViewerExportInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUIDIT_DEPARTMENTS_INFO':
      return {
        ...state,
        hxDepartmentsInfo: (state.hxDepartmentsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUIDIT_DEPARTMENTS_INFO_SUCCESS':
      return {
        ...state,
        hxDepartmentsInfo: (state.hxDepartmentsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUIDIT_DEPARTMENTS_INFO_FAILURE':
      return {
        ...state,
        hxDepartmentsInfo: (state.hxDepartmentsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUIDIT_SYSTEMS_INFO':
      return {
        ...state,
        hxSystemsInfo: (state.hxSystemsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUIDIT_SYSTEMS_INFO_SUCCESS':
      return {
        ...state,
        hxSystemsInfo: (state.hxSystemsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUIDIT_SYSTEMS_INFO_FAILURE':
      return {
        ...state,
        hxSystemsInfo: (state.hxSystemsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDIT_CONFIG_INFO':
      return {
        ...state,
        hxAuditConfig: (state.hxAuditConfig, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDIT_CONFIG_INFO_SUCCESS':
      return {
        ...state,
        hxAuditConfig: (state.hxAuditConfig, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDIT_CONFIG_INFO_FAILURE':
      return {
        ...state,
        hxAuditConfig: (state.hxAuditConfig, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_HX_AUDIT_INFO':
      return {
        ...state,
        hxAuditCreate: (state.hxAuditCreate, { loading: true, data: null, err: null })
      };
    case 'CREATE_HX_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditCreate: (state.hxAuditCreate, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_HX_AUDIT_INFO_FAILURE':
      return {
        ...state,
        hxAuditCreate: (state.hxAuditCreate, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_HX_AUDIT_INFO':
      return {
        ...state,
        hxAuditCreate: (state.hxAuditCreate, { loading: false, err: null, data: null })
      };
    case 'UPDATE_HX_AUDIT_INFO':
      return {
        ...state,
        hxAuditUpdate: (state.hxAuditUpdate, { loading: true, data: null, err: null })
      };
    case 'UPDATE_HX_AUDIT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditUpdate: (state.hxAuditUpdate, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_HX_AUDIT_INFO_FAILURE':
      return {
        ...state,
        hxAuditUpdate: (state.hxAuditUpdate, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_HX_AUDIT_INFO':
      return {
        ...state,
        hxAuditUpdate: (state.hxAuditUpdate, { loading: false, err: null, data: null })
      };
    case 'GET_HXAUDIT_DETAILS_INFO':
      return {
        ...state,
        hxAuditDetailsInfo: (state.hxAuditDetailsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        hxAuditDetailsInfo: (state.hxAuditDetailsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_DETAILS_INFO_FAILURE':
      return {
        ...state,
        hxAuditDetailsInfo: (state.hxAuditDetailsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXAUDIT_CHECKLISTS_INFO':
      return {
        ...state,
        hxAuditChecklistsInfo: (state.hxAuditChecklistsInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        hxAuditChecklistsInfo: (state.hxAuditChecklistsInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        hxAuditChecklistsInfo: (state.hxAuditChecklistsInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXAUDITOR_NAMES_INFO':
      return {
        ...state,
        hxAuditors: (state.hxAuditors, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDITOR_NAMES_INFO_SUCCESS':
      return {
        ...state,
        hxAuditors: (state.hxAuditors, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDITOR_NAMES_INFO_FAILURE':
      return {
        ...state,
        hxAuditors: (state.hxAuditors, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXAUDIT_ROLES_INFO':
      return {
        ...state,
        hxRoleIds: (state.hxRoleIds, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_ROLES_INFO_SUCCESS':
      return {
        ...state,
        hxRoleIds: (state.hxRoleIds, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_ROLES_INFO_FAILURE':
      return {
        ...state,
        hxRoleIds: (state.hxRoleIds, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXACTION_DAYS_INFO':
      return {
        ...state,
        hxAuditDays: (state.hxAuditDays, { loading: true, data: null, err: null })
      };
    case 'GET_HXACTION_DAYS_INFO_SUCCESS':
      return {
        ...state,
        hxAuditDays: (state.hxAuditDays, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXACTION_DAYS_INFO_FAILURE':
      return {
        ...state,
        hxAuditDays: (state.hxAuditDays, { loading: false, err: action.error, data: null })
      };
    case 'CREATE_HX_ACTION_INFO':
      return {
        ...state,
        hxActionCreate: (state.hxActionCreate, { loading: true, data: null, err: null })
      };
    case 'CREATE_HX_ACTION_INFO_SUCCESS':
      return {
        ...state,
        hxActionCreate: (state.hxActionCreate, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_HX_ACTION_INFO_FAILURE':
      return {
        ...state,
        hxActionCreate: (state.hxActionCreate, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_HX_ACTION_INFO':
      return {
        ...state,
        hxActionCreate: (state.hxActionCreate, { loading: false, err: null, data: null })
      };
    case 'GET_HXAUDIT_ACTIONS_INFO':
      return {
        ...state,
        hxAuditActions: (state.hxAuditActions, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_ACTIONS_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActions: (state.hxAuditActions, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_ACTIONS_INFO_FAILURE':
      return {
        ...state,
        hxAuditActions: (state.hxAuditActions, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUIDIT_CATEGORIES_INFO':
      return {
        ...state,
        hxCategoriesInfo: (state.hxCategoriesInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUIDIT_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        hxCategoriesInfo: (state.hxCategoriesInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUIDIT_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        hxCategoriesInfo: (state.hxCategoriesInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_LIST_INFO':
      return {
        ...state,
        hxAuditActionsList: (state.hxAuditActionsList, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_LIST_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActionsList: (state.hxAuditActionsList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_LIST_INFO_FAILURE':
      return {
        ...state,
        hxAuditActionsList: (state.hxAuditActionsList, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO':
      return {
        ...state,
        hxAuditActionsExport: (state.hxAuditActionsExport, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActionsExport: (state.hxAuditActionsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDIT_ACTIONS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        hxAuditActionsExport: (state.hxAuditActionsExport, { loading: false, err: action.error, data: null })
      };
    case 'AUDIT_ACTION_FILTERS':
      return {
        ...state,
        hxAuditActionsFilters: (state.hxAuditActionsFilters, action.payload),
      };
    case 'GET_HX_AUDIT_ACTIONS_COUNT_INFO':
      return {
        ...state,
        hxAuditActionsCount: null,
        hxAuditActionsCountErr: null,
        hxAuditActionsCountLoading: true,
      };
    case 'GET_HX_AUDIT_ACTIONS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActionsCount: (state.hxAuditActionsCount, action.payload),
        hxAuditActionsCountErr: null,
        hxAuditActionsCountLoading: false,
      };
    case 'GET_HX_AUDIT_ACTIONS_COUNT_INFO_FAILURE':
      return {
        ...state,
        hxAuditActionsCountErr: (state.hxAuditActionsCountErr, action.error),
        hxAuditActionsCount: null,
        hxAuditActionsCountLoading: false,
      };
    case 'GET_HXAUDIT_ACTION_DETAIL_INFO':
      return {
        ...state,
        hxAuditActionDetail: (state.hxAuditActionDetail, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_ACTION_DETAIL_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActionDetail: (state.hxAuditActionDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_ACTION_DETAIL_INFO_FAILURE':
      return {
        ...state,
        hxAuditActionDetail: (state.hxAuditActionDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXAUDIT_ACTION_PERFORM_INFO':
      return {
        ...state,
        hxAuditActionPerform: (state.hxAuditActionPerform, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_ACTION_PERFORM_INFO_SUCCESS':
      return {
        ...state,
        hxAuditActionPerform: (state.hxAuditActionPerform, { loading: false, data: action.payload.status, err: null })
      };
    case 'GET_HXAUDIT_ACTION_PERFORM_INFO_FAILURE':
      return {
        ...state,
        hxAuditActionPerform: (state.hxAuditActionPerform, { loading: false, err: action.error, data: null })
      };
    case 'RESET_HXAUDIT_ACTION_PERFORM_INFO':
      return {
        ...state,
        hxAuditActionPerform: (state.hxAuditActionPerform, { loading: false, err: null, data: null })
      };
    case 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: true, data: null, err: null })
      };
    case 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO_SUCCESS':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_CUSTOM_DATA_AUDIT_GROUP_INFO_FAILURE':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CUSTOM_DATA_AUDIT_GROUP_INFO':
      return {
        ...state,
        customDataGroup: (state.customDataGroup, { loading: false, err: null, data: null })
      };
    case 'DELETE_AUDIT_ACTION_INFO':
      return {
        ...state,
        hxDeleteAuditAction: (state.hxDeleteAuditAction, { loading: true, data: null, err: null })
      };
    case 'DELETE_AUDIT_ACTION_INFO_SUCCESS':
      return {
        ...state,
        hxDeleteAuditAction: (state.hxDeleteAuditAction, { loading: false, data: action.payload.data, err: null })
      };
    case 'DELETE_AUDIT_ACTION_INFO_FAILURE':
      return {
        ...state,
        hxDeleteAuditAction: (state.hxDeleteAuditAction, { loading: false, err: action.error, data: null })
      };
    case 'RESET_DELETE_AUDIT_ACTION_INFO':
      return {
        ...state,
        hxDeleteAuditAction: (state.hxDeleteAuditAction, { loading: false, err: null, data: null })
      };
    case 'GET_SYSTEM_CHECKLISTS_INFO':
      return {
        ...state,
        hxSystemChecklists: (state.hxSystemChecklists, { loading: true, data: null, err: null })
      };
    case 'GET_SYSTEM_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        hxSystemChecklists: (state.hxSystemChecklists, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_SYSTEM_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        hxSystemChecklists: (state.hxSystemChecklists, { loading: false, err: action.error, data: null })
      };
    case 'GET_HXCHECKLIST_DETAILS_INFO':
      return {
        ...state,
        hxChecklistDetail: (state.hxChecklistDetail, { loading: true, data: null, err: null })
      };
    case 'GET_HXCHECKLIST_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        hxChecklistDetail: (state.hxChecklistDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXCHECKLIST_DETAILS_INFO_FAILURE':
      return {
        ...state,
        hxChecklistDetail: (state.hxChecklistDetail, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_LIST_INFO':
      return {
        ...state,
        hxAuditSystemsList: (state.hxAuditSystemsList, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_LIST_INFO_SUCCESS':
      return {
        ...state,
        hxAuditSystemsList: (state.hxAuditSystemsList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_LIST_INFO_FAILURE':
      return {
        ...state,
        hxAuditSystemsList: (state.hxAuditSystemsList, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO':
      return {
        ...state,
        hxAuditSystemsExport: (state.hxAuditSystemsExport, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditSystemsExport: (state.hxAuditSystemsExport, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDIT_SYSTEMS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        hxAuditSystemsExport: (state.hxAuditSystemsExport, { loading: false, err: action.error, data: null })
      };
    case 'AUDIT_SYSTEM_FILTERS':
      return {
        ...state,
        hxAuditSystemsFilters: (state.hxAuditSystemsFilters, action.payload),
      };
    case 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO':
      return {
        ...state,
        hxAuditSystemsCount: null,
        hxAuditSystemsCountErr: null,
        hxAuditSystemsCountLoading: true,
      };
    case 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditSystemsCount: (state.hxAuditSystemsCount, action.payload),
        hxAuditSystemsCountErr: null,
        hxAuditSystemsCountLoading: false,
      };
    case 'GET_HX_AUDIT_SYSTEMS_COUNT_INFO_FAILURE':
      return {
        ...state,
        hxAuditSystemsCountErr: (state.hxAuditSystemsCountErr, action.error),
        hxAuditSystemsCount: null,
        hxAuditSystemsCountLoading: false,
      };
    case 'GET_HXAUDIT_SYSTEM_DETAIL_INFO':
      return {
        ...state,
        hxAuditSystemDetail: (state.hxAuditSystemDetail, { loading: true, data: null, err: null })
      };
    case 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_SUCCESS':
      return {
        ...state,
        hxAuditSystemDetail: (state.hxAuditSystemDetail, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HXAUDIT_SYSTEM_DETAIL_INFO_FAILURE':
      return {
        ...state,
        hxAuditSystemDetail: (state.hxAuditSystemDetail, { loading: false, err: action.error, data: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO':
      return {
        ...state,
        hxSystemUpdate: (state.hxSystemUpdate, { loading: true, data: null, err: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO_SUCCESS':
      return {
        ...state,
        hxSystemUpdate: (state.hxSystemUpdate, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO_FAILURE':
      return {
        ...state,
        hxSystemUpdate: (state.hxSystemUpdate, { loading: false, err: action.error, data: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO2':
      return {
        ...state,
        hxSystemUpdateQtn: (state.hxSystemUpdateQtn, { loading: true, data: null, err: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO_SUCCESS2':
      return {
        ...state,
        hxSystemUpdateQtn: (state.hxSystemUpdateQtn, { loading: false, data: action.payload.data, err: null })
      };
    case 'UPDATE_HX_SYSTEM_INFO_FAILURE2':
      return {
        ...state,
        hxSystemUpdateQtn: (state.hxSystemUpdateQtn, { loading: false, err: action.error, data: null })
      };
    case 'RESET_UPDATE_HX_SYSTEM_INFO':
      return {
        ...state,
        hxSystemUpdate: (state.hxSystemUpdate, { loading: false, err: null, data: null }),
        hxSystemUpdateQtn: (state.hxSystemUpdateQtn, { loading: false, err: null, data: null })
      };
    case 'CREATE_HX_SYSTEM_INFO':
      return {
        ...state,
        hxSystemCreate: (state.hxSystemCreate, { loading: true, data: null, err: null })
      };
    case 'CREATE_HX_SYSTEM_INFO_SUCCESS':
      return {
        ...state,
        hxSystemCreate: (state.hxSystemCreate, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_HX_SYSTEM_INFO_FAILURE':
      return {
        ...state,
        hxSystemCreate: (state.hxSystemCreate, { loading: false, err: action.error, data: null })
      };
    case 'RESET_CREATE_HX_SYSTEM_INFO':
      return {
        ...state,
        hxSystemCreate: (state.hxSystemCreate, { loading: false, err: null, data: null })
      };
    case 'CREATE_HX_QTN_GROUP_INFO':
      return {
        ...state,
        createQtnGroupInfo: (state.createQtnGroupInfo, { loading: true, data: null, err: null })
      };
    case 'CREATE_HX_QTN_GROUP_INFO_SUCCESS':
      return {
        ...state,
        createQtnGroupInfo: (state.createQtnGroupInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'CREATE_HX_QTN_GROUP_INFO_FAILURE':
      return {
        ...state,
        createQtnGroupInfo: (state.createQtnGroupInfo, { loading: false, err: action.error, data: null })
      };
    case 'RESET_HX_QTN_GROUP_INFO':
      return {
        ...state,
        createQtnGroupInfo: (state.createQtnGroupInfo, { loading: false, err: null, data: null })
      };
    case 'GET_HX_SYSTEM_METRIC_INFO':
      return {
        ...state,
        hxSystemMetrics: (state.hxSystemMetrics, { loading: true, data: null, err: null })
      };
    case 'GET_HX_SYSTEM_METRIC_INFO_SUCCESS':
      return {
        ...state,
        hxSystemMetrics: (state.hxSystemMetrics, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_SYSTEM_METRIC_INFO_FAILURE':
      return {
        ...state,
        hxSystemMetrics: (state.hxSystemMetrics, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_NCR_REPEAT_INFO':
      return {
        ...state,
        hxNcrRepeatInfo: (state.hxNcrRepeatInfo, { loading: true, data: null, err: null })
      };
    case 'GET_HX_NCR_REPEAT_INFO_SUCCESS':
      return {
        ...state,
        hxNcrRepeatInfo: (state.hxNcrRepeatInfo, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_NCR_REPEAT_INFO_FAILURE':
      return {
        ...state,
        hxNcrRepeatInfo: (state.hxNcrRepeatInfo, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_LIST_INFO':
      return {
        ...state,
        hxAuditorsConfigList: (state.hxAuditorsConfigList, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_LIST_INFO_SUCCESS':
      return {
        ...state,
        hxAuditorsConfigList: (state.hxAuditorsConfigList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_LIST_INFO_FAILURE':
      return {
        ...state,
        hxAuditorsConfigList: (state.hxAuditorsConfigList, { loading: false, err: action.error, data: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO':
      return {
        ...state,
        hxAuditorsExportConfigList: (state.hxAuditorsExportConfigList, { loading: true, data: null, err: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditorsExportConfigList: (state.hxAuditorsExportConfigList, { loading: false, data: action.payload.data, err: null })
      };
    case 'GET_HX_AUDITORS_CONFIG_EXPORT_INFO_FAILURE':
      return {
        ...state,
        hxAuditorsExportConfigList: (state.hxAuditorsExportConfigList, { loading: false, err: action.error, data: null })
      };
    case 'AUDITORS_CONFIG_FILTERS':
      return {
        ...state,
        hxAuditorsFilters: (state.hxAuditorsFilters, action.payload),
      };
    case 'GET_HX_AUDITORS_CONFIG_COUNT_INFO':
      return {
        ...state,
        hxAuditorsConfigCount: null,
        hxAuditorsConfigCountErr: null,
        hxAuditorsConfigCountLoading: true,
      };
    case 'GET_HX_AUDITORS_CONFIG_COUNT_INFO_SUCCESS':
      return {
        ...state,
        hxAuditorsConfigCount: (state.hxAuditorsConfigCount, action.payload),
        hxAuditorsConfigCountErr: null,
        hxAuditorsConfigCountLoading: false,
      };
    case 'GET_HX_AUDITORS_CONFIG_COUNT_INFO_FAILURE':
      return {
        ...state,
        hxAuditorsConfigCountErr: (state.hxAuditorsConfigCountErr, action.error),
        hxAuditorsConfigCount: null,
        hxAuditorsConfigCountLoading: false,
      };
    default:
      return state;
  }
}

export default reducer;
