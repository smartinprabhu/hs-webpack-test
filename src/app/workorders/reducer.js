const initialState = {
  createCommentInfo: {},
  orderComments: {},
  orderParts: {},
  orderTools: {},
  orderCheckLists: {},
  orderTimeSheets: {},
  priorityGroupsInfo: {},
  stateGroupsInfo: {},
  stateChangeInfo: {},
  teamGroupsInfo: {},
  workordersInfo: {},
  workorderCount: null,
  workorderCountErr: null,
  workorderCountLoading: false,
  workorderDetails: {},
  workordersExportInfo: {},
  workorderFilters: {},
  workorderDashboard: {},
  inventoryParts: {},
  woRows: {},
  addedPartsRows: {},
  createPartsOrderInfo: {},
  createInventoryInfo: {},
  deletePartsInfo: {},
  updatePartsOrderInfo: {},
  stockOrderInfo: {},
  reassignTeamInfo: {},
  updateChecklist: {},
  listDataInfo: {},
  listDataCountInfo: {},
  listDataCountLoading: {},
  removeChecklist: {},
  suggestedValueRows: {},
  suggestedValues: {},
  actionResultInfo: {},
  createDurationInfo: {},
  pauseReasons: {},
  slaEvalutionReport: {},
  maintenanceTypeGroupsInfo: {},
  typeGroupsInfo: {},
  createTimesheetInfo: {},
  employeeMembers: {},
  employeePerformanceReport: {},
  employeeGroupInfo: {},
  checklistOpInfo: {},
  workOrderChecklist: {},
  updatePartsOrderNoLoadInfo: {},
  ppmOnholdData: {},
  ppmOnholdRequest: {},
  woUpdateLoading: false,
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'GET_WORK_ORDERS_INFO':
      return {
        ...state,
        workordersInfo: (state.workordersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WORK_ORDERS_INFO_SUCCESS':
      return {
        ...state,
        workordersInfo: (state.workordersInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORK_ORDERS_INFO_FAILURE':
      return {
        ...state,
        workordersInfo: (state.workordersInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WO_NO_STATE_CHANGE_INFO':
      return {
        ...state,
        woUpdateLoading: true,
      };
    case 'GET_WO_NO_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        woUpdateLoading: false,
      };
    case 'GET_WO_NO_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        woUpdateLoading: false,
      };
    case 'GET_WORK_ORDERS_COUNT':
      return {
        ...state,
        workorderCount: null,
        workorderCountErr: null,
        workorderCountLoading: true,
      };
    case 'GET_WORK_ORDERS_COUNT_SUCCESS':
      return {
        ...state,
        workorderCount: (state.workorderCount, action.payload),
        workorderCountErr: null,
        workorderCountLoading: false,
      };
    case 'GET_WORK_ORDERS_COUNT_FAILURE':
      return {
        ...state,
        workorderCount: null,
        workorderCountErr: (state.workorderCountErr, action.error),
        workorderCountLoading: false,
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO':
      return {
        ...state,
        workordersExportInfo: (state.workordersExportInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        workordersExportInfo: (state.workordersExportInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        workordersExportInfo: (state.workordersExportInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAMS_GROUP_INFO':
      return {
        ...state,
        teamGroupsInfo: (state.teamGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAMS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        teamGroupsInfo: (state.teamGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAMS_GROUP_INFO_FAILURE':
      return {
        ...state,
        teamGroupsInfo: (state.teamGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATES_GROUP_INFO':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STATES_GROUP_INFO_FAILURE':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PRIORITIES_GROUP_INFO_FAILURE':
      return {
        ...state,
        priorityGroupsInfo: (state.priorityGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAINTENANCE_TYPE_GROUP_INFO':
      return {
        ...state,
        maintenanceTypeGroupsInfo: (state.maintenanceTypeGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_TYPE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        maintenanceTypeGroupsInfo: (state.maintenanceTypeGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_TYPE_GROUP_INFO_FAILURE':
      return {
        ...state,
        maintenanceTypeGroupsInfo: (state.maintenanceTypeGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_TYPE_GROUP_INFO':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TYPE_GROUP_INFO_SUCCESS':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TYPE_GROUP_INFO_FAILURE':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ORDER_DETAILS_INFO':
      return {
        ...state,
        workorderDetails: (state.workorderDetails, { loading: true, data: null, err: null }),
      };
    case 'GET_ORDER_DETAILS_INFO_SUCCESS':
      return {
        ...state,
        workorderDetails: (state.workorderDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ORDER_DETAILS_INFO_FAILURE':
      return {
        ...state,
        workorderDetails: (state.workorderDetails, { loading: false, err: action.error, data: null }),
      };
    case 'GET_COMMENTS_INFO':
      return {
        ...state,
        orderComments: (state.orderComments, { loading: true, data: null, err: null }),
      };
    case 'GET_COMMENTS_INFO_SUCCESS':
      return {
        ...state,
        orderComments: (state.orderComments, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_COMMENTS_INFO_FAILURE':
      return {
        ...state,
        orderComments: (state.orderComments, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_COMMENTS_INFO':
      return {
        ...state,
        createCommentInfo: (state.createCommentInfo, { loading: false, err: null, data: null }),
      };
    case 'CREATE_COMMENT_INFO':
      return {
        ...state,
        createCommentInfo: (state.createCommentInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_COMMENT_INFO_SUCCESS':
      return {
        ...state,
        createCommentInfo: (state.createCommentInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_COMMENT_INFO_FAILURE':
      return {
        ...state,
        createCommentInfo: (state.createCommentInfo, { loading: false, err: action.error, data: null }),
      };
    case 'SLA_REPORT':
      return {
        ...state,
        slaEvalutionReport: (state.slaEvalutionReport, { loading: true, data: null, err: null }),
      };
    case 'SLA_REPORT_SUCCESS':
      return {
        ...state,
        slaEvalutionReport: (state.slaEvalutionReport, { loading: false, data: action.payload.data, err: null }),
      };
    case 'SLA_REPORT_FAILURE':
      return {
        ...state,
        slaEvalutionReport: (state.slaEvalutionReport, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WO_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WO_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WO_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: null, err: null }),
      };
    case 'REMOVE_CHECKLIST_ANSWER_INFO':
      return {
        ...state,
        removeChecklist: (state.removeChecklist, { loading: true, data: null, err: null }),
      };
    case 'REMOVE_CHECKLIST_ANSWER_INFO_SUCCESS':
      return {
        ...state,
        removeChecklist: (state.removeChecklist, { loading: false, data: action.payload.data, err: null }),
      };
    case 'REMOVE_CHECKLIST_ANSWER_INFO_FAILURE':
      return {
        ...state,
        removeChecklist: (state.removeChecklist, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_REMOVE_CHECKLIST_ANSWER_INFO':
      return {
        ...state,
        removeChecklist: (state.removeChecklist, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_CHECKLIST_ANSWER_INFO':
      return {
        ...state,
        updateChecklist: (state.updateChecklist, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_CHECKLIST_ANSWER_INFO_SUCCESS':
      return {
        ...state,
        updateChecklist: (state.updateChecklist, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_CHECKLIST_ANSWER_INFO_FAILURE':
      return {
        ...state,
        updateChecklist: (state.updateChecklist, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CHECKLIST_ANSWER_INFO':
      return {
        ...state,
        updateChecklist: (state.updateChecklist, { loading: false, err: null, data: null }),
      };
    case 'GET_EXTRA_LIST_INFO':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_EXTRA_LIST_INFO_SUCCESS':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EXTRA_LIST_INFO_FAILURE':
      return {
        ...state,
        listDataInfo: (state.listDataInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EXTRA_COUNT_INFO':
      return {
        ...state,
        listDataCountLoading: true,
      };
    case 'GET_EXTRA_COUNT_INFO_SUCCESS':
      return {
        ...state,
        listDataCountInfo: (state.listDataCountInfo, action.payload),
        listDataCountLoading: false,
      };
    case 'GET_EXTRA_COUNT_INFO_FAILURE':
      return {
        ...state,
        listDataCountErr: (state.listDataCountErr, action.error),
        listDataCountLoading: false,
      };
    case 'GET_SUGGESTED_VALUE_INFO':
      return {
        ...state,
        suggestedValues: (state.suggestedValues, { loading: true, data: null, err: null }),
      };
    case 'GET_SUGGESTED_VALUE_INFO_SUCCESS':
      return {
        ...state,
        suggestedValues: (state.suggestedValues, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_SUGGESTED_VALUE_INFO_FAILURE':
      return {
        ...state,
        suggestedValues: (state.suggestedValues, { loading: false, err: action.error, data: null }),
      };
    case 'GET_SUGGESTED_VALUE_ROWS':
      return {
        ...state,
        suggestedValueRows: (state.suggestedValueRows, action.payload),
      };
    case 'GET_SUGGESTED_VALUE_ROWS_RESET':
      return {
        ...state,
        suggestedValueRows: (state.suggestedValueRows, {}),
      };
    case 'GET_WORKORDERS_DASHBOARD_INFO':
      return {
        ...state,
        workorderDashboard: (state.workorderDashboard, { loading: true, data: null, err: null }),
      };
    case 'GET_WORKORDERS_DASHBOARD_INFO_SUCCESS':
      return {
        ...state,
        workorderDashboard: (state.workorderDashboard, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORKORDERS_DASHBOARD_INFO_FAILURE':
      return {
        ...state,
        workorderDashboard: (state.workorderDashboard, { loading: false, err: action.error, data: null }),
      };
    case 'GET_PARTS_INFO':
      return {
        ...state,
        orderParts: (state.orderParts, { loading: true, data: null, err: null }),
      };
    case 'GET_PARTS_INFO_SUCCESS':
      return {
        ...state,
        orderParts: (state.orderParts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PARTS_INFO_FAILURE':
      return {
        ...state,
        orderParts: (state.orderParts, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECK_LISTS_INFO':
      return {
        ...state,
        orderCheckLists: (state.orderCheckLists, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECK_LISTS_INFO_SUCCESS':
      return {
        ...state,
        orderCheckLists: (state.orderCheckLists, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECK_LISTS_INFO_FAILURE':
      return {
        ...state,
        orderCheckLists: (state.orderCheckLists, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_GET_CHECK_LISTS_INFO':
      return {
        ...state,
        orderCheckLists: (state.orderCheckLists, { loading: false, err: null, data: null }),
      };
    case 'GET_TIMESHEETS_INFO':
      return {
        ...state,
        orderTimeSheets: (state.orderTimeSheets, { loading: true, data: null, err: null }),
      };
    case 'GET_TIMESHEETS_INFO_SUCCESS':
      return {
        ...state,
        orderTimeSheets: (state.orderTimeSheets, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TIMESHEETS_INFO_FAILURE':
      return {
        ...state,
        orderTimeSheets: (state.orderTimeSheets, { loading: false, err: action.error, data: null }),
      };
    case 'GET_FILTER_WORKORDER':
      return {
        ...state,
        workorderFilters: (state.workorderFilters, action.payload),
      };
    case 'GET_ROWS_WO':
      return {
        ...state,
        woRows: (state.woRows, action.payload),
      };
    case 'GET_ORDER_TOOLS_INFO':
      return {
        ...state,
        orderTools: (state.orderTools, { loading: true, data: null, err: null }),
      };
    case 'GET_ORDER_TOOLS_INFO_SUCCESS':
      return {
        ...state,
        orderTools: (state.orderTools, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ORDER_TOOLS_INFO_FAILURE':
      return {
        ...state,
        orderTools: (state.orderTools, { loading: false, err: action.error, data: null }),
      };
    case 'GET_INVENTORY_INFO':
      return {
        ...state,
        inventoryParts: (state.inventoryParts, { loading: true, data: null, err: null }),
      };
    case 'GET_INVENTORY_INFO_SUCCESS':
      return {
        ...state,
        inventoryParts: (state.inventoryParts, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_INVENTORY_INFO_FAILURE':
      return {
        ...state,
        inventoryParts: (state.inventoryParts, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_PART_INFO':
      return {
        ...state,
        createPartsOrderInfo: (state.createPartsOrderInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_PART_INFO_SUCCESS':
      return {
        ...state,
        createPartsOrderInfo: (state.createPartsOrderInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_PART_INFO_FAILURE':
      return {
        ...state,
        createPartsOrderInfo: (state.createPartsOrderInfo, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_INVENTORY_INFO':
      return {
        ...state,
        createInventoryInfo: (state.createInventoryInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_INVENTORY_INFO_SUCCESS':
      return {
        ...state,
        createInventoryInfo: (state.createInventoryInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_INVENTORY_INFO_FAILURE':
      return {
        ...state,
        createInventoryInfo: (state.createInventoryInfo, { loading: false, err: action.error, data: null }),
      };
    case 'DELETE_PART_INFO':
      return {
        ...state,
        deletePartsInfo: (state.deletePartsInfo, { loading: true, data: null, err: null }),
      };
    case 'DELETE_PART_INFO_SUCCESS':
      return {
        ...state,
        deletePartsInfo: (state.deletePartsInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_PART_INFO_FAILURE':
      return {
        ...state,
        deletePartsInfo: (state.deletePartsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_PART_INFO':
      return {
        ...state,
        updatePartsOrderInfo: (state.updatePartsOrderInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_PART_INFO_SUCCESS':
      return {
        ...state,
        updatePartsOrderInfo: (state.updatePartsOrderInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_PART_INFO_FAILURE':
      return {
        ...state,
        updatePartsOrderInfo: (state.updatePartsOrderInfo, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_PART_NO_LOAD_INFO':
      return {
        ...state,
        updatePartsOrderNoLoadInfo: (state.updatePartsOrderNoLoadInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_PART_NO_LOAD_INFO_SUCCESS':
      return {
        ...state,
        updatePartsOrderNoLoadInfo: (state.updatePartsOrderNoLoadInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_PART_NO_LOAD_INFO_FAILURE':
      return {
        ...state,
        updatePartsOrderNoLoadInfo: (state.updatePartsOrderNoLoadInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_PART_NO_LOAD':
      return {
        ...state,
        updatePartsOrderNoLoadInfo: (state.updatePartsOrderNoLoadInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_STOCK_INFO':
      return {
        ...state,
        stockOrderInfo: (state.stockOrderInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STOCK_INFO_SUCCESS':
      return {
        ...state,
        stockOrderInfo: (state.stockOrderInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STOCK_INFO_FAILURE':
      return {
        ...state,
        stockOrderInfo: (state.stockOrderInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ROWS_ADDED_PARTS':
      return {
        ...state,
        addedPartsRows: (state.addedPartsRows, action.payload),
      };
    case 'RESET_ROWS_ADDED_PARTS':
      return {
        ...state,
        addedPartsRows: (state.addedPartsRows, { loading: false, err: null, data: null }),
      };
    case 'RESET_ROWS_UPDATE_PARTS':
      return {
        ...state,
        updatePartsOrderInfo: (state.updatePartsOrderInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_ROWS_ADD_PARTS':
      return {
        ...state,
        createPartsOrderInfo: (state.createPartsOrderInfo, { loading: false, err: null, data: null }),
      };
    case 'RESET_DELETE_PARTS':
      return {
        ...state,
        deletePartsInfo: (state.deletePartsInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_REASSIGN_TEAM_INFO':
      return {
        ...state,
        reassignTeamInfo: (state.reassignTeamInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_REASSIGN_TEAM_INFO_SUCCESS':
      return {
        ...state,
        reassignTeamInfo: (state.reassignTeamInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_REASSIGN_TEAM_INFO_FAILURE':
      return {
        ...state,
        reassignTeamInfo: (state.reassignTeamInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ORDER_OPERATION_INFO':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ORDER_OPERATION_INFO_SUCCESS':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, data: action.payload, err: null }),
      };
    case 'GET_ORDER_OPERATION_INFO_FAILURE':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ORDER_OPERATION_INFO':
      return {
        ...state,
        actionResultInfo: (state.actionResultInfo, { loading: false, data: null, err: null }),
      };
    case 'CREATE_ORDER_DURATION_INFO':
      return {
        ...state,
        createDurationInfo: (state.createDurationInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_ORDER_DURATION_INFO_SUCCESS':
      return {
        ...state,
        createDurationInfo: (state.createDurationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_ORDER_DURATION_INFO_FAILURE':
      return {
        ...state,
        createDurationInfo: (state.createDurationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_CREATE_ORDER_DURATION_INFO':
      return {
        ...state,
        createDurationInfo: (state.createDurationInfo, { loading: false, data: null, err: null }),
      };
    case 'GET_PAUSE_REASONS_INFO':
      return {
        ...state,
        pauseReasons: (state.pauseReasons, { loading: true, data: null, err: null }),
      };
    case 'GET_PAUSE_REASONS_INFO_SUCCESS':
      return {
        ...state,
        pauseReasons: (state.pauseReasons, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_PAUSE_REASONS_INFO_FAILURE':
      return {
        ...state,
        pauseReasons: (state.pauseReasons, { loading: false, err: action.error, data: null }),
      };
    case 'CREATE_ORDER_TS_INFO':
      return {
        ...state,
        createTimesheetInfo: (state.createTimesheetInfo, { loading: true, data: null, err: null }),
      };
    case 'CREATE_ORDER_TS_INFO_SUCCESS':
      return {
        ...state,
        createTimesheetInfo: (state.createTimesheetInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'CREATE_ORDER_TS_INFO_FAILURE':
      return {
        ...state,
        createTimesheetInfo: (state.createTimesheetInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMPLOYEES_MEMBERS_INFO':
      return {
        ...state,
        employeeMembers: (state.employeeMembers, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEES_MEMBERS_INFO_SUCCESS':
      return {
        ...state,
        employeeMembers: (state.employeeMembers, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_EMPLOYEES_MEMBERS_INFO_FAILURE':
      return {
        ...state,
        employeeMembers: (state.employeeMembers, { loading: false, err: action.error, data: null }),
      };
    case 'GET_EMP_REPORT':
      return {
        ...state,
        employeePerformanceReport: (state.employeePerformanceReport, { loading: true }),
      };
    case 'GET_EMP_REPORT_SUCCESS':
      return {
        ...state,
        employeePerformanceReport: (state.employeePerformanceReport, { loading: false, data: action.payload.data }),
      };
    case 'GET_EMP_REPORT_FAILURE':
      return {
        ...state,
        employeePerformanceReport: (state.employeePerformanceReport, { loading: false, err: action.error }),
      };
    case 'RESET_EMPLOYEE_INFO':
      return {
        ...state,
        employeePerformanceReport: (state.employeePerformanceReport, { loading: false, err: null, data: null }),
      };
    case 'GET_EMP_GROUP_INFO':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: true }),
      };
    case 'GET_EMP_GROUP_INFO_SUCCESS':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: false, data: action.payload.data }),
      };
    case 'GET_EMP_GROUP_INFO_FAILURE':
      return {
        ...state,
        employeeGroupInfo: (state.employeeGroupInfo, { loading: false, err: action.error }),
      };
    case 'GET_OP_WO_INFO':
      return {
        ...state,
        checklistOpInfo: (state.checklistOpInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_OP_WO_INFO_SUCCESS':
      return {
        ...state,
        checklistOpInfo: (state.checklistOpInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_OP_WO_INFO_FAILURE':
      return {
        ...state,
        checklistOpInfo: (state.checklistOpInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_OP_WO_INFO':
      return {
        ...state,
        checklistOpInfo: (state.checklistOpInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_OR_LISTS_INFO':
      return {
        ...state,
        workOrderChecklist: (state.workOrderChecklist, { loading: true }),
      };
    case 'GET_OR_LISTS_INFO_SUCCESS':
      return {
        ...state,
        workOrderChecklist: (state.workOrderChecklist, { loading: false, data: action.payload.data }),
      };
    case 'GET_OR_LISTS_INFO_FAILURE':
      return {
        ...state,
        workOrderChecklist: (state.workOrderChecklist, { loading: false, err: action.error }),
      };
    case 'GET_WO_PPM_ONHOLD_INFO':
      return {
        ...state,
        ppmOnholdData: (state.ppmOnholdData, { loading: true, data: null, err: null }),
      };
    case 'GET_WO_PPM_ONHOLD_INFO_SUCCESS':
      return {
        ...state,
        ppmOnholdData: (state.ppmOnholdData, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WO_PPM_ONHOLD_INFO_FAILURE':
      return {
        ...state,
        ppmOnholdData: (state.ppmOnholdData, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_WO_PPM_ONHOLD_INFO':
      return {
        ...state,
        ppmOnholdData: (state.ppmOnholdData, { loading: false, err: null, data: null }),
      };
    case 'GET_WO_OH_REQUEST_INFO':
      return {
        ...state,
        ppmOnholdRequest: (state.ppmOnholdRequest, { loading: true, data: null, err: null }),
      };
    case 'GET_WO_OH_REQUEST_INFO_SUCCESS':
      return {
        ...state,
        ppmOnholdRequest: (state.ppmOnholdRequest, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WO_OH_REQUEST_INFO_FAILURE':
      return {
        ...state,
        ppmOnholdRequest: (state.ppmOnholdRequest, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_WO_OH_REQUEST_INFO':
      return {
        ...state,
        ppmOnholdRequest: (state.ppmOnholdRequest, { loading: false, err: null, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
