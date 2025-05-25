const initialState = {
  ppmCalendarInfo: {},
  assetCategoriesInfo: {},
  addPreventiveInfo: {},
  taskInfo: {},
  ppmInfo: {},
  ppmRows: {},
  ppmFilter: {},
  ppmExportInfo: {},
  ppmDetail: {},
  reports: {},
  ppmCount: {},
  equipmentSelected: {},
  orderPreventive: {},
  ppmFilterViewer: {},
  addPreventiveOperation: {},
  addPreventiveChecklist: {},
  addActivityInfo: {},
  checkList: {},
  toolsList: {},
  reportId: {},
  selectedReportDate: null,
  locationId: null,
  questionGroupInfo: {},
  smartLoggerInfo: {},
  productInfo: {},
  productIdInfo: {},
  partsSelected: {},
  checklistSelected: {},
  toolsSelected: {},
  questionChecklist: {},
  questionData: {},
  questionList: {},
  headers: [],
  locations: {},
  teamGroupInfo: {},
  ppmViewData: {},
  ppmCheckListData: {},
  updateCheckLisInfo: {},
  updateActivityInfo: {},
  ppmOperationData: {},
  updateOperationInfo: {},
  taskCheckLists: {},
  taskToolsList: {},
  taskPartsList: {},
  spacesList: {},
  updatePpmSchedulerInfo: {},
  preventiveScheduleDeleteInfo: {},
  ppmReports: {},
  typeId: null,
  spacesSelectedList: {},
  hourlyList: {},
  inspectionDashboard: {},
  ppmParentSchdulers: {},
  inspectionOrders: {},
  inspectionDashboardDate: {},
  preventiveChecklistOrders: {},
  inspectionTeamsDashboard: {},
  checklistGroup: {},
  parentScheduleInfo: {},
  employeeChecklists: {},
  inspectionEmployees: {},
  employeeGroupInfo: {},
  scheduleInfo: {},
  ppmStatusInfo: {},
  ppmChecklistExportInfo: {},
  choiceOptionInfo: {},
  gatePassAssets: {},
  locationProducts: {},
  locationProductsCount: {},
  conditionQuestionGroupInfo: {},
  optionInfo: {},
  activeStep: 0,
  inspectionassetSpaceInfo: {},
  ppmassetSpaceInfo: {},
  checkListsJson: {},
  locationProductsHide: {},
  ppmVendorInfo: {},
  assetChildsInfo: {},
  assetInnerChirldsInfo: {},
  warehouseLastUpdate: {},
  checklistQuestionList: {},
  ppmStatusLogs: {},
  ppmYearlyReport: {},
  ppmYearlyExport: {},
  externalVendorGroups: {},
  externalWeekGroups: {},
  externalVendorLink: {},
  bulkPPMCreate: {},
  downloadRequestInfo: {},
  downloadRequestCount: {},
  downloadRequestDetails: {},
  ppmSpaceInfo: {},
  teamInfo: {},
  hxPpmDetails: {},
  hxCreatePpmCancelRequest: {},
  hxUpdatePpmCancelRequest: {},
  hxPpmCancelDetails: {},
  hxPPMCancelList: {},
  hxPPMCancelCount: null,
  hxPPMCancelCountErr: null,
  hxPPMCancelLoading: false,  
  resumePPMInfo: {},
  resumeInspectionInfo: {},
  hxPPMCancelFilters: {
    customFilters: [],
  },
  hxPPMCancelExport: {},
  downloadRequestSingleData: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_PPM_INFO':
      return {
        ...state,
        ppmCalendarInfo: (state.ppmCalendarInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_INFO_SUCCESS':
      return {
        ...state,
        ppmCalendarInfo: (state.ppmCalendarInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_INFO_FAILURE':
      return {
        ...state,
        ppmCalendarInfo: (state.ppmCalendarInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PREVENTIVE_EXPORT_INFO':
      return {
        ...state,
        ppmExportInfo: (state.ppmExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PREVENTIVE_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        ppmExportInfo: (state.ppmExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PREVENTIVE_EXPORT_INFO_FAILURE':
      return {
        ...state,
        ppmExportInfo: (state.ppmExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ASSET_CATEGORIES_INFO':
      return {
        ...state,
        assetCategoriesInfo: (state.assetCategoriesInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ASSET_CATEGORIES_INFO_SUCCESS':
      return {
        ...state,
        assetCategoriesInfo: (state.assetCategoriesInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ASSET_CATEGORIES_INFO_FAILURE':
      return {
        ...state,
        assetCategoriesInfo: (state.assetCategoriesInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ASSET_CATEGORY':
      return {
        ...state,
        assetCategoriesInfo: (state.assetCategoriesInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_OPERATIONS_INFO':
      return {
        ...state,
        taskInfo: (state.taskInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_OPERATIONS_INFO_SUCCESS':
      return {
        ...state,
        taskInfo: (state.taskInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OPERATIONS_INFO_FAILURE':
      return {
        ...state,
        taskInfo: (state.taskInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_PREVENTIVE_INFO':
      return {
        ...state,
        addPreventiveInfo: (state.addPreventiveInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PREVENTIVE_INFO_SUCCESS':
      return {
        ...state,
        addPreventiveInfo: (state.addPreventiveInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PREVENTIVE_INFO_FAILURE':
      return {
        ...state,
        addPreventiveInfo: (state.addPreventiveInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_PREVENTIVE_INFO':
      return {
        ...state,
        addPreventiveInfo: (state.addPreventiveInfo, { loading: false, err: false, data: null }),
      };
    case 'GET_PPM_DETAILS_INFO':
      return {
        ...state,
        ppmDetail: (state.ppmDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ppmDetail: (state.ppmDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ppmDetail: (state.ppmDetail, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PREVENTIVE_INFO':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PREVENTIVE_INFO_SUCCESS':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PREVENTIVE_INFO_FAILURE':
      return {
        ...state,
        ppmInfo: (state.ppmInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_COUNT':
      return {
        ...state,
        ppmCount: (state.ppmCount, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_COUNT_SUCCESS':
      return {
        ...state,
        ppmCount: (state.ppmCount, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_PPM_COUNT_FAILURE':
      return {
        ...state,
        ppmCount: (state.ppmCount, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FILTER_PPM':
      return {
        ...state,
        ppmFilter: (state.ppmFilter, action.payload),
      };
    case 'GET_FILTER_VIEWER_PPM':
      return {
        ...state,
        ppmFilterViewer: (state.ppmFilterViewer, action.payload),
      };
    case 'GET_ROWS_PPM':
      return {
        ...state,
        ppmRows: (state.ppmRows, action.payload),
      };
    case 'GET_ROWS_EQUIPMENT_SELECTED':
      return {
        ...state,
        equipmentSelected: (state.equipmentSelected, action.payload),
      };
    case 'GET_REPORT_ID':
      return {
        ...state,
        reportId: (state.reportId, action.payload),
      };
    case 'GET_SELECTED_REPORT_DATE':
      return {
        ...state,
        selectedReportDate: (state.selectedReportDate, action.payload),
      };
    case 'GET_LOCATION_ID':
      return {
        ...state,
        locationId: (state.locationId, action.payload),
      };
    case 'GET_TYPE_ID':
      return {
        ...state,
        typeId: (state.typeId, action.payload),
      };
    case 'GET_HEADERS':
      return {
        ...state,
        headers: (state.headers, action.payload),
      };
    case 'GET_EP_INFO':
      return {
        ...state,
        orderPreventive: (state.orderPreventive, { loading: true, data: null, err: null }),
      };
    case 'GET_EP_INFO_SUCCESS':
      return {
        ...state,
        orderPreventive: (state.orderPreventive, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EP_INFO_FAILURE':
      return {
        ...state,
        orderPreventive: (state.orderPreventive, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_INFO':
      return {
        ...state,
        checkList: (state.checkList, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        checkList: (state.checkList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        checkList: (state.checkList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SPACES_INFO':
      return {
        ...state,
        spacesList: (state.spacesList, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACES_INFO_SUCCESS':
      return {
        ...state,
        spacesList: (state.spacesList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SPACES_INFO_FAILURE':
      return {
        ...state,
        spacesList: (state.spacesList, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_SPACES_INFO':
      return {
        ...state,
        spacesSelectedList: (state.spacesSelectedList, { data: null }),
      };
    case 'SET_SPACES_INFO':
      return {
        ...state,
        spacesSelectedList: (state.spacesSelectedList, { data: action.payload }),
      };
    case 'GET_TOOLS_INFO':
      return {
        ...state,
        toolsList: (state.toolsList, { loading: true, data: null, err: null }),
      };
    case 'GET_TOOLS_INFO_SUCCESS':
      return {
        ...state,
        toolsList: (state.toolsList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TOOLS_INFO_FAILURE':
      return {
        ...state,
        toolsList: (state.toolsList, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_PREVENTIVE_OPERATION':
      return {
        ...state,
        addPreventiveOperation: (state.addPreventiveOperation, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PREVENTIVE_OPERATION_SUCCESS':
      return {
        ...state,
        addPreventiveOperation: (state.addPreventiveOperation, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PREVENTIVE_OPERATION_FAILURE':
      return {
        ...state,
        addPreventiveOperation: (state.addPreventiveOperation, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PREVENTIVE_OPERATION_CREATE':
      return {
        ...state,
        addPreventiveOperation: (state.addPreventiveOperation, { loading: false, err: null, data: null }),
      };
    case 'GET_QUESTION_GROUP_INFO':
      return {
        ...state,
        questionGroupInfo: (state.questionGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTION_GROUP_INFO_SUCCESS':
      return {
        ...state,
        questionGroupInfo: (state.questionGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUESTION_GROUP_INFO_FAILURE':
      return {
        ...state,
        questionGroupInfo: (state.questionGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CONDITION_QUESTION_INFO':
      return {
        ...state,
        conditionQuestionGroupInfo: (state.conditionQuestionGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CONDITION_QUESTION_INFO_SUCCESS':
      return {
        ...state,
        conditionQuestionGroupInfo: (state.conditionQuestionGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CONDITION_QUESTION_INFO_FAILURE':
      return {
        ...state,
        conditionQuestionGroupInfo: (state.conditionQuestionGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_OPTION_INFO':
      return {
        ...state,
        optionInfo: (state.optionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_OPTION_INFO_SUCCESS':
      return {
        ...state,
        optionInfo: (state.optionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OPTION_INFO_FAILURE':
      return {
        ...state,
        optionInfo: (state.optionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SMART_LOGGER_INFO':
      return {
        ...state,
        smartLoggerInfo: (state.smartLoggerInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SMART_LOGGER_INFO_SUCCESS':
      return {
        ...state,
        smartLoggerInfo: (state.smartLoggerInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SMART_LOGGER_INFO_FAILURE':
      return {
        ...state,
        smartLoggerInfo: (state.smartLoggerInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_INFO':
      return {
        ...state,
        productInfo: (state.productInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_INFO_SUCCESS':
      return {
        ...state,
        productInfo: (state.productInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_INFO_FAILURE':
      return {
        ...state,
        productInfo: (state.productInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRODUCT_ID_INFO':
      return {
        ...state,
        productIdInfo: (state.productIdInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRODUCT_ID_INFO_SUCCESS':
      return {
        ...state,
        productIdInfo: (state.productIdInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRODUCT_ID_INFO_FAILURE':
      return {
        ...state,
        productIdInfo: (state.productIdInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PRODUCTS_BY_ID':
      return {
        ...state,
        productIdInfo: (state.productIdInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTION_INFO':
      return {
        ...state,
        questionChecklist: (state.questionChecklist, { loading: true, data: null, err: null }),
      };
    case 'GET_QUESTION_INFO_SUCCESS':
      return {
        ...state,
        questionChecklist: (state.questionChecklist, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_QUESTION_INFO_FAILURE':
      return {
        ...state,
        questionChecklist: (state.questionChecklist, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_QUESTIONS':
      return {
        ...state,
        questionChecklist: (state.questionChecklist, { loading: false, err: null, data: null }),
      };
    case 'RESET_QUESTIONS_DATA':
      return {
        ...state,
        questionData: (state.questionData, action.payload),
      };
    case 'RESET_QUESTIONS_LIST':
      return {
        ...state,
        questionList: (state.questionList, action.payload),
      };
    case 'RESET_ADD_OPERATION_INFO':
      return {
        ...state,
        addPreventiveOperation: (state.addPreventiveOperation, { loading: false, err: null, data: null }),
      };
    case 'CREATE_PREVENTIVE_CHECKLIST':
      return {
        ...state,
        addPreventiveChecklist: (state.addPreventiveChecklist, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PREVENTIVE_CHECKLIST_SUCCESS':
      return {
        ...state,
        addPreventiveChecklist: (state.addPreventiveChecklist, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PREVENTIVE_CHECKLIST_FAILURE':
      return {
        ...state,
        addPreventiveChecklist: (state.addPreventiveChecklist, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_CHECKLIST_INFO':
      return {
        ...state,
        addPreventiveChecklist: (state.addPreventiveChecklist, { loading: false, err: null, data: null }),
      };
    case 'CREATE_ACTIVITY':
      return {
        ...state,
        addActivityInfo: (state.addActivityInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_ACTIVITY_SUCCESS':
      return {
        ...state,
        addActivityInfo: (state.addActivityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_ACTIVITY_FAILURE':
      return {
        ...state,
        addActivityInfo: (state.addActivityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ADD_ACTIVITY':
      return {
        ...state,
        addActivityInfo: (state.addActivityInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ROWS_TOOLS_SELECTED':
      return {
        ...state,
        toolsSelected: (state.toolsSelected, action.payload),
      };
    case 'GET_ROWS_CHECKLIST_SELECTED':
      return {
        ...state,
        checklistSelected: (state.checklistSelected, action.payload),
      };
    case 'GET_ROWS_PARTS_SELECTED':
      return {
        ...state,
        partsSelected: (state.partsSelected, action.payload),
      };
    case 'GET_REPORTS_INFO':
      return {
        ...state,
        reports: (state.reports, { loading: true, data: null, err: null }),
      };
    case 'GET_REPORTS_INFO_SUCCESS':
      return {
        ...state,
        reports: (state.reports, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REPORTS_INFO_FAILURE':
      return {
        ...state,
        reports: (state.reports, { loading: false, err: action.error, data: null }),
      };
    case 'GET_REPORTS_RESET':
      return {
        ...state,
        reports: (state.reports, { loading: false, data: null, err: null }),
      };
    case 'GET_LOCATION':
      return {
        ...state,
        locations: (state.locations, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_SUCCESS':
      return {
        ...state,
        locations: (state.locations, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_FAILURE':
      return {
        ...state,
        locations: (state.locations, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAM_GROUP_INFO':
      return {
        ...state,
        teamGroupInfo: (state.teamGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAM_GROUP_INFO_SUCCESS':
      return {
        ...state,
        teamGroupInfo: (state.teamGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAM_GROUP_INFO_FAILURE':
      return {
        ...state,
        teamGroupInfo: (state.teamGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_VIEWER_DETAILS_INFO':
      return {
        ...state,
        ppmViewData: (state.ppmViewData, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_VIEWER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        ppmViewData: (state.ppmViewData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_VIEWER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        ppmViewData: (state.ppmViewData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_CHECKLIST_INFO':
      return {
        ...state,
        ppmCheckListData: (state.ppmCheckListData, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        ppmCheckListData: (state.ppmCheckListData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        ppmCheckListData: (state.ppmCheckListData, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        ppmCheckListData: (state.ppmCheckListData, { loading: false, data: null, err: null }),
      };
    case 'UPDATE_CHECKLIST_INFO':
      return {
        ...state,
        updateCheckLisInfo: (state.updateCheckLisInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CHECKLIST_INFO_SUCCESS':
      return {
        ...state,
        updateCheckLisInfo: (state.updateCheckLisInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CHECKLIST_INFO_FAILURE':
      return {
        ...state,
        updateCheckLisInfo: (state.updateCheckLisInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_CHECKLIST_INFO':
      return {
        ...state,
        updateCheckLisInfo: (state.updateCheckLisInfo, { loading: false, data: null, err: null }),
      };
    case 'UPDATE_ACTIVITY_INFO':
      return {
        ...state,
        updateActivityInfo: (state.updateActivityInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_ACTIVITY_INFO_SUCCESS':
      return {
        ...state,
        updateActivityInfo: (state.updateActivityInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_ACTIVITY_INFO_FAILURE':
      return {
        ...state,
        updateActivityInfo: (state.updateActivityInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_UPDATE_ACTIVITY_INFO':
      return {
        ...state,
        updateActivityInfo: (state.updateActivityInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_PPM_OPERATION_DETAIL':
      return {
        ...state,
        ppmOperationData: (state.ppmOperationData, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_OPERATION_DETAIL_SUCCESS':
      return {
        ...state,
        ppmOperationData: (state.ppmOperationData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_OPERATION_DETAIL_FAILURE':
      return {
        ...state,
        ppmOperationData: (state.ppmOperationData, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_OPERATION_INFO':
      return {
        ...state,
        updateOperationInfo: (state.updateOperationInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_OPERATION_INFO_SUCCESS':
      return {
        ...state,
        updateOperationInfo: (state.updateOperationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_OPERATION_INFO_FAILURE':
      return {
        ...state,
        updateOperationInfo: (state.updateOperationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PREVENTIVE_OPERATION_UPDATE':
      return {
        ...state,
        updateOperationInfo: (state.updateOperationInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO':
      return {
        ...state,
        taskCheckLists: (state.taskCheckLists, { loading: true, data: null, err: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        taskCheckLists: (state.taskCheckLists, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TASK_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        taskCheckLists: (state.taskCheckLists, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TASK_TOOLS_INFO':
      return {
        ...state,
        taskToolsList: (state.taskToolsList, { loading: true, data: null, err: null }),
      };
    case 'GET_TASK_TOOLS_INFO_SUCCESS':
      return {
        ...state,
        taskToolsList: (state.taskToolsList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TASK_TOOLS_INFO_FAILURE':
      return {
        ...state,
        taskToolsList: (state.taskToolsList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TASK_PARTS_INFO':
      return {
        ...state,
        taskPartsList: (state.taskPartsList, { loading: true, data: null, err: null }),
      };
    case 'GET_TASK_PARTS_INFO_SUCCESS':
      return {
        ...state,
        taskPartsList: (state.taskPartsList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TASK_PARTS_INFO_FAILURE':
      return {
        ...state,
        taskPartsList: (state.taskPartsList, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_PPM_SCHEDULER_INFO':
      return {
        ...state,
        updatePpmSchedulerInfo: (state.updatePpmSchedulerInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_PPM_SCHEDULER_INFO_SUCCESS':
      return {
        ...state,
        updatePpmSchedulerInfo: (state.updatePpmSchedulerInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_PPM_SCHEDULER_INFO_FAILURE':
      return {
        ...state,
        updatePpmSchedulerInfo: (state.updatePpmSchedulerInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_SCHEDULER_UPDATE':
      return {
        ...state,
        updatePpmSchedulerInfo: (state.updatePpmSchedulerInfo, { loading: false, data: null, err: null }),
      };
    case 'DELETE_PPM_SCHEDULER_INFO':
      return {
        ...state,
        preventiveScheduleDeleteInfo: (state.preventiveScheduleDeleteInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_PPM_SCHEDULER_INFO_SUCCESS':
      return {
        ...state,
        preventiveScheduleDeleteInfo: (state.preventiveScheduleDeleteInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_PPM_SCHEDULER_INFO_FAILURE':
      return {
        ...state,
        preventiveScheduleDeleteInfo: (state.preventiveScheduleDeleteInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_DELETE_SCHEDULE_INFO':
      return {
        ...state,
        preventiveScheduleDeleteInfo: (state.preventiveScheduleDeleteInfo, { loading: false, data: null, err: null }),
      };
    case 'PPM_REPORT':
      return {
        ...state,
        ppmReports: (state.ppmReports, { loading: true, data: null, err: null }),
      };
    case 'PPM_REPORT_SUCCESS':
      return {
        ...state,
        ppmReports: (state.ppmReports, { loading: false, data: action.payload.data, err: null }),
      };
    case 'PPM_REPORT_FAILURE':
      return {
        ...state,
        ppmReports: (state.ppmReports, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_REPORT':
      return {
        ...state,
        ppmReports: (state.ppmReports, { loading: false, data: null, err: null }),
      };
    case 'CREATE_CK_REPORT_INFO':
      return {
        ...state,
        addChecklistReport: (state.addChecklistReport, { loading: true, data: null, err: null }),
      };
    case 'CREATE_CK_REPORT_INFO_SUCCESS':
      return {
        ...state,
        addChecklistReport: (state.addChecklistReport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_CK_REPORT_INFO_FAILURE':
      return {
        ...state,
        addChecklistReport: (state.addChecklistReport, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_CK_REPORT':
      return {
        ...state,
        addChecklistReport: (state.addChecklistReport, { loading: false, err: null, data: null }),
      };
    case 'GET_CK_DETAILS_INFO':
      return {
        ...state,
        checkListReportDetail: (state.checkListReportDetail, { loading: true, data: null, err: null }),
      };
    case 'GET_CK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        checkListReportDetail: (state.checkListReportDetail, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        checkListReportDetail: (state.checkListReportDetail, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CK_DETAIL_REPORT':
      return {
        ...state,
        checkListReportDetail: (state.checkListReportDetail, { loading: false, err: null, data: null }),
      };
    case 'GET_CK_REPORT_INFO':
      return {
        ...state,
        checkListReportList: (state.checkListReportList, { loading: true, data: null, err: null }),
      };
    case 'GET_CK_REPORT_INFO_SUCCESS':
      return {
        ...state,
        checkListReportList: (state.checkListReportList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CK_REPORT_INFO_FAILURE':
      return {
        ...state,
        checkListReportList: (state.checkListReportList, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CK_REPORT':
      return {
        ...state,
        checkListReportList: (state.checkListReportList, { loading: false, err: null, data: null }),
      };
    case 'GET_HOURLY_INFO':
      return {
        ...state,
        hourlyList: (state.hourlyList, { loading: true, data: null, err: null }),
      };
    case 'GET_HOURLY_INFO_SUCCESS':
      return {
        ...state,
        hourlyList: (state.hourlyList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HOURLY_INFO_FAILURE':
      return {
        ...state,
        hourlyList: (state.hourlyList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INSP_DASHBOARD_INFO':
      return {
        ...state,
        inspectionDashboard: (state.inspectionDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_INSP_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        inspectionDashboard: (state.inspectionDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INSP_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        inspectionDashboard: (state.inspectionDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INSP_PARANT_INFO':
      return {
        ...state,
        ppmParentSchdulers: (state.ppmParentSchdulers, { loading: true, data: null, err: null }),
      };
    case 'GET_INSP_PARANT_INFO_SUCCESS':
      return {
        ...state,
        ppmParentSchdulers: (state.ppmParentSchdulers, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INSP_PARANT_INFO_FAILURE':
      return {
        ...state,
        ppmParentSchdulers: (state.ppmParentSchdulers, { loading: false, err: action.error, data: null }),
      };
    case 'CLEAR_INSP_WO_INFO':
      return {
        ...state,
        inspectionOrders: {},
      };
    case 'GET_INSP_WO_INFO':
      return {
        ...state,
        inspectionOrders: (state.inspectionOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_INSP_WO_INFO_SUCCESS':
      return {
        ...state,
        inspectionOrders: (state.inspectionOrders, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INSP_WO_INFO_FAILURE':
      return {
        ...state,
        inspectionOrders: (state.inspectionOrders, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_INSP_WO_INFO':
      return {
        ...state,
        inspectionOrders: (state.inspectionOrders, { loading: false, data: null, err: null }),
      };
    case 'GET_PPM_WO_INFO':
      return {
        ...state,
        preventiveChecklistOrders: (state.preventiveChecklistOrders, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_WO_INFO_SUCCESS':
      return {
        ...state,
        preventiveChecklistOrders: (state.preventiveChecklistOrders, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_PPM_WO_INFO_FAILURE':
      return {
        ...state,
        preventiveChecklistOrders: (state.preventiveChecklistOrders, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_WO_INFO':
      return {
        ...state,
        preventiveChecklistOrders: (state.preventiveChecklistOrders, { loading: false, data: null, err: null }),
      };
    case 'SET_DASHBOARD_DATE_INFO':
      return {
        ...state,
        inspectionDashboardDate: (state.spacesSelectedList, { data: action.payload }),
      };
    case 'GET_INSP_TEAMS_DASHBOARD_INFO':
      return {
        ...state,
        inspectionTeamsDashboard: (state.inspectionTeamsDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_INSP_TEAMS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        inspectionTeamsDashboard: (state.inspectionTeamsDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INSP_TEAMS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        inspectionTeamsDashboard: (state.inspectionTeamsDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_GROUP_INFO':
      return {
        ...state,
        checklistGroup: (state.checklistGroup, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_GROUP_INFO_SUCCESS':
      return {
        ...state,
        checklistGroup: (state.checklistGroup, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_GROUP_INFO_FAILURE':
      return {
        ...state,
        checklistGroup: (state.checklistGroup, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PARENT_SCHEDULE_INFO':
      return {
        ...state,
        parentScheduleInfo: (state.parentScheduleInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PARENT_SCHEDULE_INFO_SUCCESS':
      return {
        ...state,
        parentScheduleInfo: (state.parentScheduleInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARENT_SCHEDULE_INFO_FAILURE':
      return {
        ...state,
        parentScheduleInfo: (state.parentScheduleInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEE_CHECKLISTS_INFO':
      return {
        ...state,
        employeeChecklists: (state.employeeChecklists, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEE_CHECKLISTS_INFO_SUCCESS':
      return {
        ...state,
        employeeChecklists: (state.employeeChecklists, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EMPLOYEE_CHECKLISTS_INFO_FAILURE':
      return {
        ...state,
        employeeChecklists: (state.employeeChecklists, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EMPLOYEE_CHECKLISTS_INFO':
      return {
        ...state,
        employeeChecklists: (state.employeeChecklists, { loading: false, data: null, err: null }),
      };
    case 'GET_INSP_EMP_INFO':
      return {
        ...state,
        inspectionEmployees: (state.inspectionEmployees, { loading: true, data: null, err: null }),
      };
    case 'GET_INSP_EMP_INFO_SUCCESS':
      return {
        ...state,
        inspectionEmployees: (state.inspectionEmployees, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_INSP_EMP_INFO_FAILURE':
      return {
        ...state,
        inspectionEmployees: (state.inspectionEmployees, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_INSP_EMP_INFO':
      return {
        ...state,
        inspectionEmployees: (state.inspectionEmployees, { loading: false, data: null, err: null }),
      };
    case 'GET_EMP_GROUP_INFO':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EMP_GROUP_INFO_SUCCESS':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EMP_GROUP_INFO_FAILURE':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_GROUP_EMP_INFO':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_SCHEDULE_INFO':
      return {
        ...state,
        scheduleInfo: (state.scheduleInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SCHEDULE_INFO_SUCCESS':
      return {
        ...state,
        scheduleInfo: (state.scheduleInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SCHEDULE_INFO_FAILURE':
      return {
        ...state,
        scheduleInfo: (state.scheduleInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PSR_INFO':
      return {
        ...state,
        ppmStatusInfo: (state.ppmStatusInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PSR_INFO_SUCCESS':
      return {
        ...state,
        ppmStatusInfo: (state.ppmStatusInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PSR_INFO_FAILURE':
      return {
        ...state,
        ppmStatusInfo: (state.ppmStatusInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PSR_INFO':
      return {
        ...state,
        ppmStatusInfo: (state.ppmStatusInfo, { loading: false, data: null, err: null }),
      };
    case 'RESET_PARTSSELECTED_INFO':
      return {
        ...state,
        partsSelected: (state.partsSelected, { loading: false, err: null, data: null }),
      };
    case 'GET_PPM_CHECKLIST_GROUP_EXPORT_INFO':
      return {
        ...state,
        ppmChecklistExportInfo: (state.ppmChecklistExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_CHECKLIST_GROUP_INFO_EXPORT_SUCCESS':
      return {
        ...state,
        ppmChecklistExportInfo: (state.ppmChecklistExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_CHECKLIST_GROUP_INFO_EXPORT_FAILURE':
      return {
        ...state,
        ppmChecklistExportInfo: (state.ppmChecklistExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_CHECKLIST_GROUP_INFO_EXPORT':
      return {
        ...state,
        ppmChecklistExportInfo: (state.ppmChecklistExportInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_CHOICE_INFO':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHOICE_INFO_SUCCESS':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHOICE_INFO_FAILURE':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_OPTIONS_INFO':
      return {
        ...state,
        choiceOptionInfo: (state.choiceOptionInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_GP_ASSETS_INFO':
      return {
        ...state,
        gatePassAssets: (state.gatePassAssets, { loading: true, data: null, err: null }),
      };
    case 'GET_GP_ASSETS_INFO_SUCCESS':
      return {
        ...state,
        gatePassAssets: (state.gatePassAssets, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_GP_ASSETS_INFO_FAILURE':
      return {
        ...state,
        gatePassAssets: (state.gatePassAssets, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_PRODUCTS_INFO':
      return {
        ...state,
        locationProducts: (state.locationProducts, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_INFO_SUCCESS':
      return {
        ...state,
        locationProducts: (state.locationProducts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_INFO_FAILURE':
      return {
        ...state,
        locationProducts: (state.locationProducts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_PRODUCTS_HIDE_INFO':
      return {
        ...state,
        locationProductsHide: (state.locationProductsHide, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_HIDE_INFO_SUCCESS':
      return {
        ...state,
        locationProductsHide: (state.locationProductsHide, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_HIDE_INFO_FAILURE':
      return {
        ...state,
        locationProductsHide: (state.locationProductsHide, { loading: false, err: action.error, data: null }),
      };
    case 'GET_LOCATION_PRODUCTS_COUNT_INFO':
      return {
        ...state,
        locationProductsCount: (state.locationProductsCount, { loading: true, data: null, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        locationProductsCount: (state.locationProductsCount, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_LOCATION_PRODUCTS_COUNT_INFO_FAILURE':
      return {
        ...state,
        locationProductsCount: (state.locationProductsCount, { loading: false, err: action.error, data: null }),
      };
    case 'ACTIVE_STEP_INFO':
      return {
        ...state,
        activeStep: (state.activeStep, action.payload),
      };
    case 'GET_EA_INFO':
      return {
        ...state,
        inspectionassetSpaceInfo: (state.inspectionassetSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EA_INFO_SUCCESS':
      return {
        ...state,
        inspectionassetSpaceInfo: (state.inspectionassetSpaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EA_INFO_FAILURE':
      return {
        ...state,
        inspectionassetSpaceInfo: (state.inspectionassetSpaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EAP_INFO':
      return {
        ...state,
        ppmassetSpaceInfo: (state.ppmassetSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EAP_INFO_SUCCESS':
      return {
        ...state,
        ppmassetSpaceInfo: (state.ppmassetSpaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EAP_INFO_FAILURE':
      return {
        ...state,
        ppmassetSpaceInfo: (state.ppmassetSpaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SAP_INFO':
      return {
        ...state,
        ppmSpaceInfo: (state.ppmSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_SAP_INFO_SUCCESS':
      return {
        ...state,
        ppmSpaceInfo: (state.ppmSpaceInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SAP_INFO_FAILURE':
      return {
        ...state,
        ppmSpaceInfo: (state.ppmSpaceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ICR_REPORT':
      return {
        ...state,
        inspectionassetSpaceInfo: (state.inspectionassetSpaceInfo, { loading: false, data: null, err: null }),
      };
    case 'RESET_PPMR_REPORT':
      return {
        ...state,
        ppmassetSpaceInfo: (state.ppmassetSpaceInfo, { loading: false, data: null, err: null }),
        ppmSpaceInfo: (state.ppmSpaceInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_CK_LISTS_INFO':
      return {
        ...state,
        checkListsJson: (state.checkListsJson, { loading: true, data: null, err: null }),
      };
    case 'GET_CK_LISTS_INFO_SUCCESS':
      return {
        ...state,
        checkListsJson: (state.checkListsJson, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CK_LISTS_INFO_FAILURE':
      return {
        ...state,
        checkListsJson: (state.checkListsJson, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_VENDOR_REPORT_INFO':
      return {
        ...state,
        ppmVendorInfo: (state.ppmVendorInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_VENDOR_REPORT_INFO_SUCCESS':
      return {
        ...state,
        ppmVendorInfo: (state.ppmVendorInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_VENDOR_REPORT_INFO_FAILURE':
      return {
        ...state,
        ppmVendorInfo: (state.ppmVendorInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_VENDOR_REPORT':
      return {
        ...state,
        ppmVendorInfo: (state.ppmVendorInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_CHILD_ASSETS_INFO':
      return {
        ...state,
        assetChildsInfo: (state.assetChildsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHILD_ASSETS_INFO_SUCCESS':
      return {
        ...state,
        assetChildsInfo: (state.assetChildsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHILD_ASSETS_INFO_FAILURE':
      return {
        ...state,
        assetChildsInfo: (state.assetChildsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHILD_ASSETS_NOINFO':
      return {
        ...state,
        assetInnerChirldsInfo: (state.assetInnerChirldsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHILD_ASSETS_NOINFO_SUCCESS':
      return {
        ...state,
        assetInnerChirldsInfo: (state.assetInnerChirldsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHILD_ASSETS_NOINFO_FAILURE':
      return {
        ...state,
        assetInnerChirldsInfo: (state.assetInnerChirldsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WAREHOUSE_LAST_UPDATE_INFO':
      return {
        ...state,
        warehouseLastUpdate: (state.warehouseLastUpdate, { loading: true, data: null, err: null }),
      };
    case 'GET_WAREHOUSE_LAST_UPDATE_INFO_SUCCESS':
      return {
        ...state,
        warehouseLastUpdate: (state.warehouseLastUpdate, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WAREHOUSE_LAST_UPDATE_INFO_FAILURE':
      return {
        ...state,
        warehouseLastUpdate: (state.warehouseLastUpdate, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WP_TASK_DETAILS_INFO':
      return {
        ...state,
        checklistQuestionList: (state.checklistQuestionList, { loading: true, data: null, err: null }),
      };
    case 'GET_WP_TASK_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        checklistQuestionList: (state.checklistQuestionList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WP_TASK_DETAILS_INFO_FAILURE':
      return {
        ...state,
        checklistQuestionList: (state.checklistQuestionList, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CHECKLIST_QUESTION':
      return {
        ...state,
        checklistQuestionList: (state.checklistQuestionList, { loading: false, data: null, err: null }),
      };
    case 'GET_PPM_LOGS_INFO':
      return {
        ...state,
        ppmStatusLogs: (state.ppmStatusLogs, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_LOGS_INFO_SUCCESS':
      return {
        ...state,
        ppmStatusLogs: (state.ppmStatusLogs, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_LOGS_INFO_FAILURE':
      return {
        ...state,
        ppmStatusLogs: (state.ppmStatusLogs, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_YEARLY_REPORT_INFO':
      return {
        ...state,
        ppmYearlyReport: (state.ppmYearlyReport, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_YEARLY_REPORT_INFO_SUCCESS':
      return {
        ...state,
        ppmYearlyReport: (state.ppmYearlyReport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_YEARLY_REPORT_INFO_FAILURE':
      return {
        ...state,
        ppmYearlyReport: (state.ppmYearlyReport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_YEAR_EXPORT_LINK_INFO':
      return {
        ...state,
        ppmYearlyExport: (state.ppmYearlyExport, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_YEAR_EXPORT_LINK_INFO_SUCCESS':
      return {
        ...state,
        ppmYearlyExport: (state.ppmYearlyExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_YEAR_EXPORT_LINK_INFO_FAILURE':
      return {
        ...state,
        ppmYearlyExport: (state.ppmYearlyExport, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PPM_YEARLY_REPORT_INFO':
      return {
        ...state,
        ppmYearlyExport: (state.ppmYearlyExport, { loading: false, err: null, data: null }),
        ppmYearlyReport: (state.ppmYearlyReport, { loading: false, err: null, data: null }),
      };
    case 'GET_PPM_VENDOR_GROUP_INFO':
      return {
        ...state,
        externalVendorGroups: (state.externalVendorGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_VENDOR_GROUP_INFO_SUCCESS':
      return {
        ...state,
        externalVendorGroups: (state.externalVendorGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_VENDOR_GROUP_INFO_FAILURE':
      return {
        ...state,
        externalVendorGroups: (state.externalVendorGroups, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PPM_WEEK_GROUP_INFO':
      return {
        ...state,
        externalWeekGroups: (state.externalWeekGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_PPM_WEEK_GROUP_INFO_SUCCESS':
      return {
        ...state,
        externalWeekGroups: (state.externalWeekGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PPM_WEEK_GROUP_INFO_FAILURE':
      return {
        ...state,
        externalWeekGroups: (state.externalWeekGroups, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXTERNAL_PPM_LINK_INFO':
      return {
        ...state,
        externalVendorLink: (state.externalVendorLink, { loading: true, data: null, err: null }),
      };
    case 'GET_EXTERNAL_PPM_LINK_INFO_SUCCESS':
      return {
        ...state,
        externalVendorLink: (state.externalVendorLink, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXTERNAL_PPM_LINK_INFO_FAILURE':
      return {
        ...state,
        externalVendorLink: (state.externalVendorLink, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_EXTERNAL_PPM_LINK_INFO':
      return {
        ...state,
        externalVendorLink: (state.externalVendorLink, { loading: false, err: null, data: null }),
      };
    case 'CREATE_BULK_PREVENTIVE_INFO':
      return {
        ...state,
        bulkPPMCreate: (state.bulkPPMCreate, { loading: true, data: null, err: null }),
      };
    case 'CREATE_BULK_PREVENTIVE_INFO_SUCCESS':
      return {
        ...state,
        bulkPPMCreate: (state.bulkPPMCreate, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_BULK_PREVENTIVE_INFO_FAILURE':
      return {
        ...state,
        bulkPPMCreate: (state.bulkPPMCreate, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_BULK_PREVENTIVE_INFO':
      return {
        ...state,
        bulkPPMCreate: (state.bulkPPMCreate, { loading: false, err: null, data: null }),
      };
    case 'GET_DR_INFO':
      return {
        ...state,
        downloadRequestInfo: (state.downloadRequestInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_DR_INFO_SUCCESS':
      return {
        ...state,
        downloadRequestInfo: (state.downloadRequestInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DR_INFO_FAILURE':
      return {
        ...state,
        downloadRequestInfo: (state.downloadRequestInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DR_RESET':
      return {
        ...state,
        downloadRequestInfo: (state.downloadRequestInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_DR_COUNT':
      return {
        ...state,
        downloadRequestCount: (state.downloadRequestCount, { loading: true, data: null, err: null }),
      };
    case 'GET_DR_COUNT_SUCCESS':
      return {
        ...state,
        downloadRequestCount: (state.downloadRequestCount, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_DR_COUNT_FAILURE':
      return {
        ...state,
        downloadRequestCount: (state.downloadRequestCount, { loading: false, err: action.error, data: null }),
      };
    case 'GET_DRI_INFO':
      return {
        ...state,
        downloadRequestDetails: (state.downloadRequestDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_DRI_INFO_SUCCESS':
      return {
        ...state,
        downloadRequestDetails: (state.downloadRequestDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DRI_INFO_FAILURE':
      return {
        ...state,
        downloadRequestDetails: (state.downloadRequestDetails, { loading: false, err: action.error, data: null }),
      };
      case 'RESET_DRI':
        return {
          ...state,
          downloadRequestDetails: (state.downloadRequestDetails, { loading: false, data: null, err: null }),
        };
        case 'GET_DRF_INFO':
      return {
        ...state,
        downloadRequestSingleData: (state.downloadRequestSingleData, { loading: true, data: null, err: null }),
      };
    case 'GET_DRF_INFO_SUCCESS':
      return {
        ...state,
        downloadRequestSingleData: (state.downloadRequestSingleData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_DRF_INFO_FAILURE':
      return {
        ...state,
        downloadRequestSingleData: (state.downloadRequestSingleData, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MT_INFO':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MT_INFO_SUCCESS':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MT_INFO_FAILURE':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_MT':
      return {
        ...state,
        teamInfo: (state.teamInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_HXPPM_DETAILS_INFO':
      return {
        ...state,
        hxPpmDetails: (state.hxPpmDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_HXPPM_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        hxPpmDetails: (state.hxPpmDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HXPPM_DETAILS_INFO_FAILURE':
      return {
        ...state,
        hxPpmDetails: (state.hxPpmDetails, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_CANCEL_PPM_INFO':
      return {
        ...state,
        hxCreatePpmCancelRequest: (state.hxCreatePpmCancelRequest, { loading: true, data: null, err: null }),
      };
    case 'CREATE_CANCEL_PPM_INFO_SUCCESS':
      return {
        ...state,
        hxCreatePpmCancelRequest: (state.hxCreatePpmCancelRequest, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_CANCEL_PPM_INFO_FAILURE':
      return {
        ...state,
        hxCreatePpmCancelRequest: (state.hxCreatePpmCancelRequest, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_CANCEL_PPM_INFO':
      return {
        ...state,
        hxUpdatePpmCancelRequest: (state.hxUpdatePpmCancelRequest, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CANCEL_PPM_INFO_SUCCESS':
      return {
        ...state,
        hxUpdatePpmCancelRequest: (state.hxUpdatePpmCancelRequest, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CANCEL_PPM_INFO_FAILURE':
      return {
        ...state,
        hxUpdatePpmCancelRequest: (state.hxUpdatePpmCancelRequest, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CANCEL_PPM_INFO':
      return {
        ...state,
        hxUpdatePpmCancelRequest: (state.hxUpdatePpmCancelRequest, { loading: false, data: null, err: null }),
        hxCreatePpmCancelRequest: (state.hxCreatePpmCancelRequest, { loading: false, data: null, err: null }),
      };
    case 'GET_HXPPM_CANCEL_DETAILS_INFO':
      return {
        ...state,
        hxPpmCancelDetails: (state.hxPpmCancelDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_HXPPM_CANCEL_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        hxPpmCancelDetails: (state.hxPpmCancelDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HXPPM_CANCEL_DETAILS_INFO_FAILURE':
      return {
        ...state,
        hxPpmCancelDetails: (state.hxPpmCancelDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_LIST_INFO':
      return {
        ...state,
        hxPPMCancelList: (state.hxPPMCancelList, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_LIST_INFO_SUCCESS':
      return {
        ...state,
        hxPPMCancelList: (state.hxPPMCancelList, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_LIST_INFO_FAILURE':
      return {
        ...state,
        hxPPMCancelList: (state.hxPPMCancelList, { loading: false, err: action.error, data: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_EXPORT_INFO':
      return {
        ...state,
        hxPPMCancelExport: (state.hxPPMCancelExport, { loading: true, data: null, err: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        hxPPMCancelExport: (state.hxPPMCancelExport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        hxPPMCancelExport: (state.hxPPMCancelExport, { loading: false, err: action.error, data: null }),
      };
    case 'HX_PPM_CANCEL_FILTERS':
      return {
        ...state,
        hxPPMCancelFilters: (state.hxPPMCancelFilters, action.payload),
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_COUNT_INFO':
      return {
        ...state,
        hxPPMCancelCount: null,
        hxPPMCancelCountErr: null,
        hxPPMCancelCountLoading: true,
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_COUNT_INFO_SUCCESS':
      return {
        ...state,
        hxPPMCancelCount: (state.hxPPMCancelCount, action.payload),
        hxPPMCancelCountErr: null,
        hxPPMCancelCountLoading: false,
      };
    case 'GET_HX_PPM_CANCEL_REQUESTS_COUNT_INFO_FAILURE':
      return {
        ...state,
        hxPPMCancelCountErr: (state.hxPPMCancelCountErr, action.error),
        hxPPMCancelCount: null,
        hxPPMCancelCountLoading: false,
      };
      case 'GET_RPPM_INFO':
      return {
        ...state,
        resumePPMInfo: (state.resumePPMInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_RPPM_INFO_SUCCESS':
      return {
        ...state,
        resumePPMInfo: (state.resumePPMInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RPPM_INFO_FAILURE':
      return {
        ...state,
        resumePPMInfo: (state.resumePPMInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_RPPM_INFO':
      return {
        ...state,
        resumePPMInfo: (state.resumePPMInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_RI_INFO':
      return {
        ...state,
        resumeInspectionInfo: (state.resumeInspectionInfo, { loading: true, err: null, data: null }),
      };
    case 'GET_RI_INFO_SUCCESS':
      return {
        ...state,
        resumeInspectionInfo: (state.resumeInspectionInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_RI_INFO_FAILURE':
      return {
        ...state,
        resumeInspectionInfo: (state.resumeInspectionInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_RI_INFO':
      return {
        ...state,
        resumeInspectionInfo: (state.resumeInspectionInfo, { loading: false, err: null, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
