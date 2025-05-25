/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import {
  getSiteListInfo, getSiteCountInfo,
  createSiteInfo,
  getSiteDetails, getSiteExportInfo, getCodeGroupsInfo, getUserSiteDetails,
  getAllowedModules, getTCLists, getCopyAllowedModules, getSiteDashboardInfo, getCategoryGroupsInfo, getParentSiteGroupsInfo, getParentCompanys, updateSiteInfo, getProblemCategoryListInfo, getProblemCategoryCountInfo, getProductCompanys,
  getProblemCategoryListExportInfo, getPcDetail, getProblemCategoryGroupListInfo, getProblemCategoryGroupCountInfo, getProblemCategoryGroupListExportInfo, getPCGDetail, getEsDetail,
  getSpaceCategoryListInfo, getSpaceCategoryCountInfo,
  getSpaceCategoryListExportInfo, getScDetail, getAssetCategoryListInfo, getAssetCategoryCountInfo, getAssetCategoryListExportInfo, getAcDetail, getHelpdeskSettingDetail, getAccessGroups, getInspectionSettingDetail, getRecipientLists, getWhatsappTemplates, getMailTemplates, getLabelLists, updateSiteConfiguartion, getEscalationLevelListInfo, getEscalationLevelCountInfo, getEscalationLevelListExportInfo, getSpaceLists, getEqipmentCategorys, getSpaceCategorys, getVMSSettingDetail, getPPMSettingDetail, getEscalationRecipientLists, getWorkpermitSettingDetail, getSmsTemplates, getInspectionMailTemplates, getInventorySettingDetail,
  getIncReportBs, getIncReportAs, getConfigurationSummaryInfo, getPantrySettingDetail, getMailRoomSettingDetail, getGatePassSettingDetail, getCompanyInfo, getOrderLinesInfo, getSubCategoryLists, getCategorytList, getAuditSpaceList, getAuditSettingDetail, getVisitorGroups, getAssetGroups,
  getWarehousesIdsList, updateHxModuleInfo, getTaskMessagesInfo, getTaskChecklistsInfo, updateHxTaskInfo,
} from './actions';

export const SITE_FILTERS = 'SITE_FILTERS';
export const RESET_ADD_SITE_INFO = 'RESET_ADD_SITE_INFO';
export const RESET_UPDATE_SITE_INFO = 'RESET_UPDATE_SITE_INFO';
export const GET_ROWS_SITE = 'GET_ROWS_SITE';
export const GET_RECIPIENT_ID = 'GET_RECIPIENT_ID';
export const GET_INV_RECIPIENT_ID = 'GET_INV_RECIPIENT_ID';
export const GET_SPACE_ID = 'GET_SPACE_ID';
export const RESET_TEMPLATE_SITE = 'RESET_TEMPLATE_SITE';
export const GET_SITE_STATE_RESET_INFO = 'GET_SITE_STATE_RESET_INFO';
export const RESET_RENEWAL_DETAIL = 'RESET_RENEWAL_DETAIL';
export const RESET_SITE_REPORT = 'RESET_SITE_REPORT';
export const RESET_COPY_STATUS = 'RESET_COPY_STATUS';
export const PC_FILTERS = 'PC_FILTERS';
export const SC_FILTERS = 'SC_FILTERS';
export const AC_FILTERS = 'AC_FILTERS';
export const RESET_PROBLEM_SITE = 'RESET_PROBLEM_SITE';
export const ESL_FILTERS = 'ESL_FILTERS';
export const RESET_TC = 'RESET_TC';
export const GET_HOST_ID = 'GET_HOST_ID';
export const GET_DOMAIN_ID = 'GET_DOMAIN_ID';
export const GET_VISITOR_TYPE_ID = 'GET_VISITOR_TYPE_ID';
export const GET_ASSET_ID = 'GET_ASSET_ID';
export const PCG_FILTERS = 'PCG_FILTERS';
export const GET_EQUIPMENT_ID = 'GET_EQUIPMENT_ID';
export const GET_SPACE_CATEGORY_ID = 'GET_SPACE_CATEGORY_ID';
export const GET_PC_ID = 'GET_PC_ID';
export const RESET_DETAIL_SITE_INFO = 'RESET_DETAIL_SITE_INFO';
export const RESET_WAREHOUSE_ID_INFO = 'RESET_WAREHOUSE_ID_INFO';
export const RESET_HX_TASK_INFO = 'RESET_HX_TASK_INFO';
export const RESET_UPDATE_HX_MODULE_INFO = 'RESET_UPDATE_HX_MODULE_INFO';

export function getSiteList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getSiteListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, globalFilter));
  };
}

export function getSiteExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getSiteExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getSiteCount(company, model, states, customFilters, keyword, globalFilter) {
  return (dispatch) => {
    dispatch(getSiteCountInfo(company, model, states, customFilters, keyword, globalFilter));
  };
}

export function getSiteFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: SITE_FILTERS,
    payload: result,
  };
}

export function resetAddSiteInfo(result) {
  return {
    type: RESET_ADD_SITE_INFO,
    payload: result,
  };
}

export function resetUpdateSiteInfo(result) {
  return {
    type: RESET_UPDATE_SITE_INFO,
    payload: result,
  };
}

export function resetDetailSiteInfo(result) {
  return {
    type: RESET_DETAIL_SITE_INFO,
    payload: result,
  };
}

export function getSiteDetail(id, model) {
  return (dispatch) => {
    dispatch(getSiteDetails(id, model));
  };
}

export function createSite(model, payload) {
  return (dispatch) => {
    dispatch(createSiteInfo(model, payload));
  };
}

export function updateSite(payload) {
  return (dispatch) => {
    dispatch(updateSiteInfo(payload));
  };
}

export function updateSiteConfiguartions(payload) {
  return (dispatch) => {
    dispatch(updateSiteConfiguartion(payload));
  };
}

export function getCheckedRowsSite(payload) {
  return {
    type: GET_ROWS_SITE,
    payload,
  };
}

export function setRecipientsLocationId(payload) {
  return {
    type: GET_RECIPIENT_ID,
    payload,
  };
}

export function setInvRecipientsLocationId(payload) {
  return {
    type: GET_INV_RECIPIENT_ID,
    payload,
  };
}

export function setSpaceId(payload) {
  return {
    type: GET_SPACE_ID,
    payload,
  };
}

export function setEquipmentId(payload) {
  return {
    type: GET_EQUIPMENT_ID,
    payload,
  };
}

export function setSpaceCategoryId(payload) {
  return {
    type: GET_SPACE_CATEGORY_ID,
    payload,
  };
}
export function setProblemCategoryId(payload) {
  return {
    type: GET_PC_ID,
    payload,
  };
}

export function getCodeGroups(company, model) {
  return (dispatch) => {
    dispatch(getCodeGroupsInfo(company, model));
  };
}

export function getParentSiteGroups(company, model) {
  return (dispatch) => {
    dispatch(getParentSiteGroupsInfo(company, model));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getUserSiteDetail(accessToken) {
  return (dispatch) => {
    dispatch(getUserSiteDetails(accessToken));
  };
}

export function getAllowedModule(model, keyword) {
  return (dispatch) => {
    dispatch(getAllowedModules(model, keyword));
  };
}

export function getTCList(company, model, keyword, sortField) {
  return (dispatch) => {
    dispatch(getTCLists(company, model, keyword, sortField));
  };
}

export function getAccessGroup(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAccessGroups(company, model, keyword));
  };
}

export function getVisitorGroup(company, model, keyword) {
  return (dispatch) => {
    dispatch(getVisitorGroups(company, model, keyword));
  };
}

export function getAssetGroup(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAssetGroups(company, model, keyword));
  };
}

export function getParentCompany(company, model, keyword) {
  return (dispatch) => {
    dispatch(getParentCompanys(company, model, keyword));
  };
}

export function getProductCompany(company, model, keyword) {
  return (dispatch) => {
    dispatch(getProductCompanys(company, model, keyword));
  };
}

export function getLabelList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getLabelLists(company, model, keyword));
  };
}

export function getCopyAllowedModule(id, model) {
  return (dispatch) => {
    dispatch(getCopyAllowedModules(id, model));
  };
}

export function resetSiteState(result) {
  return {
    type: GET_SITE_STATE_RESET_INFO,
    payload: result,
  };
}

export function resetCopyStatus(result) {
  return {
    type: RESET_COPY_STATUS,
    payload: result,
  };
}

export function resetTC(result) {
  return {
    type: RESET_TC,
    payload: result,
  };
}

export function getSiteDashboard(start, end) {
  return (dispatch) => {
    dispatch(getSiteDashboardInfo(start, end));
  };
}

export function getProblemCategoryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getProblemCategoryCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getProblemCategoryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getProblemCategoryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PC_FILTERS,
    payload: result,
  };
}

export function getPcDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getPcDetail(id, modelName));
  };
}

export function getProblemCategoryGroupList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryGroupListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getProblemCategoryGroupCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryGroupCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getProblemCategoryGroupListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getProblemCategoryGroupListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getProblemCategoryGroupFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: PCG_FILTERS,
    payload: result,
  };
}

export function getPCGDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getPCGDetail(id, modelName));
  };
}

export function getEsDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getEsDetail(id, modelName));
  };
}

export function getSpaceCategoryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, moduleName, globalFilter) {
  return (dispatch) => {
    dispatch(getSpaceCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, moduleName, globalFilter));
  };
}

export function getSpaceCategoryCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getSpaceCategoryCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getSpaceCategoryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getSpaceCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getSpaceCategoryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: SC_FILTERS,
    payload: result,
  };
}

export function getScDetails(model, keyword) {
  return (dispatch) => {
    dispatch(getScDetail(model, keyword));
  };
}

export function getAssetCategoryList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, moduleName, globalFilter) {
  return (dispatch) => {
    dispatch(getAssetCategoryListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, moduleName, globalFilter));
  };
}

export function getAssetCategoryCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getAssetCategoryCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getAssetCategoryListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getAssetCategoryListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getAssetCategoryFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: AC_FILTERS,
    payload: result,
  };
}

export function getAcDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getAcDetail(id, modelName));
  };
}

export function getHelpdeskSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getHelpdeskSettingDetail(id, modelName));
  };
}

export function getGatePassDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getGatePassSettingDetail(id, modelName));
  };
}

export function getAuditSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getAuditSettingDetail(id, modelName));
  };
}

export function getWorkpermitSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getWorkpermitSettingDetail(id, modelName));
  };
}

export function getInventorySettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getInventorySettingDetail(id, modelName));
  };
}

export function getPPMSettingsDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getPPMSettingDetail(id, modelName));
  };
}

export function getMailRoomSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getMailRoomSettingDetail(id, modelName));
  };
}

export function getPantrySettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getPantrySettingDetail(id, modelName));
  };
}

export function getVMSSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getVMSSettingDetail(id, modelName));
  };
}

export function setAllowedHostId(payload) {
  return {
    type: GET_HOST_ID,
    payload,
  };
}

export function setAllowedDomainId(payload) {
  return {
    type: GET_DOMAIN_ID,
    payload,
  };
}

export function setVisitorTypeId(payload) {
  return {
    type: GET_VISITOR_TYPE_ID,
    payload,
  };
}

export function setAssetId(payload) {
  return {
    type: GET_ASSET_ID,
    payload,
  };
}

export function getEscalationLevelList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getEscalationLevelListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getEscalationLevelCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getEscalationLevelCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getEscalationLevelListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getEscalationLevelListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getEscalationLevelFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: ESL_FILTERS,
    payload: result,
  };
}

export function getSpaceList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSpaceLists(company, model, keyword));
  };
}

export function getInspectionSettingDetails(id, modelName) {
  return (dispatch) => {
    dispatch(getInspectionSettingDetail(id, modelName));
  };
}

export function getRecipientList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getRecipientLists(company, model, keyword));
  };
}

export function getEscalationRecipientList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEscalationRecipientLists(company, model, keyword));
  };
}

export function getEqipmentCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEqipmentCategorys(company, model, keyword));
  };
}

export function getSpaceCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSpaceCategorys(company, model, keyword));
  };
}

export function getWhatsappTemplate(company, model, keyword) {
  return (dispatch) => {
    dispatch(getWhatsappTemplates(company, model, keyword));
  };
}

export function getMailTemplate(company, model, keyword, tempModel) {
  return (dispatch) => {
    dispatch(getMailTemplates(company, model, keyword, tempModel));
  };
}

export function getInspectionMailTemplate(company, model, keyword, module) {
  return (dispatch) => {
    dispatch(getInspectionMailTemplates(company, model, keyword, module));
  };
}

export function getIncReportB(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIncReportBs(company, model, keyword));
  };
}

export function getIncReportA(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIncReportAs(company, model, keyword));
  };
}

export function getSubCategoryList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSubCategoryLists(company, model, keyword));
  };
}

export function getCategorytLists(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCategorytList(company, model, keyword));
  };
}

export function getAuditSpaceLists(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAuditSpaceList(company, model, keyword));
  };
}

export function getSmsTemplate(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSmsTemplates(company, model, keyword));
  };
}

export function getCompany(company, model, keyword, isUser) {
  return (dispatch) => {
    dispatch(getCompanyInfo(company, model, keyword, isUser));
  };
}

export function getOrderLineInfo(company, model, ids) {
  return (dispatch) => {
    dispatch(getOrderLinesInfo(company, model, ids));
  };
}

export function getWarehousesIds(company, model) {
  return (dispatch) => {
    dispatch(getWarehousesIdsList(company, model));
  };
}

export function getConfigurationSummary(company, model, noload) {
  return (dispatch) => {
    dispatch(getConfigurationSummaryInfo(company, model, noload));
  };
}

export function updateHxModule(id, model, result) {
  return (dispatch) => {
    dispatch(updateHxModuleInfo(id, model, result));
  };
}

export function updateHxTask(id, model, result) {
  return (dispatch) => {
    dispatch(updateHxTaskInfo(id, model, result));
  };
}

export function resetHxTask(result) {
  return {
    type: RESET_HX_TASK_INFO,
    payload: result,
  };
}

export function resetUpdateHxModule(result) {
  return {
    type: RESET_UPDATE_HX_MODULE_INFO,
    payload: result,
  };
}

export function resetWarehouseId(result) {
  return {
    type: RESET_WAREHOUSE_ID_INFO,
    payload: result,
  };
}

export function getTaskMessages(id) {
  return (dispatch) => {
    dispatch(getTaskMessagesInfo(id));
  };
}

export function getTaskChecklists(id) {
  return (dispatch) => {
    dispatch(getTaskChecklistsInfo(id));
  };
}
