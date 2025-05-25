import {
  getWorkordersInfo, getWorkorderCountInfo, updatePartsOrdersNoLoadInfo,
  getTeamGroupsInfo, getStateGroupsInfo, getPriorityGroupsInfo, getOrderData, getWorkorderFilters, getMaintenanceTypeGroupsInfo, getTypeGroupsInfo,
  getWorkordersExportInfo, getOrdersCommentsInfo, createOrderCommentInfo,
  orderStateChangeInfo, orderStateChangeNoInfo, updateChecklistAnswers, getExtraSelectionInfo, getExtraSelectionCountInfo, getSuggestedValueInfo, removeChecklistQuestions,
  getWorkOrderDashboardInfo, getOrderPartsInfo, getOrderCheckListsInfo, getOrderTimeSheetsInfo, updateReassignTeamInfo,
  getOrderToolsInfo, getInventoryPartLists, createPartsOrders, deleteParts, createInventoryOrders, updatePartsOrders, getStockPartsInfo,
  getEvaluationReports, getActionDataInfo, createOrderDurationInfo, getPPMOnHoldRequestInfo, getPauseReasonsInfo, getOrderAssignInfo, createOrderTimesheetInfo,
  getEmployeeMembersInfo, getEmployeeDatas, getEmployeeGroupsInfo, getWoPPMDetailInfo, getOperationCheckListDatas, getOrderChecklists,
} from './actions';

export const GET_ROWS_WO = 'GET_ROWS_WO';
export const GET_STATE_RESET_INFO = 'GET_STATE_RESET_INFO';
export const RESET_COMMENTS_INFO = 'RESET_COMMENTS_INFO';
export const GET_ROWS_ADDED_PARTS = 'GET_ROWS_ADDED_PARTS';
export const RESET_ROWS_ADDED_PARTS = 'RESET_ROWS_ADDED_PARTS';
export const RESET_ROWS_UPDATE_PARTS = 'RESET_ROWS_UPDATE_PARTS';
export const RESET_ROWS_ADD_PARTS = 'RESET_ROWS_ADD_PARTS';
export const RESET_DELETE_PARTS = 'RESET_DELETE_PARTS';
export const RESET_CHECKLIST_ANSWER_INFO = 'RESET_CHECKLIST_ANSWER_INFO';
export const RESET_REMOVE_CHECKLIST_ANSWER_INFO = 'RESET_REMOVE_CHECKLIST_ANSWER_INFO';
export const GET_SUGGESTED_VALUE_ROWS = 'GET_SUGGESTED_VALUE_ROWS';
export const GET_SUGGESTED_VALUE_ROWS_RESET = 'GET_SUGGESTED_VALUE_ROWS_RESET';
export const RESET_ORDER_OPERATION_INFO = 'RESET_ORDER_OPERATION_INFO';
export const RESET_CREATE_ORDER_DURATION_INFO = 'RESET_CREATE_ORDER_DURATION_INFO';
export const RESET_GET_CHECK_LISTS_INFO = 'RESET_GET_CHECK_LISTS_INFO';
export const RESET_EMPLOYEE_INFO = 'RESET_EMPLOYEE_INFO';
export const RESET_PART_NO_LOAD = 'RESET_PART_NO_LOAD';
export const RESET_OP_WO_INFO = 'RESET_OP_WO_INFO';
export const RESET_WO_PPM_ONHOLD_INFO = 'RESET_WO_PPM_ONHOLD_INFO';
export const RESET_WO_OH_REQUEST_INFO = 'RESET_WO_OH_REQUEST_INFO';

export function getWorkorders(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, sortByValue, sortFieldValue, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getWorkordersInfo(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, sortByValue, sortFieldValue, keyword, globalFilter));
  };
}

export function getWorkorderCount(company, model, states, teams, priorities, mtypes, types, customFilters, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getWorkorderCountInfo(company, model, states, teams, priorities, mtypes, types, customFilters, keyword, globalFilter));
  };
}

export function getWorkordersExport(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getWorkordersExportInfo(company, model, limit, offset, fields, states, teams, priorities, mtypes, types, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getTeamGroups(company, model) {
  return (dispatch) => {
    dispatch(getTeamGroupsInfo(company, model));
  };
}

export function getStateGroups(company, model) {
  return (dispatch) => {
    dispatch(getStateGroupsInfo(company, model));
  };
}

export function getPriorityGroups(company, model) {
  return (dispatch) => {
    dispatch(getPriorityGroupsInfo(company, model));
  };
}

export function getMaintenanceTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getMaintenanceTypeGroupsInfo(company, model));
  };
}

export function getTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getTypeGroupsInfo(company, model));
  };
}

export function getOrderDetail(id, model) {
  return (dispatch) => {
    dispatch(getOrderData(id, model));
  };
}

export function getOrdersComments(ids, model) {
  return (dispatch) => {
    dispatch(getOrdersCommentsInfo(ids, model));
  };
}

export function getOrderParts(ids, model) {
  return (dispatch) => {
    dispatch(getOrderPartsInfo(ids, model));
  };
}

export function getStockParts(ids, model) {
  return (dispatch) => {
    dispatch(getStockPartsInfo(ids, model));
  };
}

export function getInventoryPartList(keyword) {
  return (dispatch) => {
    dispatch(getInventoryPartLists(keyword));
  };
}

export function getOrderCheckLists(ids, model) {
  return (dispatch) => {
    dispatch(getOrderCheckListsInfo(ids, model));
  };
}

export function resetOrderCheckList(result) {
  return {
    type: RESET_GET_CHECK_LISTS_INFO,
    payload: result,
  };
}

export function resetTaskChecklist(result) {
  return {
    type: RESET_OP_WO_INFO,
    payload: result,
  };
}

export function getOrderTools(ids, model) {
  return (dispatch) => {
    dispatch(getOrderToolsInfo(ids, model));
  };
}

export function getOrderTimeSheets(ids, model) {
  return (dispatch) => {
    dispatch(getOrderTimeSheetsInfo(ids, model));
  };
}

export function createOrderComment(values, model) {
  return (dispatch) => {
    dispatch(createOrderCommentInfo(values, model));
  };
}

export function getEvaluationReport(values) {
  return (dispatch) => {
    dispatch(getEvaluationReports(values));
  };
}

export function createPartsOrder(values, model) {
  return (dispatch) => {
    dispatch(createPartsOrders(values, model));
  };
}

export function updatePartsOrder(id, values, model) {
  return (dispatch) => {
    dispatch(updatePartsOrders(id, values, model));
  };
}

export function updatePartsOrderNoLoad(id, values, model) {
  return (dispatch) => {
    dispatch(updatePartsOrdersNoLoadInfo(id, values, model));
  };
}

export function createInventoryOrder(values) {
  return (dispatch) => {
    dispatch(createInventoryOrders(values));
  };
}

export function orderStateChange(id, state, modelName) {
  return (dispatch) => {
    dispatch(orderStateChangeInfo(id, state, modelName));
  };
}

export function orderStateNoChange(id, state, modelName) {
  return (dispatch) => {
    dispatch(orderStateChangeNoInfo(id, state, modelName));
  };
}

export function updateChecklistAnswer(id, state, modelName) {
  return (dispatch) => {
    dispatch(updateChecklistAnswers(id, state, modelName));
  };
}

export function removeChecklistQuestion(id, state, modelName) {
  return (dispatch) => {
    dispatch(removeChecklistQuestions(id, state, modelName));
  };
}

export function getWorkOrderDashboard(start, end) {
  return (dispatch) => {
    dispatch(getWorkOrderDashboardInfo(start, end));
  };
}

export function getWorkorderFilter(payload) {
  return (dispatch) => {
    dispatch(getWorkorderFilters(payload));
  };
}

export function deletePart(id, model) {
  return (dispatch) => {
    dispatch(deleteParts(id, model));
  };
}

export function getCheckedRows(result) {
  return {
    type: GET_ROWS_WO,
    payload: result,
  };
}

export function getSuggestedCheckedRows(result) {
  return {
    type: GET_SUGGESTED_VALUE_ROWS,
    payload: result,
  };
}

export function resetSuggestedCheckedRows(result) {
  return {
    type: GET_SUGGESTED_VALUE_ROWS_RESET,
    payload: result,
  };
}

export function resetEscalate(result) {
  return {
    type: GET_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetUpdateCheckList(result) {
  return {
    type: RESET_CHECKLIST_ANSWER_INFO,
    payload: result,
  };
}

export function resetRemoveCheckList(result) {
  return {
    type: RESET_REMOVE_CHECKLIST_ANSWER_INFO,
    payload: result,
  };
}

export function resetComments(result) {
  return {
    type: RESET_COMMENTS_INFO,
    payload: result,
  };
}

export function resetAddedPartsRows(result) {
  return {
    type: RESET_ROWS_ADDED_PARTS,
    payload: result,
  };
}

export function getAddedParts(result) {
  return {
    type: GET_ROWS_ADDED_PARTS,
    payload: result,
  };
}

export function resetUpdateParts(result) {
  return {
    type: RESET_ROWS_UPDATE_PARTS,
    payload: result,
  };
}

export function resetAddParts(result) {
  return {
    type: RESET_ROWS_ADD_PARTS,
    payload: result,
  };
}

export function resetDeletePart(result) {
  return {
    type: RESET_DELETE_PARTS,
    payload: result,
  };
}

export function updateReassignTeam(teamId, orderId, state, modelName) {
  return (dispatch) => {
    dispatch(updateReassignTeamInfo(teamId, orderId, state, modelName));
  };
}

export function getExtraSelection(model, limit, offset, fields, name, ids) {
  return (dispatch) => {
    dispatch(getExtraSelectionInfo(model, limit, offset, fields, name, ids));
  };
}

export function getExtraSelectionCount(model, name) {
  return (dispatch) => {
    dispatch(getExtraSelectionCountInfo(model, name));
  };
}

export function getSuggestedValues(ids, model, fields) {
  return (dispatch) => {
    dispatch(getSuggestedValueInfo(ids, model, fields));
  };
}

export function getActionData(id, state, modelName) {
  return (dispatch) => {
    dispatch(getActionDataInfo(id, state, modelName));
  };
}

export function resetActionData(result) {
  return {
    type: RESET_ORDER_OPERATION_INFO,
    payload: result,
  };
}

export function resetActionNoData(result) {
  return {
    type: RESET_PART_NO_LOAD,
    payload: result,
  };
}

export function createOrderDuration(model, result) {
  return (dispatch) => {
    dispatch(createOrderDurationInfo(model, result));
  };
}

export function resetCreateOrderDuration(result) {
  return {
    type: RESET_CREATE_ORDER_DURATION_INFO,
    payload: result,
  };
}

export function getPauseReasons(company, model, keyword, onHold, domain) {
  return (dispatch) => {
    dispatch(getPauseReasonsInfo(company, model, keyword, onHold, domain));
  };
}

export function getOrderAssign(team, employee, order, state, modelName) {
  return (dispatch) => {
    dispatch(getOrderAssignInfo(team, employee, order, state, modelName));
  };
}

export function createOrderTimesheet(model, result) {
  return (dispatch) => {
    dispatch(createOrderTimesheetInfo(model, result));
  };
}

export function getEmployeeMembers(company, model, keyword, ids, limit, field, custom, id) {
  return (dispatch) => {
    dispatch(getEmployeeMembersInfo(company, model, keyword, ids, limit, field, custom, id));
  };
}

export function getEmployeeData(company, appModel, start, end, employee, space, team) {
  return (dispatch) => {
    dispatch(getEmployeeDatas(company, appModel, start, end, employee, space, team));
  };
}

export function resetEmployeeReport(result) {
  return {
    type: RESET_EMPLOYEE_INFO,
    payload: result,
  };
}

export function getEmployeeGroups(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEmployeeGroupsInfo(company, model, keyword));
  };
}

export function getOperationCheckListData(id) {
  return (dispatch) => {
    dispatch(getOperationCheckListDatas(id));
  };
}
export function getOrderChecklist(id, model) {
  return (dispatch) => {
    dispatch(getOrderChecklists(id, model));
  };
}

export function getWoPPMDetail(id, model) {
  return (dispatch) => {
    dispatch(getWoPPMDetailInfo(id, model));
  };
}

export function resetWoPPMDetail(result) {
  return {
    type: RESET_WO_PPM_ONHOLD_INFO,
    payload: result,
  };
}

export function getPPMOnHoldRequest(id, result) {
  return (dispatch) => {
    dispatch(getPPMOnHoldRequestInfo(id, result));
  };
}

export function resetPPMOnHoldRequest(result) {
  return {
    type: RESET_WO_OH_REQUEST_INFO,
    payload: result,
  };
}
