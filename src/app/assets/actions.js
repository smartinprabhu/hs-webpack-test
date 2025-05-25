/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import assetColumns from './data/assetsActions.json';
import { AssetModule } from '../util/field';

export const GET_EQUIPMENTS_INFO = 'GET_EQUIPMENTS_INFO';
export const GET_EQUIPMENTS_INFO_SUCCESS = 'GET_EQUIPMENTS_INFO_SUCCESS';
export const GET_EQUIPMENTS_INFO_FAILURE = 'GET_EQUIPMENTS_INFO_FAILURE';

export const GET_EQUIPMENTS_COUNT = 'GET_EQUIPMENTS_COUNT';
export const GET_EQUIPMENTS_COUNT_SUCCESS = 'GET_EQUIPMENTS_COUNT_SUCCESS';
export const GET_EQUIPMENTS_COUNT_FAILURE = 'GET_EQUIPMENTS_COUNT_FAILURE';

export const GET_CATEGORIES_INFO = 'GET_CATEGORIES_INFO';
export const GET_CATEGORIES_INFO_SUCCESS = 'GET_CATEGORIES_INFO_SUCCESS';
export const GET_CATEGORIES_INFO_FAILURE = 'GET_CATEGORIES_INFO_FAILURE';

export const GET_CATEGORIES_COUNT = 'GET_CATEGORIES_COUNT';
export const GET_CATEGORIES_COUNT_SUCCESS = 'GET_CATEGORIES_COUNT_SUCCESS';
export const GET_CATEGORIES_COUNT_FAILURE = 'GET_CATEGORIES_COUNT_FAILURE';

export const GET_TEAMS_INFO = 'GET_TEAMS_INFO';
export const GET_TEAMS_INFO_SUCCESS = 'GET_TEAMS_INFO_SUCCESS';
export const GET_TEAMS_INFO_FAILURE = 'GET_TEAMS_INFO_FAILURE';

export const GET_REPORTED_BY_INFO = 'GET_REPORTED_BY_INFO';
export const GET_REPORTED_BY_INFO_SUCCESS = 'GET_REPORTED_BY_INFO_SUCCESS';
export const GET_REPORTED_BY_INFO_FAILURE = 'GET_REPORTED_BY_INFO_FAILURE';

export const GET_ACCEPTED_BY_INFO = 'GET_ACCEPTED_BY_INFO';
export const GET_ACCEPTED_BY_INFO_SUCCESS = 'GET_ACCEPTED_BY_INFO_SUCCESS';
export const GET_ACCEPTED_BY_INFO_FAILURE = 'GET_ACCEPTED_BY_INFO_FAILURE';

export const GET_EMPLOYESS_INFO = 'GET_EMPLOYESS_INFO';
export const GET_EMPLOYESS_INFO_SUCCESS = 'GET_EMPLOYESS_INFO_SUCCESS';
export const GET_EMPLOYESS_INFO_FAILURE = 'GET_EMPLOYESS_INFO_FAILURE';

export const GET_MAINTENANCE_GROUP_INFO = 'GET_MAINTENANCE_GROUP_INFO';
export const GET_MAINTENANCE_GROUP_INFO_SUCCESS = 'GET_MAINTENANCE_GROUP_INFO_SUCCESS';
export const GET_MAINTENANCE_GROUP_INFO_FAILURE = 'GET_MAINTENANCE_GROUP_INFO_FAILURE';

export const CREATE_ASSET_INFO = 'CREATE_ASSET_INFO';
export const CREATE_ASSET_INFO_SUCCESS = 'CREATE_ASSET_INFO_SUCCESS';
export const CREATE_ASSET_INFO_FAILURE = 'CREATE_ASSET_INFO_FAILURE';

export const CREATE_LOCATION_INFO = 'CREATE_LOCATION_INFO';
export const CREATE_LOCATION_INFO_SUCCESS = 'CREATE_LOCATION_INFO_SUCCESS';
export const CREATE_LOCATION_INFO_FAILURE = 'CREATE_LOCATION_INFO_FAILURE';

export const GET_CATEGORIES_GROUP_INFO = 'GET_CATEGORIES_GROUP_INFO';
export const GET_CATEGORIES_GROUP_INFO_SUCCESS = 'GET_CATEGORIES_GROUP_INFO_SUCCESS';
export const GET_CATEGORIES_GROUP_INFO_FAILURE = 'GET_CATEGORIES_GROUP_INFO_FAILURE';

export const GET_VENDORS_GROUP_INFO = 'GET_VENDORS_GROUP_INFO';
export const GET_VENDORS_GROUP_INFO_SUCCESS = 'GET_VENDORS_GROUP_INFO_SUCCESS';
export const GET_VENDORS_GROUP_INFO_FAILURE = 'GET_VENDORS_GROUP_INFO_FAILURE';

export const GET_ASSET_DETAILS = 'GET_ASSET_DETAILS';
export const GET_ASSET_DETAILS_SUCCESS = 'GET_ASSET_DETAILS_SUCCESS';
export const GET_ASSET_DETAILS_FAILURE = 'GET_ASSET_DETAILS_FAILURE';

export const GET_SPACE_CHILDS = 'GET_SPACE_CHILDS';
export const GET_SPACE_CHILDS_SUCCESS = 'GET_SPACE_CHILDS_SUCCESS';
export const GET_SPACE_CHILDS_FAILURE = 'GET_SPACE_CHILDS_FAILURE';

export const GET_FLOORS_INFO = 'GET_FLOORS_INFO';
export const GET_FLOORS_INFO_SUCCESS = 'GET_FLOORS_INFO_SUCCESS';
export const GET_FLOORS_INFO_FAILURE = 'GET_FLOORS_INFO_FAILURE';

export const GET_SPACE_INFO = 'GET_SPACE_INFO';
export const GET_SPACE_INFO_SUCCESS = 'GET_SPACE_INFO_SUCCESS';
export const GET_SPACE_INFO_FAILURE = 'GET_SPACE_INFO_FAILURE';

export const GET_ASSETS_DASHBOARD_INFO = 'GET_ASSETS_DASHBOARD_INFO';
export const GET_ASSETS_DASHBOARD_INFO_SUCCESS = 'GET_ASSETS_DASHBOARD_INFO_SUCCESS';
export const GET_ASSETS_DASHBOARD_INFO_FAILURE = 'GET_ASSETS_DASHBOARD_INFO_FAILURE';

export const GET_EXPIRY_ASSETS_INFO = 'GET_EXPIRY_ASSETS_INFO';
export const GET_EXPIRY_ASSETS_INFO_SUCCESS = 'GET_EXPIRY_ASSETS_INFO_SUCCESS';
export const GET_EXPIRY_ASSETS_INFO_FAILURE = 'GET_EXPIRY_ASSETS_INFO_FAILURE';

export const GET_AUDIT_LOGS_INFO = 'GET_AUDIT_LOGS_INFO';
export const GET_AUDIT_LOGS_INFO_SUCCESS = 'GET_AUDIT_LOGS_INFO_SUCCESS';
export const GET_AUDIT_LOGS_INFO_FAILURE = 'GET_AUDIT_LOGS_INFO_FAILURE';

export const GET_RELEATED_ASSETS_INFO = 'GET_RELEATED_ASSETS_INFO';
export const GET_RELEATED_ASSETS_INFO_SUCCESS = 'GET_RELEATED_ASSETS_INFO_SUCCESS';
export const GET_RELEATED_ASSETS_INFO_FAILURE = 'GET_RELEATED_ASSETS_INFO_FAILURE';

export const GET_MN_GROUPS_INFO = 'GET_MN_GROUPS_INFO';
export const GET_MN_GROUPS_INFO_SUCCESS = 'GET_MN_GROUPS_INFO_SUCCESS';
export const GET_MN_GROUPS_INFO_FAILURE = 'GET_MN_GROUPS_INFO_FAILURE';

export const GET_MN_GROUPS_DUE_INFO = 'GET_MN_GROUPS_DUE_INFO';
export const GET_MN_GROUPS_DUE_INFO_SUCCESS = 'GET_MN_GROUPS_DUE_INFO_SUCCESS';
export const GET_MN_GROUPS_DUE_INFO_FAILURE = 'GET_MN_GROUPS_DUE_INFO_FAILURE';

export const GET_SPACE_ASSETS_GROUPS = 'GET_SPACE_ASSETS_GROUPS';
export const GET_SPACE_ASSETS_GROUPS_SUCCESS = 'GET_SPACE_ASSETS_GROUPS_SUCCESS';
export const GET_SPACE_ASSETS_GROUPS_FAILURE = 'GET_SPACE_ASSETS_GROUPS_FAILURE';

export const GET_SPACE_EQUIPMENTS = 'GET_SPACE_EQUIPMENTS';
export const GET_SPACE_EQUIPMENTS_SUCCESS = 'GET_SPACE_EQUIPMENTS_SUCCESS';
export const GET_SPACE_EQUIPMENTS_FAILURE = 'GET_SPACE_EQUIPMENTS_FAILURE';

export const GET_SPACE_EXPORT_EQUIPMENTS = 'GET_SPACE_EXPORT_EQUIPMENTS';
export const GET_SPACE_EXPORT_EQUIPMENTS_SUCCESS = 'GET_SPACE_EXPORT_EQUIPMENTS_SUCCESS';
export const GET_SPACE_EXPORT_EQUIPMENTS_FAILURE = 'GET_SPACE_EXPORT_EQUIPMENTS_FAILURE';

export const GET_SPACE_NAME = 'GET_SPACE_NAME';
export const GET_SPACE_NAME_SUCCESS = 'GET_SPACE_NAME_SUCCESS';
export const GET_SPACE_NAME_FAILURE = 'GET_SPACE_NAME_FAILURE';

export const GET_SPACE_TICKETS_GROUPS = 'GET_SPACE_TICKETS_GROUPS';
export const GET_SPACE_TICKETS_GROUPS_SUCCESS = 'GET_SPACE_TICKETS_GROUPS_SUCCESS';
export const GET_SPACE_TICKETS_GROUPS_FAILURE = 'GET_SPACE_TICKETS_GROUPS_FAILURE';

export const GET_ASSET_STATE_CHANGE_INFO = 'GET_ASSET_STATE_CHANGE_INFO';
export const GET_ASSET_STATE_CHANGE_INFO_SUCCESS = 'GET_ASSET_STATE_CHANGE_INFO_SUCCESS';
export const GET_ASSET_STATE_CHANGE_INFO_FAILURE = 'GET_ASSET_STATE_CHANGE_INFO_FAILURE';

export const GET_EQUIPMENTS_EXPORT_INFO = 'GET_EQUIPMENTS_EXPORT_INFO';
export const GET_EQUIPMENTS_EXPORT_INFO_SUCCESS = 'GET_EQUIPMENTS_EXPORT_INFO_SUCCESS';
export const GET_EQUIPMENTS_EXPORT_INFO_FAILURE = 'GET_EQUIPMENTS_EXPORT_INFO_FAILURE';

export const GET_GAUGES_INFO = 'GET_GAUGES_INFO';
export const GET_GAUGES_INFO_SUCCESS = 'GET_GAUGES_INFO_SUCCESS';
export const GET_GAUGES_INFO_FAILURE = 'GET_GAUGES_INFO_FAILURE';

export const GET_METERS_INFO = 'GET_METERS_INFO';
export const GET_METERS_INFO_SUCCESS = 'GET_METERS_INFO_SUCCESS';
export const GET_METERS_INFO_FAILURE = 'GET_METERS_INFO_FAILURE';

export const GET_FLOOR_CHILDS = 'GET_FLOOR_CHILDS';
export const GET_FLOOR_CHILDS_SUCCESS = 'GET_FLOOR_CHILDS_SUCCESS';
export const GET_FLOOR_CHILDS_FAILURE = 'GET_FLOOR_CHILDS_FAILURE';

export const GET_ASSET_MOVE_INFO = 'GET_ASSET_MOVE_INFO';
export const GET_ASSET_MOVE_INFO_SUCCESS = 'GET_ASSET_MOVE_INFO_SUCCESS';
export const GET_ASSET_MOVE_INFO_FAILURE = 'GET_ASSET_MOVE_INFO_FAILURE';

export const UPDATE_EQUIPMENT_INFO = 'UPDATE_EQUIPMENT_INFO';
export const UPDATE_EQUIPMENT_INFO_SUCCESS = 'UPDATE_EQUIPMENT_INFO_SUCCESS';
export const UPDATE_EQUIPMENT_INFO_FAILURE = 'UPDATE_EQUIPMENT_INFO_FAILURE';

export const GET_HOURS_INFO = 'GET_HOURS_INFO';
export const GET_HOURS_INFO_SUCCESS = 'GET_HOURS_INFO_SUCCESS';
export const GET_HOURS_INFO_FAILURE = 'GET_HOURS_INFO_FAILURE';

export const GET_PARTNERS_INFO = 'GET_PARTNERS_INFO';
export const GET_PARTNERS_INFO_SUCCESS = 'GET_PARTNERS_INFO_SUCCESS';
export const GET_PARTNERS_INFO_FAILURE = 'GET_PARTNERS_INFO_FAILURE';

export const GET_SPACE_TYPES_INFO = 'GET_SPACE_TYPES_INFO';
export const GET_SPACE_TYPES_INFO_SUCCESS = 'GET_SPACE_TYPES_INFO_SUCCESS';
export const GET_SPACE_TYPES_INFO_FAILURE = 'GET_SPACE_TYPES_INFO_FAILURE';

export const GET_SPACE_SUB_TYPES_INFO = 'GET_SPACE_SUB_TYPES_INFO';
export const GET_SPACE_SUB_TYPES_INFO_SUCCESS = 'GET_SPACE_SUB_TYPES_INFO_SUCCESS';
export const GET_SPACE_SUB_TYPES_INFO_FAILURE = 'GET_SPACE_SUB_TYPES_INFO_FAILURE';

export const CREATE_SPACE_INFO = 'CREATE_SPACE_INFO';
export const CREATE_SPACE_INFO_SUCCESS = 'CREATE_SPACE_INFO_SUCCESS';
export const CREATE_SPACE_INFO_FAILURE = 'CREATE_SPACE_INFO_FAILURE';

export const GET_UNSPSC_INFO = 'GET_UNSPSC_INFO';
export const GET_UNSPSC_INFO_SUCCESS = 'GET_UNSPSC_INFO_SUCCESS';
export const GET_UNSPSC_INFO_FAILURE = 'GET_UNSPSC_INFO_FAILURE';

export const UPDATE_LOCATION_INFO = 'UPDATE_LOCATION_INFO';
export const UPDATE_LOCATION_INFO_SUCCESS = 'UPDATE_LOCATION_INFO_SUCCESS';
export const UPDATE_LOCATION_INFO_FAILURE = 'UPDATE_LOCATION_INFO_FAILURE';

export const GET_UNSPSC_OTHER_INFO = 'GET_UNSPSC_OTHER_INFO';
export const GET_UNSPSC_OTHER_INFO_SUCCESS = 'GET_UNSPSC_OTHER_INFO_SUCCESS';
export const GET_UNSPSC_OTHER_INFO_FAILURE = 'GET_UNSPSC_OTHER_INFO_FAILURE';

export const GET_EMPLOYEES_LIST_INFO = 'GET_EMPLOYEES_LIST_INFO';
export const GET_EMPLOYEES_LIST_INFO_SUCCESS = 'GET_EMPLOYEES_LIST_INFO_SUCCESS';
export const GET_EMPLOYEES_LIST_INFO_FAILURE = 'GET_EMPLOYEES_LIST_INFO_FAILURE';

export const GET_SPACE_LINES_INFO = 'GET_SPACE_LINES_INFO';
export const GET_SPACE_LINES_INFO_SUCCESS = 'GET_SPACE_LINES_INFO_SUCCESS';
export const GET_SPACE_LINES_INFO_FAILURE = 'GET_SPACE_LINES_INFO_FAILURE';

export const CREATE_BREAKDOWN_INFO = 'CREATE_BREAKDOWN_INFO';
export const CREATE_BREAKDOWN_INFO_SUCCESS = 'CREATE_BREAKDOWN_INFO_SUCCESS';
export const CREATE_BREAKDOWN_INFO_FAILURE = 'CREATE_BREAKDOWN_INFO_FAILURE';

export const GET_BUILDINGS_INFO = 'GET_BUILDINGS_INFO';
export const GET_BUILDINGS_INFO_SUCCESS = 'GET_BUILDINGS_INFO_SUCCESS';
export const GET_BUILDINGS_INFO_FAILURE = 'GET_BUILDINGS_INFO_FAILURE';

export const GET_SPACES_INFO = 'GET_SPACES_INFO';
export const GET_SPACES_INFO_SUCCESS = 'GET_SPACES_INFO_SUCCESS';
export const GET_SPACES_INFO_FAILURE = 'GET_SPACES_INFO_FAILURE';

export const GET_LOCATION_DATA_INFO = 'GET_LOCATION_DATA_INFO';
export const GET_LOCATION_DATA_INFO_SUCCESS = 'GET_LOCATION_DATA_INFO_SUCCESS';
export const GET_LOCATION_DATA_INFO_FAILURE = 'GET_LOCATION_DATA_INFO_FAILURE';

export const GET_LOCATION_DROP_INFO = 'GET_LOCATION_DROP_INFO';
export const GET_LOCATION_DROP_INFO_SUCCESS = 'GET_LOCATION_DROP_INFO_SUCCESS';
export const GET_LOCATION_DROP_INFO_FAILURE = 'GET_LOCATION_DROP_INFO_FAILURE';

export const GET_LOCATION_DATA_EXPORT = 'GET_LOCATION_DATA_EXPORT';
export const GET_LOCATION_DATA_EXPORT_SUCCESS = 'GET_LOCATION_DATA_EXPORT_SUCCESS';
export const GET_LOCATION_DATA_EXPORT_FAILURE = 'GET_LOCATION_DATA_EXPORT_FAILURE';

export const GET_LOCATION_DATA_COUNT_INFO = 'GET_LOCATION_DATA_COUNT_INFO';
export const GET_LOCATION_DATA_COUNT_INFO_SUCCESS = 'GET_LOCATION_DATA_COUNT_INFO_SUCCESS';
export const GET_LOCATION_DATA_COUNT_INFO_FAILURE = 'GET_LOCATION_DATA_COUNT_INFO_FAILURE';

export const GET_ASSET_NAME = 'GET_ASSET_NAME';
export const GET_ASSET_NAME_SUCCESS = 'GET_ASSET_NAME_SUCCESS';
export const GET_ASSET_NAME_FAILURE = 'GET_ASSET_NAME_FAILURE';

export const GET_BUILDING_CHILDS = 'GET_BUILDING_CHILDS';
export const GET_BUILDING_CHILDS_SUCCESS = 'GET_BUILDING_CHILDS_SUCCESS';
export const GET_BUILDING_CHILDS_FAILURE = 'GET_BUILDING_CHILDS_FAILURE';

export const GET_LOCATION_IMAGE = 'GET_LOCATION_IMAGE';
export const GET_LOCATION_IMAGE_SUCCESS = 'GET_LOCATION_IMAGE_SUCCESS';
export const GET_LOCATION_IMAGE_FAILURE = 'GET_LOCATION_IMAGE_FAILURE';

export const GET_OPERATIVE_CHANGE_INFO = 'GET_OPERATIVE_CHANGE_INFO';
export const GET_OPERATIVE_CHANGE_INFO_SUCCESS = 'GET_OPERATIVE_CHANGE_INFO_SUCCESS';
export const GET_OPERATIVE_CHANGE_FAILURE = 'GET_OPERATIVE_CHANGE_FAILURE';

export const GET_SPACES_COUNT = 'GET_SPACES_COUNT';
export const GET_SPACES_COUNT_SUCCESS = 'GET_SPACES_COUNT_SUCCESS';
export const GET_SPACES_COUNT_FAILURE = 'GET_SPACES_COUNT_FAILURE';

export const GET_GAUGES_LIST_INFO = 'GET_GAUGES_LIST_INFO';
export const GET_GAUGES_LIST_INFO_SUCCESS = 'GET_GAUGES_LIST_INFO_SUCCESS';
export const GET_GAUGES_LIST_INFO_FAILURE = 'GET_GAUGES_LIST_INFO_FAILURE';

export const GET_METERS_LIST_INFO = 'GET_METERS_LIST_INFO';
export const GET_METERS_LIST_INFO_SUCCESS = 'GET_METERS_LIST_INFO_SUCCESS';
export const GET_METERS_LIST_INFO_FAILURE = 'GET_METERS_LIST_INFO_FAILURE';

export const GET_MAIL_ACTIVITIES = 'GET_MAIL_ACTIVITIES';
export const GET_MAIL_ACTIVITIES_SUCCESS = 'GET_MAIL_ACTIVITIES_SUCCESS';
export const GET_MAIL_ACTIVITIES_FAILURE = 'GET_MAIL_ACTIVITIES_FAILURE';

export const GET_READINGS_INFO = 'GET_READINGS_INFO';
export const GET_READINGS_INFO_SUCCESS = 'GET_READINGS_INFO_SUCCESS';
export const GET_READINGS_INFO_FAILURE = 'GET_READINGS_INFO_FAILURE';

export const GET_HISTORY_CARD_INFO = 'GET_HISTORY_CARD_INFO';
export const GET_HISTORY_CARD_INFO_SUCCESS = 'GET_HISTORY_CARD_INFO_SUCCESS';
export const GET_HISTORY_CARD_INFO_FAILURE = 'GET_HISTORY_CARD_INFO_FAILURE';

export const GET_READINGS_DETAIL_INFO = 'GET_READINGS_DETAIL_INFO';
export const GET_READINGS_DETAIL_INFO_SUCCESS = 'GET_READINGS_DETAIL_INFO_SUCCESS';
export const GET_READINGS_DETAIL_INFO_FAILURE = 'GET_READINGS_DETAIL_INFO_FAILURE';

export const GET_DATALINE_INFO = 'GET_DATALINE_INFO';
export const GET_DATALINE_INFO_SUCCESS = 'GET_DATALINE_INFO_SUCCESS';
export const GET_DATALINE_INFO_FAILURE = 'GET_DATALINE_INFO_FAILURE';

export const GET_READINGS_LOG_INFO = 'GET_READINGS_LOG_INFO';
export const GET_READINGS_LOG_INFO_SUCCESS = 'GET_READINGS_LOG_INFO_SUCCESS';
export const GET_READINGS_LOG_INFO_FAILURE = 'GET_READINGS_LOG_INFO_FAILURE';

export const GET_READINGSLOG_COUNT = 'GET_READINGSLOG_COUNT';
export const GET_READINGSLOG_COUNT_SUCCESS = 'GET_READINGSLOG_COUNT_SUCCESS';
export const GET_READINGSLOG_COUNT_FAILURE = 'GET_READINGSLOG_COUNT_FAILURE';

export const GET_READINGSLOG_EXPORT_INFO = 'GET_READINGSLOG_EXPORT_INFO';
export const GET_READINGSLOG_EXPORT_INFO_SUCCESS = 'GET_READINGSLOG_EXPORT_INFO_SUCCESS';
export const GET_READINGSLOG_EXPORT_INFO_FAILURE = 'GET_READINGSLOG_EXPORT_INFO_FAILURE';

export const GET_READINGS = 'GET_READINGS';
export const GET_READINGS_SUCCESS = 'GET_READINGS_SUCCESS';
export const GET_READINGS_FAILURE = 'GET_READINGS_FAILURE';

export const GET_CHECKLIST_INFO = 'GET_CHECKILST_INFO';
export const GET_CHECKLIST_INFO_SUCCESS = 'GET_CHECKLIST_INFO_SUCCESS';
export const GET_CHECKLIST_INFO_FAILURE = 'GET_CHECKLIST_INFO_FAILURE';

export const GET_TEAM_CATEGORY_INFO = 'GET_TEAM_CATEGORY_INFO';
export const GET_TEAM_CATEGORY_INFO_SUCCESS = 'GET_TEAM_CATEGORY_INFO_SUCCESS';
export const GET_TEAM_CATEGORY_INFO_FAILURE = 'GET_TEAM_CATEGORY_INFO_FAILURE';

export const GET_ALARM_CATEGORY_INFO = 'GET_ALARM_CATEGORY_INFO';
export const GET_ALARM_CATEGORY_INFO_SUCCESS = 'GET_ALARM_CATEGORY_INFO_SUCCESS';
export const GET_ALARM_CATEGORY_INFO_FAILURE = 'GET_ALARM_CATEGORY_INFO_FAILURE';

export const GET_ALARM_RECIPIENTS_INFO = 'GET_ALARM_RECIPIENTS_INFO';
export const GET_ALARM_RECIPIENTS_INFO_SUCCESS = 'GET_ALARM_RECIPIENTS_INFO_SUCCESS';
export const GET_ALARM_RECIPIENTS_INFO_FAILURE = 'GET_ALARM_RECIPIENTS_INFO_FAILURE';

export const GET_ALARM_ACTIONS_INFO = 'GET_ALARM_ACTIONS_INFO';
export const GET_ALARM_ACTIONS_INFO_SUCCESS = 'GET_ALARM_ACTIONS_INFO_SUCCESS';
export const GET_ALARM_ACTIONS_INFO_FAILURE = 'GET_ALARM_ACTIONS_INFOFAILURE';

export const CREATE_READING_INFO = 'CREATE_READING_INFO';
export const CREATE_READING_INFO_SUCCESS = 'CREATE_READING_INFO_SUCCESS';
export const CREATE_READING_INFO_FAILURE = 'CREATE_READING_INFO_FAILURE';

export const GET_SP_INFO = 'GET_SP_INFO';
export const GET_SP_INFO_SUCCESS = 'GET_SP_INFO_SUCCESS';
export const GET_SP_INFO_FAILURE = 'GET_SP_INFO_FAILURE';

export const CREATE_IMPORT_ID_INFO = 'CREATE_IMPORT_ID_INFO';
export const CREATE_IMPORT_ID_INFO_SUCCESS = 'CREATE_IMPORT_ID_INFO_SUCCESS';
export const CREATE_IMPORT_ID_INFO_FAILURE = 'CREATE_IMPORT_ID_INFO_FAILURE';

export const UPLOAD_IMPORT_INFO = 'UPLOAD_IMPORT_INFO';
export const UPLOAD_IMPORT_INFO_SUCCESS = 'UPLOAD_IMPORT_INFO_SUCCESS';
export const UPLOAD_IMPORT_INFO_FAILURE = 'UPLOAD_IMPORT_INFO_FAILURE';

export const GET_QR_IMAGE_INFO = 'GET_QR_IMAGE_INFO';
export const GET_QR_IMAGE_INFO_SUCCESS = 'GET_QR_IMAGE_INFO_SUCCESS';
export const GET_QR_IMAGE_INFO_FAILURE = 'GET_QR_IMAGE_INFO_FAILURE';

export const GET_INCIDENT_REPORT_INFO = 'GET_INCIDENT_REPORT_INFO';
export const GET_INCIDENT_REPORT_INFO_SUCCESS = 'GET_INCIDENT_REPORT_INFO_SUCCESS';
export const GET_INCIDENT_REPORT_INFO_FAILURE = 'GET_INCIDENT_REPORT_INFO_FAILURE';

export const GET_MAP_EQUIPMENTS = 'GET_MAP_EQUIPMENTS';
export const GET_MAP_EQUIPMENTS_SUCCESS = 'GET_MAP_EQUIPMENTS_SUCCESS';
export const GET_MAP_EQUIPMENTS_FAILURE = 'GET_MAP_EQUIPMENTS_FAILURE';

export const GET_ALL_SPACES = 'GET_ALL_SPACES';
export const GET_ALL_SPACES_SUCCESS = 'GET_ALL_SPACES_SUCCESS';
export const GET_ALL_SPACES_FAILURE = 'GET_ALL_SPACES_FAILURE';

export const GET_AUDIT_INFO = 'GET_AUDIT_INFO';
export const GET_AUDIT_INFO_SUCCESS = 'GET_AUDIT_INFO_SUCCESS';
export const GET_AUDIT_INFO_FAILURE = 'GET_AUDIT_INFO_FAILURE';

export const GET_CATEGORY_IMAGE_INFO = 'GET_CATEGORY_IMAGE_INFO';
export const GET_CATEGORY_IMAGE_INFO_SUCCESS = 'GET_CATEGORY_IMAGE_INFO_SUCCESS';
export const GET_CATEGORY_IMAGE_INFO_FAILURE = 'GET_CATEGORY_IMAGE_INFO_FAILURE';

export const GET_WA_INFO = 'GET_WA_INFO';
export const GET_WA_INFO_SUCCESS = 'GET_WA_INFO_SUCCESS';
export const GET_WA_INFO_FAILURE = 'GET_WA_INFO_FAILURE';

export const GET_GLOBAL_CATEGORIES_INFO = 'GET_GLOBAL_CATEGORIES_INFO';
export const GET_GLOBAL_CATEGORIES_INFO_SUCCESS = 'GET_GLOBAL_CATEGORIES_INFO_SUCCESS';
export const GET_GLOBAL_CATEGORIES_INFO_FAILURE = 'GET_GLOBAL_CATEGORIES_INFO_FAILURE';

export const GET_TREE_DATA = 'GET_TREE_DATA';
export const GET_TREE_DATA_SUCCESS = 'GET_TREE_DATA_SUCCESS';
export const GET_TREE_DATA_FAILURE = 'GET_TREE_DATA_FAILURE';

export const GET_AVL_INFO = 'GET_AVL_INFO';
export const GET_AVL_INFO_SUCCESS = 'GET_AVL_INFO_SUCCESS';
export const GET_AVL_INFO_FAILURE = 'GET_AVL_INFO_FAILURE';

export const GET_MP_INFO = 'GET_MP_INFO';
export const GET_MP_INFO_SUCCESS = 'GET_MP_INFO_SUCCESS';
export const GET_MP_INFO_FAILURE = 'GET_MP_INFO_FAILURE';
export const GET_THRESHOLDS_DATA_INFO = 'GET_THRESHOLDS_DATA_INFO';
export const GET_THRESHOLDS_DATA_INFO_SUCCESS = 'GET_THRESHOLDS_DATA_INFO_SUCCESS';
export const GET_THRESHOLDS_DATA_INFO_FAILURE = 'GET_THRESHOLDS_DATA_INFO_FAILURE';

export const GET_AQ_CONFIG = 'GET_AQ_CONFIG';
export const GET_AQ_CONFIG_SUCCESS = 'GET_AQ_CONFIG_SUCCESS';
export const GET_AQ_CONFIG_FAILURE = 'GET_AQ_CONFIG_FAILURE';

export const GET_VP_INFO = 'GET_VP_INFO';
export const GET_VP_INFO_SUCCESS = 'GET_VP_INFO_SUCCESS';
export const GET_VP_INFO_FAILURE = 'GET_VP_INFO_FAILURE';

export const GET_ASSETCAT_INFO = 'GET_ASSETCAT_INFO';
export const GET_ASSETCAT_INFO_SUCCESS = 'GET_ASSETCAT_INFO_SUCCESS';
export const GET_ASSETCAT_INFO_FAILURE = 'GET_ASSETCAT_INFO_FAILURE';

export const GET_ASSETCAT_COUNT = 'GET_ASSETCAT_COUNT';
export const GET_ASSETCAT_COUNT_SUCCESS = 'GET_ASSETCAT_COUNT_SUCCESS';
export const GET_ASSETCAT_COUNT_FAILURE = 'GET_ASSETCAT_COUNT_FAILURE';

export const GET_ASSETCAT_EXPORT_INFO = 'GET_ASSETCAT_EXPORT_INFO';
export const GET_ASSETCAT_EXPORT_INFO_SUCCESS = 'GET_ASSETCAT_EXPORT_INFO_SUCCESS';
export const GET_ASSETCAT_EXPORT_INFO_FAILURE = 'GET_ASSETCAT_EXPORT_INFO_FAILURE';

export const GET_EQUIPMENT_COST_INFO = 'GET_EQUIPMENT_COST_INFO';
export const GET_EQUIPMENT_COST_INFO_SUCCESS = 'GET_EQUIPMENT_COST_INFO_SUCCESS';
export const GET_EQUIPMENT_COST_INFO_FAILURE = 'GET_EQUIPMENT_COST_INFO_FAILURE';

export const GET_SPACE_TABLE_INFO = 'GET_SPACE_TABLE_INFO';
export const GET_SPACE_TABLE_INFO_SUCCESS = 'GET_SPACE_TABLE_INFO_SUCCESS';
export const GET_SPACE_TABLE_INFO_FAILURE = 'GET_SPACE_TABLE_INFO_FAILURE';

export const GET_SPACE_TABLE_EXPORT_INFO = 'GET_SPACE_TABLE_EXPORT_INFO';
export const GET_SPACE_TABLE_EXPORT_INFO_SUCCESS = 'GET_SPACE_TABLE_EXPORT_INFO_SUCCESS';
export const GET_SPACE_TABLE_EXPORT_INFO_FAILURE = 'GET_SPACE_TABLE_EXPORT_INFO_FAILURE';

export const GET_SPACE_TABLE_COUNT_INFO = 'GET_SPACE_TABLE_COUNT_INFO';
export const GET_SPACE_TABLE_COUNT_INFO_SUCCESS = 'GET_SPACE_TABLE_COUNT_INFO_SUCCESS';
export const GET_SPACE_TABLE_COUNT_INFO_FAILURE = 'GET_SPACE_TABLE_COUNT_INFO_FAILURE';

export function getAllLocationsInfo(company, model, sortByValue, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length) {
    payload = `${payload},['space_name','ilike',${keyword}]`;
  }
  payload = `${payload}]&model=${model}&fields=["sequence_asset_hierarchy","asset_categ_type",("parent_id",["id","name"]),"id","space_name","path_name",("asset_category_id",["id", "name"]),["child_ids", [("parent_id",["id","name"]),"id", "space_name", "path_name",("asset_category_id",["id", "name"])]]]`;

  if (sortByValue) {
    payload = `${payload}&order=space_name ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TREE_DATA, GET_TREE_DATA_SUCCESS, GET_TREE_DATA_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquipmentsInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory, aiFilter) {
  const fieldss = assetColumns && assetColumns.assetListFields ? assetColumns.assetListFields : [];
  const defaultFields = '["id", "name", "make", "equipment_seq", ("category_id",["id","name"]), ("parent_id",["id","name"]), "state", ("block_id",["id","space_name"]),("floor_id",["id","space_name"]),("location_id",["id","path_name","space_name"]),("maintenance_team_id",["id","name"]), "equipment_number", "model", "purchase_date", "serial",("vendor_id",["id","name"]),("manufacturer_id",["id","name"]), "warranty_start_date", "warranty_end_date",("monitored_by_id",["id","name"]), ("managed_by_id",["id","name"]), ("maintained_by_id",["id","name"]), "tag_status", "validation_status",("company_id",["id","name"]),("validated_by",["id","name"]), "validated_on", "is_qr_tagged", "is_nfc_tagged", "is_rfid_tagged", "is_virtually_tagged", "amc_start_date", "amc_end_date", "end_of_life","amc_type", "brand","criticality"]';
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  if (ids) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }
  if (assetCategory) {
    payload = `${payload},["category_id","=",${assetCategory}]`;
  }
  if (isITAsset && categoryType) {
    payload = `${payload},["is_itasset","=",true],["category_type","=","${categoryType}"]`;
  } else {
    payload = `${payload},["is_itasset","!=",true]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (aiFilter) {
    payload = `${payload},${aiFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${modelName}&fields=${fields || defaultFields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EQUIPMENTS_INFO, GET_EQUIPMENTS_INFO_SUCCESS, GET_EQUIPMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getEquipmentsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  const fieldss = '["id", "name", "equipment_seq", ("category_id",["id","name"]), ("parent_id",["id","name"]), "state", ("block_id",["id","space_name"]),("floor_id",["id","space_name"]),("location_id",["id","path_name"]),("maintenance_team_id",["id","name"]), "equipment_number", "model", "purchase_date", "serial",("vendor_id",["id","name"]),("manufacturer_id",["id","name"]), "warranty_start_date", "warranty_end_date",("monitored_by_id",["id","name"]), ("managed_by_id",["id","name"]), ("maintained_by_id",["id","name"]), "tag_status", "validation_status",("company_id",["id","name"]),("validated_by",["id","name"]), "validated_on", "is_qr_tagged", "is_nfc_tagged", "is_rfid_tagged", "is_virtually_tagged", "amc_start_date", "amc_end_date", "end_of_life", "amc_type", "brand","criticality"]';
  if (isITAsset && categoryType) {
    payload = `${payload},["is_itasset","=",true],["category_type","=","${categoryType}"]`;
  } else {
    payload = `${payload},["is_itasset","!=",true]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${fieldss}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EQUIPMENTS_EXPORT_INFO, GET_EQUIPMENTS_EXPORT_INFO_SUCCESS, GET_EQUIPMENTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createAssetInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'create/mro.equipment',
      types: [CREATE_ASSET_INFO, CREATE_ASSET_INFO_SUCCESS, CREATE_ASSET_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createAssignmentLocations(result) {
  return {
    [CALL_API]: {
      endpoint: 'create/mro.equipment.location.assignment',
      types: [CREATE_LOCATION_INFO, CREATE_LOCATION_INFO_SUCCESS, CREATE_LOCATION_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getEquipmentsCount(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory, aiFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  if (ids) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }
  if (assetCategory) {
    payload = `${payload},["category_id","=",${assetCategory}]`;
  }
  if (aiFilter) {
    payload = `${payload},${aiFilter}`;
  }
  if (isITAsset && categoryType) {
    payload = `${payload},["is_itasset","=",true],["category_type","=","${categoryType}"]`;
  } else {
    payload = `${payload},["is_itasset","!=",true]`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EQUIPMENTS_COUNT, GET_EQUIPMENTS_COUNT_SUCCESS, GET_EQUIPMENTS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryInfo(company, model, keyword, limit, offset) {
  // let payload = `domain=[["company_id","in",[${company}]]`;
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["path_name"]&limit=${limit || 20}&offset=${offset || 0}&order=path_name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CATEGORIES_INFO, GET_CATEGORIES_INFO_SUCCESS, GET_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryCountInfo(company, model, keyword) {
  // let payload = `domain=[["company_id","in",[${company}]]`;
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_CATEGORIES_COUNT, GET_CATEGORIES_COUNT_SUCCESS, GET_CATEGORIES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamInfo(company, model, keyword, category, fields) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (model === 'ppm.maintenance.year') {
    payload = 'domain=[';
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload}${model === 'ppm.maintenance.year' ? '' : ','}["name","ilike","${keyword}"]`;
  }
  if (category) {
    payload = `${payload},["team_category_id","=",${category}]`;
  }
  const defaultFields = ['name', 'member_ids'];
  payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAMS_INFO, GET_TEAMS_INFO_SUCCESS, GET_TEAMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReportedByLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_REPORTED_BY_INFO, GET_REPORTED_BY_INFO_SUCCESS, GET_REPORTED_BY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAcceptedByLists(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ACCEPTED_BY_INFO, GET_ACCEPTED_BY_INFO_SUCCESS, GET_ACCEPTED_BY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EMPLOYESS_INFO, GET_EMPLOYESS_INFO_SUCCESS, GET_EMPLOYESS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeDataInfo(company, model, keyword, ids, dept, moduleName) {
  let payload = '';
  if (ids && ids.length > 0) {
    payload = 'domain=[["name","!=",false]';
  } else {
    payload = `domain=[["company_id","in",[${company}]]`;
  }
  if (moduleName === 'workpemit') {
    payload = `${payload},["name","!=",false], ["active","=",true]`;
  } else {
    payload = `${payload},["name","!=",false], ["work_email","!=",false], ["employee_id_seq","!=",false], ["employee_id_seq","!=",""], ["active","=",true]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"], ["employee_id_seq","ilike","${keyword}"], ["work_email","ilike","${keyword}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload},["id","in",[${ids}]]`;
  }
  if (dept) {
    payload = `${payload},["department_id","=",${dept}]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","work_email","employee_id_seq", "mobile_phone"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EMPLOYEES_LIST_INFO, GET_EMPLOYEES_LIST_INFO_SUCCESS, GET_EMPLOYEES_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]],["category_id","!=",false]]&model=${model}&fields=["category_id"]&groupby=["category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORIES_GROUP_INFO, GET_CATEGORIES_GROUP_INFO_SUCCESS, GET_CATEGORIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVendorGroupsInfo(company, model, field) {
  const payload = `domain=[["company_id","in",[${company}]],["${field}","!=",false]]&model=${model}&fields=["${field}"]&groupby=["${field}"]&order=${field} ASC`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_VENDORS_GROUP_INFO, GET_VENDORS_GROUP_INFO_SUCCESS, GET_VENDORS_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceGroupsInfo(company, model, field) {
  const payload = `domain=[["company_id","in",[${company}]],["${field}","!=",false]]&model=${model}&fields=["${field}"]&groupby=["${field}"]&order=${field} ASC`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MAINTENANCE_GROUP_INFO, GET_MAINTENANCE_GROUP_INFO_SUCCESS, GET_MAINTENANCE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetDetails(id, modelName, isSchool, target, sequence) {
  const fields = assetColumns && assetColumns.viewFields ? assetColumns.viewFields : [];
  let endUrl = '';
  if (isSchool) {
    const fieldsList = '["id","name","brand",("category_id", ["id", "name"]),("location_id", ["id", "space_name", "path_name","full_path_space_name"])]';
    const payload = `["id","=",${id}]`;
    endUrl = `search/${modelName}?model=${modelName}&domain=[${payload}]&fields=${fieldsList}&offset=0&limit=1`;
  } else {
    endUrl = `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`;
    if (target) {
      endUrl = `search_read/${modelName}?model=${modelName}&domain=[["equipment_seq","=","${sequence}"]]&fields=${JSON.stringify(fields)}&offset=0&limit=1`;
    }
  }

  return {
    [CALL_API]: {
      endpoint: endUrl,
      types: [GET_ASSET_DETAILS, GET_ASSET_DETAILS_SUCCESS, GET_ASSET_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getFloorChildsInfo(company, model, parentId, keyword, sortBy, sortField) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "ilike", "Room"]]`;
  if (parentId) {
    payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}],["asset_category_id", "ilike", "Room"]]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}&model=${model}&fields=["id","space_name","path_name","sequence_asset_hierarchy","max_occupancy","area_sqft","floor_id","parent_id"]&limit=100`;
  if (sortField && sortBy) {
    payload = `${payload}&order=${sortField} ${sortBy}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_FLOOR_CHILDS, GET_FLOOR_CHILDS_SUCCESS, GET_FLOOR_CHILDS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceChildsInfo(company, model, parentId) {
  let payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}]]`;
  payload = `${payload}&model=${model}&fields=["id","name","space_name","path_name","parent_id","asset_category_id","child_ids"]&limit=300&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_CHILDS, GET_SPACE_CHILDS_SUCCESS, GET_SPACE_CHILDS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getFloorsInfo(company, model, keyword, parentId, type) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "ilike", "Floor"]`;
  if (parentId) {
    payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}],["asset_category_id", "ilike", "Floor"]`;
  }
  if (type === 'all') {
    payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "in", ["Floor","Building"]]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","space_name","path_name","parent_id","asset_category_id"]&limit=50&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_FLOORS_INFO, GET_FLOORS_INFO_SUCCESS, GET_FLOORS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBuildingsInfo(company, model, keyword, fields, limit, type) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "=", "Building"]`;
  if (type) {
    payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "=", ${type}]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  const defaultFields = ['id', 'name', 'space_name', 'path_name', 'parent_id', 'asset_category_id', 'child_ids', 'sequence_asset_hierarchy', 'max_occupancy', 'area_sqft'];
  payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}&limit=${limit || 50}&offset=0&order=id DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BUILDINGS_INFO, GET_BUILDINGS_INFO_SUCCESS, GET_BUILDINGS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpacesInfo(company, model, keyword, category, categoryName) {
  let payload = `domain=[["company_id","in",[${company}]],${category}`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name","space_name","path_name","parent_id","asset_category_id","child_ids","sequence_asset_hierarchy","max_occupancy","area_sqft"]&limit=500&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACES_INFO, GET_SPACES_INFO_SUCCESS, GET_SPACES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLocationDataInfo(company, model, keyword, category, sortByValue, sortFieldValue, limit, offset, customFilters, globalFilter, isDropdown) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "=", "${category}"]`;
  if (isDropdown) {
    payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "in", ["Floor","Building","Wing"]]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  let fields = '["id","name", "space_name","path_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("parent_id", ["id", "space_name","path_name",("parent_id", ["id", "space_name"]),("asset_category_id", ["id", "name"])]),("block_id", ["id", "space_name","path_name"]),("company_id", ["id", "name"]),("floor_id", ["id", "space_name"]),("asset_category_id", ["id", "name"])]';

  if (category === 'Building') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft"]';
  }
  if (category === 'Floor') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("parent_id", ["id", "space_name"])]';
  }
  if (category === 'Room' || category === 'Space' || category === 'Wing') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("block_id", ["id", "space_name"]),("asset_category_id", ["id", "name"]),("parent_id", ["id", "space_name",("asset_category_id", ["id", "name"]),("parent_id", ["id", "space_name",("asset_category_id", ["id", "name"]),("parent_id", ["id", "space_name",("asset_category_id", ["id", "name"])])])])]';
  }

  if (isDropdown) {
    payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=0`;
    return {
      [CALL_API]: {
        endpoint: `search?${payload}`,
        types: [GET_LOCATION_DROP_INFO, GET_LOCATION_DROP_INFO_SUCCESS, GET_LOCATION_DROP_INFO_FAILURE],
        method: 'GET',
        payload,
      },
    };
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_LOCATION_DATA_INFO, GET_LOCATION_DATA_INFO_SUCCESS, GET_LOCATION_DATA_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLocationCountInfo(company, model, category, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "=", "${category}"]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_LOCATION_DATA_COUNT_INFO, GET_LOCATION_DATA_COUNT_INFO_SUCCESS, GET_LOCATION_DATA_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getLocationExportInfo(company, model, keyword, category, sortByValue, sortFieldValue, limit, offset, rows, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "=", "${category}"]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|","|",["name","ilike","${keyword}"],["space_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  let fields = '["id","name", "space_name","path_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("parent_id", ["id", "space_name","path_name",("parent_id", ["id", "space_name"]),("asset_category_id", ["id", "name"])]),("block_id", ["id", "space_name","path_name"]),("company_id", ["id", "name"]),("floor_id", ["id", "space_name"]),("asset_category_id", ["id", "name"])]';

  if (category === 'Building') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft"]';
  }
  if (category === 'Floor') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("parent_id", ["id", "space_name"])]';
  }
  if (category === 'Room' || category === 'Space') {
    fields = '["id","space_name","sequence_asset_hierarchy","max_occupancy","area_sqft",("block_id", ["id", "space_name"]),("parent_id", ["id", "space_name",("asset_category_id", ["id", "name"]),("parent_id", ["id", "space_name"])])]';
  }

  payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_LOCATION_DATA_EXPORT, GET_LOCATION_DATA_EXPORT_SUCCESS, GET_LOCATION_DATA_EXPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBuilingChildsInfo(company, model, parentId) {
  let payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}],["asset_category_id", "ilike", "Floor"]]`;
  payload = `${payload}&model=${model}&fields=["id","space_name","path_name","child_ids"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_BUILDING_CHILDS, GET_BUILDING_CHILDS_SUCCESS, GET_BUILDING_CHILDS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceInfo(model, id, fields, target, sequence) {
  let endUrl = '';
  if (!fields) {
    endUrl = `read/${model}?domain=[]&ids=[${id}]&fields=[]`;
    if (target) {
      endUrl = `search_read/${model}?model=${model}&domain=[["sequence_asset_hierarchy","=","${sequence}"]]&fields=[]&limit=1&offset=0`;
    }
  } else {
    endUrl = `read/${model}?domain=[]&ids=[${id}]&fields=["id", "space_name", "file_path", "asset_category_id", "path_name", "image_medium"]`;
  }
  return {
    [CALL_API]: {
      endpoint: endUrl,
      types: [GET_SPACE_INFO, GET_SPACE_INFO_SUCCESS, GET_SPACE_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSpaceNames(model, id) {
  let payload = `domain=[["id","in",[${id}]]]`;
  payload = `${payload}&model=${model}&fields=["space_name","path_name","id"]&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_NAME, GET_SPACE_NAME_SUCCESS, GET_SPACE_NAME_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetNames(model, id) {
  let payload = `domain=[["id","in",[${id}]]]`;
  payload = `${payload}&model=${model}&fields=["name","id"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ASSET_NAME, GET_ASSET_NAME_SUCCESS, GET_ASSET_NAME_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetDashboardInfo(dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?name=${dashboardName}`,
      types: [GET_ASSETS_DASHBOARD_INFO, GET_ASSETS_DASHBOARD_INFO_SUCCESS, GET_ASSETS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getLocationImage(company, id, model) {
  let payload = `domain=[["id","in",[${id}]]]`;
  payload = `${payload}&model=${model}&fields=["file_path"]&limit=1`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_LOCATION_IMAGE, GET_LOCATION_IMAGE_SUCCESS, GET_LOCATION_IMAGE_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExpiryAssetsInfo(start, end, company, model) {
  let payload = `domain=[["company_id","in",[${company}]],["warranty_end_date",">=","${start}"],["warranty_end_date","<=","${end}"]]`;
  payload = `${payload}&model=${model}&fields=["id","name","warranty_end_date"]`;
  payload = `${payload}&limit=10&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXPIRY_ASSETS_INFO, GET_EXPIRY_ASSETS_INFO_SUCCESS, GET_EXPIRY_ASSETS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAuditLogsInfo(values, modelName) {
  const payload = { ids: `[${values}]`, model: modelName, method: 'message_format' };
  return {
    [CALL_API]: {
      endpoint: `call/${modelName}/message_format`,
      types: [GET_AUDIT_LOGS_INFO, GET_AUDIT_LOGS_INFO_SUCCESS, GET_AUDIT_LOGS_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getReleatedAssetsInfo(model, values) {
  const payload = `domain=[]&model=${model}&ids=[${values}]&fields=["name","equipment_seq","equipment_number","state"]`;
  return {
    [CALL_API]: {
      endpoint: `read?${payload}`,
      types: [GET_RELEATED_ASSETS_INFO, GET_RELEATED_ASSETS_INFO_SUCCESS, GET_RELEATED_ASSETS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceTypeGroupsInfo(id, model) {
  let payload = `domain=[["active","=",true],["scheduler_type","not in",["Inspection Checklist"]],["equipment_id","=",${id}]]&model=${model}&fields=["__count"]&groupby=["maintenance_type","state"]&lazy=false`;
  payload = `${payload}&context={"fill_temporal":true,"tz":"Asia/Kolkata","uid":2,"lang":"en_US",
  "group_by":["maintenance_type","state"],"graph_measure":"equipment_location_id","graph_mode":"bar","graph_groupbys":["maintenance_type","state"],"graph_intervalMapping":{},"orderedBy":[]}`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MN_GROUPS_INFO, GET_MN_GROUPS_INFO_SUCCESS, GET_MN_GROUPS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceTypeDueGroupsInfo(id, model, today) {
  let payload = `domain=[["active","=",true],["scheduler_type","not in",["Inspection Checklist"]],["equipment_id","=",${id}],["date_scheduled","<=","${today}"],["state","!=","draft"],["state","!=","done"],["state","!=","cancel"]]`;
  payload = `${payload}&model=${model}&fields=["__count"]&groupby=["maintenance_type","state"]&lazy=false`;
  payload = `${payload}&context={"fill_temporal":true,"tz":"Asia/Kolkata","lang":"en_US",`;
  payload = `${payload}"group_by":["maintenance_type","state"],"graph_intervalMapping":{},"orderedBy":[]}`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MN_GROUPS_DUE_INFO, GET_MN_GROUPS_DUE_INFO_SUCCESS, GET_MN_GROUPS_DUE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceAssetsGroupsInfo(company, space, model) {
  let payload = `domain=[["location_id","=",${space}],["company_id","in",[${company}]],["category_id","!=",false]]`;
  payload = `${payload}&model=${model}&fields=["__count"]&groupby=["category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SPACE_ASSETS_GROUPS, GET_SPACE_ASSETS_GROUPS_SUCCESS, GET_SPACE_ASSETS_GROUPS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceEquipmentsInfo(company, space, category, model, sortBy, sortField, isFloor) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (category) {
    payload = `${payload},["category_id","=",${category}]`;
  }
  if (!isFloor) {
    payload = `${payload},["location_id","=",${space}]`;
  } else {
    payload = `${payload},["floor_id","=",${space}]`;
  }
  payload = `${payload}]&model=${model}&fields=`;

  if (!isFloor) {
    payload = `${payload}["id","name","state","serial","vendor_id","category_id","tag_status","xpos","ypos","equipment_seq","location_id"]`;
  } else {
    payload = `${payload}["id","name","state","serial",("vendor_id", ["id","name"]),("category_id", ["id","name"]),"tag_status","xpos","ypos","equipment_seq",("location_id", ["id","name","space_name","path_name","full_path_space_name"]),["reading_lines_ids", ["id"]]]`;
  }

  if (sortField && sortField.length > 0) {
    payload = `${payload}&limit=1000&offset=0&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }

  const endUrl = isFloor ? `search?${payload}` : `search_read?${payload}`;

  return {
    [CALL_API]: {
      endpoint: endUrl,
      types: [GET_SPACE_EQUIPMENTS, GET_SPACE_EQUIPMENTS_SUCCESS, GET_SPACE_EQUIPMENTS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceEquipmentsExportInfo(company, space, category, model, sortBy, sortField) {
  let payload = `domain=[["location_id","=",${space}],["company_id","in",[${company}]],["category_id","in",[${category}]]]`;
  payload = `${payload}&model=${model}&fields=["name","state","vendor_id","category_id","tag_status","xpos","ypos","equipment_seq","location_id"]&limit=100&offset=0`;

  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_EXPORT_EQUIPMENTS, GET_SPACE_EXPORT_EQUIPMENTS_SUCCESS, GET_SPACE_EXPORT_EQUIPMENTS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function equipmentStateChangeInfo(id, state, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: state };
  return {
    [CALL_API]: {
      endpoint: `call/${modelName}`,
      types: [GET_ASSET_STATE_CHANGE_INFO, GET_ASSET_STATE_CHANGE_INFO_SUCCESS, GET_ASSET_STATE_CHANGE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function equipmentOperativeChangeInfo(id, state, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  return {
    [CALL_API]: {
      endpoint: `call/${modelName}`,
      types: [GET_OPERATIVE_CHANGE_INFO, GET_OPERATIVE_CHANGE_INFO_SUCCESS, GET_OPERATIVE_CHANGE_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function createBreakdownReason(result) {
  return {
    [CALL_API]: {
      endpoint: 'asset/breakdown',
      types: [CREATE_BREAKDOWN_INFO, CREATE_BREAKDOWN_INFO_SUCCESS, CREATE_BREAKDOWN_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getSpaceTicketStatesInfo(id, model) {
  let payload = `domain=[["asset_id","=",${id}]]&model=${model}&fields=["__count"]&groupby=["state_id"]&lazy=false`;
  payload = `${payload}&context={"fill_temporal":true,"tz":"Asia/Kolkata","uid":2,"lang":"en_US",
  "group_by":["state_id"],"graph_measure":"asset_id","graph_mode":"bar","graph_groupbys":["state_id"],"graph_intervalMapping":{},"orderedBy":[]}`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SPACE_TICKETS_GROUPS, GET_SPACE_TICKETS_GROUPS_SUCCESS, GET_SPACE_TICKETS_GROUPS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getGaugesInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["gauge_id","id","guage_primary_id","threshold_max","threshold_min","active_type","create_mo"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_GAUGES_INFO, GET_GAUGES_INFO_SUCCESS, GET_GAUGES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMetersInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=`;
  payload = `${payload}["meter_id","meter_id_primary_id","theoretical_time","theorical_utilization","actual_utilization","measure_type","resource_calendar_id","meter_uom","active_type","create_mo"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_METERS_INFO, GET_METERS_INFO_SUCCESS, GET_METERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceLineValuesInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=[]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_LINES_INFO, GET_SPACE_LINES_INFO_SUCCESS, GET_SPACE_LINES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function moveAssetLocationInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_ASSET_MOVE_INFO, GET_ASSET_MOVE_INFO_SUCCESS, GET_ASSET_MOVE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateEquipmentInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_EQUIPMENT_INFO, UPDATE_EQUIPMENT_INFO_SUCCESS, UPDATE_EQUIPMENT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getOperatingHoursInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HOURS_INFO, GET_HOURS_INFO_SUCCESS, GET_HOURS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPartnersInfo(company, model, type, keyword, id, validEmail) {
  let payload = `domain=[["company_id","in",[${company}]],["name","!=",false],["name","!=",""]`;
  if (id) {
    payload = `${payload},["id","not in",[${id}]]`;
  }
  if (!validEmail) {
    payload = `${payload},["display_name","!=",false],["email","!=",false]`;
  }
  if (type && type.length > 0) {
    if (type === 'customer') {
      payload = `${payload},"|",["${type}","=",true],["supplier","!=",true]`;
    } else if (type === 'is_tenant') {
      payload = `domain=[["company_id","in",[${company}]],["${type}","=",true]`;
    } else if (type === 'supplier') {
      payload = `${payload},["${type}","=",true],["parent_id", "=", false]`;
    } else {
      payload = `${payload},["${type}","=",true]`;
    }
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["display_name", "ilike", "${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["display_name","name","email","mobile"]&limit=10&offset=0&order=name ASC`;
  let endPoint = `search_read?${payload}`;
  if (type === 'group') {
    const payloads = `domain=[["company_id","in",[${company}]]]&model=product.template&fields=["preferred_vendor"]&groupby=["preferred_vendor"]`;
    endPoint = `read_group?${payloads}`;
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_PARTNERS_INFO, GET_PARTNERS_INFO_SUCCESS, GET_PARTNERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceTypesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_TYPES_INFO, GET_SPACE_TYPES_INFO_SUCCESS, GET_SPACE_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceSubTypesInfo(company, model, typeId, keyword) {
  let payload = 'domain=[["name","!=",false]';
  if (typeId) {
    payload = `${payload},["space_type_id","=",${typeId}]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_SUB_TYPES_INFO, GET_SPACE_SUB_TYPES_INFO_SUCCESS, GET_SPACE_SUB_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createSpaceInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SPACE_INFO, CREATE_SPACE_INFO_SUCCESS, CREATE_SPACE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getUNSPCCodeInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 2) {
    payload = `${payload}["name","ilike","${encodeURIComponent(keyword)}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_UNSPSC_INFO, GET_UNSPSC_INFO_SUCCESS, GET_UNSPSC_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUNSPCOtherCodeInfo(company, model, value) {
  let payload = 'domain=[';
  if (value) {
    payload = `${payload}["code","=",${value}]`;
  }
  payload = `${payload}]&model=${model}&fields=["class_id","family_id","segment_id"]&limit=1&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_UNSPSC_OTHER_INFO, GET_UNSPSC_OTHER_INFO_SUCCESS, GET_UNSPSC_OTHER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateLocationDataInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, model: modelName, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: 'write',
      types: [UPDATE_LOCATION_INFO, UPDATE_LOCATION_INFO_SUCCESS, UPDATE_LOCATION_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSpacesCountInfo(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SPACES_COUNT, GET_SPACES_COUNT_SUCCESS, GET_SPACES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getGaugesListInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_GAUGES_LIST_INFO, GET_GAUGES_LIST_INFO_SUCCESS, GET_GAUGES_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMetersListInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_METERS_LIST_INFO, GET_METERS_LIST_INFO_SUCCESS, GET_METERS_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMailActivityLogsinfo(resModel, resId, modelName) {
  let payload = `domain=[["res_model","=","${resModel}"],["res_id","=",${resId}]]`;
  payload = `${payload}&model=${modelName}&fields=["note","activity_type_id","summary","date_deadline"]`;
  payload = `${payload}&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAIL_ACTIVITIES, GET_MAIL_ACTIVITIES_SUCCESS, GET_MAIL_ACTIVITIES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReadingsInfo(values, modelName, sortField, sortBy, fieldNames) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=${fieldNames && fieldNames.length ? JSON.stringify(fieldNames) : '[]'}`;
  payload = `${payload}&limit=${values && values.length ? values.length : 0}&offset=0`;
  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField} ${sortBy}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_READINGS_INFO, GET_READINGS_INFO_SUCCESS, GET_READINGS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHistoryCardInfo(values, modelName, sortField, sortBy) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["date","nature_of_work","maintenance_type","employee_id","order_id","location_id","asset_id","checkout_to"]`;
  payload = `${payload}&limit=${values.length}&offset=0&order=${sortField} ${sortBy}`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_HISTORY_CARD_INFO, GET_HISTORY_CARD_INFO_SUCCESS, GET_HISTORY_CARD_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReadingsDetailInfo(id, modelName) {
  const fields = assetColumns && assetColumns.viewReadingFields ? assetColumns.viewReadingFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_READINGS_DETAIL_INFO, GET_READINGS_DETAIL_INFO_SUCCESS, GET_READINGS_DETAIL_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getDataLinesInfo(id, modelName) {
  const fields = assetColumns && assetColumns.viewDataLineFields ? assetColumns.viewDataLineFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_DATALINE_INFO, GET_DATALINE_INFO_SUCCESS, GET_DATALINE_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getReadingsLogInfo(id, modelName, limit, offset, fields, domain, readings, customFilters, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["${domain}","in",[${id}]]`;
  if (readings && readings.length > 0) {
    payload = `${payload},["reading_id","in",[${readings}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${modelName}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue) {
    payload = `${payload} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_READINGS_LOG_INFO, GET_READINGS_LOG_INFO_SUCCESS, GET_READINGS_LOG_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReadingsLogCount(id, modelName, domain, readings, customFilters, globalFilter) {
  let payload = `domain=[["${domain}","in",[${id}]]`;
  if (readings && readings.length > 0) {
    payload = `${payload},["reading_id","in",[${readings}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  payload = `${payload}]&model=${modelName}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_READINGSLOG_COUNT, GET_READINGSLOG_COUNT_SUCCESS, GET_READINGSLOG_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReadingsLogExportInfo(id, model, limit, offset, fields, domain, readings, customFilters, rows, sortBy, sortField, globalFilter) {
  let payload = `domain=[["${domain}","in",[${id}]]`;
  if (readings && readings.length > 0) {
    payload = `${payload},["reading_id","in",[${readings}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}`;

  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_READINGSLOG_EXPORT_INFO, GET_READINGSLOG_EXPORT_INFO_SUCCESS, GET_READINGSLOG_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getReadingsList(modelName, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${modelName}&fields=[]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_READINGS, GET_READINGS_SUCCESS, GET_READINGS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPreventiveCheckLists(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload}]&model=${model}&fields=["id","name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHECKLIST_INFO, GET_CHECKLIST_INFO_SUCCESS, GET_CHECKLIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamCategoryInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAM_CATEGORY_INFO, GET_TEAM_CATEGORY_INFO_SUCCESS, GET_TEAM_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAlarmCategoryInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALARM_CATEGORY_INFO, GET_ALARM_CATEGORY_INFO_SUCCESS, GET_ALARM_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAlarmRecipientsInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALARM_RECIPIENTS_INFO, GET_ALARM_RECIPIENTS_INFO_SUCCESS, GET_ALARM_RECIPIENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAlarmActionsInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALARM_ACTIONS_INFO, GET_ALARM_ACTIONS_INFO_SUCCESS, GET_ALARM_ACTIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createReadingLogInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_READING_INFO, CREATE_READING_INFO_SUCCESS, CREATE_READING_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getSpacePath(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["path_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["path_name"]&limit=20&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SP_INFO, GET_SP_INFO_SUCCESS, GET_SP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createImportIdInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_IMPORT_ID_INFO, CREATE_IMPORT_ID_INFO_SUCCESS, CREATE_IMPORT_ID_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function uploadImportInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [UPLOAD_IMPORT_INFO, UPLOAD_IMPORT_INFO_SUCCESS, UPLOAD_IMPORT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getQRCodeImageInfo(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]]`;
  payload = `${payload}&model=${model}&fields=["qr_code_image"]&limit=1&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_QR_IMAGE_INFO, GET_QR_IMAGE_INFO_SUCCESS, GET_QR_IMAGE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

// export function getIncidentReportInfo(company, model) {
//   let payload = `domain=[["company_id","=",${company}]]`;
//   payload = `${payload}&model=${model}&fields=["state", "name", "maintenance_team_id", "reported_by", "reported_on", "accepted_by", "accepted_on", "company_id", "display_name"]&limit=&offset=0`;
//   return {
//     [CALL_API]: {
//       endpoint: `search_read?${payload}`,
//       types: [GET_INCIDENT_REPORT_INFO, GET_INCIDENT_REPORT_INFO_SUCCESS, GET_INCIDENT_REPORT_INFO_FAILURE],
//       method: 'GET',
//       payload,
//     },
//   };
// }

export function getIncidentReportInfo(company, model, team, reportedId, acceptedId, reportedStart, reportedEnd, acceptedStart, acceptedEnd, state) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (team) {
    payload = `${payload},["maintenance_team_id","=",${JSON.stringify([team])}]`;
  }
  if (reportedId) {
    payload = `${payload},["reported_by","=",${JSON.stringify([reportedId])}]`;
  }
  if (acceptedId) {
    payload = `${payload},["accepted_by","=",${JSON.stringify([acceptedId])}]`;
  }
  if (reportedStart && reportedEnd) {
    payload = `${payload},["reported_on",">=","${reportedStart}"],["reported_on","<=","${reportedEnd}"]`;
  }
  if (acceptedStart && acceptedEnd) {
    payload = `${payload},["accepted_on",">=","${acceptedStart}"],["accepted_on","<=","${acceptedEnd}"]`;
  }
  if (state) {
    payload = `${payload},["state","=","${state}"]`;
  }

  payload = `${payload}]&model=${model}&fields=["state", "name", "maintenance_team_id", "reported_by", "reported_on", "accepted_by", "accepted_on", "company_id", "display_name"]`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENT_REPORT_INFO, GET_INCIDENT_REPORT_INFO_SUCCESS, GET_INCIDENT_REPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquimentsFloorMapInfo(company, space, category, model) {
  let payload = `domain=[["location_id","=",${space}],["company_id","in",[${company}]],["category_id","=",${category}]]`;
  payload = `${payload}&model=${model}&fields=["name","state","equipment_seq","xpos","ypos"]&limit=100&offset=0`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAP_EQUIPMENTS, GET_MAP_EQUIPMENTS_SUCCESS, GET_MAP_EQUIPMENTS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllSpacesInfo(building, company, isSpecificFields) {
  const companyIds = `["company_id","in",[${company}]]`;

  let endPointAPI = `space/list/hierarchy?space_id=${building}&${companyIds}`;
  if (isSpecificFields) {
    endPointAPI = `space/list/hierarchy/onboarding?space_id=${building}&${companyIds}`;
  }
  return {
    [CALL_API]: {
      endpoint: endPointAPI,
      types: [GET_ALL_SPACES, GET_ALL_SPACES_SUCCESS, GET_ALL_SPACES_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getAuditReports(company, model, start, end, groupBy, validStatus) {
  let payload = `domain=[["company_id","in",[${company}]],["is_itasset", "=", false]`;
  if (groupBy) {
    payload = `${payload},["${groupBy}","!=",false]`;
  }
  if (start && end) {
    payload = `${payload},["validated_on",">=","${start}"],["validated_on","<=","${end}"]`;
  }
  if (validStatus) {
    payload = `${payload},["validation_status","=","${validStatus}"]`;
  }

  payload = `${payload}]&model=${model}`;

  if (groupBy) {
    payload = `${payload}&fields=["${groupBy}"]&groupby=["${groupBy}"]&order=${groupBy} ASC`;
  }

  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_AUDIT_INFO, GET_AUDIT_INFO_SUCCESS, GET_AUDIT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=["image_medium"]`,
      types: [GET_CATEGORY_IMAGE_INFO, GET_CATEGORY_IMAGE_INFO_SUCCESS, GET_CATEGORY_IMAGE_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getWarrentyAgeReports(company, model, limit, offset, fields, searchValueMultiple, noOrder) {
  const conditions = `${searchValueMultiple}`;
  const payload = {
    domain: conditions, model, fields: JSON.stringify(fields), limit, offset,
  };
  if (!noOrder) {
    payload.order = '';
  }
  return {
    [CALL_API]: {
      endpoint: 'isearch_read',
      types: [GET_WA_INFO, GET_WA_INFO_SUCCESS, GET_WA_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getGlobalCategoriesInfo(company) {
  return {
    [CALL_API]: {
      endpoint: 'asset/category',
      types: [GET_GLOBAL_CATEGORIES_INFO, GET_GLOBAL_CATEGORIES_INFO_SUCCESS, GET_GLOBAL_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      company,
    },
  };
}

export function getAssetAvailabilityInfo(space) {
  let payload = '';
  if (space) {
    // payload = `${payload}&space_id=${JSON.stringify(space)}`;
    payload = `${payload}&space_id=${space}`;
  }

  return {
    [CALL_API]: {
      endpoint: `getAuditStatusReport?${payload}`,
      types: [GET_AVL_INFO, GET_AVL_INFO_SUCCESS, GET_AVL_INFO_FAILURE],
      method: 'GET',
      space,
    },
  };
}

export function getThresholdDataInfo() {
  const payload = {
    model: 'mro.equipment.location',
    fields: '["id","name",("asset_category_id",["id","name"]),["reading_lines_ids",["id","sequence","is_active","value_min","value_max",("uom_id",["name"]),("reading_id",["name"]),["threshold_line",["id","name","is_trendline","min","max","impact","source","definition","suggestion","color_code"]]]]]',
    limit: 15,
  };
  return {
    [CALL_API]: {
      endpoint: 'isearch_read_v2',
      types: [GET_THRESHOLDS_DATA_INFO, GET_THRESHOLDS_DATA_INFO_SUCCESS, GET_THRESHOLDS_DATA_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getAssetMisplacedInfo(date, asset, space) {
  let payload = '';

  if (date) {
    payload = `${payload}date=${date}`;
  }
  if (asset) {
    // payload = `${payload}&equipment_id=${JSON.stringify(asset)}`;
    payload = `${payload}&equipment_id=${asset}`;
  }
  if (space) {
    // payload = `${payload}&space_id=${JSON.stringify(space)}`;
    payload = `${payload}&space_id=${space}`;
  }
  return {
    [CALL_API]: {
      endpoint: `getMisplacedAsset?${payload}`,
      types: [GET_MP_INFO, GET_MP_INFO_SUCCESS, GET_MP_INFO_FAILURE],
      method: 'GET',
      date,
    },
  };
}

export function getPublicDashboardUuidInfo(company, floorId, model) {
  const payload = `domain=[["company_id","in",[${company}]],["space_id","in",[${floorId}]]]&model=${model}&fields=["uuid"]&limit=1&offset=0`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_AQ_CONFIG, GET_AQ_CONFIG_SUCCESS, GET_AQ_CONFIG_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVisitPurposesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_VP_INFO, GET_VP_INFO_SUCCESS, GET_VP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetsBasedOnCategoryInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, categoryType, categoryId, globalFilter, fields) {
  const defaultFields = '["id", "name",("location_id",["id","path_name","space_name"])]';
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

  if (categoryType === 'e') {
    payload = `${payload},["category_id","=",${categoryId}]`;
  } else {
    payload = `${payload},["asset_category_id","=",${categoryId}]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${modelName}&fields=${fields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ASSETCAT_INFO, GET_ASSETCAT_INFO_SUCCESS, GET_ASSETCAT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetsBasedOnCategoryCountInfo(company, model, customFilters, categoryType, categoryId, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

  if (categoryType === 'e') {
    payload = `${payload},["category_id","=",${categoryId}]`;
  } else {
    payload = `${payload},["asset_category_id","=",${categoryId}]`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ASSETCAT_COUNT, GET_ASSETCAT_COUNT_SUCCESS, GET_ASSETCAT_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAssetsBasedOnCategoryExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, categoryType, categoryId, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  const defaultFields = '["id", "name",("location_id",["id","path_name","space_name"])]';

  if (categoryType === 'e') {
    payload = `${payload},["category_id","=",${categoryId}]`;
  } else {
    payload = `${payload},["asset_category_id","=",${categoryId}]`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields || defaultFields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ASSETCAT_EXPORT_INFO, GET_ASSETCAT_EXPORT_INFO_SUCCESS, GET_ASSETCAT_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquipmentCostInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EQUIPMENT_COST_INFO, GET_EQUIPMENT_COST_INFO_SUCCESS, GET_EQUIPMENT_COST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpacesListInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, keyword, isITAsset, categoryType, globalFilter, fields, ids, assetCategory) {
  const defaultFields = '["id", "space_name", "path_name", ("asset_category_id",["id","name"])]';
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  if (ids) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }
  if (assetCategory) {
    payload = `${payload},["asset_category_id","=",${assetCategory}]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${modelName}&fields=${fields || defaultFields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SPACE_TABLE_INFO, GET_SPACE_TABLE_INFO_SUCCESS, GET_SPACE_TABLE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getSpaceTableExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, isITAsset, categoryType, assetCategory) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  const defaultFields = '["id", "space_name", "path_name", ("asset_category_id",["id","name"])]';

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (assetCategory) {
    payload = `${payload},["asset_category_id","=",${assetCategory}]`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${defaultFields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SPACE_TABLE_EXPORT_INFO, GET_SPACE_TABLE_EXPORT_INFO_SUCCESS, GET_SPACE_TABLE_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpacesTableCountInfo(company, model, customFilters, isITAsset, categoryType, globalFilter, ids, assetCategory) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  if (ids) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }
  if (assetCategory) {
    payload = `${payload},["asset_category_id","=",${assetCategory}]`;
  }

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SPACE_TABLE_COUNT_INFO, GET_SPACE_TABLE_COUNT_INFO_SUCCESS, GET_SPACE_TABLE_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
