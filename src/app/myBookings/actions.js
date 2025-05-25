import { CALL_API } from '../../middleware/api';
import AuthService from '../util/authService';

export const GET_BOOKINGS = 'GET_BOOKINGS';
export const GET_BOOKINGS_SUCCESS = 'GET_BOOKINGS_SUCCESS';
export const GET_BOOKINGS_FAILURE = 'GET_BOOKINGS_FAILURE';
export const SAVE_BOOKINGLAYOUT_VIEW = 'SAVE_BOOKINGLAYOUT_VIEW';

const accessToken = AuthService.getAccessToken;

export const getBookings = (plannedOut, companyId, employeeId) => ({
  [CALL_API]: {
    endpoint: `booking/list/?domain=[["planned_out",">","${plannedOut}"],["company_id","=",${companyId}],["employee_id","=",${employeeId}]]`,
    types: [GET_BOOKINGS, GET_BOOKINGS_SUCCESS, GET_BOOKINGS_FAILURE],
    method: 'GET',
    payload: accessToken,
  },
});

export function saveBookingsLayoutView(result) {
  return {
    type: SAVE_BOOKINGLAYOUT_VIEW,
    payload: result,
  };
}

export const getBookingsWithinDuration = (fromPlannedOut, toPlannedOut, companyId, employeeId) => ({
  [CALL_API]: {
    endpoint: `booking/list/?domain=[["planned_out",">","${fromPlannedOut}"],["planned_out","<","${toPlannedOut}"],["company_id","=",${companyId}],["employee_id","=",${employeeId}]]`,
    types: [GET_BOOKINGS, GET_BOOKINGS_SUCCESS, GET_BOOKINGS_FAILURE],
    method: 'GET',
    payload: accessToken,
  },
});
