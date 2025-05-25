import { saveAccess } from './actions';

function saveAccessData(siteId, shiftId, employeeId) {
  return (dispatch) => {
    dispatch(saveAccess(siteId, shiftId, employeeId));
  };
}

export default saveAccessData;
