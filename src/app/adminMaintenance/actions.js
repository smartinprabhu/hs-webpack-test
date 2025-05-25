/* eslint-disable quotes */
/* eslint-disable no-unused-vars */

import { CALL_API } from '../../middleware/api';
import orderColumns from './data/adminMaintenanceActions.json';

export const GET_MAINTENANCE_INFO = 'GET_MAINTENANCE_INFO';
export const GET_MAINTENANCE_INFO_SUCCESS = 'GET_MAINTENANCE_INFO_SUCCESS';
export const GET_MAINTENANCE_INFO_FAILURE = 'GET_MAINTENANCE_INFO_FAILURE';
export const CLEAR_MAINTENANCE_INFO = 'CLEAR_MAINTENANCE_INFO';
export const CLEAR_BOOKINGS_WORKORDER_COUNT = 'CLEAR_BOOKINGS_WORKORDER_COUNT';

export const GET_MAINTENANCE_COUNT = 'GET_MAINTENANCE_COUNT';
export const GET_MAINTENANCE_COUNT_SUCCESS = 'GET_MAINTENANCE_COUNT_SUCCESS';
export const GET_MAINTENANCE_COUNT_FAILURE = 'GET_MAINTENANCE_COUNT_FAILURE';

export const GET_WORK_ORDERS = 'GET_WORK_ORDERS';
export const GET_WORK_ORDERS_SUCCESS = 'GET_WORK_ORDERS_SUCCESS';
export const GET_WORK_ORDERS_FAILURE = 'GET_WORK_ORDERS_FAILURE';

export const GET_WORK_ORDERS_COUNT = 'GET_WORK_ORDERS_COUNT';
export const GET_WORK_ORDERS_COUNT_SUCCESS = 'GET_WORK_ORDERS_COUNT_SUCCESS';
export const GET_WORK_ORDERS_COUNT_FAILURE = 'GET_WORK_ORDERS_COUNT_FAILURE';

export const GET_WORK_ORDERS_EXPORT_INFO = 'GET_WORK_ORDERS_EXPORT_INFO';
export const GET_WORK_ORDERS_EXPORT_INFO_SUCCESS = 'GET_WORK_ORDERS_EXPORT_INFO_SUCCESS';
export const GET_WORK_ORDERS_EXPORT_INFO_FAILURE = 'GET_WORK_ORDERS_EXPORT_INFO_FAILURE';

export const GET_TEAMS_GROUP_INFO = 'GET_TEAMS_GROUP_INFO';
export const GET_TEAMS_GROUP_INFO_SUCCESS = 'GET_TEAMS_GROUP_INFO_SUCCESS';
export const GET_TEAMS_GROUP_INFO_FAILURE = 'GET_TEAMS_GROUP_INFO_FAILURE';

export const GET_STATES_GROUP_INFO = 'GET_STATES_GROUP_INFO';
export const GET_STATES_GROUP_INFO_SUCCESS = 'GET_STATES_GROUP_INFO_SUCCESS';
export const GET_STATES_GROUP_INFO_FAILURE = 'GET_STATES_GROUP_INFO_FAILURE';

export const GET_PRIORITIES_GROUP_INFO = 'GET_PRIORITIES_GROUP_INFO';
export const GET_PRIORITIES_GROUP_INFO_SUCCESS = 'GET_PRIORITIES_GROUP_INFO_SUCCESS';
export const GET_PRIORITIES_GROUP_INFO_FAILURE = 'GET_PRIORITIES_GROUP_INFO_FAILURE';

export const GET_ORDER_DETAILS_INFO = 'GET_ORDER_DETAILS_INFO';
export const GET_ORDER_DETAILS_INFO_SUCCESS = 'GET_ORDER_DETAILS_INFO_SUCCESS';
export const GET_ORDER_DETAILS_INFO_FAILURE = 'GET_ORDER_DETAILS_INFO_FAILURE';

export const GET_COMMENTS_INFO = 'GET_COMMENTS_INFO';
export const GET_COMMENTS_INFO_SUCCESS = 'GET_COMMENTS_INFO_SUCCESS';
export const GET_COMMENTS_INFO_FAILURE = 'GET_COMMENTS_INFO_FAILURE';

export const CREATE_COMMENT_INFO = 'CREATE_COMMENT_INFO';
export const CREATE_COMMENT_INFO_SUCCESS = 'CREATE_COMMENT_INFO_SUCCESS';
export const CREATE_COMMENT_INFO_FAILURE = 'CREATE_COMMENT_INFO_FAILURE';

export const GET_STATE_CHANGE_INFO = 'GET_STATE_CHANGE_INFO';
export const GET_STATE_CHANGE_INFO_SUCCESS = 'GET_STATE_CHANGE_INFO_SUCCESS';
export const GET_STATE_CHANGE_INFO_FAILURE = 'GET_STATE_CHANGE_INFO_FAILURE';

export const GET_WORKORDERS_DASHBOARD_INFO = 'GET_WORKORDERS_DASHBOARD_INFO';
export const GET_WORKORDERS_DASHBOARD_INFO_SUCCESS = 'GET_WORKORDERS_DASHBOARD_INFO_SUCCESS';
export const GET_WORKORDERS_DASHBOARD_INFO_FAILURE = 'GET_WORKORDERS_DASHBOARD_INFO_FAILURE';

export const GET_PARTS_INFO = 'GET_PARTS_INFO';
export const GET_PARTS_INFO_SUCCESS = 'GET_PARTS_INFO_SUCCESS';
export const GET_PARTS_INFO_FAILURE = 'GET_PARTS_INFO_FAILURE';

export const GET_CHECK_LISTS_INFO = 'GET_CHECK_LISTS_INFO';
export const GET_CHECK_LISTS_INFO_SUCCESS = 'GET_CHECK_LISTS_INFO_SUCCESS';
export const GET_CHECK_LISTS_INFO_FAILURE = 'GET_CHECK_LISTS_INFO_FAILURE';

export const GET_TIMESHEETS_INFO = 'GET_TIMESHEETS_INFO';
export const GET_TIMESHEETS_INFO_SUCCESS = 'GET_TIMESHEETS_INFO_SUCCESS';
export const GET_TIMESHEETS_INFO_FAILURE = 'GET_TIMESHEETS_INFO_FAILURE';

export const GET_FILTER_WORKORDER = 'GET_FILTER_WORKORDER';
export const GET_FILTER_CLEANING_WORKORDER = 'GET_FILTER_CLEANING_WORKORDER';
export const CLEAR_BOOKINGS_FILTER_WORKORDER = 'CLEAR_BOOKINGS_FILTER_WORKORDER';

export const SAVE_BULK_ORDERS = 'SAVE_BULK_ORDERS';
export const SAVE_BULK_ORDERS_SUCCESS = 'SAVE_BULK_ORDERS_SUCCESS';
export const SAVE_BULK_ORDERS_FAILURE = 'SAVE_BULK_ORDERS_FAILURE';

export const DELETE_BOOKING = 'DELETE_BOOKING';
export const DELETE_BOOKING_SUCCESS = 'DELETE_BOOKING_SUCCESS';
export const DELETE_BOOKING_FAILURE = 'DELETE_BOOKING_FAILURE';
export const CLEAR_CLEANING = 'CLEAR_CLEANING';
export const CLEAR_BOOKING = 'CLEAR_BOOKING';
export const CLEAR_CLEANING_WORKORDER_FILTERS = 'CLEAR_CLEANING_WORKORDER_FILTERS';

export function getMaintenanceInfo(
  company,
  limit,
  offset,
  states,
  types,
  custom,
  sortByValue,
  sortFieldValue,
  orderId,
  defaultWorkOrderStatus,
  searchFilter,
  bookingCheckBoxType,
) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (bookingCheckBoxType && bookingCheckBoxType.length > 1) {
    payload = `${payload}`;
  }
  if (bookingCheckBoxType && bookingCheckBoxType.length === 1 && bookingCheckBoxType[0] === "\"Guest\"") {
    payload = `${payload},["is_guest","=",true]`;
  }
  if (bookingCheckBoxType && bookingCheckBoxType.length === 1 && bookingCheckBoxType[0] === "\"Employee\"") {
    payload = `${payload},["is_guest","=",false]`;
  }
  if (searchFilter) {
    payload = `${payload},${searchFilter}`;
  }

  if (orderId) {
    payload = `${payload},["order_ids","!=",false]`;
  }

  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }

  if (types && types.length > 0) {
    payload = `${payload},["asset_category_id","in",[${types}]]`;
  }

  if (custom && custom.length > 0) {
    payload = `${payload},${custom}`;
  }

  if (searchFilter) {
    payload = `${payload},${searchFilter}`;
  }

  payload = `${payload}]&limit=${limit}&offset=${offset}`;

  // by default we are fetching by workorder status which are Ready.
  if (defaultWorkOrderStatus) {
    payload = `${payload}&wo_states=["ready"]`;
  }

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }
  payload = `${payload}&include_cancelled=true`;
  return {
    [CALL_API]: {
      endpoint: `booking/workorder/list?${payload}`,
      types: [GET_MAINTENANCE_INFO, GET_MAINTENANCE_INFO_SUCCESS, GET_MAINTENANCE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceCountInfo(company, states, types, custom, orderId, defaultWorkOrderStatus, searchFilter, bookingCheckBoxType) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (bookingCheckBoxType && bookingCheckBoxType.length > 1) {
    payload = `${payload}`;
  }
  if (bookingCheckBoxType && bookingCheckBoxType.length === 1 && bookingCheckBoxType[0] === "\"Guest\"") {
    payload = `${payload},["is_guest","=",true]`;
  }
  if (bookingCheckBoxType && bookingCheckBoxType.length === 1 && bookingCheckBoxType[0] === "\"Employee\"") {
    payload = `${payload},["is_guest","=",false]`;
  }
  if (orderId) {
    payload = `${payload},["order_ids","!=",false]`;
  }

  if (searchFilter) {
    payload = `${payload},${searchFilter}`;
  }

  if (states && states.length > 0) {
    payload = `${payload},["state","in",[${states}]]`;
  }
  if (types && types.length > 0) {
    payload = `${payload},["asset_category_id","in", [${types}]]`;
  }

  if (searchFilter) {
    payload = `${payload},${searchFilter}`;
  }

  if (custom && custom.length > 0) {
    payload = `${payload},${custom}`;
  }

  if (!defaultWorkOrderStatus) payload = `${payload}]`;

  if (defaultWorkOrderStatus) {
    payload = `${payload}]&wo_states=["ready"]`;
  }
  payload = `${payload}&include_cancelled=true`;

  return {
    [CALL_API]: {
      endpoint: `booking/workorder/count?${payload}`,
      types: [GET_MAINTENANCE_COUNT, GET_MAINTENANCE_COUNT_SUCCESS, GET_MAINTENANCE_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkorderList(
  company,
  workorderValue,
  limit,
  offset,
  states,
  types,
  custom,
  sortByValue,
  sortFieldValue,
  orderId,
  defaultWorkOrderStatus,
) {
  let payload = `domain=[["company_id","=",${company}]`;
  // if (orderId) {
  //   payload = `${payload},["order_ids","!=",false]`;
  // }

  // if (states && states.length > 0) {
  // payload = `${payload},["state","=","ready"]`;
  // }

  if (types && types.length > 0) {
    payload = `${payload},["space_category_id","in",[${types}]]`;
  }
  if (workorderValue && workorderValue.length !== 0 && workorderValue.length === 1) {
    payload = `${payload},["state","in",[${workorderValue}]]`;
  }
  if (workorderValue && workorderValue.length !== 0 && workorderValue.length > 1) {
    payload = `${payload},["state","in",[${workorderValue.map((data) => `${data}`).join(',  ')}]]`;
  }

  if (custom && custom.length > 0) {
    payload = `${payload},${custom}`;
  }

  payload = `${payload}]&limit=${limit}&offset=${offset}`;

  // by default we are fetching by workorder status which are Ready.
  // if (defaultWorkOrderStatus) {
  //   payload = `${payload}&wo_states=["ready"]`;
  // }

  // if (sortFieldValue && sortFieldValue.length > 0) {
  //   payload = `${payload}&order=${sortFieldValue}`;
  // }
  // if (sortByValue && sortByValue.length > 0) {
  //   payload = `${payload} ${sortByValue}`;
  // }

  return {
    [CALL_API]: {
      endpoint: `workorder/list?${payload}`,
      types: [GET_WORK_ORDERS, GET_WORK_ORDERS_SUCCESS, GET_WORK_ORDERS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkordersCountInfo(company, states, types, workorderValue, custom, orderId, defaultWorkOrderStatus) {
  let payload = `domain=[["company_id","=",${company}]`;

  // if (orderId) {
  //   payload = `${payload},["order_ids","!=",false]`;
  // }

  // if (states && states.length > 0) {
  // payload = `${payload},["state","=","ready"]`;
  // }
  if (types && types.length > 0) {
    payload = `${payload},["space_category_id","in", [${types}]]`;
  }
  if (workorderValue && workorderValue.length !== 0 && workorderValue.length === 1) {
    payload = `${payload},["state","in",["${workorderValue}"]]`;
  }
  if (workorderValue && workorderValue.length !== 0 && workorderValue.length > 1) {
    payload = `${payload},["state","in",["${workorderValue.map((data) => `${data}`).join('","')}"]]`;
  }
  if (custom && custom.length > 0) {
    payload = `${payload},${custom}]`;
  }

  // if (!defaultWorkOrderStatus) payload = `${payload}]`;

  // if (defaultWorkOrderStatus) {
  //   payload = `${payload}]&wo_states=["ready"]`;
  // }

  return {
    [CALL_API]: {
      endpoint: `workorder/count?${payload}`,
      types: [GET_WORK_ORDERS_COUNT, GET_WORK_ORDERS_COUNT_SUCCESS, GET_WORK_ORDERS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceExportInfo(company, model, limit, offset, columns, rows, statusValues, typeValues, customFilters, bookMaintenance, searchFilter) {
  let payload = `domain=[["company_id","=",${company}]`;

  if (statusValues && statusValues.length) {
    payload = `${payload},["state","in",[${statusValues}]]`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  if (searchFilter) {
    payload = `${payload},${searchFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (typeValues && typeValues.length > 0) {
    payload = bookMaintenance ? `${payload},["asset_category_id","in",[${typeValues}]]` : `${payload},["space_category_id","in",[${typeValues}]]`;
  }
  payload = `${payload}]`;
  payload = `${payload}&limit=${limit}&offset=${offset}&order=create_date DESC`;
  let endPoint;
  if (bookMaintenance) {
    endPoint = `booking/workorder/list?${payload}`;
  } else {
    endPoint = `workorder/list?${payload}`;
  }
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_WORK_ORDERS_EXPORT_INFO, GET_WORK_ORDERS_EXPORT_INFO_SUCCESS, GET_WORK_ORDERS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTypeGroupsInfo() {
  return {
    [CALL_API]: {
      endpoint: 'space_category/list/bookable',
      types: [GET_TEAMS_GROUP_INFO, GET_TEAMS_GROUP_INFO_SUCCESS, GET_TEAMS_GROUP_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getStateGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["state","!=",false]]&model=${model}&fields=["state"]&groupby=["state"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_STATES_GROUP_INFO, GET_STATES_GROUP_INFO_SUCCESS, GET_STATES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPriorityGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["priority","!=",false]]&model=${model}&fields=["priority"]&groupby=["priority"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PRIORITIES_GROUP_INFO, GET_PRIORITIES_GROUP_INFO_SUCCESS, GET_PRIORITIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderData(id, modelName) {
  const fields = orderColumns && orderColumns.viewFields ? orderColumns.viewFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_ORDER_DETAILS_INFO, GET_ORDER_DETAILS_INFO_SUCCESS, GET_ORDER_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getOrdersCommentsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]],["message_type","=","notification"],["body","!=",false],["body","!=",""]]`;
  payload = `${payload}&model=${modelName}&fields=["body","date","author_id","compute_body"]`;
  payload = `${payload}&limit=100&offset=0&order=date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMMENTS_INFO, GET_COMMENTS_INFO_SUCCESS, GET_COMMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getclearBookingMaintainanceInfo(payload) {
  return {
    type: CLEAR_MAINTENANCE_INFO,
    payload,
  };
}

export function getclearBookingWorkorderFilters(payload) {
  return {
    type: CLEAR_BOOKINGS_FILTER_WORKORDER,
    payload,
  };
}
export function getClearBookingsCount(payload) {
  return {
    type: CLEAR_BOOKINGS_WORKORDER_COUNT,
    payload,
  };
}

export function getOrderPartsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PARTS_INFO, GET_PARTS_INFO_SUCCESS, GET_PARTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderCheckListsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHECK_LISTS_INFO, GET_CHECK_LISTS_INFO_SUCCESS, GET_CHECK_LISTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getOrderTimeSheetsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["start_date","end_date","reason","description","address","latitude","longitude","total_hours"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TIMESHEETS_INFO, GET_TIMESHEETS_INFO_SUCCESS, GET_TIMESHEETS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createOrderCommentInfo(result, modelName) {
  const formValues = { model: modelName, values: result };
  return {
    [CALL_API]: {
      endpoint: `create/${modelName}`,
      types: [CREATE_COMMENT_INFO, CREATE_COMMENT_INFO_SUCCESS, CREATE_COMMENT_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function orderStateChangeInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_STATE_CHANGE_INFO, GET_STATE_CHANGE_INFO_SUCCESS, GET_STATE_CHANGE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getWorkOrderDashboardInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Workorder`,
      types: [GET_WORKORDERS_DASHBOARD_INFO, GET_WORKORDERS_DASHBOARD_INFO_SUCCESS, GET_WORKORDERS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function deleteBookingItem(id) {
  const payload = {
    ids: `[${id}]`,
  };
  return {
    [CALL_API]: {
      endpoint: `booking?ids=[${id}]&values={"is_cancelled":1}`,
      types: [DELETE_BOOKING, DELETE_BOOKING_SUCCESS, DELETE_BOOKING_FAILURE],
      method: 'PUT',
    },
  };
}

export function getWorkorderFilters(payload) {
  return {
    type: GET_FILTER_WORKORDER,
    payload,
  };
}

export function getCleaningWorkorderFilters(payload) {
  return {
    type: GET_FILTER_CLEANING_WORKORDER,
    payload,
  };
}

export function saveClearCleaningWorkOrderFilters() {
  return {
    type: CLEAR_CLEANING_WORKORDER_FILTERS,
  };
}

export function saveBulkCleanBookings(bookingIds, employeeId, startDate, endDate) {
  return {
    [CALL_API]: {
      endpoint: `workorder/bulk_update?order_ids=[${bookingIds}]&employee_id=${employeeId}&start_date=${startDate}&end_date=${endDate}`,
      types: [SAVE_BULK_ORDERS, SAVE_BULK_ORDERS_SUCCESS, SAVE_BULK_ORDERS_FAILURE],
      method: 'PUT',
    },
  };
}

export function clearCleaningRes() {
  return {
    type: CLEAR_CLEANING,
  };
}

export function clearBookingRes() {
  return {
    type: CLEAR_BOOKING,
  };
}
