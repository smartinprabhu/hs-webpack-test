import {
  getAssetCategoryInfo, getPPMCalendarInfo, getOperationsInfo, getAllReportsList, getTaskToolListInfo,
  createPreventiveInfo, getPreventiveData, getPreventiveFilters, getCheckedRowsInfo, getPreventiveExportInfo,
  getPreventiveInfo, getPreventivesCount, getPreventiveOrders, getPreventiveViewerFilters, getPreventiveCheckLists, getPreventiveToolsLists,
  createPreventiveOperationInfo, getQuestionGroupInfo, getProductsLists, getProductByIds, createPreventiveChecklistInfo, createActivityInfo, getChecklistQuestions, getLocations, getTeamGroupsInfo,
  getPPMViewerDataInfo, getCheckListDataInfo, updatePPMChecklistInfo, updateActivityInfo, getOperationDataInfo, updatePPMOperationInfo, getTaskChecklistsInfo,
  getTaskPartsInfo, updatePPMSchedulerInfo, getSpaces, getDeletePreventiveSchedules, getPPMReports, getEmployeeWiseChecklistsInfo,
  createChecklistReports, getCheckListReportIds, getCheckListReports, getHourlyConfigurations, getInspectionTeamsDashboardInfo, clearInspectionOrdersInfo, getLocationProductsCountInfo,
  getInspectionDashboardInfo, getInspectionParentSchedulersInfo, getInspectionOrdersInfo, getPreventiveChecklistOrdersInfo, getInspectionChecklistGroups, getLocationProductsInfo,
  getParentSchedules, getInspectionEmployeeInfo, getPPMVendorGroupsInfo, getPPMWeekGroupsInfo,
  getEmployeeGroupsInfo, getSheduleLists, getPPMStatusInfo, getPPMStatusLogsInfo, getLastUpdateInfo, getChildAssetsInfo, getPPMVendorReportInfo,
  getPPMChecklistsExportInfo, getHxPPMCancelDetailsInfo, getPPMYearlyReportInfo,
  createCancelReqInfo,
  getHxPPMCancelRequestsListInfo,
  getHxPPMCancelRequestsExportInfo,
  getHxPPMCancelRequestsCountInfo,
  updateCancelReqInfo, getHxPPMDetailsInfo, getVendorPPMExternalLinkInfo, createBulkPreventiveInfo, getPPMYearlyExportLinkInfo, getChoiceOptionsInfo, getGatePassAssetsInfo, getSmartLoggerInfo, getConditionQuestionInfo, getOptionsInfo, getEquipmentSpaceByBlockICRs, getEquipmentSpaceByBlockPPMs, getCheckListsJsonDatas, getChecklistQuestionInfo, getSpaceByBlockPPMs, getDownloadRequestList, getDownloadRequestCountInfo, getDownloadRequestByIds, getDownloadRequestRefreshs, getMaintenanceTeamInfo, resumeInspections, resumePPMs,
} from './actions';

export const GET_ROWS_EQUIPMENT_SELECTED = 'GET_ROWS_EQUIPMENT_SELECTED';
export const GET_ROWS_CHECKLIST_SELECTED = 'GET_ROWS_CHECKLIST_SELECTED';
export const GET_ROWS_TOOLS_SELECTED = 'GET_ROWS_TOOLS_SELECTED';
export const GET_ROWS_PARTS_SELECTED = 'GET_ROWS_PARTS_SELECTED';
export const GET_REPORT_ID = 'GET_REPORT_ID';
export const GET_SELECTED_REPORT_DATE = 'GET_SELECTED_REPORT_DATE';
export const GET_LOCATION_ID = 'GET_LOCATION_ID';
export const GET_HEADERS = 'GET_HEADERS';
export const RESET_ADD_OPERATION_INFO = 'RESET_ADD_OPERATION_INFO';
export const RESET_ADD_CHECKLIST_INFO = 'RESET_ADD_CHECKLIST_INFO';
export const RESET_ADD_ACTIVITY = 'RESET_ADD_ACTIVITY';
export const RESET_QUESTIONS = 'RESET_QUESTIONS';
export const RESET_QUESTIONS_DATA = 'RESET_QUESTIONS_DATA';
export const RESET_QUESTIONS_LIST = 'RESET_QUESTIONS_LIST';
export const RESET_PPMOPERATIONS_SAVE_DATA = 'RESET_PPMOPERATIONS_SAVE_DATA';
export const RESET_PRODUCTS_BY_ID = 'RESET_PRODUCTS_BY_ID';
export const RESET_UPDATE_CHECKLIST_INFO = 'RESET_UPDATE_CHECKLIST_INFO';
export const RESET_PPM_CHECKLIST_INFO_FAILURE = 'RESET_PPM_CHECKLIST_INFO_FAILURE';
export const RESET_UPDATE_ACTIVITY_INFO = 'RESET_UPDATE_ACTIVITY_INFO';
export const RESET_PREVENTIVE_OPERATION_CREATE = 'RESET_PREVENTIVE_OPERATION_CREATE';
export const RESET_PREVENTIVE_OPERATION_UPDATE = 'RESET_PREVENTIVE_OPERATION_UPDATE';
export const RESET_PPM_SCHEDULER_UPDATE = 'RESET_PPM_SCHEDULER_UPDATE';
export const RESET_DELETE_SCHEDULE_INFO = 'RESET_DELETE_SCHEDULE_INFO';
export const GET_REPORTS_RESET = 'GET_REPORTS_RESET';
export const RESET_PPM_REPORT = 'RESET_PPM_REPORT';
export const RESET_CREATE_CK_REPORT = 'RESET_CREATE_CK_REPORT';
export const RESET_CK_DETAIL_REPORT = 'RESET_CK_DETAIL_REPORT';
export const RESET_CK_REPORT = 'RESET_CK_REPORT';
export const GET_TYPE_ID = 'GET_TYPE_ID';
export const RESET_SPACES_INFO = 'RESET_SPACES_INFO';
export const SET_SPACES_INFO = 'SET_SPACES_INFO';
export const RESET_INSP_WO_INFO = 'RESET_INSP_WO_INFO';
export const RESET_PPM_WO_INFO = 'RESET_PPM_WO_INFO';
export const SET_DASHBOARD_DATE_INFO = 'SET_DASHBOARD_DATE_INFO';
export const RESET_EMPLOYEE_CHECKLISTS_INFO = 'RESET_EMPLOYEE_CHECKLISTS_INFO';
export const RESET_INSP_EMP_INFO = 'RESET_INSP_EMP_INFO';
export const RESET_GROUP_EMP_INFO = 'RESET_GROUP_EMP_INFO';
export const RESET_PSR_INFO = 'RESET_PSR_INFO';
export const RESET_PARTSSELECTED_INFO = 'RESET_PARTSSELECTED_INFO';
export const RESET_OPTIONS_INFO = 'RESET_OPTIONS_INFO';
export const GET_FILTER_PPM = 'GET_FILTER_PPM';
export const ACTIVE_STEP_INFO = 'ACTIVE_STEP_INFO';
export const RESET_ICR_REPORT = 'RESET_ICR_REPORT';
export const RESET_PPMR_REPORT = 'RESET_PPMR_REPORT';
export const RESET_ASSET_CATEGORY = 'RESET_ASSET_CATEGORY';
export const RESET_PPM_CHECKLIST_GROUP_INFO_EXPORT = 'RESET_PPM_CHECKLIST_GROUP_INFO_EXPORT';
export const RESET_PPM_VENDOR_REPORT = 'RESET_PPM_VENDOR_REPORT';
export const RESET_CHECKLIST_QUESTION = 'RESET_CHECKLIST_QUESTION';
export const RESET_PPM_YEARLY_REPORT_INFO = 'RESET_PPM_YEARLY_REPORT_INFO';
export const RESET_EXTERNAL_PPM_LINK_INFO = 'RESET_EXTERNAL_PPM_LINK_INFO';
export const RESET_CREATE_BULK_PREVENTIVE_INFO = 'RESET_CREATE_BULK_PREVENTIVE_INFO';
export const RESET_MT = 'RESET_MT';
export const RESET_CANCEL_PPM_INFO = 'RESET_CANCEL_PPM_INFO';
export const HX_PPM_CANCEL_FILTERS = 'HX_PPM_CANCEL_FILTERS';
export const RESET_CREATE_PREVENTIVE_INFO = 'RESET_CREATE_PREVENTIVE_INFO';
export const RESET_DRI = 'RESET_DRI';
export const RESET_RI_INFO = 'RESET_RI_INFO';
export const RESET_RPPM_INFO = 'RESET_RPPM_INFO';

export function getPPMCalendar(company, model, start, end, schedule, performedBy, priorities, category, types, isInspection) {
  return (dispatch) => {
    dispatch(getPPMCalendarInfo(company, model, start, end, schedule, performedBy, priorities, category, types, isInspection));
  };
}

export function getAssetCategoryList(company, model, keyword, limit, offset) {
  return (dispatch) => {
    dispatch(getAssetCategoryInfo(company, model, keyword, limit, offset));
  };
}

export function getOperationsList(company, model, keyword, type, category, categoryNew, isPPM) {
  return (dispatch) => {
    dispatch(getOperationsInfo(company, model, keyword, type, category, categoryNew, isPPM));
  };
}

export function getCheckList(company, model, keyword, type, category) {
  return (dispatch) => {
    dispatch(getCheckListInfo(company, model, keyword, type, category));
  };
}

export function createPreventive(payload, model) {
  return (dispatch) => {
    dispatch(createPreventiveInfo(payload, model));
  };
}

export function resetCreatePreventive(result) {
  return {
    type: RESET_CREATE_PREVENTIVE_INFO,
    payload: result,
  };
}

export function getPreventiveDetail(id, model) {
  return (dispatch) => {
    dispatch(getPreventiveData(id, model));
  };
}

export function getPPMViewerData(id, isInspection) {
  return (dispatch) => {
    dispatch(getPPMViewerDataInfo(id, isInspection));
  };
}

export function getPreventiveFilter(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: GET_FILTER_PPM,
    payload: result,
  };
}

export function getPreventiveViewerFilter(payload) {
  return (dispatch) => {
    dispatch(getPreventiveViewerFilters(payload));
  };
}

export function getCheckedRows(payload) {
  return (dispatch) => {
    dispatch(getCheckedRowsInfo(payload));
  };
}

export function getSelectedEquipmentRows(result) {
  return {
    type: GET_ROWS_EQUIPMENT_SELECTED,
    payload: result,
  };
}

export function getToolsData(result) {
  return {
    type: GET_ROWS_TOOLS_SELECTED,
    payload: result,
  };
}

export function getChecklistData(result) {
  return {
    type: GET_ROWS_CHECKLIST_SELECTED,
    payload: result,
  };
}

export function getPartsData(result) {
  return {
    type: GET_ROWS_PARTS_SELECTED,
    payload: result,
  };
}

export function getPreventiveList(company, model, limit, offset, fields, customFilters, sortByValue, sortFieldValue, isInspection, globalFilter) {
  return (dispatch) => {
    dispatch(getPreventiveInfo(company, model, limit, offset, fields, customFilters, sortByValue, sortFieldValue, isInspection, globalFilter));
  };
}

export function getPreventiveExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isInspection) {
  return (dispatch) => {
    dispatch(getPreventiveExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isInspection));
  };
}

export function getPreventiveCount(company, model, customFilters, isInspection, globalFilter) {
  return (dispatch) => {
    dispatch(getPreventivesCount(company, model, customFilters, isInspection, globalFilter));
  };
}

export function getPreventiveOrder(id, model) {
  return (dispatch) => {
    dispatch(getPreventiveOrders(id, model));
  };
}

export function getPreventiveCheckList(company, model, keyword, type, category) {
  return (dispatch) => {
    dispatch(getPreventiveCheckLists(company, model, keyword, type, category));
  };
}

export function getPreventiveToolsList(company, model) {
  return (dispatch) => {
    dispatch(getPreventiveToolsLists(company, model));
  };
}

export function getSpace(company, ids, model) {
  return (dispatch) => {
    dispatch(getSpaces(company, ids, model));
  };
}

export function createPreventiveOperation(payload) {
  return (dispatch) => {
    dispatch(createPreventiveOperationInfo(payload));
  };
}

export function createPreventiveChecklist(payload) {
  return (dispatch) => {
    dispatch(createPreventiveChecklistInfo(payload));
  };
}

export function createActivity(payload) {
  return (dispatch) => {
    dispatch(createActivityInfo(payload));
  };
}

export function getQuestionGroup(company, model, keyword) {
  return (dispatch) => {
    dispatch(getQuestionGroupInfo(company, model, keyword));
  };
}

export function getConditionQuestion(company, model, keyword) {
  return (dispatch) => {
    dispatch(getConditionQuestionInfo(company, model, keyword));
  };
}

export function getOptions(company, model, keyword) {
  return (dispatch) => {
    dispatch(getOptionsInfo(company, model, keyword));
  };
}

export function getSmartLogger(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSmartLoggerInfo(company, model, keyword));
  };
}

export function getAllReports(companyId, date, model, locationId) {
  return (dispatch) => {
    dispatch(getAllReportsList(companyId, date, model, locationId));
  };
}

export function getLocationsInfo(companyId, model) {
  return (dispatch) => {
    dispatch(getLocations(companyId, model));
  };
}

export function getReportId(result) {
  return {
    type: GET_REPORT_ID,
    payload: result,
  };
}

export function getSelectedReportDate(date) {
  return {
    type: GET_SELECTED_REPORT_DATE,
    payload: date,
  };
}

export function getLocationId(id) {
  return {
    type: GET_LOCATION_ID,
    payload: id,
  };
}

export function getHeaders(result) {
  return {
    type: GET_HEADERS,
    payload: result,
  };
}

export function getProductsList(company, model, keyword, type) {
  return (dispatch) => {
    dispatch(getProductsLists(company, model, keyword, type));
  };
}

export function getProductById(company, model, id) {
  return (dispatch) => {
    dispatch(getProductByIds(company, model, id));
  };
}

export function getChecklistQuestion(company, model, id) {
  return (dispatch) => {
    dispatch(getChecklistQuestions(company, model, id));
  };
}

export function getTeamGroups(company, model) {
  return (dispatch) => {
    dispatch(getTeamGroupsInfo(company, model));
  };
}

export function getEmployeeGroups(company, model, start, end) {
  return (dispatch) => {
    dispatch(getEmployeeGroupsInfo(company, model, start, end));
  };
}

export function resetGroupEmployee(result) {
  return {
    type: RESET_GROUP_EMP_INFO,
    payload: result,
  };
}

export function resetAddOperation(result) {
  return {
    type: RESET_ADD_OPERATION_INFO,
    payload: result,
  };
}

export function resetAddChecklist(result) {
  return {
    type: RESET_ADD_CHECKLIST_INFO,
    payload: result,
  };
}

export function resetAddActivity(result) {
  return {
    type: RESET_ADD_ACTIVITY,
    payload: result,
  };
}

export function resetQuestionChecklist(result) {
  return {
    type: RESET_QUESTIONS,
    payload: result,
  };
}

export function setQuestionData(result) {
  return {
    type: RESET_QUESTIONS_DATA,
    payload: result,
  };
}

export function setQuestionList(result) {
  return {
    type: RESET_QUESTIONS_LIST,
    payload: result,
  };
}

export function clearPpmOperationsSaveData(result) {
  return {
    type: RESET_PPMOPERATIONS_SAVE_DATA,
    payload: result,
  };
}

export function clearProductsByIdData(result) {
  return {
    type: RESET_PRODUCTS_BY_ID,
    payload: result,
  };
}

export function getCheckListData(id, model) {
  return (dispatch) => {
    dispatch(getCheckListDataInfo(id, model));
  };
}

export function updatePPMChecklist(id, model, payload) {
  return (dispatch) => {
    dispatch(updatePPMChecklistInfo(id, model, payload));
  };
}

export function resetUpdateChecklist(result) {
  return {
    type: RESET_UPDATE_CHECKLIST_INFO,
    payload: result,
  };
}

export function resetPpmChecklist(result) {
  return {
    type: RESET_PPM_CHECKLIST_INFO_FAILURE,
    payload: result,
  };
}

export function updateActivity(id, model, payload) {
  return (dispatch) => {
    dispatch(updateActivityInfo(id, model, payload));
  };
}

export function resetUpdateActivity(result) {
  return {
    type: RESET_UPDATE_ACTIVITY_INFO,
    payload: result,
  };
}

export function resetCreateOperation(result) {
  return {
    type: RESET_PREVENTIVE_OPERATION_CREATE,
    payload: result,
  };
}

export function getOperationData(id, model) {
  return (dispatch) => {
    dispatch(getOperationDataInfo(id, model));
  };
}

export function updatePPMOperation(id, model, payload) {
  return (dispatch) => {
    dispatch(updatePPMOperationInfo(id, model, payload));
  };
}

export function resetUpdateOperation(result) {
  return {
    type: RESET_PREVENTIVE_OPERATION_UPDATE,
    payload: result,
  };
}

export function getTaskChecklists(company, model, keyword, ids) {
  return (dispatch) => {
    dispatch(getTaskChecklistsInfo(company, model, keyword, ids));
  };
}

export function getTaskToolList(company, model, ids) {
  return (dispatch) => {
    dispatch(getTaskToolListInfo(company, model, ids));
  };
}

export function getTaskParts(company, model, ids) {
  return (dispatch) => {
    dispatch(getTaskPartsInfo(company, model, ids));
  };
}

export function updatePPMScheduler(id, model, payload) {
  return (dispatch) => {
    dispatch(updatePPMSchedulerInfo(id, model, payload));
  };
}

export function resetUpdateScheduler(result) {
  return {
    type: RESET_PPM_SCHEDULER_UPDATE,
    payload: result,
  };
}

export function getDeletePreventiveSchedule(id, model) {
  return (dispatch) => {
    dispatch(getDeletePreventiveSchedules(id, model));
  };
}

export function resetDeletePreventiveSchedule(result) {
  return {
    type: RESET_DELETE_SCHEDULE_INFO,
    payload: result,
  };
}

export function resetDmrReport(result) {
  return {
    type: GET_REPORTS_RESET,
    payload: result,
  };
}

export function resetPPMReport(result) {
  return {
    type: RESET_PPM_REPORT,
    payload: result,
  };
}

export function getPPMReport(values, apiName) {
  return (dispatch) => {
    dispatch(getPPMReports(values, apiName));
  };
}

export function createChecklistReport(payload) {
  return (dispatch) => {
    dispatch(createChecklistReports(payload));
  };
}

export function getCheckListReportId(id, model) {
  return (dispatch) => {
    dispatch(getCheckListReportIds(id, model));
  };
}

export function getCheckListReport(id, model) {
  return (dispatch) => {
    dispatch(getCheckListReports(id, model));
  };
}

export function resetCreateChecklistReport(result) {
  return {
    type: RESET_CREATE_CK_REPORT,
    payload: result,
  };
}

export function resetDetailChecklistReport(result) {
  return {
    type: RESET_CK_DETAIL_REPORT,
    payload: result,
  };
}

export function resetChecklistReport(result) {
  return {
    type: RESET_CK_REPORT,
    payload: result,
  };
}

export function resetSpaceList(result) {
  return {
    type: RESET_SPACES_INFO,
    payload: result,
  };
}

export function setSpaceList(result) {
  return {
    type: SET_SPACES_INFO,
    payload: result,
  };
}

export function getTypeId(id) {
  return {
    type: GET_TYPE_ID,
    payload: id,
  };
}

export function getHourlyConfiguration(company, model, keyword) {
  return (dispatch) => {
    dispatch(getHourlyConfigurations(company, model, keyword));
  };
}

export function getInspectionDashboard(start, end) {
  return (dispatch) => {
    dispatch(getInspectionDashboardInfo(start, end));
  };
}

export function getInspectionTeamsDashboard(start, end) {
  return (dispatch) => {
    dispatch(getInspectionTeamsDashboardInfo(start, end));
  };
}

export function getInspectionParentSchedulers(start, end, type, id, types) {
  return (dispatch) => {
    dispatch(getInspectionParentSchedulersInfo(start, end, type, id, types));
  };
}

export function getInspectionOrders(start, end, type, id, date, mteam) {
  return (dispatch) => {
    dispatch(getInspectionOrdersInfo(start, end, type, id, date, mteam));
  };
}

export function clearInspectionOrdersdata() {
  return (dispatch) => {
    dispatch(clearInspectionOrdersInfo());
  };
}

export function getInspectionEmployee(start, end, employeeIds) {
  return (dispatch) => {
    dispatch(getInspectionEmployeeInfo(start, end, employeeIds));
  };
}

export function getPreventiveChecklistOrders(start, end, type, id, schedule) {
  return (dispatch) => {
    dispatch(getPreventiveChecklistOrdersInfo(start, end, type, id, schedule));
  };
}

export function resetInspectionOrders(result) {
  return {
    type: RESET_INSP_WO_INFO,
    payload: result,
  };
}

export function getPPMStatus(start, end, type, id, schedule, status, mteam) {
  return (dispatch) => {
    dispatch(getPPMStatusInfo(start, end, type, id, schedule, status, mteam));
  };
}

export function resetPPMStatus(result) {
  return {
    type: RESET_PSR_INFO,
    payload: result,
  };
}

export function resetPreventiveChecklistOrders(result) {
  return {
    type: RESET_PPM_WO_INFO,
    payload: result,
  };
}

export function resetInspectionEmployee(result) {
  return {
    type: RESET_INSP_EMP_INFO,
    payload: result,
  };
}

export function setInspectionDashboardDate(result) {
  return {
    type: SET_DASHBOARD_DATE_INFO,
    payload: result,
  };
}

export function getInspectionChecklistGroup(company, model, keyword) {
  return (dispatch) => {
    dispatch(getInspectionChecklistGroups(company, model, keyword));
  };
}

export function getParentSchedule(company, model, keyword) {
  return (dispatch) => {
    dispatch(getParentSchedules(company, model, keyword));
  };
}

export function getEmployeeWiseChecklists(company, model, start, end, ids) {
  return (dispatch) => {
    dispatch(getEmployeeWiseChecklistsInfo(company, model, start, end, ids));
  };
}

export function resetEmployeeChecklists(result) {
  return {
    type: RESET_EMPLOYEE_CHECKLISTS_INFO,
    payload: result,
  };
}

export function getSheduleList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSheduleLists(company, model, keyword));
  };
}

export function resetPartsSelected(result) {
  return {
    type: RESET_PARTSSELECTED_INFO,
    payload: result,
  };
}

export function resetChoiceOptions(result) {
  return {
    type: RESET_OPTIONS_INFO,
    payload: result,
  };
}

export function resetPPMhecklistExport(result) {
  return {
    type: RESET_PPM_CHECKLIST_GROUP_INFO_EXPORT,
    payload: result,
  };
}
export function getPPMChecklistsExportData(company, model, start, end, selectedFilter, selectedField, groupFilters, isMonth, request) {
  return (dispatch) => {
    dispatch(getPPMChecklistsExportInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, isMonth, request));
  };
}

export function getChoiceOptions(model, ids) {
  return (dispatch) => {
    dispatch(getChoiceOptionsInfo(model, ids));
  };
}

export function getGatePassAssets(model, ids) {
  return (dispatch) => {
    dispatch(getGatePassAssetsInfo(model, ids));
  };
}

export function getLocationProducts(locationId, keyword, offset, limit, type, domains, hide, productCategory) {
  return (dispatch) => {
    dispatch(getLocationProductsInfo(locationId, keyword, offset, limit, type, domains, hide, productCategory));
  };
}

export function getLocationProductsCount(locationId, keyword, type, domains, productCategory) {
  return (dispatch) => {
    dispatch(getLocationProductsCountInfo(locationId, keyword, type, domains, productCategory));
  };
}

export function activeStepInfo(result) {
  return {
    type: ACTIVE_STEP_INFO,
    payload: result,
  };
}

export function getEquipmentSpaceByBlockICR(blockId, type) {
  return (dispatch) => {
    dispatch(getEquipmentSpaceByBlockICRs(blockId, type));
  };
}

export function getEquipmentSpaceByBlockPPM(blockId, type) {
  return (dispatch) => {
    dispatch(getEquipmentSpaceByBlockPPMs(blockId, type));
  };
}

export function getSpaceByBlockPPM(blockId, type) {
  return (dispatch) => {
    dispatch(getSpaceByBlockPPMs(blockId, type));
  };
}

export function resetEquipmentSpaceByBlockICR(result) {
  return {
    type: RESET_ICR_REPORT,
    payload: result,
  };
}

export function resetEquipmentSpaceByBlockPPM(result) {
  return {
    type: RESET_PPMR_REPORT,
    payload: result,
  };
}
export function resetAssetCategory(result) {
  return {
    type: RESET_ASSET_CATEGORY,
    payload: result,
  };
}

export function getCheckListsJsonData(ids, model) {
  return (dispatch) => {
    dispatch(getCheckListsJsonDatas(ids, model));
  };
}

export function getPPMVendorReport(start, end, vendors) {
  return (dispatch) => {
    dispatch(getPPMVendorReportInfo(start, end, vendors));
  };
}

export function getMaintenanceTeam(start, end, type, modelname) {
  return (dispatch) => {
    dispatch(getMaintenanceTeamInfo(start, end, type, modelname));
  };
}

export function resetPPMVendor(result) {
  return {
    type: RESET_PPM_VENDOR_REPORT,
    payload: result,
  };
}

export function resetChecklistQuestion(result) {
  return {
    type: RESET_CHECKLIST_QUESTION,
    payload: result,
  };
}

export function getChildAssets(parentId, modelName, noload) {
  return (dispatch) => {
    dispatch(getChildAssetsInfo(parentId, modelName, noload));
  };
}

export function getLastUpdate(modelName) {
  return (dispatch) => {
    dispatch(getLastUpdateInfo(modelName));
  };
}

export function getChecklistQuestionList(company, model, id) {
  return (dispatch) => {
    dispatch(getChecklistQuestionInfo(company, model, id));
  };
}

export function getPPMStatusLogs(id, model) {
  return (dispatch) => {
    dispatch(getPPMStatusLogsInfo(id, model));
  };
}

export function getPPMYearlyReport(companyId, year) {
  return (dispatch) => {
    dispatch(getPPMYearlyReportInfo(companyId, year));
  };
}

export function getPPMYearlyExportLink(id, context) {
  return (dispatch) => {
    dispatch(getPPMYearlyExportLinkInfo(id, context));
  };
}

export function resetPPMYearlyExportLinkInfo(result) {
  return {
    type: RESET_PPM_YEARLY_REPORT_INFO,
    payload: result,
  };
}

export function getPPMVendorGroups(company, model) {
  return (dispatch) => {
    dispatch(getPPMVendorGroupsInfo(company, model));
  };
}

export function getPPMWeekGroups(company, model, vendorId) {
  return (dispatch) => {
    dispatch(getPPMWeekGroupsInfo(company, model, vendorId));
  };
}

export function getVendorPPMExternalLink(company, vendorId, week, model) {
  return (dispatch) => {
    dispatch(getVendorPPMExternalLinkInfo(company, vendorId, week, model));
  };
}

export function getDownloadRequest(company, model,limit, offset) {
  return (dispatch) => {
    dispatch(getDownloadRequestList(company, model,limit, offset));
  };
}

export function getDownloadRequestCount(company, model,limit, offset) {
  return (dispatch) => {
    dispatch(getDownloadRequestCountInfo(company, model,limit, offset));
  };
}

export function getDownloadRequestById(model, id) {
  return (dispatch) => {
    dispatch(getDownloadRequestByIds(model, id));
  };
}

export function getDownloadRequestRefresh(model, id) {
  return (dispatch) => {
    dispatch(getDownloadRequestRefreshs(model, id));
  };
}

export function resetVendorPPMExternalLink(result) {
  return {
    type: RESET_EXTERNAL_PPM_LINK_INFO,
    payload: result,
  };
}

export function createBulkPreventive(payload) {
  return (dispatch) => {
    dispatch(createBulkPreventiveInfo(payload));
  };
}

export function resetBulkPreventive(result) {
  return {
    type: RESET_CREATE_BULK_PREVENTIVE_INFO,
    payload: result,
  };
}

export function resetTeam(result) {
  return {
    type: RESET_MT,
    payload: result,
  };
}

export function resetDownloadDetailsById(result) {
  return {
    type: RESET_DRI,
    payload: result,
  };
}

export function getHxPPMDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getHxPPMDetailsInfo(id, modelName));
  };
}

export function createCancelReq(model, result) {
  return (dispatch) => {
    dispatch(createCancelReqInfo(model, result));
  };
}

export function updateCancelReq(id, model, result) {
  return (dispatch) => {
    dispatch(updateCancelReqInfo(id, model, result));
  };
}

export function resetCancelReq(result) {
  return {
    type: RESET_CANCEL_PPM_INFO,
    payload: result,
  };
}

export function getHxPPMCancelDetails(id, modelName, targetModel, isView, isCheck) {
  return (dispatch) => {
    dispatch(getHxPPMCancelDetailsInfo(id, modelName, targetModel, isView, isCheck));
  };
}

export function getHxPPMCancelRequestsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxPPMCancelRequestsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getHxPPMCancelRequestsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxPPMCancelRequestsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId));
  };
}

export function getHxPPMCancelRequestsCount(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxPPMCancelRequestsCountInfo(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getPPMCancelRequestFilters(customFiltersList) {
  return {
    type: HX_PPM_CANCEL_FILTERS,
    payload: customFiltersList,
  };
}

export function resumeInspection(id, state, modelName, args) {
  return (dispatch) => {
    dispatch(resumeInspections(id, state, modelName, args));
  };
}

export function resumePPM(id, state, modelName, args) {
  return (dispatch) => {
    dispatch(resumePPMs(id, state, modelName, args));
  };
}

export function resetResumeInspection(result) {
  return {
    type: RESET_RI_INFO,
    payload: result,
  };
}

export function resetResumePPM(result) {
  return {
    type: RESET_RPPM_INFO,
    payload: result,
  };
}
