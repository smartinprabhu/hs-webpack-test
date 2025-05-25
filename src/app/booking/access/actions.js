import { CALL_API } from '../../../middleware/api';

export const SAVE_ACCESS = 'SAVE_ACCESS_DATA';
export const SAVE_ACCESS_SUCCESS = 'SAVE_ACCESS_DATA_SUCCESS';
export const SAVE_ACCESS_FALURE = 'SAVE_ACCESS_DATA_FALURE';

export const GET_BOOKING_LIST = 'GET_BOOKING_LIST';
export const GET_BOOKING_LIST_SUCCESS = 'GET_BOOKING_LIST_SUCCESS';
export const GET_BOOKING_LIST_FAILURE = 'GET_BOOKING_LIST_FAILURE';

export function saveAccess(siteId, shiftId, employeeId) {
  return {
    [CALL_API]: {
      endpoint: `access/check?site_id=${siteId}&shift_id=${shiftId}&employee_id=${employeeId}`,
      types: [SAVE_ACCESS, SAVE_ACCESS_SUCCESS, SAVE_ACCESS_FALURE],
      method: 'PUT',
    },
  };
}

export function getBookingList(uuid) {
  return {
    [CALL_API]: {
      endpoint: `booking/uuid/show?uuid=${uuid}`,
      types: [
        GET_BOOKING_LIST,
        GET_BOOKING_LIST_SUCCESS,
        GET_BOOKING_LIST_FAILURE,
      ],
      method: 'GET',
    },
  };
}
