import moment from 'moment-timezone';

import { CALL_API } from '../../middleware/api';
import { getArrayFormatDeleteOnlyIds } from '../util/appUtils';
import companyColumns from './data/customData.json';
import tenantColumns from './siteConfiguration/data/siteConfigureData.json';

export const GET_COMPANY_INFO = 'GET_COMPANY_INFO';
export const GET_COMPANY_INFO_SUCCESS = 'GET_COMPANY_INFO_SUCCESS';
export const GET_COMPANY_INFO_FAILURE = 'GET_COMPANY_INFO_FAILURE';

export const GET_SITE_INFO = 'GET_SITE_INFO';
export const GET_SITE_INFO_SUCCESS = 'GET_SITE_INFO_SUCCESS';
export const GET_SITE_INFO_FAILURE = 'GET_SITE_INFO_FAILURE';

export const GET_TEAM_INFO = 'GET_TEAM_INFO';
export const GET_TEAM_INFO_SUCCESS = 'GET_TEAM_INFO_SUCCESS';
export const GET_TEAM_INFO_FAILURE = 'GET_TEAM_INFO_FAILURE';

export const GET_TEAM_COUNT = 'GET_TEAM_COUNT';
export const GET_TEAM_COUNT_SUCCESS = 'GET_TEAM_COUNT_SUCCESS';
export const GET_TEAM_COUNT_FAILURE = 'GET_TEAM_COUNT_FAILURE';

export const GET_TEAM_MEMBER_INFO = 'GET_TEAM_MEMBER_INFO';
export const GET_TEAM_MEMBER_INFO_SUCCESS = 'GET_TEAM_MEMBER_INFO_SUCCESS';
export const GET_TEAM_MEMBER_INFO_FAILURE = 'GET_TEAM_MEMBER_INFO_FAILURE';

export const GET_TEAM_MEMBER_COUNT = 'GET_TEAM_MEMBER_COUNT';
export const GET_TEAM_MEMBER_COUNT_SUCCESS = 'GET_TEAM_MEMBER_COUNT_SUCCESS';
export const GET_TEAM_MEMBER_COUNT_FAILURE = 'GET_TEAM_MEMBER_COUNT_FAILURE';

export const GET_SHIFT_INFO = 'GET_SHIFT_INFO';
export const GET_SHIFT_INFO_SUCCESS = 'GET_SHIFT_INFO_SUCCESS';
export const GET_SHIFT_INFO_FAILURE = 'GET_SHIFT_INFO_FAILURE';

export const GET_SHIFT_COUNT = 'GET_SHIFT_COUNT';
export const GET_SHIFT_COUNT_SUCCESS = 'GET_SHIFT_COUNT_SUCCESS';
export const GET_SHIFT_COUNT_FAILURE = 'GET_SHIFT_COUNT_FAILURE';

export const GET_TENANT_INFO = 'GET_TENANT_INFO';
export const GET_TENANT_INFO_SUCCESS = 'GET_TENANT_INFO_SUCCESS';
export const GET_TENANT_INFO_FAILURE = 'GET_TENANT_INFO_FAILURE';

export const GET_TENANT_COUNT = 'GET_TENANT_COUNT';
export const GET_TENANT_COUNT_SUCCESS = 'GET_TENANT_COUNT_SUCCESS';
export const GET_TENANT_COUNT_FAILURE = 'GET_TENANT_COUNT_FAILURE';

export const GET_SITES = 'GET_SITES';
export const GET_SITES_SUCCESS = 'GET_SITES_SUCCESS';
export const GET_SITES_FAILURE = 'GET_SITES_FAILURE';

export const GET_TEAM_CATEGORY_INFO = 'GET_TEAM_CATEGORY_INFO';
export const GET_TEAM_CATEGORY_INFO_SUCCESS = 'GET_TEAM_CATEGORY_INFO_SUCCESS';
export const GET_TEAM_CATEGORY_INFO_FAILURE = 'GET_TEAM_CATEGORY_INFO_FAILURE';

export const GET_TEAM_LEADER_INFO = 'GET_TEAM_LEADER_INFO';
export const GET_TEAM_LEADER_INFO_SUCCESS = 'GET_TEAM_LEADER_INFO_SUCCESS';
export const GET_TEAM_LEADER_INFO_FAILURE = 'GET_TEAM_LEADER_INFO_FAILURE';

export const GET_WORKING_TIME_INFO = 'GET_WORKING_TIME_INFO';
export const GET_WORKING_TIME_INFO_SUCCESS = 'GET_WORKING_TIME_INFO_SUCCESS';
export const GET_WORKING_TIME_INFO_FAILURE = 'GET_WORKING_TIME_INFO_FAILURE';

export const GET_MAINTENANCE_COST_ANALYSIS = 'GET_MAINTENANCE_COST_ANALYSIS';
export const GET_MAINTENANCE_COST_ANALYSIS_SUCCESS = 'GET_MAINTENANCE_COST_ANALYSIS_SUCCESS';
export const GET_MAINTENANCE_COST_ANALYSIS_FAILURE = 'GET_MAINTENANCE_COST_ANALYSIS_FAILURE';

export const CREATE_TEAM_INFO = 'CREATE_TEAM_INFO';
export const CREATE_TEAM_INFO_SUCCESS = 'CREATE_TEAM_INFO_SUCCESS';
export const CREATE_TEAM_INFO_FAILURE = 'CREATE_TEAM_INFO_FAILURE';

export const GET_COUNTRIES_INFO = 'GET_COUNTRIES_INFO';
export const GET_COUNTRIES_INFO_SUCCESS = 'GET_COUNTRIES_INFO_SUCCESS';
export const GET_COUNTRIES_INFO_FAILURE = 'GET_COUNTRIES_INFO_FAILURE';

export const GET_STATES_INFO = 'GET_STATES_INFO';
export const GET_STATES_INFO_SUCCESS = 'GET_STATES_INFO_SUCCESS';
export const GET_STATES_INFO_FAILURE = 'GET_STATES_INFO_FAILURE';

export const CREATE_SITE_INFO = 'CREATE_SITE_INFO';
export const CREATE_SITE_INFO_SUCCESS = 'CREATE_SITE_INFO_SUCCESS';
export const CREATE_SITE_INFO_FAILURE = 'CREATE_SITE_INFO_FAILURE';

export const UPDATE_SITE_INFO = 'UPDATE_SITE_INFO';
export const UPDATE_SITE_INFO_SUCCESS = 'UPDATE_SITE_INFO_SUCCESS';
export const UPDATE_SITE_INFO_FAILURE = 'UPDATE_SITE_INFO_FAILURE';

export const CREATE_SHIFT_INFO = 'CREATE_SHIFT_INFO';
export const CREATE_SHIFT_INFO_SUCCESS = 'CREATE_SHIFT_INFO_SUCCESS';
export const CREATE_SHIFT_INFO_FAILURE = 'CREATE_SHIFT_INFO_FAILURE';

export const CREATE_TENANT_INFO = 'CREATE_TENANT_INFO';
export const CREATE_TENANT_INFO_SUCCESS = 'CREATE_TENANT_INFO_SUCCESS';
export const CREATE_TENANT_INFO_FAILURE = 'CREATE_TENANT_INFO_FAILURE';

export const CREATE_TOOLS_INFO = 'CREATE_TOOLS_INFO';
export const CREATE_TOOLS_INFO_SUCCESS = 'CREATE_TOOLS_INFO_SUCCESS';
export const CREATE_TOOLS_INFO_FAILURE = 'CREATE_TOOLS_INFO_FAILURE';

export const CREATE_PARTS_INFO = 'CREATE_PARTS_INFO';
export const CREATE_PARTS_INFO_SUCCESS = 'CREATE_PARTS_INFO_SUCCESS';
export const CREATE_PARTS_INFO_FAILURE = 'CREATE_PARTS_INFO_FAILURE';

export const GET_PRODUCT_CATEGORY_INFO = 'GET_PRODUCT_CATEGORY_INFO';
export const GET_PRODUCT_CATEGORY_INFO_SUCCESS = 'GET_PRODUCT_CATEGORY_INFO_SUCCESS';
export const GET_PRODUCT_CATEGORY_INFO_FAILURE = 'GET_PRODUCT_CATEGORY_INFO_FAILURE';

export const GET_USER_LIST_INFO = 'GET_USER_LIST_INFO';
export const GET_USER_LIST_INFO_SUCCESS = 'GET_USER_LIST_INFO_SUCCESS';
export const GET_USER_LIST_INFO_FAILURE = 'GET_USER_LIST_INFO_FAILURE';

export const GET_USERS_COUNT = 'GET_USERS_COUNT';
export const GET_USERS_COUNT_SUCCESS = 'GET_USERS_COUNT_SUCCESS';
export const GET_USERS_COUNT_FAILURE = 'GET_USERS_COUNT_FAILURE';

export const GET_ROLES_GROUP_INFO = 'GET_ROLES_GROUP_INFO';
export const GET_ROLES_GROUP_INFO_SUCCESS = 'GET_ROLES_GROUP_INFO_SUCCESS';
export const GET_ROLES_GROUP_INFO_FAILURE = 'GET_ROLES_GROUP_INFO_FAILURE';

export const CREATE_USER_INFO = 'CREATE_USER_INFO';
export const CREATE_USER_INFO_SUCCESS = 'CREATE_USER_INFO_SUCCESS';
export const CREATE_USER_INFO_FAILURE = 'CREATE_USER_INFO_FAILURE';

export const EDIT_TEAM_INFO = 'EDIT_TEAM_INFO';
export const EDIT_TEAM_INFO_SUCCESS = 'EDIT_TEAM_INFO_SUCCESS';
export const EDIT_TEAM_INFO_FAILURE = 'EDIT_TEAM_INFO_FAILURE';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'UPDATE_USER_INFO_FAILURE';

export const GET_SHIFTS_INFO = 'GET_SHIFTS_INFO';
export const GET_SHIFTS_INFO_SUCCESS = 'GET_SHIFTS_INFO_SUCCESS';
export const GET_SHIFTS_INFO_FAILURE = 'GET_SHIFTS_INFO_FAILURE';

export const GET_DEPARTMENTS_INFO = 'GET_DEPARTMENTS_INFO';
export const GET_DEPARTMENTS_INFO_SUCCESS = 'GET_DEPARTMENTS_INFO_SUCCESS';
export const GET_DEPARTMENTS_INFO_FAILURE = 'GET_DEPARTMENTS_INFO_FAILURE';

export const GET_COMPANY_CATEGORIES_INFO = 'GET_COMPANY_CATEGORIES_INFO';
export const GET_COMPANY_CATEGORIES_INFO_SUCCESS = 'GET_COMPANY_CATEGORIES_INFO_SUCCESS';
export const GET_COMPANY_CATEGORIES_INFO_FAILURE = 'GET_COMPANY_CATEGORIES_INFO_FAILURE';

export const GET_COMPANY_SUBCATEGORIES_INFO = 'GET_COMPANY_SUBCATEGORIES_INFO';
export const GET_COMPANY_SUBCATEGORIES_INFO_SUCCESS = 'GET_COMPANY_SUBCATEGORIES_INFO_SUCCESS';
export const GET_COMPANY_SUBCATEGORIES_INFO_FAILURE = 'GET_COMPANY_SUBCATEGORIES_INFO_FAILURE';

export const GET_CURRENCY_INFO = 'GET_CURRENCY_INFO';
export const GET_CURRENCY_INFO_SUCCESS = 'GET_CURRENCY_INFO_SUCCESS';
export const GET_CURRENCY_INFO_FAILURE = 'GET_CURRENCY_INFO_FAILURE';

export const GET_COMPANY = 'GET_COMPANY';
export const GET_COMPANY_SUCCESS = 'GET_COMPANY_SUCCESS';
export const GET_COMPANY_FAILURE = 'GET_COMPANY_FAILURE';

export const GET_INCOTERM_INFO = 'GET_INCOTERM_INFO';
export const GET_INCOTERM_INFO_SUCCESS = 'GET_INCOTERM_INFO_SUCCESS';
export const GET_INCOTERM_INFO_FAILURE = 'GET_INCOTERM_INFO_FAILURE';

export const GET_NOMENCLATURE_INFO = 'GET_NOMENCLATURE_INFO';
export const GET_NOMENCLATURE_INFO_SUCCESS = 'GET_NOMENCLATURE_INFO_SUCCESS';
export const GET_NOMENCLATURE_INFO_FAILURE = 'GET_NOMENCLATURE_INFO_FAILURE';

export const UPDATE_COMPANY_INFO = 'UPDATE_COMPANY_INFO';
export const UPDATE_COMPANY_INFO_SUCCESS = 'UPDATE_COMPANY_INFO_SUCCESS';
export const UPDATE_COMPANY_INFO_FAILURE = 'UPDATE_COMPANY_INFO_FAILURE';

export const GET_SITES_LIST_INFO = 'GET_SITES_LIST_INFO';
export const GET_SITES_LIST_INFO_SUCCESS = 'GET_SITES_LIST_INFO_SUCCESS';
export const GET_SITES_LIST_INFO_FAILURE = 'GET_SITES_LIST_INFO_FAILURE';

export const GET_SITES_COUNT = 'GET_SITES_COUNT';
export const GET_SITES_COUNT_SUCCESS = 'GET_SITES_COUNT_SUCCESS';
export const GET_SITES_COUNT_FAILURE = 'GET_SITES_COUNT_FAILURE';

export const GET_COUNTRIES_GROUP_INFO = 'GET_COUNTRIES_GROUP_INFO';
export const GET_COUNTRIES_GROUP_INFO_SUCCESS = 'GET_COUNTRIES_GROUP_INFO_SUCCESS';
export const GET_COUNTRIES_GROUP_INFO_FAILURE = 'GET_COUNTRIES_GROUP_INFO_FAILURE';

export const GET_USER_DETAILS = 'GET_USER_DETAILS';
export const GET_USER_DETAILS_SUCCESS = 'GET_USER_DETAILS_SUCCESS';
export const GET_USER_DETAILS_FAILURE = 'GET_USER_DETAILS_FAILURE';

export const GET_ALLOW_COMPANIES = 'GET_ALLOW_COMPANIES';
export const GET_ALLOW_COMPANIES_FAILURE = 'GET_ALLOW_COMPANIES_FAILURE';
export const GET_ALLOW_COMPANIES_SUCCESS = 'GET_ALLOW_COMPANIES_SUCCESS';

export const GET_TENANT_DETAILS = 'GET_TENANT_DETAILS';
export const GET_TENANT_DETAILS_SUCCESS = 'GET_TENANT_DETAILS_SUCCESS';
export const GET_TENANT_DETAILS_FAILURE = 'GET_TENANT_DETAILS_FAILURE';

export const GET_COVID_RESOURCES = 'GET_COVID_RESOURCES';
export const GET_COVID_RESOURCES_SUCCESS = 'GET_COVID_RESOURCES_SUCCESS';
export const GET_COVID_RESOURCES_FAILURE = 'GET_COVID_RESOURCES_FAILURE';

export const UPDATE_TENANT_INFO = 'UPDATE_TENANT_INFO';
export const UPDATE_TENANT_INFO_SUCCESS = 'UPDATE_TENANT_INFO_SUCCESS';
export const UPDATE_TENANT_INFO_FAILURE = 'UPDATE_TENANT_INFO_FAILURE';

export const GET_CLSELECTED_DETAILS = 'GET_CLSELECTED_DETAILS';
export const GET_CLSELECTED_DETAILS_SUCCESS = 'GET_CLSELECTED_DETAILS_SUCCESS';
export const GET_CLSELECTED_DETAILS_FAILURE = 'GET_CLSELECTED_DETAILS_FAILURE';

export const GET_ALL_COUNTRIES_INFO = 'GET_ALL_COUNTRIES_INFO';
export const GET_ALL_COUNTRIES_INFO_SUCCESS = 'GET_ALL_COUNTRIES_INFO_SUCCESS';
export const GET_ALL_COUNTRIES_INFO_FAILURE = 'GET_ALL_COUNTRIES_INFO_FAILURE';

export const SAVE_COMPANY_INFO = 'SAVE_COMPANY_INFO';
export const SAVE_COMPANY_INFO_SUCCESS = 'SAVE_COMPANY_INFO_SUCCESS';
export const SAVE_COMPANY_INFO_FAILURE = 'SAVE_COMPANY_INFO_FAILURE';

export const GET_ALLOWED_MODULES_INFO = 'GET_ALLOWED_MODULES_INFO';
export const GET_ALLOWED_MODULES_INFO_SUCCESS = 'GET_ALLOWED_MODULES_INFO_SUCCESS';
export const GET_ALLOWED_MODULES_INFO_FAILURE = 'GET_ALLOWED_MODULES_INFO_FAILURE';

export const GET_EXISTS_USERS_COUNT = 'GET_EXISTS_USERS_COUNT';
export const GET_EXISTS_USERS_COUNT_SUCCESS = 'GET_EXISTS_USERS_COUNT_SUCCESS';
export const GET_EXISTS_USERS_COUNT_FAILURE = 'GET_EXISTS_USERS_COUNT_FAILURE';

export const GET_TEAM_DETAILS = 'GET_TEAM_DETAILS';
export const GET_TEAM_DETAILS_SUCCESS = 'GET_TEAM_DETAILS_SUCCESS';
export const GET_TEAM_DETAILS_FAILURE = 'GET_TEAM_DETAILS_FAILURE';

export const GET_TEAM_SPACES = 'GET_TEAM_SPACES';
export const GET_TEAM_SPACES_SUCCESS = 'GET_TEAM_SPACES_SUCCESS';
export const GET_TEAM_SPACES_FAILURE = 'GET_TEAM_SPACES_FAILURE';

export const GET_MEMBER_TEAMS = 'GET_MEMBER_TEAMS';
export const GET_MEMBER_TEAMS_SUCCESS = 'GET_MEMBER_TEAMS_SUCCESS';
export const GET_MEMBER_TEAMS_FAILURE = 'GET_MEMBER_TEAMS_FAILURE';

export const GET_TEAM_EXPORT_INFO = 'GET_TEAM_EXPORT_INFO';
export const GET_TEAM_EXPORT_INFO_SUCCESS = 'GET_TEAM_EXPORT_INFO_SUCCESS';
export const GET_TEAM_EXPORT_INFO_FAILURE = 'GET_TEAM_EXPORT_INFO_FAILURE';

export const GET_TEAM_MEMBERS_EXPORT_INFO = 'GET_TEAM_MEMBERS_EXPORT_INFO';
export const GET_TEAM_MEMBERS_EXPORT_INFO_SUCCESS = 'GET_TEAM_MEMBERS_EXPORT_INFO_SUCCESS';
export const GET_TEAM_MEMBERS_EXPORT_INFO_FAILURE = 'GET_TEAM_MEMBERS_EXPORT_INFO_FAILURE';

export const GET_SITE_EXPORT_INFO = 'GET_SITE_EXPORT_INFO';
export const GET_SITE_EXPORT_INFO_SUCCESS = 'GET_SITE_EXPORT_INFO_SUCCESS';
export const GET_SITE_EXPORT_INFO_FAILURE = 'GET_SITE_EXPORT_INFO_FAILURE';

export const VISITOR_PASS_CONFIG = 'VISITOR_PASS_CONFIG';
export const VISITOR_PASS_CONFIG_SUCCESS = 'VISITOR_PASS_CONFIG_SUCCESS';
export const VISITOR_PASS_CONFIG_FAILURE = 'VISITOR_PASS_CONFIG_FAILURE';

export const GET_SHIFTS_EXPORT_INFO = 'GET_SHIFTS_EXPORT_INFO';
export const GET_SHIFTS_EXPORT_INFO_SUCCESS = 'GET_SHIFTS_EXPORT_INFO_SUCCESS';
export const GET_SHIFTS_EXPORT_INFO_FAILURE = 'GET_SHIFTS_EXPORT_INFO_FAILURE';

export const GET_TENANTS_EXPORT_INFO = 'GET_TENANTS_EXPORT_INFO';
export const GET_TENANTS_EXPORT_INFO_SUCCESS = 'GET_TENANTS_EXPORT_INFO_SUCCESS';
export const GET_TENANTS_EXPORT_INFO_FAILURE = 'GET_TENANTS_EXPORT_INFO_FAILURE';

export const UPDATE_SHIFT_INFO = 'UPDATE_SHIFT_INFO';
export const UPDATE_SHIFT_INFO_SUCCESS = 'UPDATE_SHIFT_INFO_SUCCESS';
export const UPDATE_SHIFT_INFO_FAILURE = 'UPDATE_SHIFT_INFO_FAILURE';

export const GET_SHIFT_DETAILS = 'GET_SHIFT_DETAILS';
export const GET_SHIFT_DETAILS_SUCCESS = 'GET_SHIFT_DETAILS_SUCCESS';
export const GET_SHIFT_DETAILS_FAILURE = 'GET_SHIFT_DETAILS_FAILURE';

export const DELETE_MEMBER_TEAM_INFO = 'DELETE_MEMBER_TEAM_INFO';
export const DELETE_MEMBER_TEAM_INFO_SUCCESS = 'DELETE_MEMBER_TEAM_INFO_SUCCESS';
export const DELETE_MEMBER_TEAM_INFO_FAILURE = 'DELETE_MEMBER_TEAM_INFO_FAILURE';

export const USER_PASSWORD_UPDATE_INFO = 'USER_PASSWORD_UPDATE_INFO';
export const USER_PASSWORD_UPDATE_INFO_SUCCESS = 'USER_PASSWORD_UPDATE_INFO_SUCCESS';
export const USER_PASSWORD_UPDATE_INFO_FAILURE = 'USER_PASSWORD_UPDATE_INFO_FAILURE';

export const GET_DESIGNATIONS_INFO = 'GET_DESIGNATIONS_INFO';
export const GET_DESIGNATIONS_INFO_SUCCESS = 'GET_DESIGNATIONS_INFO_SUCCESS';
export const GET_DESIGNATIONS_INFO_FAILURE = 'GET_DESIGNATIONS_INFO_FAILURE';

export const USER_SESSION_INFO = 'USER_SESSION_INFO';
export const USER_SESSION_INFO_SUCCESS = 'USER_SESSION_INFO_SUCCESS';
export const USER_SESSION_INFO_FAILURE = 'USER_SESSION_INFO_FAILURE';

export const USER_SESSION_REMOVE_INFO = 'USER_SESSION_REMOVE_INFO';
export const USER_SESSION_REMOVE_INFO_SUCCESS = 'USER_SESSION_REMOVE_INFO_SUCCESS';
export const USER_SESSION_REMOVE_INFO_FAILURE = 'USER_SESSION_REMOVE_INFO_FAILURE';

export const GET_COMPANY_REGIONS_INFO = 'GET_COMPANY_REGIONS_INFO';
export const GET_COMPANY_REGIONS_INFO_SUCCESS = 'GET_COMPANY_REGIONS_INFO_SUCCESS';
export const GET_COMPANY_REGIONS_INFO_FAILURE = 'GET_COMPANY_REGIONS_INFO_FAILURE';

export const GET_ALL_TEAMS_INFO = 'GET_ALL_TEAMS_INFO';
export const GET_ALL_TEAMS_INFO_SUCCESS = 'GET_ALL_TEAMS_INFO_SUCCESS';
export const GET_ALL_TEAMS_INFO_FAILURE = 'GET_ALL_TEAMS_INFO_FAILURE';

export const GET_USER_TEAMS_INFO = 'GET_USER_TEAMS_INFO';
export const GET_USER_TEAMS_INFO_SUCCESS = 'GET_USER_TEAMS_INFO_SUCCESS';
export const GET_USER_TEAMS_INFO_FAILURE = 'GET_USER_TEAMS_INFO_FAILURE';

export const UPDATE_TEAMS_INFO = 'UPDATE_TEAMS_INFO';
export const UPDATE_TEAMS_INFO_SUCCESS = 'UPDATE_TEAMS_INFO_SUCCESS';
export const UPDATE_TEAMS_INFO_FAILURE = 'UPDATE_TEAMS_INFO_FAILURE';

export const UPDATE_TENANT_NO_INFO = 'UPDATE_TENANT_NO_INFO';
export const UPDATE_TENANT_NO_INFO_SUCCESS = 'UPDATE_TENANT_NO_INFO_SUCCESS';
export const UPDATE_TENANT_NO_INFO_FAILURE = 'UPDATE_TENANT_NO_INFO_FAILURE';

export const GET_BULKINSP_INFO = 'GET_BULKINSP_INFO';
export const GET_BULKINSP_INFO_SUCCESS = 'GET_BULKINSP_INFO_SUCCESS';
export const GET_BULKINSP_INFO_FAILURE = 'GET_BULKINSP_INFO_FAILURE';

export const GET_BULKINSP_COUNT = 'GET_BULKINSP_COUNT';
export const GET_BULKINSP_COUNT_SUCCESS = 'GET_BULKINSP_COUNT_SUCCESS';
export const GET_BULKINSP_COUNT_FAILURE = 'GET_BULKINSP_COUNT_FAILURE';

export const GET_BULKINSP_EXPORT_INFO = 'GET_BULKINSP_EXPORT_INFO';
export const GET_BULKINSP_EXPORT_INFO_SUCCESS = 'GET_BULKINSP_EXPORT_INFO_SUCCESS';
export const GET_BULKINSP_EXPORT_INFO_FAILURE = 'GET_BULKINSP_EXPORT_INFO_FAILURE';

export const ARCHIVE_INFO = 'ARCHIVE_INFO';
export const ARCHIVE_INFO_SUCCESS = 'ARCHIVE_INFO_SUCCESS';
export const ARCHIVE_INFO_FAILURE = 'ARCHIVE_INFO_FAILURE';

export const GET_PASSWORD_EXISTS_INFO = 'GET_PASSWORD_EXISTS_INFO';
export const GET_PASSWORD_EXISTS_INFO_SUCCESS = 'GET_PASSWORD_EXISTS_INFO_SUCCESS';
export const GET_PASSWORD_EXISTS_INFO_FAILURE = 'GET_PASSWORD_EXISTS_INFO_FAILURE';

export const GET_ADMIN_PPM_LIST_INFO = 'GET_ADMIN_PPM_LIST_INFO';
export const GET_ADMIN_PPM_LIST_INFO_SUCCESS = 'GET_ADMIN_PPM_LIST_INFO_SUCCESS';
export const GET_ADMIN_PPM_LIST_INFO_FAILURE = 'GET_ADMIN_PPM_LIST_INFO_FAILURE';

export const GET_ADMIN_PPM_COUNT = 'GET_ADMIN_PPM_COUNT';
export const GET_ADMIN_PPM_COUNT_SUCCESS = 'GET_ADMIN_PPM_COUNT_SUCCESS';
export const GET_ADMIN_PPM_COUNT_FAILURE = 'GET_ADMIN_PPM_COUNT_FAILURE';

export const GET_ADMIN_PPM_EXPORT_INFO = 'GET_ADMIN_PPM_EXPORT_INFO';
export const GET_ADMIN_PPM_EXPORT_INFO_SUCCESS = 'GET_ADMIN_PPM_EXPORT_INFO_SUCCESS';
export const GET_ADMIN_PPM_EXPORT_INFO_FAILURE = 'GET_ADMIN_PPM_EXPORT_INFO_FAILURE';

export const GET_ADMIN_INSPECTION_LIST_INFO = 'GET_ADMIN_INSPECTION_LIST_INFO';
export const GET_ADMIN_INSPECTION_LIST_INFO_SUCCESS = 'GET_ADMIN_INSPECTION_LIST_INFO_SUCCESS';
export const GET_ADMIN_INSPECTION_LIST_INFO_FAILURE = 'GET_ADMIN_INSPECTION_LIST_INFO_FAILURE';

export const GET_ADMIN_INSPECTION_COUNT = 'GET_ADMIN_INSPECTION_COUNT';
export const GET_ADMIN_INSPECTION_COUNT_SUCCESS = 'GET_ADMIN_INSPECTION_COUNT_SUCCESS';
export const GET_ADMIN_INSPECTION_COUNT_FAILURE = 'GET_ADMIN_INSPECTION_COUNT_FAILURE';

export const GET_ADMIN_INSPECTION_EXPORT_INFO = 'GET_ADMIN_INSPECTION_EXPORT_INFO';
export const GET_ADMIN_INSPECTION_EXPORT_INFO_SUCCESS = 'GET_ADMIN_INSPECTION_EXPORT_INFO_SUCCESS';
export const GET_ADMIN_INSPECTION_EXPORT_INFO_FAILURE = 'GET_ADMIN_INSPECTION_EXPORT_INFO_FAILURE';

export function updateUserTeamsInfo(model, id, values) {
  const payload = {
    model: `${model}`,
    ids: `[${id}]`,
    values,
  };
  return {
    [CALL_API]: {
      endpoint: 'teammember/update',
      types: [UPDATE_TEAMS_INFO, UPDATE_TEAMS_INFO_SUCCESS, UPDATE_TEAMS_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
export function getAllCompanyTeamsInfo(company) {
  return {
    [CALL_API]: {
      endpoint: `team_members/team?company_ids=[${company}]`,
      types: [GET_ALL_TEAMS_INFO, GET_ALL_TEAMS_INFO_SUCCESS, GET_ALL_TEAMS_INFO_FAILURE],
      method: 'GET',
    },
  };
}
export function getUserCompanyTeamsInfo(ids) {
  const payload = {
    args: {
      user_ids: `${ids}`,
    },
  };
  return {
    [CALL_API]: {
      endpoint: `team_members/team_view?user_ids=[${ids}]`,
      types: [GET_USER_TEAMS_INFO, GET_USER_TEAMS_INFO_SUCCESS, GET_USER_TEAMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
export function getCompanyData(id, modelName) {
  const fields = companyColumns && companyColumns.viewFields ? companyColumns.viewFields : [];
  let payload = `ids=[${id}]`;
  payload = `${payload}&fields=${JSON.stringify(fields)}`;
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?${payload}`,
      types: [GET_COMPANY_INFO, GET_COMPANY_INFO_SUCCESS, GET_COMPANY_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getSiteData(id, modelName) {
  const fields = companyColumns && companyColumns.viewFields ? companyColumns.viewFields : [];
  let payload = `ids=[${id}]`;
  payload = `${payload}&fields=${JSON.stringify(fields)}`;
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?${payload}`,
      types: [GET_SITE_INFO, GET_SITE_INFO_SUCCESS, GET_SITE_INFO_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTeamInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, teamId, globalFilter, fields) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (teamId) {
    payload = `domain=[["company_id","in",[${company}]],["id","in",[${teamId}]]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  const defaultFields = ['name', 'company_id',
    'employee_id', 'maintenance_cost_analytic_account_id', 'team_type', 'member_ids', 'team_category_id', 'labour_cost_unit', 'resource_calendar_id', 'responsible_id', 'location_ids'];

  payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAM_INFO, GET_TEAM_INFO_SUCCESS, GET_TEAM_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamsExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
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

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAM_EXPORT_INFO, GET_TEAM_EXPORT_INFO_SUCCESS, GET_TEAM_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamMembersExportInfo(company, model, limit, offset, fields, searchValue, rows, customFilters, globalFilter, isUser, isActiveUser) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }

  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  let endPoint = 'search_read';
  if (isUser) {
    if (isActiveUser) {
      payload = `${payload},["active","=",true]`;
    } else {
      payload = `${payload},["active","=",false]`;
    }
    const defaultFieldsSearch = '["name", "email", "state", "associates_to", "employee_id_seq", "active", "id",("vendor_id",["id","name"]),("company_id",["id","name"]),("hr_department",["id","name"]),("resource_calendar_id",["id","name"])]';
    payload = `${payload}]&model=${model}&fields=${defaultFieldsSearch}&limit=${limit}&offset=${offset}&order=create_date DESC`;
    endPoint = 'search';
  } else {
    payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;
    endPoint = 'search_read';
  }

  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_TEAM_MEMBERS_EXPORT_INFO, GET_TEAM_MEMBERS_EXPORT_INFO_SUCCESS, GET_TEAM_MEMBERS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamsCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  /* if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`; */
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      // endpoint: `read_group?${payload}`,
      endpoint: `search?${payload}`,
      types: [GET_TEAM_COUNT, GET_TEAM_COUNT_SUCCESS, GET_TEAM_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamMemberInfo(company, model, limit, offset, sortBy, sortField, searchValue, customFilters, globalFilter, fields, isUser, isActiveUser) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  const defaultFieldsSearch = '["name", "email", "state", "associates_to", "employee_id_seq", "active", "id",("vendor_id",["id","name"]),("company_id",["id","name"]),("hr_department",["id","name"]),("resource_calendar_id",["id","name"])]';
  const defaultFields = ['name', 'email', 'state', 'associates_to', 'employee_id_seq', 'vendor_id', 'maintenance_team_ids', 'active', 'company_id', 'hr_department', 'resource_calendar_id'];
  let endPoint = 'search_read';
  if (isUser) {
    if (isActiveUser) {
      payload = `${payload},["active","=",true]`;
    } else {
      payload = `${payload},["active","=",false]`;
    }
    payload = `${payload}]&model=${model}&fields=${defaultFieldsSearch}`;
    endPoint = 'search';
  } else {
    payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}`;
    endPoint = 'search_read';
  }
  payload = `${payload}&limit=${limit}&offset=${offset}`;
  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }

  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_TEAM_MEMBER_INFO, GET_TEAM_MEMBER_INFO_SUCCESS, GET_TEAM_MEMBER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamMembersCountInfo(company, model, searchValue, customFilters, globalFilter, isUser, isActiveUser) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  let endPoint = 'read_group';
  if (isUser) {
    if (isActiveUser) {
      payload = `${payload},["active","=",true]`;
    } else {
      payload = `${payload},["active","=",false]`;
    }
    payload = `${payload}]&model=${model}&count=1`;
    endPoint = 'search';
  } else {
    payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
    endPoint = 'read_group';
  }
  return {
    [CALL_API]: {
      endpoint: `${endPoint}?${payload}`,
      types: [GET_TEAM_MEMBER_COUNT, isUser ? 'GET_TEAM_MEMBER_COUNT_SEARCH_SUCCESS' : GET_TEAM_MEMBER_COUNT_SUCCESS, GET_TEAM_MEMBER_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getShiftInfo(company, model, limit, offset, sortBy, sortField, searchValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (searchValue) {
    payload = `${payload},"|",["name","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=["name","description","start_time","duration","is_use_company","lc_grace","eg_grace","lt_period","half_day_from","half_day_to","vendor_id","company_id"]`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;
  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SHIFT_INFO, GET_SHIFT_INFO_SUCCESS, GET_SHIFT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getShiftsExportInfo(company, model, limit, offset, fields, searchValue, rows) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (searchValue) {
    payload = `${payload},"|",["name","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SHIFTS_EXPORT_INFO, GET_SHIFTS_EXPORT_INFO_SUCCESS, GET_SHIFTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getShiftsCountInfo(company, model, searchValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (searchValue) {
    payload = `${payload},"|",["name","ilike","${searchValue}"],["vendor_id.name","ilike","${searchValue}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_SHIFT_COUNT, GET_SHIFT_COUNT_SUCCESS, GET_SHIFT_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTenantInfo(company, model, limit, offset, sortBy, sortField, searchValue) {
  let payload = `domain=[["company_id","in",[${company}]],["parent_id","=",false],["is_tenant","=",true]`;
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["city","ilike","${searchValue}"]`;
  }
  payload = `${payload}]&model=${model}`;
  payload = `${payload}&fields=["name","parent_id","active","country_id","zip","city","state_id","company_id","phone","mobile","email","website"]`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;
  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TENANT_INFO, GET_TENANT_INFO_SUCCESS, GET_TENANT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTenantsExportInfo(company, model, limit, offset, fields, searchValue, rows) {
  let payload = `domain=[["company_id","in",[${company}]],["parent_id","=",false],["is_tenant","=",true]`;
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["city","ilike","${searchValue}"]`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }

  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TENANTS_EXPORT_INFO, GET_TENANTS_EXPORT_INFO_SUCCESS, GET_TENANTS_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTenantsCountInfo(company, model, searchValue) {
  let payload = `domain=[["company_id","in",[${company}]],["parent_id","=",false],["is_tenant","=",true]`;
  if (searchValue) {
    payload = `${payload},"|","|",["name","ilike","${searchValue}"],["email","ilike","${searchValue}"],["city","ilike","${searchValue}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;

  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_TENANT_COUNT, GET_TENANT_COUNT_SUCCESS, GET_TENANT_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSites(id, model) {
  const payload = `domain=[["parent_id","in",[${id}]]]&model=${model}&fields=["area_sqft","code","name","latitude","longitude","street","logo","res_company_categ_id"]`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SITES, GET_SITES_SUCCESS, GET_SITES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMaintenanceCostAnalysisInfo(company, model, keyword, fields, limit) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  const defaultFields = ['name'];
  payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}&limit=${limit || 10}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MAINTENANCE_COST_ANALYSIS, GET_MAINTENANCE_COST_ANALYSIS_SUCCESS, GET_MAINTENANCE_COST_ANALYSIS_FAILURE],
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

export function getTeamLeaderInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAM_LEADER_INFO, GET_TEAM_LEADER_INFO_SUCCESS, GET_TEAM_LEADER_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getWorkingTimeInfo(company, model, keyword, fields, limit) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  const defaultFields = ['name'];
  payload = `${payload}]&model=${model}&fields=${fields ? JSON.stringify(fields) : JSON.stringify(defaultFields)}&limit=${limit || 10}&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_WORKING_TIME_INFO, GET_WORKING_TIME_INFO_SUCCESS, GET_WORKING_TIME_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createTeamInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_TEAM_INFO, CREATE_TEAM_INFO_SUCCESS, CREATE_TEAM_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function editTeamInfo(id, model, result) {
  const payload = { ids: `[${id}]`, values: result };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [EDIT_TEAM_INFO, EDIT_TEAM_INFO_SUCCESS, EDIT_TEAM_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getCountriesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=250&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COUNTRIES_INFO, GET_COUNTRIES_INFO_SUCCESS, GET_COUNTRIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllCountriesInfo() {
  const payload = [];
  return {
    [CALL_API]: {
      endpoint: 'countries',
      types: [GET_ALL_COUNTRIES_INFO, GET_ALL_COUNTRIES_INFO_SUCCESS, GET_ALL_COUNTRIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function saveCompanyInfo(data) {
  return {
    [CALL_API]: {
      endpoint: 'crm',
      types: [
        SAVE_COMPANY_INFO, SAVE_COMPANY_INFO_SUCCESS, SAVE_COMPANY_INFO_FAILURE,
      ],
      method: 'POST',
      payload: data,
    },
  };
}

export function getStatesInfo(model, typeId, keyword) {
  let payload = 'domain=[';
  if (typeId) {
    payload = `${payload}["country_id","=",${typeId}]`;
  }
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=100&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_STATES_INFO, GET_STATES_INFO_SUCCESS, GET_STATES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCreateSiteInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SITE_INFO, CREATE_SITE_INFO_SUCCESS, CREATE_SITE_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getUpdateSiteInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_SITE_INFO, UPDATE_SITE_INFO_SUCCESS, UPDATE_SITE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getCreateShiftInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_SHIFT_INFO, CREATE_SHIFT_INFO_SUCCESS, CREATE_SHIFT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getCreateTenantInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_TENANT_INFO, CREATE_TENANT_INFO_SUCCESS, CREATE_TENANT_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getCreateToolsInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_TOOLS_INFO, CREATE_TOOLS_INFO_SUCCESS, CREATE_TOOLS_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getCreatePartsInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_PARTS_INFO, CREATE_PARTS_INFO_SUCCESS, CREATE_PARTS_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function getProductCategoriesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=100&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: 'inventory/product/category',
      types: [GET_PRODUCT_CATEGORY_INFO, GET_PRODUCT_CATEGORY_INFO_SUCCESS, GET_PRODUCT_CATEGORY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUsersListInfo(company, model, limit, offset, customFilters, sortByValue, sortFieldValue, keyword) {
  let payload = 'domain=[["name","!=",false]';

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["name","email","partner_id","role_ids","__last_update","company_id","create_date","mobile","active","password","user_role_id"]&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_USER_LIST_INFO, GET_USER_LIST_INFO_SUCCESS, GET_USER_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUsersCountInfo(company, model, customFilters, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;

  if (keyword && keyword.length) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_USERS_COUNT, GET_USERS_COUNT_SUCCESS, GET_USERS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getRolesGroupsInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  } else {
    payload = `${payload}["name","!=",false]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ROLES_GROUP_INFO, GET_ROLES_GROUP_INFO_SUCCESS, GET_ROLES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUserDetailsInfo(company, model, userId, teamMemberId) {
  let payload;
  if (teamMemberId) {
    payload = `domain=[["company_id","in",[${company}]],["id","in",[${teamMemberId}]]]&model=${model}&fields=[]&limit=1&offset=0`;
  }
  if (userId) {
    payload = `domain=[["company_id","in",[${company}]],["user_id","in",[${userId}]]]&model=${model}&fields=[]&limit=1&offset=0`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_USER_DETAILS, GET_USER_DETAILS_SUCCESS, GET_USER_DETAILS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function createUserInfo(model, result) {
  return {
    [CALL_API]: {
      endpoint: `create/${model}`,
      types: [CREATE_USER_INFO, CREATE_USER_INFO_SUCCESS, CREATE_USER_INFO_FAILURE],
      method: 'POST',
      payload: result,
    },
  };
}

export function updateUserInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_USER_INFO, UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getShiftsListInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SHIFTS_INFO, GET_SHIFTS_INFO_SUCCESS, GET_SHIFTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getDepartmentsInfo(company, model, keyword, inventory) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}"|",["name","ilike","${keyword}"],["display_name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["id","name","display_name"]&limit=100&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: inventory ? 'inventory/product/department' : `search_read?${payload}`,
      types: [GET_DEPARTMENTS_INFO, GET_DEPARTMENTS_INFO_SUCCESS, GET_DEPARTMENTS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCompanyCategoriesInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPANY_CATEGORIES_INFO, GET_COMPANY_CATEGORIES_INFO_SUCCESS, GET_COMPANY_CATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSubCompanyCategoriesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPANY_SUBCATEGORIES_INFO, GET_COMPANY_SUBCATEGORIES_INFO_SUCCESS, GET_COMPANY_SUBCATEGORIES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCompanyRegionsInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COMPANY_REGIONS_INFO, GET_COMPANY_REGIONS_INFO_SUCCESS, GET_COMPANY_REGIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllowComapanies(model, ids) {
  let payload = 'domain=[';
  if (ids && ids.length > 0) {
    payload = `${payload}["id","in",[${ids}]]`;
  }
  payload = `${payload}]&model=${model}&fields=[]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALLOW_COMPANIES, GET_ALLOW_COMPANIES_SUCCESS, GET_ALLOW_COMPANIES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCurrencyInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CURRENCY_INFO, GET_CURRENCY_INFO_SUCCESS, GET_CURRENCY_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getIncotermsInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_INCOTERM_INFO, GET_INCOTERM_INFO_SUCCESS, GET_INCOTERM_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getNomenClaturesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_NOMENCLATURE_INFO, GET_NOMENCLATURE_INFO_SUCCESS, GET_NOMENCLATURE_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateCompanyInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_COMPANY_INFO, UPDATE_COMPANY_INFO_SUCCESS, UPDATE_COMPANY_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getSitesListInfo(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["parent_id","=",${parentId}]`;
  if (states && states.length > 0) {
    payload = `${payload},["city","in",${JSON.stringify(states)}]`;
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["name","code","city","state_id","country_id","street","area_sqft","latitude","longitude","logo","res_company_categ_id"]`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SITES_LIST_INFO, GET_SITES_LIST_INFO_SUCCESS, GET_SITES_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSitesCountInfo(company, model, parentId, states, customFilters, globalFilter) {
  let payload = `domain=[["parent_id","=",${parentId}]`;
  if (states && states.length > 0) {
    payload = `${payload},["city","in",${JSON.stringify(states)}]`;
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
      types: [GET_SITES_COUNT, GET_SITES_COUNT_SUCCESS, GET_SITES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getSiteExportInfo(company, model, limit, offset, parentId, states, customFilters, sortByValue, sortFieldValue, rows, globalFilter) {
  let payload = `domain=[["parent_id","=",${parentId}]`;
  if (states && states.length > 0) {
    payload = `${payload},["city","in",${JSON.stringify(states)}]`;
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

  payload = `${payload}]&model=${model}&fields=["name","code","city","state_id","country_id","street","area_sqft","latitude","longitude","logo","res_company_categ_id"]`;
  payload = `${payload}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_SITE_EXPORT_INFO, GET_SITE_EXPORT_INFO_SUCCESS, GET_SITE_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCountryGroupsInfo(parentId, model) {
  const payload = `domain=[["parent_id","=",${parentId}],["city","!=",false]]&model=${model}&fields=["city"]&groupby=["city"]`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COUNTRIES_GROUP_INFO, GET_COUNTRIES_GROUP_INFO_SUCCESS, GET_COUNTRIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function geTenantDetailInfo(id, modelName) {
  const fields = tenantColumns && tenantColumns.viewFields ? tenantColumns.viewFields : [];
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=${JSON.stringify(fields)}`,
      types: [GET_TENANT_DETAILS, GET_TENANT_DETAILS_SUCCESS, GET_TENANT_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getCovidResourcesInfo(company, model, keyword) {
  let payload = 'domain=[';
  if (keyword && keyword.length > 0) {
    payload = `${payload}["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_COVID_RESOURCES, GET_COVID_RESOURCES_SUCCESS, GET_COVID_RESOURCES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateTenantInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_TENANT_INFO, UPDATE_TENANT_INFO_SUCCESS, UPDATE_TENANT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateTenantInfoNoLoad(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_TENANT_NO_INFO, UPDATE_TENANT_NO_INFO_SUCCESS, UPDATE_TENANT_NO_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getChecklistSelectedInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["name"]`;
  payload = `${payload}&limit=50&offset=0&order=id ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CLSELECTED_DETAILS, GET_CLSELECTED_DETAILS_SUCCESS, GET_CLSELECTED_DETAILS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAllowedModulesInfo(payload, isChild, id) {
  let payloads = `domain=["|",["parent_id","=",${id}],["id","=",${id}]]`;
  payloads = `${payloads}&model=res.company&fields=["name","region_id","code"]`;
  return {
    [CALL_API]: {
      endpoint: isChild ? `search_read?${payloads}` : 'userinformation',
      types: [GET_ALLOWED_MODULES_INFO, GET_ALLOWED_MODULES_INFO_SUCCESS, GET_ALLOWED_MODULES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function checkUserExistsInfo(company, model, mail) {
  const payload = `email=${mail}`;
  return {
    [CALL_API]: {
      endpoint: `team_members/validation?${payload}`,
      types: [GET_EXISTS_USERS_COUNT, GET_EXISTS_USERS_COUNT_SUCCESS, GET_EXISTS_USERS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getTeamDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_TEAM_DETAILS, GET_TEAM_DETAILS_SUCCESS, GET_TEAM_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getTeamSpacesInfo(company, values, modelName) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["space_name","path_name","asset_category_id"]`;
  payload = `${payload}&limit=200&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_TEAM_SPACES, GET_TEAM_SPACES_SUCCESS, GET_TEAM_SPACES_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getMemberTeamsInfo(company, values, modelName) {
  let payload = `domain=[["company_id","in",[${company}]],["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["name","team_type","team_category_id","company_id"]`;
  payload = `${payload}&limit=200&offset=0`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_MEMBER_TEAMS, GET_MEMBER_TEAMS_SUCCESS, GET_MEMBER_TEAMS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getVpConfigInfo(uuid) {
  const payload = [];
  return {
    [CALL_API]: {
      endpoint: `public/getVMSConfig?uuid=${uuid}`,
      types: [VISITOR_PASS_CONFIG, VISITOR_PASS_CONFIG_SUCCESS, VISITOR_PASS_CONFIG_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getShiftDetailInfo(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_SHIFT_DETAILS, GET_SHIFT_DETAILS_SUCCESS, GET_SHIFT_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getShiftUpdateInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [UPDATE_SHIFT_INFO, UPDATE_SHIFT_INFO_SUCCESS, UPDATE_SHIFT_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function teamDeleteInfo(id, teamId) {
  const deleteIds = getArrayFormatDeleteOnlyIds(typeof teamId === 'number' ? [teamId] : teamId);
  const result = { maintenance_team_ids: deleteIds };
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: 'write/user.management',
      types: [DELETE_MEMBER_TEAM_INFO, DELETE_MEMBER_TEAM_INFO_SUCCESS, DELETE_MEMBER_TEAM_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function updateUserPasswordInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'user/password/update',
      types: [USER_PASSWORD_UPDATE_INFO, USER_PASSWORD_UPDATE_INFO_SUCCESS, USER_PASSWORD_UPDATE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getDesignationsInfo(company, model, keyword) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (keyword && keyword.length > 0) {
    payload = `${payload},["name","ilike","${keyword}"]`;
  }
  payload = `${payload}]&model=${model}&fields=["name"]&limit=20&offset=0&order=name ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_DESIGNATIONS_INFO, GET_DESIGNATIONS_INFO_SUCCESS, GET_DESIGNATIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getUserSessionInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'active_sessions_per_user',
      types: [USER_SESSION_INFO, USER_SESSION_INFO_SUCCESS, USER_SESSION_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function setRemoveImproperSessionsInfo(payload) {
  return {
    [CALL_API]: {
      endpoint: 'improper_session_expiry',
      types: [USER_SESSION_REMOVE_INFO, USER_SESSION_REMOVE_INFO_SUCCESS, USER_SESSION_REMOVE_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getBulkInspectionInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${modelName}&fields=${fields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_BULKINSP_INFO, GET_BULKINSP_INFO_SUCCESS, GET_BULKINSP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBulkInspectionCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

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
      types: [GET_BULKINSP_COUNT, GET_BULKINSP_COUNT_SUCCESS, GET_BULKINSP_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getBulkInspectionExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  const defaultFields = '["id", "name",("location_id",["id","path_name","space_name"])]';

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
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
      types: [GET_BULKINSP_EXPORT_INFO, GET_BULKINSP_EXPORT_INFO_SUCCESS, GET_BULKINSP_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getArchiveInfo(id, model, result) {
  const payload = { ids: `[${id}]`, values: result };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [ARCHIVE_INFO, ARCHIVE_INFO_SUCCESS, ARCHIVE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getPasswordExistsInfo(id, state, modelName, data) {
  const payload = {
    ids: `[${id}]`, model: modelName, method: state,
  };
  if (data) {
    payload.args_new = `{"${data}"}`;
  }
  return {
    [CALL_API]: {
      endpoint: 'call',
      types: [GET_PASSWORD_EXISTS_INFO, GET_PASSWORD_EXISTS_INFO_SUCCESS, GET_PASSWORD_EXISTS_INFO_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function getPPMListInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${modelName}&fields=${fields}&limit=${limit}&offset=${offset}`;
  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ADMIN_PPM_LIST_INFO, GET_ADMIN_PPM_LIST_INFO_SUCCESS, GET_ADMIN_PPM_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMListCountInfo(company, model, customFilters, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;

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
      types: [GET_ADMIN_PPM_COUNT, GET_ADMIN_PPM_COUNT_SUCCESS, GET_ADMIN_PPM_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getPPMListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]],["active","=",true]`;
  const defaultFields = '["id", "name",("location_id",["id","path_name","space_name"])]';

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ADMIN_PPM_EXPORT_INFO, GET_ADMIN_PPM_EXPORT_INFO_SUCCESS, GET_ADMIN_PPM_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionListInfo(company, modelName, limit, offset, customFilters, sortByValue, sortFieldValue, globalFilter, fields, today, holidayStart, holidayEnd) {
  let payload = `[["company_id","in",[${company}]]`;

  if (today && holidayStart && holidayEnd) {
    // const date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    payload = `${payload},"|","&",["ends_on",">=","${holidayStart}"],["ends_on","<=","${holidayEnd}"],["ends_on", "=", false]`;
    payload = encodeURIComponent(payload);
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]`;
  payload = `domain=${payload}&model=${modelName}&fields=${fields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortByValue) {
    payload = `${payload}&order=${sortFieldValue} ${sortByValue}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ADMIN_INSPECTION_LIST_INFO, GET_ADMIN_INSPECTION_LIST_INFO_SUCCESS, GET_ADMIN_INSPECTION_LIST_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionListCountInfo(company, model, customFilters, globalFilter, today, holidayStart, holidayEnd) {
  let payload = `[["company_id","in",[${company}]]`;
  if (today && holidayStart && holidayEnd) {
    // const date = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    payload = `${payload},"|","&",["ends_on",">=","${holidayStart}"],["ends_on","<=","${holidayEnd}"],["ends_on", "=", false]`;
    payload = encodeURIComponent(payload);
  }
  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]`;

  payload = `domain=${payload}&model=${model}&count=1`;

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ADMIN_INSPECTION_COUNT, GET_ADMIN_INSPECTION_COUNT_SUCCESS, GET_ADMIN_INSPECTION_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getInspectionListExportInfo(company, model, limit, offset, fields, customFilters, rows, sortByValue, sortFieldValue, globalFilter) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  const defaultFields = '["id", "name",("location_id",["id","path_name","space_name"])]';

  if (globalFilter) {
    payload = `${payload},${globalFilter}`;
  }

  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  if (rows && rows.length > 0) {
    payload = `${payload},["id","in",[${rows}]]`;
  }
  payload = `${payload}]&model=${model}&fields=${fields}&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ADMIN_INSPECTION_EXPORT_INFO, GET_ADMIN_INSPECTION_EXPORT_INFO_SUCCESS, GET_ADMIN_INSPECTION_EXPORT_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}
