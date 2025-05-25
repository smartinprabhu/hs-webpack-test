/* eslint-disable max-len */
import { CALL_API } from '../../middleware/api';
import ticketColumns from './data/ticketsActions.json';
import AuthService from '../util/authService';

export const GET_TICKETS_INFO = 'GET_TICKETS_INFO';
export const GET_TICKETS_INFO_SUCCESS = 'GET_TICKETS_INFO_SUCCESS';
export const GET_TICKETS_INFO_FAILURE = 'GET_TICKETS_INFO_FAILURE';

export const CREATE_TICKET_INFO = 'CREATE_TICKET_INFO';
export const CREATE_TICKET_INFO_SUCCESS = 'CREATE_TICKET_INFO_SUCCESS';
export const CREATE_TICKET_INFO_FAILURE = 'CREATE_TICKET_INFO_FAILURE';

export const CREATE_CLOSE_TICKET_INFO = 'CREATE_CLOSE_TICKET_INFO';
export const CREATE_CLOSE_TICKET_INFO_SUCCESS = 'CREATE_CLOSE_TICKET_INFO_SUCCESS';
export const CREATE_CLOSE_TICKET_INFO_FAILURE = 'CREATE_CLOSE_TICKET_INFO_FAILURE';

export const GET_TICKETS_COUNT = 'GET_TICKETS_COUNT';
export const GET_TICKETS_COUNT_SUCCESS = 'GET_TICKETS_COUNT_SUCCESS';
export const GET_TICKETS_COUNT_FAILURE = 'GET_TICKETS_COUNT_FAILURE';

export const GET_HD_STATE_CHANGE_INFO = 'GET_HD_STATE_CHANGE_INFO';
export const GET_HD_STATE_CHANGE_INFO_SUCCESS = 'GET_HD_STATE_CHANGE_INFO_SUCCESS';
export const GET_HD_STATE_CHANGE_INFO_FAILURE = 'GET_HD_STATE_CHANGE_INFO_FAILURE';

export const GET_SPACES_INFO = 'GET_SPACES_INFO';
export const GET_SPACES_INFO_SUCCESS = 'GET_SPACES_INFO_SUCCESS';
export const GET_SPACES_INFO_FAILURE = 'GET_SPACES_INFO_FAILURE';

export const GET_SPACE_CHILDS = 'GET_SPACE_CHILDS';
export const GET_SPACE_CHILDS_SUCCESS = 'GET_SPACE_CHILDS_SUCCESS';
export const GET_SPACE_CHILDS_FAILURE = 'GET_SPACE_CHILDS_FAILURE';

export const GET_SPACESLIST_INFO = 'GET_SPACESLIST_INFO';
export const GET_SPACESLIST_INFO_SUCCESS = 'GET_SPACESLIST_INFO_SUCCESS';
export const GET_SPACESLIST_INFO_FAILURE = 'GET_SPACESLIST_INFO_FAILURE';

export const GET_CATEGORY_INFO = 'GET_CATEGORY_INFO';
export const GET_CATEGORY_INFO_SUCCESS = 'GET_CATEGORY_INFO_SUCCESS';
export const GET_CATEGORY_INFO_FAILURE = 'GET_CATEGORY_INFO_FAILURE';

export const GET_SUBCATEGORY_INFO = 'GET_SUBCATEGORY_INFO';
export const GET_SUBCATEGORY_INFO_SUCCESS = 'GET_SUBCATEGORY_INFO_SUCCESS';
export const GET_SUBCATEGORY_INFO_FAILURE = 'GET_SUBCATEGORY_INFO_FAILURE';

export const GET_EQUIPMENT_INFO = 'GET_EQUIPMENT_INFO';
export const GET_EQUIPMENT_INFO_SUCCESS = 'GET_EQUIPMENT_INFO_SUCCESS';
export const GET_EQUIPMENT_INFO_FAILURE = 'GET_EQUIPMENT_INFO_FAILURE';

export const GET_EQUIPMENT_INFO_REPORT = 'GET_EQUIPMENT_INFO_REPORT';
export const GET_EQUIPMENT_INFO_REPORT_SUCCESS = 'GET_EQUIPMENT_INFO_REPORT_SUCCESS';
export const GET_EQUIPMENT_INFO_REPORT_FAILURE = 'GET_EQUIPMENT_INFO_REPORT_FAILURE';

export const GET_SPACE_SEARCH_INFO = 'GET_SPACE_SEARCH_INFO';
export const GET_SPACE_SEARCH_INFO_SUCCESS = 'GET_SPACE_SEARCH_INFO_SUCCESS';
export const GET_SPACE_SEARCH_INFO_FAILURE = 'GET_SPACE_SEARCH_INFO_FAILURE';

export const GET_CATEGORIES_GROUP_INFO = 'GET_CATEGORIES_GROUP_INFO';
export const GET_CATEGORIES_GROUP_INFO_SUCCESS = 'GET_CATEGORIES_GROUP_INFO_SUCCESS';
export const GET_CATEGORIES_GROUP_INFO_FAILURE = 'GET_CATEGORIES_GROUP_INFO_FAILURE';

export const GET_SUB_CATEGORIES_GROUP_INFO = 'GET_SUB_CATEGORIES_GROUP_INFO';
export const GET_SUB_CATEGORIES_GROUP_INFO_SUCCESS = 'GET_SUB_CATEGORIES_GROUP_INFO_SUCCESS';
export const GET_SUB_CATEGORIES_GROUP_INFO_FAILURE = 'GET_SUB_CATEGORIES_GROUP_INFO_FAILURE';

export const GET_MAINTENANCE_GROUP_INFO = 'GET_MAINTENANCE_GROUP_INFO';
export const GET_MAINTENANCE_GROUP_INFO_SUCCESS = 'GET_MAINTENANCE_GROUP_INFO_SUCCESS';
export const GET_MAINTENANCE_GROUP_INFO_FAILURE = 'GET_MAINTENANCE_GROUP_INFO_FAILURE';

export const GET_REGION_GROUP_INFO = 'GET_REGION_GROUP_INFO';
export const GET_REGION_GROUP_INFO_SUCCESS = 'GET_REGION_GROUP_INFO_SUCCESS';
export const GET_REGION_GROUP_INFO_FAILURE = 'GET_REGION_GROUP_INFO_FAILURE';

export const GET_STATES_GROUP_INFO = 'GET_STATES_GROUP_INFO';
export const GET_STATES_GROUP_INFO_SUCCESS = 'GET_STATES_GROUP_INFO_SUCCESS';
export const GET_STATES_GROUP_INFO_FAILURE = 'GET_STATES_GROUP_INFO_FAILURE';

export const GET_INCIDENT_STATES_GROUP_INFO = 'GET_INCIDENT_STATES_GROUP_INFO';
export const GET_INCIDENT_STATES_GROUP_INFO_SUCCESS = 'GET_INCIDENT_STATES_GROUP_INFO_SUCCESS';
export const GET_INCIDENT_STATES_GROUP_INFO_FAILURE = 'GET_INCIDENT_STATES_GROUP_INFO_FAILURE';

export const GET_PRIORITIES_GROUP_INFO = 'GET_PRIORITIES_GROUP_INFO';
export const GET_PRIORITIES_GROUP_INFO_SUCCESS = 'GET_PRIORITIES_GROUP_INFO_SUCCESS';
export const GET_PRIORITIES_GROUP_INFO_FAILURE = 'GET_PRIORITIES_GROUP_INFO_FAILURE';

export const GET_TICKET_DETAILS_INFO = 'GET_TICKET_DETAILS_INFO';
export const GET_TICKET_DETAILS_INFO_SUCCESS = 'GET_TICKET_DETAILS_INFO_SUCCESS';
export const GET_TICKET_DETAILS_INFO_FAILURE = 'GET_TICKET_DETAILS_INFO_FAILURE';

export const GET_SLA_DETAILS_INFO = 'GET_SLA_DETAILS_INFO';
export const GET_SLA_DETAILS_INFO_SUCCESS = 'GET_SLA_DETAILS_INFO_SUCCESS';
export const GET_SLA_DETAILS_INFO_FAILURE = 'GET_SLA_DETAILS_INFO_FAILURE';

export const GET_SLA1_DETAILS_INFO = 'GET_SLA1_DETAILS_INFO';
export const GET_SLA1_DETAILS_INFO_SUCCESS = 'GET_SLA1_DETAILS_INFO_SUCCESS';
export const GET_SLA1_DETAILS_INFO_FAILURE = 'GET_SLA1_DETAILS_INFO_FAILURE';

export const GET_SLA2_DETAILS_INFO = 'GET_SLA2_DETAILS_INFO';
export const GET_SLA2_DETAILS_INFO_SUCCESS = 'GET_SLA2_DETAILS_INFO_SUCCESS';
export const GET_SLA2_DETAILS_INFO_FAILURE = 'GET_SLA2_DETAILS_INFO_FAILURE';

export const GET_SLA3_DETAILS_INFO = 'GET_SLA3_DETAILS_INFO';
export const GET_SLA3_DETAILS_INFO_SUCCESS = 'GET_SLA3_DETAILS_INFO_SUCCESS';
export const GET_SLA3_DETAILS_INFO_FAILURE = 'GET_SLA3_DETAILS_INFO_FAILURE';

export const GET_SLA4_DETAILS_INFO = 'GET_SLA4_DETAILS_INFO';
export const GET_SLA4_DETAILS_INFO_SUCCESS = 'GET_SLA4_DETAILS_INFO_SUCCESS';
export const GET_SLA4_DETAILS_INFO_FAILURE = 'GET_SLA4_DETAILS_INFO_FAILURE';

export const GET_SLA5_DETAILS_INFO = 'GET_SLA5_DETAILS_INFO';
export const GET_SLA5_DETAILS_INFO_SUCCESS = 'GET_SLA5_DETAILS_INFO_SUCCESS';
export const GET_SLA5_DETAILS_INFO_FAILURE = 'GET_SLA5_DETAILS_INFO_FAILURE';

export const GET_DOCUMENT_INFO = 'GET_DOCUMENT_INFO';
export const GET_DOCUMENT_INFO_SUCCESS = 'GET_DOCUMENT_INFO_SUCCESS';
export const GET_DOCUMENT_INFO_FAILURE = 'GET_DOCUMENT_INFO_FAILURE';

export const GET_DOWNLOAD_INFO = 'GET_DOWNLOAD_INFO';
export const GET_DOWNLOAD_INFO_SUCCESS = 'GET_DOWNLOAD_INFO_SUCCESS';
export const GET_DOWNLOAD_INFO_FAILURE = 'GET_DOWNLOAD_INFO_FAILURE';

export const CREATE_DOCUMENT_INFO = 'CREATE_DOCUMENT_INFO';
export const CREATE_DOCUMENT_INFO_SUCCESS = 'CREATE_DOCUMENT_INFO_SUCCESS';
export const CREATE_DOCUMENT_INFO_FAILURE = 'CREATE_DOCUMENT_INFO_FAILURE';

export const CREATE_DOCUMENTATT_INFO = 'CREATE_DOCUMENTATT_INFO';
export const CREATE_DOCUMENTATT_INFO_SUCCESS = 'CREATE_DOCUMENTATT_INFO_SUCCESS';
export const CREATE_DOCUMENTATT_INFO_FAILURE = 'CREATE_DOCUMENTATT_INFO_FAILURE';

export const UPDATE_DOCUMENTATT_INFO = 'UPDATE_DOCUMENTATT_INFO';
export const UPDATE_DOCUMENTATT_INFO_SUCCESS = 'UPDATE_DOCUMENTATT_INFO_SUCCESS';
export const UPDATE_DOCUMENTATT_INFO_FAILURE = 'UPDATE_DOCUMENTATT_INFO_FAILURE';

export const GET_TICKETS_DASHBOARD_INFO = 'GET_TICKETS_DASHBOARD_INFO';
export const GET_TICKETS_DASHBOARD_INFO_SUCCESS = 'GET_TICKETS_DASHBOARD_INFO_SUCCESS';
export const GET_TICKETS_DASHBOARD_INFO_FAILURE = 'GET_TICKETS_DASHBOARD_INFO_FAILURE';

export const GET_TICKETS_EXPORT_INFO = 'GET_TICKETS_EXPORT_INFO';
export const GET_TICKETS_EXPORT_INFO_SUCCESS = 'GET_TICKETS_EXPORT_INFO_SUCCESS';
export const GET_TICKETS_EXPORT_INFO_FAILURE = 'GET_TICKETS_EXPORT_INFO_FAILURE';

export const CREATE_MESSAGE_INFO = 'CREATE_MESSAGE_INFO';
export const CREATE_MESSAGE_INFO_SUCCESS = 'CREATE_MESSAGE_INFO_SUCCESS';
export const CREATE_MESSAGE_INFO_FAILURE = 'CREATE_MESSAGE_INFO_FAILURE';

export const GET_RECEIPENT_INFO = 'GET_RECEIPENT_INFO';
export const GET_RECEIPENT_INFO_SUCCESS = 'GET_RECEIPENT_INFO_SUCCESS';
export const GET_RECEIPENT_INFO_FAILURE = 'GET_RECEIPENT_INFO_FAILURE';

export const GET_PRIORITY_INFO = 'GET_PRIORITY_INFO';
export const GET_PRIORITY_INFO_SUCCESS = 'GET_PRIORITY_INFO_SUCCESS';
export const GET_PRIORITY_INFO_FAILURE = 'GET_PRIORITY_INFO_FAILURE';

export const GET_TICKET_STATE_INFO = 'GET_TICKET_STATE_INFO';
export const GET_TICKET_STATE_INFO_SUCCESS = 'GET_TICKET_STATE_INFO_SUCCESS';
export const GET_TICKET_STATE_INFO_FAILURE = 'GET_TICKET_STATE_INFO_FAILURE';

export const GET_FILTER_HELPDESK = 'GET_FILTER_HELPDESK';
export const GET_ROWS_HELPDESK = 'GET_ROWS_HELPDESK';
export const GET_UPLOAD_IMAGE = 'GET_UPLOAD_IMAGE';
export const GET_UPLOAD_IMAGE_FORM = 'GET_UPLOAD_IMAGE_FORM';
export const GET_CASCADER_INFO = 'GET_CASCADER_INFO';

export const GET_EXTRA_LIST_INFO = 'GET_EXTRA_LIST_INFO';
export const GET_EXTRA_LIST_INFO_SUCCESS = 'GET_EXTRA_LIST_INFO_SUCCESS';
export const GET_EXTRA_LIST_INFO_FAILURE = 'GET_EXTRA_LIST_INFO_FAILURE';

export const GET_EXTRA_COUNT_INFO = 'GET_EXTRA_COUNT_INFO';
export const GET_EXTRA_COUNT_INFO_SUCCESS = 'GET_EXTRA_COUNT_INFO_SUCCESS';
export const GET_EXTRA_COUNT_INFO_FAILURE = 'GET_EXTRA_COUNT_INFO_FAILURE';

export const GET_EXTRA_COUNT_MULTIPLE = 'GET_EXTRA_COUNT_MULTIPLE';
export const GET_EXTRA_COUNT_MULTIPLE_SUCCESS = 'GET_EXTRA_COUNT_MULTIPLE_SUCCESS';
export const GET_EXTRA_COUNT_MULTIPLE_FAILURE = 'GET_EXTRA_COUNT_MULTIPLE_FAILURE';

export const GET_EXTRA_LIST_MULTIPLE = 'GET_EXTRA_LIST_MULTIPLE';
export const GET_EXTRA_LIST_MULTIPLE_SUCCESS = 'GET_EXTRA_LIST_MULTIPLE_SUCCESS';
export const GET_EXTRA_LIST_MULTIPLE_FAILURE = 'GET_EXTRA_LIST_MULTIPLE_FAILURE';

export const GET_TICKET_NAMES_INFO = 'GET_TICKET_NAMES_INFO';
export const GET_TICKET_NAMES_INFO_SUCCESS = 'GET_TICKET_NAMES_INFO_SUCCESS';
export const GET_TICKET_NAMES_INFO_FAILURE = 'GET_TICKET_NAMES_INFO_FAILURE';

export const UPDATE_TICKET_INFO = 'UPDATE_TICKET_INFO';
export const UPDATE_TICKET_INFO_SUCCESS = 'UPDATE_TICKET_INFO_SUCCESS';
export const UPDATE_TICKET_INFO_FAILURE = 'UPDATE_TICKET_INFO_FAILURE';
export const UPDATE_TICKET_INFO_SUCCESS_NEW = 'UPDATE_TICKET_INFO_SUCCESS_NEW';

export const GET_TICKET_ORDERS_INFO = 'GET_TICKET_ORDERS_INFO';
export const GET_TICKET_ORDERS_INFO_SUCCESS = 'GET_TICKET_ORDERS_INFO_SUCCESS';
export const GET_TICKET_ORDERS_INFO_FAILURE = 'GET_TICKET_ORDERS_INFO_FAILURE';

export const ESCALATE_TICKET_INFO = 'ESCALATE_TICKET_INFO';
export const ESCALATE_TICKET_INFO_SUCCESS = 'ESCALATE_TICKET_INFO_SUCCESS';
export const ESCALATE_TICKET_INFO_FAILURE = 'ESCALATE_TICKET_INFO_FAILURE';

export const GET_INCIDENT_TYPES_INFO = 'GET_INCIDENT_TYPES_INFO';
export const GET_INCIDENT_TYPES_INFO_SUCCESS = 'GET_INCIDENT_TYPES_INFO_SUCCESS';
export const GET_INCIDENT_TYPES_INFO_FAILURE = 'GET_INCIDENT_TYPES_INFO_FAILURE';

export const GET_INCIDENT_SEVERITY_INFO = 'GET_INCIDENT_SEVERITY_INFO';
export const GET_INCIDENT_SEVERITY_INFO_SUCCESS = 'GET_INCIDENT_SEVERITY_INFO_SUCCESS';
export const GET_INCIDENT_SEVERITY_INFO_FAILURE = 'GET_INCIDENT_SEVERITY_INFO_FAILURE';

export const GET_INCIDENT_INJURIES_INFO = 'GET_INCIDENT_INJURIES_INFO';
export const GET_INCIDENT_INJURIES_INFO_SUCCESS = 'GET_INCIDENT_INJURIES_INFO_SUCCESS';
export const GET_INCIDENT_INJURIES_INFO_FAILURE = 'GET_INCIDENT_INJURIES_INFO_FAILURE';

export const GET_INCIDENT_DAMAGES_INFO = 'GET_INCIDENT_DAMAGES_INFO';
export const GET_INCIDENT_DAMAGES_INFO_SUCCESS = 'GET_INCIDENT_DAMAGES_INFO_SUCCESS';
export const GET_INCIDENT_DAMAGES_INFO_FAILURE = 'GET_INCIDENT_DAMAGES_INFO_FAILURE';

export const GET_INCIDENT_TYPES_GROUP_INFO = 'GET_INCIDENT_TYPES_GROUP_INFO';
export const GET_INCIDENT_TYPES_GROUP_INFO_SUCCESS = 'GET_INCIDENT_TYPES_GROUP_INFO_SUCCESS';
export const GET_INCIDENT_TYPES_GROUP_INFO_FAILURE = 'GET_INCIDENT_TYPES_GROUP_INFO_FAILURE';

export const DELETE_ATTATCHMENT_INFO = 'DELETE_ATTATCHMENT_INFO';
export const DELETE_ATTATCHMENT_INFO_SUCCESS = 'DELETE_ATTATCHMENT_INFO_SUCCESS';
export const DELETE_ATTATCHMENT_INFO_FAILURE = 'DELETE_ATTATCHMENT_INFO_FAILURE';

export const GET_SITE_CATEGORY_INFO = 'GET_SITE_CATEGORY_INFO';
export const GET_SITE_CATEGORY_INFO_SUCCESS = 'GET_SITE_CATEGORY_INFO_SUCCESS';
export const GET_SITE_CATEGORY_INFO_FAILURE = 'GET_SITE_CATEGORY_INFO_FAILURE';

export const GET_ORDER_FULL_INFO = 'GET_ORDER_FULL_INFO';
export const GET_ORDER_FULL_INFO_SUCCESS = 'GET_ORDER_FULL_INFO_SUCCESS';
export const GET_ORDER_FULL_INFO_FAILURE = 'GET_ORDER_FULL_INFO_FAILURE';

export const GET_MAINTENANCE_CONFIG_LIST = 'GET_MAINTENANCE_CONFIG_LIST';
export const GET_MAINTENANCE_CONFIG_SUCCESS_LIST = 'GET_MAINTENANCE_CONFIG_SUCCESS_LIST';
export const GET_MAINTENANCE_CONFIG_FAILURE_LIST = 'GET_MAINTENANCE_CONFIG_FAILURE_LIST';

export const GET_MAINTENANCE_CONFIGUARATION_INFO = 'GET_MAINTENANCE_CONFIGUARATION_INFO';
export const GET_MAINTENANCE_CONFIGUARATION_INFO_SUCCESS = 'GET_MAINTENANCE_CONFIGUARATION_INFO_SUCCESS';
export const GET_MAINTENANCE_CONFIGUARATION_INFO_FAILURE = 'GET_MAINTENANCE_CONFIGUARATION_INFO_FAILURE';

export const GET_HELPDESK_DASHBOARD_INFO = 'GET_HELPDESK_DASHBOARD_INFO';
export const GET_HELPDESK_DASHBOARD_INFO_SUCCESS = 'GET_HELPDESK_DASHBOARD_INFO_SUCCESS';
export const GET_HELPDESK_DASHBOARD_INFO_FAILURE = 'GET_HELPDESK_DASHBOARD_INFO_FAILURE';

export const GET_HELPDESK_TEAMS_INFO = 'GET_HELPDESK_TEAMS_INFO';
export const GET_HELPDESK_TEAMS_INFO_SUCCESS = 'GET_HELPDESK_TEAMS_INFO_SUCCESS';
export const GET_HELPDESK_TEAMS_INFO_FAILURE = 'GET_HELPDESK_TEAMS_INFO_FAILURE';

export const GET_DISPLAY_NAME_INFO = 'GET_DISPLAY_NAME_INFO';
export const GET_DISPLAY_NAME_INFO_SUCCESS = 'GET_DISPLAY_NAME_INFO_SUCCESS';
export const GET_DISPLAY_NAME_INFO_FAILURE = 'GET_DISPLAY_NAME_INFO_FAILURE';

export const GET_MESSAGE_TEMPLATE_INFO = 'GET_MESSAGE_TEMPLATE_INFO';
export const GET_MESSAGE_TEMPLATE_INFO_SUCCESS = 'GET_MESSAGE_TEMPLATE_INFO_SUCCESS';
export const GET_MESSAGE_TEMPLATE_INFO_FAILURE = 'GET_MESSAGE_TEMPLATE_INFO_FAILURE';

export const SHARE_TICKET_INFO = 'SHARE_TICKET_INFO';
export const SHARE_TICKET_INFO_SUCCESS = 'SHARE_TICKET_INFO_SUCCESS';
export const SHARE_TICKET_INFO_FAILURE = 'SHARE_TICKET_INFO_FAILURE';

export const GET_HELPDESK_VENDORS_INFO = 'GET_HELPDESK_VENDORS_INFO';
export const GET_HELPDESK_VENDORS_INFO_SUCCESS = 'GET_HELPDESK_VENDORS_INFO_SUCCESS';
export const GET_HELPDESK_VENDORS_INFO_FAILURE = 'GET_HELPDESK_VENDORS_INFO_FAILURE';

export const GET_HELPDESK_REPORTS_INFO = 'GET_HELPDESK_REPORTS_INFO';
export const GET_HELPDESK_REPORTS_INFO_SUCCESS = 'GET_HELPDESK_REPORTS_INFO_SUCCESS';
export const GET_HELPDESK_REPORTS_INFO_FAILURE = 'GET_HELPDESK_REPORTS_INFO_FAILURE';

export const GET_HELPDESK_REPORTS_LOAD_INFO = 'GET_HELPDESK_REPORTS_LOAD_INFO';
export const GET_HELPDESK_REPORTS_LOAD_INFO_FAILURE = 'GET_HELPDESK_REPORTS_LOAD_INFO_FAILURE';

export const GET_MULT_DOCUMENT_INFO = 'GET_MULT_DOCUMENT_INFO';
export const GET_MULT_DOCUMENT_INFO_SUCCESS = 'GET_MULT_DOCUMENT_INFO_SUCCESS';
export const GET_MULT_DOCUMENT_INFO_FAILURE = 'GET_MULT_DOCUMENT_INFO_FAILURE';

export const GET_MODEL_FILTERS_INFO = 'GET_MODEL_FILTERS_INFO';
export const GET_MODEL_FILTERS_INFO_SUCCESS = 'GET_MODEL_FILTERS_INFO_SUCCESS';
export const GET_MODEL_FILTERS_INFO_FAILURE = 'GET_MODEL_FILTERS_INFO_FAILURE';

export const GET_CXO_CONFIG_INFO = 'GET_CXO_CONFIG_INFO';
export const GET_CXO_CONFIG_INFO_SUCCESS = 'GET_CXO_CONFIG_INFO_SUCCESS';
export const GET_CXO_CONFIG_INFO_FAILURE = 'GET_CXO_CONFIG_INFO_FAILURE';

export const GET_CXO_SECTIONS_INFO = 'GET_CXO_SECTIONS_INFO';
export const GET_CXO_SECTIONS_INFO_SUCCESS = 'GET_CXO_SECTIONS_INFO_SUCCESS';
export const GET_CXO_SECTIONS_INFO_FAILURE = 'GET_CXO_SECTIONS_INFO_FAILURE';

export const GET_CXO_SECTIONS_TYPES_INFO = 'GET_CXO_SECTIONS_TYPES_INFO';
export const GET_CXO_SECTIONS_TYPES_INFO_SUCCESS = 'GET_CXO_SECTIONS_TYPES_INFO_SUCCESS';
export const GET_CXO_SECTIONS_TYPES_INFO_FAILURE = 'GET_CXO_SECTIONS_TYPES_INFO_FAILURE';

export const GET_CXO_OP_TYPES_INFO = 'GET_CXO_OP_TYPES_INFO';
export const GET_CXO_OP_TYPES_INFO_SUCCESS = 'GET_CXO_OP_TYPES_INFO_SUCCESS';
export const GET_CXO_OP_TYPES_INFO_FAILURE = 'GET_CXO_OP_TYPES_INFO_FAILURE';

export const UPDATE_MULTI_MODEL_INFO = 'UPDATE_MULTI_MODEL_INFO';
export const UPDATE_MULTI_MODEL_INFO_SUCCESS = 'UPDATE_MULTI_MODEL_INFO_SUCCESS';
export const UPDATE_MULTI_MODEL_INFO_FAILURE = 'UPDATE_MULTI_MODEL_INFO_FAILURE';

export const CREATE_MULTI_MODEL_INFO = 'CREATE_MULTI_MODEL_INFO';
export const CREATE_MULTI_MODEL_INFO_SUCCESS = 'CREATE_MULTI_MODEL_INFO_SUCCESS';
export const CREATE_MULTI_MODEL_INFO_FAILURE = 'CREATE_MULTI_MODEL_INFO_FAILURE';

export const GET_CXO_COMPANIES_INFO = 'GET_CXO_COMPANIES_INFO';
export const GET_CXO_COMPANIES_INFO_SUCCESS = 'GET_CXO_COMPANIES_INFO_SUCCESS';
export const GET_CXO_COMPANIES_INFO_FAILURE = 'GET_CXO_COMPANIES_INFO_FAILURE';

export const GET_OH_REQUEST_INFO = 'GET_OH_REQUEST_INFO';
export const GET_OH_REQUEST_INFO_SUCCESS = 'GET_OH_REQUEST_INFO_SUCCESS';
export const GET_OH_REQUEST_INFO_FAILURE = 'GET_OH_REQUEST_INFO_FAILURE';

export const GET_STATUS_LOGS_INFO = 'GET_STATUS_LOGS_INFO';
export const GET_STATUS_LOGS_INFO_SUCCESS = 'GET_STATUS_LOGS_INFO_SUCCESS';
export const GET_STATUS_LOGS_INFO_FAILURE = 'GET_STATUS_LOGS_INFO_FAILURE';

export const CREATE_BULK_INFO = 'CREATE_BULK_INFO';
export const CREATE_BULK_INFO_SUCCESS = 'CREATE_BULK_INFO_SUCCESS';
export const CREATE_BULK_INFO_FAILURE = 'CREATE_BULK_INFO_FAILURE';

export const UPDATE_BULK_INFO = 'UPDATE_BULK_INFO';
export const UPDATE_BULK_INFO_SUCCESS = 'UPDATE_BULK_INFO_SUCCESS';
export const UPDATE_BULK_INFO_FAILURE = 'UPDATE_BULK_INFO_FAILURE';

export const DELETE_BULK_INFO = 'DELETE_BULK_INFO';
export const DELETE_BULK_INFO_SUCCESS = 'DELETE_BULK_INFO_SUCCESS';
export const DELETE_BULK_INFO_FAILURE = 'DELETE_BULK_INFO_FAILURE';

export const GET_ENERGY_METERS_INFO = 'GET_ENERGY_METERS_INFO';
export const GET_ENERGY_METERS_INFO_SUCCESS = 'GET_ENERGY_METERS_INFO_SUCCESS';
export const GET_ENERGY_METERS_INFO_FAILURE = 'GET_ENERGY_METERS_INFO_FAILURE';

export const GET_TENANT_CONFIGUARATION_INFO = 'GET_TENANT_CONFIGUARATION_INFO';
export const GET_TENANT_CONFIGUARATION_INFO_SUCCESS = 'GET_TENANT_CONFIGUARATION_INFO_SUCCESS';
export const GET_TENANT_CONFIGUARATION_INFO_FAILURE = 'GET_TENANT_CONFIGUARATION_INFO_FAILURE';

export const getMaintenanceConfigList = (company, model) => {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=[]`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAINTENANCE_CONFIG_LIST, GET_MAINTENANCE_CONFIG_SUCCESS_LIST, GET_MAINTENANCE_CONFIG_FAILURE_LIST],
      method: 'GET',
    },
  };
};

export const getMaintenanceConfigurationInfo = (companyId, model) => {
  const payload = `domain=[["company_id","in",[${companyId}]]]&model=${model}&fields=["id","uuid","is_requester_name","is_requester_email","ticket_type_visible","channel_visible","maintenance_team_visible","tenant_visible","is_vendor_field","is_enable_it_ticket","requestor_mobile_visibility","is_constraints","is_cost", "vendor_access_type","is_age",("on_hold_approval_id",["id","name"])]&offset=0&limit=1&order=id ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_MAINTENANCE_CONFIGUARATION_INFO, GET_MAINTENANCE_CONFIGUARATION_INFO_SUCCESS, GET_MAINTENANCE_CONFIGUARATION_INFO_FAILURE],
      method: 'GET',
    },
  };
};

export const getTenantConfigurationInfo = () => ({
  [CALL_API]: {
    endpoint: 'tenant/space',
    types: [GET_TENANT_CONFIGUARATION_INFO, GET_TENANT_CONFIGUARATION_INFO_SUCCESS, GET_TENANT_CONFIGUARATION_INFO_FAILURE],
    method: 'GET',
  },
});

export function getDisplayNameInfo(company, model, ids) {
  let payload = `domain=[["id","in",[${ids}]]`;
  payload = `${payload}]&model=${model}&fields=["cat_display_name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_DISPLAY_NAME_INFO, GET_DISPLAY_NAME_INFO_SUCCESS, GET_DISPLAY_NAME_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTicketsInfo(company, model, limit, offset, fields, states, categories, priorities, customFilters, sortByValue, sortFieldValue, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subcategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
  if (states && states.length > 0) {
    payload = `${payload},["state_id","in",[${states}]]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (aiFilter) {
    payload = `${payload},${aiFilter}`;
  }
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
    if (incidentValues && incidentValues.length > 0) {
      payload = `${payload},["incident_state","in",[${incidentValues}]]`;
    }
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  if (companyFilters && companyFilters.length > 0) {
    payload = `${payload},["company_id","in",[${companyFilters}]]`;
  }
  if (categories && categories.length > 0) {
    payload = `${payload},["category_id","in",[${categories}]]`;
  }
  if (subcategory && subcategory.length > 0) {
    payload = `${payload},["sub_category_id","in",[${subcategory}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority_id","in",[${priorities}]]`;
  }
  if (maintenanceTeam && maintenanceTeam.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${maintenanceTeam}]]`;
  }
  if (region && region.length > 0) {
    payload = `${payload},["region_id","in",[${region}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (isTenantTickets && allowedTenants && allowedTenants.length > 0) {
    payload = `${payload},["tenant_id","in",${JSON.stringify(allowedTenants)}]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=${fields}`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TICKETS_INFO, GET_TICKETS_INFO_SUCCESS, GET_TICKETS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTicketsExportInfo(company, model, limit, offset, fields, states, categories, priorities, customFilters, rows, isIncident, sortBy, sortField, maintenanceTeam, region, companyFilters, subcategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
  if (states && states.length > 0) {
    payload = `${payload},["state_id","in",[${states}]]`;
  }

  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (aiFilter) {
    payload = `${payload},${aiFilter}`;
  }
  if (companyFilters && companyFilters.length > 0) {
    payload = `${payload},["company_id","in",[${companyFilters}]]`;
  }
  if (subcategory && subcategory.length > 0) {
    payload = `${payload},["sub_category_id","in",[${subcategory}]]`;
  }
  if (categories && categories.length > 0) {
    payload = `${payload},["category_id","in",[${categories}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority_id","in",[${priorities}]]`;
  }
  if (maintenanceTeam && maintenanceTeam.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${maintenanceTeam}]]`;
  }
  if (region && region.length > 0) {
    payload = `${payload},["region_id","in",[${region}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  if (isTenantTickets && allowedTenants && allowedTenants.length > 0) {
    payload = `${payload},["tenant_id","in",${JSON.stringify(allowedTenants)}]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=${fields}`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;
  if (sortBy && sortField) {
    payload = `${payload}&order=${sortField} ${sortBy}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TICKETS_EXPORT_INFO, GET_TICKETS_EXPORT_INFO_SUCCESS, GET_TICKETS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function addTicketInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'create/website.support.ticket',
      types: [CREATE_TICKET_INFO, CREATE_TICKET_INFO_SUCCESS, CREATE_TICKET_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getSpacesInfo(company, modelName, keyword, category) {
  let conditions = `[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    conditions = `${conditions},"|",["path_name","ilike","${keyword}"],["path_name","ilike","${keyword}"]`;
  }
  if (category) {
    conditions = `${conditions},["asset_category_id","=",${category}]`;
  }
  conditions = `${conditions}]`;
  const fields = ['space_name', 'path_name', 'asset_category_id'];
  const payload = {
    domain: conditions, model: modelName, fields: JSON.stringify(fields), limit: 10, offset: 0, order: 'sort_sequence ASC',
  };
  return {
    [CALL_API]: {
      endpoint: 'isearch_read',
      types: [GET_SPACES_INFO, GET_SPACES_INFO_SUCCESS, GET_SPACES_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getSpacesAllInfo(company, model) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  payload = `${payload}]&model=${model}&fields=["id","space_name","asset_category_id","parent_id"]&limit=500&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACESLIST_INFO, GET_SPACESLIST_INFO_SUCCESS, GET_SPACESLIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquipmentInfo(company, model, keyword, isITAsset, filterBy, filterValue, filterOperator, categoryKeyword, ids, parent) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  const operator = filterOperator || 'in';

  if (isITAsset) {
    payload = `${payload},["is_itasset","=",true]`;
  } else {
    payload = `${payload},["is_itasset","!=",true]`;
  }

  if (filterBy && filterValue && filterValue.length > 0) {
    payload = `${payload},["${filterBy}",${JSON.stringify(operator)},[${filterValue}]]`;
  }

  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["name","ilike","${keyword}"],["serial","ilike","${keyword}"]`;
  }
  if (categoryKeyword && categoryKeyword.length > 0) {
    payload = `${payload},["category_id","ilike","${categoryKeyword}"]`;
  }
  if (ids && ids.length > 0) {
    payload = `${payload},["id","not in",${JSON.stringify(ids)}]`;
  }
  if (parent) {
    payload = `${payload},["is_parent","=",true]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","state","make","model","equipment_seq","serial","brand","location_id","category_id","maintenance_team_id"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EQUIPMENT_INFO, GET_EQUIPMENT_INFO_SUCCESS, GET_EQUIPMENT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEquipmentInfoReport(company, model, keyword, spaceValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (spaceValue) {
    payload = `${payload},["location_id","in","${spaceValue}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","location_id","category_id","maintenance_team_id"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EQUIPMENT_INFO_REPORT, GET_EQUIPMENT_INFO_REPORT_SUCCESS, GET_EQUIPMENT_INFO_REPORT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSpaceAllSearchLists(company, model, keyword, filterBy, filterValue, filterOperator) {
  const operator = filterOperator || 'in';
  let payload = `domain=[["company_id","in",[${company}]],["path_name","!=",false],["name","!=",false]`;
  if (filterBy && filterValue && filterValue.length > 0) {
    payload = `${payload},["${filterBy}",${JSON.stringify(operator)},[${filterValue}]]`;
  }

  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["path_name","ilike","${keyword}"],["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","path_name","space_name","asset_category_id"]&limit=20&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_SEARCH_INFO, GET_SPACE_SEARCH_INFO_SUCCESS, GET_SPACE_SEARCH_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryInfo(company, model, keyword, isIncident) {
  let payload = 'domain=[["name", "!=", false]';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  if (isIncident) {
    payload = `${payload},["is_incident","=",true]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CATEGORY_INFO, GET_CATEGORY_INFO_SUCCESS, GET_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSubCategoryInfo(company, model, category, keyword) {
  let payload = `domain=[["parent_category_id", "=", ${category}]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name","priority","default_assignee","l1_team_category_id","l2_team_category_id","l3_team_category_id"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SUBCATEGORY_INFO, GET_SUBCATEGORY_INFO_SUCCESS, GET_SUBCATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTicketsCount(company, model, states, categories, priorities, customFilters, isIncident, maintenanceTeam, incidentValues, region, companyFilters, subcategory, globalFilter, aiFilter, isTenantTickets, allowedTenants) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
  if (states && states.length > 0) {
    payload = `${payload},["state_id","in",[${states}]]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (aiFilter) {
    payload = `${payload},${aiFilter}`;
  }
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
    if (incidentValues && incidentValues.length > 0) {
      payload = `${payload},["incident_state","in",[${incidentValues}]]`;
    }
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  if (companyFilters && companyFilters.length > 0) {
    payload = `${payload},["company_id","in",[${companyFilters}]]`;
  }
  if (categories && categories.length > 0) {
    payload = `${payload},["category_id","in",[${categories}]]`;
  }
  if (subcategory && subcategory.length > 0) {
    payload = `${payload},["sub_category_id","in",[${subcategory}]]`;
  }
  if (priorities && priorities.length > 0) {
    payload = `${payload},["priority_id","in",[${priorities}]]`;
  }
  if (maintenanceTeam && maintenanceTeam.length > 0) {
    payload = `${payload},["maintenance_team_id","in",[${maintenanceTeam}]]`;
  }
  if (region && region.length > 0) {
    payload = `${payload},["region_id","in",[${region}]]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (isTenantTickets && allowedTenants && allowedTenants.length > 0) {
    payload = `${payload},["tenant_id","in",${JSON.stringify(allowedTenants)}]`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TICKETS_COUNT, GET_TICKETS_COUNT_SUCCESS, GET_TICKETS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["category_id","!=",false]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["category_id"]&groupby=["category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORIES_GROUP_INFO, GET_CATEGORIES_GROUP_INFO_SUCCESS, GET_CATEGORIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSubCategoryGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["sub_category_id","!=",false]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["sub_category_id"]&groupby=["sub_category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SUB_CATEGORIES_GROUP_INFO, GET_SUB_CATEGORIES_GROUP_INFO_SUCCESS, GET_SUB_CATEGORIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getStateGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["state_id","!=",false]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["state_id"]&groupby=["state_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_STATES_GROUP_INFO, GET_STATES_GROUP_INFO_SUCCESS, GET_STATES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentStateGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["incident_state","!=",false]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["incident_state"]&groupby=["incident_state"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_INCIDENT_STATES_GROUP_INFO, GET_INCIDENT_STATES_GROUP_INFO_SUCCESS, GET_INCIDENT_STATES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"], ["maintenance_team_id","!=","false"],["state_id","!=","bm"]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["maintenance_team_id"]&groupby=["maintenance_team_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_MAINTENANCE_GROUP_INFO, GET_MAINTENANCE_GROUP_INFO_SUCCESS, GET_MAINTENANCE_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRegionGroupsInfo(company, model) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["region_id","!=",false]`;
  payload = `${payload}]&model=${model}&fields=["region_id"]&groupby=["region_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_REGION_GROUP_INFO, GET_REGION_GROUP_INFO_SUCCESS, GET_REGION_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPriorityGroupsInfo(company, model, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["priority_id","!=",false]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  payload = `${payload}]&model=${model}&fields=["priority_id"]&groupby=["priority_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_PRIORITIES_GROUP_INFO, GET_PRIORITIES_GROUP_INFO_SUCCESS, GET_PRIORITIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTicketData(id, modelName) {
  const fields = ticketColumns && ticketColumns.viewFields ? ticketColumns.viewFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_TICKET_DETAILS_INFO, GET_TICKET_DETAILS_INFO_SUCCESS, GET_TICKET_DETAILS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTicketSlaDetails(values, modelName) {
  // const fields = ticketColumns && ticketColumns.view ? ticketColumns.view : [];
  const fields = '["id", ("l1_id", ["id", "name"]), "l1_datetime", ("website_support_id", ["id", "display_name"]), "unattended_ppm", ("state_id", ["id", "name"]), "state_category_id", "sla_status", "sla_end_date", "sla_active", "laste_scalation_level", "last_reminder_level", "l3_reminder", ("l3_id", ["id", "name"]), "l3_datetime", "l2_reminder", ("l2_id", ["id", "name"]), "l2_datetime", "l1_reminder", ("company_id", ["id", "name"]), "laste_scalation_level", ("l4_id", ["id", "name"]), "l4_datetime","l4_reminder",("l5_id", ["id", "name"]), "l5_datetime","l5_reminder"]';
  let payload = `domain=[["website_support_id", "=", ${values}]]`;
  // payload = `${payload}&model=${modelName}&fields=${JSON.stringify(fields)}`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA_DETAILS_INFO, GET_SLA_DETAILS_INFO_SUCCESS, GET_SLA_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getSlaLevel1Details(values, modelName) {
  const fields = '["id", ["recipients_ids", ["id", "name"]], ["alarm_recipients_ids", ["id", "name"]]]';
  let payload = `domain=[["id", "=", ${values}]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA1_DETAILS_INFO, GET_SLA1_DETAILS_INFO_SUCCESS, GET_SLA1_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaLevel2Details(values, modelName) {
  const fields = '["id", ["recipients_ids", ["id",  "name"]], ["alarm_recipients_ids", ["id", "name"]]]';
  let payload = `domain=[["id", "=", ${values}]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA2_DETAILS_INFO, GET_SLA2_DETAILS_INFO_SUCCESS, GET_SLA2_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaLevel3Details(values, modelName) {
  const fields = '["id", ["recipients_ids", ["id", "name"]], ["alarm_recipients_ids", ["id", "name"]]]';
  let payload = `domain=[["id", "=", ${values}]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA3_DETAILS_INFO, GET_SLA3_DETAILS_INFO_SUCCESS, GET_SLA3_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaLevel4Details(values, modelName) {
  const fields = '["id", ["recipients_ids", ["id", "name"]], ["alarm_recipients_ids", ["id", "name"]]]';
  let payload = `domain=[["id", "=", ${values}]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA4_DETAILS_INFO, GET_SLA4_DETAILS_INFO_SUCCESS, GET_SLA4_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSlaLevel5Details(values, modelName) {
  const fields = '["id", ["recipients_ids", ["id", "name"]], ["alarm_recipients_ids", ["id", "name"]]]';
  let payload = `domain=[["id", "=", ${values}]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_SLA5_DETAILS_INFO, GET_SLA5_DETAILS_INFO_SUCCESS, GET_SLA5_DETAILS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

/* export function getEquipmentDocuments(id, resModel, model, ticketId) {
  let payload = `domain=[["res_id","in",[${id}]],["res_model", "=", "${resModel}"]`;
  if (ticketId) {
    payload = `${payload},"|",["res_id","in",[${ticketId}]],["res_model", "=", "website.support.ticket"]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=["ir_attachment_categ","name","mimetype","datas_fname","datas"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_DOCUMENT_INFO, GET_DOCUMENT_INFO_SUCCESS, GET_DOCUMENT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
} */

export function getEquipmentDocuments(id, resModel, modelName, ticketId) {
  let conditions = `[["res_id","in",[${id}]],["res_model", "=", "${resModel}"],["name","!=","image0"]`;
  if (ticketId) {
    conditions = `["|","&",["res_id","in",[${id}]],["res_model", "=", "${resModel}"],"&",["res_id","in",[${ticketId}]],["res_model", "=", "website.support.ticket"]`;
  }
  conditions = `${conditions}]`;
  const fields = ['ir_attachment_categ', 'type', 'url', 'name', 'mimetype', 'datas_fname', 'description', 'res_model', 'create_uid', 'create_date'];
  const payload = { domain: conditions, model: modelName, fields: JSON.stringify(fields) };

  return {
    [CALL_API]: {
      endpoint: 'isearch_read',
      types: [GET_DOCUMENT_INFO, GET_DOCUMENT_INFO_SUCCESS, GET_DOCUMENT_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function onDocumentCreate(result) {
  const formValues = { model: 'ir.attachment', values: result };
  return {
    [CALL_API]: {
      endpoint: 'create/ir.attachment',
      types: [CREATE_DOCUMENT_INFO, CREATE_DOCUMENT_INFO_SUCCESS, CREATE_DOCUMENT_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function onDocumentCreatesAttachment(result) {
  const formValues = { model: 'ir.attachment', values: result };
  return {
    [CALL_API]: {
      endpoint: 'create/ir.attachment',
      types: [CREATE_DOCUMENTATT_INFO, CREATE_DOCUMENTATT_INFO_SUCCESS, CREATE_DOCUMENTATT_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function updateDocumentsAttachInfo(ids, result) {
  const payload = {
    ids: JSON.stringify(ids), values: result,
  };
  const mName = 'PUT';
  const endpoint = 'write/ir.attachment';

  return {
    [CALL_API]: {
      endpoint,
      types: [UPDATE_DOCUMENTATT_INFO, UPDATE_DOCUMENTATT_INFO_SUCCESS, UPDATE_DOCUMENTATT_INFO_FAILURE],
      method: mName,
      payload,
    },
  };
}

export function fileDownload(tid, id, resModel, model) {
  let payload = `domain=[["id","in",[${id}]]`;
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=["datas","datas_fname","mimetype"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_DOWNLOAD_INFO, GET_DOWNLOAD_INFO_SUCCESS, GET_DOWNLOAD_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHelpdeskDashboardInfo(start, end, dashboardName) {
  let payload = '';
  if (start === '' && end === '') {
    payload = `filter=l_none&name=${dashboardName}`;
  } else {
    payload = `filter=l_custom&start_time=${start}&end_time=${end}&name=${dashboardName}`;
  }

  return {
    [CALL_API]: {
      endpoint: `dashboard_data?${payload}`,
      types: [GET_TICKETS_DASHBOARD_INFO, GET_TICKETS_DASHBOARD_INFO_SUCCESS, GET_TICKETS_DASHBOARD_INFO_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getHelpdeskFilters(payload) {
  return {
    type: GET_FILTER_HELPDESK,
    payload,
  };
}

export function getCheckedRowsInfo(payload) {
  return {
    type: GET_ROWS_HELPDESK,
    payload,
  };
}

export function getUploadImageInfo(payload) {
  return {
    type: GET_UPLOAD_IMAGE,
    payload,
  };
}

export function getUploadImageFormInfo(payload) {
  return {
    type: GET_UPLOAD_IMAGE_FORM,
    payload,
  };
}

export function getCascaderInfo(payload) {
  return {
    type: GET_CASCADER_INFO,
    payload,
  };
}

export function ticketStateChangeInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_HD_STATE_CHANGE_INFO, GET_HD_STATE_CHANGE_INFO_SUCCESS, GET_HD_STATE_CHANGE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSpaceChildsInfo(company, model, parentId) {
  const payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}]]&model=${model}&fields=["id","space_name","asset_category_id","parent_id"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SPACE_CHILDS, GET_SPACE_CHILDS_SUCCESS, GET_SPACE_CHILDS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createCloseTicketInfo(result) {
  return {
    [CALL_API]: {
      endpoint: 'create/website.support.ticket.close',
      types: [CREATE_CLOSE_TICKET_INFO, CREATE_CLOSE_TICKET_INFO_SUCCESS, CREATE_CLOSE_TICKET_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function createMessageInfo(result, modelName) {
  const formValues = { model: modelName, values: result };
  return {
    [CALL_API]: {
      endpoint: `create/${modelName}`,
      types: [CREATE_MESSAGE_INFO, CREATE_MESSAGE_INFO_SUCCESS, CREATE_MESSAGE_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function getReceipentsInfo(id, modelName) {
  const payload = { ids: `[${id}]`, model: modelName, method: 'message_get_suggested_recipients' };
  return {
    [CALL_API]: {
      endpoint: `call/${modelName}`,
      types: [GET_RECEIPENT_INFO, GET_RECEIPENT_INFO_SUCCESS, GET_RECEIPENT_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getPriorityInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=1&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_PRIORITY_INFO, GET_PRIORITY_INFO_SUCCESS, GET_PRIORITY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTicketNamesInfo(company, model, keyword, isIncident) {
  let payload = `domain=[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
  if (isIncident) {
    payload = `${payload},["issue_type","=","incident"]`;
  } else {
    payload = `${payload},["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},"|",["ticket_number","ilike","${keyword}"],["subject","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["subject", "ticket_number"]&limit=10&offset=0&order=ticket_number ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TICKET_NAMES_INFO, GET_TICKET_NAMES_INFO_SUCCESS, GET_TICKET_NAMES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExtraSelectionInfo(company, model, limit, offset, fields, name, otherFieldName, otherFieldValue, sortField, domain) {
  let payload = 'domain=[["id","!=",false]';
  const sortFieldName = sortField || 'name';
  if (model === 'res.partner' && otherFieldName != 'is_compliance' && otherFieldName != 'is_visitor') {
    payload = 'domain=[["name", "!=", false],["supplier","=",true]';
  }
  if (company && !domain) {
    payload = `${payload},["company_id","in",[${company}]]`;
  }
  if (domain) {
    payload = `${payload},${domain}`;
  }
  if (name && name.length > 0) {
    if (model === 'website.support.ticket') {
      payload = `${payload},["subject","ilike","${name}"]`;
    } else if (model === 'mro.equipment.location') {
      payload = `${payload},["path_name","ilike","${name}"]`;
    } else if (model === 'survey.question') {
      payload = `${payload},["question","ilike","${name}"]`;
    } else if (model === 'mro.visit.request') {
      payload = `${payload},["visitor_name","ilike","${name}"]`;
    } else if (model === 'res.partner') {
      payload = `${payload},["name","ilike","${name}"]`;
    } else if (model === 'mro.equipment') {
      payload = `${payload},"|","|","|",["name","ilike","${name}"],["category_id","ilike","${name}"],["equipment_seq","ilike","${name}"], ["location_id","ilike","${name}"]`;
    } else {
      payload = `${payload},["name","ilike","${name}"]`;
    }
  }
  if (model === 'survey.question') {
    payload = `${payload},["type","=","simple_choice"]`;
  }
  if (otherFieldName && otherFieldName.length > 0) {
    if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
      payload = `${payload},["${otherFieldName}","ilike","${otherFieldValue}"]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName !== 'not_in') {
      payload = `${payload},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
      payload = `${payload},["id","not in",${JSON.stringify(otherFieldValue)}]`;
    } else {
      payload = `${payload},["${otherFieldName}","=",${otherFieldValue}]`;
    }
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=${JSON.stringify(fields)}`;
  if (model === 'website.support.ticket') {
    payload = `${payload}&limit=${limit}&offset=${offset}&order=subject ASC`;
  } else if (model === 'survey.question' || model === 'survey.label') {
    payload = `${payload}&limit=${limit}&offset=${offset}`;
  } else {
    payload = `${payload}&limit=${limit}&offset=${offset}&order=${sortFieldName} ASC`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EXTRA_LIST_INFO, GET_EXTRA_LIST_INFO_SUCCESS, GET_EXTRA_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExtraSelectionCountInfo(company, model, name, otherFieldName, otherFieldValue, domain) {
  let payload = 'domain=[["id","!=",false]';
  if (model === 'res.partner' && otherFieldName != 'is_compliance' && otherFieldName != 'is_visitor') {
    payload = 'domain=[["name", "!=", false],["supplier","=",true]';
  }
  if (company && !domain) {
    payload = `${payload},["company_id","in",[${company}]]`;
  }
  if (domain) {
    payload = `${payload},${domain}`;
  }
  if (name && name.length > 0) {
    if (model === 'website.support.ticket') {
      payload = `${payload},["subject","ilike","${name}"]`;
    } else if (model === 'mro.equipment.location') {
      payload = `${payload},["path_name","ilike","${name}"]`;
    } else if (model === 'survey.question') {
      payload = `${payload},["question","ilike","${name}"]`;
    } else if (model === 'mro.visit.request') {
      payload = `${payload},["visitor_name","ilike","${name}"]`;
    } else if (model === 'res.partner') {
      payload = `${payload},["name","ilike","${name}"]`;
    } else if (model === 'mro.equipment') {
      payload = `${payload},"|","|","|",["name","ilike","${name}"],["category_id","ilike","${name}"],["equipment_seq","ilike","${name}"],["location_id","ilike","${name}"]`;
    } else {
      payload = `${payload},["name","ilike","${name}"]`;
    }
  }
  if (model === 'survey.question') {
    payload = `${payload},["type","=","simple_choice"]`;
  }
  if (otherFieldName && otherFieldName.length > 0) {
    if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
      payload = `${payload},["${otherFieldName}","ilike","${otherFieldValue}"]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName !== 'not_in') {
      payload = `${payload},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
      payload = `${payload},["id","not in",${JSON.stringify(otherFieldValue)}]`;
    } else {
      payload = `${payload},["${otherFieldName}","=",${otherFieldValue}]`;
    }
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_EXTRA_COUNT_INFO, GET_EXTRA_COUNT_INFO_SUCCESS, GET_EXTRA_COUNT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getExtraSelectionMultiples(company, model, limit, offset, fields, searchValueMultiple, noOrder, endpoint, isIot, uuid, sortedValueDashboard) {
  const conditions = `${searchValueMultiple}`;
  let payload = {
    domain: conditions, model, fields: JSON.stringify(fields), limit, offset,
  };

  if (!noOrder) {
    payload.order = '';
  } else if (noOrder === 'create_date DESC') {
    payload.order = noOrder;
  }

  if (sortedValueDashboard && sortedValueDashboard.sortBy && sortedValueDashboard.sortField) {
    payload.order = `${sortedValueDashboard.sortField} ${sortedValueDashboard.sortBy}`;
  }
  let endPointName = 'isearch_read';
  let requestMethod = 'POST';

  if (endpoint) {
    requestMethod = 'GET';
    payload = `domain=${encodeURIComponent(conditions)}&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}&order=create_date DESC`;
    if (sortedValueDashboard && sortedValueDashboard.sortBy && sortedValueDashboard.sortField) {
      payload = `domain=${encodeURIComponent(conditions)}&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}&order=${sortedValueDashboard.sortField} ${sortedValueDashboard.sortBy}`;
    }
    endPointName = `${endpoint}?${payload}`;
  }

  if (isIot) {
    const authService = AuthService();
    requestMethod = 'GET';
    if (typeof fields === 'string') {
      payload = `domain=${conditions}&model=${model}&fields=${fields}`;
    } else {
      const newFields = fields.concat(['id']);
      payload = `domain=${conditions}&model=${model}&fields=${JSON.stringify(newFields)}`;
    }
    endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}&limit=${limit}&offset=${offset}`;
    if (sortedValueDashboard && sortedValueDashboard.sortBy && sortedValueDashboard.sortField) {
      endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}&limit=${limit}&offset=${offset}&order=${sortedValueDashboard.sortField} ${sortedValueDashboard.sortBy}`;
    }
  }

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_EXTRA_LIST_MULTIPLE, GET_EXTRA_LIST_MULTIPLE_SUCCESS, GET_EXTRA_LIST_MULTIPLE_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getExtraSelectionMultipleCounts(company, model, fields, searchValueMultiple, endpoint, isIot, uuid) {
  const conditions = `${searchValueMultiple}`;
  let payload = {
    domain: conditions, model, fields: JSON.stringify(fields), count: 1,
  };

  let endPointName = 'isearch_read';
  let requestMethod = 'POST';

  if (endpoint) {
    requestMethod = 'GET';
    payload = `domain=${conditions}&model=${model}&count=1`;
    endPointName = `${endpoint}?${payload}`;
  }

  if (isIot) {
    const authService = AuthService();
    requestMethod = 'GET';
    payload = `domain=${conditions}&model=${model}&count=1`;
    endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;
  }

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_EXTRA_COUNT_MULTIPLE, GET_EXTRA_COUNT_MULTIPLE_SUCCESS, GET_EXTRA_COUNT_MULTIPLE_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getTicketStateClosed(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name"]&limit=1&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TICKET_STATE_INFO, GET_TICKET_STATE_INFO_SUCCESS, GET_TICKET_STATE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateTicketInfo(id, model, result, isApproval, method, args, onHoldRejectRemarks, isPPM, ppmData, tMail) {
  let payload = {
    ids: `[${id}]`, values: result,
  };
  let mName = 'PUT';
  let endpoint = `write/${model}`;
  if (isApproval && !isPPM) {
    if (!onHoldRejectRemarks) {
      payload = {
        ids: `[${id}]`, model, args_new: `['${args}']`, method,
      };
    } else {
      payload = {
        ids: `[${id}]`, model, args_new: `['${args}','${onHoldRejectRemarks}']`, method,
      };
    }
    mName = 'POST';
    endpoint = 'call';
  } else if (isApproval && isPPM) {
    if (!tMail) {
      payload = {
        ids: `[${ppmData.id}]`, model, args_new: `['${args}','${onHoldRejectRemarks}']`, method,
      };
    } else {
      payload = {
        ids: `[${ppmData.id}]`, model, args_new: `['${args}','${onHoldRejectRemarks}','${tMail}']`, method,
      };
    }
    mName = 'POST';
    endpoint = 'call';
  }

  return {
    [CALL_API]: {
      endpoint,
      types: [UPDATE_TICKET_INFO, isApproval ? UPDATE_TICKET_INFO_SUCCESS_NEW : UPDATE_TICKET_INFO_SUCCESS, UPDATE_TICKET_INFO_FAILURE],
      method: mName,
      payload,
    },
  };
}

export function getTicketOrdersInfo(values, modelName) {
  const fields = '["id", "name", "review_status", "date_start_execution", "date_execution", "reviewed_remark", "reviewed_on", "state", "reason", "checklist_json_data", ("employee_id", ["id", "name"]), ("reviewed_by", ["id", "name"]),["check_list_ids", ["id", "answer_common", "answer_type", "write_date", "is_abnormal", ("mro_activity_id", ["id", "name"]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]';
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=${fields}`;
  payload = `${payload}&limit=${values.length}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_TICKET_ORDERS_INFO, GET_TICKET_ORDERS_INFO_SUCCESS, GET_TICKET_ORDERS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function escalateTicketInfo(id, model, method) {
  const payload = {
    ids: `[${id}]`, model, method,
  };
  return {
    [CALL_API]: {
      endpoint: `call/${model}`,
      types: [ESCALATE_TICKET_INFO, ESCALATE_TICKET_INFO_SUCCESS, ESCALATE_TICKET_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getIncidentTypesInfo(company, model, keyword, limit) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=${limit}&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENT_TYPES_INFO, GET_INCIDENT_TYPES_INFO_SUCCESS, GET_INCIDENT_TYPES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentSevertiesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENT_SEVERITY_INFO, GET_INCIDENT_SEVERITY_INFO_SUCCESS, GET_INCIDENT_SEVERITY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentInjuriesInfo(company, ids, model) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${ids}]]`;
  payload = `${payload}]&model=${model}&fields=["name","organization","nature_of_injury","organ_injured","status","remarks"]&limit=100&offset=0&order=create_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENT_INJURIES_INFO, GET_INCIDENT_INJURIES_INFO_SUCCESS, GET_INCIDENT_INJURIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentDamagesInfo(company, ids, model) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${ids}]]`;
  payload = `${payload}]&model=${model}&fields=["name","owned_by","nature_extent_damage","estimated_cost","estimated_recovery_time","recovery_status","present_status"]`;
  payload = `${payload}&limit=100&offset=0&order=create_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCIDENT_DAMAGES_INFO, GET_INCIDENT_DAMAGES_INFO_SUCCESS, GET_INCIDENT_DAMAGES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncidentTypeGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["incident_type_id"]&groupby=["incident_type_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_INCIDENT_TYPES_GROUP_INFO, GET_INCIDENT_TYPES_GROUP_INFO_SUCCESS, GET_INCIDENT_TYPES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getDeleteAttatchmentInfo(id) {
  const payload = {
    ids: `[${id}]`, model: 'ir.attachment',
  };
  return {
    [CALL_API]: {
      endpoint: 'unlink',
      types: [DELETE_ATTATCHMENT_INFO, DELETE_ATTATCHMENT_INFO_SUCCESS, DELETE_ATTATCHMENT_INFO_FAILURE],
      method: 'DELETE',
      payload,
    },
  };
}

export function getSiteBasedCategoryInfo(type, categoryId, isIncident, company) {
  const model = 'website.support.ticket.category';
  // eslint-disable-next-line max-len
  const fields = '["id","name","cat_display_name",["subcategory_ids", ["id", "name","sub_cat_display_name", "default_assignee", "priority", ("incident_severity_id", ["id", "name"]),("l1_team_category_id", ["id", "name"]), ("l2_team_category_id", ["id", "name"]), ("l3_team_category_id", ["id", "name"])]]]';
  const payload = `domain=[["is_incident","=",true]]&model=${model}&fields=${fields}&offset=0&limit=500`;
  const payloadType = `domain=[["team_category_id","=","IT"]]&model=${model}&fields=${fields}&offset=0&limit=500`;
  const payloadTypeIncident = `domain=[["is_incident","=",true],["team_category_id","=","IT"]]&model=${model}&fields=${fields}&offset=0&limit=500`;
  let endpath = '';
  if (isIncident && type !== 'IT') {
    endpath = `search?${payload}`;
  } else if (isIncident && type === 'IT') {
    endpath = `search?${payloadTypeIncident}`;
  } else if (type === 'IT') {
    endpath = `search?${payloadType}`;
  } else {
    endpath = `tickets/problemcategory?company_id=${company}`;
  }

  return {
    [CALL_API]: {
      endpoint: endpath,
      types: [GET_SITE_CATEGORY_INFO, GET_SITE_CATEGORY_INFO_SUCCESS, GET_SITE_CATEGORY_INFO_FAILURE],
      method: 'GET',
      type,
    },
  };
}

export function getOrdersFullDetailsInfo(company, model, id) {
  // eslint-disable-next-line max-len
  const fields = '["id","name","state","review_status", "sequence", "date_start_execution", "date_execution", "priority", "reviewed_remark", "reviewed_on",("maintenance_team_id", ["id", "name"]),("task_id", ["id", "name"]),("employee_id", ["id", "name"]), ("reviewed_by", ["id", "name"]), ["mro_timesheet_ids", ["id"]],"checklist_json_data",["check_list_ids", ["id", "answer_common", "answer_type", "write_date", "is_abnormal", ("mro_activity_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]';
  const payload = `domain=[["company_id","in",[${company}]],["id","in",[${id}]]]&model=${model}&fields=${fields}&offset=0&limit=2&order=id ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ORDER_FULL_INFO, GET_ORDER_FULL_INFO_SUCCESS, GET_ORDER_FULL_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getHelpdeskDashboardData(dashboardName) {
  return {
    [CALL_API]: {
      endpoint: `dashboard_data?name=${dashboardName}`,
      types: [GET_HELPDESK_DASHBOARD_INFO, GET_HELPDESK_DASHBOARD_INFO_SUCCESS, GET_HELPDESK_DASHBOARD_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getHelpdeskTeamsInfo(type, equipmentId, spaceId, categoryId, company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id", "name"]&limit=20&offset=0&order=name ASC`;
  let endPoint = '';
  if (categoryId && categoryId !== 'None') {
    endPoint = `tickets/team?type=${type}&equipment_id=${equipmentId}&space_id=${spaceId}&category_id=${categoryId}&company_id=${company}`;
  } else {
    endPoint = `search?${payload}`;
  }

  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [GET_HELPDESK_TEAMS_INFO, GET_HELPDESK_TEAMS_INFO_SUCCESS, GET_HELPDESK_TEAMS_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getMessageTemplateInfo(id, company) {
  return {
    [CALL_API]: {
      endpoint: `sharetemplate/info?id=${id}&company_id=${company}`,
      types: [GET_MESSAGE_TEMPLATE_INFO, GET_MESSAGE_TEMPLATE_INFO_SUCCESS, GET_MESSAGE_TEMPLATE_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function shareTicketInfo(result) {
  const payload = result;
  return {
    [CALL_API]: {
      endpoint: 'sharetemplate/send',
      types: [SHARE_TICKET_INFO, SHARE_TICKET_INFO_SUCCESS, SHARE_TICKET_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}
export function getHelpdeskVendorsInfo(id) {
  return {
    [CALL_API]: {
      endpoint: `tickets/vendor?company_id=${id}`,
      types: [GET_HELPDESK_VENDORS_INFO, GET_HELPDESK_VENDORS_INFO_SUCCESS, GET_HELPDESK_VENDORS_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getHelpdeskReportsInfo(company, model, fields, customFilters, sortByValue, sortFieldValue, selectedFilter, selectedDomain, isTenantTickets, allowedTenants) {
  let conditions = `[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["state_id","!=",false],["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  if (customFilters && customFilters.length > 0 && !selectedFilter) {
    conditions = `${conditions},${customFilters}`;
  }
  if (selectedFilter) {
    const reString = selectedFilter.toString().substring(1, selectedFilter.toString().length - 1);
    conditions = `${conditions},${reString}`;
  }
  if (selectedDomain) {
    conditions = `${conditions},${selectedDomain}`;
  }
  if (isTenantTickets && allowedTenants && allowedTenants.length > 0) {
    conditions = `${conditions},["tenant_id","in",${JSON.stringify(allowedTenants)}]`;
  }
  fields.push('equipment_location_id', 'type_category');
  const payload = {
    domain: `${conditions}]`, model, fields: JSON.stringify(fields), offset: 0,
  };

  if (sortByValue && sortFieldValue) {
    payload.order = `${sortFieldValue} ${sortByValue}`;
  }

  const endPointName = 'isearch_read';
  const requestMethod = 'POST';

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_HELPDESK_REPORTS_INFO, GET_HELPDESK_REPORTS_INFO_SUCCESS, GET_HELPDESK_REPORTS_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getHelpdeskReportsNoLoadInfo(company, model, fields, customFilters, sortByValue, sortFieldValue) {
  let conditions = `[["company_id","in",[${company}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["state_id","!=",false],["issue_type","!=","incident"],["help_problem_id","!=","incident"]`;
  if (customFilters && customFilters.length > 0) {
    conditions = `${conditions},${customFilters}`;
  }
  const payload = {
    domain: `${conditions}]`, model, fields: JSON.stringify(fields), offset: 0,
  };

  const endPointName = 'isearch_read';
  const requestMethod = 'POST';

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_HELPDESK_REPORTS_LOAD_INFO, GET_HELPDESK_REPORTS_INFO_SUCCESS, GET_HELPDESK_REPORTS_LOAD_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getMultiModelDocuments(ids, resModel1, resModel2, modelName, extraModel, extraIds) {
  let conditions = `[["name","!=","image0"],["res_id","in",[${ids}]],["res_model","in",["${resModel1}","${resModel2}"]]]`;
  if (extraModel && extraIds) {
    conditions = `[["name","!=","image0"],["res_id","in",[${extraIds}]],["res_model","=","${extraModel}"]]`;
  }
  const fields = ['ir_attachment_categ', 'type', 'url', 'res_id', 'create_date', 'name', 'mimetype', 'datas_fname', 'datas', 'description', 'res_model'];
  const payload = { domain: conditions, model: modelName, fields: JSON.stringify(fields) };

  return {
    [CALL_API]: {
      endpoint: 'isearch_read',
      types: [GET_MULT_DOCUMENT_INFO, GET_MULT_DOCUMENT_INFO_SUCCESS, GET_MULT_DOCUMENT_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getModelFiltersInfo(companyId, moduleName, model) {
  const payload = `domain=[["model_id","=","${moduleName}"]]&model=${model}&fields=["id","name","domain","context","custom_fields"]&offset=0&limit=50&order=id ASC`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_MODEL_FILTERS_INFO, GET_MODEL_FILTERS_INFO_SUCCESS, GET_MODEL_FILTERS_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getCxoConfigInfo(companies, uuid) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const payload = `domain=[["company_id.parent_id","=",${companies}]]&model=hx.configuration&fields=["id","options"]`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_CXO_CONFIG_INFO, GET_CXO_CONFIG_INFO_SUCCESS, GET_CXO_CONFIG_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getCxoSectionsInfo(domain, uuid) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const payload = `domain=[${domain}]&model=hx.section&fields=["id","name","code","dashboard_code","fav_icon","sequence","options",("operation_type_group_id",["id","name",["operation_type_ids", ["id"]]])]&order=sequence ASC`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_CXO_SECTIONS_INFO, GET_CXO_SECTIONS_INFO_SUCCESS, GET_CXO_SECTIONS_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getCxoSectionsOperationTypesInfo(sectionId, uuid) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const payload = `domain=[["id","in",${JSON.stringify(sectionId)}]]&model=hx.operations.type&fields=["id","name","code","sequence","options"]&order=sequence ASC`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_CXO_SECTIONS_TYPES_INFO, GET_CXO_SECTIONS_TYPES_INFO_SUCCESS, GET_CXO_SECTIONS_TYPES_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getCxoOperationTypesInfo(uuid, fields, model, start, end, company) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const payload = `domain=[["date",">=","${start}"],["date","<=","${end}"],["site_id","=",${company}]]&model=${model}&fields=${JSON.stringify(fields)}&order=date DESC`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_CXO_OP_TYPES_INFO, GET_CXO_OP_TYPES_INFO_SUCCESS, GET_CXO_OP_TYPES_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function updateMultiModelDataInfo(model, result, uuid) {
  const authService = AuthService();
  const endPoint = 'write_multi';
  const method = 'PUT';
  const payload = {
    uuid, token: authService.getAccessToken(), model, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_MULTI_MODEL_INFO, UPDATE_MULTI_MODEL_INFO_SUCCESS, UPDATE_MULTI_MODEL_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function updateBulkDataInfo(model, result) {
  const endPoint = 'multi_write';
  const method = 'PUT';
  const payload = {
    model, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [UPDATE_BULK_INFO, UPDATE_BULK_INFO_SUCCESS, UPDATE_BULK_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function deleteBulkDataInfo(model, result, uuid) {
  const authService = AuthService();
  const endPoint = 'unlink_multi';
  const method = 'PUT';
  const payload = {
    uuid, token: authService.getAccessToken(), model, ids: JSON.stringify(result),
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [DELETE_BULK_INFO, DELETE_BULK_INFO_SUCCESS, DELETE_BULK_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function resetBulkUpdate(payload) {
  return {
    type: 'RESET_BULK_INFO',
    payload,
  };
}

export function resetBulkAdd(payload) {
  return {
    type: 'RESET_BULK_ADD_INFO',
    payload,
  };
}

export function resetBulkDelete(payload) {
  return {
    type: 'RESET_BULK_DELETE_INFO',
    payload,
  };
}

export function updateDashboardData(payload) {
  return {
    type: 'UPDATE_CXO_DASHBOARD_LEVELS',
    payload,
  };
}

export function resetMultiUpdate(payload) {
  return {
    type: 'RESET_MULTI_MODEL_INFO',
    payload,
  };
}

export function createMultiModelDataInfo(model, result, uuid) {
  const authService = AuthService();
  const endPoint = 'create_multi';
  const method = 'POST';
  const payload = {
    uuid, token: authService.getAccessToken(), model, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [CREATE_MULTI_MODEL_INFO, CREATE_MULTI_MODEL_INFO_SUCCESS, CREATE_MULTI_MODEL_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function createBulkDataInfo(model, result) {
  const endPoint = 'multi_create';
  const method = 'POST';
  const payload = {
    model, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: endPoint,
      types: [CREATE_BULK_INFO, CREATE_BULK_INFO_SUCCESS, CREATE_BULK_INFO_FAILURE],
      method,
      payload,
    },
  };
}

export function getAllowedCompaniesCxoInfo(company, uuid, companyCodes) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const payload = `domain=[["parent_id","in",${company}],["company_code","in",${companyCodes}]]&model=dw.company&fields=["id","name"]&order=name ASC`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_CXO_COMPANIES_INFO, GET_CXO_COMPANIES_INFO_SUCCESS, GET_CXO_COMPANIES_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}

export function getOnHoldRequestInfo(id, result) {
  const formValues = { id, values: result };
  return {
    [CALL_API]: {
      endpoint: 'helpdesk/onhold',
      types: [GET_OH_REQUEST_INFO, GET_OH_REQUEST_INFO_SUCCESS, GET_OH_REQUEST_INFO_FAILURE],
      method: 'POST',
      payload: formValues,
    },
  };
}

export function getStatusLogsInfo(ids) {
  const payload = `domain=[["id","in",[${ids}]]]&model=website.support_ticket_status_log&fields=["id","description","from_state","to_state","performed_on","performed_by"]&offset=0&limit=${ids.length}`;
  // const payload = `domain=[["id","in",[${ids}]]]&model=website.support_ticket_status_log&fields=["id","description","from_state","to_state","performed_on",("performed_by",["id","name"])]&offset=0&limit=${ids.length}`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_STATUS_LOGS_INFO, GET_STATUS_LOGS_INFO_SUCCESS, GET_STATUS_LOGS_INFO_FAILURE],
      method: 'GET',
    },
  };
}

export function getEnergyMetersInfo(model, uuid, devices) {
  const authService = AuthService();
  const requestMethod = 'GET';
  const fields = '["device_id","active_status","asset_name","company_name","db_company_id","measured_ts"]';
  const payload = `domain=[["reading_name","=","activeenergydla"],["device_id","in",${JSON.stringify(devices)}]]&model=${model}&fields=${fields}&limit=${devices.length}&order=measured_ts DESC`;
  const endPointName = `public/api/v2/search?${payload}&uuid=${uuid}&token=${authService.getAccessToken()}`;

  return {
    [CALL_API]: {
      endpoint: endPointName,
      types: [GET_ENERGY_METERS_INFO, GET_ENERGY_METERS_INFO_SUCCESS, GET_ENERGY_METERS_INFO_FAILURE],
      method: requestMethod,
      payload,
    },
  };
}
