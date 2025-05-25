import {
  CALL_API,
} from '../../middleware/api';
import alarmsColumns from './data/customData.json';

export const GET_ALL_EMPLOYEE_LIST = 'GET_ALL_EMPLOYEE_LIST';
export const GET_ALL_EMPLOYEE_LIST_SUCCESS = 'GET_ALL_EMPLOYEE_LIST_SUCCESS';
export const GET_ALL_EMPLOYEE_LIST_FAILURE = 'GET_ALL_EMPLOYEE_LIST_FAILURE';

export const GET_ALL_EMPLOYEE_COUNT = 'GET_ALL_EMPLOYEE_COUNT';
export const GET_ALL_EMPLOYEE_COUNT_SUCCESS = 'GET_ALL_EMPLOYEE_COUNT_SUCCESS';
export const GET_ALL_EMPLOYEE_COUNT_FAILURE = 'GET_ALL_EMPLOYEE_COUNT_FAILURE';

export const GET_EMPLOYEE_DETAILS = 'GET_EMPLOYEE_DETAILS';
export const GET_EMPLOYEE_DETAILS_SUCCESS = 'GET_EMPLOYEE_DETAILS_SUCCESS';
export const GET_EMPLOYEE_DETAILS_FAILURE = 'GET_EMPLOYEE_DETAILS_FAILURE';

export const GET_REGISTRATION_STATUS_FOR_EMPLOYEES = 'GET_REGISTRATION_STATUS_FOR_EMPLOYEES';
export const GET_REGISTRATION_STATUS_FOR_EMPLOYEES_SUCCESS = 'GET_REGISTRATION_STATUS_FOR_EMPLOYEES_SUCCESS';
export const GET_REGISTRATION_STATUS_FOR_EMPLOYEES_FAILURE = 'GET_REGISTRATION_STATUS_FOR_EMPLOYEES_FAILURE';

export const GET_NEIGHBOURHOOD_BY_SPACE = 'GET_NEIGHBOURHOOD_BY_SPACE';
export const GET_NEIGHBOURHOOD_BY_SPACE_SUCCESS = 'GET_NEIGHBOURHOOD_BY_SPACE_SUCCESS';
export const GET_NEIGHBOURHOOD_BY_SPACE_FAILURE = 'GET_NEIGHBOURHOOD_BY_SPACE_FAILURE';

export const GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE = 'GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE';
export const GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_SUCCESS = 'GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_SUCCESS';
export const GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_FAILURE = 'GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_FAILURE';

export const GET_ALARMS_INFO = 'GET_ALARMS_INFO';
export const GET_ALARMS_INFO_SUCCESS = 'GET_ALARMS_INFO_SUCCESS';
export const GET_ALARMS_INFO_FAILURE = 'GET_ALARMS_INFO_FAILURE';

export const GET_ALARMS_COUNT = 'GET_ALARMS_COUNT';
export const GET_ALARMS_COUNT_SUCCESS = 'GET_ALARMS_COUNT_SUCCESS';
export const GET_ALARMS_COUNT_FAILURE = 'GET_ALARMS_COUNT_FAILURE';

export const UPDATE_ALARM_INFO = 'UPDATE_ALARM_INFO';
export const UPDATE_ALARM_INFO_SUCCESS = 'UPDATE_ALARM_INFO_SUCCESS';
export const UPDATE_ALARM_INFO_FAILURE = 'UPDATE_ALARM_INFO_FAILURE';

export const GET_ALARMS_NOTIFICATIONS_INFO = 'GET_ALARMS_NOTIFICATIONS_INFO';
export const GET_ALARMS_NOTIFICATIONS_INFO_SUCCESS = 'GET_ALARMS_NOTIFICATIONS_INFO_SUCCESS';
export const GET_ALARMS_NOTIFICATIONS_INFO_FAILURE = 'GET_ALARMS_NOTIFICATIONS_INFO_FAILURE';

export const GET_CHECKLIST_ALARMS_INFO = 'GET_CHECKLIST_ALARMS_INFO';
export const GET_CHECKLIST_ALARMS_INFO_SUCCESS = 'GET_CHECKLIST_ALARMS_INFO_SUCCESS';
export const GET_CHECKLIST_ALARMS_INFO_FAILURE = 'GET_CHECKLIST_ALARMS_INFO_FAILURE';

export const GET_CHECKLIST_ALARMS_COUNT = 'GET_CHECKLIST_ALARMS_COUNT';
export const GET_CHECKLIST_ALARMS_COUNT_SUCCESS = 'GET_CHECKLIST_ALARMS_COUNT_SUCCESS';
export const GET_CHECKLIST_ALARMS_COUNT_FAILURE = 'GET_CHECKLIST_ALARMS_COUNT_FAILURE';

export const GET_ALARMS_GROUPS_COUNT = 'GET_ALARMS_GROUPS_COUNT';
export const GET_ALARMS_GROUPS_COUNT_SUCCESS = 'GET_ALARMS_GROUPS_COUNT_SUCCESS';
export const GET_ALARMS_GROUPS_COUNT_FAILURE = 'GET_ALARMS_GROUPS_COUNT_FAILURE';

export const GET_ALARMS_PRIORITY_GROUPS_COUNT = 'GET_ALARMS_PRIORITY_GROUPS_COUNT';
export const GET_ALARMS_PRIORITY_GROUPS_COUNT_SUCCESS = 'GET_ALARMS_PRIORITY_GROUPS_COUNT_SUCCESS';
export const GET_ALARMS_PRIORITY_GROUPS_COUNT_FAILURE = 'GET_ALARMS_PRIORITY_GROUPS_COUNT_FAILURE';

// eslint-disable-next-line no-unused-vars
export function getEmployeeList(companyId, model, limit, offset, status, sortFieldValue) {
  let payload = `domain=[["company_id","in",[${companyId}]]`;
  if (status && status.length > 0) {
    payload = `${payload},["registration_status","in",${JSON.stringify(status)}]`;
  }
  // eslint-disable-next-line max-len
  payload = `${payload}]&model=${model}&fields=["name", "work_phone", "work_email", "company_id", "department_id", "job_id", "parent_id", "coach_id", "registration_status"]&limit=${limit}&offset=${offset}&order=create_date DESC`;
  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALL_EMPLOYEE_LIST, GET_ALL_EMPLOYEE_LIST_SUCCESS, GET_ALL_EMPLOYEE_LIST_SUCCESS],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeCount(companyId, model, status) {
  let payload = `domain=[["company_id","in",[${companyId}]]`;
  if (status && status.length > 0) {
    payload = `${payload},["registration_status","in",${JSON.stringify(status)}]`;
  }
  payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;
  return {
    [CALL_API]: {
      endpoint: `read_group?${payload}`,
      types: [GET_ALL_EMPLOYEE_COUNT, GET_ALL_EMPLOYEE_COUNT_SUCCESS, GET_ALL_EMPLOYEE_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getEmployeeDetailsById(employeeId) {
  return {
    [CALL_API]: {
      endpoint: `read?model=hr.employee&ids=[${employeeId}]&fields=[]`,
      types: [GET_EMPLOYEE_DETAILS, GET_EMPLOYEE_DETAILS_SUCCESS, GET_EMPLOYEE_DETAILS_FAILURE],
      method: 'GET',
    },
  };
}

export function getRegistrationStatusForEmp(company, model) {
  return {
    [CALL_API]: {
      endpoint: `read_group?domain=[["company_id","in",[${company}]]]&model=${model}&fields=["registration_status"]&groupby=["registration_status"]`,
      types: [GET_REGISTRATION_STATUS_FOR_EMPLOYEES, GET_REGISTRATION_STATUS_FOR_EMPLOYEES_SUCCESS, GET_REGISTRATION_STATUS_FOR_EMPLOYEES_FAILURE],
      method: 'GET',
    },
  };
}

export function getAllowedNeighbourhoodBySpace(neighbourhood, model) {
  return {
    [CALL_API]: {
      endpoint: `search_read?domain=[["id","in",[${neighbourhood}]]]&model=${model}&fields=["display_name"]`,
      types: [GET_NEIGHBOURHOOD_BY_SPACE, GET_NEIGHBOURHOOD_BY_SPACE_SUCCESS, GET_NEIGHBOURHOOD_BY_SPACE_FAILURE],
      method: 'GET',
    },
  };
}

export function getNotInAllowedNeighbourhoodBySpace(neighbourhood, model) {
  return {
    [CALL_API]: {
      endpoint: `search_read?domain=[["id","not in",[${neighbourhood}]]]&model=${model}&fields=["display_name"]`,
      types: [GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE, GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_SUCCESS, GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_FAILURE],
      method: 'GET',
    },
  };
}

export function getAlarmsInfo(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters) {
  const fields = alarmsColumns && alarmsColumns.viewFields ? alarmsColumns.viewFields : [];
  let payload = `domain=[["company_id","in",[${company}]],["generated_for","in",[${employeeId}]],["expired","=",false]`;
  if (resModel) {
    payload = `${payload},["model_name","=","${resModel}"]`;
  }
  if (statusValues && statusValues.length > 0) {
    payload = `${payload},["alarm_state","in",${JSON.stringify(statusValues)}]`;
  } else {
    payload = `${payload},["alarm_state","in",["Acknowledged","Active","Resolved"]]`;
  }
  if (priorityValues && priorityValues.length > 0) {
    payload = `${payload},["priority","in",${JSON.stringify(priorityValues)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}`;

  payload = `${payload}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALARMS_INFO, GET_ALARMS_INFO_SUCCESS, GET_ALARMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAlarmsCountInfo(company, employeeId, model, resModel, statusValues, priorityValues, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]],["generated_for","in",[${employeeId}]],["expired","=",false]`;
  if (resModel) {
    payload = `${payload},["model_name","=","${resModel}"]`;
  }
  if (statusValues && statusValues.length > 0) {
    payload = `${payload},["alarm_state","in",${JSON.stringify(statusValues)}]`;
  } else {
    payload = `${payload},["alarm_state","in",["Acknowledged","Active","Resolved"]]`;
  }
  if (priorityValues && priorityValues.length > 0) {
    payload = `${payload},["priority","in",${JSON.stringify(priorityValues)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_ALARMS_COUNT, GET_ALARMS_COUNT_SUCCESS, GET_ALARMS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function updateAlarmInfo(id, model, result) {
  const payload = {
    ids: `[${id}]`, values: result,
  };
  return {
    [CALL_API]: {
      endpoint: `write/${model}`,
      types: [UPDATE_ALARM_INFO, UPDATE_ALARM_INFO_SUCCESS, UPDATE_ALARM_INFO_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getAlarmsNotificationsInfo(company, employeeId, model, limit, offset) {
  const fields = alarmsColumns && alarmsColumns.viewFields ? alarmsColumns.viewFields : [];
  let payload = `domain=[["company_id","in",[${company}]],["generated_for","in",[${employeeId}]],["alarm_state","=","Active"],["expired","=",false]`;
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}`;
  payload = `${payload}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_ALARMS_NOTIFICATIONS_INFO, GET_ALARMS_NOTIFICATIONS_INFO_SUCCESS, GET_ALARMS_NOTIFICATIONS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getChecklistAlarmsInfo(company, employeeId, model, resModel, limit, offset, statusValues, priorityValues, customFilters) {
  const fields = alarmsColumns && alarmsColumns.viewChecklistFields ? alarmsColumns.viewChecklistFields : [];
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (resModel) {
    payload = `${payload},["category_id.name","ilike","Checklist"]`;
  }
  if (statusValues && statusValues.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(statusValues)}]`;
  }
  if (priorityValues && priorityValues.length > 0) {
    payload = `${payload},["priority","in",${JSON.stringify(priorityValues)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&fields=${JSON.stringify(fields)}`;

  payload = `${payload}&limit=${limit}&offset=${offset}&order=create_date DESC`;

  return {
    [CALL_API]: {
      endpoint: `search_read?${payload}`,
      types: [GET_CHECKLIST_ALARMS_INFO, GET_CHECKLIST_ALARMS_INFO_SUCCESS, GET_CHECKLIST_ALARMS_INFO_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getChecklistAlarmsCountInfo(company, employeeId, model, resModel, statusValues, priorityValues, customFilters) {
  let payload = `domain=[["company_id","in",[${company}]]`;
  if (resModel) {
    payload = `${payload},["category_id.name","ilike","Checklist"]`;
  }
  if (statusValues && statusValues.length > 0) {
    payload = `${payload},["state","in",${JSON.stringify(statusValues)}]`;
  }
  if (priorityValues && priorityValues.length > 0) {
    payload = `${payload},["priority","in",${JSON.stringify(priorityValues)}]`;
  }
  if (customFilters && customFilters.length > 0) {
    payload = `${payload},${customFilters}`;
  }
  payload = `${payload}]&model=${model}&count=1`;
  return {
    [CALL_API]: {
      endpoint: `search?${payload}`,
      types: [GET_CHECKLIST_ALARMS_COUNT, GET_CHECKLIST_ALARMS_COUNT_SUCCESS, GET_CHECKLIST_ALARMS_COUNT_FAILURE],
      method: 'GET',
      payload,
    },
  };
}

export function getAlarmsGroupInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `alarm/sites?start_date=${start}&end_date=${end}`,
      types: [GET_ALARMS_GROUPS_COUNT, GET_ALARMS_GROUPS_COUNT_SUCCESS, GET_ALARMS_GROUPS_COUNT_FAILURE],
      method: 'GET',
      start,
    },
  };
}

export function getAlarmsGroupPriorityInfo(start, end) {
  return {
    [CALL_API]: {
      endpoint: `alarm/sites?start_date=${start}&end_date=${end}`,
      types: [GET_ALARMS_PRIORITY_GROUPS_COUNT, GET_ALARMS_PRIORITY_GROUPS_COUNT_SUCCESS, GET_ALARMS_PRIORITY_GROUPS_COUNT_FAILURE],
      method: 'GET',
      start,
    },
  };
}
