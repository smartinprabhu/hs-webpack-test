import moment from 'moment-timezone';
import { getBookingList } from './actions';

export function getBookingListFromUuid(uuid) {
  return (dispatch) => {
    dispatch(getBookingList(uuid));
  };
}
export const GetUtcDate = ({ date, format }) => moment.utc(date).format(format);
