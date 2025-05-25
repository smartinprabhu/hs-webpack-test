import {
  getTrackerListInfo, getTrackerCountInfo,
  createTrackerInfo, getBTConfigInfo,
  getTrackerDetails, getTrackerExportInfo, getActGroupsInfo, getTrackerTemplates,
  getTrackerActs, getSubmittedTos, getTrackerLog, getTrackerEvidences, getTrackerTemplateDetails, complianceStateChangeInfo,
  getTrackerDashboardInfo, getCategoryGroupsInfo, getTrackerCategorys, getTrackerReports, getRaisedLists, getServiceImpacteds,
  getServiceCategorys, getEquipmentLists, getServiceCategoryGroupsInfo, updateReasonBack, getRaisedByGroupsInfo, getStatusByGroupsInfo, getAttachmentCategoryLists,
} from './actions';

export const BT_FILTERS = 'BT_FILTERS';
export const RESET_ADD_BT_INFO = 'RESET_ADD_BT_INFO';
export const GET_ROWS_BT = 'GET_ROWS_BT';
export const GET_BT_STATE_RESET_INFO = 'GET_BT_STATE_RESET_INFO';
export const RESET_RENEWAL_DETAIL = 'RESET_RENEWAL_DETAIL';
export const RESET_BT_REPORT = 'RESET_BT_REPORT';
export const GET_SERVICE_IMPACTED_ID = 'GET_SERVICE_IMPACTED_ID';
export const GET_UPLOAD_SERVICE_IMAGE = 'GET_UPLOAD_SERVICE_IMAGE';
export const GET_UPLOAD_RCA_IMAGE = 'GET_UPLOAD_RCA_IMAGE';
export const GET_IMAGE_RESET_SERVICE_INFO = 'GET_IMAGE_RESET_SERVICE_INFO';
export const GET_IMAGE_RESET_RAC_INFO = 'GET_IMAGE_RESET_RAC_INFO';

export function getTrackerList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getTrackerListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter));
  };
}

export function getTrackerExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getTrackerExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getTrackerCount(company, model, states, customFilters, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getTrackerCountInfo(company, model, states, customFilters, keyword, globalFilter));
  };
}

export function getTrackerFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: BT_FILTERS,
    payload: result,
  };
}

export function resetAddTrackerInfo(result) {
  return {
    type: RESET_ADD_BT_INFO,
    payload: result,
  };
}

export function getTrackerDetail(id, model) {
  return (dispatch) => {
    dispatch(getTrackerDetails(id, model));
  };
}

export function getBMSDetail(id, model) {
  return (dispatch) => {
    dispatch(getTrackerDetails(id, model));
  };
}

export function createTracker(model, payload) {
  return (dispatch) => {
    dispatch(createTrackerInfo(model, payload));
  };
}

export function updateReason(id, result, modelName) {
  return (dispatch) => {
    dispatch(updateReasonBack(id, result, modelName));
  };
}

export function getCheckedRowsTracker(payload) {
  return {
    type: GET_ROWS_BT,
    payload,
  };
}

export function getActGroups(company, model) {
  return (dispatch) => {
    dispatch(getActGroupsInfo(company, model));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getServiceCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getServiceCategoryGroupsInfo(company, model));
  };
}

export function getRaisedByGroups(company, model) {
  return (dispatch) => {
    dispatch(getRaisedByGroupsInfo(company, model));
  };
}

export function getStatusByGroups(company, model) {
  return (dispatch) => {
    dispatch(getStatusByGroupsInfo(company, model));
  };
}

export function getTrackerTemplate(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTrackerTemplates(company, model, keyword));
  };
}

export function getTrackerAct(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTrackerActs(company, model, keyword));
  };
}

export function getSubmittedTo(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getSubmittedTos(company, model, type, keyword));
  };
}

export function getTrackerCategory(company, model, type, keyword) {
  return (dispatch) => {
    dispatch(getTrackerCategorys(company, model, type, keyword));
  };
}

export function getTrackerLogs(ids, model) {
  return (dispatch) => {
    dispatch(getTrackerLog(ids, model));
  };
}

export function getTrackerEvidence(ids, model) {
  return (dispatch) => {
    dispatch(getTrackerEvidences(ids, model));
  };
}

export function getTrackerTemplateDetail(id, model) {
  return (dispatch) => {
    dispatch(getTrackerTemplateDetails(id, model));
  };
}

export function complianceStateChange(id, state, model, contex) {
  return (dispatch) => {
    dispatch(complianceStateChangeInfo(id, state, model, contex));
  };
}

export function resetTrackerState(result) {
  return {
    type: GET_BT_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetRenewalDetail(result) {
  return {
    type: RESET_RENEWAL_DETAIL,
    payload: result,
  };
}

export function getTrackerDashboard(start, end) {
  return (dispatch) => {
    dispatch(getTrackerDashboardInfo(start, end));
  };
}

export function getTrackerReport(company, model, status, compliance, expiryDate) {
  return (dispatch) => {
    dispatch(getTrackerReports(company, model, status, compliance, expiryDate));
  };
}

export function resetTrackerReport(result) {
  return {
    type: RESET_BT_REPORT,
    payload: result,
  };
}

export function getRaisedList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getRaisedLists(company, model, keyword));
  };
}

export function getServiceCategory(domain, model) {
  return (dispatch) => {
    dispatch(getServiceCategorys(domain, model));
  };
}

export function getEquipmentList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEquipmentLists(company, model, keyword));
  };
}

export function setServiceImpactedId(payload) {
  return {
    type: GET_SERVICE_IMPACTED_ID,
    payload,
  };
}

export function getServiceImpacted(company, model, keyword) {
  return (dispatch) => {
    dispatch(getServiceImpacteds(company, model, keyword));
  };
}

export function getAttachmentCategoryList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAttachmentCategoryLists(company, model, keyword));
  };
}

export function getUploadServiceImageInfo(payload) {
  return {
    type: GET_UPLOAD_SERVICE_IMAGE,
    payload,
  };
}
export function getUploadRCAImageInfo(payload) {
  return {
    type: GET_UPLOAD_RCA_IMAGE,
    payload,
  };
}

export function resetImageService(result) {
  return {
    type: GET_IMAGE_RESET_SERVICE_INFO,
    payload: result,
  };
}

export function resetImageRAC(result) {
  return {
    type: GET_IMAGE_RESET_RAC_INFO,
    payload: result,
  };
}

export function getBTConfig(id, modelName) {
  return (dispatch) => {
    dispatch(getBTConfigInfo(id, modelName));
  };
}
