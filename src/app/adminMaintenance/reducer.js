const initialState = {
  createCommentInfo: {},
  orderComments: {},
  orderParts: {},
  orderCheckLists: {},
  orderTimeSheets: {},
  priorityGroupsInfo: {},
  stateGroupsInfo: {},
  stateChangeInfo: {},
  typeGroupsInfo: {},
  workordersInfo: {},
  maintenanceInfo: {},
  // workorderCount: null,
  workorderCountErr: null,
  workorderCountLoading: false,
  maintenanceCount: null,
  maintenanceCountErr: null,
  maintenanceCountLoading: false,
  workorderDetails: {},
  maintenanceExportInfo: {},
  workorderFilters: {},
  cleaningWorkorderFilters: {},
  workorderDashboard: {},
  bookingDelete: {},
  woRows: {},
  bulkOrders: {},
  workorder: {},
  workordersCount: {},
};

// eslint-disable-next-line default-param-last
function bookingMaintenanceReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_WORK_ORDERS_INFO':
      return {
        ...state,
        workordersInfo: (state.workordersInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_WORK_ORDERS_INFO_SUCCESS':
      return {
        ...state,
        workordersInfo: (state.workordersInfo,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORK_ORDERS_INFO_FAILURE':
      return {
        ...state,
        workordersInfo: (state.workordersInfo, { loading: false, err: action.error, data: null }),
      };
    // case 'GET_WORK_ORDERS_COUNT':
    //   return {
    //     ...state,
    //     workorderCountLoading: true,
    //   };
    // case 'GET_WORK_ORDERS_COUNT_SUCCESS':
    //   return {
    //     ...state,
    //     workorderCount: (state.workorderCount, action.payload.data),
    //     workorderCountLoading: false,
    //   };
    // case 'GET_WORK_ORDERS_COUNT_FAILURE':
    //   return {
    //     ...state,
    //     workorderCount: (state.workorderCount, action.error),
    //     workorderCountErr: (state.workorderCountErr, action.error),
    //     workorderCountLoading: false,
    //   };
    case 'CLEAR_MAINTENANCE_INFO':
      return {
        ...state,
        maintenanceInfo: {},
      };
    case 'GET_MAINTENANCE_INFO':
      return {
        ...state,
        maintenanceInfo: (state.maintenanceInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_MAINTENANCE_INFO_SUCCESS':
      return {
        ...state,
        maintenanceInfo: (state.maintenanceInfo,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_MAINTENANCE_INFO_FAILURE':
      return {
        ...state,
        maintenanceInfo: (state.maintenanceInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_MAINTENANCE_COUNT':
      return {
        ...state,
        maintenanceCountLoading: true,
      };
    case 'GET_MAINTENANCE_COUNT_SUCCESS':
      return {
        ...state,
        maintenanceCount: (state.maintenanceCount, action.payload),
        maintenanceCountLoading: false,
      };
    case 'GET_MAINTENANCE_COUNT_FAILURE':
      return {
        ...state,
        maintenanceCount: (state.maintenanceCount, action.error),
        maintenanceCountErr: (state.maintenanceCountErr, action.error),
        maintenanceCountLoading: false,
      };
    case 'GET_WORK_ORDERS':
      return {
        ...state,
        workorder: (state.workorder, { loading: true, data: null, err: null }),
      };
    case 'GET_WORK_ORDERS_SUCCESS':
      return {
        ...state,
        workorder: (state.workorder,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORK_ORDERS_FAILURE':
      return {
        ...state,
        workorder: (state.workorder, { loading: false, err: action.error, data: null }),
      };
    case 'GET_WORK_ORDERS_COUNT':
      return {
        ...state,
        workordersCount: (state.workordersCount, { loading: false, err: null, data: null }),
      };
    case 'GET_WORK_ORDERS_COUNT_SUCCESS':
      return {
        ...state,
        workordersCount: (state.workordersCount, { loading: false, err: null, data: action.payload }),
      };
    case 'GET_WORK_ORDERS_COUNT_FAILURE':
      return {
        ...state,
        workordersCount: (state.workordersCount, { loading: false, err: action.error.data, data: null }),
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO':
      return {
        ...state,
        maintenanceExportInfo: (state.maintenanceExportInfo,
        { loading: true, data: null, err: null }),
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO_SUCCESS':
      return {
        ...state,
        maintenanceExportInfo: (state.maintenanceExportInfo,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_WORK_ORDERS_EXPORT_INFO_FAILURE':
      return {
        ...state,
        maintenanceExportInfo: (state.maintenanceExportInfo,
        { loading: false, err: action.error, data: null }),
      };
    case 'GET_TEAMS_GROUP_INFO':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_TEAMS_GROUP_INFO_SUCCESS':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo,
        { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_TEAMS_GROUP_INFO_FAILURE':
      return {
        ...state,
        typeGroupsInfo: (state.typeGroupsInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATES_GROUP_INFO':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATES_GROUP_INFO_SUCCESS':
      return {
        ...state,
        stateGroupsInfo: (state.stateGroupsInfo,
        { loading: false, data: action.payload.data, err: null }),
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
    case 'GET_STATE_CHANGE_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_STATE_CHANGE_INFO_SUCCESS':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_STATE_CHANGE_INFO_FAILURE':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_STATE_RESET_INFO':
      return {
        ...state,
        stateChangeInfo: (state.stateChangeInfo, { loading: false, data: null, err: null }),
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
    case 'CLEAR_CLEANING_WORKORDER_FILTERS':
      return {
        ...state,
        cleaningWorkorderFilters: {},
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
    case 'CLEAR_BOOKINGS_FILTER_WORKORDER':
      return {
        ...state,
        workorderFilters: {},
      };
    case 'CLEAR_BOOKINGS_WORKORDER_COUNT':
      return {
        ...state,
        maintenanceCount: {},
      };
    case 'GET_FILTER_WORKORDER':
      return {
        ...state,
        workorderFilters: (state.workorderFilters, action.payload),
      };
    case 'GET_FILTER_CLEANING_WORKORDER':
      return {
        ...state,
        cleaningWorkorderFilters: (state.cleaningWorkorderFilters, action.payload),
      };
    case 'GET_ROWS_WO':
      return {
        ...state,
        woRows: (state.woRows, action.payload),
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookingDelete: (state.bookingDelete, { loading: true, data: null, err: null }),
      };
    case 'DELETE_BOOKING_SUCCESS':
      return {
        ...state,
        bookingDelete: (state.bookingDelete, { loading: false, data: action.payload.data, err: null }),
      };
    case 'DELETE_BOOKING_FAILURE':
      return {
        ...state,
        bookingDelete: (state.bookingDelete, { loading: false, err: action.error.data, data: null }),
      };
    case 'SAVE_BULK_ORDERS':
      return {
        ...state,
        bulkOrders: (state.bulkOrders, { loading: true, data: null, err: null }),
      };
    case 'SAVE_BULK_ORDERS_SUCCESS':
      return {
        ...state,
        bulkOrders: (state.bulkOrders, { loading: false, data: action.payload.data, err: null }),
      };
    case 'SAVE_BULK_ORDERS_FAILURE':
      return {
        ...state,
        bulkOrders: (state.bulkOrders, { loading: false, err: action.error.data, data: null }),
      };
    case 'CLEAR_CLEANING':
      return {
        ...state,
        bulkOrders: (state.bulkOrders, { loading: false, data: null, err: null }),
      };
    case 'CLEAR_BOOKING':
      return {
        ...state,
        bookingDelete: (state.bookingDelete, { loading: false, data: null, err: null }),
      };
    default:
      return state;
  }
}

export default bookingMaintenanceReducer;
