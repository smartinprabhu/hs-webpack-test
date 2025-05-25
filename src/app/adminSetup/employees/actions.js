import { CALL_API } from '../../../middleware/api';

export const GET_EMPLOYEES_INFO = 'GET_EMPLOYEES_INFO';
export const GET_EMPLOYEES_INFO_SUCCESS = 'GET_EMPLOYEES_INFO_SUCCESS';
export const GET_EMPLOYEES_INFO_FAILURE = 'GET_EMPLOYEES_INFO_FAILURE';

export const GET_EMPLOYEES_COUNT = 'GET_EMPLOYEES_COUNT';
export const GET_EMPLOYEES_COUNT_SUCCESS = 'GET_EMPLOYEES_COUNT_SUCCESS';
export const GET_EMPLOYEES_COUNT_FAILURE = 'GET_EMPLOYEES_COUNT_FAILURE';

export const GET_CATEGORIES_GROUP_INFO = 'GET_CATEGORIES_GROUP_INFO';
export const GET_CATEGORIES_GROUP_INFO_SUCCESS = 'GET_CATEGORIES_GROUP_INFO_SUCCESS';
export const GET_CATEGORIES_GROUP_INFO_FAILURE = 'GET_CATEGORIES_GROUP_INFO_FAILURE';

export const GET_EMPLOYEE_DETAILS = 'GET_EMPLOYEE_DETAILS';
export const GET_EMPLOYEE_DETAILS_SUCCESS = 'GET_EMPLOYEE_DETAILS_SUCCESS';
export const GET_EMPLOYEE_DETAILS_FAILURE = 'GET_EMPLOYEE_DETAILS_FAILURE';

export const GET_NEIGHBOUR_DETAILS = 'GET_NEIGHBOUR_DETAILS';
export const GET_NEIGHBOUR_DETAILS_SUCCESS = 'GET_NEIGHBOUR_DETAILS_SUCCESS';
export const GET_NEIGHBOUR_DETAILS_FAILURE = 'GET_NEIGHBOUR_DETAILS_FAILURE';

export const LOAD_NEIGHBOUR_DETAILS = 'LOAD_NEIGHBOUR_DETAILS';
export const LOAD_NEIGHBOUR_DETAILS_SUCCESS = 'LOAD_NEIGHBOUR_DETAILS_SUCCESS';
export const LOAD_NEIGHBOUR_DETAILS_FAILURE = 'LOAD_NEIGHBOUR_DETAILS_FAILURE';

export const GET_UPDATE_EMPLOYEE_INFO = 'GET_UPDATE_EMPLOYEE_INFO';
export const GET_UPDATE_EMPLOYEE_INFO_SUCCESS = 'GET_UPDATE_EMPLOYEE_INFO_SUCCESS';
export const GET_UPDATE_EMPLOYEE_INFO_FAILURE = 'GET_UPDATE_EMPLOYEE_INFO_FAILURE';

export function getEmployeesInfo(company, model, limit, offset, states, customFilters, sortByValue, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["registration_status","in",${JSON.stringify(states)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["work_email","name","work_phone","registration_status","employee_id_seq","department_id"]&limit=${limit}&offset=${offset}`;

  if (sortFieldValue && sortFieldValue.length > 0) {
    payload = `${payload}&order=${sortFieldValue}`;
  }
  if (sortByValue && sortByValue.length > 0) {
    payload = `${payload} ${sortByValue}`;
  }

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_EMPLOYEES_INFO, GET_EMPLOYEES_INFO_SUCCESS, GET_EMPLOYEES_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeesCount(company, model, states, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (states && states.length > 0) {
    payload = `${payload},["registration_status","in",${JSON.stringify(states)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_EMPLOYEES_COUNT, GET_EMPLOYEES_COUNT_SUCCESS, GET_EMPLOYEES_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getCategoryGroupsInfo(company, model) {
  const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["category_id"]&groupby=["category_id"]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_CATEGORIES_GROUP_INFO, GET_CATEGORIES_GROUP_INFO_SUCCESS, GET_CATEGORIES_GROUP_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeDetails(id, modelName) {
  return {
    [CALL_API]: {
      endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
      types: [GET_EMPLOYEE_DETAILS, GET_EMPLOYEE_DETAILS_SUCCESS, GET_EMPLOYEE_DETAILS_FAILURE],
      method: 'GET',
      id,
    },
  };
}

export function getNeighbourhoodsInfo(values, modelName) {
  let payload = `domain=[["id","in",[${values}]]]`;
  payload = `${payload}&model=${modelName}&fields=["path_name","space_name"]`;
  payload = `${payload}&limit=50&offset=0&order=sort_sequence ASC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_NEIGHBOUR_DETAILS, GET_NEIGHBOUR_DETAILS_SUCCESS, GET_NEIGHBOUR_DETAILS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function loadNeighbourhoodsInfo(company, model, sortBy, sortField) {
  let payload = `domain=[["company_id","in",[${company}]],["asset_category_id","ilike","Neighbourhood"]`;
  payload = `${payload}]&model=${model}&fields=["path_name","space_name"]&limit=50&offset=0&order=id ASC`;

  if (sortField && sortField.length > 0) {
    payload = `${payload}&order=${sortField}`;
  }
  if (sortBy && sortBy.length > 0) {
    payload = `${payload} ${sortBy}`;
  }
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [LOAD_NEIGHBOUR_DETAILS, LOAD_NEIGHBOUR_DETAILS_SUCCESS, LOAD_NEIGHBOUR_DETAILS_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateEmployeeDataInfo(id, result, modelName) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${modelName}`,
      types: [GET_UPDATE_EMPLOYEE_INFO, GET_UPDATE_EMPLOYEE_INFO_SUCCESS, GET_UPDATE_EMPLOYEE_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}
