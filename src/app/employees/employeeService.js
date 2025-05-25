import {
  getEmployeesInfo, getEmployeesCount, getCategoryGroupsInfo, getAllEmployees,
  getEmployeeDetails, getNeighbourhoodsInfo, updateEmployeeDataInfo,
  loadNeighbourhoodsInfo, deleteEmployee, resetDeleteEmployeeInfo,
} from './actions';

export const EMPLOYEE_FILTERS = 'EMPLOYEE_FILTERS';
export const RESET_EMPLOYEE_UPDATE = 'RESET_EMPLOYEE_UPDATE';

export function getEmployeeList(
  company,
  model,
  limit,
  offset,
  states,
  customFilters,
  sortByValue,
  sortFieldValue,
) {
  return (dispatch) => {
    dispatch(getEmployeesInfo(
      company,
      model,
      limit,
      offset,
      states,
      customFilters,
      sortByValue,
      sortFieldValue,
    ));
  };
}

export function getAllEmployee(
  company,
  model,
  limit,
  offset,
  states,
  customFilters,
  sortByValue,
  sortFieldValue,
) {
  return (dispatch) => {
    dispatch(getAllEmployees(
      company,
      model,
      limit,
      offset,
      states,
      customFilters,
      sortByValue,
      sortFieldValue,
    ));
  };
}

export function getEmployeeCount(company, model, states, customFilters) {
  return (dispatch) => {
    dispatch(getEmployeesCount(company, model, states, customFilters));
  };
}

export function getCategoryGroups(company, model) {
  return (dispatch) => {
    dispatch(getCategoryGroupsInfo(company, model));
  };
}

export function getEmployeeDetail(id, model) {
  return (dispatch) => {
    dispatch(getEmployeeDetails(id, model));
  };
}

export function updateEmployeeData(id, result, model) {
  return (dispatch) => {
    dispatch(updateEmployeeDataInfo(id, result, model));
  };
}

export function getEmployeeFilters(statusValues, customFiltersList) {
  const result = { statuses: statusValues, customFilters: customFiltersList };
  return {
    type: EMPLOYEE_FILTERS,
    payload: result,
  };
}

export function resetEmployeeData(result) {
  return {
    type: RESET_EMPLOYEE_UPDATE,
    payload: result,
  };
}

export function getNeighbourhoods(ids, model) {
  return (dispatch) => {
    dispatch(getNeighbourhoodsInfo(ids, model));
  };
}

export function loadNeighbourhoods(id, model, sortBy, sortField) {
  return (dispatch) => {
    dispatch(loadNeighbourhoodsInfo(id, model, sortBy, sortField));
  };
}

export function deleteEmployeeData(id, modelName) {
  return (dispatch) => {
    dispatch(deleteEmployee(id, modelName));
  };
}

export function resetDeleteEmployeeData() {
  return (dispatch) => {
    dispatch(resetDeleteEmployeeInfo());
  };
}
