import { getUtcDate } from '../shared/dateTimeConvertor';
import { getBookings, getBookingsWithinDuration, saveBookingsLayoutView } from './actions';

function getBookingsList(companyId, employeeId, outTime) {
  const plannedOut = getUtcDate(new Date(), 'yyyy-MM-DD HH:mm');
  return (dispatch) => {
    dispatch(getBookings(outTime || plannedOut, companyId, employeeId));
  };
}

export function getScheduledBookingsList(companyId, employeeId, fromOutTime, toOutTime) {
  return (dispatch) => {
    dispatch(getBookingsWithinDuration(fromOutTime, toOutTime, companyId, employeeId));
  };
}

export function setBookingsLayoutView(data) {
  return (dispatch) => {
    dispatch(saveBookingsLayoutView(data));
  };
}

export default getBookingsList;
