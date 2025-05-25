import axios from 'axios';
import {
  getAnalyticsInfo, getNativeDashboardInfo, getNinjaDashboardInfo, getNinjaDashboardItemInfo, getTreeDashboardInfo,
  getNinjaCodeInfo, updateDashboardLayoutsInfo, getDcDashboardInfo, getNinjaDashboardTimerInfo, getNinjaCodeDrillInfo, getSldInfo,
  getNinjaDashboardDrillInfo, getNinjaDashboardTimerDrillInfo, getDefaultFilterInfo, getNinjaCodeExpandInfo, getChartItemInfo, updateDashboardItemInfo,
} from './actions';

export const STORE_SELECT_DASHBOARD = 'STORE_SELECT_DASHBOARD';

export const RESET_SELECT_DASHBOARD = 'RESET_SELECT_DASHBOARD';

export const RESET_ND_DETAILS_INFO = 'RESET_ND_DETAILS_INFO';

export const RESET_ND_DETAILS_EXPAND_INFO = 'RESET_ND_DETAILS_EXPAND_INFO';

export const RESET_UPDATE_DASHBOARD_LAYOUT_INFO = 'RESET_UPDATE_DASHBOARD_LAYOUT_INFO';

export const RESET_UPDATE_DASHBOARD_ITEM_INFO = 'RESET_UPDATE_DASHBOARD_ITEM_INFO';

export const RESET_DEFAULT_FILTERS_INFO = 'RESET_DEFAULT_FILTERS_INFO';

export const RESET_NINJA_DASHBOARD_INFO = 'RESET_NINJA_DASHBOARD_INFO';

export const RESET_TREE_DASHBOARD_DETAILS_INFO = 'RESET_TREE_DASHBOARD_DETAILS_INFO';

export const STORE_SLD_DATA = 'STORE_SLD_DATA';

export function getAnalyticsFromPowerBi(configObj) {
  return axios(configObj);
}

export function getTokenFromPortal(azurePortalConfig) {
  return axios(azurePortalConfig);
}

export function getAnalytics(company, model, userRole) {
  return (dispatch) => {
    dispatch(getAnalyticsInfo(company, model, userRole));
  };
}

export function getNativeDashboard(start, end, dashboardId) {
  return (dispatch) => {
    dispatch(getNativeDashboardInfo(start, end, dashboardId));
  };
}

export function getNinjaDashboard(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  return (dispatch) => {
    dispatch(getNinjaDashboardInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany));
  };
}

export function getNinjaDashboardTimer(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  return (dispatch) => {
    dispatch(getNinjaDashboardTimerInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany));
  };
}

export function getNinjaDashboardItem(method, model, id, domain, sequence, isIot, uuid) {
  return (dispatch) => {
    dispatch(getNinjaDashboardItemInfo(method, model, id, domain, sequence, isIot, uuid));
  };
}

export function setCurrentDashboardItem(result) {
  return {
    type: STORE_SELECT_DASHBOARD,
    payload: result,
  };
}

export function resetCurrentDashboardItem(result) {
  return {
    type: RESET_SELECT_DASHBOARD,
    payload: result,
  };
}

export function getNinjaCode(id, model, operator, comsumptionDashboard, code) {
  return (dispatch) => {
    dispatch(getNinjaCodeInfo(id, model, operator, comsumptionDashboard, code));
  };
}

export function resetNinjaCode(result) {
  return {
    type: RESET_ND_DETAILS_INFO,
    payload: result,
  };
}

export function resetNinjaExpandCode(result) {
  return {
    type: RESET_ND_DETAILS_EXPAND_INFO,
    payload: result,
  };
}

export function updateDashboardLayouts(id, model, result, isIot, uuid, table) {
  return (dispatch) => {
    dispatch(updateDashboardLayoutsInfo(id, model, result, isIot, uuid, table));
  };
}

export function resetUpdateDashboard(result) {
  return {
    type: RESET_UPDATE_DASHBOARD_LAYOUT_INFO,
    payload: result,
  };
}
export function getSldData(sldCode) {
  return (dispatch) => {
    dispatch(getSldInfo(sldCode));
  };
}

export function storeSldData(result) {
  return {
    type: STORE_SLD_DATA,
    payload: result,
  };
}

export function getNinjaCodeDrill(id, model, isIot, uuid) {
  return (dispatch) => {
    dispatch(getNinjaCodeDrillInfo(id, model, isIot, uuid));
  };
}

export function getNinjaCodeExpand(id) {
  return (dispatch) => {
    dispatch(getNinjaCodeExpandInfo(id));
  };
}

export function getNinjaDashboardDrill(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  return (dispatch) => {
    dispatch(getNinjaDashboardDrillInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany));
  };
}

export function getNinjaDashboardTimerDrill(method, model, dashboardId, context, isIot, code, uuid, userCompany) {
  return (dispatch) => {
    dispatch(getNinjaDashboardTimerDrillInfo(method, model, dashboardId, context, isIot, code, uuid, userCompany));
  };
}

export function getChartItem(id, modelName) {
  return (dispatch) => {
    dispatch(getChartItemInfo(id, modelName));
  };
}

export function resetUpdateDashboardChartItem(result) {
  return {
    type: RESET_UPDATE_DASHBOARD_ITEM_INFO,
    payload: result,
  };
}

export function resetDefaultFilterInfo(result) {
  return {
    type: RESET_DEFAULT_FILTERS_INFO,
    payload: result,
  };
}

export function resetNinjaDashboard(result) {
  return {
    type: RESET_NINJA_DASHBOARD_INFO,
    payload: result,
  };
}

export function resetTreeDashboard(result) {
  return {
    type: RESET_TREE_DASHBOARD_DETAILS_INFO,
    payload: result,
  };
}

export function getDefaultFilter(modelName, uuid, dashboardCode, companyId, code) {
  return (dispatch) => {
    dispatch(getDefaultFilterInfo(modelName, uuid, dashboardCode, companyId, code));
  };
}

export function updateDashboardItem(id, model, result, isIot, uuid, table) {
  return (dispatch) => {
    dispatch(updateDashboardItemInfo(id, model, result, isIot, uuid, table));
  };
}

export function getDcDashboard(code, uuid) {
  return (dispatch) => {
    dispatch(getDcDashboardInfo(code, uuid));
  };
}

export function getTreeDashboard(company, code) {
  return (dispatch) => {
    dispatch(getTreeDashboardInfo(company, code));
  };
}
