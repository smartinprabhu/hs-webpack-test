/* eslint-disable max-len */
import {
  getTicketsInfo, addTicketInfo, getTicketsCount, getMaintenanceConfigList, getMaintenanceConfigurationInfo,
  getSpacesInfo, getCategoryInfo, getSubCategoryInfo, getEquipmentInfo, updateMultiModelDataInfo, createMultiModelDataInfo,
  getCategoryGroupsInfo, getStateGroupsInfo, getPriorityGroupsInfo, getTicketData, getCxoSectionsOperationTypesInfo,
  onDocumentCreate, getEquipmentDocuments, fileDownload, getHelpdeskDashboardInfo, getCxoConfigInfo, getCxoSectionsInfo,
  getHelpdeskFilters, getPriorityInfo, updateTicketInfo, escalateTicketInfo, getHelpdeskTeamsInfo,
  getTicketsExportInfo, getCheckedRowsInfo, onDocumentCreatesAttachment, getSiteBasedCategoryInfo, shareTicketInfo,
  getExtraSelectionCountInfo, getExtraSelectionInfo, getTicketNamesInfo, getTicketOrdersInfo, getOrdersFullDetailsInfo,
  getSpacesAllInfo, getUploadImageInfo, getCascaderInfo, getIncidentTypesInfo, getIncidentSevertiesInfo, getMessageTemplateInfo,
  ticketStateChangeInfo, getSpaceChildsInfo, createCloseTicketInfo, createMessageInfo, getReceipentsInfo, getTicketStateClosed, getExtraSelectionMultiples, getExtraSelectionMultipleCounts,
  getIncidentInjuriesInfo, getIncidentDamagesInfo, getIncidentTypeGroupsInfo, getDeleteAttatchmentInfo, getSpaceAllSearchLists, getDisplayNameInfo, getMaintenanceGroupsInfo, getEquipmentInfoReport, getIncidentStateGroupsInfo, getTicketSlaDetails, getSlaLevel1Details, getSlaLevel2Details, getSlaLevel3Details, getSlaLevel4Details, getSlaLevel5Details,
  getHelpdeskVendorsInfo, getHelpdeskReportsInfo, getTenantConfigurationInfo, getEnergyMetersInfo, updateDocumentsAttachInfo, getStatusLogsInfo, deleteBulkDataInfo, getAllowedCompaniesCxoInfo, getOnHoldRequestInfo, getCxoOperationTypesInfo, getModelFiltersInfo, getHelpdeskReportsNoLoadInfo, getRegionGroupsInfo, getSubCategoryGroupsInfo, getMultiModelDocuments, updateBulkDataInfo, createBulkDataInfo, getUploadImageFormInfo,
} from './actions';

export const GET_MESSAGE_RESET_INFO = 'GET_MESSAGE_RESET_INFO';
export const GET_IMAGE_RESET_INFO = 'GET_IMAGE_RESET_INFO';
export const GET_STATE_RESET_INFO = 'GET_STATE_RESET_INFO';
export const GET_SPACE_RESET_INFO = 'GET_SPACE_RESET_INFO';
export const GET_CLOSE_RESET_INFO = 'GET_CLOSE_RESET_INFO';
export const RESET_ADD_TICKET_INFO = 'RESET_ADD_TICKET_INFO';
export const RESET_UPDATE_TICKET_INFO = 'RESET_UPDATE_TICKET_INFO';
export const RESET_TICKET_DETAILS = 'RESET_TICKET_DETAILS';
export const RESET_DELETE_ATTATCHMENT_INFO = 'RESET_DELETE_ATTATCHMENT_INFO';
export const STORE_SURVEY_TOKEN = 'STORE_SURVEY_TOKEN';
export const RESET_EXTRA_LIST = 'RESET_EXTRA_LIST';
export const ACTIVE_STEP_INFO = 'ACTIVE_STEP_INFO';
export const SET_CURRENT_TICKET_DETAIL_TAB = 'SET_CURRENT_TICKET_DETAIL_TAB';
export const RESET_MESSAGE_TEMPLATE_INFO = 'RESET_MESSAGE_TEMPLATE_INFO';
export const RESET_SHARE_TICKET_INFO = 'RESET_SHARE_TICKET_INFO';
export const HELPDESK_REPORT_FILTERS = 'HELPDESK_REPORT_FILTERS';
export const RESET_HELPDESK_REPORTS_INFO = 'RESET_HELPDESK_REPORTS_INFO';
export const RESET_DOCUMENTATT_INFO = 'RESET_DOCUMENTATT_INFO';
export const RESET_OH_REQUEST_INFO = 'RESET_OH_REQUEST_INFO';
export const RESET_ONHOLD_TICKET_INFO = 'RESET_ONHOLD_TICKET_INFO';
export const STORE_SSO_TOKEN = 'STORE_SSO_TOKEN';

export function getTicketList(company, model, limit, offset, fields, states, categories, priorities, customFilters, sortByValue, sortFieldValue, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  return (dispatch) => {
    dispatch(getTicketsInfo(company, model, limit, offset, fields, states, categories, priorities, customFilters, sortByValue, sortFieldValue, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants));
  };
}

export function getDisplayName(company, model, ids) {
  return (dispatch) => {
    dispatch(getDisplayNameInfo(company, model, ids));
  };
}

export function getTicketsExport(company, model, limit, offset, fields, states, categories, priorities, customFilters, rows, isIncident, sortBy, sortField, maintenanceTeam, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  return (dispatch) => {
    dispatch(getTicketsExportInfo(company, model, limit, offset, fields, states, categories, priorities, customFilters, rows, isIncident, sortBy, sortField, maintenanceTeam, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants));
  };
}

export function createTicket(payload) {
  return (dispatch) => {
    dispatch(addTicketInfo(payload));
  };
}

export function getTicketCount(company, model, states, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  return (dispatch) => {
    dispatch(getTicketsCount(company, model, states, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subCategory, globalFilter, aiFilter, isTenantTickets, allowedTenants));
  };
}

export function getMaintenanceGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getMaintenanceGroupsInfo(company, model, isIncident));
  };
}

export function getSpacesList(company, model, keyword, category) {
  return (dispatch) => {
    dispatch(getSpacesInfo(company, model, keyword, category));
  };
}

export function getSpacesAll(company, model) {
  return (dispatch) => {
    dispatch(getSpacesAllInfo(company, model));
  };
}

export function getCategoryList(company, model, keyword, isIncident) {
  return (dispatch) => {
    dispatch(getCategoryInfo(company, model, keyword, isIncident));
  };
}

export function getSubCategoryList(company, model, category, keyword) {
  return (dispatch) => {
    dispatch(getSubCategoryInfo(company, model, category, keyword));
  };
}

export function getEquipmentList(company, model, keyword, isITAsset, filterBy, filterValue, filterOperator, categoryKeyword, ids, parent) {
  return (dispatch) => {
    dispatch(getEquipmentInfo(company, model, keyword, isITAsset, filterBy, filterValue, filterOperator, categoryKeyword, ids, parent));
  };
}

export function getEquipmentListReport(company, model, keyword, spaceValue) {
  return (dispatch) => {
    dispatch(getEquipmentInfoReport(company, model, keyword, spaceValue));
  };
}

export function getSpaceAllSearchList(company, model, keyword, filterBy, filterValue, filterOperator) {
  return (dispatch) => {
    dispatch(getSpaceAllSearchLists(company, model, keyword, filterBy, filterValue, filterOperator));
  };
}

export function getCategoryGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model, isIncident));
  };
}

export function getSubCategoryGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getSubCategoryGroupsInfo(company, model, isIncident));
  };
}

export function getRegionsGroups(company, model) {
  return (dispatch) => {
    dispatch(getRegionGroupsInfo(company, model));
  };
}

export function getStateGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getStateGroupsInfo(company, model, isIncident));
  };
}

export function getIncidentStateGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getIncidentStateGroupsInfo(company, model, isIncident));
  };
}

export function getPriorityGroups(company, model, isIncident) {
  return (dispatch) => {
    dispatch(getPriorityGroupsInfo(company, model, isIncident));
  };
}

export function getTicketDetail(id, model) {
  return (dispatch) => {
    dispatch(getTicketData(id, model));
  };
}
export function getTicketSlaDetail(id, model) {
  return (dispatch) => {
    dispatch(getTicketSlaDetails(id, model));
  };
}
export function getSlaLevel1Detail(id, model) {
  return (dispatch) => {
    dispatch(getSlaLevel1Details(id, model));
  };
}
export function getSlaLevel2Detail(id, model) {
  return (dispatch) => {
    dispatch(getSlaLevel2Details(id, model));
  };
}
export function getSlaLevel3Detail(id, model) {
  return (dispatch) => {
    dispatch(getSlaLevel3Details(id, model));
  };
}
export function getSlaLevel4Detail(id, model) {
  return (dispatch) => {
    dispatch(getSlaLevel4Details(id, model));
  };
}
export function getSlaLevel5Detail(id, model) {
  return (dispatch) => {
    dispatch(getSlaLevel5Details(id, model));
  };
}

export function getEquipmentDocument(id, resModel, model, ticketId) {
  return (dispatch) => {
    dispatch(getEquipmentDocuments(id, resModel, model, ticketId));
  };
}

export function onDocumentCreates(values) {
  return (dispatch) => {
    dispatch(onDocumentCreate(values));
  };
}

export function onDocumentCreatesAttach(values) {
  return (dispatch) => {
    dispatch(onDocumentCreatesAttachment(values));
  };
}

export function fileDownloads(tid, id, resModel, model) {
  return (dispatch) => {
    dispatch(fileDownload(tid, id, resModel, model));
  };
}

export function getHelpdeskDashboard(start, end, dashboardName) {
  return (dispatch) => {
    dispatch(getHelpdeskDashboardInfo(start, end, dashboardName));
  };
}
export function getHelpdeskFilter(payload) {
  return (dispatch) => {
    dispatch(getHelpdeskFilters(payload));
  };
}

export function getCheckedRows(payload) {
  return (dispatch) => {
    dispatch(getCheckedRowsInfo(payload));
  };
}

export function getUploadImage(payload) {
  return (dispatch) => {
    dispatch(getUploadImageInfo(payload));
  };
}
export function getUploadImageForm(payload) {
  return (dispatch) => {
    dispatch(getUploadImageFormInfo(payload));
  };
}

export function getCascader(payload) {
  return (dispatch) => {
    dispatch(getCascaderInfo(payload));
  };
}

export function escalateTicket(id, model, method) {
  return (dispatch) => {
    dispatch(escalateTicketInfo(id, model, method));
  };
}

export function resetMessage(result) {
  return {
    type: GET_MESSAGE_RESET_INFO,
    payload: result,
  };
}

export function resetImage(result) {
  return {
    type: GET_IMAGE_RESET_INFO,
    payload: result,
  };
}

export function resetSpace(result) {
  return {
    type: GET_SPACE_RESET_INFO,
    payload: result,
  };
}

export function resetEscalate(result) {
  return {
    type: GET_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetClose(result) {
  return {
    type: GET_CLOSE_RESET_INFO,
    payload: result,
  };
}

export function resetAddTicket(result) {
  return {
    type: RESET_ADD_TICKET_INFO,
    payload: result,
  };
}
export function resetTicketDetails(result) {
  return {
    type: RESET_TICKET_DETAILS,
    payload: result,
  };
}
export function resetUpdateTicket(result) {
  return {
    type: RESET_UPDATE_TICKET_INFO,
    payload: result,
  };
}

export function ticketStateChange(id, state, modelName) {
  return (dispatch) => {
    dispatch(ticketStateChangeInfo(id, state, modelName));
  };
}

export function getSpaceChilds(company, model, parentId) {
  return (dispatch) => {
    dispatch(getSpaceChildsInfo(company, model, parentId));
  };
}

export function createCloseTicket(result) {
  return (dispatch) => {
    dispatch(createCloseTicketInfo(result));
  };
}

export function createMessage(values, model) {
  return (dispatch) => {
    dispatch(createMessageInfo(values, model));
  };
}

export function getReceipents(id, modelName) {
  return (dispatch) => {
    dispatch(getReceipentsInfo(id, modelName));
  };
}

export function getPriorityList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getPriorityInfo(company, model, keyword));
  };
}

export function getTicketNames(company, model, keyword, isIncident) {
  return (dispatch) => {
    dispatch(getTicketNamesInfo(company, model, keyword, isIncident));
  };
}

export function getExtraSelection(company, model, limit, offset, fields, name, otherFieldName, otherFieldValue, sortField, domain) {
  return (dispatch) => {
    dispatch(getExtraSelectionInfo(company, model, limit, offset, fields, name, otherFieldName, otherFieldValue, sortField, domain));
  };
}

export function getExtraSelectionCount(company, model, name, otherFieldName, otherFieldValue, domain) {
  return (dispatch) => {
    dispatch(getExtraSelectionCountInfo(company, model, name, otherFieldName, otherFieldValue, domain));
  };
}

export function getExtraSelectionMultiple(company, model, limit, offset, fields, searchValueMultiple, noOrder, endpoint, isIot, uuid, sortedValueDashboard) {
  return (dispatch) => {
    dispatch(getExtraSelectionMultiples(company, model, limit, offset, fields, searchValueMultiple, noOrder, endpoint, isIot, uuid, sortedValueDashboard));
  };
}

export function getExtraSelectionMultipleCount(company, model, fields, searchValueMultiple, endpoint, isIot, uuid) {
  return (dispatch) => {
    dispatch(getExtraSelectionMultipleCounts(company, model, fields, searchValueMultiple, endpoint, isIot, uuid));
  };
}

export function getTicketStateClose(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTicketStateClosed(company, model, keyword));
  };
}

export function updateTicket(id, model, payload, isApproval, method, args, onHoldRejectRemarks, isPPM, ppmData, tMail) {
  return (dispatch) => {
    dispatch(updateTicketInfo(id, model, payload, isApproval, method, args, onHoldRejectRemarks, isPPM, ppmData, tMail));
  };
}

export function getTicketOrders(ids, model) {
  return (dispatch) => {
    dispatch(getTicketOrdersInfo(ids, model));
  };
}

export function getIncidentTypes(company, model, keyword, limit) {
  return (dispatch) => {
    dispatch(getIncidentTypesInfo(company, model, keyword, limit));
  };
}

export function getIncidentSeverties(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIncidentSevertiesInfo(company, model, keyword));
  };
}

export function getIncidentInjuries(company, ids, model) {
  return (dispatch) => {
    dispatch(getIncidentInjuriesInfo(company, ids, model));
  };
}

export function getIncidentDamages(company, ids, model) {
  return (dispatch) => {
    dispatch(getIncidentDamagesInfo(company, ids, model));
  };
}

export function getIncidentTypeGroups(company, model) {
  return (dispatch) => {
    dispatch(getIncidentTypeGroupsInfo(company, model));
  };
}

export function getDeleteAttatchment(id) {
  return (dispatch) => {
    dispatch(getDeleteAttatchmentInfo(id));
  };
}

export function resetDeleteAttatchment(result) {
  return {
    type: RESET_DELETE_ATTATCHMENT_INFO,
    payload: result,
  };
}

export function storeSurveyToken(result) {
  return {
    type: STORE_SURVEY_TOKEN,
    payload: result,
  };
}

export function resetExtraMultipleList(result) {
  return {
    type: RESET_EXTRA_LIST,
    payload: result,
  };
}

export function getSiteBasedCategory(type, categoryId, isIncident, company) {
  return (dispatch) => {
    dispatch(getSiteBasedCategoryInfo(type, categoryId, isIncident, company));
  };
}

export function getOrdersFullDetails(company, model, id) {
  return (dispatch) => {
    dispatch(getOrdersFullDetailsInfo(company, model, id));
  };
}

export function getMaintenanceConfig(company, model) {
  return (dispatch) => {
    dispatch(getMaintenanceConfigList(company, model));
  };
}

export function getMaintenanceConfigurationData(company, model) {
  return (dispatch) => {
    dispatch(getMaintenanceConfigurationInfo(company, model));
  };
}

export function activeStepInfo(result) {
  return {
    type: ACTIVE_STEP_INFO,
    payload: result,
  };
}

export function getHelpdeskTeams(type, equipmentId, spaceId, categoryId, company, model, keyword) {
  return (dispatch) => {
    dispatch(getHelpdeskTeamsInfo(type, equipmentId, spaceId, categoryId, company, model, keyword));
  };
}

export function setTicketCurrentTab(result) {
  return {
    type: SET_CURRENT_TICKET_DETAIL_TAB,
    payload: result,
  };
}

export function getMessageTemplate(id, company) {
  return (dispatch) => {
    dispatch(getMessageTemplateInfo(id, company));
  };
}

export function resetMessageTemplate(result) {
  return {
    type: RESET_MESSAGE_TEMPLATE_INFO,
    payload: result,
  };
}

export function shareTicketCall(result) {
  return (dispatch) => {
    dispatch(shareTicketInfo(result));
  };
}

export function resetshareTicket(result) {
  return {
    type: RESET_SHARE_TICKET_INFO,
    payload: result,
  };
}
export function getHelpdeskVendors(companyId) {
  return (dispatch) => {
    dispatch(getHelpdeskVendorsInfo(companyId));
  };
}

export function getReportFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: HELPDESK_REPORT_FILTERS,
    payload: result,
  };
}

export function getHelpdeskReports(company, model, fields, customFilters, sortByValue, sortFieldValue, selectedFilter, selectedDomain, isTenantTickets, allowedTenants) {
  return (dispatch) => {
    dispatch(getHelpdeskReportsInfo(company, model, fields, customFilters, sortByValue, sortFieldValue, selectedFilter, selectedDomain, isTenantTickets, allowedTenants));
  };
}

export function getHelpdeskReportsNoLoad(company, model, fields, customFilters, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getHelpdeskReportsNoLoadInfo(company, model, fields, customFilters, sortByValue, sortFieldValue));
  };
}

export function resetHelpdeskReport(result) {
  return {
    type: RESET_HELPDESK_REPORTS_INFO,
    payload: result,
  };
}

export function resetDocumentCreate(result) {
  return {
    type: RESET_DOCUMENTATT_INFO,
    payload: result,
  };
}

export function resetAttachementUpload(result) {
  return {
    type: RESET_DOCUMENTATT_INFO,
    payload: result,
  };
}
export function getMultiModelDocumentsData(ids, resModel1, resModel2, modelName, extraModel, extraIds) {
  return (dispatch) => {
    dispatch(getMultiModelDocuments(ids, resModel1, resModel2, modelName, extraModel, extraIds));
  };
}

export function getModelFilters(companyId, moduleName, model) {
  return (dispatch) => {
    dispatch(getModelFiltersInfo(companyId, moduleName, model));
  };
}

export function getCxoConfig(companies, uuid) {
  return (dispatch) => {
    dispatch(getCxoConfigInfo(companies, uuid));
  };
}

export function getCxoSections(domain, uuid) {
  return (dispatch) => {
    dispatch(getCxoSectionsInfo(domain, uuid));
  };
}

export function getCxoSectionsOperationTypes(sectionId, uuid) {
  return (dispatch) => {
    dispatch(getCxoSectionsOperationTypesInfo(sectionId, uuid));
  };
}

export function getCxoOperationTypes(uuid, fields, model, start, end, company) {
  return (dispatch) => {
    dispatch(getCxoOperationTypesInfo(uuid, fields, model, start, end, company));
  };
}

export function updateMultiModelData(model, result, uuid) {
  return (dispatch) => {
    dispatch(updateMultiModelDataInfo(model, result, uuid));
  };
}

export function createMultiModelData(model, result, uuid) {
  return (dispatch) => {
    dispatch(createMultiModelDataInfo(model, result, uuid));
  };
}

export function deleteBulkData(model, result, uuid) {
  return (dispatch) => {
    dispatch(deleteBulkDataInfo(model, result, uuid));
  };
}

export function updateBulkData(model, result) {
  return (dispatch) => {
    dispatch(updateBulkDataInfo(model, result));
  };
}

export function createBulkData(model, result) {
  return (dispatch) => {
    dispatch(createBulkDataInfo(model, result));
  };
}

export function getAllowedCompaniesCxo(companyId, uuid, companyCodes) {
  return (dispatch) => {
    dispatch(getAllowedCompaniesCxoInfo(companyId, uuid, companyCodes));
  };
}

export function getOnHoldRequest(id, result) {
  return (dispatch) => {
    dispatch(getOnHoldRequestInfo(id, result));
  };
}

export function resetOnHoldRequest(result) {
  return {
    type: RESET_OH_REQUEST_INFO,
    payload: result,
  };
}

export function resetOnHoldTicket(result) {
  return {
    type: RESET_ONHOLD_TICKET_INFO,
    payload: result,
  };
}

export function getStatusLogs(ids) {
  return (dispatch) => {
    dispatch(getStatusLogsInfo(ids));
  };
}

export function getEnergyMeters(model, uuid, devices) {
  return (dispatch) => {
    dispatch(getEnergyMetersInfo(model, uuid, devices));
  };
}

export function updateDocumentsAttach(ids, result) {
  return (dispatch) => {
    dispatch(updateDocumentsAttachInfo(ids, result));
  };
}

export function getTenantConfiguration() {
  return (dispatch) => {
    dispatch(getTenantConfigurationInfo());
  };
}

export function storeSSOToken(result) {
  return {
    type: STORE_SSO_TOKEN,
    payload: result,
  };
}
