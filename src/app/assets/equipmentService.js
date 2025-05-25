import {
  getEquipmentsInfo, getEquipmentsCount, getCategoryInfo,
  getTeamInfo, getEmployeeInfo, createAssetInfo, getCategoryGroupsInfo,
  getAssetDetails, getSpaceChildsInfo, getFloorsInfo, getSpaceInfo, getLocationImage,
  getAssetDashboardInfo, getExpiryAssetsInfo, getAuditLogsInfo, getReleatedAssetsInfo,
  getMaintenanceTypeDueGroupsInfo, getMaintenanceTypeGroupsInfo, getSpaceAssetsGroupsInfo,
  getSpaceEquipmentsInfo, getSpaceEquipmentsExportInfo, getSpaceTicketStatesInfo, equipmentStateChangeInfo, getEquipmentsExportInfo,
  getGaugesInfo, getMetersInfo, getFloorChildsInfo, moveAssetLocationInfo, updateEquipmentInfo, getMetersListInfo,
  getOperatingHoursInfo, getPartnersInfo, getSpaceTypesInfo, getSpaceSubTypesInfo, createSpaceInfo,
  getUNSPCCodeInfo, updateLocationDataInfo, getUNSPCOtherCodeInfo, getEmployeeDataInfo, getSpacesCountInfo, getGaugesListInfo,
  getSpaceLineValuesInfo, getBuildingsInfo, getBuilingChildsInfo, createBreakdownReason, createAssignmentLocations, equipmentOperativeChangeInfo,
  getMailActivityLogsinfo, getReadingsInfo, getReadingsDetailInfo, getDataLinesInfo, getReadingsLogInfo, getReadingsLogCount,
  getReadingsLogExportInfo, getReadingsList, getPreventiveCheckLists, getTeamCategoryInfo, getAlarmCategoryInfo, getAlarmRecipientsInfo,
  getAlarmActionsInfo, createReadingLogInfo, createImportIdInfo, getQRCodeImageInfo, getAllSpacesInfo, getCategoryDetailInfo, getAllLocationsInfo,
  getSpaceNames, getAssetNames, getSpacePath, getVendorGroupsInfo, uploadImportInfo, getEquimentsFloorMapInfo, getAuditReports, getHistoryCardInfo, getWarrentyAgeReports, getMaintenanceGroupsInfo,
  getGlobalCategoriesInfo, getAssetAvailabilityInfo, getAssetMisplacedInfo, getSpacesListInfo, getSpacesTableCountInfo, getSpaceTableExportInfo,
  getThresholdDataInfo, getPublicDashboardUuidInfo, getVisitPurposesInfo, getIncidentReportInfo,
  getReportedByLists, getAcceptedByLists, getLocationDataInfo, getLocationCountInfo, getSpacesInfo, getLocationExportInfo, getCategoryCountInfo, getAssetsBasedOnCategoryInfo, getAssetsBasedOnCategoryExportInfo, getAssetsBasedOnCategoryCountInfo, getEquipmentCostInfo,
} from './actions';

export const EQUIPMENT_FILTERS = 'EQUIPMENT_FILTERS';
export const GET_ROWS_EQUIPMENT = 'GET_ROWS_EQUIPMENT';
export const GET_SCRAP_RESET_INFO = 'GET_SCRAP_RESET_INFO';
export const STORE_SELECT_SPACE = 'STORE_SELECT_SPACE';
export const RESET_SELECT_SPACE = 'RESET_SELECT_SPACE';
export const RESET_ASSET_MOVE_INFO = 'RESET_ASSET_MOVE_INFO';
export const RESET_ASSET_READINGS = 'RESET_ASSET_READINGS';
export const RESET_UPDATE_EQUIPMENT_INFO = 'RESET_UPDATE_EQUIPMENT_INFO';
export const RESET_CREATE_SPACE_INFO = 'RESET_CREATE_SPACE_INFO';
export const GET_ROWS_RESET_INFO = 'GET_ROWS_RESET_INFO';
export const RESET_UPDATE_LOCATION_INFO = 'RESET_UPDATE_LOCATION_INFO';
export const RESET_ADD_ASSET_INFO = 'RESET_ADD_ASSET_INFO';
export const RESET_ADD_LOCATION_INFO = 'RESET_ADD_LOCATION_INFO';
export const RESET_CREATE_BREAKDOWN = 'RESET_CREATE_BREAKDOWN';
export const RESET_OPERATIVE_INFO = 'RESET_OPERATIVE_INFO';
export const RESET_LOCATION_INFO = 'RESET_LOCATION_INFO';
export const READING_LOG_FILTERS = 'READING_LOG_FILTERS';
export const RESET_ADD_READING_INFO = 'RESET_ADD_READING_INFO';
export const READING_REDIRECT_ID = 'READING_REDIRECT_ID';
export const RESET_EXPORT = 'RESET_EXPORT';
export const RESET_UPLOAD_BULK_INFO = 'RESET_UPLOAD_BULK_INFO';
export const RESET_SPACE_INFO = 'RESET_SPACE_INFO';
export const RESET_FLOOR_MAP_EQUIPMENTS = 'RESET_FLOOR_MAP_EQUIPMENTS';
export const RESET_AUDIT_INFO = 'RESET_AUDIT_INFO';
export const RESET_SPACE_EQUIPMENTS = 'RESET_SPACE_EQUIPMENTS';
export const RESET_HISTORY_CARD = 'RESET_HISTORY_CARD';
export const RESET_WO_REPORT = 'RESET_WO_REPORT';
export const SET_SORTING = 'SET_SORTING';
export const RESET_AVL_INFO = 'RESET_AVL_INFO';
export const RESET_INCIDENT_INFO = 'RESET_INCIDENT_INFO';
export const RESET_MP_INFO = 'RESET_MP_INFO';
export const RESET_SPACE_EXPORT_EQUIPMENTS = 'RESET_SPACE_EXPORT_EQUIPMENTS';

export const RESET_ASSET_DETAILS = 'RESET_ASSET_DETAILS';
export const STORE_INITIAL_EXPORT_DATA = 'STORE_INITIAL_EXPORT_DATA';
export const RESET_INITIAL_EXPORT_DATA = 'RESET_INITIAL_EXPORT_DATA';

export const GET_SENSOR_INFO = 'GET_SENSOR_INFO';
export const GET_SENSOR_INFO_SUCCESS = 'GET_SENSOR_INFO_SUCCESS';
export const GET_SENSOR_INFO_FAILURE = 'GET_SENSOR_INFO_FAILURE';

export const GET_SENSOR_TREND_INFO = 'GET_SENSOR_TREND_INFO';
export const GET_SENSOR_TREND_INFO_SUCCESS = 'GET_SENSOR_TREND_INFO_SUCCESS';
export const GET_SENSOR_TREND_INFO_FAILURE = 'GET_SENSOR_TREND_INFO_FAILURE';

export const SET_CURRENT_THRESHOLD = 'SET_CURRENT_THRESHOLD';
export const SET_ASSET_DATE = 'SET_ASSET_DATE';
export const SHIFT_HAND_OVER_REPORT = 'SHIFT_HAND_OVER_REPORT';
export const AUDIT_REPORT = 'AUDIT_REPORT';
export const AVAILABILITY_REPORT = 'AVAILABILITY_REPORT';
export const MISPLACED_REPORT = 'MISPLACED_REPORT';
export const WARRANTY_AGE_REPORT = 'WARRANTY_AGE_REPORT';
export const SET_SORTING_DASHBOARD = 'SET_SORTING_DASHBOARD';

export function setSorting(result) {
  return {
    type: SET_SORTING,
    payload: result,
  };
}

export function setSortingDashboard(result) {
  return {
    type: SET_SORTING_DASHBOARD,
    payload: result,
  };
}

export function getAllLocationsData(company, model, sortByValue, keyword) {
  return (dispatch) => {
    dispatch(getAllLocationsInfo(company, model, sortByValue, keyword));
  };
}

export function getEquipmentList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory, aiFilter) {
  return (dispatch) => {
    dispatch(getEquipmentsInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory, aiFilter));
  };
}
export function getEquipmentsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType) {
  return (dispatch) => {
    dispatch(getEquipmentsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType));
  };
}

export function getEquipmentCount(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory, aiFilter) {
  return (dispatch) => {
    dispatch(getEquipmentsCount(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory, aiFilter));
  };
}

export function getCategoryList(company, model, keyword, limit, offset) {
  return (dispatch) => {
    dispatch(getCategoryInfo(company, model, keyword), limit, offset);
  };
}

export function getCategoryCount(company, model, keyword) {
  return (dispatch) => {
    dispatch(getCategoryCountInfo(company, model, keyword));
  };
}

export function getTeamList(company, model, keyword, category, fields) {
  return (dispatch) => {
    dispatch(getTeamInfo(company, model, keyword, category, fields));
  };
}

export function getReportedByList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getReportedByLists(company, model, keyword));
  };
}

export function getAcceptedByList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAcceptedByLists(company, model, keyword));
  };
}

export function getEmployeeList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEmployeeInfo(company, model, keyword));
  };
}

export function getEmployeeDataList(company, model, keyword, team, dept, moduleName) {
  return (dispatch) => {
    dispatch(getEmployeeDataInfo(company, model, keyword, team, dept, moduleName));
  };
}

export function createAsset(payload) {
  return (dispatch) => {
    dispatch(createAssetInfo(payload));
  };
}

export function createAssignmentLocation(payload) {
  return (dispatch) => {
    dispatch(createAssignmentLocations(payload));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getVendorGroups(company, model, field) {
  return (dispatch) => {
    dispatch(getVendorGroupsInfo(company, model, field));
  };
}

export function getMaintenanceGroups(company, model, field) {
  return (dispatch) => {
    dispatch(getMaintenanceGroupsInfo(company, model, field));
  };
}

export function getAssetDetail(id, model, isSchool, target, sequence) {
  return (dispatch) => {
    dispatch(getAssetDetails(id, model, isSchool, target, sequence));
  };
}

export function getSpaceChilds(company, model, parentId) {
  return (dispatch) => {
    dispatch(getSpaceChildsInfo(company, model, parentId));
  };
}

export function getFloorChilds(company, model, parentId) {
  return (dispatch) => {
    dispatch(getFloorChildsInfo(company, model, parentId));
  };
}

export function getFloorsList(company, model, keyword, parentId, type) {
  return (dispatch) => {
    dispatch(getFloorsInfo(company, model, keyword, parentId, type));
  };
}

export function getBuildings(company, model, keyword, fields, limit, type) {
  return (dispatch) => {
    dispatch(getBuildingsInfo(company, model, keyword, fields, limit, type));
  };
}
export function getSpaces(company, model, keyword, category, categoryName) {
  return (dispatch) => {
    dispatch(getSpacesInfo(company, model, keyword, category, categoryName));
  };
}

export function getLocationData(company, model, keyword, category, sortBy, sortField, limit, offset, filters, globalFilter,isDropdown) {
  return (dispatch) => {
    dispatch(getLocationDataInfo(company, model, keyword, category, sortBy, sortField, limit, offset, filters, globalFilter, isDropdown));
  };
}
export function getLocationCount(company, model, category, filters, globalFilter) {
  return (dispatch) => {
    dispatch(getLocationCountInfo(company, model, category, filters, globalFilter));
  };
}

export function getLocationExport(company, model, keyword, category, sortBy, sortField, limit, offset, rows, filters, globalFilter) {
  return (dispatch) => {
    dispatch(getLocationExportInfo(company, model, keyword, category, sortBy, sortField, limit, offset, rows, filters, globalFilter));
  };
}

export function getBuilingChilds(company, model, parentId) {
  return (dispatch) => {
    dispatch(getBuilingChildsInfo(company, model, parentId));
  };
}

export function getSpaceData(model, id, fields, target, sequence) {
  return (dispatch) => {
    dispatch(getSpaceInfo(model, id, fields, target, sequence));
  };
}

export function getSpaceName(model, id) {
  return (dispatch) => {
    dispatch(getSpaceNames(model, id));
  };
}

export function getAssetName(model, id) {
  return (dispatch) => {
    dispatch(getAssetNames(model, id));
  };
}

export function getLocationImageInfo(company, id, model) {
  return (dispatch) => {
    dispatch(getLocationImage(company, id, model));
  };
}

export function resetLocationInfo() {
  return {
    type: RESET_LOCATION_INFO,
  };
}

export function getAssetDashboard(dashboardName) {
  return (dispatch) => {
    dispatch(getAssetDashboardInfo(dashboardName));
  };
}

export function getExpiryAssets(start, end, company, model) {
  return (dispatch) => {
    dispatch(getExpiryAssetsInfo(start, end, company, model));
  };
}

export function getAuditLogs(ids, model) {
  return (dispatch) => {
    dispatch(getAuditLogsInfo(ids, model));
  };
}

export function getReleatedAssets(model, ids) {
  return (dispatch) => {
    dispatch(getReleatedAssetsInfo(model, ids));
  };
}

export function getMaintenanceTypeGroups(id, model) {
  return (dispatch) => {
    dispatch(getMaintenanceTypeGroupsInfo(id, model));
  };
}

export function getMaintenanceTypeDueGroups(id, model, today) {
  return (dispatch) => {
    dispatch(getMaintenanceTypeDueGroupsInfo(id, model, today));
  };
}

export function getGauges(ids, model) {
  return (dispatch) => {
    dispatch(getGaugesInfo(ids, model));
  };
}

export function getMeters(ids, model) {
  return (dispatch) => {
    dispatch(getMetersInfo(ids, model));
  };
}

export function getSpaceLineValues(ids, model) {
  return (dispatch) => {
    dispatch(getSpaceLineValuesInfo(ids, model));
  };
}

export function getSpaceAssetsGroups(company, space, model) {
  return (dispatch) => {
    dispatch(getSpaceAssetsGroupsInfo(company, space, model));
  };
}

export function getSpaceEquipments(company, space, category, model, sortBy, sortField, isFloor) {
  return (dispatch) => {
    dispatch(getSpaceEquipmentsInfo(company, space, category, model, sortBy, sortField, isFloor));
  };
}
export function getSpaceExportEquipments(company, space, category, model, sortBy, sortField) {
  return (dispatch) => {
    dispatch(getSpaceEquipmentsExportInfo(company, space, category, model, sortBy, sortField));
  };
}

export function getEquipmentFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: EQUIPMENT_FILTERS,
    payload: result,
  };
}

export function getCheckedRows(result) {
  return {
    type: GET_ROWS_EQUIPMENT,
    payload: result,
  };
}

export function equipmentStateChange(id, state, model) {
  return (dispatch) => {
    dispatch(equipmentStateChangeInfo(id, state, model));
  };
}

export function equipmentOperativeChange(id, state, model, result) {
  return (dispatch) => {
    dispatch(equipmentOperativeChangeInfo(id, state, model, result));
  };
}

export function getSpaceTicketStates(id, model) {
  return (dispatch) => {
    dispatch(getSpaceTicketStatesInfo(id, model));
  };
}

export function moveAssetLocation(id, result, model) {
  return (dispatch) => {
    dispatch(moveAssetLocationInfo(id, result, model));
  };
}

export function updateEquipmentData(id, result, model) {
  return (dispatch) => {
    dispatch(updateEquipmentInfo(id, result, model));
  };
}

export function resetScrap(result) {
  return {
    type: GET_SCRAP_RESET_INFO,
    payload: result,
  };
}

export function storeSelectedSpace(result) {
  return {
    type: STORE_SELECT_SPACE,
    payload: result,
  };
}

export function storeInitialExportData(result) {
  return {
    type: STORE_INITIAL_EXPORT_DATA,
    payload: result,
  };
}

export function resetInitialExportData(result) {
  return {
    type: RESET_INITIAL_EXPORT_DATA,
    payload: result,
  };
}

export function resetSelectedSpace(result) {
  return {
    type: RESET_SELECT_SPACE,
    payload: result,
  };
}

export function resetMoveAsset(result) {
  return {
    type: RESET_ASSET_MOVE_INFO,
    payload: result,
  };
}

export function resetReadings(result) {
  return {
    type: RESET_ASSET_READINGS,
    payload: result,
  };
}

export function resetUpdateEquipment(result) {
  return {
    type: RESET_UPDATE_EQUIPMENT_INFO,
    payload: result,
  };
}

export function getOperatingHours(company, model, keyword) {
  return (dispatch) => {
    dispatch(getOperatingHoursInfo(company, model, keyword));
  };
}

export function getPartners(company, model, type, keyword, id, validEmail) {
  return (dispatch) => {
    dispatch(getPartnersInfo(company, model, type, keyword, id, validEmail));
  };
}

export function getSpaceTypes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSpaceTypesInfo(company, model, keyword));
  };
}

export function getSpaceSubTypes(company, model, typeId, keyword) {
  return (dispatch) => {
    dispatch(getSpaceSubTypesInfo(company, model, typeId, keyword));
  };
}

export function createSpace(model, payload) {
  return (dispatch) => {
    dispatch(createSpaceInfo(model, payload));
  };
}

export function resetCreateSpace(result) {
  return {
    type: RESET_CREATE_SPACE_INFO,
    payload: result,
  };
}

export function resetCreateBreakdown(result) {
  return {
    type: RESET_CREATE_BREAKDOWN,
    payload: result,
  };
}

export function resetCheckedRows(result) {
  return {
    type: GET_ROWS_RESET_INFO,
    payload: result,
  };
}

export function getUNSPSCCodes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getUNSPCCodeInfo(company, model, keyword));
  };
}

export function getUNSPSCOtherCodes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getUNSPCOtherCodeInfo(company, model, keyword));
  };
}

export function getGaugesList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getGaugesListInfo(company, model, keyword));
  };
}

export function getMetersList(company, model, keyword) {
  return (dispatch) => {
    dispatch(getMetersListInfo(company, model, keyword));
  };
}

export function updateLocationData(id, result, model) {
  return (dispatch) => {
    dispatch(updateLocationDataInfo(id, result, model));
  };
}

export function resetUpdateLocationInfo(result) {
  return {
    type: RESET_UPDATE_LOCATION_INFO,
    payload: result,
  };
}

export function resetAddAssetInfo(result) {
  return {
    type: RESET_ADD_ASSET_INFO,
    payload: result,
  };
}

export function resetAddLocationInfo(result) {
  return {
    type: RESET_ADD_LOCATION_INFO,
    payload: result,
  };
}

export function resetOperativeInfo(result) {
  return {
    type: RESET_OPERATIVE_INFO,
    payload: result,
  };
}

export function createBreakdown(payload) {
  return (dispatch) => {
    dispatch(createBreakdownReason(payload));
  };
}

export function getSpacesCount(company, model) {
  return (dispatch) => {
    dispatch(getSpacesCountInfo(company, model));
  };
}

export function getMailActivityLogs(resModel, resId, model) {
  return (dispatch) => {
    dispatch(getMailActivityLogsinfo(resModel, resId, model));
  };
}

export function getReadings(ids, model, sortField, sortBy,fields) {
  return (dispatch) => {
    dispatch(getReadingsInfo(ids, model, sortField, sortBy, fields));
  };
}

export function getHistoryCard(ids, model, sortField, sortBy) {
  return (dispatch) => {
    dispatch(getHistoryCardInfo(ids, model, sortField, sortBy));
  };
}

export function getReadingsDetail(id, model) {
  return (dispatch) => {
    dispatch(getReadingsDetailInfo(id, model));
  };
}

export function getDataLines(id, model) {
  return (dispatch) => {
    dispatch(getDataLinesInfo(id, model));
  };
}

export function getReadingsLog(id, model, limit, offset, fields, domain, readings, customFiltersList, sortByValue, sortFieldValue, globalFilter) {
  return (dispatch) => {
    dispatch(getReadingsLogInfo(id, model, limit, offset, fields, domain, readings, customFiltersList, sortByValue, sortFieldValue, globalFilter));
  };
}

export function getReadingsLogFilters(statusValues, customFiltersList) {
  const result = { statuses: statusValues, customFilters: customFiltersList };
  return {
    type: READING_LOG_FILTERS,
    payload: result,
  };
}

export function getReadingsLogCounts(id, model, domain, readings, customFilters, globalFilter) {
  return (dispatch) => {
    dispatch(getReadingsLogCount(id, model, domain, readings, customFilters, globalFilter));
  };
}

export function getReadingsLogExport(id, model, limit, offset, fields, domain, readings, customFilters, rows, sortBy, sortField, globalFilter) {
  return (dispatch) => {
    dispatch(getReadingsLogExportInfo(id, model, limit, offset, fields, domain, readings, customFilters, rows, sortBy, sortField, globalFilter));
  };
}

export function getReading(model, keyword) {
  return (dispatch) => {
    dispatch(getReadingsList(model, keyword));
  };
}

export function getPreventiveCheckList(company, model) {
  return (dispatch) => {
    dispatch(getPreventiveCheckLists(company, model));
  };
}

export function getTeamCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getTeamCategoryInfo(company, model, keyword));
  };
}

export function getAlarmCategory(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAlarmCategoryInfo(company, model, keyword));
  };
}

export function getAlarmRecipients(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAlarmRecipientsInfo(company, model, keyword));
  };
}

export function getAlarmActions(company, model, keyword) {
  return (dispatch) => {
    dispatch(getAlarmActionsInfo(company, model, keyword));
  };
}

export function getSpacePaths(company, model, keyword) {
  return (dispatch) => {
    dispatch(getSpacePath(company, model, keyword));
  };
}

export function createReadingLog(model, payload) {
  return (dispatch) => {
    dispatch(createReadingLogInfo(model, payload));
  };
}

export function resetAddReadingLogInfo(result) {
  return {
    type: RESET_ADD_READING_INFO,
    payload: result,
  };
}

export function setReadingRedirectId(result) {
  return {
    type: READING_REDIRECT_ID,
    payload: result,
  };
}

export function resetEquipmentExport(result) {
  return {
    type: RESET_EXPORT,
    payload: result,
  };
}

export function createImportId(model, payload) {
  return (dispatch) => {
    dispatch(createImportIdInfo(model, payload));
  };
}

export function uploadImport(payload) {
  return (dispatch) => {
    dispatch(uploadImportInfo(payload));
  };
}

export function resetUploadImport(result) {
  return {
    type: RESET_UPLOAD_BULK_INFO,
    payload: result,
  };
}

export function getQRCodeImage(company, model) {
  return (dispatch) => {
    dispatch(getQRCodeImageInfo(company, model));
  };
}

export function resetSpaceData(result) {
  return {
    type: RESET_SPACE_INFO,
    payload: result,
  };
}

export function getEquimentsFloorMap(company, space, category, model) {
  return (dispatch) => {
    dispatch(getEquimentsFloorMapInfo(company, space, category, model));
  };
}

export function resetFloorMapEquipments(result) {
  return {
    type: RESET_FLOOR_MAP_EQUIPMENTS,
    payload: result,
  };
}

export function getAllSpaces(building, company, isSpecificFields) {
  return (dispatch) => {
    dispatch(getAllSpacesInfo(building, company, isSpecificFields));
  };
}

export function getAuditReport(company, model, start, end, groupBy, validStatus) {
  return (dispatch) => {
    dispatch(getAuditReports(company, model, start, end, groupBy, validStatus));
  };
}

export function resetAuditReport(result) {
  return {
    type: RESET_AUDIT_INFO,
    payload: result,
  };
}

export function getCategoryDetail(id, model) {
  return (dispatch) => {
    dispatch(getCategoryDetailInfo(id, model));
  };
}

export function resetSpaceEquipments(result) {
  return {
    type: RESET_SPACE_EQUIPMENTS,
    payload: result,
  };
}

export function getWarrentyAgeReport(company, model, limit, offset, fields, searchValueMultiple, noOrder) {
  return (dispatch) => {
    dispatch(getWarrentyAgeReports(company, model, limit, offset, fields, searchValueMultiple, noOrder));
  };
}

export function resetWarrentyAgeReport(result) {
  return {
    type: RESET_WO_REPORT,
    payload: result,
  };
}

export function getGlobalCategories(company) {
  return (dispatch) => {
    dispatch(getGlobalCategoriesInfo(company));
  };
}

export function getAssetAvailability(space) {
  return (dispatch) => {
    dispatch(getAssetAvailabilityInfo(space));
  };
}

export function getIncidentReport(company, model, teamId, reportedId, acceptedId, reportedStart, reportedEnd, acceptedStart, acceptedEnd, state) {
  return (dispatch) => {
    dispatch(getIncidentReportInfo(company, model, teamId, reportedId, acceptedId, reportedStart, reportedEnd, acceptedStart, acceptedEnd, state));
  };
}

export function getAssetMisplaced(date, asset, space) {
  return (dispatch) => {
    dispatch(getAssetMisplacedInfo(date, asset, space));
  };
}

export function resetAssetAvailability(result) {
  return {
    type: RESET_AVL_INFO,
    payload: result,
  };
}

export function resetIncidentReport(result) {
  return {
    type: RESET_INCIDENT_INFO,
    payload: result,
  };
}

export function resetAssetDetails(result) {
  return {
    type: RESET_ASSET_DETAILS,
    payload: result,
  };
}

export function resetAssetMisplaced(result) {
  return {
    type: RESET_MP_INFO,
    payload: result,
  };
}

export function resetSpaceExport(result) {
  return {
    type: RESET_SPACE_EXPORT_EQUIPMENTS,
    payload: result,
  };
}

export function initiateSensorInfo(result) {
  return {
    type: GET_SENSOR_INFO,
    payload: result,
  };
}

export function getSensorInfoSuccess(result) {
  return {
    type: GET_SENSOR_INFO_SUCCESS,
    payload: result,
  };
}

export function getSensorInfoFailure(result) {
  return {
    type: GET_SENSOR_INFO_FAILURE,
    payload: result,
  };
}

export function initiateSensorTrendInfo(result) {
  return {
    type: GET_SENSOR_TREND_INFO,
    payload: result,
  };
}

export function getSensorTrendInfoSuccess(result) {
  return {
    type: GET_SENSOR_TREND_INFO_SUCCESS,
    payload: result,
  };
}

export function getSensorTrendInfoFailure(result) {
  return {
    type: GET_SENSOR_TREND_INFO_FAILURE,
    payload: result,
  };
}

export function setCurrentThreshold(result) {
  return {
    type: SET_CURRENT_THRESHOLD,
    payload: result,
  };
}

export function getThresholdData() {
  return (dispatch) => {
    dispatch(getThresholdDataInfo());
  };
}

export function storeAssetDate(result) {
  return {
    type: SET_ASSET_DATE,
    payload: result,
  };
}

export function getPublicDashboardUuid(company, floor, model) {
  return (dispatch) => {
    dispatch(getPublicDashboardUuidInfo(company, floor, model));
  };
}

export function getVisitPurposes(company, model, keyword) {
  return (dispatch) => {
    dispatch(getVisitPurposesInfo(company, model, keyword));
  };
}

export function getEquipmentCost(company, model, keyword) {
  return (dispatch) => {
    dispatch(getEquipmentCostInfo(company, model, keyword));
  };
}

export function shiftHandoverReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: SHIFT_HAND_OVER_REPORT,
    payload: resultData,
  };
}

export function auditReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: AUDIT_REPORT,
    payload: resultData,
  };
}

export function availabilityReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: AVAILABILITY_REPORT,
    payload: resultData,
  };
}

export function misplacedReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: MISPLACED_REPORT,
    payload: resultData,
  };
}

export function warrantyReportFilters(result) {
  const resultData = { customFilters: result };
  return {
    type: WARRANTY_AGE_REPORT,
    payload: resultData,
  };
}

export function getAssetsBasedOnCategory(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, categoryType, categoryId, globalFilter, fields) {
  return (dispatch) => {
    dispatch(getAssetsBasedOnCategoryInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword,categoryType, categoryId, globalFilter, fields));
  };
}
export function getAssetsBasedOnCategoryExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, categoryType, categoryId, globalFilter) {
  return (dispatch) => {
    dispatch(getAssetsBasedOnCategoryExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, categoryType, categoryId, globalFilter));
  };
}

export function getAssetsBasedOnCategoryCount(company, model, customFilters, categoryType, categoryId, globalFilter) {
  return (dispatch) => {
    dispatch(getAssetsBasedOnCategoryCountInfo(company, model, customFilters, categoryType, categoryId, globalFilter));
  };
}

export function getSpacesList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory) {
  return (dispatch) => {
    dispatch(getSpacesListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory));
  };
}
export function getSpaceTableExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType) {
  return (dispatch) => {
    dispatch(getSpaceTableExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType));
  };
}

export function getSpacesTableCount(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory) {
  return (dispatch) => {
    dispatch(getSpacesTableCountInfo(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory));
  };
}
