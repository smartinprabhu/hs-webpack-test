import {
  getCompanyData,
  getSites, getTeamCategoryInfo, getTeamLeaderInfo, getWorkingTimeInfo, getMaintenanceCostAnalysisInfo,
  getTeamInfo,
  createTeamInfo,
  getTeamsCountInfo,
  getTeamMemberInfo,
  getTeamMembersCountInfo,
  getShiftInfo, getShiftsCountInfo, getTenantInfo, getTenantsCountInfo,
  getCountriesInfo, getStatesInfo, getCreateSiteInfo, getUpdateSiteInfo, getCreateShiftInfo,
  getCreateTenantInfo, getCreateToolsInfo, getProductCategoriesInfo,
  getCreatePartsInfo,
  getUsersCountInfo, getUsersListInfo,
  getRolesGroupsInfo,
  createUserInfo, getShiftsListInfo, getDepartmentsInfo,
  getCompanyCategoriesInfo, getSubCompanyCategoriesInfo, getCurrencyInfo,
  getIncotermsInfo, getNomenClaturesInfo,
  updateCompanyInfo,
  getSitesListInfo, getSitesCountInfo,
  getCountryGroupsInfo, updateUserInfo, getUserDetailsInfo, getSiteData, getAllowComapanies,
  geTenantDetailInfo,
  getCovidResourcesInfo, updateTenantInfoNoLoad,
  updateTenantInfo, getChecklistSelectedInfo,
  saveCompanyInfo, checkUserExistsInfo,
  getAllCountriesInfo, editTeamInfo, getAllowedModulesInfo,
  getTeamDetailInfo, getTeamSpacesInfo,
  getMemberTeamsInfo, getTeamsExportInfo,
  getTeamMembersExportInfo, getVpConfigInfo,
  getShiftsExportInfo, getTenantsExportInfo,
  getShiftDetailInfo, getShiftUpdateInfo,
  teamDeleteInfo, updateUserPasswordInfo,
  getPPMListInfo,
  getPPMListCountInfo,
  getPPMListExportInfo,
  getInspectionListInfo,
  getInspectionListCountInfo,
  getInspectionListExportInfo,
  getUserSessionInfo, setRemoveImproperSessionsInfo, getPasswordExistsInfo,
  getDesignationsInfo, getCompanyRegionsInfo, getAllCompanyTeamsInfo, getUserCompanyTeamsInfo, updateUserTeamsInfo,
  getBulkInspectionInfo, getBulkInspectionExportInfo, getBulkInspectionCountInfo, getArchiveInfo, getSiteExportInfo,
} from './actions';

export const RESET_CREATE_TEAM_INFO = 'RESET_CREATE_TEAM_INFO';
export const RESET_CREATE_SITE_INFO = 'RESET_CREATE_SITE_INFO';
export const RESET_CREATE_SHIFT_INFO = 'RESET_CREATE_SHIFT_INFO';
export const RESET_UPDATE_SHIFT_INFO = 'RESET_UPDATE_SHIFT_INFO';
export const RESET_UPDATE_SITE_INFO = 'RESET_UPDATE_SITE_INFO';
export const RESET_CREATE_TENANT_INFO = 'RESET_CREATE_TENANT_INFO';
export const RESET_CREATE_TOOLS_INFO = 'RESET_CREATE_TOOLS_INFO';
export const RESET_CREATE_PARTS_INFO = 'RESET_CREATE_PARTS_INFO';
export const RESET_CREATE_USER_INFO = 'RESET_CREATE_USER_INFO';
export const RESET_UPDATE_USER_INFO = 'RESET_UPDATE_USER_INFO';
export const RESET_UPDATE_COMPANY_INFO = 'RESET_UPDATE_COMPANY_INFO';
export const RESET_UPDATE_TENANT_INFO = 'RESET_UPDATE_TENANT_INFO';
export const RESET_COMPANY_INFO_SAVE = 'RESET_COMPANY_INFO_SAVE';
export const GET_ALLOW_COMPANIES_RESET = 'GET_ALLOW_COMPANIES_RESET';
export const RESET_USER_INFO = 'RESET_USER_INFO';
export const RESET_SITE_INFO = 'RESET_SITE_INFO';
export const USER_FILTERS = 'USER_FILTERS';
export const SITE_FILTERS = 'SITE_FILTERS';
export const RESET_COMPANY_DETAIL = 'RESET_COMPANY_DETAIL';
export const SET_CURRENT_TAB = 'SET_CURRENT_TAB';
export const RESET_EDIT_TEAM = 'RESET_EDIT_TEAM';
export const RESET_EXISTS_USERS_COUNT = 'RESET_EXISTS_USERS_COUNT';
export const STORE_SELECTED_MEMBERS = 'STORE_SELECTED_MEMBERS';
export const RESET_SELECTED_MEMBERS = 'RESET_SELECTED_MEMBERS';
export const RESET_TEAM_DELETE_INFO = 'RESET_TEAM_DELETE_INFO';
export const RESET_USER_PASSWORD_UPDATE_INFO = 'RESET_USER_PASSWORD_UPDATE_INFO';
export const DATA_FILTERS = 'DATA_FILTERS';
export const ACTIVE_STEP = 'ACTIVE_STEP';
export const TEAM_FILTERS = 'TEAM_FILTERS';
export const RESET_ADD_TEAM_INFO = 'RESET_ADD_TEAM_INFO';
export const TEAM_MEMBER_FILTERS = 'TEAM_MEMBER_FILTERS';
export const CLEAR_TEAM_MEMBER_FILTERS = 'CLEAR_TEAM_MEMBER_FILTERS';
export const RESET_UPDATE_TEAMS_INFO_FAILURE = 'RESET_UPDATE_TEAMS_INFO_FAILURE';
export const RESET_TENANT_NO_INFO = 'RESET_TENANT_NO_INFO';
export const STORE_SELECTED_SPACES = 'STORE_SELECTED_SPACES';
export const STORE_MODIFIED_Data = 'STORE_MODIFIED_Data';
export const RESET_ARCHIVE_INFO = 'RESET_ARCHIVE_INFO';
export const RESET_PASSWORD_EXISTS_INFO = 'RESET_PASSWORD_EXISTS_INFO';
export const INSPECTION_FILTERS = 'INSPECTION_FILTERS';
export const INCREMENT_NOTIFICATION_COUNT = 'INCREMENT_NOTIFICATION_COUNT';
export const RESET_NOTIFICATION_COUNT = 'RESET_NOTIFICATION_COUNT';

export function getAllCompanyTeams(company) {
  return (dispatch) => {
    dispatch(getAllCompanyTeamsInfo(company));
  };
}

export function getUserCompanyTeams(ids) {
  return (dispatch) => {
    dispatch(getUserCompanyTeamsInfo(ids));
  };
}
export function updateUserTeams(model, id, values) {
  return (dispatch) => {
    dispatch(updateUserTeamsInfo(model, id, values));
  };
}
export function getCompanyDetail(id, model) {
  return (dispatch) => {
    dispatch(getCompanyData(id, model));
  };
}

export function getSiteDetail(id, model) {
  return (dispatch) => {
    dispatch(getSiteData(id, model));
  };
}

export function getTeamsInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, teamId, globalFilter, fields) {
  return (dispatch) => {
    dispatch(getTeamInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, teamId, globalFilter, fields));
  };
}

export function getTeamsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getTeamsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getTeamMembersExport(id, model, limit, offset, columns, searchValue, rows, customFiltersList, globalFilter, isUser, isActiveUser) {
  return (dispatch) => {
    dispatch(getTeamMembersExportInfo(id, model, limit, offset, columns, searchValue, rows, customFiltersList, globalFilter, isUser, isActiveUser));
  };
}

export function getTeamsCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getTeamsCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getTeamMembersInfo(id, model, limit, offset, sortBy, sortField, searchValue, customFilters, globalFilter, fields, isUser, isActiveUser) {
  return (dispatch) => {
    dispatch(getTeamMemberInfo(id, model, limit, offset, sortBy, sortField, searchValue, customFilters, globalFilter, fields, isUser, isActiveUser));
  };
}

export function getTeamMembersCount(id, model, searchValue, customFilters, globalFilter, isUser, isActiveUser) {
  return (dispatch) => {
    dispatch(getTeamMembersCountInfo(id, model, searchValue, customFilters, globalFilter, isUser, isActiveUser));
  };
}

export function getShiftsInfo(id, model, limit, offset, sortBy, sortField, searchValue) {
  return (dispatch) => {
    dispatch(getShiftInfo(id, model, limit, offset, sortBy, sortField, searchValue));
  };
}

export function getShiftsCount(id, model, searchValue) {
  return (dispatch) => {
    dispatch(getShiftsCountInfo(id, model, searchValue));
  };
}

export function getTenantsInfo(id, model, limit, offset, sortBy, sortField, searchValue) {
  return (dispatch) => {
    dispatch(getTenantInfo(id, model, limit, offset, sortBy, sortField, searchValue));
  };
}

export function getTenantsCount(id, model, searchValue) {
  return (dispatch) => {
    dispatch(getTenantsCountInfo(id, model, searchValue));
  };
}

export function getSiteInfo(id, model) {
  return (dispatch) => {
    dispatch(getSites(id, model));
  };
}

export function getTeamCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTeamCategoryInfo(company, model, keyword));
  };
}

export function getCovidResources(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCovidResourcesInfo(company, model, keyword));
  };
}

export function getTeamLeader(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTeamLeaderInfo(company, model, keyword));
  };
}

export function getWorkingTime(company, model, keyword, fields, limit) {
  return (dispatch) => {
    dispatch(getWorkingTimeInfo(company, model, keyword, fields, limit));
  };
}

export function getMaintenanceCostAnalysis(company, model, keyword, fields, limit) {
  return (dispatch) => {
    dispatch(getMaintenanceCostAnalysisInfo(company, model, keyword, fields, limit));
  };
}

export function createTeam(model, payload) {
  return (dispatch) => {
    dispatch(createTeamInfo(model, payload));
  };
}

export function resetCreateTeam(result) {
  return {
    type: RESET_CREATE_TEAM_INFO,
    payload: result,
  };
}

export function getCountries(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCountriesInfo(company, model, keyword));
  };
}

export function getAllCountries() {
  return (dispatch) => {
    dispatch(getAllCountriesInfo());
  };
}

export function getStates(model, typeId, keyword) {
  return (dispatch) => {
    dispatch(getStatesInfo(model, typeId, keyword));
  };
}

export function createSite(model, payload) {
  return (dispatch) => {
    dispatch(getCreateSiteInfo(model, payload));
  };
}

export function updateSite(id, model, payload) {
  return (dispatch) => {
    dispatch(getUpdateSiteInfo(id, model, payload));
  };
}

export function clearteamMemberFilter(result) {
  return {
    type: CLEAR_TEAM_MEMBER_FILTERS,
    payload: result,
  };
}

export function resetCreateSite(result) {
  return {
    type: RESET_CREATE_SITE_INFO,
    payload: result,
  };
}

export function resetUpdateSite(result) {
  return {
    type: RESET_UPDATE_SITE_INFO,
    payload: result,
  };
}

export function resetSiteDetails(result) {
  return {
    type: RESET_SITE_INFO,
    payload: result,
  };
}

export function resetAllowedCompanyDetails(result) {
  return {
    type: GET_ALLOW_COMPANIES_RESET,
    payload: result,
  };
}
export function resetUpdateTeams(result) {
  return {
    type: RESET_UPDATE_TEAMS_INFO_FAILURE,
    payload: result,
  };
}
export function resetUserDetails(result) {
  return {
    type: RESET_USER_INFO,
    payload: result,
  };
}

export function createShift(model, payload) {
  return (dispatch) => {
    dispatch(getCreateShiftInfo(model, payload));
  };
}

export function resetCreateShift(result) {
  return {
    type: RESET_CREATE_SHIFT_INFO,
    payload: result,
  };
}

export function createTenant(model, payload) {
  return (dispatch) => {
    dispatch(getCreateTenantInfo(model, payload));
  };
}

export function resetCreateTenant(result) {
  return {
    type: RESET_CREATE_TENANT_INFO,
    payload: result,
  };
}

export function createTools(model, payload) {
  return (dispatch) => {
    dispatch(getCreateToolsInfo(model, payload));
  };
}

export function resetCreateTools(result) {
  return {
    type: RESET_CREATE_TOOLS_INFO,
    payload: result,
  };
}

export function createParts(model, payload) {
  return (dispatch) => {
    dispatch(getCreatePartsInfo(model, payload));
  };
}

export function resetCreateParts(result) {
  return {
    type: RESET_CREATE_PARTS_INFO,
    payload: result,
  };
}

export function getProductCategories(company, model, keyword) {
  return (dispatch) => {
    dispatch(getProductCategoriesInfo(company, model, keyword));
  };
}

export function getUsersList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  return (dispatch) => {
    dispatch(getUsersListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword));
  };
}

export function getUsersCount(company, model, customFilters, keyword) {
  return (dispatch) => {
    dispatch(getUsersCountInfo(company, model, customFilters, keyword));
  };
}

export function getUserFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: USER_FILTERS,
    payload: result,
  };
}

export function getRolesGroups(company, model, keyword) {
  return (dispatch) => {
    dispatch(getRolesGroupsInfo(company, model, keyword));
  };
}

export function createUser(model, payload) {
  return (dispatch) => {
    dispatch(createUserInfo(model, payload));
  };
}

export function updateUser(id, result, model) {
  return (dispatch) => {
    dispatch(updateUserInfo(id, result, model));
  };
}

export function resetCreateUser(result) {
  return {
    type: RESET_CREATE_USER_INFO,
    payload: result,
  };
}

export function resetUpdateUser(result) {
  return {
    type: RESET_UPDATE_USER_INFO,
    payload: result,
  };
}

export function getShifts(company, model, keyword) {
  return (dispatch) => {
    dispatch(getShiftsListInfo(company, model, keyword));
  };
}

export function getDepartments(company, model, keyword, inventory) {
  return (dispatch) => {
    dispatch(getDepartmentsInfo(company, model, keyword, inventory));
  };
}

export function getCompanyCategories(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCompanyCategoriesInfo(company, model, keyword));
  };
}

export function getSubCompanyCategories(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSubCompanyCategoriesInfo(company, model, keyword));
  };
}

export function getAllowComapaniesData(model, ids) {
  return (dispatch) => {
    dispatch(getAllowComapanies(model, ids));
  };
}

export function getCurrency(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCurrencyInfo(company, model, keyword));
  };
}

export function getIncoterms(company, model, keyword) {
  return (dispatch) => {
    dispatch(getIncotermsInfo(company, model, keyword));
  };
}

export function getNomenClatures(company, model, keyword) {
  return (dispatch) => {
    dispatch(getNomenClaturesInfo(company, model, keyword));
  };
}

export function updateCompany(id, payload, model) {
  return (dispatch) => {
    dispatch(updateCompanyInfo(id, payload, model));
  };
}
export function getUserDetails(company, model, userId, teamMemberId) {
  return (dispatch) => {
    dispatch(getUserDetailsInfo(company, model, userId, teamMemberId));
  };
}

export function resetUpdateCompany(result) {
  return {
    type: RESET_UPDATE_COMPANY_INFO,
    payload: result,
  };
}

export function getSitesList(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getSitesListInfo(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getSitesCount(company, model, parentId, states, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getSitesCountInfo(company, model, parentId, states, customFilters, globalFilter));
  };
}
export function getSiteExport(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, rows, globalFilter) {
  return (dispatch) => {
    dispatch(getSiteExportInfo(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, rows, globalFilter));
  };
}

export function getSiteFilters(statusValues, customFiltersList) {
  const result = { statuses: statusValues, customFilters: customFiltersList };
  return {
    type: SITE_FILTERS,
    payload: result,
  };
}

export function getCountryGroups(parentId, model) {
  return (dispatch) => {
    dispatch(getCountryGroupsInfo(parentId, model));
  };
}

export function geTenantDetail(id, model) {
  return (dispatch) => {
    dispatch(geTenantDetailInfo(id, model));
  };
}

export function updateTenant(id, payload, model) {
  return (dispatch) => {
    dispatch(updateTenantInfo(id, payload, model));
  };
}

export function updateTenantNo(id, payload, model) {
  return (dispatch) => {
    dispatch(updateTenantInfoNoLoad(id, payload, model));
  };
}

export function resetUpdateTenant(result) {
  return {
    type: RESET_UPDATE_TENANT_INFO,
    payload: result,
  };
}

export function resetSaveCompany(result) {
  return {
    type: RESET_COMPANY_INFO_SAVE,
    payload: result,
  };
}

export function saveCompany(result) {
  return (dispatch) => {
    dispatch(saveCompanyInfo(result));
  };
}

export function getChecklistSelected(id, payload, model) {
  return (dispatch) => {
    dispatch(getChecklistSelectedInfo(id, payload, model));
  };
}

export function resetCompanyDetail(result) {
  return {
    type: RESET_COMPANY_DETAIL,
    payload: result,
  };
}

export function setCurrentTab(result) {
  return {
    type: SET_CURRENT_TAB,
    payload: result,
  };
}

export function editTeam(id, model, result) {
  return (dispatch) => {
    dispatch(editTeamInfo(id, model, result));
  };
}
export function resetEditTeam(result) {
  return {
    type: RESET_EDIT_TEAM,
    payload: result,
  };
}

export function getAllowedCompaniesInfo(accessToken, isChild, id) {
  return (dispatch) => {
    dispatch(getAllowedModulesInfo(accessToken, isChild, id));
  };
}

export function resetUsersCount(result) {
  return {
    type: RESET_EXISTS_USERS_COUNT,
    payload: result,
  };
}

export function storeSelectedMembers(result) {
  return {
    type: STORE_SELECTED_MEMBERS,
    payload: result,
  };
}

export function resetSelectedMembers(result) {
  return {
    type: RESET_SELECTED_MEMBERS,
    payload: result,
  };
}

export function checkUserExists(company, model, mail) {
  return (dispatch) => {
    dispatch(checkUserExistsInfo(company, model, mail));
  };
}

export function getTeamDetail(id, model) {
  return (dispatch) => {
    dispatch(getTeamDetailInfo(id, model));
  };
}

export function resetTeamsInfo(result) {
  return {
    type: RESET_ADD_TEAM_INFO,
    payload: result,
  };
}

export function getTeamFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: TEAM_FILTERS,
    payload: result,
  };
}

export function getTeamMemberFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: TEAM_MEMBER_FILTERS,
    payload: result,
  };
}

export function getTeamSpaces(company, values, modelName) {
  return (dispatch) => {
    dispatch(getTeamSpacesInfo(company, values, modelName));
  };
}

export function getMemberTeams(company, values, modelName) {
  return (dispatch) => {
    dispatch(getMemberTeamsInfo(company, values, modelName));
  };
}

export function getVpConfig(uuid) {
  return (dispatch) => {
    dispatch(getVpConfigInfo(uuid));
  };
}

export function getShiftsExport(id, model, limit, offset, columns, searchValue, rows) {
  return (dispatch) => {
    dispatch(getShiftsExportInfo(id, model, limit, offset, columns, searchValue, rows));
  };
}

export function getTenantsExport(id, model, limit, offset, columns, searchValue, rows) {
  return (dispatch) => {
    dispatch(getTenantsExportInfo(id, model, limit, offset, columns, searchValue, rows));
  };
}

export function getShiftDetail(id, model) {
  return (dispatch) => {
    dispatch(getShiftDetailInfo(id, model));
  };
}

export function getShiftUpdate(id, payload, model) {
  return (dispatch) => {
    dispatch(getShiftUpdateInfo(id, payload, model));
  };
}

export function resetUpdateShift(result) {
  return {
    type: RESET_UPDATE_SHIFT_INFO,
    payload: result,
  };
}

export function teamDelete(id, teamId) {
  return (dispatch) => {
    dispatch(teamDeleteInfo(id, teamId));
  };
}

export function resetDeleteTeam(result) {
  return {
    type: RESET_TEAM_DELETE_INFO,
    payload: result,
  };
}

export function updateUserPassword(payload) {
  return (dispatch) => {
    dispatch(updateUserPasswordInfo(payload));
  };
}

export function resetupdateUserPasswordInfo(result) {
  return {
    type: RESET_USER_PASSWORD_UPDATE_INFO,
    payload: result,
  };
}

export function getDesignations(company, model, keyword) {
  return (dispatch) => {
    dispatch(getDesignationsInfo(company, model, keyword));
  };
}

export function getUserSession(payload) {
  return (dispatch) => {
    dispatch(getUserSessionInfo(payload));
  };
}

export function setRemoveImproperSessions(payload) {
  return (dispatch) => {
    dispatch(setRemoveImproperSessionsInfo(payload));
  };
}

export function getCheckListData(result) {
  return {
    type: DATA_FILTERS,
    payload: result,
  };
}

export function getActiveStep(result) {
  return {
    type: ACTIVE_STEP,
    payload: result,
  };
}

export function getCompanyRegions(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCompanyRegionsInfo(company, model, keyword));
  };
}

export function resetUpdateVisitor(result) {
  return {
    type: RESET_TENANT_NO_INFO,
    payload: result,
  };
}

export function storeSelectedSpaces(result) {
  return {
    type: STORE_SELECTED_SPACES,
    payload: result,
  };
}

export function storeModifiedData(result) {
  return {
    type: STORE_MODIFIED_Data,
    payload: result,
  };
}

export function getBulkInspection(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields) {
  return (dispatch) => {
    dispatch(getBulkInspectionInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields));
  };
}
export function getBulkInspectionExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getBulkInspectionExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getBulkInspectionCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getBulkInspectionCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getArchive(id, model, result) {
  return (dispatch) => {
    dispatch(getArchiveInfo(id, model, result));
  };
}

export function getPasswordExists(id, state, modelName, data) {
  return (dispatch) => {
    dispatch(getPasswordExistsInfo(id, state, modelName, data));
  };
}

export function resetArchive(result) {
  return {
    type: RESET_ARCHIVE_INFO,
    payload: result,
  };
}

export function resetPasswordExists(result) {
  return {
    type: RESET_PASSWORD_EXISTS_INFO,
    payload: result,
  };
}

export function incrementNotificationCount(result) {
  return {
    type: INCREMENT_NOTIFICATION_COUNT,
    payload: result,
  };
}

export function resetNotificationCount(result) {
  return {
    type: RESET_NOTIFICATION_COUNT,
    payload: result,
  };
}


export function getPPMList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields) {
  return (dispatch) => {
    dispatch(getPPMListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields));
  };
}
export function getPPMListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getPPMListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getPPMListCount(company, model, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getPPMListCountInfo(company, model, customFilters, globalFilter));
  };
}

export function getInspectionFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: INSPECTION_FILTERS,
    payload: result,
  };
}

export function getInspectionList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields, today, holidayStart, holidayEnd) {
  return (dispatch) => {
    dispatch(getInspectionListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields, today, holidayStart, holidayEnd));
  };
}
export function getInspectionListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getInspectionListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getInspectionListCount(company, model, customFilters, globalFilter, today, holidayStart, holidayEnd) {
  return (dispatch) => {
    dispatch(getInspectionListCountInfo(company, model, customFilters, globalFilter, today, holidayStart, holidayEnd));
  };
}
