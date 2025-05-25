/* eslint-disable max-len */

import { CALL_API } from '../../middleware/api';

import AuthService from '../util/authService';

export const GET_BOOKING_LIST = 'GET_BOOKING_LIST';
export const GET_BOOKING_LIST_SUCCESS = 'GET_BOOKING_LIST_SUCCESS';
export const GET_BOOKING_LIST_FAILURE = 'GET_BOOKING_LIST_FAILURE';

export const GET_WORK_STATIONS_DATA = 'GET_WORK_STATIONS';
export const GET_WORK_STATIONS_DATA_SUCCESS = 'GET_WORK_STATIONS_SUCCESS';
export const GET_WORK_STATIONS_DATA_FAILURE = 'GET_WORK_STATIONS_FAILURE';

export const GET_SHIFTS_DATA = 'GET_SHIFTS';
export const GET_SHIFTS_DATA_SUCCESS = 'GET_SHIFTS_SUCCESS';
export const GET_SHIFTS_DATA_FAILURE = 'GET_SHIFTS_FAILURE';

export const GET_FLOOR_VIEW = 'GET_FLOOR_VIEW';
export const GET_FLOOR_VIEW_SUCCESS = 'GET_FLOOR_VIEW_SUCCESS';
export const GET_FLOOR_VIEW_FAILURE = 'GET_FLOOR_VIEW_FAILURE';

export const GET_IMPORTANT_CONTACTS = 'GET_IMP_CONTACTS';
export const SET_BOOKING_DATA = 'SET_BOOKING_INFO';
export const GET_WORK_STATIONS = 'GET_WORK_SPACES';

export const SAVE_BOOKING = 'SAVE_BOOKING_DATA';
export const SAVE_BOOKING_SUCCESS = 'SAVE_BOOKING_DATA_SUCCESS';
export const SAVE_BOOKING_FALURE = 'SAVE_BOOKING_DATA_FALURE';

export const SAVE_GROUP_BOOKING = 'SAVE_GROUP_BOOKING';
export const SAVE_GROUP_BOOKING_SUCCESS = 'SAVE_GROUP_BOOKING_SUCCESS';
export const SAVE_GROUP_BOOKING_FAILURE = 'SAVE_GROUP_BOOKING_FAILURE';
export const RESET_BOOKING = 'RESET_BOOKING';

export const GET_ALL_EMPLOYEE_LIST = 'GET_ALL_EMPLOYEE_LIST';
export const GET_ALL_EMPLOYEE_LIST_SUCCESS = 'GET_ALL_EMPLOYEE_LIST_SUCCESS';
export const GET_ALL_EMPLOYEE_LIST_FAILURE = 'GET_ALL_EMPLOYEE_LIST_FAILURE';

export const DELETE_BOOKING = 'DELETE_BOOKING';
export const DELETE_BOOKING_FAILURE = 'DELETE_BOOKING_FAILURE';
export const DELETE_BOOKING_SUCCESS = 'DELETE_BOOKING_SUCCESS';

export const GET_CATEGORIES_OF_WORKSTATIONS = 'GET_CATEGORIES_OF_WORKSTATIONS';
export const GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS = 'GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS';
export const GET_CATEGORIES_OF_WORKSTATIONS_FAILURE = 'GET_CATEGORIES_OF_WORKSTATIONS_FAILURE';

export const GET_AVAILABILITY_OF_WORK_STATION = 'GET_AVAILABILITY_OF_WORK_STATION';
export const GET_AVAILABILITY_OF_WORK_STATION_SUCCESS = 'GET_AVAILABILITY_OF_WORK_STATION_SUCCESS';
export const GET_AVAILABILITY_OF_WORK_STATION_FAILURE = 'GET_AVAILABILITY_OF_WORK_STATION_FAILURE';
export const SET_SPACE_ID = 'SET_SPACE_ID';
export const CLEAR_BOOKING_OBJ = 'CLEAR_BOOKING_OBJ';

export const GET_FLOOR_SPACES = 'GET_FLOOR_SPACES';
export const GET_FLOOR_SPACES_SUCCESS = 'GET_FLOOR_SPACES_SUCCESS';
export const GET_FLOOR_SPACES_FAILURE = 'GET_FLOOR_SPACES_FAILURE';

export const GET_MULTIDAYS_SHIFT_DATA = 'GET_MULTIDAYS_SHIFT_DATA';
export const GET_MULTIDAYS_SHIFT_DATA_SUCCESS = 'GET_MULTIDAYS_SHIFT_DATA_SUCCESS';
export const GET_MULTIDAYS_SHIFT_DATA_FAILURE = 'GET_MULTIDAYS_SHIFT_DATA_FAILURE';

export const GET_MULTIDAYS_AVAILABILITY_OF_SPACES = 'GET_MULTIDAYS_AVAILABILITY_OF_SPACES';
export const GET_MULTIDAYS_AVAILABILITY_OF_SPACES_SUCCESS = 'GET_MULTIDAYS_AVAILABILITY_OF_SPACES_SUCCESS';
export const GET_MULTIDAYS_AVAILABILITY_OF_SPACES_FAILURE = 'GET_MULTIDAYS_AVAILABILITY_OF_SPACES_FAILURE';

export const SAVE_MULTIDAYS_BOOKING = 'SAVE_MULTIDAYS_BOOKING';
export const SAVE_MULTIDAYS_BOOKING_SUCCESS = 'SAVE_MULTIDAYS_BOOKING_SUCCESS';
export const SAVE_MULTIDAYS_BOOKING_FAILURE = 'SAVE_MULTIDAYS_BOOKING_FAILURE';

export const GET_GUEST_LIST = 'GET_GUEST_LIST';
export const GET_GUEST_LIST_SUCCESS = 'GET_GUEST_LIST_SUCCESS';
export const GET_GUEST_LIST_FAILURE = 'GET_GUEST_LIST_FAILURE';

export const SAVE_GUEST = 'SAVE_GUEST';
export const SAVE_GUEST_SUCCESS = 'SAVE_GUEST_SUCCESS';
export const SAVE_GUEST_FAILURE = 'SAVE_GUEST_FAILURE';

export const ADD_GUEST = 'ADD_GUEST';
export const SAVE_HOST = 'SAVE_HOST';

export const SAVE_NEW_GUEST = 'SAVE_NEW_GUEST';
export const RESET_GUEST_DATA = 'RESET_GUEST_DATA';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';

export const CLEAR_MULTIDAYS_AVAILABILITY_OF_SPACES = 'CLEAR_MULTIDAYS_AVAILABILITY_OF_SPACES';

export const CLEAR_MULTIDAYS_SHIFT_INFO = 'CLEAR_MULTIDAYS_SHIFT_INFO';

export const GET_EMPLOYEE_SPACE_VALIDITY = 'GET_EMPLOYEE_SPACE_VALIDITY';
export const GET_EMPLOYEE_SPACE_VALIDITY_SUCCESS = 'GET_EMPLOYEE_SPACE_VALIDITY_SUCCESS';
export const GET_EMPLOYEE_SPACE_VALIDITY_FAILURE = 'GET_EMPLOYEE_SPACE_VALIDITY_FAILURE';

export const UPDATE_GUEST = 'UPDATE_GUEST';
export const UPDATE_GUEST_SUCCESS = 'UPDATE_GUEST_SUCCESS';
export const UPDATE_GUEST_FAILURE = 'UPDATE_GUEST_FAILURE';

export const SAVE_CALENDAR_DATE = 'SAVE_CALENDAR_DATE';
export const SAVE_SET_REFRESH = 'SAVE_SET_REFRESH';
export const SAVE_REMOVED_NODE_WITH_EMPLOYEE = 'SAVE_REMOVED_NODE_WITH_EMPLOYEE';
export const CLEAR_SAVE_DATA_TO_SPACE_VIEW = 'CLEAR_SAVE_DATA_TO_SPACE_VIEW';
export const SAVE_DATA_TO_SPACE_VIEW = 'SAVE_DATA_TO_SPACE_VIEW';

export const CLEAR_CAP_LIMIT_DATA = 'CLEAR_CAP_LIMIT_DATA';
export const SET_MAP_EXPANSION = 'SET_MAP_EXPANSION';
export const SAVE_PARTICIPANTS_LIST = 'SAVE_PARTICIPANTS_LIST';
export const SAVE_GUEST_LIST = 'SAVE_GUEST_LIST';
export const DISABLE_FIELDS = 'DISABLE_FIELDS';
export const SAVE_SELECTED_HOST = 'SAVE_SELECTED_HOST';

const accessToken = AuthService.getAccessToken;

export function saveNewGuest(result) {
  return {
    type: SAVE_NEW_GUEST,
    payload: result,
  };
}

export function saveSelectedHost(result) {
  return {
    type: SAVE_SELECTED_HOST,
    payload: result,
  };
}

export function saveGuestlist(result) {
  return {
    type: SAVE_GUEST_LIST,
    payload: result,
  };
}

export function saveParticipantslist(result) {
  return {
    type: SAVE_PARTICIPANTS_LIST,
    payload: result,
  };
}

export function disableFieldsData(result) {
  return {
    type: DISABLE_FIELDS,
    payload: result,
  };
}

export function saveSetRefresh(result) {
  return {
    type: SAVE_SET_REFRESH,
    payload: result,
  };
}

export function resetGuestData(result) {
  return {
    type: RESET_GUEST_DATA,
    payload: result,
  };
}

export function addGuestInfo(result) {
  return {
    type: ADD_GUEST,
    payload: result,
  };
}

export function clearMultipleDaysSpacesInfo(result) {
  return {
    type: CLEAR_MULTIDAYS_AVAILABILITY_OF_SPACES,
    payload: result,
  };
}
export function clearMultidaysShiftInfo() {
  return {
    type: CLEAR_MULTIDAYS_SHIFT_INFO,
  };
}

export function saveHostInfo(result) {
  return {
    type: SAVE_HOST,
    payload: result,
  };
}
export function getGuestListInfo(employeeId, name) {
  return {
    [CALL_API]: {
      endpoint: `guest/list?employee_id=${employeeId}&name=${name}`,
      types: [GET_GUEST_LIST, GET_GUEST_LIST_SUCCESS, GET_GUEST_LIST_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function saveGuestInfo(employeeId, data) {
  const payload = { employee_id: employeeId, values: data };
  return {
    [CALL_API]: {
      endpoint: 'guest',
      types: [SAVE_GUEST, SAVE_GUEST_SUCCESS, SAVE_GUEST_FAILURE],
      method: 'POST',
      payload,
    },
  };
}

export function updateGuestInfo(guestId, guestInfo, employeeId) {
  const payload = {
    guest_id: `${guestId}`, values: guestInfo, employee_id: `${employeeId}`,
  };
  return {
    [CALL_API]: {
      endpoint: 'guest',
      types: [UPDATE_GUEST, UPDATE_GUEST_SUCCESS, UPDATE_GUEST_FAILURE],
      method: 'PUT',
      payload,
    },
  };
}

export function getBookingList(plannedOut, companyId, employeeId) {
  return {
    [CALL_API]: {
      endpoint: `booking/list/?domain=[["planned_out",">","${plannedOut}"],["company_id","=",${companyId}],["employee_id","=",${employeeId}], ["state","!=","Released"]]`,
      types: [GET_BOOKING_LIST, GET_BOOKING_LIST_SUCCESS, GET_BOOKING_LIST_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getImportantContacts(result) {
  return {
    type: GET_IMPORTANT_CONTACTS,
    payload: result,
  };
}
export function saveCalendarDate(result) {
  return {
    type: SAVE_CALENDAR_DATE,
    payload: result,
  };
}
export function saveErrorMessage(result) {
  return {
    type: SET_ERROR_MESSAGE,
    payload: result,
  };
}

export function setBookingInfo(result) {
  return {
    type: SET_BOOKING_DATA,
    payload: result,
  };
}

export function saveRemovedNodeWithEmployee(result) {
  return {
    type: SAVE_REMOVED_NODE_WITH_EMPLOYEE,
    payload: result,
  };
}

export function saveDataToSpaceView(result) {
  return {
    type: SAVE_DATA_TO_SPACE_VIEW,
    payload: result,
  };
}

export function clearSaveDataToSpaceView() {
  return {
    type: CLEAR_SAVE_DATA_TO_SPACE_VIEW,
  };
}

export function saveBooking(result) {
  return {
    [CALL_API]: {
      endpoint: 'booking',
      types: [SAVE_BOOKING, SAVE_BOOKING_SUCCESS, SAVE_BOOKING_FALURE],
      method: 'POST',
      payload: { values: [result] },
    },
  };
}

export function saveGroupBooking(result) {
  return {
    [CALL_API]: {
      endpoint: 'group_booking',
      types: [SAVE_GROUP_BOOKING, SAVE_GROUP_BOOKING_SUCCESS, SAVE_GROUP_BOOKING_FAILURE],
      method: 'POST',
      payload: { values: result },
    },
  };
}

export function getWorkStationsList(spaceId, fromDate, toDate, categoryId, type, showAll) {
  return {
    [CALL_API]: {
      endpoint: `space/list/availability?space_id=${spaceId}&from_date=${fromDate}&to_date=${toDate}&type=${type}&category_id=${categoryId}&show_all=${showAll}`,
      types: [
        GET_WORK_STATIONS_DATA, GET_WORK_STATIONS_DATA_SUCCESS, GET_WORK_STATIONS_DATA_FAILURE,
      ],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getShiftsList(shiftDate) {
  return {
    [CALL_API]: {
      endpoint: `shift/list/available?start_time=${shiftDate}`,
      types: [GET_SHIFTS_DATA, GET_SHIFTS_DATA_SUCCESS, GET_SHIFTS_DATA_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getMultidaysShiftList(shiftDate) {
  return {
    [CALL_API]: {
      endpoint: `shift/list/available?start_time=${shiftDate}&is_multidays_booking=True`,
      types: [GET_MULTIDAYS_SHIFT_DATA, GET_MULTIDAYS_SHIFT_DATA_SUCCESS, GET_MULTIDAYS_SHIFT_DATA_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getMultidaysAvailabilitySpaces(spaceId, fromDate, toDate, shiftId, categoryId, hostId) {
  return {
    [CALL_API]: {
      endpoint: `space/list/multidays_availability?space_id=${spaceId}&from_date=${fromDate}&to_date=${toDate}&show_all=True&shift_id=${shiftId}&category_id=${categoryId}&host_id=${hostId}`,
      types: [GET_MULTIDAYS_AVAILABILITY_OF_SPACES, GET_MULTIDAYS_AVAILABILITY_OF_SPACES_SUCCESS, GET_MULTIDAYS_AVAILABILITY_OF_SPACES_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getEmployeeList(keyword) {
  const payload = `domain=[["user_id","!=",null],["name","ilike",${JSON.stringify(keyword)}]]&limit=20`;
  return {
    [CALL_API]: {
      endpoint: `employee/list?${payload}`,
      types: [GET_ALL_EMPLOYEE_LIST, GET_ALL_EMPLOYEE_LIST_SUCCESS, GET_ALL_EMPLOYEE_LIST_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function cancelBooking(bookingId) {
  return {
    [CALL_API]: {
      endpoint: `booking?ids=[${bookingId}]&values={"is_cancelled":1}`,
      types: [DELETE_BOOKING, DELETE_BOOKING_SUCCESS, DELETE_BOOKING_FAILURE],
      method: 'PUT',
      payload: accessToken,
    },
  };
}

export function clearDeleteError() {
  return {
    type: 'CLEAR_ERROR',
  };
}

export function resetBookingAction() {
  return {
    type: RESET_BOOKING,
  };
}
export function clearBookingObj() {
  return {
    type: CLEAR_BOOKING_OBJ,
  };
}

export function getFloorSpacesById(spaceId, fromDate, toDate, categoryId) {
  return {
    [CALL_API]: {
      endpoint: `space/list/availability?space_id=${spaceId}&from_date=${fromDate}&to_date=${toDate}&type=3&category_id=${categoryId}&show_all=True`,
      types: [GET_FLOOR_SPACES, GET_FLOOR_SPACES_SUCCESS, GET_FLOOR_SPACES_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getFloorViewInfo(model, companyId) {
  return {
    [CALL_API]: {
      endpoint: `search_read?fields=["id","path_name","file_path","space_name","sequence_asset_hierarchy","latitude","longitude","sort_sequence"]&limit=10&domain=[["company_id","in",[${companyId}]],["asset_category_id","ilike","Floor"]]&model=${model}`,
      types: [GET_FLOOR_VIEW, GET_FLOOR_VIEW_SUCCESS, GET_FLOOR_VIEW_FAILURE],
      method: 'GET',
      payload: accessToken,
    },
  };
}

export function getWorkStationCategories() {
  return {
    [CALL_API]: {
      endpoint: 'space_category/list/bookable',
      types: [GET_CATEGORIES_OF_WORKSTATIONS,
        GET_CATEGORIES_OF_WORKSTATIONS_SUCCESS,
        GET_CATEGORIES_OF_WORKSTATIONS_FAILURE,
      ],
      method: 'GET',
    },
  };
}

export function checkAvailabilityOfWorkStation(availableObj) {
  return {
    [CALL_API]: {
      endpoint: `space/list/availability?from_date=${availableObj.from_date}&to_date=${availableObj.to_date}&shift_id=${availableObj.shift_id}&space_id=${availableObj.space_id}&category_id=${availableObj.category_id}&type=3`,
      types: [GET_AVAILABILITY_OF_WORK_STATION,
        GET_AVAILABILITY_OF_WORK_STATION_SUCCESS,
        GET_AVAILABILITY_OF_WORK_STATION_FAILURE,
      ],
      method: 'GET',
    },
  };
}

export function setSpaceId(spaceid) {
  return {
    type: SET_SPACE_ID,
    payload: spaceid,
  };
}

export function saveMultidaysBooking(data) {
  return {
    [CALL_API]: {
      endpoint: 'group_booking',
      types: [SAVE_MULTIDAYS_BOOKING, SAVE_MULTIDAYS_BOOKING_SUCCESS, SAVE_MULTIDAYS_BOOKING_FAILURE],
      method: 'POST',
      payload: { values: data },
    },
  };
}

export function getSpacesCapBooking(data) {
  return {
    [CALL_API]: {
      endpoint: 'booking/validate',
      types: [GET_EMPLOYEE_SPACE_VALIDITY, GET_EMPLOYEE_SPACE_VALIDITY_SUCCESS, GET_EMPLOYEE_SPACE_VALIDITY_FAILURE],
      method: 'POST',
      payload: { values: data },
    },
  };
}
export function clearCapLimitObj() {
  return {
    type: CLEAR_CAP_LIMIT_DATA,
  };
}
export function setMapExpansion(result) {
  return {
    type: SET_MAP_EXPANSION,
    payload: result,
  };
}
