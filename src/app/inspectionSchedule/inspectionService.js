import {
  getInspectionCheckListInfo, getInspectionCheckListExportInfo,
  getInspectionCheckListCountInfo, getInspectionViewerGroupsInfo, getPageSpaceGroupsInfo,
  getInspectionChecklistsGroupsInfo, getCustomGroupInfo, getInspectionDetailInfo, getPageGroupsInfo,
  getInspectionSchedulertDetailInfo, createInspectionInfo, getInspectionCommenceDateInfo, getInspectionViewerGroupsExportInfo,
  getPPMChecklistsInfo, getPPMDetailInfo, getPPMChecklistsCountInfo, getInspectionViewerGroupsCountInfo,
  getInspectionStatusGroupsInfo, getInspectionChecklistsInfo, getOrderDataInfo, getParentSchdulesInfo,
  getHxCancelRequestsListInfo, getAssetPPMSchdulesInfo, getHxCancelRequestsExportInfo, getHxInspCancelDetailsInfo, getHxCancelRequestsCountInfo,
} from './actions';

export const HX_INSP_CANCEL_FILTERS = 'HX_INSP_CANCEL_FILTERS';
export const INSPECTION_DASHBOARD_FILTERS = 'INSPECTION_DASHBOARD_FILTERS';
export const RESET_INSPECTION_CHECKLIST_GROUP_INFO = 'RESET_INSPECTION_CHECKLIST_GROUP_INFO';
export const RESET_EQUIPMENT_GROUP_INFO = 'RESET_EQUIPMENT_GROUP_INFO';
export const RESET_SPACE_GROUP_INFO = 'RESET_SPACE_GROUP_INFO';
export const RESET_CREATE_INSPECTION = 'RESET_CREATE_INSPECTION';
export const RESET_CUSTOM_GROUP = 'RESET_CUSTOM_GROUP';
export const INSPECTION_FILTERS = 'INSPECTION_FILTERS';

export function getInspectionCheckList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getInspectionCheckListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword));
  };
}

export function getInspectionCheckListExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue) {
  return (dispatch) => {
    dispatch(getInspectionCheckListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue));
  };
}

export function getInspectionCheckListCount(company, model, customFilters, globalFilter, keyword) {
  return (dispatch) => {
    dispatch(getInspectionCheckListCountInfo(company, model, customFilters, globalFilter, keyword));
  };
}

export function getInspectionFilters(customFiltersList) {
  const result = { customFilters: customFiltersList };
  return {
    type: INSPECTION_FILTERS,
    payload: result,
  };
}

export function getCancelRequestFilters(customFiltersList) {
  return {
    type: HX_INSP_CANCEL_FILTERS,
    payload: customFiltersList,
  };
}

export function getInspectionViewerGroups(company, model, start, end, selectedFilter, selectedField, groupFilters, ids, limit, teamsList, enforceField, inspectionGroup) {
  return (dispatch) => {
    dispatch(getInspectionViewerGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, ids, limit, teamsList, enforceField, inspectionGroup));
  };
}

export function getInspectionViewerGroupsCount(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList, assetIds, enforceField, inspectionGroup) {
  return (dispatch) => {
    dispatch(getInspectionViewerGroupsCountInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList, assetIds, enforceField, inspectionGroup));
  };
}

export function getInspectionChecklistsGroups(company, model) {
  return (dispatch) => {
    dispatch(getInspectionChecklistsGroupsInfo(company, model));
  };
}

export function getCustomGroup(company, model, field, id, companyType, isPpm, teamsList, isDate, start, end, isMonth) {
  return (dispatch) => {
    dispatch(getCustomGroupInfo(company, model, field, id, companyType, isPpm, teamsList, isDate, start, end, isMonth));
  };
}

export function getInspectionDetail(company, model, id) {
  return (dispatch) => {
    dispatch(getInspectionDetailInfo(company, model, id));
  };
}

export function getInspectionSchedulertDetail(id, model,modulename) {
  return (dispatch) => {
    dispatch(getInspectionSchedulertDetailInfo(id, model,modulename));
  };
}

export function createInspection(payload) {
  return (dispatch) => {
    dispatch(createInspectionInfo(payload));
  };
}

export function resetCreateInspection(result) {
  return {
    type: RESET_CREATE_INSPECTION,
    payload: result,
  };
}

export function resetCustomGroup(result) {
  return {
    type: RESET_CUSTOM_GROUP,
    payload: result,
  };
}

export function getInspectionCommenceDate(id, model) {
  return (dispatch) => {
    dispatch(getInspectionCommenceDateInfo(id, model));
  };
}

export function getDashboardFilters(filters) {
  const result = { data: filters };
  return {
    type: INSPECTION_DASHBOARD_FILTERS,
    payload: result,
  };
}

export function getPPMChecklists(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, isMonth, request) {
  return (dispatch) => {
    dispatch(getPPMChecklistsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, isMonth, request));
  };
}

export function getPPMDetail(company, model, id, isEdit) {
  return (dispatch) => {
    dispatch(getPPMDetailInfo(company, model, id, isEdit));
  };
}

export function getPPMChecklistsCount(company, model, start, end, selectedFilter, selectedField, groupFilters, isMonth, request) {
  return (dispatch) => {
    dispatch(getPPMChecklistsCountInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, isMonth, request));
  };
}

export function getInspectionViewerGroupsExport(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, teamList, assetIds, enforceField, inspectionGroup) {
  return (dispatch) => {
    dispatch(getInspectionViewerGroupsExportInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, offset, limit, teamList, assetIds, enforceField, inspectionGroup));
  };
}

export function getPageGroups(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList) {
  return (dispatch) => {
    dispatch(getPageGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList));
  };
}

export function getPageSpaceGroups(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList, enforceField, inspectionGroup) {
  return (dispatch) => {
    dispatch(getPageSpaceGroupsInfo(company, model, start, end, selectedFilter, selectedField, groupFilters, teamList, enforceField, inspectionGroup));
  };
}

export function getInspectionStatusGroups(start, end) {
  return (dispatch) => {
    dispatch(getInspectionStatusGroupsInfo(start, end));
  };
}

export function resetInspectionViewer(result) {
  return {
    type: RESET_INSPECTION_CHECKLIST_GROUP_INFO,
    payload: result,
  };
}

export function resetInspectionEquipmentGroup(result) {
  return {
    type: RESET_EQUIPMENT_GROUP_INFO,
    payload: result,
  };
}

export function resetInspectionSpaceGroup(result) {
  return {
    type: RESET_SPACE_GROUP_INFO,
    payload: result,
  };
}

export function getInspectionChecklists(id) {
  return (dispatch) => {
    dispatch(getInspectionChecklistsInfo(id));
  };
}

export function getOrderData(id, modelName) {
  return (dispatch) => {
    dispatch(getOrderDataInfo(id, modelName));
  };
}

export function getParentSchdules(company, model, assetType, assetId, id, recId, targetModel, startDate, endDate) {
  return (dispatch) => {
    dispatch(getParentSchdulesInfo(company, model, assetType, assetId, id, recId, targetModel, startDate, endDate));
  };
}

export function getAssetPPMSchdules(company, model, assetType, assetId, id, startWeek, endWeek, recId, targetModel) {
  return (dispatch) => {
    dispatch(getAssetPPMSchdulesInfo(company, model, assetType, assetId, id, startWeek, endWeek, recId, targetModel));
  };
}


export function getHxCancelRequestsList(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxCancelRequestsListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getHxCancelRequestsExport(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxCancelRequestsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter, buttonFilterType, userId));
  };
}

export function getHxCancelRequestsCount(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId) {
  return (dispatch) => {
    dispatch(getHxCancelRequestsCountInfo(company, model, states, customFilters, globalFilter, keyword, buttonFilterType, userId));
  };
}

export function getHxInspCancelDetails(id, modelName, isCheck, targetModel, targetId) {
  return (dispatch) => {
    dispatch(getHxInspCancelDetailsInfo(id, modelName, isCheck, targetModel, targetId));
  };
}
