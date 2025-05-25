import {
  GET_ALL_EMPLOYEE_LIST,
  GET_ALL_EMPLOYEE_LIST_SUCCESS,
  GET_ALL_EMPLOYEE_LIST_FAILURE,
  GET_ALL_EMPLOYEE_COUNT,
  GET_ALL_EMPLOYEE_COUNT_SUCCESS,
  GET_ALL_EMPLOYEE_COUNT_FAILURE,
  GET_EMPLOYEE_DETAILS,
  GET_EMPLOYEE_DETAILS_FAILURE,
  GET_EMPLOYEE_DETAILS_SUCCESS,
  GET_REGISTRATION_STATUS_FOR_EMPLOYEES,
  GET_REGISTRATION_STATUS_FOR_EMPLOYEES_FAILURE,
  GET_REGISTRATION_STATUS_FOR_EMPLOYEES_SUCCESS,
  GET_NEIGHBOURHOOD_BY_SPACE,
  GET_NEIGHBOURHOOD_BY_SPACE_SUCCESS,
  GET_NEIGHBOURHOOD_BY_SPACE_FAILURE,
  GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE,
  GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_SUCCESS,
  GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_FAILURE,
} from './actions';

const initialState = {
  siteFilters: {},
  employees: {},
  employeeCount: null,
  allowedNeighbourhood: {},
  allowedNotInNeighbourhood: {},
  alarmsListInfo: {},
  alarmsCount: null,
  alarmsCountErr: null,
  alarmsCountLoading: false,
  alarmUpdateInfo: {},
  alarmsNotificationInfo: {},
  alarmsCheckListInfo: {},
  alarmsChecklistCount: null,
  alarmsChecklistCountErr: null,
  alarmsGroups: {},
  alarmsChecklistCountLoading: false,
  alarmsPriorityGroups: {},
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case GET_ALL_EMPLOYEE_LIST:
      return {
        ...state,
        employees: (state.employees, { loading: true, data: null, err: null }),
      };
    case GET_ALL_EMPLOYEE_LIST_SUCCESS:
      return {
        ...state,
        employees: (state.employees, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_ALL_EMPLOYEE_LIST_FAILURE:
      return {
        ...state,
        employees: (state.employees, { loading: false, err: action.error.data, data: null }),
      };
    case GET_ALL_EMPLOYEE_COUNT:
      return {
        ...state,
      };
    case GET_ALL_EMPLOYEE_COUNT_SUCCESS:
      return {
        ...state,
        employeeCount: (state.employeeCount, action.payload.data),
      };
    case GET_ALL_EMPLOYEE_COUNT_FAILURE:
      return {
        ...state,
        employeeCount: (state.employeeCount, { loading: false, err: action.error.data, data: null }),
      };
    case GET_EMPLOYEE_DETAILS:
      return {
        ...state,
        employeeDetails: (state.employeeDetails, { loading: true, data: null, err: null }),
      };
    case GET_EMPLOYEE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeDetails: (state.employeeDetails, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_EMPLOYEE_DETAILS_FAILURE:
      return {
        ...state,
        employeeDetails: (state.employeeDetails, { loading: false, err: action.error.data, data: null }),
      };
    case GET_REGISTRATION_STATUS_FOR_EMPLOYEES:
      return {
        ...state,
        statusRes: (state.statusRes, { loading: true, data: null, err: null }),
      };
    case GET_REGISTRATION_STATUS_FOR_EMPLOYEES_SUCCESS:
      return {
        ...state,
        statusRes: (state.statusRes, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_REGISTRATION_STATUS_FOR_EMPLOYEES_FAILURE:
      return {
        ...state,
        statusRes: (state.statusRes, { loading: false, err: action.error.data, data: null }),
      };
    case GET_NEIGHBOURHOOD_BY_SPACE:
      return {
        ...state,
        allowedNeighbourhood: (state.allowedNeighbourhood, { loading: true, data: null, err: null }),
      };
    case GET_NEIGHBOURHOOD_BY_SPACE_SUCCESS:
      return {
        ...state,
        allowedNeighbourhood: (state.allowedNeighbourhood, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_NEIGHBOURHOOD_BY_SPACE_FAILURE:
      return {
        ...state,
        allowedNeighbourhood: (state.allowedNeighbourhood, { loading: false, err: action.error.data, data: null }),
      };
    case GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE:
      return {
        ...state,
        allowedNotInNeighbourhood: (state.allowedNotInNeighbourhood, { loading: true, data: null, err: null }),
      };
    case GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_SUCCESS:
      return {
        ...state,
        allowedNotInNeighbourhood: (state.allowedNotInNeighbourhood, { loading: false, data: action.payload.data, err: null }),
      };
    case GET_NOT_IN_NEIGHBOURHOOD_BY_SPACE_FAILURE:
      return {
        ...state,
        allowedNotInNeighbourhood: (state.allowedNotInNeighbourhood, { loading: false, err: action.error.data, data: null }),
      };
    case 'SITE_FILTER':
      return {
        ...state,
        siteFilters: (state.siteFilters, action.payload),
      };
    case 'GET_ALARMS_INFO':
      return {
        ...state,
        alarmsListInfo: (state.alarmsListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARMS_INFO_SUCCESS':
      return {
        ...state,
        alarmsListInfo: (state.alarmsListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARMS_INFO_FAILURE':
      return {
        ...state,
        alarmsListInfo: (state.alarmsListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALARMS_COUNT':
      return {
        ...state,
        alarmsCountLoading: true,
      };
    case 'GET_ALARMS_COUNT_SUCCESS':
      return {
        ...state,
        alarmsCount: (state.alarmsCount, action.payload),
        alarmsCountLoading: false,
      };
    case 'GET_ALARMS_COUNT_FAILURE':
      return {
        ...state,
        alarmsCount: (state.alarmsCount, false),
        alarmsCountErr: (state.alarmsCountErr, action.error),
        alarmsCountLoading: false,
      };
    case 'RESET_ALARM_INFO':
      return {
        ...state,
        alarmsCount: (state.alarmsCount, false),
        alarmsCountErr: (state.alarmsCountErr, false),
        alarmsCountLoading: false,
        alarmsListInfo: (state.alarmsListInfo, { loading: false, err: null, data: null }),
      };
    case 'UPDATE_ALARM_INFO':
      return {
        ...state,
        alarmUpdateInfo: (state.alarmUpdateInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_ALARM_INFO_SUCCESS':
      return {
        ...state,
        alarmUpdateInfo: (state.alarmUpdateInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_ALARM_INFO_FAILURE':
      return {
        ...state,
        alarmUpdateInfo: (state.alarmUpdateInfo, { loading: false, err: action.error, data: null }),
      };
    case 'RESET_ALARM_UPDATE_INFO':
      return {
        ...state,
        alarmUpdateInfo: (state.alarmUpdateInfo, { loading: false, err: null, data: null }),
      };
    case 'GET_ALARMS_NOTIFICATIONS_INFO':
      return {
        ...state,
        alarmsNotificationInfo: (state.alarmsNotificationInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARMS_NOTIFICATIONS_INFO_SUCCESS':
      return {
        ...state,
        alarmsNotificationInfo: (state.alarmsNotificationInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARMS_NOTIFICATIONS_INFO_FAILURE':
      return {
        ...state,
        alarmsNotificationInfo: (state.alarmsNotificationInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_ALARMS_INFO':
      return {
        ...state,
        alarmsCheckListInfo: (state.alarmsCheckListInfo, { loading: true, data: null, err: null }),
      };
    case 'GET_CHECKLIST_ALARMS_INFO_SUCCESS':
      return {
        ...state,
        alarmsCheckListInfo: (state.alarmsCheckListInfo, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_CHECKLIST_ALARMS_INFO_FAILURE':
      return {
        ...state,
        alarmsCheckListInfo: (state.alarmsCheckListInfo, { loading: false, err: action.error, data: null }),
      };
    case 'GET_CHECKLIST_ALARMS_COUNT':
      return {
        ...state,
        alarmsChecklistCount: (state.alarmsChecklistCount, false),
        alarmsChecklistCountErr: (state.alarmsChecklistCountErr, false),
        alarmsChecklistCountLoading: true,
      };
    case 'GET_CHECKLIST_ALARMS_COUNT_SUCCESS':
      return {
        ...state,
        alarmsChecklistCount: (state.alarmsChecklistCount, action.payload),
        alarmsChecklistCountErr: (state.alarmsChecklistCountErr, false),
        alarmsChecklistCountLoading: false,
      };
    case 'GET_CHECKLIST_ALARMS_COUNT_FAILURE':
      return {
        ...state,
        alarmsChecklistCount: (state.alarmsChecklistCount, false),
        alarmsChecklistCountErr: (state.alarmsChecklistCountErr, action.error),
        alarmsChecklistCountLoading: false,
      };
    case 'GET_ALARMS_GROUPS_COUNT':
      return {
        ...state,
        alarmsGroups: (state.alarmsGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARMS_GROUPS_COUNT_SUCCESS':
      return {
        ...state,
        alarmsGroups: (state.alarmsGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARMS_GROUPS_COUNT_FAILURE':
      return {
        ...state,
        alarmsGroups: (state.alarmsGroups, { loading: false, err: action.error, data: null }),
      };
    case 'GET_ALARMS_PRIORITY_GROUPS_COUNT':
      return {
        ...state,
        alarmsPriorityGroups: (state.alarmsPriorityGroups, { loading: true, data: null, err: null }),
      };
    case 'GET_ALARMS_PRIORITY_GROUPS_COUNT_SUCCESS':
      return {
        ...state,
        alarmsPriorityGroups: (state.alarmsPriorityGroups, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_ALARMS_PRIORITY_GROUPS_COUNT_FAILURE':
      return {
        ...state,
        alarmsPriorityGroups: (state.alarmsPriorityGroups, { loading: false, err: action.error, data: null }),
      };
    default:
      return state;
  }
}

export default reducer;
