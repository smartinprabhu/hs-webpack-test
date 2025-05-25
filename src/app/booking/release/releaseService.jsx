import { saveRelease } from './actions';

function saveReleaseData(spaceId, bookingId) {
  return (dispatch) => {
    dispatch(saveRelease(spaceId, bookingId));
  };
}

export default saveReleaseData;
