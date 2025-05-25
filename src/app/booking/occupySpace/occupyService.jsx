import { occupySpace } from './actions';

function spaceOccupy(bookingId) {
  return (dispatch) => {
    dispatch(occupySpace(bookingId));
  };
}

export default spaceOccupy;
